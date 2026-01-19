/**
 * Fabric Yardage Calculator
 * 
 * Calculates fabric requirements based on garment type, size, and fabric width.
 * 
 * @module lib/calculations/crafts/fabric-yardage-calculator
 * @see Requirements 24.1
 */

/**
 * Error class for fabric yardage calculation errors
 */
export class FabricYardageError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'unsupported_garment',
    public field?: string
  ) {
    super(message);
    this.name = 'FabricYardageError';
  }
}

/**
 * Garment types supported by the calculator
 */
export type GarmentType = 
  | 'dress-short'
  | 'dress-midi'
  | 'dress-maxi'
  | 'skirt-short'
  | 'skirt-midi'
  | 'skirt-maxi'
  | 'pants'
  | 'shorts'
  | 'blouse'
  | 'shirt'
  | 'jacket'
  | 'coat';

/**
 * Size categories
 */
export type SizeCategory = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | '3xl';

/**
 * Common fabric widths in inches
 */
export type FabricWidth = 36 | 45 | 54 | 60;

/**
 * Input for fabric yardage calculation
 */
export interface FabricYardageInput {
  /** Type of garment */
  garmentType: GarmentType;
  /** Size category */
  size: SizeCategory;
  /** Fabric width in inches */
  fabricWidth: FabricWidth;
  /** Whether the fabric has a directional pattern (nap) */
  hasNap?: boolean;
  /** Additional length for matching patterns (in inches) */
  patternRepeat?: number;
}

/**
 * Result of fabric yardage calculation
 */
export interface FabricYardageResult {
  /** Yards of fabric needed */
  yardsNeeded: number;
  /** Meters of fabric needed */
  metersNeeded: number;
  /** Inches of fabric needed */
  inchesNeeded: number;
  /** Base yardage before adjustments */
  baseYardage: number;
  /** Additional yardage for nap/directional fabric */
  napAllowance: number;
  /** Additional yardage for pattern matching */
  patternAllowance: number;
}

/**
 * Base yardage requirements by garment type and size
 * Values are for 45" wide fabric
 */
export const BASE_YARDAGE: Record<GarmentType, Record<SizeCategory, number>> = {
  'dress-short': {
    'xs': 2.0, 's': 2.25, 'm': 2.5, 'l': 2.75, 'xl': 3.0, 'xxl': 3.25, '3xl': 3.5,
  },
  'dress-midi': {
    'xs': 2.5, 's': 2.75, 'm': 3.0, 'l': 3.25, 'xl': 3.5, 'xxl': 3.75, '3xl': 4.0,
  },
  'dress-maxi': {
    'xs': 3.5, 's': 3.75, 'm': 4.0, 'l': 4.25, 'xl': 4.5, 'xxl': 4.75, '3xl': 5.0,
  },
  'skirt-short': {
    'xs': 1.0, 's': 1.25, 'm': 1.5, 'l': 1.75, 'xl': 2.0, 'xxl': 2.25, '3xl': 2.5,
  },
  'skirt-midi': {
    'xs': 1.5, 's': 1.75, 'm': 2.0, 'l': 2.25, 'xl': 2.5, 'xxl': 2.75, '3xl': 3.0,
  },
  'skirt-maxi': {
    'xs': 2.0, 's': 2.25, 'm': 2.5, 'l': 2.75, 'xl': 3.0, 'xxl': 3.25, '3xl': 3.5,
  },
  'pants': {
    'xs': 2.0, 's': 2.25, 'm': 2.5, 'l': 2.75, 'xl': 3.0, 'xxl': 3.25, '3xl': 3.5,
  },
  'shorts': {
    'xs': 1.25, 's': 1.5, 'm': 1.75, 'l': 2.0, 'xl': 2.25, 'xxl': 2.5, '3xl': 2.75,
  },
  'blouse': {
    'xs': 1.5, 's': 1.75, 'm': 2.0, 'l': 2.25, 'xl': 2.5, 'xxl': 2.75, '3xl': 3.0,
  },
  'shirt': {
    'xs': 2.0, 's': 2.25, 'm': 2.5, 'l': 2.75, 'xl': 3.0, 'xxl': 3.25, '3xl': 3.5,
  },
  'jacket': {
    'xs': 2.5, 's': 2.75, 'm': 3.0, 'l': 3.25, 'xl': 3.5, 'xxl': 3.75, '3xl': 4.0,
  },
  'coat': {
    'xs': 3.5, 's': 3.75, 'm': 4.0, 'l': 4.25, 'xl': 4.5, 'xxl': 4.75, '3xl': 5.0,
  },
};

/**
 * Width adjustment factors relative to 45" fabric
 */
export const WIDTH_ADJUSTMENT_FACTORS: Record<FabricWidth, number> = {
  36: 1.25,  // Narrower fabric needs more length
  45: 1.0,   // Base reference
  54: 0.85,  // Wider fabric needs less length
  60: 0.75,  // Widest fabric needs least length
};

/**
 * Nap allowance percentage (additional fabric for directional patterns)
 */
