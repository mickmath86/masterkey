'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your-mapbox-token-here'

interface Property {
  id: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  yearBuilt?: number
  propertyType: string
  status: 'for-sale' | 'for-rent' | 'sold'
  images: string[]
  coordinates: [number, number]
  daysOnMarket?: number
  pricePerSqft?: number
}

interface PropertyMapProps {
  properties: Property[]
  selectedProperty?: Property | null
}

export default function PropertyMap({ properties, selectedProperty }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // Initialize Mapbox
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Add property markers to map and fit bounds
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    if (properties.length === 0) return

    // Add markers for properties
    properties.forEach(property => {
      // Skip properties with invalid coordinates
      if (!property.coordinates || property.coordinates.length !== 2) return
      
      const el = document.createElement('div')
      el.className = 'property-marker'
      
      const price = property.price || 0
      const displayPrice = property.status === 'for-rent' 
        ? (price > 0 ? `$${price.toLocaleString()}/mo` : 'Price N/A')
        : (price > 0 ? `$${(price / 1000).toFixed(0)}K` : 'Price N/A')
      
      el.innerHTML = `
        <div class="bg-white border-2 border-blue-500 rounded-lg px-2 py-1 text-sm font-semibold shadow-lg cursor-pointer hover:bg-blue-50">
          ${displayPrice}
        </div>
      `
      
      const formattedPrice = price > 0 
        ? `$${price.toLocaleString()}${property.status === 'for-rent' ? '/mo' : ''}`
        : 'Price not available'
      
      new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <img src="${property.images[0]}" alt="Property" class="w-full h-32 object-cover rounded mb-2" />
                <div class="font-semibold">${formattedPrice}</div>
                <div class="text-sm text-gray-600">${property.beds} bed • ${property.baths} bath • ${property.sqft.toLocaleString()} sqft</div>
                <div class="text-sm text-gray-600">${property.address}</div>
              </div>
            `)
        )
        .addTo(map.current!)
    })

    // Fit map to show all properties
    if (properties.length === 1) {
      // Single property - center and zoom
      map.current.flyTo({
        center: properties[0].coordinates,
        zoom: 15,
        duration: 1000
      })
    } else if (properties.length > 1) {
      // Multiple properties - fit bounds
      const bounds = new mapboxgl.LngLatBounds()
      properties.forEach(property => {
        bounds.extend(property.coordinates)
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
        maxZoom: 15
      })
    }
  }, [properties])

  // Center map on selected property
  useEffect(() => {
    if (selectedProperty && map.current) {
      map.current.flyTo({
        center: selectedProperty.coordinates,
        zoom: 15,
        duration: 1000
      })
    }
  }, [selectedProperty])

  return <div ref={mapContainer} className="w-full h-full" />
}
