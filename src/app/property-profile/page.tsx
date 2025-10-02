'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyDataModule } from '@/components/property-data-module'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { usePropertyData } from '@/contexts/PropertyDataContext'

function PropertyProfileContent() {
    const searchParams = useSearchParams()
    const address = searchParams.get('address')

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