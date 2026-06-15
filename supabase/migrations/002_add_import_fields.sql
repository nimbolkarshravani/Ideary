-- Import fields: one conversation = one Eureka, keyed by (provider, conversation_id).
-- All statements are idempotent so this can be re-run safely.

alter table eurekas add column if not exists provider          text;
alter table eurekas add column if not exists conversation_id   text;
alter table eurekas add column if not exists raw_conversation  jsonb;   -- [{ role, content }]
alter table eurekas add column if not exists user_id           text;    -- single-user mode for now

-- These already exist in 001; guarded here in case an older schema is missing them.
alter table eurekas add column if not exists what_youd_need    jsonb;   -- string[]
alter table eurekas add column if not exists next_step         text;
alter table eurekas add column if not exists at_a_glance       jsonb;   -- { label, value }[]

-- Unique key for upsert. A partial index keeps existing rows (null provider /
-- conversation_id, e.g. seed data) from colliding, and supports ON CONFLICT.
create unique index if not exists eurekas_provider_conversation_key
  on eurekas (provider, conversation_id)
  where provider is not null and conversation_id is not null;
