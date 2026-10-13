/**
 * Compost C:N Ratio Calculator
 * 
 * Calculates the carbon to nitrogen ratio for compost mixtures
 * to achieve optimal decomposition (ideal ratio is 25:1 to 30:1).
 * 
 * @module lib/calculations/garden/compost-calculator
 * @see Requirements 25.10
 */

/**
 * Error class for compost calculation errors
 */
export class CompostCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'CompostCalculationError';
  }
}

/**
 * Compost material type
 */
export type MaterialType = 'green' | 'brown';

/**
 * Weight unit types
 */
export type CompostWeightUnit = 'lbs' | 'kg' | 'parts';

/**
 * Compost material with C:N ratio data
 */
export interface CompostMaterial {
  /** Material name */
  name: string;
  /** Carbon to nitrogen ratio (C:N) */
  cnRatio: number;
  /** Type: green (nitrogen-rich) or brown (carbon-rich) */
  type: MaterialType;
  /** Moisture content percentage (optional) */
  moistureContent?: number;
}

/**
 * Input for a material in the compost mix
 */
export interface CompostMixInput {
  /** Material identifier or name */
  material: string;
  /** Amount of material */
  amount: number;
  /** Custom C:N ratio (overrides default if provided) */
  customCNRatio?: number;
}

/**
 * Input parameters for compost calculation
 */
export interface CompostInput {
  /** List of materials in the mix */
  materials: CompostMixInput[];
  /** Weight unit for amounts */
  weightUnit: CompostWeightUnit;
  /** Target C:N ratio (default: 30) */
  targetRatio?: number;
}

/**
 * Results from compost calculation
 */
export interface CompostResult {
  /** Calculated C:N ratio */
  cnRatio: number;
  /** Whether the ratio is in optimal range (25-30:1) */
  isOptimal: boolean;
  /** Recommendation for adjustment */
  recommendation: string;
  /** Total carbon content */
  totalCarbon: number;
  /** Total nitrogen content */
  totalNitrogen: number;
  /** Total weight of materials */
  totalWeight: number;
  /** Breakdown by material */
  breakdown: {
    material: string;
    amount: number;
    cnRatio: number;
    carbonContribution: number;
    nitrogenContribution: number;
  }[];
  /** Suggested additions to reach target ratio */
  suggestedAdditions?: {
    material: string;
    amount: number;
  };
}

/**
 * Common compost materials with their C:N ratios
 * Values are approximate averages
 */
export const COMPOST_MATERIALS: Record<string, CompostMaterial> = {
  // Green materials (nitrogen-rich)
  'grass-clippings': { name: 'Gressklipp', cnRatio: 20, type: 'green', moistureContent: 80 },
  'food-scraps': { name: 'Matavfall', cnRatio: 15, type: 'green', moistureContent: 80 },
  'coffee-grounds': { name: 'Kaffegrut', cnRatio: 20, type: 'green', moistureContent: 60 },
  'vegetable-waste': { name: 'Grønnsakrester', cnRatio: 25, type: 'green', moistureContent: 90 },
  'fruit-waste': { name: 'Fruktrester', cnRatio: 35, type: 'green', moistureContent: 80 },
  'fresh-manure': { name: 'Fersk husdyrgjødsel', cnRatio: 15, type: 'green', moistureContent: 70 },
  'seaweed': { name: 'Tang og tare', cnRatio: 19, type: 'green', moistureContent: 80 },
  'alfalfa': { name: 'Lusern', cnRatio: 12, type: 'green', moistureContent: 75 },
  'clover': { name: 'Kløver', cnRatio: 16, type: 'green', moistureContent: 80 },
  'weeds': { name: 'Ugress (grønt)', cnRatio: 25, type: 'green', moistureContent: 80 },
  
  // Brown materials (carbon-rich)
  'dry-leaves': { name: 'Tørt løv', cnRatio: 60, type: 'brown', moistureContent: 30 },
  'straw': { name: 'Halm', cnRatio: 80, type: 'brown', moistureContent: 10 },
  'sawdust': { name: 'Sagflis', cnRatio: 400, type: 'brown', moistureContent: 20 },
  'wood-chips': { name: 'Flis', cnRatio: 400, type: 'brown', moistureContent: 20 },
  'cardboard': { name: 'Papp', cnRatio: 350, type: 'brown', moistureContent: 5 },
  'newspaper': { name: 'Avispapir', cnRatio: 175, type: 'brown', moistureContent: 5 },
  'paper': { name: 'Papir', cnRatio: 170, type: 'brown', moistureContent: 5 },
  'corn-stalks': { name: 'Maisstengler', cnRatio: 75, type: 'brown', moistureContent: 15 },
  'pine-needles': { name: 'Furunåler', cnRatio: 80, type: 'brown', moistureContent: 30 },
  'hay': { name: 'Høy', cnRatio: 25, type: 'brown', moistureContent: 15 },
  'aged-manure': { name: 'Lagret husdyrgjødsel', cnRatio: 25, type: 'brown', moistureContent: 40 },
  'shredded-bark': { name: 'Oppmalt bark', cnRatio: 120, type: 'brown', moistureContent: 25 },
  'dryer-lint': { name: 'Lo fra tørketrommel', cnRatio: 100, type: 'brown', moistureContent: 5 },
  'egg-shells': { name: 'Eggeskall', cnRatio: 0, type: 'brown', moistureContent: 5 },
};

