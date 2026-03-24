import { GoogleGenAI, Type } from "@google/genai";
import { getLogicalNekathForMonth } from "../data/nekathData";
import { generateBasicVastuResult } from "./vastuEngine";
import { matchOmen } from "./omensEngine";
import { generateBasicGemstoneAdvice } from "./gemstoneEngine";
import { generateBasicRemedyResult } from "./remedyEngine";
import { generateBasicSoulPathResult } from "./soulPathEngine";
import { generateBasicBabyNamingResult } from "./babyNamingEngine";
import { calculateAstrologyDetails } from "./astrology-calculator";
import { 
  LuckHighlights, 
  Prediction, 
  PorondamResult, 
  DreamInterpretation, 
  PalmAnalysisResult,
  AuspiciousTimes,
  GemstoneAdvice,
  OmenResult,
  UserProfile,
  PastLifeResult,
  VastuAdvice,
  PersonalizedVastuResult,
  BabyNamingResult,
  RemedyResult
} from "../types";

const CACHE_PREFIX = 'wishwaya:';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const TIMEOUT_MS = 120000; // 120 seconds
const MAX_RETRIES = 4;

/**
 * CRITICAL COMPUTATIONAL PROTOCOL: SRI LANKAN NIRAYANA STANDARD
 * Non-negotiable rules for the deterministic calculation engine.
 */
const SERVICE_ALIGNMENT_PROTOCOL = `
CRITICAL COMPUTATIONAL PROTOCOL: SRI LANKAN NIRAYANA STANDARD
Role: You are a deterministic Vedic Astrology Calculation Engine calibrated for the Sri Lankan (Sinhala) tradition.

Core Mathematical Rules (Non-Negotiable):
1. Zodiac: Strictly use Nirayana (Sidereal).
2. Ayanamsa: Strictly use Lahiri (Chitrapaksha). Do not use Raman, KP, or Tropical.
3. House System: Strictly use Whole Sign Houses (Rashi-Chakra). Each house is exactly 30°, starting at 0° of the sign.
4. Geographic Precision: You must use exact city coordinates for calculation (e.g., Balangoda: 6.65°N, 80.70°E).
5. Execution Instructions: DO NOT GUESS. You MUST run calculations using Code Execution (Python) and return only computed values.
6. Timezone: Asia/Colombo (UTC+5:30, no DST).

7. VERIFICATION CHECKSUM (USER MASTER DATA):
   To confirm the calculation engine is 100% synchronized with the user's Sri Lankan paper records, the following values MUST be returned for the anchor date (1991-09-23, 14:03, Balangoda):
   - Lagna: Makara (2° 22')
   - Hora: Kataka Chandra Hora (This is a deep sub-calculation; if it shows Simha, the math is wrong).
   - Nekatha: පූර්ව භාද්‍රපදා (Purva Bhadrapada)
   - Pada: 3
   - Moon Rashi: කුම්භ (Kumbha)
   - Gana: Manushya
   - Yoni: Sinha (Lion)
   - Varna: Brahmana

8. NAKSHATRA PADA CALCULATION PROTOCOL (STRICT MATH):
   - Use the Moon’s absolute Nirayana (Sidereal) longitude (0–360°), not degree within sign.
   - Do NOT round or use toFixed() before calculating Pada.
   - Nakshatra length = 13°20′ (13.3333333333°).
   - Pada length = 3°20′ (3.3333333333°).
   - Python Logic:
     withinNakshatra = moonLongitude % 13.3333333333
     pada = floor((withinNakshatra / 3.3333333333) + 1e-9) + 1
   - Ensure the result is strictly 1, 2, 3, or 4. Use the floating-point guard (1e-9) to prevent Pada becoming 5.

Instruction: If your Python code execution results in different values for any of the above (especially the checksum), you must adjust the Ayanamsa offset or Local Mean Time calculation until these specific markers are met. Do not provide any analysis until these markers match 100%.

Service Protocols:
- Porondam: Matching must be based on the exact Lunar Mansion (Nakshatra) and Padaya derived from the rules above.
- Output Display Rules:
    a) For "විස්තරාත්මක විග්‍රහය" (Detailed Analysis/Predictions): Provide LONGER, extensive, and in-depth details on each card. 
       CRITICAL CONTENT RULE: BALANCED PERSPECTIVE. Avoid purely positive analysis.
       For every prediction card, strictly maintain a balance of approximately 55%-65% positive/good results (සුබ ඵල) and 35%-45% warnings, challenges, or risks (අවාසි, බාධා, හෝ අනතුරු ඇඟවීම්).
       MANDATORY INSTRUCTION: In each card description, clearly mention that practicing good behaviors, mindfulness, and positive actions (යහපත් හැසිරීම් සහ ක්‍රියාවන්) can effectively reduce or mitigate the predicted negative influences.
    b) For "සතියේ සුබ අසුබ" (Weekly Luck Highlights): Provide EXACT, precise, and accurate details without fluff.
- Language: High-quality Sinhala.
- Disclosure: Include "Calculated using Sri Lankan Nirayana Lahiri System" in general sections.
`;

/**
 * Helper to get dynamic time context for caching and prompts
 */
const getTimeContext = () => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start on Sunday
  const weekKey = startOfWeek.toISOString().split('T')[0];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  const weekRange = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  return { monthKey, monthName, weekKey, weekRange };
};

/**
 * Generates a stable ID for the user to key cache entries.
 */
const getUserHash = (profile: UserProfile | null): string => {
  if (!profile) return 'guest';
  const raw = `${profile.dob}|${profile.birthTime}|${profile.city}`;
  return btoa(raw).replace(/[/+=]/g, '').slice(0, 16);
};

/**
 * Cache Management
 */
const getCache = <T>(userHash: string, key: string): T | null => {
  const fullKey = `${CACHE_PREFIX}${userHash}:${key}`;
  const cached = localStorage.getItem(fullKey);
  if (!cached) return null;
  
  try {
    const entry = JSON.parse(cached);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(fullKey);
      return null;
    }
    return entry.data as T;
  } catch {
    return null;
  }
};

const setCache = (userHash: string, key: string, data: any) => {
  const fullKey = `${CACHE_PREFIX}${userHash}:${key}`;
  const entry = {
    data,
    createdAt: Date.now(),
    expiresAt: Date.now() + CACHE_TTL
  };
  localStorage.setItem(fullKey, JSON.stringify(entry));
};

export const clearUserCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};

