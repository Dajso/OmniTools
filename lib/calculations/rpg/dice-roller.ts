/**
 * Dice Roller
 * 
 * Supports standard dice notation like "2d6+3", "1d20", "4d6-2"
 * Provides individual die results and total sum.
 * 
 * @module lib/calculations/rpg/dice-roller
 * @see Requirements 21.1, 21.11
 */

/**
 * Result of a dice roll
 */
export interface DiceRoll {
  /** Original dice notation (e.g., "2d6+3") */
  dice: string;
  /** Individual die results */
  results: number[];
  /** Modifier value (positive or negative) */
  modifier: number;
  /** Total sum of all dice plus modifier */
  total: number;
  /** Number of dice rolled */
  numDice: number;
  /** Number of faces on each die */
  faces: number;
}

/**
 * Parsed dice notation
 */
export interface ParsedDiceNotation {
  numDice: number;
  faces: number;
  modifier: number;
}

/**
 * Standard dice types commonly used in tabletop RPGs
 */
export const STANDARD_DICE = [4, 6, 8, 10, 12, 20, 100] as const;
export type StandardDie = typeof STANDARD_DICE[number];

/**
 * Parse dice notation string into components
 * 
 * Supports formats:
 * - "d6" or "D6" (1d6)
 * - "2d6" (2 six-sided dice)
 * - "2d6+3" (2d6 with +3 modifier)
 * - "2d6-2" (2d6 with -2 modifier)
 * - "d20+5" (1d20 with +5 modifier)
 * 
 * @param notation - Dice notation string
 * @returns Parsed notation components
 * @throws Error if notation is invalid
 */
export function parseDiceNotation(notation: string): ParsedDiceNotation {
  // Remove whitespace and convert to lowercase
  const cleaned = notation.replace(/\s/g, '').toLowerCase();
  
  // Match pattern: [num]d<faces>[+/-modifier]
  const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  
  if (!match) {
    throw new Error(`Invalid dice notation: "${notation}". Expected format like "2d6+3" or "d20"`);
  }
  
  const [, numStr, facesStr, modStr] = match;
  
  const numDice = numStr === '' ? 1 : parseInt(numStr, 10);
  const faces = parseInt(facesStr, 10);
  const modifier = modStr ? parseInt(modStr, 10) : 0;
  
  if (numDice < 1) {
    throw new Error('Number of dice must be at least 1');
  }
  
  if (numDice > 100) {
    throw new Error('Number of dice cannot exceed 100');
  }
  
  if (faces < 2) {
    throw new Error('Dice must have at least 2 faces');
  }
  
  if (faces > 1000) {
    throw new Error('Dice cannot have more than 1000 faces');
  }
  
  return { numDice, faces, modifier };
}

/**
 * Roll a single die with the specified number of faces
 * 
 * @param faces - Number of faces on the die
 * @returns Random value between 1 and faces (inclusive)
 */
export function rollSingleDie(faces: number): number {
  if (faces < 2) {
    throw new Error('Dice must have at least 2 faces');
  }
  return Math.floor(Math.random() * faces) + 1;
}

/**
 * Roll multiple dice and return individual results
 * 
 * @param numDice - Number of dice to roll
 * @param faces - Number of faces on each die
 * @returns Array of individual die results
 */
export function rollMultipleDice(numDice: number, faces: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < numDice; i++) {
    results.push(rollSingleDie(faces));
  }
  return results;
}

/**
 * Roll dice using standard notation
 * 
 * @param notation - Dice notation string (e.g., "2d6+3")
 * @returns Complete roll result with individual dice and total
 * 
 * @example
 * ```typescript
 * const result = rollDice("2d6+3");
 * // result.results might be [4, 5]
 * // result.total would be 12 (4 + 5 + 3)
 * ```
 */
export function rollDice(notation: string): DiceRoll {
  const parsed = parseDiceNotation(notation);
  const results = rollMultipleDice(parsed.numDice, parsed.faces);
  const diceSum = results.reduce((sum, val) => sum + val, 0);
  
  return {
    dice: notation,
    results,
    modifier: parsed.modifier,
    total: diceSum + parsed.modifier,
    numDice: parsed.numDice,
    faces: parsed.faces,
  };
}

/**
 * Roll 4d6 and drop the lowest die (common method for D&D stat generation)
 * 
 * @returns Object with all four dice results, dropped die, and final total
 * 
 * @example
 * ```typescript
 * const result = roll4d6DropLowest();
 * // result.allRolls might be [3, 5, 4, 6]
 * // result.dropped would be 3
 * // result.kept would be [5, 4, 6]
 * // result.total would be 15
 * ```
 */
export function roll4d6DropLowest(): {
  allRolls: number[];
  dropped: number;
  kept: number[];
  total: number;
} {
  const allRolls = rollMultipleDice(4, 6);
  const sorted = [...allRolls].sort((a, b) => a - b);
  const dropped = sorted[0];
  const kept = sorted.slice(1);
  const total = kept.reduce((sum, val) => sum + val, 0);
  
  return {
    allRolls,
    dropped,
    kept,
    total,
  };
}

/**
 * Generate a complete set of D&D ability scores using 4d6 drop lowest
 * 
 * @returns Array of 6 ability scores
 */
export function generateAbilityScores(): number[] {
  const scores: number[] = [];
  for (let i = 0; i < 6; i++) {
    scores.push(roll4d6DropLowest().total);
  }
  return scores;
}

/**
 * Calculate the minimum possible roll for a dice notation
 * 
 * @param notation - Dice notation string
 * @returns Minimum possible total
 */
export function getMinRoll(notation: string): number {
  const parsed = parseDiceNotation(notation);
  return parsed.numDice + parsed.modifier; // Each die minimum is 1
}

/**
 * Calculate the maximum possible roll for a dice notation
 * 
 * @param notation - Dice notation string
 * @returns Maximum possible total
 */
export function getMaxRoll(notation: string): number {
  const parsed = parseDiceNotation(notation);
  return (parsed.numDice * parsed.faces) + parsed.modifier;
}

/**
 * Calculate the average (expected) roll for a dice notation
 * 
 * @param notation - Dice notation string
 * @returns Expected average roll
 */
export function getAverageRoll(notation: string): number {
  const parsed = parseDiceNotation(notation);
  // Average of a single die is (1 + faces) / 2
  const avgPerDie = (1 + parsed.faces) / 2;
  return (parsed.numDice * avgPerDie) + parsed.modifier;
}

/**
 * Format a dice roll result for display
 * 
 * @param roll - Dice roll result
 * @returns Formatted string showing individual dice and total
 * 
 * @example
 * ```typescript
 * formatRollResult({ dice: "2d6+3", results: [4, 5], modifier: 3, total: 12 })
 * // Returns: "2d6+3: [4, 5] + 3 = 12"
 * ```
 */
export function formatRollResult(roll: DiceRoll): string {
  const diceStr = `[${roll.results.join(', ')}]`;
  
  if (roll.modifier === 0) {
    return `${roll.dice}: ${diceStr} = ${roll.total}`;
  }
  
  const modStr = roll.modifier > 0 ? `+ ${roll.modifier}` : `- ${Math.abs(roll.modifier)}`;
  return `${roll.dice}: ${diceStr} ${modStr} = ${roll.total}`;
}
