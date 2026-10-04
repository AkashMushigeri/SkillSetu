/**
 * Dependency-free geo helpers, safe to import from both client and server code.
 * (Unlike `@/lib/matchUtils`, which pulls in the server-side AI matching service.)
 */

/** Bengaluru — the app's default city (CITIES_LIST[0]). */
export const DEFAULT_CITY_COORDINATES = { lat: 12.9716, lng: 77.5946 } as const;

/**
 * Resolves an opportunity's coordinates defensively.
 *
 * `Opportunity.coordinates` is declared as required, but opportunities reach the
 * student app from three untrusted sources (localStorage sync envelopes, the live
 * jobs API, and Data Connect), any of which can return records with missing or
 * non-numeric coordinates. Reading `opp.coordinates.lat` directly then throws
 * "Cannot read properties of undefined (reading 'lat')" and takes down the whole
 * provider tree. Falls back to the default city per axis.
 */
export function resolveOpportunityCoordinates(opportunity: {
  coordinates?: { lat?: number; lng?: number } | null;
} | null | undefined): { lat: number; lng: number } {
  const { lat, lng } = opportunity?.coordinates ?? {};
  return {
    lat:
      typeof lat === 'number' && Number.isFinite(lat)
        ? lat
        : DEFAULT_CITY_COORDINATES.lat,
    lng:
      typeof lng === 'number' && Number.isFinite(lng)
        ? lng
        : DEFAULT_CITY_COORDINATES.lng,
  };
}
