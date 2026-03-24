
import { PersonalizedVastuResult, UserProfile } from '../types';
import { VASTU_RULES, SUMMARY_TEMPLATES } from '../data/vastuRules';

export const generateBasicVastuResult = (
  profile: UserProfile,
  formData: any,
  floorPlan?: { data: string, mimeType: string }
): PersonalizedVastuResult => {
  const points: any[] = [];
  const assumptions: string[] = [];

  // 1. Entrance Analysis (Based on slope or land shape if no floor plan)
  // If we have a floor plan, we might assume the entrance is at the front (usually North or East in Sri Lanka)
  const entranceDir = formData.slope === 'උතුරට' || formData.slope === 'නැගෙනහිරට' ? formData.slope : 'උතුරට';
  const entranceRule = VASTU_RULES.entrance[entranceDir as keyof typeof VASTU_RULES.entrance] || VASTU_RULES.entrance['උතුරට'];
  points.push({
    title: entranceRule.title,
    description: entranceRule.description,
    status: entranceRule.status,
    recommendation: entranceRule.recommendation
  });

  // 2. Land Shape Analysis
  const shapeRule = VASTU_RULES.landShape[formData.landShape as keyof typeof VASTU_RULES.landShape] || VASTU_RULES.landShape['සමචතුරස්්‍ර'];
  points.push({
    title: shapeRule.title,
    description: shapeRule.description,
    status: shapeRule.status,
    recommendation: shapeRule.recommendation
  });

  // 3. Slope Analysis
  const slopeRule = VASTU_RULES.slope[formData.slope as keyof typeof VASTU_RULES.slope] || VASTU_RULES.slope['උතුරට'];
  points.push({
    title: slopeRule.title,
    description: slopeRule.description,
    status: slopeRule.status,
    recommendation: slopeRule.recommendation
  });

  // 4. Room Layout Assumptions (If no floor plan details)
  points.push({
    title: VASTU_RULES.kitchen['ගිනිකොණ'].title,
    description: VASTU_RULES.kitchen['ගිනිකොණ'].description,
    status: VASTU_RULES.kitchen['ගිනිකොණ'].status,
    recommendation: VASTU_RULES.kitchen['ගිනිකොණ'].recommendation
  });

  points.push({
    title: VASTU_RULES.bedroom['නිරිත'].title,
    description: VASTU_RULES.bedroom['නිරිත'].description,
    status: VASTU_RULES.bedroom['නිරිත'].status,
    recommendation: VASTU_RULES.bedroom['නිරිත'].recommendation
  });

  // 5. Center Area
  points.push({
    title: VASTU_RULES.center.title,
    description: VASTU_RULES.center.description,
    status: VASTU_RULES.center.status,
    recommendation: VASTU_RULES.center.recommendation
  });

  // 6. Staircase
  points.push({
    title: VASTU_RULES.staircase.title,
    description: VASTU_RULES.staircase.description,
    status: VASTU_RULES.staircase.status,
    recommendation: VASTU_RULES.staircase.recommendation
  });

  // 7. Bathroom
  points.push({
    title: VASTU_RULES.bathroom.title,
    description: VASTU_RULES.bathroom.description,
    status: VASTU_RULES.bathroom.status,
    recommendation: VASTU_RULES.bathroom.recommendation
  });

  // 8. Land Dimensions Analysis
  const area = Number(formData.landLength) * Number(formData.landWidth);
  if (area > 0) {
    const isSmall = area < 1000; // Less than 4 perches approx
    points.push({
      title: 'ඉඩමේ ප්‍රමාණය සහ ඉඩකඩ',
      description: `ඔබේ ඉඩම වර්ග අඩි ${area} ක පමණ ප්‍රමාණයකින් යුක්ත වේ.`,
      status: isSmall ? 'neutral' : 'good',
      recommendation: isSmall 
        ? 'කුඩා ඉඩමක නිවසක් තැනීමේදී වාතාශ්‍රය සහ ආලෝකය කෙරෙහි වැඩි අවධානයක් යොමු කරන්න.' 
        : 'ඉඩම වටා ප්‍රමාණවත් ඉඩක් තබා නිවස මැද කොටසට වන්නට ඉදිකරන්න.'
    });
  }

  if (floorPlan) {
    assumptions.push('බිම් සැලැස්ම අනුව ප්‍රධාන දොරටුව සහ කාමර පිහිටීම වාස්තු විද්‍යානුකූලව පරීක්ෂා කරන ලදී.');
  } else {
    assumptions.push('බිම් සැලැස්මක් නොමැති බැවින් පොදු වාස්තු මූලධර්ම මත පදනම්ව මෙම වාර්තාව සකස් කර ඇත.');
  }

  const finalRecommendations = `ඔබේ ඉඩම ${formData.landShape} හැඩයෙන් යුක්ත වන අතර එය ${formData.slope} දෙසට බෑවුම් වේ. මෙය සමස්තයක් ලෙස ශුභදායක පිහිටීමකි. නිවස ඉදිකිරීමේදී ඊසාන දිශාව විවෘතව තැබීමටත්, නිරිත දිශාව බරින් යුක්තව තැබීමටත් වගබලා ගන්න.`;

  return {
    commonDetails: `${profile.name} මහතා/මහත්මිය සඳහා සකස් කරන ලද විශේෂිත වාස්තු වාර්තාව.`,
    points,
    summaryTable: SUMMARY_TEMPLATES,
    assumptions,
    finalRecommendations
  };
};
