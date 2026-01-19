/**
 * Odds Converter
 * 
 * Converts between American, Decimal, and Fractional odds formats.
 * 
 * @module lib/calculations/betting/odds-converter
 * @see Requirements 27.1, 27.9
 */

export type OddsFormat = 'american' | 'decimal' | 'fractional';

export interface OddsConversionResult {
  american: number;
  decimal: number;
  fractional: string;
  impliedProbability: number;
  formattedAmerican: string;
  formattedDecimal: string;
  formattedFractional: string;
  formattedProbability: string;
}

/**
 * Convert American odds to decimal
 */
export function americanToDecimal(american: number): number {
  if (american > 0) {
    return (american / 100) + 1;
  } else {
    return (100 / Math.abs(american)) + 1;
  }
}

/**
 * Convert decimal odds to American
 */
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return (decimal - 1) * 100;
  } else {
    return -100 / (decimal - 1);
  }
}

/**
 * Convert decimal odds to fractional string
 */
export function decimalToFractional(decimal: number): string {
  const profit = decimal - 1;
  
  // Common fractional odds
  const commonFractions: [number, string][] = [
    [0.1, '1/10'], [0.2, '1/5'], [0.25, '1/4'], [0.33, '1/3'],
    [0.4, '2/5'], [0.5, '1/2'], [0.6, '3/5'], [0.67, '2/3'],
    [0.8, '4/5'], [1, '1/1'], [1.2, '6/5'], [1.5, '3/2'],
    [2, '2/1'], [2.5, '5/2'], [3, '3/1'], [4, '4/1'],
    [5, '5/1'], [6, '6/1'], [7, '7/1'], [8, '8/1'],
    [9, '9/1'], [10, '10/1'], [11, '11/1'], [12, '12/1'],
    [14, '14/1'], [16, '16/1'], [20, '20/1'], [25, '25/1'],
    [33, '33/1'], [50, '50/1'], [100, '100/1'],
  ];
  
  // Find closest common fraction
  let closest = commonFractions[0];
  let minDiff = Math.abs(profit - closest[0]);
  
  for (const [value, fraction] of commonFractions) {
    const diff = Math.abs(profit - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = [value, fraction];
    }
  }
  
  // If close enough to a common fraction, use it
  if (minDiff < 0.05) {
    return closest[1];
  }
  
  // Otherwise, calculate exact fraction
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const numerator = Math.round(profit * 100);
  const denominator = 100;
  const divisor = gcd(numerator, denominator);
  
  return `${numerator / divisor}/${denominator / divisor}`;
}

/**
 * Parse fractional odds string to decimal
 */
export function fractionalToDecimal(fractional: string): number {
  const parts = fractional.split('/');
  if (parts.length !== 2) throw new Error('Invalid fractional format');
  
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    throw new Error('Invalid fractional odds');
  }
  
  return (numerator / denominator) + 1;
}

/**
 * Calculate implied probability from decimal odds
 */
export function decimalToImpliedProbability(decimal: number): number {
  return (1 / decimal) * 100;
}


/**
 * Convert odds from any format to all formats
 */
export function convertOdds(
  value: number | string,
  fromFormat: OddsFormat
): OddsConversionResult {
  let decimal: number;
  
  switch (fromFormat) {
    case 'american':
      if (typeof value !== 'number') throw new Error('American odds must be a number');
      if (value === 0) throw new Error('American odds cannot be zero');
      decimal = americanToDecimal(value);
      break;
    case 'decimal':
      if (typeof value !== 'number') throw new Error('Decimal odds must be a number');
      if (value <= 1) throw new Error('Decimal odds must be greater than 1');
      decimal = value;
      break;
    case 'fractional':
      if (typeof value !== 'string') throw new Error('Fractional odds must be a string');
      decimal = fractionalToDecimal(value);
      break;
    default:
      throw new Error('Invalid odds format');
  }
  
  const american = decimalToAmerican(decimal);
  const fractional = decimalToFractional(decimal);
  const impliedProbability = decimalToImpliedProbability(decimal);
  
  return {
    american,
    decimal,
    fractional,
    impliedProbability,
    formattedAmerican: american > 0 ? `+${american.toFixed(0)}` : american.toFixed(0),
    formattedDecimal: decimal.toFixed(2),
    formattedFractional: fractional,
    formattedProbability: `${impliedProbability.toFixed(1)}%`,
  };
}

/**
 * Calculate potential payout
 */
export function calculatePayout(stake: number, decimalOdds: number): {
  payout: number;
  profit: number;
} {
  const payout = stake * decimalOdds;
  const profit = payout - stake;
  return { payout, profit };
}
