
import React, { useState, useEffect } from 'react';
import { OmenAnalysisState } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface OmenProps {
  omenState: OmenAnalysisState;
  setOmenState: React.Dispatch<React.SetStateAction<OmenAnalysisState>>;
  onStartAnalysis: (type: 'birthmark' | 'lizard', input: string) => void;
}

const TraditionalOmens: React.FC<OmenProps> = ({ omenState, setOmenState, onStartAnalysis }) => {
  const [type, setType] = useState<'birthmark' | 'lizard'>('birthmark');
  const [input, setInput] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (omenState.status === 'analyzing') {
      setShowLoading(true);
    }
  }, [omenState.status]);

  const handleAnalyze = () => {
    if (!input) return;
    onStartAnalysis(type, input);
  };

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={omenState.status === 'success' || omenState.status === 'error'} 
        onComplete={() => setShowLoading(false)}
        icon="🧿"
        title="නිමිති පරීක්ෂා කරමින් පවතී..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="indigo"
        messages={[
          "පැරණි පුස්කොළ පොත් දත්ත පරීක්ෂා කරමින් පවතී...",
          "නිමිත්තේ ස්වභාවය විශ්ලේෂණය කරමින් පවතී...",
          "සුභ අසුභ තත්ත්වයන් ගණනය කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  if (omenState.status === 'error' && !showLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-4xl zen-shadow border border-red-100">⚠️</div>
        <div className="space-y-2">
          <h2 className="sinhala font-black text-gray-800 text-xl">දත්ත ලබා ගත නොහැක</h2>
          <p className="sinhala text-sm text-gray-500 leading-relaxed px-4">{omenState.errorMessage}</p>
        </div>
        <button 
          onClick={() => setOmenState({ status: 'idle', result: null, errorMessage: null })}
          className="w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg"
        >
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-black sinhala text-gray-800">සාම්ප්‍රදායික නිමිති</h2>
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Traditional Omens</p>
      </header>

      {omenState.status === 'success' && omenState.result ? (
        <div className="animate-in zoom-in duration-500 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 pointer-events-none">🧿</div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest sinhala">පලාපල (Prediction)</span>
              <p className="sinhala text-gray-800 text-lg font-bold leading-relaxed">{omenState.result.prediction}</p>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest sinhala">විස්තරය (Description)</span>
              <p className="sinhala text-sm text-gray-600 leading-relaxed">{omenState.result.context}</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🕯️</span>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest sinhala">ප්‍රතිකර්මය (Remedy)</span>
              </div>
              <p className="sinhala text-xs text-orange-800 leading-relaxed font-medium">{omenState.result.remedy}</p>
            </div>
          </div>
          
          <button 
            onClick={() => { setOmenState({ status: 'idle', result: null, errorMessage: null }); setInput(''); }}
            className="w-full py-5 bg-white border border-gray-100 rounded-[1.5rem] font-black text-gray-500 hover:text-indigo-600 transition-colors sinhala text-lg zen-shadow active:scale-95"
          >
            තව නිමිත්තක් පරීක්ෂා කරන්න
          </button>
        </div>
      ) : (
        <>
          <div className="flex p-1.5 bg-gray-100 rounded-[2rem]">
            <button 
              onClick={() => { setType('birthmark'); setInput(''); }}
              className={`flex-1 py-4 rounded-[1.5rem] sinhala font-bold text-sm transition-all ${type === 'birthmark' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
            >
              උපන් ලප
            </button>
            <button 
              onClick={() => { setType('lizard'); setInput(''); }}
              className={`flex-1 py-4 rounded-[1.5rem] sinhala font-bold text-sm transition-all ${type === 'lizard' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
            >
              හූනන් වැටීම
            </button>
          </div>

          <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest sinhala">ස්ථානය (Body Part / Location)</label>
              <input
                type="text"
                className="w-full px-6 py-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white outline-none transition-all sinhala text-sm"
                placeholder={type === 'birthmark' ? "උදා: වම් අත, නළල..." : "උදා: හිස, දකුණු උරහිස..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!input}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg disabled:opacity-50"
            >
              විස්තර ලබා ගන්න
            </button>
          </div>
        </>
      )}

      <div className="text-center pt-8 opacity-40">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Wisdom from the ancient omens • Wishwaya AI</p>
      </div>
    </div>
  );
};

export default TraditionalOmens;
