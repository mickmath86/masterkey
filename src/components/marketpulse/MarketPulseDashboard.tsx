"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
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
  ReferenceLine,
} from "recharts";
import type { MarketSnapshotResponse, SubmarketKey } from "@/lib/types";
import SourceCitations, { type CitationSource } from "@/components/marketpulse/SourceCitations";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */
const SUBMARKETS: { key: SubmarketKey; label: string }[] = [
  { key: "thousand-oaks", label: "Thousand Oaks" },
  { key: "newbury-park",  label: "Newbury Park" },
  { key: "ventura",       label: "Ventura" },
  { key: "camarillo",     label: "Camarillo" },
  { key: "westlake",      label: "Westlake Village" },
  { key: "oxnard",        label: "Oxnard" },
];

type TimeframeKey = "1M" | "3M" | "6M" | "1Y" | "ALL";
type ChangeMode = "MoM" | "YoY";

const TIMEFRAMES: { key: TimeframeKey; label: string; months: number | null }[] = [
  { key: "1M",  label: "30D", months: 1 },
  { key: "3M",  label: "3M",  months: 3 },
  { key: "6M",  label: "6M",  months: 6 },
  { key: "1Y",  label: "1Y",  months: 12 },
  { key: "ALL", label: "All", months: null },
];

const CHART_METRICS: { key: string; label: string; unit: string; color: string }[] = [
  { key: "medianPrice",    label: "Median Price",        unit: "$",    color: "#5BA8A8" },
  { key: "activeListings", label: "Active Listings",     unit: "",     color: "#7C9EF5" },
  { key: "closedSales",    label: "Closed Sales",        unit: "",     color: "#A78BFA" },
  { key: "newListings",    label: "New Listings",        unit: "",     color: "#F59E0B" },
  { key: "daysOnMarket",   label: "Days on Market",      unit: " days",color: "#F87171" },
  { key: "pricePerSf",     label: "Price / SF",          unit: "$",    color: "#34D399" },
  { key: "monthsSupply",   label: "Months Supply",       unit: " mo",  color: "#FB923C" },
  { key: "pctOfOrigPrice", label: "% of Original Price", unit: "%",    color: "#E879F9" },
];

const SOURCES_METRICS: CitationSource[] = [
  { name: "InfoSparks MLS", url: "https://www.infospacsinc.com", description: "Hard market data sourced from MLS InfoSparks, maintained and updated monthly by MasterKey." },
];
const SOURCES_AI_SUMMARY: CitationSource[] = [
  { name: "Perplexity AI", url: "https://perplexity.ai", description: "AI-generated narrative using Perplexity sonar model with real-time web search" },
];
const SOURCES_CHART: CitationSource[] = [
  { name: "InfoSparks MLS", url: "https://www.infospacsinc.com", description: "Historical market data from MLS InfoSparks — updated monthly." },
];
const SOURCES_HEAT_BAR: CitationSource[] = [
  { name: "InfoSparks MLS", url: "https://www.infospacsinc.com", description: "Months of supply = Active Listings ÷ Prior Month Closed Sales" },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
function fmt$(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function pctChange(from: number | null, to: number | null): number | null {
  if (from == null || to == null || from === 0) return null;
  return Math.round(((to - from) / from) * 1000) / 10;
}

/** Get last non-null value from a SheetRow array */
function lastVal(rows: { month: string; value: number | null }[] | undefined): number | null {
  if (!rows) return null;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].value !== null) return rows[i].value;
  }
  return null;
}

