/**
 * Moon Phase Calculator
 * 
 * Calculates the moon phase for any given date using astronomical algorithms.
 * The lunar cycle (synodic month) is approximately 29.53 days.
 * 
 * Requirements: 19.2
 */

/**
 * Average length of a synodic month (lunar cycle) in days
 */
export const SYNODIC_MONTH = 29.530588853;

/**
 * Known new moon date for reference (January 6, 2000 at 18:14 UTC)
 * This is used as a reference point for calculating moon phases
 */
export const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));

/**
 * Moon phase names
 */
export type MoonPhaseName =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

/**
 * Result of a moon phase calculation
 */
export interface MoonPhase {
  phase: MoonPhaseName;
  phaseName: string;
  illumination: number; // 0-100 percentage
  age: number; // days since new moon (0-29.53)
  emoji: string;
}

/**
 * Phase boundaries as fractions of the lunar cycle
 */
const PHASE_BOUNDARIES = {
  new: 0.0,
  'waxing-crescent': 0.0625,
  'first-quarter': 0.25,
  'waxing-gibbous': 0.3125,
  full: 0.5,
  'waning-gibbous': 0.5625,
  'last-quarter': 0.75,
  'waning-crescent': 0.8125,
  end: 1.0,
};

/**
 * Human-readable phase names
 */
const PHASE_NAMES: Record<MoonPhaseName, string> = {
  'new': 'New Moon',
  'waxing-crescent': 'Waxing Crescent',
  'first-quarter': 'First Quarter',
  'waxing-gibbous': 'Waxing Gibbous',
  'full': 'Full Moon',
  'waning-gibbous': 'Waning Gibbous',
  'last-quarter': 'Last Quarter',
  'waning-crescent': 'Waning Crescent',
};

/**
 * Emoji representations for each phase
 */
const PHASE_EMOJIS: Record<MoonPhaseName, string> = {
  'new': '🌑',
  'waxing-crescent': '🌒',
  'first-quarter': '🌓',
  'waxing-gibbous': '🌔',
  'full': '🌕',
  'waning-gibbous': '🌖',
  'last-quarter': '🌗',
  'waning-crescent': '🌘',
};


/**
 * Calculates the moon's age (days since last new moon) for a given date
 * 
 * @param date - The date to calculate for
 * @returns The moon's age in days (0 to ~29.53)
 */
export function getMoonAge(date: Date): number {
  const diffMs = date.getTime() - KNOWN_NEW_MOON.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  // Get the position within the current lunar cycle
  let age = diffDays % SYNODIC_MONTH;
  
  // Handle negative values (dates before the reference)
  if (age < 0) {
    age += SYNODIC_MONTH;
  }
  
  return Math.round(age * 100) / 100;
}

/**
 * Calculates the moon's illumination percentage
 * Uses a cosine function to model the illumination curve
 * 
 * @param age - The moon's age in days
 * @returns Illumination percentage (0-100)
 */
export function getIllumination(age: number): number {
  // Illumination follows a cosine curve
  // At new moon (age=0), illumination is 0%
  // At full moon (age=14.77), illumination is 100%
  const phase = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2 * 100;
  
  return Math.round(illumination * 100) / 100;
}

/**
 * Determines the moon phase name from the moon's age
 * 
 * @param age - The moon's age in days
 * @returns The phase name
 */
export function getPhaseName(age: number): MoonPhaseName {
  const phase = age / SYNODIC_MONTH;
  
  if (phase < PHASE_BOUNDARIES['waxing-crescent']) return 'new';
  if (phase < PHASE_BOUNDARIES['first-quarter']) return 'waxing-crescent';
  if (phase < PHASE_BOUNDARIES['waxing-gibbous']) return 'first-quarter';
  if (phase < PHASE_BOUNDARIES['full']) return 'waxing-gibbous';
  if (phase < PHASE_BOUNDARIES['waning-gibbous']) return 'full';
  if (phase < PHASE_BOUNDARIES['last-quarter']) return 'waning-gibbous';
  if (phase < PHASE_BOUNDARIES['waning-crescent']) return 'last-quarter';
  return 'waning-crescent';
}

/**
 * Calculates the complete moon phase information for a given date
 * 
 * @param date - The date to calculate for
 * @returns Complete moon phase information
 */
export function getMoonPhase(date: Date): MoonPhase {
  const age = getMoonAge(date);
  const phase = getPhaseName(age);
  const illumination = getIllumination(age);
  
  return {
    phase,
    phaseName: PHASE_NAMES[phase],
    illumination,
    age,
    emoji: PHASE_EMOJIS[phase],
  };
}

/**
 * Finds the next occurrence of a specific moon phase
 * 
 * @param phase - The phase to find
 * @param startDate - The date to start searching from
 * @returns The date of the next occurrence
 */
export function getNextPhase(phase: MoonPhaseName, startDate: Date = new Date()): Date {
  const targetPhaseStart = PHASE_BOUNDARIES[phase];
  const currentAge = getMoonAge(startDate);
  const currentPhase = currentAge / SYNODIC_MONTH;
  
  let daysUntilPhase: number;
  
  if (currentPhase < targetPhaseStart) {
    // Phase is later in this cycle
    daysUntilPhase = (targetPhaseStart - currentPhase) * SYNODIC_MONTH;
  } else {
    // Phase is in the next cycle
    daysUntilPhase = (1 - currentPhase + targetPhaseStart) * SYNODIC_MONTH;
  }
  
  const nextDate = new Date(startDate);
  nextDate.setTime(nextDate.getTime() + daysUntilPhase * 24 * 60 * 60 * 1000);
  
  return nextDate;
}

/**
 * Gets moon phase data for a range of dates
 * Useful for creating calendars or charts
 * 
 * @param startDate - Start of the range
 * @param days - Number of days to include
 * @returns Array of moon phase data for each day
 */
export function getMoonPhaseRange(startDate: Date, days: number): MoonPhase[] {
  const results: MoonPhase[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    results.push(getMoonPhase(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return results;
}
