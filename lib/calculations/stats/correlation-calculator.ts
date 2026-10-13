/**
 * Correlation Coefficient Calculator
 * Calculates Pearson correlation coefficient and related statistics
 * 
 * @module lib/calculations/stats/correlation-calculator
 * @see Requirements 29.7
 */

import { splitNumberTokens } from './statistics';
import { formatFixed } from '@/lib/utils/formatting';

export interface CorrelationInput {
  xValues: number[];
  yValues: number[];
}

export interface CorrelationResult {
  pearsonR: number;
  rSquared: number;
  interpretation: string;
  strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very-strong' | 'perfect';
  direction: 'positive' | 'negative' | 'none';
  sampleSize: number;
  pValue: number;
  isSignificant: boolean;
  regression: {
    slope: number;
    intercept: number;
    equation: string;
  };
}

/**
 * Calculates the Pearson correlation coefficient (r) between two datasets
 * 
 * Formula: r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
 * 
 * @param input - Two arrays of equal length
 * @returns CorrelationResult with r, r², interpretation, and regression
 */
export function calculateCorrelation(input: CorrelationInput): CorrelationResult {
  const { xValues, yValues } = input;

  // Validate inputs
  if (xValues.length !== yValues.length) {
    throw new Error('X- og Y-listene må ha like mange verdier');
  }

  if (xValues.length < 2) {
    throw new Error('Du må ha minst 2 datapunkter');
  }

  const n = xValues.length;

  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  // Calculate sums for correlation formula
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    sumXY += xDiff * yDiff;
    sumX2 += xDiff * xDiff;
    sumY2 += yDiff * yDiff;
  }

  // Calculate Pearson r
  const denominator = Math.sqrt(sumX2 * sumY2);
  let pearsonR = 0;

  if (denominator > 0) {
    pearsonR = sumXY / denominator;
  }

  // Clamp to [-1, 1] to handle floating point errors
  pearsonR = Math.max(-1, Math.min(1, pearsonR));

  // Calculate R-squared (coefficient of determination)
  const rSquared = pearsonR * pearsonR;

  // Calculate linear regression coefficients
  const slope = sumX2 > 0 ? sumXY / sumX2 : 0;
  const intercept = yMean - slope * xMean;

  // Calculate p-value using t-distribution
  const pValue = calculateCorrelationPValue(pearsonR, n);

  // Interpret the correlation
  const { interpretation, strength, direction } = interpretCorrelation(pearsonR);

  return {
    pearsonR: roundToDecimal(pearsonR, 6),
    rSquared: roundToDecimal(rSquared, 6),
    interpretation,
    strength,
    direction,
    sampleSize: n,
    pValue: roundToDecimal(pValue, 6),
    isSignificant: pValue < 0.05,
    regression: {
      slope: roundToDecimal(slope, 6),
      intercept: roundToDecimal(intercept, 6),
      equation: formatRegressionEquation(slope, intercept),
    },
  };
}

/**
 * Calculates the p-value for a correlation coefficient
 * Uses the t-distribution with n-2 degrees of freedom
 * 
 * Formula: t = r × √((n-2) / (1-r²))
 */
function calculateCorrelationPValue(r: number, n: number): number {
  if (n <= 2) return 1;
  if (Math.abs(r) >= 1) return 0;

  const df = n - 2;
  const t = r * Math.sqrt(df / (1 - r * r));

  // Two-tailed p-value using t-distribution approximation
  return 2 * (1 - tDistributionCDF(Math.abs(t), df));
}

/**
 * Approximation of the Student's t-distribution CDF
 */
function tDistributionCDF(t: number, df: number): number {
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
 * Normal CDF approximation
 */
function normalCDF(z: number): number {
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
 * Incomplete beta function approximation
 */
function incompleteBeta(x: number, a: number, b: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;

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

  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
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
 * Log gamma function approximation
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
 * Interprets the correlation coefficient
 */
function interpretCorrelation(r: number): {
  interpretation: string;
  strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very-strong' | 'perfect';
  direction: 'positive' | 'negative' | 'none';
} {
  const absR = Math.abs(r);
  let strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very-strong' | 'perfect';
  let interpretation: string;

  if (absR === 1) {
    strength = 'perfect';
    interpretation = 'Perfekt korrelasjon';
  } else if (absR >= 0.9) {
    strength = 'very-strong';
    interpretation = 'Svært sterk korrelasjon';
  } else if (absR >= 0.7) {
    strength = 'strong';
    interpretation = 'Sterk korrelasjon';
  } else if (absR >= 0.5) {
    strength = 'moderate';
    interpretation = 'Moderat korrelasjon';
  } else if (absR >= 0.3) {
    strength = 'weak';
    interpretation = 'Svak korrelasjon';
  } else {
    strength = 'none';
    interpretation = 'Liten eller ingen korrelasjon';
  }

  let direction: 'positive' | 'negative' | 'none';
  if (r > 0.01) {
    direction = 'positive';
    interpretation += ' (positive)';
  } else if (r < -0.01) {
    direction = 'negative';
    interpretation += ' (negative)';
  } else {
    direction = 'none';
  }

  return { interpretation, strength, direction };
}

/**
 * Formats the regression equation as a string
 */
function formatRegressionEquation(slope: number, intercept: number): string {
  const slopeStr = formatFixed(slope, 4);
  const interceptAbs = formatFixed(Math.abs(intercept), 4);
  const sign = intercept >= 0 ? '+' : '-';
  return `y = ${slopeStr}x ${sign} ${interceptAbs}`;
}

/**
 * Rounds a number to a specified number of decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Leser datapar fra tekst (ett X,Y-par per linje; norsk desimalkomma støttes)
 * 
 * @param input - String with x,y pairs
 * @returns Object with xValues and yValues arrays
 */
export function parsePairedData(input: string): CorrelationInput {
  const lines = input.trim().split(/\n/);
  const xValues: number[] = [];
  const yValues: number[] = [];

  for (const line of lines) {
    const parts = splitNumberTokens(line);
    if (parts.length >= 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (!isNaN(x) && !isNaN(y)) {
        xValues.push(x);
        yValues.push(y);
      }
    }
  }

  if (xValues.length === 0) {
    throw new Error('Fant ingen gyldige datapar');
  }

  return { xValues, yValues };
}
