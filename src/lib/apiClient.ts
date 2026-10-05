'use client';

/**
 * Authenticated HTTP client for the SkillSetu Express/Neon backend.
 *
 * Every application-data read and write in the portals goes through here. The
 * alternative — reading and writing the browser's own storage — is what this
 * migration removed: state that only exists in one browser is state that does
 * not exist on the user's phone.
 *
 * Two rules this module enforces:
 *
 *  1. The Firebase ID token is attached to every request. Authorization is
 *     resolved server-side from the PostgreSQL users row keyed on
 *     `users.firebase_uid`, so a token is the only credential the client needs.
 *     The client never sends a role, a user id or an organization id.
 *
 *  2. Failures are thrown as `ApiError` with the backend's `code` intact.
 *     Callers that can degrade gracefully catch it; callers that cannot must
 *     not silently continue as though the write succeeded, because a swallowed
 *     error is how profile data ends up disagreeing with itself.
 */

import type { User } from 'firebase/auth';

/** `undefined`/blank means "backend not configured" — e.g. local dev with no .env. */
export function backendBaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/+$/, '');
}

/**
 * Render's free tier sleeps the service, so the first request after an idle
 * period pays a cold start. Generous, but bounded so a hung socket cannot leak.
 */
const DEFAULT_TIMEOUT_MS = 30_000;

/** Backend error envelope, as produced by `errorHandler` in backend/src/app.ts. */
export type ApiErrorBody = {
  error?: string;
  code?: string;
  requestId?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;

  constructor(status: number, body: ApiErrorBody, fallbackMessage: string) {
    super(body.error || fallbackMessage);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code || `http_${status}`;
    this.requestId = body.requestId;
  }

  /**
   * True when the caller has no `users` row yet. Usually means signup has not
   * reached `POST /api/auth/register`, which is retried and idempotent.
   */
  get isRegistrationRequired(): boolean {
    return this.status === 403 && this.code === 'registration_required';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * A 404 for a row the caller owns is the API's cross-tenant signal: the
   * response is deliberately identical whether the row is absent or simply not
   * theirs.
   */
  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type AuthenticatedClient = {
  /** Set once at app start so individual calls do not each fetch a token. */
  setUser(user: User | null): void;
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  delete<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
};

function buildQuery(query: ApiRequestOptions['query']): string {
  if (!query) return '';

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

/**
 * Creates a client bound to the signed-in Firebase user.
 *
 * `user` is captured rather than looked up per request so a caller cannot
 * accidentally issue a write under a stale identity: the app sets it once on
 * auth state change and clears it on sign-out.
 */
export function createApiClient(initialUser: User | null = null): AuthenticatedClient {
  let user: User | null = initialUser;

  async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const base = backendBaseUrl();

    if (!base) {
      throw new ApiError(0, { code: 'backend_not_configured' }, 'NEXT_PUBLIC_API_URL is not set');
    }

    if (!user) {
      throw new ApiError(401, { code: 'unauthenticated' }, 'No signed-in Firebase user');
    }

    // A fresh token each call. Firebase caches by expiry, so this is cheap in
    // the common case, and it means a token that expired mid-session produces a
    // clean 401 rather than a confusing authorization failure.
    let token: string;
    try {
      token = await user.getIdToken();
    } catch (e) {
      throw new ApiError(
        401,
        { code: 'token_unavailable' },
        e instanceof Error ? e.message : 'could not obtain an ID token',
      );
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    // Honour a caller-supplied signal alongside our timeout.
    const onExternalAbort = () => controller.abort();
    options.signal?.addEventListener('abort', onExternalAbort);

    try {
      const hasBody = options.body !== undefined;

      const res = await fetch(`${base}${path}${buildQuery(options.query)}`, {
        method: options.method ?? 'GET',
        headers: {
          ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
          Authorization: `Bearer ${token}`,
        },
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (res.status === 204) {
        return undefined as T;
      }

      const text = await res.text();
      let payload: unknown = undefined;

      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          // A proxy or gateway error page arrives as HTML. Fall through to the
          // status check below with no parsed payload.
        }
      }

      if (!res.ok) {
        throw new ApiError(
          res.status,
          (payload ?? {}) as ApiErrorBody,
          `Request failed with status ${res.status}`,
        );
      }

      return payload as T;
    } catch (e) {
      if (e instanceof ApiError) throw e;

      if (e instanceof Error && e.name === 'AbortError') {
        const timedOut = !options.signal?.aborted;
        throw new ApiError(
          0,
          { code: timedOut ? 'timeout' : 'aborted' },
          timedOut
            ? `Request timed out after ${options.timeoutMs ?? DEFAULT_TIMEOUT_MS}ms`
            : 'Request was aborted',
        );
      }

      throw new ApiError(
        0,
        { code: 'network_error' },
        e instanceof Error ? e.message : 'network error',
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', onExternalAbort);
    }
  }

  return {
    setUser(next: User | null) {
      user = next;
    },
    request,
    get: <T,>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T,>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'POST', body }),
    patch: <T,>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'PATCH', body }),
    put: <T,>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'PUT', body }),
    delete: <T,>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
}

