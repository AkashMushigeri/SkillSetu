-- 0012_hiring_preferences.sql
-- Two genuine gaps found by the persistence audit; everything else in the audit
-- mapped onto an existing table from 0001-0011.
--
-- 1. hiring_preferences. IndustryContext.hiringPreferences lived in React state
--    only and was never persisted, so a recruiter's screening criteria silently
--    reset on every reload. companies holds descriptive columns but nothing that
--    represents per-recruiter screening configuration, so there was no table to
--    reuse.
--
--    Keyed by user_id rather than company_id because the criteria are the
--    recruiter's working preferences (search radius, minimum CGPA, whether to
--    weight verified skills) and two recruiters at the same company should not
--    overwrite each other. company_id is still carried so authorization can scope
--    the row the same way it scopes every other industry table. The database
--    cannot express "this company_id is the user's own company" as a foreign key,
--    so the route never accepts a client-supplied company_id and always writes
--    req.user.companyId.
--
-- 2. company_candidate_lists. IndustryContext stored the recruiter talent pool
--    as a boolean flag on each element of a localStorage candidate array. That
--    cannot survive a device change and cannot be authorized against a company,
--    so it needs a real table.
--
--    candidate_user_id references users because talent-pool membership is only
--    meaningful for a real candidate account. The seeded mock candidates in
--    src/data/industry/industryCandidates.ts have no users row and therefore
--    cannot be enrolled here; see the final report, this is a data gap and not a
--    schema gap.

CREATE TABLE hiring_preferences (
  user_id uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  preferred_departments text[] NOT NULL DEFAULT '{}',
  preferred_degrees text[] NOT NULL DEFAULT '{}',
  preferred_graduation_years text[] NOT NULL DEFAULT '{}',
  preferred_locations text[] NOT NULL DEFAULT '{}',
  work_modes work_mode[] NOT NULL DEFAULT '{}',
  minimum_cgpa numeric(3, 2),
  prioritize_verified_skills boolean NOT NULL DEFAULT false,
  prioritize_startup_experience boolean NOT NULL DEFAULT false,
  search_radius_km integer NOT NULL DEFAULT 25,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hiring_preferences_minimum_cgpa_range
    CHECK (minimum_cgpa IS NULL OR (minimum_cgpa >= 0 AND minimum_cgpa <= 10)),
  CONSTRAINT hiring_preferences_radius_range
    CHECK (search_radius_km > 0)
);

CREATE INDEX hiring_preferences_company_idx ON hiring_preferences (company_id);

CREATE TRIGGER hiring_preferences_set_updated_at
  BEFORE UPDATE ON hiring_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE company_candidate_lists (
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  candidate_user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category text NOT NULL,
  note text,
  shortlisted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (company_id, candidate_user_id),
  CONSTRAINT company_candidate_lists_category_not_blank
    CHECK (btrim(category) <> '')
);

CREATE INDEX company_candidate_lists_candidate_idx
  ON company_candidate_lists (candidate_user_id);
CREATE INDEX company_candidate_lists_company_category_idx
  ON company_candidate_lists (company_id, category);

CREATE TRIGGER company_candidate_lists_set_updated_at
  BEFORE UPDATE ON company_candidate_lists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();