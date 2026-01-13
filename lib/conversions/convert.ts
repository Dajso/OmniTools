import { UnitCategory, ConversionUnit } from '@/lib/constants/types';
import { unitsByCategory, getUnit } from '@/lib/constants/units';

export interface ConversionResult {
  value: number;
  fromUnit: ConversionUnit;
  toUnit: ConversionUnit;
  formula: string;
}

export class ConversionError extends Error {
  constructor(
    message: string,
    public code: 'invalid_unit' | 'invalid_category' | 'invalid_value' | 'same_unit'
  ) {
    super(message);
    this.name = 'ConversionError';
  }
}

/**
 * Convert a value from one unit to another within the same category.
 * Uses base unit conversion: fromUnit -> base -> toUnit
 */
export function convert(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): number {
  // Handle edge cases
  if (!Number.isFinite(value)) {
    throw new ConversionError('Value must be a finite number', 'invalid_value');
  }

  const fromUnit = getUnit(category, fromUnitId);
  const toUnit = getUnit(category, toUnitId);

  if (!fromUnit) {
    throw new ConversionError(`Invalid source unit: ${fromUnitId}`, 'invalid_unit');
  }

  if (!toUnit) {
    throw new ConversionError(`Invalid target unit: ${toUnitId}`, 'invalid_unit');
  }

  if (fromUnitId === toUnitId) {
    return value;
  }

  // Convert through base unit: fromUnit -> base -> toUnit
  const baseValue = fromUnit.toBase(value);
  const result = toUnit.fromBase(baseValue);

  return result;
}

/**
 * Convert with full result including formula
 */
export function convertWithDetails(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): ConversionResult {
  const fromUnit = getUnit(category, fromUnitId);
  const toUnit = getUnit(category, toUnitId);

  if (!fromUnit) {
    throw new ConversionError(`Invalid source unit: ${fromUnitId}`, 'invalid_unit');
  }

  if (!toUnit) {
    throw new ConversionError(`Invalid target unit: ${toUnitId}`, 'invalid_unit');
  }

  const convertedValue = convert(value, fromUnitId, toUnitId, category);
  const formula = generateFormula(fromUnit, toUnit, category);

  return {
    value: convertedValue,
    fromUnit,
    toUnit,
    formula,
  };
}

/**
 * Generate a human-readable formula for the conversion
 */
export function generateFormula(
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  category: UnitCategory
): string {
  // Calculate the conversion factor by converting 1 unit
  const factor = convert(1, fromUnit.id, toUnit.id, category);
  
  if (category === 'temperature') {
    // Temperature has special formulas
    if (fromUnit.id === 'celsius' && toUnit.id === 'fahrenheit') {
      return '°F = (°C × 9/5) + 32';
    }
    if (fromUnit.id === 'fahrenheit' && toUnit.id === 'celsius') {
      return '°C = (°F - 32) × 5/9';
    }
    if (fromUnit.id === 'celsius' && toUnit.id === 'kelvin') {
      return 'K = °C + 273.15';
    }
    if (fromUnit.id === 'kelvin' && toUnit.id === 'celsius') {
      return '°C = K - 273.15';
    }
    if (fromUnit.id === 'fahrenheit' && toUnit.id === 'kelvin') {
      return 'K = (°F - 32) × 5/9 + 273.15';
    }
    if (fromUnit.id === 'kelvin' && toUnit.id === 'fahrenheit') {
      return '°F = (K - 273.15) × 9/5 + 32';
    }
  }

  // For linear conversions, show the multiplication factor
  const formattedFactor = formatConversionFactor(factor);
  return `1 ${fromUnit.symbol} = ${formattedFactor} ${toUnit.symbol}`;
}

/**
 * Format conversion factor for display
 */
function formatConversionFactor(factor: number): string {
  if (factor === 0) return '0';
  
  // For very small or very large numbers, use scientific notation
  if (Math.abs(factor) < 0.0001 || Math.abs(factor) >= 1000000) {
    return factor.toExponential(6);
  }
  
  // Otherwise, use fixed decimal places based on magnitude
  if (Math.abs(factor) >= 100) {
    return factor.toFixed(2);
  }
  if (Math.abs(factor) >= 1) {
    return factor.toFixed(4);
  }
  return factor.toFixed(6);
}

/**
 * Get all conversion pairs for a category
 */
export function getAllConversionPairs(): Array<{
  from: string;
  to: string;
  category: UnitCategory;
}> {
  const pairs: Array<{ from: string; to: string; category: UnitCategory }> = [];
  
  for (const category of Object.keys(unitsByCategory) as UnitCategory[]) {
    const units = Object.keys(unitsByCategory[category]);
    for (const from of units) {
      for (const to of units) {
        if (from !== to) {
          pairs.push({ from, to, category });
        }
      }
    }
  }
  
  return pairs;
}

/**
 * Get common conversion pairs for SEO pages
 */
