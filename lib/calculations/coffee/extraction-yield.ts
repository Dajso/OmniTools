/**
 * Coffee Extraction Yield Calculator
 * 
 * Calculates extraction yield percentage from TDS measurements.
 * Provides assessment classification and recommendations for brew optimization.
 * 
 * @module lib/calculations/coffee/extraction-yield
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

/**
 * Error class for coffee calculation errors
 */
export class CoffeeCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'conversion_failed',
    public field?: string
  ) {
    super(message);
    this.name = 'CoffeeCalculationError';
  }
}

/**
 * Extraction assessment classification
 */
export type ExtractionAssessment = 'under-extracted' | 'optimal' | 'over-extracted';

/**
 * Input parameters for extraction yield calculation
 */
export interface ExtractionYieldInputs {
  /** Total Dissolved Solids percentage (0.01% - 5%) */
  tds: number;
  /** Coffee dose in grams (1g - 100g) */
  coffeeDose: number;
  /** Beverage weight in grams (10g - 1000g) */
  beverageWeight: number;
}

/**
 * Results from extraction yield calculation
 */
export interface ExtractionYieldResults {
  /** Calculated extraction yield percentage */
  extractionYield: number;
  /** Assessment classification */
  assessment: ExtractionAssessment;
  /** Recommendation based on assessment */
  recommendation: string;
}

/**
 * Extraction yield thresholds (SCA standards)
 */
const EXTRACTION_THRESHOLDS = {
  underExtracted: 18,
  optimal: 22,
};

/**
 * Recommendations for each extraction assessment
 */
const RECOMMENDATIONS: Record<ExtractionAssessment, string> = {
  'under-extracted': 'Your coffee is under-extracted. Try grinding finer, increasing water temperature, or extending brew time to extract more flavor compounds.',
  'optimal': 'Your extraction is in the optimal range (18-22%). This typically produces a balanced, flavorful cup with good sweetness and clarity.',
  'over-extracted': 'Your coffee is over-extracted. Try grinding coarser, lowering water temperature, or reducing brew time to avoid bitter, astringent flavors.',
};

/**
 * Determines extraction assessment based on yield percentage
 * 
 * @param extractionYield - Extraction yield percentage
 * @returns Assessment classification
 */
export function getExtractionAssessment(extractionYield: number): ExtractionAssessment {
  if (extractionYield < EXTRACTION_THRESHOLDS.underExtracted) {
    return 'under-extracted';
  } else if (extractionYield <= EXTRACTION_THRESHOLDS.optimal) {
    return 'optimal';
  } else {
    return 'over-extracted';
  }
}

/**
 * Calculates extraction yield from TDS measurements
 * 
 * Formula: Extraction % = (TDS × Beverage Weight) / Coffee Dose
 * 
 * The extraction yield represents the percentage of coffee grounds that dissolved
 * into the beverage. TDS input is already in percentage form (e.g., 1.35 for 1.35%).
 * According to SCA standards:
 * - Under-extracted: < 18% (sour, weak, underdeveloped)
 * - Optimal: 18-22% (balanced, sweet, flavorful)
 * - Over-extracted: > 22% (bitter, astringent, harsh)
 * 
 * @param inputs - Extraction yield calculation inputs
 * @returns Complete extraction yield calculation results
 * 
 * @throws {CoffeeCalculationError} When inputs are invalid or out of range
 * 
 * @example
 * ```ts
 * const result = calculateExtractionYield({
 *   tds: 1.35,        // 1.35% TDS
 *   coffeeDose: 18,   // 18g coffee
 *   beverageWeight: 300 // 300g beverage
 * });
 * console.log(result.extractionYield); // ~22.5%
 * console.log(result.assessment);      // 'over-extracted'
 * ```
 */
export function calculateExtractionYield(inputs: ExtractionYieldInputs): ExtractionYieldResults {
  const { tds, coffeeDose, beverageWeight } = inputs;

  // Validate for NaN
  if (Number.isNaN(tds) || Number.isNaN(coffeeDose) || Number.isNaN(beverageWeight)) {
    throw new CoffeeCalculationError(
      'All inputs must be valid numbers (not NaN)',
      'invalid_input'
    );
  }

  // Validate TDS
  if (tds <= 0) {
    throw new CoffeeCalculationError(
      'TDS must be a positive number',
      'invalid_input',
      'tds'
    );
  }
  if (tds < 0.01 || tds > 5) {
    throw new CoffeeCalculationError(
      'TDS must be between 0.01% and 5%',
      'out_of_range',
      'tds'
    );
  }

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

  // Validate beverage weight
  if (beverageWeight <= 0) {
    throw new CoffeeCalculationError(
      'Beverage weight must be a positive number',
      'invalid_input',
      'beverageWeight'
    );
  }
  if (beverageWeight < 10 || beverageWeight > 1000) {
    throw new CoffeeCalculationError(
      'Beverage weight must be between 10g and 1000g',
      'out_of_range',
      'beverageWeight'
    );
  }

  // Calculate extraction yield
  // Formula: (TDS × Beverage Weight) / Coffee Dose
  // TDS is already in percentage form (e.g., 1.35 means 1.35%)
  const extractionYield = (tds * beverageWeight) / coffeeDose;

  // Round to 2 decimal places
  const roundedYield = Math.round(extractionYield * 100) / 100;

  // Get assessment and recommendation
  const assessment = getExtractionAssessment(roundedYield);
  const recommendation = RECOMMENDATIONS[assessment];

  return {
    extractionYield: roundedYield,
    assessment,
    recommendation,
  };
}
