export const MOCK_PROPERTY_DATA = {
  address: "123 Main Street, San Francisco, CA 94102",
  price: 1250000,
  bedrooms: 3,
  bathrooms: 2.5,
  livingArea: 2100,
  lotSize: 5000,
  zestimate: 1250000,
  propertyType: 'Single Family Home',
  homeStatus: 'For Sale',
  yearBuilt: 1985,
  priceHistory: [
    { date: '2024-01', price: 1200000 },
    { date: '2024-02', price: 1220000 },
    { date: '2024-03', price: 1235000 },
    { date: '2024-04', price: 1250000 },
  ],
  photos: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
  ],
  description: "Beautiful single-family home in prime San Francisco location. Recently updated kitchen and bathrooms, hardwood floors throughout, and a spacious backyard perfect for entertaining.",
  isFallback: true
}

export const MOCK_MARKET_DATA = {
  zipCode: "94102",
  saleData: {
    averageDaysOnMarket: 28,
    averageListPrice: 1400000,
    averagePrice: 1350000,
    averagePricePerSquareFoot: 850,
    medianListPrice: 1380000,
    medianPrice: 1320000,
    totalListings: 45,
    totalSales: 32,
    newListings: 12,
    priceReduction: {
      percent: 8.5,
      count: 4
    }
  },
  rentalData: {
    averageDaysOnMarket: 15,
    averageRentPrice: 4200,
    averageRentPricePerSqft: 3.2,
    medianRentPrice: 4000,
    totalListings: 28,
    totalRentals: 22
  },
  lastUpdated: new Date().toISOString(),
  isFallback: true
}

// Development flags - control mock data usage
// Set FORCE_USE_MOCK_DATA to true to always use mock data in development
// Set to false to always use real APIs in development
// Leave undefined to auto-detect based on NODE_ENV
export const FORCE_USE_MOCK_DATA: boolean | undefined = true // Change this to toggle!

// Final determination of whether to use mock data
export const USE_MOCK_DATA = FORCE_USE_MOCK_DATA !== undefined 
  ? FORCE_USE_MOCK_DATA 
  : process.env.NODE_ENV === 'development'
