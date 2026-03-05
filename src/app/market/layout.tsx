import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conejo Valley Market Pulse',
  description:
    'Real-time market data for Thousand Oaks, Westlake Village, and the greater Conejo Valley. Track median prices, inventory, days on market, and mortgage rates.',
  openGraph: {
    title: 'Conejo Valley Market Pulse | MasterKey',
    description:
      'Real-time market data for Thousand Oaks, Westlake Village, and the greater Conejo Valley. Track median prices, inventory, days on market, and mortgage rates.',
    type: 'website',
  },
}

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
