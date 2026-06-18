'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronLeft,
  ChevronRight,
  Home,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart2,
  DollarSign,
  Activity,
  Users,
  Calendar,
  MapPin,
  Building2,
  Percent,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentSale {
  address: string
  neighborhood: string | null
  listPrice: number
  soldPrice: number
  beds: number
  baths: number
  sqft: number | null
  daysOnMarket: number | null
  image: string | null
  overUnder: number | null
}

interface TrendPoint {
  month: string
  label: string
  closedSales: number
}

interface MarketData {
  city: string
  date: string
  reportMonth: string
  activeListings: number
  medListPrice: number | null
  avgListPrice: number | null
  newListings: number | null
  monthsOfSupply: number | null
  closedSales: number | null
  medSoldPrice: number | null
  avgSoldPrice: number | null
  medDaysOnMarket: number | null
  avgDaysOnMarket: number | null
  aboveList: number | null
  belowList: number | null
  avgPricePerSqft: number | null
  mom: {
    closedSales: number | null
    medSoldPrice: number | null
    avgDaysOnMarket: number | null
    medDaysOnMarket: number | null
    avgPricePerSqft: number | null
    aboveList: number | null
  }
  yoy: {
    closedSales: number | null
    medSoldPrice: number | null
    avgDaysOnMarket: number | null
    medDaysOnMarket: number | null
    avgPricePerSqft: number | null
    aboveList: number | null
  }
  trend: TrendPoint[]
  recentSales: RecentSale[]
  generatedAt: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  if (n == null) return '—'
  return n.toLocaleString('en-US', opts)
}

function fmtPrice(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`
  }
  return `$${(n / 1000).toFixed(0)}K`
}

function fmtFull(n: number | null | undefined): string {
  if (n == null) return '—'
  return `$${n.toLocaleString('en-US')}`
}

function delta(
  current: number | null | undefined,
  prior: number | null | undefined
): number | null {
  if (current == null || prior == null || prior === 0) return null
  return Math.round(((current - prior) / prior) * 100 * 10) / 10
}

function DeltaBadge({
  pct,
  label,
  invert = false,
}: {
  pct: number | null
  label?: string
  invert?: boolean
}) {
  if (pct == null) return <span className="text-white/30 text-xs">—</span>
  const positive = invert ? pct < 0 : pct > 0
  const zero = pct === 0
  if (zero) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-white/40">
        <Minus className="w-3 h-3" />
        {label || '0%'}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        positive ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(pct)}%{label ? ` ${label}` : ''}
    </span>
  )
}

function MarketConditionBar({ mos }: { mos: number | null }) {
  if (mos == null) return null
  // < 3 = seller, 3-6 = balanced, > 6 = buyer
  const isSeller = mos < 3
  const isBalanced = mos >= 3 && mos <= 6
  const isBuyer = mos > 6
  const label = isSeller ? "Seller's Market" : isBalanced ? 'Balanced Market' : "Buyer's Market"
  const color = isSeller ? 'text-orange-400' : isBalanced ? 'text-yellow-400' : 'text-green-400'
  const barColor = isSeller ? 'bg-orange-400' : isBalanced ? 'bg-yellow-400' : 'bg-green-400'
  // position: 0 = full seller, 100% = full buyer, midpoint at ~4.5mo
  const pct = Math.min(100, Math.max(0, (mos / 9) * 100))

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/40">Seller's</span>
        <span className={`text-sm font-bold ${color}`}>{label}</span>
        <span className="text-xs text-white/40">Buyer's</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <div
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-center text-xs text-white/40">{mos} months of supply</p>
    </div>
  )
}

// ─── Slide components ─────────────────────────────────────────────────────────

function SlideWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gray-950 ${className}`}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      {children}
    </div>
  )
}

function SlideFooter({ city, date }: { city: string; date: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-8 py-3 flex items-center justify-between border-t border-white/5">
      <Image src="/mk-logo-white.png" alt="MasterKey" width={90} height={24} className="opacity-50" onError={() => {}} />
      <span className="text-[10px] text-white/25 uppercase tracking-widest">
        {city} · {date}
      </span>
      <span className="text-[10px] text-white/25">mathiasregroup.com · DRE 01892427</span>
    </div>
  )
}

