/**
 * A/B Test Significance Calculator
 * Calculates statistical significance for A/B test results
 * 
 * @module lib/calculations/stats/ab-test-calculator
 * @see Requirements 29.8
 */

export interface ABTestInput {
  controlVisitors: number;
  controlConversions: number;
  treatmentVisitors: number;
  treatmentConversions: number;
}

export interface ABTestResult {
  controlRate: number;
  treatmentRate: number;
  relativeLift: number;
  absoluteLift: number;
  pValue: number;
  isSignificant: boolean;
  confidenceLevel: number;
  standardError: number;
  zScore: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

/**
 * Calculates the cumulative distribution function (CDF) of the standard normal distribution
 * Uses the approximation from Abramowitz and Stegun
 * 
 * @param z - Z-score
 * @returns Probability P(Z <= z)
 */
export function normalCDF(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Calculates the two-tailed p-value from a z-score
 * 
 * @param z - Z-score
 * @returns Two-tailed p-value
 */
export function zScoreToPValue(z: number): number {
  return 2 * (1 - normalCDF(Math.abs(z)));
}

/**
 * Calculates the statistical significance of an A/B test
 * Uses a two-proportion z-test
 * 
 * Formula:
 * - Pooled proportion: p = (x1 + x2) / (n1 + n2)
 * - Standard error: SE = √(p(1-p)(1/n1 + 1/n2))
 * - Z-score: z = (p1 - p2) / SE
 * 
 * @param input - A/B test data
 * @returns ABTestResult with significance analysis
 */
export function calculateABTestSignificance(input: ABTestInput): ABTestResult {
  const { controlVisitors, controlConversions, treatmentVisitors, treatmentConversions } = input;

  // Validate inputs
  if (controlVisitors <= 0 || treatmentVisitors <= 0) {
    throw new Error('Visitor counts must be positive');
  }

  if (controlConversions < 0 || treatmentConversions < 0) {
    throw new Error('Conversion counts cannot be negative');
  }

  if (controlConversions > controlVisitors) {
    throw new Error('Control conversions cannot exceed control visitors');
  }

  if (treatmentConversions > treatmentVisitors) {
    throw new Error('Treatment conversions cannot exceed treatment visitors');
  }

  // Calculate conversion rates
  const controlRate = controlConversions / controlVisitors;
  const treatmentRate = treatmentConversions / treatmentVisitors;

  // Calculate lift
  const absoluteLift = treatmentRate - controlRate;
  const relativeLift = controlRate > 0 
    ? ((treatmentRate - controlRate) / controlRate) * 100 
    : treatmentRate > 0 ? Infinity : 0;

  // Calculate pooled proportion for two-proportion z-test
  const pooledProportion = (controlConversions + treatmentConversions) / 
                           (controlVisitors + treatmentVisitors);

  // Calculate standard error
  const standardError = Math.sqrt(
    pooledProportion * (1 - pooledProportion) * 
    (1 / controlVisitors + 1 / treatmentVisitors)
  );

  // Calculate z-score
  let zScore = 0;
  let pValue = 1;

  if (standardError > 0) {
    zScore = (treatmentRate - controlRate) / standardError;
    pValue = zScoreToPValue(zScore);
  }

  // Determine significance at 95% confidence level
  const isSignificant = pValue < 0.05;
  const confidenceLevel = (1 - pValue) * 100;

  // Calculate 95% confidence interval for the difference
  const criticalValue = 1.96; // Z-score for 95% confidence
  const marginOfError = criticalValue * standardError;
  const confidenceInterval = {
    lower: absoluteLift - marginOfError,
    upper: absoluteLift + marginOfError,
  };

  return {
    controlRate: roundToDecimal(controlRate * 100, 4),
    treatmentRate: roundToDecimal(treatmentRate * 100, 4),
    relativeLift: roundToDecimal(relativeLift, 2),
    absoluteLift: roundToDecimal(absoluteLift * 100, 4),
    pValue: roundToDecimal(pValue, 6),
    isSignificant,
    confidenceLevel: roundToDecimal(Math.min(confidenceLevel, 99.9999), 4),
    standardError: roundToDecimal(standardError, 6),
    zScore: roundToDecimal(zScore, 4),
    confidenceInterval: {
      lower: roundToDecimal(confidenceInterval.lower * 100, 4),
      upper: roundToDecimal(confidenceInterval.upper * 100, 4),
    },
  };
}

/**
 * Calculates the minimum sample size needed for an A/B test
 * to detect a given effect size with specified power and significance
 * 
 * @param baselineRate - Expected conversion rate of control (0-1)
 * @param minimumDetectableEffect - Minimum relative lift to detect (e.g., 0.1 for 10%)
 * @param power - Statistical power (default 0.8)
 * @param significance - Significance level (default 0.05)
 * @returns Required sample size per variation
 */
export function calculateMinimumSampleSize(
  baselineRate: number,
  minimumDetectableEffect: number,
  power: number = 0.8,
  significance: number = 0.05
): number {
  if (baselineRate <= 0 || baselineRate >= 1) {
    throw new Error('Baseline rate must be between 0 and 1 (exclusive)');
  }

  if (minimumDetectableEffect <= 0) {
    throw new Error('Minimum detectable effect must be positive');
  }

  // Z-scores for significance and power
  const zAlpha = 1.96; // For 95% confidence (two-tailed)
  const zBeta = 0.84;  // For 80% power

  // Calculate expected treatment rate
  const treatmentRate = baselineRate * (1 + minimumDetectableEffect);

  // Pooled standard deviation
  const p1 = baselineRate;
  const p2 = treatmentRate;
  const pooledP = (p1 + p2) / 2;

  // Sample size formula
  const numerator = 2 * pooledP * (1 - pooledP) * Math.pow(zAlpha + zBeta, 2);
  const denominator = Math.pow(p2 - p1, 2);

  return Math.ceil(numerator / denominator);
}

/**
 * Rounds a number to a specified number of decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Significance level options for UI
 */
export const SIGNIFICANCE_LEVELS = [
  { value: 0.10, label: '90% Confidence (α = 0.10)' },
  { value: 0.05, label: '95% Confidence (α = 0.05)' },
  { value: 0.01, label: '99% Confidence (α = 0.01)' },
];
