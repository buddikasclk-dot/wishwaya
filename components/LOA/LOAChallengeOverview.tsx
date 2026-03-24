import React from 'react';
import { LOACategoryContent } from '../../types';

interface LOAChallengeOverviewProps {
  category: LOACategoryContent;
  completedDays: number[];
  unlockedDay: number;
  onSelectDay: (day: number) => void;
  onRestart: () => void;
}

const LOAChallengeOverview: React.FC<LOAChallengeOverviewProps> = ({
  category,
  completedDays,
  unlockedDay,
  onSelectDay,
  onRestart
}) => {
  const completedCount = completedDays.length;
  const progressPercentage = Math.round((completedCount / 21) * 100);

  const [showRestartConfirm, setShowRestartConfirm] = React.useState(false);

  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl mb-2">{category.icon}</div>
        <h1 className="text-2xl font-black text-purple-800 uppercase tracking-wider">{category.titleSinhala}</h1>
        <p className="text-xs text-purple-600 font-medium">{category.titleEnglish}</p>
      </div>

      {/* Intro & Rules */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl zen-shadow border border-purple-100 space-y-4">
        <h2 className="text-lg font-bold text-center text-gray-800">මෙම ගමන ගැන</h2>
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          {category.introDescription}
        </p>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center italic text-purple-800 font-medium text-sm">
          "{category.spiritualPhrase}"
        </div>
        <div className="text-[10px] text-gray-500 space-y-1 list-disc list-inside bg-gray-50 p-3 rounded-xl">
          <p>දිනකට එක් පියවරක් පමණක් විවෘත වේ.</p>
          <p>ඊළඟ දිනය විවෘත වන්නේ පසුදා උදෑසන 05:00 ටය.</p>
          <p>මඟ හැරුණු දින නැවත සම්පූර්ණ කළ හැක.</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
          <span>ප්‍රගතිය</span>
          <span>{completedCount}/21 ({progressPercentage}%)</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-center text-gray-400 italic">
          "කුඩා පියවරක් වුවද ඉදිරියට තබන්න."
        </p>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {category.days.map((day) => {
          const isCompleted = completedDays.includes(day.dayNumber);
          const isUnlocked = day.dayNumber <= unlockedDay;
          const isCurrent = day.dayNumber === unlockedDay && !isCompleted;
          const isLocked = !isUnlocked;

          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                if (isUnlocked) {
                  onSelectDay(day.dayNumber);
                }
              }}
              disabled={isLocked}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-100 border-2 border-green-200 text-green-700 shadow-sm' 
                  : isCurrent
                    ? 'bg-white border-2 border-purple-500 text-purple-800 shadow-lg scale-105 ring-4 ring-purple-100'
                    : isLocked
                      ? 'bg-gray-100 border border-gray-200 text-gray-400 opacity-70 cursor-not-allowed'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <span className={`text-lg font-black ${isCompleted ? 'text-green-600' : ''}`}>
                {day.dayNumber}
              </span>
              <span className="text-[8px] uppercase font-bold tracking-wider mt-1">
                {isCompleted ? 'සම්පූර්ණයි' : isLocked ? 'අගුළු දමා ඇත' : 'විවෘතයි'}
              </span>
              
              {isCompleted && (
                <div className="absolute top-1 right-1 text-green-500 text-xs">✓</div>
              )}
              {isLocked && (
                <div className="absolute top-1 right-1 text-gray-400 text-xs">🔒</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Restart Button */}
      <div className="pt-8 text-center">
        {!showRestartConfirm ? (
          <button 
            onClick={() => setShowRestartConfirm(true)}
            className="text-xs text-red-400 hover:text-red-600 underline"
          >
            අභියෝගය නැවත ආරම්භ කරන්න
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in zoom-in-95 duration-200">
            <p className="text-[10px] text-red-700 font-bold sinhala">ඔබට මෙම අභියෝගය මුල සිට නැවත ආරම්භ කිරීමට අවශ්‍යද? මෙය ඔබගේ වර්තමාන ප්‍රගතිය මකා දමනු ඇත.</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  onRestart();
                  setShowRestartConfirm(false);
                }}
                className="text-[10px] bg-red-500 text-white px-4 py-2 rounded-lg font-bold sinhala"
              >
                ඔව්, නැවත ආරම්භ කරන්න
              </button>
              <button 
                onClick={() => setShowRestartConfirm(false)}
                className="text-[10px] bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold sinhala"
              >
                අවලංගු කරන්න
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LOAChallengeOverview;
