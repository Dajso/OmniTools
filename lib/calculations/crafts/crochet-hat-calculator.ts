/**
 * Crochet Hat Size Calculator
 * 
 * Calculates hat dimensions from head circumference for crochet projects.
 * 
 * @module lib/calculations/crafts/crochet-hat-calculator
 * @see Requirements 24.7
 */

/**
 * Error class for crochet hat calculation errors
 */
export class CrochetHatError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input',
    public field?: string
  ) {
    super(message);
    this.name = 'CrochetHatError';
  }
}

/**
 * Hat style options
 */
export type HatStyle = 'beanie' | 'slouchy' | 'fitted' | 'earflap';

/**
 * Age group for standard sizing
 */
export type AgeGroup = 
  | 'preemie'
  | 'newborn'
  | 'baby-3-6m'
  | 'baby-6-12m'
  | 'toddler'
  | 'child'
  | 'teen'
  | 'adult-small'
  | 'adult-medium'
  | 'adult-large';

/**
 * Input for crochet hat calculation
 */
export interface CrochetHatInput {
  /** Head circumference in inches */
  headCircumference: number;
  /** Hat style */
  style?: HatStyle;
  /** Negative ease percentage (how much smaller than head, default: 10%) */
  negativeEase?: number;
}

/**
 * Result of crochet hat calculation
 */
export interface CrochetHatResult {
  /** Finished hat circumference in inches */
  hatCircumference: number;
  /** Crown diameter (flat circle) in inches */
  crownDiameter: number;
  /** Hat height from crown to brim in inches */
  hatHeight: number;
  /** Recommended decrease rounds */
  decreaseRounds: number;
  /** Head circumference used */
  headCircumference: number;
  /** Negative ease applied */
  negativeEasePercent: number;
}

/**
 * Standard head circumferences by age group (in inches)
 */
export const STANDARD_HEAD_SIZES: Record<AgeGroup, { circumference: number; height: number }> = {
  'preemie': { circumference: 12, height: 4.5 },
  'newborn': { circumference: 14, height: 5 },
  'baby-3-6m': { circumference: 16, height: 5.5 },
  'baby-6-12m': { circumference: 18, height: 6 },
  'toddler': { circumference: 19, height: 6.5 },
  'child': { circumference: 20, height: 7 },
  'teen': { circumference: 21, height: 7.5 },
  'adult-small': { circumference: 21.5, height: 8 },
  'adult-medium': { circumference: 22.5, height: 8.5 },
  'adult-large': { circumference: 24, height: 9 },
};

/**
 * Style adjustments for hat height
 */
export const STYLE_HEIGHT_ADJUSTMENTS: Record<HatStyle, number> = {
  'beanie': 0,      // Standard height
  'slouchy': 2,     // Add 2 inches for slouch
  'fitted': -0.5,   // Slightly shorter
  'earflap': 0,     // Standard height (earflaps added separately)
};

/**
 * Default negative ease percentages by style
 */
export const STYLE_NEGATIVE_EASE: Record<HatStyle, number> = {
  'beanie': 10,
  'slouchy': 5,     // Less negative ease for slouchy
  'fitted': 15,     // More negative ease for fitted
  'earflap': 10,
};

/**
 * Calculates crown diameter from circumference
 * 
 * Formula: diameter = circumference / π
 * 
 * @param circumference - Hat circumference in inches
 * @returns Crown diameter in inches
 */
export function calculateCrownDiameter(circumference: number): number {
  if (circumference <= 0) {
    throw new CrochetHatError(
      'Omkretsen må være større enn 0',
      'invalid_input',
      'circumference'
    );
  }
  return circumference / Math.PI;
}

/**
 * Calculates hat circumference with negative ease
 * 
 * @param headCircumference - Head circumference in inches
 * @param negativeEasePercent - Percentage of negative ease (default: 10)
 * @returns Hat circumference in inches
 */
export function calculateHatCircumference(
  headCircumference: number,
  negativeEasePercent: number = 10
): number {
  if (headCircumference <= 0) {
    throw new CrochetHatError(
      'Hodeomkretsen må være større enn 0',
      'invalid_input',
      'headCircumference'
    );
  }
  if (negativeEasePercent < 0 || negativeEasePercent > 50) {
    throw new CrochetHatError(
      'Negativ ease må være mellom 0 og 50 prosent',
      'invalid_input',
      'negativeEase'
    );
  }
  
  const easeFactor = 1 - (negativeEasePercent / 100);
  return headCircumference * easeFactor;
}

/**
 * Calculates hat height based on head circumference
 * 
 * General rule: hat height ≈ head circumference × 0.4
 * 
 * @param headCircumference - Head circumference in inches
 * @param style - Hat style for adjustments
 * @returns Hat height in inches
 */
