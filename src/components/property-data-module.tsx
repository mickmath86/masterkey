"use client"

import { useState, useEffect, useCallback } from "react"
import { usePropertyData } from "@/contexts/PropertyDataContext"

import { Toaster } from "@/components/ui/sonner"
import { useRouter } from 'next/navigation'
import {
  Home,
  Bed,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Video,
  UserCheck,
  Star,
  DownloadCloudIcon,
  ListCheckIcon,
  HouseIcon,
  ShowerHead,
  Scan,
  LandPlot,
  Sparkles,
  X,
  Badge,
  TrendingUp as TrendingUpIcon,
  DollarSign,
  Target,
  Award,
  Building,
  Clock,
  CircleDotIcon,
  Bath,
  Maximize,
  Receipt,
  HomeIcon,
  LoaderCircle,
  CircleCheck

} from "lucide-react"
import { MasterKeyLogoInlineBlack } from '@/components/logo'
import { extractZipcode } from "@/lib/utils/address"

import { MOCK_PROPERTY_DATA, MOCK_MARKET_DATA, USE_MOCK_DATA, MOCK_SUBJECT_PROPERTY_DATA, MOCK_AVM_DATA, MOCK_COMPS_DATA, MOCK_PROPERTY_IMAGE, MOCK_VALUE_DATA } from "@/lib/mock-data"
import { PropertyCache } from "@/lib/property-cache"


import { ChartAreaInteractive } from "./ui/chart-area-interactive"
import { Progress } from "@/components/ui/progress"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { MapboxMap } from "./ui/mapbox-map"
import { ComparablesDataTable } from "./ui/comparables-data-table"
import { PropertyDetailsSheet } from "./property-details-sheet"
import { FadeIn, FadeInStagger } from "./animations/fade-in"
import { ValuationAreaChart } from "./ui/valuation-area-chart"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Send, User } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"


const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // or 2 if you want cents
});

// const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

const agentData = {
  name: "Mike Mathias",
  avatar: "/mike-avatar.png",
  title: "Senior Real Estate Broker",
  license: "CA 01892427",
  phone: "805-262-9707",
  company: "MasterKey Real Estate", 
  yearsExperience: 8,
}

interface PropertyDataModuleProps {
  address?: string;
  zipcode?: string;
}

