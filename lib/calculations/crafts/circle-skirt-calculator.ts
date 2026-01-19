/**
 * Circle Skirt Calculator
 * 
 * Calculates the inner radius and fabric requirements for circle skirts
 * based on waist measurement and skirt length.
 * 
 * @module lib/calculations/crafts/circle-skirt-calculator
 * @see Requirements 24.3, 24.11
 */

/**
 * Error class for circle skirt calculation errors
 */
export class CircleSkirtCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'insufficient_fabric',
    public field?: string
  ) {
    super(message);
    this.name = 'CircleSkirtCalculationError';
  }
}

/**
 * Circle skirt types
 */
export type SkirtType = 'full' | 'half' | 'quarter' | 'three-quarter';

/**
 * Input parameters for circle skirt calculation
 */
export interface CircleSkirtInput {
  /** Waist measurement in inches */
  waistMeasurement: number;
  /** Desired skirt length in inches */
  skirtLength: number;
  /** Type of circle skirt */
  skirtType: SkirtType;
  /** Seam allowance in inches (default: 0.5) */
  seamAllowance?: number;
  /** Hem allowance in inches (default: 1) */
  hemAllowance?: number;
}

/**
 * Results from circle skirt calculation
 */
export interface CircleSkirtResult {
  /** Inner radius (waist) in inches */
  innerRadius: number;
  /** Outer radius (hem) in inches */
  outerRadius: number;
  /** Minimum fabric width needed in inches */
  fabricWidthNeeded: number;
  /** Minimum fabric length needed in inches */
  fabricLengthNeeded: number;
  /** Total fabric in yards (assuming 45" wide fabric) */
  fabricYards45: number;
  /** Total fabric in yards (assuming 60" wide fabric) */
  fabricYards60: number;
  /** Waist circumference in inches */
  waistCircumference: number;
  /** Hem circumference in inches */
  hemCircumference: number;
  /** Number of panels needed */
  numberOfPanels: number;
}

/**
 * Multipliers for different skirt types
 * Full circle = 1, Half = 2, Quarter = 4, Three-quarter = 4/3
 */
export const SKIRT_TYPE_MULTIPLIERS: Record<SkirtType, number> = {
  'full': 1,
  'half': 2,
  'quarter': 4,
  'three-quarter': 4 / 3,
};

/**
 * Number of panels for each skirt type
 */
export const SKIRT_TYPE_PANELS: Record<SkirtType, number> = {
  'full': 1,
  'half': 2,
  'quarter': 4,
  'three-quarter': 2,
};

/**
 * Calculates the inner radius from waist circumference
 * 
 * Formula: radius = circumference / (2 * π)
 * For partial circles, we multiply by the skirt type multiplier
 * 
 * @param waistMeasurement - Waist measurement in inches
 * @param skirtType - Type of circle skirt
 * @returns Inner radius in inches
 */
export function calculateInnerRadius(
  waistMeasurement: number,
  skirtType: SkirtType
): number {
  if (waistMeasurement <= 0) {
    throw new CircleSkirtCalculationError(
      'Waist measurement must be positive',
      'invalid_input',
      'waistMeasurement'
    );
  }

  const multiplier = SKIRT_TYPE_MULTIPLIERS[skirtType];
  // For a full circle: circumference = 2πr, so r = circumference / (2π)
  // For partial circles, we need more radius to get the same waist opening
  return (waistMeasurement * multiplier) / (2 * Math.PI);
}

/**
 * Calculates the outer radius (hem radius)
 * 
 * @param innerRadius - Inner radius in inches
 * @param skirtLength - Desired skirt length in inches
 * @param hemAllowance - Hem allowance in inches
 * @returns Outer radius in inches
 */
export function calculateOuterRadius(
  innerRadius: number,
  skirtLength: number,
  hemAllowance: number = 1
): number {
  if (skirtLength <= 0) {
    throw new CircleSkirtCalculationError(
      'Skirt length must be positive',
      'invalid_input',
      'skirtLength'
    );
  }

  return innerRadius + skirtLength + hemAllowance;
}

/**
 * Calculates circumference from radius
 * 
 * Formula: circumference = 2 * π * radius
 * 
 * @param radius - Radius in inches
 * @returns Circumference in inches
 */
export function calculateCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

/**
 * Calculates radius from circumference
 * 
 * Formula: radius = circumference / (2 * π)
 * 
 * @param circumference - Circumference in inches
 * @returns Radius in inches
 */
export function calculateRadiusFromCircumference(circumference: number): number {
  if (circumference <= 0) {
    throw new CircleSkirtCalculationError(
      'Circumference must be positive',
      'invalid_input',
      'circumference'
    );
  }
  return circumference / (2 * Math.PI);
}

