import { RawProviderJob } from './types';

interface AshbyCompany {
  token: string;
  name: string;
  domain: string;
}

const ASHBY_COMPANIES: AshbyCompany[] = [
  { token: 'openai', name: 'OpenAI', domain: 'openai.com' },
  { token: 'ramp', name: 'Ramp', domain: 'ramp.com' },
  { token: 'replit', name: 'Replit', domain: 'replit.com' },
];

export async function fetchAshbyJobs(): Promise<RawProviderJob[]> {
  const allJobs: RawProviderJob[] = [];

  for (const company of ASHBY_COMPANIES) {
    try {
      const url = `https://api.ashbyhq.com/posting-api/job-board/${company.token}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const jobs = data.jobs || [];

      for (const j of jobs.slice(0, 20)) {
        if (!j.title || !j.jobUrl) continue;

        allJobs.push({
          id: `ashby-${company.token}-${j.id}`,
          title: j.title,
          company: company.name,
          companyDomain: company.domain,
          location: j.location || 'Remote',
          applicationUrl: j.jobUrl,
          source: `Ashby - ${company.name} Careers`,
          sourceUrl: j.jobUrl,
          publishedAt: j.publishedAt || new Date().toISOString(),
          trustScore: 99,
          isStartup: company.token !== 'openai',
        });
      }
    } catch (err: any) {
      console.warn(`[AshbyProvider] Failed to fetch ${company.token}:`, err?.message);
    }
  }

  return allJobs;
}