/**
 * Shared client instance.
 *
 * `AuthProvider` calls `setUser` on every auth state change. Components import
 * `api` directly rather than each building their own.
 */
export const api: AuthenticatedClient = createApiClient(null);

/* ------------------------------------------------------------------ shapes */

/**
 * Response shapes from the backend routers. Kept here rather than generated so
 * the mapping from database columns to the UI's camelCase model stays visible
 * in one place.
 */

export type StudentProfileResponse = {
  userId: string;
  profile: {
    usn: string | null;
    degree: string | null;
    department: string | null;
    academic_year: string | null;
    cgpa: string | null;
    career_goal: string | null;
    bio: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    location: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    profile_completion: number;
  };
  education: Array<{
    id: string;
    level: string;
    institution_name: string | null;
    degree: string | null;
    department: string | null;
    course: string | null;
    board: string | null;
    academic_year: string | null;
    score: string | null;
    score_text: string | null;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    created_at: string;
  }>;
  experiences: Array<{
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    issuer: string | null;
    issue_date: string | null;
    expiry_date: string | null;
    credential_id: string | null;
    credential_url: string | null;
    file_name: string | null;
    file_type: string | null;
    uploaded_at: string | null;
  }>;
};

export type StudentSkill = {
  skill_id: string;
  slug: string;
  name: string;
  tier: string;
  category: string | null;
  icon: string | null;
  description: string | null;
  learning_objectives: string[];
  career_roles: string[];
  progress: number;
  learning_status: string;
  assessment_status: string | null;
  is_verified: boolean;
  verified_at: string | null;
  verification_type: string | null;
  verified_level: string | null;
  evidence_source: string | null;
  best_score: string | null;
  assessment_strengths: string[];
  assessment_improvements: string[];
  added_at: string;
};

export type StudentApplication = {
  id: string;
  candidate_user_id: string;
  company_id: string | null;
  source: string;
  job_id: string | null;
  internship_id: string | null;
  external_id: string | null;
  external_company: string | null;
  external_title: string | null;
  stage: string;
  match_score: string | null;
  matched_skills: string[];
  missing_skills: string[];
  cover_note: string | null;
  recruiter_notes: string | null;
  applied_at: string;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
  job_title?: string | null;
  job_slug?: string | null;
  job_location?: string | null;
  internship_title?: string | null;
  internship_location?: string | null;
  company_name?: string | null;
  company_logo?: string | null;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  meta: Record<string, unknown>;
  read: boolean;
  created_at: string;
};

export type SavedOpportunity = {
  source: string;
  external_id: string;
  job_id: string | null;
  internship_id: string | null;
  title: string | null;
  company_name: string | null;
  location: string | null;
  work_mode: string | null;
  salary_range: string | null;
  saved_at: string;
  company_name_resolved?: string | null;
  company_logo?: string | null;
  job_title?: string | null;
  job_city?: string | null;
  job_deadline?: string | null;
  internship_title?: string | null;
  internship_stipend?: string | null;
};

export type CourseSummary = {
  id: string;
  slug: string;
  skill_id: string | null;
  title: string;
  description: string | null;
  level: string;
  estimated_hours: string | null;
  is_published: boolean;
  skill_name: string | null;
  enrollment_id: string | null;
  enrollment_status: string | null;
  enrolled_at: string | null;
  material_count: number;
  completed_count: number;
  progress_percent: number;
};

export type CourseDetail = {
  course: {
    id: string;
    slug: string;
    skill_id: string | null;
    title: string;
    description: string | null;
    level: string;
    estimated_hours: string | null;
    is_published: boolean;
    skill_name: string | null;
    enrollment_status: string | null;
  };
  materials: Array<{
    id: string;
    title: string;
    type: string;
    position: number;
    url: string | null;
    duration: string | null;
    description: string | null;
    is_published: boolean;
    completed: boolean;
  }>;
};

