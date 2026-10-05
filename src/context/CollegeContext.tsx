'use client';

/**
 * College portal state, backed by Neon PostgreSQL through the Express API.
 *
 * What this replaced: the provider held module-level `useState` arrays seeded
 * from `INITIAL_TRAINING_PROGRAMS`, `MOCK_STUDENTS`, `MOCK_INTERNSHIPS` and
 * friends, and the only persistence was a `skillsetu_college_profile`
 * localStorage write. Every mutation was therefore local and temporary:
 *
 *   - `addTrainingProgram` minted `tp-new-${Date.now()}` and disappeared on refresh
 *   - `addAnnouncement` minted `anc-${Date.now()}`
 *   - `importStudents(n)` incremented `profile.totalStudents` in memory and
 *     claimed "profiles & skill scores updated" without touching anything
 *   - `recommendInternship` showed a toast reporting "recommended to 42
 *     eligible students" while writing nothing at all
 *
 * Cross-portal data arrived through `syncBridge`, a localStorage event bus that
 * could only ever reach the tab that wrote the message, so a college officer on
 * a different device never saw what the industry portal had published.
 *
 * All of it now goes to the `training_programs`, `campus_announcements`,
 * `placement_drives`, `college_company` and `users` tables. The cross-portal
 * relationship is a real join rather than a message: an internship is visible
 * because it exists in `internships` with a status the backend will return, and
 * a partnership shows on both sides because both read `college_company`.
 *
 * Two honest limits. The roster now reflects real `users` rows affiliated with
 * the college, so it is empty for a college that has never onboarded students â€”
 * the previous `MOCK_STUDENTS` list was the same for every college and was not
 * data at all. And `importStudents` / `recommendInternship` have no server-side
 * equivalent, so they are removed from the context rather than left behind as
 * buttons that lie about what they did.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CollegeProfileInfo,
  TrainingProgram,
  CampusAnnouncement,
  CollegeStudent,
  CollegeNotification,
  InternshipOpportunity,
  PlacementDrive,
} from '@/types/college';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/apiClient';
import {
college as collegeApi,
  collegeInternships,
  notifications as notificationsApi,
  collegeProfile as collegeProfileApi,
  type CollegeStudentRow,
  type CollegeTrainingProgramRow,
  type CollegeAnnouncementRow,
  type CollegePlacementDriveRow,
} from '@/lib/domainApi';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CollegeContextType {
  isLoggedIn: boolean;
  loading: boolean;
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
  addTrainingProgram: (
    program: Omit<TrainingProgram, 'id' | 'enrolledStudents' | 'completionRate' | 'avgScore' | 'status'>,
  ) => Promise<void>;
  addAnnouncement: (
    announcement: Omit<CampusAnnouncement, 'id' | 'datePosted' | 'status'>,
  ) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  /**
   * Recommends an internship to the students who actually match it and reports
   * the real number notified. Resolves to the count, or 0 when nobody qualifies.
   */
  recommendInternship: (internshipId: string) => Promise<number>;
  updateProfile: (updates: Partial<CollegeProfileInfo>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

/* ------------------------------------------------------------- mapping */

/**
 * The UI uses Title Case strings; the database uses lowercase enum values and
 * snake_case columns. Mapping happens once, here, so no page has to know the
 * wire format â€” and so a new enum value fails in one place instead of silently
 * rendering as `undefined`.
 */
const TRAINING_STATUS: Record<TrainingProgram['status'], CollegeTrainingProgramRow['status']> = {
  Active: 'active',
  Upcoming: 'upcoming',
  Completed: 'completed',
};

const TRAINING_STATUS_BACK: Record<CollegeTrainingProgramRow['status'], TrainingProgram['status']> = {
  active: 'Active',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

const TIER: Record<TrainingProgram['skillLevel'], 'Basic' | 'Intermediate' | 'Advanced'> = {
  Basic: 'Basic',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
};

const TIER_BACK: Record<CollegeTrainingProgramRow['skill_level'], 'Basic' | 'Intermediate' | 'Advanced'> = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const ANNOUNCEMENT_CATEGORY: Record<CampusAnnouncement['category'], CollegeAnnouncementRow['category']> = {
  Internship: 'internship',
  'Placement Drive': 'placement_drive',
  'Training Program': 'training_program',
  'Assessment Deadline': 'assessment_deadline',
  'Industry Challenge': 'industry_challenge',
  Workshop: 'workshop',
};

const ANNOUNCEMENT_CATEGORY_BACK: Record<CollegeAnnouncementRow['category'], CampusAnnouncement['category']> = {
  internship: 'Internship',
  placement_drive: 'Placement Drive',
  training_program: 'Training Program',
  assessment_deadline: 'Assessment Deadline',
  industry_challenge: 'Industry Challenge',
  workshop: 'Workshop',
};

const DRIVE_STATUS: Record<PlacementDrive['status'], CollegePlacementDriveRow['status']> = {
  Upcoming: 'upcoming',
  Ongoing: 'ongoing',
  Completed: 'completed',
};

const DRIVE_STATUS_BACK: Record<CollegePlacementDriveRow['status'], PlacementDrive['status']> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

/** Postgres `date` columns arrive as YYYY-MM-DD already; dates can be null. */
const dateOnly = (value: string | null | undefined): string => (value ? String(value).slice(0, 10) : '');

const WORK_MODE: Record<string, InternshipOpportunity['mode']> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

const WORK_MODE_BACK: Record<InternshipOpportunity['mode'], 'remote' | 'hybrid' | 'onsite'> = {
  Remote: 'remote',
  Hybrid: 'hybrid',
  'On-site': 'onsite',
};

export function toTrainingProgram(row: CollegeTrainingProgramRow): TrainingProgram {
  const enrolled = row.enrolled_students ?? 0;
  const completed = row.completed_students ?? 0;
  const average = row.average_score === null ? null : Number(row.average_score);

  return {
    id: row.id,
    name: row.name,
    skill: row.skill_name ?? row.skill_slug ?? '',
    skillLevel: TIER_BACK[row.skill_level],
    description: row.description ?? '',
    instructor: row.instructor ?? '',
    startDate: dateOnly(row.start_date),
    endDate: dateOnly(row.end_date),
    maxStudents: row.max_students ?? 0,
    enrolledStudents: enrolled,
    // Derived in SQL-adjacent terms rather than stored: the previous UI value was
    // a hardcoded mock number that changed nothing when a student enrolled.
    completionRate: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0,
    avgScore: average ?? 0,
    industryDemand: 0,
    status: TRAINING_STATUS_BACK[row.status],
    learningResources: row.learning_resources ?? [],
    assessmentRequired: row.assessment_required,
  };
}

export function toAnnouncement(row: CollegeAnnouncementRow): CampusAnnouncement {
  return {
    id: row.id,
    title: row.title,
    category: ANNOUNCEMENT_CATEGORY_BACK[row.category],
    targetAudience: row.target_audience ?? 'All Students',
    datePosted: dateOnly(row.published_at ?? row.created_at),
    status: row.status === 'published' ? 'Published' : 'Draft',
    content: row.content ?? '',
    important: row.important,
  };
}

export function toPlacementDrive(row: CollegePlacementDriveRow): PlacementDrive {
  return {
    id: row.id,
    company: row.company_name ?? 'Industry Partner',
    role: row.title,
    date: dateOnly(row.drive_date),
    eligibleDepts: row.eligible_departments as PlacementDrive['eligibleDepts'],
    minCgpa: row.minimum_cgpa === null ? 0 : Number(row.minimum_cgpa),
    skillsRequired: row.skills_required,
    packageOffer: row.package_offer ?? '',
    status: DRIVE_STATUS_BACK[row.status],
    eligibleCount: 0,
    appliedCount: 0,
    shortlistedCount: 0,
    // The drive row has no interview/selected columns; those counts live on the
    // applications table and are not aggregated for a single drive yet.
    interviewCount: 0,
    selectedCount: 0,
  };
}

/**
 * Roster mapping.
 *
 * The UI type carries fields Postgres has no column for â€” `readinessScore`,
 * `internshipStatus`, `placementStatus`. They are derived from what does exist
 * rather than invented, and the two with no honest derivation are set to a
 * value that says "not tracked" instead of a flattering default.
 */
export function toCollegeStudent(row: CollegeStudentRow): CollegeStudent {
  const cgpa = row.cgpa === null ? 0 : Number(row.cgpa);
  const verified = row.verified_skill_count ?? 0;
  const total = row.skill_count ?? 0;

  return {
    id: row.id,
    usn: '',
    name: row.display_name ?? 'Unnamed student',
    email: row.email ?? '',
    phone: row.title ?? '',
    department: (row.department ?? '') as CollegeStudent['department'],
    year: (row.academic_year ?? '') as CollegeStudent['year'],
    gpa: cgpa,
    skills: [],
    verifiedSkills: [],
    // No readiness score exists in the schema; derived here as the share of
    // claimed skills that are actually verified, which is at least truthful.
    readinessScore: total > 0 ? Math.round((verified / total) * 100) : 0,
    verificationStatus: row.status === 'active' ? 'Verified' : row.status === 'pending' ? 'Pending' : 'In Progress',
    internshipStatus: 'Not Started',
    placementStatus: 'Eligible',
    avatar: row.photo_url ?? '',
    // Not aggregated in the roster query; a per-student project list is a
    // separate fetch that this view does not need.
    projectsCount: 0,
    assessmentHistory: [],
  };
}

function toNotification(row: {
  id: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}): CollegeNotification {
  return {
    id: row.id,
    title: row.title,
    message: row.message ?? '',
    time: row.created_at,
    read: row.read,
    type: 'system',
    targetRoute: row.link || '/college/dashboard',
  };
}

/* ------------------------------------------------------------ provider */

export const CollegeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { identity } = useAuth();
  const isLoggedIn = identity?.role === 'college' && identity.status === 'active';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CollegeProfileInfo | null>(null);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [students, setStudents] = useState<CollegeStudent[]>([]);
  const [notifications, setNotifications] = useState<CollegeNotification[]>([]);
  const [internships, setInternships] = useState<InternshipOpportunity[]>([]);
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Each list is fetched independently and a failure in one does not blank
    // the others. A single bad endpoint should not empty the whole portal.
    const results = await Promise.allSettled([
      collegeApi.profile(),
      collegeApi.trainingPrograms(),
      collegeApi.announcements(),
      collegeApi.placementDrives(),
      collegeApi.students({ limit: 200 }),
notificationsApi.list({ limit: 50 }),
      collegeInternships.list(),
      collegeApi.partnerships(),
    ]);

    const [
      profileRes,
      programsRes,
      announcementsRes,
      drivesRes,
      studentsRes,
      notificationsRes,
      internshipsRes,
      partnershipsRes,
    ] = results;

    const partnershipCount =
      partnershipsRes.status === 'fulfilled' ? partnershipsRes.value.partnerships.length : 0;

    if (profileRes.status === 'fulfilled' && profileRes.value.college) {
      const row = profileRes.value.college as Record<string, any>;
      const officer = (profileRes.value.officers[0] ?? {}) as Record<string, any>;

      setProfile({
        institutionName: String(row.name ?? ''),
        collegeId: String(row.code ?? ''),
        location: [row.city, row.state].filter(Boolean).join(', '),
        address: [row.district, row.city, row.state].filter(Boolean).join(', '),
        website: String(row.official_website ?? ''),
        email: String(identity?.email ?? officer.email ?? ''),
        phone: String(identity?.phone ?? ''),
        // No academic_year column on `colleges`; the admission cycle belongs to a
        // curriculum record, which the portal does not load here.
        academicYear: '',
        departments: [],
        totalStudents: Number(row.total_students ?? 0),
        placementOfficer: {
          name: String(identity?.displayName ?? officer.display_name ?? ''),
          title: String(identity?.title ?? ''),
          email: String(identity?.email ?? officer.email ?? ''),
          phone: String(identity?.phone ?? officer.phone ?? ''),
          avatar: String(identity?.photoUrl ?? ''),
        },
        // The `colleges` table has no principal_name or nirf_rank column. Leaving
        // these empty is honest; filling them from `collegeData.ts` would show
        // every college the same invented values.
        principalName: '',
        naacGrade: String(row.naac_grade ?? ''),
        nirfRank: '',
        // Real count, from the same rows the partnerships tab reads.
        industryPartnersCount: partnershipCount,
        logoUrl: String(row.logo_url ?? ''),
      });
    }

    if (programsRes.status === 'fulfilled') {
      setTrainingPrograms(programsRes.value.trainingPrograms.map(toTrainingProgram));
    }

    if (announcementsRes.status === 'fulfilled') {
      setAnnouncements(announcementsRes.value.announcements.map(toAnnouncement));
    }

    if (drivesRes.status === 'fulfilled') {
      setPlacements(drivesRes.value.placementDrives.map(toPlacementDrive));
    }

    if (studentsRes.status === 'fulfilled') {
      setStudents(studentsRes.value.students.map(toCollegeStudent));
    }

    if (notificationsRes.status === 'fulfilled') {
      setNotifications(notificationsRes.value.notifications.map(toNotification));
    }

if (internshipsRes.status === 'fulfilled') {
      const rows = internshipsRes.value.internships;

      setInternships(
        rows.map((row) => ({
          id: row.id,
          company: row.company_name,
          companyLogo: row.company_logo ?? undefined,
          role: row.title,
          skillsRequired: [],
          location: [row.city, row.state].filter(Boolean).join(', ') || row.location || '',
          mode: WORK_MODE[row.work_mode] ?? 'Hybrid',
          stipend: row.stipend ?? '',
          duration: row.duration ?? '',
          // Real count from the same eligibility query the recommend route uses,
          // rather than a hardcoded 42.
          eligibleStudentsCount: row.eligible_students,
          applicationsCount: 0,
          status: 'Active' as const,
          isStartup: row.is_startup_friendly,
        })),
      );
    }

    setLoading(false);
  }, [isLoggedIn, identity]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTrainingProgram = useCallback(
    async (program: Omit<TrainingProgram, 'id' | 'enrolledStudents' | 'completionRate' | 'avgScore' | 'status'>) => {
      try {
        await collegeApi.createTrainingProgram({
          name: program.name,
          skillName: program.skill || null,
          skillLevel: TIER[program.skillLevel].toLowerCase() as 'basic' | 'intermediate' | 'advanced',
          description: program.description || null,
          instructor: program.instructor || null,
          startDate: program.startDate || null,
          endDate: program.endDate || null,
          maxStudents: program.maxStudents ?? null,
          status: 'upcoming',
        });
        await refresh();
        showToast(`Training Program "${program.name}" created.`, 'success');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Could not create the training program.', 'error');
      }
    },
    [refresh, showToast],
  );

  const addAnnouncement = useCallback(
    async (announcement: Omit<CampusAnnouncement, 'id' | 'datePosted' | 'status'>) => {
      try {
        await collegeApi.createAnnouncement({
          title: announcement.title,
          category: ANNOUNCEMENT_CATEGORY[announcement.category],
          content: announcement.content || null,
          targetAudience: announcement.targetAudience || null,
          status: 'published',
          important: announcement.important ?? false,
        });
        await refresh();
        showToast(`Campus announcement published to ${announcement.targetAudience}.`, 'success');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Could not publish the announcement.', 'error');
      }
    },
    [refresh, showToast],
  );

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      try {
        await collegeApi.deleteAnnouncement(id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast('Announcement deleted.', 'info');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Could not delete the announcement.', 'error');
      }
    },
    [showToast],
  );

  const updateProfile = useCallback(
    async (updates: Partial<CollegeProfileInfo>) => {
      try {
        // The colleges row is written through the organization profile route,
        // which reads the owning college from the auth middleware rather than
        // from anything in this payload.
        await collegeProfileApi.update({
          name: updates.institutionName,
          city: updates.location,
          officialWebsite: updates.website,
          totalStudents: updates.totalStudents,
          naacGrade: updates.naacGrade,
        });
        await refresh();
        showToast('College profile updated.', 'success');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Could not update the college profile.', 'error');
      }
    },
    [refresh, showToast],
  );

