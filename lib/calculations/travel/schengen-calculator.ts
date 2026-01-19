/**
 * Schengen Visa Calculator
 * Implements the 90/180 day sliding window rule for Schengen visa
 * 
 * The Schengen rule allows a maximum of 90 days within any 180-day period.
 * This calculator uses a sliding window algorithm to determine:
 * - Days used in the current 180-day window
 * - Days remaining before mandatory exit
 * - Whether an overstay has occurred
 * 
 * @module lib/calculations/travel/schengen-calculator
 * @see Requirements 16.1, 16.10
 */

export interface TravelPeriod {
  entryDate: Date;
  exitDate: Date;
}

export interface SchengenResult {
  daysUsed: number;
  daysRemaining: number;
  mustExitBy: Date | null;
  isOverstay: boolean;
  timeline: { date: Date; daysInSchengen: number }[];
}

export interface SchengenCountry {
  code: string;
  name: string;
  isSchengen: boolean;
}

/**
 * List of Schengen Area countries
 */
export const SCHENGEN_COUNTRIES: SchengenCountry[] = [
  { code: 'AT', name: 'Austria', isSchengen: true },
  { code: 'BE', name: 'Belgium', isSchengen: true },
  { code: 'HR', name: 'Croatia', isSchengen: true },
  { code: 'CZ', name: 'Czech Republic', isSchengen: true },
  { code: 'DK', name: 'Denmark', isSchengen: true },
  { code: 'EE', name: 'Estonia', isSchengen: true },
  { code: 'FI', name: 'Finland', isSchengen: true },
  { code: 'FR', name: 'France', isSchengen: true },
  { code: 'DE', name: 'Germany', isSchengen: true },
  { code: 'GR', name: 'Greece', isSchengen: true },
  { code: 'HU', name: 'Hungary', isSchengen: true },
  { code: 'IS', name: 'Iceland', isSchengen: true },
  { code: 'IT', name: 'Italy', isSchengen: true },
  { code: 'LV', name: 'Latvia', isSchengen: true },
  { code: 'LI', name: 'Liechtenstein', isSchengen: true },
  { code: 'LT', name: 'Lithuania', isSchengen: true },
  { code: 'LU', name: 'Luxembourg', isSchengen: true },
  { code: 'MT', name: 'Malta', isSchengen: true },
  { code: 'NL', name: 'Netherlands', isSchengen: true },
  { code: 'NO', name: 'Norway', isSchengen: true },
  { code: 'PL', name: 'Poland', isSchengen: true },
  { code: 'PT', name: 'Portugal', isSchengen: true },
  { code: 'SK', name: 'Slovakia', isSchengen: true },
  { code: 'SI', name: 'Slovenia', isSchengen: true },
  { code: 'ES', name: 'Spain', isSchengen: true },
  { code: 'SE', name: 'Sweden', isSchengen: true },
  { code: 'CH', name: 'Switzerland', isSchengen: true },
];

const MAX_DAYS = 90;
const WINDOW_DAYS = 180;

/**
 * Calculates the number of days between two dates (inclusive of both days)
 */
