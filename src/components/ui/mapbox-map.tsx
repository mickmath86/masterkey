"use client"

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Extend Window interface for global popup handling
declare global {
  interface Window {
    mapboxMarkerData?: { [key: number]: any }
    handlePopupClick?: (markerIndex: number) => void
  }
}

// Set your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

// Add fallback check
if (!mapboxgl.accessToken) {
  console.warn('Mapbox access token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file')
}

interface MapboxMapProps {
  center?: [number, number] // [longitude, latitude]
  zoom?: number
  markers?: Array<{
    coordinates: [number, number]
    title?: string
    description?: string
    color?: string
    image?: string
    data?: any // Additional data to pass back on click
  }>
  className?: string
  style?: string
  onMarkerClick?: (markerData: any) => void
}

export function MapboxMap({
  center = [-118.2437, 34.0522], // Default to Los Angeles
  zoom = 12,
  markers = [],
  className = "w-full h-200",
  style = "mapbox://styles/mapbox/streets-v12",
  onMarkerClick
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Debug logging
  console.log('MapboxMap rendering with:', { center, zoom, markers, className })
  console.log('Mapbox token:', mapboxgl.accessToken)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    console.log('Initializing map...')
    console.log('Container element:', mapContainer.current)
    console.log('Token available:', !!mapboxgl.accessToken)
    console.log('Token value:', mapboxgl.accessToken?.substring(0, 10) + '...')
    
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is not set!')
      return
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mapContainer.current) {
        try {
          console.log('Creating map instance...')
          console.log('Container dimensions:', {
            width: mapContainer.current.offsetWidth,
            height: mapContainer.current.offsetHeight
          })
          
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: style,
            center: center,
            zoom: zoom,
            attributionControl: false
          })

          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
          map.current.addControl(new mapboxgl.AttributionControl({
            compact: true
          }), 'bottom-right')

          map.current.on('load', () => {
            console.log('Map loaded successfully!')
            setMapLoaded(true)
          })

          map.current.on('error', (e) => {
            const errorMessage = e.error?.message || 'Unknown map error'
            console.error('Mapbox error details:', {
              error: e.error || e,
              message: errorMessage,
              stack: e.error?.stack,
              type: e.type,
              target: e.target
            })
            setMapError(errorMessage)
          })

          map.current.on('style.load', () => {
            console.log('Map style loaded!')
          })
        } catch (error) {
          console.error('Error creating map:', error)
        }
      } else {
        console.error('Map container not found after timeout!')
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Add new markers
    markers.forEach((marker, index) => {
      const el = document.createElement('div')
      el.className = 'mapboxgl-marker'
      el.style.backgroundColor = marker.color || '#3B82F6'
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid white'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map.current!)

      if (marker.title || marker.description || marker.image) {
        const popupId = `popup-${index}`
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          anchor: 'left'
        })
          .setHTML(`
            <div class="p-3 max-w-xs" id="${popupId}">
              ${marker.image ? `
                <img 
                  src="${marker.image}" 
                  alt="${marker.title || 'Property'}" 
                  class="w-full h-24 object-cover rounded mb-2"
                  onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+'"
                />
              ` : ''}
              ${marker.title ? `<h3 class="font-semibold text-sm mb-1">${marker.title}</h3>` : ''}
              ${marker.description ? `<p class="text-xs text-gray-600 mb-2">${marker.description}</p>` : ''}
              ${onMarkerClick ? `
                <button 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors duration-200"
                  data-marker-index="${index}"
                  onclick="window.handlePopupClick && window.handlePopupClick(${index})"
                >
                  View Details
                </button>
              ` : ''}
            </div>
          `)

        // Store marker data globally for popup access
        if (onMarkerClick) {
          if (!window.mapboxMarkerData) {
            window.mapboxMarkerData = {}
          }
          window.mapboxMarkerData[index] = marker.data || marker
          
          // Set up global click handler if not already set
          if (!window.handlePopupClick) {
            window.handlePopupClick = (markerIndex: number) => {
              const data = window.mapboxMarkerData?.[markerIndex]
              if (data && onMarkerClick) {
                onMarkerClick(data)
              }
            }
          }
        }

        mapboxMarker.setPopup(popup)
      }
    })

    // Fit map to markers if multiple markers exist
    if (markers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds()
      markers.forEach(marker => bounds.extend(marker.coordinates))
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [markers, mapLoaded])

  // Show error state if no token
  if (!mapboxgl.accessToken) {
    return (
      <div className={className}>
        <div className="w-full h-full rounded-lg border border-red-300 bg-red-50 flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="text-center p-4">
            <div className="text-red-600 mb-2">⚠️ Mapbox Token Required</div>
            <p className="text-sm text-red-700">
              Please add your Mapbox public token to <code className="bg-red-100 px-1 rounded">.env.local</code>
            </p>
            <p className="text-xs text-red-600 mt-1">
              NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if map error occurred
  if (mapError) {
    return (
      <div className={className}>
        <div className="w-full h-full rounded-lg border border-red-300 bg-red-50 flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="text-center p-4">
            <div className="text-red-600 mb-2">🗺️ Map Error</div>
            <p className="text-sm text-red-700 mb-2">{mapError}</p>
            <button 
              onClick={() => {
                setMapError(null)
                window.location.reload()
              }}
              className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
            <p className="text-xs text-gray-500 mt-1">Initializing Mapbox...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg border border-gray-300" style={{ minHeight: '300px' }} />
    </div>
  )
}
