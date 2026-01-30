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


/**
 * Property Subtype definitions
 * Client-safe: No server-side dependencies
 */
export enum PropertySubtype {
  // Office (1xx)
  OfficeBuilding = 101,
  CreativeLoft = 102,
  ExecutiveSuites = 103,
  Medical = 104,
  InstitutionalGovernmental = 105,
  OfficeWarehouse = 106,
  OfficeCondo = 107,
  Coworking = 108,
  Lab = 109,
  
  // Retail (2xx)
  StreetRetail = 201,
  StripCenter = 202,
  FreeStandingBuilding = 203,
  RegionalMall = 204,
  RetailPad = 205,
  VehicleRelated = 206,
  OutletCenter = 207,
  PowerCenter = 208,
  NeighborhoodCenter = 209,
  CommunityCenter = 210,
  SpecialtyCenter = 211,
  ThemeFestivalCenter = 212,
  Restaurant = 213,
  PostOffice = 214,
  RetailCondo = 215,
  LifestyleCenter = 216,
  
  // Industrial (3xx)
  Manufacturing = 301,
  WarehouseDistribution = 302,
  FlexSpace = 303,
  ResearchDevelopment = 304,
  RefrigeratedColdStorage = 305,
  OfficeShowroom = 306,
  TruckTerminalHubTransit = 307,
  SelfStorage = 308,
  IndustrialCondo = 309,
  DataCenter = 310,
  
  // Land (5xx)
  LandOffice = 501,
  LandRetail = 502,
  LandRetailPad = 503,
  LandIndustrial = 504,
  LandResidential = 505,
  LandMultifamily = 506,
  LandOther = 507,
  
  // Multifamily (6xx)
  HighRise = 601,
  MidRise = 602,
  LowRiseGarden = 603,
  GovernmentSubsidized = 604,
  MobileHomePark = 605,
  SeniorLiving = 606,
  SkilledNursing = 607,
  SingleFamilyRentalPortfolio = 608,
  
  // Special Purpose (7xx)
  School = 701,
  Marina = 702,
  SpecialPurposeOther = 703,
  GolfCourse = 704,
  Church = 705,
  
  // Hospitality (8xx)
  FullService = 801,
  LimitedService = 802,
  SelectService = 803,
  Resort = 804,
  Economy = 805,
  ExtendedStay = 806,
  Casino = 807,
  
  // Residential (10xx)
  SingleFamily = 1001,
  TownhouseRowHouse = 1002,
  CondoCoop = 1003,
  ManufacturedMobileHome = 1004,
  VacationTimeshare = 1005,
  OtherResidential = 1006,
}

/**
 * Get the label string for a PropertySubtype enum value.
 * This is a pure function safe for client-side use.
 */
