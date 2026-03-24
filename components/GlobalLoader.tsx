
import React, { useEffect, useState } from 'react';
import { loadingPhrases } from '../src/assets/loaderData';

const GlobalLoader: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(() => Math.floor(Math.random() * loadingPhrases.length));

  useEffect(() => {
    // The animation cycle is 7 seconds. 
    // We synchronize the phrase change with the animation end.
    const interval = setInterval(() => {
      setPhraseIndex(prev => {
        let next = Math.floor(Math.random() * loadingPhrases.length);
        while (next === prev && loadingPhrases.length > 1) {
          next = Math.floor(Math.random() * loadingPhrases.length);
        }
        return next;
      });
    }, 7000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center bg-white px-8 animate-in fade-in duration-1000 overflow-hidden">
      
      {/* 
          Top Section: Stationary Visuals
          By using a top padding instead of justify-center, we ensure 
          these elements never move when content below them changes.
      */}
      <div className="flex flex-col items-center pt-[15vh]">
        <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden rounded-full mb-8 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.28),_transparent_40%),linear-gradient(180deg,_#ffffff_0%,_#eefbf2_100%)] border border-green-100 shadow-[0_20px_60px_rgba(34,197,94,0.12)]">
          <div className="absolute inset-3 rounded-full overflow-hidden ring-4 ring-white/80 shadow-inner">
            <video
              src="/loadingVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_45%)] pointer-events-none" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="sinhala text-gray-800 font-black text-2xl tracking-tight">
            දත්ත විශ්ලේෂණය වේ...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
            <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.5em] opacity-80">
              Aligning Planetary Nodes
            </p>
          </div>
        </div>
      </div>

      {/* 
          Phrase Section: Fixed height container to prevent layout shifts.
          The 'h-[220px]' ensures even long phrases fit without pushing 
          other elements or changing the center of gravity.
      */}
      <div className="mt-12 w-full max-w-sm text-center h-[220px] flex flex-col items-center justify-start overflow-hidden">
        <div 
          key={phraseIndex} 
          className="animate-phrase-flow flex flex-col items-center w-full"
        >
          <div className="w-12 h-px bg-gray-100 mb-8"></div>
          <p className="sinhala text-gray-500 text-base leading-[2.1] font-medium italic px-4">
            "{loadingPhrases[phraseIndex].text}"
          </p>
          <p className="mt-6 text-[9px] text-gray-400 font-black uppercase tracking-[0.4em] opacity-60">
            — {loadingPhrases[phraseIndex].author} —
          </p>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-12 text-center w-full pointer-events-none">
        <div className="flex items-center justify-center space-x-6 opacity-20">
          <div className="w-8 h-px bg-gray-400"></div>
          <p className="text-[8px] text-gray-500 font-black uppercase tracking-[1em] translate-x-1">
            WISHWAYA
          </p>
          <div className="w-8 h-px bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
