
import React, { useEffect, useState } from 'react';
import { UserProfile, LuckHighlights, Prediction } from '../types';
import { getLuckHighlights, getPredictions } from '../services/geminiService';

// Define the missing DashboardProps interface
interface DashboardProps {
  profile: UserProfile;
  onNavigate?: (tab: string) => void;
}

const RASHI_DATA: Record<string, { sinhala: string; symbol: string; color: string; icon: string }> = {
  'Aries': { sinhala: 'මේෂ', symbol: '♈', color: 'text-red-500', icon: '♈' },
  'Taurus': { sinhala: 'වෘෂභ', symbol: '♉', color: 'text-green-600', icon: '♉' },
  'Gemini': { sinhala: 'මිථුන', symbol: '♊', color: 'text-yellow-500', icon: '♊' },
  'Cancer': { sinhala: 'කටක', symbol: '♋', color: 'text-blue-400', icon: '♋' },
  'Leo': { sinhala: 'සිංහ', symbol: '♌', color: 'text-orange-500', icon: '♌' },
  'Virgo': { sinhala: 'කන්‍යා', symbol: '♍', color: 'text-emerald-500', icon: '♍' },
  'Libra': { sinhala: 'තුලා', symbol: '♎', color: 'text-pink-400', icon: '♎' },
  'Scorpio': { sinhala: 'වෘශ්චික', symbol: '♏', color: 'text-rose-600', icon: '♏' },
  'Sagittarius': { sinhala: 'ධනු', symbol: '♐', color: 'text-purple-500', icon: '♐' },
  'Capricorn': { sinhala: 'මකර', symbol: '♑', color: 'text-slate-600', icon: '♑' },
  'Aquarius': { sinhala: 'කුම්භ', symbol: '♒', color: 'text-sky-500', icon: '♒' },
  'Pisces': { sinhala: 'මීන', symbol: '♓', color: 'text-indigo-400', icon: '♓' },
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
      } catch (e) {} finally { setHLoading(false); }

      try {
        const p = await getPredictions(profile);
        setPredictions(p);
      } catch (e) {} finally { setPLoading(false); }
    };
    load();
  }, [profile]);

  // Using simplified RASHI_DATA mapping for icons and colors
  const rashiTheme = profile.rashi ? RASHI_DATA[profile.rashi] || { sinhala: profile.rashi, symbol: '☀️', color: 'text-green-600', icon: '☀️' } : { sinhala: 'නොදනී', symbol: '☀️', color: 'text-gray-400', icon: '☀️' };

  const formatSinhalaDate = (date: Date) => {
    const days = ['ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'];
    const months = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];
    return `${date.getFullYear()} ${months[date.getMonth()]} ${date.getDate()} ${days[date.getDay()]}`;
  };

  const formatSinhalaTime = (date: Date) => {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const period = h >= 12 ? 'ප.ව.' : 'පෙ.ව.';
    h = h % 12 || 12;
    return `${period} ${h}:${m}:${s}`;
  };

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col items-center text-center pt-2 space-y-4">
        <div className="flex justify-between w-full items-start px-2">
          <div className="text-left space-y-1">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">ආයුබෝවන්, {profile.name}!</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-xl p-1.5 bg-purple-50 rounded-lg inline-flex items-center justify-center ${rashiTheme.color}`}>
                {rashiTheme.icon}
              </span>
              <p className={`font-black sinhala text-xl ${rashiTheme.color}`}>{rashiTheme.sinhala} ලග්නය</p>
            </div>
          </div>
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center zen-shadow border border-gray-100 text-3xl shadow-sm">
            {profile.gender === 'female' ? '👩' : '👨'}
          </div>
        </div>

        {/* Live Date/Time Display */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/60 py-3 px-6 rounded-3xl space-y-0.5 w-full max-w-[320px] shadow-sm">
          <p className="sinhala text-sm font-bold text-gray-600">{formatSinhalaDate(currentTime)}</p>
          <p className="sinhala text-lg font-black text-green-600 tracking-widest">{formatSinhalaTime(currentTime)}</p>
        </div>
      </header>

      {/* Weekly Luck Section */}
      <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black sinhala text-gray-800">සතියේ සුබ අසුබ</h3>
          <span className="text-[9px] text-green-600 font-black uppercase tracking-[0.2em]">Weekly Luck</span>
        </div>

        {hLoading ? (
          <WeeklyLuckSkeleton />
        ) : highlights && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/30 p-5 rounded-[2rem] border border-emerald-100/50 text-center space-y-1">
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">සුබ දිශාව</p>
                <p className="sinhala font-black text-gray-800 text-xl">{highlights.auspiciousDirection}</p>
              </div>
              <div className="bg-rose-50/30 p-5 rounded-[2rem] border border-rose-100/50 text-center space-y-1">
                <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest">අසුබ දිශාව</p>
                <p className="sinhala font-black text-gray-800 text-xl">{highlights.inauspiciousDirection}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-white shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-inner">📅</div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">සුබ දවස්</p>
                  <p className="sinhala font-bold text-gray-700 text-sm">{(highlights.luckyDays || []).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-white shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-inner">🕒</div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">සුබ වේලාවන්</p>
                  <p className="sinhala font-bold text-gray-700 text-sm">{(highlights.luckyTimes || []).join(' | ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-white shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-inner">🎨</div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">සුබ වර්ණ</p>
                  <p className="sinhala font-bold text-gray-700 text-sm">{(highlights.luckyColors || []).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-white shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-inner">🔢</div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">ජය අංකය</p>
                  <p className="sinhala font-black text-gray-800 text-lg">{highlights.luckyNumber}</p>
                </div>
              </div>
            </div>

            {/* Special phrase current week highlight */}
            <div className="mt-2 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-[2rem] border border-green-100/50 shadow-sm">
               <div className="flex items-center space-x-2 mb-2">
                 <span className="text-lg">✨</span>
                 <p className="text-[10px] text-green-700 font-black uppercase tracking-widest">මෙම සතියේ සාරාංශය</p>
               </div>
               <p className="sinhala text-sm text-green-800 leading-relaxed font-bold italic">
                 {highlights.weeklyHighlight}
               </p>
            </div>
          </div>
        )}
      </section>

      {/* Detailed Analysis Header - Aligned with Current Month */}
      <div className="px-2 pt-4 flex flex-col items-center text-center">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-green-100 py-3 px-8 rounded-full shadow-sm">
          <h3 className="text-2xl font-black sinhala text-gray-800 tracking-tight leading-tight">විස්තරාත්මක විග්‍රහය</h3>
          <p className="text-green-600 text-[10px] uppercase font-black tracking-[0.3em] mt-0.5">2026 පෙබරවාරි මාසය සඳහා</p>
        </div>
      </div>

      {/* Categorized Predictions */}
      <section className="space-y-6">
        {pLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : predictions && (
          <>
            <PredictionCategory title="චරිත ලක්ෂණ" sub="Character Traits" icon="🧬" content={predictions.characterTraits} color="bg-blue-50/50" textColor="text-blue-900" />
            <PredictionCategory title="සෞඛ්‍යය" sub="Health" icon="🏥" content={predictions.health} color="bg-emerald-50/50" textColor="text-emerald-900" />
            <PredictionCategory title="වෘත්තිය" sub="Career" icon="🏢" content={predictions.career} color="bg-amber-50/50" textColor="text-amber-900" />
            <PredictionCategory title="ධනය" sub="Wealth" icon="💰" content={predictions.wealth} color="bg-indigo-50/50" textColor="text-indigo-900" />
            <PredictionCategory title="ආදරය" sub="Love" icon="❤️" content={predictions.love} color="bg-rose-50/50" textColor="text-rose-900" />
            <PredictionCategory title="අධ්‍යාපනය" sub="Education" icon="🎓" content={predictions.education} color="bg-cyan-50/50" textColor="text-cyan-900" />

            {/* General Description Hero Card */}
            <div className="bg-[#1a1c3b] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none">✨</div>
              <div className="relative z-10 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-black sinhala text-2xl tracking-tight">පොදු විස්තරය</h4>
                  <p className="sinhala text-base opacity-90 leading-relaxed font-medium">
                    {predictions.general}
                  </p>
                </div>
              </div>
            </div>

            {/* New Sections: Dasha and Planetary Positions with enhanced visual markers as per screenshot requirements */}
            <PredictionCategory title="මහා දශා කාලසටහන" sub="Vimshottari Dasha" icon="🕰️" content={predictions.mahaDasha} color="bg-violet-50/50" textColor="text-violet-900" borderColor="border-violet-200" />
            <PredictionCategory title="අතුරු දශාව" sub="Antar Dasha / Bhukti" icon="⌛" content={predictions.antaraDasha} color="bg-purple-50/50" textColor="text-purple-900" borderColor="border-purple-200" />
            <PredictionCategory title="ග්‍රහ පිහිටීම" sub="Special Planetary Positions" icon="🪐" content={predictions.planetaryPositions} color="bg-indigo-50/50" textColor="text-indigo-900" />
            <PredictionCategory title="උපදෙස් සහ ප්‍රතිකර්ම" sub="General Advice & Remedies" icon="🪔" content={predictions.adviceRemedies} color="bg-orange-50/50" textColor="text-orange-900" />

            {/* Palm CTA */}
            <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-4">
                <p className="sinhala text-xs text-gray-500 leading-relaxed font-bold italic">
                    ඔබේ අනාගතය පිළිබඳ වඩාත් නිවැරදි හා විස්තරාත්මක අනාවැකි ලබා ගැනීමට අපගේ අත්ල සාස්තර (Palm Analysis) සේවාව භාවිතා කරන්න.
                </p>
                <button 
                onClick={() => onNavigate?.('palm')}
                className="w-full py-5 bg-gray-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                <span>Get More Details with Palm Analysis</span>
                <span>→</span>
                </button>
            </div>

            {/* Pirith Recommendation CTA */}
            <div className="bg-orange-50 p-8 rounded-[3.5rem] border border-orange-100/50 space-y-6 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate?.('profile')}>
              <div className="absolute top-0 right-0 p-6 text-5xl opacity-10 group-hover:rotate-12 transition-transform">🪔</div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">🕉️</div>
                   <h4 className="sinhala font-black text-orange-900 text-lg">ආධ්‍යාත්මික ආශිර්වාදය</h4>
                </div>
                <p className="sinhala text-sm text-orange-800 leading-relaxed font-black">
                  ඔබගේ තත්ත්වය අනුව පිරිත් ශාන්ති ඔබගේ Profile කොටසට දැන් එක් කර ඇත. වැඩි විස්තර සහ පිරිත්වලට සවන් දීමට Profile වෙත පිවිසෙන්න.
                </p>
                <div className="flex items-center space-x-2 text-orange-600">
                  <span className="text-[10px] font-black uppercase tracking-widest">Explore Personalized Chants</span>
                  <span className="animate-pulse">→</span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* App Branding Footer */}
      <footer className="pt-8 pb-12 flex flex-col items-center space-y-4">
        <div className="w-16 h-1 bg-gray-200 rounded-full mb-2"></div>
        <div className="text-center space-y-2">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-100 py-3 px-8 rounded-2xl shadow-sm inline-block">
            <h4 className="text-xl font-black text-gray-800 tracking-tight">WISHWAYA | විශ්වය</h4>
            <div className="h-px bg-green-100 w-full mt-1"></div>
            <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.4em] mt-1 italic">FOR THE MODERN LIFE SEEKERS</p>
          </div>
        </div>
        <p className="sinhala text-[11px] text-gray-400 font-medium px-12 text-center leading-relaxed opacity-70">
          සෑම පියවරක්ම විශ්වයේ ආශිර්වාදය හා මඟ පෙන්වීම සමඟින් පෙරට ගෙන යන්න.
        </p>
        <div className="pt-2">
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Powered by Impulse Digital Lab</p>
        </div>
      </footer>
    </div>
  );
};

const PredictionCategory: React.FC<{ 
  title: string; 
  sub: string; 
  icon: string; 
  content: string; 
  color: string; 
  textColor: string;
  borderColor?: string;
}> = ({ title, sub, icon, content, color, textColor, borderColor = "border-white" }) => {
  // Support multiline content splitting by common delimiters like newlines or dots/bullets if provided by AI
  const lines = String(content || '').split(/\n|•/).filter(l => l.trim().length > 0);
  
  return (
    <div className={`${color} p-8 rounded-[3rem] border ${borderColor} zen-shadow space-y-4`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">{icon}</div>
        <div>
          <h4 className={`sinhala font-black text-lg ${textColor} leading-tight`}>{title}</h4>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <div className="space-y-3">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            {lines.length > 1 && <span className={`${textColor} opacity-30 mt-1.5`}>•</span>}
            <p className={`sinhala text-sm leading-relaxed ${textColor} opacity-80 font-medium flex-1`}>
              {line.trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