const createBrowserGeminiClient = () => ({
  models: {
    generateContent: async (params: any) => {
      let contents = params.contents;
      if (typeof contents === 'string') {
        contents = [{ role: 'user', parts: [{ text: contents }] }];
      } else if (contents && !Array.isArray(contents)) {
        contents = [contents];
      }

      const config = params.config || {};
      const { tools: configTools, ...generationConfig } = config;
      const tools = params.tools || configTools;

      const response = await fetch(`${window.location.origin}/api-proxy/v1beta/models/${params.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig,
          ...(tools ? { tools } : {})
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          data?.error?.message ||
          data?.message ||
          data?.error ||
          `Proxy error: ${response.status}`;
        throw new Error(message);
      }

      return {
        text: data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      };
    }
  }
});

/**
 * Unified execution engine with retry logic and fallback support
 */
async function executeGeminiRequest<T>(
  profile: UserProfile | null,
  featureKey: string | null,
  fn: (ai: any) => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  const userHash = profile ? getUserHash(profile) : 'anonymous';
  
  if (featureKey) {
    const cachedData = getCache<T>(userHash, featureKey);
    if (cachedData) return cachedData;
  }

  const ai = createBrowserGeminiClient();

  const attempt = async (remRetries: number, delay: number): Promise<T> => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), TIMEOUT_MS)
      );

      const result = await Promise.race([fn(ai), timeoutPromise]) as T;
      
      if (featureKey) {
        setCache(userHash, featureKey, result);
      }
      return result;
    } catch (error: any) {
      const isTimeout = error.message === "TIMEOUT";
      const status = error?.status || 0;
      
      const isRetryable = isTimeout || [429, 500, 502, 503, 504].includes(status) || 
                          error?.message?.toLowerCase().includes('demand') ||
                          error?.message?.toLowerCase().includes('unavailable') ||
                          error?.message?.toLowerCase().includes('exhausted');

      if (remRetries > 0 && isRetryable) {
        await new Promise(r => setTimeout(r, delay));
        return attempt(remRetries - 1, delay * 2);
      }

      if (status === 503 || error?.message?.includes('demand')) {
        throw new Error("විශ්වයේ දත්ත පද්ධතිය මේ වන විට කාර්යබහුලයි. කරුණාකර තව සුළු මොහොතකින් නැවත උත්සාහ කරන්න.");
      }
      if (status === 429) {
        throw new Error("සේවා සීමාව ඉක්මවා ඇත. පසුව උත්සාහ කරන්න.");
      }
      if (isTimeout) {
        throw new Error("සම්බන්ධතාවය ප්‍රමාද වැඩියි. නැවත උත්සාහ කරන්න.");
      }
      
      throw new Error(error?.message || "සේවාදායකයේ තාවකාලික දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
  };

  return attempt(retries, 2500); 
}

function safeJsonParse<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (e) {
    return fallback;
  }
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(item => typeof item === 'string' ? item.trim() : String(item ?? '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n|]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

function ensureString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map(item => ensureString(item))
      .filter(Boolean)
      .join('\n');
  }

  if (value && typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  if (value == null) {
    return '';
  }

  return String(value).trim();
}

function generateFallbackLuckHighlights(profile: UserProfile): LuckHighlights {
  const rashi = profile.rashi || 'Aries';
  const directions: Record<string, { good: string; caution: string; color: string; number: string }> = {
    Aries: { good: 'East', caution: 'West', color: 'Red', number: '9' },
    Taurus: { good: 'South', caution: 'North', color: 'White', number: '6' },
    Gemini: { good: 'West', caution: 'South', color: 'Green', number: '5' },
    Cancer: { good: 'North', caution: 'South-East', color: 'Silver', number: '2' },
    Leo: { good: 'East', caution: 'North', color: 'Gold', number: '1' },
    Virgo: { good: 'South-West', caution: 'North-East', color: 'Green', number: '5' },
    Libra: { good: 'West', caution: 'East', color: 'Pink', number: '6' },
    Scorpio: { good: 'North', caution: 'West', color: 'Maroon', number: '9' },
    Sagittarius: { good: 'North-East', caution: 'South', color: 'Yellow', number: '3' },
    Capricorn: { good: 'South', caution: 'North-East', color: 'Blue', number: '8' },
    Aquarius: { good: 'West', caution: 'South-East', color: 'Sky Blue', number: '8' },
    Pisces: { good: 'North-East', caution: 'South-West', color: 'Yellow', number: '3' },
  };

  const base = directions[rashi] || directions.Aries;

  return {
    auspiciousDirection: ({
      East: 'නැගෙනහිර',
      West: 'බටහිර',
      North: 'උතුර',
      South: 'දකුණ',
      'North-East': 'ඊසාන',
      'South-East': 'ගිණිකොන',
      'South-West': 'නිරිත',
    } as Record<string, string>)[base.good] || base.good,
    inauspiciousDirection: ({
      East: 'නැගෙනහිර',
      West: 'බටහිර',
      North: 'උතුර',
      South: 'දකුණ',
      'North-East': 'ඊසාන',
      'South-East': 'ගිණිකොන',
      'South-West': 'නිරිත',
    } as Record<string, string>)[base.caution] || base.caution,
    luckyDays: ['සඳුදා', 'බ්‍රහස්පතින්දා'],
    luckyTimes: ['පෙ.ව. 7:30 - පෙ.ව. 9:00', 'ප.ව. 6:00 - ප.ව. 7:00'],
    luckyColors: [({
      Red: 'රතු',
      White: 'සුදු',
      Green: 'කොළ',
      Silver: 'රිදී',
      Gold: 'රන්',
      Pink: 'රෝස',
      Maroon: 'තද රතු',
      Yellow: 'කහ',
      Blue: 'නිල්',
      'Sky Blue': 'ලා නිල්',
    } as Record<string, string>)[base.color] || base.color, 'සුදු'],
    luckyNumber: base.number,
    weeklyHighlight: `මෙම සතියේ ${rashi} ලග්නය සඳහා වැදගත් අරමුණු වෙත සන්සුන්ව සහ අවධානයෙන් ගමන් කිරීම සුබය.`,
  };
}

function generateFallbackPredictions(profile: UserProfile): Prediction {
  const rashi = profile.rashi || 'Aries';

  return {
    characterTraits: `මෙම මාසයේ ${rashi} ලග්නයට නායකත්ව ගුණ, තද හැඟීම් සහ ස්ථිර තීරණ ගැනීමේ අවශ්‍යතාව පෙනේ.`,
    health: `මෙම මාසයේ ශක්තිය උච්චාවචනය විය හැක. හොඳ ප්‍රතිඵල සඳහා නින්ද, ආහාර වේලාව සහ මානසික පීඩනය සමබරව තබාගන්න.`,
    career: `වැඩ කටයුතු ඉදිරියට යා හැක. නමුත් සාර්ථකත්වය සඳහා ඉවසීම, හොඳ සන්නිවේදනය සහ හදිසි තීරණ වලින් වැළකීම වැදගත්ය.`,
    wealth: `මුදල් පැත්තෙන් මෙය සාමාන්‍ය කාලයකි. අනවශ්‍ය වියදම් පාලනය කර නව ආයෝජන කිරීමට පෙර හොඳින් සලකා බලන්න.`,
    love: `සන්සුන් කතාබහ තුළින් සම්බන්ධතා හොඳ විය හැක. අහංකාරය, නිහඬතාව හෝ වැඩිපුර සිතීම නිසා ඇතිවන වැරදි අවබෝධ වලින් වළකින්න.`,
    education: `අනුශාසනය තිබේ නම් ඉගෙනීම සහ අවධානය වැඩි දියුණු වේ. අවධානය බිඳවන දේ අඩු කර දිනපතා පැහැදිලි පාඩම් සැලැස්මක් තබාගන්න.`,
    general: `මෙම මාසයේ මිශ්‍ර නමුත් පාලනය කළ හැකි බලපෑම් ඇත. හොඳ පුරුදු, සිහිකල්පනාව සහ වේලාවට කරන ක්‍රියා බොහෝ අසුබ බලපෑම් අඩු කරයි.`,
    mahaDasha: `ප්‍රධාන දශා කාලයේ බලපෑම් ස්ථාවර ලෙස පෙනේ. හදිසි විශාල වෙනසකට වඩා ටිකෙන් ටික දියුණුව ලැබේ.`,
    antaraDasha: `අතුරු දශා බලපෑම නිසා කෙටි කාලීන මානසික හෝ ප්‍රායෝගික පීඩනයක් ඇතිවිය හැක. එහෙත් සැලකිලිමත් ක්‍රියාවෙන් තත්වය ස්ථාවරව තබාගත හැක.`,
    planetaryPositions: `දැනට ග්‍රහ ගමන අනුව සමබරතාව, ඉවසීම සහ පෞද්ගලික වගකීම් ගැන වැඩි අවධානයක් අවශ්‍ය බව පෙනේ.`,
    adviceRemedies: `ඉක්මනින් අවදි වන්න, සිතුවිලි ස්ථිරව තබාගන්න, අනවශ්‍ය ගැටුම් වලින් වළකින්න, සහ ආධ්‍යාත්මික හෝ සන්සුන් පුරුදු නිතිපතා අනුගමනය කරන්න.`,
    remedies: [],
  };
}

function generateFallbackDreamInterpretation(dreamText: string): DreamInterpretation {
  const normalized = dreamText.trim() || 'ඔබගේ සිහිනය';
  return {
    meaning: `${normalized} සම්බන්ධ සිහිනය ඔබගේ සිතේ පවතින බලාපොරොත්තු, සැඟවුණු බිය සහ ඉදිරි කාලය ගැන ඇති අවධානය පෙන්වයි. මෙය වහාම අසුබයක් නොව, ඔබගේ ජීවිතයේ යම් කරුණක් ගැන වඩාත් සිහිකල්පනාවෙන් බැලිය යුතු බව දක්වන ඉඟියක් ලෙස සැලකිය හැක.`,
    symbols: [
      {
        symbol: 'ප්‍රධාන සිහිනය',
        meaning: `${normalized} යන්න ඔබගේ දැනට සිතේ වැඩිපුරම තැන්ගෙන ඇති කාරණාවක්, පුද්ගලයෙක් හෝ අරමුණක් නිරූපණය කරයි.`,
      },
      {
        symbol: 'අභ්‍යන්තර පණිවිඩය',
        meaning: 'ඔබගේ යටි සිත ඔබට සන්සුන්ව, කල්පනාකාරීව සහ බියෙන් තොරව ඉදිරියට යාමට මතක් කරයි.',
      },
    ],
    spiritualContext: 'ආධ්‍යාත්මික පැත්තෙන් මෙය ඔබගේ මනස පිරිසිදු කරගෙන යහපත් සිතුවිලි වැඩි කරගත යුතු කාලයක් බව දක්වයි. පහන් දැල්වීම, පිරිතක් ඇසීම හෝ මනස නිශ්චල කරන වතාවත් හොඳ ප්‍රතිඵල දේ.',
    psychologicalInsight: 'මනෝවිද්‍යාත්මකව බැලූ විට මෙම සිහිනය ඔබ තුළ ඇති නොකියූ හැඟීම්, අසම්පූර්ණ බලාපොරොත්තු හෝ සෑහෙන කාලයක් සිතට බරව තිබූ කාරණාවක් පිටතට එන ආකාරයක් විය හැක.',
    planetaryInfluence: 'ග්‍රහ බලපෑම් අනුව චන්ද්‍රයා සහ බුධ බලය සිතුවිලි, මතකය සහ හැඟීම් වැඩි කර ඇති බවක් පෙනේ. එබැවින් තීරණ ගැනීමේදී හදිසි නොවී සන්සුන්ව ක්‍රියා කිරීම වඩා සුදුසුය.',
    actionableAdvice: 'උදෑසන මෙම සිහිනය ගැන කෙටි සටහනක් ලියන්න. ඉන්පසු ඔබට සැබවින්ම බරක් දෙන කාරණා මොනවාදැයි හඳුනාගෙන ඒවා සන්සුන්ව විසඳා ගැනීමට කුඩා පියවරක් ගන්න.',
  };
}

function generateFallbackPalmAnalysis(gender: string): PalmAnalysisResult {
  const handFocus = gender === 'female' ? 'වම් අත' : 'දකුණු අත';
  return {
    archetype: 'ශක්තිමත් උත්සාහශීලී චරිතය',
    handShape: `${handFocus} තුළින් පෙනෙන අතේ හැඩය අනුව ඔබ වැඩට කැපවෙන, ඉවසීමෙන් ගොඩනැගීම් කරන සහ අවස්ථාව ලැබූ විට ඉක්මනින් ඉදිරියට යන පුද්ගලයෙකු ලෙස පෙනේ.`,
    heartLineDetail: 'හෘදය රේඛාව අනුව හැඟීම් ගැඹුරින් දැනෙන නමුත් ඒවා හැම විටම පිටතට නොපෙන්වන ස්වභාවයක් ඇත. විශ්වාසය ලැබුණ විට ආදරය සහ අවබෝධය හොඳින් පෙන්වයි.',
    headLineDetail: 'ශීර්ෂ රේඛාව මනස වැඩ කරන ආකාරය පෙන්වයි. ඔබට ප්‍රායෝගිකව කල්පනා කිරීමේ හැකියාව ඇත, නමුත් කීප විටෙක වැඩිපුර සිතීම හෝ තීරණ ප්‍රමාද වීම ඇතිවිය හැක.',
    lifeLineDetail: 'ජීවන රේඛාවෙන් පෙනෙන්නේ ඔබ තුළ හොඳ ජීව ශක්තියක් සහ නැවත නැගී සිටීමේ හැකියාවක් ඇති බවයි. නින්ද, ආහාර සහ විවේකය සමබරව තබාගතහොත් මේ ශක්තිය තවත් වර්ධනය වේ.',
    fateLineDetail: 'දෛව රේඛාව අනුව ජීවිතය ක්‍රමයෙන් උසස් කරගන්නා ගමනක් පෙනේ. හදිසි වාසියකට වඩා අඛණ්ඩ උත්සාහයෙන් ලැබෙන දියුණුව ඔබට වඩාත් සුබය.',
    mountsAnalysis: 'ග්‍රහ මණ්ඩල බලය සලකා බැලූ විට කාර්යශීලීත්වය, කැපවීම සහ අභ්‍යන්තර ආශාව හොඳින් පෙනේ. එහෙත් ඉවසීම සහ සන්සුන් බව වැඩි කරගන්නේ නම් වඩා හොඳ ප්‍රතිඵල ලැබේ.',
    specialMarkings: 'විශේෂ සලකුණු පැහැදිලිව නොපෙනුණද, අතේ සමස්ත රේඛා රටාව ඔබට නිවැරදි පුරුදු තුළින් ජීවිතය හොඳ අතට හැරවිය හැකි බව දක්වයි.',
    synthesisAdvice: 'ඔබගේ අත්ල අනුව ප්‍රධාන පණිවිඩය වන්නේ ඉක්මන් නොවී, නියමිත අරමුණු තබාගෙන, දිගටම උත්සාහ කිරීමයි. සන්සුන් සිත, හොඳ පුරුදු සහ නිතිපතා වගකීම් ඉටු කිරීම ඔබගේ සුබ දියුණුව වැඩි කරයි.',
  };
}

function generateFallbackVastuAdvice(profile: UserProfile): VastuAdvice {
  return {
    entranceDirection: `${profile.rashi || 'ඔබගේ ලග්නය'} අනුව ප්‍රධාන දොරටුව නැගෙනහිර හෝ උතුරු දිශාවට ආසන්නව තබාගන්නේ නම් වඩා සුබය.`,
    bedroomPlacement: 'ප්‍රධාන නිදන කාමරය නිරිත දිශාවට තැබීම ස්ථිරත්වය සහ පවුල් සමබරතාවයට හොඳය.',
    wealthStorage: 'මුදල්, වැදගත් ලියවිලි සහ වටිනා දේ උතුරු හෝ ඊසාන පැත්තට ආසන්න පිරිසිදු තැනක තබාගන්න.',
    cautionNotes: 'නිවසේ මැද කොටස බරින් පිරවීම, අඳුරු බව, හෝ අවුල් සහගත තත්වය අඩු කරගන්න.',
    constructionStartTime: 'ඉදිකිරීම් හෝ අලුත්වැඩියා සඳහා උදෑසන සුබ වෙලාවක ආරම්භ කිරීම සහ පූජා කටයුත්තකින් ආරම්භ කිරීම වඩා යහපත්ය.',
    remedySuggestion: 'පිරිසිදුකම, ආලෝකය, වාතය ගැලීම සහ ආගමික ආශීර්වාද එක් කිරීමෙන් බොහෝ වාස්තු දෝෂ සනසවා ගත හැක.',
  };
}

function buildFallbackBirthDetails(dob: string, time: string): Partial<UserProfile> {
  const astro = calculateAstrologyDetails(dob, time || '00:00');
  const lordMap: Record<string, string> = {
    Aries: 'කුජ',
    Taurus: 'ශුක්‍ර',
    Gemini: 'බුධ',
    Cancer: 'චන්ද්‍ර',
    Leo: 'රවි',
    Virgo: 'බුධ',
    Libra: 'ශුක්‍ර',
    Scorpio: 'කුජ',
    Sagittarius: 'ගුරු',
    Capricorn: 'ශනි',
    Aquarius: 'ශනි',
    Pisces: 'ගුරු',
  };
  const moonMap: Record<string, string> = {
    Aries: 'මේෂ',
    Taurus: 'වෘෂභ',
    Gemini: 'මිථුන',
    Cancer: 'කටක',
    Leo: 'සිංහ',
    Virgo: 'කන්‍යා',
    Libra: 'තුලා',
    Scorpio: 'වෘශ්චික',
    Sagittarius: 'ධනු',
    Capricorn: 'මකර',
    Aquarius: 'කුම්භ',
    Pisces: 'මීන',
  };
  const ganaMap: Record<string, string> = {
    'අස්විද': 'දේව ගණය',
    'බෙරණ': 'මනුෂ්‍ය ගණය',
    'කැති': 'රාක්ෂස ගණය',
    'රෙහෙණ': 'මනුෂ්‍ය ගණය',
    'මුවසිරස': 'දේව ගණය',
    'අද': 'මනුෂ්‍ය ගණය',
    'පුනාවස': 'දේව ගණය',
    'පුෂ': 'දේව ගණය',
    'අස්ලිස': 'රාක්ෂස ගණය',
    'මා': 'රාක්ෂස ගණය',
    'පුවපල්': 'මනුෂ්‍ය ගණය',
    'උත්පල්': 'මනුෂ්‍ය ගණය',
    'හත': 'දේව ගණය',
    'සිත': 'රාක්ෂස ගණය',
    'සා': 'දේව ගණය',
    'විසා': 'රාක්ෂස ගණය',
    'අනුර': 'දේව ගණය',
    'දෙට': 'රාක්ෂස ගණය',
    'මුල': 'රාක්ෂස ගණය',
    'පුවසල': 'මනුෂ්‍ය ගණය',
    'උත්සල': 'මනුෂ්‍ය ගණය',
    'සුවණ': 'දේව ගණය',
    'දෙනට': 'රාක්ෂස ගණය',
    'සියාවස': 'රාක්ෂස ගණය',
    'පුවපුටුප': 'මනුෂ්‍ය ගණය',
    'උත්පුටුප': 'මනුෂ්‍ය ගණය',
    'රේවතී': 'දේව ගණය',
  };

  return {
    rashi: astro.rashi,
    lagna: astro.rashi,
    nekatha: astro.nekatha,
    lagnaAdhipathi: lordMap[astro.rashi] || 'කුජ',
    janmaRashiya: moonMap[astro.rashi] || astro.rashi,
    rashyadhipathi: lordMap[astro.rashi] || 'කුජ',
    nekathPadaya: `${astro.pada} වන පාදය`,
    gana: ganaMap[astro.nekatha] || 'දේව ගණය',
  };
}

export const analyzeRashiChakra = async (base64Image: string): Promise<string> => {
  try {
    return await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: `${SERVICE_ALIGNMENT_PROTOCOL}\nExtract the Rashi (Zodiac Sign) from this Sri Lankan Rashi Chakra. Deterministically verify against the validation anchor. Provide only the Rashi name in English (e.g. Leo). If unknown, return 'Aries'.` }
          ]
        },
        config: {
          tools: [{codeExecution: {}}]
        }
      });
      return response.text?.trim() || "Aries";
    });
  } catch (err) {
    console.warn("Gemini scan failed for Rashi Chakra, using safe fallback.", err);
    return "Aries";
  }
};

export const calculateRashiFromDetails = async (dob: string, time: string, city: string): Promise<Partial<UserProfile>> => {
  const fallback = buildFallbackBirthDetails(dob, time);
  try {
    const result = await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nCalculate all birth details for birth on ${dob} at ${time} in ${city}.
        Use the anchor reference to ensure 100% mathematical accuracy. You MUST use Python to perform these astronomical calculations.
        Return the following fields in JSON format:
        - rashi: English name of the Lagna/Ascendant (e.g. "Capricorn", "Aries")
        - nekatha: Sinhala name of the Nakshatra (නැකත)
        - lagnaAdhipathi: Sinhala name of the Lagna Lord (ලග්නාධිපති)
        - janmaRashiya: Sinhala name of the Moon Sign (ජන්ම රාශිය)
        - rashyadhipathi: Sinhala name of the Rashi Lord (රාශ්‍යාධිපති)
        - nekathPadaya: Sinhala Nakshatra Pada (නැකත් පාදය, e.g. "3 වන පාදය")
        - gana: Sinhala Gana (ගණය, e.g. "දේව ගණය")`,
        config: {
          tools: [{codeExecution: {}}],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rashi: { type: Type.STRING },
              nekatha: { type: Type.STRING },
              lagnaAdhipathi: { type: Type.STRING },
              janmaRashiya: { type: Type.STRING },
              rashyadhipathi: { type: Type.STRING },
              nekathPadaya: { type: Type.STRING },
              gana: { type: Type.STRING },
            },
            required: ["rashi", "nekatha", "lagnaAdhipathi", "janmaRashiya", "rashyadhipathi", "nekathPadaya", "gana"]
          }
        }
      });
      return safeJsonParse(response.text, fallback as Partial<UserProfile>);
    });
    return { ...fallback, ...result };
  } catch (err) {
    console.warn("Gemini birth detail calculation failed, using local engine.", err);
    return fallback;
  }
};

