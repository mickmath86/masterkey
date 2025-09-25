"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  ShowerHead,
  Scan,
  LandPlot
} from "lucide-react"
import { ScrollArea } from "@radix-ui/react-scroll-area"

interface PropertyDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  property: {
    id?: string
    formattedAddress?: string
    address?: {
      streetAddress?: string
      city?: string
      state?: string
      zipcode?: string
    }
    formattedChip?: {
      location?: Array<{ fullValue: string }>
    }
    price?: number
    bedrooms?: number
    bathrooms?: number
    livingArea?: number
    lotSize?: number
    yearBuilt?: number
    homeStatus?: string
    propertyType?: string
    propertyTypeDimension?: string
    lastSeenDate?: string
    listedDate?: string
    removedDate?: string
    daysOnMarket?: number
    miniCardPhotos?: Array<{ url: string }>
    attributionInfo?: {
      agentName?: string
      brokerName?: string
      mlsId?: string
    }
    hdpUrl?: string
  } | null
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'RECENTLY_SOLD':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Active':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function PropertyDetailsSheet({ isOpen, onOpenChange, property }: PropertyDetailsSheetProps) {
  if (!property) return null

  const displayStatus = property.homeStatus === "RECENTLY_SOLD" ? "Sold" : property.homeStatus

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[1000px] sm:w-[1000px] overflow-y-auto p-4">
        <ScrollArea className="h-[calc(100vh-10rem)] w-full pr-4 -mr-4">
        <SheetHeader>
          <SheetTitle className="text-left">
            {property.formattedChip?.location?.[0]?.fullValue || property.address?.streetAddress}
          </SheetTitle>
          <SheetDescription className="text-left">
            {property.formattedChip?.location?.[1]?.fullValue || 
             `${property.address?.city}, ${property.address?.state} ${property.address?.zipcode}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Property Image */}
          {property.miniCardPhotos?.[0]?.url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={property.miniCardPhotos[0].url}
                alt={property.address?.streetAddress || "Property"}
                fill
                className="object-cover"
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('data:image/svg+xml')) {
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+";
                  }
                }}
              />
            </div>
          )}

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-900">
              {property.price ? formatCurrency(property.price) : 'Price not available'}
            </div>
            <Badge className={getStatusColor(property.homeStatus || '')}>
              {displayStatus}
            </Badge>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {property.bedrooms || 'N/A'} Bedrooms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShowerHead className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {property.bathrooms || 'N/A'} Bathrooms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {property.livingArea ? `${property.livingArea.toLocaleString()} sqft` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LandPlot className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {property.lotSize ? `${property.lotSize.toLocaleString()} sqft lot` : 'N/A'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Property Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Information</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {property.propertyTypeDimension && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Property Type:</span>
                  <span className="text-sm font-medium">{property.propertyTypeDimension}</span>
                </div>
              )}
              
              {property.yearBuilt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Year Built:</span>
                  <span className="text-sm font-medium">{property.yearBuilt}</span>
                </div>
              )}

              {property.daysOnMarket && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days on Market:</span>
                  <span className="text-sm font-medium">{property.daysOnMarket} days</span>
                </div>
              )}
            </div>
          </div>

          {/* Listing Dates */}
          {(property.listedDate || property.removedDate || property.lastSeenDate) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Listing History</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {property.listedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Listed Date:</span>
                      <span className="text-sm font-medium">{formatDate(property.listedDate)}</span>
                    </div>
                  )}
                  
                  {property.removedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Removed Date:</span>
                      <span className="text-sm font-medium">{formatDate(property.removedDate)}</span>
                    </div>
                  )}

                  {property.lastSeenDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Seen:</span>
                      <span className="text-sm font-medium">{formatDate(property.lastSeenDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Agent Information */}
          {property.attributionInfo && (property.attributionInfo.agentName || property.attributionInfo.brokerName) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Agent Information</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {property.attributionInfo.agentName && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Agent:</span>
                      <span className="text-sm font-medium">{property.attributionInfo.agentName}</span>
                    </div>
                  )}
                  
                  {property.attributionInfo.brokerName && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Brokerage:</span>
                      <span className="text-sm font-medium">{property.attributionInfo.brokerName}</span>
                    </div>
                  )}

                  {property.attributionInfo.mlsId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MLS ID:</span>
                      <span className="text-sm font-medium">{property.attributionInfo.mlsId}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
