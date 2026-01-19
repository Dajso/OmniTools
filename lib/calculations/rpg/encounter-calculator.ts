/**
 * Encounter Difficulty Calculator
 * 
 * Calculates encounter difficulty based on party level and monster CR
 * using D&D 5e encounter building rules.
 * 
 * @module lib/calculations/rpg/encounter-calculator
 * @see Requirements 21.5
 */

/**
 * XP thresholds by character level for each difficulty
 * Based on D&D 5e DMG encounter building rules
 */
export const XP_THRESHOLDS: Record<number, { easy: number; medium: number; hard: number; deadly: number }> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

/**
 * XP values by Challenge Rating
 */
export const CR_XP_VALUES: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

/**
 * Encounter multipliers based on number of monsters
 */
export const ENCOUNTER_MULTIPLIERS: { minMonsters: number; maxMonsters: number; multiplier: number }[] = [
  { minMonsters: 1, maxMonsters: 1, multiplier: 1 },
  { minMonsters: 2, maxMonsters: 2, multiplier: 1.5 },
  { minMonsters: 3, maxMonsters: 6, multiplier: 2 },
  { minMonsters: 7, maxMonsters: 10, multiplier: 2.5 },
  { minMonsters: 11, maxMonsters: 14, multiplier: 3 },
  { minMonsters: 15, maxMonsters: Infinity, multiplier: 4 },
];

/**
 * Encounter difficulty levels
 */
export type DifficultyLevel = 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';

/**
 * Party member definition
 */
export interface PartyMember {
  level: number;
  count?: number;
}

/**
 * Monster definition
 */
export interface Monster {
  cr: string;
  count: number;
  name?: string;
}

/**
 * Encounter calculation result
 */
export interface EncounterResult {
  difficulty: DifficultyLevel;
  totalXP: number;
  adjustedXP: number;
  multiplier: number;
  partyThresholds: {
    easy: number;
    medium: number;
    hard: number;
    deadly: number;
  };
  xpPerPlayer: number;
  monsters: { cr: string; count: number; xp: number; totalXP: number }[];
}

/**
 * Get XP value for a Challenge Rating
 * 
 * @param cr - Challenge Rating (e.g., "1/4", "5", "10")
 * @returns XP value
 */
export function getCRXP(cr: string): number {
  const xp = CR_XP_VALUES[cr];
  if (xp === undefined) {
    throw new Error(`Unknown Challenge Rating: ${cr}`);
  }
  return xp;
}

/**
 * Get encounter multiplier based on number of monsters
 * 
 * @param monsterCount - Total number of monsters
 * @param partySize - Number of party members (affects multiplier for small/large parties)
 * @returns Multiplier value
 */
export function getEncounterMultiplier(monsterCount: number, partySize: number = 4): number {
  // Find base multiplier
  let baseMultiplier = 1;
  for (const range of ENCOUNTER_MULTIPLIERS) {
    if (monsterCount >= range.minMonsters && monsterCount <= range.maxMonsters) {
      baseMultiplier = range.multiplier;
      break;
    }
  }
  
  // Adjust for party size
  // Small parties (1-2): increase multiplier by one step
  // Large parties (6+): decrease multiplier by one step
  if (partySize <= 2) {
    const currentIndex = ENCOUNTER_MULTIPLIERS.findIndex(r => r.multiplier === baseMultiplier);
    if (currentIndex < ENCOUNTER_MULTIPLIERS.length - 1) {
      baseMultiplier = ENCOUNTER_MULTIPLIERS[currentIndex + 1].multiplier;
    }
  } else if (partySize >= 6) {
    const currentIndex = ENCOUNTER_MULTIPLIERS.findIndex(r => r.multiplier === baseMultiplier);
    if (currentIndex > 0) {
      baseMultiplier = ENCOUNTER_MULTIPLIERS[currentIndex - 1].multiplier;
    }
  }
  
  return baseMultiplier;
}

/**
 * Calculate party XP thresholds
 * 
 * @param party - Array of party members with levels
 * @returns Combined thresholds for the party
 */
