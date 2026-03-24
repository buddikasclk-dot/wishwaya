
import React, { useEffect, useState } from 'react';
import { UserProfile, AuspiciousTimes } from '../types';
import { getAuspiciousTimes } from '../services/geminiService';
import { ResultLoadingScreen } from './ResultLoadingScreen';

interface NekathProps {
  profile: UserProfile;
}

const SINHALA_MONTHS = [
  'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 
  'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
];

const Nekath: React.FC<NekathProps> = ({ profile }) => {
  const [data, setData] = useState<AuspiciousTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const currentMonthSinhala = SINHALA_MONTHS[currentMonth];

  const loadData = async () => {
    setLoading(true);
    setShowLoading(true);
    setError(false);
    try {
      const res = await getAuspiciousTimes(profile);
      setData(res);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newMonth = new Date().getMonth();
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth);
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentMonth]);

  useEffect(() => {
    loadData();
  }, [profile, currentMonth]);

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={!loading} 
        onComplete={() => setShowLoading(false)}
        icon="✨"
        title="නැකත් ගණනය කරමින්..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="indigo"
        messages={[
          "ග්‍රහ පිහිටීම් විශ්ලේෂණය කරමින් පවතී...",
          "සුබ මුහුර්ත ගණනය කරමින් පවතී...",
          "ඔබගේ කේන්දරය සමඟ ගලපමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
        <p className="sinhala text-gray-800 font-bold">දත්ත ලබා ගැනීමේදී ගැටළුවක් ඇතිවිය.</p>
        <button 
          onClick={loadData}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black sinhala active:scale-95 transition-transform"
        >
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    );
  }

  const items = [
    { title: 'ව්‍යාපාරික කටයුතු', icon: '💼', content: data?.business, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'ගමන් බිමන්', icon: '✈️', content: data?.travel, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'නිවාස ඉදි කිරීම්', icon: '🏠', content: data?.houseBuilding, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'විවාහ කටයුතු', icon: '💍', content: data?.marriage, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-black sinhala text-gray-800">{currentMonthSinhala} සුබ නැකත්</h2>
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Auspicious Weekly Times</p>
      </header>

      <div className="grid gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-white flex items-center space-x-6">
            <div className={`w-16 h-16 ${item.bg} rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner`}>
              {item.icon}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className={`sinhala font-black text-sm uppercase tracking-wider ${item.color}`}>{item.title}</h4>
              <p className="sinhala text-gray-600 text-sm leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-center">
        <p className="sinhala text-[11px] text-indigo-800/70 font-bold leading-relaxed">
          ඉහත දක්වා ඇති සියලුම වේලාවන් ශ්‍රී ලංකාවේ සම්මත වේලාවෙන් සහ දේශීය ජ්‍යෝතිෂ්‍ය නීති රීති වලට අනුකූලව ගණනය කර ඇත.
        </p>
      </div>
    </div>
  );
};

export default Nekath;
