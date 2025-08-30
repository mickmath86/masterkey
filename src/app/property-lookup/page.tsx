"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GooglePlacesInput } from '@/components/ui/google-places-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GoogleMap } from '@/components/ui/google-map';
import { MapPin, Home, Bed, Bath, Square, Calendar, DollarSign, Loader2 } from 'lucide-react';

interface PropertyData {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  zestimate: number;
  propertyType: string;
  homeStatus: string;
  yearBuilt?: number;
  lotSize?: number;
  photos?: string[];
  isFallback?: boolean;
}

export default function PropertyLookupPage() {
  const [address, setAddress] = useState('');
  const [validatedAddress, setValidatedAddress] = useState('');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleAddressChange = (value: string, placeDetails?: google.maps.places.PlaceResult) => {
    setAddress(value);
    if (placeDetails && placeDetails.formatted_address) {
      console.log('Place selected:', placeDetails);
      setValidatedAddress(placeDetails.formatted_address);
    } else {
      setValidatedAddress('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchAddress = validatedAddress || address;
    if (!searchAddress.trim()) return;

    setIsLoading(true);
    setError(null);
    setPropertyData(null);

    try {
      const response = await fetch(`/api/zillow?location=${encodeURIComponent(searchAddress)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setPropertyData(data);
    } catch (err: any) {
      console.error('Error fetching property data:', err);
      setError(err.message || 'Failed to fetch property data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Lookup
          </h1>
          <p className="text-lg text-gray-600">
            Enter an address to get detailed property information and location map
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Search Property
            </CardTitle>
            <CardDescription>
              Enter a complete address to get property details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <GooglePlacesInput
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="e.g., 123 Main St, Los Angeles, CA 90210"
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !address.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
              {validatedAddress && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✓ Address validated: {validatedAddress}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {propertyData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Property Details
                </CardTitle>
                <CardDescription>
                  {propertyData.address}
                  {propertyData.isFallback && (
                    <Badge variant="secondary" className="ml-2">Sample Data</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Information */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(propertyData.zestimate || propertyData.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {propertyData.zestimate ? 'Zestimate' : 'Listed Price'}
                  </div>
                  <Badge variant={propertyData.homeStatus === 'For Sale' ? 'default' : 'secondary'} className="mt-2">
                    {propertyData.homeStatus}
                  </Badge>
                </div>

                <Separator />

                {/* Property Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{propertyData.bedrooms || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{propertyData.bathrooms || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Square className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">
                        {propertyData.livingArea ? formatNumber(propertyData.livingArea) : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{propertyData.yearBuilt || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Property Type</span>
                    <Badge variant="outline">{propertyData.propertyType}</Badge>
                  </div>
                  
                  {propertyData.lotSize && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lot Size</span>
                      <span className="font-medium">{propertyData.lotSize} sq ft</span>
                    </div>
                  )}

                  {propertyData.price !== propertyData.zestimate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Listed Price</span>
                      <span className="font-medium">{formatCurrency(propertyData.price)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <GoogleMap 
              address={propertyData.address} 
              className="h-full min-h-[600px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
