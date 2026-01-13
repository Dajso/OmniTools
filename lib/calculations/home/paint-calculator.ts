/**
 * Paint Calculator
 * 
 * Calculates the amount of paint needed for wall coverage
 * based on room dimensions, number of coats, and paint coverage rate.
 * 
 * @module lib/calculations/home/paint-calculator
 * @see Requirements 7.3
 */

/**
 * Error class for paint calculation errors
 */
export class PaintCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'division_by_zero' | 'overflow',
    public field?: string
  ) {
    super(message);
    this.name = 'PaintCalculationError';
  }
}

/**
 * Input parameters for paint calculation
 */
export interface PaintInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Wall height in feet */
  wallHeight: number;
  /** Number of doors to subtract (standard door ~20 sq ft) */
  numberOfDoors: number;
  /** Number of windows to subtract (standard window ~15 sq ft) */
  numberOfWindows: number;
  /** Number of coats of paint */
  numberOfCoats: number;
  /** Paint coverage rate in sq ft per gallon */
  coveragePerGallon: number;
}

/**
 * Results from paint calculation
 */
export interface PaintResults {
  /** Total wall area in square feet */
  totalWallArea: number;
  /** Area of doors in square feet */
  doorArea: number;
  /** Area of windows in square feet */
  windowArea: number;
  /** Paintable area in square feet */
  paintableArea: number;
  /** Total area to paint (with coats) in square feet */
  totalAreaWithCoats: number;
  /** Gallons of paint needed (exact) */
  gallonsNeeded: number;
  /** Gallons of paint to purchase (rounded up) */
  gallonsToPurchase: number;
  /** Quarts needed if less than 1 gallon */
  quartsNeeded: number;
}

/** Standard door area in square feet */
export const STANDARD_DOOR_AREA = 20;

/** Standard window area in square feet */
export const STANDARD_WINDOW_AREA = 15;

/** Default paint coverage per gallon in square feet */
export const DEFAULT_COVERAGE_PER_GALLON = 350;

/**
 * Calculates the total wall area for a rectangular room
 * 
 * Formula: 2 × (length + width) × height
 * 
 * @param length - Room length in feet
 * @param width - Room width in feet
 * @param height - Wall height in feet
 * @returns Total wall area in square feet
 */
export function calculateWallArea(
  length: number,
  width: number,
  height: number
): number {
  if (length <= 0) {
    throw new PaintCalculationError(
      'Room length must be positive',
      'invalid_input',
      'roomLength'
    );
  }
  if (width <= 0) {
    throw new PaintCalculationError(
      'Room width must be positive',
      'invalid_input',
      'roomWidth'
    );
  }
  if (height <= 0) {
    throw new PaintCalculationError(
      'Wall height must be positive',
      'invalid_input',
      'wallHeight'
    );
  }

  // Perimeter × height = total wall area
  const perimeter = 2 * (length + width);
  return perimeter * height;
}

/**
 * Calculates the paintable area after subtracting doors and windows
 * 
 * @param totalWallArea - Total wall area in square feet
 * @param numberOfDoors - Number of standard doors
 * @param numberOfWindows - Number of standard windows
 * @returns Paintable area in square feet
 */
export function calculatePaintableArea(
  totalWallArea: number,
  numberOfDoors: number,
  numberOfWindows: number
): number {
  const doorArea = numberOfDoors * STANDARD_DOOR_AREA;
  const windowArea = numberOfWindows * STANDARD_WINDOW_AREA;
  const paintableArea = totalWallArea - doorArea - windowArea;
  
  return Math.max(0, paintableArea);
}

/**
 * Calculates the amount of paint needed
 * 
 * @param paintableArea - Area to paint in square feet
 * @param numberOfCoats - Number of coats to apply
 * @param coveragePerGallon - Paint coverage in sq ft per gallon
 * @returns Gallons of paint needed
 */
export function calculatePaintNeeded(
  paintableArea: number,
  numberOfCoats: number,
  coveragePerGallon: number
): number {
  if (numberOfCoats <= 0) {
    throw new PaintCalculationError(
      'Number of coats must be at least 1',
      'invalid_input',
      'numberOfCoats'
    );
  }
  if (coveragePerGallon <= 0) {
    throw new PaintCalculationError(
      'Coverage per gallon must be positive',
      'invalid_input',
      'coveragePerGallon'
    );
  }

  const totalArea = paintableArea * numberOfCoats;
  return totalArea / coveragePerGallon;
}

/**
 * Calculates complete paint requirements for a room
 * 
 * @param inputs - Paint calculation inputs
 * @returns Complete paint calculation results
 * 
 * @example
 * ```ts
 * const result = calculatePaint({
 *   roomLength: 12,
 *   roomWidth: 10,
 *   wallHeight: 8,
 *   numberOfDoors: 1,
 *   numberOfWindows: 2,
 *   numberOfCoats: 2,
 *   coveragePerGallon: 350,
 * });
 * console.log(result.gallonsToPurchase); // 2
 * ```
 */
export function calculatePaint(inputs: PaintInputs): PaintResults {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    numberOfDoors,
    numberOfWindows,
    numberOfCoats,
    coveragePerGallon,
  } = inputs;

  // Validate inputs
  if (numberOfDoors < 0) {
    throw new PaintCalculationError(
      'Number of doors cannot be negative',
      'invalid_input',
      'numberOfDoors'
    );
  }
  if (numberOfWindows < 0) {
    throw new PaintCalculationError(
      'Number of windows cannot be negative',
      'invalid_input',
      'numberOfWindows'
    );
  }

  // Calculate areas
  const totalWallArea = calculateWallArea(roomLength, roomWidth, wallHeight);
  const doorArea = numberOfDoors * STANDARD_DOOR_AREA;
  const windowArea = numberOfWindows * STANDARD_WINDOW_AREA;
  const paintableArea = calculatePaintableArea(
    totalWallArea,
    numberOfDoors,
    numberOfWindows
  );
  const totalAreaWithCoats = paintableArea * numberOfCoats;

  // Calculate paint needed
  const gallonsNeeded = calculatePaintNeeded(
    paintableArea,
    numberOfCoats,
    coveragePerGallon
  );

  // Round up to nearest gallon for purchase
  const gallonsToPurchase = Math.ceil(gallonsNeeded);
  
  // Calculate quarts if less than 1 gallon
  const quartsNeeded = gallonsNeeded < 1 ? Math.ceil(gallonsNeeded * 4) : 0;

  return {
    totalWallArea,
    doorArea,
    windowArea,
    paintableArea,
    totalAreaWithCoats,
    gallonsNeeded,
    gallonsToPurchase,
    quartsNeeded,
  };
}

/**
 * Estimates paint cost based on gallons needed and price per gallon
 * 
 * @param gallons - Number of gallons
 * @param pricePerGallon - Price per gallon in dollars
 * @returns Estimated cost in dollars
 */
export function estimatePaintCost(
  gallons: number,
  pricePerGallon: number
): number {
  return gallons * pricePerGallon;
}
