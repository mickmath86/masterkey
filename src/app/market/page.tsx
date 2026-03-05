'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  ExternalLink,
  Home,
  Lock,
  Mail,
  Percent,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PriceHistoryPoint {
  month: string
  price: number
}

interface InventoryHistoryPoint {
  month: string
  listings: number
  dom: number
}

interface MortgageHistoryPoint {
  date: string
  rate: number
}

interface MarketData {
  medianPrice: number
  priceChange: number
  daysOnMarket: number
  domChange: number
  activeListings: number
  inventoryChange: number
  mortgageRate: number
  rateChange: number
  priceHistory: PriceHistoryPoint[]
  inventoryHistory: InventoryHistoryPoint[]
  mortgageHistory: MortgageHistoryPoint[]
  lastUpdated: string
  source: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function formatTooltipPrice(value: number) {
  return [`$${(value / 1000).toFixed(0)}K`, 'Median Price']
}

function formatTooltipRate(value: number) {
  return [`${value.toFixed(2)}%`, '30-yr Fixed']
}

// ─── Email Gate Component ────────────────────────────────────────────────────

function EmailGate({ onUnlock }: { onUnlock: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/market/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Subscribe failed')
    } catch {
      // Non-blocking — still unlock if subscribe fails
    }
    localStorage.setItem('mk_market_email', email)
    setLoading(false)
    onUnlock(email)
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1B4FCA]/10">
            <Lock className="h-8 w-8 text-[#1B4FCA]" />
          </span>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Unlock Market Data
        </h2>
        <p className="mb-8 text-gray-500">
          Get free access to live Conejo Valley market stats — updated every 24
          hours.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-[#1B4FCA] focus:outline-none focus:ring-1 focus:ring-[#1B4FCA]"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1B4FCA] py-3 text-sm font-semibold text-white transition hover:bg-[#1540A8] disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'View Market Data →'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}

// ─── Stat Card Component ─────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
  loading?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-[#1B4FCA]">{icon}</span>
      </div>
      {loading ? (
        <div className="h-8 w-28 animate-pulse rounded bg-gray-100" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      <div
        className={cn(
          'mt-2 flex items-center gap-1 text-sm font-medium',
          positive ? 'text-emerald-600' : 'text-red-500',
        )}
      >
        {positive ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        <span>{change}</span>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mk_market_email')
    if (saved) setUnlocked(true)
  }, [])

  // Fetch market data once unlocked
  useEffect(() => {
    if (!unlocked || fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    fetch('/api/market/pulse')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: MarketData) => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [unlocked])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">MasterKey</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/market" className="text-[#1B4FCA]">Market Pulse</Link>
            <Link href="/search" className="hover:text-gray-900">Search</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* ── Hero ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Conejo Valley{' '}
            <span className="text-[#1B4FCA]">Market Pulse</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Real-time housing data for Thousand Oaks, Westlake Village &amp;
            surrounding areas.
          </p>
        </div>

        {/* ── Gate / Content ── */}
        {!unlocked ? (
          <EmailGate onUnlock={email => setUnlocked(true)} />
        ) : (
          <>
            {/* ── Error ── */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                Failed to load market data: {error}
              </div>
            )}

            {/* ── Stat Cards ── */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Home className="h-5 w-5" />}
                label="Median Sale Price"
                value={data ? formatPrice(data.medianPrice) : '—'}
                change={
                  data
                    ? `${data.priceChange > 0 ? '+' : ''}${data.priceChange.toFixed(1)}% YoY`
                    : '—'
                }
                positive={!data || data.priceChange >= 0}
                loading={loading}
              />
              <StatCard
                icon={<Clock className="h-5 w-5" />}
                label="Avg Days on Market"
                value={data ? `${Math.round(data.daysOnMarket)} days` : '—'}
                change={
                  data
                    ? `${data.domChange > 0 ? '+' : ''}${data.domChange.toFixed(1)} days YoY`
                    : '—'
                }
                positive={!data || data.domChange <= 0}
                loading={loading}
              />
              <StatCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Active Listings"
                value={data ? `${data.activeListings}` : '—'}
                change={
                  data
                    ? `${data.inventoryChange > 0 ? '+' : ''}${data.inventoryChange.toFixed(1)}% MoM`
                    : '—'
                }
                positive={!data || data.inventoryChange >= 0}
                loading={loading}
              />
              <StatCard
                icon={<Percent className="h-5 w-5" />}
                label="30-yr Mortgage Rate"
                value={data ? `${data.mortgageRate.toFixed(2)}%` : '—'}
                change={
                  data
                    ? `${data.rateChange > 0 ? '+' : ''}${data.rateChange.toFixed(2)}% vs last month`
                    : '—'
                }
                positive={!data || data.rateChange <= 0}
                loading={loading}
              />
            </div>

            {/* ── Charts ── */}
            {data && (
              <div className="space-y-6">
                {/* Price Trend */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Median Sale Price — 12 Month Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data.priceHistory}>
                      <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B4FCA" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#1B4FCA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                        tick={{ fontSize: 12 }}
                        width={60}
                      />
                      <Tooltip formatter={formatTooltipPrice} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#1B4FCA"
                        strokeWidth={2}
                        fill="url(#priceGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Inventory + DOM */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Inventory &amp; Days on Market
                  </h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={data.inventoryHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Bar
                        yAxisId="left"
                        dataKey="listings"
                        fill="#1B4FCA"
                        opacity={0.7}
                        name="Active Listings"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="dom"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={false}
                        name="Days on Market"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Mortgage Rates */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    30-Year Fixed Mortgage Rate
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.mortgageHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={v => `${v.toFixed(1)}%`}
                        tick={{ fontSize: 12 }}
                        width={50}
                      />
                      <Tooltip formatter={formatTooltipRate} />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── Loading skeleton for charts ── */}
            {loading && (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl bg-white"
                  />
                ))}
              </div>
            )}

            {/* ── Footer ── */}
            {data && (
              <p className="mt-8 text-center text-xs text-gray-400">
                Data sourced from RentCast &amp; FRED. Last updated:{' '}
                {new Date(data.lastUpdated).toLocaleString()}.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
