/**
 * Fertilizer N-P-K Calculator
 * 
 * Calculates fertilizer application rates based on N-P-K ratios
 * and soil/plant requirements.
 * 
 * @module lib/calculations/garden/fertilizer-calculator
 * @see Requirements 25.3
 */

/**
 * Error class for fertilizer calculation errors
 */
export class FertilizerCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'FertilizerCalculationError';
  }
}

/**
 * N-P-K ratio representation
 */
export interface NPKRatio {
  /** Nitrogen percentage */
  nitrogen: number;
  /** Phosphorus percentage (as P2O5) */
  phosphorus: number;
  /** Potassium percentage (as K2O) */
  potassium: number;
}

/**
 * Area unit types
 */
export type AreaUnit = 'sqft' | 'sqm' | 'acre';

/**
 * Weight unit types
 */
export type WeightUnit = 'lbs' | 'kg' | 'oz';

/**
 * Input parameters for fertilizer calculation
 */
export interface FertilizerInput {
  /** N-P-K ratio of the fertilizer (e.g., 10-10-10) */
  npkRatio: NPKRatio;
  /** Desired nitrogen application rate (lbs per 1000 sqft or kg per 100 sqm) */
  targetNitrogenRate: number;
  /** Area to fertilize */
  area: number;
  /** Unit for area */
  areaUnit: AreaUnit;
  /** Weight unit for output */
  weightUnit?: WeightUnit;
}

/**
 * Results from fertilizer calculation
 */
export interface FertilizerResult {
  /** Total fertilizer needed */
  totalFertilizer: number;
  /** Weight unit */
  weightUnit: WeightUnit;
  /** Actual nitrogen applied */
  nitrogenApplied: number;
  /** Actual phosphorus applied */
  phosphorusApplied: number;
  /** Actual potassium applied */
  potassiumApplied: number;
  /** Application rate per 1000 sqft */
  ratePer1000SqFt: number;
  /** Application rate per 100 sqm */
  ratePer100SqM: number;
  /** Coverage area */
  area: number;
  /** Area unit */
  areaUnit: AreaUnit;
}

/**
 * Common fertilizer types with their N-P-K ratios
 */
export const COMMON_FERTILIZERS: Record<string, NPKRatio> = {
  'balanced': { nitrogen: 10, phosphorus: 10, potassium: 10 },
  'lawn-starter': { nitrogen: 18, phosphorus: 24, potassium: 6 },
  'lawn-maintenance': { nitrogen: 24, phosphorus: 4, potassium: 8 },
  'bloom-booster': { nitrogen: 10, phosphorus: 30, potassium: 20 },
  'vegetable': { nitrogen: 5, phosphorus: 10, potassium: 10 },
  'tomato': { nitrogen: 3, phosphorus: 4, potassium: 6 },
  'rose': { nitrogen: 4, phosphorus: 8, potassium: 4 },
  'all-purpose': { nitrogen: 12, phosphorus: 12, potassium: 12 },
  'high-nitrogen': { nitrogen: 21, phosphorus: 0, potassium: 0 },
  'triple-super-phosphate': { nitrogen: 0, phosphorus: 46, potassium: 0 },
  'muriate-of-potash': { nitrogen: 0, phosphorus: 0, potassium: 60 },
  'urea': { nitrogen: 46, phosphorus: 0, potassium: 0 },
  'ammonium-sulfate': { nitrogen: 21, phosphorus: 0, potassium: 0 },
};

/**
 * Recommended nitrogen rates by plant type (lbs N per 1000 sqft per application)
 */
export const NITROGEN_RATES: Record<string, number> = {
  'lawn-cool-season': 1.0,
  'lawn-warm-season': 0.5,
  'vegetables': 0.1,
  'flowers': 0.1,
  'trees-shrubs': 0.1,
  'fruit-trees': 0.1,
};

/**
 * Converts area to square feet
 */
export function convertToSqFt(area: number, unit: AreaUnit): number {
  switch (unit) {
    case 'sqft':
      return area;
    case 'sqm':
      return area * 10.764;
    case 'acre':
      return area * 43560;
    default:
      return area;
  }
}

/**
 * Converts weight from lbs to other units
 */
export function convertWeight(lbs: number, toUnit: WeightUnit): number {
  switch (toUnit) {
    case 'lbs':
      return lbs;
    case 'kg':
      return lbs * 0.453592;
    case 'oz':
      return lbs * 16;
    default:
      return lbs;
  }
}

/**
 * Parses N-P-K string (e.g., "10-10-10") to NPKRatio
 */
export function parseNPKString(npkString: string): NPKRatio {
  const parts = npkString.split('-').map(p => parseFloat(p.trim()));
  
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new FertilizerCalculationError(
      'Invalid N-P-K format. Use format like "10-10-10"',
      'invalid_input',
      'npkRatio'
    );
  }

  return {
    nitrogen: parts[0],
    phosphorus: parts[1],
    potassium: parts[2],
  };
}

/**
 * Formats NPKRatio to string
 */
export function formatNPKRatio(ratio: NPKRatio): string {
  return `${ratio.nitrogen}-${ratio.phosphorus}-${ratio.potassium}`;
}

/**
 * Validates N-P-K ratio values
 */
