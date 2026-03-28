import React, { useEffect, useState } from 'react';
import { LuckHighlights, Prediction, UserProfile } from '../types';
import { getLuckHighlights, getPredictions } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onNavigate?: (tab: string) => void;
}

const RASHI_DATA: Record<string, { sinhala: string; icon: string; color: string; glow: string }> = {
  Aries: { sinhala: 'මේෂ', icon: '♈', color: 'text-red-500', glow: 'from-rose-100 via-orange-50 to-white' },
  Taurus: { sinhala: 'වෘෂභ', icon: '♉', color: 'text-green-600', glow: 'from-emerald-100 via-lime-50 to-white' },
  Gemini: { sinhala: 'මිථුන', icon: '♊', color: 'text-yellow-500', glow: 'from-yellow-100 via-amber-50 to-white' },
  Cancer: { sinhala: 'කටක', icon: '♋', color: 'text-blue-400', glow: 'from-sky-100 via-cyan-50 to-white' },
  Leo: { sinhala: 'සිංහ', icon: '♌', color: 'text-orange-500', glow: 'from-orange-100 via-amber-50 to-white' },
  Virgo: { sinhala: 'කන්‍යා', icon: '♍', color: 'text-emerald-500', glow: 'from-emerald-100 via-green-50 to-white' },
  Libra: { sinhala: 'තුලා', icon: '♎', color: 'text-pink-400', glow: 'from-pink-100 via-rose-50 to-white' },
  Scorpio: { sinhala: 'වෘශ්චික', icon: '♏', color: 'text-rose-600', glow: 'from-rose-100 via-red-50 to-white' },
  Sagittarius: { sinhala: 'ධනු', icon: '♐', color: 'text-purple-500', glow: 'from-violet-100 via-purple-50 to-white' },
  Capricorn: { sinhala: 'මකර', icon: '♑', color: 'text-slate-600', glow: 'from-slate-100 via-gray-50 to-white' },
  Aquarius: { sinhala: 'කුම්භ', icon: '♒', color: 'text-sky-500', glow: 'from-sky-100 via-blue-50 to-white' },
  Pisces: { sinhala: 'මීන', icon: '♓', color: 'text-indigo-400', glow: 'from-indigo-100 via-blue-50 to-white' }
};

const WORD_TRANSLATIONS: Array<[RegExp, string]> = [
  [/\bMonday\b/gi, 'සඳුදා'],
  [/\bTuesday\b/gi, 'අඟහරුවාදා'],
  [/\bWednesday\b/gi, 'බදාදා'],
  [/\bThursday\b/gi, 'බ්‍රහස්පතින්දා'],
  [/\bFriday\b/gi, 'සිකුරාදා'],
  [/\bSaturday\b/gi, 'සෙනසුරාදා'],
  [/\bSunday\b/gi, 'ඉරිදා'],
  [/\bEast\b/gi, 'නැගෙනහිර'],
  [/\bWest\b/gi, 'බටහිර'],
  [/\bNorth\b/gi, 'උතුර'],
  [/\bSouth\b/gi, 'දකුණ'],
  [/\bNorth-East\b/gi, 'ඊසාන'],
  [/\bNorth-West\b/gi, 'වයඹ'],
  [/\bSouth-East\b/gi, 'ගිනිකොණ'],
  [/\bSouth-West\b/gi, 'නිරිත'],
  [/\bRed\b/gi, 'රතු'],
  [/\bWhite\b/gi, 'සුදු'],
  [/\bGreen\b/gi, 'කොළ'],
  [/\bBlue\b/gi, 'නිල්'],
  [/\bYellow\b/gi, 'කහ'],
  [/\bGold\b/gi, 'රන්'],
  [/\bSilver\b/gi, 'රිදී'],
  [/\bPink\b/gi, 'රෝස'],
  [/\bAM\b/gi, 'පෙ.ව.'],
  [/\bPM\b/gi, 'ප.ව.']
];

const SkeletonCard = () => (
  <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-gray-100 rounded-full" />
        <div className="h-2 w-1/4 bg-gray-50 rounded-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-gray-50 rounded-full" />
      <div className="h-3 w-[90%] bg-gray-50 rounded-full" />
      <div className="h-3 w-[80%] bg-gray-50 rounded-full" />
    </div>
  </div>
);

const WeeklyLuckSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50/50 h-24 rounded-[2rem] border border-gray-100/50" />
      <div className="bg-gray-50/50 h-24 rounded-[2rem] border border-gray-100/50" />
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center space-x-4 bg-gray-50/30 p-4 rounded-3xl border border-white">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-12 bg-gray-100 rounded-full" />
            <div className="h-3 w-24 bg-gray-50 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const safeText = (value: unknown) => {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map((item) => String(item ?? '').trim()).filter(Boolean).join('\n');
  if (value == null) return '';
  return String(value).trim();
};

const formatList = (value: unknown, separator = ', ') => {
  if (Array.isArray(value)) return value.filter(Boolean).join(separator) || '-';
  if (typeof value === 'string') return value.trim() || '-';
  return '-';
};

const translateDashboardText = (value: unknown) => {
  const text = safeText(value);
  if (!text) return '';

  let translated = text;
  WORD_TRANSLATIONS.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  return translated
    .replace(/should stay focused this week and move calmly toward important goals\./gi, 'මෙම සතියේ වැදගත් අරමුණු වෙත සන්සුන්ව සහ අවධානයෙන් ගමන් කරන්න.')
    .replace(/shows leadership potential, emotional intensity, and a need for steady decision-making this month\./gi, 'මෙම මාසයේ නායකත්ව ගුණ, තද හැඟීම් සහ ස්ථිර තීරණ ගැනීමේ අවශ්‍යතාව පෙනේ.')
    .replace(/Energy can fluctuate this month\. Keep your sleep, food timing, and stress levels balanced for better results\./gi, 'මෙම මාසයේ ශක්තිය උච්චාවචනය විය හැක. නිදාගැනීම, ආහාර වේලාව සහ මානසික පීඩනය සමබරව තබාගන්න.')
    .trim();
};

const hasEnglishLetters = (value: string) => /[A-Za-z]/.test(value);

const getCurrentSinhalaMonthLabel = () => new Intl.DateTimeFormat('si-LK', { month: 'long', year: 'numeric' }).format(new Date());

