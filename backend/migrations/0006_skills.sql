-- 0006_skills.sql
-- skills is the catalogue row; user_skills is the per-user row. The client
-- overloaded both as a single "Skill" object, so the shared descriptive fields
-- live exactly once here.
--
-- skills.slug is the stable natural key the seed upserts on.

CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  tier skill_tier NOT NULL,
  category text,
  icon text,
  description text,
  estimated_time text,
  learning_objectives text[] NOT NULL DEFAULT '{}',
  career_roles text[] NOT NULL DEFAULT '{}',
  aliases text[] NOT NULL DEFAULT '{}',
  related_skills text[] NOT NULL DEFAULT '{}',
  related_opportunity_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT skills_name_unique UNIQUE (name),
  CONSTRAINT skills_slug_unique UNIQUE (slug),
  CONSTRAINT skills_related_opportunity_count_non_negative
    CHECK (related_opportunity_count >= 0)
);

CREATE INDEX skills_tier_idx ON skills (tier);
CREATE INDEX skills_category_idx ON skills (category);

CREATE TRIGGER skills_set_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE skill_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  title text NOT NULL,
  type resource_type NOT NULL,
  duration text,
  url text,
  topic text,
  description text,
  position integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT skill_resources_position_per_skill UNIQUE (skill_id, position),
  CONSTRAINT skill_resources_position_non_negative CHECK (position >= 0)
);

CREATE INDEX skill_resources_skill_id_idx ON skill_resources (skill_id, position);

CREATE TRIGGER skill_resources_set_updated_at
  BEFORE UPDATE ON skill_resources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE user_skills (
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  learning_status learning_status NOT NULL DEFAULT 'not_started',
  assessment_status assessment_status NOT NULL DEFAULT 'locked',
  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verification_type skill_verification_type,
  verified_score numeric,
  verified_level proficiency_level,
  evidence_source skill_evidence_source,
  best_score numeric,
  assessment_strengths text[] NOT NULL DEFAULT '{}',
  assessment_improvements text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id),
  CONSTRAINT user_skills_progress_range CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT user_skills_verified_fields_consistent
    CHECK (
      is_verified = false
      OR (verified_at IS NOT NULL AND verification_type IS NOT NULL)
    )
);

CREATE INDEX user_skills_skill_id_idx ON user_skills (skill_id);
CREATE INDEX user_skills_verified_idx ON user_skills (skill_id) WHERE is_verified;

CREATE TRIGGER user_skills_set_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Lifts LearningResource.completed out of the per-user blob.
CREATE TABLE skill_resource_progress (
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES skill_resources (id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id, resource_id)
);

CREATE INDEX skill_resource_progress_resource_id_idx
  ON skill_resource_progress (resource_id);

CREATE TRIGGER skill_resource_progress_set_updated_at
  BEFORE UPDATE ON skill_resource_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE skill_assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  difficulty assessment_difficulty NOT NULL,
  score numeric,
  correct_count integer,
  total_questions integer,
  percentage numeric,
  passed boolean NOT NULL DEFAULT false,
  proficiency_level proficiency_level,
  strengths text[] NOT NULL DEFAULT '{}',
  improvements text[] NOT NULL DEFAULT '{}',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT skill_assessment_attempts_percentage_range
    CHECK (percentage IS NULL OR (percentage >= 0 AND percentage <= 100)),
  CONSTRAINT skill_assessment_attempts_counts_non_negative
    CHECK (
      (correct_count IS NULL OR correct_count >= 0)
      AND (total_questions IS NULL OR total_questions >= 0)
    )
);

CREATE INDEX skill_assessment_attempts_user_skill_idx
  ON skill_assessment_attempts (user_id, skill_id, created_at DESC);

CREATE TRIGGER skill_assessment_attempts_set_updated_at
  BEFORE UPDATE ON skill_assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
