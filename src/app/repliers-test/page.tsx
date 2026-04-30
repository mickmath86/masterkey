'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Listing {
  boardId: string;
  mlsNumber: string;
  class: string;
  status: string;
  listPrice: number;
  listDate: string;
  soldPrice?: number;
  soldDate?: string;
  updatedOn: string;
  address: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  lastStatus: string;
  details: {
    numBathrooms?: number;
    numBathroomsPlus?: number;
    numBedrooms?: number;
    numBedroomsPlus?: number;
    propertyType?: string;
    sqft?: number;
  };
  images?: string[];
}

interface ApiResponse {
  success: boolean;
  count: number;
  listings: Listing[];
  error?: string;
  details?: string;
}

export default function RepliersTestPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/repliers-test');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching Repliers data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (address: Listing['address']) => {
    const parts = [
      address.streetNumber,
      address.streetName,
      address.city,
      address.state,
      address.zip,
    ].filter(Boolean);
    return parts.join(' ') || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Repliers.io API Test
          </h1>
          <p className="text-slate-600">
            Testing connection to Repliers.io MLS data API
          </p>
        </div>

        {loading && (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-slate-600">Loading Repliers data...</span>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-8 border-red-200 bg-red-50">
            <div className="text-red-800">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          </Card>
        )}

        {!loading && !error && data && (
          <>
            <Card className="p-6 mb-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    API Connection Successful ✅
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Found {data.count} residential listings
                  </p>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                      Show raw API response (debug)
                    </summary>
                    <pre className="mt-2 p-4 bg-slate-50 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </details>
                </div>
                <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                  Connected
                </Badge>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        MLS #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Beds/Baths
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Sqft
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        List Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {Array.isArray(data.listings) && data.listings.map((listing, index) => (
                      <tr
                        key={listing.mlsNumber || index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {listing.mlsNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {formatAddress(listing.address)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {formatPrice(listing.listPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {listing.details.numBedrooms || 0} bd / {listing.details.numBathrooms || 0} ba
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {listing.details.sqft?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={
                              listing.status === 'A'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }
                          >
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {formatDate(listing.listDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {data.listings.length === 0 && (
              <Card className="p-8 mt-6 text-center">
                <p className="text-slate-600">
                  No listings found for the specified criteria.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
