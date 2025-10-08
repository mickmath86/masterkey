import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { PropertyDataProvider } from '@/contexts/PropertyDataContext'
import { Analytics } from '@vercel/analytics/react'
import UtmBootstrap from '@/components/UtmBootstrap'

export const metadata: Metadata = {
  title: {
    template: '%s - MasterKey',
    default: 'MasterKey - Real Estate & Property Management',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `
        }} />
        <GoogleTagManager gtmId="GTM-WTJD5VKJ" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
      </head>
      <body className="text-gray-950 antialiased">
      {/* <!-- Google Tag Manager (noscript) --> */}
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WTJD5VKJ"
      height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>

        <PropertyDataProvider>
          {children}
          <UtmBootstrap />
        </PropertyDataProvider>
        <Analytics />
      </body>
    </html>
  )
}
