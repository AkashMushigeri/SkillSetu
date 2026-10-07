import { Opportunity } from '@/types/student';

interface CacheEntry {
  data: Opportunity[];
  timestamp: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

let globalOpportunitiesCache: CacheEntry | null = null;

export function getCachedOpportunities(): Opportunity[] | null {
  if (!globalOpportunitiesCache) return null;
  const isFresh = Date.now() - globalOpportunitiesCache.timestamp < CACHE_TTL_MS;
  if (!isFresh) {
    return null;
  }
  return globalOpportunitiesCache.data;
}

export function setCachedOpportunities(opportunities: Opportunity[]): void {
  globalOpportunitiesCache = {
    data: opportunities,
    timestamp: Date.now(),
  };
}

export function clearOpportunitiesCache(): void {
  globalOpportunitiesCache = null;
}
