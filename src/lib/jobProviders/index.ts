import { Opportunity } from '@/types/student';
import { RawProviderJob, JobFilterParams } from './types';
import { fetchTrustJobVerifiedJobs } from './trustJobProvider';
import { fetchGreenhouseJobs } from './greenhouseProvider';
import { fetchAshbyJobs } from './ashbyProvider';
import { normalizeRawJob } from './normalizer';
import { validateOpportunity } from './validator';
import { deduplicateOpportunities } from './deduplicator';
import {
  getCachedOpportunities,
  setCachedOpportunities,
} from './cache';

export * from './types';
export * from './normalizer';
export * from './validator';
export * from './deduplicator';
export * from './cache';

/**
 * Master Ingestion Pipeline:
 * SOURCE -> FETCH -> NORMALIZE -> VALIDATE -> DEDUPLICATE -> CACHE -> DISPLAY
 */
export async function ingestAllVerifiedOpportunities(): Promise<Opportunity[]> {
  // 1. Check in-memory cache
  const cached = getCachedOpportunities();
  if (cached && cached.length > 0) {
    return cached;
  }

  // 2. Fetch from legitimate multi-provider sources in parallel
  const [trustJobRes, greenhouseRes, ashbyRes] = await Promise.allSettled([
    fetchTrustJobVerifiedJobs(),
    fetchGreenhouseJobs(),
    fetchAshbyJobs(),
  ]);

  const rawJobs: RawProviderJob[] = [];

  if (trustJobRes.status === 'fulfilled') {
    rawJobs.push(...trustJobRes.value);
  } else {
    console.warn('[Ingestion] TrustJob provider failed:', trustJobRes.reason);
  }

  if (greenhouseRes.status === 'fulfilled') {
    rawJobs.push(...greenhouseRes.value);
  } else {
    console.warn('[Ingestion] Greenhouse provider failed:', greenhouseRes.reason);
  }

  if (ashbyRes.status === 'fulfilled') {
    rawJobs.push(...ashbyRes.value);
  } else {
    console.warn('[Ingestion] Ashby provider failed:', ashbyRes.reason);
  }

  // 3. Normalize to common Opportunity schema
  const normalized = rawJobs.map(normalizeRawJob);

  // 4. Validate (reject mock, fake, malformed URLs, or expired listings)
  const validated = normalized.filter(validateOpportunity);

  // 5. Deduplicate across sources
  const deduplicated = deduplicateOpportunities(validated);

  // 6. Cache the clean verified opportunities
  if (deduplicated.length > 0) {
    setCachedOpportunities(deduplicated);
  }

  return deduplicated;
}

/**
 * Filter opportunities according to student criteria
 */
export async function getVerifiedOpportunities(
  filters?: JobFilterParams
): Promise<Opportunity[]> {
  let list = await ingestAllVerifiedOpportunities();

  if (!filters) return list;

  // City filter
  if (filters.city && filters.city !== 'All') {
    const cLower = filters.city.toLowerCase();
    list = list.filter(
      (opp) =>
        opp.city.toLowerCase() === cLower ||
        opp.location.toLowerCase().includes(cLower) ||
        opp.workMode === 'Remote'
    );
  }

  // Search keyword (role, company, location, skills)
  if (filters.q && filters.q.trim()) {
    const qLower = filters.q.toLowerCase().trim();
    list = list.filter(
      (opp) =>
        opp.title.toLowerCase().includes(qLower) ||
        opp.company.toLowerCase().includes(qLower) ||
        opp.location.toLowerCase().includes(qLower) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(qLower))
    );
  }

  // Opportunity Type filter
  if (filters.type && filters.type !== 'All') {
    list = list.filter((opp) => opp.type === filters.type);
  }

  // Work Mode filter
  if (filters.workMode && filters.workMode !== 'All') {
    list = list.filter((opp) => opp.workMode === filters.workMode);
  }

  // Skills filter
  if (filters.skills && filters.skills.length > 0) {
    const req = filters.skills.map((s) => s.toLowerCase());
    list = list.filter((opp) =>
      opp.requiredSkills.some((s) => req.includes(s.toLowerCase()))
    );
  }

  // Limit
  if (typeof filters.limit === 'number' && filters.limit > 0) {
    const offset = filters.offset || 0;
    list = list.slice(offset, offset + filters.limit);
  }

  return list;
}

/**
 * Find a verified opportunity by its id
 */
export async function getOpportunityById(id: string): Promise<Opportunity | undefined> {
  const all = await ingestAllVerifiedOpportunities();
  return all.find((o) => o.id === id);
}
