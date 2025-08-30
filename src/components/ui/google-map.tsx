"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"
import { getGoogleMapsAPI, type PlaceDetails, type MapConfig } from "@/lib/api/google-maps"

interface GoogleMapProps {
  address: string
  className?: string
  id?: string
}

export function GoogleMap({ address, className, id }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 50 // Prevent infinite loops

    const initializeMap = async () => {
      if (!isMounted) return
      
      if (!address) {
        console.log('GoogleMap: Missing address', { address })
        return
      }
      
      if (!mapRef.current) {
        if (retryCount >= maxRetries) {
          console.error('GoogleMap: Max retries reached, stopping')
          setError('Failed to initialize map container')
          return
        }
        retryCount++
        console.log(`GoogleMap: mapRef not ready, retrying... (${retryCount}/${maxRetries})`)
        setTimeout(initializeMap, 100)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        console.log('GoogleMap: Starting initialization with address:', address)

        // Check for API key - in client components, we need to access it differently
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        console.log('GoogleMap: API key check:', { 
          hasApiKey: !!apiKey, 
          keyLength: apiKey?.length,
          envKeys: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
        })
        
        if (!apiKey) {
          console.error('GoogleMap: API key not found')
          setError("Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.")
          return
        }

        // Load Google Maps API
        console.log('GoogleMap: Loading Google Maps API...')
        await new Promise<void>((resolve, reject) => {
          if (typeof google !== 'undefined' && google.maps) {
            console.log('GoogleMap: Google Maps API already loaded')
            resolve()
            return
          }

          // Check if script is already loading
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
          if (existingScript) {
            console.log('GoogleMap: Script already loading, waiting...')
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps API')))
            return
          }

          const script = document.createElement('script')
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
          script.async = true
          script.defer = true
          
          script.onload = () => {
            console.log('GoogleMap: Google Maps API loaded successfully')
            resolve()
          }
          script.onerror = () => {
            console.error('GoogleMap: Failed to load Google Maps API')
            reject(new Error('Failed to load Google Maps API'))
          }
          
          document.head.appendChild(script)
        })

        // Geocode the address
        console.log('GoogleMap: Starting geocoding for address:', address)
        const geocoder = new google.maps.Geocoder()
        const geocodeResult = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            console.log('GoogleMap: Geocoding result:', { status, resultsLength: results?.length })
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              console.log('GoogleMap: Geocoding successful:', results[0].formatted_address)
              resolve(results[0])
            } else {
              console.error('GoogleMap: Geocoding failed:', status)
              resolve(null)
            }
          })
        })

        if (!geocodeResult) {
          setError("Unable to find location for the provided address")
          return
        }

        const location = geocodeResult.geometry?.location
        if (!location) {
          setError("Invalid location data")
          return
        }

        // Set place details
        setPlaceDetails({
          address,
          formattedAddress: geocodeResult.formatted_address || address,
          lat: location.lat(),
          lng: location.lng(),
          placeId: geocodeResult.place_id || '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
        })

        // Create and initialize map
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: location.lat(), lng: location.lng() },
          zoom: 16,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        })

        // Add marker
        new google.maps.Marker({
          position: { lat: location.lat(), lng: location.lng() },
          map,
          title: `Property at ${geocodeResult.formatted_address}`,
        })

        setMap(map)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to load map. Please check your API configuration.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      isMounted = false
    }
  }, [address])

  const openInGoogleMaps = () => {
    if (placeDetails) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        placeDetails.formattedAddress
      )}`
      window.open(url, "_blank")
    }
  }

  return (
    <Card className={className} id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
        <CardDescription>
          Interactive map showing the exact location and surrounding area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="h-80 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 font-medium mb-2">Map Error</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div
              ref={mapRef}
              className="h-80 w-full rounded-lg border"
              style={{ minHeight: "320px" }}
            />
            
            {placeDetails && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">{placeDetails.formattedAddress}</p>
                  {placeDetails.city && placeDetails.state && (
                    <p>{placeDetails.city}, {placeDetails.state} {placeDetails.zipCode}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInGoogleMaps}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Maps
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
