create table if not exists feed_sales (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  buyer_name text not null,
  phone_number text,
  national_id text,
  quantity_kg numeric(10,2) not null,
  price_per_kg numeric(10,2) not null,
  total_amount numeric(12,2) generated always as (quantity_kg * price_per_kg) stored,
  payment_status payment_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

create index if not exists idx_feed_sales_date on feed_sales(date);

GRANT ALL ON TABLE feed_sales TO anon, authenticated, service_role;

alter table feed_sales enable row level security;

drop policy if exists "Authenticated read feed_sales" on feed_sales;
drop policy if exists "Authenticated write feed_sales" on feed_sales;
drop policy if exists "Authenticated update feed_sales" on feed_sales;
drop policy if exists "Authenticated delete feed_sales" on feed_sales;

create policy "Authenticated read feed_sales" on feed_sales for select using (true);
create policy "Authenticated write feed_sales" on feed_sales for insert with check (true);
create policy "Authenticated update feed_sales" on feed_sales for update using (true);
create policy "Authenticated delete feed_sales" on feed_sales for delete using (true);
