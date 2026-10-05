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
  SkillProficiencyLevel,
  SkillTier,
  SkillVerificationType,
  SkillEvidenceSource,
  LearningResource,
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
import { resolveOpportunityCoordinates } from '@/lib/geoUtils';
import { fetchVerifiedJobsNearCity } from '@/lib/jobsApi';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/apiClient';
import {
  studentProfile as studentProfileApi,
  skills as skillsApi,
  opportunities as opportunitiesApi,
  studentApplications as applicationsApi,
  saved as savedApi,
  notifications as notificationsApi,
  identity as identityApi,
} from '@/lib/domainApi';
import { resolveSkillUuid, UnresolvedSkillError } from '@/lib/skillCatalog';

interface StudentContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  skills: Skill[];
  getSkillById: (id: string) => Skill | undefined;
  /**
   * Skill mutations are server writes now, so they resolve asynchronously.
   * `addSkill` reports why it refused rather than throwing, because the profile
   * screen renders the message inline; the rest report completion via the
   * promise and roll back their optimistic update on rejection.
   */
  addSkill: (skillData: {
    name: string;
    level: 'Basic' | 'Intermediate' | 'Advanced';
    category?: string;
    icon?: string;
  }) => Promise<{ success: boolean; message: string; skill?: Skill }>;
  removeSkill: (skillId: string) => Promise<void>;
  updateSkillLevel: (skillId: string, newLevel: 'Basic' | 'Intermediate' | 'Advanced') => Promise<void>;
  toggleResourceCompletion: (skillId: string, resourceId: string) => Promise<void>;
  /**
   * Resolves `true` only when the attempt passed *and* the server accepted the
   * verification. A network or 4xx failure resolves `false` so no caller shows
   * a badge the database does not have.
   */
  verifySkill: (
    skillId: string,
    score: number,
    evaluationResult?: Partial<AssessmentEvaluationResult>
  ) => Promise<boolean>;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (oppId: string) => Promise<void>;
  isOpportunitySaved: (oppId: string) => boolean;
  applications: Application[];
  /**
   * Now server-backed, so it resolves asynchronously. The signature stays
   * `Promise<boolean>` rather than being narrowed to `boolean`: callers that
   * ignore the result still compile, and a caller that awaits it learns whether
   * the server actually accepted the application instead of being told
   * optimistically.
   */
  submitApplication: (oppId: string) => Promise<boolean>;
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

/**
 * One row of `GET /api/student/skills` in the shape the UI consumes.
 *
 * Documented instead of typed as an interface because the point of this
 * function is to be the single place that knows the column names. The previous
 * code cast the response straight to `Skill[]`, which typechecked because of
 * `as unknown as` and then failed at runtime: the row carries `skill_id`, not
 * `id`, and `learning_status`, not `learningStatus`. Every `skill.id` lookup in
 * the app — the detail route, the level dropdown, the material toggle, the
 * delete button — was reading `undefined` and silently doing nothing.
 */
type UserSkillRow = {
  skill_id: string;
  slug?: string | null;
  name?: string | null;
  tier?: string | null;
  category?: string | null;
  icon?: string | null;
  description?: string | null;
  learning_objectives?: string[] | null;
  career_roles?: string[] | null;
  progress?: number | null;
  learning_status?: string | null;
  assessment_status?: string | null;
  is_verified?: boolean | null;
  verified_at?: string | null;
  verification_type?: string | null;
  verified_level?: string | null;
  evidence_source?: string | null;
  best_score?: number | null;
  assessment_strengths?: string[] | null;
  assessment_improvements?: string[] | null;
  added_at?: string | null;
  resources?: Array<{
    id: string;
    uuid?: string;
    title?: string | null;
    type?: string | null;
    duration?: string | null;
    url?: string | null;
    topic?: string | null;
    completed?: boolean | null;
  }> | null;
};

const toTitleCaseLevel = (value?: string | null): SkillProficiencyLevel => {
  const v = (value ?? '').toLowerCase();
  if (v === 'expert') return 'Expert';
  if (v === 'advanced') return 'Advanced';
  if (v === 'beginner') return 'Beginner';
  return 'Intermediate';
};

const toSkillTier = (value?: string | null): SkillTier => {
  const v = (value ?? '').toLowerCase();
  if (v === 'advanced') return 'Advanced';
  if (v === 'intermediate') return 'Intermediate';
  return 'Basic';
};

const toLearningStatus = (value?: string | null): Skill['learningStatus'] =>
  value === 'completed' || value === 'in_progress' ? value : 'not_started';

const toAssessmentStatus = (value?: string | null): Skill['assessmentStatus'] =>
  value === 'passed' || value === 'failed' || value === 'locked' ? value : 'ready';

const toVerificationType = (
  value?: string | null,
): SkillVerificationType | undefined =>
  value === 'claimed' ||
  value === 'assessment_verified' ||
  value === 'registry_verified' ||
  value === 'resume_extracted'
    ? value
    : undefined;

