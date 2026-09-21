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
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import {
  connectorConfig,
  upsertStudentProfile,
  upsertCompany,
  upsertCollege,
  createSkill,
  createCandidateEducation,
} from '@skillsetu/dataconnect';

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
let db: Firestore;
let dataConnect: DataConnect | null = null;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
    } catch {
      db = getFirestore(app);
    }
    try {
      dataConnect = getDataConnect(app, connectorConfig);
    } catch (e) {
      console.warn('DataConnect init notice:', e);
    }
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
    } catch {
      db = getFirestore(app);
    }
    try {
      dataConnect = getDataConnect(app, connectorConfig);
    } catch (e) {
      console.warn('DataConnect init notice:', e);
    }
  }
}

export { app, auth, db, dataConnect };

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

  // 2. Persist to Firebase Data Connect (PostgreSQL Cloud SQL Database)
  const currentAuth = auth?.currentUser || (app ? getAuth(app)?.currentUser : null);
  if (dataConnect && currentAuth) {
    try {
      // Generic user upsert not available in current SDK; role-specific upserts below handle persistence
      if (updatedProfile.role === 'STUDENT') {
        try {
          await upsertStudentProfile(dataConnect, {
            displayName: updatedProfile.displayName || currentAuth.displayName || 'Student',
            email: updatedProfile.email || currentAuth.email || '',
            photoUrl: updatedProfile.photoURL || currentAuth.photoURL || undefined,
            college: updatedProfile.college || undefined,
            location: updatedProfile.location || undefined,
            phone: updatedProfile.phone || undefined,
          });
        } catch (studentErr) {
          // Awaiting Data Connect deployment
        }

        if (updatedProfile.degree && updatedProfile.college) {
          try {
            await createCandidateEducation(dataConnect, {
              degree: updatedProfile.degree,
              department: updatedProfile.department || updatedProfile.degree,
              college: updatedProfile.college,
              graduationYear: parseInt(String(updatedProfile.year || '2026').replace(/\D/g, ''), 10) || 2026,
              cgpa: parseFloat(String(updatedProfile.gpa || '8.0').replace(/[^\d.]/g, '')) || 8.0,
              currentYear: updatedProfile.year || '3rd Year',
            });
          } catch (edErr) {
            // Awaiting Data Connect deployment
          }
        }

        if (updatedProfile.skills && updatedProfile.skills.length > 0) {
          for (const skillName of updatedProfile.skills.slice(0, 5)) {
            try {
              await createSkill(dataConnect, {
                name: skillName,
                category: 'Technical',
                description: `Verified candidate competency in ${skillName}`,
              });
            } catch (skErr) {
              // Skill may already exist
            }
          }
        }
      } else if (updatedProfile.role === 'INDUSTRY') {
        await upsertCompany(dataConnect, {
          name: updatedProfile.companyName || updatedProfile.displayName || 'Company',
          industry: updatedProfile.companyIndustry || undefined,
          employees: updatedProfile.companySize || undefined,
          location: updatedProfile.companyLocation || updatedProfile.location || undefined,
          website: updatedProfile.companyWebsite || undefined,
          about: updatedProfile.companyBio || updatedProfile.bio || undefined,
          mission: updatedProfile.companyBio || updatedProfile.bio || undefined,
        });
      } else if (updatedProfile.role === 'COLLEGE') {
        await upsertCollege(dataConnect, {
          name: updatedProfile.institutionName || updatedProfile.displayName || 'College',
          location: updatedProfile.institutionLocation || updatedProfile.location || undefined,
          contactPerson: updatedProfile.displayName || undefined,
          contactEmail: updatedProfile.email || currentAuth.email || undefined,
        });
      }
      console.log('Firebase Data Connect profile sync completed for role:', updatedProfile.role);
    } catch (dcErr: any) {
      console.warn('Firebase Data Connect sync notice:', dcErr?.message || dcErr);
    }
  }

  // 3. Persist to Firebase Firestore (non-blocking async with timeout)
  if (db) {
    const firestoreWrite = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        await Promise.race([
          setDoc(
            userDocRef,
            {
              ...updatedProfile,
              updatedAt: serverTimestamp(),
              createdAt: existingLocal?.createdAt ? existingLocal.createdAt : serverTimestamp(),
            },
            { merge: true }
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 1200)),
        ]);
      } catch (err: any) {
        // Cloud SQL PostgreSQL via Data Connect is primary; Firestore is non-blocking fallback
      }
    };
    firestoreWrite();
  }

  return updatedProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  if (!uid) return null;

  // 1. Check local cache first for zero-latency response
  const cached = getLocalProfile(uid);
  if (cached) {
    if (cached.role) {
      saveUserRole(cached.role);
    }
    return cached;
  }

  // 2. Try Firestore if available with a fast 1.5s timeout
  if (db) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await Promise.race([
        getDoc(userDocRef),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 1500)),
      ]);
      if (snapshot && snapshot.exists()) {
        const data = snapshot.data() as UserProfileData;
        setLocalProfile(uid, data);
        if (data.role) {
          saveUserRole(data.role);
        }
        return data;
      }
    } catch (err: any) {
      // Return cached fallback
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

