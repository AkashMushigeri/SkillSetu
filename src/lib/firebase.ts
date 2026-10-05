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
  connectAuthEmulator,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { EducationHistory } from '@/types/student';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBYafwhkKarQs36-GehGM50b1QqZKTvzPk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'skillsetu-6e06a.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'skillsetu-6e06a',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'skillsetu-6e06a.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '251000743509',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:251000743509:web:b120001a772e2ca85096dc',
};

let app: FirebaseApp;
let auth: Auth;

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const shouldConnectEmulator =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ||
  (isLocalhost && typeof window !== 'undefined' && localStorage.getItem('skillsetu_use_emulator') === 'true');

function initEmulators(authInstance: Auth) {
  if (!shouldConnectEmulator) return;

  try {
    connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch {
    // ignore if already connected
  }

  console.info('⚡ [Firebase] Connected to local Auth Emulator (9099)');
}

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }

  initEmulators(auth);

  if (isLocalhost) {
    (window as any).toggleSkillSetuEmulator = (enable: boolean) => {
      localStorage.setItem('skillsetu_use_emulator', enable ? 'true' : 'false');
      console.log(`Emulator mode set to ${enable}. Reloading page...`);
      window.location.reload();
    };
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

export const isNetworkError = (e: any): boolean => {
  if (!e) return false;
  const msg = (e.message || '').toLowerCase();
  return (
    e.code === 'auth/network-request-failed' ||
    msg.includes('network error') ||
    msg.includes('err_network_changed') ||
    msg.includes('interrupted connection') ||
    msg.includes('unreachable host')
  );
};

export const checkGoogleRedirect = async (): Promise<ExtendedUser | null> => {
  if (!auth || typeof window === 'undefined') return null;
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    return result.user as ExtendedUser;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('Network changed or offline while checking redirect:', err.message);
      return null;
    }
    throw err;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user as ExtendedUser;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('Network error during signInWithEmail, retrying in 1.2s...');
      await new Promise((r) => setTimeout(r, 1200));
      const retryResult = await signInWithEmailAndPassword(auth, email, password);
      return retryResult.user as ExtendedUser;
    }
    throw err;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<ExtendedUser> => {
  if (!auth) throw new Error('Auth not initialized');
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user as ExtendedUser;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('Network error during signUpWithEmail, retrying in 1.2s...');
      await new Promise((r) => setTimeout(r, 1200));
      const retryResult = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(retryResult.user, { displayName });
      return retryResult.user as ExtendedUser;
    }
    throw err;
  }
};

export const signOutFirebase = async (): Promise<void> => {
  if (!auth) return;
  await firebaseSignOutFn(auth);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Auth not initialized');
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('Network error during sendPasswordResetEmail, retrying in 1.2s...');
      await new Promise((r) => setTimeout(r, 1200));
      await sendPasswordResetEmail(auth, email.trim());
      return;
    }
    throw err;
  }
};

export const onAuthChange = (callback: (user: ExtendedUser | null) => void) => {
  if (!auth) return;
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      callback(user as ExtendedUser);
    } else {
      callback(null);
    }
  });
};
