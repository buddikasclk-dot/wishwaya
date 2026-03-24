import React, { useState, useEffect } from 'react';

interface ResultLoadingScreenProps {
  isReady: boolean;
  onComplete: () => void;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  colorTheme?: 'pink' | 'blue' | 'indigo' | 'emerald' | 'amber';
  messages?: string[];
}

const defaultMessages = [
  "Analyzing astrological data...",
  "Calculating compatibility...",
  "Preparing your results...",
  "Aligning planetary positions...",
  "Decoding cosmic signals..."
];

export const ResultLoadingScreen: React.FC<ResultLoadingScreenProps> = ({ 
  isReady, 
  onComplete,
  icon = "✨",
  title = "Generating your results...",
  subtitle = "Please wait up to 30 seconds.",
  colorTheme = 'indigo',
  messages = defaultMessages
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const isReadyRef = React.useRef(isReady);
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    isReadyRef.current = isReady;
    onCompleteRef.current = onComplete;
  }, [isReady, onComplete]);

  const themeColors = {
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      borderTop: 'border-t-pink-600',
      borderBase: 'border-pink-200',
      text: 'text-pink-800',
      progress: 'bg-pink-500',
      textMuted: 'text-pink-400'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      borderTop: 'border-t-blue-600',
      borderBase: 'border-blue-200',
      text: 'text-blue-800',
      progress: 'bg-blue-500',
      textMuted: 'text-blue-400'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      borderTop: 'border-t-indigo-600',
      borderBase: 'border-indigo-200',
      text: 'text-indigo-800',
      progress: 'bg-indigo-500',
      textMuted: 'text-indigo-400'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      borderTop: 'border-t-emerald-600',
      borderBase: 'border-emerald-200',
      text: 'text-emerald-800',
      progress: 'bg-emerald-500',
      textMuted: 'text-emerald-400'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      borderTop: 'border-t-amber-600',
      borderBase: 'border-amber-200',
      text: 'text-amber-800',
      progress: 'bg-amber-500',
      textMuted: 'text-amber-400'
    }
  };

  const colors = themeColors[colorTheme];

  useEffect(() => {
    const duration = 30000; // 30 seconds
    const intervalTime = 100; // Update every 100ms
    const stepAmount = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepAmount;
        
        if (next >= 100) {
          if (isReadyRef.current) {
            clearInterval(timer);
            setTimeout(() => onCompleteRef.current(), 500);
            return 100;
          } else {
            return 99; // Hold at 99% until ready
          }
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(messageTimer);
  }, [messages.length]);

  return (
    <div className="p-8 animate-in fade-in duration-700 min-h-[80vh] flex flex-col items-center justify-center space-y-8 text-center">
      <div className="relative">
        <div className={`relative w-24 h-24 ${colors.bg} rounded-full flex items-center justify-center mx-auto zen-shadow border ${colors.border} overflow-hidden`}>
          <div className="absolute inset-[6px] rounded-full overflow-hidden">
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_50%)] pointer-events-none" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className={`w-4 h-4 border-2 ${colors.borderBase} ${colors.borderTop} rounded-full animate-spin`}></div>
        </div>
      </div>
      
      <div className="space-y-3 w-full max-w-md">
        <h2 className="text-2xl font-black sinhala text-gray-800 tracking-tight">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed px-4 min-h-[40px] flex items-center justify-center transition-opacity duration-300">
          {messages[messageIndex]}
        </p>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden max-w-[250px] relative">
        <div 
          className={`h-full ${colors.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className={`text-[10px] ${colors.textMuted} font-bold uppercase tracking-[0.2em] opacity-80`}>
        {Math.round(progress)}%
      </p>

      <div className="w-full max-w-md h-[250px] bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(243,244,246,0.78))] border border-gray-200 rounded-2xl flex items-center justify-center mt-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),transparent)]" />
        <div className="relative z-10 h-36 w-36 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl">
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
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    </div>
  );
};
