-- 0004_role_requests.sql
-- The approval workflow and its audit trail. users.role stays authoritative for
-- what a user can actually do; this table records intent and decisions.
--
-- Two independent guards make admin self-service impossible: the CHECK below
-- (defence in depth against a future code path that forgets to validate) and
-- the partial unique index (makes a second concurrent submission impossible at
-- the database level).
--
-- organization_snapshot is write-once so an admin always reviews exactly what
-- the applicant claimed, even if the applicant later edits their profile.

CREATE TABLE role_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  requested_role user_role NOT NULL,
  status role_request_status NOT NULL DEFAULT 'pending',
  organization_snapshot jsonb NOT NULL,
  reason text,
  reviewed_by uuid REFERENCES users (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT role_requests_role_is_requestable
    CHECK (requested_role IN ('industry', 'college')),
  CONSTRAINT role_requests_snapshot_is_object
    CHECK (jsonb_typeof(organization_snapshot) = 'object')
);

CREATE UNIQUE INDEX role_requests_one_pending_per_user
  ON role_requests (user_id) WHERE status = 'pending';

CREATE INDEX role_requests_queue ON role_requests (status, created_at);
CREATE INDEX role_requests_user_created_idx ON role_requests (user_id, created_at DESC);

CREATE TRIGGER role_requests_set_updated_at
  BEFORE UPDATE ON role_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
