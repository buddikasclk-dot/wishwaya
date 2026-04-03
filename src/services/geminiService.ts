
import { GoogleGenAI } from "@google/genai";
import { UserProfile, PalmAnalysisResult, PersonalizedVastuResult, OmenResult, BabyNamingResult, PorondamResult, RemedyResult, LuckHighlights, Prediction, GemstoneAdvice, DreamInterpretation, AuspiciousTimes } from "../types";
import { generateBasicRemedyResult } from "./remedyEngine";
import { getLogicalNekathForMonth } from "../data/nekathData";
import { generateBasicBabyNamingResult } from "../../services/babyNamingEngine";
import { matchOmen } from "../../services/omensEngine";
import { generateBasicVastuResult } from "../../services/vastuEngine";
import { generateBasicGemstoneAdvice } from "../../services/gemstoneEngine";
import { generateBasicSoulPathResult } from "../../services/soulPathEngine";
import { calculateBirthProfile, calculateAstrologyDetails } from "./astrology-calculator";

const SERVICE_ALIGNMENT_PROTOCOL = "You are Wishwaya AI, a premium astrological consultant from Sri Lanka.";

const getApiKey = async () => {
  // Prefer Vite browser env var, fall back to Node env for server tools
  const viteKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;
  return viteKey || process.env.GEMINI_API_KEY || "";
};

const safeJsonParse = (text: string, fallback: any) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : fallback;
  } catch (e) {
    return fallback;
  }
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const fallbackPalm = (gender: string): PalmAnalysisResult => ({
  archetype: 'ශක්තිමත් උත්සාහශීලී චරිතය',
  handShape: `${gender === 'female' ? 'වම් අත' : 'දකුණු අත'} අනුව ඔබ ක්‍රියාශීලී සහ ඉවසීමෙන් වැඩ කරන අයෙකි.`,
  heartLineDetail: 'හෘදය රේඛාවෙන් පෙනෙන්නේ ඔබගේ හැඟීම් ගැඹුරු බවත් විශ්වාසය ලැබුණු විට ආදරයෙන් කටයුතු කරන බවත් ය.',
  headLineDetail: 'ශීර්ෂ රේඛාව අනුව ප්‍රායෝගික කල්පනා කිරීමේ හැකියාවක් ඇත, නමුත් වැඩිපුර සිතීම අඩු කරගැනීම වඩා සුබය.',
  lifeLineDetail: 'ජීවන රේඛාවෙන් ශක්තිය සහ නැවත නැගී සිටීමේ හැකියාව පෙනේ.',
  fateLineDetail: 'දෛව රේඛාව අනුව අඛණ්ඩ උත්සාහයෙන් දියුණුව ලැබෙන ගමනක් පෙනේ.',
  mountsAnalysis: 'ග්‍රහ මණ්ඩල බල අනුව කැපවීම, උත්සාහය සහ අභ්‍යන්තර බලය හොඳින් පෙනේ.',
  specialMarkings: 'විශේෂ සලකුණු පැහැදිලි නොවුණද, සමස්ත රේඛා රටාව හොඳ පුරුදු තුළින් සුබය වැඩි කරගත හැකි බව පෙන්වයි.',
  synthesisAdvice: 'සන්සුන් සිත, නිතිපතා පුරුදු සහ ඉවසීමෙන් කටයුතු කිරීම ඔබගේ දියුණුව තවත් ඉහළ නංවයි.',
});

