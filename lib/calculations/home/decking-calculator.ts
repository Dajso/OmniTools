/**
 * Decking Calculator
 * 
 * Calculates materials needed for deck construction.
 * 
 * @module lib/calculations/home/decking-calculator
 * @see Requirements 7.12
 */

export interface DeckingInputs {
  /** Deck length in feet */
  deckLength: number;
  /** Deck width in feet */
  deckWidth: number;
  /** Board width in inches (typically 5.5 for 2x6) */
  boardWidth: number;
  /** Board length in feet (typically 8, 10, 12, 16) */
  boardLength: number;
  /** Gap between boards in inches */
  boardGap: number;
  /** Joist spacing in inches (typically 16) */
  joistSpacing: number;
}

export interface DeckingResults {
  /** Deck area in square feet */
  areaSqFt: number;
  /** Number of deck boards needed */
  deckBoards: number;
  /** Number of joists needed */
  joists: number;
  /** Linear feet of decking */
  deckingLinearFeet: number;
  /** Number of screws needed (approximately) */
  screws: number;
  /** Waste percentage included */
  wastePercent: number;
}

/**
 * Calculates decking material requirements
 */
export function calculateDecking(inputs: DeckingInputs): DeckingResults {
  const { deckLength, deckWidth, boardWidth, boardLength, boardGap, joistSpacing } = inputs;

  if (deckLength <= 0 || deckWidth <= 0) {
    throw new Error('Deck dimensions must be positive');
  }

  const areaSqFt = deckLength * deckWidth;
  
  // Calculate deck boards
  const boardWidthFt = boardWidth / 12;
  const boardGapFt = boardGap / 12;
  const effectiveBoardWidth = boardWidthFt + boardGapFt;
  const boardsAcrossWidth = Math.ceil(deckWidth / effectiveBoardWidth);
  const boardsPerLength = Math.ceil(deckLength / boardLength);
  const deckBoards = Math.ceil(boardsAcrossWidth * boardsPerLength * 1.1); // 10% waste
  
  const deckingLinearFeet = boardsAcrossWidth * deckLength;

  // Calculate joists
  const joistSpacingFt = joistSpacing / 12;
  const joists = Math.ceil(deckLength / joistSpacingFt) + 1;

  // Approximately 2 screws per board per joist intersection
  const screws = deckBoards * joists * 2;

  return {
    areaSqFt,
    deckBoards,
    joists,
    deckingLinearFeet,
    screws,
    wastePercent: 10,
  };
}
