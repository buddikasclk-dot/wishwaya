import { LOAChallenge } from '../types';

const DB_NAME = 'wishwaya_db';
const DB_VERSION = 1;
const STORE_NAME = 'loa_challenge';

export const WishwayaLocalDB = {
  openDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject('IndexedDB not supported');
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        reject('Database error: ' + (event.target as IDBOpenDBRequest).error);
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'userKey' });
        }
      };
    });
  },

  saveChallenge: async (challenge: LOAChallenge): Promise<void> => {
    try {
      const db = await WishwayaLocalDB.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(challenge);

        request.onsuccess = () => resolve();
        request.onerror = () => reject('Save failed');
      });
    } catch (e) {
      // Fallback to localStorage
      console.warn('IndexedDB failed, using localStorage', e);
      localStorage.setItem(`loa_${challenge.userKey}`, JSON.stringify(challenge));
    }
  },

  getChallenge: async (userKey: string): Promise<LOAChallenge | null> => {
    try {
      const db = await WishwayaLocalDB.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(userKey);

        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => reject('Get failed');
      });
    } catch (e) {
      // Fallback to localStorage
      console.warn('IndexedDB failed, using localStorage', e);
      const data = localStorage.getItem(`loa_${userKey}`);
      return data ? JSON.parse(data) : null;
    }
  }
};