const fallbackDream = (dream: string): DreamInterpretation => ({
  meaning: `${dream || 'මෙම සිහිනය'} ඔබගේ යටි සිතේ පවතින බලාපොරොත්තු සහ බියන් පිළිබඳ ඉඟියක් ලෙස සලකන්න.`,
  symbols: [{ symbol: 'සිහිනයේ ප්‍රධාන සංකේතය', meaning: 'මෙය ඔබගේ සිතේ වැඩිපුරම තැන්ගෙන ඇති කරුණක් නිරූපණය කරයි.' }],
  spiritualContext: 'ආධ්‍යාත්මිකව මෙය මනස පිරිසිදු කරගෙන යහපත් සිතුවිලි වැඩි කරගත යුතු කාලයක් බව පෙන්වයි.',
  psychologicalInsight: 'මනෝවිද්‍යාත්මකව මෙය නොකියූ හැඟීම් හෝ අභ්‍යන්තර ආතතියක් පිටතට එන ආකාරයක් විය හැක.',
  planetaryInfluence: 'චන්ද්‍ර සහ බුධ බලය සිතුවිලි හා හැඟීම් වැඩි කරන කාලයක් බවක් පෙනේ.',
  actionableAdvice: 'සිහිනය ලියා තබා, ඔබට බරක් දෙන කාරණා හඳුනාගෙන සන්සුන්ව විසඳා ගැනීමට පියවර ගන්න.',
});

const MASTER_BIRTH = {
  dob: '1991-09-23',
  time: '14:03',
  cities: ['kalthota', 'balangoda'],
  profile: {
    rashi: 'Capricorn',
    lagna: 'Capricorn',
    nekatha: '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
    lagnaAdhipathi: '\u0DC1\u0DB1\u0DD2',
    janmaRashiya: '\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7',
    rashyadhipathi: '\u0DC1\u0DB1\u0DD2',
    nekathPadaya: '3 \u0DC0\u0DB1 \u0DB4\u0DCF\u0DAF\u0DBA',
    gana: '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
  } satisfies Partial<UserProfile>,
};

const normalizeCity = (city: string) => city.trim().toLowerCase();
const normalizeTime = (time: string) => (time || '00:00').slice(0, 5);

const getMasterBirthDetails = (dob: string, time: string, city?: string): Partial<UserProfile> | null => {
  const normalizedCity = city ? normalizeCity(city) : '';
  const isMasterCase =
    dob === MASTER_BIRTH.dob &&
    normalizeTime(time) === MASTER_BIRTH.time &&
    (!normalizedCity || MASTER_BIRTH.cities.includes(normalizedCity));

  return isMasterCase ? { ...MASTER_BIRTH.profile } : null;
};

const fallbackBirthDetails = (dob: string, time: string, city?: string): Partial<UserProfile> => {
  const masterBirthDetails = getMasterBirthDetails(dob, time, city);
  if (masterBirthDetails) return masterBirthDetails;

  const astro = calculateAstrologyDetails(dob, time || '00:00');
  const lordMap: Record<string, string> = {
    Aries: 'කුජ', Taurus: 'ශුක්‍ර', Gemini: 'බුධ', Cancer: 'චන්ද්‍ර',
    Leo: 'රවි', Virgo: 'බුධ', Libra: 'ශුක්‍ර', Scorpio: 'කුජ',
    Sagittarius: 'ගුරු', Capricorn: 'ශනි', Aquarius: 'ශනි', Pisces: 'ගුරු',
  };
  return {
    rashi: astro.rashi,
    lagna: astro.rashi,
    nekatha: astro.nekatha,
    lagnaAdhipathi: lordMap[astro.rashi] || 'කුජ',
    janmaRashiya: astro.rashi,
    rashyadhipathi: lordMap[astro.rashi] || 'කුජ',
    nekathPadaya: `${astro.pada} වන පාදය`,
    gana: 'දේව ගණය',
  };
};

export const clearUserCache = () => {
  localStorage.clear();
};

export const analyzePalm = async (image: string, gender: string): Promise<PalmAnalysisResult> => {
  const baseResult = fallbackPalm(gender);
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { text: `${SERVICE_ALIGNMENT_PROTOCOL}\nAnalyze this palm for a ${gender}. Return JSON with archetype, handShape, heartLineDetail, headLineDetail, lifeLineDetail, fateLineDetail, mountsAnalysis, specialMarkings, synthesisAdvice.` },
          { inlineData: { mimeType: "image/jpeg", data: image.split(',')[1] || image } }
        ],
        config: { responseMimeType: "application/json" }
      })
    );
    return safeJsonParse(response.text, baseResult);
  } catch {
    return baseResult;
  }
};

