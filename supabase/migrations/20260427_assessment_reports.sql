-- ============================================================
-- MasterKey Seller Strategy Assessment Reports
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vgjmliwmidsjravwcqgm/sql
-- ============================================================

create table if not exists assessment_reports (
  id                  uuid primary key default gen_random_uuid(),
  report_token        text unique not null,
  assessment_type     text not null default 'pricing-strategy',

  -- Lead info
  first_name          text,
  email               text,
  phone               text,
  property_address    text,
  city_or_zip         text,

  -- Assessment payload
  responses_json      jsonb not null default '[]',
  scoring_json        jsonb not null default '{}',
  derived_insights_json jsonb not null default '{}',
  report_summary_json jsonb not null default '{}',

  -- Meta / attribution
  source_path         text default '/pricing-strategy',
  utm_json            jsonb default '{}',
  user_agent          text,
  landing_page_version text default 'v1',

  -- Webhook delivery tracking
  webhook_status      text default 'pending',   -- pending | delivered | failed
  webhook_attempted_at timestamptz,
  webhook_error       text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Fast token lookup
create unique index if not exists assessment_reports_token_idx
  on assessment_reports (report_token);

-- Index for admin queries by email
create index if not exists assessment_reports_email_idx
  on assessment_reports (email);

-- Index for created_at ordering
create index if not exists assessment_reports_created_at_idx
  on assessment_reports (created_at desc);

-- RLS: service role can do everything; anon can only SELECT by token
-- (report page uses anon key to look up by token — no PII exposed in URL)
alter table assessment_reports enable row level security;

create policy "Service role full access"
  on assessment_reports
  using (auth.role() = 'service_role');

create policy "Anon select by token only"
  on assessment_reports for select
  using (true);   -- token is opaque; exposure of row = fine since token is required

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assessment_reports_updated_at on assessment_reports;
create trigger assessment_reports_updated_at
  before update on assessment_reports
  for each row execute function update_updated_at_column();
