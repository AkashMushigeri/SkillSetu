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
  AssessmentQuestion,
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
import { calculateHaversineDistance, computeOpportunityMatch } from '@/lib/matchUtils';
import { getCanonicalSkillName, matchSkillNames } from '@/lib/skillNormalization';
import { isResumeSkill, replaceResumeSkills } from '@/lib/resumeSkillMapping';
import type { ResumeCandidateSkill } from '@/lib/resumeAnalysis';
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
import {
  fetchRemoteJobs,
  fetchRemoteInternships,
  syncApplicationToDataConnect,
  syncCandidateSkillToDataConnect,
} from '@/lib/dataConnectService';
import {
  subscribeToRealtimeNotifications,
  publishRealtimeNotification,
} from '@/lib/realtimeNotifications';

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  skills: Skill[];
  syncResumeSkills: (items: Pick<ResumeCandidateSkill, 'value' | 'evidence' | 'source'>[]) => Promise<{ synced: number; attempted: number }>;
  getSkillById: (id: string) => Skill | undefined;
  toggleResourceCompletion: (skillId: string, resourceId: string) => void;
  verifySkill: (
    skillId: string,
    score: number,
    evaluationResult?: Partial<AssessmentEvaluationResult>
  ) => boolean;
  updateSkillQuestions: (skillId: string, questions: AssessmentQuestion[]) => void;
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

