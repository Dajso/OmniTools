/**
 * Torque Converter
 * 
 * Converts torque values between different units including:
 * - Newton-meter (Nm) - SI unit
 * - Foot-pound (ft-lb)
 * - Kilogram-meter (kg-m)
 * - Inch-pound (in-lb)
 * - Kilonewton-meter (kNm)
 * - Dyne-centimeter (dyn-cm)
 * - Gram-centimeter (g-cm)
 * - Ounce-inch (oz-in)
 * 
 * @module lib/calculations/physics/torque-converter
 * @see Requirements 31.6, 31.7
 */

/**
 * Error class for torque conversion errors
 */
export class TorqueError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'unknown_unit',
    public field?: string
  ) {
    super(message);
    this.name = 'TorqueError';
  }
}

/**
 * Supported torque units
 */
export type TorqueUnit =
  | 'nm'      // Newton-meter (SI unit)
  | 'knm'    // Kilonewton-meter
  | 'ftlb'   // Foot-pound
  | 'inlb'   // Inch-pound
  | 'kgm'    // Kilogram-meter
  | 'kgcm'   // Kilogram-centimeter
  | 'gcm'    // Gram-centimeter
  | 'dyncm'  // Dyne-centimeter
  | 'ozin';  // Ounce-inch

/**
 * Conversion factors to Newton-meter (base unit)
 */
export const TORQUE_TO_NEWTON_METER: Record<TorqueUnit, number> = {
  nm: 1,
  knm: 1000,
  ftlb: 1.3558179483,
  inlb: 0.1129848290,
  kgm: 9.80665,
  kgcm: 0.0980665,
  gcm: 0.0000980665,
  dyncm: 0.0000001,
  ozin: 0.00706155,
};

/**
 * Display names for torque units
 */
export const TORQUE_UNIT_NAMES: Record<TorqueUnit, string> = {
  nm: 'Newton-meter',
  knm: 'Kilonewton-meter',
  ftlb: 'Foot-pound',
  inlb: 'Inch-pound',
  kgm: 'Kilogram-meter',
  kgcm: 'Kilogram-centimeter',
  gcm: 'Gram-centimeter',
  dyncm: 'Dyne-centimeter',
  ozin: 'Ounce-inch',
};

/**
 * Unit symbols for torque units
 */
export const TORQUE_UNIT_SYMBOLS: Record<TorqueUnit, string> = {
  nm: 'N·m',
  knm: 'kN·m',
  ftlb: 'ft-lb',
  inlb: 'in-lb',
  kgm: 'kg·m',
  kgcm: 'kg·cm',
  gcm: 'g·cm',
  dyncm: 'dyn·cm',
  ozin: 'oz-in',
};

/**
 * Common torque reference values
 */
export const TORQUE_REFERENCES = {
  /** Typical car wheel lug nut torque */
  carLugNut: 110, // N·m (~80 ft-lb)
  /** Typical bicycle pedal torque */
  bicyclePedal: 35, // N·m
  /** Typical spark plug torque */
  sparkPlug: 20, // N·m
  /** Typical oil drain plug torque */
  oilDrainPlug: 35, // N·m
  /** High-performance car engine torque */
  highPerfEngine: 500, // N·m
};

/**
 * Result of torque conversion
 */
export interface TorqueConversionResult {
  /** Original value */
  originalValue: number;
  /** Original unit */
  originalUnit: TorqueUnit;
  /** Converted value */
  convertedValue: number;
  /** Target unit */
  targetUnit: TorqueUnit;
  /** Value in Newton-meter (base unit) */
  valueInNewtonMeter: number;
  /** Formatted result string */
  formatted: string;
  /** All unit conversions */
  allUnits: Record<TorqueUnit, number>;
}

/**
 * Validate torque unit
 */
function validateUnit(unit: string): TorqueUnit {
  const normalizedUnit = unit.toLowerCase() as TorqueUnit;
  if (!(normalizedUnit in TORQUE_TO_NEWTON_METER)) {
    throw new TorqueError(
      `Ukjent dreiemomentenhet: ${unit}`,
      'unknown_unit',
      'unit'
    );
  }
  return normalizedUnit;
}

/**
 * Convert torque from one unit to another
 * 
 * @param value - Torque value to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Converted torque value
 * 
 * @example
 * ```typescript
 * convertTorque(100, 'nm', 'ftlb'); // ~73.76
 * convertTorque(50, 'ftlb', 'nm'); // ~67.79
 * ```
 */
