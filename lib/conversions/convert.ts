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
    throw new ConversionError('Verdien må være et endelig tall', 'invalid_value');
  }

  const fromUnit = getUnit(category, fromUnitId);
  const toUnit = getUnit(category, toUnitId);

  if (!fromUnit) {
    throw new ConversionError(`Ugyldig enhet å regne fra: ${fromUnitId}`, 'invalid_unit');
  }

  if (!toUnit) {
    throw new ConversionError(`Ugyldig enhet å regne til: ${toUnitId}`, 'invalid_unit');
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
    throw new ConversionError(`Ugyldig enhet å regne fra: ${fromUnitId}`, 'invalid_unit');
  }

  if (!toUnit) {
    throw new ConversionError(`Ugyldig enhet å regne til: ${toUnitId}`, 'invalid_unit');
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

  if (category === 'fuelEconomy') {
    // Omvendte enheter (km/l, mpg): vis et eksempel i stedet for en fast faktor
    const example = fromUnit.id === 'litersPerMil' ? 0.8 : fromUnit.id === 'kmPerLiter' ? 20 : fromUnit.id.startsWith('mpg') ? 40 : 8;
    return `Eksempel: ${formatConversionFactor(example)} ${fromUnit.symbol} = ${formatConversionFactor(convert(example, fromUnit.id, toUnit.id, category))} ${toUnit.symbol}`;
  }

  // For lineære omregninger vises faktoren
  const formattedFactor = formatConversionFactor(factor);
  return `1 ${fromUnit.symbol} = ${formattedFactor} ${toUnit.symbol}`;
}

/**
 * Format conversion factor for display
 */
