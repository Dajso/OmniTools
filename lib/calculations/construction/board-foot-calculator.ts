/**
 * Board Foot Calculator
 * 
 * Calculates board feet for lumber pricing and estimation.
 * A board foot is a unit of volume for lumber equal to 144 cubic inches
 * (1 foot × 1 foot × 1 inch).
 * 
 * Key formulas:
 * - Board Feet = (Thickness × Width × Length) / 144
 *   (when thickness and width are in inches, length is in feet)
 * - Board Feet = (Thickness × Width × Length) / 12
 *   (when all dimensions are in inches)
 * 
 * Common lumber sizes use nominal dimensions (e.g., 2×4 is actually 1.5" × 3.5")
 * This calculator supports both nominal and actual dimensions.
 * 
 * @module lib/calculations/construction/board-foot-calculator
 * @see Requirements 32.1
 */

/**
 * Error class for Board Foot calculation errors
 */
export class BoardFootError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'BoardFootError';
  }
}

/**
 * Unit of measurement for length dimension
 */
export type LengthUnit = 'feet' | 'inches';

/**
 * Input for board foot calculation
 */
export interface BoardFootInput {
  /**
   * Thickness of the lumber in inches
   * For nominal sizes: 1" nominal = 0.75" actual, 2" nominal = 1.5" actual
   */
  thickness: number;

  /**
   * Width of the lumber in inches
   * For nominal sizes: 4" nominal = 3.5" actual, 6" nominal = 5.5" actual
   */
  width: number;

  /**
   * Length of the lumber
   * Default unit is feet, can be specified with lengthUnit
   */
  length: number;

  /**
   * Unit for the length dimension (default: 'feet')
   */
  lengthUnit?: LengthUnit;

  /**
   * Number of pieces (default: 1)
   */
  quantity?: number;

  /**
   * Price per board foot (optional, for cost calculation)
   */
  pricePerBoardFoot?: number;
}

/**
 * Result of board foot calculation
 */
export interface BoardFootResult {
  /**
   * Board feet for a single piece
   */
  boardFeet: number;

  /**
   * Total board feet for all pieces (boardFeet × quantity)
   */
  totalBoardFeet: number;

  /**
   * Total price (totalBoardFeet × pricePerBoardFoot)
   * Only present if pricePerBoardFoot was provided
   */
  totalPrice?: number;

  /**
   * Price per piece (boardFeet × pricePerBoardFoot)
   * Only present if pricePerBoardFoot was provided
   */
  pricePerPiece?: number;

  /**
   * Formatted board feet string
   */
  formattedBoardFeet: string;

  /**
   * Formatted total board feet string
   */
  formattedTotalBoardFeet: string;

  /**
   * Formatted total price string
   * Only present if pricePerBoardFoot was provided
   */
  formattedTotalPrice?: string;

  /**
   * Formatted price per piece string
   * Only present if pricePerBoardFoot was provided
   */
  formattedPricePerPiece?: string;

  /**
   * Input dimensions used in calculation
   */
  dimensions: {
    thickness: number;
    width: number;
    length: number;
    lengthUnit: LengthUnit;
  };

  /**
   * Quantity of pieces
   */
  quantity: number;

  /**
   * Price per board foot used (if provided)
   */
  pricePerBoardFoot?: number;

  /**
   * Volume in cubic inches (for reference)
   */
  volumeCubicInches: number;

  /**
   * Volume in cubic feet (for reference)
   */
  volumeCubicFeet: number;
}

/**
 * Common nominal lumber sizes with their actual dimensions
 */
