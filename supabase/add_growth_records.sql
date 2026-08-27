-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Add Growth Records
-- Paste this into the Supabase SQL Editor and click Run.
-- ============================================================================

create table if not exists growth_records (
  id uuid primary key default gen_random_uuid(),
  cow_id uuid not null references cows(id) on delete cascade,
  date date not null default current_date,
  weight numeric(8,2),
  height numeric(8,2),
  created_at timestamptz not null default now()
);
create index if not exists idx_growth_cow on growth_records(cow_id);
