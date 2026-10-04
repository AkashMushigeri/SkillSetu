import type { PoolClient } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

export type RequestableRole = 'industry' | 'college';

export type OrganizationSnapshot = {
  name?: string | null;
  code?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  industry?: string | null;
  about?: string | null;
  logoUrl?: string | null;
};

/**
 * Must stay identical to `normalizeName` in db/seed.ts. Approval matches against
 * rows that `db:seed` wrote, so a divergence here would silently create a duplicate
 * company or college instead of reusing the existing one.
 */
export function normalizeOrganizationName(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function clean(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Hard rules from the plan, enforced at request time so
 * `role_requests.organization_snapshot` is always well-formed enough for approval
 * to resolve deterministically. Re-checked at approval time by
 * `assertSnapshotUsable`.
 */
export function validateSnapshot(
  requestedRole: RequestableRole,
  snapshot: OrganizationSnapshot,
): OrganizationSnapshot {
  const name = clean(snapshot.name);

  if (!name) {
    throw AppError.badRequest(
      `organization.name is required for a ${requestedRole} request.`,
      'organization_name_required',
    );
  }

  if (requestedRole === 'college') {
    const code = clean(snapshot.code);

    if (!code) {
      throw AppError.badRequest(
        'organization.code is required for a college request.',
        'organization_code_required',
      );
    }

    return { ...snapshot, name, code: code.toUpperCase() };
  }

  return { ...snapshot, name };
}

function assertSnapshotUsable(requestedRole: RequestableRole, snapshot: OrganizationSnapshot): void {
  try {
    validateSnapshot(requestedRole, snapshot);
  } catch (error) {
    throw AppError.unprocessable(
      `The stored organization snapshot for this request is incomplete (${(error as Error).message})`,
      'organization_snapshot_incomplete',
    );
  }
}

export type ResolvedOrganization = {
  companyId: string | null;
  collegeId: string | null;
  strategy: 'explicit' | 'user_fk' | 'owned' | 'matched' | 'created';
};

async function assertCompanyExists(client: PoolClient, companyId: string): Promise<void> {
  const found = await client.query('SELECT 1 FROM companies WHERE id = $1', [companyId]);

  if (found.rowCount === 0) {
    throw AppError.unprocessable('The supplied companyId does not exist.', 'company_not_found');
  }
}

async function assertCollegeExists(client: PoolClient, collegeId: string): Promise<void> {
  const found = await client.query('SELECT 1 FROM colleges WHERE id = $1', [collegeId]);

  if (found.rowCount === 0) {
    throw AppError.unprocessable('The supplied collegeId does not exist.', 'college_not_found');
  }
}

/**
 * Runs inside the caller's approval transaction so a failure at any step rolls the
 * whole approval back — no half-approved user can ever exist.
 *
 * Order is fixed by the plan:
 *   1. admin-supplied override
 *   2. organization already associated with the user
 *   3. organization the user already owns / already matched by natural key
 *   4. create from the stored snapshot
 *   5. assert the FK is non-null, else 422
 */
export async function resolveOrganization(
  client: PoolClient,
  input: {
    requestedRole: RequestableRole;
    userId: string;
    snapshot: OrganizationSnapshot;
    explicitCompanyId?: string | null;
    explicitCollegeId?: string | null;
  },
): Promise<ResolvedOrganization> {
  const { requestedRole, userId, snapshot } = input;

  if (requestedRole === 'industry') {
    const explicit = clean(input.explicitCompanyId);

    if (explicit) {
      await assertCompanyExists(client, explicit);
      return { companyId: explicit, collegeId: null, strategy: 'explicit' };
    }

    const existingFk = await client.query<{ company_id: string | null }>(
      'SELECT company_id FROM users WHERE id = $1',
      [userId],
    );

    if (existingFk.rows[0]?.company_id) {
      return { companyId: existingFk.rows[0].company_id, collegeId: null, strategy: 'user_fk' };
    }

    const owned = await client.query<{ id: string }>(
      'SELECT id FROM companies WHERE owner_user_id = $1 LIMIT 1',
      [userId],
    );

    if (owned.rows[0]) {
      return { companyId: owned.rows[0].id, collegeId: null, strategy: 'owned' };
    }

    assertSnapshotUsable('industry', snapshot);
    const normalized = normalizeOrganizationName(snapshot.name);

    const matched = await client.query<{ id: string }>(
      'SELECT id FROM companies WHERE normalized_name = $1 LIMIT 1',
      [normalized],
    );

    if (matched.rows[0]) {
      return { companyId: matched.rows[0].id, collegeId: null, strategy: 'matched' };
    }

    const created = await client.query<{ id: string }>(
      `INSERT INTO companies (name, normalized_name, website_url, city, state, industry, about, logo_url, owner_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        clean(snapshot.name),
        normalized,
        clean(snapshot.website),
        clean(snapshot.city),
        clean(snapshot.state),
        clean(snapshot.industry),
        clean(snapshot.about),
        clean(snapshot.logoUrl),
        userId,
      ],
    );

    logger.info({ strategy: 'created', normalized }, 'organization created during approval');
    return { companyId: created.rows[0]!.id, collegeId: null, strategy: 'created' };
  }

  const explicit = clean(input.explicitCollegeId);

  if (explicit) {
    await assertCollegeExists(client, explicit);
    return { companyId: null, collegeId: explicit, strategy: 'explicit' };
  }

  const existingFk = await client.query<{ college_id: string | null }>(
    'SELECT college_id FROM users WHERE id = $1',
    [userId],
  );

  if (existingFk.rows[0]?.college_id) {
    return { companyId: null, collegeId: existingFk.rows[0].college_id, strategy: 'user_fk' };
  }

  assertSnapshotUsable('college', snapshot);
  const code = clean(snapshot.code)!.toUpperCase();
  const normalized = normalizeOrganizationName(snapshot.name);

  // Colleges are keyed by code, which is globally unique.
  const matched = await client.query<{ id: string }>(
    'SELECT id FROM colleges WHERE code = $1 LIMIT 1',
    [code],
  );

  if (matched.rows[0]) {
    return { companyId: null, collegeId: matched.rows[0].id, strategy: 'matched' };
  }

  const byName = await client.query<{ id: string }>(
    'SELECT id FROM colleges WHERE normalized_name = $1 LIMIT 1',
    [normalized],
  );

  if (byName.rows[0]) {
    return { companyId: null, collegeId: byName.rows[0].id, strategy: 'matched' };
  }

  const created = await client.query<{ id: string }>(
    `INSERT INTO colleges (name, normalized_name, code, city, state, about, logo_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id`,
    [
      clean(snapshot.name),
      normalized,
      code,
      clean(snapshot.city),
      clean(snapshot.state),
      clean(snapshot.about),
      clean(snapshot.logoUrl),
    ],
  );

  logger.info({ strategy: 'created', code }, 'organization created during approval');
  return { companyId: null, collegeId: created.rows[0]!.id, strategy: 'created' };
}

/** Approval-time invariant 2. A privileged role with a NULL org FK rolls back. */
export function assertOrganizationLinked(
  requestedRole: RequestableRole,
  resolved: ResolvedOrganization,
): void {
  const missing =
    (requestedRole === 'industry' && !resolved.companyId) ||
    (requestedRole === 'college' && !resolved.collegeId);

  if (missing) {
    throw AppError.unprocessable(
      `Cannot approve a ${requestedRole} request without a resolved organization.`,
      'organization_unresolved',
    );
  }
}
