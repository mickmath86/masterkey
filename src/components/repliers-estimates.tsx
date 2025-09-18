'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin } from 'lucide-react'
import router from 'next/router'


interface RepliersData {
  [key: string]: any
}

interface RepliersEstimatesProps {
  address: string
}

export default function RepliersEstimates({ address }: RepliersEstimatesProps) {
  const [data, setData] = useState<RepliersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/repliers?address=${encodeURIComponent(address)}`)
        
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
     
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">API Response:</h4>
          <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap bg-white p-3 rounded border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        
        {/* Display key-value pairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

