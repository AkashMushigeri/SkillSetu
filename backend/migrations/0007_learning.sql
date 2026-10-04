-- 0007_learning.sql
-- The learning module does not exist client-side yet: /student/learning derives
-- everything from skillsCatalog*.ts. These tables are the target model.
--
-- course_progress.material_id is NOT NULL deliberately. In PostgreSQL NULLs are
-- distinct under UNIQUE, so a nullable material_id in the key would permit
-- unlimited duplicate course-level rows:
--   user 1 | course 5 | NULL
--   user 1 | course 5 | NULL   -- every one of these counts as unique
-- Course-level completion is therefore derived on read:
--   count(*) FILTER (WHERE completed) * 100.0 / count(*)
-- over that course's materials. If a stored course-level summary is ever needed,
-- add a separate course_summary table rather than relaxing material_id.

CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  skill_id uuid REFERENCES skills (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  level skill_tier NOT NULL DEFAULT 'basic',
  estimated_hours numeric(6, 2),
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT courses_slug_unique UNIQUE (slug),
  CONSTRAINT courses_estimated_hours_non_negative
    CHECK (estimated_hours IS NULL OR estimated_hours >= 0)
);

CREATE INDEX courses_skill_id_idx ON courses (skill_id);

CREATE TRIGGER courses_set_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  title text NOT NULL,
  type resource_type NOT NULL,
  position integer NOT NULL,
  url text,
  duration text,
  description text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_materials_position_per_course UNIQUE (course_id, position),
  CONSTRAINT course_materials_position_non_negative CHECK (position >= 0)
);

CREATE INDEX course_materials_course_id_idx ON course_materials (course_id, position);

CREATE TRIGGER course_materials_set_updated_at
  BEFORE UPDATE ON course_materials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE student_course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_course_enrollments_unique UNIQUE (user_id, course_id)
);

CREATE INDEX student_course_enrollments_course_id_idx ON student_course_enrollments (course_id);

CREATE TRIGGER student_course_enrollments_set_updated_at
  BEFORE UPDATE ON student_course_enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES course_materials (id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_progress_unique_material UNIQUE (user_id, course_id, material_id)
);

CREATE INDEX course_progress_material_id_idx ON course_progress (material_id);
CREATE INDEX course_progress_lookup_idx ON course_progress (user_id, course_id);

CREATE TRIGGER course_progress_set_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