/** Get Nth-from-last non-null value */
function nthLastVal(rows: { month: string; value: number | null }[] | undefined, n: number): number | null {
  if (!rows) return null;
  let count = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].value !== null) {
      count++;
      if (count === n) return rows[i].value;
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   MARKET HEAT BAR — corrected direction
   Sellers < 4 mo → right (green)
   Buyers  > 6 mo → left (red)
   ═══════════════════════════════════════════════════════ */
function MarketHeatBar({
  monthsOfSupply,
  balance,
}: {
  monthsOfSupply: number | null;
  balance: "buyers" | "balanced" | "sellers";
}) {
  // Scale: 0 mo = far right (100%), 10+ mo = far left (0%)
  // Padded so 4 mo ≈ 33% and 6 mo ≈ 67% to keep markers off the edges
  // Map 0→10 months to 95%→5% (padded)
  const MAX_MOS = 10;
  let position = 50;
  if (monthsOfSupply !== null) {
    const clamped = Math.max(0, Math.min(MAX_MOS, monthsOfSupply));
    // 0 mo → 95 (sellers, right), 10 mo → 5 (buyers, left)
    position = 95 - (clamped / MAX_MOS) * 90;
  }

  // Marker positions for 4 mo and 6 mo
  const pos4mo = 95 - (4 / MAX_MOS) * 90; // ≈ 59%
  const pos6mo = 95 - (6 / MAX_MOS) * 90; // ≈ 41%

  const balanceColor =
    balance === "sellers" ? "text-emerald-400"
    : balance === "buyers" ? "text-red-400"
    : "text-amber-400";

  const balanceLabel =
    balance === "sellers" ? "Seller's Market"
    : balance === "buyers" ? "Buyer's Market"
    : "Balanced Market";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="text-red-400">Buyer's</span>
        <span className={`font-semibold ${balanceColor}`}>
          {monthsOfSupply !== null ? `${monthsOfSupply} mos supply` : balanceLabel}
        </span>
        <span className="text-emerald-400">Seller's</span>
      </div>

      <div className="relative h-3 rounded-full overflow-visible">
        {/* Gradient: left=buyers(red) → center=balanced(amber) → right=sellers(green) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(to right, #ef4444, #f59e0b 50%, #10b981)" }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)" }}
        />

        {/* 4 mo marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-full"
          style={{ left: `${pos4mo}%` }}
        />
        {/* 6 mo marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-full"
          style={{ left: `${pos6mo}%` }}
        />

        {/* Needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-white/80 transition-all duration-700 z-10"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>

      <div className="relative text-[10px] text-white/30" style={{ height: "16px" }}>
        <span className="absolute left-0">{"≥6 mos"}</span>
        <span className="absolute" style={{ left: `${pos6mo - 3}%` }}>6</span>
        <span className="absolute" style={{ left: `${pos4mo - 3}%` }}>4</span>
        <span className="absolute right-0">{"≤4 mos"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   METRIC CARD — with MoM/YoY toggle
   ═══════════════════════════════════════════════════════ */
interface MetricCardProps {
  label: string;
  value: string;
  momChangePct?: number | null;
  yoyChangePct?: number | null;
  icon: React.ReactNode;
}

function MetricCard({ label, value, momChangePct, yoyChangePct, icon }: MetricCardProps) {
  const [mode, setMode] = useState<ChangeMode>("MoM");
  const changePct = mode === "MoM" ? momChangePct : yoyChangePct;
  const isPositive = (changePct ?? 0) >= 0;
  const hasChange = changePct != null;

  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/30">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <div className="flex items-center justify-between gap-1">
        {hasChange ? (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(changePct!)}%
          </div>
        ) : (
          <span className="text-xs text-white/20">—</span>
        )}
        {/* MoM/YoY toggle */}
        <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-md overflow-hidden">
          {(["MoM", "YoY"] as ChangeMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-0.5 text-[10px] font-medium transition-all ${
                mode === m ? "bg-white/[0.1] text-white" : "text-white/25 hover:text-white/50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════ */
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.05] ${className ?? ""}`} />;
}

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  const [selectedSubmarket, setSelectedSubmarket] = useState<SubmarketKey>("thousand-oaks");
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1Y");
  const [selectedMetric, setSelectedMetric] = useState<string>("medianPrice");
  const [data, setData] = useState<MarketSnapshotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const countyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countyDropdownRef.current && !countyDropdownRef.current.contains(e.target as Node)) {
        setCountyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSnapshot = useCallback(async (submarket: SubmarketKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/marketpulse/snapshot?submarket=${submarket}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: MarketSnapshotResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSnapshot(selectedSubmarket); }, [selectedSubmarket, fetchSnapshot]);

  // ── Derived sheet rows ──────────────────────────────────────────────────────
  const sd = (data as any)?.sheetsData as Record<string, { month: string; value: number | null }[]> | undefined;

  // Correct MOS: active listings ÷ prior month closed sales
  const computedMOS = (() => {
    if (!sd) return data?.monthsOfSupply ?? null;
    const active = lastVal(sd.activeListings);
    const closedPrev = nthLastVal(sd.closedSales, 2); // second-to-last = prior month
    if (active == null || closedPrev == null || closedPrev === 0) return data?.monthsOfSupply ?? null;
    return Math.round((active / closedPrev) * 10) / 10;
  })();

  const computedBalance = computedMOS == null ? (data?.marketBalance ?? "balanced")
    : computedMOS <= 4 ? "sellers"
    : computedMOS >= 6 ? "buyers"
    : "balanced";

  // Metric card change computations
  function metricChanges(sheetKey: string) {
    const rows = sd?.[sheetKey];
    const latest = lastVal(rows);
    const mom = pctChange(nthLastVal(rows, 2), latest);
    const yoy = pctChange(nthLastVal(rows, 13), latest);
    return { momChangePct: mom, yoyChangePct: yoy };
  }

  // Active metric for chart
  const activeMetric = CHART_METRICS.find(m => m.key === selectedMetric) ?? CHART_METRICS[0];

  const activeMetricData = (() => {
    const rows: { month: string; value: number | null }[] = sd?.[selectedMetric] ?? [];
    const tf = TIMEFRAMES.find(t => t.key === timeframe);
    return tf?.months ? rows.slice(-tf.months) : rows;
  })();

  // Chart % change badge
  const chartChangePct = (() => {
    const rows = sd?.[selectedMetric] ?? [];
    const tf = TIMEFRAMES.find(t => t.key === timeframe);
    const sliced = tf?.months ? rows.slice(-tf.months) : rows;
    const first = sliced.find(r => r.value != null)?.value ?? null;
    const last  = lastVal(sliced);
    return pctChange(first, last);
  })();

  const submarketLabel = SUBMARKETS.find(s => s.key === selectedSubmarket)?.label ?? "Thousand Oaks";

  return (
    <div
      className="min-h-screen bg-[#0D1117] text-white"
      style={{ maxWidth: "100vw", overflowX: "hidden" }}
    >
      {/* ── Top Bar ── */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 py-4 bg-[#0D1117]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            {/* County dropdown */}
            <div className="relative flex-shrink-0" ref={countyDropdownRef}>
              <button
                onClick={() => setCountyDropdownOpen(o => !o)}
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] font-medium text-white transition-colors"
              >
                <span>Ventura</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${countyDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {countyDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] py-1.5">
                  <div className="flex items-center gap-2 px-3.5 py-2.5">
                    <Check className="w-3.5 h-3.5 text-[#5BA8A8]" />
                    <span className="text-[13px] font-semibold text-white">Ventura</span>
                  </div>
                  <div className="mx-3 mt-1 pt-1 border-t border-white/[0.06]">
                    <p className="text-[11px] text-white/25 italic px-0.5 py-1">More coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submarket tabs — horizontal scroll, locked width */}
            <div
              className="flex items-center gap-1 overflow-x-auto"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {SUBMARKETS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSubmarket(s.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
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
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Metric cards + Heat Bar ── */}
        <div className="grid grid-cols-12 gap-4 mb-5">
          <div className="col-span-12 xl:col-span-8 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Market Metrics · {submarketLabel}</p>
              <SourceCitations sources={SOURCES_METRICS} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {loading ? (
                [0,1,2,3].map(i => <Skeleton key={i} className="h-[120px]" />)
              ) : (
                <>
                  <MetricCard
                    label="Median Price"
                    value={fmt$(data?.medianPrice)}
                    {...metricChanges("medianPrice")}
                    icon={<Home className="w-3.5 h-3.5" />}
                  />
                  <MetricCard
                    label="Avg Days on Market"
                    value={data?.avgDaysOnMarket != null ? `${data.avgDaysOnMarket}` : "—"}
                    {...metricChanges("daysOnMarket")}
                    icon={<Clock className="w-3.5 h-3.5" />}
                  />
                  <MetricCard
                    label="Active Listings"
                    value={data?.activeListings?.toLocaleString() ?? "—"}
                    {...metricChanges("activeListings")}
                    icon={<TrendingUp className="w-3.5 h-3.5" />}
                  />
                  <MetricCard
                    label="Price / Sqft"
                    value={data?.pricePerSqft != null ? `$${data.pricePerSqft}` : "—"}
                    {...metricChanges("pricePerSf")}
                    icon={<BarChart2 className="w-3.5 h-3.5" />}
                  />
                </>
              )}
            </div>
          </div>

          {/* Heat Bar */}
          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 h-full flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-1">Market Balance</p>
                  <p className="text-sm font-semibold text-white">
                    {loading ? "—"
                      : computedBalance === "sellers" ? "Seller's Market"
                      : computedBalance === "buyers" ? "Buyer's Market"
                      : "Balanced Market"}
                  </p>
                  {computedMOS != null && (
                    <p className="text-[11px] text-white/30 mt-0.5">
                      {computedMOS} mos supply · Active ÷ Prior Month Closed
                    </p>
                  )}
                </div>
                <SourceCitations sources={SOURCES_HEAT_BAR} />
              </div>
              {loading ? (
                <Skeleton className="h-12" />
              ) : (
                <MarketHeatBar monthsOfSupply={computedMOS} balance={computedBalance} />
              )}
            </div>
          </div>
        </div>

        {/* ── AI Summary — rendered as Markdown ── */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#1A4D4D]/60 flex items-center justify-center">
                <BarChart2 className="w-3 h-3 text-[#5BA8A8]" />
              </div>
              <h3 className="text-[13px] font-semibold text-white">AI Market Summary</h3>
              <span className="text-[10px] font-medium text-white/25 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">{submarketLabel}</span>
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
            <div className="text-[13px] text-white/70 leading-relaxed prose prose-invert prose-sm max-w-none
              [&_strong]:text-white [&_strong]:font-semibold
              [&_p]:mb-2 [&_p:last-child]:mb-0">
              <ReactMarkdown>{data.aiSummary}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-[13px] text-white/30 italic">AI summary unavailable for this market.</p>
          )}
        </div>

        {/* ── Multi-Metric Chart ── */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 sm:p-5 mb-5">
          {/* Metric tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-white/[0.06]">
            {CHART_METRICS.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
                  selectedMetric === m.key ? "text-white border-transparent" : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
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
              {/* Period % change badge */}
              {chartChangePct != null && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  chartChangePct >= 0
                    ? "bg-emerald-900/30 text-emerald-400"
                    : "bg-red-900/30 text-red-400"
                }`}>
                  {chartChangePct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(chartChangePct)}% ({timeframe === "ALL" ? "all time" : timeframe})
                </span>
              )}
              <SourceCitations sources={SOURCES_CHART} />
            </div>
            <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    timeframe === tf.key ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/60"
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
            <div className="h-[220px] flex items-center justify-center text-white/20 text-sm">No data available</div>
          ) : (
            /* touch-action: pan-y prevents horizontal swipe from hijacking page scroll */
            <div style={{ touchAction: "pan-y", width: "100%", overflowX: "hidden" }}>
              <ResponsiveContainer width="99%" height={220}>
                <LineChart data={activeMetricData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={{ stroke: "rgba(255,255,255,0.05)" }} tickLine={false} />
                  <YAxis
                    tickFormatter={v =>
                      activeMetric.unit === "$" ? fmt$(v)
                      : activeMetric.unit === "%" ? `${v}%`
                      : String(v)
                    }
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }}
                    axisLine={false} tickLine={false} width={62}
                  />
                  <Tooltip
                    formatter={(v: number) =>
                      activeMetric.unit === "$" ? [fmt$(v), activeMetric.label]
                      : activeMetric.unit === "%" ? [`${v}%`, activeMetric.label]
                      : [`${v}${activeMetric.unit}`, activeMetric.label]
                    }
                    contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: 12, color: "#fff" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  />
                  <Line type="monotone" dataKey="value" name={activeMetric.label} stroke={activeMetric.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: activeMetric.color }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
