/**
 * Vegetable Yield Calculator
 * 
 * Estimates vegetable harvest yields based on garden area,
 * plant type, and growing conditions.
 * 
 * @module lib/calculations/garden/vegetable-yield-calculator
 * @see Requirements 25.8
 */

/**
 * Error class for vegetable yield calculation errors
 */
export class VegetableYieldCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'VegetableYieldCalculationError';
  }
}

/**
 * Growing condition levels
 */
export type GrowingCondition = 'poor' | 'average' | 'good' | 'excellent';

/**
 * Area unit types
 */
export type YieldAreaUnit = 'sqft' | 'sqm' | 'row_feet' | 'row_meters';

/**
 * Weight unit types
 */
export type YieldWeightUnit = 'lbs' | 'kg' | 'oz';

/**
 * Vegetable yield data
 */
export interface VegetableYieldData {
  /** Vegetable name */
  name: string;
  /** Average yield per plant (lbs) */
  yieldPerPlant: number;
  /** Recommended spacing between plants (inches) */
  plantSpacing: number;
  /** Recommended row spacing (inches) */
  rowSpacing: number;
  /** Days to harvest from transplant */
  daysToHarvest: number;
  /** Number of harvests per season */
  harvestsPerSeason: number;
  /** Growing season (cool/warm) */
  season: 'cool' | 'warm' | 'both';
}

/**
 * Input parameters for vegetable yield calculation
 */
export interface VegetableYieldInput {
  /** Vegetable type */
  vegetable: string;
  /** Garden area or row length */
  area: number;
  /** Unit for area/length */
  areaUnit: YieldAreaUnit;
  /** Growing conditions */
  conditions?: GrowingCondition;
  /** Number of plants (if known, overrides area calculation) */
  plantCount?: number;
  /** Custom yield per plant (overrides default) */
  customYieldPerPlant?: number;
}

/**
 * Results from vegetable yield calculation
 */
export interface VegetableYieldResult {
  /** Vegetable name */
  vegetable: string;
  /** Estimated number of plants */
  plantCount: number;
  /** Estimated yield per plant */
  yieldPerPlant: number;
  /** Total estimated yield */
  totalYield: number;
  /** Weight unit */
  weightUnit: YieldWeightUnit;
  /** Yield per square foot */
  yieldPerSqFt: number;
  /** Days to first harvest */
  daysToHarvest: number;
  /** Expected harvests per season */
  harvestsPerSeason: number;
  /** Yield per harvest */
  yieldPerHarvest: number;
  /** Condition multiplier applied */
  conditionMultiplier: number;
  /** Recommendations */
  tips: string[];
}

/**
 * Condition multipliers for yield estimation
 */
export const CONDITION_MULTIPLIERS: Record<GrowingCondition, number> = {
  'poor': 0.5,
  'average': 0.75,
  'good': 1.0,
  'excellent': 1.25,
};

/**
 * Vegetable yield database
 * Yields are average values in lbs per plant
 */