/**
 * Optimal C:N ratio range for composting
 */
export const OPTIMAL_CN_RANGE = { min: 25, max: 30 };

/**
 * Gets material data by name
 */
export function getMaterial(name: string): CompostMaterial | undefined {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
  return COMPOST_MATERIALS[normalizedName];
}

/**
 * Gets all available materials
 */
export function getAllMaterials(): CompostMaterial[] {
  return Object.values(COMPOST_MATERIALS);
}

/**
 * Gets materials by type
 */
export function getMaterialsByType(type: MaterialType): CompostMaterial[] {
  return Object.values(COMPOST_MATERIALS).filter(m => m.type === type);
}

/**
 * Calculates the C:N ratio for a compost mixture
 * 
 * Formula: Overall C:N = Σ(weight × C:N ratio) / Σ(weight)
 * 
 * More precisely, we calculate total carbon and nitrogen:
 * - Carbon contribution = weight × (C:N ratio / (C:N ratio + 1))
 * - Nitrogen contribution = weight × (1 / (C:N ratio + 1))
 * - Final C:N = Total Carbon / Total Nitrogen
 * 
 * @param input - Compost mix parameters
 * @returns Compost calculation results
 * 
 * @example
 * ```ts
 * const result = calculateCompostRatio({
 *   materials: [
 *     { material: 'grass-clippings', amount: 2 },
 *     { material: 'dry-leaves', amount: 3 },
 *   ],
 *   weightUnit: 'parts',
 * });
 * console.log(result.cnRatio); // ~36:1
 * ```
 */