export const NOMINAL_TO_ACTUAL: Record<string, { thickness: number; width: number }> = {
  '1x2': { thickness: 0.75, width: 1.5 },
  '1x3': { thickness: 0.75, width: 2.5 },
  '1x4': { thickness: 0.75, width: 3.5 },
  '1x6': { thickness: 0.75, width: 5.5 },
  '1x8': { thickness: 0.75, width: 7.25 },
  '1x10': { thickness: 0.75, width: 9.25 },
  '1x12': { thickness: 0.75, width: 11.25 },
  '2x2': { thickness: 1.5, width: 1.5 },
  '2x3': { thickness: 1.5, width: 2.5 },
  '2x4': { thickness: 1.5, width: 3.5 },
  '2x6': { thickness: 1.5, width: 5.5 },
  '2x8': { thickness: 1.5, width: 7.25 },
  '2x10': { thickness: 1.5, width: 9.25 },
  '2x12': { thickness: 1.5, width: 11.25 },
  '4x4': { thickness: 3.5, width: 3.5 },
  '4x6': { thickness: 3.5, width: 5.5 },
  '6x6': { thickness: 5.5, width: 5.5 },
};

/**
 * Common lumber lengths in feet
 */
export const COMMON_LENGTHS_FEET = [6, 8, 10, 12, 14, 16, 18, 20];

/**
 * Validate board foot input parameters
 * @param input - The input to validate
 * @throws BoardFootError if input is invalid
 */
function validateInput(input: BoardFootInput): void {
  // Validate thickness
  if (input.thickness === undefined || input.thickness === null) {
    throw new BoardFootError(
      'Thickness is required',
      'invalid_input',
      'thickness'
    );
  }

  if (isNaN(input.thickness)) {
    throw new BoardFootError(
      'Thickness must be a valid number',
      'invalid_input',
      'thickness'
    );
  }

  if (input.thickness <= 0) {
    throw new BoardFootError(
      'Thickness must be greater than 0',
      'out_of_range',
      'thickness'
    );
  }

  // Validate width
  if (input.width === undefined || input.width === null) {
    throw new BoardFootError(
      'Width is required',
      'invalid_input',
      'width'
    );
  }

  if (isNaN(input.width)) {
    throw new BoardFootError(
      'Width must be a valid number',
      'invalid_input',
      'width'
    );
  }

  if (input.width <= 0) {
    throw new BoardFootError(
      'Width must be greater than 0',
      'out_of_range',
      'width'
    );
  }

  // Validate length
  if (input.length === undefined || input.length === null) {
    throw new BoardFootError(
      'Length is required',
      'invalid_input',
      'length'
    );
  }

  if (isNaN(input.length)) {
    throw new BoardFootError(
      'Length must be a valid number',
      'invalid_input',
      'length'
    );
  }

  if (input.length <= 0) {
    throw new BoardFootError(
      'Length must be greater than 0',
      'out_of_range',
      'length'
    );
  }

  // Validate quantity if provided
  if (input.quantity !== undefined) {
    if (isNaN(input.quantity)) {
      throw new BoardFootError(
        'Quantity must be a valid number',
        'invalid_input',
        'quantity'
      );
    }

    if (input.quantity <= 0) {
      throw new BoardFootError(
        'Quantity must be greater than 0',
        'out_of_range',
        'quantity'
      );
    }

    if (!Number.isInteger(input.quantity)) {
      throw new BoardFootError(
        'Quantity must be a whole number',
        'invalid_input',
        'quantity'
      );
    }
  }

  // Validate price per board foot if provided
  if (input.pricePerBoardFoot !== undefined) {
    if (isNaN(input.pricePerBoardFoot)) {
      throw new BoardFootError(
        'Price per board foot must be a valid number',
        'invalid_input',
        'pricePerBoardFoot'
      );
    }

    if (input.pricePerBoardFoot < 0) {
      throw new BoardFootError(
        'Price per board foot cannot be negative',
        'out_of_range',
        'pricePerBoardFoot'
      );
    }
  }
}

/**
 * Format a number with specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a currency value
 * @param value - The currency value
 * @returns Formatted currency string
 */
