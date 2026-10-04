-- 0011_college.sql
-- The college portal: partnerships and MoUs, curriculum, training, announcements,
-- placement drives, and the server-side notification feed that replaces the
-- localStorage syncBridge bus.

CREATE TABLE college_company (
  college_id uuid NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  partnership_status partnership_status NOT NULL DEFAULT 'pending',
  is_mou boolean NOT NULL DEFAULT false,
  mou_status mou_status,
  contact_person text,
  contact_email text,
  effective_from date,
  expires_at date,
  key_initiatives text[] NOT NULL DEFAULT '{}',
  internship_commitment_count integer NOT NULL DEFAULT 0,
  joint_hackathons_count integer NOT NULL DEFAULT 0,
  curriculum_reviews_completed integer NOT NULL DEFAULT 0,
  internship_opportunities_count integer NOT NULL DEFAULT 0,
  students_hired_count integer NOT NULL DEFAULT 0,
  challenges_active_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (college_id, company_id),
  CONSTRAINT college_company_dates_ordered
    CHECK (expires_at IS NULL OR effective_from IS NULL OR expires_at >= effective_from)
);

CREATE INDEX college_company_company_idx ON college_company (company_id);

CREATE TRIGGER college_company_set_updated_at
  BEFORE UPDATE ON college_company
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- curriculum_modules is only meaningful for an existing partnership, so it
-- references the college_company composite key rather than both parents
-- independently.
CREATE TABLE curriculum_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  college_id uuid NOT NULL,
  company_id uuid NOT NULL,
  semester text,
  current_subject text,
  industry_recommendation text,
  recommended_technologies text[] NOT NULL DEFAULT '{}',
  rationale text,
  status curriculum_module_status NOT NULL DEFAULT 'in_review',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT curriculum_modules_slug_unique UNIQUE (slug),
  CONSTRAINT curriculum_modules_partnership_fkey
    FOREIGN KEY (college_id, company_id)
    REFERENCES college_company (college_id, company_id)
    ON DELETE CASCADE
);

CREATE INDEX curriculum_modules_college_idx ON curriculum_modules (college_id);
CREATE INDEX curriculum_modules_company_idx ON curriculum_modules (company_id);

CREATE TRIGGER curriculum_modules_set_updated_at
  BEFORE UPDATE ON curriculum_modules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  college_id uuid NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills (id) ON DELETE SET NULL,
  name text NOT NULL,
  skill_name text,
  skill_level skill_tier NOT NULL DEFAULT 'intermediate',
  description text,
  instructor text,
  start_date date,
  end_date date,
  max_students integer,
  assessment_required boolean NOT NULL DEFAULT false,
  industry_partner text,
  learning_resources text[] NOT NULL DEFAULT '{}',
  status training_status NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT training_programs_slug_unique UNIQUE (slug),
  CONSTRAINT training_programs_dates_ordered
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  CONSTRAINT training_programs_max_students_non_negative
    CHECK (max_students IS NULL OR max_students >= 0)
);

CREATE INDEX training_programs_college_status_idx ON training_programs (college_id, status);

CREATE TRIGGER training_programs_set_updated_at
  BEFORE UPDATE ON training_programs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_program_id uuid NOT NULL REFERENCES training_programs (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  score numeric(5, 2),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT training_enrollments_unique UNIQUE (training_program_id, user_id),
  CONSTRAINT training_enrollments_score_range
    CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

CREATE INDEX training_enrollments_user_idx ON training_enrollments (user_id);

CREATE TRIGGER training_enrollments_set_updated_at
  BEFORE UPDATE ON training_enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE campus_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  college_id uuid NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  title text NOT NULL,
  category announcement_category NOT NULL,
  content text,
  target_audience text,
  status announcement_status NOT NULL DEFAULT 'draft',
  important boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campus_announcements_slug_unique UNIQUE (slug),
  CONSTRAINT campus_announcements_published_has_timestamp
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX campus_announcements_college_status_idx
  ON campus_announcements (college_id, status, published_at DESC);

CREATE TRIGGER campus_announcements_set_updated_at
  BEFORE UPDATE ON campus_announcements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE placement_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  college_id uuid NOT NULL REFERENCES colleges (id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies (id) ON DELETE SET NULL,
  title text NOT NULL,
  drive_date date,
  eligible_departments text[] NOT NULL DEFAULT '{}',
  minimum_cgpa numeric(3, 2),
  skills_required text[] NOT NULL DEFAULT '{}',
  package_offer text,
  openings integer,
  status placement_drive_status NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT placement_drives_slug_unique UNIQUE (slug),
  CONSTRAINT placement_drives_minimum_cgpa_range
    CHECK (minimum_cgpa IS NULL OR (minimum_cgpa >= 0 AND minimum_cgpa <= 10))
);

CREATE INDEX placement_drives_college_status_idx ON placement_drives (college_id, status, drive_date);

CREATE TRIGGER placement_drives_set_updated_at
  BEFORE UPDATE ON placement_drives
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Replaces the localStorage syncBridge notification bus.
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_recipient_read_idx ON notifications (recipient_user_id, read);
CREATE INDEX notifications_recipient_created_idx
  ON notifications (recipient_user_id, created_at DESC);