export type IndustryJob = {
  id: string;
  slug: string;
  company_id: string;
  title: string;
  department: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string;
  work_mode: string;
  employment_type: string;
  salary_range: string | null;
  experience_required: string | null;
  education_required: string | null;
  graduation_year: string | null;
  minimum_cgpa: string | null;
  description: string | null;
  responsibilities: string[];
  qualifications: string[];
  openings: number;
  deadline: string | null;
  status: string;
  posted_at: string | null;
  created_at: string;
  company_name?: string;
  company_logo?: string | null;
};

export type IndustryInternship = {
  id: string;
  slug: string;
  company_id: string;
  title: string;
  department: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string;
  work_mode: string;
  duration: string | null;
  stipend: string | null;
  eligibility: string | null;
  start_date: string | null;
  application_deadline: string | null;
  description: string | null;
  learning_outcomes: string[];
  mentor: string | null;
  target_audience: string | null;
  openings: number;
  is_startup_friendly: boolean;
  eligible_for_conversion: boolean;
  status: string;
  posted_at: string | null;
  created_at: string;
  company_name?: string;
  company_logo?: string | null;
};

export type IndustryApplication = StudentApplication & {
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_photo: string | null;
  candidate_degree: string | null;
  candidate_cgpa: string | null;
  candidate_year: string | null;
};

export type HiringPreferences = {
  user_id: string;
  company_id: string | null;
  preferred_departments: string[];
  preferred_degrees: string[];
  preferred_graduation_years: string[];
  preferred_locations: string[];
  work_modes: string[];
  minimum_cgpa: string | null;
  prioritize_verified_skills: boolean;
  prioritize_startup_experience: boolean;
  search_radius_km: number;
  is_default?: boolean;
  updated_at?: string;
};

export type TalentPoolEntry = {
  candidate_user_id: string;
  category: string;
  note: string | null;
  shortlisted_at: string;
  display_name: string | null;
  email: string | null;
  photo_url: string | null;
  degree: string | null;
  academic_year: string | null;
  cgpa: string | null;
  location: string | null;
  bio: string | null;
  verified_skills: Array<{ name: string; verified_level: string | null }>;
};

export type Challenge = {
  id: string;
  slug: string;
  company_id: string | null;
  title: string;
  description: string | null;
  difficulty: string;
  status: string;
  deadline: string | null;
  team_size: string | null;
  prize: string | null;
  submission_requirements: string | null;
  college_participation: string | null;
  participants_count: number;
  submissions_count: number;
  required_skills: string[];
  created_at: string;
  company_name?: string | null;
  company_logo?: string | null;
};

export type Interview = {
  id: string;
  application_id: string | null;
  candidate_user_id: string;
  company_id: string;
  job_id: string | null;
  internship_id: string | null;
  round: string;
  scheduled_at: string;
  mode: string;
  meeting_link: string | null;
  interviewers: string[];
  notes: string | null;
  status: string;
  score: string | null;
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  candidate_name?: string | null;
  job_title?: string | null;
};

export type Offer = {
  id: string;
  candidate_user_id: string;
  company_id: string;
  application_id: string | null;
  job_id: string | null;
  internship_id: string | null;
  offer_type: string;
  department: string | null;
  location: string | null;
  work_mode: string;
  compensation: string | null;
  base_fixed: string | null;
  variable_bonus: string | null;
  retention_joining_bonus: string | null;
  benefits_summary: string | null;
  joining_date: string | null;
  valid_until: string | null;
  status: string;
  authorized_signatory: string | null;
  signatory_title: string | null;
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  candidate_name?: string | null;
};

export type CompanyProfile = {
  id: string;
  name: string;
  type: string | null;
  industry: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  employees: string | null;
  founded: number | null;
  website_url: string | null;
  tagline: string | null;
  about: string | null;
  mission: string | null;
  tech_stack: string[];
  departments: string[];
  hiring_domains: string[];
  benefits: string[];
  culture: string[];
  logo_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CollegeProfile = {
  id: string;
  name: string;
  short_name: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string;
  university: string | null;
  institution_type: string | null;
  affiliation: string | null;
  official_website: string | null;
  logo_url: string | null;
  about: string | null;
  total_students: number | null;
  naac_grade: string | null;
  placement_officer: { name?: string; title?: string; email?: string; phone?: string } | null;
  created_at: string;
  updated_at: string;
};
