import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

const buildTimeFirebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasAllFirebaseConfigValues = (config: Partial<FirebaseOptions> | null | undefined) =>
  Boolean(
    config?.apiKey &&
      config?.authDomain &&
      config?.projectId &&
      config?.storageBucket &&
      config?.messagingSenderId &&
      config?.appId
  );

const getRuntimeFirebaseConfig = async (): Promise<FirebaseOptions | null> => {
  try {
    const response = await fetch('/api/firebase-config', { credentials: 'same-origin' });
    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.configured || !data?.firebase) {
      return null;
    }

    return data.firebase as FirebaseOptions;
  } catch (error) {
    console.warn('Failed to load runtime Firebase config', error);
    return null;
  }
};

export let firebaseApp: FirebaseApp | null = null;
export let firebaseAuth: Auth | null = null;
export let firebaseDb: Firestore | null = null;
export let googleProvider: GoogleAuthProvider | null = null;

let firebaseConfigured = false;
let initializationPromise: Promise<boolean> | null = null;

const applyFirebaseConfig = (config: FirebaseOptions) => {
  firebaseApp = initializeApp(config);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  firebaseConfigured = true;
};

export const initializeFirebaseConfig = async (): Promise<boolean> => {
  if (firebaseConfigured) return true;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const resolvedConfig = hasAllFirebaseConfigValues(buildTimeFirebaseConfig)
      ? buildTimeFirebaseConfig
      : await getRuntimeFirebaseConfig();

    if (!resolvedConfig || !hasAllFirebaseConfigValues(resolvedConfig)) {
      firebaseConfigured = false;
      return false;
    }

    applyFirebaseConfig(resolvedConfig);
    return true;
  })();

  const configured = await initializationPromise;
  if (!configured) {
    initializationPromise = null;
  }
  return configured;
};

export const isFirebaseConfigured = () => firebaseConfigured;

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  const configured = await initializeFirebaseConfig();
  if (!configured || !firebaseApp) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  return getMessaging(firebaseApp);
};
