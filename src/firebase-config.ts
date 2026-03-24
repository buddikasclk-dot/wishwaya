
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Note: Values typically provided in Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "wishwaya.firebaseapp.com",
  projectId: "wishwaya",
  storageBucket: "wishwaya.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestPushToken = async (vapidKey: string) => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getToken(messaging, { vapidKey });
    }
    return null;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};
