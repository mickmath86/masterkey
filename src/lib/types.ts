/* ═══════════════════════════════════════════════════════
   Database types — mirrors Supabase schema
   ═══════════════════════════════════════════════════════ */

export type MarketKey =
  | "thousand-oaks"
  | "newbury-park"
  | "camarillo"
  | "westlake"
  | "oxnard"
  | "ventura";

export type PropertyType = "sfr" | "condo" | "townhome";
export type TimeframeKey = "1M" | "3M" | "6M" | "1Y" | "5Y" | "ALL";

export interface Market {
  id: MarketKey;
  label: string;
  county: string;
  state: string;
}

export interface MarketSnapshot {
  id: string;
  market_id: MarketKey;
  snapshot_date: string;
  median_price: number;
  median_change_pct: number;
  median_change_positive: boolean;
  active_listings: number;
  avg_dom: number;
  avg_dom_change: string;
  avg_dom_change_positive: boolean;
  price_per_sqft: number;
  price_per_sqft_change_pct: number;
  price_per_sqft_change_positive: boolean;
  sparkline: number[];
  sentiment_score: number;
  sale_to_list_ratio: number | null;
  market_competitiveness: string | null;
  market_summary_text: string;
}

export interface Comp {
  id: string;
  market_id: MarketKey;
  address: string;
  sold_price: number;
  sqft: number;
  price_per_sqft: number;
  dom: number;
  sold_date: string | null;
  property_type: string | null;
}

export interface PriceHistoryRow {
  id: string;
  market_id: MarketKey;
  month: string;
  month_label: string;
  sfr: number;
  condo: number;
  townhome: number;
}

export interface TrendingNeighborhood {
  id: string;
  name: string;
  area: string;
  change_pct: string;
  positive: boolean;
  sort_order: number;
}

export interface RecentActivityItem {
  id: string;
  activity_type: string;
  address: string;
  price: string;
  market_id: MarketKey | null;
}

export interface CountyIndicator {
  id: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sort_order: number;
}

export interface PropertyTypeBreakdown {
  id: string;
  label: string;
  value: string;
  change_pct: string;
  positive: boolean;
  sort_order: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  published_date: string;
  category: string;
  image_url: string | null;
  article_url: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  market_id: MarketKey | null;
  median_price: string;
  change_pct: string;
  schools_rating: string | null;
  walk_score: number | null;
  description: string | null;
  sort_order: number;
}

/* ═══════════════════════════════════════════════════════
   MarketPulse API types (shared between client + server)
   ═══════════════════════════════════════════════════════ */

export type SubmarketKey =
  | "thousand-oaks"
  | "newbury-park"
  | "ventura"
  | "camarillo"
  | "westlake"
  | "oxnard";

export interface SheetRow {
  month: string;
  value: number | null;
}

export interface MarketSnapshotResponse {
  submarket: SubmarketKey;
  label: string;
  medianPrice: number | null;
  medianPriceChangePct: number | null;
  avgDaysOnMarket: number | null;
  activeListings: number | null;
  pricePerSqft: number | null;
  monthsOfSupply: number | null;
  marketBalance: "buyers" | "balanced" | "sellers";
  aiSummary: string;
  priceHistory: {
    month: string;
    sfr: number | null;
    condo: number | null;
    townhome: number | null;
  }[];
  comps: {
    address: string;
    price: number;
    sqft: number | null;
    pricePerSqft: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    daysOld: number | null;
    status: "Active" | "Sold" | "Pending";
    propertyType: string | null;
  }[];
  fetchedAt: string;
  // Extended Google Sheets data for multi-metric chart tabs
  sheetsData?: {
    medianPrice: SheetRow[];
    newListings: SheetRow[];
    activeListings: SheetRow[];
    closedSales: SheetRow[];
    daysOnMarket: SheetRow[];
    pricePerSf: SheetRow[];
    monthsSupply: SheetRow[];
    showsToContract: SheetRow[];
    pctOfOrigPrice: SheetRow[];
  };
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  tag: string;
  tag_color: string | null;
  sort_order: number;
}