const buildDetailedSinhalaText = (field: keyof Prediction, rashiName: string) => {
  const monthLabel = getCurrentSinhalaMonthLabel();
  const detailed: Record<keyof Prediction, string> = {
    characterTraits: `${monthLabel} තුළ ${rashiName} ලග්නයට අදාළ ප්‍රධාන චරිත ලක්ෂණ වන්නේ තීරණ ගන්නා ශක්තිය, වැඩ ඉදිරියට ගෙන යාමේ උත්සාහය සහ තමන්ගේ අදහසට වටිනාකම ලබා දීමට කැමැත්තයි. එහෙත් හදිසි ප්‍රතිචාර, අහංකාර වචන හෝ අනෙක් අයගේ අදහස් නොසලකා හැරීම නිසා අසුබ ගැටලු මතු විය හැක. ඉවසීම, මෘදු භාෂාව සහ යහපත් හැසිරීම් මඟින් මේ මාසයේ මේ අසුබ බලපෑම් බොහෝ දුරට මෘදු කර ගත හැක.`,
    health: `${monthLabel} තුළ සෞඛ්‍යය පිළිබඳ වැඩි සැලකිල්ලක් අවශ්‍ය වේ. නින්ද, ආහාර වේල සහ ජලය පානය කිරීම නිසි පරිදි පාලනය කළහොත් ශාරීරික ශක්තිය හොඳින් පවත්වා ගත හැක. නමුත් මානසික පීඩනය, විවේකය අඩු වීම හෝ අක්‍රමවත් දෛනික පුරුදු නිසා අලස බව සහ අවධානය අඩුවීම සිදුවිය හැක. යහපත් ශරීර පුරුදු සහ සන්සුන් සිත මේ මාසයේ හොඳ ප්‍රතිඵල ගෙන එයි.`,
    career: `${monthLabel} තුළ රැකියා සහ ව්‍යාපාරික පැතිවල ගමනක් ඇත. වැඩ නිම කිරීමට, වගකීම් නිවැරදිව ඉටු කිරීමට සහ නව අවස්ථා අල්ලා ගැනීමට මෙය හොඳ කාලයකි. එහෙත් ලේඛන දෝෂ, කාල ප්‍රමාද සහ කාර්යාලීය වැරදි අවබෝධ අසුබ බලපෑමක් දිය හැක. පිළිවෙළ, මෘදු කථාබහ සහ කල්තියා පරීක්ෂා කිරීම ඔබගේ සුබය වැඩි කරයි.`,
    wealth: `${monthLabel} තුළ මුදල් පැත්ත මධ්‍යස්ථව පවතින නමුත් වියදම් පාලනය සහ සැලසුම් කළමනාකරණය අනිවාර්ය වේ. ගෙවීම්, ඉතුරුම් සහ අනාගත අවශ්‍යතා සිතා වැඩ කළහොත් වාසිය ලැබේ. නමුත් අනවශ්‍ය වියදම්, කඩිමුඩියේ ආයෝජන හෝ වචනයට මුදල් වියදම් කිරීම නිසා අසුබ තත්ත්වයක් ඇති විය හැක. යහපත් ආර්ථික පුරුදු මේ මාසයේ ධන රැකවරණය වේ.`,
    love: `${monthLabel} තුළ ආදරය සහ පවුල් සම්බන්ධතා සකස් කර ගැනීමට හොඳ කාලයකි. අවංක කථාබහ, එකිනෙකාගේ හැඟීම් තේරුම් ගැනීම සහ සමාව දීමෙන් සමීපත්වය වැඩි වේ. නමුත් සැකය, නිහඬව තරහ තබා ගැනීම සහ කෝපයෙන් කතා කිරීම නිසා දුරස්ථභාවයක් ඇති විය හැක. යහපත් හැසිරීම සහ මෘදු වචන මේ මාසයේ අසුබ සම්බන්ධතා බලපෑම් අඩු කරයි.`,
    education: `${monthLabel} තුළ ඉගෙනීම, විභාග සූදානම සහ දැනුම වැඩි කර ගැනීමට අවස්ථාව ඇත. දිනපතා කුඩා ඉලක්ක, නිවැරදි පුනරාවර්තනය සහ කාල පාලනය ඔබට වාසියක් ගෙන එයි. නමුත් අවධානය බිඳවන දේවල්, අක්‍රමවත් පාඩම් සැලැස්ම සහ ප්‍රමාදය අසුබ ප්‍රතිඵල දිය හැක. යහපත් අධ්‍යයන පුරුදු මේ මාසයේ ඔබගේ ප්‍රගතිය රැක ගනී.`,
    general: `${monthLabel} සඳහා සමස්ත බලපෑම මිශ්‍ර නමුත් හොඳින් පාලනය කළ හැකි එකකි. වචන පාලනය, කාලසටහනට අනුව වැඩ කිරීම සහ යහපත් ක්‍රියාවන් තුළ ස්ථාවර බව තබා ගත්තොත් වැඩි සුබයක් ලැබේ. එහෙත් හදිසි තීරණ, කෝපය සහ අවිධිමත් පුරුදු අසුබ පැත්ත වැඩි කරයි. යහපත් හැසිරීම් සහ සිහිකල්පනාව මෙම මාසයේ ප්‍රධාන ආරක්ෂාවයි.`,
    mahaDasha: `${monthLabel} තුළ ප්‍රධාන දශා බලපෑම දිගුකාලීන ගමනට පදනමක් තැබෙන ආකාරයෙන් පෙනේ. ක්‍රමයෙන් ලැබෙන දියුණුවට ඉවසීම සහ වගකීම අවශ්‍ය වේ. නමුත් ප්‍රතිඵල ප්‍රමාද වීම හෝ අභ්‍යන්තර අසහනය නිසා අසුබ සිතුවිලි මතු විය හැක. යහපත් චර්යාව සහ අඛණ්ඩ උත්සාහය මේ කාලයේ වාසිය වැඩි කරයි.`,
    antaraDasha: `${monthLabel} තුළ අතුරු දශා බලපෑම දෛනික කටයුතු, ලේඛන සහ කුඩා තීරණ මත විශේෂයෙන් දැනේ. කුඩා දේවල් විශාල ගැටලුවලට හැරෙන්නට ඉඩ ඇති නිසා සැලකිල්ලෙන් ක්‍රියා කළ යුතුය. එහෙත් කුඩා සුබ පියවර නියමිතව ඉටු කළහොත් ප්‍රගතිය ඉක්මනින් පෙනේ. සන්සුන්ව, මැනවින් ක්‍රියා කිරීමෙන් අසුබය අඩු කර ගත හැක.`,
    planetaryPositions: `${monthLabel} තුළ වත්මන් ග්‍රහ ගමන ඔබගේ මුදල්, වචන, සම්බන්ධතා සහ දෛනික වගකීම් මත බලපෑම් දක්වයි. සමහර පැතිවල වාසනාව විවෘත වන අතර, වෙනත් පැතිවල ප්‍රමාද සහ සැක පීඩනයක් දැනිය හැක. එබැවින් පරීක්ෂා කිරීම, විවේකය සහ පිළිවෙළ මේ මාසයේ අනිවාර්ය වේ. යහපත් ක්‍රියාවන් ග්‍රහ පීඩනයේ අසුබ පැත්ත මෘදු කරයි.`,
    adviceRemedies: `${monthLabel} තුළ දෛනික ජීවිතය පිළිවෙළට ගෙන ඒම, කෙටි ආධ්‍යාත්මික වතාවක් පවත්වා ගැනීම සහ අනවශ්‍ය තර්කවලින් වැළකීම ප්‍රධාන පිළියම් වේ. සතියකට එක් වරක් හෝ ආශීර්වාදයක්, පින්කමක්, බෝධි පූජාවක් වැනි යහපත් ක්‍රියාවක් එකතු කළහොත් අසුබ බලපෑම් මෘදු වේ. මෘදු වචන, පිරිසිදු සිත සහ යහපත් හැසිරීම් මේ මාසයේ ඔබගේ සුබය ශක්තිමත් කරයි.`,
    remedies: ''
  };

  return detailed[field];
};
const getSinhalaPredictionContent = (field: keyof Prediction, content: string, rashiName: string) => {
  const translated = translateDashboardText(content);
  if (!translated || translated === '-' || hasEnglishLetters(translated)) {
    return buildDetailedSinhalaText(field, rashiName);
  }

  if (translated.length < 70) {
    return `${translated} ${buildDetailedSinhalaText(field, rashiName)}`;
  }

  return translated;
};