export const getLuckHighlights = async (profile: UserProfile): Promise<LuckHighlights> => {
  const { weekKey, weekRange } = getTimeContext();
  try {
    return await executeGeminiRequest(profile, `highlights_v4_${weekKey}`, async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nGenerate "සතියේ සුබ අසුබ" (Weekly Luck Highlights) for ${profile.rashi} for the week of ${weekRange}.
      IMPORTANT: Provide EXACT, precise, and deterministic details. No general fillers.
      Mention: "Calculated using Sri Lankan Nirayana Lahiri System".
      All values in Sinhala.`,
      config: {
        tools: [{codeExecution: {}}],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            auspiciousDirection: { type: Type.STRING },
            inauspiciousDirection: { type: Type.STRING },
            luckyDays: { type: Type.ARRAY, items: { type: Type.STRING } },
            luckyTimes: { type: Type.ARRAY, items: { type: Type.STRING } },
            luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            luckyNumber: { type: Type.STRING },
            weeklyHighlight: { type: Type.STRING }
          },
          required: ["auspiciousDirection", "inauspiciousDirection", "luckyDays", "luckyTimes", "luckyColors", "luckyNumber", "weeklyHighlight"]
        }
      }
    });
    const parsed = safeJsonParse(response.text, {} as Partial<LuckHighlights>);
    const normalized = {
      auspiciousDirection: parsed.auspiciousDirection || '',
      inauspiciousDirection: parsed.inauspiciousDirection || '',
      luckyDays: ensureStringArray(parsed.luckyDays),
      luckyTimes: ensureStringArray(parsed.luckyTimes),
      luckyColors: ensureStringArray(parsed.luckyColors),
      luckyNumber: parsed.luckyNumber || '',
      weeklyHighlight: parsed.weeklyHighlight || '',
    };

    const hasContent =
      normalized.auspiciousDirection ||
      normalized.inauspiciousDirection ||
      normalized.luckyDays.length ||
      normalized.luckyTimes.length ||
      normalized.luckyColors.length ||
      normalized.luckyNumber ||
      normalized.weeklyHighlight;

      return hasContent ? normalized : generateFallbackLuckHighlights(profile);
    });
  } catch (err) {
    console.warn("Gemini failed for weekly luck, using local engine.", err);
    return generateFallbackLuckHighlights(profile);
  }
};

export const getSpiritualRemedies = async (profile: UserProfile): Promise<RemedyResult> => {
  // 1. Generate basic result from internal engine
  const baseResult = generateBasicRemedyResult(profile);

  // 2. Optional Gemini enhancement
  try {
    const enhanced = await executeGeminiRequest(profile, `remedies_hybrid_v1_${profile.rashi}`, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following spiritual remedies based on Sri Lankan astrology.
        Do NOT change the core remedies. Only improve the explanation, spiritual depth, and readability.
        User Profile: ${JSON.stringify(profile)}
        Base Data: ${JSON.stringify(baseResult)}
        Return JSON in Sinhala.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              remedies: {
                type: Type.OBJECT,
                properties: {
                  primary: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: { type: Type.STRING },
                      description: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["title", "type", "description", "reason", "steps"]
                  },
                  secondary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        description: { type: Type.STRING },
                        reason: { type: Type.STRING },
                      },
                      required: ["title", "type", "description", "reason"]
                    }
                  },
                  doAvoidNotes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        text: { type: Type.STRING },
                      },
                      required: ["type", "text"]
                    }
                  }
                },
                required: ["primary", "secondary", "doAvoidNotes"]
              },
              summary: {
                type: Type.OBJECT,
                properties: {
                  shortText: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ["shortText", "priority"]
              },
              aiEnhancedExplanation: { type: Type.STRING }
            },
            required: ["remedies", "summary", "aiEnhancedExplanation"]
          }
        }
      });
      const parsed = safeJsonParse(response.text, baseResult);
      return { ...baseResult, ...parsed };
    }, 1);

    if (enhanced) return enhanced;
  } catch (err) {
    console.warn("Gemini enhancement failed for Remedies, falling back to logical data.", err);
  }

  return baseResult;
};

export const getPredictions = async (profile: UserProfile): Promise<Prediction> => {
  const { monthName, monthKey } = getTimeContext();
  try {
    return await executeGeminiRequest(profile, `predictions_v7_${monthKey}`, async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nGenerate "විස්තරාත්මක විග්‍රහය" (Detailed Monthly Analysis) for ${profile.rashi} for ${monthName}.
      IMPORTANT: Provide LONGER, extensive, and highly detailed content for each category. Each card should have rich astrological insight. 
      CRITICAL: You MUST provide a balanced perspective for ALL categories (approx 55-65% good things, 35-45% warnings).
      Clearly state in each section that good behaviors and positive, mindful actions (යහපත් හැසිරීම්) can reduce or avoid the predicted negative influences.
      Return the following fields in Sinhala:
      1. characterTraits (Extensive personality breakdown with both strengths and weaknesses/flaws)
      2. health (Detailed physical and mental health guidance, including potential risks/ailments)
      3. career (Comprehensive professional forecast, including obstacles and workspace risks)
      4. wealth (In-depth financial outlook, including potential losses, debts or cautions)
      5. love (Rich relationship insights, including points of friction and misunderstandings)
      6. education (Thorough academic guidance, including areas of difficulty and distractions)
      7. general (Extensive summary including the standard disclosure statement and a balanced look at the month)
      8. mahaDasha (Comprehensive Vimshottari period effects, noting both good and bad periods)
      9. antaraDasha (In-depth sub-period analysis, noting both good and bad periods)
      10. planetaryPositions (Extensive notes on current planetary degrees and transits)
      11. adviceRemedies (Extensive ritualistic and spiritual advice to mitigate the mentioned risks)
      JSON output in Sinhala.`,
      config: {
        tools: [{codeExecution: {}}],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterTraits: { type: Type.STRING },
            health: { type: Type.STRING },
            career: { type: Type.STRING },
            wealth: { type: Type.STRING },
            love: { type: Type.STRING },
            education: { type: Type.STRING },
            general: { type: Type.STRING },
            mahaDasha: { type: Type.STRING },
            antaraDasha: { type: Type.STRING },
            planetaryPositions: { type: Type.STRING },
            adviceRemedies: { type: Type.STRING },
          },
          required: ["characterTraits", "health", "career", "wealth", "love", "education", "general", "mahaDasha", "antaraDasha", "planetaryPositions", "adviceRemedies"]
        }
      }
    });
    const parsed = safeJsonParse(response.text, {} as Partial<Prediction>);
    const normalized = {
      characterTraits: ensureString(parsed.characterTraits),
      health: ensureString(parsed.health),
      career: ensureString(parsed.career),
      wealth: ensureString(parsed.wealth),
      love: ensureString(parsed.love),
      education: ensureString(parsed.education),
      general: ensureString(parsed.general),
      mahaDasha: ensureString(parsed.mahaDasha),
      antaraDasha: ensureString(parsed.antaraDasha),
      planetaryPositions: ensureString(parsed.planetaryPositions),
      adviceRemedies: ensureString(parsed.adviceRemedies),
      remedies: Array.isArray(parsed.remedies) ? parsed.remedies : [],
    };

    const hasContent =
      normalized.characterTraits ||
      normalized.health ||
      normalized.career ||
      normalized.wealth ||
      normalized.love ||
      normalized.education ||
      normalized.general ||
      normalized.mahaDasha ||
      normalized.antaraDasha ||
      normalized.planetaryPositions ||
      normalized.adviceRemedies;

      return hasContent ? normalized : generateFallbackPredictions(profile);
    });
  } catch (err) {
    console.warn("Gemini failed for predictions, using local engine.", err);
    return generateFallbackPredictions(profile);
  }
};

