-- ============================================================================
-- SILVER MAXWOOD DAIRIES — Farm Management & Milk Collection System
-- Supabase (PostgreSQL) schema
--
-- Run this in the Supabase SQL Editor (or `supabase db push` with the CLI)
-- against a fresh project. Safe to re-run: it drops and recreates the
-- app's tables/types/policies only.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Clean slate (safe to re-run during development)
-- ----------------------------------------------------------------------------
drop table if exists deliveries cascade;
drop table if exists farmers cascade;
drop table if exists incomes cascade;
drop table if exists expenses cascade;
drop table if exists milk_quality_records cascade;
drop table if exists health_records cascade;
drop table if exists breeding_records cascade;
drop table if exists feed_records cascade;
drop table if exists milk_records cascade;
drop table if exists cows cascade;
drop table if exists farm_profiles cascade;

drop type if exists cow_status cascade;
drop type if exists cow_sex cascade;
drop type if exists feed_type cascade;
drop type if exists expense_category cascade;
drop type if exists income_category cascade;
drop type if exists pd_result cascade;
drop type if exists pass_fail cascade;
drop type if exists quality_status cascade;
drop type if exists payment_status cascade;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type cow_status as enum ('MILKING', 'DRY', 'PREGNANT', 'CALF', 'SICK', 'SOLD', 'DEAD');
create type cow_sex as enum ('FEMALE', 'MALE');
create type feed_type as enum ('DAIRY_MEAL', 'SILAGE', 'NAPIER', 'HAY', 'SUPPLEMENTS', 'SALT', 'DCP', 'OTHER');
create type expense_category as enum ('FEED', 'VET', 'LABOUR', 'UTILITIES', 'FUEL', 'REPAIRS', 'EQUIPMENT', 'LOAN', 'OTHER');
create type income_category as enum ('MILK', 'CALF_SALE', 'COW_SALE', 'MANURE', 'BREEDING', 'OTHER');
create type pd_result as enum ('PENDING', 'POSITIVE', 'NEGATIVE');
create type pass_fail as enum ('PASS', 'FAIL');
create type quality_status as enum ('ACCEPTED', 'REJECTED');
create type payment_status as enum ('PENDING', 'PAID');

-- ----------------------------------------------------------------------------
-- 1. Farm Profile
-- ----------------------------------------------------------------------------
create table farm_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Silver Maxwood Dairies',
  owner text,
  location text,
  contact text,
  acres numeric(10,2),
  reg_details text,
  employees_count int default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. Cows
