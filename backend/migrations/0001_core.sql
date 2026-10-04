-- 0001_core.sql
-- Colleges and companies. Neither references users here: companies.owner_user_id
-- is the circular edge and is attached in 0003 once users exists.

CREATE TABLE colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  normalized_name text NOT NULL,
  code text NOT NULL,
  short_name text,
  aliases text[] NOT NULL DEFAULT '{}',
  city text,
  district text,
  state text,
  country text NOT NULL DEFAULT 'India',
  university text,
  institution_type text,
  affiliation text,
  official_website text,
  logo_url text,
  about text,
  total_students integer,
  naac_grade text,
  placement_officer jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX colleges_code_key ON colleges (code);
CREATE INDEX colleges_normalized_name_idx ON colleges (normalized_name);
CREATE INDEX colleges_state_idx ON colleges (state);

CREATE TRIGGER colleges_set_updated_at
  BEFORE UPDATE ON colleges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  normalized_name text NOT NULL,
  type text,
  industry text,
  location text,
  city text,
  state text,
  country text NOT NULL DEFAULT 'India',
  latitude double precision,
  longitude double precision,
  employees text,
  founded integer,
  website_url text,
  tagline text,
  about text,
  mission text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  departments text[] NOT NULL DEFAULT '{}',
  hiring_domains text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  culture text[] NOT NULL DEFAULT '{}',
  logo_url text,
  cover_image_url text,
  owner_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX companies_normalized_name_key ON companies (normalized_name);
CREATE INDEX companies_industry_idx ON companies (industry);

CREATE TRIGGER companies_set_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
