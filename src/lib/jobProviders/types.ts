import { Opportunity, OpportunityType } from '@/types/student';

export interface RawProviderJob {
  id: string;
  title: string;
  company: string;
  companyDomain?: string;
  companyWebsite?: string;
  companyLogo?: string;
  location: string;
  city?: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  employmentType?: string;
  salary?: string;
  experience?: string;
  skills?: string[];
  description?: string;
  summary?: string;
  applicationUrl: string;
  source: string;
  sourceUrl?: string;
  publishedAt?: string;
  deadline?: string;
  trustScore?: number;
  isStartup?: boolean;
  perks?: string[];
}

export interface JobFilterParams {
  city?: string;
  q?: string;
  skills?: string[];
  type?: OpportunityType | 'All';
  workMode?: 'Remote' | 'Hybrid' | 'On-site' | 'All';
  limit?: number;
  offset?: number;
  sort?: 'recent' | 'match' | 'distance';
}

export interface AggregatedOpportunitiesResponse {
  success: boolean;
  total: number;
  opportunities: Opportunity[];
  sources: Array<{ name: string; count: number; status: 'active' | 'degraded' | 'error' }>;
  cachedAt: string;
}
