-- Migration 003: Flexible sections schema
-- Consolidates per-section columns into a single JSONB `sections` column.
-- Run each block separately in Supabase SQL Editor if you hit issues.

-- Step 1: Add new columns
alter table eurekas add column if not exists sections jsonb;
alter table eurekas add column if not exists template_id text;

-- Step 2: Migrate existing data into sections JSONB
update eurekas set sections = (
  select jsonb_agg(s order by s->>'_order') from (
    select jsonb_build_object(
      'kind', 'prose', 'heading', 'SPARK', 'text', spark
    ) || '{"_order": 1}'::jsonb as s
    where spark is not null

    union all
    select jsonb_build_object(
      'kind', 'bullets', 'heading', 'CASE FOR', 'bulletKind', 'arrow', 'items', case_for
    ) || '{"_order": 2}'::jsonb
    where case_for is not null

    union all
    select jsonb_build_object(
      'kind', 'bullets', 'heading', 'CASE AGAINST', 'bulletKind', 'x', 'items', case_against
    ) || '{"_order": 3}'::jsonb
    where case_against is not null

    union all
    select jsonb_build_object(
      'kind', 'highlight', 'heading', 'KEY INSIGHT', 'text', key_insight
    ) || '{"_order": 4}'::jsonb
    where key_insight is not null

    union all
    select jsonb_build_object(
      'kind', 'prose', 'heading', 'VERDICT', 'text', verdict
    ) || '{"_order": 5}'::jsonb
    where verdict is not null

    union all
    select jsonb_build_object(
      'kind', 'prose', 'heading', 'REVISIT IF', 'text', revisit_if
    ) || '{"_order": 6}'::jsonb
    where revisit_if is not null

    union all
    select jsonb_build_object(
      'kind', 'prose', 'heading', 'NEXT STEPS', 'text', next_step
    ) || '{"_order": 7}'::jsonb
    where next_step is not null

    union all
    select jsonb_build_object(
      'kind', 'bullets', 'heading', 'WHAT YOU''D NEED', 'bulletKind', 'dot',
      'items', what_youd_need, 'column', 'right'
    ) || '{"_order": 8}'::jsonb
    where what_youd_need is not null

    union all
    select jsonb_build_object(
      'kind', 'glance', 'heading', 'AT A GLANCE', 'rows', at_a_glance,
      'column', 'right'
    ) || '{"_order": 9}'::jsonb
    where at_a_glance is not null

    union all
    select jsonb_array_elements(custom_notes) || '{"_order": 10}'::jsonb
    where custom_notes is not null
  ) sub
);

-- Strip the _order keys used for sorting
update eurekas set sections = (
  select jsonb_agg(s - '_order')
  from jsonb_array_elements(sections) as s
)
where sections is not null;

-- Rows with no sections at all get an empty array
update eurekas set sections = '[]'::jsonb where sections is null;

-- Step 3: Drop old per-section columns
alter table eurekas drop column if exists spark;
alter table eurekas drop column if exists case_for;
alter table eurekas drop column if exists case_against;
alter table eurekas drop column if exists key_insight;
alter table eurekas drop column if exists verdict;
alter table eurekas drop column if exists revisit_if;
alter table eurekas drop column if exists what_youd_need;
alter table eurekas drop column if exists numbers;
alter table eurekas drop column if exists next_step;
alter table eurekas drop column if exists at_a_glance;
alter table eurekas drop column if exists custom_notes;
