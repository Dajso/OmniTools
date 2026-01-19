/**
 * Concrete Slab Calculator
 * 
 * Calculates concrete volume, bags needed, and rebar estimation for slab projects.
 * 
 * Key formulas:
 * - Volume (cubic feet) = Length × Width × Thickness (all in feet)
 * - Volume (cubic yards) = Volume (cubic feet) / 27
 * - Bags needed = Volume (cubic feet) / coverage per bag
 * - Rebar pieces = (Length / spacing + 1) + (Width / spacing + 1)
 * 
 * Common concrete bag sizes:
 * - 60 lb bag: covers approximately 0.45 cubic feet
 * - 80 lb bag: covers approximately 0.60 cubic feet
 * 
 * @module lib/calculations/construction/concrete-slab-calculator
 * @see Requirements 32.4
 */

/**
 * Error class for Concrete Slab calculation errors
 */
export class ConcreteSlabError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'ConcreteSlabError';
  }
}

/**
 * Unit of measurement for dimensions
 */
export type DimensionUnit = 'feet' | 'inches' | 'meters';

/**
 * Concrete bag size options
 */
export type BagSize = '60lb' | '80lb';

/**
 * Coverage per bag in cubic feet
 */
export const BAG_COVERAGE: Record<BagSize, number> = {
  '60lb': 0.45,
  '80lb': 0.60,
};

/**
 * Input for concrete slab calculation
 */
export interface ConcreteSlabInput {
  /**
   * Length of the slab
   */
  length: number;

  /**
   * Width of the slab
   */
  width: number;

  /**
   * Thickness of the slab
   */
  thickness: number;

  /**
   * Unit for length and width (default: 'feet')
   */
  dimensionUnit?: DimensionUnit;

  /**
   * Unit for thickness (default: 'inches')
   * Thickness is commonly specified in inches even when other dimensions are in feet
   */
  thicknessUnit?: DimensionUnit;

  /**
   * Rebar spacing in inches (optional, for rebar estimation)
   * Common values: 12, 16, 18, 24 inches
   */
  rebarSpacing?: number;

  /**
   * Waste percentage to add (default: 10)
   * Accounts for spillage, uneven ground, etc.
   */
  wastePercentage?: number;
}

/**
 * Rebar estimation result
 */
export interface RebarEstimation {
  /**
   * Number of rebar pieces running lengthwise
   */
  lengthwisePieces: number;

  /**
   * Number of rebar pieces running widthwise
   */
  widthwisePieces: number;

  /**
   * Total number of rebar pieces needed
   */
  totalPieces: number;

  /**
   * Total linear feet of rebar needed (lengthwise)
   */
  lengthwiseLinearFeet: number;

  /**
   * Total linear feet of rebar needed (widthwise)
   */
  widthwiseLinearFeet: number;

  /**
   * Total linear feet of rebar needed
   */
  totalLinearFeet: number;

  /**
   * Rebar spacing used
   */
  spacing: number;

  /**
   * Formatted spacing string
   */
  formattedSpacing: string;
}

/**
 * Bags needed estimation
 */
export interface BagsNeeded {
  /**
   * Number of 60lb bags needed
   */
  bags60lb: number;

  /**
   * Number of 80lb bags needed
   */
  bags80lb: number;

  /**
   * Coverage per 60lb bag in cubic feet
   */
  coverage60lb: number;

  /**
   * Coverage per 80lb bag in cubic feet
   */
  coverage80lb: number;
}

/**
 * Result of concrete slab calculation
 */
export interface ConcreteSlabResult {
  /**
   * Volume in cubic feet
   */
  volumeCubicFeet: number;

  /**
   * Volume in cubic yards
   */
  volumeCubicYards: number;

  /**
   * Volume in cubic meters (for metric users)
   */
  volumeCubicMeters: number;

  /**
   * Volume with waste percentage added (cubic feet)
   */
  volumeWithWasteCubicFeet: number;

  /**
   * Volume with waste percentage added (cubic yards)
   */
  volumeWithWasteCubicYards: number;

  /**
   * Bags needed estimation
   */
  bagsNeeded: BagsNeeded;

  /**
   * Rebar estimation (if rebarSpacing was provided)
   */
  rebarEstimation?: RebarEstimation;

  /**
   * Formatted volume in cubic feet
   */
  formattedVolumeCubicFeet: string;

  /**
   * Formatted volume in cubic yards
   */
  formattedVolumeCubicYards: string;

  /**
   * Formatted volume with waste in cubic yards
   */
  formattedVolumeWithWaste: string;

