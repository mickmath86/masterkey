"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Check,
  TrendingUp,
  Home,
  Clock,
  BarChart2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MarketSnapshotResponse, SubmarketKey } from "@/lib/types";
import SourceCitations, { type CitationSource } from "@/components/marketpulse/SourceCitations";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */
const SUBMARKETS: { key: SubmarketKey; label: string }[] = [
  { key: "thousand-oaks", label: "Thousand Oaks" },
  { key: "newbury-park", label: "Newbury Park" },
  { key: "ventura", label: "Ventura" },
  { key: "camarillo", label: "Camarillo" },
  { key: "westlake", label: "Westlake Village" },
  { key: "oxnard", label: "Oxnard" },
];

type PropertyType = "sfr" | "condo" | "townhome";
type TimeframeKey = "1M" | "3M" | "6M" | "1Y" | "ALL";

const PROPERTY_TYPE_CONFIG: Record<
  PropertyType,
  { label: string; color: string }
> = {
  sfr: { label: "Single Family", color: "#5BA8A8" },
  condo: { label: "Condo", color: "#2A7F7F" },
  townhome: { label: "Townhome", color: "#1A4D4D" },
};

const TIMEFRAMES: { key: TimeframeKey; label: string; months: number | null }[] =
  [
    { key: "1M", label: "30D", months: 1 },
    { key: "3M", label: "3M", months: 3 },
    { key: "6M", label: "6M", months: 6 },
    { key: "1Y", label: "1Y", months: 12 },
    { key: "ALL", label: "All", months: null },
  ];

/* ═══════════════════════════════════════════════════════
   CITATION SOURCES (per section)
   ═══════════════════════════════════════════════════════ */
const SOURCES_METRICS: CitationSource[] = [
  {
    name: "Rentcast",
    url: "https://rentcast.io",
    description: "Live market stats via Rentcast Markets API — median price, DOM, listings, $/sqft",
  },
];

const SOURCES_AI_SUMMARY: CitationSource[] = [
  {
    name: "Perplexity AI",
    url: "https://perplexity.ai",
    description: "AI-generated narrative using Perplexity sonar model with real-time web search",
  },
  {
    name: "Rentcast",
    url: "https://rentcast.io",
    description: "Market metrics used as ground truth for the AI prompt",
  },
  {
    name: "Zillow Research",
    url: "https://www.zillow.com/research/",
    description: "Referenced by Perplexity sonar as a supporting data source",
  },
];

const CHART_METRICS: { key: string; label: string; unit: string; color: string }[] = [
  { key: "medianPrice",     label: "Median Price",         unit: "$",  color: "#5BA8A8" },
  { key: "activeListings",  label: "Active Listings",      unit: "",   color: "#7C9EF5" },
  { key: "closedSales",     label: "Closed Sales",         unit: "",   color: "#A78BFA" },
  { key: "newListings",     label: "New Listings",         unit: "",   color: "#F59E0B" },
  { key: "daysOnMarket",    label: "Days on Market",       unit: " days", color: "#F87171" },
  { key: "pricePerSf",      label: "Price / SF",           unit: "$",  color: "#34D399" },
  { key: "monthsSupply",    label: "Months Supply",        unit: " mo", color: "#FB923C" },
  { key: "pctOfOrigPrice",  label: "% of Original Price",  unit: "%",  color: "#E879F9" },
];

const SOURCES_CHART: CitationSource[] = [
  {
    name: "Rentcast",
    url: "https://rentcast.io",
    description: "12-month price history from Rentcast Markets API. SFR is directly sourced; Condo & Townhome lines are ratio-estimated from aggregate history.",
  },
];

const SOURCES_COMPS: CitationSource[] = [
  {
    name: "Rentcast",
    url: "https://rentcast.io",
    description: "Active listings pulled live from Rentcast Listings API by zip code",
  },
];

const SOURCES_HEAT_BAR: CitationSource[] = [
  {
    name: "Rentcast",
    url: "https://rentcast.io",
    description: "Months of supply derived from active listings ÷ annualized sales rate",
  },
];

const COMP_STATUS_STYLES: Record<
  "Active" | "Sold" | "Pending",
  { bg: string; text: string; dot: string }
