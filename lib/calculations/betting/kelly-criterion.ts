/**
 * Kelly Criterion Calculator
 * 
 * Calculates optimal bet sizing using the Kelly Criterion formula.
 * 
 * @module lib/calculations/betting/kelly-criterion
 * @see Requirements 27.4
 */

export interface KellyResult {
  kellyPercentage: number;
  halfKelly: number;
  quarterKelly: number;
  recommendedBet: number;
  edge: number;
  expectedValue: number;
  formattedKelly: string;
  formattedBet: string;
}

/**
 * Calculate Kelly Criterion
 * 
 * Formula: f* = (bp - q) / b
 * where:
 * - f* = fraction of bankroll to bet
 * - b = decimal odds - 1 (net odds)
 * - p = probability of winning
 * - q = probability of losing (1 - p)
 * 
 * @param decimalOdds - The decimal odds offered
 * @param winProbability - Your estimated probability of winning (0-100)
 * @param bankroll - Your total bankroll
 * @returns Kelly criterion results
 */
export function calculateKelly(
  decimalOdds: number,
  winProbability: number,
  bankroll: number
): KellyResult {
  if (decimalOdds <= 1) {
    throw new Error('Decimal odds must be greater than 1');
  }
  
  if (winProbability <= 0 || winProbability >= 100) {
    throw new Error('Win probability must be between 0 and 100');
  }
  
  if (bankroll <= 0) {
    throw new Error('Bankroll must be positive');
  }
  
  const p = winProbability / 100;
  const q = 1 - p;
  const b = decimalOdds - 1;
  
  // Kelly formula: f* = (bp - q) / b
  const kellyFraction = (b * p - q) / b;
  
  // Calculate edge (expected value per unit bet)
  const edge = (p * b) - q;
  const expectedValue = edge * 100; // As percentage
  
  // Kelly percentage (capped at 0 if negative)
  const kellyPercentage = Math.max(0, kellyFraction * 100);
  
  return {
    kellyPercentage,
    halfKelly: kellyPercentage / 2,
    quarterKelly: kellyPercentage / 4,
    recommendedBet: bankroll * (kellyPercentage / 100),
    edge: edge * 100,
    expectedValue,
    formattedKelly: `${kellyPercentage.toFixed(2)}%`,
    formattedBet: `$${(bankroll * (kellyPercentage / 100)).toFixed(2)}`,
  };
}

/**
 * Calculate fractional Kelly (more conservative)
 */
export function calculateFractionalKelly(
  decimalOdds: number,
  winProbability: number,
  bankroll: number,
  fraction: number = 0.5
): KellyResult {
  const fullKelly = calculateKelly(decimalOdds, winProbability, bankroll);
  
  return {
    ...fullKelly,
    kellyPercentage: fullKelly.kellyPercentage * fraction,
    recommendedBet: fullKelly.recommendedBet * fraction,
    formattedKelly: `${(fullKelly.kellyPercentage * fraction).toFixed(2)}%`,
    formattedBet: `$${(fullKelly.recommendedBet * fraction).toFixed(2)}`,
  };
}
