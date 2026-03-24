
import { BabyNamingResult } from '../types';
import { calculateAstrologyDetails } from './astrology-calculator';
import { distinctLetterRules, babyNamesDatabase } from '../data/babyNamingData';

export function generateBasicBabyNamingResult(details: { dob: string, time: string, city: string, gender: string }): BabyNamingResult {
  const astro = calculateAstrologyDetails(details.dob, details.time);
  const nakshatra = astro.nekatha;
  const pada = astro.pada;

  const recommendedLetters = distinctLetterRules[nakshatra] || ["අ", "ක", "ම", "ස", "හ"];
  
  const boyNames: { name: string; meaning: string; letter?: string }[] = [];
  const girlNames: { name: string; meaning: string; letter?: string }[] = [];

  recommendedLetters.forEach(letter => {
    const names = babyNamesDatabase[letter];
    if (names) {
      if (details.gender === 'boy') {
        names.boy.forEach(n => boyNames.push({ ...n, letter }));
      } else {
        names.girl.forEach(n => girlNames.push({ ...n, letter }));
      }
    }
  });

  // If we don't have enough names, add some defaults
  if (boyNames.length === 0 && details.gender === 'boy') {
    boyNames.push({ name: "කවීන්", meaning: "කවියා", letter: "ක" }, { name: "අවීන්", meaning: "ප්‍රඥාවන්ත", letter: "අ" });
  }
  if (girlNames.length === 0 && details.gender === 'girl') {
    girlNames.push({ name: "කවීෂා", meaning: "කවියා", letter: "ක" }, { name: "අනීෂා", meaning: "පිරිසිදු", letter: "අ" });
  }

  return {
    intro: `දරුවාගේ උපන් වේලාව අනුව ${nakshatra} නැකතේ ${pada} වන පාදයෙන් උපත ලබා ඇත. ශ්‍රී ලංකාවේ නිරයන ලාහිරි ක්‍රමයට අනුව ගණනය කරන ලදී.`,
    recommendedLetters: recommendedLetters.slice(0, 5),
    nakshatra: nakshatra,
    pada: `${pada} වන පාදය`,
    boyNames: boyNames.slice(0, 15),
    girlNames: girlNames.slice(0, 15),
    astrologyInsight: `${nakshatra} නැකතේ උපන් දරුවන් ඉතා බුද්ධිමත් මෙන්ම නිර්මාණශීලී අය වෙති. ඔවුන් සමාජයේ කැපී පෙනෙන චරිත බවට පත්වීමේ වැඩි ඉඩකඩක් පවතී.`,
    amulet: {
      title: "රත්රන් පංචායුධය",
      description: "දරුවාගේ ආරක්ෂාව සහ සෞභාග්‍යය උදෙසා රත්රන් පංචායුධයක් පැළඳවීම සුබයි."
    },
    rituals: [
      "උපන් වේලාවට අදාළව ආගමික වතාවත්වල නිරත වීම",
      "දරුවාට නම තැබීමේදී සුබ මුහුර්තයක් තෝරා ගැනීම",
      "පන්සලකට හෝ කෝවිලකට ගොස් ආශිර්වාද ලබා ගැනීම"
    ]
  };
}
