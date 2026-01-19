/**
 * ND Filter Calculator
 * 
 * Calculates exposure adjustments when using neutral density filters.
 * 
 * @module lib/calculations/photo/nd-filter-calculator
 * @see Requirements 23.8
 */

/**
 * ND filter with various notation systems
 */
export interface NDFilter {
  /** Filter name (e.g., "ND8", "ND 0.9") */
  name: string;
  /** Optical density (e.g., 0.3, 0.6, 0.9) */
  opticalDensity: number;
  /** Filter factor (e.g., 2, 4, 8) */
  filterFactor: number;
  /** Stops of light reduction */
  stops: number;
  /** Light transmission percentage */
  transmissionPercent: number;
}

/**
 * Common ND filters
 */
export const ND_FILTERS: NDFilter[] = [
  { name: 'ND2', opticalDensity: 0.3, filterFactor: 2, stops: 1, transmissionPercent: 50 },
  { name: 'ND4', opticalDensity: 0.6, filterFactor: 4, stops: 2, transmissionPercent: 25 },
  { name: 'ND8', opticalDensity: 0.9, filterFactor: 8, stops: 3, transmissionPercent: 12.5 },
  { name: 'ND16', opticalDensity: 1.2, filterFactor: 16, stops: 4, transmissionPercent: 6.25 },
  { name: 'ND32', opticalDensity: 1.5, filterFactor: 32, stops: 5, transmissionPercent: 3.125 },
  { name: 'ND64', opticalDensity: 1.8, filterFactor: 64, stops: 6, transmissionPercent: 1.5625 },
  { name: 'ND128', opticalDensity: 2.1, filterFactor: 128, stops: 7, transmissionPercent: 0.78125 },
  { name: 'ND256', opticalDensity: 2.4, filterFactor: 256, stops: 8, transmissionPercent: 0.390625 },
  { name: 'ND400', opticalDensity: 2.6, filterFactor: 400, stops: 8.64, transmissionPercent: 0.25 },
  { name: 'ND500', opticalDensity: 2.7, filterFactor: 500, stops: 8.97, transmissionPercent: 0.2 },
  { name: 'ND1000', opticalDensity: 3.0, filterFactor: 1000, stops: 10, transmissionPercent: 0.1 },
  { name: 'ND2000', opticalDensity: 3.3, filterFactor: 2000, stops: 11, transmissionPercent: 0.05 },
  { name: 'ND4000', opticalDensity: 3.6, filterFactor: 4000, stops: 12, transmissionPercent: 0.025 },
  { name: 'ND8000', opticalDensity: 3.9, filterFactor: 8000, stops: 13, transmissionPercent: 0.0125 },
  { name: 'ND32000', opticalDensity: 4.5, filterFactor: 32000, stops: 15, transmissionPercent: 0.003125 },
  { name: 'ND100000', opticalDensity: 5.0, filterFactor: 100000, stops: 16.6, transmissionPercent: 0.001 },
];

/**
 * Common shutter speeds in seconds
 */
export const SHUTTER_SPEEDS: number[] = [
  1/8000, 1/6400, 1/5000, 1/4000, 1/3200, 1/2500, 1/2000, 1/1600, 1/1250,
  1/1000, 1/800, 1/640, 1/500, 1/400, 1/320, 1/250, 1/200, 1/160, 1/125,
  1/100, 1/80, 1/60, 1/50, 1/40, 1/30, 1/25, 1/20, 1/15, 1/13, 1/10,
  1/8, 1/6, 1/5, 1/4, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.3, 1.6, 2, 2.5, 3,
  4, 5, 6, 8, 10, 13, 15, 20, 25, 30, 40, 50, 60, 120, 180, 240, 300,
  600, 900, 1200, 1800, 3600
];

/**
 * Input for ND filter calculation
 */
export interface NDFilterInput {
  /** Base shutter speed in seconds (without filter) */
  baseShutterSpeed: number;
  /** Number of stops to reduce (or filter factor) */
  stops?: number;
  /** Filter factor (alternative to stops) */
  filterFactor?: number;
  /** Optical density (alternative to stops) */
  opticalDensity?: number;
}

/**
 * Result of ND filter calculation
 */
export interface NDFilterResult {
  /** Base shutter speed in seconds */
  baseShutterSpeed: number;
  /** Base shutter speed formatted */
  baseShutterSpeedFormatted: string;
  /** New shutter speed with filter in seconds */
  newShutterSpeed: number;
  /** New shutter speed formatted */
  newShutterSpeedFormatted: string;
  /** Stops of light reduction */
  stops: number;
  /** Filter factor used */
  filterFactor: number;
  /** Optical density */
  opticalDensity: number;
  /** Recommended ND filter */
  recommendedFilter: NDFilter | null;
}

