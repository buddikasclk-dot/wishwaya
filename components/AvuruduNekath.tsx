import React, { useEffect, useState } from 'react';
import { ResultLoadingScreen } from './ResultLoadingScreen';

const AVURUDU_DATA = [
  {
    name: 'පරණ අවුරුද්ද සඳහා ස්නානය',
    enName: 'Old Year Bathing',
    date: 'අප්‍රේල් 13',
    time: 'සඳු දින',
    instructions:
      'අප්‍රේල් මස 13 වැනි සදු දින දිවුල් පත් යුෂ මිශ්‍ර නානු ගා ස්නානය කොට ඉෂ්ට දේවතා අනුස්මරණයේ යෙදී වාසය මැනවී.',
    highlight: 'දිවුල් පත් යුෂ මිශ්‍ර නානු ගා ස්නානය.'
  },
  {
    name: 'අලූත් අවුරුදු උදාව',
    enName: 'Dawn of New Year',
    date: 'අප්‍රේල් 14',
    time: 'පූර්ව භාග 09.32',
    instructions:
      'අප්‍රේල් මස 14 වැනි අඟහරුවාදා පූර්ව භාග 09.32 ට සිංහල අලූත් අවුරුද්ද උදාවෙයි.',
    highlight: 'සිංහල අලූත් අවුරුද්ද උදාවෙයි.'
  },
  {
    name: 'පුණ්‍ය කාලය',
    enName: 'Punya Kalaya',
    date: 'අප්‍රේල් 14',
    time: 'පූර්ව භාග 03.08 - අපර භාග 03.56',
    instructions:
      'අප්‍රේල් මස 14 වැනි අගහරුවාදා පූර්ව භාග 03.08 සිට එදිනම අපර භාග 03.56 දක්වා',
    highlight: 'ආගමික කටයුතු සඳහා සුදුසු පුණ්‍ය කාලය.'
  },
  {
    name: 'ආහාර පිසීම',
    enName: 'Cooking Meals',
    date: 'අප්‍රේල් 14',
    time: 'පූර්ව භාග 10.41',
    instructions:
      'අප්‍රේල් මස 14 වෙනි අගහරුවාදා පූර්ව භාග 10.41 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා ලිප් බැද ගිණි මොලවා කිරි බතක්ද, කැවිලි වර්ගයක්ද, දී කිරි වලද ද, පිලියෙල කර ගැනීම මැනවි.',
    highlight: 'රක්ත වර්ණයෙන් සැරසී දකුණු දිශාව බලා.'
  },
  {
    name: 'වැඩ ඇල්ලීම, ගණුදෙනු කිරීම හා ආහාර අනුභවය',
    enName: 'Work, Transactions and Meals',
    date: 'අප්‍රේල් 14',
    time: 'අපර භාග 12.05',
    instructions:
      'අප්‍රේල් මස 14 වෙනි අඟහරුවාදා අපර භාග 12.05 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා සියලු වැඩ අල්ලා ගමුදෙනු කොට ආහාර අනුභවය කිරීම මැනවි.',
    highlight: 'සියලු වැඩ ඇල්ලීම හා ගනුදෙනු ආරම්භයට සුදුසු වේලාව.'
  },
  {
    name: 'හිසතෙල් ගෑම',
    enName: 'Anointing Oil',
    date: 'අප්‍රේල් 15',
    time: 'පූර්ව භාග 06.54',
    instructions:
      'අප්‍රේල් මස 15 වෙහි බදාදා පූර්ව භාග 06.54 ට නැගෙනහිර දිශාව බලා හිසට කොහොඹ පත්ද, පයට කොළොන් පද, තබා පච්ච වර්ගා වස්ත්‍රාභරණයෙන් සැරසී කොහොඹ පත් යුෂ මිශ්‍ර භානු හා තෙල් ගා ස්නානය කිරීම මැනවි.',
    highlight: 'නැගෙනහිර දිශාව බලා කොහොඹ පත් යුෂ මිශ්‍ර භානු හා තෙල්.'
  },
  {
    name: 'රැකී රක්ෂා සඳහා පිටත්ව යෑම',
    enName: 'Leaving for Work',
    date: 'අප්‍රේල් 20',
    time: 'පූර්ව භාග 06.27',
    instructions:
      'අප්‍රේල් මස 20 වැනි සඳුදා පූර්ව භාග 06.27 ට ශ්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කිරිබත් සහ එළකිරි මිශ්‍ර කැවිලිද අනුභව කර දකුණු දිශාව බලා පිටත් වීම මැනවි.',
    highlight: 'ශ්වේත වර්ණයෙන් සැරසී කිරිබත් අනුභව කර දකුණු දිශාව බලා.'
  },
  {
    name: 'පැළ සිටුවීමට',
    enName: 'Planting',
    date: 'අප්‍රේල් 23',
    time: 'පූර්ව භාග 11.36',
    instructions:
      'අප්‍රේල් මස 23 වැනි බ්‍රහස්පතින්දා රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී පූර්ව භාග 11.36 ට උතුරු දිශාව බලා පැළ සිටුවීම මැනවි.',
    highlight: 'රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී උතුරු දිශාව බලා.'
  }
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
          'Preparing Aurudu Nekath schedule...',
          'Checking traditional timings...',
          'Loading Sinhala & Tamil New Year guidance...',
          'Aligning auspicious moments...'
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
        <p className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          Sinhala & Tamil New Year 2026
        </p>
      </header>

      <div className="space-y-6">
        {AVURUDU_DATA.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-white transition-all hover:translate-y-[-2px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="sinhala font-black text-lg text-gray-800 leading-tight">{item.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.enName}</p>
              </div>
              <div className="bg-orange-50 px-3 py-1 rounded-full flex flex-col items-center min-w-[60px]">
                <span className="sinhala text-[10px] font-black text-orange-600">{item.date}</span>
                <span className="text-[9px] font-bold text-orange-400 uppercase">{item.time}</span>
              </div>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 space-y-2">
              <p className="sinhala text-sm text-gray-600 leading-relaxed italic">{item.instructions}</p>
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
