
export interface RemedyRule {
  conditionSinhala: string;
  priority: string;
  primaryRemedy: any;
  secondaryRemedies: any[];
  doAvoidNotes: any[];
}

export const REMEDY_RULES: Record<string, RemedyRule> = {
  'Saturn_Apala': {
    conditionSinhala: 'සෙනසුරු අපල',
    priority: 'High',
    primaryRemedy: { title: 'බෝධි පූජා', description: 'සෙනසුරාදා දිනවල බෝධි පූජා පවත්වන්න.', steps: ['පිරිසිදු වී බෝධිය අසලට යන්න', 'තෙල් මල් පූජා කරන්න'] },
    secondaryRemedies: [],
    doAvoidNotes: []
  }
};

export const FALLBACK_REMEDY: RemedyRule = {
  conditionSinhala: 'පොදු අපල',
  priority: 'Normal',
  primaryRemedy: { title: 'ආගමික වත්පිළිවෙත්', description: 'දිනපතා ආගමික වත්පිළිවෙත්වල නිරත වන්න.', steps: [] },
  secondaryRemedies: [],
  doAvoidNotes: []
};
