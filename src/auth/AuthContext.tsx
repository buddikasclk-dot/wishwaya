import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { firebaseAuth, googleProvider, isFirebaseConfigured } from '../firebase-config';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authEnabled: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authEnabled: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseAuth || !googleProvider || !isFirebaseConfigured) {
      throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    try {
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (error: any) {
      const shouldIgnore =
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request';

      if (shouldIgnore) return;
      throw error;
    }
  };

  const logout = async () => {
    if (!firebaseAuth || !isFirebaseConfigured) return;
    await signOut(firebaseAuth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authEnabled: isFirebaseConfigured,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
