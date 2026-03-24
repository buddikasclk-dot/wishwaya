
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';

const PIRITH_DATA = [
  {
    id: 'jaya',
    title: "ජය පිරිත",
    sub: "විජයග්‍රහණය සහ ආරක්ෂාව",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/Jaya.mp3",
    benefits: ["බාධා ජය ගැනීම", "සිහින බිය දුරු කිරීම", "මානසික ශක්තිය"],
    bestTime: "බ්‍රහස්පතින්දා හෝ ඕනෑම දිනක උදෑසන",
    tags: ['success', 'protection']
  },
  {
    id: 'rathnamali',
    title: "රත්නමාලී ගාථා",
    sub: "ආශිර්වාදය සහ මනසේ සාමය",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/Rathnamali.mp3",
    benefits: ["දේව ආරක්ෂාව", "අහිතකර ශක්තීන් දුරු කිරීම", "නව වැඩ සාර්ථක වීම"],
    bestTime: "සෙනසුරාදා හෝ අඟහරුවාදා සවස",
    tags: ['blessing', 'peace']
  },
  {
    id: 'antharaya',
    title: "අන්තරාය නිවාරණ පිරිත",
    sub: "අනතුරු සහ බාධා වැලැක්වීම",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/antharaya_niwarana.mp3",
    benefits: ["අනතුරුවලින් ආරක්ෂාව", "ගමන් බිමන් සුරක්ෂිතතාව", "බාධා ඉවත් කිරීම"],
    bestTime: "සිකුරාදා හෝ ගමන් බිමන් යාමට පෙර",
    tags: ['protection', 'safety']
  },
  {
    id: 'siwali',
    title: "සීවලී පිරිත",
    sub: "ධන වාසනාව සහ දියුණුව",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/Seewali.mp3",
    benefits: ["ධනය ආකර්ෂණය", "ව්‍යාපාරික දියුණුව", "නිවසේ සෞභාග්‍යය"],
    bestTime: "සිකුරාදා හෝ බදාදා උදෑසන",
    tags: ['wealth', 'luck']
  },
  {
    id: 'angulimala',
    title: "අංගුලිමාල පිරිත",
    sub: "සෞඛ්‍යය සහ ආරක්ෂාව",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/AngulimalaPiritha.mp3",
    benefits: ["නීරෝගී සම්පත", "ලේ දෝෂ දුරු වීම", "ගර්භණී මව්වරුන්ට සෙත් පැතීම"],
    bestTime: "සඳුදා හෝ බ්‍රහස්පතින්දා",
    tags: ['health', 'protection']
  },
  {
    id: 'karaniya',
    title: "කරණීය මෙත්ත සූත්‍රය",
    sub: "මෙත් සිතිවිලි සහ සැනසීම",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/Karaniya.mp3",
    benefits: ["භය දුරු කිරීම", "අමනුෂ්‍ය බලපෑම් දුරු වීම", "සතුටුදායක නින්ද"],
    bestTime: "රාත්‍රී නින්දට පෙර හෝ පෝය දිනවල",
    tags: ['peace', 'kindness']
  },
  {
    id: 'mangala',
    title: "මහා මංගල සූත්‍රය",
    sub: "ජීවිතයේ මංගල කරුණු",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/mangala.mp3",
    benefits: ["නිවසේ සමගිය", "පවුලේ දියුණුව", "සෑම වැඩකම සාර්ථකත්වය"],
    bestTime: "ඕනෑම දිනක උදෑසන",
    tags: ['family', 'success']
  },
  {
    id: 'rathana',
    title: "රතන සූත්‍රය",
    sub: "උපද්‍රව දුරු කිරීමේ මහා බලය",
    url: "https://thegreenceylon.lk/wp-content/uploads/2026/02/Rathana.mp3",
    benefits: ["වසංගත හා බිය දුරු කිරීම", "රෝගාබාධවලින් සහනය", "ත්‍රිවිධ රත්නයේ ආරක්ෂාව"],
    bestTime: "අසනීප තත්වයකදී හෝ ඕනෑම දිනක සවස",
    tags: ['health', 'protection', 'blessing']
  }
];

