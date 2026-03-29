
import React, { useEffect, useState } from 'react';
import { UserProfile, RemedyResult } from '../types';
import { getSpiritualRemedies } from '../services/geminiService';
import { ResultLoadingScreen } from './ResultLoadingScreen';
import DetailedReportCTA from './DetailedReportCTA';

interface RemediesProps {
  profile: UserProfile;
}

const Remedies: React.FC<RemediesProps> = ({ profile }) => {
  const [data, setData] = useState<RemedyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setShowLoading(true);
    setError(false);
    try {
      const res = await getSpiritualRemedies(profile);
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

  // Map the new RemedyResult structure to the UI's expected list format
  const remedyList = data ? [
    {
      problem: data.summary.shortText,
      remedy: `${data.remedies.primary.description}${data.remedies.primary.steps && data.remedies.primary.steps.length > 0 ? `\n\n${data.remedies.primary.steps.map(s => `• ${s}`).join('\n')}` : ''}`
    },
    ...data.remedies.secondary.map(s => ({
      problem: s.title,
      remedy: s.description
    })),
    ...(data.remedies.doAvoidNotes.length > 0 ? [{
      problem: "අමතර උපදෙස් (Do/Avoid)",
      remedy: data.remedies.doAvoidNotes.map(n => `${n.type === 'do' ? '✅' : '❌'} ${n.text}`).join('\n')
    }] : [])
  ] : [];

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={!loading} 
        onComplete={() => setShowLoading(false)}
        icon="🪔"
        title="ප්‍රතිකර්ම විශ්ලේෂණය කරමින්..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="indigo"
        messages={[
          "ඔබගේ පැතිකඩ විශ්ලේෂණය කරමින් පවතී...",
          "ගැලපෙන වත්පිළිවෙත් පරීක්ෂා කරමින් පවතී...",
          "ශාන්තිකර්ම උපදෙස් සකස් කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-black sinhala text-gray-800">අපල සඳහා වත්පිළිවෙත්</h2>
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Spiritual Remedies</p>
      </header>

      {error ? (
        <div className="bg-red-50 p-8 rounded-[3rem] text-center space-y-4">
          <p className="sinhala text-red-800 text-sm font-bold">දත්ත ලබා ගත නොහැක.</p>
          <button onClick={loadData} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black">Retry</button>
        </div>
      ) : (
        <div className="bg-indigo-950 p-6 py-10 rounded-[3rem] space-y-8 shadow-2xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
            <span className="text-4xl animate-pulse">🪔</span>
            <h3 className="text-xl font-black sinhala text-white tracking-wide">ප්රතිකර්ම වාර්තාව</h3>
          </div>

          {remedyList.length > 0 ? (
            <div className="space-y-6 relative z-10">
              {remedyList.map((rem, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-inner">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5 sinhala opacity-80">පවතින තත්වය</p>
                      <p className="sinhala text-white text-base font-bold leading-relaxed whitespace-pre-line">{rem.problem}</p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div>
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5 sinhala opacity-80">නිර්දේශිත ප්රතිකර්මය</p>
                      <p className="sinhala text-sm text-gray-200 leading-relaxed font-medium whitespace-pre-line">{rem.remedy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 p-10 rounded-[2.5rem] text-center relative z-10 border border-white/5">
              <p className="sinhala text-white opacity-60">දැනට විශේෂ අපල තත්වයන් වාර්තා වී නොමැත.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 zen-shadow">
        <p className="text-center text-[11px] text-gray-500 font-bold tracking-tight sinhala leading-relaxed">
          සියලු වත්පිළිවෙත් පිරිසිදු සිතින් ඉටු කිරීම වඩාත් සුබ පල ලබා දෙයි. විශ්වාසය සහ භක්තිය අපල දුරු කිරීමට උපකාරී වේ.
        </p>
      </div>
      {!error && <DetailedReportCTA />}
    </div>
  );
};

export default Remedies;