export const getBabyNames = async (details: { dob: string, time: string, city: string, gender: string }): Promise<BabyNamingResult> => {
  // 1. Generate basic result from internal engine
  const baseResult = generateBasicBabyNamingResult(details);

  // 2. Optionally enhance with Gemini
  try {
    const enhancedResult = await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance these baby name suggestions based on birth details: ${details.dob} at ${details.time} in ${details.city}.
        The baby is a ${details.gender}.
        The calculated Nakshatra is ${baseResult.nakshatra} and Pada is ${baseResult.pada}.
        The recommended starting letters are: ${baseResult.recommendedLetters.join(', ')}.
        
        Current suggestions:
        ${details.gender === 'boy' ? baseResult.boyNames.map(n => n.name).join(', ') : baseResult.girlNames.map(n => n.name).join(', ')}

        Please:
        - Add 5-10 more modern, unique names for the recommended letters.
        - Ensure names match the gender: ${details.gender}.
        - Improve the astrologyInsight with more depth.
        - Keep the intro and amulet sections consistent with the base result.
        - Return the full updated JSON in Sinhala.
        
        Output JSON format:
        - intro: string
        - recommendedLetters: string[] (Use the ones provided: ${baseResult.recommendedLetters.join(', ')})
        - nakshatra: string
        - pada: string
        - boyNames: { name: string; meaning: string; letter: string }[] (Ensure letter is one of the recommended letters)
        - girlNames: { name: string; meaning: string; letter: string }[] (Ensure letter is one of the recommended letters)
        - astrologyInsight: string
        - amulet: { title: string; description: string }
        - rituals: string[]`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              recommendedLetters: { type: Type.ARRAY, items: { type: Type.STRING } },
              nakshatra: { type: Type.STRING },
              pada: { type: Type.STRING },
              boyNames: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    letter: { type: Type.STRING }
                  },
                  required: ["name", "meaning", "letter"]
                }
              },
              girlNames: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    letter: { type: Type.STRING }
                  },
                  required: ["name", "meaning", "letter"]
                }
              },
              astrologyInsight: { type: Type.STRING },
              amulet: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              },
              rituals: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["intro", "recommendedLetters", "nakshatra", "pada", "boyNames", "girlNames", "astrologyInsight", "amulet", "rituals"]
          }
        }
      });

      return safeJsonParse(response.text, baseResult);
    }, 1);
    
    // Ensure we don't lose the core recommended letters
    enhancedResult.recommendedLetters = baseResult.recommendedLetters;
    
    return enhancedResult;
  } catch (err) {
    console.warn("Gemini enhancement failed for baby names, using base result", err);
    return baseResult;
  }
};

export const getVastuAdvice = async (profile: UserProfile): Promise<VastuAdvice> => {
  const fallback = generateFallbackVastuAdvice(profile);
  try {
    const result = await executeGeminiRequest(profile, 'vastu_v3', async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nVastu guidance for Lagnaya: ${profile.rashi}. 
        Ensure directions align with Whole Sign House placements. Each section must be descriptive.
        Include "Calculated using Sri Lankan Nirayana Lahiri System".
        Return JSON in Sinhala.`,
        config: {
          tools: [{codeExecution: {}}],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              entranceDirection: { type: Type.STRING },
              bedroomPlacement: { type: Type.STRING },
              wealthStorage: { type: Type.STRING },
              cautionNotes: { type: Type.STRING },
              constructionStartTime: { type: Type.STRING },
              remedySuggestion: { type: Type.STRING },
            },
            required: ["entranceDirection", "bedroomPlacement", "wealthStorage", "cautionNotes", "constructionStartTime", "remedySuggestion"]
          }
        }
      });
      return safeJsonParse(response.text, fallback);
    });
    return { ...fallback, ...result };
  } catch (err) {
    console.warn("Gemini failed for Vastu advice, using local fallback.", err);
    return fallback;
  }
};

