/**
 * Lumber Calculator (Board Feet)
 * 
 * Calculates board feet for lumber purchases.
 * 
 * @module lib/calculations/home/lumber-calculator
 * @see Requirements 7.17
 */

export interface LumberInputs {
  /** Thickness in inches */
  thickness: number;
  /** Width in inches */
  width: number;
  /** Length in feet */
  length: number;
  /** Number of pieces */
  quantity: number;
  /** Price per board foot */
  pricePerBoardFoot: number;
}

export interface LumberResults {
  /** Board feet per piece */
  boardFeetPerPiece: number;
  /** Total board feet */
  totalBoardFeet: number;
  /** Total cost */
  totalCost: number;
  /** Actual dimensions (nominal vs actual) */
  actualDimensions: string;
}

// Nominal to actual lumber dimensions
const NOMINAL_TO_ACTUAL: Record<number, number> = {
  1: 0.75,
  2: 1.5,
  3: 2.5,
  4: 3.5,
  6: 5.5,
  8: 7.25,
  10: 9.25,
  12: 11.25,
};

/**
 * Calculates board feet for lumber
 * 
 * Board Feet = (Thickness × Width × Length) / 144
 * Where thickness and width are in inches, length is in feet
 */
export function calculateLumber(inputs: LumberInputs): LumberResults {
  const { thickness, width, length, quantity, pricePerBoardFoot } = inputs;

  if (thickness <= 0 || width <= 0 || length <= 0 || quantity <= 0) {
    throw new Error('All dimensions must be positive');
  }

  // Calculate board feet using nominal dimensions
  const boardFeetPerPiece = (thickness * width * length) / 12;
  const totalBoardFeet = boardFeetPerPiece * quantity;
  const totalCost = totalBoardFeet * pricePerBoardFoot;

  // Get actual dimensions
  const actualThickness = NOMINAL_TO_ACTUAL[thickness] || thickness;
  const actualWidth = NOMINAL_TO_ACTUAL[width] || width;
  const actualDimensions = `${actualThickness}" × ${actualWidth}" × ${length}'`;

  return {
    boardFeetPerPiece: Math.round(boardFeetPerPiece * 100) / 100,
    totalBoardFeet: Math.round(totalBoardFeet * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    actualDimensions,
  };
}
