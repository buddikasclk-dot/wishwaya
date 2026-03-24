
import React, { useState, useEffect } from 'react';
import { BabyNamingState } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface BabyNamingProps {
  babyNamingState: BabyNamingState;
  setBabyNamingState: React.Dispatch<React.SetStateAction<BabyNamingState>>;
  onStartAnalysis: (details: { dob: string, time: string, city: string, gender: string }) => void;
}

const BabyNaming: React.FC<BabyNamingProps> = ({ babyNamingState, setBabyNamingState, onStartAnalysis }) => {
  const [details, setDetails] = useState({
    dob: '',
    time: '',
    city: '',
    gender: 'boy'
  });
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (babyNamingState.status === 'analyzing') {
      setShowLoading(true);
    }
  }, [babyNamingState.status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!details.dob || !details.time || !details.city) return;
    onStartAnalysis(details);
  };

  const result = babyNamingState.result
    ? {
        ...babyNamingState.result,
        recommendedLetters: Array.isArray(babyNamingState.result.recommendedLetters) ? babyNamingState.result.recommendedLetters : [],
        boyNames: Array.isArray(babyNamingState.result.boyNames) ? babyNamingState.result.boyNames : [],
        girlNames: Array.isArray(babyNamingState.result.girlNames) ? babyNamingState.result.girlNames : [],
        rituals: Array.isArray(babyNamingState.result.rituals) ? babyNamingState.result.rituals : [],
        amulet: babyNamingState.result.amulet || { title: '', description: '' },
      }
    : null;

  return (
    <div className="p-4 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-1 pt-4">
        <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 zen-shadow border border-blue-100">
          <span className="text-4xl">👶</span>
        </div>
        <h2 className="text-3xl font-black sinhala text-gray-800 tracking-tight">නම් තැබීම</h2>
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Vedic Baby Naming AI</p>
      </header>

      {showLoading ? (
        <ResultLoadingScreen 
          isReady={babyNamingState.status === 'success' || babyNamingState.status === 'error'} 
          onComplete={() => setShowLoading(false)}
          icon="🍼"
          title="නැකත් පරීක්ෂා කරමින් පවතී..."
          subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
          colorTheme="blue"
          messages={[
            "Analyzing baby horoscope... (කේන්දරය පරීක්ෂා කරමින්...)",
            "Finding best starting letters... (සුබ මුල් අකුරු සොයමින්...)",
            "Preparing baby name ideas... (අර්ථවත් නම් නිර්මාණය කරමින්...)",
            "Finalizing your results... (ප්‍රතිඵල සකස් කරමින්...)"
          ]}
        />
      ) : result ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          {/* Step 1: Clean Intro Panel */}
          <div className="glass-card p-8 rounded-[3rem] zen-shadow border-white/40 space-y-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100/30 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
               <div className="flex items-center space-x-4 mb-4">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-xl shadow-inner">✨</div>
                 <div className="space-y-0.5">
                   <h3 className="sinhala font-black text-xl text-gray-800 tracking-tight">ජ්‍යෝතිෂ්‍යමය මඟ පෙන්වීම</h3>
                   <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Astro-Guidance Report</p>
                 </div>
               </div>
               
               <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60">
                 <p className="sinhala text-sm text-gray-700 leading-[1.9] font-medium">
                   {result.intro}
                 </p>
               </div>
             </div>
          </div>

          {/* Step 2: Result Structure 1 - Suggested Letters (Clean Panel) */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-blue-50 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-[0.03] pointer-events-none">☸️</div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">නිර්දේශිත මුල් අකුරු (Recommended Syllables)</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                   {result.recommendedLetters.map((letter, i) => (
                     <div key={i} className="w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center sinhala text-3xl font-black text-blue-900 shadow-sm">
                       {letter}
                     </div>
                   ))}
                </div>
              </div>
              
              <div className="h-px bg-gray-50 w-full" />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">නක්ෂත්‍රය (Birth Star)</span>
                  <p className="sinhala text-lg font-black mt-1 text-gray-800">{result.nakshatra}</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">පාදය (Pada)</span>
                  <p className="sinhala text-lg font-black mt-1 text-gray-800">{result.pada}</p>
                </div>
              </div>
              
              <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
                <p className="sinhala text-[11px] leading-relaxed text-blue-800/80 font-medium italic">
                  මෙම අකුරු තෝරාගෙන ඇත්තේ දරුවා උපන් {result.nakshatra} නැකතට සහ {result.pada} පාදයට අනුකූලව ශුභ ඵල ගෙන දීම සඳහාය.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Result Structure 2 - 5 Boy Names */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
               <div className="space-y-1">
                 <h3 className="sinhala font-black text-lg text-blue-800">පුතණුවන් සඳහා (Boy Names)</h3>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Suggested Modern Names</p>
               </div>
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">👦</div>
            </div>
            <div className="space-y-8">
               {result.recommendedLetters.map((letter, idx) => {
                 const namesForLetter = result.boyNames.filter(n => {
                    const itemName = typeof n?.name === 'string' ? n.name : '';
                    const itemLetter = typeof n?.letter === 'string' ? n.letter : '';
                    return (itemLetter && itemLetter.includes(letter)) || (!itemLetter && itemName.startsWith(letter));
                  });
                 if (namesForLetter.length === 0) return null;
                 return (
                   <div key={idx} className="space-y-4">
                     <div className="flex items-center space-x-3 ml-2">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-lg font-black sinhala shadow-lg shadow-blue-100">{letter}</div>
                        <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-transparent" />
                     </div>
                     <div className="grid gap-4">
                       {namesForLetter.map((item, i) => (
                         <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 zen-shadow group hover:border-blue-200 transition-all active:scale-[0.98]">
                           <div className="flex items-center justify-between mb-3">
                             <p className="sinhala font-black text-blue-900 text-xl leading-tight">{item.name}</p>
                             <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-xs">💎</div>
                           </div>
                           <p className="sinhala text-xs text-gray-500 leading-relaxed font-medium">{item.meaning}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })}
            </div>
          </section>

          {/* Step 3: Result Structure 3 - 5 Girl Names */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
               <div className="space-y-1">
                 <h3 className="sinhala font-black text-lg text-rose-800">දියණියන් සඳහා (Girl Names)</h3>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Suggested Modern Names</p>
               </div>
               <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl">👧</div>
            </div>
            <div className="space-y-8">
               {result.recommendedLetters.map((letter, idx) => {
                 const namesForLetter = result.girlNames.filter(n => {
                    const itemName = typeof n?.name === 'string' ? n.name : '';
                    const itemLetter = typeof n?.letter === 'string' ? n.letter : '';
                    return (itemLetter && itemLetter.includes(letter)) || (!itemLetter && itemName.startsWith(letter));
                  });
                 if (namesForLetter.length === 0) return null;
                 return (
                   <div key={idx} className="space-y-4">
                     <div className="flex items-center space-x-3 ml-2">
                        <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-lg font-black sinhala shadow-lg shadow-rose-100">{letter}</div>
                        <div className="h-px flex-1 bg-gradient-to-r from-rose-100 to-transparent" />
                     </div>
                     <div className="grid gap-4">
                       {namesForLetter.map((item, i) => (
                         <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 zen-shadow group hover:border-rose-200 transition-all active:scale-[0.98]">
                           <div className="flex items-center justify-between mb-3">
                             <p className="sinhala font-black text-rose-900 text-xl leading-tight">{item.name}</p>
                             <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center text-xs">🌸</div>
                           </div>
                           <p className="sinhala text-xs text-gray-500 leading-relaxed font-medium">{item.meaning}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })}
            </div>
          </section>

          {/* Step 3: Result Structure 4 - Astrology Insight */}
          <section className="bg-white p-10 rounded-[4rem] border border-gray-100 space-y-6 relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 pointer-events-none">📜</div>
             <div className="flex items-center space-x-3">
               <div className="w-2 h-8 bg-green-500 rounded-full" />
               <h4 className="sinhala font-black text-gray-800 text-xl tracking-tight">ජ්‍යෝතිෂ උපදෙස්</h4>
             </div>
             <p className="sinhala text-base text-gray-600 leading-[1.9] font-medium">
               {result.astrologyInsight}
             </p>
             <div className="pt-4 border-t border-gray-50">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic">මෙය ජ්‍යෝතිෂ විශ්වාස මත පදනම්ව සකස් කර ඇත.</p>
             </div>
          </section>

          {/* Step 4: Additional Recommendation Card */}
          <section className="bg-indigo-50 p-10 rounded-[4rem] border border-indigo-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4">
              <span className="text-4xl animate-pulse">🌟</span>
              <h4 className="sinhala font-black text-indigo-900 text-xl tracking-tight uppercase leading-tight">අමතර ජ්‍යෝතිෂ නිර්දේශ</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🛡️</div>
                <p className="sinhala font-black text-indigo-800 text-sm">ගැලපෙන පංචායුධය (Protection Amulet)</p>
              </div>
              <div className="bg-white/60 p-6 rounded-[2.5rem] border border-white/80 space-y-2">
                <p className="sinhala font-black text-indigo-950 text-lg leading-tight">{result.amulet.title}</p>
                <p className="sinhala text-xs text-indigo-700 leading-[1.7] font-medium opacity-80">{result.amulet.description}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🙏</div>
                <p className="sinhala font-black text-indigo-800 text-sm">දෙමාපියන් කළ යුතු වත්පිළිවෙත්</p>
              </div>
              <div className="grid gap-3">
                {result.rituals.map((ritual, idx) => (
                  <div key={idx} className="bg-white/40 p-5 rounded-3xl flex items-start space-x-4 border border-white/60 group hover:bg-white/80 transition-all">
                    <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 text-[10px] font-bold flex-shrink-0 mt-1">{idx+1}</div>
                    <p className="sinhala text-xs text-indigo-900 font-bold leading-relaxed">{ritual}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : babyNamingState.status === 'error' ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-4xl zen-shadow border border-red-100">⚠️</div>
          <div className="space-y-2">
            <h2 className="sinhala font-black text-gray-800 text-xl">දත්ත ලබා ගත නොහැක</h2>
            <p className="sinhala text-sm text-gray-500 leading-relaxed px-4">{babyNamingState.errorMessage}</p>
          </div>
          <button 
            onClick={() => setBabyNamingState({ status: 'idle', result: null, errorMessage: null })}
            className="w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg"
          >
            නැවත උත්සාහ කරන්න
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[3.5rem] zen-shadow border border-gray-50 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="sinhala text-[10px] font-black text-gray-400 ml-3 uppercase tracking-[0.2em]">උපන් දිනය (Date of Birth)</label>
              <input 
                type="date" 
                name="dob" 
                value={details.dob} 
                onChange={handleInputChange} 
                className="w-full p-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all sinhala text-sm font-bold text-gray-700" 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-3 uppercase tracking-[0.2em]">වේලාව (Time)</label>
                <input 
                  type="time" 
                  name="time" 
                  value={details.time} 
                  onChange={handleInputChange} 
                  className="w-full p-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all sinhala text-sm font-bold text-gray-700" 
                />
              </div>
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-3 uppercase tracking-[0.2em]">ස්ත්‍රී/පුරුෂ</label>
                <select 
                  name="gender" 
                  value={details.gender} 
                  onChange={handleInputChange} 
                  className="w-full p-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all sinhala text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="boy">පුතෙක් (Boy)</option>
                  <option value="girl">දියණියක් (Girl)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="sinhala text-[10px] font-black text-gray-400 ml-3 uppercase tracking-[0.2em]">උපන් ස්ථානය (Location)</label>
              <input 
                type="text" 
                name="city" 
                placeholder="උපන් නගරය ඇතුළත් කරන්න" 
                value={details.city} 
                onChange={handleInputChange} 
                className="w-full p-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all sinhala text-sm font-bold text-gray-700" 
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!details.dob || !details.time || !details.city}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all sinhala text-xl disabled:opacity-40 disabled:shadow-none mt-4"
            >
              නම් සහ නැකත් සොයන්න
            </button>
          </div>
          
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
            <p className="sinhala text-[11px] text-blue-700/70 font-bold leading-relaxed text-center italic">
              දරුවාගේ උපන් වේලාව අනුව නක්ෂත්‍රය සහ පාදය ගණනය කර එයට අදාළ මුල් අකුරු හා ශුභ නාමයන් මෙහිදී නිර්දේශ කරනු ලැබේ.
            </p>
          </div>
        </div>
      )}

      <div className="text-center pt-8 opacity-40 pb-12">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Ancient Wisdom • Modern Elegance • Wishwaya AI</p>
      </div>
    </div>
  );
};

export default BabyNaming;