export function calculateCompostRatio(input: CompostInput): CompostResult {
  const { materials, weightUnit, targetRatio = 30 } = input;

  if (materials.length === 0) {
    throw new CompostCalculationError(
      'Du må legge til minst ett materiale',
      'invalid_input',
      'materials'
    );
  }

  let totalCarbon = 0;
  let totalNitrogen = 0;
  let totalWeight = 0;
  const breakdown: CompostResult['breakdown'] = [];

  for (const item of materials) {
    if (item.amount <= 0) {
      throw new CompostCalculationError(
        `Mengden for ${item.material} må være større enn null`,
        'invalid_input',
        'amount'
      );
    }

    // Get C:N ratio (custom or from database)
    let cnRatio = item.customCNRatio;
    if (cnRatio === undefined) {
      const materialData = getMaterial(item.material);
      if (!materialData) {
        throw new CompostCalculationError(
          `Ukjent materiale: ${item.material}. Oppgi et eget C:N-forhold.`,
          'invalid_input',
          'material'
        );
      }
      cnRatio = materialData.cnRatio;
    }

    if (cnRatio < 0) {
      throw new CompostCalculationError(
        `C:N-forholdet for ${item.material} kan ikke være negativt`,
        'invalid_input',
        'cnRatio'
      );
    }

    // Handle special case where C:N is 0 (like egg shells - mostly calcium)
    // These contribute neither carbon nor nitrogen significantly
    if (cnRatio === 0) {
      totalWeight += item.amount;
      breakdown.push({
        material: item.material,
        amount: item.amount,
        cnRatio: 0,
        carbonContribution: 0,
        nitrogenContribution: 0,
      });
      continue;
    }

    // Calculate carbon and nitrogen contributions
    // If C:N = 30, then for every 31 parts of organic matter, 30 are carbon and 1 is nitrogen
    const carbonFraction = cnRatio / (cnRatio + 1);
    const nitrogenFraction = 1 / (cnRatio + 1);

    const carbonContribution = item.amount * carbonFraction;
    const nitrogenContribution = item.amount * nitrogenFraction;

    totalCarbon += carbonContribution;
    totalNitrogen += nitrogenContribution;
    totalWeight += item.amount;

    breakdown.push({
      material: item.material,
      amount: item.amount,
      cnRatio,
      carbonContribution: Math.round(carbonContribution * 1000) / 1000,
      nitrogenContribution: Math.round(nitrogenContribution * 1000) / 1000,
    });
  }

  // Calculate final C:N ratio
  const cnRatio = totalNitrogen > 0 ? totalCarbon / totalNitrogen : 0;
  const isOptimal = cnRatio >= OPTIMAL_CN_RANGE.min && cnRatio <= OPTIMAL_CN_RANGE.max;

  // Generate recommendation
  let recommendation: string;
  let suggestedAdditions: CompostResult['suggestedAdditions'];

  if (cnRatio < OPTIMAL_CN_RANGE.min) {
    recommendation = `C:N-forholdet er for lavt (${Math.round(cnRatio)}:1). Tilsett mer brunt, karbonrikt materiale som tørt løv, halm eller papp.`;
    // Calculate how much brown material to add
    const targetN = totalNitrogen;
    const targetC = targetN * targetRatio;
    const carbonNeeded = targetC - totalCarbon;
    // Using dry leaves (C:N = 60) as suggestion
    const leavesNeeded = carbonNeeded / (60 / 61);
    suggestedAdditions = {
      material: 'dry-leaves',
      amount: Math.round(leavesNeeded * 10) / 10,
    };
  } else if (cnRatio > OPTIMAL_CN_RANGE.max) {
    recommendation = `C:N-forholdet er for høyt (${Math.round(cnRatio)}:1). Tilsett mer grønt, nitrogenrikt materiale som gressklipp, matavfall eller fersk husdyrgjødsel.`;
    // Calculate how much green material to add
    const targetC = totalCarbon;
    const targetN = targetC / targetRatio;
    const nitrogenNeeded = targetN - totalNitrogen;
    // Using grass clippings (C:N = 20) as suggestion
    const grassNeeded = nitrogenNeeded / (1 / 21);
    suggestedAdditions = {
      material: 'grass-clippings',
      amount: Math.round(grassNeeded * 10) / 10,
    };
  } else {
    recommendation = `C:N-forholdet på ${Math.round(cnRatio)}:1 ligger i det ideelle området for kompostering.`;
  }

  return {
    cnRatio: Math.round(cnRatio * 10) / 10,
    isOptimal,
    recommendation,
    totalCarbon: Math.round(totalCarbon * 1000) / 1000,
    totalNitrogen: Math.round(totalNitrogen * 1000) / 1000,
    totalWeight: Math.round(totalWeight * 100) / 100,
    breakdown,
    suggestedAdditions,
  };
}

/**
 * Calculates how much of a material to add to reach target C:N ratio
 * 
 * @param currentCarbon - Current total carbon
 * @param currentNitrogen - Current total nitrogen
 * @param materialCNRatio - C:N ratio of material to add
 * @param targetRatio - Target C:N ratio
 * @returns Amount of material to add
 */
export function calculateMaterialToAdd(
  currentCarbon: number,
  currentNitrogen: number,
  materialCNRatio: number,
  targetRatio: number
): number {
  if (materialCNRatio <= 0) {
    throw new CompostCalculationError(
      'Material C:N ratio must be positive',
      'invalid_input',
      'materialCNRatio'
    );
  }

  const currentRatio = currentNitrogen > 0 ? currentCarbon / currentNitrogen : 0;
  
  if (currentRatio === targetRatio) {
    return 0;
  }

  // Solve for amount x:
  // (currentCarbon + x * carbonFraction) / (currentNitrogen + x * nitrogenFraction) = targetRatio
  const carbonFraction = materialCNRatio / (materialCNRatio + 1);
  const nitrogenFraction = 1 / (materialCNRatio + 1);

  const numerator = targetRatio * currentNitrogen - currentCarbon;
  const denominator = carbonFraction - targetRatio * nitrogenFraction;

  if (Math.abs(denominator) < 0.0001) {
    throw new CompostCalculationError(
      'Cannot reach target ratio with this material',
      'calculation_error'
    );
  }

  const amount = numerator / denominator;

  if (amount < 0) {
    throw new CompostCalculationError(
      'Cannot reach target ratio by adding this material (need to add opposite type)',
      'calculation_error'
    );
  }

  return Math.round(amount * 100) / 100;
}
