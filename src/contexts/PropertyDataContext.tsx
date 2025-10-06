'use client'

import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface PropertyData {
  zpid?: string
  address?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  livingArea?: number
  zestimate?: number
  propertyType?: string
  homeStatus?: string
  yearBuilt?: number
  lotSize?: number
  photos?: string[]
  rentZestimate?: number
  pricePerSquareFoot?: number
  taxAnnualAmount?: number
  rawData?: any
  isFallback?: boolean
}

interface QuestionnaireData {
  propertyAddress?: string
  sellingIntent?: string
  sellingTimeline?: string
  propertyType?: string
  propertyCondition?: string
  name?: string
  email?: string
  phone?: string
}

interface PropertyDataContextType {
  propertyData: PropertyData | null
  setPropertyData: (data: PropertyData | null) => void
  questionnaireData: QuestionnaireData | null
  setQuestionnaireData: (data: QuestionnaireData | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  prefetchPropertyData: (address: string) => Promise<PropertyData | null>
}

const PropertyDataContext = createContext<PropertyDataContextType | undefined>(undefined)

export function PropertyDataProvider({ children }: { children: ReactNode }) {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const prefetchPropertyData = async (address: string): Promise<PropertyData | null> => {
    if (!address.trim()) return null

    setIsLoading(true)
    try {
      // Convert URL-friendly address format to API-friendly format
      const apiAddress = address.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      console.log('🔄 Prefetching property data for:', apiAddress)

      const response = await fetch(`/api/zillow/property?address=${encodeURIComponent(apiAddress)}`)
      
      if (!response.ok) {
        console.error('❌ Failed to prefetch property data:', response.status)
        return null
      }

      const data = await response.json()
      console.log('✅ Property data prefetched successfully')
      
      setPropertyData(data)
      return data
    } catch (error) {
      console.error('Error prefetching property data:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PropertyDataContext.Provider
      value={{
        propertyData,
        setPropertyData,
        questionnaireData,
        setQuestionnaireData,
        isLoading,
        setIsLoading,
        prefetchPropertyData,
      }}
    >
      {children}
    </PropertyDataContext.Provider>
  )
}

export function usePropertyData() {
  const context = useContext(PropertyDataContext)
  if (context === undefined) {
    throw new Error('usePropertyData must be used within a PropertyDataProvider')
  }
  return context
}
