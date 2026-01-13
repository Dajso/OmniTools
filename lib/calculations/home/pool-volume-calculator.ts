/**
 * Pool Volume Calculator
 * 
 * Calculates pool volume for various shapes.
 * 
 * @module lib/calculations/home/pool-volume-calculator
 * @see Requirements 7.16
 */

export type PoolShape = 'rectangle' | 'round' | 'oval' | 'kidney';

export interface PoolVolumeInputs {
  /** Pool shape */
  shape: PoolShape;
  /** Length in feet */
  length: number;
  /** Width in feet (or diameter for round) */
  width: number;
  /** Shallow end depth in feet */
  shallowDepth: number;
  /** Deep end depth in feet */
  deepDepth: number;
}

export interface PoolVolumeResults {
  /** Average depth in feet */
  averageDepth: number;
  /** Surface area in square feet */
  surfaceAreaSqFt: number;
  /** Volume in cubic feet */
  volumeCuFt: number;
  /** Volume in gallons */
  volumeGallons: number;
  /** Volume in liters */
  volumeLiters: number;
}

// Gallons per cubic foot
const GALLONS_PER_CUFT = 7.48052;
const LITERS_PER_GALLON = 3.78541;

/**
 * Calculates pool volume
 */
export function calculatePoolVolume(inputs: PoolVolumeInputs): PoolVolumeResults {
  const { shape, length, width, shallowDepth, deepDepth } = inputs;

  if (length <= 0 || width <= 0 || shallowDepth <= 0 || deepDepth <= 0) {
    throw new Error('All dimensions must be positive');
  }

  const averageDepth = (shallowDepth + deepDepth) / 2;
  let surfaceAreaSqFt = 0;

  switch (shape) {
    case 'rectangle':
      surfaceAreaSqFt = length * width;
      break;
    case 'round':
      // Width is diameter
      surfaceAreaSqFt = Math.PI * Math.pow(width / 2, 2);
      break;
    case 'oval':
      surfaceAreaSqFt = Math.PI * (length / 2) * (width / 2);
      break;
    case 'kidney':
      // Kidney shape approximation: 0.45 × (A + B) × Length
      // Using width as average of A and B
      surfaceAreaSqFt = 0.45 * (width + width * 0.8) * length;
      break;
    default:
      throw new Error('Invalid pool shape');
  }

  const volumeCuFt = surfaceAreaSqFt * averageDepth;
  const volumeGallons = volumeCuFt * GALLONS_PER_CUFT;
  const volumeLiters = volumeGallons * LITERS_PER_GALLON;

  return {
    averageDepth,
    surfaceAreaSqFt,
    volumeCuFt,
    volumeGallons: Math.round(volumeGallons),
    volumeLiters: Math.round(volumeLiters),
  };
}
