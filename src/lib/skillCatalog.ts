'use client';

/**
 * Resolves static catalog ids to Neon identifiers.
 *
 * The frontend skill catalog is a TypeScript literal addressed by local string
 * ids — `c-basic` for a skill, `c-1` for one of its resources. PostgreSQL uses
 * UUIDs. Nothing in the old code reconciled the two, because nothing had to:
 * skills and resources were never persisted, they were imported as static data.
 *
 * Once `user_skills` and `skill_resource_progress` became real tables, the gap
 * mattered, and resolving it on the client was the wrong place to do it. A
 * client-side lookup can drift from the database at any moment — a stale
 * catalog bundle, a re-seed that changed an id, a resource the student sees but
 * the API has not got. So:
 *
 *   - skills resolve by `slug`, which the seeder sets from the catalog id, and
 *     the UUID comes from `GET /api/skills`
 *   - resources resolve by `source_id`, added in migration 0014 precisely because
 *     `position` is ordinal and would silently remap ids if the catalog were
 *     reordered
 *
 * `POST /api/student/skills/:id/resources/:resourceId/progress` accepts the
 * `source_id` directly, so the common case needs no UUID lookup at all.
 */

import type { SkillItem } from '@/data/skillsData';
import { skills as skillsApi } from '@/lib/domainApi';

export type CatalogSkillRow = {
  id: string;
  slug: string;
  name: string;
  tier: string;
  category: string | null;
};

export type CatalogResourceRow = {
  id: string;
  source_id: string | null;
  title: string;
  type: string;
  duration: string | null;
  url: string | null;
  topic: string | null;
  description: string | null;
  position: number;
};

export type CatalogIndex = {
  /** catalog slug -> Neon skill UUID */
  skillIdBySlug: Record<string, string>;
  /** catalog skill id -> Neon skill UUID */
  skillIdByCatalogId: Record<string, string>;
  /** Neon skill UUID -> catalog resource id -> Neon resource UUID */
  resourceIdByCatalogId: Record<string, Record<string, string>>;
  /** Catalog ids the database does not have. Reported rather than ignored. */
  unresolvedSkills: string[];
};

/**
 * Builds the slug -> UUID index from one catalog request.
 *
 * `slug` is the join key, not `name`: names are display text that can be edited
 * and are not unique across tiers, whereas the seeder sets `slug` from the
 * catalog id verbatim.
 */
export function buildSkillIndex(rows: CatalogSkillRow[]): Map<string, string> {
  const index = new Map<string, string>();

  for (const row of rows) {
    if (row.slug) {
      index.set(row.slug, row.id);
    }
  }

  return index;
}

/**
 * Loads the skill id index once and caches it for the session.
 *
 * The catalog does not change while the app is open, so refetching it per
 * component would be pure waste; the cache is dropped when a mutation could have
 * invalidated it.
 */
let cachedIndex: Map<string, string> | null = null;
let inFlight: Promise<Map<string, string>> | null = null;

export async function loadSkillIdIndex(force = false): Promise<Map<string, string>> {
  if (cachedIndex && !force) {
    return cachedIndex;
  }

  // Collapse concurrent callers: several portal components mount at once and
  // would otherwise each fetch the whole catalog.
  if (inFlight && !force) {
    return inFlight;
  }

  inFlight = skillsApi
    .catalog()
    .then((response) => {
      const index = buildSkillIndex(response.skills as CatalogSkillRow[]);
      cachedIndex = index;
      inFlight = null;
      return index;
    })
    .catch((err) => {
      inFlight = null;
      throw err;
    });

  return inFlight;
}

export function invalidateSkillIndex(): void {
  cachedIndex = null;
  inFlight = null;
}

export class UnresolvedSkillError extends Error {
  readonly catalogIds: string[];

  constructor(catalogIds: string[]) {
    super(
      catalogIds.length === 1
        ? `No database skill matches catalog id "${catalogIds[0]}".`
        : `No database skill matches these catalog ids: ${catalogIds.join(', ')}.`,
    );
    this.name = 'UnresolvedSkillError';
    this.catalogIds = catalogIds;
  }
}

/**
 * Resolves one catalog skill to a Neon UUID.
 *
 * Throws rather than returning null: silently skipping a skill would show the
 * student a catalog entry that cannot be saved, and the write would appear to
 * succeed. A failure here means the seed and the catalog have diverged, which is
 * worth surfacing.
 */
export async function resolveSkillUuid(catalogId: string): Promise<string> {
  const index = await loadSkillIdIndex();
  const resolved = index.get(catalogId);

  if (!resolved) {
    throw new UnresolvedSkillError([catalogId]);
  }

  return resolved;
}

/**
 * Resolves many at once and reports every miss in a single error.
 *
 * Used when a student's whole skill set is saved at once: failing on the first
 * unknown id would tell the caller nothing about the rest.
 */
export async function resolveSkillUuids(catalogIds: string[]): Promise<string[]> {
  const index = await loadSkillIdIndex();
  const resolved: string[] = [];
  const missing: string[] = [];

  for (const catalogId of catalogIds) {
    const uuid = index.get(catalogId);
    if (uuid) {
      resolved.push(uuid);
    } else if (!missing.includes(catalogId)) {
      missing.push(catalogId);
    }
  }

  if (missing.length > 0) {
    throw new UnresolvedSkillError(missing);
  }

  return resolved;
}

/**
 * The skill's local id is its slug, so this is a lookup with no ambiguity.
 *
 * Kept as a named helper because "slugify the name" is the plausible wrong
 * implementation and it would collide across tiers.
 */
export function catalogIdFor(item: Pick<SkillItem, 'id'>): string {
  return item.id;
}

/**
 * Builds the resource-id map for one skill.
 *
 * Resources whose `source_id` is NULL (rows seeded before migration 0014 and not
 * yet re-seeded) are skipped rather than guessed. Guessing from `position` would
 * reintroduce exactly the ordinal dependency `source_id` exists to remove.
 */
export function buildResourceMap(
  skillUuid: string,
  resources: CatalogResourceRow[],
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const resource of resources) {
    if (resource.source_id) {
      map[resource.source_id] = resource.id;
    }
  }

  return map;
}
