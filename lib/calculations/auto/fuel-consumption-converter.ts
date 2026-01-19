/**
 * Fuel Consumption Converter
 * 
 * Converts between different fuel economy/consumption units:
 * - MPG (US): Miles per US gallon
 * - MPG (UK): Miles per Imperial gallon
 * - L/100km: Liters per 100 kilometers
 * - km/L: Kilometers per liter
 * 
 * @module lib/calculations/auto/fuel-consumption-converter
 * @see Requirements 28.4
 */

/**
 * Fuel economy unit types
 */
export type FuelEconomyUnit = 'mpg-us' | 'mpg-uk' | 'l-100km' | 'km-l';

/**
 * Fuel economy unit information
 */
export interface FuelEconomyUnitInfo {
  id: FuelEconomyUnit;
  name: string;
  shortName: string;
  description: string;
  /** Whether higher values mean better economy */
  higherIsBetter: boolean;
}

/**
 * Available fuel economy units
 */
export const FUEL_ECONOMY_UNITS: FuelEconomyUnitInfo[] = [
  {
    id: 'mpg-us',
    name: 'Miles per US Gallon',
    shortName: 'MPG (US)',
    description: 'Standard US fuel economy measurement',
    higherIsBetter: true,
  },
  {
    id: 'mpg-uk',
    name: 'Miles per Imperial Gallon',
    shortName: 'MPG (UK)',
    description: 'UK/Commonwealth fuel economy measurement',
    higherIsBetter: true,
  },
  {
    id: 'l-100km',
    name: 'Liters per 100 Kilometers',
    shortName: 'L/100km',
    description: 'European fuel consumption measurement',
    higherIsBetter: false,
  },
  {
    id: 'km-l',
    name: 'Kilometers per Liter',
    shortName: 'km/L',
    description: 'Asian fuel economy measurement',
    higherIsBetter: true,
  },
];

// Conversion constants
/** Liters per US gallon */
const LITERS_PER_US_GALLON = 3.785411784;

/** Liters per Imperial gallon */
const LITERS_PER_UK_GALLON = 4.54609;

/** Kilometers per mile */
const KM_PER_MILE = 1.609344;

/**
 * Convert MPG (US) to L/100km
 * 
 * Formula: L/100km = 235.215 / MPG
 * 
 * @param mpgUs - Miles per US gallon
 * @returns Liters per 100 kilometers
 */
export function mpgUsToL100km(mpgUs: number): number {
  if (mpgUs <= 0) {
    throw new Error('MPG must be positive');
  }
  // 100 km / (mpg * km/mile) * liters/gallon
  return (100 * LITERS_PER_US_GALLON) / (mpgUs * KM_PER_MILE);
}

/**
 * Convert L/100km to MPG (US)
 * 
 * @param l100km - Liters per 100 kilometers
 * @returns Miles per US gallon
 */
export function l100kmToMpgUs(l100km: number): number {
  if (l100km <= 0) {
    throw new Error('L/100km must be positive');
  }
  return (100 * LITERS_PER_US_GALLON) / (l100km * KM_PER_MILE);
}

/**
 * Convert MPG (UK) to L/100km
 * 
 * @param mpgUk - Miles per Imperial gallon
 * @returns Liters per 100 kilometers
 */
export function mpgUkToL100km(mpgUk: number): number {
  if (mpgUk <= 0) {
    throw new Error('MPG must be positive');
  }
  return (100 * LITERS_PER_UK_GALLON) / (mpgUk * KM_PER_MILE);
}

/**
 * Convert L/100km to MPG (UK)
 * 
 * @param l100km - Liters per 100 kilometers
 * @returns Miles per Imperial gallon
 */
export function l100kmToMpgUk(l100km: number): number {
  if (l100km <= 0) {
    throw new Error('L/100km must be positive');
  }
  return (100 * LITERS_PER_UK_GALLON) / (l100km * KM_PER_MILE);
}

/**
 * Convert MPG (US) to MPG (UK)
 * 
 * @param mpgUs - Miles per US gallon
 * @returns Miles per Imperial gallon
 */
export function mpgUsToMpgUk(mpgUs: number): number {
  if (mpgUs <= 0) {
    throw new Error('MPG must be positive');
  }
  return mpgUs * (LITERS_PER_UK_GALLON / LITERS_PER_US_GALLON);
}

