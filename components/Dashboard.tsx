import React, { useEffect, useState } from 'react';
import { UserProfile, LuckHighlights, Prediction } from '../types';
import { getLuckHighlights, getPredictions } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onNavigate?: (tab: string) => void;
}

const RASHI_DATA: Record<string, { sinhala: string; symbol: string; color: string; icon: string; glow: string }> = {
  Aries: { sinhala: 'මේෂ', symbol: 'Aries', color: 'text-red-500', icon: '♈', glow: 'from-rose-100 via-orange-50 to-white' },
  Taurus: { sinhala: 'වෘෂභ', symbol: 'Taurus', color: 'text-green-600', icon: '♉', glow: 'from-emerald-100 via-lime-50 to-white' },
  Gemini: { sinhala: 'මිථුන', symbol: 'Gemini', color: 'text-yellow-500', icon: '♊', glow: 'from-yellow-100 via-amber-50 to-white' },
  Cancer: { sinhala: 'කටක', symbol: 'Cancer', color: 'text-blue-400', icon: '♋', glow: 'from-sky-100 via-cyan-50 to-white' },
  Leo: { sinhala: 'සිංහ', symbol: 'Leo', color: 'text-orange-500', icon: '♌', glow: 'from-orange-100 via-amber-50 to-white' },
  Virgo: { sinhala: 'කන්‍යා', symbol: 'Virgo', color: 'text-emerald-500', icon: '♍', glow: 'from-emerald-100 via-green-50 to-white' },
  Libra: { sinhala: 'තුලා', symbol: 'Libra', color: 'text-pink-400', icon: '♎', glow: 'from-pink-100 via-rose-50 to-white' },
  Scorpio: { sinhala: 'වෘශ්චික', symbol: 'Scorpio', color: 'text-rose-600', icon: '♏', glow: 'from-rose-100 via-red-50 to-white' },
  Sagittarius: { sinhala: 'ධනු', symbol: 'Sagittarius', color: 'text-purple-500', icon: '♐', glow: 'from-violet-100 via-purple-50 to-white' },
  Capricorn: { sinhala: 'මකර', symbol: 'Capricorn', color: 'text-slate-600', icon: '♑', glow: 'from-slate-100 via-gray-50 to-white' },
  Aquarius: { sinhala: 'කුම්භ', symbol: 'Aquarius', color: 'text-sky-500', icon: '♒', glow: 'from-sky-100 via-blue-50 to-white' },
  Pisces: { sinhala: 'මීන', symbol: 'Pisces', color: 'text-indigo-400', icon: '♓', glow: 'from-indigo-100 via-blue-50 to-white' },
};

const SkeletonCard = () => (
  <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-gray-100 rounded-full"></div>
        <div className="h-2 w-1/4 bg-gray-50 rounded-full"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-gray-50 rounded-full"></div>
      <div className="h-3 w-[90%] bg-gray-50 rounded-full"></div>
      <div className="h-3 w-[80%] bg-gray-50 rounded-full"></div>
    </div>
  </div>
);

const WeeklyLuckSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50/50 h-24 rounded-[2rem] border border-gray-100/50"></div>
      <div className="bg-gray-50/50 h-24 rounded-[2rem] border border-gray-100/50"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-4 bg-gray-50/30 p-4 rounded-3xl border border-white">
          <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
            <div className="h-3 w-24 bg-gray-50 rounded-full"></div>
          </div>
        </div>
      ))}
      <div className="bg-gray-50/50 h-12 rounded-2xl w-full"></div>
    </div>
  </div>
);

const safeText = (value: unknown) => {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(v => String(v ?? '').trim()).filter(Boolean).join('\n');
  if (value == null) return '';
  return String(value).trim();
};

