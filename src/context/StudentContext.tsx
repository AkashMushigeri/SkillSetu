'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Skill,
  Opportunity,
  Application,
  Project,
  Certification,
  NotificationItem,
  CityLocation,
  OpportunityType,
  AssessmentEvaluationResult,
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
import { findCatalogSkill } from '@/data/skillsData';
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
import { fetchVerifiedJobsNearCity, fetchVerifiedOpportunitiesFromApi } from '@/lib/jobsApi';
import { useAuth } from '@/context/AuthContext';
import { saveUserProfile } from '@/lib/firebase';
import {
  fetchRemoteJobs,
  fetchRemoteInternships,
  syncApplicationToDataConnect,
} from '@/lib/dataConnectService';

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  skills: Skill[];
  getSkillById: (id: string) => Skill | undefined;
  addSkill: (skillData: {
    name: string;
    level: 'Basic' | 'Intermediate' | 'Advanced';
    category?: string;
    icon?: string;
  }) => { success: boolean; message: string; skill?: Skill };
  removeSkill: (skillId: string) => void;
  updateSkillLevel: (skillId: string, newLevel: 'Basic' | 'Intermediate' | 'Advanced') => void;
  toggleResourceCompletion: (skillId: string, resourceId: string) => void;
  verifySkill: (
    skillId: string,
    score: number,
    evaluationResult?: Partial<AssessmentEvaluationResult>
  ) => boolean;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (oppId: string) => void;
  isOpportunitySaved: (oppId: string) => boolean;
  applications: Application[];
  submitApplication: (oppId: string) => boolean;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  certifications: Certification[];
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (certId: string, updates: Partial<Certification>) => void;
  deleteCertification: (certId: string) => void;
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

export const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: '',
  name: '',
  degree: '',
  year: '',
  college: '',
  location: '',
  careerGoal: '',
  profileCompletion: 0,
  avatar: '',
  bio: '',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  gpa: '',
};

const getStorageKey = (base: string, uid?: string | null) => {
  if (uid) return `skillsetu_${uid}_${base}`;
  return `skillsetu_guest_${base}`;
};

