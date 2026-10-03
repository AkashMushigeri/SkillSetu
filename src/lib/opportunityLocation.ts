// ponytail: company coordinates locate the employer, not a job site; use verified listing coordinates when the schema gains them.
export function companyListingCoordinates(
  listingLocation: string | null | undefined,
  workMode: string | null | undefined,
  companyLocation: string | null | undefined,
  coordinates: unknown
): { lat: number; lng: number } | undefined {
  if (workMode?.toLowerCase() === 'remote' || !listingLocation?.trim() || !companyLocation?.trim()) return;
  if (listingLocation.trim().toLowerCase() !== companyLocation.trim().toLowerCase()) return;
  if (!coordinates || typeof coordinates !== 'object') return;
  const { lat, lng } = coordinates as Record<string, unknown>;
  if (typeof lat !== 'number' || typeof lng !== 'number') return;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
  return { lat, lng };
}