const formatList = (value: unknown, separator = ', ') => {
  if (Array.isArray(value)) return value.filter(Boolean).join(separator) || '-';
  if (typeof value === 'string') return value.trim() || '-';
  return '-';
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
  [/\bNorth-East\b/gi, 'ඊසාන'],
  [/\bNorth-West\b/gi, 'වයඹ'],
  [/\bSouth-East\b/gi, 'ගිණිකොන'],
  [/\bSouth-West\b/gi, 'නිරිත'],
  [/\bNorth\b/gi, 'උතුර'],
  [/\bSouth\b/gi, 'දකුණ'],
  [/\bRed\b/gi, 'රතු'],
  [/\bWhite\b/gi, 'සුදු'],
  [/\bGreen\b/gi, 'කොළ'],
  [/\bSilver\b/gi, 'රිදී'],
  [/\bGold\b/gi, 'රන්'],
  [/\bPink\b/gi, 'රෝස'],
  [/\bMaroon\b/gi, 'තද රතු'],
  [/\bYellow\b/gi, 'කහ'],
  [/\bBlue\b/gi, 'නිල්'],
  [/\bSky Blue\b/gi, 'ලා නිල්'],
  [/\bAM\b/gi, 'පෙරවරු'],
  [/\bPM\b/gi, 'පස්වරු'],
  [/\bsign\b/gi, 'ලග්නය'],
  [/\bfocused\b/gi, 'අවධානයෙන්'],
  [/\bweek\b/gi, 'සතිය'],
  [/\bmonth\b/gi, 'මාසය'],
];

const translateDashboardText = (value: unknown) => {
  const text = safeText(value);
  if (!text) return '';

  let translated = text;
  WORD_TRANSLATIONS.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  return translated
    .replace(/should stay focused this week and move calmly toward important goals\./gi, 'මෙම සතියේ වැදගත් අරමුණු වෙත සන්සුන්ව සහ අවධානයෙන් ගමන් කරන්න.')
    .replace(/shows leadership potential, emotional intensity, and a need for steady decision-making this month\./gi, 'මෙම මාසයේ නායකත්ව ගුණ, තද හැඟීම් සහ ස්ථිර තීරණ ගැනීමේ අවශ්‍යතාව පෙන්වයි.')
    .replace(/Energy can fluctuate this month\. Keep your sleep, food timing, and stress levels balanced for better results\./gi, 'මෙම මාසයේ ශක්තිය උච්චාවචනය විය හැක. හොඳ ප්‍රතිඵල සඳහා නින්ද, ආහාර වේලාව සහ මානසික පීඩනය සමබරව තබාගන්න.')
    .replace(/Work progress is possible, but success will depend on patience, communication, and avoiding rushed decisions\./gi, 'වැඩ කටයුතු ඉදිරියට යා හැක. නමුත් සාර්ථකත්වය සඳහා ඉවසීම, හොඳ සන්නිවේදනය සහ හදිසි තීරණ වලින් වැළකීම වැදගත්ය.')
    .replace(/Financially this is a moderate period\. Control unnecessary spending and review commitments before making new investments\./gi, 'මුදල් පැත්තෙන් මෙය සාමාන්‍ය කාලයකි. අනවශ්‍ය වියදම් පාලනය කර නව ආයෝජන කිරීමට පෙර හොඳින් සලකා බලන්න.')
    .replace(/Relationships can improve through calm communication\. Avoid misunderstandings caused by ego, silence, or overthinking\./gi, 'සන්සුන් කතාබහ තුළින් සම්බන්ධතා හොඳ විය හැක. අහංකාරය, නිහඬතාව හෝ වැඩිපුර සිතීම නිසා ඇතිවන වැරදි අවබෝධ වලින් වළකින්න.')
    .replace(/Learning and focus can improve with discipline\. Reduce distraction and keep a clear daily study structure\./gi, 'අනුශාසනය තිබේ නම් ඉගෙනීම සහ අවධානය වැඩි දියුණු වේ. අවධානය බිඳවන දේ අඩු කර දිනපතා පැහැදිලි පාඩම් සැලැස්මක් තබාගන්න.')
    .replace(/This month brings mixed but manageable energy\. Good habits, mindfulness, and timely action can reduce most negative influences\./gi, 'මෙම මාසයේ මිශ්‍ර නමුත් පාලනය කළ හැකි බලපෑම් ඇත. හොඳ පුරුදු, සිහිකල්පනාව සහ වේලාවට කරන ක්‍රියා බොහෝ අසුබ බලපෑම් අඩු කරයි.')
    .replace(/Major planetary period effects appear steady, with gradual progress rather than sudden breakthrough\./gi, 'ප්‍රධාන දශා කාලයේ බලපෑම් ස්ථාවර ලෙස පෙනේ. හදිසි විශාල වෙනසකට වඩා ටිකෙන් ටික දියුණුව ලැබේ.')
    .replace(/Sub-period influence may create short-term emotional or practical pressure, but careful action can keep matters stable\./gi, 'අතුරු දශා බලපෑම නිසා කෙටි කාලීන මානසික හෝ ප්‍රායෝගික පීඩනයක් ඇතිවිය හැක. එහෙත් සැලකිලිමත් ක්‍රියාවෙන් තත්වය ස්ථාවරව තබාගත හැක.')
    .replace(/Current planetary movement suggests a need for balance, patience, and attention to personal responsibilities\./gi, 'දැනට ග්‍රහ ගමන අනුව සමබරතාව, ඉවසීම සහ පෞද්ගලික වගකීම් ගැන වැඩි අවධානයක් අවශ්‍ය බව පෙනේ.')
    .replace(/Wake early, keep thoughts steady, avoid unnecessary conflict, and follow spiritual or calming routines consistently\./gi, 'ඉක්මනින් අවදි වන්න, සිතුවිලි ස්ථිරව තබාගන්න, අනවශ්‍ය ගැටුම් වලින් වළකින්න, සහ ආධ්‍යාත්මික හෝ සන්සුන් පුරුදු නිතිපතා අනුගමනය කරන්න.')
    .trim();
};

