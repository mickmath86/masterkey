import { supabase } from "./supabase";
import type {
  MarketKey,
  Market,
  MarketSnapshot,
  Comp,
  PriceHistoryRow,
  TrendingNeighborhood,
  RecentActivityItem,
  CountyIndicator,
  PropertyTypeBreakdown,
  NewsArticle,
  Neighborhood,
  Playbook,
} from "./types";

/* ───────────────────────────────────────────────────────
   Markets
   ─────────────────────────────────────────────────────── */
export async function getMarkets(): Promise<Market[]> {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("label");
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Market Snapshot — latest for a given market
   ─────────────────────────────────────────────────────── */
export async function getLatestSnapshot(
  marketId: MarketKey
): Promise<MarketSnapshot | null> {
  const { data, error } = await supabase
    .from("market_snapshots")
    .select("*")
    .eq("market_id", marketId)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

/* Fetch snapshots for ALL markets at once (used on initial load) */
export async function getAllLatestSnapshots(): Promise<
  Record<MarketKey, MarketSnapshot>
> {
  const { data, error } = await supabase
    .from("market_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false });
  if (error) throw error;

  const map: Record<string, MarketSnapshot> = {};
  for (const row of data ?? []) {
    // Keep only the latest per market
    if (!map[row.market_id]) {
      map[row.market_id] = row;
    }
  }
  return map as Record<MarketKey, MarketSnapshot>;
}

/* ───────────────────────────────────────────────────────
   Comps
   ─────────────────────────────────────────────────────── */
export async function getComps(
  marketId: MarketKey,
  limit = 8
): Promise<Comp[]> {
  const { data, error } = await supabase
    .from("comps")
    .select("*")
    .eq("market_id", marketId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Price History
   ─────────────────────────────────────────────────────── */
export async function getPriceHistory(
  marketId: MarketKey
): Promise<PriceHistoryRow[]> {
  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("market_id", marketId)
    .order("month", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Right Sidebar Data
   ─────────────────────────────────────────────────────── */
export async function getTrendingNeighborhoods(): Promise<
  TrendingNeighborhood[]
> {
  const { data, error } = await supabase
    .from("trending_neighborhoods")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  // Return latest snapshot's data
  if (!data || data.length === 0) return [];
  const latestDate = data[0].snapshot_date;
  return data.filter((d: any) => d.snapshot_date === latestDate);
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const { data, error } = await supabase
    .from("recent_activity")
    .select("*")
    .order("activity_date", { ascending: false })
    .limit(4);
  if (error) throw error;
  return data ?? [];
}

export async function getCountyIndicators(): Promise<CountyIndicator[]> {
  const { data, error } = await supabase
    .from("county_indicators")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  if (!data || data.length === 0) return [];
  const latestDate = data[0].snapshot_date;
  return data.filter((d: any) => d.snapshot_date === latestDate);
}

export async function getPropertyTypeBreakdown(): Promise<
  PropertyTypeBreakdown[]
> {
  const { data, error } = await supabase
    .from("property_type_breakdown")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  if (!data || data.length === 0) return [];
  const latestDate = data[0].snapshot_date;
  return data.filter((d: any) => d.snapshot_date === latestDate);
}

/* ───────────────────────────────────────────────────────
   News
   ─────────────────────────────────────────────────────── */
export async function getNewsArticles(
  limit = 6
): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Neighborhoods
   ─────────────────────────────────────────────────────── */
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Playbooks
   ─────────────────────────────────────────────────────── */
export async function getPlaybooks(): Promise<Playbook[]> {
  const { data, error } = await supabase
    .from("playbooks")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/* ───────────────────────────────────────────────────────
   Leads — INSERT only (form submission)
   ─────────────────────────────────────────────────────── */
export async function insertLead(lead: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}): Promise<void> {
  const { error } = await supabase.from("leads").insert(lead);
  if (error) throw error;
}
