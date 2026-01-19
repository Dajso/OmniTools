/**
 * BPM Calculator and Delay Time Calculator
 * 
 * Calculates BPM from tap timestamps and derives delay times for various note values.
 * 
 * @module lib/calculations/audio/bpm-calculator
 * @see Requirements 20.1, 20.2, 20.11, 20.12
 */

/**
 * Delay times for various note values in milliseconds
 */
export interface DelayTimes {
  /** Quarter note (1/4) */
  quarter: number;
  /** Eighth note (1/8) */
  eighth: number;
  /** Sixteenth note (1/16) */
  sixteenth: number;
  /** Thirty-second note (1/32) */
  thirtySecond: number;
  /** Dotted quarter note */
  dottedQuarter: number;
  /** Dotted eighth note */
  dottedEighth: number;
  /** Dotted sixteenth note */
  dottedSixteenth: number;
  /** Triplet quarter note */
  tripletQuarter: number;
  /** Triplet eighth note */
  tripletEighth: number;
  /** Triplet sixteenth note */
  tripletSixteenth: number;
}

/**
 * Complete BPM result with delay times
 */
export interface BPMResult {
  /** Beats per minute */
  bpm: number;
  /** Milliseconds per beat */
  msPerBeat: number;
  /** Delay times for various note values */
  delayTimes: DelayTimes;
}

/**
 * Configuration for BPM calculation
 */
export interface BPMCalculatorConfig {
  /** Number of recent taps to use for averaging (default: 8) */
  tapCount?: number;
  /** Minimum BPM to consider valid (default: 20) */
  minBPM?: number;
  /** Maximum BPM to consider valid (default: 300) */
  maxBPM?: number;
}

const DEFAULT_CONFIG: Required<BPMCalculatorConfig> = {
  tapCount: 8,
  minBPM: 20,
  maxBPM: 300,
};

/**
 * Calculate BPM from an array of tap timestamps
 * 
 * Uses the average interval between the last N taps to calculate BPM.
 * Formula: BPM = 60000 / average_interval_ms
 * 
 * @param tapTimestamps - Array of timestamps in milliseconds
 * @param config - Optional configuration
 * @returns Calculated BPM, or null if not enough taps
 * 
 * @example
 * ```typescript
 * const timestamps = [0, 500, 1000, 1500, 2000];
 * const bpm = calculateBPMFromTaps(timestamps);
 * // bpm = 120 (500ms between taps = 120 BPM)
 * ```
 */
