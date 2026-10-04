-- 0003_circular_fks.sql
-- The only deferred edge. companies.owner_user_id could not be declared in
-- 0001 because users did not exist yet, and users.company_id could not be
-- declared before companies. This file closes the cycle additively.

ALTER TABLE companies
  ADD CONSTRAINT companies_owner_user_id_fkey
  FOREIGN KEY (owner_user_id) REFERENCES users (id) ON DELETE SET NULL;

CREATE UNIQUE INDEX companies_owner_user_id_key
  ON companies (owner_user_id) WHERE owner_user_id IS NOT NULL;

CREATE INDEX companies_owner_user_id_idx ON companies (owner_user_id);
