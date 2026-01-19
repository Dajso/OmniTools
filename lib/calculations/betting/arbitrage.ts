/**
 * Arbitrage Calculator
 * 
 * Detects and calculates arbitrage opportunities (surebets).
 * 
 * @module lib/calculations/betting/arbitrage
 * @see Requirements 27.2
 */

import { americanToDecimal } from './odds-converter';

export interface ArbitrageOutcome {
  name: string;
  odds: number;
  format: 'american' | 'decimal';
  stake?: number;
  payout?: number;
}

export interface ArbitrageResult {
  isArbitrage: boolean;
  totalImpliedProbability: number;
  profitPercentage: number;
  stakes: { name: string; stake: number; payout: number }[];
  guaranteedProfit: number;
  formattedProfit: string;
}

/**
 * Calculate arbitrage opportunity
 * 
 * @param outcomes - Array of outcomes with odds
 * @param totalStake - Total amount to bet
 * @returns Arbitrage analysis
 */
export function calculateArbitrage(
  outcomes: ArbitrageOutcome[],
  totalStake: number
): ArbitrageResult {
  if (outcomes.length < 2) {
    throw new Error('Need at least 2 outcomes');
  }
  
  if (totalStake <= 0) {
    throw new Error('Total stake must be positive');
  }
  
  // Convert all odds to decimal
  const decimalOdds = outcomes.map(o => 
    o.format === 'american' ? americanToDecimal(o.odds) : o.odds
  );
  
  // Calculate total implied probability
  const totalImpliedProbability = decimalOdds.reduce(
    (sum, odds) => sum + (1 / odds),
    0
  ) * 100;
  
  // Arbitrage exists if total implied probability < 100%
  const isArbitrage = totalImpliedProbability < 100;
  
  // Calculate profit percentage
  const profitPercentage = isArbitrage 
    ? ((100 / totalImpliedProbability) - 1) * 100
    : 0;
  
  // Calculate optimal stakes for each outcome
  const stakes = outcomes.map((outcome, i) => {
    const odds = decimalOdds[i];
    const impliedProb = 1 / odds;
    const stake = (totalStake * impliedProb) / (totalImpliedProbability / 100);
    const payout = stake * odds;
    
    return {
      name: outcome.name || `Outcome ${i + 1}`,
      stake,
      payout,
    };
  });
  
  // Calculate guaranteed profit (same for all outcomes if arbitrage exists)
  const guaranteedProfit = isArbitrage 
    ? stakes[0].payout - totalStake
    : 0;
  
  return {
    isArbitrage,
    totalImpliedProbability,
    profitPercentage,
    stakes,
    guaranteedProfit,
    formattedProfit: isArbitrage 
      ? `$${guaranteedProfit.toFixed(2)} (${profitPercentage.toFixed(2)}%)`
      : 'No arbitrage',
  };
}

/**
 * Calculate hold/vig percentage
 */
export function calculateHold(decimalOdds: number[]): number {
  const totalImplied = decimalOdds.reduce((sum, odds) => sum + (1 / odds), 0);
  return (totalImplied - 1) * 100;
}
