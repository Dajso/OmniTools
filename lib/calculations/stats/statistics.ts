/**
 * Descriptive Statistics Calculator
 * Calculates mean, median, mode, standard deviation, variance, and other statistics
 * 
 * @module lib/calculations/stats/statistics
 * @see Requirements 29.3
 */

export interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  count: number;
  sum: number;
  populationStandardDeviation: number;
  populationVariance: number;
}

/**
 * Calculates the arithmetic mean of a dataset
 * 
 * Formula: mean = Σx / n
 * 
 * @param data - Array of numbers
 * @returns The arithmetic mean
 */
export function calculateMean(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate mean of empty dataset');
  }
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * Calculates the median of a dataset
 * 
 * @param data - Array of numbers
 * @returns The median value
 */
export function calculateMedian(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate median of empty dataset');
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculates the mode(s) of a dataset
 * Returns all values that appear most frequently
 * 
 * @param data - Array of numbers
 * @returns Array of mode values
 */
export function calculateMode(data: number[]): number[] {
  if (data.length === 0) {
    throw new Error('Cannot calculate mode of empty dataset');
  }
  
  const frequency: Map<number, number> = new Map();
  let maxFreq = 0;
  
  for (const value of data) {
    const count = (frequency.get(value) || 0) + 1;
    frequency.set(value, count);
    if (count > maxFreq) {
      maxFreq = count;
    }
  }
  
  // If all values appear only once, there's no mode
  if (maxFreq === 1) {
    return [];
  }
  
  const modes: number[] = [];
  for (const [value, count] of frequency) {
    if (count === maxFreq) {
      modes.push(value);
    }
  }
  
  return modes.sort((a, b) => a - b);
}

/**
 * Calculates the sample variance of a dataset
 * Uses Bessel's correction (n-1 denominator)
 * 
 * Formula: s² = Σ(x - mean)² / (n - 1)
 * 
 * @param data - Array of numbers
 * @returns The sample variance
 */
export function calculateVariance(data: number[]): number {
  if (data.length < 2) {
    throw new Error('Cannot calculate sample variance with fewer than 2 data points');
  }
  
  const mean = calculateMean(data);
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
  
  return sumSquaredDiffs / (data.length - 1);
}

/**
 * Calculates the population variance of a dataset
 * 
 * Formula: σ² = Σ(x - mean)² / n
 * 
 * @param data - Array of numbers
 * @returns The population variance
 */
export function calculatePopulationVariance(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Cannot calculate variance of empty dataset');
  }
  
  const mean = calculateMean(data);
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
  
  return sumSquaredDiffs / data.length;
}

/**
 * Calculates the sample standard deviation of a dataset
 * Uses Bessel's correction (n-1 denominator)
 * 
 * Formula: s = √(Σ(x - mean)² / (n - 1))
 * 
 * @param data - Array of numbers
 * @returns The sample standard deviation
 */
export function calculateStandardDeviation(data: number[]): number {
  return Math.sqrt(calculateVariance(data));
}

/**
 * Calculates the population standard deviation of a dataset
 * 
 * Formula: σ = √(Σ(x - mean)² / n)
 * 
 * @param data - Array of numbers
 * @returns The population standard deviation
 */
export function calculatePopulationStandardDeviation(data: number[]): number {
  return Math.sqrt(calculatePopulationVariance(data));
}

/**
 * Calculates all descriptive statistics for a dataset
 * 
 * @param data - Array of numbers
 * @returns DescriptiveStats object with all calculated statistics
 */
export function calculateDescriptiveStats(data: number[]): DescriptiveStats {
  if (data.length === 0) {
    throw new Error('Cannot calculate statistics for empty dataset');
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / data.length;
  
  // Calculate median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  
  // Calculate mode
  const mode = calculateMode(data);
  
  // Calculate variance and standard deviation
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
  
  const populationVariance = sumSquaredDiffs / data.length;
  const populationStandardDeviation = Math.sqrt(populationVariance);
  
  // Sample variance and standard deviation (with Bessel's correction)
  const variance = data.length > 1 ? sumSquaredDiffs / (data.length - 1) : 0;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    mean: roundToDecimal(mean, 6),
    median: roundToDecimal(median, 6),
    mode,
    standardDeviation: roundToDecimal(standardDeviation, 6),
    variance: roundToDecimal(variance, 6),
    populationStandardDeviation: roundToDecimal(populationStandardDeviation, 6),
    populationVariance: roundToDecimal(populationVariance, 6),
    min,
    max,
    range: max - min,
    count: data.length,
    sum: roundToDecimal(sum, 6),
  };
}

/**
 * Rounds a number to a specified number of decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Parses a string of numbers (comma, space, or newline separated) into an array
 * 
 * @param input - String containing numbers
 * @returns Array of parsed numbers
 */
export function parseNumberList(input: string): number[] {
  const numbers = input
    .split(/[,\s\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => parseFloat(s));
  
  const invalidIndex = numbers.findIndex(n => isNaN(n));
  if (invalidIndex !== -1) {
    throw new Error(`Invalid number at position ${invalidIndex + 1}`);
  }
  
  return numbers;
}
