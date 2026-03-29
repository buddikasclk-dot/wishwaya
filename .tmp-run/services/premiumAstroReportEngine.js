import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { calculateBirthProfile } from "../src/services/astrology-calculator.js";
import { getLogicalNekathForMonth } from "../src/data/nekathData.js";
const PRODUCT_TYPE = 'full_astro_report';
const PRODUCT_AMOUNT = 300;
const PRODUCT_CURRENCY = 'LKR';
const PAYMENT_GATEWAY = process.env.ENABLE_PAYMENTS === 'true' ? 'stripe' : 'placeholder';
const SECTION_ORDER = [
    ['coverSection', '1. Cover Section'],
    ['coreAstroProfile', '2. Core Astro Profile'],
    ['personalityLifeBlueprint', '3. Personality & Life Blueprint'],
    ['wealthCareerBusinessReport', '4. Wealth / Career / Business Report'],
    ['loveMarriageRelationshipReport', '5. Love / Marriage / Relationship Report'],
    ['healthLifestyleGuidance', '6. Health / Lifestyle Guidance'],
    ['dashaTimePeriodAnalysis', '7. Dasha / Time Period Analysis'],
    ['yogasDoshasPlanetaryInfluences', '8. Yogas / Doshas / Planetary Influences'],
    ['palmAnalysisReport', '9. Palm Analysis Report'],
    ['upcomingNekathForUser', '10. Upcoming Nekath for User'],
    ['pastLifeLine', '11. Past Life Line'],
    ['recommendedGemsToWear', '12. Recommended Gems to Wear'],
    ['fullRemediesReport', '13. Full Remedies Report'],
    ['personalizedRecommendations', '14. Personalized Recommendations'],
    ['finalThoughtSummary', '15. Final Thought / Summary'],
    ['endRecommendationsSection', '16. End Recommendations Section'],
];
const REQUIRED_FIELDS = [
    'fullName',
    'dateOfBirth',
    'timeOfBirth',
    'birthPlace',
    'gender',
    'preferredLanguage',
    'palmImage',
];
const sinhalaDate = (iso) => new Date(iso).toLocaleString('si-LK', { dateStyle: 'medium', timeStyle: 'short' });
const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
const hashCode = (input) => Array.from(input).reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
const seeded = (seed, offset = 0) => {
    const x = Math.sin(seed + offset * 999) * 10000;
    return x - Math.floor(x);
};
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
const readJsonFile = (filePath, fallback) => {
    try {
        if (!fs.existsSync(filePath))
            return fallback;
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    catch (error) {
        console.error('[astro-report] Failed to read JSON file', filePath, error);
        return fallback;
    }
};
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
const safeJsonParse = (text, fallback) => {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : fallback;
    }
    catch {
        return fallback;
    }
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export class PremiumAstroReportEngine {
    dataDir;
    ordersFile;
    reportsFile;
    uploadsDir;
    workerBusy = false;
    queue = new Set();
    ai = null;
    constructor(dataDir) {
        this.dataDir = dataDir;
        const premiumDir = path.join(dataDir, 'premium-reports');
        ensureDir(premiumDir);
        this.uploadsDir = path.join(premiumDir, 'uploads');
        ensureDir(this.uploadsDir);
        this.ordersFile = path.join(premiumDir, 'astro-report-orders.json');
        this.reportsFile = path.join(premiumDir, 'astro-reports.json');
        const apiKey = process.env.GEMINI_API_KEY ||
            process.env.API_KEY ||
            process.env.Wishwaya_App_Key ||
            '';
        if (apiKey.trim()) {
            this.ai = new GoogleGenAI({ apiKey: apiKey.trim() });
        }
    }
    createOrder({ userId, profile }) {
        const reusable = this.findReusablePendingBundle(userId);
        if (reusable) {
            reusable.order.updatedAt = new Date().toISOString();
            reusable.report.updatedAt = reusable.order.updatedAt;
            reusable.report.birthDataJson = {
                ...reusable.report.birthDataJson,
                ...this.prefillFromProfile(profile),
            };
            this.upsertOrder(reusable.order);
            this.upsertReport(reusable.report);
            return {
                order: reusable.order,
                report: reusable.report,
                payment: {
                    integrationMode: PAYMENT_GATEWAY === 'stripe' ? 'stripe' : 'placeholder',
                    checkoutToken: createId('checkout'),
                    supportedStates: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
                    checkoutUrl: null,
                    sessionId: null,
                    stripePriceId: null,
                    displayAmount: null,
                    localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`,
                },
            };
        }
        const now = new Date().toISOString();
        const order = {
            id: createId('order'),
            userId,
            productType: PRODUCT_TYPE,
            amount: PRODUCT_AMOUNT,
            currency: PRODUCT_CURRENCY,
            status: 'pending',
            paymentGateway: PAYMENT_GATEWAY,
            paymentReference: null,
            createdAt: now,
            updatedAt: now,
        };
        const report = {
            id: createId('report'),
            userId,
            orderId: order.id,
            status: 'awaiting_payment',
            language: 'si',
            createdAt: now,
            updatedAt: now,
            completedAt: null,
            birthDataJson: this.prefillFromProfile(profile),
            astrologyDataJson: null,
            palmImageUrl: null,
            reportJson: null,
            pdfUrl: null,
            failureReason: null,
            inputSnapshot: null,
            requestId: createId('req'),
        };
        const orders = this.getOrders();
        const reports = this.getReports();
        orders.push(order);
        reports.push(report);
        this.saveOrders(orders);
        this.saveReports(reports);
        return {
            order,
            report,
            payment: {
                integrationMode: PAYMENT_GATEWAY === 'stripe' ? 'stripe' : 'placeholder',
                checkoutToken: createId('checkout'),
                supportedStates: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
                checkoutUrl: null,
                sessionId: null,
                stripePriceId: null,
                displayAmount: null,
                localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`,
            },
        };
    }
    attachStripeCheckout(input) {
        const order = this.requireOrder(input.orderId);
        const report = this.requireReport(input.reportId);
        order.paymentGateway = 'stripe';
        order.updatedAt = new Date().toISOString();
        this.upsertOrder(order);
        report.updatedAt = new Date().toISOString();
        this.upsertReport(report);
        return {
            order,
            report,
            payment: {
                integrationMode: 'stripe',
                checkoutToken: createId('checkout'),
                supportedStates: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
                checkoutUrl: input.checkoutUrl,
                sessionId: input.sessionId,
                stripePriceId: input.stripePriceId,
                displayAmount: input.displayAmount,
                localDisplayAmount: input.localDisplayAmount,
            },
        };
    }
    confirmPayment(orderId, outcome) {
        console.info('[astro-report] payment state change', { orderId, outcome });
        const orders = this.getOrders();
        const reports = this.getReports();
        const order = orders.find((entry) => entry.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        const report = reports.find((entry) => entry.orderId === orderId);
        if (!report) {
            throw new Error('Linked report not found');
        }
        order.status = outcome;
        order.updatedAt = new Date().toISOString();
        order.paymentReference = outcome === 'paid' ? createId('pay') : null;
        report.status = outcome === 'paid' ? 'paid' : outcome === 'cancelled' ? 'awaiting_payment' : 'awaiting_payment';
        report.updatedAt = new Date().toISOString();
        if (outcome === 'paid') {
            report.failureReason = null;
        }
        this.saveOrders(orders);
        this.saveReports(reports);
        return {
            order,
            report,
            payment: {
                integrationMode: order.paymentGateway === 'stripe' ? 'stripe' : 'placeholder',
                checkoutToken: createId('checkout'),
                supportedStates: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
                checkoutUrl: null,
                sessionId: null,
                stripePriceId: null,
                displayAmount: null,
                localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`,
            },
        };
    }
    confirmStripePayment(orderId, paymentReference) {
        const orders = this.getOrders();
        const reports = this.getReports();
        const order = orders.find((entry) => entry.id === orderId);
        const report = reports.find((entry) => entry.orderId === orderId);
        if (!order || !report) {
            throw new Error('Order not found');
        }
        if (order.status === 'paid' && report.status !== 'awaiting_payment') {
            return { order, report };
        }
        order.status = 'paid';
        order.paymentGateway = 'stripe';
        order.paymentReference = paymentReference;
        order.updatedAt = new Date().toISOString();
        report.status = 'paid';
        report.updatedAt = new Date().toISOString();
        report.failureReason = null;
        this.saveOrders(orders);
        this.saveReports(reports);
        return { order, report };
    }
    markPaymentCancelled(orderId, paymentReference) {
        const orders = this.getOrders();
        const reports = this.getReports();
        const order = orders.find((entry) => entry.id === orderId);
        const report = reports.find((entry) => entry.orderId === orderId);
        if (!order || !report) {
            throw new Error('Order not found');
        }
        order.status = 'cancelled';
        order.paymentReference = paymentReference || order.paymentReference;
        order.updatedAt = new Date().toISOString();
        report.status = 'awaiting_payment';
        report.updatedAt = new Date().toISOString();
        this.saveOrders(orders);
        this.saveReports(reports);
        return { order, report };
    }
    getRequirements(reportId, userId, profile) {
        const report = this.requireReport(reportId, userId);
        const prefilled = {
            ...this.prefillFromProfile(profile),
            ...(report.birthDataJson || {}),
            ...(report.inputSnapshot || {}),
        };
        const missingFields = REQUIRED_FIELDS.filter((field) => {
            if (field === 'palmImage')
                return !report.palmImageUrl;
            if (field === 'preferredLanguage')
                return prefilled.preferredLanguage !== 'si';
            const map = {
                fullName: prefilled.fullName,
                dateOfBirth: prefilled.dateOfBirth,
                timeOfBirth: prefilled.timeOfBirth,
                birthPlace: prefilled.birthPlace,
                gender: prefilled.gender,
            };
            return !map[field];
        });
        if (report.status === 'paid' && missingFields.length > 0) {
            report.status = 'collecting_inputs';
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
        }
        return {
            reportId: report.id,
            requestId: report.requestId,
            status: report.status,
            missingFields,
            prefilled,
        };
    }
    submitInputs(reportId, payload) {
        console.info('[astro-report] validating inputs', { reportId });
        const report = this.requireReport(reportId, payload.userId);
        const order = this.requireOrder(report.orderId, payload.userId);
        if (order.status !== 'paid') {
            throw new Error('Payment required before report generation');
        }
        this.validateInputPayload(payload);
        const palmImageUrl = this.storePalmImage(report.id, payload.palmImageBase64, payload.palmImageMimeType);
        const inputSnapshot = {
            fullName: payload.fullName.trim(),
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth,
            timeOfBirth: payload.timeOfBirth,
            birthPlace: payload.birthPlace.trim(),
            preferredLanguage: 'si',
            palmImageUrl,
            palmQuality: payload.palmQuality,
        };
        report.inputSnapshot = inputSnapshot;
        report.birthDataJson = inputSnapshot;
        report.palmImageUrl = palmImageUrl;
        report.status = 'queued';
        report.updatedAt = new Date().toISOString();
        report.failureReason = null;
        this.upsertReport(report);
        this.queueReportGeneration(report.id);
        return { report };
    }
    createBackgroundReportFromProfile(userId, profile) {
        const activeStatuses = ['collecting_inputs', 'queued', 'generating', 'pdf_generating'];
        const existingActive = this.getReports()
            .filter((report) => report.userId === userId && activeStatuses.includes(report.status))
            .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
        if (existingActive) {
            return { report: existingActive, reused: true };
        }
        const now = new Date().toISOString();
        const order = {
            id: createId('order'),
            userId,
            productType: PRODUCT_TYPE,
            amount: PRODUCT_AMOUNT,
            currency: PRODUCT_CURRENCY,
            status: 'paid',
            paymentGateway: 'stripe',
            paymentReference: createId('pay'),
            createdAt: now,
            updatedAt: now,
        };
        const prefilled = this.prefillFromProfile(profile);
        const report = {
            id: createId('report'),
            userId,
            orderId: order.id,
            status: 'paid',
            language: 'si',
            createdAt: now,
            updatedAt: now,
            completedAt: null,
            birthDataJson: {
                ...prefilled,
                preferredLanguage: 'si',
            },
            astrologyDataJson: null,
            palmImageUrl: null,
            reportJson: null,
            pdfUrl: null,
            failureReason: null,
            inputSnapshot: null,
            requestId: createId('req'),
        };
        const orders = this.getOrders();
        const reports = this.getReports();
        orders.push(order);
        reports.push(report);
        this.saveOrders(orders);
        this.saveReports(reports);
        return { report, reused: false };
    }
    listReports(userId) {
        const reports = this.getReports()
            .filter((report) => report.userId === userId)
            .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        const activeStatuses = [
            'collecting_inputs',
            'queued',
            'generating',
            'pdf_generating',
        ];
        let awaitingShown = false;
        let activeShown = false;
        return reports.filter((report) => {
            if (activeStatuses.includes(report.status)) {
                if (activeShown)
                    return false;
                activeShown = true;
                return true;
            }
            if (report.status === 'awaiting_payment') {
                if (awaitingShown || activeShown)
                    return false;
                awaitingShown = true;
                return true;
            }
            return true;
        });
    }
    getReport(reportId, userId) {
        return this.requireReport(reportId, userId);
    }
    retryReport(reportId, adminKey) {
        if (!process.env.ASTRO_REPORT_ADMIN_KEY || adminKey !== process.env.ASTRO_REPORT_ADMIN_KEY) {
            throw new Error('Admin retry is not allowed');
        }
        const report = this.requireReport(reportId);
        report.status = 'queued';
        report.failureReason = null;
        report.updatedAt = new Date().toISOString();
        this.upsertReport(report);
        this.queueReportGeneration(report.id);
        return { report };
    }
    getPalmImageFile(reportId, userId) {
        const report = this.requireReport(reportId, userId);
        if (!report.palmImageUrl)
            return null;
        const filePath = path.join(this.uploadsDir, path.basename(report.palmImageUrl));
        if (!fs.existsSync(filePath))
            return null;
        return filePath;
    }
    getOrders() {
        return readJsonFile(this.ordersFile, []);
    }
    findReusablePendingBundle(userId) {
        const orders = this.getOrders()
            .filter((order) => order.userId === userId && ['pending', 'cancelled', 'failed'].includes(order.status))
            .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
        const reports = this.getReports();
        for (const order of orders) {
            const report = reports.find((entry) => entry.orderId === order.id && entry.status === 'awaiting_payment');
            if (report) {
                return { order, report };
            }
        }
        return null;
    }
    saveOrders(orders) {
        writeJsonFile(this.ordersFile, orders);
    }
    upsertOrder(order) {
        const orders = this.getOrders();
        const index = orders.findIndex((entry) => entry.id === order.id);
        if (index >= 0) {
            orders[index] = order;
        }
        else {
            orders.push(order);
        }
        this.saveOrders(orders);
    }
    getReports() {
        return readJsonFile(this.reportsFile, []);
    }
    saveReports(reports) {
        writeJsonFile(this.reportsFile, reports);
    }
    upsertReport(report) {
        const reports = this.getReports();
        const index = reports.findIndex((entry) => entry.id === report.id);
        if (index >= 0) {
            reports[index] = report;
        }
        else {
            reports.push(report);
        }
        this.saveReports(reports);
    }
    requireReport(reportId, userId) {
        const report = this.getReports().find((entry) => entry.id === reportId);
        if (!report || (userId && report.userId !== userId)) {
            throw new Error('Report not found');
        }
        return report;
    }
    requireOrder(orderId, userId) {
        const order = this.getOrders().find((entry) => entry.id === orderId);
        if (!order || (userId && order.userId !== userId)) {
            throw new Error('Order not found');
        }
        return order;
    }
    prefillFromProfile(profile) {
        return {
            fullName: profile?.name || '',
            gender: profile?.gender,
            dateOfBirth: profile?.dob || '',
            timeOfBirth: profile?.birthTime || '',
            birthPlace: profile?.city || '',
            preferredLanguage: 'si',
        };
    }
    validateInputPayload(payload) {
        const errors = [];
        if (!payload.fullName.trim())
            errors.push('Full name is required');
        if (!payload.dateOfBirth)
            errors.push('Birth date is required');
        if (!payload.timeOfBirth)
            errors.push('Birth time is required');
        if (!payload.birthPlace.trim())
            errors.push('Birth place is required');
        if (!payload.palmImageBase64)
            errors.push('Palm image is required');
        const { width, height, brightness, contrast, sharpness } = payload.palmQuality;
        if (width < 600 || height < 800)
            errors.push('Palm image resolution is too small');
        if (brightness < 45)
            errors.push('Palm image is too dark');
        if (contrast < 18)
            errors.push('Palm image contrast is too low');
        if (sharpness < 12)
            errors.push('Palm image is too blurry');
        if (errors.length) {
            console.warn('[astro-report] input validation failed', errors);
            throw new Error(errors[0]);
        }
    }
    storePalmImage(reportId, base64, mimeType) {
        const extension = mimeType.includes('png') ? 'png' : 'jpg';
        const fileName = `${reportId}-palm.${extension}`;
        const filePath = path.join(this.uploadsDir, fileName);
        const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
        fs.writeFileSync(filePath, Buffer.from(cleanBase64, 'base64'));
        return `/api/astro-reports/${reportId}/palm-image`;
    }
    queueReportGeneration(reportId) {
        this.queue.add(reportId);
        void this.runQueue();
    }
    async runQueue() {
        if (this.workerBusy)
            return;
        this.workerBusy = true;
        while (this.queue.size) {
            const [reportId] = this.queue;
            this.queue.delete(reportId);
            try {
                await this.generateReport(reportId);
            }
            catch (error) {
                console.error('[astro-report] generation failed', { reportId, error });
            }
        }
        this.workerBusy = false;
    }
    async generateReport(reportId) {
        let report = this.requireReport(reportId);
        if (!report.inputSnapshot) {
            report.status = 'failed';
            report.failureReason = 'Missing input snapshot';
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
            return;
        }
        try {
            console.info('[astro-report] generation start', { reportId, requestId: report.requestId });
            report.status = 'generating';
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
            const deterministicData = this.buildDeterministicSnapshot(report.inputSnapshot);
            report.astrologyDataJson = deterministicData;
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
            const reportJson = await this.buildFinalReport(report, deterministicData);
            report = this.requireReport(reportId);
            report.status = 'pdf_generating';
            report.reportJson = reportJson;
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
            await sleep(200);
            report = this.requireReport(reportId);
            report.status = 'completed';
            report.pdfUrl = `/api/astro-reports/${report.id}/pdf`;
            report.updatedAt = new Date().toISOString();
            report.completedAt = new Date().toISOString();
            report.failureReason = null;
            this.upsertReport(report);
            console.info('[astro-report] generation complete', { reportId });
        }
        catch (error) {
            console.error('[astro-report] section/pdf/storage failure', error);
            report = this.requireReport(reportId);
            report.status = 'failed';
            report.failureReason = error?.message || 'Report generation failed';
            report.updatedAt = new Date().toISOString();
            this.upsertReport(report);
        }
    }
    buildDeterministicSnapshot(input) {
        const baseProfile = calculateBirthProfile(input.dateOfBirth, input.timeOfBirth, input.birthPlace);
        const seed = Math.abs(hashCode(`${input.dateOfBirth}|${input.timeOfBirth}|${input.birthPlace}|${input.fullName}`));
        const signs = [
            'මේෂ',
            'වෘෂභ',
            'මිථුන',
            'කටක',
            'සිංහ',
            'කන්යා',
            'තුලා',
            'වෘශ්චික',
            'ධනු',
            'මකර',
            'කුම්භ',
            'මීන',
        ];
        const planets = ['රවි', 'චන්ද්‍ර', 'කුජ', 'බුධ', 'ගුරු', 'ශුක්‍ර', 'ශනි', 'රාහු', 'කේතු'];
        const focuses = ['පෞරුෂය', 'ධනය', 'සන්නිවේදනය', 'ගෘහජීවිතය', 'නිර්මාණශීලීත්වය', 'සේවාව', 'සම්බන්ධතා', 'රහස් බල', 'ධර්මය', 'කාර්යභාරය', 'ලාභ', 'විවේකය'];
        const monthNekath = getLogicalNekathForMonth(new Date().getMonth());
        const planetPositions = planets.map((planet, index) => {
            const degree = (seeded(seed, index + 1) * 29.99).toFixed(2);
            return {
                planet,
                sign: signs[Math.floor(seeded(seed, index + 21) * signs.length)],
                degree: `${degree}°`,
                house: (Math.floor(seeded(seed, index + 41) * 12) % 12) + 1,
            };
        });
        const housePositions = Array.from({ length: 12 }, (_, index) => ({
            house: index + 1,
            sign: signs[Math.floor(seeded(seed, index + 61) * signs.length)],
            focus: focuses[index],
        }));
        return {
            lagna: baseProfile.lagna || baseProfile.rashi || 'මකර',
            rashi: baseProfile.janmaRashiya || baseProfile.rashi || 'මකර',
            nakshatra: baseProfile.nekatha || 'පුවපුටුප',
            pada: baseProfile.nekathPadaya || '1 වන පාදය',
            planetPositions,
            housePositions,
            dashaSummary: {
                currentPhase: 'වත්මන් දශා තත්ත්වය සංයමය සහ සැලසුම ඉල්ලා සිටින කාලයකි.',
                nextPhase: 'ඉදිරි අවධියේදී ක්‍රියාකාරී වර්ධන අවස්ථා වැඩි වීමට ඉඩ ඇත.',
                helpfulPeriods: ['උදෑසන සැලසුම් කරන කාලය', 'මධ්‍ය කාලීන මුදල් තීරණ සකස් කරන කාලය'],
                challengingPeriods: ['හදිසි වියදම් ඇතිවන සති', 'අධික වගකීම් එකවර එකතු වන අවධි'],
            },
            yogasAndDoshas: {
                strengths: ['ස්ථිර සංකල්පය', 'ගැඹුරු විමසුම', 'සම්බන්ධතා තේරුම් ගැනීමේ හැකියාව'],
                cautions: ['අධික කල්පනා කිරීම', 'විශ්වාසය ප්‍රකාශ කිරීමට ප්‍රමාද වීම'],
                certainty: 'hybrid',
            },
            transitSummary: 'වर्तमान ග්‍රහ ගමන් සාරාංශය පදනම් මට්ටමේ නිරීක්ෂණයක් ලෙස භාවිත කර ඇත.',
            upcomingNekathLogic: [monthNekath.business, monthNekath.travel],
            recommendedGemLogic: ['ශනි සහ ගුරු බල සමතුලිත කිරීමේ ගැඹුරු වර්ණ මැණික් සලකා බැලීම.', 'පළඳින දින සහ අත සම්බන්ධ නීති අංශිකව භාවිත කළ යුතුය.'],
            remedyBaseRules: ['අවධානය, නිතර භාවනා කිරීම, සහ දෛනික ව්‍යවස්ථාව ශක්තිමත් කිරීම.', 'මනස අවිධිමත් කරන පුරුදු අඩු කිරීම.'],
            palmObservationSummary: [
                input.palmQuality.sharpness > 20 ? 'රේඛා පැහැදිලිව පෙනේ.' : 'අත් රේඛා මධ්‍යස්ථ ලෙස පෙනේ.',
                input.palmQuality.brightness > 70 ? 'ආලෝක තත්ත්වය හොඳ බැවින් නිරීක්ෂණ විශ්වාසය වැඩිය.' : 'ඡායාරූප ආලෝකය මධ්‍යස්ථය.',
            ],
            calculationNotes: [
                'ලග්නය, නක්ෂත්‍රය සහ පාදය උපන් තොරතුරු මත backend මඟින් සකස් කර ඇත.',
                'උසස් දශා, යෝග සහ ග්‍රහ සංචාර කොටස් සම්පූර්ණ ගණිත පද්ධතියක් නොමැති නිසා hybrid explanation ආකාරයෙන් සකස් කර ඇත.',
            ],
        };
    }
    async buildFinalReport(report, deterministicData) {
        const input = report.inputSnapshot;
        const sections = await Promise.all(SECTION_ORDER.map(async ([key, title]) => {
            const content = await this.generateSectionWithRetry(key, title, input, deterministicData);
            return { key, title, content };
        }));
        const sectionMap = sections.reduce((acc, section) => {
            acc[section.key] = {
                key: section.key,
                title: section.title,
                content: section.content,
            };
            return acc;
        }, {});
        return {
            coverSection: sectionMap.coverSection,
            coreAstroProfile: sectionMap.coreAstroProfile,
            personalityLifeBlueprint: sectionMap.personalityLifeBlueprint,
            wealthCareerBusinessReport: sectionMap.wealthCareerBusinessReport,
            loveMarriageRelationshipReport: sectionMap.loveMarriageRelationshipReport,
            healthLifestyleGuidance: sectionMap.healthLifestyleGuidance,
            dashaTimePeriodAnalysis: sectionMap.dashaTimePeriodAnalysis,
            yogasDoshasPlanetaryInfluences: sectionMap.yogasDoshasPlanetaryInfluences,
            palmAnalysisReport: sectionMap.palmAnalysisReport,
            upcomingNekathForUser: sectionMap.upcomingNekathForUser,
            pastLifeLine: sectionMap.pastLifeLine,
            recommendedGemsToWear: sectionMap.recommendedGemsToWear,
            fullRemediesReport: sectionMap.fullRemediesReport,
            personalizedRecommendations: sectionMap.personalizedRecommendations,
            finalThoughtSummary: sectionMap.finalThoughtSummary,
            endRecommendationsSection: sectionMap.endRecommendationsSection,
            generatedAt: new Date().toISOString(),
            generationMode: this.ai ? 'gemini_hybrid' : 'deterministic_fallback',
        };
    }
    async generateSectionWithRetry(key, title, input, deterministicData) {
        let lastContent = this.buildFallbackSection(key, title, input, deterministicData);
        for (let attempt = 1; attempt <= 2; attempt += 1) {
            try {
                if (!this.ai) {
                    return lastContent;
                }
                console.info('[astro-report] generating section', { key, attempt });
                const prompt = this.buildSectionPrompt(key, title, input, deterministicData, lastContent);
                const response = await this.ai.models.generateContent({
                    model: 'gemini-flash-latest',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                    },
                });
                const parsed = safeJsonParse(response.text || '', { content: lastContent });
                const candidate = (parsed.content || '').trim();
                if (candidate) {
                    return candidate;
                }
            }
            catch (error) {
                console.warn('[astro-report] section generation retry', { key, attempt, error });
            }
        }
        return lastContent;
    }
    buildSectionPrompt(key, title, input, deterministicData, fallbackContent) {
        return `ඔබ Wishwaya සඳහා වෘත්තීය ජෝතිශ්‍ය උපදේශකයෙකි.
මෙම කොටස සඳහා JSON only ලබා දෙන්න: {"content":"..."}.

නීති:
- ප්‍රතිදානය 100% සිංහලෙන්.
- සුරූපී, වෘත්තීය, පුද්ගලික, ගැඹුරු විග්‍රහමය භාෂාව භාවිත කරන්න.
- ගණනය කළ කරුණු වෙනස් නොකරන්න.
- uncertainty ඇති තැන්වල careful wording භාවිත කරන්න.
- English වචන අවම කරන්න.

වාර්තා කොටස:
${title}

පරිශීලක තොරතුරු:
නම: ${input.fullName}
උපන් දිනය: ${input.dateOfBirth}
උපන් වේලාව: ${input.timeOfBirth}
උපන් ස්ථානය: ${input.birthPlace}
ස්ත්‍රී/පුරුෂ: ${input.gender}

Deterministic astrology data:
${JSON.stringify(deterministicData, null, 2)}

මේ කොටස සඳහා fallback draft:
${fallbackContent}

කොටස key: ${key}
අවසාන අන්තර්ගතය paragraph + short bullets style එකකින් එකම string එකක් ලෙස ලබා දෙන්න.`;
    }
    buildFallbackSection(key, title, input, deterministicData) {
        const base = {
            coverSection: `Wishwaya Premium ජෝතිශ්‍ය වාර්තාව\nනම: ${input.fullName}\nඋපන් තොරතුරු: ${input.dateOfBirth} ${input.timeOfBirth} - ${input.birthPlace}\nසකස් කළ දිනය: ${sinhalaDate(new Date().toISOString())}\nPremium Sinhala PDF Report - එක්වර ගෙවීමක්.`,
            coreAstroProfile: `ලග්නය ${deterministicData.lagna} ලෙසත්, ජන්ම රාශිය ${deterministicData.rashi} ලෙසත් මෙම වාර්තාව සකස් කර ඇත. නැකත ${deterministicData.nakshatra} වන අතර ${deterministicData.pada} මඟින් ඔබගේ ජීවිත රටාවේ සංවේදී අගයන් තේරුම් ගැනීමට පදනමක් ලැබේ. ග්‍රහ පිහිටීම් හා භාව සාරාංශය අනුව ඔබගේ ජීවිතය ස්ථාවර වුවත්, දීර්ඝකාලීන තීරණ සම්බන්ධයෙන් හොඳ සැලසුමක් අවශ්‍ය බව පෙනේ.`,
            personalityLifeBlueprint: `${input.fullName} තුළ තීරණ ගැනීමට පෙර විමසා බලන ස්වභාවයක් සහ ඇතුළත ශක්තියක් පෙනේ. ඔබගේ සිතිවිලි ගැඹුරු වන නමුත් ඒවා ක්‍රියාවට ගෙන ඒමට පැහැදිලි පියවර සකස් කළ විට විශාල ප්‍රගතියක් ලැබේ. ශක්තිමත් පැත්තක් ලෙස විශ්වාසය, වගකීම් භාර ගැනීම සහ අන් අයගේ තත්ත්වය තේරුම් ගැනීම දැක්වෙයි. දුර්වල පැත්තක් ලෙස අධික සිතීම, ප්‍රමාද වීම සහ තවත් තහවුරු කිරීමක් කැමති වීම පෙන්වයි.`,
            wealthCareerBusinessReport: `ධන හා වෘත්තීය පැත්තේදී ඔබට අඛණ්ඩ ආදායම, සංවිධානාත්මක වැඩ සහ විශ්වාසය මත ගොඩනැගෙන ක්ෂේත්‍ර සුදුසු වේ. රැකියාවක වගකීම් සහිත තත්ත්වයක් ඔබට හොඳ වුවත්, සැලසුම්කරණය, උපදේශන සේවාව, නිර්මාණාත්මක ව්‍යාපාර හෝ ස්වාධීන ව්‍යාපෘති මඟින්ද වර්ධනයක් ලබා ගත හැක. මුදල් පැත්තේදී එක්වරම ලාභ සෙවීමට වඩා දිගු කාලීන ගොඩනැගීම ඔබට වඩා වාසිදායකය.`,
            loveMarriageRelationshipReport: `සම්බන්ධතා තුළ ඔබ අන්තර්ගත ගැඹුරුකම, අවංකත්වය සහ ස්ථාවර භාවය බලාපොරොත්තු වන අයෙකි. ආදරය තුළ ඔබට විශ්වාසය ගොඩනැගීමට සුළු කාලයක් ගත විය හැකි නමුත් එය ගොඩනැගුණු පසු ඔබ ඉතා පක්ෂපාතී වේ. විවාහය සම්බන්ධයෙන් අඩු වචනවලට වඩා ක්‍රියාවෙන් ආදරය පෙන්වන ගුණයක් පෙනේ. කෙසේ වෙතත්, නොකියූ අපේක්ෂා සම්බන්ධතා මත පීඩනයක් ඇති කළ හැකි බැවින් පාරදෘශ්‍ය කතාබහ අවශ්‍යය.`,
            healthLifestyleGuidance: `ශරීරයට වඩා මනස මත පීඩනය එකතු වන ස්වභාවය මෙහි පෙනේ. නින්ද, ජල පාන, නියමිත ආහාර වේලාවන් සහ සැහැල්ලු ව්‍යායාම ඔබගේ ශක්තිය ස්ථාවර කරයි. අධික තණ්හාවෙන් වැඩ කිරීම හෝ කල්පනා කිරීම නිසා හිසරදය, උදර නොසන්සුන්තාව හෝ වෙහෙස දැනිය හැකි බැවින් ජීවන රටාව පාලනය කිරීම වැදගත් වේ.`,
            dashaTimePeriodAnalysis: `දශා විග්‍රහය අනුව වර්තමාන කාලය ඔබගේ අභ්‍යන්තර හැඩගැස්වීම, මුදල් පාලනය සහ ජීවිත ප්‍රමුඛතා නැවත සකස් කිරීම ඉල්ලා සිටියි. සමහර අවස්ථාවන් ප්‍රමාදයකින් හෝ වගකීම් වැඩි වීමෙන් පෙනිය හැකි නමුත්, මේවා දිගුකාලීන ශක්තිමත් පදනමකට මඟ පාදයි. හොඳ කාලයන් ඔබ සැලසුම සහ අවධානය සමඟ කටයුතු කරන විට වේගයෙන් ප්‍රයෝජනවත් වනු ඇත.`,
            yogasDoshasPlanetaryInfluences: `මෙම කොටස hybrid mode එකෙන් සකස් කර ඇත. ඔබගේ සටහනේ ශක්තිය වැඩිපුර පෙන්නුම් කරන්නේ ස්ථාවර කැපවීම, ශිල්පමය සැලසුම සහ නිහතමානී වර්ධනය තුළය. කෙසේ වෙතත්, අතිවිමර්ශනය, තීරණ ප්‍රමාද වීම සහ සම්බන්ධතා තුළ මනසින් දුරස් වීම ප්‍රතිකූල ලෙස පෙනිය හැක. එබැවින් යෝග සහ දෝෂ යනුවෙන් දැක්වෙන බලපෑම් සම්පූර්ණ වශයෙන් භීතියට නොව, දැනුවත් වීමේ සලකුණු ලෙස භාවිත කරන්න.`,
            palmAnalysisReport: `අත් රේඛා නිරීක්ෂණය ${deterministicData.palmObservationSummary?.join(' ')} ජීව රේඛාව සහ මනෝ රේඛාව අර්ථදක්වන්නේ ඔබට අභ්‍යන්තර ශක්තියක් සහ සෙමින් නමුත් ගැඹුරු ලෙස තීරණ ගැනීමේ රටාවක් ඇති බවයි. හද රේඛාව සම්බන්ධතා තුළ ගැඹුරු විශ්වාසයක් සහ ආරක්ෂාවක් කැමති බව පෙන්වයි. ජෝතිශ්‍ය සටහන සමඟ බැලූ විට, ඔබගේ හෘදය සහ බුද්ධිය අතර සමතුලිතතාවය ඔබගේ ප්‍රධාන වර්ධන පාඨය බව පෙනේ.`,
            upcomingNekathForUser: `ඔබට ගැළපෙන ඉදිරි නැකත් කවුළු තෝරා ගැනීමේදී ව්‍යාපාර, ගමන් සහ නව ආරම්භයන් සඳහා අඩියෙන් අඩිය සැලසුමක් භාවිත කරන්න. ${deterministicData.upcomingNekathLogic?.join(' ')} මේ කාලයන් තුළ මුදල් සැලසුම්, ලිපි ලේඛන, හෝ නිවස/රැකියාව සම්බන්ධ කටයුතු ප්‍රමුඛතා අනුව සකස් කිරීම හොඳය. කලබල තීරණ, අවිධිමත් ගිවිසුම් සහ හදිසි වියදම් වලින් වළකින්න.`,
            pastLifeLine: `පසුගිය ආත්ම රේඛාව මෙම වාර්තාවේ ආධ්‍යාත්මික-අර්ථකථන කොටසකි. එයින් පෙනෙන්නේ ඔබ අතීතයෙන් ගෙනෙන වගකීම් බරක්, අන් අය වෙනුවෙන් වැඩිපුර සිතන ගතියක් සහ ශික්ෂණය හරහා වර්ධනය වීමට ඇති කර්ම පාඩම් බවයි. වර්තමාන ජීවිතයට එයින් ලැබෙන ආරාධනය නම් ඔබගේ සීමා පැහැදිලි කරගෙන, සේවය සහ ස්වයං-සුරක්ෂිතභාවය අතර සමතුලිතතාවයක් තැනීමය.`,
            recommendedGemsToWear: `සුදුසු මැණික් තෝරා ගැනීමේදී ශනි, ගුරු සහ මනස ස්ථාවර කරන වර්ණ බල සලකා බැලිය යුතුය. ${deterministicData.recommendedGemLogic?.join(' ')} ඔබට සුදුසු මැණික් භාවිතයට පෙර ශරීර ප්‍රතිචාර, ආගමික පුරුදු සහ දින/අත/ඇඟිලි සම්බන්ධ නීති අනුව පරීක්ෂා කරගැනීම වඩා සුදුසුය. නොගැළපෙන මැණික් වඩාත් ආවේගශීලී බවක් හෝ අසහනයක් දැනිය හැකි බැවින් අවධානයෙන් කටයුතු කරන්න.`,
            fullRemediesReport: `පරිහාර සහ පිළියම් කොටසෙහි ආධ්‍යාත්මික, ප්‍රායෝගික සහ හැසිරීම්මය මාර්ග එකට ගෙන ඇත. ${deterministicData.remedyBaseRules?.join(' ')} දෛනික පිරිසිදු පුරුදු, සතියකට එක් දිනක් නිහඬ භාවනා කාලයක්, ආර්ථික සැලසුම් ලිවීම සහ සම්බන්ධතා තුළ පැහැදිලි සන්නිවේදනය ඔබට වඩාත් බලවත් පිළියම් වේ. අන් අයගේ ශක්තිමය බලපෑම් අධික ලෙස භාර නොගෙන ඔබගේ සීමා තබා ගැනීමත් වැදගත්ය.`,
            personalizedRecommendations: `පෞද්ගලික නිර්දේශ ලෙස දිනපතා කළ යුත්තේ නියමිත අවදිවීමක්, කෙටි භාවනා සටහනක්, අදහස් ලිවීමක් සහ දවසේ ප්‍රමුඛ කාර්ය තුනක් තීරණය කිරීමයි. සතියකට වරක් මුදල් සහ සම්බන්ධතා සම්බන්ධ පසුගිය සතිය විමර්ශනය කරන්න. අධික වගකීම් එකවර භාර ගැනීම, තීරණ කල් දමමින් පීඩනය එකතු කර ගැනීම සහ නොකියූ අපේක්ෂා තබා ගැනීම වලක්වන්න.`,
            finalThoughtSummary: `${input.fullName} යනු ඇතුළත ශක්තිය, වගකීම සහ අර්ථපූර්ණ ජීවිතයක් ගොඩනැගීමට කැමති පුද්ගලයෙකි. ඔබගේ ජීවිත මාර්ගය ඉඟි කරන්නේ ප්‍රමාදයක් වුවත් ගැඹුරු සහ ස්ථාවර ජයග්‍රහණ ලබා ගත හැකි බවයි. ඉදිරි කාලයේ ඔබ වැඩි අවධානය යොමු කළ යුත්තේ පැහැදිලි තීරණ, මුදල් පාලනය, සම්බන්ධතා පිරිසිදු කිරීම සහ මනසට විවේකය ලබා දීම වෙතය.`,
            endRecommendationsSection: `ඔබ දැන්ම ආරම්භ කළ යුතු කරුණු: දිනපතා සැලසුම, භාවනා පුරුද්ද, මුදල් ලේඛනගත කිරීම.\nඔබ වැළකී සිටිය යුතු කරුණු: හදිසි තීරණ, අධික වියදම්, නොකියූ කලකිරීම් එකතු කර ගැනීම.\nඔබ වැඩි අවධානය යොමු කළ යුතු ජීවිත අංශ: රැකියාව, ආදායම් විධිමත් කිරීම, සම්බන්ධතා අවංක කිරීම, ශාරීරික සහ මානසික විවේකය.\nඅවසාන ජීවිත උපදෙස්: අභ්‍යන්තර සන්සුන්තාවය රැකගෙන ක්‍රියාත්මක වන සරල නමුත් අඛණ්ඩ පියවර ඔබගේ වාසනාව හැඩගස්වයි.`,
        };
        return `${title}\n\n${base[key] || ''}`;
    }
}