  /**
   * Input dimensions used in calculation (converted to feet)
   */
  dimensions: {
    length: number;
    width: number;
    thickness: number;
    lengthUnit: DimensionUnit;
    widthUnit: DimensionUnit;
    thicknessUnit: DimensionUnit;
  };

  /**
   * Waste percentage applied
   */
  wastePercentage: number;

  /**
   * Slab area in square feet
   */
  areaSqFeet: number;

  /**
   * Formatted area string
   */
  formattedArea: string;
}

/**
 * Common slab thickness presets in inches
 */
export const SLAB_THICKNESS_PRESETS = {
  /** Sidewalk/patio (4 inches) */
  sidewalk: 4,
  /** Driveway (4-6 inches, using 5) */
  driveway: 5,
  /** Garage floor (4-6 inches, using 4) */
  garage: 4,
  /** Heavy duty/industrial (6 inches) */
  heavyDuty: 6,
  /** Foundation (8 inches) */
  foundation: 8,
} as const;

/**
 * Common rebar spacing presets in inches
 */
export const REBAR_SPACING_PRESETS = {
  /** 12 inches on center (heavy duty) */
  heavy: 12,
  /** 16 inches on center (standard) */
  standard: 16,
  /** 18 inches on center (medium) */
  medium: 18,
  /** 24 inches on center (light duty) */
  light: 24,
} as const;

/**
 * Convert dimension to feet
 */
function convertToFeet(value: number, fromUnit: DimensionUnit): number {
  switch (fromUnit) {
    case 'inches':
      return value / 12;
    case 'meters':
      return value * 3.28084;
    case 'feet':
    default:
      return value;
  }
}

/**
 * Validate concrete slab input parameters
 * @param input - The input to validate
 * @throws ConcreteSlabError if input is invalid
 */
function validateInput(input: ConcreteSlabInput): void {
  // Validate length
  if (input.length === undefined || input.length === null) {
    throw new ConcreteSlabError(
      'Length is required',
      'invalid_input',
      'length'
    );
  }

  if (isNaN(input.length)) {
    throw new ConcreteSlabError(
      'Length must be a valid number',
      'invalid_input',
      'length'
    );
  }

  if (input.length <= 0) {
    throw new ConcreteSlabError(
      'Length must be greater than 0',
      'out_of_range',
      'length'
    );
  }

  // Validate width
  if (input.width === undefined || input.width === null) {
    throw new ConcreteSlabError(
      'Width is required',
      'invalid_input',
      'width'
    );
  }

  if (isNaN(input.width)) {
    throw new ConcreteSlabError(
      'Width must be a valid number',
      'invalid_input',
      'width'
    );
  }

  if (input.width <= 0) {
    throw new ConcreteSlabError(
      'Width must be greater than 0',
      'out_of_range',
      'width'
    );
  }

  // Validate thickness
  if (input.thickness === undefined || input.thickness === null) {
    throw new ConcreteSlabError(
      'Thickness is required',
      'invalid_input',
      'thickness'
    );
  }

  if (isNaN(input.thickness)) {
    throw new ConcreteSlabError(
      'Thickness must be a valid number',
      'invalid_input',
      'thickness'
    );
  }

  if (input.thickness <= 0) {
    throw new ConcreteSlabError(
      'Thickness must be greater than 0',
      'out_of_range',
      'thickness'
    );
  }

  // Validate rebar spacing if provided
  if (input.rebarSpacing !== undefined) {
    if (isNaN(input.rebarSpacing)) {
      throw new ConcreteSlabError(
        'Rebar spacing must be a valid number',
        'invalid_input',
        'rebarSpacing'
      );
    }

    if (input.rebarSpacing <= 0) {
      throw new ConcreteSlabError(
        'Rebar spacing must be greater than 0',
        'out_of_range',
        'rebarSpacing'
      );
    }
  }

  // Validate waste percentage if provided
  if (input.wastePercentage !== undefined) {
    if (isNaN(input.wastePercentage)) {
      throw new ConcreteSlabError(
        'Waste percentage must be a valid number',
        'invalid_input',
        'wastePercentage'
      );
    }

    if (input.wastePercentage < 0 || input.wastePercentage > 100) {
      throw new ConcreteSlabError(
        'Waste percentage must be between 0 and 100',
        'out_of_range',
        'wastePercentage'
      );
    }
  }
}

