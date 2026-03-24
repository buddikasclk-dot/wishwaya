import React from 'react';
import { LOACategoryId } from '../../types';
import { LOA_CONTENT } from '../../data/loaContent';

interface LOAHomeProps {
  onSelectCategory: (categoryId: LOACategoryId) => void;
}

const LOAHome: React.FC<LOAHomeProps> = ({ onSelectCategory }) => {
  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-purple-800 uppercase tracking-wider">විශ්ව ආකර්ෂණ නීතිය</h1>
        <p className="text-xs text-purple-600 font-medium">විශ්ව ශක්තියෙන් ඔබේ සිහින සැබෑ කරගන්න</p>
      </div>

      {/* Intro Section */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl zen-shadow border border-purple-100 space-y-4">
        <div className="flex justify-center text-4xl mb-2">🌌</div>
        <h2 className="text-lg font-bold text-center text-gray-800">මොකක්ද මේ විශ්ව ආකර්ෂණ නීතිය?</h2>
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          විශ්ව ආකර්ෂණ නීතිය යනු ඔබේ සිතුවිලි, හැඟීම් සහ ක්‍රියාවන් තුළින් ඔබට අවශ්‍ය ජීවිතය නිර්මාණය කර ගැනීමයි. 
          ධනාත්මක සිතුවිලි පමණක් ප්‍රමාණවත් නොවේ; කුඩා නමුත් අර්ථවත් ක්‍රියාවන් දිනපතාම කළ යුතුය.
          මෙම දින 21 අභියෝගය ඔබේ මනස ඒකාග්‍ර කර ගැනීමටත්, කෘතඥතාවය පුරුදු කිරීමටත් උපකාරී වේ.
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="text-sm font-bold text-center text-gray-800 mb-4">ඔබේ ඉලක්කය තෝරන්න</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(LOA_CONTENT).map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all active:scale-95 text-left space-y-2"
            >
              <span className="text-2xl block">{category.icon}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-800 block">{category.titleSinhala}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{category.titleEnglish}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LOAHome;
