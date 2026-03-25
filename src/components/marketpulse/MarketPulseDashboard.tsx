"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ExternalLink,
  Check,
  Clock,
  Info,
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
  NewsArticle as DBNewsArticle,
} from "@/lib/types";
import {
  getMarkets,
  getAllLatestSnapshots,
  getComps,
  getPriceHistory,
  getTrendingNeighborhoods,
  getRecentActivity,
  getCountyIndicators,
  getPropertyTypeBreakdown,
  getNewsArticles,
} from "@/lib/queries";

/* ═══════════════════════════════════════════════════════
   LOCAL UI TYPES (used by sub-components)
   ═══════════════════════════════════════════════════════ */
type PropertyType = "sfr" | "condo" | "townhome";
type TimeframeKey = "1M" | "3M" | "6M" | "1Y" | "5Y" | "ALL";

interface MonthlyPriceData {
  month: string;
  sfr: number;
  condo: number;
  townhome: number;
}

/* ═══════════════════════════════════════════════════════
   UI CONSTANTS (kept — not data)
   ═══════════════════════════════════════════════════════ */
const PROPERTY_TYPE_CONFIG: Record<PropertyType, { label: string; color: string }> = {
  sfr: { label: "Single Family", color: "#1A4D4D" },
  condo: { label: "Condo", color: "#2A7F7F" },
  townhome: { label: "Townhome", color: "#5BA8A8" },
};

const TIMEFRAMES: { key: TimeframeKey; label: string; months: number | null }[] = [
  { key: "1M", label: "1M", months: 1 },
  { key: "3M", label: "3M", months: 3 },
  { key: "6M", label: "6M", months: 6 },
  { key: "1Y", label: "1Y", months: 12 },
  { key: "5Y", label: "5Y", months: 60 },
  { key: "ALL", label: "All", months: null },
];

/* ═══════════════════════════════════════════════════════
   HELPER: format dollars
   ═══════════════════════════════════════════════════════ */
function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* ═══════════════════════════════════════════════════════
   SENTIMENT GAUGE (arc)
   ═══════════════════════════════════════════════════════ */
interface SentimentGaugeProps {
  score: number; // 0–100
  saleToListRatio?: number | null;
  marketCompetitiveness?: string | null;
}

