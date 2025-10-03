import { Metadata } from 'next'

// OpenGraph metadata for listing presentation landing page
export const metadata: Metadata = {
  title: 'Discover Your Home\'s True Worth | MasterKey Real Estate',
  description: 'Get instant AI-powered insights on your property value and local market conditions. Simply enter your address to unlock comprehensive analysis and data-driven recommendations.',
  keywords: [
    'property valuation',
    'home value',
    'real estate analysis',
    'market analysis',
    'AI property insights',
    'listing presentation',
    'home worth',
    'property market data',
    'real estate agent',
    'property assessment',
    'market conditions',
    'home selling'
  ],
  openGraph: {
    title: 'Discover Your Home\'s True Worth | MasterKey Real Estate',
    description: 'Get instant AI-powered insights on your property value and local market conditions. Enter your address for comprehensive analysis.',
    type: 'website',
    url: 'https://masterkey.com/landing/listing-presentation',
    siteName: 'MasterKey Real Estate',
    images: [
      {
        url: '/og-listing-presentation.jpg',
        width: 1200,
        height: 630,
        alt: 'MasterKey Real Estate - Property Valuation Analysis',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Home\'s True Worth | MasterKey Real Estate',
    description: 'Get instant AI-powered insights on your property value and local market conditions.',
    images: ['/og-listing-presentation.jpg'],
    creator: '@masterkeyrealestate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://masterkey.com/landing/listing-presentation',
  },
  category: 'Real Estate',
}

export default function ListingPresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
