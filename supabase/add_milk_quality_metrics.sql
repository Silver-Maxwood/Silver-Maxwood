-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Add Quality Metrics
-- Paste this into the Supabase SQL Editor and click Run.
-- ============================================================================

alter table milk_quality_records
  add column if not exists sensory text,
  add column if not exists frothing pass_fail,
  add column if not exists peroxide text;
