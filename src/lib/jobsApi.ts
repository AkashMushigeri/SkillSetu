import { Opportunity, OpportunityType } from '@/types/student';
import { CITIES_LIST } from '@/data/mockStudentData';

const JOBS_API_BASE =
  'https://3jmczl-r104kkoiy-arcadawebapps8.vercel.app/api/v1/jobs';

export interface RawApiJob {
  id: string;
  title: string;
  company: string;
  company_domain?: string;
  company_website?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  country_code: string;
  work_mode: 'ON_SITE' | 'REMOTE' | 'HYBRID';
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
  salary: {
    min: number;
    max: number;
    currency: string;
    formatted: string;
  };
  experience: {
    min: number;
    max: number;
    formatted: string;
  };
  skills: string[];
  summary: string;
  description: string;
  application_url: string;
  source: string;
  published_at: string;
  trust_score: number;
  risk_level: string;
  verification: {
    status: string;
    company_verified: boolean;
    application_url_ssrf_cleared: boolean;
    india_confirmed: boolean;
    zero_scam_flags: boolean;
    fail_closed_gate_passed: boolean;
  };
}

export interface JobsApiResponse {
  success: boolean;
  data: RawApiJob[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  filters_applied: {
    country_code: string;
    city: string;
    work_mode: string | null;
    q: string | null;
    skills: string[] | null;
    sort: string;
  };
  meta: {
    api_version: string;
    platform: string;
    consumer: string;
    country_restriction: string;
    timestamp: string;
  };
}

const employmentTypeToOpportunityType = (
  employmentType: string
): OpportunityType => {
  switch (employmentType) {
    case 'INTERNSHIP':
      return 'Internship';
    case 'PART_TIME':
      return 'Part-Time Job';
    case 'FULL_TIME':
      return 'Full-Time Job';
    case 'CONTRACT':
      return 'Industry Challenge';
    default:
      return 'Full-Time Job';
  }
};

export function cityToCoordinates(
  cityName: string
): { lat: number; lng: number } {
  const found = CITIES_LIST.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return found ? found.coordinates : CITIES_LIST[0].coordinates;
}

export function mapApiJobToOpportunity(job: RawApiJob): Opportunity {
  return {
    id: `api-${job.id}`,
    title: job.title,
    company: job.company,
    companyLogo: job.company_website
      ? `https://www.google.com/s2/favicons/domain/${new URL(job.company_website).hostname}`
      : undefined,
    type: employmentTypeToOpportunityType(job.employment_type),
    location: job.location,
    city: job.city,
    coordinates: cityToCoordinates(job.city),
    distanceKm: undefined,
    workMode:
      job.work_mode === 'REMOTE'
        ? 'Remote'
        : job.work_mode === 'HYBRID'
          ? 'Hybrid'
          : 'On-site',
    stipend: job.salary.formatted || 'Competitive',
    duration: `${job.experience.formatted} experience required`,
    postedDate: new Date(job.published_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    }),
    deadline: 'Apply before posting closes',
    requiredSkills: job.skills.slice(0, 8),
    experienceLevel: job.experience.formatted,
    isStartup: job.trust_score < 85,
    description: job.description || job.summary,
    responsibilities: job.skills.map((s) => `Proficiency in ${s}`),
    perks: ['Health insurance', 'Flexible hours', 'Growth opportunities'],
    matchScore: job.trust_score,
    isMatchBoosted: job.verification.zero_scam_flags,
    // Normalized Schema
    source: job.source || 'Greenhouse Public Board',
    sourceUrl: job.application_url,
    applicationUrl: job.application_url,
    verified: Boolean(job.verification?.fail_closed_gate_passed ?? true),
    lastVerified: job.published_at || new Date().toISOString(),
    skills: job.skills,
    salary: job.salary?.formatted,
    applicationDeadline: 'Apply before posting closes',
    tags: [
      employmentTypeToOpportunityType(job.employment_type),
      job.work_mode === 'REMOTE' ? 'Remote' : job.work_mode === 'HYBRID' ? 'Hybrid' : 'On-site',
      job.city,
      ...job.skills.slice(0, 3)
    ],
  };
}

export async function fetchVerifiedJobs(params?: {
  city?: string;
  limit?: number;
  sort?: string;
  q?: string;
  skills?: string[];
}): Promise<JobsApiResponse> {
  const searchParams = new URLSearchParams();

  if (params?.city) searchParams.set('city', params.city);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.skills) {
    params.skills.forEach((s) => searchParams.append('skills', s));
  }

  const url = `${JOBS_API_BASE}?${searchParams.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch jobs: ${res.status} ${res.statusText}`
    );
  }

  return (await res.json()) as JobsApiResponse;
}

export async function fetchVerifiedJobsNearCity(
  city: string,
  limit: number = 20
): Promise<Opportunity[]> {
  const response = await fetchVerifiedJobs({
    city,
    limit,
    sort: 'recent',
  });
  return response.data.map(mapApiJobToOpportunity);
}

export async function fetchVerifiedJobsWithFilters(
  filters: {
    city?: string;
    limit?: number;
    sort?: string;
    q?: string;
    skills?: string[];
  }
): Promise<Opportunity[]> {
  const response = await fetchVerifiedJobs(filters);
  return response.data.map(mapApiJobToOpportunity);
}

export async function fetchVerifiedOpportunitiesFromApi(filters?: {
  city?: string;
  q?: string;
  type?: string;
  workMode?: string;
  skills?: string[];
  limit?: number;
}): Promise<Opportunity[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.city && filters.city !== 'All') params.set('city', filters.city);
    if (filters?.q) params.set('q', filters.q);
    if (filters?.type && filters.type !== 'All') params.set('type', filters.type);
    if (filters?.workMode && filters.workMode !== 'All') params.set('workMode', filters.workMode);
    if (filters?.skills && filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    if (filters?.limit) params.set('limit', String(filters.limit));

    const res = await fetch(`/api/opportunities?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch verified opportunities: ${res.status}`);
    }
    const data = await res.json();
    return data.opportunities || [];
  } catch (e) {
    console.warn('[Opportunities API] Fallback to direct verified provider:', e);
    return fetchVerifiedJobsNearCity(filters?.city || 'Bengaluru', filters?.limit || 20);
  }
}

