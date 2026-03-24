import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';

interface NotificationSettingsProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const defaultPrefs = {
  enabled: true,
  horoscope: true,
  rahuKalaya: true,
  specialNekath: true,
  birthday: true
};

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ profile, onUpdateProfile }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [prefs, setPrefs] = useState(profile.notifications || defaultPrefs);

  const supportsNotifications =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  useEffect(() => {
    void checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!supportsNotifications) {
      setIsSubscribed(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Failed to check push subscription', error);
      setIsSubscribed(false);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  const updatePrefs = async (newPrefs: typeof defaultPrefs) => {
    setPrefs(newPrefs);
    const newProfile = { ...profile, notifications: newPrefs };
    onUpdateProfile(newProfile);

    if (isSubscribed) {
      const userId = localStorage.getItem('wishwaya_user_id');
      if (userId) {
        try {
          await fetch('/api/push/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, preferences: newPrefs })
          });
        } catch (error) {
          console.error('Failed to sync preferences', error);
        }
      }
    }
  };

  const handleToggleMaster = async () => {
    if (!supportsNotifications) {
      alert('ඔබ භාවිතා කරන බ්‍රව්සරය හෝ උපාංගය notifications සඳහා සහය නොදක්වයි. කරුණාකර Chrome හෝ Edge වැනි browser එකකින් නැවත උත්සාහ කරන්න.');
      return;
    }

    if (!isSubscribed) {
      setShowPermissionModal(true);
      return;
    }

    const newPrefs = { ...prefs, enabled: !prefs.enabled };
    await updatePrefs(newPrefs);
  };

  const requestPermissionAndSubscribe = async () => {
    setLoading(true);
    setShowPermissionModal(false);

    try {
      if (!supportsNotifications) {
        throw new Error('NOTIFICATION_UNSUPPORTED');
      }

      const permission = await window.Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('PERMISSION_DENIED');
      }

      const registration = await navigator.serviceWorker.ready;
      const response = await fetch('/api/push/public-key');
      const { publicKey } = await response.json();
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      let userId = localStorage.getItem('wishwaya_user_id');
      if (!userId) {
        userId = `user_${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem('wishwaya_user_id', userId);
      }

      let location = { lat: 6.9271, lng: 79.8612 };
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } catch (error) {
          console.error('Geolocation unavailable for notifications', error);
        }
      }

      const initialPrefs = { ...prefs, enabled: true };

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userId,
          location,
          horoscopeProfile: { ...profile, notifications: initialPrefs }
        })
      });

      setIsSubscribed(true);
      setPrefs(initialPrefs);
      onUpdateProfile({ ...profile, notifications: initialPrefs });
    } catch (error: any) {
      console.error('Subscription failed', error);

      if (error?.message === 'NOTIFICATION_UNSUPPORTED') {
        alert('මෙම උපාංගයේ හෝ බ්‍රව්සරයේ notifications සක්‍රීය කළ නොහැක. කරුණාකර supported browser එකකින් නැවත උත්සාහ කරන්න.');
      } else if (error?.message === 'PERMISSION_DENIED' || error?.name === 'NotAllowedError') {
        alert('නිවේදන සක්‍රීය කිරීමට browser අවසර අවශ්‍යයි. කරුණාකර අවසර ලබා දී නැවත උත්සාහ කරන්න.');
      } else {
        alert('නිවේදන සක්‍රීය කිරීම අසාර්ථක විය. කරුණාකර ටික වේලාවකින් නැවත උත්සාහ කරන්න.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    const userId = localStorage.getItem('wishwaya_user_id');
    if (!userId || !isSubscribed) return;

    setLoading(true);
    try {
      await fetch('/api/notify/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'පරීක්ෂණ නිවේදනය ✅',
          body: 'Wishwaya නිවේදන පද්ධතිය සාර්ථකව ක්‍රියාත්මක වේ.',
          url: '/profile'
        })
      });
    } catch (error) {
      console.error('Failed to send test notification', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (key: keyof typeof prefs) => {
    if (key === 'enabled') return;
    void updatePrefs({ ...prefs, [key]: !prefs[key] });
  };

  const permissionStatus = !supportsNotifications
    ? 'Notifications Not Supported'
    : window.Notification.permission === 'granted'
      ? 'Permission Granted ✅'
      : 'Permission Required ⚠️';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-xl">🔔</div>
            <div>
              <h3 className="sinhala font-black text-gray-800 text-sm">නිවේදන සැකසුම්</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Notification Settings</p>
            </div>
          </div>
          <button
            onClick={handleToggleMaster}
            disabled={loading}
            className={`w-12 h-6 rounded-full transition-all relative ${prefs.enabled && isSubscribed ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.enabled && isSubscribed ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <SettingItem
            label="දිනපතා ලග්න පලාපල"
            sublabel="Daily Horoscope"
            active={prefs.horoscope}
            disabled={!prefs.enabled || !isSubscribed}
            onClick={() => togglePref('horoscope')}
          />
          <SettingItem
            label="රාහු කාලය මතක් කිරීම්"
            sublabel="Rahu Kalaya Reminder"
            active={prefs.rahuKalaya}
            disabled={!prefs.enabled || !isSubscribed}
            onClick={() => togglePref('rahuKalaya')}
          />
          <SettingItem
            label="විශේෂ නැකත් දැනුම්දීම්"
            sublabel="Special Nekath Alerts"
            active={prefs.specialNekath}
            disabled={!prefs.enabled || !isSubscribed}
            onClick={() => togglePref('specialNekath')}
          />
          <SettingItem
            label="උපන් දින සුභපැතුම්"
            sublabel="Birthday Wishes"
            active={prefs.birthday}
            disabled={!prefs.enabled || !isSubscribed}
            onClick={() => togglePref('birthday')}
          />
        </div>

        {isSubscribed && (
          <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col space-y-3">
            <button
              onClick={handleTestNotification}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
            >
              <span>Test Notification</span>
              <span>🚀</span>
            </button>
            <p className="text-[9px] text-center text-gray-400 font-medium">
              Status: {permissionStatus}
            </p>
          </div>
        )}
      </div>

      {showPermissionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 zen-shadow space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-purple-50 rounded-[2rem] mx-auto flex items-center justify-center text-4xl">🔔</div>
            <div className="text-center space-y-2">
              <h3 className="sinhala font-black text-xl text-gray-800">නිවේදන සක්‍රීය කරන්න</h3>
              <p className="sinhala text-sm text-gray-500 leading-relaxed">
                Wishwaya මගින් ඔබට දිනපතා ලග්න පලාපල, රාහු කාලය, විශේෂ නැකත් සහ උපන් දින සුභපැතුම් ලැබිය හැක.
                නියමිත වෙලාවට මතක් කිරීම් ලබා ගැනීමට notifications සක්‍රීය කරන්න.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={requestPermissionAndSubscribe}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sinhala shadow-lg shadow-purple-200 active:scale-95 transition-all"
              >
                සක්‍රීය කරන්න
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="w-full py-5 rounded-2xl bg-gray-50 text-gray-400 font-bold text-sm sinhala hover:bg-gray-100 transition-all"
              >
                පසුව
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingItem: React.FC<{
  label: string;
  sublabel: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}> = ({ label, sublabel, active, disabled, onClick }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''} ${active ? 'bg-purple-50/30 border-purple-100' : 'bg-white border-gray-50'}`}
  >
    <div>
      <p className="sinhala font-bold text-gray-700 text-xs">{label}</p>
      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{sublabel}</p>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-purple-500' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);

export default NotificationSettings;
