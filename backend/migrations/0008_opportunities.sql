-- 0008_opportunities.sql
-- jobs and internships are both company-scoped; the external verified jobs API is
-- never mirrored here (per spec section 13). /api/jobs/verified proxies it with a
-- short cache, and applications record the external id textually instead.

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  title text NOT NULL,
  department text,
  location text,
  city text,
  state text,
  country text NOT NULL DEFAULT 'India',
  work_mode work_mode NOT NULL DEFAULT 'onsite',
  employment_type employment_type NOT NULL DEFAULT 'full_time',
  salary_range text,
  experience_required text,
  education_required text,
  graduation_year text,
  minimum_cgpa numeric(3, 2),
  description text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  qualifications text[] NOT NULL DEFAULT '{}',
  openings integer NOT NULL DEFAULT 1,
  deadline date,
  status opportunity_status NOT NULL DEFAULT 'draft',
  posted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT jobs_slug_unique UNIQUE (slug),
  CONSTRAINT jobs_openings_non_negative CHECK (openings >= 0),
  CONSTRAINT jobs_minimum_cgpa_range
    CHECK (minimum_cgpa IS NULL OR (minimum_cgpa >= 0 AND minimum_cgpa <= 10))
);

CREATE INDEX jobs_company_status_idx ON jobs (company_id, status);
CREATE INDEX jobs_status_posted_at_idx ON jobs (status, posted_at DESC NULLS LAST);

CREATE TRIGGER jobs_set_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  title text NOT NULL,
  department text,
  location text,
  city text,
  state text,
  country text NOT NULL DEFAULT 'India',
  work_mode work_mode NOT NULL DEFAULT 'onsite',
  duration text,
  stipend text,
  eligibility text,
  start_date date,
  application_deadline date,
  description text,
  learning_outcomes text[] NOT NULL DEFAULT '{}',
  mentor text,
  target_audience text,
  openings integer NOT NULL DEFAULT 1,
  is_startup_friendly boolean NOT NULL DEFAULT false,
  eligible_for_conversion boolean NOT NULL DEFAULT false,
  status opportunity_status NOT NULL DEFAULT 'draft',
  posted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT internships_slug_unique UNIQUE (slug),
  CONSTRAINT internships_openings_non_negative CHECK (openings >= 0)
);

CREATE INDEX internships_company_status_idx ON internships (company_id, status);
CREATE INDEX internships_status_posted_at_idx ON internships (status, posted_at DESC NULLS LAST);

CREATE TRIGGER internships_set_updated_at
  BEFORE UPDATE ON internships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE job_required_skills (
  job_id uuid NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  level skill_tier NOT NULL DEFAULT 'intermediate',
  importance skill_importance NOT NULL DEFAULT 'required',
  min_score numeric,
  PRIMARY KEY (job_id, skill_id),
  CONSTRAINT job_required_skills_min_score_range
    CHECK (min_score IS NULL OR (min_score >= 0 AND min_score <= 100))
);

CREATE INDEX job_required_skills_skill_id_idx ON job_required_skills (skill_id);

CREATE TABLE internship_required_skills (
  internship_id uuid NOT NULL REFERENCES internships (id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  level skill_tier NOT NULL DEFAULT 'intermediate',
  importance skill_importance NOT NULL DEFAULT 'required',
  min_score numeric,
  PRIMARY KEY (internship_id, skill_id),
  CONSTRAINT internship_required_skills_min_score_range
    CHECK (min_score IS NULL OR (min_score >= 0 AND min_score <= 100))
);

CREATE INDEX internship_required_skills_skill_id_idx ON internship_required_skills (skill_id);

-- Matching metadata only. The external jobs database is not mirrored, so this
-- table stores the computed explanation and nothing more.
CREATE TABLE job_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  match_score numeric(5, 2),
  matched_skills text[] NOT NULL DEFAULT '{}',
  missing_skills text[] NOT NULL DEFAULT '{}',
  partial_matches jsonb NOT NULL DEFAULT '[]'::jsonb,
  explanation text,
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_matches_unique_user_job UNIQUE (user_id, job_id),
  CONSTRAINT job_matches_score_range
    CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100))
);

CREATE INDEX job_matches_job_id_idx ON job_matches (job_id);

CREATE TRIGGER job_matches_set_updated_at
  BEFORE UPDATE ON job_matches
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
