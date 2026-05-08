create table if not exists eurekas (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  one_liner         text not null,
  status            text not null check (status in ('active', 'parked', 'dead', 'revisit')),
  tags              text[],
  captured_at       timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  source_conversation text,

  -- Semantic sections
  spark             text,
  case_for          jsonb,   -- string[]
  case_against      jsonb,   -- string[]
  key_insight       text,
  verdict           text,
  revisit_if        text,
  what_youd_need    jsonb,   -- string[]
  numbers           jsonb,   -- { label: string; value: string }[]
  next_step         text,
  at_a_glance       jsonb,   -- { label: string; value: string }[]
  custom_notes      jsonb    -- EurekaSection[] for anything that doesn't fit above
);

-- Auto-update updated_at on any row change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger eurekas_updated_at
  before update on eurekas
  for each row execute procedure update_updated_at();
