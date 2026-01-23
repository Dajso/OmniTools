/**
 * Coffee-specific unit conversion utilities
 * 
 * Provides conversion functions for weight (g/oz) and volume (ml/fl oz)
 * commonly used in coffee brewing calculations.
 * 
 * @module lib/conversions/coffee-units
 */

/**
 * Unit system type
 */
export type UnitSystem = 'metric' | 'imperial';

/**
 * Weight unit type
 */
export type WeightUnit = 'g' | 'oz';

/**
 * Volume unit type
 */
export type VolumeUnit = 'ml' | 'fl oz';

/**
 * Conversion constants
 */
export const CONVERSION_FACTORS = {
  // Weight conversions
  GRAMS_TO_OUNCES: 0.035274,
  OUNCES_TO_GRAMS: 28.3495,
  
  // Volume conversions
  ML_TO_FL_OZ: 0.033814,
  FL_OZ_TO_ML: 29.5735,
  
  // Water volume conversions
  LITERS_TO_GALLONS: 0.264172,
  GALLONS_TO_LITERS: 3.78541,
} as const;

/**
 * Convert weight from grams to ounces
 */
export function gramsToOunces(grams: number): number {
  return grams * CONVERSION_FACTORS.GRAMS_TO_OUNCES;
}

/**
 * Convert weight from ounces to grams
 */
export function ouncesToGrams(ounces: number): number {
  return ounces * CONVERSION_FACTORS.OUNCES_TO_GRAMS;
}

/**
 * Convert volume from milliliters to fluid ounces
 */
export function mlToFlOz(ml: number): number {
  return ml * CONVERSION_FACTORS.ML_TO_FL_OZ;
}

/**
 * Convert volume from fluid ounces to milliliters
 */
export function flOzToMl(flOz: number): number {
  return flOz * CONVERSION_FACTORS.FL_OZ_TO_ML;
}

/**
 * Convert water volume from liters to gallons
 */
export function litersToGallons(liters: number): number {
  return liters * CONVERSION_FACTORS.LITERS_TO_GALLONS;
}

/**
 * Convert water volume from gallons to liters
 */
export function gallonsToLiters(gallons: number): number {
  return gallons * CONVERSION_FACTORS.GALLONS_TO_LITERS;
}

/**
 * Convert weight based on unit system
 * 
 * @param value - The weight value
 * @param fromUnit - Source unit ('g' or 'oz')
 * @param toUnit - Target unit ('g' or 'oz')
 * @returns Converted weight value
 */
export function convertWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'g' && toUnit === 'oz') {
    return gramsToOunces(value);
  }
  
  if (fromUnit === 'oz' && toUnit === 'g') {
    return ouncesToGrams(value);
  }
  
  return value;
}

/**
 * Convert volume based on unit system
 * 
 * @param value - The volume value
 * @param fromUnit - Source unit ('ml' or 'fl oz')
 * @param toUnit - Target unit ('ml' or 'fl oz')
 * @returns Converted volume value
 */
export function convertVolume(value: number, fromUnit: VolumeUnit, toUnit: VolumeUnit): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'ml' && toUnit === 'fl oz') {
    return mlToFlOz(value);
  }
  
  if (fromUnit === 'fl oz' && toUnit === 'ml') {
    return flOzToMl(value);
  }
  
  return value;
}

/**
 * Get weight unit for unit system
 */
export function getWeightUnit(system: UnitSystem): WeightUnit {
  return system === 'metric' ? 'g' : 'oz';
}

/**
 * Get volume unit for unit system
 */
export function getVolumeUnit(system: UnitSystem): VolumeUnit {
  return system === 'metric' ? 'ml' : 'fl oz';
}

/**
 * Format weight value for display
 * 
 * @param grams - Weight in grams (base unit)
 * @param system - Unit system to display in
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with value and unit
 */
export function formatWeight(grams: number, system: UnitSystem, decimals: number = 1): string {
  if (system === 'imperial') {
    const ounces = gramsToOunces(grams);
    return `${ounces.toFixed(decimals)} oz`;
  }
  return `${grams.toFixed(decimals)} g`;
}

/**
 * Format volume value for display
 * 
 * @param ml - Volume in milliliters (base unit)
 * @param system - Unit system to display in
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with value and unit
 */
export function formatVolume(ml: number, system: UnitSystem, decimals: number = 0): string {
  if (system === 'imperial') {
    const flOz = mlToFlOz(ml);
    return `${flOz.toFixed(decimals)} fl oz`;
  }
  return `${ml.toFixed(decimals)} ml`;
}

/**
 * Parse weight input value based on current unit system
 * Converts to grams (base unit) for internal storage
 * 
 * @param value - Input value in current unit system
 * @param system - Current unit system
 * @returns Weight in grams
 */
export function parseWeightInput(value: number, system: UnitSystem): number {
  if (system === 'imperial') {
    return ouncesToGrams(value);
  }
  return value;
}

/**
 * Parse volume input value based on current unit system
 * Converts to milliliters (base unit) for internal storage
 * 
 * @param value - Input value in current unit system
 * @param system - Current unit system
 * @returns Volume in milliliters
 */
export function parseVolumeInput(value: number, system: UnitSystem): number {
  if (system === 'imperial') {
    return flOzToMl(value);
  }
  return value;
}

/**
 * Get display value for weight input
 * Converts from grams (base unit) to current unit system
 * 
 * @param grams - Weight in grams (base unit)
 * @param system - Current unit system
 * @returns Value in current unit system
 */
export function getWeightDisplayValue(grams: number, system: UnitSystem): number {
  if (system === 'imperial') {
    return gramsToOunces(grams);
  }
  return grams;
}

/**
 * Get display value for volume input
 * Converts from milliliters (base unit) to current unit system
 * 
 * @param ml - Volume in milliliters (base unit)
 * @param system - Current unit system
 * @returns Value in current unit system
 */
export function getVolumeDisplayValue(ml: number, system: UnitSystem): number {
  if (system === 'imperial') {
    return mlToFlOz(ml);
  }
  return ml;
}

/**
 * Get input constraints (min, max, step) for weight based on unit system
 * 
 * @param metricMin - Minimum value in grams
 * @param metricMax - Maximum value in grams
 * @param metricStep - Step value in grams
 * @param system - Current unit system
 * @returns Object with min, max, step in current unit system
 */
export function getWeightConstraints(
  metricMin: number,
  metricMax: number,
  metricStep: number,
  system: UnitSystem
): { min: number; max: number; step: number } {
  if (system === 'imperial') {
    return {
      min: gramsToOunces(metricMin),
      max: gramsToOunces(metricMax),
      step: gramsToOunces(metricStep),
    };
  }
  return {
    min: metricMin,
    max: metricMax,
    step: metricStep,
  };
}

/**
 * Get input constraints (min, max, step) for volume based on unit system
 * 
 * @param metricMin - Minimum value in milliliters
 * @param metricMax - Maximum value in milliliters
 * @param metricStep - Step value in milliliters
 * @param system - Current unit system
 * @returns Object with min, max, step in current unit system
 */
export function getVolumeConstraints(
  metricMin: number,
  metricMax: number,
  metricStep: number,
  system: UnitSystem
): { min: number; max: number; step: number } {
  if (system === 'imperial') {
    return {
      min: mlToFlOz(metricMin),
      max: mlToFlOz(metricMax),
      step: mlToFlOz(metricStep),
    };
  }
  return {
    min: metricMin,
    max: metricMax,
    step: metricStep,
  };
}