/**
 * Calculate new shutter speed with ND filter
 * 
 * @param input - ND filter calculation input
 * @returns ND filter calculation results
 * @throws Error if input is invalid
 * 
 * @example
 * ```typescript
 * const result = calculateNDFilterExposure({
 *   baseShutterSpeed: 1/125,
 *   stops: 10
 * });
 * // result.newShutterSpeed = 8 seconds
 * ```
 */
export function calculateNDFilterExposure(input: NDFilterInput): NDFilterResult {
  const { baseShutterSpeed, stops, filterFactor, opticalDensity } = input;
  
  if (baseShutterSpeed <= 0) {
    throw new Error('Base shutter speed must be positive');
  }
  
  // Determine stops from various inputs
  let calculatedStops: number;
  
  if (stops !== undefined) {
    calculatedStops = stops;
  } else if (filterFactor !== undefined) {
    calculatedStops = stopsFromFilterFactor(filterFactor);
  } else if (opticalDensity !== undefined) {
    calculatedStops = stopsFromOpticalDensity(opticalDensity);
  } else {
    throw new Error('Must provide stops, filterFactor, or opticalDensity');
  }
  
  if (calculatedStops < 0) {
    throw new Error('Stops must be non-negative');
  }
  
  // Calculate new shutter speed
  // Each stop doubles the exposure time
  const newShutterSpeed = baseShutterSpeed * Math.pow(2, calculatedStops);
  
  // Calculate other values
  const calculatedFilterFactor = Math.pow(2, calculatedStops);
  const calculatedOpticalDensity = calculatedStops * 0.3;
  
  // Find recommended filter
  const recommendedFilter = findClosestFilter(calculatedStops);
  
  return {
    baseShutterSpeed,
    baseShutterSpeedFormatted: formatShutterSpeed(baseShutterSpeed),
    newShutterSpeed,
    newShutterSpeedFormatted: formatShutterSpeed(newShutterSpeed),
    stops: Math.round(calculatedStops * 100) / 100,
    filterFactor: Math.round(calculatedFilterFactor),
    opticalDensity: Math.round(calculatedOpticalDensity * 100) / 100,
    recommendedFilter,
  };
}

/**
 * Calculate stops from filter factor
 * 
 * @param filterFactor - Filter factor (e.g., 8 for ND8)
 * @returns Stops of light reduction
 */
export function stopsFromFilterFactor(filterFactor: number): number {
  return Math.log2(filterFactor);
}

/**
 * Calculate stops from optical density
 * 
 * @param opticalDensity - Optical density (e.g., 0.9 for ND8)
 * @returns Stops of light reduction
 */
export function stopsFromOpticalDensity(opticalDensity: number): number {
  return opticalDensity / 0.3;
}

/**
 * Calculate filter factor from stops
 * 
 * @param stops - Stops of light reduction
 * @returns Filter factor
 */
export function filterFactorFromStops(stops: number): number {
  return Math.pow(2, stops);
}

/**
 * Calculate optical density from stops
 * 
 * @param stops - Stops of light reduction
 * @returns Optical density
 */
export function opticalDensityFromStops(stops: number): number {
  return stops * 0.3;
}


/**
 * Find the closest ND filter for a given number of stops
 * 
 * @param stops - Desired stops of light reduction
 * @returns Closest ND filter or null
 */
export function findClosestFilter(stops: number): NDFilter | null {
  if (stops <= 0) return null;
  
  let closest: NDFilter | null = null;
  let minDiff = Infinity;
  
  for (const filter of ND_FILTERS) {
    const diff = Math.abs(filter.stops - stops);
    if (diff < minDiff) {
      minDiff = diff;
      closest = filter;
    }
  }
  
  return closest;
}

/**
 * Calculate required ND filter for desired shutter speed
 * 
 * @param baseShutterSpeed - Current shutter speed in seconds
 * @param desiredShutterSpeed - Desired shutter speed in seconds
 * @returns Required stops and recommended filter
 */
export function calculateRequiredFilter(
  baseShutterSpeed: number,
  desiredShutterSpeed: number
): { stops: number; filter: NDFilter | null } {
  if (baseShutterSpeed <= 0 || desiredShutterSpeed <= 0) {
    throw new Error('Shutter speeds must be positive');
  }
  
  if (desiredShutterSpeed <= baseShutterSpeed) {
    return { stops: 0, filter: null };
  }
  
  const stops = Math.log2(desiredShutterSpeed / baseShutterSpeed);
  const filter = findClosestFilter(stops);
  
  return { stops: Math.round(stops * 100) / 100, filter };
}