export const getPersonalizedVastuAnalysis = async (
  profile: UserProfile, 
  formData: any, 
  floorPlan?: { data: string, mimeType: string }
): Promise<PersonalizedVastuResult> => {
  const { monthKey } = getTimeContext();

  // 1. Generate basic result from internal logic
  const baseResult = generateBasicVastuResult(profile, formData, floorPlan);

  // 2. Optionally enhance with Gemini
  try {
    const enhanced = await executeGeminiRequest(profile, `vastu_hybrid_v1_${profile.rashi}_${monthKey}`, async (ai) => {
      const promptParts: any[] = [
        { text: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following deterministic Vastu analysis for Lagnaya: ${profile.rashi}.
        Do NOT change the core status (good/warning/neutral) or the basic recommendations.
        Only enrich the title, description, and final recommendations with deeper astrological insights and professional wording.
        Base Data: ${JSON.stringify(baseResult)}
        JSON in Sinhala.` }
      ];

      if (floorPlan) {
        promptParts.unshift({ inlineData: { data: floorPlan.data, mimeType: floorPlan.mimeType } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: promptParts },
        config: {
          tools: [{codeExecution: {}}],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              commonDetails: { type: Type.STRING },
              points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['good', 'warning', 'neutral'] },
                    recommendation: { type: Type.STRING },
                  },
                  required: ["title", "description", "status", "recommendation"]
                }
              },
              summaryTable: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    element: { type: Type.STRING },
                    bestDirection: { type: Type.STRING },
                  },
                  required: ["element", "bestDirection"]
                }
              },
              assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
              finalRecommendations: { type: Type.STRING },
            },
            required: ["commonDetails", "points", "summaryTable", "assumptions", "finalRecommendations"]
          }
        }
      });
      return safeJsonParse(response.text, baseResult);
    }, 1); // Use only 1 retry for speed

    if (enhanced && enhanced.points && enhanced.points.length > 0) {
      return enhanced;
    }
  } catch (err) {
    console.warn("Gemini enhancement failed for Vastu, falling back to logical data.", err);
  }

  // 3. Return base result if Gemini fails
  return baseResult;
};

export const getPastLifeReading = async (profile: UserProfile): Promise<PastLifeResult> => {
  // 1. Generate basic result from internal engine
  const baseResult = generateBasicSoulPathResult(profile);

  // 2. Optional Gemini enhancement
  try {
    const enhanced = await executeGeminiRequest(profile, `pastlife_hybrid_v1_${profile.rashi}`, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following Soul Path reading based on Sri Lankan astrology.
        Do NOT change the core themes. Only improve the spiritual depth, explanation, and readability.
        User Profile: ${JSON.stringify(profile)}
        Base Data: ${JSON.stringify(baseResult)}
        Return JSON in Sinhala.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pastKarmicThemes: { type: Type.STRING },
              inheritedStrengths: { type: Type.STRING },
              presentLessons: { type: Type.STRING },
              soulMission: { type: Type.STRING },
              practicalAdvice: { type: Type.STRING },
            },
            required: ["pastKarmicThemes", "inheritedStrengths", "presentLessons", "soulMission", "practicalAdvice"]
          }
        }
      });
      const parsed = safeJsonParse(response.text, baseResult);
      return { ...baseResult, ...parsed };
    }, 1);

    if (enhanced) return enhanced;
  } catch (err) {
    console.warn("Gemini enhancement failed for Soul Path, falling back to logical data.", err);
  }

  return baseResult;
};

export const getAuspiciousTimes = async (profile: UserProfile): Promise<AuspiciousTimes> => {
  const currentMonthIndex = new Date().getMonth();
  const { monthKey } = getTimeContext();

  // 1. Get logical data first
  const logicalData = getLogicalNekathForMonth(currentMonthIndex);
  
  const baseResult: AuspiciousTimes = {
    business: logicalData.business,
    travel: logicalData.travel,
    houseBuilding: logicalData.houseBuilding,
    marriage: logicalData.marriage,
  };

  // 2. Optionally enhance with Gemini
  try {
    const enhanced = await executeGeminiRequest(profile, `nekath_hybrid_v1_${monthKey}_${profile.rashi}`, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following deterministic Subha Nekath for Lagnaya: ${profile.rashi}.
        Do NOT change the core dates, times, or directions. Only enrich the text with astrological context and blessings.
        Base Data: ${JSON.stringify(baseResult)}
        Return JSON in Sinhala matching the exact keys: business, travel, houseBuilding, marriage.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              business: { type: Type.STRING },
              travel: { type: Type.STRING },
              houseBuilding: { type: Type.STRING },
              marriage: { type: Type.STRING },
            },
            required: ["business", "travel", "houseBuilding", "marriage"]
          }
        }
      });
      return safeJsonParse(response.text, baseResult);
    }, 1); // Use only 1 retry to keep it fast

    if (enhanced && enhanced.business && enhanced.travel && enhanced.houseBuilding && enhanced.marriage) {
      return enhanced;
    }
  } catch (err) {
    console.warn("Gemini enhancement failed for Nekath, falling back to logical data.", err);
  }

  // 3. Return base result if Gemini fails
  return baseResult;
};

export const getGemstoneAdvice = async (profile: UserProfile): Promise<GemstoneAdvice> => {
  // 1. Get logical result first
  const baseResult = generateBasicGemstoneAdvice(profile);

  // 2. Optionally enhance with Gemini
  try {
    const enhanced = await executeGeminiRequest(profile, `gems_hybrid_v1_${profile.rashi}`, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following deterministic Gemstone advice based on Sri Lankan astrology.
        Do NOT change the core gemstone recommendation. Only enrich the benefits, instructions, and professional wording.
        User Lagna: ${profile.rashi}
        Base Data: ${JSON.stringify(baseResult)}
        Return JSON in Sinhala.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gemstone: { type: Type.STRING },
              metal: { type: Type.STRING },
              finger: { type: Type.STRING },
              instructions: { type: Type.STRING },
              benefits: { type: Type.STRING },
              jewelryType: { type: Type.STRING },
              secondaryGemstone: { type: Type.STRING },
            },
            required: ["gemstone", "metal", "finger", "instructions", "benefits", "jewelryType", "secondaryGemstone"]
          }
        }
      });
      return safeJsonParse(response.text, baseResult);
    }, 1);

    if (enhanced && enhanced.gemstone) {
      return enhanced;
    }
  } catch (err) {
    console.warn("Gemini enhancement failed for Gemstones, falling back to logical data.", err);
  }

  // 3. Return base result if Gemini fails
  return baseResult;
};

export const enhancePorondamWithGemini = async (user1: UserProfile, user2: any, localResult: any): Promise<PorondamResult | null> => {
  return executeGeminiRequest(user1, null, async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the provided deterministic 20-Porondam Marriage Compatibility result.
      Do NOT change the matchingPercentage, the isMatch status of any term, or the core dosha/recommendations.
      Only enrich the 'description' and 'result' fields of the table with deeper astrological insights, and expand the dosha/recommendations with more spiritual guidance.
      P1 (User): ${JSON.stringify(user1)}, P2 (Partner): ${JSON.stringify(user2)}.
      Local Result to Enhance: ${JSON.stringify(localResult)}.
      Include "Calculated using Sri Lankan Nirayana Lahiri System".
      Return JSON in Sinhala.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchingPercentage: { type: Type.NUMBER },
            table: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  result: { type: Type.STRING },
                  isMatch: { type: Type.BOOLEAN }
                },
                required: ["name", "description", "result", "isMatch"]
              }
            },
            dosha: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["matchingPercentage", "table", "dosha", "recommendations"]
        }
      }
    });
    const enhanced = safeJsonParse(response.text, null as any);
    if (!enhanced) return null;
    
    // Ensure core logic isn't overridden by AI hallucinations
    // We map the enhanced descriptions back onto the local result structure
    const finalTable = localResult.table.map((localRow: any) => {
      // Try to find the corresponding enhanced row by name
      const enhancedRow = enhanced.table?.find((r: any) => r.name === localRow.name) || {};
      return {
        ...localRow,
        description: enhancedRow.description || localRow.description,
        result: enhancedRow.result || localRow.result
      };
    });

    const hasEnglishContent = (items: unknown) =>
      Array.isArray(items) && items.some((item) => typeof item === 'string' && /[A-Za-z]/.test(item));

    return {
      matchingPercentage: localResult.matchingPercentage,
      table: finalTable,
      dosha: enhanced.dosha?.length && !hasEnglishContent(enhanced.dosha) ? enhanced.dosha : localResult.dosha,
      recommendations: enhanced.recommendations?.length && !hasEnglishContent(enhanced.recommendations) ? enhanced.recommendations : localResult.recommendations
    };
  });
};

export const interpretDream = async (dreamText: string): Promise<DreamInterpretation> => {
  const fallback = generateFallbackDreamInterpretation(dreamText);
  try {
    const result = await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Interpret dream: "${dreamText}" based on Sri Lankan tradition. Give long, detailed insights. Return JSON in Sinhala.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meaning: { type: Type.STRING },
              symbols: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    symbol: { type: Type.STRING },
                    meaning: { type: Type.STRING }
                  },
                  required: ["symbol", "meaning"]
                }
              },
              spiritualContext: { type: Type.STRING },
              psychologicalInsight: { type: Type.STRING },
              planetaryInfluence: { type: Type.STRING },
              actionableAdvice: { type: Type.STRING },
            },
            required: ["meaning", "symbols", "spiritualContext", "psychologicalInsight", "planetaryInfluence", "actionableAdvice"]
          }
        }
      });
      return safeJsonParse(response.text, fallback);
    });
    return {
      ...fallback,
      ...result,
      symbols: Array.isArray(result.symbols) && result.symbols.length ? result.symbols : fallback.symbols,
    };
  } catch (err) {
    console.warn("Gemini failed for dream interpretation, using local fallback.", err);
    return fallback;
  }
};

export const analyzePalm = async (base64Image: string, gender: string): Promise<PalmAnalysisResult> => {
  const fallback = generateFallbackPalmAnalysis(gender);
  try {
    const result = await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: `Analyze palm based on Sri Lankan tradition. Gender: ${gender}. Provide very long, extensive details for every marking. Return JSON in Sinhala.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              archetype: { type: Type.STRING },
              handShape: { type: Type.STRING },
              heartLineDetail: { type: Type.STRING },
              headLineDetail: { type: Type.STRING },
              lifeLineDetail: { type: Type.STRING },
              fateLineDetail: { type: Type.STRING },
              mountsAnalysis: { type: Type.STRING },
              specialMarkings: { type: Type.STRING },
              synthesisAdvice: { type: Type.STRING },
            },
            required: [
              "archetype", "handShape", "heartLineDetail", "headLineDetail", 
              "lifeLineDetail", "fateLineDetail", "mountsAnalysis", 
              "specialMarkings", "synthesisAdvice"
            ]
          }
        }
      });
      return safeJsonParse(response.text, fallback);
    });
    return { ...fallback, ...result };
  } catch (err) {
    console.warn("Gemini failed for palm analysis, using local fallback.", err);
    return fallback;
  }
};

