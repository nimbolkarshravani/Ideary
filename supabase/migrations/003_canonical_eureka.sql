-- Migration 003: canonical Eureka format
-- Renames columns, updates status values, changes at_a_glance format.

-- 1. Rename columns
alter table eurekas rename column case_for       to why_it_could_work;
alter table eurekas rename column case_against   to why_it_might_not;
alter table eurekas rename column what_youd_need to what_itd_take;

-- 2. Drop the old status check constraint and add the new one.
--    The old constraint name comes from 001_create_eurekas.sql.
alter table eurekas drop constraint if exists eurekas_status_check;
alter table eurekas add constraint eurekas_status_check
  check (status in ('exploring', 'parked', 'dead', 'building'));

-- 3. Migrate existing status values to the new vocabulary.
update eurekas set status = 'exploring' where status = 'active';
update eurekas set status = 'building'  where status = 'revisit';

-- 4. Drop legacy column that was never used in the new format.
alter table eurekas drop column if exists numbers;
