import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { nekathDatabase } from "./src/data/nekathData.js";
import { PremiumAstroReportEngine } from "./services/premiumAstroReportEngine.js";
// Fallback for nekathDatabase if import fails or is empty
const safeNekathDatabase = nekathDatabase || {};
const require = createRequire(import.meta.url);
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const SunCalc = require('suncalc');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
for (const [key, value] of Object.entries(appEnv)) {
    if (!(key in process.env)) {
        process.env[key] = value;
    }
}
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PRICE_WISHWAYA_PRO = process.env.STRIPE_PRICE_WISHWAYA_PRO || '';
const APP_URL = (process.env.APP_URL || 'http://localhost:3000')
    .replace(/"+$/, '')
    .replace(/\/+$/, '');
const createStripeCheckoutSession = async (customerEmail) => {
    const body = new URLSearchParams();
    body.set('mode', 'payment');
    body.set('line_items[0][price]', STRIPE_PRICE_WISHWAYA_PRO);
    body.set('line_items[0][quantity]', '1');
    body.set('success_url', `${APP_URL}/payment-success`);
    body.set('cancel_url', `${APP_URL}/payment-cancel`);
    if (customerEmail) {
        body.set('customer_email', customerEmail);
    }
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to create Stripe checkout session');
    }
    return data;
};
// Global Error Handlers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    // Keep running if possible, or exit gracefully
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Data Storage
// In Cloud Run (production), use /tmp as it's the only writable path.
// In development, keep runtime files out of src/ so Vite does not hot-reload the app
// whenever subscriptions or VAPID keys change.
const DATA_DIR = process.env.NODE_ENV === 'production'
    ? '/tmp/wishwaya-data'
    : path.join(process.cwd(), 'data');