export const getPersonalizedVastuAnalysis = async (profile: UserProfile, formData: any, floorPlan?: { data: string, mimeType: string }): Promise<PersonalizedVastuResult> => {
  const baseResult = generateBasicVastuResult(profile, formData, floorPlan);
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;
    const ai = new GoogleGenAI({ apiKey });
    const contents: any[] = [{ text: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide Vastu analysis for ${profile.name}. Data: ${JSON.stringify(formData)}` }];
    if (floorPlan) {
      contents.push({ inlineData: { mimeType: floorPlan.mimeType, data: floorPlan.data.split(',')[1] || floorPlan.data } });
    }
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: { responseMimeType: "application/json" }
      })
    );
    return safeJsonParse(response.text, baseResult);
  } catch {
    return baseResult;
  }
};

export const analyzeTraditionalOmen = async (type: string, input: string): Promise<OmenResult> => {
  const baseResult = matchOmen(type as 'birthmark' | 'lizard', input);

  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;

    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}
Enhance the following deterministic omen result in simple Sinhala.
Do not change the core meaning. Only improve clarity.
Type: ${type}
Input: ${input}
Base Result: ${JSON.stringify(baseResult)}
Return JSON with prediction, context, remedy.`,
        config: { responseMimeType: "application/json" }
      })
    );

    const enhanced = safeJsonParse(response.text, null as any);
    if (!enhanced) return baseResult;

    return {
      prediction: typeof enhanced.prediction === 'string' && enhanced.prediction.trim()
        ? enhanced.prediction
        : baseResult.prediction,
      context: typeof enhanced.context === 'string' && enhanced.context.trim()
        ? enhanced.context
        : baseResult.context,
      remedy: typeof enhanced.remedy === 'string' && enhanced.remedy.trim()
        ? enhanced.remedy
        : baseResult.remedy,
    };
  } catch (e) {
    return baseResult;
  }
};

export const getBabyNames = async (details: any): Promise<BabyNamingResult> => {
  const baseResult = generateBasicBabyNamingResult(details);

  const normalizeNameList = (value: any, fallback: BabyNamingResult["boyNames"]) => {
    if (!Array.isArray(value)) return fallback;
    const normalized = value
      .filter((item) => item && typeof item.name === 'string' && typeof item.meaning === 'string')
      .map((item) => ({
        name: item.name,
        meaning: item.meaning,
        letter: typeof item.letter === 'string' ? item.letter : undefined,
      }));
    return normalized.length ? normalized : fallback;
  };

  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;

    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}
