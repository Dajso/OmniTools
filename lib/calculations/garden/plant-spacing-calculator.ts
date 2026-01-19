/**
 * Plant Spacing Calculator
 * 
 * Calculates optimal plant spacing and total plants that fit in a garden area.
 * 
 * @module lib/calculations/garden/plant-spacing-calculator
 * @see Requirements 25.2, 25.12
 */

/**
 * Error class for plant spacing calculation errors
 */
export class PlantSpacingCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'PlantSpacingCalculationError';
  }
}

/**
 * Planting pattern types
 */
export type PlantingPattern = 'square' | 'triangular' | 'row';

/**
 * Unit types for measurements
 */
export type SpacingUnit = 'inches' | 'feet' | 'cm' | 'meters';

/**
 * Input parameters for plant spacing calculation
 */
export interface PlantSpacingInput {
  /** Garden bed length */
  gardenLength: number;
  /** Garden bed width */
  gardenWidth: number;
  /** Spacing between plants */
  plantSpacing: number;
  /** Unit for all measurements */
  unit: SpacingUnit;
  /** Planting pattern (default: square) */
  pattern?: PlantingPattern;
  /** Edge buffer/margin from garden edges (default: half of plant spacing) */
  edgeBuffer?: number;
  /** Row spacing for row pattern (default: same as plant spacing) */
  rowSpacing?: number;
}

/**
 * Results from plant spacing calculation
 */
export interface PlantSpacingResult {
  /** Total number of plants that fit */
  totalPlants: number;
  /** Number of rows */
  rows: number;
  /** Plants per row */
  plantsPerRow: number;
  /** Actual spacing used between plants */
  actualSpacing: number;
  /** Actual row spacing used */
  actualRowSpacing: number;
  /** Garden area in square units */
  gardenArea: number;
  /** Area per plant in square units */
  areaPerPlant: number;
  /** Planting density (plants per square foot/meter) */
  plantingDensity: number;
  /** Unit used for calculations */
  unit: SpacingUnit;
}

/**
 * Common plant spacing recommendations (in inches)
 */
export const PLANT_SPACING_GUIDE: Record<string, { spacing: number; rowSpacing: number }> = {
  'tomatoes': { spacing: 24, rowSpacing: 36 },
  'peppers': { spacing: 18, rowSpacing: 24 },
  'lettuce': { spacing: 6, rowSpacing: 12 },
  'carrots': { spacing: 2, rowSpacing: 12 },
  'beans': { spacing: 4, rowSpacing: 24 },
  'corn': { spacing: 12, rowSpacing: 30 },
  'cucumbers': { spacing: 12, rowSpacing: 48 },
  'squash': { spacing: 24, rowSpacing: 60 },
  'onions': { spacing: 4, rowSpacing: 12 },
  'potatoes': { spacing: 12, rowSpacing: 30 },
  'broccoli': { spacing: 18, rowSpacing: 24 },
  'cabbage': { spacing: 18, rowSpacing: 24 },
  'spinach': { spacing: 4, rowSpacing: 12 },
  'radishes': { spacing: 2, rowSpacing: 6 },
  'herbs': { spacing: 12, rowSpacing: 12 },
};

/**
 * Converts spacing to feet for density calculations
 */
export function convertToFeet(value: number, unit: SpacingUnit): number {
  switch (unit) {
    case 'inches':
      return value / 12;
    case 'feet':
      return value;
    case 'cm':
      return value / 30.48;
    case 'meters':
      return value * 3.28084;
    default:
      return value;
  }
}

/**
 * Calculates plants for square grid pattern
 * Plants are arranged in a regular grid
 */
export function calculateSquarePattern(
  length: number,
  width: number,
  spacing: number,
  edgeBuffer: number
): { rows: number; plantsPerRow: number } {
  // Usable dimensions after edge buffer
  const usableLength = length - (2 * edgeBuffer);
  const usableWidth = width - (2 * edgeBuffer);

  if (usableLength <= 0 || usableWidth <= 0) {
    return { rows: 0, plantsPerRow: 0 };
  }

  // Calculate plants that fit
  const plantsPerRow = Math.floor(usableLength / spacing) + 1;
  const rows = Math.floor(usableWidth / spacing) + 1;

  return { rows, plantsPerRow };
}

/**
 * Calculates plants for triangular/offset pattern
 * Rows are offset by half the spacing for more efficient use of space
 * This pattern allows ~15% more plants than square pattern
 */
export function calculateTriangularPattern(
  length: number,
  width: number,
  spacing: number,
  edgeBuffer: number
): { rows: number; plantsPerRow: number; totalPlants: number } {
  const usableLength = length - (2 * edgeBuffer);
  const usableWidth = width - (2 * edgeBuffer);

  if (usableLength <= 0 || usableWidth <= 0) {
    return { rows: 0, plantsPerRow: 0, totalPlants: 0 };
  }

  // Row spacing for triangular pattern is spacing * sin(60°) ≈ spacing * 0.866
  const rowSpacing = spacing * Math.sin(Math.PI / 3);
  
  const rows = Math.floor(usableWidth / rowSpacing) + 1;
  const plantsPerRow = Math.floor(usableLength / spacing) + 1;
  
  // Offset rows have one less plant if they don't fit
  let totalPlants = 0;
  for (let row = 0; row < rows; row++) {
    if (row % 2 === 0) {
      totalPlants += plantsPerRow;
    } else {
      // Offset row - check if offset plants fit
      const offsetPlantsPerRow = Math.floor((usableLength - spacing / 2) / spacing) + 1;
      totalPlants += Math.max(0, offsetPlantsPerRow);
    }
  }

  return { rows, plantsPerRow, totalPlants };
}

