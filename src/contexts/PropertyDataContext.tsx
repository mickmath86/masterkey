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

interface ImprovementDetail {
  improvement: string
  yearsAgo?: number
  cost?: number
}

interface ImprovementValuation {
  improvement: string
  originalCost: number
  yearsAgo: number
  usefulLife: number
  depreciatedValue: number
  depreciationRate: number
}

interface QuestionnaireData {
  propertyAddress?: string
  sellingIntent?: string
  sellingTimeline?: string
  propertyType?: string
  propertyCondition?: string
  propertyImprovements?: string[]
  improvementDetails?: ImprovementDetail[]
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
  calculateImprovementValue: (improvementDetails: ImprovementDetail[]) => {
    totalDepreciatedValue: number
    improvementValuations: ImprovementValuation[]
  }
}

// Useful life mapping for different improvement types
const IMPROVEMENT_USEFUL_LIFE: Record<string, number> = {
  // Kitchen & Bathroom
  'Kitchen remodel': 25,
  'Bathroom renovation': 25,
  
  // Structural & Major Systems
  'Room addition': 27.5,
  'Basement finishing': 27.5,
  'Attic conversion': 27.5,
  'New roof': 27.5,
  'HVAC system upgrade': 17.5,
  'Windows replacement': 25,
  'Electrical upgrades': 27.5,
  'Plumbing upgrades': 27.5,
  'Insulation improvements': 27.5,
  
  // Flooring & Interior
  'New flooring': 15,
  'Fresh paint (interior)': 7,
  'Fresh paint (exterior)': 10,
  
  // Outdoor & Landscaping
  'Deck/patio addition': 20,
  'Landscaping improvements': 12.5,
  'Garage addition/renovation': 27.5,
  'Driveway replacement': 20,
  'Fence installation': 15,
  'Pool installation': 22.5,
  
  // Modern Upgrades
  'Solar panels': 25,
  'Smart home features': 10,
  
  // Default catch-all
  'default': 27.5
};

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

  const calculateImprovementValue = (improvementDetails: ImprovementDetail[]) => {
    const improvementValuations: ImprovementValuation[] = []
    let totalDepreciatedValue = 0

    improvementDetails.forEach(detail => {
      // Skip if missing required data
      if (!detail.cost || detail.yearsAgo === undefined) {
        return
      }

      // Get useful life for this improvement type
      const usefulLife = IMPROVEMENT_USEFUL_LIFE[detail.improvement] || IMPROVEMENT_USEFUL_LIFE['default']
      
      // Calculate depreciation rate (years since completion / useful life)
      const depreciationRate = Math.min(detail.yearsAgo / usefulLife, 1) // Cap at 100%
      
      // Calculate remaining value: original cost × (1 - depreciation rate)
      const depreciatedValue = detail.cost * (1 - depreciationRate)
      
      // Create valuation object
      const valuation: ImprovementValuation = {
        improvement: detail.improvement,
        originalCost: detail.cost,
        yearsAgo: detail.yearsAgo,
        usefulLife,
        depreciatedValue: Math.max(0, depreciatedValue), // Ensure non-negative
        depreciationRate
      }

      improvementValuations.push(valuation)
      totalDepreciatedValue += valuation.depreciatedValue
    })

    return {
      totalDepreciatedValue,
      improvementValuations
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
        calculateImprovementValue,
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
