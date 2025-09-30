"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RotateCcw, Trash2 } from "lucide-react"

interface ComparableProperty {
  zpid?: string
  address?: {
    streetAddress?: string
  }
  formattedChip?: {
    location?: Array<{
      fullValue?: string
    }>
  }
  price?: number
  bedrooms?: number
  bathrooms?: number
  livingArea?: number
  homeStatus?: string
  miniCardPhotos?: Array<{
    url?: string
  }>
  longitude?: number
  latitude?: number
}

interface ComparablesDataTableProps {
  data: ComparableProperty[]
  subjectProperty?: ComparableProperty
  formatCurrency: (amount: number) => string
  marketStatusColor: (status: string) => string
  onRowClick?: (property: ComparableProperty) => void
}

export function ComparablesDataTable({ 
  data, 
  subjectProperty,
  formatCurrency, 
  marketStatusColor,
  onRowClick 
}: ComparablesDataTableProps) {
  const [originalData, setOriginalData] = useState<ComparableProperty[]>([])
  const [filteredData, setFilteredData] = useState<ComparableProperty[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Initialize data when prop changes
  useEffect(() => {
    setOriginalData(data)
    setFilteredData(data)
    setSelectedItems(new Set())
  }, [data])

  const getStatusDisplay = (status: string) => {
    return status === "RECENTLY_SOLD" ? "Sold" : status
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map((comp, index) => comp.zpid || index.toString())
      setSelectedItems(new Set(allIds))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedItems(newSelected)
  }

  const handleRemoveSelected = () => {
    const newFilteredData = filteredData.filter((comp, index) => {
      const id = comp.zpid || index.toString()
      return !selectedItems.has(id)
    })
    setFilteredData(newFilteredData)
    setSelectedItems(new Set())
  }

  const handleReset = () => {
    setFilteredData(originalData)
    setSelectedItems(new Set())
  }

  const isAllSelected = filteredData.length > 0 && selectedItems.size === filteredData.length
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < filteredData.length

  // Helper function to render a property row
  const renderPropertyRow = (comp: ComparableProperty, index: number, isSubject: boolean = false) => {
    const id = comp.zpid || index.toString()
    const isSelected = selectedItems.has(id)
    
    return (
      <TableRow 
        key={isSubject ? 'subject-property' : id} 
        className={`${isSubject ? 'bg-sky-50 dark:bg-sky-900/20' : ''} ${!isSubject && onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
        onClick={() => !isSubject && onRowClick && onRowClick(comp)}
      >
        <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          {isSubject ? (
            <div className="w-4 h-4 flex items-center justify-center">
              <span className="text-xs font-bold text-sky-600">S</span>
            </div>
          ) : (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked: boolean) => handleSelectItem(id, checked)}
              aria-label={`Select ${comp.formattedChip?.location?.[0]?.fullValue || 'property'}`}
            />
          )}
        </TableCell>
        <TableCell>
          <Badge 
            variant={isSubject ? "default" : "secondary"}
            className={isSubject ? "bg-sky-600 text-white" : marketStatusColor(comp.homeStatus || '')}
          >
            {isSubject ? 'Subject' : getStatusDisplay(comp.homeStatus || 'Unknown')}
          </Badge>
        </TableCell>
        <TableCell>
          <Image 
            className="rounded-sm object-cover" 
            src={comp.miniCardPhotos?.[0]?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+"} 
            alt={comp.address?.streetAddress || "Property"} 
            width={80} 
            height={60}
            unoptimized={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('data:image/svg+xml')) {
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0yNSAzNUg3NVY2NUgyNVYzNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPHA+CjxwYXRoIGQ9Ik00NSA1NUw1NSA0NUw2NSA1NUw3MCA2MEgyNUw0NSA1NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIj5OTyBJTUFHRTwvdGV4dD4KPHA+Cjx0ZXh0IHg9IjUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM2QjcyODAiPkFWQUlMQUJMRTwvdGV4dD4KPC9zdmc+";
              }
            }}
          />
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className={`font-medium ${isSubject ? 'text-sky-600' : ''}`}>
              {comp.formattedChip?.location?.[0]?.fullValue}, {comp.formattedChip?.location?.[1]?.fullValue}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <span className={`text-lg font-semibold ${isSubject ? 'text-sky-600' : ''}`}>
            {comp.price ? formatCurrency(comp.price) : 'N/A'}
          </span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{comp.bedrooms || 'N/A'}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{comp.bathrooms || 'N/A'}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{comp.livingArea ? comp.livingArea.toLocaleString() : 'N/A'}</span>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveSelected}
            disabled={selectedItems.size === 0}
            className="flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove Selected ({selectedItems.size})</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={filteredData.length === originalData.length}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredData.length} of {originalData.length} comparables
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Baths</TableHead>
              <TableHead>Sq Ft</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
{/* Subject Property Row (if provided) */}
            {subjectProperty && renderPropertyRow(subjectProperty, -1, true)}
            
            {/* Comparable Properties */}
            {filteredData?.length ? (
              filteredData.map((comp, index) => renderPropertyRow(comp, index, false))
            ) : (
              !subjectProperty && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No comparable properties found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
