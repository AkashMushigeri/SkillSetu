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
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
let db: Firestore;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

export { app, auth, db };

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
    // Retry once if network dropped or changed
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

export interface UserProfileData {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  phone: string;
  photoURL?: string;
  onboardingCompleted: boolean;
  createdAt?: any;
  updatedAt?: any;

  // Student specific:
  college?: string;
  degree?: string;
  department?: string;
  year?: string;
  gpa?: string;
  careerGoal?: string;
  skills?: string[];
  location?: string;
  bio?: string;
  github?: string;
  linkedin?: string;

  // Industry specific:
  companyName?: string;
  companyIndustry?: string;
  companySize?: string;
  companyLocation?: string;
  companyWebsite?: string;
  recruiterTitle?: string;
  hiringDomains?: string[];
  companyBio?: string;

  // College specific:
  institutionName?: string;
  collegeCode?: string;
  designation?: string;
  institutionLocation?: string;
  institutionWebsite?: string;
  departments?: string[];
  totalStudents?: number;
  naacGrade?: string;
}

const getProfileStorageKey = (uid: string) => `skillsetu_user_profile_${uid}`;

export const saveUserProfile = async (
  uid: string,
  profileData: Partial<UserProfileData>
): Promise<UserProfileData> => {
  const existingLocal = getLocalProfile(uid);
  const updatedProfile: UserProfileData = {
    uid,
    email: profileData.email || existingLocal?.email || '',
    role: (profileData.role || existingLocal?.role || 'STUDENT') as UserRole,
    displayName: profileData.displayName || existingLocal?.displayName || '',
    phone: profileData.phone || existingLocal?.phone || '',
    photoURL: profileData.photoURL || existingLocal?.photoURL || '',
    onboardingCompleted: profileData.onboardingCompleted ?? existingLocal?.onboardingCompleted ?? false,
    ...existingLocal,
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  if (!updatedProfile.createdAt) {
    updatedProfile.createdAt = new Date().toISOString();
  }

  // 1. Immediately cache locally for offline reliability & zero-latency UI
  setLocalProfile(uid, updatedProfile);
  if (updatedProfile.role) {
    saveUserRole(updatedProfile.role);
  }

  // 2. Persist to Firebase Firestore
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(
        userDocRef,
        {
          ...updatedProfile,
          updatedAt: serverTimestamp(),
          createdAt: existingLocal?.createdAt ? existingLocal.createdAt : serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore write warning (local profile saved successfully):', err);
    }
  }

  return updatedProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  if (!uid) return null;

  // Try Firestore first if available
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfileData;
        setLocalProfile(uid, data);
        if (data.role) {
          saveUserRole(data.role);
        }
        return data;
      }
    } catch (err) {
      console.warn('Firestore read error (falling back to local cache):', err);
    }
  }

  // Fallback to local cache
  return getLocalProfile(uid);
};

export const updateUserProfile = async (
  uid: string,
  partialData: Partial<UserProfileData>
): Promise<UserProfileData> => {
  return saveUserProfile(uid, partialData);
};

const getLocalProfile = (uid: string): UserProfileData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getProfileStorageKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setLocalProfile = (uid: string, profile: UserProfileData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getProfileStorageKey(uid), JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to cache profile locally', e);
  }
};