export function calculateBPMFromTaps(
  tapTimestamps: number[],
  config: BPMCalculatorConfig = {}
): number | null {
  const { tapCount, minBPM, maxBPM } = { ...DEFAULT_CONFIG, ...config };

  if (tapTimestamps.length < 2) {
    return null;
  }

  // Sort timestamps to ensure chronological order
  const sortedTaps = [...tapTimestamps].sort((a, b) => a - b);

  // Use only the last N taps
  const recentTaps = sortedTaps.slice(-tapCount);

  if (recentTaps.length < 2) {
    return null;
  }

  // Calculate intervals between consecutive taps
  const intervals: number[] = [];
  for (let i = 1; i < recentTaps.length; i++) {
    const interval = recentTaps[i] - recentTaps[i - 1];
    if (interval > 0) {
      intervals.push(interval);
    }
  }

  if (intervals.length === 0) {
    return null;
  }

  // Calculate average interval
  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  if (averageInterval <= 0) {
    return null;
  }

  // Convert to BPM: 60000ms (1 minute) / interval
  const bpm = 60000 / averageInterval;

  // Validate BPM is within reasonable range
  if (bpm < minBPM || bpm > maxBPM) {
    return null;
  }

  return Math.round(bpm * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate delay times for various note values based on BPM
 * 
 * Formula: quarter_note_ms = 60000 / BPM
 * Other note values are derived proportionally.
 * 
 * @param bpm - Beats per minute
 * @returns Delay times for various note values
 * @throws Error if BPM is not positive
 * 
 * @example
 * ```typescript
 * const delays = calculateDelayTimes(120);
 * // delays.quarter = 500ms
 * // delays.eighth = 250ms
 * // delays.sixteenth = 125ms
 * ```
 */
export function calculateDelayTimes(bpm: number): DelayTimes {
  if (bpm <= 0) {
    throw new Error('BPM must be positive');
  }

  // Quarter note = 60000ms / BPM
  const quarter = 60000 / bpm;

  return {
    quarter,
    eighth: quarter / 2,
    sixteenth: quarter / 4,
    thirtySecond: quarter / 8,
    dottedQuarter: quarter * 1.5,
    dottedEighth: (quarter / 2) * 1.5,
    dottedSixteenth: (quarter / 4) * 1.5,
    tripletQuarter: quarter * (2 / 3),
    tripletEighth: (quarter / 2) * (2 / 3),
    tripletSixteenth: (quarter / 4) * (2 / 3),
  };
}

/**
 * Calculate complete BPM result with delay times
 * 
 * @param bpm - Beats per minute
 * @returns Complete BPM result with all delay times
 * @throws Error if BPM is not positive
 */
export function calculateBPMResult(bpm: number): BPMResult {
  if (bpm <= 0) {
    throw new Error('BPM must be positive');
  }

  const msPerBeat = 60000 / bpm;
  const delayTimes = calculateDelayTimes(bpm);

  return {
    bpm,
    msPerBeat,
    delayTimes,
  };
}

/**
 * Calculate BPM from milliseconds per beat
 * 
 * @param msPerBeat - Milliseconds per beat
 * @returns BPM value
 * @throws Error if msPerBeat is not positive
 */
export function bpmFromMsPerBeat(msPerBeat: number): number {
  if (msPerBeat <= 0) {
    throw new Error('Milliseconds per beat must be positive');
  }

  return 60000 / msPerBeat;
}

/**
 * Calculate reverb pre-delay time based on BPM
 * 
 * Pre-delay is typically a fraction of the beat to create space
 * before the reverb tail begins.
 * 
 * @param bpm - Beats per minute
 * @param fraction - Fraction of beat (default: 1/64 note)
 * @returns Pre-delay time in milliseconds
 */
export function calculateReverbPreDelay(bpm: number, fraction: number = 1 / 64): number {
  if (bpm <= 0) {
    throw new Error('BPM must be positive');
  }
  if (fraction <= 0 || fraction > 1) {
    throw new Error('Fraction must be between 0 and 1');
  }

  const quarterNote = 60000 / bpm;
  return quarterNote * fraction * 4; // Convert to whole note fraction
}

/**
 * Calculate reverb decay time based on BPM
 * 
 * Decay time is typically set to musical divisions to keep
 * the reverb in time with the music.
 * 
 * @param bpm - Beats per minute
 * @param beats - Number of beats for decay (default: 2)
 * @returns Decay time in milliseconds
 */
export function calculateReverbDecay(bpm: number, beats: number = 2): number {
  if (bpm <= 0) {
    throw new Error('BPM must be positive');
  }
  if (beats <= 0) {
    throw new Error('Beats must be positive');
  }

  const msPerBeat = 60000 / bpm;
  return msPerBeat * beats;
}

/**
 * Common BPM presets for various music genres
 */
export const BPM_PRESETS = {
  'hip-hop': { min: 60, max: 100, typical: 85 },
  'house': { min: 118, max: 135, typical: 128 },
  'techno': { min: 120, max: 150, typical: 135 },
  'drum-and-bass': { min: 160, max: 180, typical: 174 },
  'dubstep': { min: 130, max: 150, typical: 140 },
  'trance': { min: 125, max: 150, typical: 138 },
  'pop': { min: 100, max: 130, typical: 120 },
  'rock': { min: 110, max: 140, typical: 120 },
  'jazz': { min: 60, max: 200, typical: 120 },
  'classical': { min: 40, max: 200, typical: 100 },
} as const;

export type MusicGenre = keyof typeof BPM_PRESETS;