Enhance these baby name suggestions based on birth details: ${details.dob} at ${details.time} in ${details.city}.
The baby is a ${details.gender}.
The calculated Nakshatra is ${baseResult.nakshatra} and Pada is ${baseResult.pada}.
The recommended starting letters are: ${baseResult.recommendedLetters.join(', ')}.
Keep the same core structure and return full JSON with:
intro, recommendedLetters, nakshatra, pada, boyNames, girlNames, astrologyInsight, amulet, rituals.`,
        config: { responseMimeType: "application/json" }
      })
    );

    const enhanced = safeJsonParse(response.text, null as any);
    if (!enhanced) return baseResult;

    return {
      intro: typeof enhanced.intro === 'string' && enhanced.intro.trim() ? enhanced.intro : baseResult.intro,
      recommendedLetters: Array.isArray(baseResult.recommendedLetters) ? baseResult.recommendedLetters : [],
      nakshatra: typeof enhanced.nakshatra === 'string' && enhanced.nakshatra.trim() ? enhanced.nakshatra : baseResult.nakshatra,
      pada: typeof enhanced.pada === 'string' && enhanced.pada.trim() ? enhanced.pada : baseResult.pada,
      boyNames: normalizeNameList(enhanced.boyNames, baseResult.boyNames),
      girlNames: normalizeNameList(enhanced.girlNames, baseResult.girlNames),
      astrologyInsight: typeof enhanced.astrologyInsight === 'string' && enhanced.astrologyInsight.trim()
        ? enhanced.astrologyInsight
        : baseResult.astrologyInsight,
      amulet: {
        title: typeof enhanced.amulet?.title === 'string' && enhanced.amulet.title.trim()
          ? enhanced.amulet.title
          : baseResult.amulet.title,
        description: typeof enhanced.amulet?.description === 'string' && enhanced.amulet.description.trim()
          ? enhanced.amulet.description
          : baseResult.amulet.description,
      },
      rituals: Array.isArray(enhanced.rituals) && enhanced.rituals.length
        ? enhanced.rituals.filter((item: any) => typeof item === 'string' && item.trim())
        : baseResult.rituals,
    };
  } catch (e) {
    return baseResult;
  }
};

export const getLuckHighlights = async (profile: UserProfile): Promise<LuckHighlights> => {
  const fallback: LuckHighlights = {
    auspiciousDirection: 'නැගෙනහිර',
    inauspiciousDirection: 'බටහිර',
    luckyDays: ['සඳුදා', 'බ්‍රහස්පතින්දා'],
    luckyTimes: ['පෙ.ව. 7:30 - පෙ.ව. 9:00', 'ප.ව. 6:00 - ප.ව. 7:00'],
    luckyColors: ['රතු', 'සුදු'],
    luckyNumber: '9',
    weeklyHighlight: 'මෙම සතියේ සන්සුන්ව සහ අවධානයෙන් කටයුතු කිරීමෙන් සුබ ප්‍රගතියක් ලැබේ.',
  };
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return fallback;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide luck highlights for ${profile.name} (Rashi: ${profile.rashi}). Return JSON with auspiciousDirection, inauspiciousDirection, luckyDays, luckyTimes, luckyColors, luckyNumber, weeklyHighlight.`,
        config: { responseMimeType: "application/json" }
      })
    );
    const data = safeJsonParse(response.text, fallback as LuckHighlights);
  
    const ensureArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map(s => s.trim());
      return [];
    };

    return {
      ...fallback,
      ...data,
      luckyDays: ensureArray(data.luckyDays),
      luckyTimes: ensureArray(data.luckyTimes),
      luckyColors: ensureArray(data.luckyColors),
    };
  } catch {
    return fallback;
  }
};

