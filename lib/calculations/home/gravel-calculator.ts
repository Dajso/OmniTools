/**
 * Gravel Calculator
 * 
 * Calculates the amount of gravel needed for landscaping.
 * 
 * @module lib/calculations/home/gravel-calculator
 * @see Requirements 7.9
 */

export interface GravelInputs {
  /** Area length in feet */
  length: number;
  /** Area width in feet */
  width: number;
  /** Depth in inches */
  depth: number;
  /** Gravel density in lbs per cubic foot (default ~100) */
  density: number;
}

export interface GravelResults {
  /** Area in square feet */
  areaSqFt: number;
  /** Volume in cubic feet */
  volumeCuFt: number;
  /** Volume in cubic yards */
  volumeCuYd: number;
  /** Weight in tons */
  tons: number;
  /** Weight in pounds */
  pounds: number;
}

/**
 * Calculates gravel requirements
 */
export function calculateGravel(inputs: GravelInputs): GravelResults {
  const { length, width, depth, density } = inputs;

  if (length <= 0 || width <= 0 || depth <= 0) {
    throw new Error('All dimensions must be positive');
  }

  const areaSqFt = length * width;
  const depthFt = depth / 12;
  const volumeCuFt = areaSqFt * depthFt;
  const volumeCuYd = volumeCuFt / 27;
  const pounds = volumeCuFt * density;
  const tons = pounds / 2000;

  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    tons,
    pounds,
  };
}