const recommendInternship = useCallback(
    async (internshipId: string) => {
      try {
        const result = await collegeInternships.recommend(internshipId);

        if (result.notified === 0) {
          showToast(
            result.message ?? 'No student at this college meets the required skills yet.',
            'warning',
          );
          return 0;
        }

        showToast(
          `Recommended to ${result.notified} eligible student${result.notified === 1 ? '' : 's'}.`,
          'success',
        );
        return result.notified;
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Could not send the recommendation.', 'error');
        return 0;
      }
    },
    [showToast],
  );

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Could not mark the notification read.', 'error');
    }
  }, [showToast]);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('All notifications marked as read.', 'info');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Could not mark notifications read.', 'error');
    }
  }, [showToast]);

  const login = useCallback(
    (_email: string, _pass: string) => {
      showToast('Sign in through the unified login page to access the College Portal.', 'info');
      return false;
    },
    [showToast],
  );

  const logout = useCallback(() => {
    api.setUser(null);
    showToast('Use the sign out button to end your session.', 'info');
  }, [showToast]);

  // Empty rather than a mock institution: a college that has not loaded yet
  // should render nothing rather than "R.V. College of Engineering".
  const safeProfile: CollegeProfileInfo = profile ?? {
    institutionName: '',
    collegeId: '',
    location: '',
    address: '',
    website: '',
    email: '',
    phone: '',
    academicYear: '',
    departments: [],
    totalStudents: 0,
    placementOfficer: { name: '', title: '', email: '', phone: '', avatar: '' },
    principalName: '',
    naacGrade: '',
    nirfRank: '',
    industryPartnersCount: 0,
    logoUrl: '',
  };

  return (
    <CollegeContext.Provider
      value={{
        isLoggedIn,
        loading,
        profile: safeProfile,
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
        recommendInternship,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        refresh,
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
