
import React, { useEffect, useState } from 'react';
import { UserProfile, GemstoneAdvice } from '../types';
import { getGemstoneAdvice } from '../services/geminiService';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface GemstonesProps {
  profile: UserProfile;
}

const Gemstones: React.FC<GemstonesProps> = ({ profile }) => {
  const [data, setData] = useState<GemstoneAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setShowLoading(true);
    setError(false);
    try {
      const res = await getGemstoneAdvice(profile);
      setData(res);
    } catch (err) {
      setError(false);
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
        icon="💎"
        title="ගවේෂණය කරමින්..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="pink"
        messages={[
          "ඔබගේ පැතිකඩ විශ්ලේෂණය කරමින් පවතී...",
          "ගැලපෙන මැණික් වර්ග පරීක්ෂා කරමින් පවතී...",
          "ස්වර්ණාභරණ උපදෙස් සකස් කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-black sinhala text-gray-800">මැණික් හා වර්ණ</h2>
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Gemstone & Color Guide</p>
      </header>

      {error ? (
        <div className="bg-red-50 p-8 rounded-[3rem] text-center space-y-4">
          <p className="sinhala text-red-800 text-sm font-bold">දත්ත ලබා ගත නොහැක.</p>
          <button onClick={loadData} className="px-6 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Retry</button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-50" />
          
          <div className="text-center space-y-4 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-5xl shadow-xl shadow-pink-100/50">💎</div>
            <h3 className="sinhala font-black text-3xl text-gray-800">{data?.gemstone}</h3>
            {data?.jewelryType && (
              <p className="sinhala text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-4 py-1 rounded-full inline-block">
                {data.jewelryType}
              </p>
            )}
            {data?.secondaryGemstone && (
              <div className="pt-2">
                <p className="sinhala text-[10px] text-gray-400 uppercase font-bold tracking-widest">විකල්ප මැණික් වර්ගය</p>
                <p className="sinhala text-sm font-bold text-gray-600">{data.secondaryGemstone}</p>
              </div>
            )}
            <p className="sinhala text-sm text-gray-500 max-w-xs mx-auto">{data?.benefits}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-[2rem] space-y-1 text-center border border-white">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest sinhala">ලෝහය</span>
              <p className="sinhala font-black text-gray-800">{data?.metal}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2rem] space-y-1 text-center border border-white">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest sinhala">ඇඟිල්ල</span>
              <p className="sinhala font-black text-gray-800">{data?.finger}</p>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-[2.5rem] border border-green-100/50 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✨</span>
              <h4 className="sinhala font-black text-green-700 uppercase text-xs tracking-wider">පැළඳිය යුතු ආකාරය</h4>
            </div>
            <p className="sinhala text-sm text-green-800/80 leading-relaxed font-medium">{data?.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gemstones;
