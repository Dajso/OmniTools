/**
 * Brew Ratio Calculator
 * 
 * Calculates water amount needed for desired brew ratio.
 * Provides strength profile classification based on ratio.
 * 
 * @module lib/calculations/coffee/brew-ratio
 * @see Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { CoffeeCalculationError } from './extraction-yield';

/**
 * Strength profile classification
 */
export type StrengthProfile = 'strong' | 'balanced' | 'mild';

/**
 * Input parameters for brew ratio calculation
 */
export interface BrewRatioInputs {
  /** Coffee dose in grams (1g - 100g) */
  coffeeDose: number;
  /** Ratio multiplier (e.g., 15 for 1:15) (10 - 25) */
  ratio: number;
}

/**
 * Results from brew ratio calculation
 */
export interface BrewRatioResults {
  /** Calculated water amount in grams/ml */
  waterAmount: number;
  /** Strength profile classification */
  strengthProfile: StrengthProfile;
  /** Formatted ratio display (e.g., "1:15") */
  ratioDisplay: string;
  /** Description of the strength profile */
  description: string;
}

/**
 * Strength profile thresholds
 */
const STRENGTH_THRESHOLDS = {
  strong: 15,      // ≤ 1:15
  balanced: 17,    // 1:15 - 1:17
};

/**
 * Descriptions for each strength profile
 */
const STRENGTH_DESCRIPTIONS: Record<StrengthProfile, string> = {
  'strong': 'Strong, concentrated brew with bold flavors. Ideal for espresso-style drinks or those who prefer intense coffee.',
  'balanced': 'Balanced strength with good clarity and sweetness. The sweet spot for most brewing methods.',
  'mild': 'Mild, delicate brew with subtle flavors. Great for highlighting nuanced, light-roasted coffees.',
};

/**
 * Determines strength profile based on brew ratio
 * 
 * @param ratio - Brew ratio multiplier
 * @returns Strength profile classification
 */
export function getStrengthProfile(ratio: number): StrengthProfile {
  if (ratio <= STRENGTH_THRESHOLDS.strong) {
    return 'strong';
  } else if (ratio <= STRENGTH_THRESHOLDS.balanced) {
    return 'balanced';
  } else {
    return 'mild';
  }
}

/**
 * Calculates water amount for desired brew ratio
 * 
 * Formula: Water Amount = Coffee Dose × Ratio
 * 
 * The brew ratio represents the relationship between coffee and water.
 * For example, a 1:15 ratio means 1 gram of coffee to 15 grams of water.
 * Common ratios:
 * - Strong (≤ 1:15): Espresso, Moka pot, concentrated cold brew
 * - Balanced (1:15 - 1:17): Pour over, drip coffee, French press
 * - Mild (> 1:17): Light filter coffee, tea-like brews
 * 
 * @param inputs - Brew ratio calculation inputs
 * @returns Complete brew ratio calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateBrewRatio({
 *   coffeeDose: 20,   // 20g coffee
 *   ratio: 16         // 1:16 ratio
 * });
 * console.log(result.waterAmount);     // 320g
 * console.log(result.strengthProfile); // 'balanced'
 * console.log(result.ratioDisplay);    // '1:16'
 * ```
 */
export function calculateBrewRatio(inputs: BrewRatioInputs): BrewRatioResults {
  const { coffeeDose, ratio } = inputs;

  // Validate coffee dose
  if (coffeeDose <= 0) {
    throw new CoffeeCalculationError(
      'Coffee dose must be a positive number',
      'invalid_input',
      'coffeeDose'
    );
  }
  if (coffeeDose < 1 || coffeeDose > 100) {
    throw new CoffeeCalculationError(
      'Coffee dose must be between 1g and 100g',
      'out_of_range',
      'coffeeDose'
    );
  }

  // Validate ratio
  if (ratio < 1) {
    throw new CoffeeCalculationError(
      'Ratio must be at least 1',
      'invalid_input',
      'ratio'
    );
  }
  if (ratio < 10 || ratio > 25) {
    throw new CoffeeCalculationError(
      'Ratio must be between 10 and 25 (typical range 1:10 to 1:25)',
      'out_of_range',
      'ratio'
    );
  }

  // Calculate water amount
  // Formula: Water Amount = Coffee Dose × Ratio
  const waterAmount = coffeeDose * ratio;

  // Round to 1 decimal place
  const roundedWaterAmount = Math.round(waterAmount * 10) / 10;

  // Get strength profile and description
  const strengthProfile = getStrengthProfile(ratio);
  const description = STRENGTH_DESCRIPTIONS[strengthProfile];

  // Format ratio display
  const ratioDisplay = `1:${ratio}`;

  return {
    waterAmount: roundedWaterAmount,
    strengthProfile,
    ratioDisplay,
    description,
  };
}
