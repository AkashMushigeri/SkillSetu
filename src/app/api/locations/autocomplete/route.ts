import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface LocationSuggestion {
  displayName: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

// In-memory cache to reduce Nominatim queries and prevent rate-limiting
const cache = new Map<string, { timestamp: number; data: LocationSuggestion[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Map of common shorthand prefixes for major Indian education & tech hubs
const PREFIX_EXPANSIONS: Record<string, string> = {
  bang: 'bengaluru',
  beng: 'bengaluru',
  hyd: 'hyderabad',
  hyde: 'hyderabad',
  mum: 'mumbai',
  mumb: 'mumbai',
  del: 'delhi',
  delh: 'delhi',
  che: 'chennai',
  chen: 'chennai',
  kol: 'kolkata',
  kolk: 'kolkata',
  pun: 'pune',
  jai: 'jaipur',
  jaip: 'jaipur',
  ahm: 'ahmedabad',
  ahmed: 'ahmedabad',
  gur: 'gurugram',
  gurg: 'gurugram',
  noi: 'noida',
  mys: 'mysuru',
};

async function queryNominatim(searchTerm: string): Promise<any[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchTerm
    )}&format=jsonv2&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SkillSetu-CareerBridge/1.0 (academic-project; contact: support@skillsetu.edu)',
        'Accept-Language': 'en',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const normalizedQuery = q.toLowerCase();

    // Check cache
    const cached = cache.get(normalizedQuery);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ suggestions: cached.data });
    }

    // Determine query targets (original query + alias expansion if relevant)
    const queriesToRun = [q];
    const expansion = PREFIX_EXPANSIONS[normalizedQuery];
    if (expansion && expansion !== normalizedQuery) {
      queriesToRun.push(expansion);
    }

    const rawResults: any[] = [];
    for (const term of queriesToRun) {
      const items = await queryNominatim(term);
      if (Array.isArray(items)) {
        rawResults.push(...items);
      }
    }

    // Process & format suggestions
    const seen = new Set<string>();
    const suggestions: LocationSuggestion[] = [];

    for (const item of rawResults) {
      const addr = item.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.county ||
        item.name ||
        '';

      const state = addr.state || addr.province || addr.region || '';
      const country = addr.country || '';
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      if (!city && !item.name) continue;

      // Build clean presentation display name (e.g. "Bengaluru, Karnataka, India")
      const parts = [city || item.name];
      if (state && state !== city) parts.push(state);
      if (country) parts.push(country);
      const cleanDisplayName = parts.join(', ');

      if (cleanDisplayName && !seen.has(cleanDisplayName.toLowerCase())) {
        seen.add(cleanDisplayName.toLowerCase());
        suggestions.push({
          displayName: cleanDisplayName,
          city: city || item.name || '',
          state,
          country,
          latitude: isNaN(lat) ? 0 : lat,
          longitude: isNaN(lon) ? 0 : lon,
        });
      }

      // Also capture district if distinct (e.g. "Bengaluru Urban, Karnataka, India")
      if (addr.state_district && addr.state_district !== city) {
        const altParts = [addr.state_district];
        if (state && state !== addr.state_district) altParts.push(state);
        if (country) altParts.push(country);
        const altName = altParts.join(', ');
        if (!seen.has(altName.toLowerCase())) {
          seen.add(altName.toLowerCase());
          suggestions.push({
            displayName: altName,
            city: addr.state_district,
            state,
            country,
            latitude: isNaN(lat) ? 0 : lat,
            longitude: isNaN(lon) ? 0 : lon,
          });
        }
      }

      if (suggestions.length >= 8) break;
    }

    // Cache the clean results
    cache.set(normalizedQuery, { timestamp: Date.now(), data: suggestions });

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Location autocomplete route error:', error);
    return NextResponse.json(
      { suggestions: [], error: 'Failed to fetch location suggestions' },
      { status: 200 }
    );
  }
}
