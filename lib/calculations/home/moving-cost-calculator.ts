/**
 * Moving Cost Estimator
 * 
 * Estimates the cost of moving based on various factors.
 * 
 * @module lib/calculations/home/moving-cost-calculator
 * @see Requirements 7.20
 */

export interface MovingCostInputs {
  /** Distance in miles */
  distance: number;
  /** Home size: 'studio' | '1bed' | '2bed' | '3bed' | '4bed' | '5bed+' */
  homeSize: 'studio' | '1bed' | '2bed' | '3bed' | '4bed' | '5bed+';
  /** Move type: 'local' | 'longDistance' | 'crossCountry' */
  moveType: 'local' | 'longDistance' | 'crossCountry';
  /** Include packing service */
  includePacking: boolean;
  /** Number of specialty items (piano, pool table, etc.) */
  specialtyItems: number;
  /** Floor number (for apartments) */
  floorNumber: number;
  /** Moving during peak season (May-September) */
  peakSeason: boolean;
}

export interface MovingCostResults {
  /** Estimated weight in pounds */
  estimatedWeight: number;
  /** Base moving cost */
  baseCost: number;
  /** Packing cost */
  packingCost: number;
  /** Specialty items cost */
  specialtyCost: number;
  /** Floor/stairs surcharge */
  floorSurcharge: number;
  /** Peak season surcharge */
  seasonSurcharge: number;
  /** Total estimated cost */
  totalCost: number;
  /** Low estimate */
  lowEstimate: number;
  /** High estimate */
  highEstimate: number;
}

// Average weight by home size (in pounds)
const WEIGHT_BY_SIZE: Record<string, number> = {
  studio: 1500,
  '1bed': 2500,
  '2bed': 5000,
  '3bed': 7500,
  '4bed': 10000,
  '5bed+': 15000,
};

// Base cost per pound per mile for long distance
const COST_PER_POUND_PER_MILE = 0.0005;

// Hourly rate for local moves
const LOCAL_HOURLY_RATE = 150;

// Hours by home size for local moves
const HOURS_BY_SIZE: Record<string, number> = {
  studio: 3,
  '1bed': 4,
  '2bed': 6,
  '3bed': 8,
  '4bed': 10,
  '5bed+': 12,
};

/**
 * Calculates moving cost estimate
 */
export function calculateMovingCost(inputs: MovingCostInputs): MovingCostResults {
  const {
    distance,
    homeSize,
    moveType,
    includePacking,
    specialtyItems,
    floorNumber,
    peakSeason,
  } = inputs;

  if (distance < 0) {
    throw new Error('Distance cannot be negative');
  }

  const estimatedWeight = WEIGHT_BY_SIZE[homeSize];
  let baseCost: number;

  if (moveType === 'local') {
    // Local moves charged by hour
    const hours = HOURS_BY_SIZE[homeSize];
    baseCost = hours * LOCAL_HOURLY_RATE;
  } else {
    // Long distance charged by weight and distance
    baseCost = estimatedWeight * distance * COST_PER_POUND_PER_MILE;
    // Minimum for long distance
    baseCost = Math.max(baseCost, 1500);
  }

  // Packing cost (approximately $25-35 per room)
  const rooms = parseInt(homeSize.replace(/\D/g, '')) || 1;
  const packingCost = includePacking ? rooms * 300 : 0;

  // Specialty items ($150-300 each)
  const specialtyCost = specialtyItems * 200;

  // Floor surcharge ($75 per floor above ground)
  const floorSurcharge = floorNumber > 1 ? (floorNumber - 1) * 75 : 0;

  // Peak season surcharge (15-25%)
  const seasonSurcharge = peakSeason ? baseCost * 0.2 : 0;

  const totalCost = baseCost + packingCost + specialtyCost + floorSurcharge + seasonSurcharge;

  return {
    estimatedWeight,
    baseCost: Math.round(baseCost),
    packingCost: Math.round(packingCost),
    specialtyCost: Math.round(specialtyCost),
    floorSurcharge: Math.round(floorSurcharge),
    seasonSurcharge: Math.round(seasonSurcharge),
    totalCost: Math.round(totalCost),
    lowEstimate: Math.round(totalCost * 0.85),
    highEstimate: Math.round(totalCost * 1.25),
  };
}
