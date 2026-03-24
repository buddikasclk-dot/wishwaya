
import { GEMSTONE_RULES, FALLBACK_GEMSTONE, GemstoneRule } from '../data/gemstoneData';
import { UserProfile, GemstoneAdvice } from '../types';

export const generateBasicGemstoneAdvice = (profile: UserProfile): GemstoneAdvice => {
  const lagna = profile.rashi || 'Unknown';
  const rule = GEMSTONE_RULES[lagna] || FALLBACK_GEMSTONE;

  return {
    gemstone: rule.gemstone,
    secondaryGemstone: rule.secondaryGemstone,
    metal: rule.metal,
    finger: rule.finger,
    instructions: rule.instructions,
    benefits: rule.benefits,
    jewelryType: rule.jewelryType
  };
};