const getHoroscopicReason = (rashi: string, pirithId: string): string => {
  const rashiMap: Record<string, string> = {
    'Aries': 'මේෂ ලග්න හිමි ඔබට අධිපති කුජ ග්‍රහයාගේ ශක්තිය වර්ධනයටත්,',
    'Taurus': 'වෘෂභ ලග්න හිමි ඔබට අධිපති සිකුරු ග්‍රහයාගේ සුබ ඵල උදාකර ගැනීමටත්,',
    'Gemini': 'මිථුන ලග්න හිමි ඔබට අධිපති බුධ ග්‍රහයාගේ ඥාන ශක්තිය තීව්‍ර කිරීමටත්,',
    'Cancer': 'කටක ලග්න හිමි ඔබට අධිපති සඳු ග්‍රහයාගේ මානසික සැනසීම උදාකර ගැනීමටත්,',
    'Leo': 'සිංහ ලග්න හිමි ඔබට අධිපති රවි ග්‍රහයාගේ තේජස සහ බලය වර්ධනයටත්,',
    'Virgo': 'කන්‍යා ලග්න හිමි ඔබට අධිපති බුධ ග්‍රහයාගේ සුබ ඵල වර්ධනයටත්,',
    'Libra': 'තුලා ලග්න හිමි ඔබට අධිපති සිකුරු ග්‍රහයාගේ ආකර්ෂණ බලය වැඩි කිරීමටත්,',
    'Scorpio': 'වෘශ්චික ලග්න හිමි ඔබට අධිපති කුජ ග්‍රහයාගේ බලපෑම සුබදායක කර ගැනීමටත්,',
    'Sagittarius': 'ධනු ලග්න හිමි ඔබට අධිපති ගුරු ග්‍රහයාගේ ආශිර්වාදය ලබා ගැනීමටත්,',
    'Capricorn': 'මකර ලග්න හිමි ඔබට අධිපති ශනි ග්‍රහයාගේ අපල තත්වයන් දුරු කර සහනයටත්,',
    'Aquarius': 'කුම්භ ලග්න හිමි ඔබට අධිපති ශනි ග්‍රහයාගේ අපල දුරු කර සහනය උදාකර ගැනීමටත්,',
    'Pisces': 'මීන ලග්න හිමි ඔබට අධිපති ගුරු ග්‍රහයාගේ සුබ ඵල වර්ධනය කර ගැනීමටත්,',
  };

  const pirithMap: Record<string, string> = {
    'jaya': 'ජයග්‍රහණය සහ වෘත්තීය බාධා දුරු කිරීමට මෙම පිරිත සජ්ජායනය ඉතාමත් යෝග්‍ය වේ.',
    'rathnamali': 'සර්ව ආරක්ෂාව සහ දෙවියන්ගේ ආශිර්වාදය ලබා ගැනීමට මෙම සජ්ජායනය උපකාරී වේ.',
    'antharaya': 'අකල් මරණ සහ හදිසි අනතුරුවලින් ආරක්ෂාව ලබා ගැනීමට මෙය ඉතා බලසම්පන්න වේ.',
    'siwali': 'ධන වාසනාව සහ ආර්ථික දියුණුව උදාකර ගැනීමට මෙම පිරිතෙහි ආශිර්වාදය හිමිවේ.',
    'angulimala': 'නීරෝගී සම්පත සහ ලෙඩ රෝගවලින් ආරක්ෂාව සැලසීමට මෙය උපකාරී වේ.',
    'karaniya': 'මෙත් සිත වර්ධනය කර අමනුෂ්‍ය බලපෑම් සහ බිය දුරු කිරීමට මෙය සුවිශේෂී වේ.',
    'mangala': 'ජීවිතයේ මංගල කරුණු සහ පවුලේ සෞභාග්‍යය උදාකර ගැනීමට මෙය යෝග්‍ය වේ.',
    'rathana': 'සියලු උපද්‍රව සහ වසංගත බිය දුරු කර ආරක්ෂාව සලසා ගැනීමට මෙය ඉතා බලවත්ය.',
  };

  const prefix = rashiMap[rashi] || 'ඔබගේ ලග්නයට අනුව';
  const suffix = pirithMap[pirithId] || 'මෙම පිරිත සජ්ජායනය කිරීම ඉතා සුබදායකයි.';
  
  return `${prefix} ${suffix}`;
};

