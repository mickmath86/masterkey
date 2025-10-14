'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyDataModule } from '@/components/property-data-module'
import { PropertyLoadingSequence } from '@/components/property-loading-sequence'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { usePropertyData } from '@/contexts/PropertyDataContext'

function PropertyProfileContent() {
    const searchParams = useSearchParams()
    const address = searchParams.get('address')
    const [showLoading, setShowLoading] = useState(true)

    // Track Facebook Meta Pixel Lead event when property profile loads successfully
    useEffect(() => {
        if (!showLoading && address) {
            // Fire Facebook Meta Pixel Lead event
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead');
                console.log('📊 Facebook Meta Pixel Lead event fired for property profile:', address);
            }
        }
    }, [showLoading, address])

    if (!address) {
        return (
            <>
                <Navbar3 />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Property Profile
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            No property address provided. Please go back and enter a property address.
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (showLoading) {
        return (
            <PropertyLoadingSequence 
                address={address}
                onComplete={() => setShowLoading(false)}
            />
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <PropertyDataModule address={address} />
            </div>
            <Footer />
        </>
    )
}

export default function PropertyProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your property profile...</p>
                </div>
            </div>
        }>
            <PropertyProfileContent />
        </Suspense>
    )
}