export const NAP_ALLOWANCE_PERCENTAGE = 0.15; // 15% extra

/**
 * Calculates fabric yardage for a garment
 * 
 * @param input - Fabric yardage calculation input
 * @returns Fabric yardage calculation result
 * 
 * @example
 * ```ts
 * const result = calculateFabricYardage({
 *   garmentType: 'dress-midi',
 *   size: 'm',
 *   fabricWidth: 45,
 *   hasNap: true,
 * });
 * console.log(result.yardsNeeded); // 3.45
 * ```
 */
export function calculateFabricYardage(input: FabricYardageInput): FabricYardageResult {
  const {
    garmentType,
    size,
    fabricWidth,
    hasNap = false,
    patternRepeat = 0,
  } = input;

  // Validate inputs
  if (patternRepeat < 0) {
    throw new FabricYardageError(
      'Pattern repeat cannot be negative',
      'invalid_input',
      'patternRepeat'
    );
  }

  // Get base yardage for 45" fabric
  const baseYardageTable = BASE_YARDAGE[garmentType];
  if (!baseYardageTable) {
    throw new FabricYardageError(
      `Unsupported garment type: ${garmentType}`,
      'unsupported_garment',
      'garmentType'
    );
  }

  const baseYardage45 = baseYardageTable[size];
  if (baseYardage45 === undefined) {
    throw new FabricYardageError(
      `Unsupported size: ${size}`,
      'invalid_input',
      'size'
    );
  }

  // Adjust for fabric width
  const widthFactor = WIDTH_ADJUSTMENT_FACTORS[fabricWidth];
  const baseYardage = baseYardage45 * widthFactor;

  // Calculate nap allowance
  const napAllowance = hasNap ? baseYardage * NAP_ALLOWANCE_PERCENTAGE : 0;

  // Calculate pattern repeat allowance
  // Add one pattern repeat per yard of fabric
  const patternAllowance = patternRepeat > 0 
    ? (patternRepeat / 36) * Math.ceil(baseYardage) 
    : 0;

  // Total yardage
  const totalYardage = baseYardage + napAllowance + patternAllowance;
  const yardsNeeded = Math.ceil(totalYardage * 8) / 8; // Round up to nearest 1/8 yard

  return {
    yardsNeeded,
    metersNeeded: Math.round(yardsNeeded * 0.9144 * 100) / 100,
    inchesNeeded: Math.round(yardsNeeded * 36),
    baseYardage: Math.round(baseYardage * 100) / 100,
    napAllowance: Math.round(napAllowance * 100) / 100,
    patternAllowance: Math.round(patternAllowance * 100) / 100,
  };
}

/**
 * Converts yards to meters
 * 
 * @param yards - Length in yards
 * @returns Length in meters
 */
export function yardsToMeters(yards: number): number {
  return yards * 0.9144;
}

/**
 * Converts meters to yards
 * 
 * @param meters - Length in meters
 * @returns Length in yards
 */
export function metersToYards(meters: number): number {
  return meters / 0.9144;
}

/**
 * Calculates fabric needed for lining
 * Typically 90% of main fabric for most garments
 * 
 * @param mainFabricYards - Yards of main fabric
 * @param garmentType - Type of garment
 * @returns Yards of lining needed
 */
export function calculateLiningYardage(
  mainFabricYards: number,
  garmentType: GarmentType
): number {
  // Lining ratios by garment type
  const liningRatios: Partial<Record<GarmentType, number>> = {
    'dress-short': 0.9,
    'dress-midi': 0.9,
    'dress-maxi': 0.9,
    'skirt-short': 0.85,
    'skirt-midi': 0.85,
    'skirt-maxi': 0.85,
    'jacket': 0.95,
    'coat': 0.95,
    'pants': 0.5, // Usually only partial lining
  };

  const ratio = liningRatios[garmentType] ?? 0.9;
  return Math.ceil(mainFabricYards * ratio * 8) / 8;
}

/**
 * Calculates interfacing needed
 * 
 * @param garmentType - Type of garment
 * @param size - Size category
 * @returns Yards of interfacing needed
 */
export function calculateInterfacingYardage(
  garmentType: GarmentType,
  size: SizeCategory
): number {
  // Base interfacing requirements (for 20" wide interfacing)
  const interfacingBase: Partial<Record<GarmentType, number>> = {
    'blouse': 0.5,
    'shirt': 0.75,
    'jacket': 1.5,
    'coat': 2.0,
    'dress-short': 0.5,
    'dress-midi': 0.5,
    'dress-maxi': 0.5,
  };

  const base = interfacingBase[garmentType] ?? 0.25;
  
  // Size adjustments
  const sizeMultipliers: Record<SizeCategory, number> = {
    'xs': 0.85, 's': 0.9, 'm': 1.0, 'l': 1.1, 'xl': 1.2, 'xxl': 1.3, '3xl': 1.4,
  };

  return Math.ceil(base * sizeMultipliers[size] * 8) / 8;
}
