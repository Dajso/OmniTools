/**
 * Dice Probability Calculator
 * Calculates probabilities for various dice roll outcomes
 * 
 * @module lib/calculations/stats/dice-probability-calculator
 * @see Requirements 29.5
 */

import { formatFixed } from '@/lib/utils/formatting';

export interface DiceProbabilityInput {
  numDice: number;
  numSides: number;
  targetSum?: number;
  comparison?: 'exact' | 'at-least' | 'at-most';
}

export interface DiceProbabilityResult {
  probability: number;
  percentage: string;
  odds: string;
  favorableOutcomes: number;
  totalOutcomes: number;
  distribution: { sum: number; probability: number; count: number }[];
  statistics: {
    mean: number;
    standardDeviation: number;
    min: number;
    max: number;
  };
}

/**
 * Calculates the probability distribution for rolling multiple dice
 * Uses dynamic programming for efficiency
 */
export function calculateDiceDistribution(
  numDice: number,
  numSides: number
): Map<number, number> {
  if (numDice < 1 || numDice > 20) {
    throw new Error('Antall terninger må være mellom 1 og 20');
  }

  if (numSides < 2 || numSides > 100) {
    throw new Error('Antall sider må være mellom 2 og 100');
  }

  let dp = new Map<number, number>();
  
  for (let i = 1; i <= numSides; i++) {
    dp.set(i, 1);
  }

  for (let die = 2; die <= numDice; die++) {
    const newDp = new Map<number, number>();
    
    for (const [sum, count] of dp) {
      for (let face = 1; face <= numSides; face++) {
        const newSum = sum + face;
        newDp.set(newSum, (newDp.get(newSum) || 0) + count);
      }
    }
    
    dp = newDp;
  }

  return dp;
}


/**
 * Calculates dice probability for a specific target or range
 */
export function calculateDiceProbability(input: DiceProbabilityInput): DiceProbabilityResult {
  const { numDice, numSides, targetSum, comparison = 'exact' } = input;

  const distribution = calculateDiceDistribution(numDice, numSides);
  const totalOutcomes = Math.pow(numSides, numDice);

  const minSum = numDice;
  const maxSum = numDice * numSides;

  // Build distribution array
  const distributionArray: { sum: number; probability: number; count: number }[] = [];
  for (let sum = minSum; sum <= maxSum; sum++) {
    const count = distribution.get(sum) || 0;
    distributionArray.push({
      sum,
      probability: count / totalOutcomes,
      count,
    });
  }

  // Calculate statistics
  const mean = numDice * (numSides + 1) / 2;
  const variance = numDice * (numSides * numSides - 1) / 12;
  const standardDeviation = Math.sqrt(variance);

  // Calculate probability for target sum if specified
  let favorableOutcomes = 0;
  let probability = 0;

  if (targetSum !== undefined) {
    if (targetSum < minSum || targetSum > maxSum) {
      probability = 0;
      favorableOutcomes = 0;
    } else {
      switch (comparison) {
        case 'exact':
          favorableOutcomes = distribution.get(targetSum) || 0;
          break;
        case 'at-least':
          for (let sum = targetSum; sum <= maxSum; sum++) {
            favorableOutcomes += distribution.get(sum) || 0;
          }
          break;
        case 'at-most':
          for (let sum = minSum; sum <= targetSum; sum++) {
            favorableOutcomes += distribution.get(sum) || 0;
          }
          break;
      }
      probability = favorableOutcomes / totalOutcomes;
    }
  } else {
    favorableOutcomes = totalOutcomes;
    probability = 1;
  }

  // Format odds
  const odds = formatOdds(probability);

  return {
    probability: roundToDecimal(probability, 6),
    percentage: formatFixed(probability * 100, 2) + ' %',
    odds,
    favorableOutcomes,
    totalOutcomes,
    distribution: distributionArray,
    statistics: {
      mean: roundToDecimal(mean, 4),
      standardDeviation: roundToDecimal(standardDeviation, 4),
      min: minSum,
      max: maxSum,
    },
  };
}

/**
 * Formats probability as odds (e.g., "1 in 6")
 */
function formatOdds(probability: number): string {
  if (probability === 0) return 'Impossible';
  if (probability === 1) return 'Certain';
  
  const oneIn = Math.round(1 / probability);
  return `1 in ${oneIn}`;
}

/**
 * Calculates probability of rolling at least one specific value
 */
export function probabilityOfAtLeastOne(
  numDice: number,
  numSides: number,
  targetValue: number
): number {
  if (targetValue < 1 || targetValue > numSides) {
    return 0;
  }
  
  // P(at least one) = 1 - P(none)
  const probNone = Math.pow((numSides - 1) / numSides, numDice);
  return 1 - probNone;
}

/**
 * Calculates probability of rolling all same value (Yahtzee-style)
 */
export function probabilityOfAllSame(numDice: number, numSides: number): number {
  // First die can be anything, rest must match
  return Math.pow(1 / numSides, numDice - 1);
}

/**
 * Calculates probability of rolling a straight (consecutive values)
 */
export function probabilityOfStraight(
  numDice: number,
  numSides: number,
  straightLength: number
): number {
  if (straightLength > numDice || straightLength > numSides) {
    return 0;
  }

  // Number of possible straights
  const numStraights = numSides - straightLength + 1;
  
  // For each straight, calculate ways to achieve it
  // This is a simplified calculation for small straights
  const totalOutcomes = Math.pow(numSides, numDice);
  
  // Exact calculation is complex; this is an approximation
  // for the case where numDice equals straightLength
  if (numDice === straightLength) {
    const favorableOutcomes = numStraights * factorial(straightLength);
    return favorableOutcomes / totalOutcomes;
  }

  // For other cases, return approximate probability
  return numStraights * factorial(straightLength) / totalOutcomes;
}

/**
 * Calculates factorial
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Rounds a number to specified decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Common dice configurations for UI
 */
export const COMMON_DICE = [
  { value: 4, label: 'd4 (4 sider)' },
  { value: 6, label: 'd6 (6 sider)' },
  { value: 8, label: 'd8 (8 sider)' },
  { value: 10, label: 'd10 (10 sider)' },
  { value: 12, label: 'd12 (12 sider)' },
  { value: 20, label: 'd20 (20 sider)' },
  { value: 100, label: 'd100 (prosentterning)' },
];

/**
 * Comparison options for UI
 */
export const COMPARISON_OPTIONS = [
  { value: 'exact', label: 'Nøyaktig' },
  { value: 'at-least', label: 'Minst' },
  { value: 'at-most', label: 'Høyst' },
];