> = {
  Active: {
    bg: "bg-emerald-900/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Sold: {
    bg: "bg-blue-900/30",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Pending: {
    bg: "bg-amber-900/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
};

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
function fmt$(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* ═══════════════════════════════════════════════════════
   HEAT BAR — Market Balance Indicator
   ═══════════════════════════════════════════════════════ */
function MarketHeatBar({
  monthsOfSupply,
  balance,
}: {
  monthsOfSupply: number | null;
  balance: "buyers" | "balanced" | "sellers";
}) {
  // Position of needle: 0 = far left (buyers), 100 = far right (sellers)
  // months < 4 → sellers (right), months > 6 → buyers (left), 4–6 → balanced (center)
  let position = 50; // default balanced
  if (monthsOfSupply !== null) {
    if (monthsOfSupply <= 0) position = 98;
    else if (monthsOfSupply >= 10) position = 2;
    else {
      // Linear interpolation: 0 mo → 100 (sellers), 10 mo → 0 (buyers)
      position = Math.max(2, Math.min(98, 100 - (monthsOfSupply / 10) * 100));
    }
  }

  const balanceLabel =
    balance === "sellers"
      ? "Seller's Market"
      : balance === "buyers"
      ? "Buyer's Market"
      : "Balanced Market";

  const balanceColor =
    balance === "sellers"
      ? "text-emerald-400"
      : balance === "buyers"
      ? "text-red-400"
      : "text-amber-400";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="text-red-400">Buyer's</span>
        <span className={`font-semibold ${balanceColor}`}>
          {monthsOfSupply !== null
            ? `${monthsOfSupply} mos supply`
            : balanceLabel}
        </span>
        <span className="text-emerald-400">Seller's</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden">
        {/* Gradient bar: red (buyers left) → amber (balanced center) → green (sellers right) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #ef4444, #f59e0b 50%, #10b981)",
          }}
        />
        {/* Frosted overlay for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
          }}
        />
        {/* Needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md border border-white/60 transition-all duration-700"
          style={{ left: `calc(${position}% - 4px)` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-white/30">
        <span>{"< 4 mos"}</span>
        <span>4–6 mos</span>
        <span>{"> 6 mos"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AI SUMMARY — renders inline % codeblock + arrows
   ═══════════════════════════════════════════════════════ */
function AISummaryText({ text }: { text: string }) {
  // Parse backtick-wrapped % changes: `+4.2%` ↑ or `-1.8%` ↓
  const parts = text.split(/(`[^`]+`\s*[↑↓]?)/g);
  return (
    <p className="text-[13px] text-white/70 leading-relaxed">
      {parts.map((part, i) => {
        const match = part.match(/^`([^`]+)`\s*([↑↓]?)$/);
        if (match) {
          const val = match[1];
          const arrow = match[2];
          const isUp = arrow === "↑" || val.startsWith("+");
          const isDown = arrow === "↓" || val.startsWith("-");
          return (
            <span key={i} className="inline-flex items-baseline gap-0.5">
              <code
                className={`text-[12px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                  isUp
                    ? "bg-emerald-900/40 text-emerald-400"
                    : isDown
                    ? "bg-red-900/40 text-red-400"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {val}
              </code>
              {arrow && (
                <span
                  className={`text-[11px] ${
                    isUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {arrow}
                </span>
              )}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════
   METRIC CARD
   ═══════════════════════════════════════════════════════ */
interface MetricCardProps {
  label: string;
  value: string;
  changePct?: number | null;
  changePositive?: boolean;
  changeLabel?: string;
  icon: React.ReactNode;
}
function MetricCard({
  label,
  value,
  changePct,
  changePositive,
  changeLabel,
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest">
          {label}
        </p>
        <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/30">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {changePct != null && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            changePositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {changePositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {Math.abs(changePct)}%{changeLabel ? ` ${changeLabel}` : ""}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECHARTS TOOLTIP
   ═══════════════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !Array.isArray(payload) || !payload.length) return null;
  return (
    <div className="bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white/60 mb-1.5">{label as string}</p>
      {(payload as Array<{ dataKey: string; name: string; value: number; color: string }>).map(
        (entry) => (
          <div key={entry.dataKey} className="flex items-center gap-1.5 mb-0.5">
            <span
              className="w-2 h-2 rounded-full inline-block flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-white/50">{entry.name}:</span>
            <span className="font-semibold text-white">{fmt$(entry.value)}</span>
          </div>
        )
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════ */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.05] ${className ?? ""}`}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  const [selectedSubmarket, setSelectedSubmarket] =
    useState<SubmarketKey>("thousand-oaks");
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);
  const [activePropertyTypes, setActivePropertyTypes] = useState<
    Set<PropertyType>
  >(new Set(["sfr", "condo", "townhome"]));
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1Y");
  const [selectedMetric, setSelectedMetric] = useState<string>("medianPrice");
  const [data, setData] = useState<MarketSnapshotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const countyDropdownRef = useRef<HTMLDivElement>(null);

  // Close county dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        countyDropdownRef.current &&
        !countyDropdownRef.current.contains(e.target as Node)
      ) {
        setCountyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data when submarket changes
  const fetchSnapshot = useCallback(async (submarket: SubmarketKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/marketpulse/snapshot?submarket=${submarket}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: MarketSnapshotResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshot(selectedSubmarket);
  }, [selectedSubmarket, fetchSnapshot]);

  // Filtered price history by timeframe
  const filteredHistory = (() => {
    if (!data?.priceHistory?.length) return [];
    const tf = TIMEFRAMES.find((t) => t.key === timeframe);
    if (!tf || tf.months === null) return data.priceHistory;
    return data.priceHistory.slice(-tf.months);
  })();

  // Active metric data from sheetsData
  const activeMetricData = (() => {
    const sd = (data as any)?.sheetsData;
    if (!sd) return filteredHistory.map(r => ({ month: r.month, value: r.sfr }));
    const rows: { month: string; value: number | null }[] = sd[selectedMetric] ?? [];
    const tf = TIMEFRAMES.find(t => t.key === timeframe);
    const sliced = tf?.months ? rows.slice(-tf.months) : rows;
    return sliced;
  })();

  const activeMetric = CHART_METRICS.find(m => m.key === selectedMetric) ?? CHART_METRICS[0];

  const submarketLabel =
    SUBMARKETS.find((s) => s.key === selectedSubmarket)?.label ??
    "Thousand Oaks";

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* ── Top Bar ── */}
      <div className="border-b border-white/[0.06] px-6 py-4 bg-[#0D1117]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between gap-4">
          {/* Left: County selector + submarket tabs */}
          <div className="flex items-center gap-4 min-w-0">
            {/* County dropdown */}
            <div className="relative" ref={countyDropdownRef}>
              <button
                onClick={() => setCountyDropdownOpen((o) => !o)}
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg px-3.5 py-2 text-[13px] font-medium text-white transition-colors flex-shrink-0"
              >
                <span>Ventura</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/40 transition-transform ${
                    countyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {countyDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] py-1.5">
                  <div className="flex items-center gap-2 px-3.5 py-2.5">
                    <Check className="w-3.5 h-3.5 text-[#5BA8A8]" />
                    <span className="text-[13px] font-semibold text-white">
                      Ventura
                    </span>
                  </div>
                  <div className="mx-3 mt-1 pt-1 border-t border-white/[0.06]">
                    <p className="text-[11px] text-white/25 italic px-0.5 py-1">
                      More coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submarket tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {SUBMARKETS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSubmarket(s.key)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                    selectedSubmarket === s.key
                      ? "bg-[#1A4D4D] text-white shadow-sm"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: refresh + last updated */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {data?.fetchedAt && (
              <p className="text-[11px] text-white/25 hidden xl:block">
                Updated {new Date(data.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <button
              onClick={() => fetchSnapshot(selectedSubmarket)}
              disabled={loading}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* ── Error state ── */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Top row: Metric cards + Market Balance Heat Bar ── */}
        <div className="grid grid-cols-12 gap-4 mb-5">
          {/* 4 metric cards — 8 cols */}
          <div className="col-span-12 xl:col-span-8 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Market Metrics</p>
              <SourceCitations sources={SOURCES_METRICS} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loading ? (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[110px]" />
                ))}
              </>
            ) : (
              <>
                <MetricCard
                  label="Median Price"
                  value={fmt$(data?.medianPrice)}
                  changePct={data?.medianPriceChangePct}
                  changePositive={(data?.medianPriceChangePct ?? 0) >= 0}
                  changeLabel="YoY"
                  icon={<Home className="w-3.5 h-3.5" />}
                />
                <MetricCard
                  label="Avg Days on Market"
                  value={data?.avgDaysOnMarket != null ? `${data.avgDaysOnMarket}` : "—"}
                  icon={<Clock className="w-3.5 h-3.5" />}
                />
                <MetricCard
                  label="Active Listings"
                  value={data?.activeListings?.toLocaleString() ?? "—"}
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                />
                <MetricCard
                  label="Price / Sqft"
                  value={data?.pricePerSqft != null ? `$${data.pricePerSqft}` : "—"}
                  icon={<BarChart2 className="w-3.5 h-3.5" />}
                />
              </>
            )}
            </div>
          </div>

          {/* Heat Bar — 4 cols */}
          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-1">
                    Market Balance
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {loading
                      ? "—"
                      : data?.marketBalance === "sellers"
                      ? "Seller's Market"
                      : data?.marketBalance === "buyers"
                      ? "Buyer's Market"
                      : "Balanced Market"}
                  </p>
                </div>
                <SourceCitations sources={SOURCES_HEAT_BAR} />
              </div>
              {loading ? (
                <Skeleton className="h-10" />
              ) : (
                <MarketHeatBar
                  monthsOfSupply={data?.monthsOfSupply ?? null}
                  balance={data?.marketBalance ?? "balanced"}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── AI Market Summary ── */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#1A4D4D]/60 flex items-center justify-center">
                <BarChart2 className="w-3 h-3 text-[#5BA8A8]" />
              </div>
              <h3 className="text-[13px] font-semibold text-white">
                AI Market Summary
              </h3>
              <span className="text-[10px] font-medium text-white/25 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                {submarketLabel}
              </span>
            </div>
            <SourceCitations sources={SOURCES_AI_SUMMARY} />
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          ) : data?.aiSummary ? (
            <AISummaryText text={data.aiSummary} />
          ) : (
            <p className="text-[13px] text-white/30 italic">
              AI summary unavailable for this market.
            </p>
          )}
        </div>

        {/* ── Multi-Metric Chart ── */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 mb-5">
          {/* Metric tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-white/[0.06]">
            {CHART_METRICS.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
                  selectedMetric === m.key
                    ? "text-white border-transparent"
                    : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
                }`}
                style={selectedMetric === m.key ? {
                  backgroundColor: activeMetric.color + "22",
                  borderColor: activeMetric.color + "55",
                  color: activeMetric.color,
                } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-white">{activeMetric.label}</h3>
              <SourceCitations sources={SOURCES_CHART} />
            </div>
            <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    timeframe === tf.key
                      ? "bg-white/[0.1] text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-[220px] w-full" />
          ) : activeMetricData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-white/20 text-sm">
              No data available for this metric
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={activeMetricData}
                margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    activeMetric.unit === "$"
                      ? fmt$(v)
                      : activeMetric.unit === "%"
                      ? `${v}%`
                      : String(v)
                  }
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }}
                  axisLine={false}
                  tickLine={false}
                  width={62}
                />
                <Tooltip
                  formatter={(v: number) =>
                    activeMetric.unit === "$"
                      ? fmt$(v)
                      : activeMetric.unit === "%"
                      ? `${v}%`
                      : `${v}${activeMetric.unit}`
                  }
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    fontSize: 12,
                    color: "#fff",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={activeMetric.label}
                  stroke={activeMetric.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: activeMetric.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Recent Comps ── */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">Recent Comps</h3>
            <SourceCitations sources={SOURCES_COMPS} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Address", "Status", "Price", "Sqft", "$/Sqft", "Beds/Baths", "DOM"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`text-[10px] font-semibold text-white/25 uppercase tracking-widest pb-3 ${
                          h === "Address" ? "text-left" : "text-right"
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.03]">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-3 pr-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !data?.comps?.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-white/20 text-sm"
                    >
                      No comps available for this submarket
                    </td>
                  </tr>
                ) : (
                  data.comps.map((comp, i) => {
                    const status = comp.status ?? "Active";
                    const statusStyle =
                      COMP_STATUS_STYLES[status] ?? COMP_STATUS_STYLES.Active;
                    return (
                      <tr
                        key={i}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-3 pr-4">
                          <p className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">
                            {comp.address}
                          </p>
                          {comp.propertyType && (
                            <p className="text-[10px] text-white/25 mt-0.5">
                              {comp.propertyType}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                            />
                            {status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right text-[13px] font-semibold text-white/80">
                          {fmt$(comp.price)}
                        </td>
                        <td className="py-3 pr-4 text-right text-[13px] text-white/40">
                          {comp.sqft ? comp.sqft.toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-4 text-right text-[13px] text-white/40">
                          {comp.pricePerSqft ? `$${comp.pricePerSqft}` : "—"}
                        </td>
                        <td className="py-3 pr-4 text-right text-[13px] text-white/40">
                          {comp.bedrooms != null && comp.bathrooms != null
                            ? `${comp.bedrooms}bd / ${comp.bathrooms}ba`
                            : "—"}
                        </td>
                        <td className="py-3 text-right text-[13px] text-white/40">
                          {comp.daysOld != null ? `${comp.daysOld}d` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
