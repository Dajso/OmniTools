/**
 * RPG Stat Roller
 * 
 * Provides various methods for generating character ability scores
 * commonly used in tabletop RPGs like D&D.
 * 
 * @module lib/calculations/rpg/stat-roller
 * @see Requirements 21.3
 */

import { rollMultipleDice, roll4d6DropLowest } from './dice-roller';

/**
 * Standard D&D ability score names
 */
export const ABILITY_SCORES = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
] as const;

export type AbilityScore = typeof ABILITY_SCORES[number];

/**
 * Result of a single ability score roll
 */
export interface AbilityRollResult {
  ability: AbilityScore;
  allRolls: number[];
  dropped: number;
  kept: number[];
  total: number;
}

/**
 * Complete character stat block
 */
export interface CharacterStats {
  rolls: AbilityRollResult[];
  totals: Record<AbilityScore, number>;
  totalPoints: number;
  modifier: Record<AbilityScore, number>;
}

/**
 * Stat generation method
 */
export type StatMethod = '4d6-drop-lowest' | '3d6-straight' | 'standard-array' | 'point-buy';

/**
 * Standard array values (D&D 5e)
 */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/**
 * Point buy costs (D&D 5e)
 */
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

/**
 * Default point buy budget
 */
export const POINT_BUY_BUDGET = 27;

/**
 * Calculate ability modifier from score
 * 
 * @param score - Ability score (typically 1-30)
 * @returns Modifier value
 * 
 * @example
 * ```typescript
 * calculateModifier(10) // returns 0
 * calculateModifier(14) // returns 2
 * calculateModifier(8)  // returns -1
 * ```
 */
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Generate ability scores using 4d6 drop lowest method
 * 
 * @returns Complete character stats with all ability scores
 */
export function rollStats4d6DropLowest(): CharacterStats {
  const rolls: AbilityRollResult[] = [];
  const totals: Record<string, number> = {};
  const modifier: Record<string, number> = {};
  
  for (const ability of ABILITY_SCORES) {
    const result = roll4d6DropLowest();
    rolls.push({
      ability,
      allRolls: result.allRolls,
      dropped: result.dropped,
      kept: result.kept,
      total: result.total,
    });
    totals[ability] = result.total;
    modifier[ability] = calculateModifier(result.total);
  }
  
  const totalPoints = Object.values(totals).reduce((sum, val) => sum + val, 0);
  
  return {
    rolls,
    totals: totals as Record<AbilityScore, number>,
    totalPoints,
    modifier: modifier as Record<AbilityScore, number>,
  };
}

/**
 * Generate ability scores using 3d6 straight method
 * 
 * @returns Complete character stats with all ability scores
 */
export function rollStats3d6Straight(): CharacterStats {
  const rolls: AbilityRollResult[] = [];
  const totals: Record<string, number> = {};
  const modifier: Record<string, number> = {};
  
  for (const ability of ABILITY_SCORES) {
    const diceRolls = rollMultipleDice(3, 6);
    const total = diceRolls.reduce((sum, val) => sum + val, 0);
    
    rolls.push({
      ability,
      allRolls: diceRolls,
      dropped: 0,
      kept: diceRolls,
      total,
    });
    totals[ability] = total;
    modifier[ability] = calculateModifier(total);
  }
  
  const totalPoints = Object.values(totals).reduce((sum, val) => sum + val, 0);
  
  return {
    rolls,
    totals: totals as Record<AbilityScore, number>,
    totalPoints,
    modifier: modifier as Record<AbilityScore, number>,
  };
}

/**
 * Get standard array stats
 * 
 * @returns Character stats using standard array
 */
