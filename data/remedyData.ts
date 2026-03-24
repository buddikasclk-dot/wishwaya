import { RemedyAction } from '../types';

export interface RemedyRule {
  condition: string;
  conditionSinhala: string;
  primaryRemedy: RemedyAction;
  secondaryRemedies: RemedyAction[];
  doAvoidNotes: { type: 'do' | 'avoid'; text: string }[];
  priority: 'high' | 'medium' | 'low';
}

export const REMEDY_RULES: Record<string, RemedyRule> = {
  'Saturn_Apala': {
    condition: 'Saturn Apala (Sani Erashtaka)',
    conditionSinhala: 'සෙනසුරු අපලය (ඒරාෂ්ටක අපල)',
    primaryRemedy: {
      title: 'බෝධි පූජාව',
      type: 'Spiritual',
      description: 'සෙනසුරාදා දිනවල සවස් කාලයේ බෝධි පූජා පැවැත්වීම සහ නිල් මල් පූජා කිරීම.',
      reason: 'සෙනසුරු ග්‍රහයාගේ අපල තත්ත්වයන් සමනය කර මානසික සහනය ලබා ගැනීමට.',
      steps: [
        'බෝධිය පිරිසිදු කිරීම',
        'තල තෙල් පහන් දැල්වීම',
        'නිල් මල් පූජා කිරීම',
        'විෂ්ණු දෙවියන්ට පින් අනුමෝදන් කිරීම'
      ]
    },
    secondaryRemedies: [
      {
        title: 'කපුටන්ට ආහාර දීම',
        type: 'Charity',
        description: 'සෙනසුරාදා දිනවල උදෑසන කපුටන්ට එළකිරි මිශ්‍ර කිරි බත් දීම.',
        reason: 'සෙනසුරුගේ වාහනය වන කපුටාට සංග්‍රහ කිරීමෙන් අපල දුරු වේ.',
        steps: []
      }
    ],
    doAvoidNotes: [
      { type: 'do', text: 'නිල් පැහැති ඇඳුම් ඇඳීම සුදුසුයි.' },
      { type: 'avoid', text: 'මස් මාංශ අනුභවයෙන් වැළකී සිටීම යහපත්ය.' }
    ],
    priority: 'high'
  },
  'Mars_Apala': {
    condition: 'Mars Apala (Kuja Dosha)',
    conditionSinhala: 'අඟහරු අපලය (කුජ දෝෂ)',
    primaryRemedy: {
      title: 'අභය දානය',
      type: 'Charity',
      description: 'සතුන් නිදහස් කිරීම හෝ අසරණ රෝගීන්ට උපකාර කිරීම.',
      reason: 'අඟහරුගේ රෞද්‍ර ගතිය පාලනය කර ශුභ පල ලබා ගැනීමට.',
      steps: [
        'මරණයට කැප වූ සතෙකු නිදහස් කිරීම',
        'ලේ දන් දීම',
        'රතු මල් පූජා කිරීම'
      ]
    },
    secondaryRemedies: [
      {
        title: 'කතරගම දෙවියන්ට පූජා පැවැත්වීම',
        type: 'Spiritual',
        description: 'අඟහරුවාදා දිනවල කතරගම දෙවියන් උදෙසා පූජාවන් පැවැත්වීම.',
        reason: 'අඟහරු ග්‍රහයාගේ අධිපති දෙවියන් වන කතරගම දෙවියන්ගේ ආශිර්වාදය ලබා ගැනීමට.',
        steps: []
      }
    ],
    doAvoidNotes: [
      { type: 'do', text: 'ඉවසීම ප්‍රගුණ කිරීම ඉතා වැදගත්ය.' },
      { type: 'avoid', text: 'අනවශ්‍ය වාද විවාදවලින් වැළකී සිටින්න.' }
    ],
    priority: 'medium'
  },
  'Rahu_Ketu_Apala': {
    condition: 'Rahu/Ketu Apala',
    conditionSinhala: 'රාහු/කේතු අපලය',
    primaryRemedy: {
      title: 'ගිලන්පස පූජාව',
      type: 'Spiritual',
      description: 'බුදුන් වහන්සේ උදෙසා අෂ්ටපාන හෝ ගිලන්පස පූජා කිරීම.',
      reason: 'රාහු සහ කේතු ග්‍රහයන්ගෙන් ඇති වන මානසික ව්‍යාකූලතා දුරු කිරීමට.',
      steps: [
        'සවස් කාලයේ ගිලන්පස පූජා කිරීම',
        'කරණීය මෙත්ත සූත්‍රය සජ්ඣායනා කිරීම',
        'දුගී මගීන්ට ආහාර දීම'
      ]
    },
    secondaryRemedies: [
      {
        title: 'නාග පූජාව',
        type: 'Spiritual',
        description: 'නාග රූපයකට කිරි ස්නානය කරවීම හෝ නා වෘක්ෂයකට සාත්තු කිරීම.',
        reason: 'රාහු ග්‍රහයාගේ බලපෑම අවම කර ගැනීමට.',
        steps: []
      }
    ],
    doAvoidNotes: [
      { type: 'do', text: 'පංචශීලය ආරක්ෂා කිරීම ඉතා වැදගත්ය.' },
      { type: 'avoid', text: 'මත්පැන් සහ දුම්වැටිවලින් සම්පූර්ණයෙන්ම වැළකී සිටින්න.' }
    ],
    priority: 'high'
  },
  'Jupiter_Apala': {
    condition: 'Jupiter Apala (Guru Apala)',
    conditionSinhala: 'ගුරු අපලය',
    primaryRemedy: {
      title: 'ධර්ම දානය',
      type: 'Educational',
      description: 'දහම් පොත් පත් බෙදා දීම හෝ දහම් පාසල් දරුවන්ට උපකාර කිරීම.',
      reason: 'ගුරු ග්‍රහයාගේ ආශිර්වාදය ලබාගෙන බුද්ධිය සහ වාසනාව වර්ධනය කර ගැනීමට.',
      steps: [
        'බ්‍රහස්පතින්දා දිනක දහම් පොත් පූජා කිරීම',
        'කහ පැහැති මල් බෝධියට පූජා කිරීම',
        'වැඩිහිටියන්ට උපස්ථාන කිරීම'
      ]
    },
    secondaryRemedies: [
      {
        title: 'පන්සල්වලට තෙල් පූජා කිරීම',
        type: 'Spiritual',
        description: 'පන්සල්වල පහන් දැල්වීමට තෙල් පූජා කිරීම.',
        reason: 'ජීවිතයේ අඳුරු තැන් ආලෝකමත් කර ගැනීමට.',
        steps: []
      }
    ],
    doAvoidNotes: [
      { type: 'do', text: 'කහ පැහැති ඇඳුම් ඇඳීම සුදුසුයි.' },
      { type: 'avoid', text: 'ගුරුවරුන්ට සහ වැඩිහිටියන්ට අගෞරව නොකරන්න.' }
    ],
    priority: 'medium'
  }
};

export const FALLBACK_REMEDY: RemedyRule = {
  condition: 'General Spiritual Guidance',
  conditionSinhala: 'පොදු ආගමික වත්පිළිවෙත්',
  primaryRemedy: {
    title: 'දිනපතා ආගමික වත්පිළිවෙත්',
    type: 'Spiritual',
    description: 'දිනපතා උදේ සවස බුදුන් වැඳීම සහ පංචශීලය ආරක්ෂා කිරීම.',
    reason: 'ජීවිතයේ පොදු යහපත සහ මානසික සහනය උදෙසා.',
    steps: [
      'මල්, පහන්, හඳුන්කූරු පූජා කිරීම',
      'තිසරණ සහිත පංචශීලය සමාදන් වීම',
      'මෙත්තා සහ කරුණා ගුණ වර්ධනය කිරීම'
    ]
  },
  secondaryRemedies: [],
  doAvoidNotes: [
    { type: 'do', text: 'සෑම විටම සත්‍යවාදී වන්න.' },
    { type: 'avoid', text: 'අන් අයට හිංසා පීඩා කිරීමෙන් වැළකී සිටින්න.' }
  ],
  priority: 'low'
};
