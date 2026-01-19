/**
 * P-Value Calculator
 * Calculates p-values for various statistical tests
 * 
 * @module lib/calculations/stats/p-value-calculator
 * @see Requirements 29.1
 */

export type TestType = 'z-test' | 't-test' | 'chi-square';
export type TailType = 'one-tailed-left' | 'one-tailed-right' | 'two-tailed';

export interface ZTestInput {
  testStatistic: number;
  tailType: TailType;
}

export interface TTestInput {
  testStatistic: number;
  degreesOfFreedom: number;
  tailType: TailType;
}

export interface ChiSquareInput {
  testStatistic: number;
  degreesOfFreedom: number;
}

export interface PValueResult {
  pValue: number;
  isSignificant: boolean;
  significanceLevel: number;
  interpretation: string;
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
  const absZ = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * absZ);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Calculates the p-value for a z-test
 * 
 * @param input - Z-test parameters
 * @returns PValueResult
 */
export function calculateZTestPValue(input: ZTestInput): PValueResult {
  const { testStatistic, tailType } = input;

  let pValue: number;

  switch (tailType) {
    case 'one-tailed-left':
      pValue = normalCDF(testStatistic);
      break;
    case 'one-tailed-right':
      pValue = 1 - normalCDF(testStatistic);
      break;
    case 'two-tailed':
    default:
      pValue = 2 * (1 - normalCDF(Math.abs(testStatistic)));
      break;
  }

  return createPValueResult(pValue);
}

/**
 * Approximation of the Student's t-distribution CDF
 * Uses the regularized incomplete beta function approximation
 * 
 * @param t - t-statistic
 * @param df - degrees of freedom
 * @returns Probability P(T <= t)
 */
export function tDistributionCDF(t: number, df: number): number {
  if (df <= 0) {
    throw new Error('Degrees of freedom must be positive');
  }

  // For large df, approximate with normal distribution
  if (df > 100) {
    return normalCDF(t);
  }

  const x = df / (df + t * t);
  const beta = incompleteBeta(x, df / 2, 0.5);
  
  if (t >= 0) {
    return 1 - 0.5 * beta;
  } else {
    return 0.5 * beta;
  }
}

/**
 * Approximation of the regularized incomplete beta function
 * Uses continued fraction expansion
 */
function incompleteBeta(x: number, a: number, b: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;

  // Use the continued fraction representation
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) +
    a * Math.log(x) + b * Math.log(1 - x)
  );

  if (x < (a + 1) / (a + b + 2)) {
    return bt * betaCF(x, a, b) / a;
  } else {
    return 1 - bt * betaCF(1 - x, b, a) / b;
  }
}

/**
 * Continued fraction for incomplete beta function
 */
function betaCF(x: number, a: number, b: number): number {
  const maxIterations = 100;
  const epsilon = 1e-10;

  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;

  if (Math.abs(d) < epsilon) d = epsilon;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    h *= d * c;

    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < epsilon) break;
  }

  return h;
}

/**
 * Log gamma function approximation (Stirling's approximation)
 */
function logGamma(x: number): number {
  const coefficients = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5
  ];

  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;

  for (let j = 0; j < 6; j++) {
    ser += coefficients[j] / ++y;
  }

  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

/**
 * Calculates the p-value for a t-test
 * 
 * @param input - T-test parameters
 * @returns PValueResult
 */
export function calculateTTestPValue(input: TTestInput): PValueResult {
  const { testStatistic, degreesOfFreedom, tailType } = input;

  if (degreesOfFreedom <= 0) {
    throw new Error('Degrees of freedom must be positive');
  }

  let pValue: number;

  switch (tailType) {
    case 'one-tailed-left':
      pValue = tDistributionCDF(testStatistic, degreesOfFreedom);
      break;
    case 'one-tailed-right':
      pValue = 1 - tDistributionCDF(testStatistic, degreesOfFreedom);
      break;
    case 'two-tailed':
    default:
      pValue = 2 * (1 - tDistributionCDF(Math.abs(testStatistic), degreesOfFreedom));
      break;
  }

  return createPValueResult(pValue);
}