export function validateNPKRatio(ratio: NPKRatio): void {
  if (ratio.nitrogen < 0 || ratio.nitrogen > 100) {
    throw new FertilizerCalculationError(
      'Nitrogen percentage must be between 0 and 100',
      'invalid_input',
      'nitrogen'
    );
  }
  if (ratio.phosphorus < 0 || ratio.phosphorus > 100) {
    throw new FertilizerCalculationError(
      'Phosphorus percentage must be between 0 and 100',
      'invalid_input',
      'phosphorus'
    );
  }
  if (ratio.potassium < 0 || ratio.potassium > 100) {
    throw new FertilizerCalculationError(
      'Potassium percentage must be between 0 and 100',
      'invalid_input',
      'potassium'
    );
  }
  if (ratio.nitrogen + ratio.phosphorus + ratio.potassium > 100) {
    throw new FertilizerCalculationError(
      'Total N-P-K percentage cannot exceed 100%',
      'invalid_input',
      'npkRatio'
    );
  }
}

/**
 * Calculates fertilizer application amount
 * 
 * @param input - Fertilizer calculation parameters
 * @returns Fertilizer application results
 * 
 * @example
 * ```ts
 * const result = calculateFertilizer({
 *   npkRatio: { nitrogen: 10, phosphorus: 10, potassium: 10 },
 *   targetNitrogenRate: 1.0, // 1 lb N per 1000 sqft
 *   area: 5000,
 *   areaUnit: 'sqft',
 * });
 * console.log(result.totalFertilizer); // 50 lbs
 * ```
 */
export function calculateFertilizer(input: FertilizerInput): FertilizerResult {
  const {
    npkRatio,
    targetNitrogenRate,
    area,
    areaUnit,
    weightUnit = 'lbs',
  } = input;

  // Validate inputs
  validateNPKRatio(npkRatio);

  if (targetNitrogenRate <= 0) {
    throw new FertilizerCalculationError(
      'Target nitrogen rate must be positive',
      'invalid_input',
      'targetNitrogenRate'
    );
  }
  if (area <= 0) {
    throw new FertilizerCalculationError(
      'Area must be positive',
      'invalid_input',
      'area'
    );
  }

  // Handle zero nitrogen fertilizer
  if (npkRatio.nitrogen === 0) {
    throw new FertilizerCalculationError(
      'Cannot calculate based on nitrogen rate when fertilizer has 0% nitrogen. Use a different calculation method.',
      'calculation_error',
      'nitrogen'
    );
  }

  // Convert area to square feet
  const areaSqFt = convertToSqFt(area, areaUnit);

  // Calculate fertilizer needed per 1000 sqft to achieve target nitrogen rate
  // If fertilizer is 10% N and we want 1 lb N per 1000 sqft:
  // We need 1 / 0.10 = 10 lbs fertilizer per 1000 sqft
  const fertilizerPer1000SqFt = targetNitrogenRate / (npkRatio.nitrogen / 100);

  // Calculate total fertilizer needed
  const totalFertilizerLbs = (areaSqFt / 1000) * fertilizerPer1000SqFt;

  // Calculate actual nutrients applied
  const nitrogenApplied = totalFertilizerLbs * (npkRatio.nitrogen / 100);
  const phosphorusApplied = totalFertilizerLbs * (npkRatio.phosphorus / 100);
  const potassiumApplied = totalFertilizerLbs * (npkRatio.potassium / 100);

  // Convert to requested weight unit
  const totalFertilizer = convertWeight(totalFertilizerLbs, weightUnit);

  // Calculate rate per 100 sqm
  const ratePer100SqM = fertilizerPer1000SqFt * 0.929; // 1000 sqft ≈ 92.9 sqm

  return {
    totalFertilizer: Math.round(totalFertilizer * 100) / 100,
    weightUnit,
    nitrogenApplied: Math.round(convertWeight(nitrogenApplied, weightUnit) * 100) / 100,
    phosphorusApplied: Math.round(convertWeight(phosphorusApplied, weightUnit) * 100) / 100,
    potassiumApplied: Math.round(convertWeight(potassiumApplied, weightUnit) * 100) / 100,
    ratePer1000SqFt: Math.round(fertilizerPer1000SqFt * 100) / 100,
    ratePer100SqM: Math.round(ratePer100SqM * 100) / 100,
    area,
    areaUnit,
  };
}

/**
 * Calculates how much of each nutrient is in a given amount of fertilizer
 * 
 * @param npkRatio - N-P-K ratio of the fertilizer
 * @param amount - Amount of fertilizer
 * @param weightUnit - Unit of the amount
 * @returns Nutrient amounts
 */
export function calculateNutrientContent(
  npkRatio: NPKRatio,
  amount: number,
  weightUnit: WeightUnit = 'lbs'
): { nitrogen: number; phosphorus: number; potassium: number } {
  validateNPKRatio(npkRatio);

  if (amount < 0) {
    throw new FertilizerCalculationError(
      'Amount cannot be negative',
      'invalid_input',
      'amount'
    );
  }

  return {
    nitrogen: Math.round(amount * (npkRatio.nitrogen / 100) * 100) / 100,
    phosphorus: Math.round(amount * (npkRatio.phosphorus / 100) * 100) / 100,
    potassium: Math.round(amount * (npkRatio.potassium / 100) * 100) / 100,
  };
}
