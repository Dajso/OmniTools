/**
 * Stair Calculator
 * 
 * Calculates stair dimensions and requirements.
 * 
 * @module lib/calculations/home/stair-calculator
 * @see Requirements 7.14
 */

export interface StairInputs {
  /** Total rise (floor to floor height) in inches */
  totalRise: number;
  /** Available run (horizontal space) in inches */
  availableRun: number;
  /** Stair width in inches */
  stairWidth: number;
}

export interface StairResults {
  /** Number of risers */
  numberOfRisers: number;
  /** Number of treads */
  numberOfTreads: number;
  /** Individual riser height in inches */
  riserHeight: number;
  /** Individual tread depth in inches */
  treadDepth: number;
  /** Total run in inches */
  totalRun: number;
  /** Stringer length in inches */
  stringerLength: number;
  /** Meets building code */
  meetsCode: boolean;
  /** Code notes */
  codeNotes: string[];
}

/**
 * Calculates stair dimensions
 */
export function calculateStairs(inputs: StairInputs): StairResults {
  const { totalRise, availableRun, stairWidth } = inputs;

  if (totalRise <= 0 || availableRun <= 0 || stairWidth <= 0) {
    throw new Error('All dimensions must be positive');
  }

  // Ideal riser height is 7-7.75 inches
  const idealRiserHeight = 7.5;
  const numberOfRisers = Math.round(totalRise / idealRiserHeight);
  const riserHeight = totalRise / numberOfRisers;
  
  // Treads = risers - 1
  const numberOfTreads = numberOfRisers - 1;
  const treadDepth = availableRun / numberOfTreads;
  const totalRun = treadDepth * numberOfTreads;

  // Calculate stringer length using Pythagorean theorem
  const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRun, 2));

  // Check building code compliance
  const codeNotes: string[] = [];
  let meetsCode = true;

  // Riser height: 4" min, 7.75" max (IRC)
  if (riserHeight < 4 || riserHeight > 7.75) {
    meetsCode = false;
    codeNotes.push(`Riser height (${riserHeight.toFixed(2)}") should be between 4" and 7.75"`);
  }

  // Tread depth: 10" minimum (IRC)
  if (treadDepth < 10) {
    meetsCode = false;
    codeNotes.push(`Tread depth (${treadDepth.toFixed(2)}") should be at least 10"`);
  }

  // Stair width: 36" minimum (IRC)
  if (stairWidth < 36) {
    codeNotes.push(`Stair width (${stairWidth}") should be at least 36" for residential`);
  }

  // 2R + T rule (should be between 24-25)
  const comfortRule = 2 * riserHeight + treadDepth;
  if (comfortRule < 24 || comfortRule > 25) {
    codeNotes.push(`Comfort rule (2R+T = ${comfortRule.toFixed(1)}) ideally should be 24-25`);
  }

  if (codeNotes.length === 0) {
    codeNotes.push('All dimensions meet standard building codes');
  }

  return {
    numberOfRisers,
    numberOfTreads,
    riserHeight: Math.round(riserHeight * 100) / 100,
    treadDepth: Math.round(treadDepth * 100) / 100,
    totalRun: Math.round(totalRun * 100) / 100,
    stringerLength: Math.round(stringerLength * 100) / 100,
    meetsCode,
    codeNotes,
  };
}