export function getPropertySubtypeLabel(subtypeId: PropertySubtype | number | null | undefined): string {
  if (subtypeId === null || subtypeId === undefined) {
    return ''
  }
  
  switch (subtypeId) {
    // Office
    case PropertySubtype.OfficeBuilding:
      return 'Office Building'
    case PropertySubtype.CreativeLoft:
      return 'Creative/Loft'
    case PropertySubtype.ExecutiveSuites:
      return 'Executive Suites'
    case PropertySubtype.Medical:
      return 'Medical'
    case PropertySubtype.InstitutionalGovernmental:
      return 'Institutional/Governmental'
    case PropertySubtype.OfficeWarehouse:
      return 'Office Warehouse'
    case PropertySubtype.OfficeCondo:
      return 'Office Condo'
    case PropertySubtype.Coworking:
      return 'Coworking'
    case PropertySubtype.Lab:
      return 'Lab'
    
    // Retail
    case PropertySubtype.StreetRetail:
      return 'Street Retail'
    case PropertySubtype.StripCenter:
      return 'Strip Center'
    case PropertySubtype.FreeStandingBuilding:
      return 'Free Standing Building'
    case PropertySubtype.RegionalMall:
      return 'Regional Mall'
    case PropertySubtype.RetailPad:
      return 'Retail Pad'
    case PropertySubtype.VehicleRelated:
      return 'Vehicle Related'
    case PropertySubtype.OutletCenter:
      return 'Outlet Center'
    case PropertySubtype.PowerCenter:
      return 'Power Center'
    case PropertySubtype.NeighborhoodCenter:
      return 'Neighborhood Center'
    case PropertySubtype.CommunityCenter:
      return 'Community Center'
    case PropertySubtype.SpecialtyCenter:
      return 'Specialty Center'
    case PropertySubtype.ThemeFestivalCenter:
      return 'Theme/Festival Center'
    case PropertySubtype.Restaurant:
      return 'Restaurant'
    case PropertySubtype.PostOffice:
      return 'Post Office'
    case PropertySubtype.RetailCondo:
      return 'Retail Condo'
    case PropertySubtype.LifestyleCenter:
      return 'Lifestyle Center'
    
    // Industrial
    case PropertySubtype.Manufacturing:
      return 'Manufacturing'
    case PropertySubtype.WarehouseDistribution:
      return 'Warehouse/Distribution'
    case PropertySubtype.FlexSpace:
      return 'Flex Space'
    case PropertySubtype.ResearchDevelopment:
      return 'Research & Development'
    case PropertySubtype.RefrigeratedColdStorage:
      return 'Refrigerated/Cold Storage'
    case PropertySubtype.OfficeShowroom:
      return 'Office Showroom'
    case PropertySubtype.TruckTerminalHubTransit:
      return 'Truck Terminal/Hub/Transit'
    case PropertySubtype.SelfStorage:
      return 'Self Storage'
    case PropertySubtype.IndustrialCondo:
      return 'Industrial Condo'
    case PropertySubtype.DataCenter:
      return 'Data Center'
    
    // Land
    case PropertySubtype.LandOffice:
      return 'Office'
    case PropertySubtype.LandRetail:
      return 'Retail'
    case PropertySubtype.LandRetailPad:
      return 'Retail-Pad'
    case PropertySubtype.LandIndustrial:
      return 'Industrial'
    case PropertySubtype.LandResidential:
      return 'Residential'
    case PropertySubtype.LandMultifamily:
      return 'Multifamily'
    case PropertySubtype.LandOther:
      return 'Other'
    
    // Multifamily
    case PropertySubtype.HighRise:
      return 'High-Rise'
    case PropertySubtype.MidRise:
      return 'Mid-Rise'
    case PropertySubtype.LowRiseGarden:
      return 'Low-Rise/Garden'
    case PropertySubtype.GovernmentSubsidized:
      return 'Government Subsidized'
    case PropertySubtype.MobileHomePark:
      return 'Mobile Home Park'
    case PropertySubtype.SeniorLiving:
      return 'Senior Living'
    case PropertySubtype.SkilledNursing:
      return 'Skilled Nursing'
    case PropertySubtype.SingleFamilyRentalPortfolio:
      return 'Single Family Rental Portfolio'
    
    // Special Purpose
    case PropertySubtype.School:
      return 'School'
    case PropertySubtype.Marina:
      return 'Marina'
    case PropertySubtype.SpecialPurposeOther:
      return 'Other'
    case PropertySubtype.GolfCourse:
      return 'Golf Course'
    case PropertySubtype.Church:
      return 'Church'
    
    // Hospitality
    case PropertySubtype.FullService:
      return 'Full Service'
    case PropertySubtype.LimitedService:
      return 'Limited Service'
    case PropertySubtype.SelectService:
      return 'Select Service'
    case PropertySubtype.Resort:
      return 'Resort'
    case PropertySubtype.Economy:
      return 'Economy'
    case PropertySubtype.ExtendedStay:
      return 'Extended Stay'
    case PropertySubtype.Casino:
      return 'Casino'
    
    // Residential
    case PropertySubtype.SingleFamily:
      return 'Single Family'
    case PropertySubtype.TownhouseRowHouse:
      return 'Townhouse / Row House'
    case PropertySubtype.CondoCoop:
      return 'Condo / Co-op'
    case PropertySubtype.ManufacturedMobileHome:
      return 'Manufactured / Mobile Home'
    case PropertySubtype.VacationTimeshare:
      return 'Vacation / Timeshare'
    case PropertySubtype.OtherResidential:
      return 'Other Residential'
    
    default:
      return ''
  }
}

/**
 * Get all subtypes for a given property type.
 * Returns an array of { id, label } objects.
 */