export function calculateHatHeight(
  headCircumference: number,
  style: HatStyle = 'beanie'
): number {
  // Base height is approximately 40% of circumference
  const baseHeight = headCircumference * 0.4;
  const styleAdjustment = STYLE_HEIGHT_ADJUSTMENTS[style];
  
  return Math.max(baseHeight + styleAdjustment, 3); // Minimum 3 inches
}

/**
 * Calculates number of decrease rounds for crown shaping
 * 
 * @param crownDiameter - Crown diameter in inches
 * @param rowsPerInch - Rows per inch from gauge
 * @returns Number of decrease rounds
 */
export function calculateDecreaseRounds(
  crownDiameter: number,
  rowsPerInch: number = 4
): number {
  // Crown shaping typically takes about half the diameter in inches
  const decreaseInches = crownDiameter / 2;
  return Math.ceil(decreaseInches * rowsPerInch);
}

/**
 * Calculates complete crochet hat dimensions
 * 
 * @param input - Crochet hat calculation input
 * @returns Crochet hat calculation result
 * 
 * @example
 * ```ts
 * const result = calculateCrochetHat({
 *   headCircumference: 22,
 *   style: 'beanie',
 * });
 * console.log(result.crownDiameter); // ~6.3 inches
 * ```
 */
export function calculateCrochetHat(input: CrochetHatInput): CrochetHatResult {
  const {
    headCircumference,
    style = 'beanie',
  } = input;

  // Use provided negative ease or default for style
  const negativeEasePercent = input.negativeEase ?? STYLE_NEGATIVE_EASE[style];

  // Validate inputs
  if (headCircumference <= 0) {
    throw new CrochetHatError(
      'Hodeomkretsen må være større enn 0',
      'invalid_input',
      'headCircumference'
    );
  }

  // Calculate hat dimensions
  const hatCircumference = calculateHatCircumference(headCircumference, negativeEasePercent);
  const crownDiameter = calculateCrownDiameter(hatCircumference);
  const hatHeight = calculateHatHeight(headCircumference, style);
  const decreaseRounds = calculateDecreaseRounds(crownDiameter);

  return {
    hatCircumference: Math.round(hatCircumference * 100) / 100,
    crownDiameter: Math.round(crownDiameter * 100) / 100,
    hatHeight: Math.round(hatHeight * 100) / 100,
    decreaseRounds,
    headCircumference,
    negativeEasePercent,
  };
}

/**
 * Calculates hat dimensions for a standard age group
 * 
 * @param ageGroup - Age group for sizing
 * @param style - Hat style
 * @returns Crochet hat calculation result
 */
export function calculateHatForAgeGroup(
  ageGroup: AgeGroup,
  style: HatStyle = 'beanie'
): CrochetHatResult {
  const sizeInfo = STANDARD_HEAD_SIZES[ageGroup];
  if (!sizeInfo) {
    throw new CrochetHatError(
      `Ukjent aldersgruppe: ${ageGroup}`,
      'invalid_input',
      'ageGroup'
    );
  }

  return calculateCrochetHat({
    headCircumference: sizeInfo.circumference,
    style,
  });
}

/**
 * Estimates yarn needed for a hat
 * 
 * @param hatCircumference - Hat circumference in inches
 * @param hatHeight - Hat height in inches
 * @param yardsPerSquareInch - Yards of yarn per square inch (varies by weight)
 * @returns Estimated yards of yarn needed
 */
export function estimateYarnForHat(
  hatCircumference: number,
  hatHeight: number,
  yardsPerSquareInch: number = 0.5
): number {
  // Approximate surface area of a hat (cylinder + half sphere for crown)
  const cylinderArea = hatCircumference * hatHeight;
  const crownRadius = hatCircumference / (2 * Math.PI);
  const crownArea = 2 * Math.PI * crownRadius * crownRadius; // Half sphere surface
  
  const totalArea = cylinderArea + crownArea;
  return Math.ceil(totalArea * yardsPerSquareInch);
}

/**
 * Standard yarn requirements by age group (approximate yards)
 */
export const YARN_REQUIREMENTS: Record<AgeGroup, { worsted: number; bulky: number }> = {
  'preemie': { worsted: 50, bulky: 35 },
  'newborn': { worsted: 75, bulky: 50 },
  'baby-3-6m': { worsted: 100, bulky: 70 },
  'baby-6-12m': { worsted: 125, bulky: 85 },
  'toddler': { worsted: 150, bulky: 100 },
  'child': { worsted: 175, bulky: 120 },
  'teen': { worsted: 200, bulky: 140 },
  'adult-small': { worsted: 200, bulky: 140 },
  'adult-medium': { worsted: 225, bulky: 155 },
  'adult-large': { worsted: 250, bulky: 175 },
};
