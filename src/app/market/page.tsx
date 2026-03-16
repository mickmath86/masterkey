'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ThousandOaksGuide from '@/components/landing-pages/guides/thousand-oaks-guide/page'
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
  Moon,
  Sun,
  Newspaper,
  Activity,
  MapPin,
  Gauge,
  LineChart as TrendingLineIcon,
  Calculator,
  Map,
  GraduationCap,
  Building2,
  AlertTriangle,
  DollarSign,
  Users,
  Shield,
  Flame,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

interface NewsArticle {
  title: string
  source: string
  date: string
  url: string
  excerpt: string
  imageUrl?: string
}

type MarketType = 'thousand-oaks' | 'westlake-village' | 'conejo-valley' | 'simi-valley' | 'camarillo'

type SectionType = 'snapshot' | 'trends' | 'affordability' | 'explorer' | 'community' | 'investor' | 'risk' | 'news' | 'scorecard'

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

// ─── Sidebar Navigation ─────────────────────────────────────────────────────

function AppSidebar({ 
  isDark, 
  activeSection, 
  onSectionChange 
}: { 
  isDark: boolean
  activeSection: SectionType
  onSectionChange: (section: SectionType) => void 
}) {
  const sections = [
    { id: 'snapshot' as SectionType, label: 'Snapshot', icon: Gauge },
    { id: 'trends' as SectionType, label: 'Trends', icon: TrendingLineIcon },
    { id: 'affordability' as SectionType, label: 'Affordability', icon: Calculator },
    { id: 'explorer' as SectionType, label: 'Explorer', icon: Map },
    { id: 'community' as SectionType, label: 'Community', icon: GraduationCap },
    { id: 'investor' as SectionType, label: 'Investor', icon: Building2 },
    { id: 'risk' as SectionType, label: 'Risk', icon: AlertTriangle },
    { id: 'scorecard' as SectionType, label: 'Scorecard', icon: BarChart3 },
    { id: 'news' as SectionType, label: 'News', icon: Newspaper },
  ]

  return (
    <Sidebar 
      collapsible="icon" 
      className={cn(isDark ? 'bg-black border-white/10' : 'bg-white border-black/10')}
      style={{
        backgroundColor: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}
    >
      <SidebarHeader className="border-b" style={{ 
        backgroundColor: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}>
        <div className="flex items-center gap-3 px-4 py-4">
          <Activity className={cn(
            'h-6 w-6 flex-shrink-0',
            isDark ? 'text-white' : 'text-gray-900'
          )} />
          <div className="group-data-[collapsible=icon]:hidden">
            <Image
              src={isDark ? '/logos/masterkey-inline-white.png' : '/logos/masterkey-black-inline.png'}
              alt="MasterKey"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <span className={cn(
              'text-xs block mt-1',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              Market Intelligence
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-4" style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(section.id)}
                    isActive={activeSection === section.id}
                    className={cn(
                      'px-4 py-3 transition-all',
                      activeSection === section.id
                        ? isDark
                          ? 'bg-white/5 text-white hover:bg-white/5'
                          : 'bg-black/5 text-black hover:bg-black/5'
                        : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        : 'text-gray-600 hover:text-black hover:bg-black/[0.02]'
                    )}
                  >
                    <section.icon className={cn(
                      'h-5 w-5 flex-shrink-0 transition-colors',
                      activeSection === section.id
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : ''
                    )} />
                    <span className={cn(
                      'font-medium text-[15px]',
                      activeSection === section.id ? 'font-semibold' : ''
                    )}>
                      {section.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// ─── Dark Mode Toggle ────────────────────────────────────────────────────────

function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full transition-colors',
        isDark ? 'bg-blue-600' : 'bg-gray-300'
      )}
      aria-label="Toggle dark mode"
    >
      <span
        className={cn(
          'inline-block h-7 w-7 transform rounded-full bg-white transition-transform',
          isDark ? 'translate-x-8' : 'translate-x-1'
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 m-auto mt-1.5 text-blue-600" />
        ) : (
          <Sun className="h-4 w-4 m-auto mt-1.5 text-yellow-500" />
        )}
      </span>
    </button>
  )
}

// ─── Market Tabs ──────────────────────────────────────────────────────────────

function MarketTabs({
  selected,
  onSelect,
  isDark,
}: {
  selected: MarketType
  onSelect: (m: MarketType) => void
  isDark: boolean
}) {
  const markets = [
    { id: 'thousand-oaks' as MarketType, name: 'Thousand Oaks' },
    { id: 'westlake-village' as MarketType, name: 'Westlake Village' },
    { id: 'conejo-valley' as MarketType, name: 'Conejo Valley' },
    { id: 'simi-valley' as MarketType, name: 'Simi Valley' },
    { id: 'camarillo' as MarketType, name: 'Camarillo' },
  ]

  return (
    <div className={cn(
      'inline-flex p-1 rounded-full',
      isDark ? 'bg-white/5' : 'bg-black/5'
    )}>
      {markets.map((market) => (
        <button
          key={market.id}
          onClick={() => onSelect(market.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selected === market.id
              ? isDark
                ? 'bg-white text-black'
                : 'bg-black text-white'
              : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-black'
          )}
        >
          {market.name}
        </button>
      ))}
    </div>
  )
}

// ─── Main Panel Renderer ─────────────────────────────────────────────────────

function MainPanel({ 
  activeSection, 
  isDark, 
  data, 
  loading 
}: { 
  activeSection: SectionType
  isDark: boolean
  data: any
  loading: boolean
}) {
  if (activeSection === 'snapshot') {
    return <SnapshotPanel isDark={isDark} data={data} loading={loading} />
  }
  if (activeSection === 'trends') {
    return <TrendsPanel isDark={isDark} data={data} loading={loading} />
  }
  if (activeSection === 'affordability') {
    return <AffordabilityPanel isDark={isDark} />
  }
  if (activeSection === 'explorer') {
    return <ExplorerPanel isDark={isDark} />
  }
  if (activeSection === 'community') {
    return <CommunityPanel isDark={isDark} />
  }
  if (activeSection === 'investor') {
    return <InvestorPanel isDark={isDark} data={data} />
  }
  if (activeSection === 'risk') {
    return <RiskPanel isDark={isDark} />
  }
  if (activeSection === 'news') {
    return <NewsPanel isDark={isDark} />
  }
  if (activeSection === 'scorecard') {
    return <ScorecardPanel isDark={isDark} />
  }
  return null
}

// ─── Snapshot Panel ──────────────────────────────────────────────────────────

function SnapshotPanel({ isDark, data, loading }: { isDark: boolean; data: any; loading: boolean }) {
  const marketCondition = data?.priceChange > 3 ? 'Seller\'s Market' : data?.priceChange < -3 ? 'Buyer\'s Market' : 'Balanced Market'
  const conditionColor = data?.priceChange > 3 ? 'text-red-500' : data?.priceChange < -3 ? 'text-green-500' : 'text-yellow-500'

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Market Snapshot
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Today's key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-b py-8" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <StatCard icon={<Home className="h-5 w-5" />} label="Median Price" value={data ? `$${data.medianPrice.toLocaleString()}` : '—'} change={data ? `${data.priceChange > 0 ? '+' : ''}${data.priceChange.toFixed(1)}% YoY` : '—'} positive={data?.priceChange > 0} loading={loading} isDark={isDark} />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Days on Market" value={data?.daysOnMarket?.toString() || '—'} change={data ? `${data.domChange > 0 ? '+' : ''}${data.domChange.toFixed(1)}% YoY` : '—'} positive={data?.domChange < 0} loading={loading} isDark={isDark} />
        <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Active Listings" value={data?.activeListings?.toLocaleString() || '—'} change={data ? `${data.inventoryChange > 0 ? '+' : ''}${data.inventoryChange.toFixed(1)}% YoY` : '—'} positive={data?.inventoryChange > 0} loading={loading} isDark={isDark} />
        <StatCard icon={<Percent className="h-5 w-5" />} label="30-Year Rate" value={data ? `${data.mortgageRate.toFixed(2)}%` : '—'} change={data ? `${data.rateChange > 0 ? '+' : ''}${data.rateChange.toFixed(2)}%` : '—'} positive={data?.rateChange < 0} loading={loading} isDark={isDark} />
      </div>
    </div>
  )
}

// ─── Trends Panel ────────────────────────────────────────────────────────────

function TrendsPanel({ isDark, data, loading }: { isDark: boolean; data: any; loading: boolean }) {
  // Calculate price change for Robinhood-style display with safety checks
  const priceChange = data?.priceHistory && data.priceHistory.length > 0 ? 
    ((data.priceHistory[data.priceHistory.length - 1]?.price - data.priceHistory[0]?.price) / data.priceHistory[0]?.price * 100).toFixed(2) 
    : '0'
  const isPositive = Number(priceChange) >= 0

  // Safety check for data availability
  const hasValidData = data?.priceHistory && data.priceHistory.length > 0 && data?.inventoryHistory && data.inventoryHistory.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Trends & Forecasts
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          12-month price trends and market activity
        </p>
      </div>

      {hasValidData && (
        <>
          {/* Price Chart - Robinhood Style */}
          <div className="py-6">
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <h3 className={cn('text-5xl font-bold', isDark ? 'text-white' : 'text-black')}>
                  ${(data.priceHistory[data.priceHistory.length - 1].price / 1000).toFixed(0)}K
                </h3>
                <span className={cn('text-2xl font-semibold', isPositive ? 'text-green-500' : 'text-red-500')}>
                  {isPositive ? '+' : ''}{priceChange}%
                </span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Median Sale Price (Past Year)
              </p>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.priceHistory}>
                <defs>
                  <linearGradient id="priceGradRH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="transparent" />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#374151' : '#E5E7EB'} 
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="transparent"
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  domain={['dataMin - 20000', 'dataMax + 20000']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000' : '#fff', 
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, 
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                  labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '12px', marginBottom: '4px' }} 
                  itemStyle={{ color: isPositive ? '#10B981' : '#EF4444', fontSize: '16px', fontWeight: '600' }} 
                  formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, '']}
                  cursor={{ stroke: isDark ? '#374151' : '#E5E7EB', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? '#10B981' : '#EF4444'} 
                  strokeWidth={2.5} 
                  fill="url(#priceGradRH)"
                  dot={false}
                  activeDot={{ r: 6, fill: isPositive ? '#10B981' : '#EF4444', stroke: isDark ? '#000' : '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Chart - Robinhood Style */}
          <div className="py-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <h3 className={cn('text-5xl font-bold', isDark ? 'text-white' : 'text-black')}>
                  {data.inventoryHistory[data.inventoryHistory.length - 1].listings}
                </h3>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Active Listings
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.inventoryHistory}>
                <CartesianGrid strokeDasharray="0" stroke="transparent" />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#374151' : '#E5E7EB'} 
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="transparent"
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000' : '#fff', 
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, 
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                  labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '12px', marginBottom: '4px' }} 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Bar 
                  dataKey="listings" 
                  fill={isDark ? '#3B82F6' : '#2563EB'} 
                  radius={[4, 4, 0, 0]}
                  name="Listings"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Days on Market - Robinhood Style Line */}
          <div className="py-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <h3 className={cn('text-5xl font-bold', isDark ? 'text-white' : 'text-black')}>
                  {data.inventoryHistory[data.inventoryHistory.length - 1].dom}
                </h3>
                <span className={cn('text-base', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  days
                </span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Average Days on Market
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.inventoryHistory}>
                <CartesianGrid strokeDasharray="0" stroke="transparent" />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#374151' : '#E5E7EB'} 
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="transparent"
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  tick={{ fill: isDark ? '#6B7280' : '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000' : '#fff', 
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, 
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                  labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '12px', marginBottom: '4px' }} 
                  itemStyle={{ color: '#F59E0B', fontSize: '16px', fontWeight: '600' }} 
                  formatter={(value: number) => [`${value} days`, '']}
                  cursor={{ stroke: isDark ? '#374151' : '#E5E7EB', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="dom" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#F59E0B', stroke: isDark ? '#000' : '#fff', strokeWidth: 2 }}
                  name="Days on Market"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Affordability Panel ─────────────────────────────────────────────────────

function AffordabilityPanel({ isDark }: { isDark: boolean }) {
  const [income, setIncome] = useState(100000)
  const [debt, setDebt] = useState(500)
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(6.75) // Current average rate

  const maxHomePrice = Math.floor((income * 0.28 - debt * 12) / (interestRate / 100 / 12) * (1 - Math.pow(1 + interestRate / 100 / 12, -360)))
  const monthlyPayment = Math.floor(maxHomePrice * (1 - downPayment / 100) * (interestRate / 100 / 12) / (1 - Math.pow(1 + interestRate / 100 / 12, -360)))

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Affordability Calculator
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Calculate your buying power
        </p>
      </div>

      {/* Explanation Callout */}
      <div className={cn(
        'rounded-lg p-6 border-l-4',
        isDark 
          ? 'bg-blue-950/30 border-blue-400 text-blue-100' 
          : 'bg-blue-50 border-blue-600 text-blue-900'
      )}>
        <div className="flex items-start gap-3">
          <Info className={cn('h-5 w-5 flex-shrink-0 mt-0.5', isDark ? 'text-blue-400' : 'text-blue-600')} />
          <div>
            <h4 className={cn('font-semibold mb-2', isDark ? 'text-blue-300' : 'text-blue-900')}>
              How This Calculator Works
            </h4>
            <p className={cn('text-sm leading-relaxed', isDark ? 'text-blue-200' : 'text-blue-800')}>
              This calculator uses the 28% rule, which suggests your monthly housing payment should not exceed 28% of your gross monthly income. 
              Enter your financial details below to see your estimated maximum home price and monthly payment based on a 30-year fixed mortgage.
            </p>
          </div>
        </div>
      </div>

      <div className="py-6">
        <h3 className={cn('font-bold mb-6 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
          <Calculator className="h-5 w-5" />
          Your Financial Details
        </h3>

        <div className="space-y-6">
          <div>
            <label className={cn('text-sm font-medium block mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Annual Income
            </label>
            <div className="relative">
              <span className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>$</span>
              <input 
                type="number" 
                min="30000" 
                max="500000" 
                step="5000" 
                value={income} 
                onChange={(e) => setIncome(Number(e.target.value))} 
                className={cn(
                  'w-full pl-7 pr-4 py-3 rounded-lg border text-base font-medium',
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Monthly Debt Payments
              </label>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex">
                      <Info className={cn('h-4 w-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Include all recurring monthly debt payments such as car loans, student loans, credit card minimum payments, and other installment debts. Do not include utilities or living expenses.
                    </p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            <div className="relative">
              <span className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>$</span>
              <input 
                type="number" 
                min="0" 
                max="5000" 
                step="50" 
                value={debt} 
                onChange={(e) => setDebt(Number(e.target.value))} 
                className={cn(
                  'w-full pl-7 pr-4 py-3 rounded-lg border text-base font-medium',
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
            </div>
          </div>

          <div>
            <label className={cn('text-sm font-medium block mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Down Payment Percentage
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="3" 
                max="50" 
                step="1" 
                value={downPayment} 
                onChange={(e) => setDownPayment(Number(e.target.value))} 
                className={cn(
                  'w-full pl-4 pr-8 py-3 rounded-lg border text-base font-medium',
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
              <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>%</span>
            </div>
          </div>

          <div>
            <label className={cn('text-sm font-medium block mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Interest Rate (Current Avg: 6.75%)
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="3" 
                max="12" 
                step="0.125" 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))} 
                className={cn(
                  'w-full pl-4 pr-8 py-3 rounded-lg border text-base font-medium',
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
              <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>%</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={cn('text-sm font-medium mb-3', isDark ? 'text-gray-500' : 'text-gray-600')}>Max Home Price</p>
                <p className={cn('text-4xl font-bold', isDark ? 'text-white' : 'text-black')}>${maxHomePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className={cn('text-sm font-medium mb-3', isDark ? 'text-gray-500' : 'text-gray-600')}>Monthly Payment</p>
                <p className={cn('text-4xl font-bold', isDark ? 'text-white' : 'text-black')}>${monthlyPayment.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Explorer Panel ──────────────────────────────────────────────────────────

function ExplorerPanel({ isDark }: { isDark: boolean }) {
  const areas = [
    { name: 'Ventura', medianPrice: 725000, pricePerSqFt: 485, dom: 32, appreciation: 8.2 },
    { name: 'Oxnard', medianPrice: 650000, pricePerSqFt: 425, dom: 28, appreciation: 7.5 },
    { name: 'Thousand Oaks', medianPrice: 895000, pricePerSqFt: 545, dom: 35, appreciation: 9.1 },
    { name: 'Camarillo', medianPrice: 785000, pricePerSqFt: 495, dom: 30, appreciation: 8.7 },
    { name: 'Simi Valley', medianPrice: 715000, pricePerSqFt: 465, dom: 29, appreciation: 7.9 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Neighborhood Explorer
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Compare areas across Ventura County
        </p>
      </div>

      <div className="space-y-4">
        {areas.map((area) => (
          <div key={area.name} className={cn('py-6 border-b transition-colors cursor-pointer', isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-black/10 hover:bg-black/[0.02]')}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>{area.name}</h3>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Click to explore detailed stats</p>
              </div>
              <MapPin className={cn('h-6 w-6', isDark ? 'text-blue-400' : 'text-blue-600')} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className={cn('text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-500')}>Median Price</p>
                <p className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>${(area.medianPrice / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className={cn('text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-500')}>Price/SqFt</p>
                <p className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>${area.pricePerSqFt}</p>
              </div>
              <div>
                <p className={cn('text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-500')}>Days on Market</p>
                <p className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>{area.dom}</p>
              </div>
              <div>
                <p className={cn('text-xs mb-1', isDark ? 'text-gray-500' : 'text-gray-500')}>YoY Growth</p>
                <p className="font-bold text-green-500">+{area.appreciation}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Community Panel ─────────────────────────────────────────────────────────

function CommunityPanel({ isDark }: { isDark: boolean }) {
  const [activeTab, setActiveTab] = useState<'schools' | 'commute' | 'demographics'>('schools')

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          School & Community
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Quality of life metrics
        </p>
      </div>

      <div className="flex gap-2 border-b pb-2" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
        {[
          { id: 'schools' as const, label: 'Schools', icon: GraduationCap },
          { id: 'commute' as const, label: 'Commute', icon: Clock },
          { id: 'demographics' as const, label: 'Demographics', icon: Users },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === tab.id ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'))}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'schools' && (
        <div className="space-y-6">
          {[
            { title: 'Avg School Rating', value: '8.2/10', description: 'Based on GreatSchools data', source: 'GreatSchools.org' },
            { title: 'Top Rated School', value: 'Westlake High', description: '9.5 rating, 1.2 miles away', source: 'CA Dept of Ed' },
            { title: 'Student-Teacher Ratio', value: '18:1', description: 'District average', source: 'CA Dept of Ed' },
          ].map((item, idx) => (
            <div key={idx} className="py-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className={cn('font-medium text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>{item.title}</h4>
                <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>{item.value}</span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'commute' && (
        <div className="space-y-6">
          {[
            { destination: 'Downtown LA', time: '65 min', mode: 'Driving' },
            { destination: 'Santa Barbara', time: '45 min', mode: 'Driving' },
            { destination: 'Burbank Airport', time: '55 min', mode: 'Driving' },
          ].map((item, idx) => (
            <div key={idx} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={cn('font-medium', isDark ? 'text-white' : 'text-black')}>{item.destination}</h4>
                  <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>{item.mode}</p>
                </div>
                <span className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-black')}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'demographics' && (
        <div className="space-y-6">
          {[
            { title: 'Median Income', value: '$98,500', description: 'Household median', source: 'Census API' },
            { title: 'Population', value: '127,000', description: 'City population', source: 'Census API' },
            { title: 'Home Ownership', value: '68%', description: 'Owner occupied', source: 'Census API' },
          ].map((item, idx) => (
            <div key={idx} className="py-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className={cn('font-medium text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>{item.title}</h4>
                <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>{item.value}</span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Investor Panel ──────────────────────────────────────────────────────────

function InvestorPanel({ isDark, data }: { isDark: boolean; data: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Investor View
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Yield metrics and investment analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-b py-8" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Rent-to-Price Ratio</span>
          <div className={cn('text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>0.58%</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Monthly rent / Purchase price</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Est. Cap Rate</span>
          <div className={cn('text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>4.2%</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Net operating income / Value</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>5-Year Appreciation</span>
          <div className={cn('text-4xl font-bold mb-2 text-green-500')}>+42%</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Historical price growth</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Avg Rent Growth</span>
          <div className={cn('text-4xl font-bold mb-2 text-green-500')}>+6.8%</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Annual rent increase</p>
        </div>
      </div>
    </div>
  )
}

// ─── Risk Panel ──────────────────────────────────────────────────────────────

function RiskPanel({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Risk & Resilience
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Hazards, insurance, and property tax
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-b py-8" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Wildfire Risk</span>
          <div className={cn('text-4xl font-bold mb-2 text-orange-500')}>Moderate</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Some areas in high fire zones</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Flood Risk</span>
          <div className={cn('text-4xl font-bold mb-2 text-blue-500')}>Low</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Minimal flood zones</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Avg Property Tax</span>
          <div className={cn('text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>1.1%</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Of assessed value annually</p>
        </div>

        <div className="py-4">
          <span className={cn('text-sm font-medium mb-3 block', isDark ? 'text-gray-500' : 'text-gray-600')}>Avg Insurance</span>
          <div className={cn('text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>$2,400/yr</div>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>Homeowners insurance premium</p>
        </div>
      </div>
    </div>
  )
}

// ─── Scorecard Panel ─────────────────────────────────────────────────────────

function ScorecardPanel({ isDark }: { isDark: boolean }) {
  // Import neighborhood data from the guide
  const neighborhoods = [
    {
      name: 'Wildwood',
      score: 8.8,
      metrics: { amenities: 7, transit: 8, schools: 9, economic: 9, health: 10, crime: 10, value: 8, space: 9 },
    },
    {
      name: 'Conejo Oaks Area',
      score: 8.0,
      metrics: { amenities: 8, transit: 7, schools: 9, economic: 8, health: 8, crime: 9, value: 6, space: 9 },
    },
    {
      name: 'North Central TO',
      score: 7.9,
      metrics: { amenities: 8, transit: 7, schools: 8, economic: 8, health: 8, crime: 9, value: 7, space: 8 },
    },
    {
      name: 'Northeast TO',
      score: 8.1,
      metrics: { amenities: 8, transit: 7, schools: 9, economic: 9, health: 8, crime: 9, value: 8, space: 8 },
    },
    {
      name: 'Hillcrest East',
      score: 8.0,
      metrics: { amenities: 9, transit: 8, schools: 8, economic: 8, health: 8, crime: 9, value: 7, space: 7 },
    },
    {
      name: 'Thousand Oaks South',
      score: 9.0,
      metrics: { amenities: 9, transit: 9, schools: 9, economic: 9, health: 10, crime: 10, value: 8, space: 8 },
    },
    {
      name: 'Sunset Hills / Copperwood',
      score: 7.3,
      metrics: { amenities: 5, transit: 3, schools: 9, economic: 8, health: 8, crime: 9, value: 7, space: 9 },
    },
    {
      name: 'Shadow Oaks / Eichler',
      score: 7.3,
      metrics: { amenities: 7, transit: 6, schools: 5, economic: 8, health: 8, crime: 9, value: 7, space: 8 },
    },
    {
      name: 'Kevington / New Meadows',
      score: 8.4,
      metrics: { amenities: 8, transit: 6, schools: 10, economic: 9, health: 9, crime: 10, value: 6, space: 9 },
    },
    {
      name: 'Lynn Ranch',
      score: 7.8,
      metrics: { amenities: 7, transit: 6, schools: 7, economic: 9, health: 8, crime: 9, value: 7, space: 9 },
    },
  ]

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhoods[0])

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          Neighborhood Scorecard
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Comprehensive area comparison and analysis
        </p>
      </div>

      {/* Neighborhood Selector - Robinhood Style */}
      <div className="space-y-6">
        {/* Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {neighborhoods.map((neighborhood) => (
            <button
              key={neighborhood.name}
              onClick={() => setSelectedNeighborhood(neighborhood)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                selectedNeighborhood.name === neighborhood.name
                  ? isDark
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-green-50 text-green-700 border border-green-200'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {neighborhood.name}
            </button>
          ))}
        </div>

        {/* Score Display */}
        <div className="py-6">
          <p className={cn('text-sm font-medium mb-3', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Overall Score
          </p>
          <div className="flex items-baseline gap-2 mb-8">
            <h3 className={cn('text-6xl font-bold', isDark ? 'text-white' : 'text-black')}>
              {selectedNeighborhood.score}
            </h3>
            <span className={cn('text-2xl', isDark ? 'text-gray-500' : 'text-gray-400')}>/ 10</span>
          </div>

          {/* Category Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(selectedNeighborhood.metrics).map(([key, value]) => (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm font-medium capitalize', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    {key}
                  </span>
                  <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
                    {value}
                  </span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-gray-800' : 'bg-gray-200')}>
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Thousand Oaks Guide - Keep all existing content */}
      <div className={cn(
        'rounded-lg overflow-hidden border-t pt-8',
        isDark ? 'bg-white' : 'bg-white'
      )}
      style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      >
        <ThousandOaksGuide />
      </div>
    </div>
  )
}

// ─── News Panel ──────────────────────────────────────────────────────────────

function NewsPanel({ isDark }: { isDark: boolean }) {
  const mockNews = [
    { title: 'Ventura County Home Sales Up 12% in Q1', source: 'Ventura County Star', date: '2 hours ago', url: '#', excerpt: 'Strong buyer activity pushes sales volume to highest level since 2021...', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop' },
    { title: 'New Housing Development Approved in Camarillo', source: 'Local Planning Commission', date: '5 hours ago', url: '#', excerpt: 'Mixed-use project will bring 200 new units to east Camarillo...', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop' },
    { title: 'Mortgage Rates Drop Below 6.5% Locally', source: 'Ventura Mortgage News', date: '1 day ago', url: '#', excerpt: 'Local lenders report increased refinance activity as rates decline...', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop' },
    { title: 'Thousand Oaks Inventory Levels Rise', source: 'Market Watch', date: '2 days ago', url: '#', excerpt: 'More homes hitting the market as spring season begins...' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-black')}>
          News & Alerts
        </h2>
        <p className={cn('text-base', isDark ? 'text-gray-500' : 'text-gray-600')}>
          Latest housing news
        </p>
      </div>

      <div className="space-y-4">
        {mockNews.map((article, idx) => (
          <motion.a key={idx} href={article.url} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={cn('block transition-all overflow-hidden border-b pb-6', isDark ? 'border-white/10 hover:opacity-80' : 'border-black/10 hover:opacity-80')}>
            {article.imageUrl && (
              <div className="relative w-full h-48 overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            )}
            <div className="p-6">
              <h3 className={cn('font-semibold text-lg mb-2', isDark ? 'text-white' : 'text-gray-900')}>{article.title}</h3>
              <p className={cn('text-sm mb-3', isDark ? 'text-gray-400' : 'text-gray-600')}>{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className={cn('text-xs font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>{article.source}</span>
                <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>{article.date}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

// ─── News Sidebar ─────────────────────────────────────────────────────────────

function NewsSidebar({ isDark }: { isDark: boolean }) {
  // Mock news data - will be replaced with RSS feed
  const mockNews: NewsArticle[] = [
    {
      title: 'Housing Market Shows Strong Growth in Q1',
      source: 'Real Estate News',
      date: '2 hours ago',
      url: '#',
      excerpt: 'Local housing market continues upward trend with increased buyer activity...',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop'
    },
    {
      title: 'Mortgage Rates Drop to Lowest Level This Year',
      source: 'Financial Times',
      date: '5 hours ago',
      url: '#',
      excerpt: '30-year fixed rates fall below 6% for first time since...',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop'
    },
    {
      title: 'New Development Approved in Westlake Village',
      source: 'Local News',
      date: '1 day ago',
      url: '#',
      excerpt: 'City council approves mixed-use development project...',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'
    },
    {
      title: 'Inventory Levels Rise in Conejo Valley',
      source: 'Market Watch',
      date: '2 days ago',
      url: '#',
      excerpt: 'More homes hitting the market as spring season begins...'
      // No imageUrl - testing fallback
    },
  ]

  return (
    <div className={cn(
      'rounded-lg p-6 h-full',
      isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
    )}>
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className={cn('h-5 w-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
        <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
          Market News
        </h2>
      </div>
      <div className="space-y-4">
        {mockNews.map((article, idx) => (
          <motion.a
            key={idx}
            href={article.url}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              'block rounded-lg transition-all overflow-hidden',
              isDark
                ? 'bg-gray-900/50 hover:bg-gray-900 border border-gray-700'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
            )}
          >
            {article.imageUrl && (
              <div className="relative w-full h-32 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className={cn(
                'font-semibold text-sm mb-2 line-clamp-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {article.title}
              </h3>
              <p className={cn(
                'text-xs mb-2 line-clamp-2',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs font-medium',
                  isDark ? 'text-blue-400' : 'text-blue-600'
                )}>
                  {article.source}
                </span>
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {article.date}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
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
  isDark,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
  loading?: boolean
  isDark?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6"
    >
      <div className="mb-3">
        <span className={cn(
          'text-sm font-medium',
          isDark ? 'text-gray-500' : 'text-gray-600'
        )}>
          {label}
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className={cn(
            'h-10 w-40 animate-pulse rounded',
            isDark ? 'bg-white/5' : 'bg-black/5'
          )} />
          <div className={cn(
            'h-5 w-24 animate-pulse rounded',
            isDark ? 'bg-white/5' : 'bg-black/5'
          )} />
        </div>
      ) : (
        <>
          <div className={cn(
            'mb-2 text-4xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-black'
          )}>
            {value}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'text-sm font-medium',
                positive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {change}
            </span>
          </div>
        </>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// Toggle this to disable/enable email gate
const ENABLE_EMAIL_GATE = false

// Toggle this to use dummy data instead of API
const USE_DUMMY_DATA = true

// Dummy data for development/testing
const DUMMY_MARKET_DATA: MarketData = {
  medianPrice: 895000,
  priceChange: 8.5,
  daysOnMarket: 32,
  domChange: -5.2,
  activeListings: 245,
  inventoryChange: 12.3,
  mortgageRate: 6.75,
  rateChange: -0.25,
  lastUpdated: new Date().toISOString(),
  source: 'Dummy Data',
  priceHistory: [
    { month: 'Jan', price: 825000 },
    { month: 'Feb', price: 835000 },
    { month: 'Mar', price: 842000 },
    { month: 'Apr', price: 855000 },
    { month: 'May', price: 860000 },
    { month: 'Jun', price: 868000 },
    { month: 'Jul', price: 875000 },
    { month: 'Aug', price: 880000 },
    { month: 'Sep', price: 885000 },
    { month: 'Oct', price: 888000 },
    { month: 'Nov', price: 892000 },
    { month: 'Dec', price: 895000 },
  ],
  inventoryHistory: [
    { month: 'Jan', listings: 180, dom: 42 },
    { month: 'Feb', listings: 195, dom: 40 },
    { month: 'Mar', listings: 210, dom: 38 },
    { month: 'Apr', listings: 225, dom: 36 },
    { month: 'May', listings: 235, dom: 35 },
    { month: 'Jun', listings: 240, dom: 34 },
    { month: 'Jul', listings: 238, dom: 33 },
    { month: 'Aug', listings: 242, dom: 32 },
    { month: 'Sep', listings: 245, dom: 32 },
    { month: 'Oct', listings: 243, dom: 31 },
    { month: 'Nov', listings: 244, dom: 32 },
    { month: 'Dec', listings: 245, dom: 32 },
  ],
  mortgageHistory: [
    { date: '2024-01', rate: 7.0 },
    { date: '2024-02', rate: 6.95 },
    { date: '2024-03', rate: 6.90 },
    { date: '2024-04', rate: 6.88 },
    { date: '2024-05', rate: 6.85 },
    { date: '2024-06', rate: 6.82 },
    { date: '2024-07', rate: 6.80 },
    { date: '2024-08', rate: 6.78 },
    { date: '2024-09', rate: 6.76 },
    { date: '2024-10', rate: 6.75 },
    { date: '2024-11', rate: 6.75 },
    { date: '2024-12', rate: 6.75 },
  ],
}

export default function MarketPage() {
  const [unlocked, setUnlocked] = useState(!ENABLE_EMAIL_GATE)
  const [data, setData] = useState<MarketData | null>(USE_DUMMY_DATA ? DUMMY_MARKET_DATA : null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('thousand-oaks')
  const [activeSection, setActiveSection] = useState<SectionType>('snapshot')
  const fetchedRef = useRef(false)

  // Check localStorage on mount
  useEffect(() => {
    if (ENABLE_EMAIL_GATE) {
      const saved = localStorage.getItem('mk_market_email')
      if (saved) setUnlocked(true)
    }
  }, [])

  // Fetch market data once unlocked (skip if using dummy data)
  useEffect(() => {
    if (USE_DUMMY_DATA) return // Skip API call when using dummy data
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
    <SidebarProvider defaultOpen={true}>
      <AppSidebar isDark={isDark} activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset className={cn(
        'min-h-screen transition-colors duration-300',
        isDark
          ? 'bg-black text-white'
          : 'bg-white text-gray-900'
      )}>
        {/* ── Nav ── */}
        <header className={cn(
          'sticky top-0 z-50 backdrop-blur-md transition-colors border-b',
          isDark
            ? 'bg-black/80 border-white/10'
            : 'bg-white/80 border-black/10'
        )}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className={cn('h-7 w-7', isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10')} />
            </div>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link href="/" className={cn(
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}>
                  Home
                </Link>
                <Link href="/market" className={cn(
                  isDark ? 'text-blue-400' : 'text-blue-600'
                )}>
                  Market Pulse
                </Link>
              </nav>
              <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </div>
        </header>

        <main className="px-6 py-6">
          {/* ── Hero ── */}
          <div className="mb-6">
            <div className="mb-8">
              <h1 className={cn(
                'text-5xl font-bold tracking-tight mb-2',
                isDark ? 'text-white' : 'text-black'
              )}>
                Market Intelligence
              </h1>
              <p className={cn(
                'text-base',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Real-time housing data and market analytics
              </p>
            </div>
            {/* Only show market tabs for specific sections */}
            {['snapshot', 'trends', 'explorer', 'community', 'investor', 'risk'].includes(activeSection) && (
              <MarketTabs selected={selectedMarket} onSelect={setSelectedMarket} isDark={isDark} />
            )}
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

            {/* ── Main Content Area - Dynamic Panels ── */}
            <div className="max-w-7xl mx-auto">
              <MainPanel 
                activeSection={activeSection} 
                isDark={isDark} 
                data={data} 
                loading={loading} 
              />
            </div>

            {/* Old content below - keeping for reference, will be removed */}
            <div className="hidden grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Stats and Charts */}
              <div className="lg:col-span-2 space-y-6">
                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    isDark={isDark}
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
                    isDark={isDark}
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
                    isDark={isDark}
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
                    isDark={isDark}
                  />
                </div>

                {/* ── Charts ── */}
                {data && (
                  <div className="space-y-6">
                    {/* Price Trend */}
                    <div className={cn(
                      'rounded-lg p-6 backdrop-blur-sm',
                      isDark
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-white border border-gray-200 shadow-sm'
                    )}>
                      <h2 className={cn(
                        'mb-4 text-lg font-semibold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        Median Sale Price — 12 Month Trend
                      </h2>
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={data.priceHistory}>
                          <defs>
                            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isDark ? '#3B82F6' : '#1B4FCA'} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={isDark ? '#3B82F6' : '#1B4FCA'} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                          <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                          <YAxis
                            tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                            tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                            width={60}
                          />
                          <Tooltip
                            formatter={formatTooltipPrice}
                            contentStyle={{
                              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                              borderRadius: '8px',
                              color: isDark ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={isDark ? '#3B82F6' : '#1B4FCA'}
                            strokeWidth={2}
                            fill="url(#priceGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Inventory + DOM */}
                    <div className={cn(
                      'rounded-lg p-6 backdrop-blur-sm',
                      isDark
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-white border border-gray-200 shadow-sm'
                    )}>
                      <h2 className={cn(
                        'mb-4 text-lg font-semibold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        Inventory &amp; Days on Market
                      </h2>
                      <ResponsiveContainer width="100%" height={240}>
                        <ComposedChart data={data.inventoryHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                          <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                              borderRadius: '8px',
                              color: isDark ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="listings"
                            fill={isDark ? '#3B82F6' : '#1B4FCA'}
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
                    <div className={cn(
                      'rounded-lg p-6 backdrop-blur-sm',
                      isDark
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-white border border-gray-200 shadow-sm'
                    )}>
                      <h2 className={cn(
                        'mb-4 text-lg font-semibold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        30-Year Fixed Mortgage Rate
                      </h2>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data.mortgageHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                          <YAxis
                            domain={['auto', 'auto']}
                            tickFormatter={v => `${v.toFixed(1)}%`}
                            tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                            width={50}
                          />
                          <Tooltip
                            formatter={formatTooltipRate}
                            contentStyle={{
                              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                              borderRadius: '8px',
                              color: isDark ? '#F9FAFB' : '#111827'
                            }}
                          />
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
              </div>

              {/* Right Column - News Sidebar */}
              <div className="lg:col-span-1">
                <NewsSidebar isDark={isDark} />
              </div>
            </div>

            {/* ── Loading skeleton for charts ── */}
            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={cn(
                        'h-64 animate-pulse rounded-lg',
                        isDark ? 'bg-gray-800' : 'bg-white'
                      )}
                    />
                  ))}
                </div>
                <div className={cn(
                  'h-96 animate-pulse rounded-lg',
                  isDark ? 'bg-gray-800' : 'bg-white'
                )} />
              </div>
            )}

            {/* ── Footer ── */}
            {data && (
              <div className={cn(
                'mt-8 p-4 rounded-lg text-center',
                isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
              )}>
                <p className={cn(
                  'text-xs',
                  isDark ? 'text-gray-400' : 'text-gray-500'
                )}>
                  <span className="font-semibold">Market:</span> {selectedMarket.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • 
                  <span className="font-semibold">Data Sources:</span> RentCast, FRED, RSS Feeds • 
                  <span className="font-semibold">Last Updated:</span> {new Date(data.lastUpdated).toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
