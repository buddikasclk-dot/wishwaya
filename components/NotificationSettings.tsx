import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../src/auth/AuthContext';
import { getEffectiveUserId, migrateUserIdToFirebase } from '../src/auth/userIdentity';
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
  birthday: true,
};

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ profile, onUpdateProfile }) => {
  const { user } = useAuth();
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
    setPrefs(profile.notifications || defaultPrefs);
  }, [profile.notifications]);

  useEffect(() => {
    void checkSubscription();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    void migrateUserIdToFirebase(user.uid);
  }, [user?.uid]);

  const permission = supportsNotifications ? window.Notification.permission : 'denied';

  const statusText = useMemo(() => {
    if (!supportsNotifications) {
      return 'Push notifications are not supported on this browser.';
    }

    if (permission !== 'granted') {
      return 'Push notifications are off. Browser permission is still needed.';
    }

    if (!isSubscribed) {
      return 'Push notifications are off for this device.';
    }

    if (!prefs.enabled) {
      return 'Push notifications are paused for this device.';
    }

    return 'Push notifications are on for this device.';
  }, [isSubscribed, permission, prefs.enabled, supportsNotifications]);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

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

  const syncSubscription = async (nextProfile: UserProfile, nextPrefs: typeof defaultPrefs) => {
    if (!supportsNotifications) return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    const userId = user?.uid ? await migrateUserIdToFirebase(user.uid) : getEffectiveUserId(null);

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        userId,
        location: { lat: 6.9271, lng: 79.8612 },
        horoscopeProfile: { ...nextProfile, notifications: nextPrefs },
      }),
    });
  };

  const updatePrefs = async (newPrefs: typeof defaultPrefs) => {
    setPrefs(newPrefs);
    const newProfile = { ...profile, notifications: newPrefs };
    onUpdateProfile(newProfile);

    const userId = getEffectiveUserId(user?.uid);
    if (!userId || !isSubscribed) return;

    try {
      await fetch('/api/push/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences: newPrefs }),
      });

      await syncSubscription(newProfile, newPrefs);
    } catch (error) {
      console.error('Failed to sync notification preferences', error);
    }
  };

  const requestPermissionAndSubscribe = async () => {
    setLoading(true);
    setShowPermissionModal(false);

    try {
      if (!supportsNotifications) {
        throw new Error('NOTIFICATION_UNSUPPORTED');
      }

      const permissionResult = await window.Notification.requestPermission();
      if (permissionResult !== 'granted') {
        throw new Error('PERMISSION_DENIED');
      }

      const registration = await navigator.serviceWorker.ready;
      const response = await fetch('/api/push/public-key');
      const { publicKey } = await response.json();
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const userId = user?.uid ? await migrateUserIdToFirebase(user.uid) : getEffectiveUserId(null);
      const nextPrefs = { ...prefs, enabled: true };

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userId,
          location: { lat: 6.9271, lng: 79.8612 },
          horoscopeProfile: { ...profile, notifications: nextPrefs },
        }),
      });

      setIsSubscribed(true);
      setPrefs(nextPrefs);
      onUpdateProfile({ ...profile, notifications: nextPrefs });
    } catch (error: any) {
      console.error('Subscription failed', error);

      if (error?.message === 'NOTIFICATION_UNSUPPORTED') {
        alert('This browser does not support push notifications.');
      } else if (error?.message === 'PERMISSION_DENIED' || error?.name === 'NotAllowedError') {
        alert('Browser permission is needed to turn notifications on.');
      } else {
        alert('Notification setup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!supportsNotifications) {
      alert('This browser does not support push notifications.');
      return;
    }

    if (!isSubscribed || permission !== 'granted') {
      setShowPermissionModal(true);
      return;
    }

    await updatePrefs({ ...prefs, enabled: !prefs.enabled });
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] zen-shadow border border-gray-50 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Notifications</p>
          <h3 className="font-black text-gray-800 text-sm truncate">
            {user?.email || 'This device'}
          </h3>
        </div>

        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          prefs.enabled && isSubscribed && permission === 'granted'
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {prefs.enabled && isSubscribed && permission === 'granted' ? 'On' : 'Off'}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[2rem] border border-gray-100 bg-gray-50/70 px-4 py-4">
        <div className="min-w-0 pr-4">
          <p className="text-xs font-black text-gray-800">Push notifications</p>
          <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{statusText}</p>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
            prefs.enabled && isSubscribed && permission === 'granted' ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              prefs.enabled && isSubscribed && permission === 'granted' ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {!supportsNotifications && (
        <p className="text-[10px] text-amber-600 font-semibold">
          Use a supported browser like Chrome or Edge to receive notifications.
        </p>
      )}

      {showPermissionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 zen-shadow space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] mx-auto flex items-center justify-center text-3xl font-black text-emerald-700">
              Bell
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-black text-xl text-gray-800">Enable notifications</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Turn on push notifications to receive horoscope updates and reminders on this device.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={requestPermissionAndSubscribe}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-all"
              >
                Turn on notifications
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="w-full py-5 rounded-2xl bg-gray-50 text-gray-400 font-bold text-sm hover:bg-gray-100 transition-all"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
