interface CachedPropertyData {
  address: string
  propertyData: any
  images: any
  valueData: any
  avmData: any
  comps: any
  marketData: any
  presentationData: any
  valuationData: any
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  key?: string // Custom cache key
}

export class PropertyCache {
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly CACHE_PREFIX = 'masterkey_property_'
  
  /**
   * Generate a cache key from address
   */
  private static generateKey(address: string, customKey?: string): string {
    if (customKey) return `${this.CACHE_PREFIX}${customKey}`
    
    // Normalize address for consistent caching
    const normalizedAddress = address
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 50) // Limit length
    
    return `${this.CACHE_PREFIX}${normalizedAddress}`
  }

  /**
   * Store property data in cache
   */
  static set(
    address: string, 
    data: Partial<Omit<CachedPropertyData, 'address' | 'timestamp' | 'expiresAt'>>,
    options: CacheOptions = {}
  ): void {
    try {
      const { ttl = this.DEFAULT_TTL, key } = options
      const cacheKey = this.generateKey(address, key)
      const now = Date.now()
      
      // Get existing data to merge with new data
      const existing = this.get(address, { key })
      
      const cachedData: CachedPropertyData = {
        address,
        propertyData: data.propertyData || existing?.propertyData || null,
        images: data.images || existing?.images || null,
        valueData: data.valueData || existing?.valueData || null,
        avmData: data.avmData || existing?.avmData || null,
        comps: data.comps || existing?.comps || null,
        marketData: data.marketData || existing?.marketData || null,
        presentationData: data.presentationData || existing?.presentationData || null,
        valuationData: data.valuationData || existing?.valuationData || null,
        timestamp: now,
        expiresAt: now + ttl
      }

      localStorage.setItem(cacheKey, JSON.stringify(cachedData))
      
      console.log('🗄️ Property data cached:', {
        address,
        cacheKey,
        dataTypes: Object.keys(data),
        expiresIn: `${Math.round(ttl / (1000 * 60))} minutes`
      })
    } catch (error) {
      console.warn('Failed to cache property data:', error)
    }
  }

  /**
   * Retrieve property data from cache
   */
  static get(address: string, options: CacheOptions = {}): CachedPropertyData | null {
    try {
      const { key } = options
      const cacheKey = this.generateKey(address, key)
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) {
        console.log('🗄️ No cached data found for:', address)
        return null
      }

      const data: CachedPropertyData = JSON.parse(cached)
      const now = Date.now()

      // Check if cache has expired
      if (now > data.expiresAt) {
        console.log('🗄️ Cached data expired for:', address)
        this.remove(address, { key })
        return null
      }

      const remainingTime = Math.round((data.expiresAt - now) / (1000 * 60))
      console.log('🗄️ Using cached data for:', address, `(expires in ${remainingTime} minutes)`)
      
      return data
    } catch (error) {
      console.warn('Failed to retrieve cached property data:', error)
      return null
    }
  }

  /**
   * Remove property data from cache
   */
  static remove(address: string, options: CacheOptions = {}): void {
    try {
      const { key } = options
      const cacheKey = this.generateKey(address, key)
      localStorage.removeItem(cacheKey)
      console.log('🗄️ Removed cached data for:', address)
    } catch (error) {
      console.warn('Failed to remove cached property data:', error)
    }
  }

  /**
   * Check if data exists and is valid in cache
   */
  static has(address: string, options: CacheOptions = {}): boolean {
    return this.get(address, options) !== null
  }

  /**
   * Clear all property cache data
   */
  static clearAll(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.CACHE_PREFIX)
      )
      
      keys.forEach(key => localStorage.removeItem(key))
      console.log('🗄️ Cleared all property cache data:', keys.length, 'items')
    } catch (error) {
      console.warn('Failed to clear property cache:', error)
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { totalItems: number; totalSize: number; items: Array<{ address: string; age: number; size: number }> } {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.CACHE_PREFIX)
      )
      
      let totalSize = 0
      const items = keys.map(key => {
        const data = localStorage.getItem(key)
        const size = data ? data.length : 0
        totalSize += size
        
        try {
          const parsed: CachedPropertyData = JSON.parse(data || '{}')
          return {
            address: parsed.address || 'Unknown',
            age: Math.round((Date.now() - parsed.timestamp) / (1000 * 60)), // minutes
            size
          }
        } catch {
          return { address: 'Invalid', age: 0, size }
        }
      })

      return {
        totalItems: keys.length,
        totalSize,
        items
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error)
      return { totalItems: 0, totalSize: 0, items: [] }
    }
  }
}
