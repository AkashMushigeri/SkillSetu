import { Opportunity } from '@/types/student';

const FORBIDDEN_WORDS = [
  'fake',
  'mock',
  'dummy',
  'sample job',
  'test opportunity',
  'lorem ipsum',
  'placeholder'
];

export function isValidApplicationUrl(urlStr?: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isExpired(deadline?: string): boolean {
  if (!deadline) return false;
  try {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return false;
    return deadlineDate.getTime() < Date.now();
  } catch {
    return false;
  }
}

export function validateOpportunity(opp: Opportunity): boolean {
  if (!opp) return false;

  // 1. Title check
  if (!opp.title || opp.title.trim().length < 3) return false;
  const titleLower = opp.title.toLowerCase();
  if (FORBIDDEN_WORDS.some((word) => titleLower.includes(word))) return false;

  // 2. Company check
  if (!opp.company || opp.company.trim().length < 2) return false;
  const companyLower = opp.company.toLowerCase();
  if (FORBIDDEN_WORDS.some((word) => companyLower.includes(word))) return false;

  // 3. Application URL check
  if (!opp.applicationUrl || !isValidApplicationUrl(opp.applicationUrl)) return false;

  // 4. Expiration check
  if (isExpired(opp.applicationDeadline || opp.deadline)) return false;

  // 5. Source check
  if (!opp.source || opp.source.trim().length === 0) return false;

  return true;
}
