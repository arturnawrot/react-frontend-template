/**
 * Property Type definitions
 * Client-safe: No server-side dependencies
 */

export enum PropertyType {
  Office = 1,
  Retail = 2,
  Industrial = 3,
  Land = 5,
  Multifamily = 6,
  SpecialPurpose = 7,
  Hospitality = 8,
}

/**
 * Get the label string for a PropertyType enum value.
 * This is a pure function safe for client-side use.
 */
export function getPropertyTypeLabel(propertyTypeId: PropertyType | number | null | undefined): string {
  if (propertyTypeId === null || propertyTypeId === undefined) {
    return 'Property'
  }
  
  switch (propertyTypeId) {
    case PropertyType.Office:
      return 'Office'
    case PropertyType.Retail:
      return 'Retail'
    case PropertyType.Industrial:
      return 'Industrial'
    case PropertyType.Land:
      return 'Land'
    case PropertyType.Multifamily:
      return 'Multifamily'
    case PropertyType.SpecialPurpose:
      return 'Special Purpose'
    case PropertyType.Hospitality:
      return 'Hospitality'
    default:
      return 'Property'
  }
}

