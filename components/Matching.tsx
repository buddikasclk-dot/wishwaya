
import React, { useState, useEffect } from 'react';
import { MatchingState, UserProfile } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface MatchingProps {
  userProfile: UserProfile;
  matchingState: MatchingState;
  setMatchingState: React.Dispatch<React.SetStateAction<MatchingState>>;
  onStartAnalysis: (partner: any) => void;
}

const Matching: React.FC<MatchingProps> = ({ userProfile, matchingState, setMatchingState, onStartAnalysis }) => {
  const [partner, setPartner] = useState({ 
    name: '', 
    dob: '', 
    birthTime: '',
    city: '',
    rashi: '' 
  });
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (matchingState.status === 'analyzing') {
      setShowLoading(true);
    }
  }, [matchingState.status]);

  const handleMatch = () => {
    if (!partner.name || !partner.dob || !partner.birthTime || !partner.city) return;
    onStartAnalysis(partner);
  };

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#FCE4EC"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#EC4899"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="flex flex-col items-center justify-center text-center z-10">
          <span className="text-4xl font-black text-pink-600 leading-none">{percentage}%</span>
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.2em] mt-1">Match</span>
        </div>
      </div>
    );
  };

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={matchingState.status === 'success' || matchingState.status === 'error'} 
        onComplete={() => setShowLoading(false)}
        icon="💑"
        title="පොරොන්දම් ගැලපීම පරීක්ෂා කරයි..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="pink"
        messages={[
          "ග්‍රහ පිහිටීම් විශ්ලේෂණය කරමින් පවතී...",
          "පොරොන්දම් 20 ගැලපීම පරීක්ෂා කරමින් පවතී...",
          "දෝෂ තත්ත්වයන් නිරීක්ෂණය කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  if (matchingState.status === 'error' && !showLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-4xl zen-shadow border border-red-100">⚠️</div>
        <div className="space-y-2">
          <h2 className="sinhala font-black text-gray-800 text-xl">දත්ත ලබා ගත නොහැක</h2>
          <p className="sinhala text-sm text-gray-500 leading-relaxed px-4">{matchingState.errorMessage}</p>
        </div>
        <button 
          onClick={() => setMatchingState({ status: 'idle', result: null, errorMessage: null })}
          className="w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg"
        >
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-500">
      <header className="px-2 pt-4 text-center space-y-1">
        <div className="w-20 h-20 bg-pink-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 zen-shadow border border-pink-100">
          <span className="text-4xl">💑</span>
        </div>
        <h2 className="text-3xl font-black sinhala text-gray-800">පොරොන්දම් ගැලපීම</h2>
        <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Cosmic Harmony AI</p>
      </header>

      {matchingState.status === 'success' && matchingState.result ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-white text-center">
            <CircularProgress percentage={matchingState.result.matchingPercentage} />
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-lg font-bold sinhala text-gray-800">පොරොන්දම් 20 පරීක්ෂාව</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">20 Terms Check</span>
              </div>
              
              <div className="grid gap-4">
                {matchingState.result.table.map((row, i) => (
                  <div key={i} className="flex flex-col p-5 bg-gray-50 rounded-3xl border border-white group hover:border-pink-100 transition-colors text-left space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="sinhala font-black text-gray-800 text-base">{row.name}</span>
                      <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full ${row.isMatch ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className="text-[10px] font-black uppercase tracking-wider">{row.isMatch ? 'MATCH' : 'NO MATCH'}</span>
                        <div className="w-3 h-3 rounded-full flex items-center justify-center text-[8px]">
                          {row.isMatch ? '✓' : '✕'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100">
                      <p className="sinhala text-xs text-gray-500 leading-relaxed">{row.description}</p>
                      <div className="h-px bg-gray-50 w-full" />
                      <p className={`sinhala text-sm font-bold leading-relaxed ${row.isMatch ? 'text-green-600' : 'text-red-500'}`}>
                        {row.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {matchingState.result.dosha.length > 0 && (
              <div className="mt-8 text-left p-6 bg-red-50 rounded-[2rem] border border-red-100">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">🚫</span>
                  <h4 className="text-red-700 font-bold text-sm uppercase tracking-wider sinhala">ප්‍රධාන දෝෂ (Major Problems)</h4>
                </div>
                <ul className="space-y-2">
                  {matchingState.result.dosha.map((d, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs sinhala text-red-800 opacity-90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-left p-6 bg-green-50 rounded-[2rem] border border-green-100">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">💡</span>
                <h4 className="text-green-700 font-bold text-sm uppercase tracking-wider sinhala">යෝජනා</h4>
              </div>
              <ul className="space-y-2">
                {matchingState.result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs sinhala text-green-800 opacity-90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setMatchingState({ status: 'idle', result: null, errorMessage: null });
                setPartner({ name: '', dob: '', birthTime: '', city: '', rashi: '' });
              }}
              className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 sinhala text-lg"
            >
              වෙනත් කෙනෙකු පරීක්ෂා කරන්න
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-gray-50 space-y-6">
          <div className="flex justify-center -space-x-3 mb-4">
            <div className="w-14 h-14 bg-pink-50 rounded-full border-4 border-white flex items-center justify-center shadow-sm text-xl">
              {userProfile.gender === 'female' ? '👩' : '👨'}
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-full border-4 border-white flex items-center justify-center shadow-sm text-xl">
              {userProfile.gender === 'female' ? '👨' : '👩'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center pb-2">
              <h3 className="sinhala font-black text-gray-700 text-sm uppercase tracking-tight">සහකරු/සහකාරිය ගේ විස්තර</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em]">Partner Details</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider sinhala">සම්පූර්ණ නම (Full Name)</label>
              <input
                type="text"
                placeholder="නම ඇතුළත් කරන්න"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
                value={partner.name}
                onChange={(e) => setPartner({ ...partner, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider sinhala">උපන් දිනය (DOB)</label>
                <input
                  type="date"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
                  value={partner.dob}
                  onChange={(e) => setPartner({ ...partner, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider sinhala">වේලාව (Birth Time)</label>
                <input
                  type="time"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
                  value={partner.birthTime}
                  onChange={(e) => setPartner({ ...partner, birthTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider sinhala">නගරය (City)</label>
                <input
                  type="text"
                  placeholder="උපන් ස්ථානය"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm sinhala"
                  value={partner.city}
                  onChange={(e) => setPartner({ ...partner, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider sinhala">ලග්නය (Lagnaya) - Optional</label>
                <input
                  type="text"
                  placeholder="රාශිය (විකල්පයි)"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm sinhala"
                  value={partner.rashi}
                  onChange={(e) => setPartner({ ...partner, rashi: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleMatch}
            disabled={!partner.name || !partner.dob || !partner.birthTime || !partner.city}
            className="w-full py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95 sinhala text-lg flex items-center justify-center bg-pink-600 text-white border border-pink-700 disabled:bg-pink-100 disabled:text-pink-500 disabled:border-pink-100 disabled:shadow-none disabled:opacity-100"
          >
            ගැලපීම පරීක්ෂා කරන්න
          </button>
        </div>
      )}

      <div className="text-center pt-8 opacity-40">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Wisdom for the Harmony • Wishwaya AI Premium</p>
      </div>
    </div>
  );
};

export default Matching;