const getSinhalaWeeklySummary = (summary: string, rashiName: string) => {
  const translated = translateDashboardText(summary);
  if (!translated || translated === '-' || hasEnglishLetters(translated)) {
    return `මෙම සතියේ ${rashiName} ලග්නය සඳහා අවධානය, ඉවසීම සහ සන්සුන් කටයුතු ඉතා වැදගත් වේ. වැදගත් තීරණ ගැනීමේදී කලබල නොවී සිතා බලා ක්‍රියා කරන්න.`;
  }
  return translated;
};

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  const [highlights, setHighlights] = useState<LuckHighlights | null>(null);
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [highlightsLoading, setHighlightsLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedHighlights = await getLuckHighlights(profile);
        setHighlights(loadedHighlights);
      } finally {
        setHighlightsLoading(false);
      }

      try {
        const loadedPredictions = await getPredictions(profile);
        setPredictions(loadedPredictions);
      } finally {
        setPredictionsLoading(false);
      }
    };

    void load();
  }, [profile]);

  const rashiTheme = profile.rashi
    ? RASHI_DATA[profile.rashi] || { sinhala: profile.rashi, icon: '✦', color: 'text-green-600', glow: 'from-emerald-100 via-white to-white' }
    : { sinhala: 'නොදනී', icon: '✦', color: 'text-gray-400', glow: 'from-gray-100 via-white to-white' };

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  const localizedPredictions = predictions
    ? {
        ...predictions,
        characterTraits: getSinhalaPredictionContent('characterTraits', predictions.characterTraits, rashiTheme.sinhala),
        health: getSinhalaPredictionContent('health', predictions.health, rashiTheme.sinhala),
        career: getSinhalaPredictionContent('career', predictions.career, rashiTheme.sinhala),
        wealth: getSinhalaPredictionContent('wealth', predictions.wealth, rashiTheme.sinhala),
        love: getSinhalaPredictionContent('love', predictions.love, rashiTheme.sinhala),
        education: getSinhalaPredictionContent('education', predictions.education, rashiTheme.sinhala),
        general: getSinhalaPredictionContent('general', predictions.general, rashiTheme.sinhala),
        mahaDasha: getSinhalaPredictionContent('mahaDasha', predictions.mahaDasha, rashiTheme.sinhala),
        antaraDasha: getSinhalaPredictionContent('antaraDasha', predictions.antaraDasha, rashiTheme.sinhala),
        planetaryPositions: getSinhalaPredictionContent('planetaryPositions', predictions.planetaryPositions, rashiTheme.sinhala),
        adviceRemedies: getSinhalaPredictionContent('adviceRemedies', predictions.adviceRemedies, rashiTheme.sinhala)
      }
    : null;

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="pt-2 space-y-4">
        <div className={`relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br ${rashiTheme.glow} p-5 shadow-[0_25px_60px_-30px_rgba(16,24,40,0.28)]`}>
          <div className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-white/70 blur-2xl" />
          <div className="absolute right-6 bottom-3 text-4xl opacity-[0.08]">✦</div>
          <div className="absolute left-28 bottom-0 h-16 w-16 rounded-full bg-white/40 blur-2xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-2xl font-black tracking-tight text-pink-500 shadow-sm sinhala">
                <span>ආයුබෝවන්!</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-[2rem] font-black text-gray-800 tracking-tight leading-none">{profile.name}</h2>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 shadow-sm border border-white/80">
                  <div className="text-left">
                    <p className="text-[10px] font-black tracking-[0.18em] text-gray-400">ලග්නය</p>
                    <p className={`font-black text-lg ${rashiTheme.color}`}>{rashiTheme.sinhala}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-white/90 text-3xl shadow-lg border border-white">
                {rashiTheme.icon}
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm border border-white/80 py-4 px-6 rounded-3xl w-full max-w-[320px] shadow-sm mx-auto flex flex-col items-center justify-center text-center">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 via-lime-400 to-cyan-400" />
          <p className="text-sm font-bold text-gray-600">{formatDate(currentTime)}</p>
          <p className="text-lg font-black text-green-600 tracking-widest">{formatTime(currentTime)}</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-800">සතියේ සුබ අසුබ</h3>
          <span className="text-[9px] text-green-600 font-black uppercase tracking-[0.2em]">සති සාරාංශය</span>
        </div>

        {highlightsLoading ? (
          <WeeklyLuckSkeleton />
        ) : highlights ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/30 p-5 rounded-[2rem] border border-emerald-100/50 text-center space-y-1">
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">සුබ දිශාව</p>
                <p className="font-black text-gray-800 text-xl">{translateDashboardText(highlights.auspiciousDirection) || '-'}</p>
              </div>
              <div className="bg-rose-50/30 p-5 rounded-[2rem] border border-rose-100/50 text-center space-y-1">
                <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest">පරිස්සම් දිශාව</p>
                <p className="font-black text-gray-800 text-xl">{translateDashboardText(highlights.inauspiciousDirection) || '-'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="සුබ දින" value={translateDashboardText(formatList(highlights.luckyDays, ', '))} />
              <InfoRow label="සුබ වේලා" value={translateDashboardText(formatList(highlights.luckyTimes, ' | '))} />
              <InfoRow label="සුබ වර්ණ" value={translateDashboardText(formatList(highlights.luckyColors, ', '))} />
              <InfoRow label="සුබ අංකය" value={translateDashboardText(highlights.luckyNumber) || '-'} />
            </div>

            <div className="mt-2 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-[2rem] border border-green-100/50 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">*</span>
                <p className="text-[10px] text-green-700 font-black uppercase tracking-widest">සාරාංශය</p>
              </div>
              <p className="text-sm text-green-800 leading-relaxed font-bold italic">
                {getSinhalaWeeklySummary(safeText(highlights.weeklyHighlight), rashiTheme.sinhala) || '-'}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="px-2 pt-4 flex flex-col items-center text-center">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-green-100 py-3 px-8 rounded-full shadow-sm">
          <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">විස්තරාත්මක විග්‍රහය</h3>
        </div>
      </div>

      <section className="space-y-6">
        {predictionsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : localizedPredictions ? (
          <>
            <PredictionCategory title="චරිත ලක්ෂණ" sub="ඔබගේ ස්වභාවය" icon="C" content={localizedPredictions.characterTraits} color="bg-blue-50/50" textColor="text-blue-900" />
            <PredictionCategory title="සෞඛ්‍යය" sub="සෞඛ්‍ය තත්වය" icon="H" content={localizedPredictions.health} color="bg-emerald-50/50" textColor="text-emerald-900" />
            <PredictionCategory title="රැකියාව" sub="වැඩ සහ දියුණුව" icon="W" content={localizedPredictions.career} color="bg-amber-50/50" textColor="text-amber-900" />
            <PredictionCategory title="ධනය" sub="මුදල් සහ සම්පත්" icon="$" content={localizedPredictions.wealth} color="bg-indigo-50/50" textColor="text-indigo-900" />
            <PredictionCategory title="ආදරය" sub="සම්බන්ධතා" icon="L" content={localizedPredictions.love} color="bg-rose-50/50" textColor="text-rose-900" />
            <PredictionCategory title="අධ්‍යාපනය" sub="ඉගෙනීම" icon="E" content={localizedPredictions.education} color="bg-cyan-50/50" textColor="text-cyan-900" />
            <PredictionCategory title="සාමාන්‍ය තත්වය" sub="සාරාංශය" icon="G" content={localizedPredictions.general} color="bg-slate-50/50" textColor="text-slate-900" />
            <PredictionCategory title="මහා දශාව" sub="ප්‍රධාන දශා කාලය" icon="MD" content={localizedPredictions.mahaDasha} color="bg-violet-50/50" textColor="text-violet-900" borderColor="border-violet-200" />
            <PredictionCategory title="අන්තර දශාව" sub="අතුරු දශා කාලය" icon="AD" content={localizedPredictions.antaraDasha} color="bg-purple-50/50" textColor="text-purple-900" borderColor="border-purple-200" />
            <PredictionCategory title="ග්‍රහ පිහිටීම්" sub="ග්‍රහ තත්වය" icon="PP" content={localizedPredictions.planetaryPositions} color="bg-indigo-50/50" textColor="text-indigo-900" />
            <PredictionCategory title="උපදෙස් සහ පිළියම්" sub="හොඳ මාර්ග" icon="AR" content={localizedPredictions.adviceRemedies} color="bg-orange-50/50" textColor="text-orange-900" />

            <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed font-bold italic">
                ඔබට තවත් ගැඹුරු පෞද්ගලික විග්‍රහයක් අවශ්‍ය නම් අත්ල විග්‍රහයද බලන්න.
              </p>
              <button
                onClick={() => onNavigate?.('palm')}
                className="w-full py-5 bg-gray-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>අත්ල විග්‍රහය බලන්න</span>
                <span>{'>'}</span>
              </button>
            </div>
          </>
        ) : null}
      </section>

      <footer className="pt-8 pb-12 flex flex-col items-center space-y-4">
        <div className="w-16 h-1 bg-gray-200 rounded-full mb-2" />
        <div className="text-center space-y-2">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-100 py-3 px-8 rounded-2xl shadow-sm inline-block">
            <h4 className="text-xl font-black text-gray-800 tracking-tight">විශ්වය</h4>
            <div className="h-px bg-green-100 w-full mt-1" />
            <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mt-1 italic">නව ජීවිත මග සොයන ඔබට</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-white shadow-sm">
    <div className="flex-1">
      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
      <p className="font-bold text-gray-700 text-sm">{value}</p>
    </div>
  </div>
);

const PredictionCategory: React.FC<{
  title: string;
  sub: string;
  icon: string;
  content: string;
  color: string;
  textColor: string;
  borderColor?: string;
}> = ({ title, sub, icon, content, color, textColor, borderColor = 'border-white' }) => {
  const normalizedContent = translateDashboardText(content);
  const lines = normalizedContent.split(/\n|•/).filter((line) => line.trim().length > 0);
  const displayLines = lines.length > 0 ? lines : ['-'];

  return (
    <div className={`${color} p-8 rounded-[3rem] border ${borderColor} zen-shadow space-y-4`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sm shadow-sm">{icon}</div>
        <div>
          <h4 className={`font-black text-lg ${textColor} leading-tight`}>{title}</h4>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <div className="space-y-3">
        {displayLines.map((line, index) => (
          <div key={index} className="flex items-start space-x-2">
            {displayLines.length > 1 && <span className={`${textColor} opacity-30 mt-1.5`}>*</span>}
            <p className={`text-sm leading-relaxed ${textColor} opacity-80 font-medium flex-1`}>
              {line.trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

