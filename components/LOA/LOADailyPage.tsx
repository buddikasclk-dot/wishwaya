import React, { useState, useEffect } from 'react';
import { LOADayContent, LOACategoryContent } from '../../types';

const LOA_AUDIO_SRC = '/Positive%20Aura.mp3';

interface LOADailyPageProps {
  dayContent: LOADayContent;
  category: LOACategoryContent;
  taskStates: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  onCompleteDay: () => void;
  onBack: () => void;
}

const LOADailyPage: React.FC<LOADailyPageProps> = ({
  dayContent,
  category,
  taskStates,
  onToggleTask,
  onCompleteDay,
  onBack
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const completedTaskCount = dayContent.tasks.filter(task => Boolean(taskStates?.[task.id])).length;
  const allTasksCompleted = dayContent.tasks.length > 0 && completedTaskCount === dayContent.tasks.length;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    void audio.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
    };
  }, [dayContent.dayNumber]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        void audioRef.current.play();
      }
    }
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{category.titleSinhala}</h2>
          <h1 className="text-xl font-black text-purple-800">දින {dayContent.dayNumber}</h1>
        </div>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-100 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <h3 className="text-lg font-bold text-gray-800 relative z-10">{dayContent.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed relative z-10">
          {dayContent.miniDescription}
        </p>
      </div>

      {/* Affirmation */}
      <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg text-center text-white space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <span className="text-3xl block">✨</span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">විශ්ව පණිවිඩය</p>
        <p className="text-lg font-black leading-tight">"{dayContent.affirmation}"</p>
        <button
          onClick={toggleAudio}
          className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold flex items-center justify-center space-x-2 mx-auto transition-colors backdrop-blur-sm"
        >
          <span>{isPlaying ? '⏸' : '▶️'}</span>
          <span>{isPlaying ? 'නවතන්න' : 'සවන්දෙන්න'}</span>
        </button>
        <audio 
          ref={audioRef} 
          src={LOA_AUDIO_SRC}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide px-2">දෛනික කාර්යයන් (3)</h3>
        {dayContent.tasks.map((task) => (
          <label 
            key={task.id}
            className={`flex items-start space-x-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              taskStates[task.id] 
                ? 'bg-green-50 border-green-200 shadow-sm' 
                : 'bg-white border-gray-100 hover:border-purple-200'
            }`}
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={!!taskStates[task.id]}
                onChange={() => onToggleTask(task.id)}
                className="w-6 h-6 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                  {task.type === 'action' ? 'ක්‍රියාව' : task.type === 'vibration' ? 'භාවනාව' : 'කෘතඥතාව'}
                </span>
              </div>
              <p className={`text-sm font-medium transition-colors ${
                taskStates[task.id] ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}>
                {task.text}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Reflection (Optional) */}
      {dayContent.reflectionPrompt && (
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 space-y-2">
          <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">සිතුවිලි සටහන</p>
          <p className="text-sm text-gray-700 italic">"{dayContent.reflectionPrompt}"</p>
          <textarea 
            className="w-full mt-2 p-3 rounded-xl border border-yellow-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="ඔබේ අදහස් මෙහි ලියන්න..."
            rows={3}
          ></textarea>
        </div>
      )}

      {/* Complete Button */}
      <div className="pt-4">
        <button
          onClick={onCompleteDay}
          disabled={!allTasksCompleted}
          className={`w-full min-h-[56px] px-4 py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center transition-all active:scale-95 ${
            allTasksCompleted
              ? 'bg-emerald-600 text-white border border-emerald-600 shadow-lg shadow-emerald-100 hover:bg-emerald-700'
              : 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed shadow-none opacity-100'
          }`}
          style={{
            backgroundColor: allTasksCompleted ? '#059669' : '#f1f5f9',
            color: allTasksCompleted ? '#ffffff' : '#475569',
          }}
        >
          {allTasksCompleted ? 'දවස සම්පූර්ණ කරන්න' : 'කාර්යයන් සම්පූර්ණ කරන්න'}
        </button>
        <p className={`text-[11px] text-center mt-2 font-medium ${allTasksCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
          {completedTaskCount}/{dayContent.tasks.length} කාර්යයන් අවසන්යි.
        </p>
        {!allTasksCompleted && (
          <p className="text-[10px] text-center text-gray-400 mt-2">
            ඉදිරියට යාමට සියලු කාර්යයන් සම්පූර්ණ කළ යුතුය.
          </p>
        )}
      </div>
    </div>
  );
};

export default LOADailyPage;
