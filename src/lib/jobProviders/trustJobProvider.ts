import { RawProviderJob } from './types';
import { RawApiJob } from '@/lib/jobsApi';

const TRUSTJOB_API_BASE = 'https://3jmczl-r104kkoiy-arcadawebapps8.vercel.app/api/v1/jobs';

export async function fetchTrustJobVerifiedJobs(): Promise<RawProviderJob[]> {
  try {
    const url = `${TRUSTJOB_API_BASE}?limit=100&sort=recent`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`[TrustJobProvider] HTTP ${res.status}: ${res.statusText}`);
      return [];
    }

    const json = await res.json();
    const jobs: RawApiJob[] = json.data || [];

    return jobs.map((job) => ({
      id: `tj-${job.id}`,
      title: job.title,
      company: job.company,
      companyDomain: job.company_domain,
      companyWebsite: job.company_website,
      location: job.location,
      city: job.city,
      workMode:
        job.work_mode === 'REMOTE'
          ? 'Remote'
          : job.work_mode === 'HYBRID'
            ? 'Hybrid'
            : 'On-site',
      employmentType: job.employment_type,
      salary: job.salary?.formatted || 'Competitive',
      experience: job.experience?.formatted || '0–2 Years',
      skills: job.skills || [],
      description: job.description || job.summary,
      summary: job.summary,
      applicationUrl: job.application_url,
      source: job.source || 'Greenhouse Public Board',
      sourceUrl: job.application_url,
      publishedAt: job.published_at,
      trustScore: job.trust_score || 100,
      isStartup: job.trust_score < 85,
    }));
  } catch (err: any) {
    console.warn('[TrustJobProvider] Fetch error:', err?.message || err);
    return [];
  }
}
