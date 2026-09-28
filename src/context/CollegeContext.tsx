'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CollegeProfileInfo,
  TrainingProgram,
  CampusAnnouncement,
  CollegeStudent,
  CollegeNotification,
  InternshipOpportunity,
  PlacementDrive
} from '@/types/college';
import {
  INITIAL_COLLEGE_PROFILE,
  INITIAL_TRAINING_PROGRAMS,
  INITIAL_ANNOUNCEMENTS,
  MOCK_STUDENTS,
  INITIAL_NOTIFICATIONS,
  MOCK_INTERNSHIPS,
  MOCK_PLACEMENT_DRIVES
} from '@/data/collegeData';
import {
  subscribeToSync,
  readNotificationsFor,
  consumeNotification,
} from '@/lib/syncBridge';
import {
  readCollegeInternshipsFromIndustry,
  readPlacementsFromIndustry,
  applyPlacementsToCollegeStudents,
  collegeTrainingToSignal,
} from '@/lib/syncConverters';
import { writeSyncRecord, SYNC_DOMAINS } from '@/lib/syncBridge';
import { useAuth } from '@/context/AuthContext';
import { saveUserProfile } from '@/lib/firebase';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CollegeContextType {
  isLoggedIn: boolean;
  profile: CollegeProfileInfo;
  trainingPrograms: TrainingProgram[];
  announcements: CampusAnnouncement[];
  students: CollegeStudent[];
  notifications: CollegeNotification[];
  internships: InternshipOpportunity[];
  placements: PlacementDrive[];
  toast: ToastState | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addTrainingProgram: (program: Omit<TrainingProgram, 'id' | 'enrolledStudents' | 'completionRate' | 'avgScore' | 'status'>) => void;
  addAnnouncement: (announcement: Omit<CampusAnnouncement, 'id' | 'datePosted' | 'status'>) => void;
  deleteAnnouncement: (id: string) => void;
  importStudents: (importedCount: number) => void;
  recommendInternship: (internshipId: string) => void;
  updateProfile: (updates: Partial<CollegeProfileInfo>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const CollegeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [profile, setProfile] = useState<CollegeProfileInfo>(INITIAL_COLLEGE_PROFILE);

  // Sync with Firebase Firestore profile
  useEffect(() => {
    if (userProfile && userProfile.role === 'COLLEGE') {
      setProfile((prev) => ({
        ...prev,
        institutionName: userProfile.institutionName || prev.institutionName,
        collegeId: userProfile.collegeCode || prev.collegeId,
        location: userProfile.institutionLocation || userProfile.location || prev.location,
        website: userProfile.institutionWebsite || prev.website,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        totalStudents: userProfile.totalStudents || prev.totalStudents,
        naacGrade: userProfile.naacGrade || prev.naacGrade,
        placementOfficer: {
          ...prev.placementOfficer,
          name: userProfile.displayName || prev.placementOfficer.name,
          title: userProfile.designation || prev.placementOfficer.title,
          email: userProfile.email || prev.placementOfficer.email,
          phone: userProfile.phone || prev.placementOfficer.phone,
        },
      }));
    }
  }, [userProfile]);

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(INITIAL_TRAINING_PROGRAMS);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [students, setStudents] = useState<CollegeStudent[]>(MOCK_STUDENTS);
  const [notifications, setNotifications] = useState<CollegeNotification[]>(INITIAL_NOTIFICATIONS);
  const [internships, setInternships] = useState<InternshipOpportunity[]>(MOCK_INTERNSHIPS);
  const [placements, setPlacements] = useState<PlacementDrive[]>(MOCK_PLACEMENT_DRIVES);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load persistence if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('skillsetu_college_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedAuth = localStorage.getItem('skillsetu_college_auth');
      if (savedAuth === 'true') setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // ------------------------------------------------------------------
  // Cross-sector sync (Industry -> College)
  // ------------------------------------------------------------------
  const syncRefresh = React.useCallback(() => {
    try {
      // 1. Pull internships published by the Industry portal
      const inboundInternships = readCollegeInternshipsFromIndustry();
      if (inboundInternships.length) {
        setInternships((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const fresh = inboundInternships.filter((i) => i && typeof i === 'object' && i.id && !ids.has(i.id));
          return fresh.length ? [...fresh, ...prev] : prev;
        });
      }

      // 2. Pull placements (accepted offers) from the Industry portal
      const inboundPlacements = readPlacementsFromIndustry();
      if (inboundPlacements.length) {
        setPlacements((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const fresh = inboundPlacements.filter((p) => p && typeof p === 'object' && p.id && !ids.has(p.id));
          return fresh.length ? [...fresh, ...prev] : prev;
        });
        // 3. Reflect placements on matching college students
        setStudents((prev) => applyPlacementsToCollegeStudents(prev, inboundPlacements));
      }

      // 4. Merge cross-sector notifications (new placement / MoU etc.)
      const inboundNotifs = readNotificationsFor('college');
      if (inboundNotifs.length) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const fresh = inboundNotifs
            .filter((n) => !existingIds.has(n.id))
            .map((n) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              time: n.time,
              read: !!n.read,
              type: 'internship' as const,
              link: n.link,
              targetRoute: n.link || '/college/dashboard',
            }));
          if (!fresh.length) return prev;
          const merged = [...fresh, ...prev];
          return merged;
        });
        inboundNotifs.forEach((n) => consumeNotification(n.id));
      }
    } catch (e) {
      console.warn('[Sync] College refresh failed safely:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    syncRefresh();
    return subscribeToSync(syncRefresh);
  }, [syncRefresh]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const login = (email: string, pass: string) => {
    if (email === 'admin@ayushcollege.edu' && pass === 'college123') {
      setIsLoggedIn(true);
      localStorage.setItem('skillsetu_college_auth', 'true');
      showToast('Welcome back, Dr. Priya Sharma!', 'success');
      return true;
    }
    // Allow demo login fallback as well
    setIsLoggedIn(true);
    localStorage.setItem('skillsetu_college_auth', 'true');
    showToast('Signed in to College Portal', 'success');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('skillsetu_college_auth');
    showToast('Signed out of College Portal', 'info');
  };

  const addTrainingProgram = (programData: Omit<TrainingProgram, 'id' | 'enrolledStudents' | 'completionRate' | 'avgScore' | 'status'>) => {
    const newProgram: TrainingProgram = {
      ...programData,
      id: `tp-new-${Date.now()}`,
      enrolledStudents: 0,
      completionRate: 0,
      avgScore: 0,
      status: 'Active',
    };
    setTrainingPrograms((prev) => [newProgram, ...prev]);
    // Publish training signal to Industry portal (curriculum readiness)
    try {
      const signal = collegeTrainingToSignal(newProgram);
      writeSyncRecord(SYNC_DOMAINS.COLLEGE_TRAINING, signal, {
        from: 'college',
        correlationId: `training-${newProgram.id}`,
      });
    } catch (e) {
      console.warn('[Sync] Failed to publish training signal:', e);
    }
    showToast(`Training Program "${newProgram.name}" created successfully!`, 'success');
  };

  const addAnnouncement = (announcementData: Omit<CampusAnnouncement, 'id' | 'datePosted' | 'status'>) => {
    const newAnnouncement: CampusAnnouncement = {
      ...announcementData,
      id: `anc-${Date.now()}`,
      datePosted: new Date().toISOString().split('T')[0],
      status: 'Published',
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    showToast(`Campus announcement published to ${newAnnouncement.targetAudience}.`, 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted', 'info');
  };

  const importStudents = (importedCount: number) => {
    setProfile((prev) => ({
      ...prev,
      totalStudents: prev.totalStudents + importedCount,
    }));
    showToast(`${importedCount} students imported successfully. Profiles & Skill scores updated.`, 'success');
  };

  const recommendInternship = (internshipId: string) => {
    const found = internships.find((i) => i.id === internshipId);
    const company = found ? found.company : 'Company';
    const role = found ? found.role : 'Internship';
    showToast(`Opportunity "${role} @ ${company}" recommended to 42 eligible students.`, 'success');
  };

  const updateProfile = (updates: Partial<CollegeProfileInfo>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('skillsetu_college_profile', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      if (user?.uid) {
        saveUserProfile(user.uid, {
          institutionName: next.institutionName,
          collegeCode: next.collegeId,
          institutionLocation: next.location,
          institutionWebsite: next.website,
          totalStudents: next.totalStudents,
          naacGrade: next.naacGrade,
          displayName: next.placementOfficer.name,
          designation: next.placementOfficer.title,
          phone: next.placementOfficer.phone,
        }).catch((err) => console.warn('Background Firestore profile sync error:', err));
      }
      return next;
    });
    showToast('College profile updated successfully', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <CollegeContext.Provider
      value={{
        isLoggedIn,
        profile,
        trainingPrograms,
        announcements,
        students,
        notifications,
        internships,
        placements,
        toast,
        login,
        logout,
        addTrainingProgram,
        addAnnouncement,
        deleteAnnouncement,
        importStudents,
        recommendInternship,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        showToast,
        clearToast,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