export function calculatePartyThresholds(party: PartyMember[]): {
  easy: number;
  medium: number;
  hard: number;
  deadly: number;
} {
  let easy = 0;
  let medium = 0;
  let hard = 0;
  let deadly = 0;
  
  for (const member of party) {
    const count = member.count || 1;
    const level = Math.min(Math.max(member.level, 1), 20); // Clamp to 1-20
    const thresholds = XP_THRESHOLDS[level];
    
    easy += thresholds.easy * count;
    medium += thresholds.medium * count;
    hard += thresholds.hard * count;
    deadly += thresholds.deadly * count;
  }
  
  return { easy, medium, hard, deadly };
}

/**
 * Determine difficulty level based on adjusted XP and thresholds
 * 
 * @param adjustedXP - Adjusted XP value
 * @param thresholds - Party thresholds
 * @returns Difficulty level
 */
export function getDifficultyLevel(
  adjustedXP: number,
  thresholds: { easy: number; medium: number; hard: number; deadly: number }
): DifficultyLevel {
  if (adjustedXP >= thresholds.deadly) {
    return 'deadly';
  } else if (adjustedXP >= thresholds.hard) {
    return 'hard';
  } else if (adjustedXP >= thresholds.medium) {
    return 'medium';
  } else if (adjustedXP >= thresholds.easy) {
    return 'easy';
  } else {
    return 'trivial';
  }
}

/**
 * Calculate encounter difficulty
 * 
 * @param party - Array of party members
 * @param monsters - Array of monsters in the encounter
 * @returns Complete encounter calculation result
 * 
 * @example
 * ```typescript
 * const result = calculateEncounter(
 *   [{ level: 5, count: 4 }],
 *   [{ cr: '3', count: 2 }]
 * );
 * // result.difficulty might be 'hard'
 * ```
 */
export function calculateEncounter(party: PartyMember[], monsters: Monster[]): EncounterResult {
  // Calculate party size
  const partySize = party.reduce((sum, member) => sum + (member.count || 1), 0);
  
  // Calculate party thresholds
  const partyThresholds = calculatePartyThresholds(party);
  
  // Calculate monster XP
  let totalXP = 0;
  let totalMonsterCount = 0;
  const monsterDetails: { cr: string; count: number; xp: number; totalXP: number }[] = [];
  
  for (const monster of monsters) {
    const xp = getCRXP(monster.cr);
    const monsterTotalXP = xp * monster.count;
    totalXP += monsterTotalXP;
    totalMonsterCount += monster.count;
    
    monsterDetails.push({
      cr: monster.cr,
      count: monster.count,
      xp,
      totalXP: monsterTotalXP,
    });
  }
  
  // Get multiplier and calculate adjusted XP
  const multiplier = getEncounterMultiplier(totalMonsterCount, partySize);
  const adjustedXP = Math.floor(totalXP * multiplier);
  
  // Determine difficulty
  const difficulty = getDifficultyLevel(adjustedXP, partyThresholds);
  
  // Calculate XP per player (using base XP, not adjusted)
  const xpPerPlayer = partySize > 0 ? Math.floor(totalXP / partySize) : 0;
  
  return {
    difficulty,
    totalXP,
    adjustedXP,
    multiplier,
    partyThresholds,
    xpPerPlayer,
    monsters: monsterDetails,
  };
}

/**
 * Get recommended CR for a party
 * 
 * @param party - Array of party members
 * @param difficulty - Target difficulty level
 * @returns Recommended CR string
 */
export function getRecommendedCR(party: PartyMember[], difficulty: DifficultyLevel = 'medium'): string {
  const thresholds = calculatePartyThresholds(party);
  const targetXP = thresholds[difficulty === 'trivial' ? 'easy' : difficulty];
  
  // Find CR that matches target XP (for single monster)
  const crEntries = Object.entries(CR_XP_VALUES);
  let closestCR = '0';
  let closestDiff = Infinity;
  
  for (const [cr, xp] of crEntries) {
    const diff = Math.abs(xp - targetXP);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestCR = cr;
    }
  }
  
  return closestCR;
}

/**
 * Format difficulty for display with color hint
 * 
 * @param difficulty - Difficulty level
 * @returns Object with label and color
 */
export function formatDifficulty(difficulty: DifficultyLevel): { label: string; color: string } {
  switch (difficulty) {
    case 'trivial':
      return { label: 'Trivial', color: 'gray' };
    case 'easy':
      return { label: 'Easy', color: 'green' };
    case 'medium':
      return { label: 'Medium', color: 'yellow' };
    case 'hard':
      return { label: 'Hard', color: 'orange' };
    case 'deadly':
      return { label: 'Deadly', color: 'red' };
  }
}
