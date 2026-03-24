
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, VastuAnalysisState } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface VastuProps {
  profile: UserProfile;
  vastuState: VastuAnalysisState;
  setVastuState: React.Dispatch<React.SetStateAction<VastuAnalysisState>>;
  onStartAnalysis: (formData: any, floorPlan?: { data: string, mimeType: string }) => void;
}

const VastuGuidance: React.FC<VastuProps> = ({ profile, vastuState, setVastuState, onStartAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'common' | 'personalized'>('common');
  const [showLoading, setShowLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    landLength: '',
    landWidth: '',
    houseLength: '',
    houseWidth: '',
    landShape: 'සමචතුරස්්‍ර',
    slope: 'උතුරට'
  });
  const [floorPlan, setFloorPlan] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vastuState.status === 'analyzing') {
      setShowLoading(true);
    }
  }, [vastuState.status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFloorPlan({ data: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onStartAnalysis(formData, floorPlan || undefined);
  };

  // Logic: Enable if (Has Floor Plan) OR (Has Land Length AND Land Width)
  const canSubmit = floorPlan || (formData.landLength && formData.landWidth);

  return (
    <div className="p-4 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-1 pt-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 zen-shadow border border-emerald-100">
          <span className="text-4xl">🏠</span>
        </div>
        <h2 className="text-3xl font-black sinhala text-gray-800 uppercase tracking-tight">වාස්තු උපදෙස්</h2>
        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em]">Vastu Guidance AI</p>
      </header>

      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-gray-100 rounded-[2rem] max-w-[320px] mx-auto border border-gray-200/50">
        <button 
          onClick={() => setActiveTab('common')}
          className={`flex-1 py-3 rounded-[1.5rem] sinhala font-black text-xs transition-all ${activeTab === 'common' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
        >
          පොදු උපදෙස්
        </button>
        <button 
          onClick={() => setActiveTab('personalized')}
          className={`flex-1 py-3 rounded-[1.5rem] sinhala font-black text-xs transition-all ${activeTab === 'personalized' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
        >
          පුද්ගලික උපදෙස්
        </button>
      </div>

      {showLoading ? (
        <ResultLoadingScreen 
          isReady={vastuState.status === 'success' || vastuState.status === 'error'} 
          onComplete={() => setShowLoading(false)}
          icon="🧭"
          title="වාස්තු විද්‍යාත්මකව විශ්ලේෂණය කරයි..."
          subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
          colorTheme="emerald"
          messages={[
            "භූමියේ දිශානතිය විශ්ලේෂණය කරමින් පවතී...",
            "වාස්තු දෝෂ පරීක්ෂා කරමින් පවතී...",
            "ඔබගේ කේන්දරය සමඟ ගලපමින් පවතී...",
            "ප්‍රතිඵල සකස් කරමින් පවතී..."
          ]}
        />
      ) : activeTab === 'common' ? (
        <div className="space-y-10 animate-in slide-in-from-left-4 duration-500 text-left">
          
          {/* 1. Land Selection */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <h3 className="sinhala font-black text-lg text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <span className="mr-2">🗺️</span> 1. භූමිය තෝරා ගැනීම සහ පරීක්ෂාව (Land Selection)
            </h3>
            <p className="sinhala text-xs text-emerald-600 font-bold">නිවසක් තැනීමට පෙර ඉඩමේ ස්වභාවය විමසා බැලීම වාස්තු විද්‍යාවේ මූලිකම පියවරයි.</p>
            <div className="space-y-5">
              <div className="bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100/30">
                <p className="sinhala font-black text-[11px] text-emerald-700 uppercase mb-2">ඉඩමේ හැඩය</p>
                <p className="sinhala text-sm text-gray-600 leading-relaxed">වඩාත්ම ශුභ වන්නේ සමචතුරස්‍ර හෝ සෘජුකෝණාස්‍රාකාර ඉඩම්ය. ත්‍රිකෝණාකාර, වටකුරු හෝ බහුඅස්‍ර හැඩැති ඉඩම් පදිංචියට අශුභ ලෙස සැලකේ.</p>
              </div>
              <div className="bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100/30">
                <p className="sinhala font-black text-[11px] text-emerald-700 uppercase mb-2">බෑවුම</p>
                <p className="sinhala text-sm text-gray-600 leading-relaxed">ඉඩමක බෑවුම උතුරට හෝ නැගෙනහිරට තිබීම ඉතා ශුභයි. එය ධනය සහ සෞභාග්‍යය ගෙන දෙයි. දකුණට හෝ බටහිරට බෑවුම් වීම අශුභ ඵල (ලෙඩදුක්, ධන හානි) ලබා දිය හැක.</p>
              </div>
              <div className="bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100/30">
                <p className="sinhala font-black text-[11px] text-emerald-700 uppercase mb-2">පසෙහි ස්වභාවය</p>
                <p className="sinhala text-sm text-gray-600 leading-relaxed">සශ්‍රීක, ගස්වැල් හොඳින් වැවෙන පසක් සහිත ඉඩම් "ජීව ඉඩම්" ලෙස හඳුන්වන අතර ඒවා පදිංචියට සුදුසුය. ගල්, ඇටකටු හෝ අගල් සහිත බිම් අශුභයි.</p>
              </div>
            </div>
          </section>

          {/* 2. Pada Division */}
          <section className="bg-[#1a1c3b] p-8 rounded-[3.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 pointer-events-none">📐</div>
            <h3 className="sinhala font-black text-lg border-b border-white/10 pb-2">2. ඉඩම සහ ගෙබිම පාද බෙදීම (Pada Division)</h3>
            <p className="sinhala text-xs opacity-60">ඉඩම කොටස්වලට බෙදා නිවස ස්ථානගත කිරීම මෙහිදී සිදු කෙරේ.</p>
            <div className="grid gap-4">
              {[
                { title: 'ප්‍රේත පාදය', desc: 'ඉඩමේ මායිමට වන්නට ඇති පිටතම තීරුවයි. මෙහි නිවාස ඉදිකිරීම අශුභ වන අතර, වැසිකිළි හෝ සතුන් ඇති කරන ස්ථාන සඳහා පමණක් සුදුසු වේ.' },
                { title: 'මනුෂ්‍ය පාදය', desc: 'ප්‍රේත පාදයට ඇතුළතින් පිහිටන අතර මිනිස් වාසයට වඩාත්ම සුදුසු කොටසයි.' },
                { title: 'දේව පාදය', desc: 'මනුෂ්‍ය පාදයටත් ඇතුළතින් පිහිටයි. මෙය ඉතා පිරිසිදු, ශුභ කොටසකි.' },
                { title: 'බ්‍රහ්ම පාදය', desc: 'ඉඩමේ හරි මැද කොටසයි. මෙය සැමවිටම හිස්ව හෝ ඉතා පිරිසිදුව තැබිය යුතුය. මෙහි බිත්ති බැඳීම හෝ ළිං කැපීම අශුභයි.' },
              ].map((p, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/5">
                  <p className="sinhala font-black text-emerald-400 text-sm mb-1">{p.title}</p>
                  <p className="sinhala text-xs opacity-80 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Doors & Openings */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <h3 className="sinhala font-black text-lg text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <span className="mr-2">🚪</span> 3. ද්වාර සටහන සහ උළුවහු තැබීම (Doors & Openings)
            </h3>
            <ul className="space-y-4">
              <li className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                <p className="sinhala font-black text-[11px] text-gray-400 uppercase">ප්‍රධාන දොර</p>
                <p className="sinhala text-sm text-gray-700 leading-relaxed font-medium">නිවසේ ප්‍රධාන දොර එය තබන බිත්තියේ හරි මැදින් නොතැබිය යුතුය (බ්‍රහ්මවේද දෝෂය). එය අනෙක් දොරවල්වලට වඩා ප්‍රමාණයෙන් විශාල විය යුතුය.</p>
              </li>
              <li className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                <p className="sinhala font-black text-[11px] text-gray-400 uppercase">දොර-ජනෙල් ගණන</p>
                <p className="sinhala text-sm text-gray-700 leading-relaxed font-medium">නිවසක උළුවහු ගණන ඔත්තේ (1, 3, 5...) විය යුතු අතර, ජනෙල් ගණන ඉරට්ටේ (2, 4, 6...) විය යුතු බව සාමාන්්‍ය නියමයයි.</p>
              </li>
              <li className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                <p className="sinhala font-black text-[11px] text-gray-400 uppercase">ද්වාර දෝෂ</p>
                <p className="sinhala text-sm text-gray-700 leading-relaxed font-medium">ප්‍රධාන දොර ඉදිරිපිට විශාල ගස්, ලිං, කණු, පාරේ වංගු හෝ වෙනත් නිවසක කොන් පිහිටීම "වේද දෝෂ" ලෙස හඳුන්වන අතර ඒවා නිවැසියන්ට කරදර ගෙන දෙයි.</p>
              </li>
            </ul>
          </section>

          {/* 4. Room Layout */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <h3 className="sinhala font-black text-lg text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <span className="mr-2">🧭</span> 4. කාමර සහ අනෙකුත් අංග පිහිටුවීම (Room Layout)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'නිදන කාමර', desc: 'නිවසේ ප්‍රධානියාගේ කාමරය නිරිත දිශාවේ පිහිටීම වඩාත් සුදුසුය.', icon: '🛏️' },
                { title: 'මුළුතැන්ගෙය', desc: 'සාමාන්‍යයෙන් ගිනිකොණ දිශාව (අග්නි කෝණය) මුළුතැන්ගෙයට සුදුසුම දිශාවයි.', icon: '🔥' },
                { title: 'ළිඳ', desc: 'ළිඳක් කැපීම සඳහා ඊසාන, උතුර හෝ නැගෙනහිර දිශාවන් ශුභ ලෙස සැලකේ.', icon: '💧' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 bg-emerald-50/20 rounded-2xl border border-emerald-100/40">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="sinhala font-black text-sm text-emerald-900">{item.title}</p>
                    <p className="sinhala text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. General Vastu Defects */}
          <section className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
            <h3 className="sinhala font-black text-lg text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <span className="mr-2">⚠️</span> 5. පොදු වාස්තු දෝෂ සහ නිවැරදි කිරීම් (General Defects)
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="sinhala font-black text-[11px] text-gray-400 uppercase mb-2">කෝණ දෝෂ</p>
                <p className="sinhala text-sm text-gray-700 leading-relaxed font-medium">නිවසේ යම් පැත්තක් අඩුවීම හෝ දික්වීම නිසා අදාළ දිශාවට අදාළ සම්පත් හීන විය හැක.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="sinhala font-black text-[11px] text-gray-400 uppercase mb-2">වහලය</p>
                <p className="sinhala text-sm text-gray-700 leading-relaxed font-medium">වහලයේ පරාල ගණන ඔත්තේ විය යුතු අතර "මරු ඇණ" හෝ "සොහොන් පරාල" වැටෙන ලෙස නිර්මාණය නොකළ යුතුය.</p>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100">
                <p className="sinhala font-black text-[11px] text-emerald-700 uppercase mb-2">නිවැරදි කිරීම් (Remedies)</p>
                <p className="sinhala text-sm text-emerald-900/80 leading-relaxed font-bold italic">
                  දැනට පවතින දෝෂ ඉවත් කිරීමට නිවස කඩා දැමීම වෙනුවට, කෙටි බිත්ති පන්නා දිශාව වෙනස් කිරීම හෝ වර්ණ/ආරක්‍ෂක මන්ත්‍ර භාවිතයෙන් සහන ලබාගත හැකි බව පෙන්වා දී ඇත.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
               <p className="sinhala text-[10px] text-gray-400 font-bold leading-relaxed">මෙම කරුණු වාස්තු විද්‍යාවේ මූලික හරය වන අතර, නිවසක් තැනීමේදී හෝ මිලදී ගැනීමේදී මේවා පිළිබඳ අවධානය යොමු කිරීමෙන් නිවැසියන්ට සතුට සහ සෞභාග්‍යය ළඟා කරගත හැකි බව අවධාරණය කෙරේ.</p>
            </div>
          </section>

        </div>
      ) : vastuState.status === 'success' && vastuState.result ? (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-emerald-900 p-8 rounded-[3.5rem] text-white space-y-4">
            <h3 className="sinhala font-black text-xl">ප්‍රතිඵලය: {profile.name} ගේ වාස්තු වාර්තාව</h3>
            <p className="sinhala text-sm opacity-80">{vastuState.result.commonDetails}</p>
          </div>

          <div className="grid gap-6">
            {vastuState.result.points.map((p, i) => (
              <div key={i} className={`p-8 rounded-[3rem] border zen-shadow space-y-4 ${
                p.status === 'good' ? 'bg-white border-emerald-50' : 
                p.status === 'warning' ? 'bg-rose-50 border-rose-100' : 
                'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`sinhala font-black text-lg ${p.status === 'warning' ? 'text-rose-900' : 'text-gray-800'}`}>
                    {i+1}. {p.title}
                  </h4>
                  <span className={`w-3 h-3 rounded-full ${
                    p.status === 'good' ? 'bg-emerald-500' : 
                    p.status === 'warning' ? 'bg-rose-500 animate-pulse' : 
                    'bg-gray-300'
                  }`} />
                </div>
                <p className="sinhala text-sm text-gray-600 leading-relaxed">{p.description}</p>
                <div className="pt-2">
                  <p className="sinhala text-[11px] font-black text-emerald-700 uppercase">නිර්දේශය (Recommendation)</p>
                  <p className="sinhala text-xs text-emerald-900/80 font-bold italic mt-1">{p.recommendation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-100 space-y-6">
            <h4 className="sinhala font-black text-gray-800 border-b border-gray-50 pb-2 flex items-center">
              <span className="mr-2">📊</span> සාරාංශ වගුව
            </h4>
            <div className="grid gap-3">
              {vastuState.result.summaryTable.map((row, i) => (
                <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="sinhala text-xs font-bold text-gray-600">{row.element}</span>
                  <span className="sinhala text-xs font-black text-emerald-700">{row.bestDirection}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-10 rounded-[4rem] text-center space-y-6">
            <div className="space-y-2">
              <h4 className="sinhala font-black text-emerald-900 text-xl">අවසාන නිර්දේශය</h4>
              <p className="sinhala text-base text-emerald-800 font-medium leading-relaxed">{vastuState.result.finalRecommendations}</p>
            </div>
          </div>
        </div>
      ) : vastuState.status === 'error' ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-4xl zen-shadow border border-red-100">⚠️</div>
          <div className="space-y-2">
            <h2 className="sinhala font-black text-gray-800 text-xl">දත්ත ලබා ගත නොහැක</h2>
            <p className="sinhala text-sm text-gray-500 leading-relaxed px-4">{vastuState.errorMessage}</p>
          </div>
          <button 
            onClick={() => setVastuState({ status: 'idle', result: null, errorMessage: null })}
            className="w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg"
          >
            නැවත උත්සාහ කරන්න
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-8 rounded-[3.5rem] zen-shadow border border-emerald-50 text-center space-y-4">
            <p className="sinhala text-sm text-gray-600 leading-relaxed font-medium">
              ඔබ සතුව නිවසේ බිම් සැලැස්මක් (Floor Plan) ඇත්නම් එය මෙහි ඇතුළත් කරන්න. එසේ නොමැති නම් ඔබේ දත්ත පමණක් ලබා දීම ප්‍රමාණවත්ය. නමුත් බිම් සැලැස්මක් සමඟින් වඩාත් නිවැරදි විස්තර ලබා ගත හැක.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[3.5rem] zen-shadow border border-gray-50 space-y-8">
            <div className="space-y-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-8 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center space-y-3 transition-all ${
                  floorPlan ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <span className="text-4xl">{floorPlan ? '✅' : '📄'}</span>
                <span className="sinhala font-black text-xs uppercase tracking-widest">
                  {floorPlan ? 'බිම් සැලැස්ම එක් කරන ලදී' : 'බිම් සැලැස්ම මෙතැනට එක් කරන්න'}
                </span>
                <span className="text-[9px] opacity-60">Upload Floor Plan (Image or PDF)</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
              {floorPlan && (
                <p className="sinhala text-[10px] text-emerald-600 font-bold text-center mt-[-10px]">බිම් සැලැස්ම ඇතුළත් කර ඇති බැවින් පහත දත්ත පිරවීම අත්‍යවශ්‍ය නොවේ.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">
                  ඉඩමේ දිග (Feet) {!floorPlan && <span className="text-red-400">*</span>}
                </label>
                <input type="number" name="landLength" value={formData.landLength} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 sinhala text-sm" placeholder="දිග" />
              </div>
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">
                  ඉඩමේ පළල (Feet) {!floorPlan && <span className="text-red-400">*</span>}
                </label>
                <input type="number" name="landWidth" value={formData.landWidth} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 sinhala text-sm" placeholder="පළල" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">නිවසේ දිග (Feet)</label>
                <input type="number" name="houseLength" value={formData.houseLength} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 sinhala text-sm" placeholder="දිග" />
              </div>
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">නිවසේ පළල (Feet)</label>
                <input type="number" name="houseWidth" value={formData.houseWidth} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 sinhala text-sm" placeholder="පළල" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">ඉඩමේ හැඩය</label>
                <select name="landShape" value={formData.landShape} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none sinhala text-sm appearance-none">
                  {['සමචතුරස්්‍ර', 'සෘජුකෝණාස්‍රාකාර', 'ත්‍රිකෝණාකාර', 'වටකුරු', 'බහුඅස්‍ර'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="sinhala text-[10px] font-black text-gray-400 ml-2 uppercase">බෑවුම</label>
                <select name="slope" value={formData.slope} onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none sinhala text-sm appearance-none">
                  {['උතුරට', 'නැගෙනහිරට', 'දකුණට', 'බටහිරට'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-100 active:scale-95 transition-all sinhala text-xl disabled:opacity-50"
            >
              විශ්ලේෂණය ආරම්භ කරන්න
            </button>
            {!canSubmit && (
              <p className="text-center text-[10px] sinhala text-red-400 font-bold">කරුණාකර බිම් සැලැස්ම ඇතුළත් කරන්න හෝ අවම වශයෙන් ඉඩමේ දිග/පළල ඇතුළත් කරන්න.</p>
            )}
          </div>
        </div>
      )}

      <div className="text-center pt-8 pb-4 opacity-40">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Wisdom for the Sanctuary • Wishwaya AI Premium</p>
      </div>
    </div>
  );
};

export default VastuGuidance;
