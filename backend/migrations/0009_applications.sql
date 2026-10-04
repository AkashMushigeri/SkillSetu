-- 0009_applications.sql
-- An application targets exactly one opportunity, which may be internal
-- (jobs/internships), external (the verified jobs API, recorded textually), or
-- both a job and an internship row for internal referrals.
--
-- Three separate partial unique indexes rather than one COALESCE expression: a
-- COALESCE(job_id, internship_id, external_id) index would mix uuid and text in
-- one expression and lean on PostgreSQL's implicit cast rules. The three-index
-- form is type-clean, self-documenting, and each index stays planner-usable.

CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies (id) ON DELETE SET NULL,
  source application_source NOT NULL,
  job_id uuid REFERENCES jobs (id) ON DELETE CASCADE,
  internship_id uuid REFERENCES internships (id) ON DELETE CASCADE,
  external_id text,
  external_company text,
  external_title text,
  stage application_stage NOT NULL DEFAULT 'new_application',
  match_score numeric(5, 2),
  matched_skills text[] NOT NULL DEFAULT '{}',
  missing_skills text[] NOT NULL DEFAULT '{}',
  cover_note text,
  recruiter_notes text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT applications_has_at_least_one_target
    CHECK (job_id IS NOT NULL OR internship_id IS NOT NULL OR external_id IS NOT NULL),
  CONSTRAINT applications_single_internal_target
    CHECK (NOT (job_id IS NOT NULL AND internship_id IS NOT NULL)),
  CONSTRAINT applications_external_id_not_blank
    CHECK (external_id IS NULL OR btrim(external_id) <> ''),
  CONSTRAINT applications_match_score_range
    CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100)),
  CONSTRAINT applications_verified_api_has_external_id
    CHECK (source <> 'verified_api' OR external_id IS NOT NULL)
);

CREATE UNIQUE INDEX applications_unique_job
  ON applications (candidate_user_id, source, job_id) WHERE job_id IS NOT NULL;

CREATE UNIQUE INDEX applications_unique_internship
  ON applications (candidate_user_id, source, internship_id) WHERE internship_id IS NOT NULL;

CREATE UNIQUE INDEX applications_unique_external
  ON applications (candidate_user_id, source, external_id) WHERE external_id IS NOT NULL;

CREATE INDEX applications_candidate_stage_idx ON applications (candidate_user_id, stage);
CREATE INDEX applications_company_stage_idx ON applications (company_id, stage);
CREATE INDEX applications_job_id_idx ON applications (job_id);
CREATE INDEX applications_internship_id_idx ON applications (internship_id);

CREATE TRIGGER applications_set_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Lifts IndustryApplication.history out of the client blob. ApplicationHistoryEvent
-- carries no id or timestamp today, so changed_at supplies the ordering the
-- client was missing.
CREATE TABLE application_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
  stage application_stage NOT NULL,
  note text,
  changed_by uuid REFERENCES users (id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX application_stage_history_application_idx
  ON application_stage_history (application_id, changed_at);

CREATE TABLE saved_jobs (
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  source application_source NOT NULL,
  external_id text NOT NULL,
  job_id uuid REFERENCES jobs (id) ON DELETE CASCADE,
  internship_id uuid REFERENCES internships (id) ON DELETE CASCADE,
  title text,
  company_name text,
  location text,
  work_mode work_mode,
  salary_range text,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source, external_id),
  CONSTRAINT saved_jobs_external_id_not_blank CHECK (btrim(external_id) <> '')
);

CREATE INDEX saved_jobs_user_saved_idx ON saved_jobs (user_id, saved_at DESC);
CREATE INDEX saved_jobs_job_id_idx ON saved_jobs (job_id);

CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications (id) ON DELETE SET NULL,
  candidate_user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs (id) ON DELETE SET NULL,
  internship_id uuid REFERENCES internships (id) ON DELETE SET NULL,
  round interview_round NOT NULL,
  scheduled_at timestamptz NOT NULL,
  mode interview_mode NOT NULL DEFAULT 'online',
  meeting_link text,
  interviewers text[] NOT NULL DEFAULT '{}',
  notes text,
  status interview_status NOT NULL DEFAULT 'scheduled',
  score numeric(5, 2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT interviews_score_range
    CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

CREATE INDEX interviews_candidate_idx ON interviews (candidate_user_id, scheduled_at DESC);
CREATE INDEX interviews_company_status_idx ON interviews (company_id, status);
CREATE INDEX interviews_application_id_idx ON interviews (application_id);

CREATE TRIGGER interviews_set_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications (id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs (id) ON DELETE SET NULL,
  internship_id uuid REFERENCES internships (id) ON DELETE SET NULL,
  offer_type offer_type NOT NULL,
  department text,
  location text,
  work_mode work_mode NOT NULL DEFAULT 'onsite',
  compensation text,
  base_fixed text,
  variable_bonus text,
  retention_joining_bonus text,
  benefits_summary text,
  joining_date date,
  valid_until date,
  status offer_status NOT NULL DEFAULT 'draft',
  authorized_signatory text,
  signatory_title text,
  generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offers_valid_until_after_joining
    CHECK (valid_until IS NULL OR joining_date IS NULL OR valid_until >= joining_date)
);

CREATE INDEX offers_candidate_idx ON offers (candidate_user_id, created_at DESC);
CREATE INDEX offers_company_status_idx ON offers (company_id, status);

CREATE TRIGGER offers_set_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
