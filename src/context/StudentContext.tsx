'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Skill,
  Opportunity,
  Application,
  Project,
  NotificationItem,
  CityLocation,
  OpportunityType,
} from '@/types/student';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SKILLS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_NOTIFICATIONS,
  CITIES_LIST,
} from '@/data/mockStudentData';
import { calculateHaversineDistance, computeOpportunityMatch } from '@/lib/matchUtils';
import {
  subscribeToSync,
  readNotificationsFor,
  consumeNotification,
} from '@/lib/syncBridge';
import {
  readStudentOpportunitiesFromIndustry,
  readApplicationUpdatesFromIndustry,
  mergeSyncNotifications,
  publishStudentApplication,
  industryStageToStudentStatus,
} from '@/lib/syncConverters';
import { fetchVerifiedJobsNearCity } from '@/lib/jobsApi';
import { useAuth } from '@/context/AuthContext';
import { saveUserProfile } from '@/lib/firebase';

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  skills: Skill[];
  getSkillById: (id: string) => Skill | undefined;
  toggleResourceCompletion: (skillId: string, resourceId: string) => void;
  verifySkill: (skillId: string, score: number) => boolean;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (oppId: string) => void;
  isOpportunitySaved: (oppId: string) => boolean;
  applications: Application[];
  submitApplication: (oppId: string) => boolean;
  projects: Project[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  cities: CityLocation[];
  selectedCity: CityLocation;
  setSelectedCityByName: (cityName: string) => void;
  userCoords: { lat: number; lng: number };
  isUsingGeolocation: boolean;
  requestUserLocation: () => Promise<boolean>;
  locationStatusMessage: string;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  selectedOpportunityType: OpportunityType | 'All';
  setSelectedOpportunityType: (type: OpportunityType | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  workModeFilter: 'All' | 'Remote' | 'Hybrid' | 'On-site';
  setWorkModeFilter: (mode: 'All' | 'Remote' | 'Hybrid' | 'On-site') => void;
  resetToDemo: () => void;
  liveApiLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();

  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_student_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // Sync profile when authenticated userProfile changes from Firebase Firestore
  useEffect(() => {
    if (userProfile && userProfile.role === 'STUDENT') {
      setProfile((prev) => ({
        ...prev,
        name: userProfile.displayName || prev.name,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        college: userProfile.college || prev.college,
        degree: userProfile.degree || prev.degree,
        year: userProfile.year || prev.year,
        gpa: userProfile.gpa || prev.gpa,
        careerGoal: userProfile.careerGoal || prev.careerGoal,
        location: userProfile.location || prev.location,
        bio: userProfile.bio || prev.bio,
        github: userProfile.github || prev.github,
        linkedin: userProfile.linkedin || prev.linkedin,
      }));
    }
  }, [userProfile]);

  // 2. Skills State
  const [skills, setSkills] = useState<Skill[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_student_skills');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_SKILLS;
  });

  // 3. Saved Opportunities IDs
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_saved_opps');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return ['opp-1', 'opp-4'];
  });

  // 4. Applications State
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_applications');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // 5. Projects
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);

  // 6. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_notifications');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Mirror of `notifications` for imperative access inside sync handlers.
  const notificationsRef = React.useRef<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

   // 6b. Cross-sector synced opportunities (published by the Industry portal)
  const [syncedOpportunities, setSyncedOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window !== 'undefined') {
      return readStudentOpportunitiesFromIndustry();
    }
    return [];
  });

  // 6c. Live API-fetched verified jobs
  const [liveApiJobs, setLiveApiJobs] = useState<Opportunity[]>([]);
  const [liveApiLoading, setLiveApiLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadLiveJobs = async () => {
      setLiveApiLoading(true);
      try {
        const city = CITIES_LIST[0].name;
        const jobs = await fetchVerifiedJobsNearCity(city, 20);
        setLiveApiJobs(jobs);
      } catch (e) {
        console.warn('[API] Failed to load verified jobs:', e);
        setLiveApiJobs([]);
      } finally {
        setLiveApiLoading(false);
      }
    };
    loadLiveJobs();
  }, []);

  // 7. Geolocation & City
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES_LIST[0]); // Bengaluru
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(CITIES_LIST[0].coordinates);
  const [isUsingGeolocation, setIsUsingGeolocation] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string>('Showing Bengaluru opportunities');
  const [searchRadius, setSearchRadius] = useState<number>(10); // 10 km default

  // 8. Filters
  const [selectedOpportunityType, setSelectedOpportunityType] = useState<OpportunityType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [workModeFilter, setWorkModeFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');

  // Persistence effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsetu_student_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsetu_student_skills', JSON.stringify(skills));
    }
  }, [skills]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsetu_saved_opps', JSON.stringify(savedOpportunityIds));
    }
  }, [savedOpportunityIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsetu_applications', JSON.stringify(applications));
    }
  }, [applications]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsetu_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // ------------------------------------------------------------------
  // Cross-sector sync subscription (Industry -> Student)
  // ------------------------------------------------------------------
  useEffect(() => {
    const refresh = () => {
      try {
        // 1. Pull fresh opportunities published by the Industry portal
        setSyncedOpportunities(readStudentOpportunitiesFromIndustry());

        // 2. Pull application stage updates (shortlist / reject / offer)
        const updates = readApplicationUpdatesFromIndustry();
        if (updates.length) {
          setApplications((prev) => {
            let changed = false;
            const next = prev.map((app) => {
              const update = updates.find(
                (u) => app.opportunityTitle.toLowerCase() === (u.jobTitle || '').toLowerCase()
              );
              if (!update) return app;
              const localStatus = industryStageToStudentStatus(update.stage);
              if (localStatus !== app.status) {
                changed = true;
                return { ...app, status: localStatus };
              }
              return app;
            });
            return changed ? next : prev;
          });
        }

        // 3. Merge cross-sector notifications (shortlist / offer / interview)
        const inboundNotifs = readNotificationsFor('student');
        if (inboundNotifs.length) {
          // Merge outside the state updater (avoids side-effects under StrictMode)
          const merged = mergeSyncNotifications(notificationsRef.current, inboundNotifs);
          notificationsRef.current = merged;
          setNotifications(merged);
          inboundNotifs.forEach((n) => consumeNotification(n.id));
        }
      } catch (e) {
        console.warn('[Sync] Student refresh failed safely:', e);
      }
    };

    refresh();
    return subscribeToSync(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Request browser geolocation
  const requestUserLocation = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatusMessage('Geolocation not supported. Please select your city.');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setIsUsingGeolocation(true);
          setLocationStatusMessage('Using live GPS location (You are here)');
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation denied or failed:', error.message);
          setIsUsingGeolocation(false);
          setLocationStatusMessage('Location unavailable. Selected: ' + selectedCity.name);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, [selectedCity.name]);

  const setSelectedCityByName = useCallback((cityName: string) => {
    const found = CITIES_LIST.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setSelectedCity(found);
      setUserCoords(found.coordinates);
      setIsUsingGeolocation(false);
      setLocationStatusMessage(`Selected city: ${found.name}`);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    (updates: Partial<StudentProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...updates };
        if (user?.uid) {
          saveUserProfile(user.uid, {
            displayName: next.name,
            phone: next.phone,
            college: next.college,
            degree: next.degree,
            year: next.year,
            gpa: next.gpa,
            careerGoal: next.careerGoal,
            location: next.location,
            bio: next.bio,
            github: next.github,
            linkedin: next.linkedin,
          }).catch((err) => console.warn('Background Firestore profile sync error:', err));
        }
        return next;
      });
    },
    [user]
  );

  // Toggle resource completion for a skill
  const toggleResourceCompletion = useCallback((skillId: string, resourceId: string) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id !== skillId) return skill;
        const updatedResources = skill.resources.map((res) => {
          if (res.id !== resourceId) return res;
          return { ...res, completed: !res.completed };
        });

        const completedCount = updatedResources.filter((r) => r.completed).length;
        const total = updatedResources.length || 1;
        const newProgress = Math.min(100, Math.round((completedCount / total) * 100));

        let newAssessStatus = skill.assessmentStatus;
        if (newProgress >= 80 && skill.assessmentStatus === 'locked') {
          newAssessStatus = 'ready';
        }

        return {
          ...skill,
          resources: updatedResources,
          progress: newProgress,
          assessmentStatus: newAssessStatus,
          learningStatus: newProgress === 100 ? 'completed' : 'in_progress',
        };
      })
    );
  }, []);

  // Verify skill upon passing assessment
  const verifySkill = useCallback((skillId: string, score: number): boolean => {
    const passed = score >= 70;
    if (passed) {
      // Trigger confetti celebration
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0D5C68', '#059669', '#10B981', '#F97316', '#3B82F6'],
        });
      }

      setSkills((prev) =>
        prev.map((skill) => {
          if (skill.id !== skillId) return skill;
          return {
            ...skill,
            isVerified: true,
            verifiedDate: new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            progress: 100,
            assessmentStatus: 'passed',
            learningStatus: 'completed',
            bestScore: Math.max(skill.bestScore || 0, score),
          };
        })
      );

      // Increase profile completion
      setProfile((prev) => ({
        ...prev,
        profileCompletion: Math.min(100, prev.profileCompletion + 7),
      }));

      // Add celebratory notification
      setNotifications((prev) => [
        {
          id: `notif-badge-${Date.now()}`,
          title: 'Skill Verified: Python Basic!',
          message: 'Congratulations Aarav! You earned the official SkillSetu Verified Badge. Opportunity matches have been upgraded.',
          time: 'Just now',
          read: false,
          type: 'badge',
          link: '/student/profile',
        },
        ...prev,
      ]);
    } else {
      setSkills((prev) =>
        prev.map((skill) => {
          if (skill.id !== skillId) return skill;
          return {
            ...skill,
            assessmentStatus: 'failed',
            bestScore: Math.max(skill.bestScore || 0, score),
          };
        })
      );
    }
    return passed;
  }, []);

  const getSkillById = useCallback(
    (id: string) => skills.find((s) => s.id === id),
    [skills]
  );

  // Save / Bookmark Opportunity
  const toggleSaveOpportunity = useCallback((oppId: string) => {
    setSavedOpportunityIds((prev) => {
      if (prev.includes(oppId)) {
        return prev.filter((id) => id !== oppId);
      } else {
        return [...prev, oppId];
      }
    });
  }, []);

  const isOpportunitySaved = useCallback(
    (oppId: string) => savedOpportunityIds.includes(oppId),
    [savedOpportunityIds]
  );

  // Submit Application
  const submitApplication = useCallback(
    (oppId: string): boolean => {
      const opp =
        INITIAL_OPPORTUNITIES.find((o) => o.id === oppId) ||
        syncedOpportunities.find((o) => o.id === oppId);
      if (!opp) return false;

      // Check if already applied (across both local & synced ids)
      const existing = applications.find((a) => a.opportunityId === oppId);
      if (existing) return true;

      const match = computeOpportunityMatch(opp, skills);

      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        company: opp.company,
        type: opp.type,
        location: opp.location,
        appliedDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Under Review',
        resumeUsed: 'Aarav_Sharma_Resume_2026.pdf',
        matchScoreAtApply: match.matchScore,
        stipend: opp.stipend,
      };

      setApplications((prev) => [newApp, ...prev]);

      // Publish to the Industry portal through the sync bridge
      try {
        publishStudentApplication(newApp, opp);
      } catch (e) {
        console.warn('[Sync] Failed to publish application:', e);
      }

      // Add notification
      setNotifications((prev) => [
        {
          id: `notif-app-${Date.now()}`,
          title: 'Application Submitted',
          message: `Your application for ${opp.title} at ${opp.company} was submitted successfully!`,
          time: 'Just now',
          read: false,
          type: 'opportunity',
          link: '/student/applications',
        },
        ...prev,
      ]);

      return true;
    },
    [applications, skills, syncedOpportunities]
  );

  // Notifications helpers
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Compute live opportunities with distances, skill match, and match boost
  const opportunities = useMemo(() => {
    const local = INITIAL_OPPORTUNITIES.map((opp) => {
      const distance = calculateHaversineDistance(
        userCoords.lat,
        userCoords.lng,
        opp.coordinates.lat,
        opp.coordinates.lng
      );

      const match = computeOpportunityMatch(opp, skills);

      return {
        ...opp,
        distanceKm: distance,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        isMatchBoosted: match.isMatchBoosted,
      };
    });

    // Cross-sector opportunities published by the Industry portal.
    const synced = syncedOpportunities
      .filter((o) => !local.some((loc) => loc.id === o.id))
      .map((opp) => {
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          opp.coordinates.lat,
          opp.coordinates.lng
        );

        const match = computeOpportunityMatch(opp, skills);

        return {
          ...opp,
          distanceKm: distance,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          isMatchBoosted: match.isMatchBoosted,
        };
      });

    // Live API-fetched verified jobs
    const apiJobs = liveApiJobs
      .filter((o) => !local.some((loc) => loc.id === o.id))
      .filter((o) => !synced.some((s) => s.id === o.id))
      .map((opp) => {
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          opp.coordinates.lat,
          opp.coordinates.lng
        );

        const match = computeOpportunityMatch(opp, skills);

        return {
          ...opp,
          distanceKm: distance,
          matchScore: match.matchScore !== undefined && match.matchScore > 0 ? match.matchScore : opp.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          isMatchBoosted: match.isMatchBoosted ?? opp.isMatchBoosted,
        };
      });

    return [...local, ...synced, ...apiJobs];
  }, [userCoords, skills, syncedOpportunities, liveApiJobs]);

  // Reset demo state
  const resetToDemo = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillsetu_student_profile');
      localStorage.removeItem('skillsetu_student_skills');
      localStorage.removeItem('skillsetu_saved_opps');
      localStorage.removeItem('skillsetu_applications');
      localStorage.removeItem('skillsetu_notifications');
    }
    setProfile(INITIAL_STUDENT_PROFILE);
    setSkills(INITIAL_SKILLS);
    setSavedOpportunityIds(['opp-1', 'opp-4']);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedCity(CITIES_LIST[0]);
    setUserCoords(CITIES_LIST[0].coordinates);
    setIsUsingGeolocation(false);
    setSearchRadius(10);
    setSelectedOpportunityType('All');
    setSearchQuery('');
    setWorkModeFilter('All');
  }, []);

  return (
    <StudentContext.Provider
      value={{
        profile,
        updateProfile,
        skills,
        getSkillById,
        toggleResourceCompletion,
        verifySkill,
        opportunities,
        savedOpportunityIds,
        toggleSaveOpportunity,
        isOpportunitySaved,
        applications,
        submitApplication,
        projects,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        cities: CITIES_LIST,
        selectedCity,
        setSelectedCityByName,
        userCoords,
        isUsingGeolocation,
        requestUserLocation,
        locationStatusMessage,
        searchRadius,
        setSearchRadius,
        selectedOpportunityType,
        setSelectedOpportunityType,
        searchQuery,
        setSearchQuery,
        workModeFilter,
        setWorkModeFilter,
        resetToDemo,
        liveApiLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