/**
 * Convert MPG (UK) to MPG (US)
 * 
 * @param mpgUk - Miles per Imperial gallon
 * @returns Miles per US gallon
 */
export function mpgUkToMpgUs(mpgUk: number): number {
  if (mpgUk <= 0) {
    throw new Error('MPG must be positive');
  }
  return mpgUk * (LITERS_PER_US_GALLON / LITERS_PER_UK_GALLON);
}

/**
 * Convert km/L to L/100km
 * 
 * @param kmL - Kilometers per liter
 * @returns Liters per 100 kilometers
 */
export function kmLToL100km(kmL: number): number {
  if (kmL <= 0) {
    throw new Error('km/L must be positive');
  }
  return 100 / kmL;
}

/**
 * Convert L/100km to km/L
 * 
 * @param l100km - Liters per 100 kilometers
 * @returns Kilometers per liter
 */
export function l100kmToKmL(l100km: number): number {
  if (l100km <= 0) {
    throw new Error('L/100km must be positive');
  }
  return 100 / l100km;
}

/**
 * Convert MPG (US) to km/L
 * 
 * @param mpgUs - Miles per US gallon
 * @returns Kilometers per liter
 */
export function mpgUsToKmL(mpgUs: number): number {
  if (mpgUs <= 0) {
    throw new Error('MPG must be positive');
  }
  return (mpgUs * KM_PER_MILE) / LITERS_PER_US_GALLON;
}

/**
 * Convert km/L to MPG (US)
 * 
 * @param kmL - Kilometers per liter
 * @returns Miles per US gallon
 */
export function kmLToMpgUs(kmL: number): number {
  if (kmL <= 0) {
    throw new Error('km/L must be positive');
  }
  return (kmL * LITERS_PER_US_GALLON) / KM_PER_MILE;
}

/**
 * Convert MPG (UK) to km/L
 * 
 * @param mpgUk - Miles per Imperial gallon
 * @returns Kilometers per liter
 */
export function mpgUkToKmL(mpgUk: number): number {
  if (mpgUk <= 0) {
    throw new Error('MPG must be positive');
  }
  return (mpgUk * KM_PER_MILE) / LITERS_PER_UK_GALLON;
}

/**
 * Convert km/L to MPG (UK)
 * 
 * @param kmL - Kilometers per liter
 * @returns Miles per Imperial gallon
 */
export function kmLToMpgUk(kmL: number): number {
  if (kmL <= 0) {
    throw new Error('km/L must be positive');
  }
  return (kmL * LITERS_PER_UK_GALLON) / KM_PER_MILE;
}

/**
 * Fuel economy conversion result
 */
export interface FuelEconomyConversion {
  /** Original value */
  originalValue: number;
  /** Original unit */
  originalUnit: FuelEconomyUnit;
  /** Converted values in all units */
  conversions: Record<FuelEconomyUnit, number>;
  /** Formatted strings for each unit */
  formatted: Record<FuelEconomyUnit, string>;
}

/**
 * Convert fuel economy value to all units
 * 
 * @param value - The fuel economy value
 * @param fromUnit - The source unit
 * @returns Conversion results in all units
 */
export function convertFuelEconomy(
  value: number,
  fromUnit: FuelEconomyUnit
): FuelEconomyConversion {
  if (value <= 0) {
    throw new Error('Fuel economy value must be positive');
  }
  
  // First convert to L/100km as intermediate
  let l100km: number;
  
  switch (fromUnit) {
    case 'mpg-us':
      l100km = mpgUsToL100km(value);
      break;
    case 'mpg-uk':
      l100km = mpgUkToL100km(value);
      break;
    case 'l-100km':
      l100km = value;
      break;
    case 'km-l':
      l100km = kmLToL100km(value);
      break;
    default:
      throw new Error(`Unknown unit: ${fromUnit}`);
  }
  
  // Convert from L/100km to all units
  const conversions: Record<FuelEconomyUnit, number> = {
    'mpg-us': l100kmToMpgUs(l100km),
    'mpg-uk': l100kmToMpgUk(l100km),
    'l-100km': l100km,
    'km-l': l100kmToKmL(l100km),
  };
  
  // Format each value
  const formatted: Record<FuelEconomyUnit, string> = {
    'mpg-us': `${conversions['mpg-us'].toFixed(1)} MPG (US)`,
    'mpg-uk': `${conversions['mpg-uk'].toFixed(1)} MPG (UK)`,
    'l-100km': `${conversions['l-100km'].toFixed(1)} L/100km`,
    'km-l': `${conversions['km-l'].toFixed(1)} km/L`,
  };
  
  return {
    originalValue: value,
    originalUnit: fromUnit,
    conversions,
    formatted,
  };
}

