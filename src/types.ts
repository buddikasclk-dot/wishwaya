
export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  birthTime: string;
  city: string;
  languagePreference?: 'si' | 'en';
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

export type AstroReportOrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type AstroReportStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'paid'
  | 'collecting_inputs'
  | 'queued'
  | 'generating'
  | 'pdf_generating'
  | 'completed'
  | 'failed';

export interface AstroReportOrder {
  id: string;
  userId: string;
  productType: 'full_astro_report';
  amount: number;
  currency: string;
  status: AstroReportOrderStatus;
  paymentGateway: string;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AstroReportInputSnapshot {
  fullName: string;
  gender: UserProfile['gender'];
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  preferredLanguage: 'si';
  palmImageUrl: string;
  palmQuality: {
    width: number;
    height: number;
    brightness: number;
    contrast: number;
    sharpness: number;
  };
}

export interface AstroDeterministicData {
  lagna: string;
  rashi: string;
  nakshatra: string;
  pada: string;
  planetPositions: Array<{ planet: string; sign: string; degree: string; house: number }>;
  housePositions: Array<{ house: number; sign: string; focus: string }>;
  dashaSummary: {
    currentPhase: string;
    nextPhase: string;
    helpfulPeriods: string[];
    challengingPeriods: string[];
  };
  yogasAndDoshas: {
    strengths: string[];
    cautions: string[];
    certainty: 'calculated' | 'hybrid';
  };
  transitSummary?: string;
  upcomingNekathLogic?: string[];
  recommendedGemLogic?: string[];
  remedyBaseRules?: string[];
  palmObservationSummary?: string[];
  calculationNotes: string[];
}

export interface AstroReportSection {
  key: string;
  title: string;
  content: string;
}

export interface AstroFullReportJson {
  coverSection: AstroReportSection;
  coreAstroProfile: AstroReportSection;
  personalityLifeBlueprint: AstroReportSection;
  wealthCareerBusinessReport: AstroReportSection;
  loveMarriageRelationshipReport: AstroReportSection;
  healthLifestyleGuidance: AstroReportSection;
  dashaTimePeriodAnalysis: AstroReportSection;
  yogasDoshasPlanetaryInfluences: AstroReportSection;
  palmAnalysisReport: AstroReportSection;
  upcomingNekathForUser: AstroReportSection;
  pastLifeLine: AstroReportSection;
  recommendedGemsToWear: AstroReportSection;
  fullRemediesReport: AstroReportSection;
  personalizedRecommendations: AstroReportSection;
  finalThoughtSummary: AstroReportSection;
  endRecommendationsSection: AstroReportSection;
  generatedAt: string;
  generationMode: 'gemini_hybrid' | 'deterministic_fallback';
}

export interface AstroReportRecord {
  id: string;
  userId: string;
  orderId: string;
  status: AstroReportStatus;
  language: 'si';
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  birthDataJson: Partial<AstroReportInputSnapshot> | null;
  astrologyDataJson: AstroDeterministicData | null;
  palmImageUrl: string | null;
  reportJson: AstroFullReportJson | null;
  pdfUrl: string | null;
  failureReason?: string | null;
  inputSnapshot: AstroReportInputSnapshot | null;
  requestId: string;
}

export interface AstroReportPurchaseBundle {
  order: AstroReportOrder;
  report: AstroReportRecord;
  payment: {
    integrationMode: 'placeholder' | 'stripe';
    checkoutToken: string;
    supportedStates: AstroReportOrderStatus[];
    checkoutUrl?: string | null;
    sessionId?: string | null;
    stripePriceId?: string | null;
    displayAmount?: string | null;
    localDisplayAmount?: string | null;
  };
}

export interface AstroReportRequirements {
  reportId: string;
  requestId: string;
  status: AstroReportStatus;
  missingFields: Array<
    'fullName' | 'dateOfBirth' | 'timeOfBirth' | 'birthPlace' | 'gender' | 'preferredLanguage' | 'palmImage'
  >;
  prefilled: Partial<AstroReportInputSnapshot>;
}

export interface ConsultantCredits {
  user_id: string;
  free_messages_used: number;
  paid_credits: number;
  total_credits: number;
  is_premium: boolean;
  free_remaining: number;
  can_chat?: boolean;
}

export interface ConsultantChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}