const toEvidenceSource = (value?: string | null): SkillEvidenceSource | undefined =>
  value === 'self_declared' ||
  value === 'resume' ||
  value === 'assessment' ||
  value === 'project' ||
  value === 'certification'
    ? value
    : undefined;

/**
 * Merge a server row with the static catalogue entry for the same skill.
 *
 * The database is authoritative for everything the student did — progress,
 * verification, which materials are ticked. The catalogue is still the only
 * place for presentation data that no table stores: estimated time, related
 * skills, opportunity counts, and the assessment question bank. Reading
 * description and objectives from the database keeps a server-side edit
 * visible; taking the rest from the catalogue is a fallback, not a
 * replacement.
 */
const mapUserSkillRow = (row: UserSkillRow): Skill => {
  const catalogItem = findCatalogSkill(row.slug || row.name || '');

  const resources: LearningResource[] = (row.resources ?? []).map((r) => ({
    // The route sends the catalogue `source_id` when it has one, which is what
    // the static catalogue and the progress endpoint both use. Rows seeded
    // before migration 0014 fall back to their UUID.
    id: r.id,
    title: String(r.title ?? ''),
    type: (String(r.type ?? 'doc') as LearningResource['type']),
    // `duration` is a non-optional string on the client. The column is
    // nullable, so a resource with no stated length is self-paced rather than
    // an empty label.
    duration: r.duration ? String(r.duration) : 'Self-paced',
    url: r.url ? String(r.url) : undefined,
    topic: r.topic ? String(r.topic) : undefined,
    completed: Boolean(r.completed),
  }));

  const verifiedLevel = row.verified_level ? toTitleCaseLevel(row.verified_level) : undefined;

  return {
    id: String(row.skill_id),
    name: String(row.name ?? catalogItem?.name ?? ''),
    tier: toSkillTier(row.tier ?? catalogItem?.tier),
    category: String(row.category ?? catalogItem?.category ?? 'General Technology'),
    icon: String(row.icon ?? catalogItem?.icon ?? '📡'),
    // The catalogue's `level` is a self-declared proficiency; a verified level
    // outranks it, which is the whole point of a verified badge.
    level: verifiedLevel ?? catalogItem?.level ?? 'Intermediate',
    progress: Number(row.progress ?? 0),
    isVerified: Boolean(row.is_verified),
    verifiedDate: row.verified_at
      ? new Date(String(row.verified_at)).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : undefined,
    verificationType: toVerificationType(row.verification_type),
    verifiedScore: row.best_score != null ? Number(row.best_score) : undefined,
    verifiedLevel,
    evidenceSource: toEvidenceSource(row.evidence_source),
    assessmentStrengths: row.assessment_strengths ?? undefined,
    assessmentImprovements: row.assessment_improvements ?? undefined,
    learningStatus: toLearningStatus(row.learning_status),
    assessmentStatus: toAssessmentStatus(row.assessment_status),
    bestScore: row.best_score != null ? Number(row.best_score) : undefined,
    description: String(row.description ?? catalogItem?.description ?? ''),
    estimatedTime: catalogItem?.estimatedTime ?? '15 Hours',
    learningObjectives: (row.learning_objectives ??
      catalogItem?.learningObjectives ??
      []) as string[],
    // Server rows carry the real completion state; only fall back to the
    // catalogue's all-unticked defaults if the aggregate came back empty.
    resources: resources.length > 0 ? resources : (catalogItem?.resources ?? []),
    careerRoles: (row.career_roles ?? catalogItem?.careerRoles ?? []) as string[],
    relatedOpportunityCount: catalogItem?.relatedOpportunityCount ?? 10,
    // No static question bank: the assessment questions are generated per
    // attempt by the AI assessment engine, so there is nothing to hydrate here.
    aliases: catalogItem?.aliases ?? [],
    relatedSkills: catalogItem?.relatedSkills ?? [],
  };
};

/**
 * Percentage of the profile a recruiter can actually evaluate.
 *
 * Derived on read rather than stored: the server keeps a `profile_completion`
 * column, but computing it here from the same fields that are on screen means
 * the number cannot disagree with what the student sees.
 */
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
  const { identity } = useAuth();

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