/**
 * Calculate fuel cost for a trip
 * 
 * @param distance - Trip distance
 * @param distanceUnit - 'miles' or 'km'
 * @param fuelEconomy - Fuel economy value
 * @param economyUnit - Fuel economy unit
 * @param fuelPrice - Price per unit of fuel
 * @param priceUnit - 'gallon-us', 'gallon-uk', or 'liter'
 * @returns Fuel cost for the trip
 */
export function calculateTripFuelCost(
  distance: number,
  distanceUnit: 'miles' | 'km',
  fuelEconomy: number,
  economyUnit: FuelEconomyUnit,
  fuelPrice: number,
  priceUnit: 'gallon-us' | 'gallon-uk' | 'liter'
): { fuelNeeded: number; fuelUnit: string; cost: number } {
  // Convert distance to km
  const distanceKm = distanceUnit === 'miles' ? distance * KM_PER_MILE : distance;
  
  // Convert fuel economy to L/100km
  const conversion = convertFuelEconomy(fuelEconomy, economyUnit);
  const l100km = conversion.conversions['l-100km'];
  
  // Calculate liters needed
  const litersNeeded = (distanceKm / 100) * l100km;
  
  // Convert to requested fuel unit and calculate cost
  let fuelNeeded: number;
  let fuelUnit: string;
  let cost: number;
  
  switch (priceUnit) {
    case 'gallon-us':
      fuelNeeded = litersNeeded / LITERS_PER_US_GALLON;
      fuelUnit = 'gallons (US)';
      cost = fuelNeeded * fuelPrice;
      break;
    case 'gallon-uk':
      fuelNeeded = litersNeeded / LITERS_PER_UK_GALLON;
      fuelUnit = 'gallons (UK)';
      cost = fuelNeeded * fuelPrice;
      break;
    case 'liter':
      fuelNeeded = litersNeeded;
      fuelUnit = 'liters';
      cost = fuelNeeded * fuelPrice;
      break;
    default:
      throw new Error(`Unknown price unit: ${priceUnit}`);
  }
  
  return { fuelNeeded, fuelUnit, cost };
}

/**
 * Compare fuel economy of two vehicles
 * 
 * @param economy1 - First vehicle's fuel economy
 * @param unit1 - First vehicle's unit
 * @param economy2 - Second vehicle's fuel economy
 * @param unit2 - Second vehicle's unit
 * @returns Comparison results
 */
export function compareFuelEconomy(
  economy1: number,
  unit1: FuelEconomyUnit,
  economy2: number,
  unit2: FuelEconomyUnit
): {
  vehicle1L100km: number;
  vehicle2L100km: number;
  percentDifference: number;
  moreEfficient: 1 | 2;
  annualSavings: (annualMiles: number, fuelPricePerGallon: number) => number;
} {
  const conv1 = convertFuelEconomy(economy1, unit1);
  const conv2 = convertFuelEconomy(economy2, unit2);
  
  const l100km1 = conv1.conversions['l-100km'];
  const l100km2 = conv2.conversions['l-100km'];
  
  // Lower L/100km is more efficient
  const moreEfficient = l100km1 < l100km2 ? 1 : 2;
  const percentDifference = Math.abs((l100km1 - l100km2) / Math.max(l100km1, l100km2)) * 100;
  
  return {
    vehicle1L100km: l100km1,
    vehicle2L100km: l100km2,
    percentDifference,
    moreEfficient,
    annualSavings: (annualMiles: number, fuelPricePerGallon: number) => {
      const annualKm = annualMiles * KM_PER_MILE;
      const liters1 = (annualKm / 100) * l100km1;
      const liters2 = (annualKm / 100) * l100km2;
      const gallons1 = liters1 / LITERS_PER_US_GALLON;
      const gallons2 = liters2 / LITERS_PER_US_GALLON;
      return Math.abs(gallons1 - gallons2) * fuelPricePerGallon;
    },
  };
}
