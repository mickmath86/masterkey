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

function delta(current: number | null | undefined, prior: number | null | undefined): number | null {
  if (current == null || prior == null || prior === 0) return null
  return Math.round(((current - prior) / prior) * 100 * 10) / 10
}

function DeltaBadge({ pct, invert = false, size = 'sm' }: { pct: number | null; invert?: boolean; size?: 'xs' | 'sm' }) {
  if (pct == null) return <span className="text-gray-300 text-xs">—</span>
  const positive = invert ? pct < 0 : pct > 0
  const zero = pct === 0
  const base = size === 'xs' ? 'text-[10px]' : 'text-xs'
  if (zero) return <span className={`inline-flex items-center gap-0.5 ${base} text-gray-400`}><Minus className="w-3 h-3" />0%</span>
  return (
    <span className={`inline-flex items-center gap-0.5 ${base} font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(pct)}%
    </span>
  )
}

function MarketConditionMeter({ mos }: { mos: number | null }) {
  if (mos == null) return null
  const isSeller = mos < 3
  const isBalanced = mos >= 3 && mos <= 6
  const label = isSeller ? "Seller's Market" : isBalanced ? 'Balanced Market' : "Buyer's Market"
  const pct = Math.min(100, Math.max(0, (mos / 9) * 100))
  const dotColor = isSeller ? 'bg-orange-500' : isBalanced ? 'bg-amber-400' : 'bg-emerald-500'
  const textColor = isSeller ? 'text-orange-600' : isBalanced ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Seller's</span>
        <span className={`text-sm font-bold ${textColor}`}>{label}</span>
        <span className="text-xs text-gray-400">Buyer's</span>
      </div>
      <div className="relative h-2 rounded-full bg-gray-100">
        <div className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400`} style={{ width: '100%', opacity: 0.25 }} />
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${dotColor}`} style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
      <p className="text-center text-xs text-gray-400">{mos} months of supply</p>
    </div>
  )
}

// ─── Shared layout pieces ─────────────────────────────────────────────────────

function SlideFooter({ city, date }: { city: string; date: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between px-8 bg-white border-t border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/masterkey-black-logo.png"
          alt="MasterKey"
          width={88}
          height={22}
          className="opacity-60 object-contain"
          onError={() => {}}
        />
      </div>
      <span className="text-[10px] text-gray-300 uppercase tracking-widest hidden sm:block">
        {city} · {date}
      </span>
      <span className="text-[10px] text-gray-300">mathiasregroup.com · DRE 01892427</span>
    </div>
  )
}

/** Full-bleed image pane — right half of a split slide */
function ImagePane({ src, alt, overlay = true }: { src: string; alt: string; overlay?: boolean }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 900px) 100vw, 50vw" />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10" />
      )}
    </div>
  )
}

/** Eyebrow label above a section title */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-500 mb-1">
      {children}
    </p>
  )
}

/** Orange accent pill badge */
function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
      {children}
    </span>
  )
}

// ─── Slide 1 — Cover (split: left = content, right = hero home image) ────────

function SlideCover({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full bg-white flex">
      {/* Left panel */}
      <div className="flex flex-col justify-between w-[52%] px-10 py-10 pb-14">
        {/* Top brand strip */}
        <div className="flex items-center gap-2">
          <Image src="/images/masterkey-black-logo.png" alt="MasterKey" width={100} height={26} className="object-contain opacity-80" onError={() => {}} />
        </div>

        {/* Main content */}
        <div>
          <TagBadge><MapPin className="w-3 h-3" />Monthly Market Report</TagBadge>
          <h1 className="mt-4 text-5xl font-bold text-gray-950 leading-tight">{data.city}</h1>
          <p className="text-gray-400 text-lg mt-1 font-medium">{data.reportMonth}</p>

          {/* 3 key stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Homes Sold', value: fmt(data.closedSales), icon: Home },
              { label: 'Median Price', value: fmtPrice(data.medSoldPrice), icon: DollarSign },
              { label: 'Active Listings', value: fmt(data.activeListings), icon: Building2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <Icon className="w-4 h-4 text-orange-500 mx-auto mb-1.5" />
                <p className="text-xl font-bold text-gray-950">{value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent */}
        <div className="flex items-center gap-3">
          <Image src="/mike-avatar.png" alt="Mike Mathias" width={44} height={44} className="rounded-full border-2 border-orange-100 object-cover" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Mike Mathias</p>
            <p className="text-xs text-gray-400">Mathias Real Estate Group · 805.262.9707</p>
          </div>
        </div>
      </div>

      {/* Right — full bleed lifestyle image */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl">
        <Image src="/modern-home-exterior.png" alt="Thousand Oaks home" fill className="object-cover" />
        {/* Gradient fade to left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
        {/* Month badge overlay */}
        <div className="absolute bottom-14 right-5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 text-right shadow-lg">
          <p className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold">Report Month</p>
          <p className="text-base font-bold text-gray-950 mt-0.5">{data.reportMonth}</p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 2 — Market Snapshot ────────────────────────────────────────────────

function SlideSnapshot({ data }: { data: MarketData }) {
  const stats = [
    {
      label: 'Median Sale Price',
      value: fmtPrice(data.medSoldPrice),
      sub: fmtFull(data.medSoldPrice),
      mom: delta(data.medSoldPrice, data.mom.medSoldPrice),
      yoy: delta(data.medSoldPrice, data.yoy.medSoldPrice),
      icon: DollarSign,
      accent: true,
    },
    {
      label: 'Homes Sold',
      value: fmt(data.closedSales),
      sub: data.reportMonth,
      mom: delta(data.closedSales, data.mom.closedSales),
      yoy: delta(data.closedSales, data.yoy.closedSales),
      icon: Home,
    },
    {
      label: 'Median Days on Market',
      value: fmt(data.medDaysOnMarket),
      sub: 'days',
      mom: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket),
      yoy: delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket),
      icon: Clock,
      invert: true,
    },
    {
      label: 'Avg. Price / Sq Ft',
      value: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—',
      sub: 'per sq ft',
      mom: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft),
      yoy: delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft),
      icon: Percent,
    },
  ]

  return (
    <div className="relative w-full h-full bg-white flex flex-col pb-10">
      {/* Top color bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200" />

      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>{data.reportMonth}</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-6">Market at a Glance</h2>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {stats.map(({ label, value, sub, mom, yoy, icon: Icon, accent, invert }) => (
            <div
              key={label}
              className={`rounded-2xl border p-5 flex flex-col ${
                accent
                  ? 'bg-orange-50 border-orange-100'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${accent ? 'bg-orange-100' : 'bg-white border border-gray-100'}`}>
                <Icon className={`w-4 h-4 ${accent ? 'text-orange-500' : 'text-gray-500'}`} />
              </div>
              <p className={`text-3xl font-bold mb-1 ${accent ? 'text-orange-600' : 'text-gray-950'}`}>{value}</p>
              <p className="text-xs text-gray-400 mb-auto">{sub}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-3 mb-1">{label}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                <div>
                  <p className="text-[9px] text-gray-300 mb-0.5">MoM</p>
                  <DeltaBadge pct={mom} invert={invert} size="xs" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-300 mb-0.5">YoY</p>
                  <DeltaBadge pct={yoy} invert={invert} size="xs" />
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

// ─── Slide 3 — Inventory (split: stats left, living room right) ────────────────

function SlideInventory({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full bg-white flex pb-10">
      {/* Left */}
      <div className="flex flex-col w-[55%] px-10 py-8">
        <Eyebrow>Inventory · {data.reportMonth}</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-6">What&apos;s on the Market</h2>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Active Listings', value: fmt(data.activeListings), sub: 'available today', icon: Building2 },
            { label: 'New This Month', value: fmt(data.newListings), sub: 'recently listed', icon: Calendar },
            { label: 'Months of Supply', value: data.monthsOfSupply != null ? String(data.monthsOfSupply) : '—', sub: 'active ÷ sold', icon: Activity },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <Icon className="w-4 h-4 text-orange-500 mb-2" />
              <p className="text-3xl font-bold text-gray-950">{value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex-1">
          <p className="text-xs font-semibold text-gray-700 mb-4">Market Condition</p>
          <MarketConditionMeter mos={data.monthsOfSupply} />
          <p className="text-xs text-gray-400 mt-5 leading-relaxed">
            Months of supply = active listings ÷ homes closed last month.{' '}
            <span className="text-orange-500 font-medium">Under 3</span> favors sellers.{' '}
            <span className="text-amber-500 font-medium">3–6</span> is balanced.{' '}
            <span className="text-emerald-500 font-medium">Over 6</span> favors buyers.
          </p>
        </div>
      </div>

      {/* Right — lifestyle image */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl mx-0 my-4 mr-4">
        <ImagePane src="/bright-living-room-with-hardwood-floors.png" alt="Bright living room" />
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold">Active Listings</p>
          <p className="text-xl font-bold text-gray-950">{fmt(data.activeListings)} homes available</p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 4 — Pricing ────────────────────────────────────────────────────────

function SlidePricing({ data }: { data: MarketData }) {
  const spreadPct =
    data.medListPrice && data.medSoldPrice
      ? Math.round(((data.medSoldPrice - data.medListPrice) / data.medListPrice) * 100 * 10) / 10
      : null

  return (
    <div className="relative w-full h-full bg-white flex pb-10">
      {/* Left: kitchen lifestyle */}
      <div className="w-[40%] relative overflow-hidden rounded-r-3xl my-4 ml-4">
        <ImagePane src="/updated-kitchen-with-granite-countertops.png" alt="Upgraded kitchen" overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold mb-1">Median Sale Price</p>
          <p className="text-3xl font-bold text-white">{fmtPrice(data.medSoldPrice)}</p>
          <p className="text-xs text-white/60">{fmtFull(data.medSoldPrice)}</p>
        </div>
      </div>

      {/* Right: stats */}
      <div className="flex-1 flex flex-col px-8 py-8">
        <Eyebrow>Pricing · {data.reportMonth}</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-5">How Homes Are Pricing</h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Median List Price</p>
            <p className="text-3xl font-bold text-gray-950">{fmtPrice(data.medListPrice)}</p>
            <p className="text-xs text-gray-400 mt-1">{fmtFull(data.medListPrice)}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-orange-400 mb-2">Median Sale Price</p>
            <p className="text-3xl font-bold text-orange-600">{fmtPrice(data.medSoldPrice)}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-400">{fmtFull(data.medSoldPrice)}</p>
              <DeltaBadge pct={delta(data.medSoldPrice, data.yoy.medSoldPrice)} size="xs" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">List-to-Sale</p>
            <p className={`text-2xl font-bold ${spreadPct != null && spreadPct >= 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
              {spreadPct != null ? `${spreadPct > 0 ? '+' : ''}${spreadPct}%` : '—'}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Above List</p>
            <p className="text-2xl font-bold text-emerald-600">{data.aboveList ?? '—'}</p>
            <p className="text-[10px] text-gray-300">homes</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Below List</p>
            <p className="text-2xl font-bold text-orange-500">{data.belowList ?? '—'}</p>
            <p className="text-[10px] text-gray-300">homes</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">Avg. Price per Sq Ft</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-gray-950">{data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—'}</p>
            <DeltaBadge pct={delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft)} size="xs" />
          </div>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 5 — Days on Market (split: stats left, master bedroom right) ───────

function SlideDaysOnMarket({ data }: { data: MarketData }) {
  const speedLabel = (dom: number | null) => {
    if (dom == null) return null
    if (dom <= 14) return { text: 'Hot market — homes moving in under 2 weeks.', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' }
    if (dom <= 30) return { text: 'Active market — most homes sell within a month.', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
    return { text: 'Measured pace — buyers have more time to evaluate.', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' }
  }
  const badge = speedLabel(data.medDaysOnMarket)

  return (
    <div className="relative w-full h-full bg-white flex pb-10">
      {/* Left */}
      <div className="flex flex-col w-[55%] px-10 py-8">
        <Eyebrow>Speed · {data.reportMonth}</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-6">How Fast Are Homes Selling?</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-5xl font-bold text-orange-600 mb-1">{fmt(data.medDaysOnMarket)}</p>
            <p className="text-xs text-gray-500 font-medium">Median Days on Market</p>
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-orange-100">
              <div><p className="text-[9px] text-gray-300">MoM</p><DeltaBadge pct={delta(data.medDaysOnMarket, data.mom.medDaysOnMarket)} invert size="xs" /></div>
              <div><p className="text-[9px] text-gray-300">YoY</p><DeltaBadge pct={delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket)} invert size="xs" /></div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
            <Activity className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-5xl font-bold text-gray-950 mb-1">{fmt(data.avgDaysOnMarket)}</p>
            <p className="text-xs text-gray-500 font-medium">Average Days on Market</p>
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div><p className="text-[9px] text-gray-300">MoM</p><DeltaBadge pct={delta(data.avgDaysOnMarket, data.mom.avgDaysOnMarket)} invert size="xs" /></div>
              <div><p className="text-[9px] text-gray-300">YoY</p><DeltaBadge pct={delta(data.avgDaysOnMarket, data.yoy.avgDaysOnMarket)} invert size="xs" /></div>
            </div>
          </div>
        </div>

        {badge && (
          <div className={`rounded-2xl border px-5 py-4 ${badge.bg}`}>
            <p className={`text-sm font-semibold ${badge.color}`}>{badge.text}</p>
          </div>
        )}
      </div>

      {/* Right — master bedroom */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl my-4 mr-4">
        <ImagePane src="/large-window-master-bedroom.png" alt="Master bedroom with large windows" overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 6 — 12-Month Trend Chart ───────────────────────────────────────────

function SlideTrend({ data }: { data: MarketData }) {
  if (!data.trend || data.trend.length === 0) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center pb-10">
        <p className="text-gray-400">No trend data available</p>
        <SlideFooter city={data.city} date={data.date} />
      </div>
    )
  }

  const total = data.trend.reduce((s, t) => s + t.closedSales, 0)
  const avg = Math.round(total / data.trend.length)
  const peak = data.trend.reduce((best, t) => (t.closedSales > best.closedSales ? t : best), data.trend[0])

  return (
    <div className="relative w-full h-full bg-white flex flex-col pb-10">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200" />
      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>Trend</Eyebrow>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-950 leading-tight">12-Month Sales Volume</h2>
            <p className="text-sm text-gray-400 mt-0.5">Homes closed per month · {data.city}</p>
          </div>
          <div className="flex gap-5 text-right">
            <div><p className="text-[10px] text-gray-300 uppercase tracking-widest">12-Mo Total</p><p className="text-xl font-bold text-gray-950">{fmt(total)}</p></div>
            <div><p className="text-[10px] text-gray-300 uppercase tracking-widest">Monthly Avg</p><p className="text-xl font-bold text-gray-950">{avg}</p></div>
            <div><p className="text-[10px] text-gray-300 uppercase tracking-widest">Peak Month</p><p className="text-xl font-bold text-orange-500">{peak.label}</p></div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '10px', color: '#111827', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                cursor={{ fill: 'rgba(249,115,22,0.04)' }}
                formatter={(val: number) => [val, 'Homes Sold']}
              />
              <Bar dataKey="closedSales" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
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
    <div className="relative w-full h-full bg-white flex flex-col pb-10">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200" />
      <div className="flex flex-col flex-1 px-10 py-7">
        <Eyebrow>Recent Transactions</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-5">What Sold in {data.reportMonth}</h2>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {sales.map((s, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex">
              {/* Property image or placeholder */}
              <div className="w-20 flex-shrink-0 relative bg-gray-100">
                {s.image ? (
                  <img src={s.image} alt={s.address} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-gray-200" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{s.address}</p>
                {s.neighborhood && <p className="text-[10px] text-gray-400 truncate">{s.neighborhood}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400">{s.beds}bd · {s.baths}ba</span>
                  {s.sqft && <span className="text-[11px] text-gray-300">{fmt(s.sqft)} sf</span>}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-bold text-orange-600">{fmtFull(s.soldPrice)}</span>
                  {s.overUnder != null && (
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${s.overUnder > 0 ? 'bg-emerald-50 text-emerald-600' : s.overUnder < 0 ? 'bg-red-50 text-red-500' : 'text-gray-400'}`}>
                      {s.overUnder > 0 ? `+${s.overUnder}%` : `${s.overUnder}%`}
                    </span>
                  )}
                  {s.daysOnMarket != null && <span className="text-[11px] text-gray-300 ml-auto">{s.daysOnMarket}d</span>}
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

// ─── Slide 8 — Month/Month Comparison ─────────────────────────────────────────

function SlideMoMComparison({ data }: { data: MarketData }) {
  const prevDate = new Date(data.date + '-01')
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prevLabel = prevDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const rows = [
    { label: 'Homes Sold', current: fmt(data.closedSales), prev: fmt(data.mom.closedSales), d: delta(data.closedSales, data.mom.closedSales) },
    { label: 'Median Sale Price', current: fmtPrice(data.medSoldPrice), prev: fmtPrice(data.mom.medSoldPrice), d: delta(data.medSoldPrice, data.mom.medSoldPrice) },
    { label: 'Median Days on Market', current: fmt(data.medDaysOnMarket), prev: fmt(data.mom.medDaysOnMarket), d: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), invert: true },
    { label: 'Sold Above List Price', current: fmt(data.aboveList), prev: fmt(data.mom.aboveList), d: delta(data.aboveList, data.mom.aboveList) },
    { label: 'Avg. Price / Sq Ft', current: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—', prev: data.mom.avgPricePerSqft ? `$${fmt(data.mom.avgPricePerSqft)}` : '—', d: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft) },
  ]

  return (
    <div className="relative w-full h-full bg-white flex pb-10">
      {/* Left: table */}
      <div className="flex flex-col w-[58%] px-10 py-8">
        <Eyebrow>Month over Month</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 mb-6">{data.reportMonth} vs. {prevLabel}</h2>

        <div className="flex-1">
          <div className="grid grid-cols-4 text-[10px] font-semibold uppercase tracking-widest text-gray-300 px-4 mb-2">
            <span className="col-span-2">Metric</span>
            <span className="text-right">{prevLabel.split(' ')[0]}</span>
            <span className="text-right">{data.reportMonth.split(' ')[0]}</span>
          </div>
          <div className="space-y-2">
            {rows.map(({ label, current, prev, d, invert }) => (
              <div key={label} className="grid grid-cols-4 items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <span className="col-span-2 text-sm text-gray-600">{label}</span>
                <span className="text-sm text-gray-400 text-right">{prev}</span>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-gray-950">{current}</span>
                  <DeltaBadge pct={d} invert={invert} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Data sourced from CRMLS via Repliers MLS. Stats reflect residential transactions within {data.city} city limits.
          </p>
        </div>
      </div>

      {/* Right: sold home lifestyle */}
      <div className="flex-1 relative overflow-hidden rounded-l-3xl my-4 mr-4">
        <Image src="/images/mk-sold.jpg" alt="Sold home" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold mb-1">Month over Month</p>
          <p className="text-2xl font-bold text-white leading-tight">
            {data.closedSales} homes closed<br />in {data.reportMonth}
          </p>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide 9 — CTA ────────────────────────────────────────────────────────────

function SlideCTA({ data }: { data: MarketData }) {
  return (
    <div className="relative w-full h-full flex pb-10">
      {/* Left: full-bleed exterior hero */}
      <div className="w-[45%] relative overflow-hidden rounded-r-3xl my-4 ml-4">
        <Image src="/modern-home-exterior.png" alt="Home exterior" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white/50 text-xs mb-1">{data.reportMonth} · {data.city}</p>
          <p className="text-2xl font-bold text-white leading-tight">Thinking About<br />Making a Move?</p>
        </div>
      </div>

      {/* Right: CTA content */}
      <div className="flex-1 bg-white flex flex-col justify-center px-10">
        <Eyebrow>Let&apos;s Connect</Eyebrow>
        <h2 className="text-3xl font-bold text-gray-950 leading-tight mb-3 mt-1">
          Get expert guidance<br />on your next step.
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-7 max-w-xs">
          Whether you&apos;re buying, selling, or just curious about your home&apos;s value — let&apos;s talk numbers. No obligation.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Image src="/mike-avatar.png" alt="Mike Mathias" width={52} height={52} className="rounded-full border-2 border-orange-100 object-cover" />
          <div>
            <p className="font-bold text-gray-950">Mike Mathias</p>
            <p className="text-xs text-gray-400">Mathias Real Estate Group · DRE 01892427</p>
          </div>
        </div>

        <div className="space-y-3 max-w-xs">
          <a href="tel:8052629707" className="flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm">
            <Phone className="w-4 h-4" /> 805.262.9707
          </a>
          <a href="https://mathiasregroup.com" className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-3 px-5 rounded-xl transition-colors text-sm">
            <Globe className="w-4 h-4 text-orange-500" /> mathiasregroup.com
          </a>
        </div>
      </div>

      <SlideFooter city={data.city} date={data.date} />
    </div>
  )
}

// ─── Slide registry & labels ──────────────────────────────────────────────────

const SLIDE_LABELS = [
  'Cover', 'Snapshot', 'Inventory', 'Pricing', 'Speed', 'Trend', 'Recent Sales', 'Month/Month', 'Contact',
]

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
        if (!document.fullscreenElement) { deckRef.current?.requestFullscreen() }
        else { document.exitFullscreen() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading market data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-orange-500 font-semibold mb-2">Failed to load market data</p>
          <p className="text-gray-400 text-sm">{error}</p>
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top nav bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-xs text-gray-600 font-medium">{data.city} · {data.reportMonth}</span>
        </div>
        {/* Dot nav */}
        <div className="flex items-center gap-1.5">
          {SLIDE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              title={label}
              className={`rounded-full transition-all ${
                i === slide
                  ? 'bg-orange-500 w-5 h-2'
                  : 'bg-gray-200 hover:bg-gray-300 w-2 h-2'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{slide + 1} / {SLIDE_LABELS.length}</span>
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={deckRef}
          className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          style={{ aspectRatio: '16/9' }}
        >
          {slides[slide]}

          {/* Arrow overlays */}
          <button
            onClick={prev}
            disabled={slide === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-20 shadow-sm transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={slide === slides.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-20 shadow-sm transition-all z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <button onClick={prev} disabled={slide === 0} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100">
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <button onClick={next} disabled={slide === slides.length - 1} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs text-gray-300 hidden sm:block">← → to navigate · F for fullscreen</span>
        <span className="text-xs font-medium text-gray-400">{SLIDE_LABELS[slide]}</span>
      </div>
    </div>
  )
}
