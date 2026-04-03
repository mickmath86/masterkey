-- ═══════════════════════════════════════════════════════════════════════════
-- MarketPulse Live Data Tables
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Daily snapshots ─────────────────────────────────────────────────────
-- One row per submarket per day. The cron job upserts into this table nightly.
-- The snapshot route reads the most recent row for a given submarket.

CREATE TABLE IF NOT EXISTS marketpulse_snapshots (
  id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submarket               text NOT NULL,           -- e.g. "thousand-oaks"
  snapshot_date           date NOT NULL DEFAULT CURRENT_DATE,

  -- Rentcast metrics
  median_price            integer,
  median_price_change_pct numeric(6,2),
  avg_days_on_market      integer,
  active_listings         integer,
  price_per_sqft          integer,
  total_sales             integer,                 -- from Rentcast (12-month cumulative)
  months_of_supply        numeric(4,1),            -- activeListings / (totalSales / 12)
  market_balance          text CHECK (market_balance IN ('buyers','balanced','sellers')),

  -- Perplexity AI summary
  ai_summary              text,
  ai_summary_generated_at timestamptz,

  -- Metadata
  rentcast_zip            text,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now(),

  -- One snapshot per submarket per day
  UNIQUE (submarket, snapshot_date)
);

-- ─── 2. Price history ────────────────────────────────────────────────────────
-- Monthly price data per submarket, sourced from Rentcast history array.
-- Upserted on each nightly refresh — safe to re-run.

CREATE TABLE IF NOT EXISTS marketpulse_price_history (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submarket       text NOT NULL,
  month           text NOT NULL,   -- "2025-04" format
  avg_price       integer,         -- aggregate from Rentcast
  sfr_price       integer,         -- SFR estimated from dataByPropertyType ratio
  condo_price     integer,
  townhome_price  integer,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  UNIQUE (submarket, month)
);

-- ─── 3. Comps ────────────────────────────────────────────────────────────────
-- Active listings fetched from Rentcast on each page load.
-- Replaced wholesale per submarket per fetch (not daily — these are live).

CREATE TABLE IF NOT EXISTS marketpulse_comps (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submarket       text NOT NULL,
  address         text NOT NULL,
  price           integer,
  sqft            integer,
  price_per_sqft  integer,
  bedrooms        integer,
  bathrooms       numeric(3,1),
  days_on_market  integer,
  status          text DEFAULT 'Active' CHECK (status IN ('Active','Sold','Pending')),
  property_type   text,
  rentcast_zip    text,
  fetched_at      timestamptz DEFAULT now()
);

-- Index for fast submarket lookups
CREATE INDEX IF NOT EXISTS idx_marketpulse_snapshots_submarket_date
  ON marketpulse_snapshots (submarket, snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_marketpulse_price_history_submarket
  ON marketpulse_price_history (submarket, month DESC);

CREATE INDEX IF NOT EXISTS idx_marketpulse_comps_submarket
  ON marketpulse_comps (submarket, fetched_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Public read (dashboard is public), write only via service role key (cron/ingest)

ALTER TABLE marketpulse_snapshots    ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketpulse_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketpulse_comps        ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (anon key)
CREATE POLICY "public_read_snapshots"
  ON marketpulse_snapshots FOR SELECT USING (true);

CREATE POLICY "public_read_price_history"
  ON marketpulse_price_history FOR SELECT USING (true);

CREATE POLICY "public_read_comps"
  ON marketpulse_comps FOR SELECT USING (true);

-- Only service role can write (INSERT/UPDATE/DELETE)
-- No explicit policy needed — service role bypasses RLS by default.