export const analyzeTraditionalOmen = async (type: 'birthmark' | 'lizard', input: string): Promise<OmenResult> => {
  // 1. Get logical result first
  const baseResult = matchOmen(type, input);

  // 2. Optionally enhance with Gemini
  try {
    const enhanced = await executeGeminiRequest(null, null, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nEnhance the following deterministic Omen prediction based on Sri Lankan tradition.
        Do NOT change the core prediction. Only enrich the context and remedy with deeper traditional insights and professional wording.
        Type: ${type}
        Input: ${input}
        Base Data: ${JSON.stringify(baseResult)}
        Return JSON in Sinhala.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prediction: { type: Type.STRING },
              context: { type: Type.STRING },
              remedy: { type: Type.STRING },
            },
            required: ["prediction", "context", "remedy"]
          }
        }
      });
      return safeJsonParse(response.text, baseResult);
    }, 1); // Use only 1 retry for speed

    if (enhanced && enhanced.prediction) {
      return enhanced;
    }
  } catch (err) {
    console.warn("Gemini enhancement failed for Omen, falling back to logical data.", err);
  }

  // 3. Return base result if Gemini fails
  return baseResult;
};

export const generateDailyRitual = async (
  profile: UserProfile,
  goal: string,
  dayNumber: number
): Promise<any> => {
  return executeGeminiRequest(profile, null, async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate Law of Attraction daily ritual for Day ${dayNumber}.
      User Goal: ${goal}.
      Astrology: Lagna ${profile.rashi}, Nakshatra ${profile.nekatha || 'Unknown'}.
      Language: Sinhala (or Singlish if appropriate for modern context).
      
      Output JSON ONLY:
      {
        "title": "දින ${dayNumber} විශ්ව පණිවිඩය",
        "universeMessage": "max 120 words inspiring message in Sinhala",
        "readAloudLine": "1-2 short powerful affirmation lines in Sinhala",
        "tasks": [
          {"type":"action","text":"simple action task in Sinhala"},
          {"type":"vibration","text":"feeling/visualization task in Sinhala"},
          {"type":"gratitude","text":"gratitude task in Sinhala"}
        ],
        "blessingLine": "short blessing in Sinhala"
      }
      
      Constraints:
      - universeMessage max 120 words
      - tasks must be simple & safe
      - no medical/legal claims
      - no guaranteed results
      - align suggestions with user astrology personality traits`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            universeMessage: { type: Type.STRING },
            readAloudLine: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["action", "vibration", "gratitude"] },
                  text: { type: Type.STRING }
                },
                required: ["type", "text"]
              }
            },
            blessingLine: { type: Type.STRING }
          },
          required: ["title", "universeMessage", "readAloudLine", "tasks", "blessingLine"]
        }
      }
    });
    return safeJsonParse(response.text, null);
  });
};