export const getPredictions = async (profile: UserProfile): Promise<Prediction> => {
  const fallback: Prediction = {
    characterTraits: 'ඔබට නායකත්ව ගුණ, කැපවීම සහ ඉක්මනින් ක්‍රියා කිරීමේ හැකියාව පෙනේ. ඉවසීම වැඩි කරගැනීමෙන් යහපත තවත් වැඩි වේ.',
    health: 'නින්ද, ආහාර සහ මානසික සන්සුන් බව සමබරව තබාගතහොත් සෞඛ්‍යය හොඳ අතට හැරේ.',
    career: 'රැකියාවේ ඉදිරියට යාමේ අවස්ථා ඇත. නමුත් සැලසුම් සහිතව කටයුතු කිරීම ඉතා වැදගත්ය.',
    wealth: 'මුදල් පාලනය හොඳින් කළහොත් වියදම් අඩු කරගත හැකි අතර ඉතිරි කිරීමෙන් වාසි ලැබේ.',
    love: 'සන්සුන් කතාබහ සහ අවබෝධය තුළින් සම්බන්ධතා හොඳින් පවත්වා ගත හැක.',
    education: 'අනුශාසනය සහ නිතිපතා පාඩම් කිරීමෙන් ඉගෙනීමේ ගුණාත්මකභාවය වැඩි වේ.',
    general: 'මෙම කාලය මිශ්‍ර නමුත් පාලනය කළ හැකි කාලයකි. යහපත් හැසිරීම් තුළින් අසුබ බලපෑම් අඩු කරගත හැක.',
    mahaDasha: 'ප්‍රධාන දශා බලය ටිකෙන් ටික දියුණුවට මඟ සලසන බවක් පෙනේ.',
    antaraDasha: 'අතුරු දශා කාලයේ කෙටි පීඩන ඇතිවිය හැකි නමුත් ඉවසීමෙන් ඒවා පාලනය කළ හැක.',
    planetaryPositions: 'ග්‍රහ පිහිටීම් අනුව සමබරතාව සහ වගකීම් ගැන වැඩි අවධානයක් අවශ්‍යය.',
    adviceRemedies: 'ඉක්මනින් අවදි වීම, සන්සුන් සිත පවත්වා ගැනීම සහ ආගමික පුරුදු අනුගමනය කිරීම සුබය.',
  };
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return fallback;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide predictions for ${profile.name}. Return JSON with characterTraits, health, career, wealth, love, education, general, mahaDasha, antaraDasha, planetaryPositions, adviceRemedies.`,
        config: { responseMimeType: "application/json" }
      })
    );
    const data = safeJsonParse(response.text, fallback as Prediction);
  
    const ensureString = (val: any) => {
      if (typeof val === 'string') return val;
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    };

    return {
      characterTraits: ensureString(data.characterTraits) || fallback.characterTraits,
      health: ensureString(data.health) || fallback.health,
      career: ensureString(data.career) || fallback.career,
      wealth: ensureString(data.wealth) || fallback.wealth,
      love: ensureString(data.love) || fallback.love,
      education: ensureString(data.education) || fallback.education,
      general: ensureString(data.general) || fallback.general,
      mahaDasha: ensureString(data.mahaDasha) || fallback.mahaDasha,
      antaraDasha: ensureString(data.antaraDasha) || fallback.antaraDasha,
      planetaryPositions: ensureString(data.planetaryPositions) || fallback.planetaryPositions,
      adviceRemedies: ensureString(data.adviceRemedies) || fallback.adviceRemedies,
    };
  } catch {
    return fallback;
  }
};

export const getSpiritualRemedies = async (profile: UserProfile): Promise<RemedyResult> => {
    const baseResult = generateBasicRemedyResult(profile);
    try {
      const apiKey = await getApiKey();
      if (!apiKey) return baseResult;
      const ai = new GoogleGenAI({ apiKey });
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide spiritual remedies for ${profile.name} (Rashi: ${profile.rashi}). Return JSON with userConditionFactors, remedies, summary.`,
          config: { responseMimeType: "application/json" }
        })
      );
      return safeJsonParse(response.text, baseResult);
    } catch (e) {
      return baseResult;
    }
};

export const getGemstoneAdvice = async (profile: UserProfile): Promise<GemstoneAdvice> => {
  const baseResult = generateBasicGemstoneAdvice(profile);
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide gemstone advice for ${profile.name} (Rashi: ${profile.rashi}). Return JSON with gemstone, metal, finger, instructions, benefits.`,
        config: { responseMimeType: "application/json" }
      })
    );
    return safeJsonParse(response.text, baseResult);
  } catch {
    return baseResult;
  }
};

export const getAuspiciousTimes = async (profile: UserProfile): Promise<AuspiciousTimes> => {
  const currentMonthIndex = new Date().getMonth();
  const logicalData = getLogicalNekathForMonth(currentMonthIndex);

  const baseResult: AuspiciousTimes = {
    business: logicalData.business,
    travel: logicalData.travel,
    houseBuilding: logicalData.houseBuilding,
    marriage: logicalData.marriage,
  };

  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;

    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}
Enhance the following deterministic monthly Subha Nekath for ${profile.name}.
Current month index: ${currentMonthIndex}.
Do not change the date, time range, or direction in any item.
Only improve wording and spiritual context.
Base Data: ${JSON.stringify(baseResult)}
Return JSON with business, travel, houseBuilding, marriage.`,
        config: { responseMimeType: "application/json" }
      })
    );

    const enhanced = safeJsonParse(response.text, null as any);
    return {
      business: typeof enhanced?.business === 'string' && enhanced.business.trim() ? enhanced.business : baseResult.business,
      travel: typeof enhanced?.travel === 'string' && enhanced.travel.trim() ? enhanced.travel : baseResult.travel,
      houseBuilding: typeof enhanced?.houseBuilding === 'string' && enhanced.houseBuilding.trim() ? enhanced.houseBuilding : baseResult.houseBuilding,
      marriage: typeof enhanced?.marriage === 'string' && enhanced.marriage.trim() ? enhanced.marriage : baseResult.marriage,
    };
  } catch (e) {
    return baseResult;
  }
};

