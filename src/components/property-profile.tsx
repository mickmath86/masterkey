'use client'

import RepliersEstimates from './repliers-estimates'
import Navbar3 from './navbar3'
import { useRouter } from 'next/navigation'
import { Calendar, ChevronLeft, DownloadCloudIcon, ListCheckIcon, MapPin, UserCheck, Video } from 'lucide-react'
import { useState, useEffect } from 'react'
import GaugeComponent from 'react-gauge-component'

interface RepliersData {
    [key: string]: any
  }
  
  interface RepliersEstimatesProps {
    address: string
  }

const agentData = {
    name: "Mike Mathias",
    avatar: "/mike-avatar.png",
    title: "Senior Real Estate Agent",
    rating: 4.9,
    reviews: 127,
    yearsExperience: 8,
  }

export default function PropertyProfile({ address }: { address: string }) {
    const [data, setData] = useState<RepliersData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(`/api/rentcast?address=${encodeURIComponent(address)}`)
            
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error || 'Failed to fetch data')
            }
            
            const result = await response.json()
            setData(result)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
          } finally {
            setLoading(false)
          }
        }
    
        if (address) {
          fetchData()
        }
      }, [address])

      if (loading) {
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading Repliers estimates...</span>
            </div>
          </div>
        )
      }
    
      if (error) {
        return (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Estimates</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )
      }
      if (!data) {
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center text-gray-500">
              No estimate data available
            </div>
          </div>
        )
      }

   
    return (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
                <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to search
                </button>
                <div className="flex items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
                </div>
            </div>
         </div>
         <div className="bg-sky-50 border-b border-sky-200 dark:bg-sky-900/20 dark:border-sky-800 sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <button
              onClick={() => scrollToSection("home-value")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home Value
            </button>
            <button
              onClick={() => scrollToSection("property-photos")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Photos & Map
            </button>
            <button
              onClick={() => scrollToSection("property-details")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Property Details
            </button>
            <button
              onClick={() => scrollToSection("market-statistics")}
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Market Data
            </button>
         
              <button
                onClick={() => scrollToSection("tax-history")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tax History
              </button>
       
          </nav>
        </div>
       
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* left modules */}
        <div className="flex flex-col gap-8">

            {/* Agent Card Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
                <div className="sticky top-20">
                <div className="bg-white rounded-lg shadow-sm border border-sky-200 dark:bg-gray-800 dark:border-sky-700">
                    <div className="text-center p-6">
                    <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-3">
                        <img
                        src={agentData.avatar || "/placeholder.svg"}
                        alt={agentData.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agentData.name}</h3>
                    <p className="text-sky-700 dark:text-sky-300">{agentData.title}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-sky-600 dark:text-sky-400 mt-2">
                        <span>⭐ {agentData.rating}</span>
                        <span>•</span>
                        <span>{agentData.reviews} reviews</span>
                        <span>•</span>
                        <span>{agentData.yearsExperience} years</span>
                    </div>
                    </div>
                    <div className="px-6 pb-6 space-y-3">
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                        <Video className="h-4 w-4 mr-2" />
                        Schedule Zoom Call
                    </button>
                    <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule In Person
                    </button>
                    <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Chat with Mike Now
                    </button>
                    </div>
                </div>
                </div>
            </div>
            {/* Resource Card Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
                <div className="sticky top-20">
                    <div className="bg-white rounded-lg shadow-sm border border-sky-200 dark:bg-gray-800 dark:border-sky-700">
                        <div className="text-center p-6">
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resources</h3>
            
                        </div>
                        <div className="px-6 pb-6 space-y-3">
                        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                            <DownloadCloudIcon className="h-4 w-4 mr-2" />
                            Download Official CMA
                        </button>
                        <button className="w-full border border-sky-300 text-sky-700 hover:bg-sky-50 bg-transparent px-4 py-3 cursor-pointer rounded-md font-medium flex items-center justify-center">
                            <ListCheckIcon   className="h-4 w-4 mr-2" />
                        Download Sellers Checklist
                        </button>
                        
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        
        {/* main modules */}
        <div className="flex-1 space-y-8">
            {/* Home Value Section */}
            <div id="home-value" className="bg-white rounded-lg shadow-sm border-2 border-sky-200 dark:bg-gray-800 dark:border-sky-700">
              <div className="p-6">
                <div className="text-center mb-6">
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Estimated Home Value </p>
                  <div className="z-20"> 
                    
                   <GaugeComponent
                        // value={data.estimate.value}
                        
                       
                   />
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>
      </div>
         {/* <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <RepliersEstimates address={address} />
            </div>
         </div> */}
        </>
    )
}