/**
 * Format shutter speed for display
 * 
 * @param seconds - Shutter speed in seconds
 * @returns Formatted shutter speed string
 */
export function formatShutterSpeed(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  if (seconds >= 1) {
    if (seconds === Math.floor(seconds)) {
      return `${seconds}s`;
    }
    return `${seconds.toFixed(1)}s`;
  }
  
  // Display as fraction
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}`;
}

/**
 * Parse shutter speed string to seconds
 * 
 * @param shutterSpeed - Shutter speed string (e.g., "1/125", "2s", "1m 30s")
 * @returns Shutter speed in seconds
 */
export function parseShutterSpeed(shutterSpeed: string): number {
  const trimmed = shutterSpeed.trim().toLowerCase();
  
  // Handle fraction format (1/125)
  if (trimmed.includes('/')) {
    const [num, denom] = trimmed.split('/').map(s => parseFloat(s.replace('s', '')));
    return num / denom;
  }
  
  // Handle minutes and seconds (1m 30s)
  if (trimmed.includes('m')) {
    const parts = trimmed.match(/(\d+)m\s*(\d+)?s?/);
    if (parts) {
      const minutes = parseInt(parts[1], 10);
      const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
      return minutes * 60 + seconds;
    }
  }
  
  // Handle seconds only (2s or 2)
  return parseFloat(trimmed.replace('s', ''));
}

/**
 * Get filter by name
 * 
 * @param name - Filter name (e.g., "ND8", "ND1000")
 * @returns ND filter or undefined
 */
export function getFilterByName(name: string): NDFilter | undefined {
  return ND_FILTERS.find(f => f.name.toLowerCase() === name.toLowerCase());
}

/**
 * Calculate stacked filters
 * 
 * @param filters - Array of ND filters to stack
 * @returns Combined filter properties
 */
export function calculateStackedFilters(filters: NDFilter[]): {
  totalStops: number;
  totalFilterFactor: number;
  totalOpticalDensity: number;
} {
  const totalStops = filters.reduce((sum, f) => sum + f.stops, 0);
  const totalFilterFactor = filters.reduce((product, f) => product * f.filterFactor, 1);
  const totalOpticalDensity = filters.reduce((sum, f) => sum + f.opticalDensity, 0);
  
  return {
    totalStops: Math.round(totalStops * 100) / 100,
    totalFilterFactor: Math.round(totalFilterFactor),
    totalOpticalDensity: Math.round(totalOpticalDensity * 100) / 100,
  };
}

/**
 * Suggest filter combinations for a target number of stops
 * 
 * @param targetStops - Desired stops of light reduction
 * @param maxFilters - Maximum number of filters to stack (default: 3)
 * @returns Array of filter combinations
 */
export function suggestFilterCombinations(
  targetStops: number,
  maxFilters: number = 3
): NDFilter[][] {
  const combinations: NDFilter[][] = [];
  
  // Single filter
  const singleFilter = findClosestFilter(targetStops);
  if (singleFilter && Math.abs(singleFilter.stops - targetStops) < 0.5) {
    combinations.push([singleFilter]);
  }
  
  // Two filter combinations
  if (maxFilters >= 2) {
    for (const f1 of ND_FILTERS) {
      for (const f2 of ND_FILTERS) {
        if (f1.stops <= f2.stops) {
          const totalStops = f1.stops + f2.stops;
          if (Math.abs(totalStops - targetStops) < 0.5) {
            combinations.push([f1, f2]);
          }
        }
      }
    }
  }
  
  // Limit results
  return combinations.slice(0, 5);
}

/**
 * Common long exposure scenarios with recommended settings
 */
export const LONG_EXPOSURE_SCENARIOS = [
  { name: 'Silky Water', minSeconds: 1, maxSeconds: 5, description: 'Smooth flowing water' },
  { name: 'Misty Water', minSeconds: 5, maxSeconds: 30, description: 'Ethereal, misty water effect' },
  { name: 'Cloud Streaks', minSeconds: 30, maxSeconds: 120, description: 'Moving clouds with streaks' },
  { name: 'Star Trails', minSeconds: 300, maxSeconds: 3600, description: 'Circular star trails' },
  { name: 'Light Trails', minSeconds: 10, maxSeconds: 30, description: 'Car light trails at night' },
  { name: 'Ghost Effect', minSeconds: 2, maxSeconds: 10, description: 'Moving people become ghostly' },
];