export function PropertyDataModule({ address, zipcode }: PropertyDataModuleProps) {
  const router = useRouter()
  const { propertyData: prefetchedPropertyData, questionnaireData, calculateImprovementValue } = usePropertyData()
  
  // need to kill this
  const [propertyData, setPropertyData] = useState<any>(null) 

  const [useMockData, setUseMockData] = useState<boolean>(false)
  const [subjectPropertyData, setSubjectPropertyData] = useState<any>(null)
  const [marketData, setMarketData] = useState<any>(null)
  const [avmData, setAvmData] = useState<any>(null)
  const [propertyImages, setPropertyImages] = useState<any>(null)
  const [comps, setComps] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoadingState, setImageLoadingState] = useState<'idle' | 'fetching' | 'loaded' | 'failed' | 'timeout'>('idle')
  const [imageLoadingTimeout, setImageLoadingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [individualImageStates, setIndividualImageStates] = useState<{[key: number]: 'loading' | 'loaded' | 'error'}>({})
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isPropertySheetOpen, setIsPropertySheetOpen] = useState(false)
  const [valueData, setValueData] = useState<any>(null)
  const [showAgentCard, setShowAgentCard] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [urlContactData, setUrlContactData] = useState<{firstName?: string, lastName?: string, email?: string, phone?: string}>({})
  const [propertySummary, setPropertySummary] = useState<string>('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryState, setSummaryState] = useState<'idle' | 'preparing' | 'fetching-data' | 'analyzing' | 'complete' | 'error'>('idle')
  const [structuredSummary, setStructuredSummary] = useState<any>(null)
  const [valuationAnalysis, setValuationAnalysis] = useState<string>('')
  const [valuationLoading, setValuationLoading] = useState(false)
  const [valuationState, setValuationState] = useState<'idle' | 'preparing' | 'fetching-data' | 'analyzing' | 'complete' | 'error'>('idle')
  const [structuredValuation, setStructuredValuation] = useState<any>(null)
  const [dataLoadingComplete, setDataLoadingComplete] = useState(false)
  const [summaryTriggered, setSummaryTriggered] = useState(false)
  const [valuationTriggered, setValuationTriggered] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)

  // LeadConnector comprehensive webhook URL
  const COMPREHENSIVE_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/0972671d-e4b7-46c5-ad30-53d734b97e8c';

  // Function to send comprehensive data to webhook
  const sendComprehensiveWebhook = useCallback(async () => {
    if (webhookSent) {
      console.log('📤 Webhook already sent, skipping duplicate');
      return;
    }

    try {
      console.log('📤 Preparing comprehensive webhook data...');
      
      // Combine all available data
      const webhookData = {
        // Timestamp and metadata
        timestamp: new Date().toISOString(),
        source: 'property_analysis_complete',
        
        // Questionnaire data from the form
        questionnaire: questionnaireData ? {
          propertyAddress: questionnaireData.propertyAddress,
          sellingIntent: questionnaireData.sellingIntent,
          sellingTimeline: questionnaireData.sellingTimeline,
          sellingMotivation: (questionnaireData as any).sellingMotivation,
          propertyCondition: questionnaireData.propertyCondition,
          propertyImprovements: questionnaireData.propertyImprovements,
          priceExpectations: (questionnaireData as any).priceExpectations,
          contactInfo: {
            name: questionnaireData.name,
            email: questionnaireData.email,
            phone: questionnaireData.phone
          },
          privacyPolicyConsent: (questionnaireData as any).privacyPolicyConsent,
          completionTime: (questionnaireData as any).completionTime
        } : null,

        // Property basic data
        property: subjectPropertyData ? {
          address: subjectPropertyData.address,
          zpid: subjectPropertyData.zpid,
          price: subjectPropertyData.price,
          zestimate: subjectPropertyData.zestimate,
          bedrooms: subjectPropertyData.bedrooms,
          bathrooms: subjectPropertyData.bathrooms,
          livingArea: subjectPropertyData.livingArea,
          lotSize: subjectPropertyData.lotSize,
          yearBuilt: subjectPropertyData.yearBuilt,
          propertyType: subjectPropertyData.propertyType,
          homeStatus: subjectPropertyData.homeStatus
        } : null,

        // Valuation analysis (AI-generated insights)
        valuation: structuredValuation ? {
          // Base property value from component state
          basePropertyValue: subjectPropertyData?.zestimate || subjectPropertyData?.price || 0,
          
          // Calculate improvement values if available
          ...(questionnaireData?.improvementDetails && questionnaireData.improvementDetails.length > 0 ? (() => {
            // Calculate depreciated values for improvements
            const improvementCalculations = questionnaireData.improvementDetails
              .filter(detail => detail.cost && detail.yearsAgo !== undefined)
              .map(detail => {
                const depreciationRate = 0.05; // 5% per year
                const yearsAgo = detail.yearsAgo || 0;
                const depreciationFactor = Math.max(0.2, 1 - (depreciationRate * yearsAgo)); // Minimum 20% of original value
                const depreciatedValue = (detail.cost || 0) * depreciationFactor;
                
                return {
                  improvement: detail.improvement,
                  yearsAgo: yearsAgo,
                  originalCost: detail.cost || 0,
                  depreciatedValue: Math.round(depreciatedValue)
                };
              });
            
            const totalDepreciatedValue = improvementCalculations.reduce((sum, calc) => sum + calc.depreciatedValue, 0);
            const baseValue = subjectPropertyData?.zestimate || subjectPropertyData?.price || 0;
            
            return {
              enhancedPropertyValue: baseValue + totalDepreciatedValue,
              improvementAddedValue: totalDepreciatedValue,
              improvementBreakdown: improvementCalculations
            };
          })() : {
            enhancedPropertyValue: subjectPropertyData?.zestimate || subjectPropertyData?.price || 0,
            improvementAddedValue: 0,
            improvementBreakdown: []
          }),
          
          // AI-generated analysis
          summary: structuredValuation.summary,
          marketTrend: {
            direction: structuredValuation.marketTrend?.direction,
            strength: structuredValuation.marketTrend?.strength,
            description: structuredValuation.marketTrend?.description
          },
          keyMetrics: {
            valueChange12Month: structuredValuation.keyMetrics?.valueChange12Month,
            pricePerSqFt: structuredValuation.keyMetrics?.pricePerSqFt,
            volatility: structuredValuation.keyMetrics?.volatility
          },
          insights: structuredValuation.insights || [],
          recommendation: structuredValuation.recommendation ? {
            action: structuredValuation.recommendation.action,
            reasoning: structuredValuation.recommendation.reasoning,
            timeframe: structuredValuation.recommendation.timeframe
          } : null
        } : null,

        // Market data
        market: marketData ? {
          averageDaysOnMarket: marketData.averageDaysOnMarket,
          totalListings: marketData.totalListings,
          medianSalePrice: marketData.medianSalePrice,
          priceChange: marketData.priceChange,
          inventoryLevel: marketData.inventoryLevel,
          marketType: marketData.marketType
        } : null,

        // Property summary (AI-generated)
        summary: structuredSummary ? {
          overview: structuredSummary.overview,
          keyFeatures: structuredSummary.keyFeatures || [],
          marketPosition: structuredSummary.marketPosition,
          investmentHighlights: structuredSummary.investmentHighlights || [],
          propertyStats: structuredSummary.propertyStats
        } : null,

        // Comparable sales
        comparables: comps ? {
          totalCount: comps.length,
          salesComps: comps.map((comp: any) => ({
            address: comp.address,
            price: comp.price,
            bedrooms: comp.bedrooms,
            bathrooms: comp.bathrooms,
            livingArea: comp.livingArea,
            lotSize: comp.lotSize,
            yearBuilt: comp.yearBuilt,
            daysOnMarket: comp.daysOnMarket,
            pricePerSqFt: comp.pricePerSqFt,
            distance: comp.distance
          }))
        } : null,

        // AVM data
        avm: avmData ? {
          estimate: avmData.estimate,
          confidence: avmData.confidence,
          valuationRange: avmData.valuationRange
        } : null,

        // Value history data
        valueHistory: valueData ? {
          totalDataPoints: Array.isArray(valueData) ? valueData.length : 0,
          latestValue: Array.isArray(valueData) && valueData.length > 0 ? valueData[0] : null,
          valueRange: Array.isArray(valueData) && valueData.length > 0 ? {
            min: Math.min(...valueData.map((v: any) => v.price || 0)),
            max: Math.max(...valueData.map((v: any) => v.price || 0))
          } : null
        } : null,

        // Analysis status
        analysisStatus: {
          summaryComplete: summaryState === 'complete',
          valuationComplete: valuationState === 'complete',
          dataLoadingComplete: dataLoadingComplete,
          allDataAvailable: !!(subjectPropertyData && structuredValuation && structuredSummary)
        }
      };

      console.log('📤 Sending comprehensive webhook with data:', {
        hasQuestionnaire: !!webhookData.questionnaire,
        hasProperty: !!webhookData.property,
        hasValuation: !!webhookData.valuation,
        hasMarket: !!webhookData.market,
        hasSummary: !!webhookData.summary,
        hasComparables: !!webhookData.comparables,
        totalDataSize: JSON.stringify(webhookData).length
      });

      const response = await fetch(COMPREHENSIVE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('✅ Comprehensive webhook sent successfully');
        setWebhookSent(true);
      } else {
        console.error('❌ Webhook failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error sending comprehensive webhook:', error);
    }
  }, [webhookSent, questionnaireData, subjectPropertyData, structuredValuation, structuredSummary, marketData, comps, avmData, valueData, summaryState, valuationState, dataLoadingComplete]);

  // Handler for when a map marker is clicked
  const handleMarkerClick = (propertyData: any) => {
    setSelectedProperty(propertyData)
  }

  // Handler for when a table row is clicked
  const handleRowClick = (property: any) => {
    setSelectedProperty(property)
    setIsPropertySheetOpen(true)
  }

  // Function to fetch additional data when we have prefetched property data
  const fetchAdditionalData = async (subjectPropertyResult: any) => {
    try {
      const apiAddress = address?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''
      const propertyZpid = subjectPropertyResult?.zpid

      console.log('🔄 Fetching additional data with zpid:', propertyZpid)

      // Fetch Property Images using zpid from subject property data
      if (propertyZpid) {
        setImageLoadingState('fetching')
        console.log('🖼️ Starting image fetch for zpid:', propertyZpid)
        
        // Set a timeout for the entire image loading process
        const timeout = setTimeout(() => {
          console.warn('⏰ Image loading timeout reached (20 seconds)')
          setImageLoadingState('timeout')
          setPropertyImages({ images: [], error: 'timeout' })
        }, 20000) // 20 second timeout for the entire process
        
        setImageLoadingTimeout(timeout)
        
        try {
          const propertyImagesResponse = await fetch(`/api/zillow/images?zpid=${encodeURIComponent(propertyZpid)}`, {
            signal: AbortSignal.timeout(15000) // 15 second timeout
          })
          
          clearTimeout(timeout)
          setImageLoadingTimeout(null)
          
          if (propertyImagesResponse.ok) {
            const propertyImagesResult = await propertyImagesResponse.json()
            console.log('🖼️ Image API response:', {
              hasImages: !!(propertyImagesResult?.images),
              imageCount: propertyImagesResult?.images?.length || 0,
              firstImageUrl: propertyImagesResult?.images?.[0]?.substring(0, 50) + '...'
            })
            
            if (propertyImagesResult && propertyImagesResult.images && propertyImagesResult.images.length > 0) {
              setPropertyImages(propertyImagesResult)
              setImageLoadingState('loaded')
              // Initialize individual image loading states
              const initialStates: {[key: number]: 'loading' | 'loaded' | 'error'} = {}
              propertyImagesResult.images.forEach((_: string, index: number) => {
                initialStates[index] = 'loading'
              })
              setIndividualImageStates(initialStates)
            } else {
              console.log('📷 No property images found for zpid:', propertyZpid)
              setImageLoadingState('failed')
              setPropertyImages({ images: [], error: 'no_images' })
            }
          } else {
            console.warn('🚨 Property images API returned non-OK status:', propertyImagesResponse.status)
            setImageLoadingState('failed')
            setPropertyImages({ images: [], error: `api_error_${propertyImagesResponse.status}` })
          }
        } catch (error) {
          clearTimeout(timeout)
          setImageLoadingTimeout(null)
          console.error('❌ Failed to fetch property images:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            zpid: propertyZpid,
            timestamp: new Date().toISOString()
          })
          setImageLoadingState('failed')
          setPropertyImages({ images: [], error: 'fetch_error' })
        }
      }

      // Fetch AVM data
      const rentcastUrl = `/api/rentcast/value?address=${encodeURIComponent(apiAddress)}`
      const avmResponse = await fetch(rentcastUrl)
      if (avmResponse.ok) {
        const avmResult = await avmResponse.json()
        setAvmData(avmResult)
      }

      // Fetch Comps using zpid from subject property data
      if (propertyZpid) {
        const compsResponse = await fetch(`/api/zillow/comps?zpid=${encodeURIComponent(propertyZpid)}`)
        if (compsResponse.ok) {
          const compsResult = await compsResponse.json()
          setComps(compsResult)
        }
      }

      // Fetch market data
      const marketZipcode = zipcode || extractZipcode(address || '')
      if (marketZipcode) {
        const marketResponse = await fetch(`/api/rentcast/markets?zipcode=${encodeURIComponent(marketZipcode)}`)
        if (marketResponse.ok) {
          const marketResult = await marketResponse.json()
          setMarketData(marketResult)
        }
      }

      // Fetch ValueData using zpid from prefetched property data
      if (propertyZpid) {
        try {
          console.log('🔄 Fetching value data for zpid:', propertyZpid)
          const valueDataResponse = await fetch(`/api/zillow/values?zpid=${encodeURIComponent(propertyZpid)}`)
          if (valueDataResponse.ok) {
            const valueDataResult = await valueDataResponse.json()
            console.log('✅ Value data fetched successfully:', valueDataResult)
            setValueData(valueDataResult)
          } else if (valueDataResponse.status === 429) {
            console.warn('⚠️ Rate limit exceeded for value data. Using fallback data.')
            setValueData(MOCK_VALUE_DATA)
          } else {
            console.error('❌ Value data fetch failed:', valueDataResponse.status)
            setValueData(MOCK_VALUE_DATA)
          }
        } catch (error) {
          console.error('Value data fetch error:', error)
          setValueData(MOCK_VALUE_DATA)
        }
      } else {
        console.log('❌ No zpid available for value data fetch')
        setValueData(MOCK_VALUE_DATA)
      }
    } catch (error) {
      console.error('Error fetching additional data:', error)
    }
  }

  
  useEffect(() => {
    if (!address) {
      return
    }

    // If we have prefetched data, use it immediately
    const normalizeAddress = (addr: string) => {
      return addr?.replace(/,\s*USA$/i, '').replace(/\s+/g, ' ').trim().toLowerCase()
    }
    
    const prefetchedNormalized = normalizeAddress(prefetchedPropertyData?.address || '')
    const currentNormalized = normalizeAddress(address || '')
    const addressesMatch = prefetchedNormalized.includes(currentNormalized.split(',')[0]) || 
                          currentNormalized.includes(prefetchedNormalized.split(',')[0])
    
    if (prefetchedPropertyData && addressesMatch) {
      console.log('✅ Using prefetched data, calling fetchAdditionalData with:', prefetchedPropertyData)
      setSubjectPropertyData(prefetchedPropertyData)
      
      // Set property data with prefetched values
      setPropertyData({
        ...MOCK_PROPERTY_DATA,
        zestimate: prefetchedPropertyData.zestimate || prefetchedPropertyData.price || 850000,
        address: address
      })
      
      // Still fetch additional data (images, comps, market data) in background
      fetchAdditionalData(prefetchedPropertyData)
      
      // Mark data loading as complete for prefetched data
      setTimeout(() => {
        setDataLoadingComplete(true)
        console.log('✅ Prefetched data loading marked as complete')
      }, 100)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      setDataLoadingComplete(false)
      setSummaryTriggered(false)
      setValuationTriggered(false)
      console.log('🔄 Starting fresh data fetch - resetting trigger flags')

      try {
        // Convert URL-friendly address format to API-friendly format
        const apiAddress = address.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())


        //Fetch Subject Property Data
        const zillowUrl = `/api/zillow/property?address=${encodeURIComponent(apiAddress)}`
        const subjectPropertyResponse = await fetch(zillowUrl)
        let subjectPropertyResult = null
        if (subjectPropertyResponse.ok) {
          subjectPropertyResult = await subjectPropertyResponse.json()
          setSubjectPropertyData(subjectPropertyResult)

          //Fetch Property Images using zpid from subject property data
          if (subjectPropertyResult?.zpid) {
            setImageLoadingState('fetching')
            console.log('🖼️ Starting fresh image fetch for zpid:', subjectPropertyResult.zpid)
            
            // Set a timeout for the entire image loading process
            const timeout = setTimeout(() => {
              console.warn('⏰ Fresh image loading timeout reached (20 seconds)')
              setImageLoadingState('timeout')
              setPropertyImages({ images: [], error: 'timeout' })
            }, 20000) // 20 second timeout
            
            setImageLoadingTimeout(timeout)
            
            try {
              const propertyImagesResponse = await fetch(`/api/zillow/images?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`, {
                signal: AbortSignal.timeout(15000) // 15 second timeout
              })
              
              clearTimeout(timeout)
              setImageLoadingTimeout(null)
              
              if (propertyImagesResponse.ok) {
                const propertyImagesResult = await propertyImagesResponse.json()
                console.log('🖼️ Fresh image API response:', {
                  hasImages: !!(propertyImagesResult?.images),
                  imageCount: propertyImagesResult?.images?.length || 0,
                  firstImageUrl: propertyImagesResult?.images?.[0]?.substring(0, 50) + '...'
                })
                
                if (propertyImagesResult && propertyImagesResult.images && propertyImagesResult.images.length > 0) {
                  setPropertyImages(propertyImagesResult)
                  setImageLoadingState('loaded')
                  // Initialize individual image loading states
                  const initialStates: {[key: number]: 'loading' | 'loaded' | 'error'} = {}
                  propertyImagesResult.images.forEach((_: string, index: number) => {
                    initialStates[index] = 'loading'
                  })
                  setIndividualImageStates(initialStates)
                } else {
                  console.log('📷 No property images found for fresh zpid:', subjectPropertyResult.zpid)
                  setImageLoadingState('failed')
                  setPropertyImages({ images: [], error: 'no_images' })
                }
              } else {
                console.warn('🚨 Fresh property images API returned non-OK status:', propertyImagesResponse.status)
                setImageLoadingState('failed')
                setPropertyImages({ images: [], error: `api_error_${propertyImagesResponse.status}` })
              }
            } catch (error) {
              clearTimeout(timeout)
              setImageLoadingTimeout(null)
              console.error('❌ Failed to fetch fresh property images:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                zpid: subjectPropertyResult.zpid,
                timestamp: new Date().toISOString()
              })
              setImageLoadingState('failed')
              setPropertyImages({ images: [], error: 'fetch_error' })
            }
          }
        }
        // Fetch AVM data
        const rentcastUrl = `/api/rentcast/value?address=${encodeURIComponent(apiAddress)}`
        const avmResponse = await fetch(rentcastUrl)
        if (avmResponse.ok) {
          const avmResult = await avmResponse.json()
          setAvmData(avmResult)
          
        }

        //Fetch Comps using zpid from subject property data
        if (subjectPropertyResult?.zpid) {
          const compsResponse = await fetch(`/api/zillow/comps?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`)
          if (compsResponse.ok) {
            const compsResult = await compsResponse.json()
            setComps(compsResult)
          }
        }

        // Fetch market data
        const marketZipcode = zipcode || extractZipcode(address || '')
        if (marketZipcode) {
          const marketResponse = await fetch(`/api/rentcast/markets?zipcode=${encodeURIComponent(marketZipcode)}`)
          if (marketResponse.ok) {
            const marketResult = await marketResponse.json()
            setMarketData(marketResult)
          }
        }

        //Fetch ValueData using zpid from subject property data
        if (subjectPropertyResult?.zpid) {
          try {
            const valueDataResponse = await fetch(`/api/zillow/values?zpid=${encodeURIComponent(subjectPropertyResult.zpid)}`)
            if (valueDataResponse.ok) {
              const valueDataResult = await valueDataResponse.json()
              setValueData(valueDataResult)
            }
          } catch (error) {
            console.error('Value data fetch error:', error)
          }
        }

        // Set property data with hardcoded values to prevent breaks
        setPropertyData({
          ...MOCK_PROPERTY_DATA,
          zestimate: avmData?.price || 850000,
          address: address
        })

      } catch (err) {
        setError('Network error while fetching data')
        console.error('Data fetch error:', err)
      } finally {
        setIsLoading(false)
        // Mark data loading as complete after all async operations
        setTimeout(() => {
          setDataLoadingComplete(true)
          console.log('✅ Data loading marked as complete')
        }, 100) // Small delay to ensure all state updates are processed
      }
    }

    fetchData()
  }, [address, zipcode, prefetchedPropertyData])

  // Show agent card after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAgentCard(true)
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  // Fetch property summary when data loading is complete and we have required data
  useEffect(() => {
    console.log('📝 Property Summary Trigger Check:', {
      dataLoadingComplete,
      hasSubjectPropertyData: !!subjectPropertyData,
      hasAddress: !!address,
      summaryTriggered,
      useMockData
    })
    
    if (dataLoadingComplete && subjectPropertyData && address && !summaryTriggered && !useMockData) {
      console.log('✅ Triggering property summary generation')
      setSummaryTriggered(true)
      const apiAddress = address.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      fetchPropertySummary(apiAddress, subjectPropertyData)
    } else if (useMockData && !summaryTriggered) {
      console.log('✅ Setting mock property summary')
      setSummaryTriggered(true)
      // Set a default summary for mock data
      setPropertySummary("This beautifully maintained property offers exceptional value in a desirable neighborhood. With its thoughtful layout and modern amenities, it represents an excellent opportunity for both homeowners and investors. The property's strategic location provides convenient access to local amenities while maintaining the peaceful residential atmosphere that makes this area so sought after.")
    }
  }, [dataLoadingComplete, subjectPropertyData, address, summaryTriggered, useMockData])

  // Trigger valuation analysis when data loading is complete and we have required data
  useEffect(() => {
    console.log('🔍 Valuation Analysis Trigger Check:', {
      dataLoadingComplete,
      hasSubjectPropertyData: !!subjectPropertyData,
      hasAddress: !!address,
      hasZpid: !!subjectPropertyData?.zpid,
      valuationTriggered,
      hasValueData: !!valueData,
      valueDataLength: Array.isArray(valueData) ? valueData.length : 0,
      useMockData: useMockData
    })
    
    if (dataLoadingComplete && subjectPropertyData && address && subjectPropertyData.zpid && !valuationTriggered && !useMockData) {
      console.log('✅ Triggering valuation analysis for zpid:', subjectPropertyData.zpid)
      console.log('📊 Value data status:', valueData ? `Available (${Array.isArray(valueData) ? valueData.length : 0} items)` : 'Not available - will fetch in API')
      setValuationTriggered(true)
      const apiAddress = address.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      fetchValuationAnalysis(apiAddress, subjectPropertyData.zpid, subjectPropertyData)
    } else if (useMockData && !valuationTriggered) {
      console.log('✅ Setting mock valuation analysis')
      setValuationTriggered(true)
      // Set a default valuation analysis for mock data
      setValuationAnalysis("Based on recent market analysis, this property demonstrates strong valuation performance with consistent appreciation trends. The current market positioning reflects favorable conditions for both investment potential and long-term value retention. Historical data indicates stable growth patterns that align with broader market dynamics in this desirable area.")
    } else if (!dataLoadingComplete) {
      console.log('⏳ Valuation analysis waiting for data loading to complete')
    } else {
      console.log('❌ Valuation analysis not triggered - missing required data:')
      console.log('Missing:', {
        dataLoadingComplete,
        subjectPropertyData: !subjectPropertyData,
        address: !address,
        zpid: !subjectPropertyData?.zpid,
        valuationTriggered,
        useMockData: useMockData
      })
    }
  }, [dataLoadingComplete, subjectPropertyData, address, valuationTriggered, useMockData]) // Removed valueData dependency - let API handle fetching if needed

  // Trigger comprehensive webhook when all analysis is complete
  useEffect(() => {
    const shouldSendWebhook = 
      questionnaireData && // User came from questionnaire
      summaryState === 'complete' && // Property summary is complete
      valuationState === 'complete' && // Valuation analysis is complete
      subjectPropertyData && // We have property data
      !webhookSent; // Haven't sent webhook yet

    console.log('🔍 Webhook Trigger Check:', {
      hasQuestionnaire: !!questionnaireData,
      summaryComplete: summaryState === 'complete',
      valuationComplete: valuationState === 'complete',
      hasPropertyData: !!subjectPropertyData,
      webhookSent: webhookSent,
      shouldSend: shouldSendWebhook
    });

    if (shouldSendWebhook) {
      console.log('✅ All analysis complete - triggering comprehensive webhook');
      sendComprehensiveWebhook();
    }
  }, [questionnaireData, summaryState, valuationState, subjectPropertyData, webhookSent, sendComprehensiveWebhook]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (imageLoadingTimeout) {
        clearTimeout(imageLoadingTimeout)
        console.log('🧹 Cleaned up image loading timeout on unmount')
      }
    }
  }, [imageLoadingTimeout])

  // Load calendar widget script when modal opens
  useEffect(() => {
    if (isCalendarModalOpen) {
      console.log('📅 Calendar modal opened, questionnaire data:', questionnaireData)
      
      const script = document.createElement('script')
      script.src = 'https://api.leadconnectorhq.com/js/form_embed.js'
      script.type = 'text/javascript'
      script.async = true
      document.head.appendChild(script)
      
      return () => {
        // Cleanup script when modal closes
        const existingScript = document.querySelector('script[src="https://api.leadconnectorhq.com/js/form_embed.js"]')
        if (existingScript) {
          document.head.removeChild(existingScript)
        }
      }
    }
  }, [isCalendarModalOpen, questionnaireData])

  // Extract contact information from URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const contactData = {
        firstName: urlParams.get('first_name') || '',
        lastName: urlParams.get('last_name') || '',
        email: urlParams.get('email') || '',
        phone: urlParams.get('phone') || ''
      };
      
      // Only set if we have some contact data
      if (contactData.firstName || contactData.lastName || contactData.email || contactData.phone) {
        setUrlContactData(contactData);
        console.log('📋 Contact data extracted from URL:', contactData);
      }
    }
  }, [])

  // Prefill contact subject when modal opens
  useEffect(() => {
    if (isContactModalOpen && !contactSubject) {
      const propertyAddress = questionnaireData?.propertyAddress || address || 'Property'
      setContactSubject(`Inquiry about ${propertyAddress}`)
    }
  }, [isContactModalOpen, questionnaireData?.propertyAddress, address, contactSubject])

  // Handle contact form submission
  const handleContactSubmit = async () => {
    setIsSubmittingContact(true)
    
    try {
      const contactData = {
        to: 'mike@masterkey.com', // Replace with actual email
        subject: contactSubject,
        message: contactMessage,
        from: {
          name: questionnaireData?.name || `${urlContactData.firstName} ${urlContactData.lastName}`.trim() || 'Website Visitor',
          email: questionnaireData?.email || urlContactData.email || '',
          phone: questionnaireData?.phone || urlContactData.phone || ''
        },
        propertyAddress: questionnaireData?.propertyAddress || address || '',
        timestamp: new Date().toISOString()
      }

      // Placeholder webhook URL - replace with your actual webhook
      const CONTACT_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/d2fefb94-6488-482d-be99-ff57472e4fca'
      
      const response = await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        console.log('Contact message sent successfully:', contactData)
        // Reset form and close modal
        setContactMessage('')
        setContactSubject('')
        setIsContactModalOpen(false)
        // Show success toast
        toast.success("Message sent!", {
          description: "Your message has been sent to Mike successfully.",
        })
      } else {
        console.error('Contact submission failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Contact submission error:', error)
    } finally {
      setIsSubmittingContact(false)
    }
  }

  // Consistent function to get days on market for the subject property
  const getDaysOnMarket = () => {
    const subjectPropertyType = avmData?.subjectProperty?.propertyType;
    const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
      (data: any) => data.propertyType === subjectPropertyType
    );
    return propertyTypeData?.averageDaysOnMarket || marketData?.saleData?.averageDaysOnMarket;
  }

  const getMarketSpeedIndicator = (days: number) => {
    const avgDays = getDaysOnMarket();
    const displayDays = avgDays && !isNaN(avgDays) ? Math.round(avgDays) : 'N/A';
    
    if (days < 30) return { 
      label: "Fast Market", 
      color: "bg-green-100 text-green-800", 
      icon: TrendingUp,
      description: `Properties sell quickly with high demand with an average of ${displayDays} days on market. As a seller, you can expect competitive offers, potentially above asking price, and a faster closing timeline. This is an excellent time to list your property.`
    }
    if (days > 60) return { 
      label: "Slow Market", 
      color: "bg-red-100 text-red-800", 
      icon: TrendingDown,
      description: `Properties take longer to sell with lower demand with an average of ${displayDays} days on market. As a seller, you may need to price competitively, consider staging improvements, and be prepared for longer marketing periods and potential price negotiations.`
    }
    return { 
      label: "Balanced Market", 
      color: "bg-blue-100 text-blue-800", 
      icon: Calendar,
      description: `Supply and demand are relatively equal with an average of ${displayDays} days on market. As a seller, you can expect reasonable market activity with standard negotiation processes. Proper pricing and presentation are key to attracting qualified buyers.`
    }
  }

  const marketStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    return "bg-red-100 text-red-800"
  }




  const nextImage = () => {
    if (propertyImages && propertyImages.images && propertyImages.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.images.length)
    }
  }

  const prevImage = () => {
    if (propertyImages && propertyImages.images && propertyImages.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyImages.images.length) % propertyImages.images.length)
    }
  }

  // Function to fetch AI-generated structured property summary
  const fetchPropertySummary = async (propertyAddress: string, propertyData?: any) => {
    console.log('📝 Starting property summary fetch:', {
      address: propertyAddress,
      hasPropertyData: !!propertyData,
      timestamp: new Date().toISOString()
    });
    
    setSummaryLoading(true)
    setSummaryState('preparing')
    setStructuredSummary(null) // Clear existing summary
    
    // Check cache first
    const cached = PropertyCache.get(propertyAddress);
    if (cached?.presentationData) {
      console.log('🗄️ Using cached presentation data for:', propertyAddress);
      setStructuredSummary(cached.presentationData);
      setSummaryState('complete');
      setSummaryLoading(false);
      return;
    }
    
    try {
      // Phase 1: Preparing request (with delay to show state)
      await new Promise(resolve => setTimeout(resolve, 500))
      setSummaryState('fetching-data')
      
      const requestBody = { 
        address: propertyAddress,
        propertyData: propertyData || subjectPropertyData, // Pass prefetched data
        questionnaireData: questionnaireData // Pass questionnaire data including condition
      };
      
      console.log('📤 Sending presentation API request:', {
        url: '/api/tools/presentation',
        hasAddress: !!requestBody.address,
        hasPropertyData: !!requestBody.propertyData
      });
      
      // Phase 2: Analyzing with AI (with delay to show state)
      await new Promise(resolve => setTimeout(resolve, 500))
      setSummaryState('analyzing');
      
      const response = await fetch('/api/tools/presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Presentation API response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Presentation API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Property summary received successfully:', {
        hasOverview: !!data.overview,
        keyFeaturesCount: data.keyFeatures?.length || 0
      });
      
      // Cache the presentation data
      PropertyCache.set(propertyAddress, { presentationData: data });
      
      setStructuredSummary(data)
      setSummaryState('complete')
      setSummaryLoading(false)
    } catch (error) {
      console.error('❌ Property summary fetch error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      setStructuredSummary({
        overview: 'Unable to generate property summary at this time.',
        keyFeatures: [],
        marketPosition: { pricePoint: 'market_rate', competitiveness: 'moderate', description: 'Analysis unavailable' },
        investmentHighlights: [],
        propertyStats: { ageCategory: 'established' }
      })
      setSummaryState('error')
      setSummaryLoading(false)
    }
  }

  // Function to fetch AI-generated structured valuation analysis
  const fetchValuationAnalysis = async (propertyAddress: string, zpid: number, propertyData?: any) => {
    console.log('📊 Starting valuation analysis fetch:', {
      address: propertyAddress,
      zpid,
      hasPropertyData: !!propertyData,
      hasValueData: !!valueData,
      valueDataLength: Array.isArray(valueData) ? valueData.length : 'NOT ARRAY',
      timestamp: new Date().toISOString()
    });
    
    setValuationLoading(true)
    setValuationState('preparing')
    setStructuredValuation(null) // Clear existing analysis
    
    // Check cache first
    const cached = PropertyCache.get(propertyAddress);
    if (cached?.valuationData) {
      console.log('🗄️ Using cached valuation data for:', propertyAddress);
      setStructuredValuation(cached.valuationData);
      setValuationState('complete');
      setValuationLoading(false);
      return;
    }
    
    try {
      // Phase 1: Preparing request (with delay to show state)
      await new Promise(resolve => setTimeout(resolve, 500))
      setValuationState('fetching-data')
      const requestBody = { 
        address: propertyAddress, 
        zpid,
        propertyData: propertyData || subjectPropertyData, // Pass prefetched data
        valueData: valueData // Pass the same data the chart uses
      };
      
      console.log('📤 Sending valuation API request:', {
        url: '/api/tools/valuation',
        hasAddress: !!requestBody.address,
        zpid: requestBody.zpid,
        hasPropertyData: !!requestBody.propertyData,
        hasValueData: !!requestBody.valueData
      });
      
      // Phase 2: Analyzing with AI (with delay to show state)
      await new Promise(resolve => setTimeout(resolve, 500))
      setValuationState('analyzing');
      
      const response = await fetch('/api/tools/valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Valuation API response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Valuation API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Valuation analysis received successfully:', {
        hasSummary: !!data.summary,
        hasMarketTrend: !!data.marketTrend,
        hasKeyMetrics: !!data.keyMetrics
      });
      
      // Cache the valuation data
      PropertyCache.set(propertyAddress, { valuationData: data });
      
      setStructuredValuation(data)
      setValuationState('complete')
      setValuationLoading(false)
    } catch (error) {
      console.error('❌ Valuation analysis fetch error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      setStructuredValuation({
        summary: 'Unable to generate valuation analysis at this time.',
        marketTrend: { direction: 'stable', strength: 'moderate', description: 'Analysis unavailable' },
        keyMetrics: { valueChange12Month: { amount: 0, percentage: 0, isPositive: false }, pricePerSqFt: { marketPosition: 'at' }, volatility: 'moderate' },
        insights: [],
        recommendation: { action: 'hold', reasoning: 'Analysis unavailable', timeframe: 'N/A' }
      })
      setValuationState('error')
      setValuationLoading(false)
    }
  }

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount || isNaN(amount)) return '$0'
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate improvement value based on questionnaire data
  const getImprovementValue = () => {
    if (!questionnaireData?.improvementDetails || questionnaireData.improvementDetails.length === 0) {
      return {
        totalDepreciatedValue: 0,
        improvementValuations: []
      }
    }
    
    return calculateImprovementValue(questionnaireData.improvementDetails)
  }

  // Get the enhanced property value (base + improvements)
  const getEnhancedPropertyValue = () => {
    const baseValue = subjectPropertyData?.zestimate || subjectPropertyData?.price || 0
    const improvementValue = getImprovementValue().totalDepreciatedValue
    return baseValue + improvementValue
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Get the element's position
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      // Add offset for header padding (adjust this value as needed)
      const offsetPosition = elementPosition - 80 // 80px padding from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-md dark:bg-gray-700 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 mb-8 w-2/3"></div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-sky-500 bg-sky-100 dark:bg-sky-900 dark:text-sky-300">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading property data...
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading property data
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">No property data available</p>
          </div>
        </div>
      </div>
    )
  }

  // Format address for display
  const displayAddress = typeof propertyData.address === 'object' 
    ? `${propertyData.address.streetAddress || ''}, ${propertyData.address.city || ''}, ${propertyData.address.state || ''} ${propertyData.address.zipcode || ''}`.trim()
    : propertyData.address || address

  const avgDaysOnMarket = marketData?.saleData?.averageDaysOnMarket
  const marketSpeed = avgDaysOnMarket ? getMarketSpeedIndicator(avgDaysOnMarket) : null
  
  // Calculate maxPrice as 1.25x the property price from Zillow API
  const propertyPrice = propertyData?.zestimate || propertyData?.price || 0
  const maxPrice = propertyPrice > 0 ? propertyPrice * 1.25 : 1800000

  // Console log to verify maxPrice calculation
  console.log('MaxPrice Calculation Debug:', {
    propertyPrice: propertyPrice,
    zestimate: propertyData?.zestimate,
    price: propertyData?.price,
    calculatedMaxPrice: propertyPrice > 0 ? propertyPrice * 1.25 : 'Using fallback: 1800000',
    finalMaxPrice: maxPrice,
    isUsingFallback: propertyPrice <= 0
  })
  
  const pricePerSquareFoot = subjectPropertyData?.zestimate && subjectPropertyData?.livingArea 
    ? Math.round((subjectPropertyData?.zestimate / subjectPropertyData?.livingArea) )
    : "NA"
  // Set minimum value to 0 as requested
  const minPrice = 0



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header with navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <MasterKeyLogoInlineBlack className="h-8 w-auto flex mx-auto items-center py-4 md:hidden" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
          <div className="grid grid-cols-2 py-4 justify-between items-center">
            <div className="flex items-center gap-x-4">
            <button
              onClick={() => router.push('/landing/listing-presentation')}
              className="inline-flex items-center gap-x-4 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to search
            </button>
            <button className="hidden md:inline-flex  border border-gray-800 rounded-sm px-2 py-1 items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
             
              Visit Website
            </button>
            </div>
           
            <div className="flex text-right items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{displayAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-sky-50 border-b border-sky-200 dark:bg-sky-900/20 dark:border-sky-800 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Navigation with Logo */}
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <MasterKeyLogoInlineBlack className="h-8 w-auto" />
            </div>
            
            {/* Navigation Links */}
            <div className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => scrollToSection("property-summary")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              Property Summary
            </button>
            <button
              onClick={() => scrollToSection("property-valuation")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              Valuation
            </button>
            <button
              onClick={() => scrollToSection("market-statistics")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              Market Stats
            </button>
            <button
              onClick={() => scrollToSection("sales-comparables")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              Sales Comparables
            </button>
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Card Sidebar */}
         



          {/* Main Content */}
          <div className="flex-1 space-y-8">

            {/* Home Summary Module */}
        <FadeIn>
          <Card id="home-value" className="bg-white rounded-lg shadow-sm border-2  dark:bg-gray-800 dark:border-sky-700">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-semibold">{subjectPropertyData?.address || address}</CardTitle>
              <CardDescription>
                <div className="flex flex-row items-center justify-between">
                
              <h2>Property Details</h2>
                <h4 className="text-sm md:text-md text-right font-semibold uppercase">{new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                  </h4>
                </div>
              </CardDescription>
            </CardHeader>
           
            <CardContent>
        
                <div className=" mb-6">

        

                  {/* images */}
                  <div className="flex flex-col  gap-2">
                      {propertyImages?.images && propertyImages.images.length > 0 ? (
                        <div className="relative  mt-2">
                          <h3 className=" absolute top-2 left-2 bg-white px-2 py-1 rounded text-sky-600 dark:text-gray-400 text-sm font-semibold mb-2 z-10">
                            {propertyImages.images.length === 1 ? 'Property Image' : 'Property Images'}
                          </h3>
                          <Image
                            width={1000}
                            height={1000}
                            src={propertyImages.images[currentImageIndex]}
                            alt={`Property photo ${currentImageIndex + 1}`}
                            className="w-full max-h-[50vh] h-[50vh]  object-cover rounded-lg"
                            loading="lazy"
                            onLoad={() => {
                              console.log('✅ Individual image loaded successfully:', {
                                index: currentImageIndex,
                                url: propertyImages.images[currentImageIndex]?.substring(0, 50) + '...'
                              })
                              setIndividualImageStates(prev => ({
                                ...prev,
                                [currentImageIndex]: 'loaded'
                              }))
                            }}
                            onError={(e) => {
                              console.error('❌ Failed to load individual property image:', {
                                index: currentImageIndex,
                                url: propertyImages.images[currentImageIndex],
                                error: e,
                                timestamp: new Date().toISOString()
                              })
                              
                              setIndividualImageStates(prev => ({
                                ...prev,
                                [currentImageIndex]: 'error'
                              }))
                              
                              // Try to remove the failed image from the array
                              const target = e.target as HTMLImageElement
                              if (target && propertyImages?.images) {
                                const updatedImages = propertyImages.images.filter((_: string, index: number) => index !== currentImageIndex)
                                if (updatedImages.length > 0) {
                                  console.log('🔄 Removing failed image, remaining count:', updatedImages.length)
                                  setPropertyImages({ ...propertyImages, images: updatedImages })
                                  setCurrentImageIndex(0)
                                } else {
                                  console.log('🚫 No valid images left after removing failed image')
                                  setPropertyImages({ images: [], error: 'all_images_failed' })
                                  setImageLoadingState('failed')
                                }
                              }
                            }}
                          />
                          {propertyImages.images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-md z-10"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-md z-10"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {propertyImages.images.map((_: any, index: number) => (
                                  <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      index === currentImageIndex ? "bg-sky-500" : "bg-white/60"
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        // Enhanced loading/error states for images
                        <div className="relative mt-2">
                          <div className="absolute top-2 left-2 bg-gray-200 px-2 py-1 rounded text-gray-600 text-sm font-semibold mb-2 z-10">
                            {imageLoadingState === 'fetching' && 'Loading Images...'}
                            {imageLoadingState === 'failed' && 'Images Unavailable'}
                            {imageLoadingState === 'timeout' && 'Image Load Timeout'}
                            {imageLoadingState === 'idle' && 'Preparing Images...'}
                          </div>
                          <div className="w-full max-h-[50vh] h-[50vh] bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-gray-400 text-center">
                              {imageLoadingState === 'fetching' && (
                                <>
                                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full animate-pulse"></div>
                                  <p className="text-sm">Loading property images...</p>
                                  <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                                </>
                              )}
                              {imageLoadingState === 'failed' && (
                                <>
                                  <div className="w-16 h-16 mx-auto mb-2 bg-red-200 rounded-full flex items-center justify-center">
                                    <X className="w-8 h-8 text-red-500" />
                                  </div>
                                  <p className="text-sm text-red-600">Images could not be loaded</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {propertyImages?.error === 'no_images' && 'No images available for this property'}
                                    {propertyImages?.error === 'fetch_error' && 'Network error loading images'}
                                    {propertyImages?.error?.startsWith('api_error_') && `API error: ${propertyImages.error.split('_')[2]}`}
                                    {propertyImages?.error === 'all_images_failed' && 'All images failed to load'}
                                  </p>
                                  <button 
                                    onClick={() => {
                                      console.log('🔄 User requested image retry')
                                      setImageLoadingState('idle')
                                      setPropertyImages(null)
                                      // Trigger a re-fetch by updating a dependency
                                      window.location.reload()
                                    }}
                                    className="mt-3 px-3 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600 transition-colors"
                                  >
                                    Retry Loading Images
                                  </button>
                                </>
                              )}
                              {imageLoadingState === 'timeout' && (
                                <>
                                  <div className="w-16 h-16 mx-auto mb-2 bg-yellow-200 rounded-full flex items-center justify-center">
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                  </div>
                                  <p className="text-sm text-yellow-700">Image loading timed out</p>
                                  <p className="text-xs text-gray-500 mt-1">Please check your connection and try again</p>
                                  <button 
                                    onClick={() => {
                                      console.log('🔄 User requested timeout retry')
                                      setImageLoadingState('idle')
                                      setPropertyImages(null)
                                      window.location.reload()
                                    }}
                                    className="mt-3 px-3 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600 transition-colors"
                                  >
                                    Retry Loading Images
                                  </button>
                                </>
                              )}
                              {imageLoadingState === 'idle' && (
                                <>
                                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full animate-pulse"></div>
                                  <p className="text-sm">Preparing to load images...</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="w-full  grid grid-cols-2 grid-rows-2 gap-4  p-4">
                        {/* Bedrooms - Top Left */}
                        <div className="flex flex-col items-center justify-center space-y-2 bg-gray-50 dark:bg-gray-700 rounded-sm p-4">
                          <div className="flex items-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                            <Bed className="w-6 h-6 mr-2" /> 
                            {subjectPropertyData?.bedrooms || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Bedrooms</div>
                        </div>

                        {/* Bathrooms - Top Right */}
                        <div className="flex flex-col items-center justify-center space-y-2 bg-gray-50 dark:bg-gray-700 rounded-sm p-4">
                          <div className="flex items-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                            <ShowerHead className="w-6 h-6 mr-2" />
                            {subjectPropertyData?.bathrooms || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Bathrooms</div>
                        </div>

                        {/* Square Footage - Bottom Left */}
                        <div className="flex flex-col items-center justify-center space-y-2 bg-gray-50 dark:bg-gray-700 rounded-sm p-4">
                          <div className="flex items-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                            <HouseIcon className="w-6 h-6 mr-2" />
                            {subjectPropertyData?.livingArea && !isNaN(subjectPropertyData.livingArea) ? subjectPropertyData.livingArea.toLocaleString() : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Square Footage</div>
                        </div>

                        {/* Year Built - Bottom Right */}
                        <div className="flex flex-col items-center justify-center space-y-2 bg-gray-50 dark:bg-gray-700 rounded-sm p-4">
                          <div className="flex items-center text-2xl font-semibold text-sky-600 dark:text-sky-400">
                            <LandPlot className="w-6 h-6 mr-2" />
                            {subjectPropertyData?.yearBuilt || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Year Built</div>
                        </div>
                      </div>
                  </div>
                  
                </div>
                
             
                <Card className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" /> 
                      <span className="text-xl font-semibold">AI Property Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent id="property-summary" className="space-y-6"> 
                    {summaryLoading ? (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <LoaderCircle className="w-4 h-4 animate-spin " />
                        {(() => {
                          switch (summaryState) {
                            case 'preparing':
                              return <FadeIn><span>Preparing property analysis...</span></FadeIn>
                            case 'fetching-data':
                              return <FadeIn><span>Gathering property details...</span></FadeIn>
                            case 'analyzing':
                              return <FadeIn><span>AI analyzing property features...</span></FadeIn>
                            case 'complete':
                              return <FadeIn><span>Analysis complete!</span></FadeIn>
                            case 'error':
                              return <FadeIn><span>❌ Analysis failed, showing fallback data</span></FadeIn>
                            default:
                              return <FadeIn><span>Generating AI-powered property analysis...</span></FadeIn>
                          }
                        })()
                        }
                      </div>
                    ) : structuredSummary ? (
                      <div className="space-y-6">
                        {/* Overview */}
                        <div className="bg-sky-50 dark:bg-gray-800 border-l-4 border-sky-600 dark:border-sky-400 p-4 rounded-sm">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {structuredSummary.overview}
                          </p>
                        </div>

                         {/* Market Position */}
                         <FadeIn>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-sky-600" />
                              Market Position
                            </h3>
                            <FadeInStagger className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  structuredSummary.marketPosition.pricePoint === 'below_market' ? 'bg-green-100 text-green-800' :
                                  structuredSummary.marketPosition.pricePoint === 'above_market' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {structuredSummary.marketPosition.pricePoint.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  structuredSummary.marketPosition.competitiveness === 'high' ? 'bg-green-100 text-green-800' :
                                  structuredSummary.marketPosition.competitiveness === 'low' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {structuredSummary.marketPosition.competitiveness.toUpperCase()} COMPETITIVE
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {structuredSummary.marketPosition.description}
                              </p>
                            </FadeInStagger>
                          </FadeIn>

                        {/* Key Features */}
                        {/* {structuredSummary.keyFeatures && structuredSummary.keyFeatures.length > 0 && (
                          <FadeIn>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                              <Award className="w-5 h-5 text-sky-600" />
                              Key Features
                            </h3>
                            <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {structuredSummary.keyFeatures.map((feature: any, index: number) => (
                                <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 min-h-16">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                      {feature.category === 'size' && <Maximize className="w-4 h-4" />}
                                      {feature.category === 'age' && <Clock className="w-4 h-4" />}
                                      {feature.category === 'location' && <MapPin className="w-4 h-4" />}
                                      {feature.category === 'value' && <DollarSign className="w-4 h-4" />}
                                      {feature.category === 'condition' && <Star className="w-4 h-4" />}
                                      {feature.category === 'amenities' && <Building className="w-4 h-4" />}
                                      {feature.category === 'bedrooms' && <Bed className="w-4 h-4" />}
                                      {feature.category === 'bathrooms' && <Bath className="w-4 h-4" />}
                                      {feature.category === 'market_value' && <TrendingUpIcon className="w-4 h-4" />}
                                      {feature.category === 'rental' && <HomeIcon className="w-4 h-4" />}
                                      {feature.category === 'tax' && <Receipt className="w-4 h-4" />}
                                      {feature.category === 'financial' && <DollarSign className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                        {feature.title}
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {feature.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </FadeInStagger>
                          </FadeIn>
                        )} */}

                        {/* Market Position & Investment Highlights */}
                        <div className=" ">
                         

                          {/* Investment Highlights */}
                          {structuredSummary.investmentHighlights && structuredSummary.investmentHighlights.length > 0 && (
                            <FadeIn>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                <TrendingUpIcon className="w-5 h-5 text-sky-600" />
                                Investment Potential
                              </h3>
                              <FadeInStagger className="gap-3 grid grid-cols-1 lg:grid-cols-4">
                                {structuredSummary.investmentHighlights.map((highlight: any, index: number) => (
                                  <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 min-h-24">
                                    <div className="flex items-start gap-2">
                                   
                                      <CircleCheck className="bg-sky-50 text-sky-600 w-5 h-5 rounded-full "/>
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                          {highlight.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                          {highlight.value}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </FadeInStagger>
                            </FadeIn>
                          )}
                        </div>

                        {/* Property Stats */}
                        {structuredSummary.propertyStats && (
                          <FadeIn>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                              <Badge className="w-5 h-5 text-sky-600" />
                              Property Statistics
                            </h3>
                            <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {structuredSummary.propertyStats.pricePerSqFt && (
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                                  <div className="text-lg font-bold text-sky-600">
                                    ${structuredSummary.propertyStats.pricePerSqFt}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Per Sq Ft</div>
                                </div>
                              )}
                              {structuredSummary.propertyStats.taxRate && (
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                                  <div className="text-lg font-bold text-sky-600">
                                    {structuredSummary.propertyStats.taxRate.toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Tax Rate</div>
                                </div>
                              )}
                              {structuredSummary.propertyStats.rentYield && (
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                                  <div className="text-lg font-bold text-sky-600">
                                    {structuredSummary.propertyStats.rentYield.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Rent Yield</div>
                                </div>
                              )}
                              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                                <div className="text-lg font-bold text-sky-600 capitalize">
                                  {structuredSummary.propertyStats.ageCategory}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Property Age</div>
                              </div>
                            </FadeInStagger>
                          </FadeIn>
                        )}
                      </div>
                    ) : (
                      <div className="bg-sky-50 dark:bg-gray-800 border-l-4 border-sky-600 dark:border-sky-400 p-4 rounded-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          Property analysis will be generated once property data is loaded.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
  
             </CardContent>
          </Card>
          </FadeIn>



            {/* Property Valuation Section */}
            <FadeIn>
            <Card>
              <CardHeader>
              <CardTitle id="property-valuation" className="text-xl md:text-2xl lg:text-3xl font-semibold">Property Valuation</CardTitle>
                <CardDescription>
                  
                  AI property valuation based on current market conditions
                 </CardDescription>
              </CardHeader>
             
              <CardContent>
                  <FadeIn className="flex flex-col justify-center items-center gap-y-4 ">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">Valuation Range</h2>
                    <div className="w-full md:w-3/4 my-4">
                  
                    </div>
                    
                    <div className="flex flex-col mt-4 w-full md:w-3/4 mb-10">
                    <div className="relative w-full">
                      <div className="absolute bg-gray-700 left-1/2 transform -translate-x-1/2 h-full w-1 z-10"></div>
                     
                      <Progress className="h-10 rounded-sm " value={100} />
                    </div>
                     
                    <div className="flex items-center justify-between text-gray-600">
                      <div>
                        Low Estimate
                      </div>
                      <div>
                        Valuation
                      </div>
                      <div>
                        High Estimate
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-semibold text-md">{formatCurrency(getEnhancedPropertyValue() * 0.9)}</span>
                        <div className="text-sm text-gray-500">
                          -10% Range
                        </div>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="font-semibold text-2xl">{formatCurrency(getEnhancedPropertyValue())}</span>
                        <div className="text-sm text-gray-500">
                          {getImprovementValue().totalDepreciatedValue > 0 ? 'Enhanced Value' : 'Base Value'}
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-semibold text-md">{formatCurrency(getEnhancedPropertyValue() * 1.1)}</span>
                        <div className="text-sm text-gray-500">
                          +10% Range
                        </div>
                      </div>
                    </div>
                    
                    {/* Valuation Disclaimer */}
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-600 text-center leading-relaxed">
                        <span className="font-medium">Disclaimer:</span> Valuations are estimates based on available market data and comparable sales. 
                        Actual property value may vary based on home condition, unique features, local market conditions, 
                        and other factors. For precise valuation, a professional appraisal is recommended.
                      </p>
                    </div>
                  </div>  
                  
                  </FadeIn>

                  {/* Improvement Value Breakdown */}
                  {questionnaireData?.improvementDetails && questionnaireData.improvementDetails.length > 0 && (
                    <FadeIn className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800">Property Improvement Value</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Base Property Value:</span>
                          <span className="font-semibold">{formatCurrency(subjectPropertyData?.zestimate || subjectPropertyData?.price || 0)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Improvement Added Value:</span>
                          <span className="font-semibold text-green-600">+{formatCurrency(getImprovementValue().totalDepreciatedValue)}</span>
                        </div>
                        
                        <div className="border-t border-green-300 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-green-800">Enhanced Property Value:</span>
                            <span className="text-xl font-bold text-green-800">{formatCurrency(getEnhancedPropertyValue())}</span>
                          </div>
                        </div>
                        
                        {/* Improvement Details */}
                        <div className="mt-4 pt-3 border-t border-green-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Breakdown:</h4>
                          <div className="space-y-1 text-sm">
                            {getImprovementValue().improvementValuations.map((improvement, index) => (
                              <div key={index} className="flex justify-between text-gray-600">
                                <span>{improvement.improvement} ({improvement.yearsAgo} yrs ago)</span>
                                <span>{formatCurrency(improvement.depreciatedValue)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  <FadeIn className="border my-4 text-sm px-4 py-2 rounded-sm text-sky-600 dark:text-gray-400 bg-gray-50">
                    <div className="flex items-center space-x-2"> 
                      <Sparkles className="w-4 h-4 mr-2 text-sky-600 dark:text-sky-400" /> 
                      <h3 className="text-lg font-semibold">AI Valuation Analysis</h3>
                     
                    </div>
                    <p className="text-sm text-gray-500">Based on the base valuation and does not include any improvements or depreciation.</p>
                   
                    {valuationLoading ? (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mt-2">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        {(() => {
                          switch (valuationState) {
                            case 'preparing':
                              return <FadeIn><span> Preparing valuation analysis...</span></FadeIn>
                            case 'fetching-data':
                              return <FadeIn><span> Gathering property and market data...</span></FadeIn>
                            case 'analyzing':
                              return <FadeIn><span>AI analyzing property value and trends...</span></FadeIn>
                            case 'complete':
                              return <FadeIn><span> Analysis complete!</span></FadeIn>
                            case 'error':
                              return <FadeIn><span>❌ Analysis failed, showing fallback data</span></FadeIn>
                            default:
                              return <FadeIn><span>Generating AI-powered valuation analysis...</span></FadeIn>
                          }
                        })()
                        }
                      </div>
                    ) : structuredValuation ? (
                      <FadeInStagger className="mt-4 space-y-4">
                        {/* Summary */}
                        <div className=" p-3 rounded-md bg-sky-50 border-l-4 border-1 border-sky-500">
                          <p className="text-gray-700 leading-relaxed">{structuredValuation.summary}</p>
                        </div>

                        {/* Market Trend */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 border rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                structuredValuation.marketTrend.direction === 'increasing' ? 'bg-green-500' :
                                structuredValuation.marketTrend.direction === 'decreasing' ? 'bg-red-500' : 'bg-sky-500'
                              }`}></div>
                              <h4 className="font-semibold text-gray-800">Market Trend</h4>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {structuredValuation.marketTrend.strength} {structuredValuation.marketTrend.direction}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{structuredValuation.marketTrend.description}</p>
                          </div>

                          {/* Key Metrics */}
                          <div className="bg-white p-3 border rounded-md">
                            <h4 className="font-semibold text-gray-800 mb-2">12-Month Performance</h4>
                            <div className={`text-lg font-bold ${
                              structuredValuation.keyMetrics.valueChange12Month.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {structuredValuation.keyMetrics.valueChange12Month.isPositive ? '+' : ''}
                              {formatCurrency(structuredValuation.keyMetrics.valueChange12Month.amount)}
                            </div>
                            <div className={`text-sm ${
                              structuredValuation.keyMetrics.valueChange12Month.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ({structuredValuation.keyMetrics.valueChange12Month.percentage > 0 ? '+' : ''}
                              {structuredValuation.keyMetrics.valueChange12Month.percentage.toFixed(1)}%)
                            </div>
                          </div>
                        </div>

                        {/* Insights */}
                        {structuredValuation.insights && structuredValuation.insights.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold  text-gray-800">Key Insights</h4>
                            {structuredValuation.insights.map((insight: any, index: number) => (
                              <div key={index} className={`p-2 rounded-md border bg-white`}>
                  
                                <div className="flex items-center gap-2 w-auto">
                                  <span className={`h-2 w-2 rounded-full text-xs font-medium ${
                                    insight.type === 'positive' ? 'bg-green-600' : 
                                    insight.type === 'negative' ? 'bg-red-600' : 'bg-sky-600'
                                  } `}></span>
                                  <div className={`  font-medium text-sm text-gray-800`}>{insight.title}</div>
                                </div>
                               
                                <div className="text-xs text-gray-600">{insight.description}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendation */}
                        <div className="bg-white p-3 rounded-md border-2  flex flex-col gap-y-2 border-sky-200">
                          <h2 className="font-semibold text-gray-800 ">Recommendation to Seller</h2>
                          <p className="text-sm text-gray-600">For those who may be considering selling in the near term looking for maximum value, we recommend:</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              structuredValuation.recommendation.action === 'sell_now' ? 'bg-green-100 text-green-800' :
                              structuredValuation.recommendation.action === 'sell_soon' ? 'bg-yellow-100 text-yellow-800' :
                              structuredValuation.recommendation.action === 'wait' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {structuredValuation.recommendation.action.replace('_', ' ').toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-500">{structuredValuation.recommendation.timeframe}</span>
                          </div>
                          <p className="text-sm text-gray-700">{structuredValuation.recommendation.reasoning}</p>
                        </div>
                      </FadeInStagger>
                    ) : (
                      <p className="mt-2 leading-relaxed text-gray-600">
                        Valuation analysis will be generated once property data is loaded.
                      </p>
                    )}
                  </FadeIn>
                  <FadeIn>
                    <ChartAreaInteractive 
                      address={avmData?.subjectProperty?.formattedAddress || address} 
                      valueData={valueData}
                    />
                  </FadeIn>
                  {/* Debug info */}
               
                 
              
              </CardContent>
            </Card>
            </FadeIn>
            {/* End Property Valuation Section */}
        

            {/* Market Statistics Section */}
            <FadeIn>
            <Card id="market-statistics" className="bg-white rounded-lg shadow-sm   flex flex-col dark:bg-gray-800 dark:border-blue-700 gap-2">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-semibold">Market Statistics</CardTitle>
                <CardDescription>
                Detailed market trends and pricing analysis for your area
                {marketData?.zipCode && ` (${marketData.zipCode})`}
                </CardDescription>
              </CardHeader>
              <CardContent>
             
                   
                <div className="flex flex-col gap-y-2">

                 
                <Card className="flex flex-col justify-between">
                      <CardHeader>
                      <CardTitle className="text-slate-800">Market Radar</CardTitle>
                      <CardDescription className="text-slate-600">
                      <div className="flex flex-col justify-between gap-y-2">
                          <p className="text-sm flex flex-col md:flex-row items-start md:items-center gap-2 text-gray-600 dark:text-gray-400">
                            Average days on market indicate a 
                            <span className={`font-semibold ${marketSpeed?.color} px-2 py-1 rounded-sm flex flex-row text-sm items-center`}> 
                              {marketSpeed?.icon ? <marketSpeed.icon className="h-4 w-4 mr-1" /> : ''}
                              {marketSpeed?.label}
                            </span>
                          </p>
                          {marketSpeed && (
                        
                            <div className="flex flex-col items-start  rounded-sm">
                            
                                
                              <div className="flex flex-row bg-sky-50 p-2 gap-2 rounded-sm">
                        
                                <Sparkles className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                              
                                <p className="text-sm text-gray-600 dark:text-gray-400  text-left">{marketSpeed.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          // 120 days should be max chart data
                          const avgDaysOnMarket = marketData?.saleData?.averageDaysOnMarket || 0
                          const barValue = (avgDaysOnMarket / 120) * 100

                          return (
                            <div  className="flex flex-row justify-between gap-y-2">
                              <p className={`  ${barValue < 60 ? 'text-sky-500 font-semibold' : 'text-gray-500'}`}>Sellers Market</p>
                              <div className="flex flex-col w-full justify-center px-2">
                                <Progress className="w-full h-10 rounded-sm " value={barValue} />
                                <div className="flex flex-row  text-xs justify-between">
                                  <p>30 days</p>
                                  <p>60 Days</p>
                                  <p>90 Days+</p>
                                
                                </div>
                              </div>
                              <p className={` text-right ${barValue > 60 ? 'text-sky-500 font-semibold' : 'text-gray-500'}`}>Buyers Market</p>

                            </div>
                          )
                        })()}
                          
                     
                      </CardContent>
                      <CardFooter>
                      
                      
                      </CardFooter>
                  </Card>
                
               
                <div className="flex flex-col gap-2 ">
          
                  

                  {/* cols */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
                 

                  {/* box  */}  
                  {/* <Card className="flex flex-col justify-between ">
                    <CardHeader>
                    <CardTitle className="text-slate-800">Average Price</CardTitle>
                    <CardDescription className="text-slate-600">
                    Average price of a <span className="font-semibold"> {avmData?.subjectProperty.propertyType}</span> in <span className="font-semibold"> {avmData?.subjectProperty.zipCode}</span>
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-y-4 justify-between">
                      {(() => {
                        // Get the subject property type from avmData
                        const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                        
                        // Find property type specific data from marketData
                        const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        console.log('subjectPropertyType:', subjectPropertyType);
                        console.log('propertyTypeData:', propertyTypeData);
                        console.log('dataByPropertyType:', marketData?.saleData?.dataByPropertyType);
                        
                        // Use property type specific data if available, otherwise fall back to general market data
                        const avgPrice = propertyTypeData?.averagePrice || marketData?.saleData?.averagePrice;
                        const minPrice = propertyTypeData?.minPrice || marketData?.saleData?.minPrice;
                        const maxPrice = propertyTypeData?.maxPrice || marketData?.saleData?.maxPrice;
                        
                        return (
                          <>
                            <h2 className="font-semibold text-5xl ">{formatCurrency(avgPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">for {avmData?.subjectProperty?.propertyType || 'properties'}s</span></h2>
                            <Separator orientation="horizontal" className="my-4" />
                            <p className="text-xs"><span className="font-semibold">{avmData?.subjectProperty?.addressLine1 || 'Property'}</span> by comparison</p>
                            <Progress value={subjectPropertyData?.price / maxPrice * 100} className="w-full"/> 
                            <div className="flex w-full flex-row text-xs justify-between items-center gap-2">
                              <p>{formatCurrency(minPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">(Low)</span></p>
                              <p>{formatCurrency(maxPrice)} <span className="text-gray-600 text-xs dark:text-gray-400">(High)</span></p>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                        // Get the subject property type from avmData
                        const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                        
                        // Find property type specific data from marketData
                        const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        // Get current property type specific average price
                        const currentPrice = propertyTypeData?.averagePrice || marketData?.saleData?.averagePrice;
                        
                        // Get historical data
                        const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                        const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                        
                        // Find historical property type data if it exists
                        const historicalPropertyTypeData = firstHistoryEntry?.dataByPropertyType?.find(
                          (data: any) => data.propertyType === subjectPropertyType
                        );
                        
                        // Use historical property type price if available, otherwise fall back to general historical price
                        const previousPrice = historicalPropertyTypeData?.averagePrice || firstHistoryEntry?.averagePrice;
                        
                        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
                        const isPositive = change > 0;
                        
                        return (
                          <>  
                            <div className="flex items-center gap-2 leading-none font-medium">
                              {isPositive ? (
                                <span className="flex flex-row items-center gap-2 align-middle">
                                  Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">+{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " />
                                </span>
                              ) : (
                                <span className="flex flex-row items-center gap-2 align-middle ">
                                  Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">-{Math.abs(change).toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" />
                                </span>
                              )} 
                            </div>
                          </>
                        )
                      })()}
                    </CardFooter>
                  </Card> */}

                  {/* box 3  */}
                  <Card className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Average Days on Market</CardTitle>
                      <CardDescription className="text-slate-600">
                        Real estate market conditions assessment
                      </CardDescription>
                    </CardHeader>
                
                    <CardContent className="flex items-center justify-center">
                      {(() => {
                        const avgDaysOnMarket = getDaysOnMarket();
                        return (
                          <span className="font-semibold text-6xl ">{avgDaysOnMarket && !isNaN(avgDaysOnMarket) ? Math.round(avgDaysOnMarket) : 'N/A'}</span>
                        );
                      })()}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                      // Get the subject property type from avmData
                      const subjectPropertyType = avmData?.subjectProperty?.propertyType;
                      
                      // Find property type specific data from marketData
                      const propertyTypeData = marketData?.saleData?.dataByPropertyType?.find(
                        (data: any) => data.propertyType === subjectPropertyType
                      );
                      
                      // Use property type specific days on market if available, otherwise fall back to general market data
                      const currentDays = propertyTypeData?.averageDaysOnMarket || marketData.saleData.averageDaysOnMarket
                      const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                      const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                      const previousDays = firstHistoryEntry.averageDaysOnMarket
                      const change = ((currentDays - previousDays) / previousDays) * 100
                      const isPositive = change > 0
                      
                      return (
                      <>  
                 
                        <div className="flex items-center gap-2 leading-none font-medium">
                       {isPositive ? (
                        <span className="flex flex-row items-center gap-2 align-middle">Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " /></span>
                       ):(
                        <span className="flex flex-row items-center gap-2 align-middle">Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" /></span>
                       )} 
                      </div>
                      {/* <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        January - June 2024
                      </div> */}

                        </>
                        )
                      })()}
                    </CardFooter>
                 
                 </Card>   


                {/* box 3 */}
                 <Card className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Total Listings</CardTitle>
                      <CardDescription className="text-slate-600">
                        Real estate market conditions assessment
                      </CardDescription>
                    </CardHeader>
                
                    <CardContent className="flex items-center justify-center">
                        <span className="font-semibold text-6xl ">{marketData?.saleData.totalListings}</span>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                
                      {marketData?.saleData?.history && Object.keys(marketData.saleData.history).length > 0 && (() => {
                      const currentTotalListings = marketData.saleData.totalListings
                      const historyKeys = Object.keys(marketData.saleData.history).sort().reverse()
                      const firstHistoryEntry = marketData.saleData.history[historyKeys[1]]
                      const previousTotalListings = firstHistoryEntry.totalListings
                      const change = ((currentTotalListings - previousTotalListings) / previousTotalListings) * 100
                      const isPositive = change > 0
                      
                      return (
                      <>  
                 
                        <div className="flex items-center gap-2 leading-none font-medium">
                       {isPositive ? (
                        <span className="flex flex-row items-center gap-2 align-middle">Trending up by <span className="font-semibold bg-green-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingUp className="h-4 w-4 " /></span>
                       ):(
                        <span className="flex flex-row items-center gap-2 align-middle">Trending down by <span className="font-semibold bg-red-100 p-1 rounded-sm">{change.toFixed(1)}%</span> this month <TrendingDown className="h-4 w-4" /></span>
                       )} 
                      </div>
                      {/* <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        January - June 2024
                      </div> */}

                        </>
                        )
                      })()}
                    </CardFooter>
                 
                 </Card>   
                </div>

                {/* end cols */}

           
                </div>
             
      

                {error && !marketData && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700">
                    <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Market Data Unavailable</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {error.includes('No market data available') 
                        ? `Market statistics are not available for this zip code in our database.`
                        : 'Unable to load current market data. Please try again later.'}
                    </p>
                  </div>
                )}
               </div>
              </CardContent>
            
            </Card>
            </FadeIn>
            {/* end Market Statistics Section */}


            {/* Comps Section */}
            <FadeIn>
             <Card id="sales-comparables" className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle  className="text-xl md:text-2xl lg:text-3xl font-semibold">Sales Comparables</CardTitle>
                <CardDescription className="text-sm text-gray-600">Buy and Sell histories of comparable properties</CardDescription>
              </CardHeader>
              <CardContent>
                
                  <div className="flex justify-between gap-4">
                    

                    {/* mapbox */}
                    
                   

                  </div>
                 
                  <div className="relative">
                  <MapboxMap 
                      center={[avmData?.subjectProperty?.longitude || -98.3518, avmData?.subjectProperty?.latitude || 29.4241]}
                      zoom={14}
                      markers={[
                        // Subject property marker
                        {
                          coordinates: [avmData?.subjectProperty?.longitude || -98.3518, avmData?.subjectProperty?.latitude || 29.4241],
                          title: "Subject Property",
                          description: avmData?.subjectProperty?.formattedAddress,
                          color: "#EF4444", // Red for subject property
                          image: propertyImages?.images?.[0] || undefined,
                          data: avmData?.subjectProperty
                        },
                        // Comparable properties markers
                        ...(comps?.comps?.map((comp: any, index: number) => ({
                          coordinates: [comp.longitude, comp.latitude],
                          title: `${comp.formattedChip.location[0].fullValue}, ${comp.formattedChip.location[1].fullValue}`,
                          description: `${comp.address?.streetAddress} - ${formatCurrency(comp.price)}`,
                          color: "#3B82F6", // Blue for comparables
                          image: comp.miniCardPhotos?.[0]?.url,
                          data: comp
                        })) || [])
                      ]}
                      className="w-full h-96 md:h-[600px] mb-4"
                      onMarkerClick={handleMarkerClick}
                    />

                
                    <ComparablesDataTable 
                      data={comps?.comps || []}
                      subjectProperty={subjectPropertyData ? {
                        zpid: subjectPropertyData.zpid,
                        address: {
                          streetAddress: subjectPropertyData.address
                        },
                        formattedChip: {
                          location: [
                            { fullValue: subjectPropertyData.address?.split(',')[0] || subjectPropertyData.address },
                            { fullValue: subjectPropertyData.address?.split(',').slice(1).join(',').trim() || '' }
                          ]
                        },
                        price: subjectPropertyData.zestimate,
                        bedrooms: subjectPropertyData.bedrooms,
                        bathrooms: subjectPropertyData.bathrooms,
                        livingArea: subjectPropertyData.livingArea,
                        homeStatus: 'SUBJECT',
                        miniCardPhotos: propertyImages?.images ? [{ url: propertyImages.images[0] }] : undefined,
                        longitude: subjectPropertyData.longitude,
                        latitude: subjectPropertyData.latitude
                      } : undefined}
                      formatCurrency={formatCurrency}
                      marketStatusColor={marketStatusColor}
                      onRowClick={handleRowClick}
                    />
                  </div>
           
               
              </CardContent>
              </Card>
            </FadeIn>
          
              {/* Property Details Sheet */}
              <PropertyDetailsSheet
                isOpen={isPropertySheetOpen}
                onOpenChange={setIsPropertySheetOpen}
                property={selectedProperty}
              />



           

         
          </div>
        </div>
      </div>

      {/* Property Details Sheet */}
      <PropertyDetailsSheet
        isOpen={isPropertySheetOpen}
        onOpenChange={setIsPropertySheetOpen}
        property={selectedProperty}
      />
      <div className="fixed bottom-4 right-0 z-50">
          {showAgentCard ? (
            <div className="bg-white  rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-80 animate-in slide-in-from-bottom-2 duration-300">
              <div className="relative p-4">
                {/* Close button */}
                <button
                  onClick={() => setShowAgentCard(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                
                {/* Agent info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={agentData.avatar || "/placeholder.svg"}
                      alt={agentData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-gray-900 dark:text-white">{agentData.name}</h3>
                    <p className="text-sm text-black font-semibold uppercase dark:text-sky-400">{agentData.company}</p>
                    <p className="text-sm text-sky-600 dark:text-sky-400">{agentData.title}</p>
                    <a 
                      href={`tel:${agentData.phone}`}
                      className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline cursor-pointer transition-colors"
                    >
                      {agentData.phone}
                    </a>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{agentData.license}</p>
                    
                  </div>
                </div>
                
                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Hi! I'm here to help with your property questions. Let's discuss your real estate needs.
                </p>
                
                {/* Contact button */}
                <div className="flex flex-col gap-2">
                  <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                        Contact Mike
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Send Message to Mike
                        </DialogTitle>
                      </DialogHeader>
                      
                      {/* Email-like interface */}
                      <div className="space-y-4">
                        {/* To field with avatar */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600 min-w-[40px]">To:</Label>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={agentData.avatar || "/placeholder.svg"}
                                alt="Mike Mathias"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium">Mike Mathias</span>
                            <span className="text-sm text-gray-500">&lt;mike@masterkey.com&gt;</span>
                          </div>
                        </div>

                        {/* Subject field */}
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                          <Input
                            id="subject"
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            placeholder="Enter subject..."
                            className="w-full"
                          />
                        </div>

                        {/* Message field */}
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                          <Textarea
                            id="message"
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="min-h-[120px] resize-none"
                          />
                        </div>

                        {/* From info display */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-blue-600 font-medium mb-1">Sending as:</div>
                          <div className="text-sm">
                            {questionnaireData?.name || `${urlContactData.firstName} ${urlContactData.lastName}`.trim() || 'Website Visitor'}
                          </div>
                          {(questionnaireData?.email || urlContactData.email) && (
                            <div className="text-sm text-gray-600">
                              {questionnaireData?.email || urlContactData.email}
                            </div>
                          )}
                          {(questionnaireData?.phone || urlContactData.phone) && (
                            <div className="text-sm text-gray-600">
                              {questionnaireData?.phone || urlContactData.phone}
                            </div>
                          )}
                        </div>

                        {/* Send button */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsContactModalOpen(false)}
                            disabled={isSubmittingContact}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleContactSubmit}
                            disabled={isSubmittingContact || !contactMessage.trim() || !contactSubject.trim()}
                            className="bg-sky-500 hover:bg-sky-600"
                          >
                            {isSubmittingContact ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                        Schedule Zoom Call
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll">
                      <DialogHeader>
                        <DialogTitle>Schedule a Call with Mike</DialogTitle>
                      </DialogHeader>
                      <div className="w-full h-[600px] overflow-y-auto">
              
                        <iframe 
                          src={`https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY${
                            questionnaireData || urlContactData.firstName || urlContactData.lastName || urlContactData.email || urlContactData.phone ? 
                            `?first_name=${encodeURIComponent(
                              questionnaireData?.name?.split(' ')[0] || urlContactData.firstName || ''
                            )}&last_name=${encodeURIComponent(
                              questionnaireData?.name?.split(' ').slice(1).join(' ') || urlContactData.lastName || ''
                            )}&email=${encodeURIComponent(
                              questionnaireData?.email || urlContactData.email || ''
                            )}&phone=${encodeURIComponent(
                              questionnaireData?.phone || urlContactData.phone || ''
                            )}&address=${encodeURIComponent(
                              questionnaireData?.propertyAddress || address || ''
                            )}` 
                            : ''
                          }`}
                          style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }} 
                          scrolling="no" 
                          id="dC0pazbNghUa1xKcbXiY_1759783015630"
                          title="Schedule Appointment"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              
              </div>
            </div>
          ) : (
            /* Collapsed Agent Icon */
            <button
              onClick={() => setShowAgentCard(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-2"
              title="Chat with Mike"
            >
              <div className="flex items-center justify-center">
                <img
                  src={agentData.avatar || "/placeholder.svg"}
                  alt={agentData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </button>
          )}
          <Toaster />
      </div>
    </div>
  )
}
