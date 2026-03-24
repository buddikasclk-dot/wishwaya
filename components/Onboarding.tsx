
import React, { useState, useRef } from 'react';
import { UserProfile } from '../src/types';
import { analyzeRashiChakra, calculateRashiFromDetails } from '../services/geminiService';
import { useLoading } from '../src/App';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setIsGlobalLoading } = useLoading();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'male',
    dob: '',
    birthTime: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [scannedRashi, setScannedRashi] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setIsGlobalLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const detectedRashi = await analyzeRashiChakra(base64);
        setScannedRashi(detectedRashi);
      } catch (error) {
        console.error("Scan failed", error);
      } finally {
        setLoading(false);
        setIsGlobalLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name || !profile.dob || !profile.city || !profile.birthTime) return;
    
    setLoading(true);
    setIsGlobalLoading(true);
    try {
      const calculations = await calculateRashiFromDetails(profile.dob, profile.birthTime, profile.city);
      const calculatedRashi = calculations.rashi || "Aries";
      
      let finalNotice = "";
      const normalizedScanned = scannedRashi?.trim().toLowerCase();
      const normalizedCalculated = calculatedRashi?.trim().toLowerCase();

      if (scannedRashi && scannedRashi !== "Unknown" && normalizedScanned !== normalizedCalculated) {
        finalNotice = "උපන් වේලාව සහ පින්තූරය අතර නොගැලපීමක් පවතී. ඇතුළත් කළ දත්ත අනුව කේන්දරය සකස් කරන ලදී. (Data mismatched with image, user details used.)";
      }

      onComplete({
        ...profile,
        ...calculations,
        mismatchNotice: finalNotice
      });
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
      setIsGlobalLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#F9FBFA] animate-in fade-in duration-1000">
      <div className="w-full max-w-md bg-white rounded-[3.5rem] p-10 zen-shadow border border-white relative overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-44 h-44 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.28),_transparent_38%),linear-gradient(180deg,_#ffffff_0%,_#eefbf2_100%)] border border-green-100 shadow-inner">
            <img
              src="/logo-512.png"
              alt="Wishwaya logo"
              className="h-28 w-28 object-contain opacity-90 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">WISHWAYA</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest sinhala opacity-70">විශ්වය - ඔබේ විස්තර ඇතුළත් කරන්න</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em] sinhala">සම්පූර්ණ නම (Full Name)</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs placeholder:text-[11px] font-medium"
              placeholder="නම මෙහි ඇතුළත් කරන්න"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em] sinhala">ස්ත්‍රී/පුරුෂ</label>
              <select
                name="gender"
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium sinhala appearance-none cursor-pointer"
                value={profile.gender}
                onChange={handleInputChange}
              >
                <option value="male">පුරුෂ</option>
                <option value="female">ස්ත්‍රී</option>
                <option value="other">වෙනත්</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em] sinhala">නගරය</label>
              <input
                type="text"
                name="city"
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs placeholder:text-[11px] font-medium sinhala"
                placeholder="උපන් ස්ථානය"
                value={profile.city}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em] sinhala">උපන් දිනය</label>
              <input
                type="date"
                name="dob"
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs"
                value={profile.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em] sinhala">වේලාව</label>
              <input
                type="time"
                name="birthTime"
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs"
                value={profile.birthTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-xs transition-all flex items-center justify-center space-x-3 border-2 shadow-sm active:scale-[0.98] ${
                scannedRashi 
                  ? 'bg-green-50 text-green-600 border-green-200' 
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
              }`}
            >
              <span className="sinhala tracking-wider">
                {loading ? 'සකසමින්...' : scannedRashi ? `ලග්නය: ${scannedRashi}` : 'කේන්දර පත ස්කෑන් කරන්න (අත්‍යවශ්‍ය නොවේ)'}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleScan}
            />

            <button
              type="submit"
              disabled={loading || !profile.name || !profile.dob}
              className="w-full py-6 bg-green-600 text-white rounded-[1.5rem] font-black shadow-[0_20px_40px_-10px_rgba(22,163,74,0.3)] hover:bg-green-700 hover:shadow-green-200 transition-all sinhala text-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.97]"
            >
              {loading ? 'විශ්ලේෂණය කරමින්...' : 'ඉදිරියට යන්න'}
            </button>
          </div>
        </form>
      </div>
      <p className="mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Wishwaya - Built for the modern seeker</p>
    </div>
  );
};

export default Onboarding;
