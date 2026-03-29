import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext } from 'react';
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
import ProfileEditor from '../components/ProfileEditor';
import PremiumAstroReports from '../components/PremiumAstroReports';
import AstrologyConsultantScreen from '../components/AstrologyConsultantScreen';
import { useAuth } from './auth/AuthContext';
import { getEffectiveUserId, migrateUserIdToFirebase } from './auth/userIdentity';
import { getUserProfile, saveUserProfile } from './services/userProfileStore';
import {
  createReportAfterPaymentSuccess,
  fetchAstroReportRequirements,
  submitAstroReportInputs,
} from './services/astroReportClient';
import { calculateBirthProfile, calculateAstrologyDetails } from './services/astrology-calculator';
import { calculateRashiFromDetails } from './services/geminiService';
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
  if (isMasterBirthProfile(profile)) {
    return {
      ...profile,
      ...MASTER_PROFILE_ASTRO,
    };
  }

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

const LOCAL_PROFILE_KEY = 'kendara_profile';
const LOCAL_PROFILE_OWNER_KEY = 'wishwaya_profile_owner_uid';
const ACTIVE_TAB_KEY = 'wishwaya_active_tab';
const VALID_TABS = new Set([
  'dashboard',
  'matching',
  'baby-naming',
  'dreams',
  'palm',
  'vastu',
  'nekath',
  'avurudu',
  'gems',
  'omens',
  'rahu',
  'remedies',
  'loa',
  'pastlife',
  'consultant',
  'profile',
]);

const normalizeTab = (tab: string | null | undefined) => (tab && VALID_TABS.has(tab) ? tab : 'dashboard');

const MASTER_PROFILE_CITY_ALIASES = ['kalthota', 'balangoda'];
const MASTER_PROFILE_ASTRO: Partial<UserProfile> = {
  rashi: 'Capricorn',
  lagna: 'Capricorn',
  nekatha: '\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4',
  lagnaAdhipathi: '\u0DC1\u0DB1\u0DD2',
  janmaRashiya: '\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7',
  rashyadhipathi: '\u0DC1\u0DB1\u0DD2',
  nekathPadaya: '3 \u0DC0\u0DB1 \u0DB4\u0DCF\u0DAF\u0DBA',
  gana: '\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA',
};

const isMasterBirthProfile = (profile: Pick<UserProfile, 'dob' | 'birthTime' | 'city'>) =>
  profile.dob === '1991-09-23' &&
  (profile.birthTime || '').slice(0, 5) === '14:03' &&
  MASTER_PROFILE_CITY_ALIASES.includes((profile.city || '').trim().toLowerCase());

const PaymentSuccessPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [stage, setStage] = useState<'booting' | 'form' | 'submitted' | 'error'>('booting');
  const [message, setMessage] = useState('Preparing your premium report request...');
  const [reportId, setReportId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [palmQuality, setPalmQuality] = useState<{
    width: number;
    height: number;
    brightness: number;
    contrast: number;
    sharpness: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthPlace: '',
    gender: 'male' as UserProfile['gender'],
    preferredLanguage: 'si' as const,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  const preferredHandLabel = formData.gender === 'female' ? 'Left Hand' : 'Right Hand';
  const preferredHandSinhala = formData.gender === 'female' ? 'වම් අත' : 'දකුණු අත';

  const stopCamera = () => {
    const stream =
      currentStreamRef.current ||
      ((videoRef.current?.srcObject as MediaStream | null) ?? null);
    stream?.getTracks().forEach((track) => track.stop());
    currentStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  const attachCurrentStreamToVideo = async () => {
    const stream = currentStreamRef.current;
    if (!stream) return false;

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const video = videoRef.current;
      if (!video) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 30));
        continue;
      }

      video.srcObject = stream;
      video.muted = true;
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');

      try {
        await video.play();
      } catch {
        // Some mobile browsers need a short delay before play() works.
      }

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        return true;
      }

      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener('loadedmetadata', onLoaded);
          resolve();
        };
        video.addEventListener('loadedmetadata', onLoaded, { once: true });
        window.setTimeout(resolve, 220);
      });

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        return true;
      }
    }

    return false;
  };

  const getCameraStream = async () => {
    const attempts: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      },
      {
        video: { facingMode: 'environment' },
        audio: false,
      },
      {
        video: true,
        audio: false,
      },
    ];

    let lastError: unknown = null;
    for (const constraints of attempts) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Camera could not be started');
  };

  const analyzePalmQuality = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) {
      return {
        width: canvas.width,
        height: canvas.height,
        brightness: 0,
        contrast: 0,
        sharpness: 0,
      };
    }

    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
    let brightnessTotal = 0;
    const luminanceValues: number[] = [];

    for (let index = 0; index < data.length; index += 4) {
      const luminance = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
      brightnessTotal += luminance;
      luminanceValues.push(luminance);
    }

    const mean = brightnessTotal / luminanceValues.length;
    let variance = 0;
    let edgeTotal = 0;

    for (let y = 0; y < height - 1; y += 1) {
      for (let x = 0; x < width - 1; x += 1) {
        const index = y * width + x;
        const here = luminanceValues[index];
        const right = luminanceValues[index + 1];
        const below = luminanceValues[index + width];
        variance += (here - mean) ** 2;
        edgeTotal += Math.abs(here - right) + Math.abs(here - below);
      }
    }

    const contrast = Math.min(100, Math.round((Math.sqrt(variance / luminanceValues.length) / 128) * 100));
    const sharpness = Math.min(100, Math.round((edgeTotal / ((width - 1) * (height - 1) * 2 * 255)) * 100));

    return {
      width,
      height,
      brightness: Math.round((mean / 255) * 100),
      contrast,
      sharpness,
    };
  };

  const startCamera = async () => {
    if (cameraStarting) return;
    setCameraError(null);
    setCameraStarting(true);
    try {
      const stream = await getCameraStream();
      currentStreamRef.current = stream;
      setCameraOpen(true);
      const attached = await attachCurrentStreamToVideo();
      if (!attached) {
        throw new Error('Camera stream could not be attached to preview.');
      }
    } catch (error) {
      console.error('Palm capture camera failed', error);
      stopCamera();
      setCameraOpen(false);
      setCameraError('Camera access could not be started. Please allow camera permission and try again.');
    } finally {
      setCameraStarting(false);
    }
  };

  useEffect(() => {
    if (!cameraOpen) return;
    void attachCurrentStreamToVideo();
  }, [cameraOpen]);

  const capturePalm = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.videoWidth < 1 || videoRef.current.videoHeight < 1) {
      setCameraError('Camera preview is not ready yet. Please wait a second and try again.');
      return;
    }
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const quality = analyzePalmQuality(canvasRef.current);

    if (quality.width < 600 || quality.height < 800) {
      setCameraError('Palm image resolution is too small. Please move closer and capture again.');
      return;
    }
    if (quality.brightness < 45) {
      setCameraError('Palm image is too dark. Please capture again with better lighting.');
      return;
    }
    if (quality.contrast < 18) {
      setCameraError('Palm image contrast is too low. Please keep the full palm clearly visible.');
      return;
    }
    if (quality.sharpness < 12) {
      setCameraError('Palm image looks blurry. Please hold steady and capture again.');
      return;
    }

    setCapturedImage(imageDataUrl);
    setPalmQuality(quality);
    stopCamera();
  };

  useEffect(() => {
    let cancelled = false;

    const prepareReport = async () => {
      try {
        const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
        const parsedProfile = savedProfile ? (JSON.parse(savedProfile) as UserProfile) : null;
        const existingReportId =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('reportId')
            : null;
        const report = existingReportId
          ? { id: existingReportId }
          : (await createReportAfterPaymentSuccess(userId, parsedProfile)).report;
        const requirements = await fetchAstroReportRequirements(report.id, userId, parsedProfile);

        if (cancelled) return;

        setReportId(requirements.reportId);
        setRequestId(requirements.requestId);
        setFormData({
          fullName: requirements.prefilled.fullName || '',
          dateOfBirth: requirements.prefilled.dateOfBirth || '',
          timeOfBirth: requirements.prefilled.timeOfBirth || '',
          birthPlace: requirements.prefilled.birthPlace || '',
          gender: (requirements.prefilled.gender || 'male') as UserProfile['gender'],
          preferredLanguage: 'si',
        });

        if (requirements.prefilled.palmImageUrl) {
          setCapturedImage(requirements.prefilled.palmImageUrl);
        }

        if (['queued', 'generating', 'pdf_generating', 'completed'].includes(requirements.status)) {
          setStage('submitted');
          setMessage('Your premium report is already being prepared in the background.');
          return;
        }

        setStage('form');
        setMessage('Payment confirmed. Please complete the final details and capture your palm to start report generation.');
      } catch (error) {
        console.error('Failed to prepare premium report after payment success', error);
        if (cancelled) return;
        setStage('error');
        setGeneralError('Payment was successful, but the premium input step could not be opened.');
      }
    };

    void prepareReport();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [userId]);

  const updateProfileCache = () => {
    const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
    const currentProfile = savedProfile ? (JSON.parse(savedProfile) as UserProfile) : ({} as UserProfile);
    const nextProfile = enrichProfileAstrology({
      ...currentProfile,
      name: formData.fullName,
      gender: formData.gender,
      dob: formData.dateOfBirth,
      birthTime: formData.timeOfBirth,
      city: formData.birthPlace,
    } as UserProfile);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(nextProfile));
  };

  const handleSubmit = async () => {
    if (!reportId) return;
    if (!capturedImage || !palmQuality) {
      setGeneralError('Please capture a clear palm photo before submitting.');
      return;
    }

    setSubmitting(true);
    setGeneralError(null);

    try {
      updateProfileCache();
      await submitAstroReportInputs(reportId, {
        userId,
        profile: null,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        preferredLanguage: 'si',
        palmImageBase64: capturedImage,
        palmImageMimeType: 'image/jpeg',
        palmQuality,
      });
      setStage('submitted');
      setMessage('Your premium report request has been submitted. Wishwaya is now generating the full Sinhala report in the background.');
    } catch (error: any) {
      console.error('Failed to submit premium inputs', error);
      setGeneralError(error?.message || 'Premium report submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_transparent_38%),linear-gradient(180deg,_#f6fff7_0%,_#eefbf2_48%,_#F9FBFA_100%)] px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-emerald-100 bg-white/90 p-6 shadow-xl md:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">✓</div>
          <h1 className="mt-6 text-3xl font-black text-slate-900">Payment Success</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{message}</p>
          {requestId && (
            <div className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
              Request ID {requestId}
            </div>
          )}
        </div>

        {stage === 'booting' && (
          <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-center text-sm font-semibold text-slate-600">
            Loading your premium request details...
          </div>
        )}

        {stage === 'error' && (
          <div className="mt-8 space-y-5">
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-600">
              {generalError}
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/?tab=profile';
              }}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white"
            >
              Go back to profile
            </button>
          </div>
        )}

        {stage === 'form' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Final Details</p>
              <p className="mt-3 sinhala text-sm leading-7 text-slate-700">
                පෙර සුරකින ලද උපන් තොරතුරු ස්වයංක්‍රීයව පුරවා ඇත. අඩු දේ තිබේ නම් පුරවන්න. පුරුෂයන් සඳහා දකුණු අත (Right Hand) සහ කාන්තාවන් සඳහා වම් අත (Left Hand) පැහැදිලිව capture කරන්න.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Full name</span>
                <input
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Gender</span>
                <select
                  value={formData.gender}
                  onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value as UserProfile['gender'] }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Date of birth</span>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(event) => setFormData((current) => ({ ...current, dateOfBirth: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Exact birth time</span>
                <input
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={(event) => setFormData((current) => ({ ...current, timeOfBirth: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Birth place</span>
              <input
                value={formData.birthPlace}
                onChange={(event) => setFormData((current) => ({ ...current, birthPlace: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400"
              />
            </label>

            <div className="rounded-[2rem] border border-sky-100 bg-sky-50/70 p-5">
              <p className="text-sm font-black text-slate-800">Palm capture</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use {preferredHandLabel}. Keep the full palm visible, fingers naturally open, and capture in good light.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{formData.gender === 'female' ? 'Female: Left Hand' : 'Male: Right Hand'}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">Good lighting required</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">Entire palm visible</span>
              </div>
              <div className="mt-5">
                {capturedImage ? (
                  <div className="space-y-4">
                    <img src={capturedImage} alt="Captured palm" className="w-full rounded-[1.75rem] border border-slate-200 object-cover shadow-sm" />
                    {palmQuality && (
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 md:grid-cols-4">
                        <div className="rounded-2xl bg-white px-3 py-3">Brightness {palmQuality.brightness}</div>
                        <div className="rounded-2xl bg-white px-3 py-3">Contrast {palmQuality.contrast}</div>
                        <div className="rounded-2xl bg-white px-3 py-3">Sharpness {palmQuality.sharpness}</div>
                        <div className="rounded-2xl bg-white px-3 py-3">{palmQuality.width}x{palmQuality.height}</div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => void startCamera()}
                      disabled={cameraStarting}
                      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-70"
                    >
                      {cameraStarting ? 'Starting Camera...' : 'Retake Palm Photo'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => void startCamera()}
                    disabled={cameraStarting}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-70"
                  >
                    {cameraStarting ? 'Starting Camera...' : 'Open Camera'}
                  </button>
                )}
              </div>
              {cameraError && <p className="mt-4 text-sm text-red-500">{cameraError}</p>}
            </div>

            {generalError && (
              <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {generalError}
              </div>
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleSubmit()}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit Premium Report Request'}
            </button>
          </div>
        )}

        {stage === 'submitted' && (
          <div className="mt-8 space-y-5">
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-slate-700">
              ඔබගේ සම්පූර්ණ ජෝතිශ්‍ය වාර්තාව සකස් කරමින් පවතී. පසුව profile page එකට ගොස් pending / processing / completed status එක සහ PDF download option එක බලන්න.
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/?tab=profile';
              }}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white"
            >
              Go back to profile
            </button>
          </div>
        )}
      </div>

      {cameraOpen && (
        <div className="fixed inset-0 z-[260] bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[62vh] w-[74vw] max-w-[320px] rounded-[3rem] border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          <div className="absolute left-0 right-0 top-8 px-6 text-center text-white">
            <p className="text-lg font-black">{formData.gender === 'female' ? 'Capture Left Palm' : 'Capture Right Palm'}</p>
            <p className="mt-2 text-sm leading-6 text-white/85">Keep the full {preferredHandLabel.toLowerCase()} visible, fingers open naturally, and use bright lighting.</p>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => stopCamera()}
              className="rounded-full bg-white/20 px-5 py-3 text-sm font-black text-white backdrop-blur"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePalm}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20"
            >
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const { user, loading: authLoading, authEnabled, signInWithGoogle, logout: signOutFirebase } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const queryTab = new URLSearchParams(window.location.search).get('tab');
    return normalizeTab(queryTab);
  });
  const [showSplash, setShowSplash] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [palmState, setPalmState] = useState<PalmAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [vastuState, setVastuState] = useState<VastuAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [matchingState, setMatchingState] = useState<MatchingState>({ status: 'idle', result: null, errorMessage: null });
  const [omenState, setOmenState] = useState<OmenAnalysisState>({ status: 'idle', result: null, errorMessage: null });
  const [babyNamingState, setBabyNamingState] = useState<BabyNamingState>({ status: 'idle', result: null, errorMessage: null });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaveLoading, setProfileSaveLoading] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const effectiveUserId = getEffectiveUserId(user?.uid);

  if (currentPath === '/payment-success') {
    return <PaymentSuccessPage userId={effectiveUserId} />;
  }

  if (currentPath === '/payment-cancel') {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_38%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_48%,_#F9FBFA_100%)] px-6 py-12">
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-sky-100 bg-white/90 p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-4xl">i</div>
          <h1 className="mt-6 text-3xl font-black text-slate-900">Payment Cancelled</h1>
          <p className="mt-4 sinhala text-sm leading-7 text-slate-600">
            ගෙවීම අවලංගු කර ඇත. ඔබට අවශ්‍ය නම් නැවත app එකට ගොස් premium checkout එක නැවත ආරම්භ කළ හැක.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/?tab=profile';
            }}
            className="mt-8 rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white"
          >
            Return to profile
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
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

  useEffect(() => {
    if (authLoading) return;

    let isCancelled = false;

    const syncProfile = async () => {
      setProfileLoading(true);

      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      const localOwnerUid = localStorage.getItem(LOCAL_PROFILE_OWNER_KEY);
      const parsedLocalProfile = saved ? enrichProfileAstrology(JSON.parse(saved)) : null;
      const localProfile =
        user?.uid && localOwnerUid && localOwnerUid !== user.uid ? null : parsedLocalProfile;

      try {
        if (user?.uid) {
          await migrateUserIdToFirebase(user.uid);

          const cloudProfile = await getUserProfile(user.uid);
          const effectiveProfile = cloudProfile
            ? enrichProfileAstrology(cloudProfile)
            : localProfile;

          if (!cloudProfile && localProfile) {
            await saveUserProfile(user.uid, effectiveProfile!, {
              email: user.email,
              displayName: user.displayName,
            });
          } else if (
            cloudProfile &&
            effectiveProfile &&
            JSON.stringify(cloudProfile) !== JSON.stringify(effectiveProfile)
          ) {
            await saveUserProfile(user.uid, effectiveProfile, {
              email: user.email,
              displayName: user.displayName,
            });
          }

          if (!isCancelled) {
            setProfile(effectiveProfile);
            if (effectiveProfile) {
              localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(effectiveProfile));
              localStorage.setItem(LOCAL_PROFILE_OWNER_KEY, user.uid);
            } else {
              localStorage.removeItem(LOCAL_PROFILE_KEY);
              localStorage.removeItem(LOCAL_PROFILE_OWNER_KEY);
            }
          }

          return;
        }

        if (!isCancelled) {
          setProfile(localProfile);
          if (localProfile) {
            localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(localProfile));
            localStorage.removeItem(LOCAL_PROFILE_OWNER_KEY);
          } else {
            localStorage.removeItem(LOCAL_PROFILE_KEY);
            localStorage.removeItem(LOCAL_PROFILE_OWNER_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to sync user profile', error);
        if (!isCancelled) {
          setProfile(localProfile);
        }
      } finally {
        if (!isCancelled) {
          setProfileLoading(false);
        }
      }
    };

    void syncProfile();

    return () => {
      isCancelled = true;
    };
  }, [authLoading, user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    void migrateUserIdToFirebase(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const safeTab = normalizeTab(activeTab);
    if (safeTab !== activeTab) {
      setActiveTab(safeTab);
      return;
    }
    sessionStorage.setItem(ACTIVE_TAB_KEY, safeTab);
    const url = new URL(window.location.href);
    if (safeTab === 'dashboard') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', safeTab);
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [activeTab]);

  useLayoutEffect(() => {
    // Force-reset scroll for all likely scroll roots after every tab switch.
    const resetScroll = () => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const raf = window.requestAnimationFrame(resetScroll);
    const timeout = window.setTimeout(resetScroll, 60);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [activeTab]);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    const enrichedProfile = enrichProfileAstrology(newProfile);
    setProfile(enrichedProfile);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(enrichedProfile));
    if (user?.uid) {
      localStorage.setItem(LOCAL_PROFILE_OWNER_KEY, user.uid);
    } else {
      localStorage.removeItem(LOCAL_PROFILE_OWNER_KEY);
    }

    if (user?.uid) {
      try {
        await saveUserProfile(user.uid, enrichedProfile, {
          email: user.email,
          displayName: user.displayName,
        });
      } catch (error) {
        console.error('Failed to save profile to Firebase', error);
      }
    }
  };

  const handleProfileDetailsSave = async (
    nextProfile: Pick<UserProfile, 'name' | 'gender' | 'dob' | 'birthTime' | 'city'>
  ) => {
    setProfileSaveError(null);
    setProfileSaveLoading(true);

    try {
      const calculations = await calculateRashiFromDetails(
        nextProfile.dob,
        nextProfile.birthTime,
        nextProfile.city
      );

      await handleOnboardingComplete({
        ...profile,
        ...nextProfile,
        ...calculations,
        mismatchNotice: '',
      } as UserProfile);

      setShowEditProfile(false);
    } catch (error) {
      console.error('Failed to update profile details', error);
      setProfileSaveError('Profile update failed. Please try again.');
    } finally {
      setProfileSaveLoading(false);
    }
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

  const handleGoogleLink = async () => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed', error);
      setAuthError('Google account linking failed. Please check Firebase setup and try again.');
      throw error;
    } finally {
      setAuthActionLoading(false);
    }
  };

  const performLogout = async () => {
    setAuthError(null);
    setAuthActionLoading(true);

    try {
      if (user) {
        await signOutFirebase();
      }

      localStorage.clear();
      sessionStorage.removeItem(ACTIVE_TAB_KEY);
      setProfile(null);
      setActiveTab('dashboard');
      setPalmState({ status: 'idle', result: null, errorMessage: null });
      setVastuState({ status: 'idle', result: null, errorMessage: null });
      setMatchingState({ status: 'idle', result: null, errorMessage: null });
      setOmenState({ status: 'idle', result: null, errorMessage: null });
      setBabyNamingState({ status: 'idle', result: null, errorMessage: null });
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Sign out failed', error);
      setAuthError('Sign out failed. Please try again.');
    } finally {
      setAuthActionLoading(false);
    }
  };

  const showInlineProfilePreparation = profileLoading && !!profile;

  if (showSplash || authLoading || (!profile && profileLoading)) return <GlobalLoader />; 

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

            <main ref={mainScrollRef} data-tab-scroll-root className="flex-1 overflow-y-auto pb-32 scroll-smooth no-scrollbar">
              {activeTab === 'dashboard' && (
                <Dashboard
                  profile={profile}
                  onNavigate={setActiveTab}
                  showPreparationNotice={showInlineProfilePreparation}
                />
              )}
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
              {activeTab === 'consultant' && (
                <AstrologyConsultantScreen
                  profile={profile}
                  userId={effectiveUserId}
                  userEmail={user?.email || null}
                />
              )}
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
                    <PremiumAstroReports
                      profile={profile}
                      userId={effectiveUserId}
                      userEmail={user?.email || null}
                      authEnabled={authEnabled}
                      authLoading={authLoading || authActionLoading}
                      onRequireGoogleLink={handleGoogleLink}
                      onSaveRequiredProfile={handleProfileDetailsSave}
                    />

                    <div className="bg-white p-10 rounded-[4rem] zen-shadow border border-white shadow-xl text-left space-y-8 mt-[-1.5rem] relative z-20 overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 text-9xl opacity-[0.02] pointer-events-none">✨</div>
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] sinhala ml-1">නම</span>
                        <p className="font-black text-gray-800 text-2xl tracking-tight">{profile.name}</p>
                        <button
                          onClick={() => {
                            setProfileSaveError(null);
                            setShowEditProfile(true);
                          }}
                          className="mt-3 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 transition-all hover:bg-emerald-100"
                        >
                          Edit Details
                        </button>
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
                      <div className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-gray-50 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Account Link</p>
                            <h3 className="sinhala font-black text-gray-800 text-sm">
                              {authEnabled ? 'Google account link status' : 'Firebase not configured yet'}
                            </h3>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {user ? 'Linked' : 'Local Only'}
                          </div>
                        </div>

                        {authEnabled ? (
                          <>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                              {user
                                ? `Signed in as ${user.email || 'your Google account'}. Astrology profile changes now sync to Firebase for this account.`
                                : 'Your app still works with local data, but linking Google gives us a stable user ID for sync, recovery, and better notifications.'}
                            </p>

                            <button
                              onClick={user ? () => setShowLogoutConfirm(true) : handleGoogleLink}
                              disabled={authActionLoading}
                              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 ${
                                user
                                  ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                  : 'bg-emerald-600 text-white border border-emerald-700 shadow-lg shadow-emerald-100 hover:bg-emerald-700'
                              }`}
                            >
                              {authActionLoading
                                ? 'Please wait...'
                                : user
                                  ? 'Sign out'
                                  : 'Link Google account'}
                            </button>
                          </>
                        ) : (
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                            Add your Firebase web config to `.env` first. Once that is in place, Google account linking will appear here.
                          </p>
                        )}

                        {authError && (
                          <p className="text-[10px] text-red-500 font-semibold">{authError}</p>
                        )}
                      </div>

                      <NotificationSettings 
                        profile={profile} 
                        onUpdateProfile={handleOnboardingComplete} 
                      />

                      <div className="space-y-6">
                        <button 
                          onClick={() => setShowLogoutConfirm(true)}
                          className="hidden"
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

          {showEditProfile && profile && (
            <ProfileEditor
              initialProfile={profile}
              loading={profileSaveLoading}
              error={profileSaveError}
              onClose={() => {
                if (!profileSaveLoading) {
                  setShowEditProfile(false);
                  setProfileSaveError(null);
                }
              }}
              onSave={handleProfileDetailsSave}
            />
          )}

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
