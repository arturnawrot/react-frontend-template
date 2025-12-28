/**
 * Utility functions for managing saved properties in localStorage
 */

const STORAGE_KEY = 'saved_property_ids'

/**
 * Get all saved property IDs from localStorage
 */
export function getSavedPropertyIds(): number[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    
    const ids = JSON.parse(saved) as number[]
    return Array.isArray(ids) ? ids : []
  } catch (error) {
    console.error('Error reading saved properties from localStorage:', error)
    return []
  }
}

/**
 * Save a property ID to localStorage
 */
export function savePropertyId(propertyId: number): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const ids = getSavedPropertyIds()
    if (!ids.includes(propertyId)) {
      ids.push(propertyId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    }
  } catch (error) {
    console.error('Error saving property ID to localStorage:', error)
  }
}

/**
 * Remove a property ID from localStorage
 */
export function removePropertyId(propertyId: number): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const ids = getSavedPropertyIds()
    const filteredIds = ids.filter(id => id !== propertyId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredIds))
  } catch (error) {
    console.error('Error removing property ID from localStorage:', error)
  }
}

/**
 * Check if a property ID is saved
 */
export function isPropertySaved(propertyId: number): boolean {
  const ids = getSavedPropertyIds()
  return ids.includes(propertyId)
}

/**
 * Toggle saved state of a property
 */
export function togglePropertySaved(propertyId: number): boolean {
  const isSaved = isPropertySaved(propertyId)
  if (isSaved) {
    removePropertyId(propertyId)
    return false
  } else {
    savePropertyId(propertyId)
    return true
  }
}

