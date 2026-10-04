-- 0010_challenges.sql
-- The college portal renders the same challenges through a different projection
-- (open / under_evaluation / closed). That is a read concern, not a second table.

CREATE TABLE challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  company_id uuid REFERENCES companies (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  problem_statement text,
  difficulty challenge_difficulty NOT NULL DEFAULT 'basic',
  status challenge_status NOT NULL DEFAULT 'upcoming',
  deadline date,
  team_size text,
  prize text,
  submission_requirements text,
  college_participation text,
  participants_count integer NOT NULL DEFAULT 0,
  submissions_count integer NOT NULL DEFAULT 0,
  required_skills text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT challenges_slug_unique UNIQUE (slug),
  CONSTRAINT challenges_participants_non_negative CHECK (participants_count >= 0),
  CONSTRAINT challenges_submissions_non_negative CHECK (submissions_count >= 0)
);

CREATE INDEX challenges_company_status_idx ON challenges (company_id, status);
CREATE INDEX challenges_status_deadline_idx ON challenges (status, deadline);

CREATE TRIGGER challenges_set_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE challenge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  challenge_id uuid NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  team_lead_user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  team_name text NOT NULL,
  team_lead_name text,
  college_id uuid REFERENCES colleges (id) ON DELETE SET NULL,
  github_url text,
  live_demo_url text,
  video_url text,
  score numeric(5, 2),
  test_pass_rate text,
  ai_summary text,
  status submission_status NOT NULL DEFAULT 'under_review',
  skills_demonstrated text[] NOT NULL DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT challenge_submissions_slug_unique UNIQUE (slug),
  CONSTRAINT challenge_submissions_score_range
    CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

CREATE INDEX challenge_submissions_challenge_idx
  ON challenge_submissions (challenge_id, submitted_at DESC);
CREATE INDEX challenge_submissions_college_idx ON challenge_submissions (college_id);

CREATE TRIGGER challenge_submissions_set_updated_at
  BEFORE UPDATE ON challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
