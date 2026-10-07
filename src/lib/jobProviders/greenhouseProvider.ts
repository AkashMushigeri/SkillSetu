import { RawProviderJob } from './types';

interface GreenhouseCompany {
  token: string;
  name: string;
  domain: string;
}

const GREENHOUSE_COMPANIES: GreenhouseCompany[] = [
  { token: 'gitlab', name: 'GitLab', domain: 'gitlab.com' },
  { token: 'cloudflare', name: 'Cloudflare', domain: 'cloudflare.com' },
  { token: 'canonical', name: 'Canonical (Ubuntu)', domain: 'canonical.com' },
];

export async function fetchGreenhouseJobs(): Promise<RawProviderJob[]> {
  const allJobs: RawProviderJob[] = [];

  for (const company of GREENHOUSE_COMPANIES) {
    try {
      const url = `https://boards-api.greenhouse.io/v1/boards/${company.token}/jobs`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const jobs = data.jobs || [];

      // Take top active openings
      for (const j of jobs.slice(0, 25)) {
        if (!j.title || !j.absolute_url) continue;

        allJobs.push({
          id: `gh-${company.token}-${j.id}`,
          title: j.title,
          company: company.name,
          companyDomain: company.domain,
          location: j.location?.name || 'Remote / Hybrid',
          applicationUrl: j.absolute_url,
          source: `Greenhouse - ${company.name} Careers`,
          sourceUrl: j.absolute_url,
          publishedAt: j.updated_at || new Date().toISOString(),
          trustScore: 98,
          isStartup: false,
        });
      }
    } catch (err: any) {
      console.warn(`[GreenhouseProvider] Failed to fetch ${company.token}:`, err?.message);
    }
  }

  return allJobs;
}
