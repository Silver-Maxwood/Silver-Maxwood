-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Schema Update
-- Run this in the Supabase SQL Editor to add the missing column for calves.
-- ============================================================================

alter table cows add column if not exists mode_of_conception text;