export function getCommonConversionPairs(): Array<{
  from: string;
  to: string;
  category: UnitCategory;
}> {
  return [
    // Length
    { from: 'meter', to: 'foot', category: 'length' },
    { from: 'foot', to: 'meter', category: 'length' },
    { from: 'centimeter', to: 'inch', category: 'length' },
    { from: 'inch', to: 'centimeter', category: 'length' },
    { from: 'kilometer', to: 'mile', category: 'length' },
    { from: 'mile', to: 'kilometer', category: 'length' },
    // Weight
    { from: 'kilogram', to: 'pound', category: 'weight' },
    { from: 'pound', to: 'kilogram', category: 'weight' },
    { from: 'gram', to: 'ounce', category: 'weight' },
    { from: 'ounce', to: 'gram', category: 'weight' },
    // Temperature
    { from: 'celsius', to: 'fahrenheit', category: 'temperature' },
    { from: 'fahrenheit', to: 'celsius', category: 'temperature' },
    { from: 'celsius', to: 'kelvin', category: 'temperature' },
    { from: 'kelvin', to: 'celsius', category: 'temperature' },
    // Volume
    { from: 'liter', to: 'gallon', category: 'volume' },
    { from: 'gallon', to: 'liter', category: 'volume' },
    { from: 'milliliter', to: 'cup', category: 'volume' },
    { from: 'cup', to: 'milliliter', category: 'volume' },
    // Area
    { from: 'squareFoot', to: 'squareMeter', category: 'area' },
    { from: 'squareMeter', to: 'squareFoot', category: 'area' },
    { from: 'acre', to: 'hectare', category: 'area' },
    { from: 'hectare', to: 'acre', category: 'area' },
    // Speed
    { from: 'milePerHour', to: 'kilometerPerHour', category: 'speed' },
    { from: 'kilometerPerHour', to: 'milePerHour', category: 'speed' },
    { from: 'knot', to: 'milePerHour', category: 'speed' },
    // Time
    { from: 'hour', to: 'minute', category: 'time' },
    { from: 'minute', to: 'second', category: 'time' },
    { from: 'day', to: 'hour', category: 'time' },
    // Data
    { from: 'megabyte', to: 'gigabyte', category: 'data' },
    { from: 'gigabyte', to: 'terabyte', category: 'data' },
    { from: 'kilobyte', to: 'megabyte', category: 'data' },
    // Pressure
    { from: 'psi', to: 'bar', category: 'pressure' },
    { from: 'bar', to: 'psi', category: 'pressure' },
    { from: 'kilopascal', to: 'psi', category: 'pressure' },
    // Energy
    { from: 'calorie', to: 'joule', category: 'energy' },
    { from: 'kilocalorie', to: 'kilojoule', category: 'energy' },
    { from: 'kilowattHour', to: 'joule', category: 'energy' },
  ];
}

/**
 * Find category for a unit ID
 */
export function findUnitCategory(unitId: string): UnitCategory | undefined {
  for (const category of Object.keys(unitsByCategory) as UnitCategory[]) {
    if (unitsByCategory[category][unitId]) {
      return category;
    }
  }
  return undefined;
}

/**
 * Parse conversion slug (e.g., "kg-to-lbs") into unit IDs
 */
export function parseConversionSlug(slug: string): {
  from: string;
  to: string;
} | null {
  const match = slug.match(/^(.+)-to-(.+)$/);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

/**
 * Get conversion pair details from a slug
 */
export interface ConversionPairDetails {
  from: ConversionUnit;
  to: ConversionUnit;
  category: UnitCategory;
  slug: string;
}

export function getConversionPair(slug: string): ConversionPairDetails | null {
  const parsed = parseConversionSlug(slug);
  if (!parsed) return null;

  // Find the category for these units
  const fromCategory = findUnitCategory(parsed.from);
  const toCategory = findUnitCategory(parsed.to);

  // Both units must exist and be in the same category
  if (!fromCategory || !toCategory || fromCategory !== toCategory) {
    return null;
  }

  const fromUnit = getUnit(fromCategory, parsed.from);
  const toUnit = getUnit(fromCategory, parsed.to);

  if (!fromUnit || !toUnit) {
    return null;
  }

  return {
    from: fromUnit,
    to: toUnit,
    category: fromCategory,
    slug,
  };
}

/**
 * Get related conversions for a given conversion pair
 */
export function getRelatedConversions(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  limit: number = 6
): Array<{ from: string; to: string; fromName: string; toName: string; href: string }> {
  const units = Object.values(unitsByCategory[category]);
  const related: Array<{ from: string; to: string; fromName: string; toName: string; href: string }> = [];

  // Add conversions involving the same units
  for (const unit of units) {
    if (unit.id !== fromUnitId && unit.id !== toUnitId) {
      // From current "from" unit to other units
      related.push({
        from: fromUnitId,
        to: unit.id,
        fromName: unitsByCategory[category][fromUnitId].name,
        toName: unit.name,
        href: `/convert/${fromUnitId}-to-${unit.id}`,
      });
      
      // From other units to current "to" unit
      related.push({
        from: unit.id,
        to: toUnitId,
        fromName: unit.name,
        toName: unitsByCategory[category][toUnitId].name,
        href: `/convert/${unit.id}-to-${toUnitId}`,
      });
    }
  }

  // Shuffle and limit
  return related.slice(0, limit);
}
