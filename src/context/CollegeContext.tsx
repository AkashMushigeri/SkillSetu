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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [profile, setProfile] = useState<CollegeProfileInfo>(INITIAL_COLLEGE_PROFILE);
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