export const VEGETABLE_YIELDS: Record<string, VegetableYieldData> = {
  'tomatoes': {
    name: 'Tomat',
    yieldPerPlant: 10,
    plantSpacing: 24,
    rowSpacing: 36,
    daysToHarvest: 70,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'tomatoes-cherry': {
    name: 'Cherrytomat',
    yieldPerPlant: 8,
    plantSpacing: 24,
    rowSpacing: 36,
    daysToHarvest: 60,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'peppers': {
    name: 'Paprika',
    yieldPerPlant: 5,
    plantSpacing: 18,
    rowSpacing: 24,
    daysToHarvest: 65,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'peppers-hot': {
    name: 'Chili',
    yieldPerPlant: 3,
    plantSpacing: 18,
    rowSpacing: 24,
    daysToHarvest: 70,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'cucumbers': {
    name: 'Agurk',
    yieldPerPlant: 10,
    plantSpacing: 12,
    rowSpacing: 48,
    daysToHarvest: 55,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'zucchini': {
    name: 'Squash',
    yieldPerPlant: 10,
    plantSpacing: 24,
    rowSpacing: 36,
    daysToHarvest: 50,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'squash-summer': {
    name: 'Sommersquash',
    yieldPerPlant: 10,
    plantSpacing: 24,
    rowSpacing: 48,
    daysToHarvest: 50,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'squash-winter': {
    name: 'Vintersquash',
    yieldPerPlant: 12,
    plantSpacing: 36,
    rowSpacing: 72,
    daysToHarvest: 90,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'beans-bush': {
    name: 'Buskbønner',
    yieldPerPlant: 0.5,
    plantSpacing: 4,
    rowSpacing: 24,
    daysToHarvest: 55,
    harvestsPerSeason: 2,
    season: 'warm',
  },
  'beans-pole': {
    name: 'Stangbønner',
    yieldPerPlant: 1,
    plantSpacing: 6,
    rowSpacing: 36,
    daysToHarvest: 65,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'peas': {
    name: 'Erter',
    yieldPerPlant: 0.25,
    plantSpacing: 3,
    rowSpacing: 24,
    daysToHarvest: 60,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'lettuce': {
    name: 'Salat',
    yieldPerPlant: 0.5,
    plantSpacing: 6,
    rowSpacing: 12,
    daysToHarvest: 45,
    harvestsPerSeason: 3,
    season: 'cool',
  },
  'spinach': {
    name: 'Spinat',
    yieldPerPlant: 0.25,
    plantSpacing: 4,
    rowSpacing: 12,
    daysToHarvest: 40,
    harvestsPerSeason: 3,
    season: 'cool',
  },
  'kale': {
    name: 'Grønnkål',
    yieldPerPlant: 1,
    plantSpacing: 12,
    rowSpacing: 18,
    daysToHarvest: 55,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'carrots': {
    name: 'Gulrot',
    yieldPerPlant: 0.15,
    plantSpacing: 2,
    rowSpacing: 12,
    daysToHarvest: 70,
    harvestsPerSeason: 2,
    season: 'cool',
  },
  'beets': {
    name: 'Rødbeter',
    yieldPerPlant: 0.25,
    plantSpacing: 3,
    rowSpacing: 12,
    daysToHarvest: 55,
    harvestsPerSeason: 2,
    season: 'cool',
  },
  'radishes': {
    name: 'Reddik',
    yieldPerPlant: 0.05,
    plantSpacing: 2,
    rowSpacing: 6,
    daysToHarvest: 25,
    harvestsPerSeason: 4,
    season: 'cool',
  },
  'onions': {
    name: 'Løk',
    yieldPerPlant: 0.5,
    plantSpacing: 4,
    rowSpacing: 12,
    daysToHarvest: 100,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'garlic': {
    name: 'Hvitløk',
    yieldPerPlant: 0.1,
    plantSpacing: 4,
    rowSpacing: 12,
    daysToHarvest: 240,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'potatoes': {
    name: 'Potet',
    yieldPerPlant: 3,
    plantSpacing: 12,
    rowSpacing: 30,
    daysToHarvest: 90,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'corn': {
    name: 'Mais',
    yieldPerPlant: 1,
    plantSpacing: 12,
    rowSpacing: 30,
    daysToHarvest: 75,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'broccoli': {
    name: 'Brokkoli',
    yieldPerPlant: 1,
    plantSpacing: 18,
    rowSpacing: 24,
    daysToHarvest: 70,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'cabbage': {
    name: 'Kål',
    yieldPerPlant: 3,
    plantSpacing: 18,
    rowSpacing: 24,
    daysToHarvest: 80,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'cauliflower': {
    name: 'Blomkål',
    yieldPerPlant: 2,
    plantSpacing: 18,
    rowSpacing: 24,
    daysToHarvest: 75,
    harvestsPerSeason: 1,
    season: 'cool',
  },
  'eggplant': {
    name: 'Aubergine',
    yieldPerPlant: 8,
    plantSpacing: 24,
    rowSpacing: 30,
    daysToHarvest: 70,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'melons': {
    name: 'Meloner',
    yieldPerPlant: 8,
    plantSpacing: 36,
    rowSpacing: 72,
    daysToHarvest: 85,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'watermelon': {
    name: 'Vannmelon',
    yieldPerPlant: 20,
    plantSpacing: 48,
    rowSpacing: 96,
    daysToHarvest: 90,
    harvestsPerSeason: 1,
    season: 'warm',
  },
  'pumpkins': {
    name: 'Gresskar',
    yieldPerPlant: 15,
    plantSpacing: 48,
    rowSpacing: 96,
    daysToHarvest: 100,
    harvestsPerSeason: 1,
    season: 'warm',
  },
};

/**
 * Gets vegetable data by name
 */
export function getVegetable(name: string): VegetableYieldData | undefined {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
  return VEGETABLE_YIELDS[normalizedName];
}

/**
 * Gets all available vegetables
 */
export function getAllVegetables(): VegetableYieldData[] {
  return Object.values(VEGETABLE_YIELDS);
}

/**
 * Converts area to square feet
 */
export function convertAreaToSqFt(area: number, unit: YieldAreaUnit, rowSpacing: number): number {
  switch (unit) {
    case 'sqft':
      return area;
    case 'sqm':
      return area * 10.764;
    case 'row_feet':
      // Convert row feet to sqft using row spacing
      return area * (rowSpacing / 12);
    case 'row_meters':
      // Convert row meters to sqft
      return area * 3.28084 * (rowSpacing / 12);
    default:
      return area;
  }
}

/**
 * Converts weight from lbs to other units
 */
export function convertYieldWeight(lbs: number, toUnit: YieldWeightUnit): number {
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
 * Calculates number of plants that fit in an area
 */
export function calculatePlantCount(
  areaSqFt: number,
  plantSpacing: number,
  rowSpacing: number
): number {
  // Convert spacing from inches to feet
  const plantSpacingFt = plantSpacing / 12;
  const rowSpacingFt = rowSpacing / 12;
  
  // Calculate plants per row and number of rows
  const areaPerPlant = plantSpacingFt * rowSpacingFt;
  
  return Math.floor(areaSqFt / areaPerPlant);
}

/**
 * Generates growing tips based on vegetable and conditions
 */
export function generateTips(vegetable: VegetableYieldData, conditions: GrowingCondition): string[] {
  const tips: string[] = [];

  if (conditions === 'poor' || conditions === 'average') {
    tips.push('Bland inn kompost i jorda for å øke avlingen.');
    tips.push('Vann jevnlig, særlig når frukten utvikler seg.');
  }

  if (vegetable.season === 'cool') {
    tips.push('Så tidlig på våren eller sent på sommeren for best resultat.');
    tips.push('Gi skygge i varme perioder så plantene ikke går i blomst.');
  } else if (vegetable.season === 'warm') {
    tips.push('Vent til jorda er varm før du planter ut.');
    tips.push('Dekk jorda rundt plantene med mulch for å holde på fukt og varme.');
  }

  if (vegetable.harvestsPerSeason > 1) {
    tips.push(`Så på nytt hver 2.–3. uke for jevn innhøsting.`);
  }

  if (vegetable.yieldPerPlant > 5) {
    tips.push('Rikt bærende plante – tenk på å fryse eller sylte det som blir til overs.');
  }

  return tips;
}

/**
 * Calculates estimated vegetable yield
 * 
 * @param input - Vegetable yield calculation parameters
 * @returns Yield estimation results
 * 
 * @example
 * ```ts
 * const result = calculateVegetableYield({
 *   vegetable: 'tomatoes',
 *   area: 100,
 *   areaUnit: 'sqft',
 *   conditions: 'good',
 * });
 * console.log(result.totalYield); // ~120 lbs
 * ```
 */
export function calculateVegetableYield(input: VegetableYieldInput): VegetableYieldResult {
  const {
    vegetable,
    area,
    areaUnit,
    conditions = 'average',
    plantCount: inputPlantCount,
    customYieldPerPlant,
  } = input;

  // Validate inputs
  if (area <= 0 && !inputPlantCount) {
    throw new VegetableYieldCalculationError(
      'Arealet må være større enn null',
      'invalid_input',
      'area'
    );
  }

  // Get vegetable data
  const vegData = getVegetable(vegetable);
  if (!vegData) {
    throw new VegetableYieldCalculationError(
      `Ukjent grønnsak: ${vegetable}`,
      'invalid_input',
      'vegetable'
    );
  }

  // Calculate plant count
  let plantCount: number;
  if (inputPlantCount !== undefined) {
    if (inputPlantCount <= 0) {
      throw new VegetableYieldCalculationError(
        'Antall planter må være større enn null',
        'invalid_input',
        'plantCount'
      );
    }
    plantCount = inputPlantCount;
  } else {
    const areaSqFt = convertAreaToSqFt(area, areaUnit, vegData.rowSpacing);
    plantCount = calculatePlantCount(areaSqFt, vegData.plantSpacing, vegData.rowSpacing);
  }

  // Get yield per plant
  const baseYieldPerPlant = customYieldPerPlant ?? vegData.yieldPerPlant;
  
  // Apply condition multiplier
  const conditionMultiplier = CONDITION_MULTIPLIERS[conditions];
  const adjustedYieldPerPlant = baseYieldPerPlant * conditionMultiplier;

  // Calculate total yield
  const totalYield = plantCount * adjustedYieldPerPlant;

  // Calculate yield per square foot
  const areaSqFt = inputPlantCount 
    ? plantCount * (vegData.plantSpacing / 12) * (vegData.rowSpacing / 12)
    : convertAreaToSqFt(area, areaUnit, vegData.rowSpacing);
  const yieldPerSqFt = areaSqFt > 0 ? totalYield / areaSqFt : 0;

  // Calculate yield per harvest
  const yieldPerHarvest = totalYield / vegData.harvestsPerSeason;

  // Generate tips
  const tips = generateTips(vegData, conditions);

  return {
    vegetable: vegData.name,
    plantCount,
    yieldPerPlant: Math.round(adjustedYieldPerPlant * 100) / 100,
    totalYield: Math.round(totalYield * 100) / 100,
    weightUnit: 'lbs',
    yieldPerSqFt: Math.round(yieldPerSqFt * 100) / 100,
    daysToHarvest: vegData.daysToHarvest,
    harvestsPerSeason: vegData.harvestsPerSeason,
    yieldPerHarvest: Math.round(yieldPerHarvest * 100) / 100,
    conditionMultiplier,
    tips,
  };
}

/**
 * Calculates yield for multiple vegetables in a garden plan
 * 
 * @param vegetables - Array of vegetable inputs
 * @returns Array of yield results
 */
export function calculateGardenYield(
  vegetables: VegetableYieldInput[]
): VegetableYieldResult[] {
  return vegetables.map(v => calculateVegetableYield(v));
}

/**
 * Estimates total garden yield summary
 */
export function summarizeGardenYield(results: VegetableYieldResult[]): {
  totalYieldLbs: number;
  totalPlants: number;
  averageYieldPerSqFt: number;
  vegetables: string[];
} {
  const totalYieldLbs = results.reduce((sum, r) => sum + r.totalYield, 0);
  const totalPlants = results.reduce((sum, r) => sum + r.plantCount, 0);
  const avgYieldPerSqFt = results.length > 0
    ? results.reduce((sum, r) => sum + r.yieldPerSqFt, 0) / results.length
    : 0;

  return {
    totalYieldLbs: Math.round(totalYieldLbs * 100) / 100,
    totalPlants,
    averageYieldPerSqFt: Math.round(avgYieldPerSqFt * 100) / 100,
    vegetables: results.map(r => r.vegetable),
  };
}
