import React from 'react';

interface DetailedReportCTAProps {
  onOpenReport?: () => void;
}

const SUMMARY_FEATURES = ['Home', 'Nekath', 'Palm Analysis', 'Stones', 'Remedies', 'Soul Path'];

const DetailedReportCTA: React.FC<DetailedReportCTAProps> = ({ onOpenReport }) => {
  const handleOpenReport = () => {
    if (onOpenReport) {
      onOpenReport();
      return;
    }
    window.location.href = '/?tab=profile';
  };

  return (
    <div className="rounded-[2.2rem] border border-emerald-100 bg-[linear-gradient(140deg,_rgba(236,253,245,0.96)_0%,_rgba(240,249,255,0.95)_100%)] p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Summary</p>
      <p className="mt-2 sinhala text-sm leading-7 text-slate-700">
        මෙය ඔබ ඉල්ලූ ප්‍රතිඵලයන්ගේ සාරාංශයයි. ඔබ ගැන සම්පූර්ණ ජෝතිශ්‍ය විග්‍රහය ලබාගන්න.
        <span className="font-black text-emerald-700"> PREMIUM ASTRO REPORT වෙත පිවිසෙන්න.</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUMMARY_FEATURES.map((feature) => (
          <span key={feature} className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-600">
            {feature}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={handleOpenReport}
        className="mt-5 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-black"
      >
        Get detailed report
      </button>
    </div>
  );
};

export default DetailedReportCTA;