function formatConversionFactor(factor: number): string {
  if (factor === 0) return '0';
  if (!Number.isFinite(factor)) return '–';

  // Svært små eller store tall vises med vitenskapelig notasjon
  if (Math.abs(factor) < 0.0001 || Math.abs(factor) >= 1000000) {
    return factor.toExponential(6).replace('.', ',');
  }

  // Ellers brukes norsk tallformat (komma som desimaltegn, hardt mellomrom som tusenskille)
  const abs = Math.abs(factor);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return factor.toLocaleString('nb-NO', { maximumFractionDigits: digits });
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
    // Lengde
    { from: 'meter', to: 'foot', category: 'length' },
    { from: 'foot', to: 'meter', category: 'length' },
    { from: 'centimeter', to: 'inch', category: 'length' },
    { from: 'inch', to: 'centimeter', category: 'length' },
    { from: 'kilometer', to: 'mile', category: 'length' },
    { from: 'mile', to: 'kilometer', category: 'length' },
    { from: 'norwegianMile', to: 'kilometer', category: 'length' },
    { from: 'kilometer', to: 'norwegianMile', category: 'length' },
    { from: 'nauticalMile', to: 'kilometer', category: 'length' },
    // Vekt
    { from: 'kilogram', to: 'pound', category: 'weight' },
    { from: 'pound', to: 'kilogram', category: 'weight' },
    { from: 'gram', to: 'ounce', category: 'weight' },
    { from: 'ounce', to: 'gram', category: 'weight' },
    { from: 'stone', to: 'kilogram', category: 'weight' },
    // Temperatur
    { from: 'celsius', to: 'fahrenheit', category: 'temperature' },
    { from: 'fahrenheit', to: 'celsius', category: 'temperature' },
    { from: 'celsius', to: 'kelvin', category: 'temperature' },
    { from: 'kelvin', to: 'celsius', category: 'temperature' },
    // Volum
    { from: 'liter', to: 'gallon', category: 'volume' },
    { from: 'gallon', to: 'liter', category: 'volume' },
    { from: 'deciliter', to: 'milliliter', category: 'volume' },
    { from: 'tablespoon', to: 'milliliter', category: 'volume' },
    { from: 'teaspoon', to: 'milliliter', category: 'volume' },
    { from: 'cup', to: 'deciliter', category: 'volume' },
    // Areal
    { from: 'squareFoot', to: 'squareMeter', category: 'area' },
    { from: 'squareMeter', to: 'squareFoot', category: 'area' },
    { from: 'acre', to: 'hectare', category: 'area' },
    { from: 'decare', to: 'squareMeter', category: 'area' },
    { from: 'hectare', to: 'decare', category: 'area' },
    // Fart
    { from: 'milePerHour', to: 'kilometerPerHour', category: 'speed' },
    { from: 'kilometerPerHour', to: 'milePerHour', category: 'speed' },
    { from: 'knot', to: 'kilometerPerHour', category: 'speed' },
    { from: 'meterPerSecond', to: 'kilometerPerHour', category: 'speed' },
    // Tid
    { from: 'hour', to: 'minute', category: 'time' },
    { from: 'minute', to: 'second', category: 'time' },
    { from: 'day', to: 'hour', category: 'time' },
    // Data
    { from: 'megabyte', to: 'gigabyte', category: 'data' },
    { from: 'gigabyte', to: 'terabyte', category: 'data' },
    { from: 'kilobyte', to: 'megabyte', category: 'data' },
    // Trykk
    { from: 'psi', to: 'bar', category: 'pressure' },
    { from: 'bar', to: 'psi', category: 'pressure' },
    { from: 'kilopascal', to: 'psi', category: 'pressure' },
    { from: 'hectopascal', to: 'mmHg', category: 'pressure' },
    // Energi
    { from: 'calorie', to: 'joule', category: 'energy' },
    { from: 'kilocalorie', to: 'kilojoule', category: 'energy' },
    { from: 'kilowattHour', to: 'joule', category: 'energy' },
    { from: 'kilowattHour', to: 'megajoule', category: 'energy' },
    // Vinkel
    { from: 'degree', to: 'radian', category: 'angle' },
    { from: 'radian', to: 'degree', category: 'angle' },
    { from: 'degree', to: 'gradian', category: 'angle' },
    // Frekvens
    { from: 'megahertz', to: 'kilohertz', category: 'frequency' },
    { from: 'gigahertz', to: 'megahertz', category: 'frequency' },
    // Drivstofforbruk
    { from: 'litersPer100Km', to: 'kmPerLiter', category: 'fuelEconomy' },
    { from: 'kmPerLiter', to: 'litersPer100Km', category: 'fuelEconomy' },
    { from: 'litersPer100Km', to: 'litersPerMil', category: 'fuelEconomy' },
    { from: 'mpgUs', to: 'litersPer100Km', category: 'fuelEconomy' },
    // Effekt
    { from: 'kilowatt', to: 'horsepowerMetric', category: 'power' },
    { from: 'horsepowerMetric', to: 'kilowatt', category: 'power' },
    { from: 'horsepowerMechanical', to: 'kilowatt', category: 'power' },
    // Dreiemoment
    { from: 'newtonMeter', to: 'footPound', category: 'torque' },
    { from: 'footPound', to: 'newtonMeter', category: 'torque' },
    // Kraft
    { from: 'newton', to: 'kilopond', category: 'force' },
    { from: 'kilopond', to: 'newton', category: 'force' },
    // Tetthet
    { from: 'kilogramPerCubicMeter', to: 'gramPerCubicCentimeter', category: 'density' },
    // Belysningsstyrke
    { from: 'lux', to: 'footCandle', category: 'illuminance' },
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
 * Gjør en enhets-ID (camelCase) om til en nettadressevennlig tekst (kebab-case).
 * Eksempel: squareFoot → square-foot
 */
export function unitIdToSlug(id: string): string {
  return id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Lager adressen for en omregning, f.eks. squareFoot + squareMeter → square-foot-to-square-meter */
export function conversionSlug(fromId: string, toId: string): string {
  return `${unitIdToSlug(fromId)}-to-${unitIdToSlug(toId)}`;
}

let slugToIdMap: Map<string, string> | null = null;

/** Finner enhets-ID fra enten kebab-case (square-foot) eller opprinnelig ID (squareFoot) */
function slugPartToUnitId(part: string): string {
  if (!slugToIdMap) {
    slugToIdMap = new Map();
    for (const units of Object.values(unitsByCategory)) {
      for (const id of Object.keys(units)) {
        slugToIdMap.set(unitIdToSlug(id), id);
        slugToIdMap.set(id, id);
      }
    }
  }
  return slugToIdMap.get(part) ?? part;
}

/**
 * Parse conversion slug (e.g., "kg-to-lbs") into unit IDs
 */
export function parseConversionSlug(slug: string): {
  from: string;
  to: string;
} | null {
  const match = slug.match(/^(.+?)-to-(.+)$/);
  if (!match) return null;
  return { from: slugPartToUnitId(match[1]), to: slugPartToUnitId(match[2]) };
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
        href: `/convert/${conversionSlug(fromUnitId, unit.id)}`,
      });
      
      // From other units to current "to" unit
      related.push({
        from: unit.id,
        to: toUnitId,
        fromName: unit.name,
        toName: unitsByCategory[category][toUnitId].name,
        href: `/convert/${conversionSlug(unit.id, toUnitId)}`,
      });
    }
  }

  // Shuffle and limit
  return related.slice(0, limit);
}
