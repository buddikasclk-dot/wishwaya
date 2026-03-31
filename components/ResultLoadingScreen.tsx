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
  'Analyzing astrological data...',
  'Calculating compatibility...',
  'Preparing your results...',
  'Aligning planetary positions...',
  'Decoding cosmic signals...',
];

export const ResultLoadingScreen: React.FC<ResultLoadingScreenProps> = ({
  isReady,
  onComplete,
  icon = '✨',
  title = 'Generating your results...',
  subtitle = 'Please wait up to 30 seconds.',
  colorTheme = 'indigo',
  messages = defaultMessages,
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
      progress: 'bg-pink-500',
      textMuted: 'text-pink-400',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      borderTop: 'border-t-blue-600',
      borderBase: 'border-blue-200',
      progress: 'bg-blue-500',
      textMuted: 'text-blue-400',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      borderTop: 'border-t-indigo-600',
      borderBase: 'border-indigo-200',
      progress: 'bg-indigo-500',
      textMuted: 'text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      borderTop: 'border-t-emerald-600',
      borderBase: 'border-emerald-200',
      progress: 'bg-emerald-500',
      textMuted: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      borderTop: 'border-t-amber-600',
      borderBase: 'border-amber-200',
      progress: 'bg-amber-500',
      textMuted: 'text-amber-400',
    },
  };

  const colors = themeColors[colorTheme];

  useEffect(() => {
    const duration = 30000;
    const intervalTime = 100;
    const stepAmount = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepAmount;

        if (next >= 100) {
          if (isReadyRef.current) {
            clearInterval(timer);
            setTimeout(() => onCompleteRef.current(), 500);
            return 100;
          }
          return 99;
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
    <div className="min-h-[80vh] animate-in fade-in duration-700 flex flex-col items-center justify-center space-y-8 p-8 text-center">
      <div className="relative">
        <div
          className={`relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border ${colors.border} ${colors.bg} zen-shadow`}
        >
          <div className="absolute inset-[8px] rounded-full bg-white/90 shadow-inner" />
          <div className="relative z-10 flex items-center justify-center text-4xl">{icon}</div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.32),_transparent_55%)]" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
          <div className={`h-4 w-4 animate-spin rounded-full border-2 ${colors.borderBase} ${colors.borderTop}`} />
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <h2 className="text-2xl font-black tracking-tight text-gray-800 sinhala">{title}</h2>
        <p className="min-h-[40px] px-4 text-sm leading-relaxed text-gray-500 transition-opacity duration-300 flex items-center justify-center">
          {messages[messageIndex]}
        </p>
        <p className="text-xs font-medium text-gray-400">{subtitle}</p>
      </div>

      <div className="relative h-2 w-full max-w-[250px] overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full ${colors.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 ${colors.textMuted}`}>
        {Math.round(progress)}%
      </p>

      <div className="relative mt-8 flex h-[250px] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(243,244,246,0.78))]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),transparent)]" />
        <video
          src="/loadingVideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative z-10 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};