const PirithCard: React.FC<{ pirith: typeof PIRITH_DATA[0], type: 'Personalized' | 'General', rashi: string }> = ({ pirith, type, rashi }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const horoscopicReason = useMemo(() => getHoroscopicReason(rashi, pirith.id), [rashi, pirith.id]);

  return (
    <div className={`p-6 rounded-[2.5rem] zen-shadow border transition-all hover:translate-y-[-2px] relative overflow-hidden ${
      type === 'Personalized' ? 'bg-[#FFFDF7] border-orange-100/50 shadow-orange-50/20' : 'bg-white border-gray-100 shadow-sm'
    }`}>
      <audio ref={audioRef} src={pirith.url} preload="metadata" />
      
      {type === 'Personalized' && (
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl">
          Personalized
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="sinhala font-black text-lg text-gray-800 leading-tight">{pirith.title}</h3>
          <p className="sinhala text-[11px] font-bold text-orange-600 opacity-80">{pirith.sub}</p>
        </div>
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 flex-shrink-0 ${
            isPlaying 
              ? 'bg-orange-500 text-white shadow-orange-100' 
              : 'bg-white text-orange-500 border border-orange-50'
          }`}
        >
          {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl translate-x-0.5">▶</span>}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {pirith.benefits.map((benefit, i) => (
            <div key={i} className="bg-orange-50/50 px-3 py-1 rounded-full border border-orange-100/30">
              <p className="sinhala text-[9px] text-orange-800 font-medium tracking-tight">✨ {benefit}</p>
            </div>
          ))}
        </div>

        {/* Horoscopically Why Good - NEW AREA */}
        <div className={`p-4 rounded-2xl border ${type === 'Personalized' ? 'bg-orange-50/30 border-orange-100/50' : 'bg-gray-50/50 border-gray-100/50'}`}>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs">📜</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest sinhala">ජ්‍යෝතිෂ්‍යමය හේතුව</span>
          </div>
          <p className="sinhala text-[11px] text-gray-700 leading-relaxed font-medium">
            {horoscopicReason}
          </p>
        </div>

        <div className="bg-white/50 p-3 rounded-2xl border border-gray-100/30">
           <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest sinhala mb-1">
             <span>📅 සුබ වේලාව</span>
           </div>
           <p className="sinhala text-[11px] text-gray-600 font-bold">{pirith.bestTime}</p>
        </div>

        <div className="space-y-1 pt-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[9px] text-gray-400 font-bold tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PirithSection: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const selectedPiriths = useMemo(() => {
    const rashi = profile.rashi || 'Aries';
    let personalizedIds: string[] = [];

    if (['Aries', 'Leo', 'Sagittarius'].includes(rashi)) {
      personalizedIds = ['jaya', 'mangala']; 
    } else if (['Taurus', 'Virgo', 'Capricorn'].includes(rashi)) {
      personalizedIds = ['siwali', 'rathnamali']; 
    } else if (['Gemini', 'Libra', 'Aquarius'].includes(rashi)) {
      personalizedIds = ['karaniya', 'antharaya']; 
    } else {
      personalizedIds = ['rathana', 'angulimala']; 
    }

    const personalized = PIRITH_DATA.filter(p => personalizedIds.includes(p.id)).slice(0, 2);
    const generalCandidates = PIRITH_DATA.filter(p => !personalizedIds.includes(p.id));
    const general = generalCandidates.sort(() => 0.5 - Math.random()).slice(0, 2);

    return { personalized, general };
  }, [profile]);

  return (
    <div className="space-y-8 pt-4 text-left">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-black sinhala text-gray-800">සජ්ජායනා</h3>
          <p className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mt-0.5">ARAKSHA & SAJJAYANA CHANTS</p>
        </div>
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">🪔</div>
      </div>
      
      <div className="grid gap-6">
        {selectedPiriths.personalized.map((p) => (
          <PirithCard key={p.id} pirith={p} type="Personalized" rashi={profile.rashi || 'Aries'} />
        ))}
        <div className="flex items-center space-x-4 px-4 opacity-30">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Additional Chants</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        {selectedPiriths.general.map((p) => (
          <PirithCard key={p.id} pirith={p} type="General" rashi={profile.rashi || 'Aries'} />
        ))}
      </div>
    </div>
  );
};

export default PirithSection;
