-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Full RLS & Permissions Fix
-- Paste this entire block into the Supabase SQL Editor and click Run.
-- ============================================================================

-- 1. Grant anon + authenticated roles access to the public schema
grant usage on schema public to anon, authenticated;

-- 2. Grant full table access to anon + authenticated on every app table
grant all on
  farm_profiles, cows, milk_records, feed_records, breeding_records,
  health_records, milk_quality_records, expenses, incomes,
  farmers, deliveries
to anon, authenticated;

-- 3. Drop ALL existing RLS policies on every table (clean slate)
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'farm_profiles','cows','milk_records','feed_records','breeding_records',
        'health_records','milk_quality_records','expenses','incomes',
        'farmers','deliveries'
      )
  loop
    execute format('drop policy if exists %I on %I;', pol.policyname, pol.tablename);
  end loop;
end $$;

-- 4. Create simple open policies (safe for a private internal farm tool)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'farm_profiles','cows','milk_records','feed_records','breeding_records',
    'health_records','milk_quality_records','expenses','incomes',
    'farmers','deliveries'
  ])
  loop
    execute format('create policy "open_select" on %I for select using (true);', t);
    execute format('create policy "open_insert" on %I for insert with check (true);', t);
    execute format('create policy "open_update" on %I for update using (true);', t);
    execute format('create policy "open_delete" on %I for delete using (true);', t);
  end loop;
end $$;