/**
 * Format a number with specified decimal places
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Calculate rebar estimation based on slab dimensions and spacing
 * 
 * Rebar is typically laid in a grid pattern. The formula calculates:
 * - Lengthwise pieces: floor(width / spacing) + 1
 * - Widthwise pieces: floor(length / spacing) + 1
 * 
 * @param lengthFeet - Slab length in feet
 * @param widthFeet - Slab width in feet
 * @param spacingInches - Rebar spacing in inches
 * @returns Rebar estimation
 */
export function calculateRebarEstimation(
  lengthFeet: number,
  widthFeet: number,
  spacingInches: number
): RebarEstimation {
  // Convert spacing to feet for calculation
  const spacingFeet = spacingInches / 12;

  // Calculate number of rebar pieces
  // Lengthwise pieces run along the length, spaced across the width
  const lengthwisePieces = Math.floor(widthFeet / spacingFeet) + 1;
  
  // Widthwise pieces run along the width, spaced across the length
  const widthwisePieces = Math.floor(lengthFeet / spacingFeet) + 1;

  const totalPieces = lengthwisePieces + widthwisePieces;

  // Calculate linear feet of rebar
  const lengthwiseLinearFeet = lengthwisePieces * lengthFeet;
  const widthwiseLinearFeet = widthwisePieces * widthFeet;
  const totalLinearFeet = lengthwiseLinearFeet + widthwiseLinearFeet;

  return {
    lengthwisePieces,
    widthwisePieces,
    totalPieces,
    lengthwiseLinearFeet,
    widthwiseLinearFeet,
    totalLinearFeet,
    spacing: spacingInches,
    formattedSpacing: `${spacingInches}" on center`,
  };
}

/**
 * Calculate number of concrete bags needed
 * 
 * @param volumeCubicFeet - Volume in cubic feet
 * @returns Bags needed for both 60lb and 80lb options
 */
export function calculateBagsNeeded(volumeCubicFeet: number): BagsNeeded {
  const bags60lb = Math.ceil(volumeCubicFeet / BAG_COVERAGE['60lb']);
  const bags80lb = Math.ceil(volumeCubicFeet / BAG_COVERAGE['80lb']);

  return {
    bags60lb,
    bags80lb,
    coverage60lb: BAG_COVERAGE['60lb'],
    coverage80lb: BAG_COVERAGE['80lb'],
  };
}

/**
 * Calculate concrete slab volume, bags needed, and rebar estimation
 * 
 * @param input - Concrete slab calculation input parameters
 * @returns Calculated volume, bags, and rebar estimation
 * @throws ConcreteSlabError if input is invalid
 * 
 * @example
 * // Calculate concrete for a 10' x 12' slab, 4" thick with 16" rebar spacing
 * const result = calculateConcreteSlab({
 *   length: 10,
 *   width: 12,
 *   thickness: 4,
 *   dimensionUnit: 'feet',
 *   thicknessUnit: 'inches',
 *   rebarSpacing: 16,
 *   wastePercentage: 10
 * });
 * // result.volumeCubicYards ≈ 1.48
 * // result.bagsNeeded.bags80lb ≈ 67
 * // result.rebarEstimation.totalPieces = 17
 */
export function calculateConcreteSlab(input: ConcreteSlabInput): ConcreteSlabResult {
  validateInput(input);

  const {
    length,
    width,
    thickness,
    dimensionUnit = 'feet',
    thicknessUnit = 'inches',
    rebarSpacing,
    wastePercentage = 10,
  } = input;

  // Convert all dimensions to feet
  const lengthFeet = convertToFeet(length, dimensionUnit);
  const widthFeet = convertToFeet(width, dimensionUnit);
  const thicknessFeet = convertToFeet(thickness, thicknessUnit);

  // Calculate volume
  const volumeCubicFeet = lengthFeet * widthFeet * thicknessFeet;
  const volumeCubicYards = volumeCubicFeet / 27;
  const volumeCubicMeters = volumeCubicFeet * 0.0283168;

  // Calculate volume with waste
  const wasteMultiplier = 1 + (wastePercentage / 100);
  const volumeWithWasteCubicFeet = volumeCubicFeet * wasteMultiplier;
  const volumeWithWasteCubicYards = volumeWithWasteCubicFeet / 27;

  // Calculate bags needed (based on volume with waste)
  const bagsNeeded = calculateBagsNeeded(volumeWithWasteCubicFeet);

  // Calculate area
  const areaSqFeet = lengthFeet * widthFeet;

  // Build result
  const result: ConcreteSlabResult = {
    volumeCubicFeet,
    volumeCubicYards,
    volumeCubicMeters,
    volumeWithWasteCubicFeet,
    volumeWithWasteCubicYards,
    bagsNeeded,
    formattedVolumeCubicFeet: `${formatNumber(volumeCubicFeet)} cu ft`,
    formattedVolumeCubicYards: `${formatNumber(volumeCubicYards)} cu yd`,
    formattedVolumeWithWaste: `${formatNumber(volumeWithWasteCubicYards)} cu yd (with ${wastePercentage}% waste)`,
    dimensions: {
      length: lengthFeet,
      width: widthFeet,
      thickness: thicknessFeet,
      lengthUnit: dimensionUnit,
      widthUnit: dimensionUnit,
      thicknessUnit,
    },
    wastePercentage,
    areaSqFeet,
    formattedArea: `${formatNumber(areaSqFeet)} sq ft`,
  };

  // Add rebar estimation if spacing was provided
  if (rebarSpacing !== undefined) {
    result.rebarEstimation = calculateRebarEstimation(lengthFeet, widthFeet, rebarSpacing);
  }

  return result;
}

