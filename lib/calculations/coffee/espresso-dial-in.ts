/**
 * Espresso Dial-in Log Calculator
 * 
 * Calculates extraction metrics for espresso shots.
 * Provides extraction ratio and flow rate analysis with recommendations.
 * 
 * @module lib/calculations/coffee/espresso-dial-in
 * @see Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */

import { z } from 'zod';
import { CoffeeCalculationError } from './extraction-yield';

/**
 * Extraction ratio recommendation classification
 */
export type ExtractionRatioRecommendation = 'increase-yield' | 'optimal' | 'decrease-yield';

/**
 * Input parameters for espresso metrics calculation
 */
export interface EspressoMetricsInputs {
  /** Coffee dose in grams (5g - 30g) */
  dose: number;
  /** Beverage yield in grams (10g - 100g) */
  yield: number;
  /** Extraction time in seconds (10s - 60s) */
  time: number;
}

/**
 * Results from espresso metrics calculation
 */
export interface EspressoMetricsResults {
  /** Extraction ratio (yield / dose) */
  extractionRatio: number;
  /** Flow rate in grams per second (yield / time) */
  flowRate: number;
  /** Recommendation classification */
  recommendation: ExtractionRatioRecommendation;
  /** Detailed recommendation text */
  recommendationText: string;
}

/**
 * Extraction ratio thresholds
 */
const EXTRACTION_RATIO_THRESHOLDS = {
  low: 1.5,      // < 1.5: too low
  optimal: 2.5,  // 1.5 - 2.5: optimal
};

/**
 * Recommendations for each extraction ratio classification
 */
const RECOMMENDATIONS: Record<ExtractionRatioRecommendation, string> = {
  'increase-yield': 'Extraction ratio is too low. Try increasing yield (pull longer shot) or decreasing dose to achieve better extraction balance.',
  'optimal': 'Extraction ratio is in the optimal range (1.5-2.5). This typically produces a balanced espresso with good body and sweetness.',
  'decrease-yield': 'Extraction ratio is too high. Try decreasing yield (stop shot earlier) or increasing dose to avoid over-extraction and bitterness.',
};

/**
 * Zod schema for espresso metrics input validation
 */
export const espressoMetricsSchema = z.object({
  dose: z.number()
    .min(5, 'Dose must be at least 5g')
    .max(30, 'Dose cannot exceed 30g'),
  yield: z.number()
    .min(10, 'Yield must be at least 10g')
    .max(100, 'Yield cannot exceed 100g'),
  time: z.number()
    .min(10, 'Time must be at least 10 seconds')
    .max(60, 'Time cannot exceed 60 seconds'),
});

export type EspressoMetricsInputsValidated = z.infer<typeof espressoMetricsSchema>;

/**
 * Determines extraction ratio recommendation based on ratio value
 * 
 * @param extractionRatio - Extraction ratio (yield / dose)
 * @returns Recommendation classification
 */
export function getExtractionRatioRecommendation(
  extractionRatio: number
): ExtractionRatioRecommendation {
  if (extractionRatio < EXTRACTION_RATIO_THRESHOLDS.low) {
    return 'increase-yield';
  } else if (extractionRatio <= EXTRACTION_RATIO_THRESHOLDS.optimal) {
    return 'optimal';
  } else {
    return 'decrease-yield';
  }
}

/**
 * Calculates espresso extraction metrics
 * 
 * Formulas:
 * - Extraction Ratio = Yield / Dose
 * - Flow Rate = Yield / Time (g/s)
 * 
 * The extraction ratio indicates the relationship between coffee dose and
 * beverage yield. Common espresso ratios:
 * - Ristretto: 1:1 to 1:1.5 (concentrated, intense)
 * - Traditional: 1:1.5 to 2.5 (balanced, sweet)
 * - Lungo: 1:2.5 to 1:4 (lighter, more volume)
 * 
 * Flow rate helps diagnose grind size and puck preparation:
 * - Too fast (>2 g/s): Grind finer, tamp harder
 * - Optimal (1-2 g/s): Good extraction
 * - Too slow (<1 g/s): Grind coarser, check for channeling
 * 
 * @param inputs - Espresso metrics calculation inputs
 * @returns Complete espresso metrics calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateEspressoMetrics({
 *   dose: 18,    // 18g coffee
 *   yield: 36,   // 36g beverage
 *   time: 28     // 28 seconds
 * });
 * console.log(result.extractionRatio); // 2.0
 * console.log(result.flowRate);        // 1.29 g/s
 * console.log(result.recommendation);  // 'optimal'
 * ```
 */
export function calculateEspressoMetrics(
  inputs: EspressoMetricsInputs
): EspressoMetricsResults {
  const { dose, yield: yieldAmount, time } = inputs;

  // Validate dose
  if (dose <= 0) {
    throw new CoffeeCalculationError(
      'Dose must be a positive number',
      'invalid_input',
      'dose'
    );
  }
  if (dose < 5 || dose > 30) {
    throw new CoffeeCalculationError(
      'Dose must be between 5g and 30g',
      'out_of_range',
      'dose'
    );
  }

  // Validate yield
  if (yieldAmount <= 0) {
    throw new CoffeeCalculationError(
      'Yield must be a positive number',
      'invalid_input',
      'yield'
    );
  }
  if (yieldAmount < 10 || yieldAmount > 100) {
    throw new CoffeeCalculationError(
      'Yield must be between 10g and 100g',
      'out_of_range',
      'yield'
    );
  }

  // Validate time
  if (time <= 0) {
    throw new CoffeeCalculationError(
      'Time must be a positive number',
      'invalid_input',
      'time'
    );
  }
  if (time < 10 || time > 60) {
    throw new CoffeeCalculationError(
      'Time must be between 10 and 60 seconds',
      'out_of_range',
      'time'
    );
  }

  // Calculate extraction ratio
  // Formula: Extraction Ratio = Yield / Dose
  const extractionRatio = yieldAmount / dose;

  // Calculate flow rate
  // Formula: Flow Rate = Yield / Time (g/s)
  const flowRate = yieldAmount / time;

  // Round to 2 decimal places
  const roundedExtractionRatio = Math.round(extractionRatio * 100) / 100;
  const roundedFlowRate = Math.round(flowRate * 100) / 100;

  // Get recommendation
  const recommendation = getExtractionRatioRecommendation(roundedExtractionRatio);
  const recommendationText = RECOMMENDATIONS[recommendation];

  return {
    extractionRatio: roundedExtractionRatio,
    flowRate: roundedFlowRate,
    recommendation,
    recommendationText,
  };
}
