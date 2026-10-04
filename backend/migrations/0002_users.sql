-- 0002_users.sql
-- users.firebase_uid is the permanent identity key and the only lookup key for
-- auth. email is unique but mutable and must never be used to join or to
-- reassign an account.
--
-- status defaults to 'active' on purpose: a mistaken insert produces an account
-- that lacks an organization FK (narrower), never one that is silently blocked.
-- The registration service sets status explicitly on every privileged path.

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL,
  email text,
  display_name text,
  photo_url text,
  phone text,
  role user_role NOT NULL DEFAULT 'student',
  status user_status NOT NULL DEFAULT 'active',
  college_id uuid REFERENCES colleges (id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies (id) ON DELETE SET NULL,
  onboarding_completed boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_not_blank CHECK (email IS NULL OR btrim(email) <> '')
);

CREATE UNIQUE INDEX users_firebase_uid_key ON users (firebase_uid);
CREATE UNIQUE INDEX users_email_key ON users (email);
CREATE INDEX users_role_status_idx ON users (role, status);
CREATE INDEX users_college_id_idx ON users (college_id);
CREATE INDEX users_company_id_idx ON users (company_id);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
