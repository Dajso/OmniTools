/**
 * Love Compatibility Calculator
 * 
 * Calculates love compatibility based on names using various
 * fun algorithms including the classic "FLAMES" method and
 * name numerology.
 * 
 * Requirements: 19.1
 */

/**
 * Compatibility result
 */
export interface LoveCompatibilityResult {
  name1: string;
  name2: string;
  percentage: number;
  flamesResult: FlamesResult;
  numerologyMatch: number;
  description: string;
  advice: string;
}

/**
 * FLAMES result type
 */
export type FlamesResult = 'friends' | 'lovers' | 'affection' | 'marriage' | 'enemies' | 'siblings';

/**
 * FLAMES meanings
 */
const FLAMES_MEANINGS: Record<FlamesResult, { label: string; description: string }> = {
  friends: {
    label: 'Friends',
    description: 'You two make great friends! Your bond is built on trust and mutual respect.',
  },
  lovers: {
    label: 'Lovers',
    description: 'Passionate romance is in the stars! You share a deep romantic connection.',
  },
  affection: {
    label: 'Affection',
    description: 'There is genuine affection between you. A warm and caring relationship.',
  },
  marriage: {
    label: 'Marriage',
    description: 'Wedding bells may be ringing! You have strong potential for a lasting union.',
  },
  enemies: {
    label: 'Enemies',
    description: 'Opposites attract... or repel! There may be some tension to work through.',
  },
  siblings: {
    label: 'Siblings',
    description: 'You share a sibling-like bond. Comfortable and familiar with each other.',
  },
};

/**
 * Compatibility descriptions based on percentage ranges
 */
const COMPATIBILITY_DESCRIPTIONS: { min: number; max: number; description: string; advice: string }[] = [
  {
    min: 90,
    max: 100,
    description: 'Soulmate connection! You two are incredibly compatible.',
    advice: 'Cherish this rare connection and nurture it with love and understanding.',
  },
  {
    min: 75,
    max: 89,
    description: 'Excellent match! You complement each other beautifully.',
    advice: 'Keep communication open and continue to grow together.',
  },
  {
    min: 60,
    max: 74,
    description: 'Good compatibility! You have a solid foundation for a relationship.',
    advice: 'Focus on your shared interests and be patient with differences.',
  },
  {
    min: 45,
    max: 59,
    description: 'Moderate compatibility. With effort, this can work well.',
    advice: 'Embrace your differences as opportunities to learn from each other.',
  },
  {
    min: 30,
    max: 44,
    description: 'Some challenges ahead, but love can overcome obstacles.',
    advice: 'Work on understanding each other\'s perspectives and needs.',
  },
  {
    min: 0,
    max: 29,
    description: 'Opposites attract! This relationship will require extra effort.',
    advice: 'Focus on building trust and finding common ground.',
  },
];


/**
 * Normalizes a name for comparison
 * Removes spaces, converts to lowercase, removes non-alphabetic characters
 * 
 * @param name - The name to normalize
 * @returns Normalized name
 */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Calculates FLAMES result
 * Classic algorithm: Remove common letters, count remaining, cycle through FLAMES
 * 
 * @param name1 - First name
 * @param name2 - Second name
 * @returns FLAMES result
 */
export function calculateFlames(name1: string, name2: string): FlamesResult {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  // Count letter frequencies for each name
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  
  for (const char of normalized1) {
    freq1[char] = (freq1[char] || 0) + 1;
  }
  
  for (const char of normalized2) {
    freq2[char] = (freq2[char] || 0) + 1;
  }
  
  // Count remaining letters after removing common ones
  let remainingCount = 0;
  
  const allLetters = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  for (const letter of allLetters) {
    const count1 = freq1[letter] || 0;
    const count2 = freq2[letter] || 0;
    remainingCount += Math.abs(count1 - count2);
  }
  
  // If no remaining letters, use total length
  if (remainingCount === 0) {
    remainingCount = normalized1.length + normalized2.length;
  }
  
  // FLAMES array
  const flames: FlamesResult[] = ['friends', 'lovers', 'affection', 'marriage', 'enemies', 'siblings'];
  let currentFlames = [...flames];
  
  // Eliminate letters until one remains
  let index = 0;
  while (currentFlames.length > 1) {
    index = (index + remainingCount - 1) % currentFlames.length;
    currentFlames.splice(index, 1);
  }
  
  return currentFlames[0];
}

/**
 * Calculates a numerology-based compatibility score
 * 
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Compatibility score (0-100)
 */
export function calculateNumerologyCompatibility(name1: string, name2: string): number {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  // Letter values (Pythagorean system)
  const letterValues: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  };
  
  // Calculate name values
  let value1 = 0;
  let value2 = 0;
  
  for (const char of normalized1) {
    value1 += letterValues[char] || 0;
  }
  
  for (const char of normalized2) {
    value2 += letterValues[char] || 0;
  }
  
  // Reduce to single digits
  while (value1 > 9) {
    value1 = String(value1).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  
  while (value2 > 9) {
    value2 = String(value2).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  
  // Calculate compatibility based on number relationships
  const diff = Math.abs(value1 - value2);
  const sum = value1 + value2;
  
  // Base score from difference (closer numbers = higher compatibility)
  let score = 100 - (diff * 10);
  
  // Bonus for complementary numbers
  if (sum === 9 || sum === 18) score += 10;
  if (value1 === value2) score += 15;
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates a hash-based percentage for fun
 * Creates a deterministic but seemingly random percentage
 * 
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Percentage (0-100)
 */
export function calculateHashPercentage(name1: string, name2: string): number {
  const combined = normalizeName(name1) + normalizeName(name2);
  const sorted = combined.split('').sort().join('');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < sorted.length; i++) {
    const char = sorted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to percentage (0-100)
  return Math.abs(hash % 101);
}

/**
 * Gets description and advice based on compatibility percentage
 * 
 * @param percentage - Compatibility percentage
 * @returns Description and advice
 */
function getCompatibilityText(percentage: number): { description: string; advice: string } {
  for (const range of COMPATIBILITY_DESCRIPTIONS) {
    if (percentage >= range.min && percentage <= range.max) {
      return { description: range.description, advice: range.advice };
    }
  }
  return COMPATIBILITY_DESCRIPTIONS[COMPATIBILITY_DESCRIPTIONS.length - 1];
}

/**
 * Calculates complete love compatibility
 * 
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Complete compatibility result
 */
export function calculateLoveCompatibility(name1: string, name2: string): LoveCompatibilityResult {
  const flamesResult = calculateFlames(name1, name2);
  const numerologyMatch = calculateNumerologyCompatibility(name1, name2);
  const hashPercentage = calculateHashPercentage(name1, name2);
  
  // Combine scores for final percentage
  // Weight: 40% numerology, 30% hash, 30% FLAMES bonus
  const flamesBonus: Record<FlamesResult, number> = {
    lovers: 100,
    marriage: 95,
    affection: 80,
    friends: 70,
    siblings: 50,
    enemies: 30,
  };
  
  const percentage = Math.round(
    (numerologyMatch * 0.4) +
    (hashPercentage * 0.3) +
    (flamesBonus[flamesResult] * 0.3)
  );
  
  const { description, advice } = getCompatibilityText(percentage);
  
  return {
    name1,
    name2,
    percentage,
    flamesResult,
    numerologyMatch,
    description,
    advice,
  };
}

/**
 * Gets the FLAMES meaning
 * 
 * @param result - FLAMES result
 * @returns Label and description
 */
export function getFlamesMeaning(result: FlamesResult): { label: string; description: string } {
  return FLAMES_MEANINGS[result];
}
