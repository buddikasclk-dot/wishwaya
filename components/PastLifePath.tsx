
import React, { useEffect, useState } from 'react';
import { UserProfile, PastLifeResult } from '../types';
import { getPastLifeReading } from '../services/geminiService';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface PastLifePathProps {
  profile: UserProfile;
}

const PastLifePath: React.FC<PastLifePathProps> = ({ profile }) => {
  const [data, setData] = useState<PastLifeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setShowLoading(true);
    setError(false);
    try {
      const res = await getPastLifeReading(profile);
      setData(res);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={!loading} 
        onComplete={() => setShowLoading(false)}
        icon="🌀"
        title="ආත්මීය මඟ විශ්ලේෂණය කරමින්..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="indigo"
        messages={[
          "ඔබගේ ආධ්‍යාත්මික පැතිකඩ විශ්ලේෂණය කරමින් පවතී...",
          "ඔබගේ ආත්මීය මඟ සොයා ගනිමින් පවතී...",
          "මඟ පෙන්වීම් සකස් කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl">🌀</div>
        <p className="sinhala text-gray-800 font-bold">ආත්මීය දත්ත කියවීමට නොහැකි විය.</p>
        <button 
          onClick={loadData}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black sinhala active:scale-95 transition-transform"
        >
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    );
  }

  return (
    <div className="p-0 pb-24 space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-2 pt-12 pb-8 bg-white">
        <div className="w-20 h-20 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative">
          <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-pulse"></div>
          <span className="text-4xl relative z-10">🌀</span>
        </div>
        <h2 className="text-4xl font-black sinhala text-gray-800 tracking-tight">ආත්මීය මඟ</h2>
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Past Life & Soul Path</p>
      </header>

      {/* Hero Section: Past Cycle - Styled to match screenshot */}
      <div className="bg-[#1a1c3b] p-10 rounded-t-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden min-h-[60vh]">
        <div className="absolute top-10 right-10 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl pointer-events-none">🕉️</div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/60">පූර්ව කර්ම රටාවන් (Karmic Themes)</span>
            <p className="sinhala text-xl font-medium leading-[1.8] text-white/95">
              {data?.pastKarmicThemes}
            </p>
          </div>
          
          <div className="h-px bg-white/10 w-full" />
          
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/60">උරුම වූ ශක්තීන් (Strengths)</span>
            <p className="sinhala text-base opacity-90 leading-relaxed text-white/80">
              {data?.inheritedStrengths}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 -mt-10 relative z-20">
        {/* Mission Section */}
        <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🛤️</span>
            <h4 className="sinhala font-black text-gray-800 text-lg">මෙම භවයේ අරමුණ</h4>
          </div>
          <p className="sinhala text-sm text-gray-600 leading-relaxed font-medium">
            {data?.soulMission}
          </p>
        </div>

        {/* Lessons Section */}
        <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100/50 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📖</span>
            <h4 className="sinhala font-black text-indigo-900 text-lg">ඉගෙන ගත යුතු පාඩම්</h4>
          </div>
          <p className="sinhala text-sm text-indigo-800/80 leading-relaxed font-medium">
            {data?.presentLessons}
          </p>
        </div>

        {/* Advice Section */}
        <div style={{ backgroundColor: '#30435f' }} className="p-8 rounded-[3rem] space-y-6 shadow-xl shadow-indigo-100/50 border border-white/10">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✨</span>
            <h4 style={{ backgroundColor: '#a1cded' }} className="sinhala font-black text-lg px-4 py-1.5 rounded-xl text-[#30435f]">
              ප්‍රායෝගික උපදෙස්
            </h4>
          </div>
          <p style={{ backgroundColor: '#9db9ff' }} className="sinhala text-sm text-[#30435f] leading-relaxed font-black p-6 rounded-[2rem]">
            {data?.practicalAdvice}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center">
        <p className="sinhala text-[10px] text-gray-400 font-bold leading-relaxed px-4 italic">
          මෙම තොරතුරු අදාළ ජ්‍යෝතිෂ්‍ය විශ්වාසයන් සහ සාම්ප්‍රදායික අර්ථකථන මත පදනම් වූ ආධ්‍යාත්මික මඟ පෙන්වීමක් පමණි.
          (This reading is based on relevant astrological beliefs and traditional interpretations.)
        </p>
      </div>

      <div className="text-center opacity-40 pb-4">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">Wisdom Across Time • Wishwaya AI</p>
      </div>
    </div>
  );
};

export default PastLifePath;
