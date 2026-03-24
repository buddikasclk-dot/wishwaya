import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { nekathDatabase } from './src/data/nekathData.ts';

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
// In Cloud Run (production), use /tmp as it's the only writable path
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/wishwaya-data' 
  : path.join(process.cwd(), 'src/data');

console.log(`Using DATA_DIR: ${DATA_DIR}`);

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created DATA_DIR');
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const VAPID_KEYS_FILE = path.join(DATA_DIR, 'vapid.json');


// Helper to load subscriptions
const getSubscriptions = () => {
  try {
    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading subscriptions:', err);
    return [];
  }
};

// Helper to save subscriptions
const saveSubscription = (subscription: any, userId: string, location: any, horoscopeProfile: any) => {
  try {
    const subs = getSubscriptions();
    const existingIndex = subs.findIndex((s: any) => s.subscription.endpoint === subscription.endpoint);
    
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
    } else {
      subs.push(newSub);
    }

    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2));
  } catch (err) {
    console.error('Error saving subscription:', err);
  }
};

// Helper to update profile in subscription
const updateSubscriptionProfile = (userId: string, profile: any) => {
  try {
    const subs = getSubscriptions();
    let updated = false;
    subs.forEach((s: any) => {
      if (s.userId === userId) {
        s.horoscopeProfile = { ...s.horoscopeProfile, ...profile };
        updated = true;
      }
    });
    if (updated) {
      fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2));
    }
  } catch (err) {
    console.error('Error updating profile:', err);
  }
};

// --- Rahu Kalaya Logic ---

const getRahuKalaya = (date: Date, lat: number, lng: number) => {
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
    case 1: segmentIndex = 1; break; // Mon
    case 2: segmentIndex = 5; break; // Tue
    case 3: segmentIndex = 4; break; // Wed
    case 4: segmentIndex = 3; break; // Thu
    case 5: segmentIndex = 2; break; // Fri
    case 6: segmentIndex = 0; break; // Sat
    case 0: segmentIndex = 6; break; // Sun
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
   .map(k => k!.trim());

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
          searchParams.set(key, req.query[key] as string);
        }
      });
    }
    searchParams.set('key', apiKey);

    const finalUrl = `https://generativelanguage.googleapis.com${targetPath}?${searchParams.toString()}`;
    console.log(`Proxying request to: ${finalUrl.split('?')[0]} (Using Key ${i+1}/${apiKeys.length})`);

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
          console.warn(`Key ${i+1} failed (${response.status}), trying next key...`);
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
        } catch {
          return res.json({
            error: 'Gemini proxy returned a non-JSON response',
            status: response.status,
            body: text,
          });
        }
      }

      res.set('Content-Type', contentType || 'application/json');
      return res.send(text);
    } catch (error: any) {
      console.error(`Proxy Error with key ${i+1}:`, error);
      lastError = error;
      if (i < apiKeys.length - 1) continue;
      
      return res.status(500).json({ 
        error: 'Failed to proxy request to Gemini',
        message: error.message 
      });
    }
  }
});

// Global state for VAPID keys
let vapidKeys: { publicKey: string; privateKey: string } | null = null;

// Get Public Key
app.get('/api/push/public-key', (req, res) => {
  if (vapidKeys) {
    res.json({ publicKey: vapidKeys.publicKey });
  } else if (fs.existsSync(VAPID_KEYS_FILE)) {
    try {
      vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf-8'));
      res.json({ publicKey: vapidKeys!.publicKey });
    } catch (err) {
      res.status(500).json({ error: 'Failed to read VAPID keys' });
    }
  } else {
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
  updateSubscriptionProfile(userId, { notifications: preferences });
  res.json({ message: 'Preferences updated successfully' });
});

// Unsubscribe
app.post('/api/push/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  let subs = getSubscriptions();
  subs = subs.filter((s: any) => s.subscription.endpoint !== endpoint);
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2));
  res.json({ message: 'Unsubscribed successfully' });
});

// Send Notification (Internal Use)
app.post('/api/notify/send', async (req, res) => {
  const { userId, title, body, url } = req.body;
  const subs = getSubscriptions().filter((s: any) => s.userId === userId && !s.disabled);
  
  const payload = JSON.stringify({ title, body, url });
  
  const promises = subs.map((sub: any) => 
    webpush.sendNotification(sub.subscription, payload)
      .catch(err => {
        if (err.statusCode === 410) {
          // Subscription expired, remove it
          console.log(`Subscription expired for user ${userId}`);
          // Logic to remove... (simplified for brevity)
        }
        console.error('Error sending notification:', err);
      })
  );

  await Promise.all(promises);
  res.json({ message: `Sent to ${subs.length} devices` });
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
      } else {
        vapidKeys = webpush.generateVAPIDKeys();
        fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
        console.log('Generated new VAPID Keys');
      }
    } catch (err) {
      console.warn('Failed to access VAPID keys file, using in-memory keys:', err);
      if (!vapidKeys) {
        vapidKeys = webpush.generateVAPIDKeys();
      }
    }

    if (vapidKeys) {
      webpush.setVapidDetails(
        'mailto:support@wishwaya.online',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
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

      const parts: any = {};
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
        const uniqueUsers = [...new Set(subs.map((s: any) => s.userId))] as string[];

        for (const userId of uniqueUsers) {
          const userSubs = subs.filter((s: any) => s.userId === userId && !s.disabled);
          if (userSubs.length === 0) continue;
          
          const firstSub = userSubs[0];
          const profile = firstSub.horoscopeProfile;
          const prefs = profile?.notifications || { enabled: true, horoscope: true, rahuKalaya: true, specialNekath: true, birthday: true };
          
          if (!prefs.enabled) continue;

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
                  ].filter(k => k && k.trim().length > 10 && k !== 'MY_GEMINI_API_KEY').map(k => k!.trim());

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
                    } catch (e) {
                      console.error(`Gemini Horoscope Error with key:`, e);
                    }
                  }
                } catch (e) {
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
                  const text = (monthNekath as any)[type];
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
                const message = `සුභ උපන්දිනයක් ${profile.name as string}! ඔබගේ අද දවස සතුට, ආශීර්වාද සහ ජයග්රහණයෙන් පිරේවා.`;
                await sendToUser(userId, title, message, "/profile");
                updateSubscriptionProfile(userId, { notifications: { ...prefs, lastBirthdayWishSentYear: currentYear } });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in consolidated cron job:", err);
      }
    }, { timezone: "Asia/Colombo" });

    // Helper to send to all user devices
    async function sendToUser(userId: string, title: string, body: string, url: string) {
      const subs = getSubscriptions().filter((s: any) => s.userId === userId && !s.disabled);
      const payload = JSON.stringify({ title, body, url });
      
      const promises = subs.map((sub: any) => 
        webpush.sendNotification(sub.subscription, payload)
          .catch((err: any) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              console.log(`Subscription expired for user ${userId}`);
              // Mark as disabled or remove...
            }
          })
      );
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
      } catch (viteErr) {
        console.error('Failed to start Vite middleware:', viteErr);
        app.get('/*path', (req, res) => {
          res.status(500).send('Development server failed to start.');
        });
      }
    } else {
      console.log('Starting in PRODUCTION mode (Static serving)');
      app.use(express.static(distPath));
      
      app.get('/*path', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
