/**
 * Biorhythm Calculator
 * 
 * Calculates biorhythm values based on birth date using sine wave calculations.
 * The three cycles are:
 * - Physical: 23-day cycle
 * - Emotional: 28-day cycle
 * - Intellectual: 33-day cycle
 * 
 * Values range from -100 to +100, representing the percentage of the cycle.
 * 
 * Requirements: 19.4, 19.11
 */

/**
 * Cycle lengths in days for each biorhythm type
 */
export const CYCLE_LENGTHS = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
} as const;

/**
 * Minimum and maximum biorhythm values
 */
export const BIORHYTHM_MIN = -100;
export const BIORHYTHM_MAX = 100;

/**
 * Result of a biorhythm calculation for a single date
 */
export interface BiorhythmResult {
  date: Date;
  physical: number;    // -100 to 100
  emotional: number;   // -100 to 100
  intellectual: number; // -100 to 100
  daysSinceBirth: number;
}

/**
 * Calculates the number of days between two dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates a single biorhythm value using the sine wave formula
 * 
 * Formula: value = 100 * sin(2π * daysSinceBirth / cyclePeriod)
 * 
 * @param daysSinceBirth - Number of days since birth
 * @param cyclePeriod - The period of the cycle in days
 * @returns A value between -100 and 100
 */
export function calculateBiorhythmValue(daysSinceBirth: number, cyclePeriod: number): number {
  const value = 100 * Math.sin((2 * Math.PI * daysSinceBirth) / cyclePeriod);
  // Round to 2 decimal places
  return Math.round(value * 100) / 100;
}

/**
 * Calculates biorhythm values for a specific date
 * 
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate biorhythm for
 * @returns BiorhythmResult with all three cycle values
 */
export function calculateBiorhythm(birthDate: Date, targetDate: Date): BiorhythmResult {
  const daysSinceBirth = daysBetween(birthDate, targetDate);
  
  return {
    date: new Date(targetDate),
    physical: calculateBiorhythmValue(daysSinceBirth, CYCLE_LENGTHS.physical),
    emotional: calculateBiorhythmValue(daysSinceBirth, CYCLE_LENGTHS.emotional),
    intellectual: calculateBiorhythmValue(daysSinceBirth, CYCLE_LENGTHS.intellectual),
    daysSinceBirth,
  };
}


/**
 * Generates biorhythm data for a range of days
 * Useful for creating charts
 * 
 * @param birthDate - The person's birth date
 * @param days - Number of days to generate (centered on today)
 * @param centerDate - The center date for the range (defaults to today)
 * @returns Array of BiorhythmResult for each day in the range
 */
export function getBiorhythmChart(
  birthDate: Date,
  days: number = 30,
  centerDate: Date = new Date()
): BiorhythmResult[] {
  const results: BiorhythmResult[] = [];
  const halfDays = Math.floor(days / 2);
  
  for (let i = -halfDays; i <= halfDays; i++) {
    const targetDate = new Date(centerDate);
    targetDate.setDate(targetDate.getDate() + i);
    results.push(calculateBiorhythm(birthDate, targetDate));
  }
  
  return results;
}

/**
 * Determines the phase description for a biorhythm value
 * 
 * @param value - The biorhythm value (-100 to 100)
 * @returns A description of the current phase
 */
export function getBiorhythmPhase(value: number): string {
  if (value > 75) return 'Peak';
  if (value > 25) return 'High';
  if (value > -25) return 'Neutral';
  if (value > -75) return 'Low';
  return 'Critical';
}

/**
 * Calculates critical days (when cycles cross zero)
 * Critical days are considered unstable periods
 * 
 * @param birthDate - The person's birth date
 * @param startDate - Start of the range to check
 * @param endDate - End of the range to check
 * @returns Array of dates that are critical days
 */
export function getCriticalDays(
  birthDate: Date,
  startDate: Date,
  endDate: Date
): { date: Date; cycles: ('physical' | 'emotional' | 'intellectual')[] }[] {
  const criticalDays: { date: Date; cycles: ('physical' | 'emotional' | 'intellectual')[] }[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const result = calculateBiorhythm(birthDate, currentDate);
    const criticalCycles: ('physical' | 'emotional' | 'intellectual')[] = [];
    
    // A day is critical if the value is very close to zero (crossing point)
    if (Math.abs(result.physical) < 5) criticalCycles.push('physical');
    if (Math.abs(result.emotional) < 5) criticalCycles.push('emotional');
    if (Math.abs(result.intellectual) < 5) criticalCycles.push('intellectual');
    
    if (criticalCycles.length > 0) {
      criticalDays.push({
        date: new Date(currentDate),
        cycles: criticalCycles,
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return criticalDays;
}
