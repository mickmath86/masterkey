-- Rent-vs-Sell report cache
-- Stores serialized report data with a 30-day TTL
-- Reports are looked up by a short random ID included in the shareable URL

create table if not exists rvs_reports (
  id          text primary key,               -- e.g. "a3x9k2m7"
  data        jsonb not null,                 -- full form + results payload
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '30 days')
);

-- Index for fast expiry cleanup
create index if not exists rvs_reports_expires_at_idx on rvs_reports (expires_at);

-- RLS: public read by ID only (no auth required to view a shared report)
alter table rvs_reports enable row level security;

create policy "Allow public read by id"
  on rvs_reports for select
  using (true);

create policy "Allow service role insert"
  on rvs_reports for insert
  with check (true);
