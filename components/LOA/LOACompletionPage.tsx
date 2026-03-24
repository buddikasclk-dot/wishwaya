import React from 'react';
import { LOACategoryContent } from '../../types';

interface LOACompletionPageProps {
  category: LOACategoryContent;
  onRestart: () => void;
  onHome: () => void;
}

const LOACompletionPage: React.FC<LOACompletionPageProps> = ({
  category,
  onRestart,
  onHome
}) => {
  return (
    <div className="p-6 pb-24 space-y-6 animate-in zoom-in duration-700 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="text-6xl mb-4 animate-bounce">🏆</div>
      <h1 className="text-3xl font-black text-purple-800 uppercase tracking-wider">සුභ පැතුම්!</h1>
      <p className="text-sm text-purple-600 font-medium">ඔබ දින 21 අභියෝගය සාර්ථකව නිම කළා.</p>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] zen-shadow border border-purple-100 space-y-6 w-full max-w-sm">
        <div className="text-4xl text-purple-600">{category.icon}</div>
        <h2 className="text-xl font-bold text-gray-800">{category.titleSinhala}</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">සම්පූර්ණයි</p>
        
        <div className="h-px bg-gray-200 w-full my-4"></div>
        
        <p className="text-sm text-gray-600 leading-relaxed italic">
          "ඔබේ කැපවීම විශ්වය විසින් පිළිගෙන ඇත. දැන් ඔබ නව ආරම්භයකට සූදානම්."
        </p>
        
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
          <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">විශ්ව ආශිර්වාදය</p>
          <p className="text-lg font-black text-yellow-600 mt-2">"{category.spiritualPhrase}"</p>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <button
          onClick={onHome}
          className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:bg-purple-700 transition-all active:scale-95"
        >
          වෙනත් අභියෝගයක් තෝරන්න
        </button>
        <button
          onClick={onRestart}
          className="w-full py-4 bg-white text-purple-600 border border-purple-200 rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-50 transition-all active:scale-95"
        >
          නැවත ආරම්භ කරන්න
        </button>
      </div>
    </div>
  );
};

export default LOACompletionPage;
