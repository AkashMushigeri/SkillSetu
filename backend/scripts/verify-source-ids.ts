/**
 * One-off verification of the 0014 backfill.
 *
 * Confirms that every seeded `skill_resources` row now carries a `source_id`, and
 * that the values are unique per skill — the property the partial unique index is
 * supposed to guarantee. Run against Neon dev only.
 *
 *   npx tsx scripts/verify-source-ids.ts
 */

import { Client } from 'pg';
import { loadLocalEnvFile } from '../src/config/envFile';
import { loadDatabaseEnv } from '../src/config/env';

async function main(): Promise<void> {
  loadLocalEnvFile();

  if ((process.env.NEON_BRANCH ?? 'dev') === 'production') {
    throw new Error('refusing to run against the production branch');
  }

  const { databaseUrl } = loadDatabaseEnv(process.env);
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  const totals = await client.query<{
    total: string;
    with_source_id: string;
    distinct_ids: string;
  }>(
    `SELECT count(*)::text AS total,
            count(source_id)::text AS with_source_id,
            count(DISTINCT source_id)::text AS distinct_ids
       FROM skill_resources`,
  );

  // Duplicates per (skill_id, source_id) would mean the mapping is ambiguous.
  const dupes = await client.query<{ skill_id: string; source_id: string; count: string }>(
    `SELECT skill_id::text, source_id, count(*)::text AS count
       FROM skill_resources
      WHERE source_id IS NOT NULL
      GROUP BY skill_id, source_id
     HAVING count(*) > 1
      LIMIT 10`,
  );

  const sample = await client.query(
    `SELECT s.slug, r.source_id, r.title
       FROM skill_resources r
       JOIN skills s ON s.id = r.skill_id
      WHERE r.source_id IS NOT NULL
      ORDER BY s.slug, r.position
      LIMIT 6`,
  );

  console.log('totals:', totals.rows[0]);
  console.log('duplicates per (skill_id, source_id):', dupes.rows.length, dupes.rows);
  console.log('sample:');
  for (const row of sample.rows) {
    console.log(' ', row.slug, '/', row.source_id, '->', row.title);
  }

  await client.end();
}

void main();
