'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'

interface GoogleStreetViewProps {
  address: string
  width?: string
  height?: string
  className?: string
  id?: string
}

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export function GoogleStreetView({ 
  address, 
  width = "100%", 
  height = "400px",
  className = "",
  id
}: GoogleStreetViewProps) {
  const streetViewRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streetViewService, setStreetViewService] = useState<any>(null)
  const [panorama, setPanorama] = useState<any>(null)

  const loadGoogleMapsScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve()
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
      if (!apiKey) {
        reject(new Error('Google Maps API key not found'))
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps script'))
      
      document.head.appendChild(script)
    })
  }

  const geocodeAddress = async (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder()
      
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location)
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }

  const initializeStreetView = async () => {
    if (!streetViewRef.current || !window.google) return

    try {
      setIsLoading(true)
      setError(null)

      // Geocode the address to get coordinates
      const location = await geocodeAddress(address)
      
      // Create Street View service
      const service = new window.google.maps.StreetViewService()
      setStreetViewService(service)

      // Check if Street View data is available for this location
      service.getPanorama({
        location: location,
        radius: 50,
        source: window.google.maps.StreetViewSource.OUTDOOR
      }, (data: any, status: any) => {
        if (status === 'OK' && data) {
          // Create Street View panorama
          const panoramaOptions = {
            position: data.location.latLng,
            pov: {
              heading: 0,
              pitch: 0
            },
            zoom: 1,
            visible: true,
            addressControl: true,
            linksControl: true,
            panControl: true,
            zoomControl: true,
            fullscreenControl: true,
            motionTracking: false,
            motionTrackingControl: false
          }

          const pano = new window.google.maps.StreetViewPanorama(
            streetViewRef.current,
            panoramaOptions
          )
          
          setPanorama(pano)
          setIsLoading(false)
        } else {
          setError('Street View imagery not available for this location')
          setIsLoading(false)
        }
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Street View'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!address) return

    const loadAndInitialize = async () => {
      try {
        await loadGoogleMapsScript()
        await initializeStreetView()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Street View'
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    loadAndInitialize()
  }, [address])

  if (isLoading) {
    return (
      <Card className={`${className} flex items-center justify-center`} style={{ width, height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading Street View...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${className} flex items-center justify-center bg-gray-50`} style={{ width, height }}>
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className} style={{ width, height }}>
      <div 
        ref={streetViewRef} 
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg overflow-hidden"
      />
    </Card>
  )
}
