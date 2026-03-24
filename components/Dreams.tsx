import React, { useState } from 'react';
import { interpretDream } from '../services/geminiService';
import { DreamInterpretation } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';

const Dreams: React.FC = () => {
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [result, setResult] = useState<DreamInterpretation | null>(null);

  const handleInterpret = async () => {
    if (!dreamText) return;
    setLoading(true);
    setShowLoading(true);
    try {
      const res = await interpretDream(dreamText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-700">
      <header className="px-2 pt-4">
        <h2 className="text-3xl font-black sinhala text-gray-800">සිහින පලාපල</h2>
        <p className="text-purple-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
          Cosmic Dream Interpreter
        </p>
      </header>

      {showLoading ? (
        <ResultLoadingScreen
          isReady={!loading && !!result}
          onComplete={() => setShowLoading(false)}
          icon="🌙"
          title="විශ්වය ඔබේ සිහිනය විග්‍රහ කරයි..."
          subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
          colorTheme="indigo"
          messages={[
            'සිහිනයේ සංඛේත හඳුනා ගනිමින් පවතී...',
            'මනෝවිද්‍යාත්මක පසුබිම විශ්ලේෂණය කරමින් පවතී...',
            'අනාගත පෙරනිමිති පරීක්ෂා කරමින් පවතී...',
            'ප්‍රතිඵල සකස් කරමින් පවතී...',
          ]}
        />
      ) : (
        <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50">
          <label className="block text-[10px] font-black text-gray-400 mb-3 ml-2 uppercase tracking-widest sinhala">
            ඔබ දුටු සිහිනය මෙහි ලියන්න
          </label>
          <textarea
            rows={5}
            className="w-full p-6 bg-gray-50 rounded-[2rem] outline-none focus:ring-2 focus:ring-purple-100 transition-all sinhala text-base text-gray-700 leading-relaxed resize-none border border-transparent"
            placeholder="සිහිනයේ විස්තරය මෙහි ඇතුළත් කරන්න..."
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
          />

          <button
            onClick={handleInterpret}
            disabled={loading || !dreamText}
            className="w-full mt-6 py-5 bg-purple-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-purple-100 active:scale-95 transition-all sinhala text-lg disabled:bg-purple-100 disabled:text-purple-500 disabled:shadow-none disabled:opacity-100"
          >
            අර්ථය සොයන්න
          </button>
        </div>
      )}

      {result && !showLoading && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8 rounded-[3rem] border border-indigo-100 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl opacity-20">🌙</div>
            <div className="relative z-10">
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-sm">
                සාරාංශය (General Meaning)
              </span>
              <div className="mt-4 rounded-[2rem] bg-white/90 p-5 border border-indigo-100 shadow-sm">
                <p className="sinhala text-base font-bold leading-8 text-gray-800 sm:text-lg">
                  {result.meaning}
                </p>
              </div>
            </div>
          </div>

          {result.symbols.length > 0 && (
            <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧩</span>
                <h4 className="sinhala font-black text-gray-800 text-lg uppercase tracking-tight">
                  සිහින සංඛේත (Symbols Found)
                </h4>
              </div>
              <div className="grid gap-4">
                {result.symbols.map((sym, i) => (
                  <div key={i} className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                    <p className="sinhala font-black text-purple-900 text-sm mb-2">{sym.symbol}</p>
                    <p className="sinhala text-sm text-gray-700 leading-7">{sym.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-indigo-100 space-y-4 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕉️</span>
                <h4 className="sinhala font-black text-gray-800 text-sm uppercase tracking-wider">
                  ආත්මික පසුබිම
                </h4>
              </div>
              <p className="sinhala text-sm text-gray-800 leading-7">{result.spiritualContext}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-violet-100 space-y-4 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧬</span>
                <h4 className="sinhala font-black text-gray-800 text-sm uppercase tracking-wider">
                  මනෝවිද්‍යාත්මක විග්‍රහය
                </h4>
              </div>
              <p className="sinhala text-sm text-gray-800 leading-7">{result.psychologicalInsight}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-fuchsia-100 space-y-4 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🪐</span>
                <h4 className="sinhala font-black text-gray-800 text-sm uppercase tracking-wider">
                  ග්‍රහ බලපෑම
                </h4>
              </div>
              <p className="sinhala text-sm text-gray-800 leading-7">{result.planetaryInfluence}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-10 rounded-[3.5rem] border border-purple-200 text-center space-y-4 shadow-xl shadow-purple-50/50">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl animate-bounce">✨</span>
              <h4 className="sinhala font-black text-purple-900 text-xl tracking-tight uppercase">
                විශ්වයේ මඟ පෙන්වීම
              </h4>
            </div>
            <p className="sinhala text-base text-purple-950 leading-8 font-semibold">
              {result.actionableAdvice}
            </p>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setDreamText('');
            }}
            className="w-full py-5 bg-white border border-purple-100 rounded-[1.5rem] font-black text-purple-600 sinhala text-lg zen-shadow active:scale-95"
          >
            තව සිහිනයක් බලන්න
          </button>
        </div>
      )}

      <div className="text-center pt-8 opacity-40">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">
          Wisdom from the subconscious • Wishwaya AI
        </p>
      </div>
    </div>
  );
};

export default Dreams;