function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Calculate board feet for lumber
 * 
 * Board Feet = (Thickness × Width × Length) / 144
 * Where thickness and width are in inches, and length is in feet.
 * 
 * If length is in inches: Board Feet = (Thickness × Width × Length) / 12
 * (since we need to convert length from inches to feet by dividing by 12,
 * the formula becomes (T × W × L/12) / 12 = (T × W × L) / 144)
 * 
 * @param input - Board foot calculation input parameters
 * @returns Calculated board feet and pricing information
 * @throws BoardFootError if input is invalid
 * 
 * @example
 * // Calculate board feet for a 2x4x8' board
 * const result = calculateBoardFeet({
 *   thickness: 1.5,  // actual thickness of 2x4
 *   width: 3.5,      // actual width of 2x4
 *   length: 8,       // 8 feet
 *   quantity: 10,
 *   pricePerBoardFoot: 5.50
 * });
 * // result.boardFeet = 3.5
 * // result.totalBoardFeet = 35
 * // result.totalPrice = 192.50
 */
export function calculateBoardFeet(input: BoardFootInput): BoardFootResult {
  validateInput(input);

  const { thickness, width, length, lengthUnit = 'feet', quantity = 1, pricePerBoardFoot } = input;

  // Convert length to feet if provided in inches
  const lengthInFeet = lengthUnit === 'inches' ? length / 12 : length;

  // Calculate board feet for a single piece
  // Formula: (Thickness × Width × Length) / 12
  // Where thickness and width are in inches, length is in feet
  const boardFeet = (thickness * width * lengthInFeet) / 12;

  // Calculate total board feet
  const totalBoardFeet = boardFeet * quantity;

  // Calculate volume in cubic inches and cubic feet
  const lengthInInches = lengthUnit === 'inches' ? length : length * 12;
  const volumeCubicInches = thickness * width * lengthInInches;
  const volumeCubicFeet = volumeCubicInches / 1728; // 12^3 = 1728 cubic inches per cubic foot

  // Build result object
  const result: BoardFootResult = {
    boardFeet,
    totalBoardFeet,
    formattedBoardFeet: `${formatNumber(boardFeet)} BF`,
    formattedTotalBoardFeet: `${formatNumber(totalBoardFeet)} BF`,
    dimensions: {
      thickness,
      width,
      length,
      lengthUnit,
    },
    quantity,
    volumeCubicInches,
    volumeCubicFeet,
  };

  // Add pricing if price per board foot was provided
  if (pricePerBoardFoot !== undefined) {
    const pricePerPiece = boardFeet * pricePerBoardFoot;
    const totalPrice = totalBoardFeet * pricePerBoardFoot;

    result.pricePerBoardFoot = pricePerBoardFoot;
    result.pricePerPiece = pricePerPiece;
    result.totalPrice = totalPrice;
    result.formattedPricePerPiece = formatCurrency(pricePerPiece);
    result.formattedTotalPrice = formatCurrency(totalPrice);
  }

  return result;
}

/**
 * Calculate board feet using nominal lumber size
 * 
 * Convenience function that looks up actual dimensions from nominal size.
 * 
 * @param nominalSize - Nominal lumber size (e.g., '2x4', '1x6')
 * @param length - Length of the lumber
 * @param lengthUnit - Unit for length (default: 'feet')
 * @param quantity - Number of pieces (default: 1)
 * @param pricePerBoardFoot - Price per board foot (optional)
 * @returns Calculated board feet and pricing information
 * @throws BoardFootError if nominal size is not recognized
 * 
 * @example
 * // Calculate board feet for 10 pieces of 2x4x8'
 * const result = calculateBoardFeetFromNominal('2x4', 8, 'feet', 10, 5.50);
 */
