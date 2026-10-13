/**
 * Sample Size Calculator
 * Calculates required sample size for surveys and statistical studies
 * 
 * @module lib/calculations/stats/sample-size-calculator
 * @see Requirements 29.2, 29.9
 */

export interface SampleSizeInput {
  confidenceLevel: number; // 0.90, 0.95, 0.99
  marginOfError: number;   // percentage (e.g., 5 for 5%)
  populationSize?: number; // optional, for finite population correction
  expectedProportion?: number; // 0-1, defaults to 0.5 for maximum sample size
}

export interface SampleSizeResult {
  sampleSize: number;
  adjustedSampleSize?: number; // with finite population correction
  confidenceLevel: number;
  marginOfError: number;
  zScore: number;
}

// Z-scores for common confidence levels
const Z_SCORES: Record<number, number> = {
  0.80: 1.282,
  0.85: 1.440,
  0.90: 1.645,
  0.95: 1.960,
  0.99: 2.576,
};

/**
 * Gets the Z-score for a given confidence level
 * Uses linear interpolation for non-standard confidence levels
 */
export function getZScore(confidenceLevel: number): number {
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Konfidensnivået må være mellom 0 og 1 (ikke inkludert)');
  }

  // Check for exact match
  if (confidenceLevel in Z_SCORES) {
    return Z_SCORES[confidenceLevel];
  }

  // For common confidence levels, return standard values
  const roundedLevel = Math.round(confidenceLevel * 100) / 100;
  if (roundedLevel in Z_SCORES) {
    return Z_SCORES[roundedLevel];
  }

  // Use approximation for other values using inverse normal distribution
  // This is a simplified approximation
  const alpha = 1 - confidenceLevel;
  const p = 1 - alpha / 2;
  
  // Approximation of inverse normal CDF (Abramowitz and Stegun)
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.383577518672690e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239e0;
  
  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;
  
  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838e0;
  const c4 = -2.549732539343734e0;
  const c5 = 4.374664141464968e0;
  const c6 = 2.938163982698783e0;
  
  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996e0;
  const d4 = 3.754408661907416e0;
  
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  
  let q: number, r: number;
  
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}

/**
 * Calculates the required sample size for a survey or study
 * 
 * Formula (infinite population): n = (Z² × p × (1-p)) / E²
 * Formula (finite population): n_adj = n / (1 + (n-1)/N)
 * 
 * Where:
 * - Z = Z-score for confidence level
 * - p = expected proportion (default 0.5 for maximum sample size)
 * - E = margin of error (as decimal)
 * - N = population size (for finite population correction)
 * 
 * @param input - Sample size calculation parameters
 * @returns SampleSizeResult with calculated sample size
 */
export function calculateSampleSize(input: SampleSizeInput): SampleSizeResult {
  const { confidenceLevel, marginOfError, populationSize, expectedProportion = 0.5 } = input;

  // Validate inputs
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Konfidensnivået må være mellom 0 og 1 (ikke inkludert)');
  }

  if (marginOfError <= 0 || marginOfError > 100) {
    throw new Error('Feilmarginen må være mellom 0 og 100 (0 er ikke tillatt)');
  }

  if (expectedProportion < 0 || expectedProportion > 1) {
    throw new Error('Forventet andel må være mellom 0 og 1');
  }

  if (populationSize !== undefined && populationSize < 1) {
    throw new Error('Populasjonen må være minst 1');
  }

  const zScore = getZScore(confidenceLevel);
  const e = marginOfError / 100; // Convert percentage to decimal
  const p = expectedProportion;
  const q = 1 - p;

  // Calculate sample size for infinite population
  // n = (Z² × p × q) / E²
  const sampleSize = Math.ceil((zScore * zScore * p * q) / (e * e));

  const result: SampleSizeResult = {
    sampleSize,
    confidenceLevel,
    marginOfError,
    zScore,
  };

  // Apply finite population correction if population size is provided
  if (populationSize !== undefined && populationSize > 0) {
    // n_adj = n / (1 + (n-1)/N)
    const adjustedSampleSize = Math.ceil(sampleSize / (1 + (sampleSize - 1) / populationSize));
    result.adjustedSampleSize = Math.min(adjustedSampleSize, populationSize);
  }

  return result;
}

/**
 * Common confidence levels for UI selection
 */
export const COMMON_CONFIDENCE_LEVELS = [
  { value: 0.90, label: '90%' },
  { value: 0.95, label: '95%' },
  { value: 0.99, label: '99%' },
];

/**
 * Common margin of error values for UI selection
 */
export const COMMON_MARGINS_OF_ERROR = [
  { value: 1, label: '±1%' },
  { value: 2, label: '±2%' },
  { value: 3, label: '±3%' },
  { value: 5, label: '±5%' },
  { value: 10, label: '±10%' },
];
