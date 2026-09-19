import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut as firebaseSignOutFn,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBYafwhkKarQs36-GehGM50b1QqZKTvzPk',
  authDomain: 'skillsetu-6e06a.firebaseapp.com',
  projectId: 'skillsetu-6e06a',
  storageBucket: 'skillsetu-6e06a.firebasestorage.app',
  messagingSenderId: '251000743509',
  appId: '1:251000743509:web:b120001a772e2ca85096dc',
};

let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }
}

export { app, auth };

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export type UserRole = 'STUDENT' | 'INDUSTRY' | 'COLLEGE';

export interface ExtendedUser extends FirebaseUser {
  customClaims?: {
    role?: UserRole;
  };
}

const ROLE_STORAGE_KEY = 'skillsetu_user_role';
const ROLE_TIME_KEY = 'skillsetu_role_timestamp';

export const saveUserRole = (role: UserRole) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  localStorage.setItem(ROLE_TIME_KEY, Date.now().toString());
};

export const getUserStoredRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
  const timestamp = localStorage.getItem(ROLE_TIME_KEY);
  if (!role || !timestamp) return null;
  const age = Date.now() - parseInt(timestamp, 10);
  if (age > 7 * 24 * 60 * 60 * 1000) return null;
  return role;
};

export const clearUserRole = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ROLE_STORAGE_KEY);
  localStorage.removeItem(ROLE_TIME_KEY);
};

export const signInWithGoogle = async (): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user as ExtendedUser;
  } catch (e: any) {
    if (
      e?.code === 'auth/popup-blocked' ||
      e?.code === 'auth/popup-closed-timeout' ||
      e?.message?.includes('popup')
    ) {
      console.warn('Popup blocked, falling back to redirect');
      return signInWithGoogleRedirect();
    }
    throw e;
  }
};

export const signInWithGoogleRedirect = async (): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  await signInWithRedirect(auth, googleProvider);
  return {} as ExtendedUser;
};

export const checkGoogleRedirect = async (): Promise<ExtendedUser | null> => {
  if (!auth || typeof window === 'undefined') return null;
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return result.user as ExtendedUser;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user as ExtendedUser;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result.user as ExtendedUser;
};

export const signOutFirebase = async (): Promise<void> => {
  if (!auth) return;
  await firebaseSignOutFn(auth);
  clearUserRole();
};

export const getUserRole = (user: FirebaseUser | null): UserRole | null => {
  if (!user) return null;
  return getUserStoredRole();
};

export const onAuthChange = (callback: (user: ExtendedUser | null) => void) => {
  if (!auth) return;
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const storedRole = getUserStoredRole();
      callback({
        ...user,
        customClaims: {
          role: storedRole || undefined,
        },
      } as ExtendedUser);
    } else {
      callback(null);
    }
  });
};
