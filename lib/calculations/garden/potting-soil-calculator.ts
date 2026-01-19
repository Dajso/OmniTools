/**
 * Potting Soil Volume Calculator
 * 
 * Calculates the volume of potting soil needed for cylindrical containers
 * using the cylinder volume formula (πr²h).
 * 
 * @module lib/calculations/garden/potting-soil-calculator
 * @see Requirements 25.4, 25.11
 */

/**
 * Error class for potting soil calculation errors
 */
export class PottingSoilCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'PottingSoilCalculationError';
  }
}

/**
 * Container shape types
 */
export type ContainerShape = 'cylinder' | 'rectangular' | 'tapered';

/**
 * Unit types for measurements
 */
export type LengthUnit = 'inches' | 'cm' | 'feet' | 'meters';
export type VolumeUnit = 'cubic_inches' | 'cubic_feet' | 'gallons' | 'liters' | 'quarts';

/**
 * Input parameters for potting soil calculation
 */
export interface PottingSoilInput {
  /** Container shape */
  shape: ContainerShape;
  /** Diameter of container (for cylinder/tapered) in specified unit */
  diameter?: number;
  /** Top diameter for tapered containers */
  topDiameter?: number;
  /** Bottom diameter for tapered containers */
  bottomDiameter?: number;
  /** Length for rectangular containers */
  length?: number;
  /** Width for rectangular containers */
  width?: number;
  /** Height/depth of container */
  height: number;
  /** Unit for length measurements */
  lengthUnit: LengthUnit;
  /** Fill percentage (0-100, default 100) */
  fillPercentage?: number;
}

/**
 * Results from potting soil calculation
 */
export interface PottingSoilResult {
  /** Volume in cubic inches */
  volumeCubicInches: number;
  /** Volume in cubic feet */
  volumeCubicFeet: number;
  /** Volume in gallons */
  volumeGallons: number;
  /** Volume in liters */
  volumeLiters: number;
  /** Volume in quarts */
  volumeQuarts: number;
  /** Number of standard bags needed (various sizes) */
  bagsNeeded: {
    /** 8-quart bags */
    small8qt: number;
    /** 16-quart bags */
    medium16qt: number;
    /** 1 cubic foot bags */
    large1cuft: number;
    /** 2 cubic foot bags */
    xlarge2cuft: number;
  };
}

// Conversion constants
const CUBIC_INCHES_PER_GALLON = 231;
const CUBIC_INCHES_PER_LITER = 61.024;
const CUBIC_INCHES_PER_QUART = 57.75;
const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;
const QUARTS_PER_CUBIC_FOOT = 29.922;

/**
 * Converts length to inches based on unit
 */
export function convertToInches(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'inches':
      return value;
    case 'cm':
      return value / 2.54;
    case 'feet':
      return value * 12;
    case 'meters':
      return value * 39.3701;
    default:
      return value;
  }
}

/**
 * Calculates cylinder volume using πr²h formula
 * 
 * @param diameter - Diameter in inches
 * @param height - Height in inches
 * @returns Volume in cubic inches
 */
export function calculateCylinderVolume(diameter: number, height: number): number {
  if (diameter <= 0) {
    throw new PottingSoilCalculationError(
      'Diameter must be positive',
      'invalid_input',
      'diameter'
    );
  }
  if (height <= 0) {
    throw new PottingSoilCalculationError(
      'Height must be positive',
      'invalid_input',
      'height'
    );
  }
  
  const radius = diameter / 2;
  return Math.PI * radius * radius * height;
}

/**
 * Calculates rectangular container volume
 * 
 * @param length - Length in inches
 * @param width - Width in inches
 * @param height - Height in inches
 * @returns Volume in cubic inches
 */
export function calculateRectangularVolume(
  length: number,
  width: number,
  height: number
): number {
  if (length <= 0) {
    throw new PottingSoilCalculationError(
      'Length must be positive',
      'invalid_input',
      'length'
    );
  }
  if (width <= 0) {
    throw new PottingSoilCalculationError(
      'Width must be positive',
      'invalid_input',
      'width'
    );
  }
  if (height <= 0) {
    throw new PottingSoilCalculationError(
      'Height must be positive',
      'invalid_input',
      'height'
    );
  }
  
  return length * width * height;
}

/**
 * Calculates tapered (frustum) container volume
 * Formula: V = (πh/3)(r₁² + r₁r₂ + r₂²)
 * 
 * @param topDiameter - Top diameter in inches
 * @param bottomDiameter - Bottom diameter in inches
 * @param height - Height in inches
 * @returns Volume in cubic inches
 */
