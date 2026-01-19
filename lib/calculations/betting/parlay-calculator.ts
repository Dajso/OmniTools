/**
 * Parlay Calculator
 * 
 * Calculates combined odds for multi-bet parlays.
 * 
 * @module lib/calculations/betting/parlay-calculator
 * @see Requirements 27.5, 27.10
 */

import { americanToDecimal, decimalToAmerican, decimalToImpliedProbability } from './odds-converter';

export interface ParlayLeg {
  name?: string;
  odds: number;
  format: 'american' | 'decimal';
}

export interface ParlayResult {
  combinedDecimalOdds: number;
  combinedAmericanOdds: number;
  impliedProbability: number;
  potentialPayout: number;
  potentialProfit: number;
  formattedOdds: string;
  formattedPayout: string;
  formattedProfit: string;
  legs: { name: string; decimalOdds: number; probability: number }[];
}

/**
 * Calculate parlay odds and payout
 * 
 * @param legs - Array of parlay legs with odds
 * @param stake - Bet amount
 * @returns Combined odds and payout information
 */
export function calculateParlay(legs: ParlayLeg[], stake: number): ParlayResult {
  if (legs.length < 2) {
    throw new Error('Parlay must have at least 2 legs');
  }
  
  if (stake <= 0) {
    throw new Error('Stake must be positive');
  }
  
  // Convert all odds to decimal and multiply
  let combinedDecimalOdds = 1;
  const processedLegs: { name: string; decimalOdds: number; probability: number }[] = [];
  
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const decimalOdds = leg.format === 'american' 
      ? americanToDecimal(leg.odds)
      : leg.odds;
    
    if (decimalOdds <= 1) {
      throw new Error(`Invalid odds for leg ${i + 1}`);
    }
    
    combinedDecimalOdds *= decimalOdds;
    processedLegs.push({
      name: leg.name || `Leg ${i + 1}`,
      decimalOdds,
      probability: decimalToImpliedProbability(decimalOdds),
    });
  }
  
  const combinedAmericanOdds = decimalToAmerican(combinedDecimalOdds);
  const impliedProbability = decimalToImpliedProbability(combinedDecimalOdds);
  const potentialPayout = stake * combinedDecimalOdds;
  const potentialProfit = potentialPayout - stake;
  
  return {
    combinedDecimalOdds,
    combinedAmericanOdds,
    impliedProbability,
    potentialPayout,
    potentialProfit,
    formattedOdds: combinedAmericanOdds > 0 
      ? `+${combinedAmericanOdds.toFixed(0)}`
      : combinedAmericanOdds.toFixed(0),
    formattedPayout: `$${potentialPayout.toFixed(2)}`,
    formattedProfit: `$${potentialProfit.toFixed(2)}`,
    legs: processedLegs,
  };
}

/**
 * Calculate true parlay odds (without vig)
 */
export function calculateTrueParlay(probabilities: number[]): number {
  const combinedProbability = probabilities.reduce((acc, p) => acc * (p / 100), 1);
  return 1 / combinedProbability;
}