const LEGACY_DATA_DIR = path.join(process.cwd(), 'src/data');
console.log(`Using DATA_DIR: ${DATA_DIR}`);
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('Created DATA_DIR');
    }
    catch (err) {
        console.error('Failed to create data directory:', err);
    }
}
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const VAPID_KEYS_FILE = path.join(DATA_DIR, 'vapid.json');
const premiumAstroReportEngine = new PremiumAstroReportEngine(DATA_DIR);
const migrateLegacyRuntimeFile = (fileName) => {
    const currentPath = path.join(DATA_DIR, fileName);
    const legacyPath = path.join(LEGACY_DATA_DIR, fileName);
    if (fs.existsSync(currentPath) || !fs.existsSync(legacyPath)) {
        return;
    }
    try {
        fs.copyFileSync(legacyPath, currentPath);
        console.log(`Migrated legacy runtime file: ${fileName}`);
    }
    catch (err) {
        console.error(`Failed to migrate legacy runtime file ${fileName}:`, err);
    }
};
migrateLegacyRuntimeFile('subscriptions.json');
migrateLegacyRuntimeFile('vapid.json');
// Helper to load subscriptions
const getSubscriptions = () => {
    try {
        if (!fs.existsSync(SUBSCRIPTIONS_FILE))
            return [];
        return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
    }
    catch (err) {
        console.error('Error reading subscriptions:', err);
        return [];
    }
};
const writeSubscriptions = (subscriptions) => {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
};
// Helper to save subscriptions
const saveSubscription = (subscription, userId, location, horoscopeProfile) => {
    try {
        const subs = getSubscriptions();
        const existingIndex = subs.findIndex((s) => s.subscription.endpoint === subscription.endpoint);
        // Ensure notifications preferences exist in profile
        if (horoscopeProfile && !horoscopeProfile.notifications) {
            horoscopeProfile.notifications = {
                enabled: true,
                horoscope: true,
                rahuKalaya: true,
                specialNekath: true,
                birthday: true
            };
        }
        const newSub = {
            userId,
            subscription,
            location,
            horoscopeProfile,
            createdAt: new Date().toISOString(),
            disabled: false
        };
        if (existingIndex >= 0) {
            subs[existingIndex] = { ...subs[existingIndex], ...newSub };
        }
        else {
            subs.push(newSub);
        }
        writeSubscriptions(subs);
    }
    catch (err) {
        console.error('Error saving subscription:', err);
    }
};
// Helper to update profile in subscription
const updateSubscriptionProfile = (userId, profile) => {
    try {
        const subs = getSubscriptions();
        let updated = false;
        subs.forEach((s) => {
            if (s.userId === userId) {
                s.horoscopeProfile = { ...s.horoscopeProfile, ...profile };
                updated = true;
            }
        });
        if (updated) {
            writeSubscriptions(subs);
        }
        return subs.filter((s) => s.userId === userId).length;
    }
    catch (err) {
        console.error('Error updating profile:', err);
        return 0;
    }
};
const relinkSubscriptions = (fromUserId, toUserId) => {
    try {
        const subs = getSubscriptions();
        let updated = false;
        subs.forEach((s) => {
            if (s.userId === fromUserId) {
                s.userId = toUserId;
                updated = true;
            }
        });
        if (updated) {
            // De-duplicate by endpoint after relinking so one device keeps one record.
            const deduped = Array.from(new Map(subs.map((sub) => [sub.subscription?.endpoint, sub])).values());
            writeSubscriptions(deduped);
        }
        return updated;
    }
    catch (err) {
        console.error('Error relinking subscriptions:', err);
        return false;
    }
};
// --- Rahu Kalaya Logic ---
const getRahuKalaya = (date, lat, lng) => {
    // Get sunrise/sunset for the location
    const times = SunCalc.getTimes(date, lat, lng);
    const sunrise = times.sunrise;
    const sunset = times.sunset;
    const dayLength = sunset.getTime() - sunrise.getTime();
    const segmentDuration = dayLength / 8;
    // Rahu Kalaya segment index (0-based from sunrise)
    // Mon: 1 (2nd segment), Tue: 5 (6th), Wed: 4 (5th), Thu: 3 (4th), Fri: 2 (3rd), Sat: 0 (1st), Sun: 6 (7th)
    // Wait, user provided specific indices:
    // Mon: 2, Tue: 6, Wed: 5, Thu: 4, Fri: 3, Sat: 1, Sun: 7 (1-based?)
    // Let's map user's 1-based indices to 0-based logic:
    // Mon: 2 -> index 1
    // Tue: 6 -> index 5
    // Wed: 5 -> index 4
    // Thu: 4 -> index 3
    // Fri: 3 -> index 2
    // Sat: 1 -> index 0
    // Sun: 7 -> index 6
    const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ...
    let segmentIndex = 0;
    switch (dayOfWeek) {
        case 1:
            segmentIndex = 1;
            break; // Mon
        case 2:
            segmentIndex = 5;
            break; // Tue
        case 3:
            segmentIndex = 4;
            break; // Wed
        case 4:
            segmentIndex = 3;
            break; // Thu
        case 5:
            segmentIndex = 2;
            break; // Fri
        case 6:
            segmentIndex = 0;
            break; // Sat
        case 0:
            segmentIndex = 6;
            break; // Sun
    }
    const rahuStart = new Date(sunrise.getTime() + (segmentIndex * segmentDuration));
    const rahuEnd = new Date(rahuStart.getTime() + segmentDuration);
    return { start: rahuStart, end: rahuEnd };
};
// --- API Endpoints ---
// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Config Endpoint (Expose API Key to Client)
app.get('/api/config', (req, res) => {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.Wishwaya_App_Key;
    if (!key) {
        console.warn('WARNING: No API Key found in environment variables!');
    }
    res.json({
        configured: Boolean(key)
    });
});
app.get('/api/firebase-config', (req, res) => {
    const firebase = {
        apiKey: process.env.VITE_FIREBASE_API_KEY || '',
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.VITE_FIREBASE_APP_ID || '',
    };
    const configured = Object.values(firebase).every((value) => typeof value === 'string' && value.trim().length > 0);
    res.json({
        configured,
        firebase: configured ? firebase : null,
    });
});
// Gemini API Proxy
// This handles requests from the service worker or client to avoid CORS and hide the key
app.post('/api-proxy/*path', async (req, res) => {
    console.log(`Incoming proxy request: ${req.method} ${req.path}`);
    // Try multiple API keys if one fails
    const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.API_KEY,
        process.env.Wishwaya_App_Key
    ].filter(k => k && k.trim().length > 10 && k !== 'MY_GEMINI_API_KEY' && k !== 'undefined' && k !== 'null')
        .map(k => k.trim());
    if (apiKeys.length === 0) {
        console.error('Proxy Error: No valid API Keys found in environment variables');
        return res.status(500).json({ error: 'API Key not configured on server. Please check your environment variables.' });
    }
    // Extract the path after /api-proxy
    let targetPath = req.path.replace('/api-proxy', '');
    // Ensure targetPath starts with /
    if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
    }
    // If the path doesn't start with /v1 or /v1beta, prepend /v1beta
    if (!targetPath.startsWith('/v1')) {
        targetPath = '/v1beta' + targetPath;
    }
    // Try each key until one works or we run out
    let lastError = null;
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        // Construct the target URL
        const searchParams = new URLSearchParams();
        if (req.query) {
            Object.keys(req.query).forEach(key => {
                if (key !== 'key') {
                    searchParams.set(key, req.query[key]);
                }
            });
        }
        searchParams.set('key', apiKey);
        const finalUrl = `https://generativelanguage.googleapis.com${targetPath}?${searchParams.toString()}`;
        console.log(`Proxying request to: ${finalUrl.split('?')[0]} (Using Key ${i + 1}/${apiKeys.length})`);
        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });
            const text = await response.text();
            // If the key is invalid or quota exceeded, try the next one
            if (!response.ok) {
                const isKeyError = text.includes('API key not valid') || text.includes('INVALID_ARGUMENT');
                const isQuotaError = response.status === 429 || text.includes('quota');
                if ((isKeyError || isQuotaError) && i < apiKeys.length - 1) {
                    console.warn(`Key ${i + 1} failed (${response.status}), trying next key...`);
                    lastError = { status: response.status, text };
                    continue;
                }
                // If it's the last key or not a key/quota error, log details
                console.error(`Gemini API Error (${response.status}) for URL ${finalUrl}:`, text);
            }
            // Forward the status and ensure we always return JSON (never raw HTML)
            res.status(response.status);
            const contentType = response.headers.get('content-type') || '';
            const looksJson = contentType.includes('application/json');
            if (!looksJson) {
                res.set('Content-Type', 'application/json');
                try {
                    const parsed = JSON.parse(text);
                    return res.json(parsed);
                }
                catch {
                    return res.json({
                        error: 'Gemini proxy returned a non-JSON response',
                        status: response.status,
                        body: text,
                    });
                }
            }
            res.set('Content-Type', contentType || 'application/json');
            return res.send(text);
        }
        catch (error) {
            console.error(`Proxy Error with key ${i + 1}:`, error);
            lastError = error;
            if (i < apiKeys.length - 1)
                continue;
            return res.status(500).json({
                error: 'Failed to proxy request to Gemini',
                message: error.message
            });
        }
    }
});
// Global state for VAPID keys
let vapidKeys = null;
// Get Public Key
app.get('/api/push/public-key', (req, res) => {
    if (vapidKeys) {
        res.json({ publicKey: vapidKeys.publicKey });
    }
    else if (fs.existsSync(VAPID_KEYS_FILE)) {
        try {
            vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf-8'));
            res.json({ publicKey: vapidKeys.publicKey });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to read VAPID keys' });
        }
    }
    else {
        res.status(500).json({ error: 'VAPID keys not initialized' });
    }
});
// Subscribe
app.post('/api/push/subscribe', (req, res) => {
    const { subscription, userId, location, horoscopeProfile } = req.body;
    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription' });
    }
    saveSubscription(subscription, userId, location, horoscopeProfile);
    res.status(201).json({ message: 'Subscribed successfully' });
});
// Update Preferences
app.post('/api/push/preferences', (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId || !preferences) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    const updatedCount = updateSubscriptionProfile(userId, { notifications: preferences });
    res.json({
        message: 'Preferences updated successfully',
        updatedCount,
    });
});
app.post('/api/push/link-user', (req, res) => {
    const { fromUserId, toUserId } = req.body;
    if (!fromUserId || !toUserId) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    const updated = relinkSubscriptions(fromUserId, toUserId);
    res.json({ message: updated ? 'Subscriptions linked successfully' : 'No subscriptions needed linking' });
});
// Unsubscribe
app.post('/api/push/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    let subs = getSubscriptions();
    subs = subs.filter((s) => s.subscription.endpoint !== endpoint);
    writeSubscriptions(subs);
    res.json({ message: 'Unsubscribed successfully' });
});
// Send Notification (Internal Use)
app.post('/api/notify/send', async (req, res) => {
    const { userId, title, body, url } = req.body;
    const subs = getSubscriptions().filter((s) => s.userId === userId && !s.disabled);
    if (subs.length === 0) {
        return res.json({
            message: 'No active subscriptions for this user',
            attemptedCount: 0,
            sentCount: 0,
            failedCount: 0,
            removedCount: 0,
        });
    }
    const payload = JSON.stringify({ title, body, url });
    const deliveryResults = await Promise.all(subs.map(async (sub) => {
        try {
            await webpush.sendNotification(sub.subscription, payload);
            return { endpoint: sub.subscription.endpoint, status: 'sent' };
        }
        catch (err) {
            const expired = err?.statusCode === 410 || err?.statusCode === 404;
            console.error('Error sending notification:', err);
            return {
                endpoint: sub.subscription.endpoint,
                status: expired ? 'expired' : 'failed',
                code: err?.statusCode || null,
            };
        }
    }));
    const removedEndpoints = new Set(deliveryResults
        .filter((result) => result.status === 'expired')
        .map((result) => result.endpoint));
    if (removedEndpoints.size > 0) {
        const nextSubs = getSubscriptions().filter((sub) => !removedEndpoints.has(sub.subscription?.endpoint));
        writeSubscriptions(nextSubs);
    }
    const sentCount = deliveryResults.filter((result) => result.status === 'sent').length;
    const failedCount = deliveryResults.filter((result) => result.status === 'failed').length;
    const removedCount = removedEndpoints.size;
    res.json({
        message: `Attempted delivery to ${subs.length} device${subs.length === 1 ? '' : 's'}`,
        attemptedCount: subs.length,
        sentCount,
        failedCount,
        removedCount,
    });
});
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_WISHWAYA_PRO) {
            return res.status(500).json({ error: 'Stripe environment variables are missing' });
        }
        const customerEmail = typeof req.body?.customerEmail === 'string' && req.body.customerEmail.trim()
            ? req.body.customerEmail.trim()
            : null;
        const session = await createStripeCheckoutSession(customerEmail);
        res.status(201).json({
            checkoutUrl: session.url || null,
            sessionId: session.id || null,
        });
    }
    catch (error) {
        console.error('[stripe] create checkout session failed', error);
        res.status(500).json({ error: error?.message || 'Failed to create checkout session' });
    }
});
app.post('/api/astro-reports/payment-success-create', (req, res) => {
    try {
        const { userId, profile } = req.body || {};
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        const result = premiumAstroReportEngine.createBackgroundReportFromProfile(userId, profile || null);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('[astro-report] payment success create failed', error);
        res.status(500).json({ error: error?.message || 'Failed to create report request after payment' });
    }
});
app.post('/api/astro-reports/:reportId/requirements', (req, res) => {
    try {
        const { userId, profile } = req.body || {};
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        const requirements = premiumAstroReportEngine.getRequirements(req.params.reportId, userId, profile || null);
        res.json(requirements);
    }
    catch (error) {
        console.error('[astro-report] requirements failed', error);
        res.status(400).json({ error: error?.message || 'Failed to load requirements' });
    }
});
app.post('/api/astro-reports/:reportId/inputs', (req, res) => {
    try {
        const result = premiumAstroReportEngine.submitInputs(req.params.reportId, req.body);
        res.status(202).json(result);
    }
    catch (error) {
        console.error('[astro-report] input submission failed', error);
        res.status(400).json({ error: error?.message || 'Failed to submit inputs' });
    }
});
app.get('/api/astro-reports', (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        res.json(premiumAstroReportEngine.listReports(userId));
    }
    catch (error) {
        console.error('[astro-report] list reports failed', error);
        res.status(500).json({ error: error?.message || 'Failed to list reports' });
    }
});
app.get('/api/astro-reports/:reportId', (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        res.json(premiumAstroReportEngine.getReport(req.params.reportId, userId));
    }
    catch (error) {
        console.error('[astro-report] get report failed', error);
        res.status(404).json({ error: error?.message || 'Report not found' });
    }
});
app.get('/api/astro-reports/:reportId/palm-image', (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        const filePath = premiumAstroReportEngine.getPalmImageFile(req.params.reportId, userId);
        if (!filePath) {
            return res.status(404).json({ error: 'Palm image not found' });
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error('[astro-report] palm image access failed', error);
        res.status(404).json({ error: error?.message || 'Palm image not found' });
    }
});
app.get('/api/astro-reports/:reportId/pdf', (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send('userId is required');
        }
        const report = premiumAstroReportEngine.getReport(req.params.reportId, userId);
        if (!report.reportJson) {
            return res.status(404).send('Report PDF source is not ready');
        }
        const sections = [
            report.reportJson.coverSection,
            report.reportJson.coreAstroProfile,
            report.reportJson.personalityLifeBlueprint,
            report.reportJson.wealthCareerBusinessReport,
            report.reportJson.loveMarriageRelationshipReport,
            report.reportJson.healthLifestyleGuidance,
            report.reportJson.dashaTimePeriodAnalysis,
            report.reportJson.yogasDoshasPlanetaryInfluences,
            report.reportJson.palmAnalysisReport,
            report.reportJson.upcomingNekathForUser,
            report.reportJson.pastLifeLine,
            report.reportJson.recommendedGemsToWear,
            report.reportJson.fullRemediesReport,
            report.reportJson.personalizedRecommendations,
            report.reportJson.finalThoughtSummary,
            report.reportJson.endRecommendationsSection,
        ];
        const sectionHtml = sections
            .map((section) => `
          <section class="section">
            <h2>${section.title}</h2>
            ${section.content
            .split('\n')
            .filter(Boolean)
            .map((line) => `<p>${line}</p>`)
            .join('')}
          </section>
        `)
            .join('');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(`
      <!doctype html>
      <html lang="si">
        <head>
          <meta charset="utf-8" />
          <title>Wishwaya Premium Astrology Report</title>
          <style>
            body { font-family: "Nirmala UI", "Segoe UI", sans-serif; margin: 0; background: #0f0d08; color: #f7edd2; }
            .page { max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; }
            .cover { padding: 36px; border-radius: 28px; background: radial-gradient(circle at top, rgba(255,205,92,0.28), transparent 35%), linear-gradient(135deg, #1b1610, #111827); border: 1px solid rgba(255,220,128,0.22); box-shadow: 0 18px 60px rgba(0,0,0,0.32); }
            .badge { display: inline-block; padding: 8px 14px; border-radius: 999px; background: rgba(255,215,130,0.14); color: #f8df97; font-size: 12px; margin-right: 8px; }
            h1, h2 { color: #ffe7a3; }
            h1 { margin-bottom: 8px; }
            .section { margin-top: 22px; padding: 22px; background: rgba(255,255,255,0.04); border-radius: 22px; border: 1px solid rgba(255,255,255,0.08); }
            p { line-height: 1.85; color: #f7f0dc; }
            .footer { text-align: center; margin-top: 28px; color: #c9b68b; font-size: 12px; }
            @media print {
              body { background: white; color: #1f2937; }
              .cover, .section { box-shadow: none; background: white; color: #1f2937; border: 1px solid #e5e7eb; }
              h1, h2, p, .badge, .footer { color: #1f2937; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="cover">
              <span class="badge">Wishwaya</span>
              <span class="badge">Sinhala Premium Report</span>
              <h1>${report.inputSnapshot?.fullName || 'Premium Astrology Report'}</h1>
              <p>මෙය Wishwaya විසින් සකස් කළ premium Sinhala astrology report එකකි. අවශ්‍ය නම් browser print dialog භාවිතයෙන් PDF ලෙස සුරකින්න.</p>
            </div>
            ${sectionHtml}
            <div class="footer">Wishwaya • Generated ${new Date(report.updatedAt).toLocaleDateString('si-LK')}</div>
          </div>
          <script>window.__WISHWAYA_REPORT_READY__ = true;</script>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error('[astro-report] pdf source failed', error);
        res.status(404).send(error?.message || 'Report not found');
    }
});
app.post('/api/astro-reports/:reportId/retry', (req, res) => {
    try {
        const { adminKey } = req.body || {};
        const result = premiumAstroReportEngine.retryReport(req.params.reportId, adminKey);
        res.json(result);
    }
    catch (error) {
        console.error('[astro-report] retry failed', error);
        res.status(403).json({ error: error?.message || 'Retry failed' });
    }
});
// --- Initialization & Server Start ---
async function startServer() {
    try {
        console.log('Initializing Server...');
        // Load or Generate VAPID Keys
        try {
            if (fs.existsSync(VAPID_KEYS_FILE)) {
                vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf-8'));
                console.log('Loaded existing VAPID keys');
            }
            else {
                vapidKeys = webpush.generateVAPIDKeys();
                fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
                console.log('Generated new VAPID Keys');
            }
        }
        catch (err) {
            console.warn('Failed to access VAPID keys file, using in-memory keys:', err);
            if (!vapidKeys) {
                vapidKeys = webpush.generateVAPIDKeys();
            }
        }
        if (vapidKeys) {
            webpush.setVapidDetails('mailto:support@wishwaya.online', vapidKeys.publicKey, vapidKeys.privateKey);
        }
        // --- Consolidated Notification Job ---
        // Runs every 15 minutes to check for Rahu Kalaya and other daily tasks
        cron.schedule('*/15 * * * *', async () => {
            const now = new Date();
            const colomboTime = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Colombo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).formatToParts(now);
            const parts = {};
            colomboTime.forEach(p => parts[p.type] = p.value);
            const currentHour = parseInt(parts.hour);
            const currentMinute = parseInt(parts.minute);
            const todayStr = `${parts.year}-${parts.month}-${parts.day}`;
            const currentMonth = parseInt(parts.month) - 1;
            const currentDay = parseInt(parts.day);
            const currentYear = parseInt(parts.year);
            console.log(`[Cron] Checking notifications at ${todayStr} ${currentHour}:${currentMinute}`);
            try {
                const subs = getSubscriptions();
                const uniqueUsers = [...new Set(subs.map((s) => s.userId))];
                for (const userId of uniqueUsers) {
                    const userSubs = subs.filter((s) => s.userId === userId && !s.disabled);
                    if (userSubs.length === 0)
                        continue;
                    const firstSub = userSubs[0];
                    const profile = firstSub.horoscopeProfile;
                    const prefs = profile?.notifications || { enabled: true, horoscope: true, rahuKalaya: true, specialNekath: true, birthday: true };
                    if (!prefs.enabled)
                        continue;
                    // 1. Daily Horoscope (Send at 6:00 AM - 6:15 AM)
                    if (prefs.horoscope && currentHour === 6 && currentMinute < 15) {
                        if (prefs.lastHoroscopeSentDate !== todayStr) {
                            const title = "අද දවසේ විශේෂය 🌞";
                            let message = "අද ඔබට සන්සුන්ව සහ බුද්ධිමත්ව වැඩ කළහොත් හොඳ ප්රතිඵල ලැබේ. සුබ දවසක්!";
                            if (profile && profile.rashi) {
                                try {
                                    const apiKeys = [
                                        process.env.GEMINI_API_KEY,
                                        process.env.API_KEY,
                                        process.env.Wishwaya_App_Key
                                    ].filter(k => k && k.trim().length > 10 && k !== 'MY_GEMINI_API_KEY').map(k => k.trim());
                                    let success = false;
                                    for (const apiKey of apiKeys) {
                                        try {
                                            const ai = new GoogleGenAI({ apiKey });
                                            const result = await ai.models.generateContent({
                                                model: "gemini-flash-latest",
                                                contents: `Generate a very short, positive daily horoscope (max 15 words) for ${profile.rashi} Rashi. Language: Sinhala. Focus on encouragement and peace. No negative predictions.`
                                            });
                                            message = result.text || message;
                                            success = true;
                                            break;
                                        }
                                        catch (e) {
                                            console.error(`Gemini Horoscope Error with key:`, e);
                                        }
                                    }
                                }
                                catch (e) {
                                    console.error("Gemini Horoscope Error:", e);
                                }
                            }
                            await sendToUser(userId, title, message, "/dashboard");
                            updateSubscriptionProfile(userId, { notifications: { ...prefs, lastHoroscopeSentDate: todayStr } });
                        }
                    }
                    // 2. Rahu Kalaya Reminder (30 mins before start)
                    if (prefs.rahuKalaya) {
                        const loc = firstSub.location || { lat: 6.9271, lng: 79.8612 };
                        const { start } = getRahuKalaya(now, loc.lat, loc.lng);
                        const diffMins = (start.getTime() - now.getTime()) / (1000 * 60);
                        // If Rahu starts in 25-40 minutes, and we haven't sent a reminder today
                        if (diffMins >= 25 && diffMins <= 40 && prefs.lastRahuReminderSentDate !== todayStr) {
                            const title = "රාහු කාලය ⏳";
                            const message = "තවත් මිනිත්තු 30කින් රාහු කාලය ආරම්භ වේ. වැදගත් කටයුතු ඒ අනුව සැලසුම් කරන්න.";
                            await sendToUser(userId, title, message, "/rahu-kalaya");
                            updateSubscriptionProfile(userId, { notifications: { ...prefs, lastRahuReminderSentDate: todayStr } });
                        }
                    }
                    // 3. Special Nekath (Send at 7:00 AM - 7:15 AM)
                    if (prefs.specialNekath && currentHour === 7 && currentMinute < 15) {
                        if (prefs.lastSpecialNekathSentDate !== todayStr) {
                            const monthNekath = safeNekathDatabase[currentMonth];
                            if (monthNekath) {
                                // Check if any nekath string contains today's day number
                                const nekathTypes = ['business', 'travel', 'houseBuilding', 'marriage'];
                                let foundNekath = "";
                                for (const type of nekathTypes) {
                                    const text = monthNekath[type];
                                    // Very simple check: if the text contains "XX වන" where XX is currentDay
                                    const dayPattern = new RegExp(`${currentDay.toString().padStart(2, '0')}|${currentDay} වන`);
                                    if (dayPattern.test(text)) {
                                        foundNekath = text;
                                        break;
                                    }
                                }
                                if (foundNekath) {
                                    const title = "ඔබට අද විශේෂ නැකතක් ඇත 🧿";
                                    const message = "අද ඔබට සුබ නැකතක් ඇත. වැදගත් කටයුතු සඳහා සුදුසු වේලාවක් විය හැක. විස්තර බලන්න.";
                                    await sendToUser(userId, title, message, "/nekath");
                                    updateSubscriptionProfile(userId, { notifications: { ...prefs, lastSpecialNekathSentDate: todayStr } });
                                }
                            }
                        }
                    }
                    // 4. Birthday Wish (Send at 8:00 AM - 8:15 AM)
                    if (prefs.birthday && currentHour === 8 && currentMinute < 15) {
                        if (profile.dob && prefs.lastBirthdayWishSentYear !== currentYear) {
                            const dob = new Date(profile.dob);
                            if (dob.getMonth() === currentMonth && dob.getDate() === currentDay) {
                                const title = "සුභ උපන්දිනයක්! 🎉";
                                const message = `සුභ උපන්දිනයක් ${profile.name}! ඔබගේ අද දවස සතුට, ආශීර්වාද සහ ජයග්රහණයෙන් පිරේවා.`;
                                await sendToUser(userId, title, message, "/profile");
                                updateSubscriptionProfile(userId, { notifications: { ...prefs, lastBirthdayWishSentYear: currentYear } });
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.error("Error in consolidated cron job:", err);
            }
        }, { timezone: "Asia/Colombo" });
        // Helper to send to all user devices
        async function sendToUser(userId, title, body, url) {
            const subs = getSubscriptions().filter((s) => s.userId === userId && !s.disabled);
            const payload = JSON.stringify({ title, body, url });
            const promises = subs.map((sub) => webpush.sendNotification(sub.subscription, payload)
                .catch((err) => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log(`Subscription expired for user ${userId}`);
                    // Mark as disabled or remove...
                }
            }));
            await Promise.all(promises);
        }
        console.log('Starting Server v2.2 (Robust Mode)');
        console.log(`Attempting to start server on port: ${PORT}`);
        // Vite middleware for development
        // In Cloud Run, NODE_ENV is usually 'production'. 
        const isProduction = process.env.NODE_ENV === 'production';
        const distPath = path.join(__dirname, 'dist');
        const hasDist = fs.existsSync(distPath);
        console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}, isProduction=${isProduction}, hasDist=${hasDist}`);
        console.log(`Final PORT: ${PORT}`);
        if (!isProduction || !hasDist) {
            console.log('Starting in DEVELOPMENT mode (Vite middleware)');
            try {
                const { createServer } = await import('vite');
                const vite = await createServer({
                    root: process.cwd(),
                    server: { middlewareMode: true },
                    appType: 'spa',
                });
                app.use(vite.middlewares);
            }
            catch (viteErr) {
                console.error('Failed to start Vite middleware:', viteErr);
                app.get('/*path', (req, res) => {
                    res.status(500).send('Development server failed to start.');
                });
            }
        }
        else {
            console.log('Starting in PRODUCTION mode (Static serving)');
            app.use(express.static(distPath));
            app.get('/*path', (req, res) => {
                res.sendFile(path.join(distPath, 'index.html'));
            });
        }
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://0.0.0.0:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
