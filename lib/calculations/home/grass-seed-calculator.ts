/**
 * Grass Seed Calculator
 * 
 * Calculates the amount of grass seed needed for a lawn.
 * 
 * @module lib/calculations/home/grass-seed-calculator
 * @see Requirements 7.10
 */

export interface GrassSeedInputs {
  /** Lawn length in feet */
  length: number;
  /** Lawn width in feet */
  width: number;
  /** Seed type: 'new' | 'overseed' | 'thicken' */
  seedType: 'new' | 'overseed' | 'thicken';
  /** Grass variety: 'kentucky' | 'fescue' | 'bermuda' | 'ryegrass' */
  grassVariety: 'kentucky' | 'fescue' | 'bermuda' | 'ryegrass';
}

export interface GrassSeedResults {
  /** Lawn area in square feet */
  areaSqFt: number;
  /** Seed rate in lbs per 1000 sq ft */
  seedRate: number;
  /** Total seed needed in pounds */
  seedPounds: number;
  /** Number of 5 lb bags needed */
  bags5lb: number;
  /** Number of 10 lb bags needed */
  bags10lb: number;
  /** Number of 25 lb bags needed */
  bags25lb: number;
}

// Seed rates per 1000 sq ft by grass type and application
const SEED_RATES: Record<string, Record<string, number>> = {
  kentucky: { new: 3, overseed: 2, thicken: 1.5 },
  fescue: { new: 8, overseed: 5, thicken: 3 },
  bermuda: { new: 2, overseed: 1, thicken: 0.5 },
  ryegrass: { new: 8, overseed: 5, thicken: 3 },
};

/**
 * Calculates grass seed requirements
 */
export function calculateGrassSeed(inputs: GrassSeedInputs): GrassSeedResults {
  const { length, width, seedType, grassVariety } = inputs;

  if (length <= 0 || width <= 0) {
    throw new Error('Lawn dimensions must be positive');
  }

  const areaSqFt = length * width;
  const seedRate = SEED_RATES[grassVariety][seedType];
  const seedPounds = (areaSqFt / 1000) * seedRate;

  return {
    areaSqFt,
    seedRate,
    seedPounds,
    bags5lb: Math.ceil(seedPounds / 5),
    bags10lb: Math.ceil(seedPounds / 10),
    bags25lb: Math.ceil(seedPounds / 25),
  };
}
