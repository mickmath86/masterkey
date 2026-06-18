'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { clsx } from 'clsx/lite'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Home,
  TrendingUp,
  Clock,
  BarChart2,
  DollarSign,
  Building2,
  Activity,
  Users,
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DeckInfo {
  city: string
  date: string // YYYY-MM
  agentName: string
  agentPhone: string
  notes: string
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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

function DeltaBadge({ pct, invert = false }: { pct: number | null; invert?: boolean }) {
  if (pct == null) return <span className="text-white/30 text-xs">—</span>
  const positive = invert ? pct < 0 : pct > 0
  const zero = pct === 0
  if (zero) return <span className="text-white/40 text-xs">0%</span>
  return (
    <span className={clsx('text-xs font-semibold', positive ? 'text-emerald-400' : 'text-red-400')}>
      {positive ? '↑' : '↓'} {Math.abs(pct)}%
    </span>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/40">
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-call input screen
// ─────────────────────────────────────────────────────────────────────────────

function PreCallScreen({
  info,
  onChange,
  onStart,
}: {
  info: DeckInfo
  onChange: (field: keyof DeckInfo, value: string) => void
  onStart: () => void
}) {
  const canStart = info.city.trim().length > 0 && info.date.trim().length === 7

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-olive-950 px-8 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,oklch(33%_0.03_107)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,oklch(25%_0.025_107)_0%,transparent_55%)]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-10 text-center">
          <Image
            src="/mike-avatar.png"
            alt="Mike Mathias"
            width={64}
            height={64}
            className="mx-auto mb-5 rounded-full border border-white/10 object-cover"
          />
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/40">
            Pre-presentation setup
          </p>
          <h1 className="mt-3 font-display text-3xl text-white">
            Set up before presenting.
          </h1>
          <p className="mt-2 text-sm text-white/50">
            This loads live market data for the city and month you choose.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              City <span className="text-white/20">(required)</span>
            </label>
            <input
              type="text"
              value={info.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="e.g. Thousand Oaks"
              className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white placeholder-white/25 outline-none transition focus:border-white/40 focus:bg-white/12"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Report month <span className="text-white/20">(YYYY-MM, required)</span>
            </label>
            <input
              type="month"
              value={info.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/12"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Your name
            </label>
            <input
              type="text"
              value={info.agentName}
              onChange={(e) => onChange('agentName', e.target.value)}
              placeholder="e.g. Mike Mathias"
              className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white placeholder-white/25 outline-none transition focus:border-white/40 focus:bg-white/12"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Phone
            </label>
            <input
              type="tel"
              value={info.agentPhone}
              onChange={(e) => onChange('agentPhone', e.target.value)}
              placeholder="805.262.9707"
              className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white placeholder-white/25 outline-none transition focus:border-white/40 focus:bg-white/12"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Pre-call notes
            </label>
            <textarea
              value={info.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Audience context, talking points, property address…"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white placeholder-white/25 outline-none transition focus:border-white/40 focus:bg-white/12"
            />
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!canStart}
          className="mt-8 w-full rounded-xl bg-white py-4 text-sm font-semibold text-olive-950 transition hover:bg-white/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start presentation →
        </button>

        <p className="mt-4 text-center text-xs text-white/25">
          Press → or Space to advance once started. Press Esc to return here.
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading / error screens
// ─────────────────────────────────────────────────────────────────────────────

function LoadingSlide() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-olive-950">
      <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      <p className="font-mono text-xs uppercase tracking-widest text-white/40">Loading market data…</p>
    </div>
  )
}

function ErrorSlide({ error }: { error: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-olive-950 px-8 text-center">
      <p className="font-display text-2xl text-white">Failed to load data</p>
      <p className="text-sm text-white/50 max-w-sm">{error}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide shared wrapper
// ─────────────────────────────────────────────────────────────────────────────

function SlideShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('relative flex h-full w-full flex-col overflow-hidden bg-olive-950', className)}>
      {/* ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-10%,oklch(30%_0.025_107)_0%,transparent_55%)]" />
      <div className="relative z-10 flex h-full w-full flex-col">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 1 — Cover
// ─────────────────────────────────────────────────────────────────────────────

function Slide1({ data, info }: { data: MarketData; info: DeckInfo }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-0 bg-olive-950 px-8 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,oklch(33%_0.03_107)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,oklch(25%_0.025_107)_0%,transparent_55%)]" />
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/40">
          Monthly Market Report
        </p>
        <h1 className="font-display text-6xl sm:text-7xl text-white leading-none">
          {data.city}
        </h1>
        <p className="font-display italic text-2xl text-white/50">{data.reportMonth}</p>

        <div className="mt-4 grid grid-cols-3 gap-4 w-full max-w-xl">
          {[
            { label: 'Homes Sold', value: fmt(data.closedSales), icon: Home },
            { label: 'Median Price', value: fmtPrice(data.medSoldPrice), icon: DollarSign },
            { label: 'Active Listings', value: fmt(data.activeListings), icon: Building2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <Icon className="w-4 h-4 text-white/40 mx-auto mb-2" />
              <p className="font-display text-3xl text-white">{value}</p>
              <p className="mt-1 text-xs text-white/40 font-mono uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Image
            src="/mike-avatar.png"
            alt={info.agentName || 'Mike Mathias'}
            width={40}
            height={40}
            className="rounded-full border border-white/15 object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{info.agentName || 'Mike Mathias'}</p>
            <p className="text-xs text-white/40">Mathias Real Estate Group · {info.agentPhone || '805.262.9707'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 2 — Market at a Glance
// ─────────────────────────────────────────────────────────────────────────────

function Slide2({ data }: { data: MarketData }) {
  const stats = [
    { label: 'Median Sale Price', value: fmtPrice(data.medSoldPrice), sub: fmtFull(data.medSoldPrice), icon: DollarSign, mom: delta(data.medSoldPrice, data.mom.medSoldPrice), yoy: delta(data.medSoldPrice, data.yoy.medSoldPrice) },
    { label: 'Homes Sold', value: fmt(data.closedSales), sub: data.reportMonth, icon: Home, mom: delta(data.closedSales, data.mom.closedSales), yoy: delta(data.closedSales, data.yoy.closedSales) },
    { label: 'Median Days on Market', value: fmt(data.medDaysOnMarket), sub: 'days', icon: Clock, mom: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), yoy: delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket), invert: true },
    { label: 'Avg $/Sq Ft', value: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—', sub: 'per sq ft', icon: TrendingUp, mom: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft), yoy: delta(data.avgPricePerSqft, data.yoy.avgPricePerSqft) },
  ]

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>{data.reportMonth} · {data.city}</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-8">Market at a Glance</h2>
        <div className="grid grid-cols-4 gap-4 flex-1">
          {stats.map(({ label, value, sub, icon: Icon, mom, yoy, invert }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 mb-4">
                <Icon className="w-4 h-4 text-white/60" />
              </div>
              <p className="font-display text-4xl text-white leading-none">{value}</p>
              <p className="text-xs text-white/40 mt-1 mb-auto">{sub}</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mt-4 mb-2">{label}</p>
              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                <div>
                  <p className="text-[9px] text-white/30 mb-0.5">MoM</p>
                  <DeltaBadge pct={mom} invert={invert} />
                </div>
                <div>
                  <p className="text-[9px] text-white/30 mb-0.5">YoY</p>
                  <DeltaBadge pct={yoy} invert={invert} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 3 — Inventory & Supply
// ─────────────────────────────────────────────────────────────────────────────

function Slide3({ data }: { data: MarketData }) {
  const mos = data.monthsOfSupply
  const isSeller = mos != null && mos < 3
  const isBalanced = mos != null && mos >= 3 && mos <= 6
  const conditionLabel = isSeller ? "Seller\u2019s Market" : isBalanced ? 'Balanced Market' : "Buyer\u2019s Market"
  const conditionColor = isSeller ? 'text-amber-400' : isBalanced ? 'text-olive-300' : 'text-emerald-400'
  const pct = mos != null ? Math.min(100, Math.max(0, (mos / 9) * 100)) : 50

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Inventory · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-8">What&apos;s on the Market</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active Listings', value: fmt(data.activeListings), sub: 'available now', icon: Building2 },
            { label: 'New This Month', value: fmt(data.newListings), sub: 'recently listed', icon: Activity },
            { label: 'Months of Supply', value: mos != null ? String(mos) : '—', sub: 'active ÷ sold', icon: BarChart2 },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Icon className="w-4 h-4 text-white/40 mb-3" />
              <p className="font-display text-4xl text-white">{value}</p>
              <p className="text-xs font-mono uppercase tracking-widest text-white/30 mt-1">{label}</p>
              <p className="text-xs text-white/25 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white/70">Market Condition</p>
            <p className={clsx('font-display text-xl', conditionColor)}>{conditionLabel}</p>
          </div>
          <div className="relative h-2 rounded-full bg-white/10 mb-2">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border border-white/20"
              style={{ left: `calc(${pct}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30 font-mono uppercase tracking-wider mt-2">
            <span>Seller&apos;s</span>
            <span>{mos != null ? `${mos} months` : '—'}</span>
            <span>Buyer&apos;s</span>
          </div>
          <p className="text-xs text-white/30 mt-4 leading-relaxed">
            Under 3 months favors sellers. 3–6 is balanced. Over 6 favors buyers.
            Calculated as active listings ÷ homes sold last month.
          </p>
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 4 — Pricing
// ─────────────────────────────────────────────────────────────────────────────

function Slide4({ data }: { data: MarketData }) {
  const spreadPct = data.medListPrice && data.medSoldPrice
    ? Math.round(((data.medSoldPrice - data.medListPrice) / data.medListPrice) * 100 * 10) / 10
    : null

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Pricing · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-8">How Homes Are Pricing</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Median List Price</p>
            <p className="font-display text-4xl text-white">{fmtPrice(data.medListPrice)}</p>
            <p className="text-xs text-white/30 mt-1">{fmtFull(data.medListPrice)}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-3">Median Sale Price</p>
            <p className="font-display text-4xl text-white">{fmtPrice(data.medSoldPrice)}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-white/30">{fmtFull(data.medSoldPrice)}</p>
              <DeltaBadge pct={delta(data.medSoldPrice, data.yoy.medSoldPrice)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {[
            { label: 'List-to-Sale', value: spreadPct != null ? `${spreadPct > 0 ? '+' : ''}${spreadPct}%` : '—', color: spreadPct != null && spreadPct >= 0 ? 'text-emerald-400' : 'text-amber-400' },
            { label: 'Above List', value: fmt(data.aboveList), color: 'text-emerald-400' },
            { label: 'Below List', value: fmt(data.belowList), color: 'text-amber-400' },
            { label: 'Avg $/Sq Ft', value: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—', color: 'text-white' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{label}</p>
              <p className={clsx('font-display text-3xl', color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 5 — Days on Market
// ─────────────────────────────────────────────────────────────────────────────

function Slide5({ data }: { data: MarketData }) {
  const dom = data.medDaysOnMarket
  const badge = dom == null ? null
    : dom <= 14 ? { text: 'Hot market \u2014 homes going under contract in under 2 weeks.', cls: 'border-amber-400/20 bg-amber-400/10 text-amber-300' }
    : dom <= 30 ? { text: 'Active market \u2014 most well-priced homes sell within a month.', cls: 'border-white/10 bg-white/5 text-white/70' }
    : { text: 'Measured pace \u2014 buyers have time to evaluate and negotiate.', cls: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' }

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Speed · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-8">How Fast Are Homes Selling?</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {[
            { label: 'Median Days on Market', value: fmt(data.medDaysOnMarket), mom: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), yoy: delta(data.medDaysOnMarket, data.yoy.medDaysOnMarket), featured: true },
            { label: 'Average Days on Market', value: fmt(data.avgDaysOnMarket), mom: delta(data.avgDaysOnMarket, data.mom.avgDaysOnMarket), yoy: delta(data.avgDaysOnMarket, data.yoy.avgDaysOnMarket), featured: false },
          ].map(({ label, value, mom, yoy, featured }) => (
            <div key={label} className={clsx('rounded-2xl border p-8 text-center', featured ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5')}>
              <Clock className="w-6 h-6 text-white/40 mx-auto mb-3" />
              <p className="font-display text-6xl text-white leading-none mb-2">{value}</p>
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">{label}</p>
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/10">
                <div><p className="text-[9px] text-white/30">MoM</p><DeltaBadge pct={mom} invert /></div>
                <div><p className="text-[9px] text-white/30">YoY</p><DeltaBadge pct={yoy} invert /></div>
              </div>
            </div>
          ))}
        </div>

        {badge && (
          <div className={clsx('rounded-2xl border px-6 py-4', badge.cls)}>
            <p className="text-sm font-medium">{badge.text}</p>
          </div>
        )}
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 6 — 12-Month Trend Chart
// ─────────────────────────────────────────────────────────────────────────────

function Slide6({ data }: { data: MarketData }) {
  if (!data.trend?.length) {
    return (
      <SlideShell>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-white/40 text-sm">Slide 6</p>
          <h2 className="font-display text-4xl text-white">12-Month Trend</h2>
        </div>
      </SlideShell>
    )
  }

  const total = data.trend.reduce((s, t) => s + t.closedSales, 0)
  const avg = Math.round(total / data.trend.length)
  const peak = data.trend.reduce((b, t) => t.closedSales > b.closedSales ? t : b, data.trend[0])

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Trend · 12 Months</Eyebrow>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-5xl text-white mt-3 leading-tight">Sales Volume</h2>
          <div className="flex gap-8 text-right pb-1">
            {[
              { label: '12-Mo Total', value: fmt(total) },
              { label: 'Monthly Avg', value: String(avg) },
              { label: 'Peak', value: peak.label },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/30">{label}</p>
                <p className="font-display text-2xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(17% 0.010 107)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(val: number) => [val, 'Homes Sold']}
              />
              <Bar dataKey="closedSales" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 7 — Recent Sales
// ─────────────────────────────────────────────────────────────────────────────

function Slide7({ data }: { data: MarketData }) {
  const sales = data.recentSales?.slice(0, 6) || []

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Recent Transactions · {data.reportMonth}</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-6">What Sold This Month</h2>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {sales.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex">
              <div className="w-[68px] flex-shrink-0 relative bg-white/5">
                {s.image ? (
                  <img src={s.image} alt={s.address} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-white/15" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{s.address}</p>
                {s.neighborhood && <p className="text-[10px] text-white/35 truncate">{s.neighborhood}</p>}
                <p className="text-[11px] text-white/40 mt-1">{s.beds}bd · {s.baths}ba{s.sqft ? ` · ${fmt(s.sqft)} sf` : ''}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-display text-sm text-white">{fmtFull(s.soldPrice)}</span>
                  {s.overUnder != null && (
                    <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded-full border', s.overUnder > 0 ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-400' : 'border-amber-400/25 bg-amber-400/10 text-amber-400')}>
                      {s.overUnder > 0 ? `+${s.overUnder}%` : `${s.overUnder}%`}
                    </span>
                  )}
                  {s.daysOnMarket != null && <span className="text-[10px] text-white/25 ml-auto">{s.daysOnMarket}d</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 8 — Month/Month Comparison
// ─────────────────────────────────────────────────────────────────────────────

function Slide8({ data }: { data: MarketData }) {
  const prevDate = new Date(data.date + '-01')
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prevLabel = prevDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const rows = [
    { label: 'Homes Sold', current: fmt(data.closedSales), prev: fmt(data.mom.closedSales), d: delta(data.closedSales, data.mom.closedSales) },
    { label: 'Median Sale Price', current: fmtPrice(data.medSoldPrice), prev: fmtPrice(data.mom.medSoldPrice), d: delta(data.medSoldPrice, data.mom.medSoldPrice) },
    { label: 'Median Days on Market', current: fmt(data.medDaysOnMarket), prev: fmt(data.mom.medDaysOnMarket), d: delta(data.medDaysOnMarket, data.mom.medDaysOnMarket), invert: true },
    { label: 'Sold Above List', current: fmt(data.aboveList), prev: fmt(data.mom.aboveList), d: delta(data.aboveList, data.mom.aboveList) },
    { label: 'Avg $/Sq Ft', current: data.avgPricePerSqft ? `$${fmt(data.avgPricePerSqft)}` : '—', prev: data.mom.avgPricePerSqft ? `$${fmt(data.mom.avgPricePerSqft)}` : '—', d: delta(data.avgPricePerSqft, data.mom.avgPricePerSqft) },
  ]

  return (
    <SlideShell>
      <div className="flex flex-col flex-1 px-10 py-10">
        <Eyebrow>Month over Month</Eyebrow>
        <h2 className="font-display text-5xl text-white mt-3 mb-8">
          {data.reportMonth} vs. {prevLabel}
        </h2>

        <div className="flex-1 flex flex-col gap-2">
          <div className="grid grid-cols-4 text-[9px] font-mono uppercase tracking-widest text-white/25 px-5 mb-1">
            <span className="col-span-2">Metric</span>
            <span className="text-right">{prevLabel.split(' ')[0]}</span>
            <span className="text-right">{data.reportMonth.split(' ')[0]}</span>
          </div>
          {rows.map(({ label, current, prev, d, invert }) => (
            <div key={label} className="grid grid-cols-4 items-center rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <span className="col-span-2 text-sm text-white/70">{label}</span>
              <span className="text-sm text-white/30 text-right">{prev}</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-semibold text-white">{current}</span>
                <DeltaBadge pct={d} invert={invert} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
          <p className="text-[11px] text-white/30 leading-relaxed">
            Data sourced from CRMLS via Repliers MLS. Stats reflect residential transactions within {data.city} city limits.
          </p>
        </div>
      </div>
    </SlideShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide 9 — CTA
// ─────────────────────────────────────────────────────────────────────────────

function Slide9({ data, info }: { data: MarketData; info: DeckInfo }) {
  const agent = info.agentName || 'Mike Mathias'
  const phone = info.agentPhone || '805.262.9707'

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-olive-950 px-8 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,oklch(33%_0.03_107)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,oklch(25%_0.025_107)_0%,transparent_55%)]" />

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-xl">
        <Eyebrow>Let&apos;s Connect</Eyebrow>
        <h2 className="font-display text-5xl sm:text-6xl text-white leading-tight">
          Thinking about making a move?
        </h2>
        <p className="text-base/7 text-white/60 max-w-sm">
          Whether you&apos;re buying, selling, or just curious about your home&apos;s value — let&apos;s talk numbers. No obligation.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <Image
            src="/mike-avatar.png"
            alt={agent}
            width={52}
            height={52}
            className="rounded-full border border-white/15 object-cover"
          />
          <div className="text-left">
            <p className="font-semibold text-white">{agent}</p>
            <p className="text-xs text-white/40">Mathias Real Estate Group · DRE 01892427</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-olive-950 transition hover:opacity-90"
          >
            <Phone className="w-4 h-4" /> {phone}
          </a>
          <a
            href="https://mathiasregroup.com"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Globe className="w-4 h-4" /> mathiasregroup.com
          </a>
        </div>

        <p className="text-xs text-white/20 mt-2">{data.reportMonth} · {data.city} Market Report</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide registry
// ─────────────────────────────────────────────────────────────────────────────

const slideLabels = [
  'Cover',
  'Market Snapshot',
  'Inventory & Supply',
  'Pricing',
  'Days on Market',
  '12-Month Trend',
  'Recent Sales',
  'Month over Month',
  'Contact',
]

const SLIDE_COUNT = slideLabels.length

// ─────────────────────────────────────────────────────────────────────────────
// Slide transition variants — exact kb-lite pattern
// ─────────────────────────────────────────────────────────────────────────────

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
}

const transition = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
}

// ─────────────────────────────────────────────────────────────────────────────
// Deck shell
// ─────────────────────────────────────────────────────────────────────────────

export default function MarketUpdateDeck() {
  const [currentView, setCurrentView] = useState<'input' | 'deck'>('input')
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [info, setInfo] = useState<DeckInfo>({
    city: 'Thousand Oaks',
    date: new Date().toISOString().slice(0, 7),
    agentName: 'Mike Mathias',
    agentPhone: '805.262.9707',
    notes: '',
  })
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  function updateInfo(field: keyof DeckInfo, value: string) {
    setInfo((prev) => ({ ...prev, [field]: value }))
  }

  const maxSlideRef = useRef(SLIDE_COUNT)
  maxSlideRef.current = SLIDE_COUNT

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => Math.max(0, c - 1))
  }, [])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => Math.min(maxSlideRef.current - 1, c + 1))
  }, [])

  function jumpTo(i: number) {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
    setMenuOpen(false)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (currentView !== 'deck') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      if (e.key === 'Escape') { setMenuOpen(false); setCurrentView('input') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentView, next, prev])

  function handleStart() {
    setCurrentView('deck')
    setCurrent(0)
    setDirection(0)
    setLoading(true)
    setError(null)
    const cityName = info.city.trim()
    fetch(`/api/market-updates?city=${encodeURIComponent(cityName)}&date=${info.date}`)
      .then((r) => r.json())
      .then((d) => { if (d.error) throw new Error(d.error); setData(d) })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }

  // Pre-call screen
  if (currentView === 'input') {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <PreCallScreen info={info} onChange={updateInfo} onStart={handleStart} />
      </div>
    )
  }

  // Build slide components (needs data)
  function renderSlide(index: number) {
    if (loading) return <LoadingSlide />
    if (error || !data) return <ErrorSlide error={error ?? 'No data'} />
    switch (index) {
      case 0: return <Slide1 data={data} info={info} />
      case 1: return <Slide2 data={data} />
      case 2: return <Slide3 data={data} />
      case 3: return <Slide4 data={data} />
      case 4: return <Slide5 data={data} />
      case 5: return <Slide6 data={data} />
      case 6: return <Slide7 data={data} />
      case 7: return <Slide8 data={data} />
      case 8: return <Slide9 data={data} info={info} />
      default: return null
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-olive-950">
      {/* Slide */}
      <div className="h-full w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
          >
            {renderSlide(current)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top bar — pointer-events-none shell, pointer-events-auto on children */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4">
        {/* Logo left */}
        <div className="pointer-events-auto">
          <Image
            src="/images/masterkey-inline-white.png"
            alt="Mathias Real Estate Group"
            width={100}
            height={28}
            className="opacity-50 hover:opacity-80 transition-opacity object-contain"
          />
        </div>

        {/* Center — slide label + counter button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/35"
        >
          <span className="font-mono">{current + 1} / {SLIDE_COUNT}</span>
          <span className="hidden text-white/50 sm:inline">·</span>
          <span className="hidden sm:inline text-white/70">{slideLabels[current]}</span>
        </button>

        {/* Edit button right */}
        <button
          onClick={() => setCurrentView('input')}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-black/35"
          title="Back to setup"
        >
          <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
          </svg>
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* Slide menu overlay */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-olive-900 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 px-2 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">
              Jump to slide
            </p>
            <div className="flex flex-col gap-0.5">
              {slideLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    i === current
                      ? 'bg-white text-olive-950'
                      : 'text-white hover:bg-white/5'
                  )}
                >
                  <span className="w-5 shrink-0 text-right font-mono text-xs opacity-40">{i + 1}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav — arrows + dots */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-5">
        {/* Left arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          className={clsx(
            'flex size-10 items-center justify-center rounded-full transition-all',
            current === 0
              ? 'pointer-events-none opacity-0'
              : 'bg-black/20 text-white backdrop-blur-sm hover:bg-black/35'
          )}
        >
          <ArrowLeft className="size-4" />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {slideLabels.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className={clsx(
                'rounded-full transition-all duration-300',
                i === current ? 'h-1.5 w-6 bg-white shadow-sm' : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/60'
              )}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          disabled={current === SLIDE_COUNT - 1}
          className={clsx(
            'flex size-10 items-center justify-center rounded-full transition-all',
            current === SLIDE_COUNT - 1
              ? 'pointer-events-none opacity-0'
              : 'bg-black/20 text-white backdrop-blur-sm hover:bg-black/35'
          )}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
