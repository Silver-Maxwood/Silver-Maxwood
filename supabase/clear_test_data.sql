-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Clear Test Data
-- Run this in the Supabase SQL Editor to wipe all data but keep the structure.
-- ============================================================================

TRUNCATE TABLE 
  cows, 
  milk_records, 
  feed_records, 
  breeding_records, 
  health_records, 
  milk_quality_records, 
  growth_records, 
  expenses, 
  incomes, 
  farmers, 
  deliveries 
CASCADE;

-- Note: We are deliberately NOT truncating the farm_profiles table 
-- so that you don't have to re-enter your farm settings. 
-- If you want to reset that too, uncomment the lines below:
-- TRUNCATE TABLE farm_profiles CASCADE;
-- insert into farm_profiles (name, owner, location, contact, acres, employees_count)
-- values ('Silver Maxwood Dairies', 'Farm Owner', 'Kenya', '+254 700 000000', 25, 4);