-- ----------------------------------------------------------------------------
create table cows (
  id uuid primary key default gen_random_uuid(),
  tag_number text not null unique,
  name text,
  breed text,
  sex cow_sex not null default 'FEMALE',
  dob date,
  source text,
  dam_id uuid references cows(id) on delete set null,
  sire_id uuid references cows(id) on delete set null,
  lactation_no int default 0,
  pregnancy_status text,
  status cow_status not null default 'MILKING',
  purchase_price numeric(12,2),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cows_tag_number on cows(tag_number);
create index idx_cows_status on cows(status);

-- ----------------------------------------------------------------------------
-- 3. Milk Records
-- ----------------------------------------------------------------------------
create table milk_records (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  cow_id uuid not null references cows(id) on delete cascade,
  morning_litres numeric(6,2) not null default 0,
  evening_litres numeric(6,2) not null default 0,
  total_litres numeric(6,2) generated always as (morning_litres + evening_litres) stored,
  is_rejected boolean not null default false,
  rejection_reason text,
  buyer text,
  price_per_litre numeric(8,2) not null default 0,
  total_income numeric(12,2) generated always as (
    case when is_rejected then 0 else (morning_litres + evening_litres) * price_per_litre end
  ) stored,
  created_at timestamptz not null default now()
);
create index idx_milk_records_date on milk_records(date);
create index idx_milk_records_cow on milk_records(cow_id);

-- ----------------------------------------------------------------------------
-- 4. Feed Records
-- ----------------------------------------------------------------------------
create table feed_records (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  feed_type feed_type not null,
  quantity numeric(10,2) not null,
  unit text not null default 'kg',
  cost_per_kg numeric(10,2) not null default 0,
  total_cost numeric(12,2) generated always as (quantity * cost_per_kg) stored,
  fed_to text, -- Cow tag/id or group name e.g. "Milking Herd"
  created_at timestamptz not null default now()
);
create index idx_feed_records_date on feed_records(date);

-- ----------------------------------------------------------------------------
-- 5. Breeding Records
-- ----------------------------------------------------------------------------
create table breeding_records (
  id uuid primary key default gen_random_uuid(),
  cow_id uuid not null references cows(id) on delete cascade,
  heat_date date,
  heat_symptoms text,
  ai_date date,
  semen_used text,
  technician text,
  pd_date date,
  pd_result pd_result default 'PENDING',
  expected_calving_date date,
  actual_calving_date date,
  services_count int default 1,
  calf_id uuid references cows(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_breeding_cow on breeding_records(cow_id);
create index idx_breeding_expected_calving on breeding_records(expected_calving_date);

-- ----------------------------------------------------------------------------
-- 6. Health Records
-- ----------------------------------------------------------------------------
create table health_records (
  id uuid primary key default gen_random_uuid(),
  cow_id uuid not null references cows(id) on delete cascade,
  condition text not null,
  symptoms text,
  diagnosis text,
  treatment text,
  medicine text,
  dosage text,
  date date not null default current_date,
  vet text,
  withdrawal_days int default 0,
  withdrawal_end_date date,
  recovery_date date,
  cmt_result text,
  created_at timestamptz not null default now()
);
create index idx_health_cow on health_records(cow_id);
create index idx_health_withdrawal on health_records(withdrawal_end_date);

-- ----------------------------------------------------------------------------
-- 7. Milk Quality Records
-- ----------------------------------------------------------------------------
create table milk_quality_records (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  cow_id uuid references cows(id) on delete set null,
  farmer_id uuid, -- optional link to farmers(id) for collection-hub tests, FK added below
  fat numeric(5,2),
  protein numeric(5,2),
  snf numeric(5,2),
  density numeric(6,3),
  freezing_point numeric(6,3),
  ph numeric(4,2),
  tta numeric(6,2),
  resazurin text,
  aflatoxin numeric(8,3),
  antibiotic_residue boolean default false,
  scc int,
  alcohol_test pass_fail,
  clot_on_boiling pass_fail,
  temp numeric(5,2),
  sensory text,
  frothing pass_fail,
  peroxide text,
  status quality_status not null default 'ACCEPTED',
  created_at timestamptz not null default now()
);
create index idx_quality_date on milk_quality_records(date);

-- ----------------------------------------------------------------------------
-- 8. Expenses
-- ----------------------------------------------------------------------------
create table expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  category expense_category not null,
  amount numeric(12,2) not null,
  description text,
  created_at timestamptz not null default now()
);
create index idx_expenses_date on expenses(date);
create index idx_expenses_category on expenses(category);

-- ----------------------------------------------------------------------------
-- 9. Incomes
-- ----------------------------------------------------------------------------
create table incomes (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  category income_category not null,
  amount numeric(12,2) not null,
  description text,
  created_at timestamptz not null default now()
);
create index idx_incomes_date on incomes(date);
create index idx_incomes_category on incomes(category);

-- ----------------------------------------------------------------------------
-- 10. Farmers (Collection Hub)
-- ----------------------------------------------------------------------------
create table farmers (
  id uuid primary key default gen_random_uuid(),
  reg_no text not null unique,
  name text not null,
  phone text,
  bank_or_mobile_money text,
  price_per_litre numeric(8,2) not null default 0,
  created_at timestamptz not null default now()
);
create index idx_farmers_reg_no on farmers(reg_no);

alter table milk_quality_records
  add constraint fk_quality_farmer foreign key (farmer_id) references farmers(id) on delete set null;

-- ----------------------------------------------------------------------------
-- 11. Deliveries (Collection Hub)
-- ----------------------------------------------------------------------------
create table deliveries (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  farmer_id uuid not null references farmers(id) on delete cascade,
  quantity numeric(8,2) not null,
  quality_status quality_status not null default 'ACCEPTED',
  price_per_litre numeric(8,2) not null default 0,
  deductions numeric(10,2) not null default 0,
  net_payable numeric(12,2) generated always as (
    case when quality_status = 'REJECTED' then 0
    else (quantity * price_per_litre) - deductions end
  ) stored,
  payment_status payment_status not null default 'PENDING',
  created_at timestamptz not null default now()
);
create index idx_deliveries_date on deliveries(date);
create index idx_deliveries_farmer on deliveries(farmer_id);

-- ----------------------------------------------------------------------------
-- updated_at trigger for cows
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_cows_updated_at
before update on cows
for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Simple model: any authenticated user of your Supabase project (i.e. your
-- farm staff who you invite) can read/write. Tighten with role-based checks
-- if you add multiple farms or public-facing views.
-- ----------------------------------------------------------------------------
alter table farm_profiles enable row level security;
alter table cows enable row level security;
alter table milk_records enable row level security;
alter table feed_records enable row level security;
alter table breeding_records enable row level security;
alter table health_records enable row level security;
alter table milk_quality_records enable row level security;
alter table expenses enable row level security;
alter table incomes enable row level security;
alter table farmers enable row level security;
alter table deliveries enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'farm_profiles','cows','milk_records','feed_records','breeding_records',
    'health_records','milk_quality_records','expenses','incomes','farmers','deliveries'
  ])
  loop
    execute format(
      'create policy "Authenticated read %1$s" on %1$s for select using (auth.role() = ''authenticated'');', t
    );
    execute format(
      'create policy "Authenticated write %1$s" on %1$s for insert with check (auth.role() = ''authenticated'');', t
    );
    execute format(
      'create policy "Authenticated update %1$s" on %1$s for update using (auth.role() = ''authenticated'');', t
    );
    execute format(
      'create policy "Authenticated delete %1$s" on %1$s for delete using (auth.role() = ''authenticated'');', t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Convenience views used by the dashboard
-- ----------------------------------------------------------------------------
create or replace view v_today_summary as
select
  (select coalesce(sum(total_litres), 0) from milk_records where date = current_date and not is_rejected) as todays_milk_litres,
  (select coalesce(sum(total_income), 0) from milk_records where date = current_date) as todays_milk_income,
  (select coalesce(sum(total_cost), 0) from feed_records where date = current_date) as todays_feed_cost,
  (select count(*) from cows where status = 'MILKING') as milking_count,
  (select count(*) from cows where status = 'PREGNANT') as pregnant_count,
  (select count(*) from cows) as total_cattle,
  (select count(*) from breeding_records where expected_calving_date is not null and expected_calving_date <= current_date + interval '14 days' and actual_calving_date is null) as due_calving_count,
  (select count(*) from health_records where withdrawal_end_date is not null and withdrawal_end_date >= current_date) as active_withdrawal_count;

-- Seed one default farm profile row so the app has something to display.
insert into farm_profiles (name, owner, location, contact, acres, employees_count)
values ('Silver Maxwood Dairies', 'Farm Owner', 'Kenya', '+254 700 000000', 25, 4);
