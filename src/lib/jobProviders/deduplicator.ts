import { Opportunity } from '@/types/student';

function cleanString(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function deduplicateOpportunities(opportunities: Opportunity[]): Opportunity[] {
  const seenUrls = new Set<string>();
  const seenSignatures = new Map<string, Opportunity>();

  for (const opp of opportunities) {
    // 1. Direct URL deduplication
    const normUrl = (opp.applicationUrl || '').trim().toLowerCase();
    if (normUrl && seenUrls.has(normUrl)) {
      continue;
    }

    // 2. Composite key deduplication: company + title + city
    const sig = `${cleanString(opp.company)}_${cleanString(opp.title)}_${cleanString(opp.city)}`;
    const existing = seenSignatures.get(sig);

    if (existing) {
      // Keep the one with richer information (e.g. longer description or verified logo)
      if (
        (!existing.companyLogo && opp.companyLogo) ||
        (opp.description && opp.description.length > (existing.description?.length || 0))
      ) {
        seenSignatures.set(sig, opp);
        if (normUrl) seenUrls.add(normUrl);
      }
      continue;
    }

    seenSignatures.set(sig, opp);
    if (normUrl) seenUrls.add(normUrl);
  }

  return Array.from(seenSignatures.values());
}