// Slide 1 — Cover
function SlideCover({ data }: { data: MarketData }) {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center justify-center flex-1 px-10 text-center py-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1.5 rounded-full mb-6">
          <MapPin className="w-3 h-3" />
          MONTHLY MARKET REPORT
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-3">
          {data.city}
        </h1>
        <p className="text-white/50 text-xl mb-8">{data.reportMonth}</p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
          {[
            { label: 'Homes Sold', value: fmt(data.closedSales), icon: Home },
            { label: 'Median Price', value: fmtPrice(data.medSoldPrice), icon: DollarSign },
            { label: 'Active Listings', value: fmt(data.activeListings), icon: Building2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Icon className="w-4 h-4 text-orange-400 mb-2 mx-auto" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3">
          <Image
            src="/mike-avatar.png"
            alt="Mike Mathias"
            width={40}
            height={40}
            className="rounded-full border border-white/10"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Mike Mathias</p>
            <p className="text-xs text-white/40">Mathias Real Estate Group · 805.262.9707</p>
          </div>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 2 — Market at a Glance (key stats)
function SlideSnapshot({ data }: { data: MarketData }) {
  const momMedian = delta(data.medSoldPrice, data.mom.medSoldPrice)
  const yoyMedian = delta(data.medSoldPrice, data.yoy.medSoldPrice)
  const momDom = delta(data.medDaysOnMarket, data.mom.medDaysOnMarket)
  const yoyClosed = delta(data.closedSales, data.yoy.closedSales)

  const stats = [
    {
      label: 'Median Sale Price',
      value: fmtPrice(data.medSoldPrice),
      full: fmtFull(data.medSoldPrice),
      mom: momMedian,
      yoy: yoyMedian,
      icon: DollarSign,
      accent: 'orange',
    },
    {
      label: 'Homes Sold',
      value: fmt(data.closedSales),
      full: null,
      mom: delta(data.closedSales, data.mom.closedSales),
      yoy: yoyClosed,
      icon: Home,
      accent: 'blue',
    },
    {
      label: 'Median Days on Market',
      value: fmt(data.medDaysOnMarket),
      full: null,
      mom: momDom,
      yoy: delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket),
      icon: Clock,
      accent: 'green',
      invertDelta: true,
    },
    {
      label: 'Avg. Price / Sq Ft',
      value: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—',
      full: null,
      mom: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft),
      yoy: delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft),
      icon: Percent,
      accent: 'purple',
    },
  ]

  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          {data.reportMonth}
        </p>
        <h2 className="text-3xl font-bold text-white mb-8">Market at a Glance</h2>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {stats.map(({ label, value, full, mom, yoy, icon: Icon, invertDelta }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-xs text-white/50 font-medium">{label}</p>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{value}</p>
              {full && <p className="text-xs text-white/30 mb-3">{full}</p>}
              <div className="mt-auto flex items-center gap-4 pt-3 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-white/30 mb-0.5">vs. Last Month</p>
                  <DeltaBadge pct={mom} invert={invertDelta} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-0.5">vs. Last Year</p>
                  <DeltaBadge pct={yoy} invert={invertDelta} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 3 — Inventory & Supply
function SlideInventory({ data }: { data: MarketData }) {
  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Inventory
        </p>
        <h2 className="text-3xl font-bold text-white mb-8">What&apos;s on the Market</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Active Listings',
              value: fmt(data.activeListings),
              sub: 'Homes available today',
              icon: Building2,
            },
            {
              label: 'New This Month',
              value: fmt(data.newListings),
              sub: 'Listed in ' + data.reportMonth,
              icon: Calendar,
            },
            {
              label: 'Months of Supply',
              value: data.monthsOfSupply != null ? String(data.monthsOfSupply) : '—',
              sub: 'Active ÷ last month sold',
              icon: Activity,
            },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-4xl font-bold text-white mb-1">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
              <p className="text-[11px] text-white/25 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-sm font-semibold text-white mb-4">Market Condition</p>
          <MarketConditionBar mos={data.monthsOfSupply} />
          <p className="text-xs text-white/30 mt-4 leading-relaxed">
            Months of supply = active listings ÷ homes sold last month.{' '}
            <span className="text-orange-400">Under 3 months</span> favors sellers.{' '}
            <span className="text-yellow-400">3–6 months</span> is balanced.{' '}
            <span className="text-green-400">Over 6 months</span> favors buyers.
          </p>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 4 — Pricing Breakdown
function SlidePricing({ data }: { data: MarketData }) {
  const spreadPct =
    data.medListPrice && data.medSoldPrice
      ? Math.round(((data.medSoldPrice - data.medListPrice) / data.medListPrice) * 100 * 10) / 10
      : null

  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Pricing
        </p>
        <h2 className="text-3xl font-bold text-white mb-8">How Homes Are Pricing</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              Median List Price
            </p>
            <p className="text-4xl font-bold text-white">{fmtPrice(data.medListPrice)}</p>
            <p className="text-xs text-white/30 mt-1">{fmtFull(data.medListPrice)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              Median Sale Price
            </p>
            <p className="text-4xl font-bold text-orange-400">{fmtPrice(data.medSoldPrice)}</p>
            <p className="text-xs text-white/30 mt-1">{fmtFull(data.medSoldPrice)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
              List-to-Sale
            </p>
            <p className={`text-3xl font-bold ${spreadPct && spreadPct >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
              {spreadPct != null ? `${spreadPct > 0 ? '+' : ''}${spreadPct}%` : '—'}
            </p>
            <p className="text-[11px] text-white/30 mt-1">Sale vs. list</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
              Sold Above List
            </p>
            <p className="text-3xl font-bold text-green-400">
              {data.aboveList != null ? `${data.aboveList}` : '—'}
            </p>
            <p className="text-[11px] text-white/30 mt-1">homes</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
              Sold Below List
            </p>
            <p className="text-3xl font-bold text-orange-400">
              {data.belowList != null ? `${data.belowList}` : '—'}
            </p>
            <p className="text-[11px] text-white/30 mt-1">homes</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/50 mb-1">Avg. Price per Sq Ft</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-white">
              {data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—'}
            </p>
            <DeltaBadge pct={delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft)} label="YoY" />
          </div>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 5 — Days on Market
function SlideDaysOnMarket({ data }: { data: MarketData }) {
  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Speed
        </p>
        <h2 className="text-3xl font-bold text-white mb-8">How Fast Are Homes Selling?</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-6xl font-bold text-white mb-2">{fmt(data.medDaysOnMarket)}</p>
            <p className="text-sm text-white/50">Median Days on Market</p>
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-[10px] text-white/30">vs. Last Mo</p>
                <DeltaBadge
                  pct={delta(data.medDaysOnMarket, data.mom.medDaysOnMarket)}
                  invert={true}
                />
              </div>
              <div>
                <p className="text-[10px] text-white/30">vs. Last Yr</p>
                <DeltaBadge
                  pct={delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket)}
                  invert={true}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
            <Activity className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-6xl font-bold text-white mb-2">{fmt(data.avgDaysOnMarket)}</p>
            <p className="text-sm text-white/50">Average Days on Market</p>
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-[10px] text-white/30">vs. Last Mo</p>
                <DeltaBadge
                  pct={delta(data.avgDaysOnMarket, data.mom.avgDaysOnMarket)}
                  invert={true}
                />
              </div>
              <div>
                <p className="text-[10px] text-white/30">vs. Last Yr</p>
                <DeltaBadge
                  pct={delta(data.avgDaysOnMarket, data.yoy.avgDaysOnMarket)}
                  invert={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/50 mb-3">Context</p>
          <div className="space-y-2 text-sm text-white/60 leading-relaxed">
            {(data.medDaysOnMarket ?? 99) <= 14 && (
              <p>
                <span className="text-orange-400 font-semibold">Hot market.</span> Homes are going
                under contract in 2 weeks or less — buyers need to move fast with strong offers.
              </p>
            )}
            {(data.medDaysOnMarket ?? 0) > 14 && (data.medDaysOnMarket ?? 0) <= 30 && (
              <p>
                <span className="text-yellow-400 font-semibold">Active market.</span> Most
                well-priced homes are selling within a month. Negotiating room is limited.
              </p>
            )}
            {(data.medDaysOnMarket ?? 0) > 30 && (
              <p>
                <span className="text-green-400 font-semibold">Measured pace.</span> Buyers have
                more time to evaluate and negotiate. Sellers benefit from strategic pricing and
                staging.
              </p>
            )}
          </div>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 6 — 12-Month Sales Trend Chart
function SlideTrend({ data }: { data: MarketData }) {
  if (!data.trend || data.trend.length === 0) {
    return (
      <SlideWrapper>
        <div className="flex items-center justify-center flex-1">
          <p className="text-white/40">No trend data available</p>
        </div>
        <SlideFooter city={data.city} date={data.date} />
      </SlideWrapper>
    )
  }

  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Trend
        </p>
        <h2 className="text-3xl font-bold text-white mb-2">12-Month Sales Volume</h2>
        <p className="text-sm text-white/40 mb-6">Homes closed per month · {data.city}</p>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: 12,
                }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(val: number) => [val, 'Homes Sold']}
              />
              <Bar
                dataKey="closedSales"
                fill="rgba(249,115,22,0.7)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex gap-6 text-xs text-white/40">
          <span>Total (12 mo): <strong className="text-white">{fmt(data.trend.reduce((s, t) => s + t.closedSales, 0))}</strong> homes</span>
          <span>Avg/mo: <strong className="text-white">{Math.round(data.trend.reduce((s, t) => s + t.closedSales, 0) / data.trend.length)}</strong></span>
          <span>Peak: <strong className="text-white">{Math.max(...data.trend.map(t => t.closedSales))}</strong> ({data.trend.reduce((best, t) => t.closedSales > best.closedSales ? t : best, data.trend[0])?.label})</span>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 7 — Recent Sales showcase
function SlideRecentSales({ data }: { data: MarketData }) {
  const sales = data.recentSales?.slice(0, 6) || []

  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Recent Transactions
        </p>
        <h2 className="text-3xl font-bold text-white mb-6">
          What Sold in {data.reportMonth}
        </h2>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {sales.map((s, i) => {
            const overUnder = s.overUnder
            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-start"
              >
                {s.image ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img
                      src={s.image}
                      alt={s.address}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-white/20" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{s.address}</p>
                  {s.neighborhood && (
                    <p className="text-[11px] text-white/30 truncate">{s.neighborhood}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-white/40">{s.beds}bd / {s.baths}ba</span>
                    {s.sqft && <span className="text-xs text-white/30">{fmt(s.sqft)} sf</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-bold text-orange-400">{fmtFull(s.soldPrice)}</span>
                    {overUnder != null && (
                      <span
                        className={`text-[11px] font-semibold ${
                          overUnder > 0 ? 'text-green-400' : overUnder < 0 ? 'text-red-400' : 'text-white/30'
                        }`}
                      >
                        {overUnder > 0 ? `+${overUnder}%` : `${overUnder}%`} list
                      </span>
                    )}
                    {s.daysOnMarket != null && (
                      <span className="text-[11px] text-white/30">{s.daysOnMarket}d</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 8 — MoM comparison table
function SlideMoMComparison({ data }: { data: MarketData }) {
  const rows = [
    {
      label: 'Homes Sold',
      current: fmt(data.closedSales),
      prev: fmt(data.mom.closedSales),
      delta: delta(data.closedSales, data.mom.closedSales),
    },
    {
      label: 'Median Sale Price',
      current: fmtPrice(data.medSoldPrice),
      prev: fmtPrice(data.mom.medSoldPrice),
      delta: delta(data.medSoldPrice, data.mom.medSoldPrice),
    },
    {
      label: 'Median Days on Market',
      current: fmt(data.medDaysOnMarket),
      prev: fmt(data.mom.medDaysOnMarket),
      delta: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket),
      invert: true,
    },
    {
      label: 'Sold Above List Price',
      current: fmt(data.aboveList),
      prev: fmt(data.mom.aboveList),
      delta: delta(data.aboveList, data.mom.aboveList),
    },
    {
      label: 'Avg. Price / Sq Ft',
      current: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—',
      prev: data.mom.avgPricePerSqft ? `$${fmt(data.mom.avgPricePerSqft)}` : '—',
      delta: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft),
    },
  ]

  const prevMonthDate = new Date(data.date + '-01')
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
  const prevMonthLabel = prevMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <SlideWrapper>
      <div className="flex flex-col flex-1 px-10 py-10 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
          Month over Month
        </p>
        <h2 className="text-3xl font-bold text-white mb-8">
          {data.reportMonth} vs. {prevMonthLabel}
        </h2>

        <div className="flex-1">
          <div className="grid grid-cols-4 text-[10px] font-semibold uppercase tracking-widest text-white/30 px-4 mb-2">
            <span className="col-span-2">Metric</span>
            <span className="text-right">{prevMonthLabel.split(' ')[0]}</span>
            <span className="text-right">{data.reportMonth.split(' ')[0]}</span>
          </div>
          <div className="space-y-2">
            {rows.map(({ label, current, prev, delta: d, invert }) => (
              <div
                key={label}
                className="grid grid-cols-4 items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <span className="col-span-2 text-sm text-white/70">{label}</span>
                <span className="text-sm text-white/40 text-right">{prev}</span>
                <div className="text-right flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-white">{current}</span>
                  <DeltaBadge pct={d} invert={invert} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-white/40 leading-relaxed">
            Data sourced from CRMLS via Repliers MLS. Stats reflect residential single-family and
            condo transactions within {data.city} city limits.
          </p>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// Slide 9 — CTA / Agent
function SlideCTA({ data }: { data: MarketData }) {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center justify-center flex-1 px-10 py-16 text-center">
        <div className="mb-8">
          <Image
            src="/mike-avatar.png"
            alt="Mike Mathias"
            width={80}
            height={80}
            className="rounded-full border-2 border-orange-400/30 mx-auto mb-4"
          />
          <p className="text-lg font-bold text-white">Mike Mathias</p>
          <p className="text-sm text-white/40">Mathias Real Estate Group</p>
          <p className="text-sm text-orange-400 mt-1">DRE #01892427</p>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 max-w-sm">
          Thinking About Making a Move?
        </h2>
        <p className="text-white/50 text-base mb-8 max-w-xs leading-relaxed">
          Whether you&apos;re buying, selling, or just curious about your home&apos;s value — let&apos;s talk numbers.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href="tel:8052629707"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            Call 805.262.9707
          </a>
          <a
            href="https://mathiasregroup.com"
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            mathiasregroup.com
          </a>
        </div>

        <p className="text-xs text-white/20 mt-8">
          {data.reportMonth} · {data.city} Market Report
        </p>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </SlideWrapper>
  )
}

// ─── Slide deck navigation ────────────────────────────────────────────────────

const SLIDE_LABELS = [
  'Cover',
  'Snapshot',
  'Inventory',
  'Pricing',
  'Speed',
  'Trend',
  'Recent Sales',
  'Month/Month',
  'Contact',
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MarketUpdatePage() {
  const params = useParams<{ city: string; date: string }>()
  const citySlug = params.city ?? 'thousand-oaks'
  const date = params.date ?? new Date().toISOString().slice(0, 7)

  // Convert slug to display name
  const cityName = citySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const [data, setData] = useState<MarketData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/market-updates?city=${encodeURIComponent(cityName)}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [cityName, date])

  function prevSlide() {
    setSlide((s) => Math.max(0, s - 1))
  }
  function nextSlide() {
    setSlide((s) => Math.min(SLIDE_LABELS.length - 1, s + 1))
  }

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          deckRef.current?.requestFullscreen()
          setIsFullscreen(true)
        } else {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-orange-400/20 border-t-orange-400 animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading market data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-orange-400 font-semibold mb-2">Failed to load market data</p>
          <p className="text-white/40 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const slides = [
    <SlideCover key="cover" data={data} />,
    <SlideSnapshot key="snapshot" data={data} />,
    <SlideInventory key="inventory" data={data} />,
    <SlidePricing key="pricing" data={data} />,
    <SlideDaysOnMarket key="dom" data={data} />,
    <SlideTrend key="trend" data={data} />,
    <SlideRecentSales key="recentsales" data={data} />,
    <SlideMoMComparison key="mom" data={data} />,
    <SlideCTA key="cta" data={data} />,
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-white/5">
        <div className="flex items-center gap-3">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-white/60 font-medium">{data.city} · {data.reportMonth}</span>
        </div>
        <div className="flex items-center gap-1">
          {SLIDE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              title={label}
              className={`w-2 h-2 rounded-full transition-all ${
                i === slide ? 'bg-orange-400 w-4' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-white/30">
          {slide + 1} / {SLIDE_LABELS.length}
        </span>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <div
          ref={deckRef}
          className="relative w-full max-w-4xl bg-gray-950 rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '16/9' }}
        >
          {slides[slide]}

          {/* Nav arrows */}
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-black/60 disabled:opacity-20 transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={slide === slides.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-black/60 disabled:opacity-20 transition-all z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-950 border-t border-white/5">
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <button
            onClick={nextSlide}
            disabled={slide === slides.length - 1}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-xs text-white/25 hidden sm:block">
          Press ← → to navigate · F for fullscreen
        </span>

        <span className="text-xs font-medium text-white/40">{SLIDE_LABELS[slide]}</span>
      </div>
    </div>
  )
}