function SentimentGauge({ score, saleToListRatio, marketCompetitiveness }: SentimentGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Arc math
  const cx = 80, cy = 80, r = 60;
  const startAngle = 180;
  const endAngle = 0;
  const totalArcDeg = 180;
  const fillDeg = (clampedScore / 100) * totalArcDeg;

  function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  const bgStart = polarToXY(cx, cy, r, startAngle);
  const bgEnd = polarToXY(cx, cy, r, endAngle);
  const fillEnd = polarToXY(cx, cy, r, startAngle - fillDeg);
  const largeArcBg = totalArcDeg > 180 ? 1 : 0;
  const largeArcFill = fillDeg > 180 ? 1 : 0;

  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcBg} 1 ${bgEnd.x} ${bgEnd.y}`;
  const fillPath = fillDeg > 0
    ? `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcFill} 1 ${fillEnd.x} ${fillEnd.y}`
    : "";

  const label =
    clampedScore >= 70 ? "Seller's Market" :
    clampedScore >= 55 ? "Slight Seller Advantage" :
    clampedScore >= 45 ? "Balanced Market" :
    clampedScore >= 30 ? "Slight Buyer Advantage" :
    "Buyer's Market";

  const color =
    clampedScore >= 70 ? "#1A4D4D" :
    clampedScore >= 55 ? "#2A7F7F" :
    clampedScore >= 45 ? "#5BA8A8" :
    clampedScore >= 30 ? "#E5A550" :
    "#D97706";

  // Tooltip details
  const tooltipLines: string[] = [];
  if (saleToListRatio != null) {
    tooltipLines.push(`Sale-to-list: ${saleToListRatio.toFixed(1)}%`);
  }
  if (marketCompetitiveness) {
    tooltipLines.push(`Competitiveness: ${marketCompetitiveness}`);
  }
  tooltipLines.push(`Score: ${clampedScore}/100`);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <svg width="160" height="90" viewBox="0 0 160 90">
          {/* Background arc */}
          <path d={bgPath} fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
          {/* Fill arc */}
          {fillPath && (
            <path d={fillPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          )}
          {/* Score text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>
            {clampedScore}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill="#6B7280">
            / 100
          </text>
        </svg>
        {/* Hover tooltip */}
        {tooltipLines.length > 0 && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              {tooltipLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #111827' }} />
            </div>
          </div>
        )}
      </div>
      <p className="text-sm font-semibold mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SPARKLINE (tiny inline chart)
   ═══════════════════════════════════════════════════════ */
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const w = 64, h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? "#16A34A" : "#DC2626"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CUSTOM RECHARTS TOOLTIP
   ═══════════════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium">{formatPrice(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  /* ── State ── */
  const [markets, setMarkets] = useState<Market[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, MarketSnapshot>>({});
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>("thousand-oaks");
  const [activePropertyTypes, setActivePropertyTypes] = useState<Set<PropertyType>>(
    new Set(["sfr", "condo", "townhome"])
  );
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1Y");
  const [priceHistory, setPriceHistory] = useState<MonthlyPriceData[]>([]);
  const [comps, setComps] = useState<Comp[]>([]);
  const [trendingNeighborhoods, setTrendingNeighborhoods] = useState<TrendingNeighborhood[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [countyIndicators, setCountyIndicators] = useState<CountyIndicator[]>([]);
  const [propertyTypeBreakdown, setPropertyTypeBreakdown] = useState<PropertyTypeBreakdown[]>([]);
  const [newsArticles, setNewsArticles] = useState<DBNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Effects ── */
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMarketDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial data load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [mkts, snaps, trending, activity, indicators, propTypes, news] = await Promise.all([
          getMarkets(),
          getAllLatestSnapshots(),
          getTrendingNeighborhoods(),
          getRecentActivity(),
          getCountyIndicators(),
          getPropertyTypeBreakdown(),
          getNewsArticles(),
        ]);
        setMarkets(mkts);
        setSnapshots(snaps);
        setTrendingNeighborhoods(trending);
        setRecentActivity(activity);
        setCountyIndicators(indicators);
        setPropertyTypeBreakdown(propTypes);
        setNewsArticles(news);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Market-specific data (comps + price history)
  useEffect(() => {
    async function loadMarketData() {
      const [history, compsData] = await Promise.all([
        getPriceHistory(selectedMarket),
        getComps(selectedMarket),
      ]);
      setPriceHistory(
        history.map((row: PriceHistoryRow) => ({
          month: row.month_label,
          sfr: row.sfr,
          condo: row.condo,
          townhome: row.townhome,
        }))
      );
      setComps(compsData);
    }
    loadMarketData();
  }, [selectedMarket]);

  /* ── Derived data ── */
  const snap = snapshots[selectedMarket];
  const selectedMarketLabel =
    markets.find((m) => m.id === selectedMarket)?.label ?? "Thousand Oaks";

  // Filter price history by timeframe
  const filteredPriceHistory = (() => {
    const tf = TIMEFRAMES.find((t) => t.key === timeframe);
    if (!tf || tf.months === null) return priceHistory;
    return priceHistory.slice(-tf.months);
  })();

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A4D4D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading market data…</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">MarketPulse</h1>
            <p className="text-xs text-gray-500 mt-0.5">Ventura County Real Estate Intelligence</p>
          </div>

          {/* Market selector dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMarketDropdownOpen((o) => !o)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1A4D4D] transition-colors"
            >
              {selectedMarketLabel}
              <ChevronDown className={`w-4 h-4 transition-transform ${marketDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {marketDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                {markets.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMarket(m.id as MarketKey); setMarketDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                      selectedMarket === m.id ? "text-[#1A4D4D] font-semibold" : "text-gray-700"
                    }`}
                  >
                    {m.label}
                    {selectedMarket === m.id && <Check className="w-3.5 h-3.5 text-[#1A4D4D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* ── LEFT / CENTER column ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── Key Metrics ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Median Price */}
            {snap && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Median Sale Price</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {snap.median_price ? formatPrice(snap.median_price) : "—"}
                    </p>
                    {snap.median_change_pct != null && (
                      <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                        snap.median_change_positive ? "text-green-600" : "text-red-500"
                      }`}>
                        {snap.median_change_positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(snap.median_change_pct)}% YoY
                      </div>
                    )}
                  </div>
                  {snap.sparkline && (
                    <Sparkline data={snap.sparkline} positive={snap.median_change_positive ?? true} />
                  )}
                </div>
              </div>
            )}

            {/* Active Listings */}
            {snap && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Active Listings</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {snap.active_listings?.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">homes for sale</p>
                  </div>
                </div>
              </div>
            )}

            {/* Avg Days on Market */}
            {snap && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Avg Days on Market</p>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{snap.avg_dom ?? "—"}</p>
                  {snap.avg_dom_change && (
                    <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                      snap.avg_dom_change_positive ? "text-green-600" : "text-red-500"
                    }`}>
                      {snap.avg_dom_change_positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {snap.avg_dom_change} vs last year
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price per Sqft */}
            {snap && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Price / Sqft</p>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {snap.price_per_sqft ? `$${snap.price_per_sqft}` : "—"}
                  </p>
                  {snap.price_per_sqft_change_pct != null && (
                    <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                      snap.price_per_sqft_change_positive ? "text-green-600" : "text-red-500"
                    }`}>
                      {snap.price_per_sqft_change_positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(snap.price_per_sqft_change_pct)}% YoY
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Market Sentiment ── */}
          {snap && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Market Sentiment</h3>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10 w-64">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      Composite score based on price appreciation, days on market trend, and sale-to-list ratio.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <SentimentGauge
                  score={snap.sentiment_score ?? 50}
                  saleToListRatio={snap.sale_to_list_ratio}
                  marketCompetitiveness={snap.market_competitiveness}
                />
                {snap.market_summary_text && (
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    {snap.market_summary_text}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Price History Chart ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price History</h3>
              <div className="flex items-center gap-4">
                {/* Property type toggles */}
                <div className="flex gap-2">
                  {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map((pt) => (
                    <button
                      key={pt}
                      onClick={() => {
                        setActivePropertyTypes((prev) => {
                          const next = new Set(prev);
                          if (next.has(pt)) next.delete(pt);
                          else next.add(pt);
                          return next;
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        activePropertyTypes.has(pt)
                          ? "text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      style={activePropertyTypes.has(pt) ? { backgroundColor: PROPERTY_TYPE_CONFIG[pt].color } : {}}
                    >
                      {PROPERTY_TYPE_CONFIG[pt].label}
                    </button>
                  ))}
                </div>
                {/* Timeframe selector */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {TIMEFRAMES.map((tf) => (
                    <button
                      key={tf.key}
                      onClick={() => setTimeframe(tf.key)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        timeframe === tf.key
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={filteredPriceHistory} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 11, fill: "#9CA3AF" }} width={65} />
                <Tooltip content={<CustomTooltip />} />
                {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map((pt) =>
                  activePropertyTypes.has(pt) ? (
                    <Line
                      key={pt}
                      type="monotone"
                      dataKey={pt}
                      name={PROPERTY_TYPE_CONFIG[pt].label}
                      stroke={PROPERTY_TYPE_CONFIG[pt].color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Recent Comps ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Recent Comps</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Address</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-2">Sold Price</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-2">Sqft</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-2">$/Sqft</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-2">DOM</th>
                  </tr>
                </thead>
                <tbody>
                  {comps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No comps available</td>
                    </tr>
                  ) : (
                    comps.map((comp, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-medium text-gray-900">{comp.address}</td>
                        <td className="py-3 text-right text-gray-700">{formatPrice(comp.sold_price)}</td>
                        <td className="py-3 text-right text-gray-500">{comp.sqft?.toLocaleString()}</td>
                        <td className="py-3 text-right text-gray-500">${comp.price_per_sqft}</td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            comp.dom <= 7 ? "bg-green-50 text-green-700" :
                            comp.dom <= 21 ? "bg-yellow-50 text-yellow-700" :
                            "bg-red-50 text-red-600"
                          }`}>
                            <Clock className="w-3 h-3" />
                            {comp.dom}d
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Market News ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Market News</h3>
              <a href="/news" className="text-xs text-[#1A4D4D] hover:underline font-medium">View all</a>
            </div>
            <div className="space-y-4">
              {newsArticles.slice(0, 3).map((article, i) => (
                <a
                  key={i}
                  href={article.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#1A4D4D] bg-[#1A4D4D]/10 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">{article.published_date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#1A4D4D] transition-colors line-clamp-2">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{article.source}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT Sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4">

          {/* Trending Neighborhoods */}
          <SidebarCard title="Trending Neighborhoods">
            <div className="space-y-2">
              {trendingNeighborhoods.map((n, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.name}</p>
                    <p className="text-xs text-gray-500">{n.area}</p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    n.positive ? "text-green-600" : "text-red-500"
                  }`}>{n.change_pct}</span>
                </div>
              ))}
            </div>
          </SidebarCard>

          {/* Recent Activity */}
          <SidebarCard title="Recent Activity">
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    item.activity_type === "New listing" ? "bg-blue-50 text-blue-700" :
                    item.activity_type === "Price reduced" ? "bg-orange-50 text-orange-700" :
                    "bg-green-50 text-green-700"
                  }`}>
                    {item.activity_type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.address}</p>
                    <p className="text-xs text-gray-500">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </SidebarCard>

          {/* Ventura County Indicators */}
          <SidebarCard title="Ventura County Indicators">
            <div className="space-y-2">
              {countyIndicators.map((ind, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs text-gray-500">{ind.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{ind.value}</p>
                  </div>
                  <span className={`text-xs font-medium ${
                    ind.positive ? "text-green-600" : "text-red-500"
                  }`}>{ind.change}</span>
                </div>
              ))}
            </div>
          </SidebarCard>

          {/* By Property Type */}
          <SidebarCard title="By Property Type">
            <div className="space-y-2">
              {propertyTypeBreakdown.map((pt, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs text-gray-500">{pt.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{pt.value}</p>
                  </div>
                  <span className={`text-xs font-medium ${
                    pt.positive ? "text-green-600" : "text-red-500"
                  }`}>{pt.change_pct}</span>
                </div>
              ))}
            </div>
          </SidebarCard>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR CARD WRAPPER
   ═══════════════════════════════════════════════════════ */
function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
