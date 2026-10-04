-- 0005_student_profile.sql
-- Lifts the single nested EducationHistory object into one row per level, and
-- the base64 certification blob out of the client profile.

CREATE TABLE student_profiles (
  user_id uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  usn text,
  degree text,
  department text,
  academic_year text,
  cgpa numeric(3, 2),
  career_goal text,
  bio text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  avatar_url text,
  location text,
  city text,
  state text,
  country text,
  latitude double precision,
  longitude double precision,
  profile_completion integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_profiles_cgpa_range CHECK (cgpa IS NULL OR (cgpa >= 0 AND cgpa <= 10)),
  CONSTRAINT student_profiles_completion_range
    CHECK (profile_completion >= 0 AND profile_completion <= 100)
);

CREATE INDEX student_profiles_department_idx ON student_profiles (department);
CREATE INDEX student_profiles_cgpa_idx ON student_profiles (cgpa DESC);

CREATE TRIGGER student_profiles_set_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE education_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  level education_level NOT NULL,
  institution_name text NOT NULL,
  degree text,
  department text,
  course text,
  board text,
  academic_year text,
  score numeric,
  score_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT education_records_one_per_level UNIQUE (user_id, level)
);

CREATE TRIGGER education_records_set_updated_at
  BEFORE UPDATE ON education_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  github_url text,
  live_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX projects_user_id_idx ON projects (user_id, created_at DESC);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE work_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title text NOT NULL,
  company text,
  location text,
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT work_experiences_date_order
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX work_experiences_user_id_idx ON work_experiences (user_id, start_date DESC NULLS LAST);

CREATE TRIGGER work_experiences_set_updated_at
  BEFORE UPDATE ON work_experiences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  file_name text,
  file_type text,
  file_data text,
  file_size integer,
  uploaded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT certifications_file_size_max
    CHECK (file_size IS NULL OR file_size <= 5242880),
  CONSTRAINT certifications_expiry_after_issue
    CHECK (expiry_date IS NULL OR issue_date IS NULL OR expiry_date >= issue_date)
);

CREATE INDEX certifications_user_id_idx ON certifications (user_id, created_at DESC);

CREATE TRIGGER certifications_set_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