/**
 * Calculates complete circle skirt requirements
 * 
 * @param input - Circle skirt calculation inputs
 * @returns Complete circle skirt calculation results
 * 
 * @example
 * ```ts
 * const result = calculateCircleSkirt({
 *   waistMeasurement: 28,
 *   skirtLength: 24,
 *   skirtType: 'full',
 * });
 * console.log(result.innerRadius); // ~4.46 inches
 * console.log(result.fabricYards45); // fabric needed
 * ```
 */
export function calculateCircleSkirt(input: CircleSkirtInput): CircleSkirtResult {
  const {
    waistMeasurement,
    skirtLength,
    skirtType,
    seamAllowance = 0.5,
    hemAllowance = 1,
  } = input;

  // Validate inputs
  if (waistMeasurement <= 0) {
    throw new CircleSkirtCalculationError(
      'Waist measurement must be positive',
      'invalid_input',
      'waistMeasurement'
    );
  }
  if (skirtLength <= 0) {
    throw new CircleSkirtCalculationError(
      'Skirt length must be positive',
      'invalid_input',
      'skirtLength'
    );
  }
  if (seamAllowance < 0) {
    throw new CircleSkirtCalculationError(
      'Seam allowance cannot be negative',
      'invalid_input',
      'seamAllowance'
    );
  }
  if (hemAllowance < 0) {
    throw new CircleSkirtCalculationError(
      'Hem allowance cannot be negative',
      'invalid_input',
      'hemAllowance'
    );
  }

  // Calculate radii
  const innerRadius = calculateInnerRadius(waistMeasurement, skirtType);
  const innerRadiusWithSeam = innerRadius + seamAllowance;
  const outerRadius = calculateOuterRadius(innerRadius, skirtLength, hemAllowance);

  // Calculate circumferences
  const waistCircumference = calculateCircumference(innerRadius);
  const hemCircumference = calculateCircumference(outerRadius - hemAllowance);

  // Calculate fabric requirements
  const numberOfPanels = SKIRT_TYPE_PANELS[skirtType];
  
  // For fabric width, we need diameter (2 * outer radius) for full/half circles
  // For quarter circles, we need the outer radius
  let fabricWidthNeeded: number;
  let fabricLengthNeeded: number;

  if (skirtType === 'full') {
    // Full circle needs diameter x diameter
    fabricWidthNeeded = outerRadius * 2;
    fabricLengthNeeded = outerRadius * 2;
  } else if (skirtType === 'half') {
    // Half circle needs diameter x radius (2 panels)
    fabricWidthNeeded = outerRadius * 2;
    fabricLengthNeeded = outerRadius * 2; // Two half circles
  } else if (skirtType === 'quarter') {
    // Quarter circle needs radius x radius (4 panels)
    fabricWidthNeeded = outerRadius;
    fabricLengthNeeded = outerRadius * 4;
  } else {
    // Three-quarter needs special handling
    fabricWidthNeeded = outerRadius * 2;
    fabricLengthNeeded = outerRadius * 2;
  }

  // Calculate yards needed for standard fabric widths
  const fabricYards45 = Math.ceil(fabricLengthNeeded / 36 * 10) / 10;
  const fabricYards60 = Math.ceil(fabricLengthNeeded / 36 * 10) / 10;

  return {
    innerRadius: Math.round(innerRadius * 100) / 100,
    outerRadius: Math.round(outerRadius * 100) / 100,
    fabricWidthNeeded: Math.round(fabricWidthNeeded * 100) / 100,
    fabricLengthNeeded: Math.round(fabricLengthNeeded * 100) / 100,
    fabricYards45,
    fabricYards60,
    waistCircumference: Math.round(waistCircumference * 100) / 100,
    hemCircumference: Math.round(hemCircumference * 100) / 100,
    numberOfPanels,
  };
}

/**
 * Calculates cylinder volume (for potting soil, etc.)
 * 
 * Formula: volume = π * r² * h
 * 
 * @param radius - Radius in inches
 * @param height - Height in inches
 * @returns Volume in cubic inches
 */
export function calculateCylinderVolume(radius: number, height: number): number {
  if (radius <= 0) {
    throw new CircleSkirtCalculationError(
      'Radius must be positive',
      'invalid_input',
      'radius'
    );
  }
  if (height <= 0) {
    throw new CircleSkirtCalculationError(
      'Height must be positive',
      'invalid_input',
      'height'
    );
  }
  return Math.PI * radius * radius * height;
}

/**
 * Converts cubic inches to gallons
 * 
 * @param cubicInches - Volume in cubic inches
 * @returns Volume in gallons
 */
export function cubicInchesToGallons(cubicInches: number): number {
  return cubicInches / 231; // 231 cubic inches per gallon
}

/**
 * Converts cubic inches to quarts
 * 
 * @param cubicInches - Volume in cubic inches
 * @returns Volume in quarts
 */
export function cubicInchesToQuarts(cubicInches: number): number {
  return cubicInches / 57.75; // 57.75 cubic inches per quart
}
