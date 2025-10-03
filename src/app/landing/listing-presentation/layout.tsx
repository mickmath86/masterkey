import type { Metadata } from 'next'

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
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Luxury modern house - MasterKey Real Estate Property Valuation',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Home\'s True Worth | MasterKey Real Estate',
    description: 'Get instant AI-powered insights on your property value and local market conditions.',
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80'],
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
