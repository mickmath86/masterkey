import ThousandOaksGuide from "@/components/landing-pages/guides/thousand-oaks/page"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Thousand Oaks Neighborhood Guide | Detailed Area Ratings & Expert Reviews',
  description: 'Download your free Thousand Oaks neighborhood guide with expert video reviews and detailed ratings for 10 areas. Compare schools, amenities, transit, crime, and more to find your perfect community.',
  keywords: [
    'Thousand Oaks neighborhoods',
    'Thousand Oaks real estate guide',
    'Thousand Oaks area ratings',
    'best neighborhoods Thousand Oaks',
    'Thousand Oaks schools',
    'Thousand Oaks community guide',
    'Wildwood Thousand Oaks',
    'Conejo Valley neighborhoods',
    'Thousand Oaks home buying',
    'Thousand Oaks relocation guide'
  ],
  authors: [{ name: 'MasterKey Real Estate' }],
  openGraph: {
    title: 'Free Thousand Oaks Neighborhood Guide | Expert Area Ratings',
    description: 'Get expert video reviews and detailed ratings for 10 Thousand Oaks neighborhoods. Compare schools, amenities, transit, crime, and more.',
    url: 'https://masterkeyrealestate.com/landing/thousand-oaks',
    siteName: 'MasterKey Real Estate',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Beautiful homes in Thousand Oaks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Thousand Oaks Neighborhood Guide | Expert Area Ratings',
    description: 'Get expert video reviews and detailed ratings for 10 Thousand Oaks neighborhoods. Find your perfect community.',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80'],
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
  alternates: {
    canonical: 'https://masterkeyrealestate.com/landing/thousand-oaks',
  },
}

export default function ThousandOaksGuidePage() {
  return <ThousandOaksGuide />
}
