import React, { useState, useEffect, createContext, useContext } from 'react';
import Onboarding from '../components/Onboarding';
import Dashboard from '../components/Dashboard';
import Matching from '../components/Matching';
import Dreams from '../components/Dreams';
import PalmAnalysis from '../components/PalmAnalysis';
import VastuGuidance from '../components/VastuGuidance';
import BabyNaming from '../components/BabyNaming';
import Nekath from '../components/Nekath';
import AvuruduNekath from '../components/AvuruduNekath';
import Gemstones from '../components/Gemstones';
import TraditionalOmens from '../components/TraditionalOmens';
import Remedies from '../components/Remedies';
import RahuKalaya from '../components/RahuKalaya';
import PastLifePath from '../components/PastLifePath';
import PirithSection from '../components/PirithSection';
import LawOfAttraction from '../components/LawOfAttraction';
import Navigation from '../components/Navigation';
import GlobalLoader from '../components/GlobalLoader';
import NotificationSettings from '../components/NotificationSettings';
import { calculateAstrologyDetails } from './services/astrology-calculator';
import { UserProfile, PalmAnalysisState, VastuAnalysisState, MatchingState, OmenAnalysisState, BabyNamingState } from './types';

interface LoadingContextType {
  setIsGlobalLoading: (isLoading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  setIsGlobalLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

const RASHI_DISPLAY_MAP: Record<string, string> = {
  'Aries': 'මේෂ (Aries)',
  'Taurus': 'වෘෂභ (Taurus)',
  'Gemini': 'මිථුන (Gemini)',
  'Cancer': 'කටක (Cancer)',
  'Leo': 'සිහින් (Leo)',
  'Virgo': 'කන්යා (Virgo)',
  'Libra': 'තුලා (Libra)',
  'Scorpio': 'වෘශ්චික (Scorpio)',
  'Sagittarius': 'ධනු (Sagittarius)',
  'Capricorn': 'මකර (Capricorn)',
  'Aquarius': 'කුම්භ (Aquarius)',
  'Pisces': 'මීන (Pisces)',
};

const RASHI_LORD_MAP: Record<string, string> = {
  Aries: 'කුජ',
  Taurus: 'ශුක්‍ර',
  Gemini: 'බුධ',
  Cancer: 'චන්ද්‍ර',
  Leo: 'රවි',
  Virgo: 'බුධ',
  Libra: 'ශුක්‍ර',
  Scorpio: 'කුජ',
  Sagittarius: 'ගුරු',
  Capricorn: 'ශනි',
  Aquarius: 'ශනි',
  Pisces: 'ගුරු',
};

const NAKSHATRA_GANA_MAP: Record<string, string> = {
  'අස්විද': 'දේව ගණය',
  'බෙරණ': 'මනුෂ්‍ය ගණය',
  'කැති': 'රාක්ෂස ගණය',
  'රෙහෙණ': 'මනුෂ්‍ය ගණය',
  'මුවසිරස': 'දේව ගණය',
  'අද': 'මනුෂ්‍ය ගණය',
  'පුනාවස': 'දේව ගණය',
  'පුෂ': 'දේව ගණය',
  'අස්ලිස': 'රාක්ෂස ගණය',
  'මා': 'රාක්ෂස ගණය',
  'පුවපල්': 'මනුෂ්‍ය ගණය',
  'උත්පල්': 'මනුෂ්‍ය ගණය',
  'හත': 'දේව ගණය',
  'සිත': 'රාක්ෂස ගණය',
  'සා': 'දේව ගණය',
  'විසා': 'රාක්ෂස ගණය',
  'අනුර': 'දේව ගණය',
  'දෙට': 'රාක්ෂස ගණය',
  'මුල': 'රාක්ෂස ගණය',
  'පුවසල': 'මනුෂ්‍ය ගණය',
  'උත්සල': 'මනුෂ්‍ය ගණය',
  'සුවණ': 'දේව ගණය',
  'දෙනට': 'රාක්ෂස ගණය',
  'සියාවස': 'රාක්ෂස ගණය',
  'පුවපුටුප': 'මනුෂ්‍ය ගණය',
  'උත්පුටුප': 'මනුෂ්‍ය ගණය',
  'රේවතී': 'දේව ගණය',
};

const enrichProfileAstrology = (profile: UserProfile): UserProfile => {
  const hasFullAstro =
    !!profile.nekatha &&
    !!profile.lagnaAdhipathi &&
    !!profile.janmaRashiya &&
    !!profile.rashyadhipathi &&
    !!profile.nekathPadaya &&
    !!profile.gana;

  if (hasFullAstro || !profile.dob || !profile.birthTime) {
    return profile;
  }

  const derived = calculateAstrologyDetails(profile.dob, profile.birthTime);
  const effectiveRashi = profile.rashi || derived.rashi || 'Aries';
  const effectiveNekatha = profile.nekatha || derived.nekatha || 'අස්විද';

  return {
    ...profile,
    rashi: effectiveRashi,
    nekatha: effectiveNekatha,
    lagnaAdhipathi: profile.lagnaAdhipathi || RASHI_LORD_MAP[effectiveRashi] || 'කුජ',
    janmaRashiya: profile.janmaRashiya || RASHI_DISPLAY_MAP[effectiveRashi] || effectiveRashi,
    rashyadhipathi: profile.rashyadhipathi || RASHI_LORD_MAP[effectiveRashi] || 'කුජ',
    nekathPadaya: profile.nekathPadaya || `${derived.pada} වන පාදය`,
    gana: profile.gana || NAKSHATRA_GANA_MAP[effectiveNekatha] || 'දේව ගණය',
  };
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [palmState, setPalmState] = useState<PalmAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [vastuState, setVastuState] = useState<VastuAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [matchingState, setMatchingState] = useState<MatchingState>({ status: 'idle', result: null, errorMessage: null });
  const [omenState, setOmenState] = useState<OmenAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [babyNamingState, setBabyNamingState] = useState<BabyNamingState>({ status: 'idle', result: null, errorMessage: null });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kendara_profile');
    if (saved) {
      const parsedProfile = JSON.parse(saved);
      const enrichedProfile = enrichProfileAstrology(parsedProfile);
      setProfile(enrichedProfile);
      localStorage.setItem('kendara_profile', JSON.stringify(enrichedProfile));
    }
    
    const savedPalm = localStorage.getItem('palm_state');
    if (savedPalm) setPalmState(JSON.parse(savedPalm));

    const savedVastu = localStorage.getItem('vastu_state');
    if (savedVastu) setVastuState(JSON.parse(savedVastu));

    const savedMatching = localStorage.getItem('matching_state');
    if (savedMatching) {
      const parsedMatching = JSON.parse(savedMatching);
      const hasModernPorondamTable = parsedMatching?.result?.table && parsedMatching.result.table.length >= 20;
      if (parsedMatching?.status !== 'success' || hasModernPorondamTable) {
        setMatchingState(parsedMatching);
      } else {
        localStorage.removeItem('matching_state');
      }
    }

    const savedOmen = localStorage.getItem('omen_state');
    if (savedOmen) setOmenState(JSON.parse(savedOmen));

    const savedBabyNaming = localStorage.getItem('baby_naming_state');
    if (savedBabyNaming) setBabyNamingState(JSON.parse(savedBabyNaming));

    setTimeout(() => setShowSplash(false), 2500);
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const enrichedProfile = enrichProfileAstrology(newProfile);
    setProfile(enrichedProfile);
    localStorage.setItem('kendara_profile', JSON.stringify(enrichedProfile));
  };

  const startPalmAnalysis = async (base64Image: string) => {
    if (!profile) return;
    setPalmState({ status: 'analyzing', result: null, errorMessage: null });
    try {
      const { analyzePalm } = await import('./services/geminiService');
      const res = await analyzePalm(base64Image, profile.gender);
      const newState: PalmAnalysisState = { status: 'success', result: res, errorMessage: null };
      setPalmState(newState);
      localStorage.setItem('palm_state', JSON.stringify(newState));
    } catch (err: any) {
      setPalmState({ status: 'error', result: null, errorMessage: "සේවාදායකය මේ වන විට කාර්යබහුලයි. පසුව උත්සාහ කරන්න." });
    }
  };

  const startVastuAnalysis = async (formData: any, floorPlan?: { data: string, mimeType: string }) => {
    if (!profile) return;
    setVastuState({ status: 'analyzing', result: null, errorMessage: null });
    try {
      const { getPersonalizedVastuAnalysis } = await import('./services/geminiService');
      const res = await getPersonalizedVastuAnalysis(profile, formData, floorPlan);
      const newState: VastuAnalysisState = { status: 'success', result: res, errorMessage: null };
      setVastuState(newState);
      localStorage.setItem('vastu_state', JSON.stringify(newState));
    } catch (err: any) {
      setVastuState({ status: 'error', result: null, errorMessage: err.message || "විශ්ලේෂණය අසාර්ථක විය." });
    }
  };

  const startMatchingAnalysis = async (partner: any) => {
    if (!profile) return;
    setMatchingState({ status: 'analyzing', result: null, errorMessage: null });
    try {
      // 1. Fast local deterministic calculation
      const { calculatePorondam } = await import('./services/porondam-engine');
      const localResult = calculatePorondam(profile, partner);
      
      const newState: MatchingState = { status: 'success', result: localResult, errorMessage: null };
      setMatchingState(newState);
      localStorage.setItem('matching_state', JSON.stringify(newState));

      // 2. Optional Gemini enhancement in background
      try {
        const { enhancePorondamWithGemini } = await import('./services/geminiService');
        enhancePorondamWithGemini(profile, partner, localResult).then(enhancedRes => {
          if (enhancedRes) {
            const enhancedState: MatchingState = { status: 'success', result: enhancedRes, errorMessage: null };
            setMatchingState(enhancedState);
            localStorage.setItem('matching_state', JSON.stringify(enhancedState));
          }
        }).catch(e => console.warn("Gemini enhancement failed, keeping local result", e));
      } catch (e) {
        console.warn("Could not load Gemini enhancer", e);
      }
      
    } catch (err: any) {
      setMatchingState({ status: 'error', result: null, errorMessage: err.message || "ගැලපීම පරීක්ෂා කිරීම අසාර්ථක විය." });
    }
  };

  const startOmenAnalysis = async (type: 'birthmark' | 'lizard', input: string) => {
    setOmenState({ status: 'analyzing', result: null, errorMessage: null });
    try {
      const { analyzeTraditionalOmen } = await import('./services/geminiService');
      const res = await analyzeTraditionalOmen(type, input);
      const newState: OmenAnalysisState = { status: 'success', result: res, errorMessage: null };
      setOmenState(newState);
      localStorage.setItem('omen_state', JSON.stringify(newState));
    } catch (err: any) {
      setOmenState({ status: 'error', result: null, errorMessage: err.message || "නිමිති පරීක්ෂාව අසාර්ථක විය." });
    }
  };

  const startBabyNamingAnalysis = async (details: { dob: string, time: string, city: string, gender: string }) => {
    setBabyNamingState({ status: 'analyzing', result: null, errorMessage: null });
    try {
      const { getBabyNames } = await import('./services/geminiService');
      const res = await getBabyNames(details);
      const newState: BabyNamingState = { status: 'success', result: res, errorMessage: null };
      setBabyNamingState(newState);
      localStorage.setItem('baby_naming_state', JSON.stringify(newState));
    } catch (err: any) {
      setBabyNamingState({ status: 'error', result: null, errorMessage: err.message || "නම් පරීක්ෂාව අසාර්ථක විය." });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wishwaya AI',
          text: 'Check out my cosmic profile on Wishwaya AI!',
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert('Sharing is not supported on this device.');
    }
  };

  const getRashiText = (rashi?: string) => {
    if (!rashi) return 'දැනට නැත';
    return RASHI_DISPLAY_MAP[rashi] || rashi;
  };

  const performLogout = () => {
    localStorage.clear();
    setProfile(null);
    setActiveTab('dashboard');
    setPalmState({ status: 'idle', result: null, errorMessage: null });
    setVastuState({ status: 'idle', result: null, errorMessage: null });
    setMatchingState({ status: 'idle', result: null, errorMessage: null });
    setOmenState({ status: 'idle', result: null, errorMessage: null });
    setBabyNamingState({ status: 'idle', result: null, errorMessage: null });
    setShowLogoutConfirm(false);
  };

  if (showSplash) return <GlobalLoader />; 

  return (
    <LoadingContext.Provider value={{ setIsGlobalLoading }}>
      {isGlobalLoading && <GlobalLoader />}
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="flex justify-center bg-gray-100 min-h-screen">
          <div className="w-full max-w-md bg-[#F9FBFA] min-h-screen relative shadow-2xl flex flex-col border-x border-gray-100">
            
            {palmState.status === 'analyzing' && activeTab !== 'palm' && (
              <div 
                onClick={() => setActiveTab('palm')}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-[340px] bg-white/90 backdrop-blur-md p-4 rounded-2xl zen-shadow border border-pink-100 flex items-center space-x-4 cursor-pointer animate-in slide-in-from-top-4 duration-500"
              >
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-xl animate-pulse">✋</div>
                <div className="flex-1">
                  <p className="sinhala text-[11px] font-black text-gray-800 leading-tight">අත්ල සාස්තරය සකසමින් පවතී...</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Analyzing palm in background</p>
                </div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
              </div>
            )}

            {vastuState.status === 'analyzing' && activeTab !== 'vastu' && (
              <div 
                onClick={() => setActiveTab('vastu')}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-[340px] bg-white/90 backdrop-blur-md p-4 rounded-2xl zen-shadow border border-emerald-100 flex items-center space-x-4 cursor-pointer animate-in slide-in-from-top-4 duration-500"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-xl animate-pulse">🧭</div>
                <div className="flex-1">
                  <p className="sinhala text-[11px] font-black text-gray-800 leading-tight">වාස්තු විද්‍යාව විශ්ලේෂණය කරයි...</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Analyzing Vastu in background</p>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
            )}

            {babyNamingState.status === 'analyzing' && activeTab !== 'baby-naming' && (
              <div 
                onClick={() => setActiveTab('baby-naming')}
                className="fixed top-40 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-[340px] bg-white/90 backdrop-blur-md p-4 rounded-2xl zen-shadow border border-blue-100 flex items-center space-x-4 cursor-pointer animate-in slide-in-from-top-4 duration-500"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl animate-pulse">👶</div>
                <div className="flex-1">
                  <p className="sinhala text-[11px] font-black text-gray-800 leading-tight">නම් තැබීම පරීක්ෂා කරමින් පවතී...</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Finding baby names in background</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            )}

            {matchingState.status === 'analyzing' && activeTab !== 'matching' && (
              <div 
                onClick={() => setActiveTab('matching')}
                className="fixed top-[220px] left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-[340px] bg-white/90 backdrop-blur-md p-4 rounded-2xl zen-shadow border border-pink-100 flex items-center space-x-4 cursor-pointer animate-in slide-in-from-top-4 duration-500"
              >
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-xl animate-pulse">💑</div>
                <div className="flex-1">
                  <p className="sinhala text-[11px] font-black text-gray-800 leading-tight">පොරොන්දම් ගැලපීම පරීක්ෂා කරයි...</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Matching Porondam in background</p>
                </div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
              </div>
            )}

            {omenState.status === 'analyzing' && activeTab !== 'omens' && (
              <div 
                onClick={() => setActiveTab('omens')}
                className="fixed top-[280px] left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-[340px] bg-white/90 backdrop-blur-md p-4 rounded-2xl zen-shadow border border-indigo-100 flex items-center space-x-4 cursor-pointer animate-in slide-in-from-top-4 duration-500"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-xl animate-pulse">🧿</div>
                <div className="flex-1">
                  <p className="sinhala text-[11px] font-black text-gray-800 leading-tight">නිමිති පරීක්ෂා කරමින් පවතී...</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Analyzing Omens in background</p>
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
              </div>
            )}

            <main className="flex-1 overflow-y-auto pb-32 scroll-smooth no-scrollbar">
              {activeTab === 'dashboard' && <Dashboard profile={profile} onNavigate={setActiveTab} />}
              {activeTab === 'matching' && (
                <Matching 
                  userProfile={profile} 
                  matchingState={matchingState}
                  setMatchingState={setMatchingState}
                  onStartAnalysis={startMatchingAnalysis}
                />
              )}
              {activeTab === 'baby-naming' && (
                <BabyNaming 
                  babyNamingState={babyNamingState}
                  setBabyNamingState={setBabyNamingState}
                  onStartAnalysis={startBabyNamingAnalysis}
                />
              )}
              {activeTab === 'dreams' && <Dreams />}
              {activeTab === 'palm' && (
                <PalmAnalysis 
                  gender={profile.gender} 
                  palmState={palmState} 
                  setPalmState={setPalmState}
                  onStartAnalysis={startPalmAnalysis}
                />
              )}
              {activeTab === 'vastu' && (
                <VastuGuidance 
                  profile={profile} 
                  vastuState={vastuState}
                  setVastuState={setVastuState}
                  onStartAnalysis={startVastuAnalysis}
                />
              )}
              {activeTab === 'nekath' && <Nekath profile={profile} />}
              {activeTab === 'avurudu' && <AvuruduNekath />}
              {activeTab === 'gems' && <Gemstones profile={profile} />}
              {activeTab === 'omens' && (
                <TraditionalOmens 
                  omenState={omenState}
                  setOmenState={setOmenState}
                  onStartAnalysis={startOmenAnalysis}
                />
              )}
              {activeTab === 'rahu' && <RahuKalaya />}
              {activeTab === 'remedies' && <Remedies profile={profile} />}
              {activeTab === 'loa' && <LawOfAttraction profile={profile} />}
              {activeTab === 'pastlife' && <PastLifePath profile={profile} />}
              {activeTab === 'profile' && (
                <div className="animate-in slide-in-from-bottom-8 duration-700">
                  {/* Hero Header with Video Background */}
                  <div className="relative h-72 flex flex-col items-center justify-center text-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.28),_transparent_38%),linear-gradient(180deg,_#f6fff7_0%,_#eefbf2_48%,_#F9FBFA_100%)]">
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-200 blur-3xl" />
                      <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-lime-100 blur-2xl" />
                      <div className="absolute right-6 top-16 h-20 w-20 rounded-full bg-green-100 blur-2xl" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#F9FBFA]"></div>
                    
                    <div className="relative z-10 space-y-3 pt-4 pb-10">
                      <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-32 h-32 bg-white/90 backdrop-blur-sm rounded-[2.5rem] mx-auto zen-shadow flex items-center justify-center text-5xl border-4 border-white shadow-inner relative z-10 overflow-hidden">
                           {profile.gender === 'female' ? '👩' : '👨'}
                        </div>
                      </div>
                      
                      <div className="px-6 pt-1 pb-3">
                        <h2 className="text-[30px] leading-tight font-black sinhala text-gray-800 drop-shadow-sm">{profile.name}</h2>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Personal Cosmic Portal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-8 space-y-8 pb-12">
                    <div className="bg-white p-10 rounded-[4rem] zen-shadow border border-white shadow-xl text-left space-y-8 mt-[-1.5rem] relative z-20 overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 text-9xl opacity-[0.02] pointer-events-none">✨</div>
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] sinhala ml-1">නම</span>
                        <p className="font-black text-gray-800 text-2xl tracking-tight">{profile.name}</p>
                      </div>
                      
                      <div className="h-px bg-gray-100/60 w-full" />
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] sinhala ml-1">උපන් දිනය සහ ස්ථානය</span>
                        <p className="font-black text-gray-700 text-base">{profile.dob} • {profile.city}</p>
                      </div>
                      
                      <div className="h-px bg-gray-100/60 w-full" />
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] sinhala ml-1">ලග්නය</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                          <p className="sinhala font-black text-green-600 text-3xl tracking-tight">{getRashiText(profile.rashi)}</p>
                        </div>
                      </div>

                      {/* Astrological Data Grid - Enhanced Visuals */}
                      <div className="bg-white p-8 rounded-[3rem] border border-gray-200 shadow-inner shadow-gray-100/80 grid grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">නැකත</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.nekatha || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">ලග්නාධිපති</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.lagnaAdhipathi || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">ජන්ම රාශිය</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.janmaRashiya || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">රාශ්‍යාධිපති</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.rashyadhipathi || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">නැකත් පාදය</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.nekathPadaya || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest sinhala">ගණය</span>
                          <p className="sinhala font-black text-gray-900 text-[17px] leading-tight">{profile.gana || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <PirithSection profile={profile} />

                    <div className="pt-8 space-y-10 pb-16 px-6 bg-white/60 backdrop-blur-md rounded-[3.5rem] mt-8 border border-white shadow-sm">
                      <NotificationSettings 
                        profile={profile} 
                        onUpdateProfile={handleOnboardingComplete} 
                      />

                      <div className="space-y-6">
                        <button 
                          onClick={() => setShowLogoutConfirm(true)}
                          className="w-full py-5 rounded-2xl bg-white border border-red-100 text-red-500 font-bold text-sm sinhala hover:bg-red-50 transition-all uppercase tracking-widest shadow-sm active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <span>🚪</span>
                          <span>ගිණුමෙන් ඉවත් වන්න</span>
                        </button>
                        
                        <div className="bg-gray-50/80 p-6 rounded-[2.5rem] border border-gray-100 text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 text-2xl opacity-10">⚖️</div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Disclaimer</p>
                          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            Wishwaya provides AI-generated astrological insights for entertainment and informational purposes only. It does not provide medical, financial, or legal advice.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-12 h-1 bg-gray-200/50 rounded-full"></div>
                        
                        <div className="text-center space-y-3">
                          <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
                            © 2026 Wishwaya AI Premium • ශ්රී ලංකා
                          </p>
                          
                          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
                            <button onClick={handleShare} className="sinhala text-[10px] text-gray-500 font-bold hover:text-green-600 transition-colors border-b border-gray-200 pb-0.5">යෙදුම බෙදා ගන්න</button>
                            <a href="https://impulsedigitallab.com/wishwaya-privacy/" target="_blank" rel="noopener noreferrer" className="sinhala text-[10px] text-gray-500 font-bold hover:text-green-600 transition-colors border-b border-gray-200 pb-0.5">පෞද්ගලිකත්ව ප්රතිපත්තිය</a>
                            <a href="https://impulsedigitallab.com/wishwaya-terms/" target="_blank" rel="noopener noreferrer" className="sinhala text-[10px] text-gray-500 font-bold hover:text-green-600 transition-colors border-b border-gray-200 pb-0.5">භාවිත කිරීමේ කොන්දේසි</a>
                            <a href="https://impulsedigitallab.com/impulsedigitallab-com-wishwaya-contact/" target="_blank" rel="noopener noreferrer" className="sinhala text-[10px] text-gray-500 font-bold hover:text-green-600 transition-colors border-b border-gray-200 pb-0.5">අපව අමතන්න</a>
                          </div>
                          
                          <div className="pt-4 flex flex-col items-center space-y-1">
                            <p className="sinhala text-[10px] text-gray-400 font-bold opacity-60">සංස්කරණය v1.0.0</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Powered by Impulse Digital Lab</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="w-full max-w-[320px] bg-white rounded-[2.5rem] p-8 zen-shadow border border-gray-100 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">👋</div>
                  <div className="space-y-1">
                    <h3 className="sinhala text-xl font-black text-gray-800">ඉවත් වීමට අවශ්‍යද?</h3>
                    <p className="sinhala text-xs text-gray-500 leading-relaxed">ඔබේ ගිණුමෙන් ඉවත් වීමට ඔබට විශ්වාසද? නැවත ඇතුළු වීමට ඔබේ තොරතුරු අවශ්‍ය වනු ඇත.</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={performLogout}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black sinhala text-sm shadow-lg shadow-red-100 active:scale-95 transition-all"
                  >
                    ඔව්, ඉවත් වන්න
                  </button>
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black sinhala text-sm active:scale-95 transition-all"
                  >
                    නැත, රැඳී සිටින්න
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export default App;