const hasEnglishLetters = (value: string) => /[A-Za-z]/.test(value);

const buildDetailedSinhalaText = (field: keyof Prediction, rashiName: string) => {
  const detailed: Record<keyof Prediction, string> = {
    characterTraits: `${rashiName} ලග්නය ඇති ඔබට ස්වභාවික නායකත්ව ගුණ, තීරණ ගැනීමේ ධෛර්යය සහ ඉක්මනින් වැඩ ආරම්භ කිරීමේ හැකියාව ඇත. එහෙත් කෝපය හෝ හදිසි ප්‍රතිචාර නිසා කීප විටෙක වැරදි අවබෝධ ඇතිවිය හැකි බැවින් සන්සුන්ව කටයුතු කිරීම ඔබට ඉතා සුබයි. මෙම කාලයේ ඉවසීම සහ පැහැදිලි අදහස් ප්‍රකාශ කිරීම ඔබගේ වටිනාකම තවත් වැඩි කරයි.`,
    health: `මෙම කාලයේ ඔබගේ ශරීර ශක්තිය සමහර දිනවල ඉහළ ගොස් සමහර දිනවල පහළ යා හැක. නින්ද නිසි වේලාවට ගැනීම, ප්‍රමාණවත් ජලය පානය කිරීම, අධික උණුසුම් ආහාර හෝ මානසික පීඩනය අඩු කිරීම ඔබට බොහෝ උපකාරී වේ. විශේෂයෙන් උදෑසන සැහැල්ලු ව්‍යායාමයක් සහ සන්සුන් මනස පවත්වා ගැනීම සෞඛ්‍යයට හොඳ ප්‍රතිඵල දේ.`,
    career: `රැකියාව සහ වැඩ කටයුතු පැත්තෙන් ඉදිරියට යාමේ හොඳ අවස්ථා ඇත. නමුත් ඉක්මන් තීරණ වලට වඩා සැලැස්මකට අනුව වැඩ කිරීමෙන් ඔබට වැඩි ප්‍රතිඵල ලැබේ. වැඩ කරන ස්ථානයේ කතාබහ නිවැරදිව තබා ගැනීම, වගකීම් නිසි ලෙස අවසන් කිරීම සහ ඉවසීමෙන් කටයුතු කිරීම දියුණුවට හේතු වේ.`,
    wealth: `මුදල් පැත්තෙන් මෙය මධ්‍යස්ථ නමුත් පාලනය කළ හැකි කාලයකි. ලැබෙන ආදායම හොඳින් බෙදා වෙන් කර භාවිතා කළහොත් ඉදිරියට සුරක්ෂිත බවක් දැනේ. අනවශ්‍ය වියදම්, උණුසුම් සිතින් කරන මිලදී ගැනීම් හෝ පරීක්ෂා නොකළ ආයෝජන වලින් වළකින්න. ඉතිරි කිරීමේ පුරුද්ද මේ කාලයේ ඔබට බොහෝ වාසියක් දෙයි.`,
    love: `ආදරය සහ සම්බන්ධතා පැත්තෙන් සන්සුන් කතාබහ ඉතා වැදගත් වේ. ඔබගේ සිතේ ඇති දේ නිවැරදිව පැවසීමෙන් වැරදි අවබෝධ අඩු කර ගත හැක. අහංකාරය, නිහඬව සිටීම හෝ වැඩිපුර සිතීම නිසා ඇතිවන දුරස්ථභාවය අඩු කර ගැනීමට ආදරයෙන් සහ අවබෝධයෙන් යුතුව කටයුතු කරන්න. එවිට සම්බන්ධතා තවත් ශක්තිමත් වේ.`,
    education: `අධ්‍යාපනය සහ ඉගෙනීම පැත්තෙන් හොඳ දියුණුවක් ලබාගත හැකි කාලයකි. නිතරම එකම වේලාවකට පාඩම් කිරීම, අඩු අවධානයක් ඇති කරන දේවල් ඉවත් කිරීම සහ කුඩා ඉලක්ක තබාගෙන වැඩ කිරීම ඔබගේ මතකය සහ අවධානය වැඩි කරයි. අනුශාසනය මේ කාලයේ ඔබගේ ලොකුම ශක්තිය වේ.`,
    general: `මුළු කාලයම බැලූ විට මිශ්‍ර නමුත් ඔබට පාලනය කළ හැකි තත්වයක් පෙනේ. නිවැරදි පුරුදු, වේලාවට කරන වැඩ, සන්සුන් සිතුවිලි සහ ආගමික හෝ ආධ්‍යාත්මික පුරුදු අනුගමනය කිරීමෙන් බොහෝ අසුබ බලපෑම් අඩු කරගත හැක. ඉක්මන් වීමට වඩා නිවැරදිව සහ සන්සුන්ව ඉදිරියට යාම ඔබට යහපත් වේ.`,
    mahaDasha: `ප්‍රධාන දශා කාලයේ බලපෑම අනුව ඔබගේ ජීවිතයේ දේවල් ටිකෙන් ටික හැඩ ගැසෙන ස්වභාවයක් පෙනේ. හදිසි විශාල වෙනස්කම් වලට වඩා ස්ථාවර දියුණුව, අත්දැකීම් වැඩි වීම සහ ක්‍රමයෙන් වාසි ලැබීම මෙම කාලයේ ලක්ෂණ වේ. ඉවසීමෙන් කටයුතු කළහොත් හොඳ ප්‍රගතියක් පෙනේ.`,
    antaraDasha: `අතුරු දශා කාලයේ කෙටි කාලීන පීඩනයන්, සිතේ අවුල්කාරී බව හෝ දෛනික කටයුතු වල බරක් දැනීම ඇතිවිය හැක. නමුත් සැලකිලිමත් තීරණ, සන්සුන් කතාබහ සහ ආවේගය පාලනය කිරීම තුළින් මේ බලපෑම් හොඳින් පාලනය කළ හැක. කඩිනම් නොවූ සැලසුම් සහිත ක්‍රියා ඔබට වාසිදායකය.`,
    planetaryPositions: `දැනට පවතින ග්‍රහ ගමන අනුව ඔබගේ වගකීම්, පවුල් කටයුතු සහ පෞද්ගලික තීරණ ගැන වැඩි අවධානයක් යොමු කළ යුතු බව පෙනේ. සමබරතාව පවත්වා ගැනීම, ඉවසීමෙන් කටයුතු කිරීම සහ වැදගත් කාරණා කල් නොදමා නිසි වේලාවට කිරීමෙන් ග්‍රහ බලපෑම් හොඳ අතට හැරවිය හැක.`,
    adviceRemedies: `උදෑසන ඉක්මනින් අවදි වීම, මනස සන්සුන් කරන පුරුදු අනුගමනය කිරීම, ආගමික ස්ථානයකට යාම හෝ මනස නිශ්චල කරන පිරිතක් ඇසීම ඔබට සුබය. අනවශ්‍ය වාද විවාද වලින් වළකින්න, සිතුවිලි ස්ථිරව තබාගන්න, සහ දිනපතා කුඩා හොඳ වැඩක් කිරීමෙන් ජීවිතයේ සුබ බලපෑම් වැඩි කරගත හැක.`,
    remedies: '',
  };

  return detailed[field];
};

