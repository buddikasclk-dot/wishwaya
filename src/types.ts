
export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  birthTime: string;
  city: string;
  rashi?: string;
  lagna?: string;
  mismatchNotice?: string;
  // New astrological fields
  nekatha?: string;
  lagnaAdhipathi?: string;
  janmaRashiya?: string;
  rashyadhipathi?: string;
  nekathPadaya?: string;
  gana?: string;
  notifications?: {
    enabled: boolean;
    horoscope: boolean;
    rahuKalaya: boolean;
    specialNekath: boolean;
    birthday: boolean;
    lastHoroscopeSentDate?: string;
    lastRahuReminderSentDate?: string;
    lastSpecialNekathSentDate?: string;
    lastBirthdayWishSentYear?: number;
  };
}

export interface LuckHighlights {
  auspiciousDirection: string;
  inauspiciousDirection: string;
  luckyDays: string[];
  luckyTimes: string[];
  luckyColors: string[];
  luckyNumber: string;
  weeklyHighlight: string;
}

export interface RemedyAction {
  title: string;
  type: string;
  description: string;
  reason: string;
  steps?: string[];
}

export interface RemedyResult {
  userConditionFactors: {
    apalaDetected: boolean;
    conditionTags: string[];
    sourceFactors: {
      lagna: string;
      rashi: string;
      nekatha: string;
    }
  };
  remedies: {
    primary: RemedyAction;
    secondary: RemedyAction[];
    doAvoidNotes: {
      type: 'do' | 'avoid';
      text: string;
    }[];
  };
  summary: {
    shortText: string;
    priority: string;
  };
  aiEnhancedExplanation?: string;
}

export interface Prediction {
  characterTraits: string;
  health: string;
  career: string;
  wealth: string;
  love: string;
  education: string;
  general: string;
  mahaDasha: string;
  antaraDasha: string;
  planetaryPositions: string;
  adviceRemedies: string;
  remedies?: { problem: string; remedy: string }[];
}

export interface BabyNamingResult {
  intro: string;
  recommendedLetters: string[];
  nakshatra: string;
  pada: string;
  boyNames: { name: string; meaning: string; letter?: string }[];
  girlNames: { name: string; meaning: string; letter?: string }[];
  namesByLetter?: Record<string, { boy: string[], girl: string[] }>;
  astrologyInsight: string;
  amulet: { title: string; description: string };
  rituals: string[];
}

export interface BabyNamingState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: BabyNamingResult | null;
  errorMessage: string | null;
}

export interface VastuAdvice {
  entranceDirection: string;
  bedroomPlacement: string;
  wealthStorage: string;
  cautionNotes: string;
  constructionStartTime: string;
  remedySuggestion: string;
}

export interface VastuAnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: PersonalizedVastuResult | null;
  errorMessage: string | null;
}

export interface MatchingState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: PorondamResult | null;
  errorMessage: string | null;
}

export interface OmenAnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: OmenResult | null;
  errorMessage: string | null;
}

export interface PersonalizedVastuResult {
  commonDetails: string;
  points: {
    title: string;
    description: string;
    status: 'good' | 'warning' | 'neutral';
    recommendation: string;
  }[];
  summaryTable: {
    element: string;
    bestDirection: string;
  }[];
  assumptions: string[];
  finalRecommendations: string;
}

export interface PastLifeResult {
  pastKarmicThemes: string;
  inheritedStrengths: string;
  presentLessons: string;
  soulMission: string;
  practicalAdvice: string;
}

export interface PalmAnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: PalmAnalysisResult | null;
  errorMessage: string | null;
}

export interface PorondamResult {
  matchingPercentage: number;
  table: {
    name: string;
    description: string;
    result: string;
    isMatch: boolean;
  }[];
  dosha: string[];
  recommendations: string[];
}

export interface DreamInterpretation {
  meaning: string;
  symbols: { symbol: string; meaning: string }[];
  spiritualContext: string;
  psychologicalInsight: string;
  planetaryInfluence: string;
  actionableAdvice: string;
}

export interface PalmAnalysisResult {
  archetype: string;
  handShape: string;
  heartLineDetail: string;
  headLineDetail: string;
  lifeLineDetail: string;
  fateLineDetail: string;
  mountsAnalysis: string;
  specialMarkings: string;
  synthesisAdvice: string;
}

export interface AuspiciousTimes {
  business: string;
  travel: string;
  houseBuilding: string;
  marriage: string;
}

export interface GemstoneAdvice {
  gemstone: string;
  metal: string;
  finger: string;
  instructions: string;
  benefits: string;
  jewelryType?: string;
  secondaryGemstone?: string;
}

export interface OmenResult {
  prediction: string;
  context: string;
  remedy: string;
}

export type LOACategoryId = 'wealth' | 'health' | 'love' | 'career' | 'education' | 'peace' | 'spiritual';

export interface LOATask {
  id: string;
  text: string;
  type: 'action' | 'vibration' | 'gratitude' | 'journaling' | 'mindfulness';
}

export interface LOADayContent {
  dayNumber: number;
  title: string;
  miniDescription: string;
  affirmation: string;
  tasks: LOATask[];
  reflectionPrompt?: string;
}

export interface LOACategoryContent {
  id: LOACategoryId;
  titleSinhala: string;
  titleEnglish: string;
  icon: string;
  introDescription: string;
  spiritualPhrase: string;
  days: LOADayContent[];
}

export interface LOAChallenge {
  userKey: string;
  challengeActive: boolean;
  goal: LOACategoryId | null;
  startDateISO: string | null;
  timezone: string;
  completedDays: number[];
  streakCount: number;
  lastCompletedDateISO: string | null;
  unlockedDay: number;
  badgeUnlocked: boolean;
  badgeName: string | null;
  musicEnabled: boolean;
}
