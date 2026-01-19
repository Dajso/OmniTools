/**
 * Reaction Time Test Logic
 * 
 * Provides functions for measuring and analyzing reaction time,
 * including statistical analysis of multiple attempts.
 * 
 * @module lib/calculations/gaming/reaction-time
 * @see Requirements 17.3, 17.12
 */

export interface ReactionTimeResult {
  /** Reaction time in milliseconds */
  reactionTime: number;
  /** Timestamp when the test started */
  startTime: number;
  /** Timestamp when the user reacted */
  endTime: number;
  /** Whether this was a valid attempt (not too early) */
  isValid: boolean;
}

export interface ReactionTimeStats {
  /** All recorded reaction times (valid only) */
  times: number[];
  /** Average reaction time in ms */
  average: number;
  /** Best (fastest) reaction time in ms */
  best: number;
  /** Worst (slowest) reaction time in ms */
  worst: number;
  /** Median reaction time in ms */
  median: number;
  /** Standard deviation in ms */
  standardDeviation: number;
  /** Number of valid attempts */
  validAttempts: number;
  /** Number of invalid attempts (too early) */
  invalidAttempts: number;
  /** Classification based on average */
  classification: ReactionTimeClassification;
}

export type ReactionTimeClassification = 
  | 'exceptional'
  | 'excellent'
  | 'good'
  | 'average'
  | 'below-average'
  | 'slow';

/**
 * Reaction time classification thresholds (in milliseconds)
 * Based on human reaction time research
 */
export const REACTION_TIME_THRESHOLDS = {
  exceptional: 150,  // < 150ms
  excellent: 200,    // 150-200ms
  good: 250,         // 200-250ms
  average: 300,      // 250-300ms
  belowAverage: 400, // 300-400ms
  // > 400ms is considered slow
} as const;

/**
 * Minimum delay before showing stimulus (to prevent anticipation)
 */
export const MIN_DELAY_MS = 1000;

/**
 * Maximum delay before showing stimulus
 */
export const MAX_DELAY_MS = 5000;

/**
 * Generate a random delay for the reaction time test
 * 
 * @returns Random delay in milliseconds between MIN_DELAY_MS and MAX_DELAY_MS
 */
export function generateRandomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

/**
 * Calculate reaction time from start and end timestamps
 * 
 * @param startTime - Timestamp when stimulus was shown
 * @param endTime - Timestamp when user reacted
 * @returns Reaction time result
 */
export function calculateReactionTime(startTime: number, endTime: number): ReactionTimeResult {
  const reactionTime = endTime - startTime;
  const isValid = reactionTime > 0;

  return {
    reactionTime: isValid ? reactionTime : 0,
    startTime,
    endTime,
    isValid,
  };
}

/**
 * Classify a reaction time into a category
 * 
 * @param reactionTime - Reaction time in milliseconds
 * @returns Classification string
 */
export function classifyReactionTime(reactionTime: number): ReactionTimeClassification {
  if (reactionTime < REACTION_TIME_THRESHOLDS.exceptional) return 'exceptional';
  if (reactionTime < REACTION_TIME_THRESHOLDS.excellent) return 'excellent';
  if (reactionTime < REACTION_TIME_THRESHOLDS.good) return 'good';
  if (reactionTime < REACTION_TIME_THRESHOLDS.average) return 'average';
  if (reactionTime < REACTION_TIME_THRESHOLDS.belowAverage) return 'below-average';
  return 'slow';
}

/**
 * Get description for a reaction time classification
 * 
 * @param classification - Reaction time classification
 * @returns Description string
 */
export function getClassificationDescription(classification: ReactionTimeClassification): string {
  switch (classification) {
    case 'exceptional':
      return 'Exceptional! Your reaction time is among the fastest. Pro gamer level!';
    case 'excellent':
      return 'Excellent! Your reaction time is well above average.';
    case 'good':
      return 'Good! Your reaction time is above average.';
    case 'average':
      return 'Average reaction time. Most people fall in this range.';
    case 'below-average':
      return 'Below average. Practice can help improve your reaction time.';
    case 'slow':
      return 'Slower than average. Consider factors like fatigue or distractions.';
  }
}

/**
 * Calculate the average of an array of numbers
 * 
 * @param numbers - Array of numbers
 * @returns Average value
 */
function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Calculate the median of an array of numbers
 * 
 * @param numbers - Array of numbers
 * @returns Median value
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate the standard deviation of an array of numbers
 * 
 * @param numbers - Array of numbers
 * @param average - Pre-calculated average (optional)
 * @returns Standard deviation
 */
function calculateStandardDeviation(numbers: number[], average?: number): number {
  if (numbers.length === 0) return 0;
  
  const avg = average ?? calculateAverage(numbers);
  const squaredDiffs = numbers.map(n => Math.pow(n - avg, 2));
  const avgSquaredDiff = calculateAverage(squaredDiffs);
  
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate statistics from multiple reaction time attempts
 * 
 * @param results - Array of reaction time results
 * @returns Statistical analysis of the results
 */
export function calculateReactionTimeStats(results: ReactionTimeResult[]): ReactionTimeStats {
  const validResults = results.filter(r => r.isValid);
  const times = validResults.map(r => r.reactionTime);
  
  if (times.length === 0) {
    return {
      times: [],
      average: 0,
      best: 0,
      worst: 0,
      median: 0,
      standardDeviation: 0,
      validAttempts: 0,
      invalidAttempts: results.length,
      classification: 'slow',
    };
  }

  const average = calculateAverage(times);
  const best = Math.min(...times);
  const worst = Math.max(...times);
  const median = calculateMedian(times);
  const standardDeviation = calculateStandardDeviation(times, average);
  const classification = classifyReactionTime(average);

  return {
    times,
    average,
    best,
    worst,
    median,
    standardDeviation,
    validAttempts: validResults.length,
    invalidAttempts: results.length - validResults.length,
    classification,
  };
}

/**
 * Calculate rolling average from the last N attempts
 * 
 * @param results - Array of reaction time results
 * @param n - Number of recent attempts to include (default: 8)
 * @returns Rolling average in milliseconds
 */
export function calculateRollingAverage(results: ReactionTimeResult[], n: number = 8): number {
  const validResults = results.filter(r => r.isValid);
  const recentResults = validResults.slice(-n);
  
  if (recentResults.length === 0) return 0;
  
  return calculateAverage(recentResults.map(r => r.reactionTime));
}

/**
 * Check if a reaction was too early (before stimulus)
 * 
 * @param reactionTime - Reaction time in milliseconds
 * @returns True if the reaction was too early
 */
export function isTooEarly(reactionTime: number): boolean {
  return reactionTime < 0;
}

/**
 * Get percentile rank for a reaction time
 * Based on general population data
 * 
 * @param reactionTime - Reaction time in milliseconds
 * @returns Percentile (0-100, higher is better/faster)
 */
export function getPercentileRank(reactionTime: number): number {
  // Approximate percentile based on normal distribution
  // Mean ~250ms, SD ~50ms for visual reaction time
  const mean = 250;
  const sd = 50;
  
  // Z-score
  const z = (mean - reactionTime) / sd;
  
  // Convert to percentile using approximation of normal CDF
  // Using a simple approximation: percentile ≈ 50 + 50 * erf(z / sqrt(2))
  const percentile = 50 * (1 + erf(z / Math.sqrt(2)));
  
  return Math.max(0, Math.min(100, percentile));
}

/**
 * Error function approximation for percentile calculation
 */
function erf(x: number): number {
  // Approximation of the error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
