
import { SOUL_PATH_RULES, FALLBACK_SOUL_PATH, SoulPathRule } from '../data/soulPathData';
import { UserProfile, PastLifeResult } from '../types';

export interface SoulPathResultExtended extends PastLifeResult {
  userProfileFactors: {
    lagna: string;
    rashi: string;
    nekath: string;
    conditionTags: string[];
  };
  summary: {
    shortText: string;
    confidence: string;
  };
  aiEnhancedExplanation?: string;
}

export const generateBasicSoulPathResult = (profile: UserProfile): SoulPathResultExtended => {
  const rashi = profile.rashi || 'Unknown';
  const nekatha = profile.nekatha || 'Unknown';
  
  const rule: SoulPathRule = SOUL_PATH_RULES[rashi] || FALLBACK_SOUL_PATH;

  return {
    pastKarmicThemes: rule.pastKarmicThemes,
    inheritedStrengths: rule.inheritedStrengths,
    presentLessons: rule.presentLessons,
    soulMission: rule.soulMission,
    practicalAdvice: rule.practicalAdvice,
    userProfileFactors: {
      lagna: rashi,
      rashi: rashi,
      nekath: nekatha,
      conditionTags: []
    },
    summary: {
      shortText: `${rashi} ලග්නයට අනුව ඔබගේ ආත්මීය ගමන් මඟ සහ පෙර භවයන්හි කර්ම ශක්තීන් මෙසේ විශ්ලේෂණය කළ හැක.`,
      confidence: "High"
    }
  };
};
