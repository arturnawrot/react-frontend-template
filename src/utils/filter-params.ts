/**
 * Shared utility for building filter URL parameters
 * Used by PropertySearchInput (for URL navigation) and PropertySearchAdvanced (for API calls)
 */

export interface FilterParams {
  search?: string
  brokerId?: number | null
  propertyType?: number | null
  minPrice?: number | null
  maxPrice?: number | null
  saleOrLease?: 'sale' | 'lease' | 'both' | null
  minCapRate?: number | null
  maxCapRate?: number | null
  minSquareFootage?: number | null
  maxSquareFootage?: number | null
}

/**
 * Build URLSearchParams from filter parameters
 * @param filters - Filter parameters object
 * @param options - Options for building params
 * @returns URLSearchParams object
 */
export function buildFilterParams(
  filters: FilterParams,
  options?: {
    includeSearch?: boolean // Whether to include search query (default: true)
    useSet?: boolean // Use params.set() instead of params.append() (default: false, for URL navigation)
  }
): URLSearchParams {
  const params = new URLSearchParams()
  const includeSearch = options?.includeSearch !== false // Default to true
  const useSet = options?.useSet === true // Default to false

  const addParam = (key: string, value: string | number) => {
    if (useSet) {
      params.set(key, value.toString())
    } else {
      params.append(key, value.toString())
    }
  }

  // Text search
  if (includeSearch && filters.search) {
    addParam('search', filters.search)
  }

  // Broker ID
  if (filters.brokerId) {
    addParam('brokerId', filters.brokerId)
  }

  // Property Type
  if (filters.propertyType) {
    addParam('propertyType', filters.propertyType)
  }

  // Price range
  if (filters.minPrice) {
    addParam('minPrice', filters.minPrice)
  }
  if (filters.maxPrice) {
    addParam('maxPrice', filters.maxPrice)
  }

  // Sale/Lease
  if (filters.saleOrLease && filters.saleOrLease !== 'both') {
    addParam('saleOrLease', filters.saleOrLease)
  }

  // Cap Rate
  if (filters.minCapRate !== null && filters.minCapRate !== undefined) {
    addParam('minCapRate', filters.minCapRate)
  }
  if (filters.maxCapRate !== null && filters.maxCapRate !== undefined) {
    addParam('maxCapRate', filters.maxCapRate)
  }

  // Square Footage
  if (filters.minSquareFootage) {
    addParam('minSquareFootage', filters.minSquareFootage)
  }
  if (filters.maxSquareFootage) {
    addParam('maxSquareFootage', filters.maxSquareFootage)
  }

  return params
}

