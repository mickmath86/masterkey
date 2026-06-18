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
  Clock,
  Activity,
  DollarSign,
  Calendar,
  MapPin,
  Building2,
  Percent,
  Phone,
  Globe,
  TrendingUp,
} from 'lucide-react'
import {
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

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString('en-US')
}

function fmtPrice(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`
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

/** Kickbord-style delta badge — uses olive/emerald/red */
function DeltaBadge({
  pct,
  invert = false,
  size = 'sm',
}: {
  pct: number | null
  invert?: boolean
  size?: 'xs' | 'sm'
}) {
  if (pct == null) return <span className="text-olive-400 text-xs">—</span>
  const positive = invert ? pct < 0 : pct > 0
  const zero = pct === 0
  const cls = size === 'xs' ? 'text-[10px]' : 'text-xs'
  if (zero)
    return (
      <span className={`inline-flex items-center gap-0.5 ${cls} text-olive-500`}>
        <Minus className="w-3 h-3" />0%
      </span>
    )
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${cls} font-semibold ${
        positive ? 'text-emerald-700' : 'text-red-600'
      }`}
    >
      {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(pct)}%
    </span>
  )
}

/** Kickbord eyebrow — small olive-700 uppercase label */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-olive-600 mb-1">
      {children}
    </p>
  )
}

/** Orange-tinted announcement-style badge pill */
function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-olive-950/10 bg-olive-950/5 px-3 py-1 text-xs font-semibold text-olive-700">
      {children}
    </span>
  )
}

/** Subtle top accent rule — replaces orange gradient stripe */
function AccentRule() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-olive-300 to-transparent" />
}