export function getSubtypesByPropertyType(propertyTypeId: PropertyType | number | null | undefined): Array<{ id: PropertySubtype; label: string }> {
  if (propertyTypeId === null || propertyTypeId === undefined) {
    return []
  }
  
  const subtypes: PropertySubtype[] = []
  
  switch (propertyTypeId) {
    case PropertyType.Office:
      subtypes.push(
        PropertySubtype.OfficeBuilding,
        PropertySubtype.CreativeLoft,
        PropertySubtype.ExecutiveSuites,
        PropertySubtype.Medical,
        PropertySubtype.InstitutionalGovernmental,
        PropertySubtype.OfficeWarehouse,
        PropertySubtype.OfficeCondo,
        PropertySubtype.Coworking,
        PropertySubtype.Lab
      )
      break
    case PropertyType.Retail:
      subtypes.push(
        PropertySubtype.StreetRetail,
        PropertySubtype.StripCenter,
        PropertySubtype.FreeStandingBuilding,
        PropertySubtype.RegionalMall,
        PropertySubtype.RetailPad,
        PropertySubtype.VehicleRelated,
        PropertySubtype.OutletCenter,
        PropertySubtype.PowerCenter,
        PropertySubtype.NeighborhoodCenter,
        PropertySubtype.CommunityCenter,
        PropertySubtype.SpecialtyCenter,
        PropertySubtype.ThemeFestivalCenter,
        PropertySubtype.Restaurant,
        PropertySubtype.PostOffice,
        PropertySubtype.RetailCondo,
        PropertySubtype.LifestyleCenter
      )
      break
    case PropertyType.Industrial:
      subtypes.push(
        PropertySubtype.Manufacturing,
        PropertySubtype.WarehouseDistribution,
        PropertySubtype.FlexSpace,
        PropertySubtype.ResearchDevelopment,
        PropertySubtype.RefrigeratedColdStorage,
        PropertySubtype.OfficeShowroom,
        PropertySubtype.TruckTerminalHubTransit,
        PropertySubtype.SelfStorage,
        PropertySubtype.IndustrialCondo,
        PropertySubtype.DataCenter
      )
      break
    case PropertyType.Land:
      subtypes.push(
        PropertySubtype.LandOffice,
        PropertySubtype.LandRetail,
        PropertySubtype.LandRetailPad,
        PropertySubtype.LandIndustrial,
        PropertySubtype.LandResidential,
        PropertySubtype.LandMultifamily,
        PropertySubtype.LandOther
      )
      break
    case PropertyType.Multifamily:
      subtypes.push(
        PropertySubtype.HighRise,
        PropertySubtype.MidRise,
        PropertySubtype.LowRiseGarden,
        PropertySubtype.GovernmentSubsidized,
        PropertySubtype.MobileHomePark,
        PropertySubtype.SeniorLiving,
        PropertySubtype.SkilledNursing,
        PropertySubtype.SingleFamilyRentalPortfolio
      )
      break
    case PropertyType.SpecialPurpose:
      subtypes.push(
        PropertySubtype.School,
        PropertySubtype.Marina,
        PropertySubtype.SpecialPurposeOther,
        PropertySubtype.GolfCourse,
        PropertySubtype.Church
      )
      break
    case PropertyType.Hospitality:
      subtypes.push(
        PropertySubtype.FullService,
        PropertySubtype.LimitedService,
        PropertySubtype.SelectService,
        PropertySubtype.Resort,
        PropertySubtype.Economy,
        PropertySubtype.ExtendedStay,
        PropertySubtype.Casino
      )
      break
  }
  
  return subtypes.map(id => ({
    id,
    label: getPropertySubtypeLabel(id),
  }))
}

/**
 * Get property type from a subtype ID.
 * Returns the PropertyType enum value or null if not found.
 */
export function getPropertyTypeFromSubtype(subtypeId: PropertySubtype | number | null | undefined): PropertyType | null {
  if (subtypeId === null || subtypeId === undefined) {
    return null
  }
  
  const numId = typeof subtypeId === 'number' ? subtypeId : subtypeId
  
  // Office (1xx)
  if (numId >= 101 && numId <= 109) {
    return PropertyType.Office
  }
  // Retail (2xx)
  if (numId >= 201 && numId <= 216) {
    return PropertyType.Retail
  }
  // Industrial (3xx)
  if (numId >= 301 && numId <= 310) {
    return PropertyType.Industrial
  }
  // Land (5xx)
  if (numId >= 501 && numId <= 507) {
    return PropertyType.Land
  }
  // Multifamily (6xx)
  if (numId >= 601 && numId <= 608) {
    return PropertyType.Multifamily
  }
  // Special Purpose (7xx)
  if (numId >= 701 && numId <= 705) {
    return PropertyType.SpecialPurpose
  }
  // Hospitality (8xx)
  if (numId >= 801 && numId <= 807) {
    return PropertyType.Hospitality
  }
  // Residential (10xx) - Note: This is not a main PropertyType, but a subtype category
  if (numId >= 1001 && numId <= 1006) {
    return null // Residential is not a main property type
  }
  
  return null
}