export function calculateTaperedVolume(
  topDiameter: number,
  bottomDiameter: number,
  height: number
): number {
  if (topDiameter <= 0) {
    throw new PottingSoilCalculationError(
      'Top diameter must be positive',
      'invalid_input',
      'topDiameter'
    );
  }
  if (bottomDiameter <= 0) {
    throw new PottingSoilCalculationError(
      'Bottom diameter must be positive',
      'invalid_input',
      'bottomDiameter'
    );
  }
  if (height <= 0) {
    throw new PottingSoilCalculationError(
      'Height must be positive',
      'invalid_input',
      'height'
    );
  }
  
  const r1 = topDiameter / 2;
  const r2 = bottomDiameter / 2;
  
  return (Math.PI * height / 3) * (r1 * r1 + r1 * r2 + r2 * r2);
}

/**
 * Converts cubic inches to various volume units
 */
export function convertVolume(cubicInches: number): {
  cubicFeet: number;
  gallons: number;
  liters: number;
  quarts: number;
} {
  return {
    cubicFeet: cubicInches / CUBIC_INCHES_PER_CUBIC_FOOT,
    gallons: cubicInches / CUBIC_INCHES_PER_GALLON,
    liters: cubicInches / CUBIC_INCHES_PER_LITER,
    quarts: cubicInches / CUBIC_INCHES_PER_QUART,
  };
}

/**
 * Calculates number of soil bags needed
 */
export function calculateBagsNeeded(quarts: number): PottingSoilResult['bagsNeeded'] {
  return {
    small8qt: Math.ceil(quarts / 8),
    medium16qt: Math.ceil(quarts / 16),
    large1cuft: Math.ceil(quarts / QUARTS_PER_CUBIC_FOOT),
    xlarge2cuft: Math.ceil(quarts / (QUARTS_PER_CUBIC_FOOT * 2)),
  };
}

/**
 * Calculates potting soil volume for a container
 * 
 * @param input - Container dimensions and options
 * @returns Volume calculations and bag recommendations
 * 
 * @example
 * ```ts
 * const result = calculatePottingSoil({
 *   shape: 'cylinder',
 *   diameter: 12,
 *   height: 10,
 *   lengthUnit: 'inches',
 * });
 * console.log(result.volumeGallons); // ~4.9 gallons
 * ```
 */
export function calculatePottingSoil(input: PottingSoilInput): PottingSoilResult {
  const {
    shape,
    diameter,
    topDiameter,
    bottomDiameter,
    length,
    width,
    height,
    lengthUnit,
    fillPercentage = 100,
  } = input;

  // Validate fill percentage
  if (fillPercentage <= 0 || fillPercentage > 100) {
    throw new PottingSoilCalculationError(
      'Fill percentage must be between 1 and 100',
      'invalid_input',
      'fillPercentage'
    );
  }

  // Convert height to inches
  const heightInches = convertToInches(height, lengthUnit);

  let volumeCubicInches: number;

  switch (shape) {
    case 'cylinder':
      if (!diameter) {
        throw new PottingSoilCalculationError(
          'Diameter is required for cylinder containers',
          'invalid_input',
          'diameter'
        );
      }
      const diameterInches = convertToInches(diameter, lengthUnit);
      volumeCubicInches = calculateCylinderVolume(diameterInches, heightInches);
      break;

    case 'rectangular':
      if (!length || !width) {
        throw new PottingSoilCalculationError(
          'Length and width are required for rectangular containers',
          'invalid_input',
          'length'
        );
      }
      const lengthInches = convertToInches(length, lengthUnit);
      const widthInches = convertToInches(width, lengthUnit);
      volumeCubicInches = calculateRectangularVolume(lengthInches, widthInches, heightInches);
      break;

    case 'tapered':
      if (!topDiameter || !bottomDiameter) {
        throw new PottingSoilCalculationError(
          'Top and bottom diameters are required for tapered containers',
          'invalid_input',
          'topDiameter'
        );
      }
      const topDiameterInches = convertToInches(topDiameter, lengthUnit);
      const bottomDiameterInches = convertToInches(bottomDiameter, lengthUnit);
      volumeCubicInches = calculateTaperedVolume(topDiameterInches, bottomDiameterInches, heightInches);
      break;

    default:
      throw new PottingSoilCalculationError(
        'Invalid container shape',
        'invalid_input',
        'shape'
      );
  }

  // Apply fill percentage
  volumeCubicInches = volumeCubicInches * (fillPercentage / 100);

  // Convert to other units
  const conversions = convertVolume(volumeCubicInches);

  return {
    volumeCubicInches: Math.round(volumeCubicInches * 100) / 100,
    volumeCubicFeet: Math.round(conversions.cubicFeet * 1000) / 1000,
    volumeGallons: Math.round(conversions.gallons * 100) / 100,
    volumeLiters: Math.round(conversions.liters * 100) / 100,
    volumeQuarts: Math.round(conversions.quarts * 100) / 100,
    bagsNeeded: calculateBagsNeeded(conversions.quarts),
  };
}
