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

alter table feed_sales enable row level security;

do $$
begin
    execute 'create policy "Authenticated read feed_sales" on feed_sales for select using (auth.role() = ''authenticated'');';
    execute 'create policy "Authenticated write feed_sales" on feed_sales for insert with check (auth.role() = ''authenticated'');';
    execute 'create policy "Authenticated update feed_sales" on feed_sales for update using (auth.role() = ''authenticated'');';
    execute 'create policy "Authenticated delete feed_sales" on feed_sales for delete using (auth.role() = ''authenticated'');';
exception
    when duplicate_object then null;
end $$;