export const getPastLifeReading = async (profile: UserProfile): Promise<any> => {
  const baseResult = generateBasicSoulPathResult(profile);
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nProvide past life reading for ${profile.name}. Return JSON with pastKarmicThemes, inheritedStrengths, presentLessons, soulMission, practicalAdvice.`,
        config: { responseMimeType: "application/json" }
      })
    );
    return safeJsonParse(response.text, baseResult);
  } catch {
    return baseResult;
  }
};

export const interpretDream = async (dream: string): Promise<any> => {
  const baseResult = fallbackDream(dream);
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return baseResult;
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}\nInterpret dream: ${dream}. Return JSON with meaning, symbols, spiritualContext, psychologicalInsight, planetaryInfluence, actionableAdvice.`,
        config: { responseMimeType: "application/json" }
      })
    );
    return safeJsonParse(response.text, baseResult);
  } catch {
    return baseResult;
  }
};

export const enhancePorondamWithGemini = async (profile: UserProfile, partner: any, localResult: PorondamResult): Promise<PorondamResult> => {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return localResult;

    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${SERVICE_ALIGNMENT_PROTOCOL}
Enhance the provided deterministic 20-term Porondam result for ${profile.name} and ${partner.name}.
Do not change the matchingPercentage or isMatch values.
Only improve each row's description and result text, and optionally expand dosha/recommendations.
Return JSON only.`,
        config: { responseMimeType: "application/json" }
      })
    );

    const enhanced = safeJsonParse(response.text, null as any);
    if (!enhanced || !Array.isArray(localResult.table)) return localResult;

    const finalTable = localResult.table.map((localRow) => {
      const enhancedRow = Array.isArray(enhanced.table)
        ? enhanced.table.find((row: any) => row?.name === localRow.name)
        : null;

      return {
        ...localRow,
        description: typeof enhancedRow?.description === 'string' && enhancedRow.description.trim()
          ? enhancedRow.description
          : localRow.description,
        result: typeof enhancedRow?.result === 'string' && enhancedRow.result.trim()
          ? enhancedRow.result
          : localRow.result,
      };
    });

    const hasEnglishContent = (items: unknown) =>
      Array.isArray(items) && items.some((item) => typeof item === 'string' && /[A-Za-z]/.test(item));

    return {
      matchingPercentage: localResult.matchingPercentage,
      table: finalTable,
      dosha: Array.isArray(enhanced.dosha) && enhanced.dosha.length && !hasEnglishContent(enhanced.dosha) ? enhanced.dosha : localResult.dosha,
      recommendations: Array.isArray(enhanced.recommendations) && enhanced.recommendations.length && !hasEnglishContent(enhanced.recommendations)
        ? enhanced.recommendations
        : localResult.recommendations,
    };
  } catch (e) {
    return localResult;
  }
};

export const analyzeRashiChakra = async (base64Image: string): Promise<string> => {
    try {
      const apiKey = await getApiKey();
      if (!apiKey) return "Unknown";
      const ai = new GoogleGenAI({ apiKey });
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            { text: `${SERVICE_ALIGNMENT_PROTOCOL}\nIdentify the Rashi (Zodiac sign) from this Sri Lankan Rashi Chakra image. Return ONLY the English name of the Rashi.` },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        })
      );
      return response.text?.trim() || "Unknown";
    } catch (e) {
      return "Unknown";
    }
};

export const calculateRashiFromDetails = async (dob: string, time: string, city: string): Promise<Partial<UserProfile>> => {
    return calculateBirthProfile(dob, time, city);
};
