/**
 * Utility functions for converting property addresses to URL-friendly slugs
 */

/**
 * Converts a property address to a URL-friendly slug
 * Example: "105 Lancaster St SW" -> "105-lancaster-st-sw"
 */
export function addressToSlug(address: string): string {
  return address
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Converts a slug back to a normalized address format
 * This is approximate and may not perfectly match the original
 */
export function slugToAddress(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

