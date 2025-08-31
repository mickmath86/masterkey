/**
 * Address parsing utilities
 * Functions to extract zipcode and other address components
 */

/**
 * Extract zipcode from an address string
 * Supports various address formats:
 * - "123 Main St, Los Angeles, CA 90210"
 * - "123 Main St, Los Angeles, CA 90210-1234"
 * - "Los Angeles, CA 90210"
 */
export function extractZipcode(address: string): string | null {
  if (!address) return null

  // Remove extra whitespace and normalize
  const cleanAddress = address.trim()

  // Pattern to match 5-digit zipcode (with optional 4-digit extension)
  const zipcodePattern = /\b(\d{5})(?:-\d{4})?\b/g
  const matches = cleanAddress.match(zipcodePattern)

  if (matches && matches.length > 0) {
    // Return the last match (most likely to be the zipcode)
    const lastMatch = matches[matches.length - 1]
    // Extract just the 5-digit portion
    return lastMatch.substring(0, 5)
  }

  return null
}

/**
 * Validate if a string is a valid US zipcode
 */
export function isValidZipcode(zipcode: string): boolean {
  if (!zipcode) return false
  
  // Must be exactly 5 digits
  const zipcodeRegex = /^\d{5}$/
  return zipcodeRegex.test(zipcode)
}

/**
 * Parse address components from a formatted address string
 * Returns an object with street, city, state, and zipcode
 */
export function parseAddress(address: string): {
  street?: string
  city?: string
  state?: string
  zipcode?: string
} {
  if (!address) return {}

  const cleanAddress = address.trim()
  
  // Extract zipcode first
  const zipcode = extractZipcode(cleanAddress)
  
  // Remove zipcode from address for further parsing
  let remainingAddress = cleanAddress
  if (zipcode) {
    remainingAddress = cleanAddress.replace(new RegExp(`\\b${zipcode}(-\\d{4})?\\b`), '').trim()
    remainingAddress = remainingAddress.replace(/,$/, '') // Remove trailing comma
  }

  // Split by commas to get components
  const parts = remainingAddress.split(',').map(part => part.trim()).filter(part => part.length > 0)
  
  let street, city, state

  if (parts.length >= 3) {
    // Format: "123 Main St, Los Angeles, CA"
    street = parts[0]
    city = parts[1]
    state = parts[2]
  } else if (parts.length === 2) {
    // Format: "Los Angeles, CA" or "123 Main St, Los Angeles"
    // Check if second part looks like a state (2 letters)
    if (parts[1].length === 2 && /^[A-Z]{2}$/i.test(parts[1])) {
      city = parts[0]
      state = parts[1]
    } else {
      street = parts[0]
      city = parts[1]
    }
  } else if (parts.length === 1) {
    // Single part - could be street, city, or just zipcode
    if (!zipcode) {
      // If no zipcode found, assume it's a city or street
      street = parts[0]
    }
  }

  return {
    street,
    city,
    state,
    zipcode: zipcode || undefined
  }
}

/**
 * Format address components back into a string
 */
export function formatAddress(components: {
  street?: string
  city?: string
  state?: string
  zipcode?: string
}): string {
  const parts: string[] = []
  
  if (components.street) parts.push(components.street)
  if (components.city) parts.push(components.city)
  if (components.state && components.zipcode) {
    parts.push(`${components.state} ${components.zipcode}`)
  } else {
    if (components.state) parts.push(components.state)
    if (components.zipcode) parts.push(components.zipcode)
  }

  return parts.join(', ')
}