/**
 * Chi-square distribution CDF approximation
 * Uses the regularized incomplete gamma function
 */
function chiSquareCDF(x: number, df: number): number {
  if (x <= 0) return 0;
  return regularizedGammaP(df / 2, x / 2);
}

/**
 * Regularized incomplete gamma function P(a, x)
 */
function regularizedGammaP(a: number, x: number): number {
  if (x < 0 || a <= 0) {
    throw new Error('Invalid arguments for gamma function');
  }

  if (x === 0) return 0;

  if (x < a + 1) {
    // Use series representation
    return gammaSeries(a, x);
  } else {
    // Use continued fraction representation
    return 1 - gammaCF(a, x);
  }
}

/**
 * Series representation of incomplete gamma function
 */
function gammaSeries(a: number, x: number): number {
  const maxIterations = 100;
  const epsilon = 1e-10;

  let sum = 1 / a;
  let term = sum;

  for (let n = 1; n <= maxIterations; n++) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < Math.abs(sum) * epsilon) break;
  }

  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

/**
 * Continued fraction representation of incomplete gamma function
 */
function gammaCF(a: number, x: number): number {
  const maxIterations = 100;
  const epsilon = 1e-10;

  let b = x + 1 - a;
  let c = 1 / epsilon;
  let d = 1 / b;
  let h = d;

  for (let i = 1; i <= maxIterations; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = b + an / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < epsilon) break;
  }

  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

/**
 * Calculates the p-value for a chi-square test
 * 
 * @param input - Chi-square test parameters
 * @returns PValueResult
 */
export function calculateChiSquarePValue(input: ChiSquareInput): PValueResult {
  const { testStatistic, degreesOfFreedom } = input;

  if (testStatistic < 0) {
    throw new Error('Chi-square statistic cannot be negative');
  }

  if (degreesOfFreedom <= 0) {
    throw new Error('Degrees of freedom must be positive');
  }

  // Chi-square test is always one-tailed (right)
  const pValue = 1 - chiSquareCDF(testStatistic, degreesOfFreedom);

  return createPValueResult(pValue);
}

/**
 * Creates a PValueResult with interpretation
 */
function createPValueResult(pValue: number): PValueResult {
  // Clamp p-value between 0 and 1
  pValue = Math.max(0, Math.min(1, pValue));

  const significanceLevel = 0.05;
  const isSignificant = pValue < significanceLevel;

  let interpretation: string;
  if (pValue < 0.001) {
    interpretation = 'Extremely strong evidence against the null hypothesis';
  } else if (pValue < 0.01) {
    interpretation = 'Very strong evidence against the null hypothesis';
  } else if (pValue < 0.05) {
    interpretation = 'Strong evidence against the null hypothesis';
  } else if (pValue < 0.1) {
    interpretation = 'Moderate evidence against the null hypothesis';
  } else {
    interpretation = 'Weak or no evidence against the null hypothesis';
  }

  return {
    pValue: roundToDecimal(pValue, 6),
    isSignificant,
    significanceLevel,
    interpretation,
  };
}

/**
 * Rounds a number to a specified number of decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Test type options for UI
 */
export const TEST_TYPES = [
  { value: 'z-test', label: 'Z-Test (Normal Distribution)' },
  { value: 't-test', label: 'T-Test (Student\'s t-Distribution)' },
  { value: 'chi-square', label: 'Chi-Square Test' },
];

/**
 * Tail type options for UI
 */
export const TAIL_TYPES = [
  { value: 'two-tailed', label: 'Two-Tailed' },
  { value: 'one-tailed-left', label: 'One-Tailed (Left)' },
  { value: 'one-tailed-right', label: 'One-Tailed (Right)' },
];
