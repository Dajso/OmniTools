/**
 * Concrete Calculator
 * 
 * Calculates the amount of concrete needed and bags required.
 * 
 * @module lib/calculations/home/concrete-calculator
 * @see Requirements 7.2
 */

export interface ConcreteInputs {
  /** Length in feet */
  length: number;
  /** Width in feet */
  width: number;
  /** Thickness/depth in inches */
  thickness: number;
}

export interface ConcreteResults {
  /** Area in square feet */
  areaSqFt: number;
  /** Volume in cubic feet */
  volumeCuFt: number;
  /** Volume in cubic yards */
  volumeCuYd: number;
  /** Number of 40 lb bags needed */
  bags40lb: number;
  /** Number of 60 lb bags needed */
  bags60lb: number;
  /** Number of 80 lb bags needed */
  bags80lb: number;
}

// Cubic feet per bag (approximate)
const CUFT_PER_40LB = 0.30;
const CUFT_PER_60LB = 0.45;
const CUFT_PER_80LB = 0.60;

/**
 * Calculates concrete requirements
 */
export function calculateConcrete(inputs: ConcreteInputs): ConcreteResults {
  const { length, width, thickness } = inputs;

  if (length <= 0 || width <= 0 || thickness <= 0) {
    throw new Error('All dimensions must be positive');
  }

  const areaSqFt = length * width;
  const thicknessFt = thickness / 12;
  const volumeCuFt = areaSqFt * thicknessFt;
  const volumeCuYd = volumeCuFt / 27;

  // Add 10% for waste
  const volumeWithWaste = volumeCuFt * 1.1;

  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    bags40lb: Math.ceil(volumeWithWaste / CUFT_PER_40LB),
    bags60lb: Math.ceil(volumeWithWaste / CUFT_PER_60LB),
    bags80lb: Math.ceil(volumeWithWaste / CUFT_PER_80LB),
  };
}