const calculateProfileCompletion = (
  prof: Partial<StudentProfile>,
  projectsCount: number,
  skillsCount: number
): number => {
  let score = 0;
  if (prof.name) score += 15;
  if (prof.email) score += 10;
  if (prof.phone) score += 10;
  if (prof.college || prof.education?.college?.institutionName) score += 15;
  if (prof.degree || prof.education?.college?.degree) score += 10;
  if (prof.year || prof.education?.college?.academicYear) score += 10;
  if (prof.careerGoal) score += 10;
  if (prof.location) score += 10;
  if (prof.bio) score += 10;
  if (projectsCount > 0) score += 5;
  if (skillsCount > 0) score += 5;

  // Contributing bonus for added PUC and School education
  if (prof.education?.puc?.institutionName) score += 5;
  if (prof.education?.school?.institutionName) score += 5;

  return Math.min(100, score);
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDemoUser =
    userProfile?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
    user?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
    user?.uid === 'demo_student';

  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_student_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // 2. Skills State
  const [skills, setSkills] = useState<Skill[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_student_skills');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return INITIAL_SKILLS;
  });
  const [skillsLoadedFor, setSkillsLoadedFor] = useState<string | null>(null);

  // 3. Saved Opportunities IDs
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_saved_opps');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  // 4. Applications State
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_applications');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  // 5. Projects State (empty by default for real students, loaded from user storage)
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_student_projects');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });
  const projectsRef = React.useRef(projects);
  const skillsRef = React.useRef(skills);
  useEffect(() => {
    projectsRef.current = projects;
    skillsRef.current = skills;
  }, [projects, skills]);

  // Sync profile & user data when authenticated userProfile changes from Firebase
  useEffect(() => {
    const isDemo =
      userProfile?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
      user?.email?.toLowerCase() === 'aarav.sharma@rvce.edu.in' ||
      user?.uid === 'demo_student';

    if (userProfile && userProfile.role === 'STUDENT') {
      const displayName =
        userProfile.displayName ||
        user?.displayName ||
        (userProfile.email ? userProfile.email.split('@')[0] : 'Student');

      setProfile((prev) => {
        const isDefaultMock =
          prev.name === 'Aarav Sharma' ||
          prev.id === 'GAT054-STD-2026' ||
          prev.email === 'aarav.sharma@rvce.edu.in';
        const shouldResetMock = !isDemo && isDefaultMock;

        const updated: StudentProfile = {
          ...prev,
          id: userProfile.uid || user?.uid || prev.id,
          name: displayName,
          email: userProfile.email || user?.email || (shouldResetMock ? '' : prev.email),
          phone:
            userProfile.phone !== undefined && userProfile.phone !== ''
              ? userProfile.phone
              : shouldResetMock
              ? ''
              : prev.phone,
          college:
            userProfile.college !== undefined && userProfile.college !== ''
              ? userProfile.college
              : shouldResetMock
              ? ''
              : prev.college,
          degree:
            userProfile.degree !== undefined && userProfile.degree !== ''
              ? userProfile.degree
              : shouldResetMock
              ? 'B.Tech'
              : prev.degree,
          year:
            userProfile.year !== undefined && userProfile.year !== ''
              ? userProfile.year
              : shouldResetMock
              ? '3rd Year'
              : prev.year,
          gpa:
            userProfile.gpa !== undefined && userProfile.gpa !== ''
              ? userProfile.gpa
              : shouldResetMock
              ? ''
              : prev.gpa,
          careerGoal:
            userProfile.careerGoal !== undefined && userProfile.careerGoal !== ''
              ? userProfile.careerGoal
              : shouldResetMock
              ? 'Software Development'
              : prev.careerGoal,
          location:
            userProfile.location !== undefined && userProfile.location !== ''
              ? userProfile.location
              : shouldResetMock
              ? 'Bengaluru'
              : prev.location,
          bio:
            userProfile.bio !== undefined && userProfile.bio !== ''
              ? userProfile.bio
              : shouldResetMock
              ? ''
              : prev.bio,
          github:
            userProfile.github !== undefined && userProfile.github !== ''
              ? userProfile.github
              : shouldResetMock
              ? ''
              : prev.github,
          linkedin:
            userProfile.linkedin !== undefined && userProfile.linkedin !== ''
              ? userProfile.linkedin
              : shouldResetMock
              ? ''
              : prev.linkedin,
          avatar: userProfile.photoURL || user?.photoURL || (shouldResetMock ? '' : prev.avatar),
          education: userProfile.education || prev.education,
          profileCompletion: 0,
        };

        updated.profileCompletion = calculateProfileCompletion(
          updated,
          projectsRef.current.length,
          skillsRef.current.filter((s) => s.isVerified).length
        );

        return updated;
      });

      // Sync skills from student onboarding
      if (userProfile.skills && userProfile.skills.length > 0) {
        setSkills(() => {
          const userSkillNames = userProfile.skills || [];
          const icons = ['💻', '⚡', '🚀', '🧠', '🛠️', '🌐', '📊', '🔍', '⚙️', '📱'];
          return userSkillNames.map((skillName, idx) => ({
            id: `skill-user-${idx}-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: skillName,
            tier: 'Intermediate' as const,
            category: 'Technical',
            icon: icons[idx % icons.length],
            level: 'Intermediate',
            progress: 0,
            isVerified: false,
            verifiedDate: undefined,
            learningStatus: 'not_started' as const,
            assessmentStatus: 'ready' as const,
            bestScore: undefined,
            description: `Practical competency and applied proficiency in ${skillName}.`,
            estimatedTime: '2-3 weeks',
            learningObjectives: [
              `Master foundational principles of ${skillName}`,
              `Complete applied industry challenge tasks`,
              `Pass verified proctored assessment`,
            ],
            resources: [
              { id: `r-${idx}-1`, title: `${skillName} Applied Fundamentals`, type: 'doc' as const, duration: '45 mins', completed: false, url: '#' },
              { id: `r-${idx}-2`, title: `Industry Projects with ${skillName}`, type: 'video' as const, duration: '1.5 hrs', completed: false, url: '#' },
            ],
            careerRoles: ['Software Engineer', 'Full-Stack Developer', 'Specialist'],
            relatedOpportunityCount: 6,
          }));
        });
      }
    }

    if (isDemo) {
      setProjects((prev) => (prev.length === 0 ? INITIAL_PROJECTS : prev));
      setApplications((prev) => (prev.length === 0 ? INITIAL_APPLICATIONS : prev));
      setSavedOpportunityIds((prev) => (prev.length === 0 ? ['opp-1', 'opp-4'] : prev));
    } else if (user?.uid) {
      // Real user: Load their specific data without Aarav's fake projects & applications
      try {
        const safeParseArray = <T,>(raw: string | null, fallback: T[]): T[] => {
          if (!raw) return fallback;
          try {
            const val = JSON.parse(raw);
            return Array.isArray(val) ? val : fallback;
          } catch {
            return fallback;
          }
        };

        const userProjectsKey = `skillsetu_student_projects_${user.uid}`;
        const savedProjects = localStorage.getItem(userProjectsKey);
        if (savedProjects) {
          setProjects(safeParseArray(savedProjects, []));
        } else {
          setProjects([]);
          localStorage.setItem(userProjectsKey, JSON.stringify([]));
          localStorage.setItem('skillsetu_student_projects', JSON.stringify([]));
        }

        const userAppsKey = `skillsetu_applications_${user.uid}`;
        const savedApps = localStorage.getItem(userAppsKey);
        if (savedApps) {
          setApplications(safeParseArray(savedApps, []));
        } else {
          setApplications([]);
          localStorage.setItem(userAppsKey, JSON.stringify([]));
          localStorage.setItem('skillsetu_applications', JSON.stringify([]));
        }

        const userSavedKey = `skillsetu_saved_opps_${user.uid}`;
        const savedOpps = localStorage.getItem(userSavedKey);
        if (savedOpps) {
          setSavedOpportunityIds(safeParseArray(savedOpps, []));
        } else {
          setSavedOpportunityIds([]);
          localStorage.setItem(userSavedKey, JSON.stringify([]));
          localStorage.setItem('skillsetu_saved_opps', JSON.stringify([]));
        }

        const userSkillsKey = `skillsetu_student_skills_${user.uid}`;
        const savedSkills = localStorage.getItem(userSkillsKey);
        if (savedSkills) {
          try {
            const parsed: Skill[] = JSON.parse(savedSkills);
            const savedMap = new Map(parsed.map((s) => [s.id, s]));
            const merged = INITIAL_SKILLS.map((initSkill) => {
              const saved = savedMap.get(initSkill.id);
              return saved ? { ...initSkill, ...saved } : initSkill;
            });
            parsed.forEach((s) => {
              if (!merged.some((m) => m.id === s.id)) {
                merged.push(s);
              }
            });
            setSkills(merged);
          } catch {
            setSkills(INITIAL_SKILLS);
          }
        } else if (!userProfile?.skills || userProfile.skills.length === 0) {
          // Clean curriculum skills without fake 80% progress
          setSkills(
            INITIAL_SKILLS.map((s) => ({
              ...s,
              progress: 0,
              isVerified: false,
              verifiedDate: undefined,
              learningStatus: 'not_started' as const,
              assessmentStatus: 'ready' as const,
              bestScore: undefined,
              resources: (s.resources || []).map((r) => ({ ...r, completed: false })),
            }))
          );
        }
        setSkillsLoadedFor(user.uid);

        setNotifications((prev) => {
          const hasMock = prev.some((n) => n.title.includes('Aarav') || n.message.includes('Aarav'));
          if (hasMock || prev.length === 0) {
            return [
              {
                id: `notif-welcome-${Date.now()}`,
                title: 'Welcome to SkillSetu!',
                message: 'Your student profile is active. Add your projects and take skill assessments to get verified by top employers.',
                time: 'Just now',
                type: 'system',
                read: false,
                link: '/student/skills',
              },
            ];
          }
          return prev;
        });
      } catch (e) {
        console.warn('Error syncing real user isolated state:', e);
      }
    }
  }, [user, userProfile]);

  // 6. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu_notifications');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
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
  }, [profile.name]);

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
      if (user?.uid && skillsLoadedFor === user.uid) {
        localStorage.setItem(`skillsetu_student_skills_${user.uid}`, JSON.stringify(skills));
      }
    }
  }, [skills, skillsLoadedFor, user?.uid]);

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
      if (user?.uid) {
        localStorage.setItem(`skillsetu_student_projects_${user.uid}`, JSON.stringify(projects));
      }
      localStorage.setItem('skillsetu_student_projects', JSON.stringify(projects));
    }
  }, [projects, user?.uid]);

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
    const unsubSync = subscribeToSync(refresh);
    const unsubRealtime = subscribeToRealtimeNotifications('student', (realtimeNotif) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === realtimeNotif.id)) return prev;
        const newNotif: NotificationItem = {
          id: realtimeNotif.id,
          title: realtimeNotif.title,
          message: realtimeNotif.message,
          time: realtimeNotif.time || 'Just now',
          read: false,
          type: realtimeNotif.type === 'offer' ? 'opportunity' : 'system',
          link: realtimeNotif.link || '/student/applications',
        };
        return [newNotif, ...prev];
      });
    });

    return () => {
      unsubSync();
      unsubRealtime();
    };
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

  const syncResumeSkills = useCallback(async (items: Pick<ResumeCandidateSkill, 'value' | 'evidence' | 'source'>[]) => {
    const accepted = items.map((item) => ({
      name: item.value.trim().slice(0, 80),
      evidence: item.evidence.trim().slice(0, 180),
      source: item.source === 'Technology' ? 'Technology' as const : 'Skill' as const,
    })).filter((item) => item.name && item.evidence)
      .filter((item, index, all) => all.findIndex((other) => getCanonicalSkillName(other.name) === getCanonicalSkillName(item.name)) === index);
    const previousResume = skills.filter(isResumeSkill);

    const next = replaceResumeSkills(skills, accepted);
    setSkills(next);
    if (user?.uid && typeof window !== 'undefined') {
      localStorage.setItem(`skillsetu_student_skills_${user.uid}`, JSON.stringify(next));
    }

    if (user?.uid) {
      const oldResumeOnly = new Set(previousResume.filter((skill) => !skill.isVerified && (skill.resources?.length ?? 0) === 0)
        .map((skill) => getCanonicalSkillName(skill.name)));
      const namesToSave = [...(userProfile?.skills || []).filter((name) => !oldResumeOnly.has(getCanonicalSkillName(name))), ...accepted.map((item) => item.name)];
      const unique = namesToSave.filter((name, index) => namesToSave.findIndex((other) => getCanonicalSkillName(other) === getCanonicalSkillName(name)) === index);
      await saveUserProfile(user.uid, { skills: unique }).catch((error) => console.warn('Resume skills profile sync failed:', error));
    }

    const toSync = accepted.filter((item) => !skills.some((skill) =>
      skill.isVerified && getCanonicalSkillName(skill.name) === getCanonicalSkillName(item.name)
    ));
    // ponytail: Data Connect has no source-aware delete mutation; old cloud skill rows may remain until that schema is added.
    if (!user?.uid || isDemoUser) return { synced: 0, attempted: toSync.length };
    const results = await Promise.all(toSync.map((item) =>
      syncCandidateSkillToDataConnect(user.uid, item.name, 'Basic')
    ));
    return { synced: results.filter(Boolean).length, attempted: toSync.length };
  }, [isDemoUser, skills, user?.uid, userProfile?.skills]);

  // Toggle resource completion for a skill
  const toggleResourceCompletion = useCallback((skillId: string, resourceId: string) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id !== skillId) return skill;
        const updatedResources = (skill.resources || []).map((res) => {
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
    (id: string) => {
      if (!id) return undefined;
      const rawId = (() => {
        try {
          return decodeURIComponent(id);
        } catch {
          return id;
        }
      })();
      const cleanId = rawId.trim().toLowerCase();
      // 1. Direct match
      const exact = skills.find((s) => s.id === id || s.id.toLowerCase() === cleanId);
      if (exact) return exact;

      // 2. Suffix matching (e.g. 'python' -> 'python-basic', 'react' -> 'react-int')
      const byTierSuffix = skills.find(
        (s) =>
          s.id.toLowerCase() === `${cleanId}-basic` ||
          s.id.toLowerCase() === `${cleanId}-int` ||
          s.id.toLowerCase() === `${cleanId}-adv`
      );
      if (byTierSuffix) return byTierSuffix;

      // 3. Resume prefix / suffix matching
      const byResume = skills.find(
        (s) =>
          s.id.toLowerCase() === `resume-${cleanId}` ||
          s.id.toLowerCase().replace(/^resume-/, '') === cleanId
      );
      if (byResume) return byResume;

      // 4. Canonical name match
      const canonicalTarget = getCanonicalSkillName(cleanId);
      const byCanonical = skills.find(
        (s) => getCanonicalSkillName(s.name) === canonicalTarget || matchSkillNames(s.name, cleanId)
      );
      if (byCanonical) return byCanonical;

      // 5. Normalized name match (e.g. 'C++' <-> 'cplusplus')
      const normalized = cleanId.replace(/[^a-z0-9]/g, '');
      const byNormalizedName = skills.find(
        (s) => s.name.toLowerCase() === cleanId || s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
      );
      if (byNormalizedName) return byNormalizedName;

      // 6. Fallback substring match
      return skills.find(
        (s) => s.name.toLowerCase().includes(cleanId) || cleanId.includes(s.name.toLowerCase())
      );
    },
    [skills]
  );

  const updateSkillQuestions = useCallback((skillId: string, questions: AssessmentQuestion[]) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (
          s.id === skillId ||
          getCanonicalSkillName(s.name) === getCanonicalSkillName(skillId) ||
          matchSkillNames(s.name, skillId)
        ) {
          return {
            ...s,
            assessmentQuestions: questions,
            assessmentStatus: s.assessmentStatus === 'locked' ? 'ready' : s.assessmentStatus,
          };
        }
        return s;
      })
    );
  }, []);

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
        syncedOpportunities.find((o) => o.id === oppId) ||
        dataConnectOpportunities.find((o) => o.id === oppId) ||
        liveApiJobs.find((o) => o.id === oppId);
      if (!opp) return false;

      // Check if already applied (across both local & synced ids)
      const existing = applications.find((a) => a.opportunityId === oppId ||
        (opp.dataConnectId && a.dataConnectId === opp.dataConnectId));
      if (existing) return true;

      const match = computeOpportunityMatch(opp, skills);

      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        companyId: opp.companyId || `comp-${opp.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        dataConnectId: opp.dataConnectId,
        applicationUrl: opp.applicationUrl,
        companyWebsite: opp.companyWebsite,
        employerVerified: opp.employerVerified ?? true,
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

      // Only a Data Connect listing has a verified employer to receive a cloud application.
      if (opp.companyId && opp.dataConnectId) {
        const isInternship = opp.type === 'Internship';
        void syncApplicationToDataConnect({
          opportunityKey: `${isInternship ? 'dc-int' : 'dc'}-${opp.dataConnectId}`,
          companyId: opp.companyId,
          opportunityId: opp.dataConnectId,
          opportunityType: isInternship ? 'internship' : 'job',
          title: opp.title,
          jobType: opp.type,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          jobId: isInternship ? undefined : opp.dataConnectId,
          internshipId: isInternship ? opp.dataConnectId : undefined,
        });
      }

      // Broadcast real-time notification to Industry recruiters across devices
      publishRealtimeNotification({
        target: 'industry',
        type: 'application',
        title: 'New Candidate Application',
        message: `${profile?.name || 'Aarav Sharma'} applied for "${opp.title}" (${match.matchScore}% Match)`,
        link: '/industry/pipeline',
        read: false,
        meta: {
          opportunityId: opp.id,
          studentName: profile?.name || 'Aarav Sharma',
          matchScore: String(match.matchScore),
        },
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
    [applications, skills, syncedOpportunities, dataConnectOpportunities, liveApiJobs, profile]
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
    const distanceTo = (opp: Opportunity) => opp.coordinates
      ? calculateHaversineDistance(userCoords.lat, userCoords.lng, opp.coordinates.lat, opp.coordinates.lng)
      : undefined;
    const local = INITIAL_OPPORTUNITIES.map((opp) => {
      const distance = distanceTo(opp);

      const match = computeOpportunityMatch(opp, skills, projects, profile);

      return {
        ...opp,
        companyId: opp.companyId || `comp-${opp.id}`,
        employerVerified: opp.employerVerified ?? true,
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
      .filter((o) => !o.dataConnectId || !dataConnectOpportunities.some((remote) => remote.dataConnectId === o.dataConnectId))
      .map((opp) => {
        const distance = distanceTo(opp);

        const match = computeOpportunityMatch(opp, skills, projects, profile);

        return {
          ...opp,
          companyId: opp.companyId || `comp-${opp.id}`,
          employerVerified: true,
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
        const distance = distanceTo(opp);

        const match = computeOpportunityMatch(opp, skills, projects, profile);

        return {
          ...opp,
          companyId: opp.companyId || `comp-${opp.id}`,
          employerVerified: opp.employerVerified ?? true,
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
        const distance = distanceTo(opp);

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
      if (user?.uid) localStorage.removeItem(`skillsetu_student_skills_${user.uid}`);
      localStorage.removeItem('skillsetu_saved_opps');
      localStorage.removeItem('skillsetu_applications');
      localStorage.removeItem('skillsetu_notifications');
    }
    setProfile(INITIAL_STUDENT_PROFILE);
    setSkillsLoadedFor(null);
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
  }, [user?.uid]);

  return (
    <StudentContext.Provider
      value={{
        profile,
        updateProfile,
        skills,
        syncResumeSkills,
        getSkillById,
        toggleResourceCompletion,
        verifySkill,
        updateSkillQuestions,
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
      {mounted ? children : null}
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