const calculateProfileCompletion = (
  prof: Partial<StudentProfile>,
  projectsCount: number,
  skillsCount: number
): number => {
  let score = 0;
  if (prof.name && prof.name.trim() !== '' && prof.name !== 'Guest Student') score += 15;
  if (prof.email && prof.email.trim() !== '') score += 10;
  if (prof.phone && prof.phone.trim() !== '') score += 10;
  if ((prof.college && prof.college.trim() !== '') || (prof.education?.college?.institutionName && prof.education.college.institutionName.trim() !== '')) score += 15;
  if ((prof.degree && prof.degree.trim() !== '') || (prof.education?.college?.degree && prof.education.college.degree.trim() !== '')) score += 10;
  if ((prof.year && prof.year.trim() !== '') || (prof.education?.college?.academicYear && prof.education.college.academicYear.trim() !== '')) score += 10;
  if (prof.careerGoal && prof.careerGoal.trim() !== '') score += 10;
  if (prof.location && prof.location.trim() !== '') score += 10;
  if (prof.bio && prof.bio.trim() !== '') score += 10;
  if (projectsCount > 0) score += 5;
  if (skillsCount > 0) score += 5;

  // Contributing bonus for added PUC and School education
  if (prof.education?.puc?.institutionName && prof.education.puc.institutionName.trim() !== '') score += 5;
  if (prof.education?.school?.institutionName && prof.education.school.institutionName.trim() !== '') score += 5;

  return Math.min(100, score);
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();

  const isDemoUser =
    userProfile?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
    user?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
    user?.uid === 'demo_student';

  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Profile State - defaults to empty profile
  const [profile, setProfile] = useState<StudentProfile>(EMPTY_STUDENT_PROFILE);

  // 2. Skills State - defaults to empty array (0 skills)
  const [skills, setSkills] = useState<Skill[]>([]);

  // 3. Saved Opportunities IDs
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([]);

  // 4. Applications State
  const [applications, setApplications] = useState<Application[]>([]);

  // 5. Projects State (empty by default for real students, loaded from user storage)
  const [projects, setProjects] = useState<Project[]>([]);

  // 5b. Certifications State (empty by default for real students, loaded from user storage)
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // 6. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Mirror of `notifications` for imperative access inside sync handlers.
  const notificationsRef = React.useRef<NotificationItem[]>([]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // Load and sync data when user or auth profile changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDemo =
      userProfile?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
      user?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
      user?.uid === 'demo_student';

    if (isDemo) {
      setProfile(INITIAL_STUDENT_PROFILE);
      setSkills(INITIAL_SKILLS);
      setSavedOpportunityIds([]);
      setApplications(INITIAL_APPLICATIONS);
      setProjects(INITIAL_PROJECTS);
      setCertifications([]);
      setNotifications(INITIAL_NOTIFICATIONS);
      setIsHydrated(true);
      return;
    }

    if (user?.uid) {
      // Real user: Load their specific data isolated by user ID
      // 1. Profile
      try {
        const savedProfStr = localStorage.getItem(getStorageKey('profile', user.uid));
        if (savedProfStr) {
          const parsed: StudentProfile = JSON.parse(savedProfStr);
          if (parsed.name === 'Aarav Sharma' && userProfile?.displayName && userProfile.displayName !== 'Aarav Sharma') {
            parsed.name = userProfile.displayName;
          }
          parsed.profileCompletion = calculateProfileCompletion(parsed, projects.length, skills.filter(s => s.isVerified).length);
          setProfile(parsed);
        } else {
          const displayName = userProfile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
          const cleanProf: StudentProfile = {
            id: user.uid,
            name: displayName,
            email: userProfile?.email || user?.email || '',
            phone: userProfile?.phone || '',
            college: userProfile?.college || '',
            degree: userProfile?.degree || '',
            year: userProfile?.year || '',
            gpa: userProfile?.gpa || '',
            careerGoal: userProfile?.careerGoal || '',
            location: userProfile?.location || '',
            bio: userProfile?.bio || '',
            github: userProfile?.github || '',
            linkedin: userProfile?.linkedin || '',
            avatar: userProfile?.photoURL || user?.photoURL || '',
            education: userProfile?.education,
            profileCompletion: 0,
          };
          cleanProf.profileCompletion = calculateProfileCompletion(cleanProf, 0, 0);
          setProfile(cleanProf);
        }
      } catch (e) {
        console.warn('Error hydrating real profile:', e);
      }

      // 2. Skills
      try {
        const savedSkillsStr = localStorage.getItem(getStorageKey('skills', user.uid));
        if (savedSkillsStr) {
          const parsedSkills: Skill[] = JSON.parse(savedSkillsStr);
          setSkills(parsedSkills);
        } else if (userProfile?.skills && userProfile.skills.length > 0) {
          const initialUserSkills: Skill[] = userProfile.skills.map((skillName, idx) => {
            const catalogItem = findCatalogSkill(skillName);
            return {
              id: catalogItem ? catalogItem.id : `skill-user-${idx}-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              name: catalogItem ? catalogItem.name : skillName,
              tier: catalogItem ? catalogItem.tier : 'Intermediate',
              category: catalogItem ? catalogItem.category : 'Technical',
              icon: catalogItem ? catalogItem.icon : '💡',
              level: catalogItem ? catalogItem.level : 'Intermediate',
              progress: 0,
              isVerified: false,
              verifiedDate: undefined,
              learningStatus: 'not_started',
              assessmentStatus: 'ready',
              bestScore: undefined,
              description: catalogItem ? catalogItem.description : `Practical competency in ${skillName}.`,
              estimatedTime: catalogItem ? catalogItem.estimatedTime : '2-3 weeks',
              learningObjectives: catalogItem ? catalogItem.learningObjectives : [`Master foundations of ${skillName}`],
              resources: catalogItem ? catalogItem.resources.map(r => ({ ...r, completed: false })) : [],
              careerRoles: catalogItem ? catalogItem.careerRoles : ['Developer'],
              relatedOpportunityCount: catalogItem ? catalogItem.relatedOpportunityCount : 5,
            };
          });
          setSkills(initialUserSkills);
        } else {
          setSkills([]);
        }
      } catch (e) {
        console.warn('Error hydrating real skills:', e);
        setSkills([]);
      }

      // 3. Projects
      try {
        const savedProjStr = localStorage.getItem(getStorageKey('projects', user.uid));
        if (savedProjStr) {
          setProjects(JSON.parse(savedProjStr));
        } else {
          setProjects([]);
        }
      } catch {
        setProjects([]);
      }

      // 3b. Certifications
      try {
        const savedCertsStr = localStorage.getItem(getStorageKey('certifications', user.uid));
        if (savedCertsStr) {
          setCertifications(JSON.parse(savedCertsStr));
        } else {
          setCertifications([]);
        }
      } catch {
        setCertifications([]);
      }

      // 4. Applications
      try {
        const savedAppsStr = localStorage.getItem(getStorageKey('applications', user.uid));
        if (savedAppsStr) {
          setApplications(JSON.parse(savedAppsStr));
        } else {
          setApplications([]);
        }
      } catch {
        setApplications([]);
      }

      // 5. Saved Opportunities
      try {
        const savedOppsStr = localStorage.getItem(getStorageKey('saved_opps', user.uid));
        if (savedOppsStr) {
          setSavedOpportunityIds(JSON.parse(savedOppsStr));
        } else {
          setSavedOpportunityIds([]);
        }
      } catch {
        setSavedOpportunityIds([]);
      }

      // 6. Notifications
      try {
        const savedNotifsStr = localStorage.getItem(getStorageKey('notifications', user.uid));
        if (savedNotifsStr) {
          const parsed: NotificationItem[] = JSON.parse(savedNotifsStr);
          const clean = parsed.filter(n => !n.title.includes('Aarav') && !n.message.includes('Aarav') && !n.message.includes('Swiggy'));
          setNotifications(clean.length > 0 ? clean : [
            {
              id: `notif-welcome-${Date.now()}`,
              title: 'Welcome to SkillSetu!',
              message: 'Your student dashboard is active. Add your skills and complete assessments to get verified by top employers.',
              time: 'Just now',
              type: 'system',
              read: false,
              link: '/student/skills',
            }
          ]);
        } else {
          setNotifications([
            {
              id: `notif-welcome-${Date.now()}`,
              title: 'Welcome to SkillSetu!',
              message: 'Your student dashboard is active. Add your skills and complete assessments to get verified by top employers.',
              time: 'Just now',
              type: 'system',
              read: false,
              link: '/student/skills',
            }
          ]);
        }
      } catch {
        setNotifications([]);
      }
    } else {
      // Guest or logged-out user: clean zero / empty state
      setProfile(EMPTY_STUDENT_PROFILE);
      setSkills([]);
      setProjects([]);
      setCertifications([]);
      setApplications([]);
      setSavedOpportunityIds([]);
      setNotifications([]);
    }

    // Load synced opportunities from Industry portal
    const synced = readStudentOpportunitiesFromIndustry();
    if (synced && synced.length > 0) {
      setSyncedOpportunities(synced);
    }

    setIsHydrated(true);
  }, [user, userProfile]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // 6b. Cross-sector synced opportunities (published by the Industry portal)
  const [syncedOpportunities, setSyncedOpportunities] = useState<Opportunity[]>([]);

  // 6c. Live API-fetched verified jobs
  const [liveApiJobs, setLiveApiJobs] = useState<Opportunity[]>([]);
  const [liveApiLoading, setLiveApiLoading] = useState<boolean>(false);

  // 6d. Data Connect remote opportunities (PostgreSQL / PGlite)
  const [dataConnectOpportunities, setDataConnectOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchRemoteJobs(), fetchRemoteInternships()]).then(([jobsRes, internsRes]) => {
      if (isMounted) {
        const combined = [...jobsRes.opportunities, ...internsRes.opportunities];
        if (combined.length > 0) {
          setDataConnectOpportunities(combined);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadLiveJobs = async () => {
      setLiveApiLoading(true);
      try {
        const jobs = await fetchVerifiedOpportunitiesFromApi({ limit: 100 });
        if (isMounted) {
          setLiveApiJobs(jobs);
        }
      } catch (e) {
        console.warn('[API] Failed to load verified jobs:', e);
        if (isMounted) {
          setLiveApiJobs([]);
        }
      } finally {
        if (isMounted) {
          setLiveApiLoading(false);
        }
      }
    };
    loadLiveJobs();
    return () => {
      isMounted = false;
    };
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

  // Persistence effects - scoped to user ID (or guest)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('profile', user?.uid), JSON.stringify(profile));
  }, [profile, isHydrated, user?.uid, isDemoUser]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('skills', user?.uid), JSON.stringify(skills));
  }, [skills, isHydrated, user?.uid, isDemoUser]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('saved_opps', user?.uid), JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds, isHydrated, user?.uid, isDemoUser]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('applications', user?.uid), JSON.stringify(applications));
  }, [applications, isHydrated, user?.uid, isDemoUser]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('projects', user?.uid), JSON.stringify(projects));
  }, [projects, user?.uid, isHydrated, isDemoUser]);

  const addProject = useCallback((newProj: Omit<Project, 'id'>) => {
    const proj: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [proj, ...prev]);
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  // Certifications persistence & handlers
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('certifications', user?.uid), JSON.stringify(certifications));
  }, [certifications, user?.uid, isHydrated, isDemoUser]);

  const addCertification = useCallback((newCert: Omit<Certification, 'id'>) => {
    const cert: Certification = {
      ...newCert,
      id: `cert-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setCertifications((prev) => [cert, ...prev]);
  }, []);

  const updateCertification = useCallback((certId: string, updates: Partial<Certification>) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCertification = useCallback((certId: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== certId));
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (isDemoUser) return;
    localStorage.setItem(getStorageKey('notifications', user?.uid), JSON.stringify(notifications));
  }, [notifications, isHydrated, user?.uid, isDemoUser]);

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
        next.profileCompletion = calculateProfileCompletion(
          next,
          projects.length,
          skills.filter((s) => s.isVerified).length
        );
        if (user?.uid) {
          saveUserProfile(user.uid, {
            displayName: next.name,
            phone: next.phone,
            college: next.college,
            degree: next.degree,
            year: next.year,
            gpa: next.gpa,
            education: next.education,
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
    [user, projects.length, skills]
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

  // Verify skill upon passing assessment (non-downgrade: preserves higher score and status on retakes)
  const verifySkill = useCallback(
    (
      skillId: string,
      score: number,
      evaluationResult?: Partial<AssessmentEvaluationResult>
    ): boolean => {
      const passed = score >= 70;

      const rankProficiency = (lvl?: string): number => {
        if (!lvl) return 2;
        const l = lvl.toLowerCase().trim();
        if (l === 'expert') return 4;
        if (l === 'advanced') return 3;
        if (l === 'intermediate') return 2;
        return 1;
      };

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

            const currentRank = rankProficiency(skill.verifiedLevel);
            const newRank = rankProficiency(evaluationResult?.skillLevel);
            const bestLevel =
              newRank >= currentRank
                ? (evaluationResult?.skillLevel || (score >= 90 ? 'Advanced' : 'Intermediate'))
                : skill.verifiedLevel;

            return {
              ...skill,
              isVerified: true,
              progress: 100,
              verifiedDate:
                evaluationResult?.verifiedDate ||
                new Date().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }),
              verificationType: 'assessment_verified',
              verifiedScore: Math.max(skill.verifiedScore || 0, score),
              bestScore: Math.max(skill.bestScore || 0, score),
              verifiedLevel: bestLevel,
              evidenceSource: 'assessment',
              assessmentStatus: 'passed',
              learningStatus: 'completed',
              assessmentStrengths:
                evaluationResult?.strengths || ['Core conceptual proficiency', 'Applied syntax'],
              assessmentImprovements:
                evaluationResult?.areasForImprovement || ['Advanced system optimization'],
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
            title: 'Skill Assessment Verified!',
            message: `Congratulations ${profile.name ? profile.name.split(' ')[0] : 'Student'}! You earned the official SkillSetu Verified Badge. Opportunity matches have been upgraded.`,
            time: 'Just now',
            read: false,
            type: 'badge',
            link: '/student/profile',
          },
          ...prev,
        ]);
      } else {
        // Failed retake: preserve verified status and higher score if previously verified
        setSkills((prev) =>
          prev.map((skill) => {
            if (skill.id !== skillId) return skill;
            if (skill.isVerified) {
              return {
                ...skill,
                bestScore: Math.max(skill.bestScore || 0, score),
                assessmentImprovements:
                  evaluationResult?.areasForImprovement || skill.assessmentImprovements,
              };
            }
            return {
              ...skill,
              assessmentStatus: 'failed',
              bestScore: Math.max(skill.bestScore || 0, score),
            };
          })
        );
      }
      return passed;
    },
    [profile.name]
  );

  const getSkillById = useCallback(
    (id: string): Skill | undefined => {
      if (!id) return undefined;
      const lower = decodeURIComponent(id).toLowerCase().trim();
      const cleanLower = lower.replace(/[^a-z0-9]/g, '');

      const found =
        skills.find((s) => s.id === id) ||
        skills.find((s) => s.id.toLowerCase() === lower) ||
        skills.find((s) => s.name.toLowerCase() === lower) ||
        skills.find((s) => s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanLower) ||
        skills.find((s) => s.aliases?.some((a) => a.toLowerCase() === lower || a.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanLower));

      if (found) return found;

      const catalogItem = findCatalogSkill(id);
      if (!catalogItem) return undefined;

      return {
        id: catalogItem.id,
        name: catalogItem.name,
        tier: catalogItem.tier,
        category: catalogItem.category,
        icon: catalogItem.icon,
        level: catalogItem.level,
        progress: 0,
        isVerified: false,
        learningStatus: 'not_started' as const,
        assessmentStatus: 'ready' as const,
        description: catalogItem.description,
        estimatedTime: catalogItem.estimatedTime,
        learningObjectives: catalogItem.learningObjectives,
        resources: catalogItem.resources,
        careerRoles: catalogItem.careerRoles,
        relatedOpportunityCount: catalogItem.relatedOpportunityCount,
        aliases: catalogItem.aliases,
        relatedSkills: catalogItem.relatedSkills,
      };
    },
    [skills]
  );

  const addSkill = useCallback(
    (skillData: {
      name: string;
      level: 'Basic' | 'Intermediate' | 'Advanced';
      category?: string;
      icon?: string;
    }): { success: boolean; message: string; skill?: Skill } => {
      const trimmedName = skillData.name.trim();
      if (!trimmedName) {
        return { success: false, message: 'Skill name is required.' };
      }

      const cleanTarget = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Check if user already has this skill
      const existing = skills.find(
        (s) =>
          s.name.toLowerCase() === trimmedName.toLowerCase() ||
          s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget ||
          s.aliases?.some(
            (a) =>
              a.toLowerCase() === trimmedName.toLowerCase() ||
              a.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget
          )
      );

      if (existing) {
        return {
          success: false,
          message: `"${existing.name}" is already in your active skills with proficiency level "${existing.level}".`,
          skill: existing,
        };
      }

      const catalogItem = findCatalogSkill(trimmedName);

      const newSkill: Skill = {
        id: catalogItem ? catalogItem.id : `custom-${Date.now()}-${cleanTarget.slice(0, 10)}`,
        name: catalogItem ? catalogItem.name : trimmedName,
        tier: skillData.level,
        category: skillData.category || catalogItem?.category || 'General Technology',
        icon: skillData.icon || catalogItem?.icon || '💡',
        level: skillData.level,
        progress: 0,
        isVerified: false,
        learningStatus: 'not_started',
        assessmentStatus: 'ready',
        description:
          catalogItem?.description ||
          `Competency in ${trimmedName} (${skillData.level} Level) for software and technical roles.`,
        estimatedTime: catalogItem?.estimatedTime || '15 Hours',
        learningObjectives: catalogItem?.learningObjectives || [
          `Master core ${trimmedName} concepts and operational workflows`,
          `Complete hands-on exercises and real-world project challenges`,
          `Demonstrate capability in technical assessments and interviews`,
        ],
        resources: catalogItem?.resources || [
          {
            id: `res-${Date.now()}-1`,
            title: `${trimmedName} Comprehensive Guide & Architecture`,
            type: 'doc',
            duration: '30 min',
            completed: false,
            topic: 'Overview',
          },
          {
            id: `res-${Date.now()}-2`,
            title: `${trimmedName} Practical Hands-On Workshop`,
            type: 'practice',
            duration: '45 min',
            completed: false,
            topic: 'Workshop',
          },
        ],
        careerRoles: catalogItem?.careerRoles || ['Software Engineer', `${trimmedName} Specialist`],
        relatedOpportunityCount: catalogItem?.relatedOpportunityCount || 10,
        aliases: catalogItem?.aliases || [],
        relatedSkills: catalogItem?.relatedSkills || [],
      };

      setSkills((prev) => [newSkill, ...prev]);

      return {
        success: true,
        message: `Successfully added "${newSkill.name}" (${newSkill.level}) to your skills!`,
        skill: newSkill,
      };
    },
    [skills]
  );

  const removeSkill = useCallback((skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  }, []);

  const updateSkillLevel = useCallback(
    (skillId: string, newLevel: 'Basic' | 'Intermediate' | 'Advanced') => {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.id !== skillId) return s;
          return {
            ...s,
            level: newLevel,
            tier: newLevel,
          };
        })
      );
    },
    []
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
        liveApiJobs.find((o) => o.id === oppId) ||
        syncedOpportunities.find((o) => o.id === oppId) ||
        dataConnectOpportunities.find((o) => o.id === oppId);
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
        resumeUsed: `${(profile?.name || 'Candidate').replace(/\s+/g, '_')}_Resume_2026.pdf`,
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

      // Sync application to Firebase Data Connect in background
      syncApplicationToDataConnect({
        title: opp.title,
        jobType: opp.type,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        jobId: opp.id.startsWith('dc-') ? opp.id.replace('dc-', '') : undefined,
        internshipId: opp.id.startsWith('dc-int-') ? opp.id.replace('dc-int-', '') : undefined,
      });

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
    [applications, skills, syncedOpportunities, liveApiJobs, dataConnectOpportunities, profile]
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

      const match = computeOpportunityMatch(opp, skills, projects, profile);

      return {
        ...opp,
        distanceKm: distance,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        verifiedMatchedSkills: match.verifiedMatchedSkills,
        claimedMatchedSkills: match.claimedMatchedSkills,
        partialMatchedSkills: match.partialMatchedSkills,
        missingSkills: match.missingSkills,
        isMatchBoosted: match.isMatchBoosted,
        boostMessage: match.boostMessage,
        matchExplanation: match.matchExplanation,
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

        const match = computeOpportunityMatch(opp, skills, projects, profile);

        return {
          ...opp,
          distanceKm: distance,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          verifiedMatchedSkills: match.verifiedMatchedSkills,
          claimedMatchedSkills: match.claimedMatchedSkills,
          partialMatchedSkills: match.partialMatchedSkills,
          missingSkills: match.missingSkills,
          isMatchBoosted: match.isMatchBoosted,
          boostMessage: match.boostMessage,
          matchExplanation: match.matchExplanation,
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

        const match = computeOpportunityMatch(opp, skills, projects, profile);

        return {
          ...opp,
          distanceKm: distance,
          matchScore: match.matchScore !== undefined && match.matchScore > 0 ? match.matchScore : opp.matchScore,
          matchedSkills: match.matchedSkills,
          verifiedMatchedSkills: match.verifiedMatchedSkills,
          claimedMatchedSkills: match.claimedMatchedSkills,
          partialMatchedSkills: match.partialMatchedSkills,
          missingSkills: match.missingSkills,
          isMatchBoosted: match.isMatchBoosted ?? opp.isMatchBoosted,
          boostMessage: match.boostMessage,
          matchExplanation: match.matchExplanation,
        };
      });

    // Data Connect remote opportunities (PostgreSQL / PGlite)
    const remoteOpps = dataConnectOpportunities
      .filter((o) => !local.some((loc) => loc.id === o.id))
      .filter((o) => !synced.some((s) => s.id === o.id))
      .filter((o) => !apiJobs.some((a) => a.id === o.id))
      .map((opp) => {
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          opp.coordinates?.lat || 12.9716,
          opp.coordinates?.lng || 77.5946
        );

        const match = computeOpportunityMatch(opp, skills, projects, profile);

        return {
          ...opp,
          distanceKm: distance,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          verifiedMatchedSkills: match.verifiedMatchedSkills,
          claimedMatchedSkills: match.claimedMatchedSkills,
          partialMatchedSkills: match.partialMatchedSkills,
          missingSkills: match.missingSkills,
          isMatchBoosted: match.isMatchBoosted,
          boostMessage: match.boostMessage,
          matchExplanation: match.matchExplanation,
        };
      });

    return [...local, ...synced, ...remoteOpps, ...apiJobs];
  }, [userCoords, skills, projects, profile, syncedOpportunities, dataConnectOpportunities, liveApiJobs]);

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
    setSavedOpportunityIds([]);
    setApplications(INITIAL_APPLICATIONS);
    setProjects(INITIAL_PROJECTS);
    setCertifications([]);
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
        addSkill,
        removeSkill,
        updateSkillLevel,
        toggleResourceCompletion,
        verifySkill,
        opportunities,
        savedOpportunityIds,
        toggleSaveOpportunity,
        isOpportunitySaved,
        applications,
        submitApplication,
        projects,
        addProject,
        updateProject,
        deleteProject,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
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