export function calculateBoardFeetFromNominal(
  nominalSize: string,
  length: number,
  lengthUnit: LengthUnit = 'feet',
  quantity: number = 1,
  pricePerBoardFoot?: number
): BoardFootResult {
  const actualDimensions = NOMINAL_TO_ACTUAL[nominalSize.toLowerCase()];

  if (!actualDimensions) {
    throw new BoardFootError(
      `Unknown nominal size: ${nominalSize}. Valid sizes: ${Object.keys(NOMINAL_TO_ACTUAL).join(', ')}`,
      'invalid_input',
      'nominalSize'
    );
  }

  return calculateBoardFeet({
    thickness: actualDimensions.thickness,
    width: actualDimensions.width,
    length,
    lengthUnit,
    quantity,
    pricePerBoardFoot,
  });
}

/**
 * Get a quick reference table for common lumber sizes
 * 
 * @param length - Length in feet (default: 8)
 * @param pricePerBoardFoot - Price per board foot (optional)
 * @returns Array of pre-calculated results for common lumber sizes
 */
export function getBoardFootQuickReferenceTable(
  length: number = 8,
  pricePerBoardFoot?: number
): Array<{
  nominalSize: string;
  actualThickness: number;
  actualWidth: number;
  length: number;
  boardFeet: number;
  formattedBoardFeet: string;
  totalPrice?: number;
  formattedTotalPrice?: string;
}> {
  const commonSizes = ['1x4', '1x6', '1x8', '1x12', '2x4', '2x6', '2x8', '2x10', '2x12', '4x4'];

  return commonSizes.map((nominalSize) => {
    const result = calculateBoardFeetFromNominal(nominalSize, length, 'feet', 1, pricePerBoardFoot);
    const actual = NOMINAL_TO_ACTUAL[nominalSize];

    return {
      nominalSize,
      actualThickness: actual.thickness,
      actualWidth: actual.width,
      length,
      boardFeet: Math.round(result.boardFeet * 100) / 100,
      formattedBoardFeet: result.formattedBoardFeet,
      totalPrice: result.totalPrice,
      formattedTotalPrice: result.formattedTotalPrice,
    };
  });
}

/**
 * Estimate lumber needed for a project
 * 
 * Given a total board feet requirement, calculates how many pieces
 * of a specific lumber size are needed.
 * 
 * @param totalBoardFeetNeeded - Total board feet required for the project
 * @param thickness - Thickness in inches
 * @param width - Width in inches
 * @param length - Length of each piece
 * @param lengthUnit - Unit for length (default: 'feet')
 * @param wastePercentage - Percentage to add for waste (default: 10)
 * @returns Estimation with pieces needed and adjusted totals
 */
export function estimateLumberNeeded(
  totalBoardFeetNeeded: number,
  thickness: number,
  width: number,
  length: number,
  lengthUnit: LengthUnit = 'feet',
  wastePercentage: number = 10
): {
  boardFeetPerPiece: number;
  piecesNeeded: number;
  piecesWithWaste: number;
  actualBoardFeet: number;
  wastePercentage: number;
} {
  if (totalBoardFeetNeeded <= 0) {
    throw new BoardFootError(
      'Total board feet needed must be greater than 0',
      'out_of_range',
      'totalBoardFeetNeeded'
    );
  }

  if (wastePercentage < 0 || wastePercentage > 100) {
    throw new BoardFootError(
      'Waste percentage must be between 0 and 100',
      'out_of_range',
      'wastePercentage'
    );
  }

  const result = calculateBoardFeet({ thickness, width, length, lengthUnit });
  const boardFeetPerPiece = result.boardFeet;

  // Calculate pieces needed (round up)
  const piecesNeeded = Math.ceil(totalBoardFeetNeeded / boardFeetPerPiece);

  // Add waste percentage
  const piecesWithWaste = Math.ceil(piecesNeeded * (1 + wastePercentage / 100));

  // Calculate actual board feet with waste
  const actualBoardFeet = piecesWithWaste * boardFeetPerPiece;

  return {
    boardFeetPerPiece,
    piecesNeeded,
    piecesWithWaste,
    actualBoardFeet,
    wastePercentage,
  };
}
