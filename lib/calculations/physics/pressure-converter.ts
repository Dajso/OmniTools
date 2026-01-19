/**
 * Pressure Converter
 * 
 * Converts pressure values between different units including:
 * - Pascal (Pa) - SI unit
 * - Bar
 * - PSI (pounds per square inch)
 * - Atmosphere (atm)
 * - Torr (mmHg)
 * - kPa (kilopascal)
 * - MPa (megapascal)
 * - inHg (inches of mercury)
 * - cmH2O (centimeters of water)
 * 
 * @module lib/calculations/physics/pressure-converter
 * @see Requirements 31.5, 31.7
 */

/**
 * Error class for pressure conversion errors
 */
export class PressureError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'unknown_unit',
    public field?: string
  ) {
    super(message);
    this.name = 'PressureError';
  }
}

/**
 * Supported pressure units
 */
export type PressureUnit =
  | 'pa'      // Pascal
  | 'kpa'    // Kilopascal
  | 'mpa'    // Megapascal
  | 'bar'    // Bar
  | 'mbar'   // Millibar
  | 'psi'    // Pounds per square inch
  | 'atm'    // Standard atmosphere
  | 'torr'   // Torr (mmHg)
  | 'mmhg'   // Millimeters of mercury
  | 'inhg'   // Inches of mercury
  | 'cmh2o'  // Centimeters of water
  | 'inh2o'; // Inches of water

/**
 * Conversion factors to Pascal (base unit)
 */
export const PRESSURE_TO_PASCAL: Record<PressureUnit, number> = {
  pa: 1,
  kpa: 1000,
  mpa: 1000000,
  bar: 100000,
  mbar: 100,
  psi: 6894.757,
  atm: 101325,
  torr: 133.322,
  mmhg: 133.322,
  inhg: 3386.39,
  cmh2o: 98.0665,
  inh2o: 249.082,
};

/**
 * Display names for pressure units
 */
export const PRESSURE_UNIT_NAMES: Record<PressureUnit, string> = {
  pa: 'Pascal',
  kpa: 'Kilopascal',
  mpa: 'Megapascal',
  bar: 'Bar',
  mbar: 'Millibar',
  psi: 'PSI',
  atm: 'Atmosphere',
  torr: 'Torr',
  mmhg: 'mmHg',
  inhg: 'inHg',
  cmh2o: 'cmH₂O',
  inh2o: 'inH₂O',
};

/**
 * Unit symbols for pressure units
 */
export const PRESSURE_UNIT_SYMBOLS: Record<PressureUnit, string> = {
  pa: 'Pa',
  kpa: 'kPa',
  mpa: 'MPa',
  bar: 'bar',
  mbar: 'mbar',
  psi: 'psi',
  atm: 'atm',
  torr: 'Torr',
  mmhg: 'mmHg',
  inhg: 'inHg',
  cmh2o: 'cmH₂O',
  inh2o: 'inH₂O',
};

/**
 * Common pressure reference values
 */
export const PRESSURE_REFERENCES = {
  /** Standard atmospheric pressure at sea level */
  standardAtmosphere: 101325, // Pa
  /** Vacuum (absolute zero pressure) */
  vacuum: 0,
  /** Typical tire pressure (car) */
  carTire: 220000, // Pa (~32 psi)
  /** Typical blood pressure (systolic) */
  bloodPressureSystolic: 16000, // Pa (~120 mmHg)
  /** Deep sea pressure at 1000m */
  deepSea1000m: 10132500, // Pa (~100 atm)
};

/**
 * Result of pressure conversion
 */
export interface PressureConversionResult {
  /** Original value */
  originalValue: number;
  /** Original unit */
  originalUnit: PressureUnit;
  /** Converted value */
  convertedValue: number;
  /** Target unit */
  targetUnit: PressureUnit;
  /** Value in Pascal (base unit) */
  valueInPascal: number;
  /** Formatted result string */
  formatted: string;
  /** All unit conversions */
  allUnits: Record<PressureUnit, number>;
}

/**
 * Validate pressure unit
 */
function validateUnit(unit: string): PressureUnit {
  const normalizedUnit = unit.toLowerCase() as PressureUnit;
  if (!(normalizedUnit in PRESSURE_TO_PASCAL)) {
    throw new PressureError(
      `Unknown pressure unit: ${unit}`,
      'unknown_unit',
      'unit'
    );
  }
  return normalizedUnit;
}

/**
 * Convert pressure from one unit to another
 * 
 * @param value - Pressure value to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Converted pressure value
 * 
 * @example
 * ```typescript
 * convertPressure(1, 'atm', 'psi'); // ~14.696
 * convertPressure(100, 'kpa', 'bar'); // 1
 * ```
 */
export function convertPressure(
  value: number,
  fromUnit: PressureUnit | string,
  toUnit: PressureUnit | string
): number {
  const from = validateUnit(fromUnit);
  const to = validateUnit(toUnit);
  
  // Convert to Pascal first, then to target unit
  const valueInPascal = value * PRESSURE_TO_PASCAL[from];
  return valueInPascal / PRESSURE_TO_PASCAL[to];
}

/**
 * Convert pressure with full result details
 * 
 * @param value - Pressure value to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Complete conversion result
 */
