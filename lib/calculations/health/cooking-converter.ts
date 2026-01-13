/**
 * Cooking Unit Converter
 * 
 * Converts between cooking measurements.
 * 
 * @module lib/calculations/health/cooking-converter
 * @see Requirements 6.18
 */

export type CookingUnit = 
  | 'cups' | 'tablespoons' | 'teaspoons' 
  | 'fluid_oz' | 'ml' | 'liters'
  | 'grams' | 'oz' | 'pounds';

export interface CookingConversionInputs {
  value: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  ingredient?: string; // For weight-to-volume conversions
}

export interface CookingConversionResults {
  value: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  formatted: string;
}

// Volume conversions to ml
const VOLUME_TO_ML: Record<string, number> = {
  cups: 236.588,
  tablespoons: 14.787,
  teaspoons: 4.929,
  fluid_oz: 29.574,
  ml: 1,
  liters: 1000,
};

// Weight conversions to grams
const WEIGHT_TO_GRAMS: Record<string, number> = {
  grams: 1,
  oz: 28.3495,
  pounds: 453.592,
};

// Common ingredient densities (grams per cup)
const INGREDIENT_DENSITY: Record<string, number> = {
  flour: 125,
  sugar: 200,
  brown_sugar: 220,
  butter: 227,
  milk: 245,
  water: 237,
  oil: 218,
  honey: 340,
  rice: 185,
  oats: 90,
};

function isVolumeUnit(unit: CookingUnit): boolean {
  return ['cups', 'tablespoons', 'teaspoons', 'fluid_oz', 'ml', 'liters'].includes(unit);
}

function isWeightUnit(unit: CookingUnit): boolean {
  return ['grams', 'oz', 'pounds'].includes(unit);
}

export function convertCookingUnit(inputs: CookingConversionInputs): CookingConversionResults {
  const { value, fromUnit, toUnit, ingredient } = inputs;

  let result: number;

  // Same type conversion (volume to volume or weight to weight)
  if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    const ml = value * VOLUME_TO_ML[fromUnit];
    result = ml / VOLUME_TO_ML[toUnit];
  } else if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
    const grams = value * WEIGHT_TO_GRAMS[fromUnit];
    result = grams / WEIGHT_TO_GRAMS[toUnit];
  } else if (ingredient && INGREDIENT_DENSITY[ingredient]) {
    // Cross-type conversion requires ingredient
    const density = INGREDIENT_DENSITY[ingredient];
    
    if (isVolumeUnit(fromUnit) && isWeightUnit(toUnit)) {
      // Volume to weight
      const cups = value * VOLUME_TO_ML[fromUnit] / VOLUME_TO_ML.cups;
      const grams = cups * density;
      result = grams / WEIGHT_TO_GRAMS[toUnit];
    } else {
      // Weight to volume
      const grams = value * WEIGHT_TO_GRAMS[fromUnit];
      const cups = grams / density;
      result = cups * VOLUME_TO_ML.cups / VOLUME_TO_ML[toUnit];
    }
  } else {
    throw new Error('Ingredient required for volume-to-weight conversion');
  }

  // Format result
  let formatted: string;
  if (result < 0.01) {
    formatted = result.toExponential(2);
  } else if (result < 1) {
    formatted = result.toFixed(3);
  } else if (result < 100) {
    formatted = result.toFixed(2);
  } else {
    formatted = result.toFixed(1);
  }

  return {
    value: result,
    fromUnit,
    toUnit,
    formatted,
  };
}

export function getIngredientOptions(): Array<{ value: string; label: string }> {
  return Object.keys(INGREDIENT_DENSITY).map(key => ({
    value: key,
    label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));
}
