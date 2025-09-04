"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar3 from '@/components/navbar3';
import { Footer } from '@/components/footer';
import { 
  TrendingUpIcon, 
  HomeIcon, 
  MapPinIcon, 
  CalendarIcon,
  DollarSignIcon,
  BarChart3Icon,
  SearchIcon,
  TargetIcon,
  DatabaseIcon,
  ZapIcon
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
    <div className="min-h-screen bg-white">
      <Navbar3 />
      
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-sky-100/20 pt-14">
        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-sky-600/10 ring-1 ring-sky-50 sm:-mr-80 lg:-mr-96" />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              Advanced Market Intelligence at Your Fingertips
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                Leverage MasterKey's sophisticated analytics platform to make data-driven real estate decisions. Our proprietary tools analyze market trends, comparable sales, and pricing strategies to give you the competitive edge.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-500">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools & Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-600">Powerful Analytics</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to dominate your market
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive suite of market analysis tools gives you the insights needed to price properties accurately, identify trends, and make profitable investment decisions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <TargetIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Precision Pricing Engine
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our AI-powered valuation model analyzes thousands of data points to provide accurate property valuations within 3% of market value.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <TrendingUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Market Trend Forecasting
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Predict market movements up to 12 months in advance using our proprietary trend analysis algorithms and economic indicators.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <DatabaseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Comprehensive Comps Database
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Access the most complete database of comparable sales, including off-market transactions and pending sales data.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
                    <ZapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Real-Time Market Alerts
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Get instant notifications when market conditions change, new listings match your criteria, or price adjustments occur.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Interactive Search Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Try Our Market Analysis Tool
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Enter any address or area to see our advanced analytics in action
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter address, city, or ZIP code"
                value={searchLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchLocation(e.target.value)}
                className="flex-1"
                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="lg" className="bg-sky-600 hover:bg-sky-500">
                <BarChart3Icon className="w-4 h-4 mr-2" />
                Analyze Market
              </Button>
            </div>
          </div>
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

      {/* Stats Section */}
      <div className="bg-sky-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by real estate professionals nationwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-sky-200">
                Our platform processes millions of data points daily to deliver the most accurate market insights
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-sky-200">Properties Analyzed</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">2.5M+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-sky-200">Accuracy Rate</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">97%</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-sky-200">Markets Covered</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">500+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-sky-200">Active Users</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">25K+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to gain your competitive advantage?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of real estate professionals who rely on MasterKey's market intelligence to close more deals and maximize profits.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-500">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
