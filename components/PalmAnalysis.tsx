
import React, { useState, useRef, useEffect } from 'react';
import { PalmAnalysisState } from '../types';
import { ResultLoadingScreen } from './ResultLoadingScreen';
import DetailedReportCTA from './DetailedReportCTA';

interface PalmAnalysisProps {
  gender: string;
  palmState: PalmAnalysisState;
  setPalmState: React.Dispatch<React.SetStateAction<PalmAnalysisState>>;
  onStartAnalysis: (base64Image: string) => Promise<void>;
}

const PalmAnalysis: React.FC<PalmAnalysisProps> = ({ gender, palmState, setPalmState, onStartAnalysis }) => {
  const [step, setStep] = useState<'instruction' | 'camera'>('instruction');
  const [error, setError] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (palmState.status === 'analyzing') {
      setShowLoading(true);
    }
  }, [palmState.status]);

  const startCamera = async () => {
    setStep('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setError("කැමරාව ක්‍රියාත්මක කළ නොහැකි විය. කරුණාකර අවසර පරීක්ෂා කරන්න.");
      setStep('instruction');
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());

    setStep('instruction');
    // Start background analysis
    onStartAnalysis(base64);
  };

  // If currently analyzing, show a non-blocking mini loader
  if (showLoading) {
    return (
      <ResultLoadingScreen 
        isReady={palmState.status === 'success' || palmState.status === 'error'} 
        onComplete={() => setShowLoading(false)}
        icon="✋"
        title="අත්ල සාස්තරය සකසමින් පවතී..."
        subtitle="විශ්වය විසින් ඔබේ අත්ලෙහි රහස් කියවමින් පවතී. මෙය තත්පර 30ක් පමණ ගතවනු ඇත."
        colorTheme="pink"
        messages={[
          "අත්ලේ රේඛා විශ්ලේෂණය කරමින් පවතී...",
          "ජීවන රේඛාව සහ හෘද රේඛාව පරීක්ෂා කරමින් පවතී...",
          "ග්‍රහ මණ්ඩල වල පිහිටීම අධ්‍යයනය කරමින් පවතී...",
          "ප්‍රතිඵල සකස් කරමින් පවතී..."
        ]}
      />
    );
  }

  if (step === 'instruction' && !showLoading && palmState.status !== 'success' && palmState.status !== 'error') {
    return (
      <div className="p-8 animate-in fade-in duration-700 space-y-8 min-h-[80vh] flex flex-col justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-pink-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-5xl zen-shadow border border-pink-100">✋</div>
          <h2 className="text-3xl font-black sinhala text-gray-800">අත්ල සාස්තර</h2>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">Palm Analysis AI</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-gray-50 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-none">1</div>
            <p className="sinhala text-sm text-gray-600 leading-relaxed">
              පුරුෂ පාර්ශවය සඳහා: ඔබේ දකුණු අත (Right Hand) භාවිතා කරන්න.
            </p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-none">2</div>
            <p className="sinhala text-sm text-gray-600 leading-relaxed">
              ස්ත්‍රී පාර්ශවය සඳහා: ඔබේ වම් අත (Left Hand) භාවිතා කරන්න.
            </p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-none">3</div>
            <p className="sinhala text-sm text-gray-600 leading-relaxed">හොඳින් ආලෝකය ඇති ස්ථානයක අත්ල සමතලව තබන්න.</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-center sinhala font-bold text-xs">{error}</p>}

        <button 
          onClick={startCamera}
          className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-green-100 active:scale-95 transition-all sinhala text-lg"
        >
          කැමරාව ක්‍රියාත්මක කරන්න
        </button>
      </div>
    );
  }

  if (step === 'camera') {
    return (
      <div className="fixed inset-0 bg-black z-[60] flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <svg width="240" height="360" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="1">
              <path d="M50 140 C20 140, 10 110, 10 80 C10 60, 15 30, 20 10 L30 15 L40 5 L50 20 L60 5 L70 15 L80 10 C85 30, 90 60, 90 80 C90 110, 80 140, 50 140" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex justify-center px-8">
            <button 
              onClick={takePhoto}
              className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 bg-white rounded-full" />
            </button>
          </div>

          <button 
            onClick={() => {
              const stream = videoRef.current?.srcObject as MediaStream;
              stream?.getTracks().forEach(track => track.stop());
              setStep('instruction');
            }}
            className="absolute top-8 left-8 text-white text-4xl"
          >
            ✕
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (palmState.status === 'error') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-4xl zen-shadow border border-red-100">⚠️</div>
        <div className="space-y-2">
          <h2 className="sinhala font-black text-gray-800 text-xl">දත්ත ලබා ගත නොහැක</h2>
          <p className="sinhala text-sm text-gray-500 leading-relaxed px-4">{palmState.errorMessage}</p>
        </div>
        <button 
          onClick={() => {
            setPalmState({ status: 'idle', result: null, errorMessage: null });
            setStep('instruction');
          }}
          className="w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all sinhala text-lg"
        >
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    );
  }

  if (palmState.status === 'success' && palmState.result) {
    const result = palmState.result;
    return (
      <div className="p-6 pb-24 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <header className="text-center pt-4">
          <h2 className="text-3xl font-black sinhala text-gray-800">අත්ල සාස්තර වාර්තාව</h2>
          <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mt-1">Professional Palm Synthesis</p>
        </header>

        {/* Archetype Hero Card */}
        <div className="bg-[linear-gradient(135deg,_#fffaf0_0%,_#fff7ed_38%,_#fef3c7_100%)] p-8 rounded-[3rem] space-y-3 shadow-2xl border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-7xl opacity-30">✨</div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_48%)] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Hand Archetype</p>
            <h3 className="sinhala text-3xl font-black text-slate-900 leading-tight">{result.archetype}</h3>
            <p className="sinhala text-sm text-slate-700 mt-3 leading-relaxed">ස්වභාවය: {result.handShape}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Main Lines Analysis */}
          <div className="bg-white p-8 rounded-[3rem] zen-shadow border border-white space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl flex-none">❤️</div>
                <div>
                  <h4 className="sinhala font-black text-gray-800 text-lg">හෘදය රේඛාව (Heart Line)</h4>
                  <p className="sinhala text-gray-600 text-sm leading-relaxed mt-1">{result.heartLineDetail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl flex-none">🧠</div>
                <div>
                  <h4 className="sinhala font-black text-gray-800 text-lg">ශීර්ෂ රේඛාව (Head Line)</h4>
                  <p className="sinhala text-gray-600 text-sm leading-relaxed mt-1">{result.headLineDetail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl flex-none">💪</div>
                <div>
                  <h4 className="sinhala font-black text-gray-800 text-lg">ජීවන රේඛාව (Life Line)</h4>
                  <p className="sinhala text-gray-600 text-sm leading-relaxed mt-1">{result.lifeLineDetail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl flex-none">🚀</div>
                <div>
                  <h4 className="sinhala font-black text-gray-800 text-lg">දෛව රේඛාව (Fate Line)</h4>
                  <p className="sinhala text-gray-600 text-sm leading-relaxed mt-1">{result.fateLineDetail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Markings & Mounts */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-white">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🔍</span>
                <h4 className="sinhala font-black text-gray-800 text-lg">විශේෂ සලකුණු</h4>
              </div>
              <p className="sinhala text-sm text-gray-600 leading-relaxed italic">{result.specialMarkings}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] zen-shadow border border-white">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🏔️</span>
                <h4 className="sinhala font-black text-gray-800 text-lg">ග්‍රහ මණ්ඩල විශ්ලේෂණය</h4>
              </div>
              <p className="sinhala text-sm text-gray-600 leading-relaxed">{result.mountsAnalysis}</p>
            </div>
          </div>

          {/* Synthesis / Advice */}
          <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl animate-pulse">✨</span>
              <h4 className="sinhala font-black text-orange-900 text-xl tracking-tight">සාරාංශය සහ මඟ පෙන්වීම</h4>
            </div>
            <p className="sinhala text-base text-orange-800 leading-relaxed font-medium">
              {result.synthesisAdvice}
            </p>
          </div>
        </div>

        <div className="text-center space-y-6 pt-4">
          <p className="text-[10px] text-gray-400 font-bold sinhala leading-relaxed px-4 opacity-60">
            * අත්ල සාස්තරය යනු චරිත ලක්ෂණ සහ විභවයන් හඳුනා ගැනීමේ මෙවලමක් වන අතර එය නිශ්චිත වෛද්‍ය හෝ මූල්‍ය අනාවැකියක් ලෙස නොසලකන්න.
          </p>
          
          <button 
            onClick={() => {
              setPalmState({ status: 'idle', result: null, errorMessage: null });
              setStep('instruction');
            }}
            className="w-full py-5 bg-white border border-gray-100 rounded-[1.5rem] font-black text-gray-500 hover:text-green-600 transition-colors sinhala text-lg zen-shadow active:scale-95"
          >
            නැවත පරීක්ෂා කරන්න
          </button>
        </div>
      <DetailedReportCTA />
      </div>
    );
  }

  return null;
};

export default PalmAnalysis;
