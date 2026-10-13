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
  'under-extracted': 'Kaffen er underekstrahert. Prøv å kverne finere, øke vanntemperaturen eller forlenge trekketiden for å få ut mer smak.',
  'optimal': 'Ekstraksjonen ligger i det optimale området (18–22 %). Det gir vanligvis en balansert og smaksrik kopp med god søthet og klarhet.',
  'over-extracted': 'Kaffen er overekstrahert. Prøv å kverne grovere, senke vanntemperaturen eller korte ned trekketiden for å unngå bitter og snerpete smak.',
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
      'Alle felt må inneholde gyldige tall',
      'invalid_input'
    );
  }

  // Validate TDS
  if (tds <= 0) {
    throw new CoffeeCalculationError(
      'TDS må være et positivt tall',
      'invalid_input',
      'tds'
    );
  }
  if (tds < 0.01 || tds > 5) {
    throw new CoffeeCalculationError(
      'TDS må være mellom 0,01 % og 5 %',
      'out_of_range',
      'tds'
    );
  }

  // Validate coffee dose
  if (coffeeDose <= 0) {
    throw new CoffeeCalculationError(
      'Kaffemengden må være et positivt tall',
      'invalid_input',
      'coffeeDose'
    );
  }
  if (coffeeDose < 1 || coffeeDose > 100) {
    throw new CoffeeCalculationError(
      'Kaffemengden må være mellom 1 g og 100 g',
      'out_of_range',
      'coffeeDose'
    );
  }

  // Validate beverage weight
  if (beverageWeight <= 0) {
    throw new CoffeeCalculationError(
      'Vekten på drikken må være et positivt tall',
      'invalid_input',
      'beverageWeight'
    );
  }
  if (beverageWeight < 10 || beverageWeight > 1000) {
    throw new CoffeeCalculationError(
      'Vekten på drikken må være mellom 10 g og 1000 g',
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
