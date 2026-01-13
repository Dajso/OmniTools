/**
 * Mulch Calculator
 * 
 * Calculates the amount of mulch needed for garden coverage.
 * 
 * @module lib/calculations/home/mulch-calculator
 * @see Requirements 7.1
 */

export interface MulchInputs {
  /** Area length in feet */
  length: number;
  /** Area width in feet */
  width: number;
  /** Desired mulch depth in inches */
  depth: number;
}

export interface MulchResults {
  /** Area in square feet */
  areaSqFt: number;
  /** Volume in cubic feet */
  volumeCuFt: number;
  /** Volume in cubic yards */
  volumeCuYd: number;
  /** Number of 2 cubic foot bags needed */
  bags2CuFt: number;
  /** Number of 3 cubic foot bags needed */
  bags3CuFt: number;
}

/**
 * Calculates mulch requirements for garden coverage
 */
export function calculateMulch(inputs: MulchInputs): MulchResults {
  const { length, width, depth } = inputs;

  if (length <= 0 || width <= 0 || depth <= 0) {
    throw new Error('All dimensions must be positive');
  }

  const areaSqFt = length * width;
  const depthFt = depth / 12; // Convert inches to feet
  const volumeCuFt = areaSqFt * depthFt;
  const volumeCuYd = volumeCuFt / 27; // 27 cubic feet per cubic yard

  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    bags2CuFt: Math.ceil(volumeCuFt / 2),
    bags3CuFt: Math.ceil(volumeCuFt / 3),
  };
}
