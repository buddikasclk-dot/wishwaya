import React, { useState, useEffect } from 'react';
import { ResultLoadingScreen } from './ResultLoadingScreen';

const AVURUDU_DATA = [
  {
    name: 'පරණ අවුරුද්ද සඳහා ස්නානය',
    enName: 'Old Year Bathing',
    date: 'අප්‍රේල් 13',
    time: '-',
    instructions: 'දිවුල් පත් යුෂ මිශ්‍ර නානු ගා ස්නානය කිරීම මැනවි.',
    highlight: 'Wood apple leaves.'
  },
  {
    name: 'පුණ්‍ය කාලය',
    enName: 'Punya Kalaya',
    date: 'අප්‍රේල් 13 - 14',
    time: 'අප්‍රේල් 13 ප.ව. 8:57 සිට 14 පෙ.ව. 9:45 දක්වා',
    instructions: 'ආගමික වතාවත්වල නිරත වීම සුබයි.',
    highlight: 'Spiritual activities.'
  },
  {
    name: 'අලුත් අවුරුදු උදාව',
    enName: 'Dawn of New Year',
    date: 'අප්‍රේල් 14',
    time: 'පෙ.ව. 3:21',
    instructions: 'අලුත් අවුරුදු උදාව.',
    highlight: 'New Year begins.'
  },
  {
    name: 'ආහාර පිසීම',
    enName: 'Cooking Meals',
    date: 'අප්‍රේල් 14',
    time: 'පෙ.ව. 4:04',
    instructions: 'දකුණු දිශාව බලා තඹ පැහැති වස්ත්‍රයෙන් සැරසී ලිප් බැඳ ගිනි මොලවා ආහාර පිසීම සුබයි.',
    highlight: 'South / Copper clothes.'
  },
  {
    name: 'වැඩ ඇල්ලීම හා ආහාර අනුභවය',
    enName: 'Work & Meals',
    date: 'අප්‍රේල් 14',
    time: 'පෙ.ව. 6:44',
    instructions: 'දකුණු දිශාව බලා සුදු හෝ මුතු පැහැති වස්ත්‍රයෙන් සැරසී වැඩ අල්ලා ආහාර අනුභවය සුබයි.',
    highlight: 'South / White or Pearl clothes.'
  },
  {
    name: 'හිසතෙල් ගෑම',
    enName: 'Anointing Oil',
    date: 'අප්‍රේල් 16',
    time: 'පෙ.ව. 9:04',
    instructions: 'උතුරු දිශාව බලා කොළ පැහැති වස්ත්‍රයෙන් සැරසී හිසතෙල් ගෑම සුබයි.',
    highlight: 'North / Green clothes.'
  },
  {
    name: 'රැකීරක්ෂා සඳහා පිටත්වීම',
    enName: 'Leaving for Work',
    date: 'අප්‍රේල් 17',
    time: 'පෙ.ව. 9:03',
    instructions: 'උතුරු දිශාව බලා රන්වන් පැහැති වස්ත්‍රයෙන් සැරසී රැකීරක්ෂා සඳහා පිටත්වීම සුබයි.',
    highlight: 'North / Gold clothes.'
  },
];

const AvuruduNekath: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaded = localStorage.getItem('auruduNekathLoaded');
    if (!loaded) {
      setShowLoading(true);
    }
    setInitialized(true);
  }, []);

  const handleComplete = () => {
    localStorage.setItem('auruduNekathLoaded', 'true');
    setShowLoading(false);
  };

  if (!initialized) return null;

  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={true} 
        onComplete={handleComplete}
        icon="☀️"
        title="අලුත් අවුරුදු නැකත් සකස් කරමින්..."
        subtitle="මෙය සකස් කිරීමට තත්පර 30ක් පමණ ගතවනු ඇත. කරුණාකර රැඳී සිටින්න."
        colorTheme="amber"
        messages={[
          "Preparing Aurudu Nekath schedule...",
          "Checking traditional timings...",
          "Loading Sinhala & Tamil New Year guidance...",
          "Aligning auspicious moments..."
        ]}
      />
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <span className="text-5xl animate-pulse">🏮</span>
        </div>
        <h2 className="text-3xl font-black sinhala text-gray-800">2026 අලුත් අවුරුදු නැකත්</h2>
        <p className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.3em]">Sinhala & Tamil New Year 2026</p>
      </header>

      <div className="space-y-6">
        {AVURUDU_DATA.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-white transition-all hover:translate-y-[-2px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="sinhala font-black text-lg text-gray-800 leading-tight">
                  {item.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {item.enName}
                </p>
              </div>
              <div className="bg-orange-50 px-3 py-1 rounded-full flex flex-col items-center min-w-[60px]">
                <span className="sinhala text-[10px] font-black text-orange-600">{item.date}</span>
                <span className="text-[9px] font-bold text-orange-400 uppercase">{item.time === '-' ? 'Day' : item.time}</span>
              </div>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 space-y-2">
              <p className="sinhala text-sm text-gray-600 leading-relaxed italic">
                {item.instructions}
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs">📍</span>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                  Instruction: <span className="text-gray-600">{item.highlight}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-600 p-8 rounded-[3rem] text-white text-center shadow-xl shadow-orange-100">
        <p className="sinhala font-black text-xl mb-2">සෞභාග්‍යමත් අලුත් අවුරුද්දක් වේවා!</p>
        <p className="text-xs opacity-80 uppercase tracking-widest font-bold">May the 2026 be prosperous</p>
      </div>
    </div>
  );
};

export default AvuruduNekath;