/**
 * Calculates plants for row pattern
 * Traditional row planting with different row and plant spacing
 */
export function calculateRowPattern(
  length: number,
  width: number,
  plantSpacing: number,
  rowSpacing: number,
  edgeBuffer: number
): { rows: number; plantsPerRow: number } {
  const usableLength = length - (2 * edgeBuffer);
  const usableWidth = width - (2 * edgeBuffer);

  if (usableLength <= 0 || usableWidth <= 0) {
    return { rows: 0, plantsPerRow: 0 };
  }

  const rows = Math.floor(usableWidth / rowSpacing) + 1;
  const plantsPerRow = Math.floor(usableLength / plantSpacing) + 1;

  return { rows, plantsPerRow };
}

/**
 * Calculates plant spacing and total plants for a garden area
 * 
 * @param input - Garden dimensions and spacing parameters
 * @returns Plant spacing calculation results
 * 
 * @example
 * ```ts
 * const result = calculatePlantSpacing({
 *   gardenLength: 10,
 *   gardenWidth: 4,
 *   plantSpacing: 12,
 *   unit: 'feet',
 *   pattern: 'square',
 * });
 * console.log(result.totalPlants); // Total plants that fit
 * ```
 */
export function calculatePlantSpacing(input: PlantSpacingInput): PlantSpacingResult {
  const {
    gardenLength,
    gardenWidth,
    plantSpacing,
    unit,
    pattern = 'square',
    edgeBuffer = plantSpacing / 2,
    rowSpacing = plantSpacing,
  } = input;

  // Validate inputs
  if (gardenLength <= 0) {
    throw new PlantSpacingCalculationError(
      'Garden length must be positive',
      'invalid_input',
      'gardenLength'
    );
  }
  if (gardenWidth <= 0) {
    throw new PlantSpacingCalculationError(
      'Garden width must be positive',
      'invalid_input',
      'gardenWidth'
    );
  }
  if (plantSpacing <= 0) {
    throw new PlantSpacingCalculationError(
      'Plant spacing must be positive',
      'invalid_input',
      'plantSpacing'
    );
  }
  if (edgeBuffer < 0) {
    throw new PlantSpacingCalculationError(
      'Edge buffer cannot be negative',
      'invalid_input',
      'edgeBuffer'
    );
  }

  let rows: number;
  let plantsPerRow: number;
  let totalPlants: number;
  let actualRowSpacing = rowSpacing;

  switch (pattern) {
    case 'square': {
      const result = calculateSquarePattern(gardenLength, gardenWidth, plantSpacing, edgeBuffer);
      rows = result.rows;
      plantsPerRow = result.plantsPerRow;
      totalPlants = rows * plantsPerRow;
      actualRowSpacing = plantSpacing;
      break;
    }
    case 'triangular': {
      const result = calculateTriangularPattern(gardenLength, gardenWidth, plantSpacing, edgeBuffer);
      rows = result.rows;
      plantsPerRow = result.plantsPerRow;
      totalPlants = result.totalPlants;
      actualRowSpacing = plantSpacing * Math.sin(Math.PI / 3);
      break;
    }
    case 'row': {
      const result = calculateRowPattern(gardenLength, gardenWidth, plantSpacing, rowSpacing, edgeBuffer);
      rows = result.rows;
      plantsPerRow = result.plantsPerRow;
      totalPlants = rows * plantsPerRow;
      actualRowSpacing = rowSpacing;
      break;
    }
    default:
      throw new PlantSpacingCalculationError(
        'Invalid planting pattern',
        'invalid_input',
        'pattern'
      );
  }

  // Calculate area metrics
  const gardenArea = gardenLength * gardenWidth;
  const areaPerPlant = totalPlants > 0 ? gardenArea / totalPlants : 0;

  // Calculate planting density (plants per square foot)
  const lengthInFeet = convertToFeet(gardenLength, unit);
  const widthInFeet = convertToFeet(gardenWidth, unit);
  const areaInSqFeet = lengthInFeet * widthInFeet;
  const plantingDensity = areaInSqFeet > 0 ? totalPlants / areaInSqFeet : 0;

  return {
    totalPlants,
    rows,
    plantsPerRow,
    actualSpacing: Math.round(plantSpacing * 100) / 100,
    actualRowSpacing: Math.round(actualRowSpacing * 100) / 100,
    gardenArea: Math.round(gardenArea * 100) / 100,
    areaPerPlant: Math.round(areaPerPlant * 100) / 100,
    plantingDensity: Math.round(plantingDensity * 100) / 100,
    unit,
  };
}

/**
 * Gets recommended spacing for a plant type
 * 
 * @param plantType - Type of plant
 * @returns Recommended spacing in inches, or undefined if not found
 */
export function getRecommendedSpacing(
  plantType: string
): { spacing: number; rowSpacing: number } | undefined {
  const normalizedType = plantType.toLowerCase().trim();
  return PLANT_SPACING_GUIDE[normalizedType];
}