/**
 * Get a quick reference table for common slab sizes
 * 
 * @param thickness - Slab thickness in inches (default: 4)
 * @param rebarSpacing - Rebar spacing in inches (optional)
 * @returns Array of pre-calculated results for common slab sizes
 */
export function getConcreteSlabQuickReferenceTable(
  thickness: number = 4,
  rebarSpacing?: number
): Array<{
  size: string;
  length: number;
  width: number;
  volumeCubicYards: number;
  bags60lb: number;
  bags80lb: number;
  rebarPieces?: number;
}> {
  const commonSizes = [
    { length: 8, width: 10, label: '8\' × 10\'' },
    { length: 10, width: 10, label: '10\' × 10\'' },
    { length: 10, width: 12, label: '10\' × 12\'' },
    { length: 12, width: 12, label: '12\' × 12\'' },
    { length: 12, width: 16, label: '12\' × 16\'' },
    { length: 16, width: 16, label: '16\' × 16\'' },
    { length: 16, width: 20, label: '16\' × 20\'' },
    { length: 20, width: 20, label: '20\' × 20\'' },
    { length: 20, width: 24, label: '20\' × 24\'' },
    { length: 24, width: 24, label: '24\' × 24\'' },
  ];

  return commonSizes.map(({ length, width, label }) => {
    const result = calculateConcreteSlab({
      length,
      width,
      thickness,
      dimensionUnit: 'feet',
      thicknessUnit: 'inches',
      rebarSpacing,
      wastePercentage: 10,
    });

    return {
      size: label,
      length,
      width,
      volumeCubicYards: Math.round(result.volumeWithWasteCubicYards * 100) / 100,
      bags60lb: result.bagsNeeded.bags60lb,
      bags80lb: result.bagsNeeded.bags80lb,
      rebarPieces: result.rebarEstimation?.totalPieces,
    };
  });
}

/**
 * Estimate ready-mix concrete trucks needed
 * 
 * Standard concrete trucks hold approximately 10 cubic yards.
 * 
 * @param volumeCubicYards - Volume in cubic yards
 * @returns Number of trucks needed and any partial load
 */
export function estimateConcreteTrucks(volumeCubicYards: number): {
  fullTrucks: number;
  partialLoad: number;
  totalTrucks: number;
  recommendation: string;
} {
  const TRUCK_CAPACITY = 10; // cubic yards

  const fullTrucks = Math.floor(volumeCubicYards / TRUCK_CAPACITY);
  const partialLoad = volumeCubicYards % TRUCK_CAPACITY;
  const totalTrucks = Math.ceil(volumeCubicYards / TRUCK_CAPACITY);

  let recommendation: string;
  if (volumeCubicYards < 1) {
    recommendation = 'For small projects under 1 cubic yard, consider using bagged concrete mix.';
  } else if (volumeCubicYards < 3) {
    recommendation = 'For projects under 3 cubic yards, bagged concrete or a small mixer rental may be more economical.';
  } else if (partialLoad > 0 && partialLoad < 3) {
    recommendation = `Consider ordering ${fullTrucks > 0 ? fullTrucks + ' full truck(s) plus ' : ''}a short load of ${formatNumber(partialLoad)} cubic yards, or round up to avoid shortages.`;
  } else {
    recommendation = `Order ${totalTrucks} truck(s) of ready-mix concrete (${formatNumber(volumeCubicYards)} cubic yards total).`;
  }

  return {
    fullTrucks,
    partialLoad,
    totalTrucks,
    recommendation,
  };
}