export function daysBetween(start: Date, end: Date): number {
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const diffTime = endTime - startTime;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Adds days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtracts days from a date
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Normalizes a date to midnight UTC
 */
function normalizeDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * Checks if a date falls within a travel period
 */
function isDateInPeriod(date: Date, period: TravelPeriod): boolean {
  const normalizedDate = normalizeDate(date);
  const normalizedEntry = normalizeDate(period.entryDate);
  const normalizedExit = normalizeDate(period.exitDate);
  
  return normalizedDate >= normalizedEntry && normalizedDate <= normalizedExit;
}

/**
 * Counts days spent in Schengen area within a 180-day window ending on checkDate
 * 
 * @param travelHistory - Array of travel periods in Schengen area
 * @param checkDate - The date to check (end of the 180-day window)
 * @returns Number of days spent in Schengen during the window
 */
export function slidingWindowSchengen(
  travelHistory: TravelPeriod[],
  checkDate: Date
): number {
  const windowEnd = normalizeDate(checkDate);
  const windowStart = subtractDays(windowEnd, WINDOW_DAYS - 1);
  
  let daysInSchengen = 0;
  
  // Check each day in the 180-day window
  for (let i = 0; i < WINDOW_DAYS; i++) {
    const currentDate = addDays(windowStart, i);
    
    // Check if this date falls within any travel period
    for (const period of travelHistory) {
      if (isDateInPeriod(currentDate, period)) {
        daysInSchengen++;
        break; // Count each day only once even if periods overlap
      }
    }
  }
  
  return daysInSchengen;
}

/**
 * Validates travel periods
 */
function validateTravelPeriods(travelHistory: TravelPeriod[]): void {
  for (const period of travelHistory) {
    if (period.exitDate < period.entryDate) {
      throw new Error('Exit date cannot be before entry date');
    }
  }
}

/**
 * Calculates Schengen visa status based on travel history
 * 
 * Implements the 90/180 sliding window rule:
 * - Maximum 90 days in any 180-day period
 * - Counts days used in the current window
 * - Calculates remaining days and mandatory exit date
 * 
 * @param travelHistory - Array of past and planned travel periods
 * @param referenceDate - The date to calculate from (usually today)
 * @returns SchengenResult with days used, remaining, and overstay status
 */
export function calculateSchengenDays(
  travelHistory: TravelPeriod[],
  referenceDate: Date
): SchengenResult {
  if (travelHistory.length === 0) {
    return {
      daysUsed: 0,
      daysRemaining: MAX_DAYS,
      mustExitBy: null,
      isOverstay: false,
      timeline: [],
    };
  }

  validateTravelPeriods(travelHistory);

  const normalizedRef = normalizeDate(referenceDate);
  const daysUsed = slidingWindowSchengen(travelHistory, normalizedRef);
  const daysRemaining = Math.max(0, MAX_DAYS - daysUsed);
  const isOverstay = daysUsed > MAX_DAYS;

  // Calculate must exit by date
  let mustExitBy: Date | null = null;
  
  // Check if currently in Schengen
  const isCurrentlyInSchengen = travelHistory.some(period => 
    isDateInPeriod(normalizedRef, period)
  );

  if (isCurrentlyInSchengen && daysRemaining > 0) {
    // Find when we must exit by checking future dates
    mustExitBy = addDays(normalizedRef, daysRemaining - 1);
  } else if (isCurrentlyInSchengen && daysRemaining === 0) {
    // Must exit today
    mustExitBy = normalizedRef;
  }

  // Generate timeline for the past 30 days and next 30 days
  const timeline: { date: Date; daysInSchengen: number }[] = [];
  for (let i = -30; i <= 30; i++) {
    const date = addDays(normalizedRef, i);
    const daysInSchengen = slidingWindowSchengen(travelHistory, date);
    timeline.push({ date, daysInSchengen });
  }

  return {
    daysUsed,
    daysRemaining,
    mustExitBy,
    isOverstay,
    timeline,
  };
}

/**
 * Calculates the earliest date when a new entry would be allowed
 * after using all 90 days
 * 
 * @param travelHistory - Array of past travel periods
 * @param referenceDate - The date to calculate from
 * @returns Date when new entry is allowed, or null if entry is currently allowed
 */
export function calculateNextEntryDate(
  travelHistory: TravelPeriod[],
  referenceDate: Date
): Date | null {
  const result = calculateSchengenDays(travelHistory, referenceDate);
  
  if (result.daysRemaining > 0) {
    return null; // Entry is currently allowed
  }

  // Find the earliest date when days used drops below 90
  let checkDate = addDays(referenceDate, 1);
  const maxLookAhead = 180; // Don't look more than 180 days ahead
  
  for (let i = 0; i < maxLookAhead; i++) {
    const daysUsed = slidingWindowSchengen(travelHistory, checkDate);
    if (daysUsed < MAX_DAYS) {
      return checkDate;
    }
    checkDate = addDays(checkDate, 1);
  }

  return checkDate;
}

/**
 * Calculates maximum consecutive days that can be stayed starting from a date
 * 
 * @param travelHistory - Array of past travel periods
 * @param startDate - The date to start the new stay
 * @returns Maximum number of consecutive days allowed
 */
export function calculateMaxStay(
  travelHistory: TravelPeriod[],
  startDate: Date
): number {
  const result = calculateSchengenDays(travelHistory, startDate);
  return result.daysRemaining;
}
