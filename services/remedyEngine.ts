import { REMEDY_RULES, FALLBACK_REMEDY, RemedyRule } from '../data/remedyData';
import { UserProfile, RemedyResult, RemedyAction } from '../types';

export const generateBasicRemedyResult = (profile: UserProfile): RemedyResult => {
  const rashi = profile.rashi || 'Unknown';
  const nekatha = profile.nekatha || 'Unknown';
  
  let selectedRule: RemedyRule = FALLBACK_REMEDY;
  let apalaDetected = false;
  let conditionTags: string[] = [];

  // Simple logic to simulate apala detection based on Rashi
  // In a real app, this would use a planetary calculation engine
  if (['Capricorn', 'Aquarius', 'Pisces', 'Aries'].includes(rashi)) {
    selectedRule = REMEDY_RULES['Saturn_Apala'];
    apalaDetected = true;
    conditionTags.push('Saturn Erashtaka');
  } else if (['Scorpio', 'Leo'].includes(rashi)) {
    selectedRule = REMEDY_RULES['Mars_Apala'];
    apalaDetected = true;
    conditionTags.push('Kuja Dosha Influence');
  } else if (['Gemini', 'Virgo'].includes(rashi)) {
    selectedRule = REMEDY_RULES['Rahu_Ketu_Apala'];
    apalaDetected = true;
    conditionTags.push('Rahu Period Influence');
  } else if (['Sagittarius', 'Cancer'].includes(rashi)) {
    selectedRule = REMEDY_RULES['Jupiter_Apala'];
    apalaDetected = true;
    conditionTags.push('Guru Apala');
  }

  return {
    userConditionFactors: {
      apalaDetected,
      conditionTags,
      sourceFactors: {
        lagna: rashi, // Using rashi as lagna for simplicity in this demo
        rashi: rashi,
        nekatha: nekatha
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
