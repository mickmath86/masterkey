"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gradient } from '@/components/gradient';
import { FadeInUp, FadeInStagger } from '@/components/animations';
import { 
  TrendingUpIcon, 
  HomeIcon, 
  MapPinIcon, 
  CalendarIcon,
  DollarSignIcon,
  BarChart3Icon,
  ChevronLeftIcon
} from 'lucide-react';

interface MarketData {
  averagePrice: string;
  medianPrice: string;
  priceChange: string;
  daysOnMarket: string;
  inventoryLevel: string;
  trend: 'up' | 'down' | 'stable';
}

const sampleMarketData: MarketData = {
  averagePrice: '$485,000',
  medianPrice: '$425,000',
  priceChange: '+3.2%',
  daysOnMarket: '28',
  inventoryLevel: 'Low',
  trend: 'up'
};

const recentSales = [
  { address: '123 Oak Street', price: '$465,000', beds: 3, baths: 2, sqft: '1,850', daysAgo: 5 },
  { address: '456 Maple Ave', price: '$520,000', beds: 4, baths: 3, sqft: '2,200', daysAgo: 12 },
  { address: '789 Pine Road', price: '$398,000', beds: 2, baths: 2, sqft: '1,450', daysAgo: 18 },
  { address: '321 Elm Drive', price: '$675,000', beds: 4, baths: 3.5, sqft: '2,800', daysAgo: 22 },
];

export default function MarketAnalysisPage() {
  const [searchLocation, setSearchLocation] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
                <p className="text-gray-600 mt-1">Get comprehensive market insights and property valuations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <Gradient className="absolute inset-0 opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp delay={0.2}>
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover Your Local Market
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <p className="text-xl text-blue-100 mb-8">
              Enter your location to get detailed market analysis, recent sales, and property trends
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.6}>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter city, state or ZIP code"
                value={searchLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchLocation(e.target.value)}
                className="flex-1 bg-white"
                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="lg">
                <BarChart3Icon className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Market Analysis for {searchLocation}
            </h3>
            <p className="text-gray-600">
              Data updated as of {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{sampleMarketData.averagePrice}</span>
                  <HomeIcon className="w-5 h-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Median Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{sampleMarketData.medianPrice}</span>
                  <DollarSignIcon className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Price Change (YoY)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{sampleMarketData.priceChange}</span>
                  <TrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. Days on Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{sampleMarketData.daysOnMarket}</span>
                  <CalendarIcon className="w-5 h-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                  <CardDescription>
                    Key trends and analysis for {searchLocation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Seller's Market
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Low inventory with high demand driving prices up
                    </span>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-700">
                      <strong>Market Trend:</strong> The local market is experiencing steady growth with a 
                      {sampleMarketData.priceChange} increase in home values over the past year. 
                      Properties are selling quickly with an average of {sampleMarketData.daysOnMarket} days on market.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <p className="text-sm text-gray-700">
                      <strong>Inventory Level:</strong> Current inventory is {sampleMarketData.inventoryLevel.toLowerCase()}, 
                      creating competitive conditions for buyers. Consider acting quickly on desirable properties.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Get Personalized Analysis</CardTitle>
                  <CardDescription>
                    Speak with our market experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Schedule Consultation
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request CMA Report
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Free comparative market analysis for your property
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales in {searchLocation}</CardTitle>
              <CardDescription>
                Comparable properties sold in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Beds/Baths</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Sq Ft</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            {sale.address}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{sale.price}</td>
                        <td className="py-3 px-4 text-gray-600">{sale.beds}bd / {sale.baths}ba</td>
                        <td className="py-3 px-4 text-gray-600">{sale.sqft} sq ft</td>
                        <td className="py-3 px-4 text-gray-600">{sale.daysAgo} days ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call to Action */}
      {!showResults && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Market Analysis Matters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Price Trends</h4>
              <p className="text-gray-600 text-sm">
                Understand how property values are changing in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3Icon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Market Conditions</h4>
              <p className="text-gray-600 text-sm">
                Know if it's a buyer's or seller's market in your neighborhood
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Property Values</h4>
              <p className="text-gray-600 text-sm">
                Get accurate valuations based on recent comparable sales
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
