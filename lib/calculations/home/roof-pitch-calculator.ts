/**
 * Roof Pitch Calculator
 * 
 * Calculates roof pitch and related measurements.
 * 
 * @module lib/calculations/home/roof-pitch-calculator
 * @see Requirements 7.13
 */

export interface RoofPitchInputs {
  /** Rise in inches (vertical) */
  rise: number;
  /** Run in inches (horizontal, typically 12) */
  run: number;
}

export interface RoofPitchResults {
  /** Pitch as X:12 ratio */
  pitch: string;
  /** Pitch in degrees */
  degrees: number;
  /** Pitch as percentage */
  percentage: number;
  /** Rafter length multiplier */
  rafterMultiplier: number;
  /** Roof type classification */
  roofType: string;
}

/**
 * Calculates roof pitch and related values
 */
export function calculateRoofPitch(inputs: RoofPitchInputs): RoofPitchResults {
  const { rise, run } = inputs;

  if (rise < 0 || run <= 0) {
    throw new Error('Rise must be non-negative and run must be positive');
  }

  // Calculate pitch as X:12
  const pitchRatio = (rise / run) * 12;
  const pitch = `${pitchRatio.toFixed(1)}:12`;

  // Calculate degrees
  const radians = Math.atan(rise / run);
  const degrees = radians * (180 / Math.PI);

  // Calculate percentage
  const percentage = (rise / run) * 100;

  // Calculate rafter length multiplier
  const rafterMultiplier = Math.sqrt(1 + Math.pow(rise / run, 2));

  // Classify roof type
  let roofType: string;
  if (pitchRatio < 2) {
    roofType = 'Flat roof';
  } else if (pitchRatio < 4) {
    roofType = 'Low slope';
  } else if (pitchRatio < 9) {
    roofType = 'Conventional';
  } else if (pitchRatio < 18) {
    roofType = 'Steep slope';
  } else {
    roofType = 'Very steep';
  }

  return {
    pitch,
    degrees: Math.round(degrees * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    rafterMultiplier: Math.round(rafterMultiplier * 1000) / 1000,
    roofType,
  };
}