export function convertTorque(
  value: number,
  fromUnit: TorqueUnit | string,
  toUnit: TorqueUnit | string
): number {
  const from = validateUnit(fromUnit);
  const to = validateUnit(toUnit);
  
  // Convert to Newton-meter first, then to target unit
  const valueInNewtonMeter = value * TORQUE_TO_NEWTON_METER[from];
  return valueInNewtonMeter / TORQUE_TO_NEWTON_METER[to];
}

/**
 * Convert torque with full result details
 * 
 * @param value - Torque value to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Complete conversion result
 */
export function convertTorqueWithDetails(
  value: number,
  fromUnit: TorqueUnit | string,
  toUnit: TorqueUnit | string
): TorqueConversionResult {
  const from = validateUnit(fromUnit);
  const to = validateUnit(toUnit);
  
  const valueInNewtonMeter = value * TORQUE_TO_NEWTON_METER[from];
  const convertedValue = valueInNewtonMeter / TORQUE_TO_NEWTON_METER[to];
  
  // Calculate all unit conversions
  const allUnits: Record<TorqueUnit, number> = {} as Record<TorqueUnit, number>;
  for (const unit of Object.keys(TORQUE_TO_NEWTON_METER) as TorqueUnit[]) {
    allUnits[unit] = valueInNewtonMeter / TORQUE_TO_NEWTON_METER[unit];
  }
  
  return {
    originalValue: value,
    originalUnit: from,
    convertedValue,
    targetUnit: to,
    valueInNewtonMeter,
    formatted: `${convertedValue.toPrecision(6)} ${TORQUE_UNIT_SYMBOLS[to]}`,
    allUnits,
  };
}

/**
 * Convert torque to all supported units
 * 
 * @param value - Torque value
 * @param unit - Unit of the input value
 * @returns Object with torque in all units
 */
export function convertTorqueToAllUnits(
  value: number,
  unit: TorqueUnit | string
): Record<TorqueUnit, number> {
  const from = validateUnit(unit);
  const valueInNewtonMeter = value * TORQUE_TO_NEWTON_METER[from];
  
  const result: Record<TorqueUnit, number> = {} as Record<TorqueUnit, number>;
  for (const targetUnit of Object.keys(TORQUE_TO_NEWTON_METER) as TorqueUnit[]) {
    result[targetUnit] = valueInNewtonMeter / TORQUE_TO_NEWTON_METER[targetUnit];
  }
  
  return result;
}

/**
 * Format torque value with appropriate precision
 * 
 * @param value - Torque value
 * @param unit - Torque unit
 * @returns Formatted string
 */
export function formatTorque(value: number, unit: TorqueUnit): string {
  const symbol = TORQUE_UNIT_SYMBOLS[unit];
  
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
 * Get the list of all supported torque units
 */
export function getSupportedTorqueUnits(): TorqueUnit[] {
  return Object.keys(TORQUE_TO_NEWTON_METER) as TorqueUnit[];
}

/**
 * Check if a string is a valid torque unit
 */
export function isValidTorqueUnit(unit: string): boolean {
  return unit.toLowerCase() in TORQUE_TO_NEWTON_METER;
}

/**
 * Calculate torque from force and lever arm
 * τ = F × r (Torque = Force × Distance)
 * 
 * @param force - Force in Newtons
 * @param leverArm - Distance from pivot point in meters
 * @returns Torque in Newton-meters
 */
export function calculateTorque(force: number, leverArm: number): number {
  return force * leverArm;
}

/**
 * Calculate force from torque and lever arm
 * F = τ / r
 * 
 * @param torque - Torque in Newton-meters
 * @param leverArm - Distance from pivot point in meters
 * @returns Force in Newtons
 */
export function calculateForceFromTorque(torque: number, leverArm: number): number {
  if (leverArm === 0) {
    throw new TorqueError(
      'Momentarmen kan ikke være null',
      'invalid_input',
      'leverArm'
    );
  }
  return torque / leverArm;
}

/**
 * Calculate power from torque and angular velocity
 * P = τ × ω (Power = Torque × Angular velocity)
 * 
 * @param torque - Torque in Newton-meters
 * @param angularVelocity - Angular velocity in radians per second
 * @returns Power in Watts
 */
export function calculatePowerFromTorque(torque: number, angularVelocity: number): number {
  return torque * angularVelocity;
}

/**
 * Calculate power from torque and RPM
 * P = (τ × RPM × 2π) / 60
 * 
 * @param torque - Torque in Newton-meters
 * @param rpm - Rotations per minute
 * @returns Power in Watts
 */
export function calculatePowerFromTorqueAndRPM(torque: number, rpm: number): number {
  return (torque * rpm * 2 * Math.PI) / 60;
}
