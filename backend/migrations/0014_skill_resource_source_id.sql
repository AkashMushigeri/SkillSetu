-- 0014_skill_resource_source_id.sql
-- Gives skill_resources a stable identity that matches the frontend catalog.
--
-- Why this is needed
-- ------------------
-- The frontend skill catalog (`src/data/skillsData.ts`) addresses learning
-- resources by a local string id such as `c-1`. The seeder writes that catalog
-- into `skill_resources`, which previously had no column carrying the local id:
--
--   skill_resources_position_per_skill UNIQUE (skill_id, position)
--
-- so the only link between a static `ResourceItem` and its database row was the
-- ordinal `position`, assigned as the array index. That makes identity
-- positional: inserting a resource in the middle of the static array shifts every
-- later `position`, and any client holding a saved local id for a resource would
-- silently start writing progress against a *different* row. Reordering the
-- catalog is a normal editorial action, so this was a live risk rather than a
-- theoretical one.
--
-- `source_id` carries the catalog id verbatim and is unique per skill, which
-- makes the mapping explicit and stable. Progress writes are addressed by
-- `skill_id` + `source_id`, so they no longer depend on list order at all.
--
-- Backfill
-- --------
-- Rows are backfilled from the ordinal that the seeder itself used, so existing
-- resources get their catalog id rather than a NULL:
--
--   UPDATE skill_resources r
--      SET source_id = c.source_id
--     FROM (
--       SELECT sr.id,
--              s.slug || '-' || (sr.position + 1) AS source_id
--         FROM skill_resources sr
--         JOIN skills s ON s.id = sr.skill_id
--     ) c
--    WHERE r.id = c.id;
--
-- The generated form mirrors the `<skill-slug>-<n>` convention used by the
-- catalog (`c-basic` -> `c-basic-1`). If a future catalog id differs from the
-- generated one, the seeder writes the authoritative value on its next run.

ALTER TABLE skill_resources
  ADD COLUMN IF NOT EXISTS source_id text;

COMMENT ON COLUMN skill_resources.source_id IS
  'Stable frontend catalog id (ResourceItem.id). Null until backfilled or re-seeded.';

UPDATE skill_resources r
   SET source_id = c.source_id
  FROM (
    SELECT sr.id,
           s.slug || '-' || (sr.position + 1) AS source_id
      FROM skill_resources sr
      JOIN skills s ON s.id = sr.skill_id
  ) c
 WHERE r.id = c.id
   AND r.source_id IS NULL;

-- Uniqueness is per skill, not global: two skills can legitimately reuse the same
-- local resource id if the catalog ever nests ids that way.
CREATE UNIQUE INDEX IF NOT EXISTS skill_resources_source_id_uniq
  ON skill_resources (skill_id, source_id)
  WHERE source_id IS NOT NULL;

-- Partial index rather than a uniqueness constraint so rows that have not been
-- seeded yet (source_id IS NULL) do not collide with each other.
CREATE INDEX IF NOT EXISTS skill_resources_source_id_lookup_idx
  ON skill_resources (skill_id, source_id)
  WHERE source_id IS NOT NULL;