const getSinhalaPredictionContent = (
  field: keyof Prediction,
  content: string,
  rashiName: string
) => {
  const translated = translateDashboardText(content);
  if (!translated || translated === '-') {
    return buildDetailedSinhalaText(field, rashiName);
  }

  if (hasEnglishLetters(translated)) {
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
    return `මෙම සතියේ ${rashiName} ලග්නය සඳහා අවධානය, ඉවසීම සහ සන්සුන් කටයුතු ඉතා වැදගත් වේ. වැදගත් තීරණ ගැනීමේදී කලබල නොවී දෙවරක් සිතා ක්‍රියා කරන්න. මුදල්, වැඩ සහ පවුල් කටයුතු අතර සමබරතාව තබාගතහොත් සතිය පුරා හොඳ ප්‍රගතියක් දක්නට ලැබේ.`;
  }
  return translated;
};

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  const [highlights, setHighlights] = useState<LuckHighlights | null>(null);
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [hLoading, setHLoading] = useState(true);
  const [pLoading, setPLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const h = await getLuckHighlights(profile);
        setHighlights(h);
      } finally {
        setHLoading(false);
      }

      try {
        const p = await getPredictions(profile);
        setPredictions(p);
      } finally {
        setPLoading(false);
      }
    };

    load();
  }, [profile]);

  const rashiTheme = profile.rashi
    ? RASHI_DATA[profile.rashi] || { sinhala: profile.rashi, symbol: profile.rashi, color: 'text-green-600', icon: '✦', glow: 'from-emerald-100 via-white to-white' }
      : { sinhala: 'නොදනී', symbol: 'Unknown', color: 'text-gray-400', icon: '✦', glow: 'from-gray-100 via-white to-white' };

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
        adviceRemedies: getSinhalaPredictionContent('adviceRemedies', predictions.adviceRemedies, rashiTheme.sinhala),
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
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-gray-500 shadow-sm">
                <span>අද දවසේ ඔබ</span>
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

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm border border-white/80 py-3 px-6 rounded-3xl space-y-0.5 w-full max-w-[320px] shadow-sm mx-auto">
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

        {hLoading ? (
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
        {pLoading ? (
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
            <PredictionCategory title="ධනය" sub="මුදල් සහ සම්පත" icon="$" content={localizedPredictions.wealth} color="bg-indigo-50/50" textColor="text-indigo-900" />
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
        <div className="w-16 h-1 bg-gray-200 rounded-full mb-2"></div>
        <div className="text-center space-y-2">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-100 py-3 px-8 rounded-2xl shadow-sm inline-block">
            <h4 className="text-xl font-black text-gray-800 tracking-tight">විශ්වය</h4>
            <div className="h-px bg-green-100 w-full mt-1"></div>
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
  const lines = normalizedContent.split(/\n|•|â€¢/).filter(line => line.trim().length > 0);
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
        {displayLines.map((line, idx) => (
          <div key={idx} className="flex items-start space-x-2">
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
