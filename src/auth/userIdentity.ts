export const APP_USER_ID_KEY = 'wishwaya_user_id';
export const LEGACY_USER_ID_KEY = 'wishwaya_legacy_user_id';

export const getStoredBrowserUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(APP_USER_ID_KEY);
};

export const createBrowserUserId = () => `user_${Math.random().toString(36).slice(2, 11)}`;

export const getEffectiveUserId = (firebaseUid?: string | null) => {
  if (firebaseUid) return firebaseUid;

  const stored = getStoredBrowserUserId();
  if (stored) return stored;

  const created = createBrowserUserId();
  localStorage.setItem(APP_USER_ID_KEY, created);
  return created;
};

export const migrateUserIdToFirebase = async (firebaseUid: string) => {
  if (typeof window === 'undefined') return firebaseUid;

  const currentId = localStorage.getItem(APP_USER_ID_KEY);
  if (!currentId) {
    localStorage.setItem(APP_USER_ID_KEY, firebaseUid);
    return firebaseUid;
  }

  if (currentId === firebaseUid) return firebaseUid;

  localStorage.setItem(LEGACY_USER_ID_KEY, currentId);

  try {
    await fetch('/api/push/link-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: currentId,
        toUserId: firebaseUid,
      }),
    });
  } catch (error) {
    console.error('Failed to migrate push user identity', error);
  }

  localStorage.setItem(APP_USER_ID_KEY, firebaseUid);
  return firebaseUid;
};
