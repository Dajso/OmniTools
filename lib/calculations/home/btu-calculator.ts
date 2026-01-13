/**
 * Air Conditioner BTU Calculator
 * 
 * Calculates the BTU capacity needed for air conditioning.
 * 
 * @module lib/calculations/home/btu-calculator
 * @see Requirements 7.8
 */

export interface BTUInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Ceiling height in feet */
  ceilingHeight: number;
  /** Sun exposure: 'low' | 'medium' | 'high' */
  sunExposure: 'low' | 'medium' | 'high';
  /** Number of occupants */
  occupants: number;
  /** Is it a kitchen? */
  isKitchen: boolean;
}

export interface BTUResults {
  /** Room area in square feet */
  areaSqFt: number;
  /** Base BTU requirement */
  baseBTU: number;
  /** Adjustments for factors */
  adjustments: number;
  /** Total BTU needed */
  totalBTU: number;
  /** Recommended AC tonnage */
  tonnage: number;
}

// Base BTU per square foot
const BTU_PER_SQFT = 20;

/**
 * Calculates BTU requirements for air conditioning
 */
export function calculateBTU(inputs: BTUInputs): BTUResults {
  const { roomLength, roomWidth, ceilingHeight, sunExposure, occupants, isKitchen } = inputs;

  if (roomLength <= 0 || roomWidth <= 0 || ceilingHeight <= 0) {
    throw new Error('Room dimensions must be positive');
  }

  const areaSqFt = roomLength * roomWidth;
  const baseBTU = areaSqFt * BTU_PER_SQFT;

  let adjustments = 0;

  // Ceiling height adjustment (for ceilings over 8 feet)
  if (ceilingHeight > 8) {
    adjustments += baseBTU * ((ceilingHeight - 8) / 8) * 0.25;
  }

  // Sun exposure adjustment
  if (sunExposure === 'high') {
    adjustments += baseBTU * 0.1;
  } else if (sunExposure === 'low') {
    adjustments -= baseBTU * 0.1;
  }

  // Occupant adjustment (600 BTU per person over 2)
  if (occupants > 2) {
    adjustments += (occupants - 2) * 600;
  }

  // Kitchen adjustment
  if (isKitchen) {
    adjustments += 4000;
  }

  const totalBTU = Math.ceil((baseBTU + adjustments) / 1000) * 1000;
  const tonnage = totalBTU / 12000;

  return {
    areaSqFt,
    baseBTU,
    adjustments,
    totalBTU,
    tonnage: Math.round(tonnage * 10) / 10,
  };
}
