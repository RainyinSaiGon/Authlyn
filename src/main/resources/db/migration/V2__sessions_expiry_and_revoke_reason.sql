-- Align sessions persistence with lifecycle contract expectations.
-- `expires_at` is nullable to allow gradual rollout where TTL may initially be derived by policy.

ALTER TABLE sessions
    ADD IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE sessions
    ADD IF NOT EXISTS revoke_reason VARCHAR(120);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
