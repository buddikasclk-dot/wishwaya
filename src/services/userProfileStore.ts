import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../firebase-config';
import { UserProfile } from '../types';

const USERS_COLLECTION = 'users';

const PROFILE_FIELDS: Array<keyof UserProfile> = [
  'name',
  'gender',
  'dob',
  'birthTime',
  'city',
  'rashi',
  'lagna',
  'mismatchNotice',
  'nekatha',
  'lagnaAdhipathi',
  'janmaRashiya',
  'rashyadhipathi',
  'nekathPadaya',
  'gana',
  'notifications',
];

const extractLegacyProfile = (data: Record<string, any>): UserProfile | null => {
  const legacyProfile = PROFILE_FIELDS.reduce<Record<string, any>>((acc, key) => {
    if (key in data) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return legacyProfile.name ? (legacyProfile as UserProfile) : null;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!firebaseDb) return null;

  const snapshot = await getDoc(doc(firebaseDb, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return (data.profile as UserProfile) || extractLegacyProfile(data);
};

export const saveUserProfile = async (
  uid: string,
  profile: UserProfile,
  account?: { email?: string | null; displayName?: string | null }
) => {
  if (!firebaseDb) return;

  const userRef = doc(firebaseDb, USERS_COLLECTION, uid);
  const existingSnapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      ...profile,
      profile,
      account: {
        email: account?.email || null,
        displayName: account?.displayName || null,
      },
      updatedAt: serverTimestamp(),
      ...(existingSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
};