export function convertPressureWithDetails(
  value: number,
  fromUnit: PressureUnit | string,
  toUnit: PressureUnit | string
): PressureConversionResult {
  const from = validateUnit(fromUnit);
  const to = validateUnit(toUnit);
  
  if (value < 0) {
    throw new PressureError(
      'Pressure cannot be negative (absolute pressure)',
      'invalid_input',
      'value'
    );
  }
  
  const valueInPascal = value * PRESSURE_TO_PASCAL[from];
  const convertedValue = valueInPascal / PRESSURE_TO_PASCAL[to];
  
  // Calculate all unit conversions
  const allUnits: Record<PressureUnit, number> = {} as Record<PressureUnit, number>;
  for (const unit of Object.keys(PRESSURE_TO_PASCAL) as PressureUnit[]) {
    allUnits[unit] = valueInPascal / PRESSURE_TO_PASCAL[unit];
  }
  
  return {
    originalValue: value,
    originalUnit: from,
    convertedValue,
    targetUnit: to,
    valueInPascal,
    formatted: `${convertedValue.toPrecision(6)} ${PRESSURE_UNIT_SYMBOLS[to]}`,
    allUnits,
  };
}

/**
 * Convert pressure to all supported units
 * 
 * @param value - Pressure value
 * @param unit - Unit of the input value
 * @returns Object with pressure in all units
 */
export function convertToAllUnits(
  value: number,
  unit: PressureUnit | string
): Record<PressureUnit, number> {
  const from = validateUnit(unit);
  const valueInPascal = value * PRESSURE_TO_PASCAL[from];
  
  const result: Record<PressureUnit, number> = {} as Record<PressureUnit, number>;
  for (const targetUnit of Object.keys(PRESSURE_TO_PASCAL) as PressureUnit[]) {
    result[targetUnit] = valueInPascal / PRESSURE_TO_PASCAL[targetUnit];
  }
  
  return result;
}

/**
 * Format pressure value with appropriate precision
 * 
 * @param value - Pressure value
 * @param unit - Pressure unit
 * @returns Formatted string
 */
export function formatPressure(value: number, unit: PressureUnit): string {
  const symbol = PRESSURE_UNIT_SYMBOLS[unit];
  
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toPrecision(4)}M ${symbol}`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toPrecision(4)}k ${symbol}`;
  }
  if (Math.abs(value) >= 1) {
    return `${value.toPrecision(4)} ${symbol}`;
  }
  if (Math.abs(value) >= 0.001) {
    return `${(value * 1000).toPrecision(4)}m ${symbol}`;
  }
  return `${value.toExponential(3)} ${symbol}`;
}

/**
 * Get the list of all supported pressure units
 */
export function getSupportedUnits(): PressureUnit[] {
  return Object.keys(PRESSURE_TO_PASCAL) as PressureUnit[];
}

/**
 * Check if a string is a valid pressure unit
 */
export function isValidUnit(unit: string): boolean {
  return unit.toLowerCase() in PRESSURE_TO_PASCAL;
}

/**
 * Calculate gauge pressure from absolute pressure
 * Gauge pressure = Absolute pressure - Atmospheric pressure
 * 
 * @param absolutePressure - Absolute pressure in Pascal
 * @param atmosphericPressure - Atmospheric pressure in Pascal (default: standard atmosphere)
 * @returns Gauge pressure in Pascal
 */
export function absoluteToGauge(
  absolutePressure: number,
  atmosphericPressure: number = PRESSURE_REFERENCES.standardAtmosphere
): number {
  return absolutePressure - atmosphericPressure;
}

/**
 * Calculate absolute pressure from gauge pressure
 * Absolute pressure = Gauge pressure + Atmospheric pressure
 * 
 * @param gaugePressure - Gauge pressure in Pascal
 * @param atmosphericPressure - Atmospheric pressure in Pascal (default: standard atmosphere)
 * @returns Absolute pressure in Pascal
 */
export function gaugeToAbsolute(
  gaugePressure: number,
  atmosphericPressure: number = PRESSURE_REFERENCES.standardAtmosphere
): number {
  return gaugePressure + atmosphericPressure;
}

/**
 * Calculate pressure at a given depth in a fluid
 * P = ρgh (Pressure = density × gravity × height)
 * 
 * @param depth - Depth in meters
 * @param fluidDensity - Fluid density in kg/m³ (default: water = 1000)
 * @param gravity - Gravitational acceleration in m/s² (default: 9.80665)
 * @returns Pressure in Pascal
 */
export function pressureAtDepth(
  depth: number,
  fluidDensity: number = 1000,
  gravity: number = 9.80665
): number {
  return fluidDensity * gravity * depth;
}

/**
 * Calculate total pressure at depth (including atmospheric)
 * 
 * @param depth - Depth in meters
 * @param fluidDensity - Fluid density in kg/m³ (default: water = 1000)
 * @param atmosphericPressure - Surface atmospheric pressure in Pascal
 * @returns Total absolute pressure in Pascal
 */
export function totalPressureAtDepth(
  depth: number,
  fluidDensity: number = 1000,
  atmosphericPressure: number = PRESSURE_REFERENCES.standardAtmosphere
): number {
  return atmosphericPressure + pressureAtDepth(depth, fluidDensity);
}
