
import { REMEDY_RULES, FALLBACK_REMEDY, RemedyRule } from '../data/remedyData';
import { UserProfile, RemedyResult } from '../types';

export const generateBasicRemedyResult = (profile: UserProfile): RemedyResult => {
  const rashi = profile.rashi || 'Unknown';
  
  let selectedRule: RemedyRule = FALLBACK_REMEDY;
  let apalaDetected = false;
  let conditionTags: string[] = [];

  if (['Capricorn', 'Aquarius', 'Pisces', 'Aries'].includes(rashi)) {
    selectedRule = REMEDY_RULES['Saturn_Apala'] || FALLBACK_REMEDY;
    apalaDetected = true;
    conditionTags.push('Saturn Erashtaka');
  }

  return {
    userConditionFactors: {
      apalaDetected,
      conditionTags,
      sourceFactors: {
        lagna: rashi,
        rashi: rashi,
        nekatha: profile.nekatha || 'Unknown'
      }
    },
    remedies: {
      primary: selectedRule.primaryRemedy,
      secondary: selectedRule.secondaryRemedies,
      doAvoidNotes: selectedRule.doAvoidNotes
    },
    summary: {
      shortText: apalaDetected 
        ? `ඔබගේ කේන්දරයට අනුව ${selectedRule.conditionSinhala} පවතින බැවින් මෙම වත්පිළිවෙත් අනුගමනය කිරීම සුදුසුය.`
        : 'විශේෂ අපල තත්ත්වයන් නොමැති වුවද, පොදු යහපත උදෙසා මෙම වත්පිළිවෙත් අනුගමනය කළ හැක.',
      priority: selectedRule.priority
    }
  };
};
