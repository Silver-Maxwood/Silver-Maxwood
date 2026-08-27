-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Add Collection Hub Updates
-- Paste this into the Supabase SQL Editor and click Run.
-- ============================================================================

-- Add time to deliveries
alter table deliveries
add column if not exists time time not null default current_time;

-- Add national_id to farmers
alter table farmers
add column if not exists national_id text;