/** Market condition sliding dot meter */
function MarketConditionMeter({ mos }: { mos: number | null }) {
  if (mos == null) return null
  const isSeller = mos < 3
  const isBalanced = mos >= 3 && mos <= 6
  const label = isSeller ? "Seller's Market" : isBalanced ? 'Balanced Market' : "Buyer's Market"
  const textColor = isSeller ? 'text-amber-700' : isBalanced ? 'text-olive-700' : 'text-emerald-700'
  const dotColor = isSeller ? 'bg-amber-500' : isBalanced ? 'bg-olive-600' : 'bg-emerald-600'
  const pct = Math.min(100, Math.max(0, (mos / 9) * 100))

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-olive-500">Seller&apos;s</span>
        <span className={`text-sm font-semibold font-display italic ${textColor}`}>{label}</span>
        <span className="text-[10px] text-olive-500">Buyer&apos;s</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-olive-100">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-olive-300 to-emerald-400 opacity-40" />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${dotColor}`}
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <p className="text-center text-[10px] text-olive-500">{mos} months of supply</p>
    </div>
  )
}

/** Full-bleed image panel for split slides */
function ImagePanel({
  src,
  alt,
  gradientDir = 'left',
}: {
  src: string
  alt: string
  gradientDir?: 'left' | 'bottom' | 'top'
}) {
  const gradMap = {
    left: 'bg-gradient-to-r from-white/50 via-transparent to-transparent',
    bottom: 'bg-gradient-to-t from-olive-950/70 via-olive-950/20 to-transparent',
    top: 'bg-gradient-to-b from-olive-950/30 via-transparent to-transparent',
  }
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />
      <div className={`absolute inset-0 ${gradMap[gradientDir]}`} />
    </div>
  )
}

/** Stat card — Kickbord style: olive-50 bg, serif value */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
  mom,
  yoy,
  invertDelta,
}: {
  label: string
  value: string
  sub?: string
  icon?: React.ComponentType<{ className?: string }>
  accent?: boolean
  mom?: number | null
  yoy?: number | null
  invertDelta?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col ${
        accent
          ? 'bg-olive-950 border-olive-900 text-white'
          : 'bg-olive-50 border-olive-100'
      }`}
    >
      {Icon && (
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
            accent ? 'bg-white/10' : 'bg-white border border-olive-100'
          }`}
        >
          <Icon className={`w-4 h-4 ${accent ? 'text-olive-300' : 'text-olive-600'}`} />
        </div>
      )}
      <p
        className={`font-display text-3xl leading-tight mb-0.5 ${
          accent ? 'text-white' : 'text-olive-950'
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className={`text-xs mb-auto ${accent ? 'text-olive-300' : 'text-olive-500'}`}>{sub}</p>
      )}
      <p
        className={`text-[10px] font-semibold uppercase tracking-wider mt-3 mb-1.5 ${
          accent ? 'text-olive-400' : 'text-olive-500'
        }`}
      >
        {label}
      </p>
      {(mom !== undefined || yoy !== undefined) && (
        <div
          className={`flex items-center gap-4 pt-2 border-t ${
            accent ? 'border-white/10' : 'border-olive-100'
          }`}
        >
          {mom !== undefined && (
            <div>
              <p className={`text-[9px] mb-0.5 ${accent ? 'text-olive-500' : 'text-olive-400'}`}>MoM</p>
              <DeltaBadge pct={mom} invert={invertDelta} size="xs" />
            </div>
          )}
          {yoy !== undefined && (
            <div>
              <p className={`text-[9px] mb-0.5 ${accent ? 'text-olive-500' : 'text-olive-400'}`}>YoY</p>
              <DeltaBadge pct={yoy} invert={invertDelta} size="xs" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Shared footer strip — every slide */
function SlideFooter({ city, date }: { city: string; date: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-9 flex items-center justify-between px-7 border-t border-olive-100 bg-white">
      <span className="font-display italic text-[11px] text-olive-600">Mathias Real Estate Group</span>
      <span className="text-[9px] text-olive-400 uppercase tracking-widest hidden sm:block">
        {city} · {date}
      </span>
      <span className="text-[9px] text-olive-400">mathiasregroup.com · DRE 01892427</span>
    </div>
  )
}

// ─── Slide 1 — Cover ─────────────────────────────────────────────────────────
// Wallpaper green left panel + home exterior right

function SlideCover({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full flex bg-white">
      {/* Left — wallpaper green panel */}
      <div
        className="flex flex-col justify-between w-[48%] px-9 py-9 pb-13 text-white"
        style={{ background: 'linear-gradient(160deg, #9ca88f 0%, #596352 100%)' }}
      >
        {/* Brand */}
        <div>
          <p className="font-display italic text-white/70 text-sm tracking-wide mb-1">
            Mathias Real Estate Group
          </p>
          <div className="h-px bg-white/20 mb-6" />
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 mb-3">
            Monthly Market Report
          </p>
          <h1 className="font-display text-5xl leading-none text-white mb-2">{data.city}</h1>
          <p className="font-display italic text-white/60 text-xl">{data.reportMonth}</p>

          {/* 3 hero stats */}
          <div className="mt-7 grid grid-cols-3 gap-2.5">
            {[
              { label: 'Homes Sold', value: fmt(data.closedSales) },
              { label: 'Median Price', value: fmtPrice(data.medSoldPrice) },
              { label: 'Active', value: fmt(data.activeListings) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white/10 border border-white/15 p-3 text-center">
                <p className="font-display text-2xl text-white leading-none">{value}</p>
                <p className="text-[9px] text-white/50 mt-1 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent */}
        <div className="flex items-center gap-3">
          <Image
            src="/mike-avatar.png"
            alt="Mike Mathias"
            width={40}
            height={40}
            className="rounded-full border border-white/25 object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-white">Mike Mathias</p>
            <p className="text-[11px] text-white/50">805.262.9707</p>
          </div>
        </div>
      </div>

      {/* Right — home exterior */}
      <div className="flex-1 relative overflow-hidden">
        <ImagePanel src="/modern-home-exterior.png" alt="Thousand Oaks home" gradientDir="left" />
        {/* Month tag */}
        <div className="absolute bottom-12 right-5 bg-white/95 border border-olive-100 rounded-2xl px-4 py-3 text-right shadow-md">
          <p className="text-[9px] uppercase tracking-[0.12em] text-olive-500 font-semibold">Report</p>
          <p className="font-display text-base text-olive-950 leading-tight">{data.reportMonth}</p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 2 — Market Snapshot ────────────────────────────────────────────────

function SlideSnapshot({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full flex flex-col bg-mist-100 pb-9">
      <AccentRule />
      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>{data.reportMonth} · {data.city}</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-6">Market at a Glance</h2>

        <div className="grid grid-cols-4 gap-4 flex-1">
          <StatCard
            label="Median Sale Price"
            value={fmtPrice(data.medSoldPrice)}
            sub={fmtFull(data.medSoldPrice)}
            icon={DollarSign}
            accent
            mom={delta(data.medSoldPrice, data.mom.medSoldPrice)}
            yoy={delta(data.medSoldPrice, data.yoy.medSoldPrice)}
          />
          <StatCard
            label="Homes Sold"
            value={fmt(data.closedSales)}
            sub={data.reportMonth}
            icon={Home}
            mom={delta(data.closedSales, data.mom.closedSales)}
            yoy={delta(data.closedSales, data.yoy.closedSales)}
          />
          <StatCard
            label="Median Days on Market"
            value={fmt(data.medDaysOnMarket)}
            sub="days"
            icon={Clock}
            mom={delta(data.medDaysOnMarket, data.mom.medDaysOnMarket)}
            yoy={delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket)}
            invertDelta
          />
          <StatCard
            label="Avg. Price / Sq Ft"
            value={data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—'}
            sub="per sq ft"
            icon={Percent}
            mom={delta(data.avgPricePerSqft, data.mom.avgPricePerSqft)}
            yoy={delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft)}
          />
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 3 — Inventory (split: stats + living room) ─────────────────────────

function SlideInventory({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full flex bg-white pb-9">
      {/* Left */}
      <div className="flex flex-col w-[56%] px-10 py-8">
        <Eyebrow>Inventory · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-5">What&apos;s on the Market</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Active Listings', value: fmt(data.activeListings), sub: 'available today', icon: Building2 },
            { label: 'New This Month', value: fmt(data.newListings), sub: 'recently listed', icon: Calendar },
            { label: 'Months of Supply', value: data.monthsOfSupply != null ? String(data.monthsOfSupply) : '—', sub: 'active ÷ sold', icon: Activity },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-olive-100 bg-olive-50 p-4">
              <Icon className="w-4 h-4 text-olive-600 mb-2" />
              <p className="font-display text-3xl text-olive-950 leading-none">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-olive-500 mt-1">{label}</p>
              <p className="text-[10px] text-olive-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-olive-100 bg-olive-50 p-5 flex-1">
          <p className="text-xs font-semibold text-olive-700 mb-4">Market Condition</p>
          <MarketConditionMeter mos={data.monthsOfSupply} />
          <p className="text-xs text-olive-500 mt-4 leading-relaxed">
            Months of supply = active listings ÷ homes sold last month.{' '}
            <span className="text-amber-700 font-medium">Under 3</span> favors sellers.{' '}
            <span className="text-olive-600 font-medium">3–6</span> is balanced.{' '}
            <span className="text-emerald-700 font-medium">Over 6</span> favors buyers.
          </p>
        </div>
      </div>

      {/* Right — bright living room */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl my-4 mr-4">
        <ImagePanel src="/bright-living-room-with-hardwood-floors.png" alt="Bright living room" gradientDir="left" />
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-xl px-4 py-3 border border-olive-100 shadow-sm">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-olive-500">Currently Active</p>
          <p className="font-display text-xl text-olive-950">{fmt(data.activeListings)} homes available</p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 4 — Pricing (image left, stats right) ──────────────────────────────

function SlidePricing({ data }: { data: MarketData }) {
  const spreadPct =
    data.medListPrice && data.medSoldPrice
      ? Math.round(((data.medSoldPrice - data.medListPrice) / data.medListPrice) * 100 * 10) / 10
      : null

  return (
    <div className="relative w-full h-full flex bg-white pb-9">
      {/* Left — kitchen image */}
      <div className="w-[38%] relative overflow-hidden rounded-r-3xl my-4 ml-4">
        <ImagePanel src="/updated-kitchen-with-granite-countertops.png" alt="Upgraded kitchen" gradientDir="bottom" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60 mb-1">Median Sale Price</p>
          <p className="font-display text-3xl text-white leading-none">{fmtPrice(data.medSoldPrice)}</p>
          <p className="text-xs text-white/50">{fmtFull(data.medSoldPrice)}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col px-8 py-8">
        <Eyebrow>Pricing · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-5">How Homes Are Pricing</h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-2xl border border-olive-100 bg-olive-50 p-5">
            <p className="text-[10px] uppercase tracking-widest text-olive-500 mb-2">Median List</p>
            <p className="font-display text-3xl text-olive-950">{fmtPrice(data.medListPrice)}</p>
            <p className="text-xs text-olive-400 mt-1">{fmtFull(data.medListPrice)}</p>
          </div>
          <div className="rounded-2xl border border-olive-200 bg-olive-950 p-5">
            <p className="text-[10px] uppercase tracking-widest text-olive-400 mb-2">Median Sale</p>
            <p className="font-display text-3xl text-white">{fmtPrice(data.medSoldPrice)}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-olive-400">{fmtFull(data.medSoldPrice)}</p>
              <DeltaBadge pct={delta(data.medSoldPrice, data.yoy.medSoldPrice)} size="xs" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="rounded-2xl border border-olive-100 bg-olive-50 p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-olive-500">List-to-Sale</p>
            <p className={`font-display text-2xl ${spreadPct != null && spreadPct >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {spreadPct != null ? `${spreadPct > 0 ? '+' : ''}${spreadPct}%` : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-olive-100 bg-olive-50 p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-olive-500">Above List</p>
            <p className="font-display text-2xl text-emerald-700">{data.aboveList ?? '—'}</p>
            <p className="text-[10px] text-olive-400">homes</p>
          </div>
          <div className="rounded-2xl border border-olive-100 bg-olive-50 p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-olive-500">Below List</p>
            <p className="font-display text-2xl text-amber-700">{data.belowList ?? '—'}</p>
            <p className="text-[10px] text-olive-400">homes</p>
          </div>
        </div>

        <div className="rounded-2xl border border-olive-100 bg-olive-50 px-5 py-3 mt-3 flex items-center justify-between">
          <p className="text-xs font-medium text-olive-700">Avg. Price per Sq Ft</p>
          <div className="flex items-center gap-2">
            <p className="font-display text-xl text-olive-950">{data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—'}</p>
            <DeltaBadge pct={delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft)} size="xs" />
          </div>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 5 — Days on Market ─────────────────────────────────────────────────

function SlideDaysOnMarket({ data }: { data: MarketData }) {
  const badge = (() => {
    const dom = data.medDaysOnMarket
    if (dom == null) return null
    if (dom <= 14) return { text: 'Hot market — homes going under contract in under 2 weeks.', cls: 'bg-amber-50 border-amber-100 text-amber-800' }
    if (dom <= 30) return { text: 'Active market — most well-priced homes sell within a month.', cls: 'bg-olive-50 border-olive-100 text-olive-800' }
    return { text: 'Measured pace — buyers have more time to evaluate and negotiate.', cls: 'bg-emerald-50 border-emerald-100 text-emerald-800' }
  })()

  return (
    <div className="relative w-full h-full flex bg-white pb-9">
      {/* Left */}
      <div className="flex flex-col w-[56%] px-10 py-8">
        <Eyebrow>Speed · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-6">How Fast Are Homes Selling?</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: 'Median Days on Market', value: fmt(data.medDaysOnMarket), icon: Clock, mom: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), yoy: delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket), accent: true },
            { label: 'Average Days on Market', value: fmt(data.avgDaysOnMarket), icon: Activity, mom: delta(data.avgDaysOnMarket, data.mom.avgDaysOnMarket), yoy: delta(data.avgDaysOnMarket, data.yoy.avgDaysOnMarket), accent: false },
          ].map(({ label, value, icon: Icon, mom, yoy, accent }) => (
            <div key={label} className={`rounded-2xl border p-6 text-center ${accent ? 'bg-olive-950 border-olive-900' : 'bg-olive-50 border-olive-100'}`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${accent ? 'text-olive-400' : 'text-olive-600'}`} />
              <p className={`font-display text-5xl leading-none mb-1 ${accent ? 'text-white' : 'text-olive-950'}`}>{value}</p>
              <p className={`text-[11px] font-medium ${accent ? 'text-olive-400' : 'text-olive-500'}`}>{label}</p>
              <div className={`flex justify-center gap-4 mt-3 pt-3 border-t ${accent ? 'border-white/10' : 'border-olive-100'}`}>
                <div><p className={`text-[9px] mb-0.5 ${accent ? 'text-olive-500' : 'text-olive-400'}`}>MoM</p><DeltaBadge pct={mom} invert size="xs" /></div>
                <div><p className={`text-[9px] mb-0.5 ${accent ? 'text-olive-500' : 'text-olive-400'}`}>YoY</p><DeltaBadge pct={yoy} invert size="xs" /></div>
              </div>
            </div>
          ))}
        </div>

        {badge && (
          <div className={`rounded-2xl border px-5 py-4 ${badge.cls}`}>
            <p className="text-sm font-medium">{badge.text}</p>
          </div>
        )}
      </div>

      {/* Right — master bedroom */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl my-4 mr-4">
        <ImagePanel src="/large-window-master-bedroom.png" alt="Master bedroom" gradientDir="bottom" />
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 6 — 12-Month Trend ─────────────────────────────────────────────────

function SlideTrend({ data }: { data: MarketData }) {
  if (!data.trend || data.trend.length === 0) {
    return (
      <div className="relative w-full h-full bg-mist-100 flex items-center justify-center pb-9">
        <p className="text-olive-400">No trend data available</p>
        <SlideFooter city={data.city} date={data.date} />
      </div>
    )
  }

  const total = data.trend.reduce((s, t) => s + t.closedSales, 0)
  const avg = Math.round(total / data.trend.length)
  const peak = data.trend.reduce((b, t) => (t.closedSales > b.closedSales ? t : b), data.trend[0])

  return (
    <div className="relative w-full h-full flex flex-col bg-mist-100 pb-9">
      <AccentRule />
      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>Trend · 12 Months</Eyebrow>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-4xl text-olive-950 leading-tight">Sales Volume</h2>
          <div className="flex gap-6 text-right">
            {[
              { label: '12-Mo Total', value: fmt(total) },
              { label: 'Monthly Avg', value: String(avg) },
              { label: 'Peak', value: peak.label },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-widest text-olive-400">{label}</p>
                <p className="font-display text-xl text-olive-950">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,96,78,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#7e8068', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7e8068', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid rgba(24,25,16,0.08)',
                  borderRadius: '12px',
                  color: '#181910',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
                cursor={{ fill: 'rgba(24,25,16,0.03)' }}
                formatter={(val: number) => [val, 'Homes Sold']}
              />
              <Bar dataKey="closedSales" fill="#596352" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 7 — Recent Sales ────────────────────────────────────────────────────

function SlideRecentSales({ data }: { data: MarketData }) {
  const sales = data.recentSales?.slice(0, 6) || []

  return (
    <div className="relative w-full h-full flex flex-col bg-mist-100 pb-9">
      <AccentRule />
      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>Recent Transactions · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-5">What Sold This Month</h2>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {sales.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-olive-100 overflow-hidden flex">
              <div className="w-[72px] flex-shrink-0 relative bg-olive-50">
                {s.image ? (
                  <img src={s.image} alt={s.address} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-olive-200" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 min-w-0">
                <p className="text-sm font-semibold text-olive-950 truncate leading-tight">{s.address}</p>
                {s.neighborhood && <p className="text-[10px] text-olive-400 truncate">{s.neighborhood}</p>}
                <p className="text-[11px] text-olive-500 mt-1">{s.beds}bd · {s.baths}ba{s.sqft ? ` · ${fmt(s.sqft)} sf` : ''}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-display text-sm text-olive-950">{fmtFull(s.soldPrice)}</span>
                  {s.overUnder != null && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.overUnder > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : s.overUnder < 0 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-olive-400'}`}>
                      {s.overUnder > 0 ? `+${s.overUnder}%` : `${s.overUnder}%`}
                    </span>
                  )}
                  {s.daysOnMarket != null && <span className="text-[10px] text-olive-400 ml-auto">{s.daysOnMarket}d</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 8 — Month/Month (table + sold home image) ─────────────────────────

function SlideMoMComparison({ data }: { data: MarketData }) {
  const prevDate = new Date(data.date + '-01')
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prevLabel = prevDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const rows = [
    { label: 'Homes Sold', current: fmt(data.closedSales), prev: fmt(data.mom.closedSales), d: delta(data.closedSales, data.mom.closedSales) },
    { label: 'Median Sale Price', current: fmtPrice(data.medSoldPrice), prev: fmtPrice(data.mom.medSoldPrice), d: delta(data.medSoldPrice, data.mom.medSoldPrice) },
    { label: 'Median Days on Market', current: fmt(data.medDaysOnMarket), prev: fmt(data.mom.medDaysOnMarket), d: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), invert: true },
    { label: 'Sold Above List', current: fmt(data.aboveList), prev: fmt(data.mom.aboveList), d: delta(data.aboveList, data.mom.aboveList) },
    { label: 'Avg. $/Sq Ft', current: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—', prev: data.mom.avgPricePerSqft ? `$${fmt(data.mom.avgPricePerSqft)}` : '—', d: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft) },
  ]

  return (
    <div className="relative w-full h-full flex bg-white pb-9">
      {/* Left */}
      <div className="flex flex-col w-[57%] px-10 py-8">
        <Eyebrow>Month over Month</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 mb-6">{data.reportMonth} vs. {prevLabel}</h2>

        <div className="flex-1">
          <div className="grid grid-cols-4 text-[9px] font-semibold uppercase tracking-widest text-olive-400 px-4 mb-2">
            <span className="col-span-2">Metric</span>
            <span className="text-right">{prevLabel.split(' ')[0]}</span>
            <span className="text-right">{data.reportMonth.split(' ')[0]}</span>
          </div>
          <div className="space-y-2">
            {rows.map(({ label, current, prev, d, invert }) => (
              <div key={label} className="grid grid-cols-4 items-center rounded-xl border border-olive-100 bg-olive-50 px-4 py-3">
                <span className="col-span-2 text-sm text-olive-700">{label}</span>
                <span className="text-sm text-olive-400 text-right">{prev}</span>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-olive-950">{current}</span>
                  <DeltaBadge pct={d} invert={invert} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-olive-100 bg-olive-50 px-4 py-3">
          <p className="text-[11px] text-olive-500 leading-relaxed">
            Data sourced from CRMLS via Repliers MLS. Stats reflect residential transactions within {data.city} city limits.
          </p>
        </div>
      </div>

      {/* Right — sold home */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl my-4 mr-4">
        <Image src="/images/mk-sold.jpg" alt="Sold home" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-olive-950/80 via-olive-950/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/50 mb-1">Closed This Month</p>
          <p className="font-display text-2xl text-white leading-tight">{data.closedSales} homes sold<br />in {data.reportMonth}</p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 9 — CTA ────────────────────────────────────────────────────────────

function SlideCTA({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full flex pb-9">
      {/* Left — wallpaper green with exterior image overlay */}
      <div className="w-[44%] relative overflow-hidden rounded-r-3xl my-4 ml-4">
        <Image src="/modern-home-exterior.png" alt="Home exterior" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-olive-950/90 via-olive-950/40 to-olive-950/10" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mb-2">{data.reportMonth} · {data.city}</p>
          <p className="font-display italic text-2xl text-white leading-snug">Thinking About<br />Making a Move?</p>
        </div>
      </div>

      {/* Right — CTA */}
      <div className="flex-1 bg-white flex flex-col justify-center px-10">
        <Eyebrow>Let&apos;s Connect</Eyebrow>
        <h2 className="font-display text-4xl text-olive-950 leading-tight mb-3 mt-1">
          Expert guidance<br />on your next step.
        </h2>
        <p className="text-sm text-olive-600 leading-relaxed mb-7 max-w-xs">
          Whether you&apos;re buying, selling, or curious about your home&apos;s value — let&apos;s talk numbers. No obligation.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/mike-avatar.png"
            alt="Mike Mathias"
            width={52}
            height={52}
            className="rounded-full border border-olive-100 object-cover"
          />
          <div>
            <p className="font-semibold text-olive-950">Mike Mathias</p>
            <p className="text-xs text-olive-500">Mathias Real Estate Group · DRE 01892427</p>
          </div>
        </div>

        <div className="space-y-3 max-w-xs">
          <a
            href="tel:8052629707"
            className="flex items-center gap-3 rounded-full bg-olive-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-olive-800 transition-colors"
          >
            <Phone className="w-4 h-4" /> 805.262.9707
          </a>
          <a
            href="https://mathiasregroup.com"
            className="flex items-center gap-3 rounded-full border border-olive-950/10 bg-olive-950/5 px-5 py-2.5 text-sm font-medium text-olive-950 hover:bg-olive-950/10 transition-colors"
          >
            <Globe className="w-4 h-4 text-olive-600" /> mathiasregroup.com
          </a>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide labels ─────────────────────────────────────────────────────────────

const SLIDE_LABELS = ['Cover', 'Snapshot', 'Inventory', 'Pricing', 'Speed', 'Trend', 'Recent Sales', 'Month/Month', 'Contact']

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MarketUpdatePage() {
  const params = useParams<{ city: string; date: string }>()
  const citySlug = params.city ?? 'thousand-oaks'
  const date = params.date ?? new Date().toISOString().slice(0, 7)
  const cityName = citySlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const [data, setData] = useState<MarketData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/market-updates?city=${encodeURIComponent(cityName)}&date=${date}`)
      .then((r) => r.json())
      .then((d) => { if (d.error) throw new Error(d.error); setData(d) })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [cityName, date])

  function prev() { setSlide((s) => Math.max(0, s - 1)) }
  function next() { setSlide((s) => Math.min(SLIDE_LABELS.length - 1, s + 1)) }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) deckRef.current?.requestFullscreen()
        else document.exitFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-mist-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-olive-200 border-t-olive-600 animate-spin mx-auto" />
          <p className="text-olive-500 text-sm font-display italic">Loading market data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-mist-100 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-display text-xl text-olive-950 mb-2">Failed to load market data</p>
          <p className="text-olive-500 text-sm">{error}</p>
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
    <div className="min-h-screen bg-mist-100 flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-olive-100">
        <div className="flex items-center gap-2.5">
          <span className="font-display italic text-sm text-olive-700">Mathias Real Estate Group</span>
          <span className="text-olive-200">·</span>
          <span className="text-xs text-olive-500">{data.city} · {data.reportMonth}</span>
        </div>
        {/* Pill dots */}
        <div className="flex items-center gap-1.5">
          {SLIDE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              title={label}
              className={`rounded-full transition-all duration-200 ${
                i === slide ? 'bg-olive-950 w-5 h-2' : 'bg-olive-200 hover:bg-olive-400 w-2 h-2'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-olive-400">{slide + 1} / {SLIDE_LABELS.length}</span>
      </div>

      {/* Deck */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={deckRef}
          className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-lg border border-olive-100"
          style={{ aspectRatio: '16/9' }}
        >
          {slides[slide]}

          <button onClick={prev} disabled={slide === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-olive-100 flex items-center justify-center text-olive-400 hover:text-olive-950 disabled:opacity-20 shadow-sm transition-all z-10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} disabled={slide === slides.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-olive-100 flex items-center justify-center text-olive-400 hover:text-olive-950 disabled:opacity-20 shadow-sm transition-all z-10">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-t border-olive-100">
        <div className="flex gap-2">
          <button onClick={prev} disabled={slide === 0}
            className="flex items-center gap-1.5 text-xs text-olive-500 hover:text-olive-950 disabled:opacity-30 transition-colors px-3 py-1.5 rounded-full bg-olive-950/5 hover:bg-olive-950/10 border border-olive-950/10">
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <button onClick={next} disabled={slide === slides.length - 1}
            className="flex items-center gap-1.5 text-xs text-olive-500 hover:text-olive-950 disabled:opacity-30 transition-colors px-3 py-1.5 rounded-full bg-olive-950/5 hover:bg-olive-950/10 border border-olive-950/10">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs text-olive-300 hidden sm:block">← → navigate · F fullscreen</span>
        <span className="text-xs font-medium text-olive-500">{SLIDE_LABELS[slide]}</span>
      </div>
    </div>
  )
}