export function getStandardArrayStats(): CharacterStats {
  const rolls: AbilityRollResult[] = [];
  const totals: Record<string, number> = {};
  const modifier: Record<string, number> = {};
  
  for (let i = 0; i < ABILITY_SCORES.length; i++) {
    const ability = ABILITY_SCORES[i];
    const total = STANDARD_ARRAY[i];
    
    rolls.push({
      ability,
      allRolls: [total],
      dropped: 0,
      kept: [total],
      total,
    });
    totals[ability] = total;
    modifier[ability] = calculateModifier(total);
  }
  
  const totalPoints = Object.values(totals).reduce((sum, val) => sum + val, 0);
  
  return {
    rolls,
    totals: totals as Record<AbilityScore, number>,
    totalPoints,
    modifier: modifier as Record<AbilityScore, number>,
  };
}

/**
 * Calculate point buy cost for a set of ability scores
 * 
 * @param scores - Array of 6 ability scores
 * @returns Total point cost
 */
export function calculatePointBuyCost(scores: number[]): number {
  let total = 0;
  for (const score of scores) {
    if (score < 8 || score > 15) {
      throw new Error(`Verdien ${score} er utenfor poengkjøpets område (8–15)`);
    }
    total += POINT_BUY_COSTS[score];
  }
  return total;
}

/**
 * Validate point buy scores
 * 
 * @param scores - Array of 6 ability scores
 * @returns Validation result
 */
export function validatePointBuy(scores: number[]): {
  isValid: boolean;
  cost: number;
  remaining: number;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (scores.length !== 6) {
    errors.push('Må ha nøyaktig 6 egenskapsverdier');
  }
  
  for (const score of scores) {
    if (score < 8) {
      errors.push(`Score ${score} is below minimum (8)`);
    }
    if (score > 15) {
      errors.push(`Score ${score} is above maximum (15)`);
    }
  }
  
  let cost = 0;
  try {
    cost = calculatePointBuyCost(scores);
  } catch {
    // Already handled in errors
  }
  
  if (cost > POINT_BUY_BUDGET) {
    errors.push(`Total cost (${cost}) exceeds budget (${POINT_BUY_BUDGET})`);
  }
  
  return {
    isValid: errors.length === 0,
    cost,
    remaining: POINT_BUY_BUDGET - cost,
    errors,
  };
}

/**
 * Generate stats using specified method
 * 
 * @param method - Stat generation method
 * @returns Character stats
 */
export function generateStats(method: StatMethod): CharacterStats {
  switch (method) {
    case '4d6-drop-lowest':
      return rollStats4d6DropLowest();
    case '3d6-straight':
      return rollStats3d6Straight();
    case 'standard-array':
      return getStandardArrayStats();
    case 'point-buy':
      // Return default point buy (all 8s)
      const defaultScores = [8, 8, 8, 8, 8, 8];
      const rolls: AbilityRollResult[] = [];
      const totals: Record<string, number> = {};
      const modifier: Record<string, number> = {};
      
      for (let i = 0; i < ABILITY_SCORES.length; i++) {
        const ability = ABILITY_SCORES[i];
        const total = defaultScores[i];
        
        rolls.push({
          ability,
          allRolls: [total],
          dropped: 0,
          kept: [total],
          total,
        });
        totals[ability] = total;
        modifier[ability] = calculateModifier(total);
      }
      
      return {
        rolls,
        totals: totals as Record<AbilityScore, number>,
        totalPoints: 48,
        modifier: modifier as Record<AbilityScore, number>,
      };
    default:
      throw new Error(`Ukjent metode for egenskapskast: ${method}`);
  }
}

/**
 * Format modifier for display (e.g., "+2" or "-1")
 * 
 * @param mod - Modifier value
 * @returns Formatted string
 */
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Get a summary of character stats
 * 
 * @param stats - Character stats
 * @returns Formatted summary string
 */
export function formatStatsSummary(stats: CharacterStats): string {
  const lines: string[] = [];
  
  for (const roll of stats.rolls) {
    const mod = formatModifier(stats.modifier[roll.ability]);
    lines.push(`${roll.ability}: ${roll.total} (${mod})`);
  }
  
  lines.push(`Total: ${stats.totalPoints}`);
  
  return lines.join('\n');
}
