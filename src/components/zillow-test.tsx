"use client"

import { useState } from "react"
import { getZillowAPI } from '@/lib/api/zillow'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ZillowTestComponent() {
  const [testAddress, setTestAddress] = useState('')
  const [testData, setTestData] = useState<any>(null)
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)

  const handleTestSearch = async () => {
    if (!testAddress.trim()) return
    
    setIsTestLoading(true)
    setTestError(null)
    setTestData(null)

    try {
      const zillowAPI = getZillowAPI()
      // Test both available endpoints
      const [searchResult, propertyResult] = await Promise.all([
        zillowAPI.searchProperty(testAddress),
        zillowAPI.getPropertyDetails(testAddress)
      ])
      
      setTestData({
        searchProperty: searchResult,
        propertyDetails: propertyResult,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setTestError(error.message)
    } finally {
      setIsTestLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 p-6 border rounded-lg bg-yellow-50 border-yellow-200">
        <h1 className="text-2xl font-bold mb-4 text-yellow-800">🧪 Zillow RapidAPI Test Component</h1>
        <p className="text-yellow-700 mb-4">
          Test the Zillow RapidAPI integration by entering an address. Try broader searches like "Los Angeles, CA" or "90210" for better results.
        </p>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter address to test (e.g., Los Angeles, CA or 90210)"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTestSearch()}
            className="flex-1"
          />
          <Button onClick={handleTestSearch} disabled={isTestLoading}>
            {isTestLoading ? 'Testing...' : 'Test API'}
          </Button>
        </div>

        {testError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {testError}
            {testError.includes('Rate limit') && (
              <p className="mt-2 text-sm">
                Rate limit exceeded. The API has usage limits. Try again in a few minutes or use mock data for testing.
              </p>
            )}
          </div>
        )}

        {testData && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <strong>Test completed at:</strong> {new Date(testData.timestamp).toLocaleString()}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🔍 Search Property Results
                    {testData.searchProperty && (
                      <span className="text-sm font-normal text-green-600">✓ Found</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.searchProperty ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Address:</strong> {typeof testData.searchProperty.address === 'object' ? JSON.stringify(testData.searchProperty.address) : testData.searchProperty.address}</div>
                        <div><strong>Price:</strong> ${testData.searchProperty.price?.toLocaleString()}</div>
                        <div><strong>Bedrooms:</strong> {testData.searchProperty.bedrooms}</div>
                        <div><strong>Bathrooms:</strong> {testData.searchProperty.bathrooms}</div>
                        <div><strong>Living Area:</strong> {testData.searchProperty.livingArea} sq ft</div>
                        <div><strong>Status:</strong> {testData.searchProperty.homeStatus}</div>
                      </div>
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium">View Raw JSON</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(testData.searchProperty, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <p className="text-gray-500">No search results returned. Try a broader search like a city or zip code.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🏠 Property Details
                    {testData.propertyDetails && (
                      <span className="text-sm font-normal text-green-600">✓ Found</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testData.propertyDetails ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Address:</strong> {typeof testData.propertyDetails.address === 'object' ? JSON.stringify(testData.propertyDetails.address) : testData.propertyDetails.address}</div>
                        <div><strong>Price:</strong> ${testData.propertyDetails.price?.toLocaleString()}</div>
                        <div><strong>Bedrooms:</strong> {testData.propertyDetails.bedrooms}</div>
                        <div><strong>Bathrooms:</strong> {testData.propertyDetails.bathrooms}</div>
                        <div><strong>Living Area:</strong> {testData.propertyDetails.livingArea} sq ft</div>
                        <div><strong>Status:</strong> {testData.propertyDetails.homeStatus}</div>
                      </div>
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium">View Raw JSON</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(testData.propertyDetails, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <p className="text-gray-500">No property details returned.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
