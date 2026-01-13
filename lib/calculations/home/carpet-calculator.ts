/**
 * Carpet Calculator
 * 
 * Calculates carpet requirements for a room.
 * 
 * @module lib/calculations/home/carpet-calculator
 * @see Requirements 7.6
 */

export interface CarpetInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Carpet roll width in feet (typically 12 or 15) */
  carpetWidth: number;
  /** Price per square yard */
  pricePerSqYd: number;
}

export interface CarpetResults {
  /** Room area in square feet */
  areaSqFt: number;
  /** Room area in square yards */
  areaSqYd: number;
  /** Linear feet of carpet needed */
  linearFeet: number;
  /** Estimated cost */
  estimatedCost: number;
  /** Waste percentage */
  wastePercent: number;
}

/**
 * Calculates carpet requirements
 */
export function calculateCarpet(inputs: CarpetInputs): CarpetResults {
  const { roomLength, roomWidth, carpetWidth, pricePerSqYd } = inputs;

  if (roomLength <= 0 || roomWidth <= 0) {
    throw new Error('Room dimensions must be positive');
  }

  const areaSqFt = roomLength * roomWidth;
  const areaSqYd = areaSqFt / 9;
  
  // Calculate linear feet needed based on carpet width
  const linearFeet = Math.ceil(roomLength) * Math.ceil(roomWidth / carpetWidth);
  const actualSqFt = linearFeet * carpetWidth;
  const wastePercent = ((actualSqFt - areaSqFt) / areaSqFt) * 100;
  
  // Add 10% for waste and seams
  const totalSqYd = areaSqYd * 1.1;
  const estimatedCost = totalSqYd * pricePerSqYd;

  return {
    areaSqFt,
    areaSqYd,
    linearFeet,
    estimatedCost,
    wastePercent: Math.max(0, wastePercent),
  };
}