/**
   * Hydration: read the student's state from Neon.
   *
   * This replaces a ~190-line block of `localStorage.getItem` calls guarded by an
   * `isDemo` email check, plus a `readStudentOpportunitiesFromIndustry()` sync-bus
   * read. Three things changed beyond the storage location:
   *
   *   - The demo bypass is gone. `isDemo` was true for anyone whose email was
   *     `aarav.sharma@rvce.edu.in` or whose uid was `demo_student`, and it
   *     substituted `INITIAL_STUDENT_PROFILE`, `INITIAL_SKILLS` and
   *     `INITIAL_APPLICATIONS` for whatever the server said. That is not a
   *     rendering nicety: it showed one real person another person's
   *     applications. State now comes from the authenticated user's own rows, or
   *     is empty.
   *   - Every collection is fetched independently and a failure in one leaves the
   *     others intact, instead of one thrown read leaving the portal half
   *     hydrated from a previous user.
   *   - Nothing is read from storage, so signing in on another device shows the
   *     same profile, skills, projects and applications.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!identity || identity.role !== 'student') {
      setProfile(EMPTY_STUDENT_PROFILE);
      setSkills([]);
      setProjects([]);
      setCertifications([]);
      setApplications([]);
      setSavedOpportunityIds([]);
      setNotifications([]);
      setIsHydrated(true);
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      const [profileRes, skillsRes, applicationsRes, savedRes, notificationsRes] =
        await Promise.allSettled([
          studentProfileApi.get(),
          skillsApi.mine(),
          applicationsApi.list({ limit: 100 }),
          savedApi.list(),
          notificationsApi.list({ limit: 50 }),
        ]);

      if (cancelled) return;

      // Profile. The rows live on `student_profiles` and `users`; the Firestore
      // `users/{uid}` mirror this used to read is no longer consulted.
      if (profileRes.status === 'fulfilled') {
        const row = profileRes.value;
        // Account-owned fields (display name, email, phone, avatar) live on
        // `users`, not on `student_profiles`. They come from the identity the
        // auth provider already resolved, so there is no second fetch.
        const account = identity;
        const primaryEducation = row.education?.[0];

        setProfile((prev) => {
          const merged: StudentProfile = {
            ...prev,
            id: String(row.userId ?? account.userId),
            name: String(account.displayName ?? ''),
            email: String(account.email ?? ''),
            phone: String(account.phone ?? ''),
            degree: String(row.profile?.degree ?? primaryEducation?.degree ?? ''),
            year: String(row.profile?.academic_year ?? primaryEducation?.academic_year ?? ''),
            college: String(primaryEducation?.institution_name ?? ''),
            location: String(row.profile?.location ?? ''),
            careerGoal: String(row.profile?.career_goal ?? ''),
            bio: String(row.profile?.bio ?? ''),
            github: String(row.profile?.github_url ?? ''),
            linkedin: String(row.profile?.linkedin_url ?? ''),
            avatar: String(account.photoUrl ?? ''),
            gpa: row.profile?.cgpa ?? '',
            profileCompletion: Number(row.profile?.profile_completion ?? 0),
            education: undefined,
          };

          return {
            ...merged,
            profileCompletion: calculateProfileCompletion(
              merged,
              row.projects?.length ?? 0,
              0,
            ),
          };
        });

        setProjects(
          (row.projects ?? []).map((p) => ({
            id: String(p.id),
            title: String(p.title ?? ''),
            description: String(p.description ?? ''),
            techStack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
            githubUrl: String(p.github_url ?? ''),
            liveUrl: p.live_url ? String(p.live_url) : undefined,
          })) as Project[],
        );

        setCertifications(
          (row.certifications ?? []).map((c) => ({
            id: String(c.id),
            title: String(c.title ?? ''),
            issuer: String(c.issuer ?? ''),
            issueDate: c.issue_date ? String(c.issue_date) : undefined,
            expiryDate: c.expiry_date ? String(c.expiry_date) : undefined,
            credentialId: c.credential_id ? String(c.credential_id) : undefined,
            credentialUrl: c.credential_url ? String(c.credential_url) : undefined,
          })) as Certification[],
        );
      }

      // Skills. Progress, verification and per-material completion are the
      // server's; description, objectives and the assessment bank are merged
      // from the static catalogue by `mapUserSkillRow`.
      if (skillsRes.status === 'fulfilled') {
        setSkills((skillsRes.value.skills ?? []).map((row) => mapUserSkillRow(row as UserSkillRow)));
      }

      if (applicationsRes.status === 'fulfilled') {
        setApplications((applicationsRes.value.applications ?? []) as unknown as Application[]);
      }

      if (savedRes.status === 'fulfilled') {
        // `external_id` is what the UI tracks: it is the id the opportunity is
        // known by in this browser, and for internal postings it is the row id.
        setSavedOpportunityIds(
          (savedRes.value.saved ?? [])
            .map((s) => String(s.external_id ?? ''))
            .filter((id) => id.length > 0),
        );
      }

      if (notificationsRes.status === 'fulfilled') {
        setNotifications(
          (notificationsRes.value.notifications ?? []) as unknown as NotificationItem[],
        );
      }

      setIsHydrated(true);
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [identity]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // 6b. Cross-sector synced opportunities (published by the Industry portal)
  const [syncedOpportunities, setSyncedOpportunities] = useState<Opportunity[]>([]);

  // 6c. Live API-fetched verified jobs
  const [liveApiJobs, setLiveApiJobs] = useState<Opportunity[]>([]);
  const [liveApiLoading, setLiveApiLoading] = useState<boolean>(false);

  // 6d. Server opportunities, read from Neon through the Express API.
  //
  // This replaces `fetchRemoteJobs()` / `fetchRemoteInternships()`, the two Data
  // Connect reads that hydrated the list. Those could only ever return what the
  // legacy Firebase SQL database held; this returns the `jobs` and `internships`
  // tables that the rest of the platform now writes to.
  const [serverOpportunities, setServerOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    let isMounted = true;

    opportunitiesApi
      .list({ limit: 100 })
      .then(({ jobs, internships }) => {
        if (isMounted) {
          setServerOpportunities([...jobs, ...internships] as unknown as Opportunity[]);
        }
      })
      .catch((err) => {
        // A failed opportunity load is not fatal: the portal still renders, with
        // an empty list, rather than trapping the student on a spinner.
        console.warn('[API] Could not load opportunities:', err);
        if (isMounted) setServerOpportunities([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  /**
   * Persistence.
   *
   * There used to be six `localStorage.setItem` effects here â€” one per collection
   * â€” which meant the browser was the system of record: a student who cleared site
   * data, switched browsers, or applied for a job on a phone lost their profile,
   * skills, projects, certifications, applications, saved items and notifications.
   * It also meant every mutation was fire-and-forget with no error path.
   *
   * Writes are now explicit inside the mutation callbacks below, where a failure
   * can be reported to the student and the optimistic update rolled back. There is
   * deliberately no effect that mirrors state to storage any more: an effect that
   * writes on every state change cannot distinguish a user action from a
   * re-render, so it would also write on the initial hydrate.
   */

  const addProject = useCallback(
    async (newProj: Omit<Project, 'id'>) => {
      try {
        const created = await studentProfileApi.createProject({
          title: newProj.title,
          description: newProj.description ?? null,
          techStack: newProj.techStack ?? [],
          githubUrl: newProj.githubUrl ?? null,
          liveUrl: newProj.liveUrl ?? null,
        });

        // The database assigns the id, so the UI shows the real one rather than a
        // local timestamp that would not survive a refresh.
        setProjects((prev) => [
          { ...newProj, id: String(created.project.id) } as Project,
          ...prev,
        ]);
      } catch (err) {
        console.error('Could not save project:', err);
      }
    },
    [],
  );

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const previous = projects.find((p) => p.id === projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));

    try {
      await studentProfileApi.updateProject(projectId, updates as Record<string, unknown>);
    } catch (err) {
      // Roll the optimistic update back rather than leaving the UI showing a
      // change the server never accepted.
      if (previous) {
        setProjects((prev) => prev.map((p) => (p.id === projectId ? previous : p)));
      }
      console.error('Could not update project:', err);
    }
  }, [projects]);

  const deleteProject = useCallback(async (projectId: string) => {
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    try {
      await studentProfileApi.deleteProject(projectId);
    } catch (err) {
      setProjects(previous);
      console.error('Could not delete project:', err);
    }
  }, [projects]);

  // Certifications persistence & handlers
  const addCertification = useCallback(async (newCert: Omit<Certification, 'id'>) => {
    try {
      const created = await studentProfileApi.createCertification({
        title: newCert.title,
        issuer: newCert.issuer ?? null,
        issueDate: newCert.issueDate ?? null,
        expiryDate: newCert.expiryDate ?? null,
        credentialId: newCert.credentialId ?? null,
        credentialUrl: newCert.credentialUrl ?? null,
      });

      setCertifications((prev) => [
        {
          ...newCert,
          id: String(created.certification.id),
          uploadedAt: new Date().toISOString(),
        } as Certification,
        ...prev,
      ]);
    } catch (err) {
      console.error('Could not save certification:', err);
    }
  }, []);

  const updateCertification = useCallback(
    async (certId: string, updates: Partial<Certification>) => {
      const previous = certifications.find((c) => c.id === certId);
      setCertifications((prev) => prev.map((c) => (c.id === certId ? { ...c, ...updates } : c)));

      try {
        await studentProfileApi.updateCertification(certId, updates as Record<string, unknown>);
      } catch (err) {
        if (previous) {
          setCertifications((prev) => prev.map((c) => (c.id === certId ? previous : c)));
        }
        console.error('Could not update certification:', err);
      }
    },
    [certifications],
  );

  const deleteCertification = useCallback(
    async (certId: string) => {
      const previous = certifications;
      setCertifications((prev) => prev.filter((c) => c.id !== certId));

      try {
        await studentProfileApi.deleteCertification(certId);
      } catch (err) {
        setCertifications(previous);
        console.error('Could not delete certification:', err);
      }
    },
    [certifications],
  );

  /**
   * Cross-sector updates.
   *
   * The previous subscription listened on `subscribeToSync`, a localStorage event
   * bus, and reconciled application stages by **matching job titles as
   * lowercase strings** (`app.opportunityTitle === u.jobTitle.toLowerCase()`). Two
   * problems, both structural rather than cosmetic:
   *
   *   - a localStorage bus only reaches the tab that wrote the message, so a
   *     recruiter changing a stage in their own browser never informed the
   *     student's browser at all;
   *   - title matching means a stage update could be applied to the wrong
   *     application, and would be silently dropped whenever the titles differed
   *     at all.
   *
   * Stage changes are now rows in `application_stage_history`, written by the
   * recruiter's request and read back by id. Polling is a deliberate downgrade
   * from a push channel that only worked intra-tab, and it is the honest one:
   * the data is authoritative on the server either way, so a student who never
   * polls still sees the correct stage when they next load or navigate.
   */
  useEffect(() => {
    if (!identity || identity.role !== 'student') return;

    const POLL_INTERVAL_MS = 60_000;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const refreshFromServer = async () => {
      try {
        const [applicationsResult, notificationsResult] = await Promise.all([
          applicationsApi.list({ limit: 100 }),
          notificationsApi.list({ limit: 50 }),
        ]);
        if (cancelled) return;

        setApplications((applicationsResult.applications ?? []) as unknown as Application[]);
        setNotifications((notificationsResult.notifications ?? []) as unknown as NotificationItem[]);
      } catch (err) {
        // A failed poll is not surfaced: the last good state stays on screen and
        // the next tick retries. Interrupting the page with an error for a
        // transient network blip would be worse than being briefly stale.
        console.warn('[API] Background refresh failed:', err);
      }
    };

    timer = setInterval(() => void refreshFromServer(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [identity]);

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

  /**
   * Update profile.
   *
   * Replaces the `saveUserProfile` Firestore mirror, which wrote a
   * `users/{uid}` document and a localStorage blob on every keystroke-triggered
   * state change. The split now follows the schema: account-owned fields go to
   * `users`, academic fields go to `student_profiles`.
   */
  const updateProfile = useCallback(
    async (updates: Partial<StudentProfile>) => {
      const accountPatch: Record<string, unknown> = {};
      if (updates.name !== undefined) accountPatch.displayName = updates.name || null;
      if (updates.phone !== undefined) accountPatch.phone = updates.phone || null;

      const profilePatch: Record<string, unknown> = {};
      if (updates.degree !== undefined) profilePatch.degree = updates.degree || null;
      if (updates.year !== undefined) profilePatch.academicYear = updates.year || null;
      if (updates.gpa !== undefined && updates.gpa !== '') {
        const parsed = Number(updates.gpa);
        // The column is numeric(3,2) CHECK-constrained to 0..10, so a
        // non-numeric entry is dropped rather than sent to become a 422.
        if (Number.isFinite(parsed)) profilePatch.cgpa = parsed;
      }
      if (updates.careerGoal !== undefined) profilePatch.careerGoal = updates.careerGoal || null;
      if (updates.location !== undefined) profilePatch.location = updates.location || null;
      if (updates.bio !== undefined) profilePatch.bio = updates.bio || null;
      if (updates.github !== undefined) profilePatch.githubUrl = updates.github || null;
      if (updates.linkedin !== undefined) profilePatch.linkedinUrl = updates.linkedin || null;

      setProfile((prev) => {
        const next = { ...prev, ...updates };
        next.profileCompletion = calculateProfileCompletion(
          next,
          projects.length,
          skills.filter((s) => s.isVerified).length,
        );
        return next;
      });

      try {
        if (Object.keys(accountPatch).length > 0) {
          await identityApi.update(accountPatch as Parameters<typeof identityApi.update>[0]);
        }
        if (Object.keys(profilePatch).length > 0) {
          await studentProfileApi.update(profilePatch as Parameters<typeof studentProfileApi.update>[0]);
        }
      } catch (err) {
        console.error('Could not save profile changes:', err);
      }
    },
    [projects.length, skills],
  );

  /**
   * Tick off a learning material.
   *
   * `completed` used to live as a boolean inside the resource object in the
   * skills blob, so it was per-browser and per-device. It is now one row in
   * `skill_resource_progress`. The server recomputes `user_skills.progress` from
   * those rows, so the percentage on screen is the same number every device
   * shows rather than a local tally.
   */
  const toggleResourceCompletion = useCallback(
    async (skillId: string, resourceId: string) => {
      const target = skills.find((s) => s.id === skillId);
      const resource = target?.resources.find((r) => r.id === resourceId);
      if (!target || !resource) return;

      const nextCompleted = !resource.completed;

      setSkills((prev) =>
        prev.map((skill) => {
          if (skill.id !== skillId) return skill;
          const updatedResources = skill.resources.map((res) =>
            res.id === resourceId ? { ...res, completed: nextCompleted } : res,
          );

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
        }),
      );

      try {
        // The catalog resource id is the `source_id`; the route resolves it
        // within this skill, so it cannot address another skill's material.
        await skillsApi.setResourceProgress(skillId, resourceId, nextCompleted);
        await skillsApi.update(skillId, {
          progress: Math.min(
            100,
            Math.round(
              ((target.resources.filter((r) => r.completed).length + (nextCompleted ? 1 : -1)) /
                (target.resources.length || 1)) *
                100,
            ),
          ),
          learningStatus:
            nextCompleted && target.resources.length > 0
              ? target.resources.every((r) => (r.id === resourceId ? nextCompleted : r.completed))
                ? 'completed'
                : 'in_progress'
              : 'not_started',
        });
      } catch (err) {
        // Roll the tick back so an unsaved material is not shown as done.
        setSkills((prev) =>
          prev.map((skill) => {
            if (skill.id !== skillId) return skill;
            return {
              ...skill,
              resources: skill.resources.map((res) =>
                res.id === resourceId ? { ...res, completed: !nextCompleted } : res,
              ),
            };
          }),
        );
        console.error('Could not save resource progress:', err);
      }
    },
    [skills],
  );

  /**
   * Verify skill upon passing assessment (non-downgrade: preserves higher score and status on retakes).
   *
   * A pass used to set `isVerified` in the skills blob, so the badge a recruiter
   * saw was whatever the last browser happened to hold. It is now a row in
   * `skill_verifications` plus an `assessmentStatus: 'passed'` write on
   * `user_skills`, so a passed assessment survives a new device and is visible
   * to server-side match scoring.
   *
   * Returns whether the attempt passed. The server write is awaited and a
   * rejection returns `false` rather than leaving a local badge that the server
   * never accepted.
   */
  const verifySkill = useCallback(
    async (
      skillId: string,
      score: number,
      evaluationResult?: Partial<AssessmentEvaluationResult>
    ): Promise<boolean> => {
      const passed = score >= 70;

      const rankProficiency = (lvl?: string): number => {
        if (!lvl) return 2;
        const l = lvl.toLowerCase().trim();
        if (l === 'expert') return 4;
        if (l === 'advanced') return 3;
        if (l === 'intermediate') return 2;
        return 1;
      };

      // Best-of calculation lives above the write so the number sent to the
      // server is the same one the UI shows.
      const current = skills.find((s) => s.id === skillId);
      const currentRank = rankProficiency(current?.verifiedLevel);
      const newRank = rankProficiency(evaluationResult?.skillLevel);
      const bestLevel =
        newRank >= currentRank
          ? evaluationResult?.skillLevel || (score >= 90 ? 'Advanced' : 'Intermediate')
          : current?.verifiedLevel || 'Intermediate';
      const bestScore = Math.max(current?.verifiedScore || 0, current?.bestScore || 0, score);

      if (passed) {
        if (typeof window !== 'undefined') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0D5C68', '#059669', '#10B981', '#F97316', '#3B82F6'],
          });
        }
      }

      // The UI works in title case ("Advanced"); the column is a lowercase
      // enum. Narrow explicitly rather than calling `.toLowerCase()` and
      // handing the API a plain `string` it has to re-validate.
      const levelText = String(bestLevel).toLowerCase();
      const apiLevel = (
        levelText === 'expert'
          ? 'expert'
          : levelText === 'advanced'
            ? 'advanced'
            : levelText === 'beginner' || levelText === 'basic'
              ? 'beginner'
              : 'intermediate'
      ) as 'beginner' | 'intermediate' | 'advanced' | 'expert';

      try {
        if (passed) {
          await skillsApi.verify(skillId, {
            verificationType: 'assessment_verified',
            verifiedLevel: apiLevel,
            evidenceSource: 'assessment',
            verifiedScore: score,
            strengths:
              evaluationResult?.strengths || ['Core conceptual proficiency', 'Applied syntax'],
            improvements: evaluationResult?.areasForImprovement || ['Advanced system optimization'],
          });
          await skillsApi.update(skillId, {
            progress: 100,
            learningStatus: 'completed',
            assessmentStatus: 'passed',
            bestScore,
          });
        } else {
          // A failed attempt is recorded as a best score only, never as a
          // verification, so it cannot read as a pass to match scoring.
          await skillsApi.update(skillId, { assessmentStatus: 'failed', bestScore });
        }
      } catch (err) {
        console.error('Could not record skill verification:', err);
        return false;
      }

      if (passed) {
        setSkills((prev) =>
          prev.map((skill) => {
            if (skill.id !== skillId) return skill;

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
              verifiedScore: bestScore,
              bestScore,
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

        // No client-side celebration notification is appended. The old code
        // pushed a `notif-badge-${Date.now()}` row into local state, which
        // disappeared on refresh and was never visible on another device.
        // Anything a student should be told about a verification has to be
        // written by the server.
      } else {
        // Failed retake: preserve verified status and higher score if previously verified
        setSkills((prev) =>
          prev.map((skill) => {
            if (skill.id !== skillId) return skill;
            if (skill.isVerified) {
              return {
                ...skill,
                bestScore,
                assessmentImprovements:
                  evaluationResult?.areasForImprovement || skill.assessmentImprovements,
              };
            }
            return { ...skill, assessmentStatus: 'failed', bestScore };
          })
        );
      }
      return passed;
    },
    [skills, profile.name]
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
    async (skillData: {
      name: string;
      level: 'Basic' | 'Intermediate' | 'Advanced';
      category?: string;
      icon?: string;
    }): Promise<{ success: boolean; message: string; skill?: Skill }> => {
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

      // `user_skills.skill_id` is a UUID, so the static catalog slug has to be
      // resolved before the insert. An unresolvable name is refused rather than
      // written: the old code invented a `custom-${Date.now()}-${name}` id, and
      // that id did not exist in the `skills` table, so the row could never be
      // read back or joined to a verification.
      let skillUuid: string;
      try {
        skillUuid = await resolveSkillUuid(catalogItem ? catalogItem.id : trimmedName);
      } catch (err) {
        if (err instanceof UnresolvedSkillError) {
          return {
            success: false,
            message: `"${trimmedName}" is not in the skill catalog yet, so it cannot be saved. Pick a skill from the list.`,
          };
        }
        return { success: false, message: 'Could not reach the skill service. Try again.' };
      }

      const newSkill: Skill = {
        id: skillUuid,
        name: catalogItem ? catalogItem.name : trimmedName,
        tier: skillData.level,
        category: skillData.category || catalogItem?.category || 'General Technology',
        icon: skillData.icon || catalogItem?.icon || '📡',
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
        resources: catalogItem?.resources || [],
        careerRoles: catalogItem?.careerRoles || ['Software Engineer', `${trimmedName} Specialist`],
        relatedOpportunityCount: catalogItem?.relatedOpportunityCount || 10,
        aliases: catalogItem?.aliases || [],
        relatedSkills: catalogItem?.relatedSkills || [],
      };

      try {
        await skillsApi.add(skillUuid, 0);
      } catch (err) {
        console.error('Could not add skill:', err);
        return { success: false, message: 'Could not save this skill. Try again.' };
      }

      setSkills((prev) => [newSkill, ...prev]);

      return {
        success: true,
        message: `Successfully added "${newSkill.name}" (${newSkill.level}) to your skills!`,
        skill: newSkill,
      };
    },
    [skills],
  );

  const removeSkill = useCallback(async (skillId: string) => {
    const previous = skills;
    setSkills((prev) => prev.filter((s) => s.id !== skillId));

    try {
      await skillsApi.remove(skillId);
    } catch (err) {
      // Put it back: a row that failed to delete still exists server-side, so
      // dropping it from the screen would be a lie.
      setSkills(previous);
      console.error('Could not remove skill:', err);
    }
  }, [skills]);

  const updateSkillLevel = useCallback(
    async (skillId: string, newLevel: 'Basic' | 'Intermediate' | 'Advanced') => {
      // `user_skills` has no proficiency column of its own. Level lives on the
      // verified-skill side, so a self-declared level change is recorded as a
      // `claimed` verification with evidence `self_declared` — which is exactly
      // what the old silent state mutation was claiming to be.
      const verifiedLevel =
        newLevel === 'Basic' ? 'beginner' : newLevel === 'Intermediate' ? 'intermediate' : 'advanced';

      const previous = skills;
      setSkills((prev) =>
        prev.map((s) =>
          s.id === skillId ? { ...s, level: newLevel, tier: newLevel, isVerified: false } : s,
        ),
      );

      try {
        await skillsApi.verify(skillId, {
          verificationType: 'claimed',
          verifiedLevel,
          evidenceSource: 'self_declared',
          strengths: [],
          improvements: [],
        });
      } catch (err) {
        setSkills(previous);
        console.error('Could not update skill level:', err);
      }
    },
    [skills],
  );

  // Compute live opportunities with distances, skill match, and match boost
  const opportunities = useMemo(() => {
    const local = INITIAL_OPPORTUNITIES.map((opp) => {
      const coords = resolveOpportunityCoordinates(opp);
      const distance = calculateHaversineDistance(
        userCoords.lat,
        userCoords.lng,
        coords.lat,
        coords.lng
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
        const coords = resolveOpportunityCoordinates(opp);
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          coords.lat,
          coords.lng
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
        const coords = resolveOpportunityCoordinates(opp);
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          coords.lat,
          coords.lng
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

    // Server opportunities, already in the same shape as the local list.
    const remoteOpps = serverOpportunities
      .filter((o) => !local.some((loc) => loc.id === o.id))
      .filter((o) => !synced.some((s) => s.id === o.id))
      .filter((o) => !apiJobs.some((a) => a.id === o.id))
      .map((opp) => {
        const coords = resolveOpportunityCoordinates(opp);
        const distance = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          coords.lat,
          coords.lng
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
  }, [userCoords, skills, projects, profile, syncedOpportunities, serverOpportunities, liveApiJobs]);
  /**
   * Save / bookmark opportunity.
   *
   * Replaces a localStorage array mutation. The server upserts on
   * (user, source, external_id), so saving the same posting twice is idempotent
   * and the removal has a matching endpoint â€” the browser no longer holds the
   * only copy of which jobs this student is watching.
   *
   * The title and company are looked up from the merged opportunity list rather
   * than required from the caller, so the saved row is as descriptive as the
   * API's `/api/student/saved` response even when the caller only knows an id.
   */
  const toggleSaveOpportunity = useCallback(
    async (oppId: string) => {
      const wasSaved = savedOpportunityIds.includes(oppId);
      const opp = opportunities.find((o) => o.id === oppId);

      setSavedOpportunityIds((prev) =>
        prev.includes(oppId) ? prev.filter((id) => id !== oppId) : [...prev, oppId],
      );

      try {
        if (wasSaved) {
          await savedApi.unsave(oppId);
        } else {
          const isJob = opp?.type === 'Full-Time Job' || opp?.type === 'Part-Time Job';
          const workMode = opp?.workMode?.toLowerCase();

          await savedApi.save({
            externalId: oppId,
            source: 'internal',
            jobId: isJob ? oppId : undefined,
            internshipId: isJob ? undefined : oppId,
            title: opp?.title ?? null,
            companyName: opp?.company ?? null,
            location: opp?.location ?? null,
            workMode:
              workMode === 'remote' || workMode === 'hybrid' || workMode === 'onsite'
                ? workMode
                : undefined,
          });
        }
      } catch (err) {
        // Restore the previous state so the bookmark does not appear to have
        // worked when the server rejected it.
        setSavedOpportunityIds((prev) =>
          wasSaved ? [...prev, oppId] : prev.filter((id) => id !== oppId),
        );
        console.error('Could not update saved opportunities:', err);
      }
    },
    [savedOpportunityIds, opportunities],
  );

  const isOpportunitySaved = useCallback(
    (oppId: string) => savedOpportunityIds.includes(oppId),
    [savedOpportunityIds]
  );

  /**
   * Submit an application.
   *
   * This previously built an `Application` with a local `app-${Date.now()}` id,
   * appended it to state, fanned out to the sync bridge, and then called
   * `syncApplicationToDataConnect` â€” so the application existed in three places
   * and in none of them transactionally. `POST /api/student/applications` now
   * writes the `applications` row and the initial `application_stage_history`
   * entry in one transaction, and returns the real id.
   */
  const submitApplication = useCallback(
    async (oppId: string): Promise<boolean> => {
      const opp =
        serverOpportunities.find((o) => o.id === oppId) ??
        syncedOpportunities.find((o) => o.id === oppId) ??
        INITIAL_OPPORTUNITIES.find((o) => o.id === oppId);

      if (!opp) return false;

      const existing = applications.find((a) => a.opportunityId === oppId);
      if (existing) return true;

      const match = computeOpportunityMatch(opp, skills);

      try {
        // Only a full-time or part-time job is a `jobs` row; every other
        // OpportunityType maps to the `internships` table. Sending both ids, or
        // the wrong one, is a 422 by design.
        const isJob = opp.type === 'Full-Time Job' || opp.type === 'Part-Time Job';

        const created = await applicationsApi.create({
          jobId: isJob ? oppId : undefined,
          internshipId: isJob ? undefined : oppId,
          source: 'internal',
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
        });

        // The response carries the authoritative row, so the UI shows the id and
        // stage the server recorded rather than a locally invented pair.
        setApplications((prev) => [
          {
            ...(created.application as unknown as Application),
            opportunityId: oppId,
            opportunityTitle: opp.title,
            company: opp.company,
            type: opp.type,
          } as Application,
          ...prev,
        ]);

        return true;
      } catch (err) {
        // A 409 here means the same job was applied to already â€” the server
        // rejected it, so nothing is appended and the student is not told it
        // succeeded.
        console.error('Could not submit application:', err);
        return false;
      }
    },
    [applications, skills, serverOpportunities, syncedOpportunities]
  );

  // Notifications helpers
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch (err) {
      console.error('Could not mark notification read:', err);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      console.error('Could not mark all notifications read:', err);
    }
  }, []);


  /**
   * Reset the view state.
   *
   * This used to be called "reset to demo" and did two things: it cleared the
   * localStorage keys and then repopulated the screen with
   * `INITIAL_STUDENT_PROFILE`, `INITIAL_SKILLS` and `INITIAL_APPLICATIONS`. That
   * made a signed-in student see another person's applications, and because the
   * server was never involved, "reset" could not undo a real write either.
   *
   * It now resets only what is genuinely local — the filters and the selected
   * city — and leaves the profile, skills, projects, certifications,
   * applications, saved items and notifications to come from the server. Those
   * are edited through the profile and skills screens, which is where a real
   * change belongs.
   */
  const resetToDemo = useCallback(() => {
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
