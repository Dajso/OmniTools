/**
 * Virkedager
 * Calculates business days between dates, excluding weekends and optionally Norwegian public holidays
 * 
 * @module lib/calculations/time/business-days-calculator
 * @see Requirements 30.1, 30.7
 */

import { getNorwegianHolidays } from './norwegian-holidays';

export interface BusinessDaysInput {
  startDate: Date;
  endDate: Date;
  excludeHolidays?: boolean;
  customHolidays?: Date[];
}

export interface BusinessDaysResult {
  businessDays: number;
  totalDays: number;
  weekendDays: number;
  holidaysExcluded: number;
  startDate: Date;
  endDate: Date;
  excludedDates: Date[];
}

/**
 * Normalizes a date to midnight (start of day)
 */
export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Gets the nth occurrence of a day of week in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param dayOfWeek - The day of week (0 = Sunday)
 * @param weekOfMonth - Which occurrence (1-5, negative for last)
 */
export function getNthDayOfMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  weekOfMonth: number
): Date {
  if (weekOfMonth > 0) {
    // Find the first occurrence of the day in the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    let dayOffset = dayOfWeek - firstDayOfWeek;
    if (dayOffset < 0) dayOffset += 7;
    
    const firstOccurrence = 1 + dayOffset;
    const nthOccurrence = firstOccurrence + (weekOfMonth - 1) * 7;
    
    return new Date(year, month, nthOccurrence);
  } else {
    // Find the last occurrence (weekOfMonth is negative)
    const lastDay = new Date(year, month + 1, 0); // Last day of month
    const lastDayOfWeek = lastDay.getDay();
    let dayOffset = lastDayOfWeek - dayOfWeek;
    if (dayOffset < 0) dayOffset += 7;
    
    const lastOccurrence = lastDay.getDate() - dayOffset;
    const nthFromLast = lastOccurrence + (weekOfMonth + 1) * 7;
    
    return new Date(year, month, nthFromLast);
  }
}

/**
 * Gets the observed date for a holiday (handles weekend adjustments)
 * If a holiday falls on Saturday, it's observed on Friday
 * If a holiday falls on Sunday, it's observed on Monday
 */
export function getObservedDate(date: Date): Date {
  const day = date.getDay();
  if (day === 6) {
    // Saturday -> Friday
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  } else if (day === 0) {
    // Sunday -> Monday
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }
  return date;
}

/**
 * Gets all Norwegian public holidays for a given year
 */
export function getHolidaysForYear(year: number): Date[] {
  return getNorwegianHolidays(year).map(h => normalizeDate(h.date));
}

/**
 * Gets all Norwegian public holidays between two dates (inclusive)
 */
export function getHolidaysBetweenDates(startDate: Date, endDate: Date): Date[] {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  const holidays: Date[] = [];

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    for (const holiday of getHolidaysForYear(year)) {
      if (holiday >= start && holiday <= end) {
        holidays.push(holiday);
      }
    }
  }

  return holidays;
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Checks if a date is in a list of dates
 */
export function isDateInList(date: Date, dateList: Date[]): boolean {
  return dateList.some(d => isSameDay(date, d));
}

/**
 * Calculates business days between two dates
 * Excludes weekends (Saturday and Sunday)
 * Optionally excludes Norwegian public holidays
 * 
 * @param input - BusinessDaysInput with start date, end date, and options
 * @returns BusinessDaysResult with calculated business days and details
 */
export function calculateBusinessDays(input: BusinessDaysInput): BusinessDaysResult {
  const { startDate, endDate, excludeHolidays = false, customHolidays = [] } = input;
  
  // Normalize dates
  let start = normalizeDate(startDate);
  let end = normalizeDate(endDate);
  
  // Swap if start is after end
  if (start > end) {
    [start, end] = [end, start];
  }
  
  // Get holidays to exclude
  let holidaysToExclude: Date[] = [];
  if (excludeHolidays) {
    holidaysToExclude = getHolidaysBetweenDates(start, end);
  }
  
  // Add custom holidays
  for (const customHoliday of customHolidays) {
    const normalized = normalizeDate(customHoliday);
    if (normalized >= start && normalized <= end && !isDateInList(normalized, holidaysToExclude)) {
      holidaysToExclude.push(normalized);
    }
  }
  
  // Count days
  let businessDays = 0;
  let weekendDays = 0;
  let holidaysExcluded = 0;
  const excludedDates: Date[] = [];
  
  const current = new Date(start);
  while (current <= end) {
    const isWeekendDay = isWeekend(current);
    const isHoliday = isDateInList(current, holidaysToExclude);
    
    if (isWeekendDay) {
      weekendDays++;
      excludedDates.push(new Date(current));
    } else if (isHoliday) {
      holidaysExcluded++;
      excludedDates.push(new Date(current));
    } else {
      businessDays++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  // Calculate total days (inclusive)
  const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // round: sommertid gir 23/25 timer
  
  return {
    businessDays,
    totalDays,
    weekendDays,
    holidaysExcluded,
    startDate: start,
    endDate: end,
    excludedDates,
  };
}

/**
 * Adds business days to a date
 * 
 * @param startDate - The starting date
 * @param daysToAdd - Number of business days to add (can be negative)
 * @param excludeHolidays - Whether to exclude Norwegian public holidays
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  daysToAdd: number,
  excludeHolidays: boolean = false
): Date {
  const start = normalizeDate(startDate);
  const direction = daysToAdd >= 0 ? 1 : -1;
  let remaining = Math.abs(daysToAdd);
  
  const current = new Date(start);
  
  // Get holidays for a reasonable range (5 years should be enough)
  let holidays: Date[] = [];
  if (excludeHolidays) {
    const startYear = start.getFullYear();
    for (let year = startYear - 2; year <= startYear + 5; year++) {
      holidays = holidays.concat(getHolidaysForYear(year));
    }
  }
  
  while (remaining > 0) {
    current.setDate(current.getDate() + direction);
    
    if (!isWeekend(current) && !isDateInList(current, holidays)) {
      remaining--;
    }
  }
  
  return current;
}

/**
 * Gets the next business day from a given date
 * 
 * @param date - The starting date
 * @param excludeHolidays - Whether to exclude Norwegian public holidays
 * @returns The next business day
 */
export function getNextBusinessDay(date: Date, excludeHolidays: boolean = false): Date {
  const start = normalizeDate(date);
  const current = new Date(start);
  
  let holidays: Date[] = [];
  if (excludeHolidays) {
    holidays = getHolidaysForYear(current.getFullYear());
    holidays = holidays.concat(getHolidaysForYear(current.getFullYear() + 1));
  }
  
  do {
    current.setDate(current.getDate() + 1);
  } while (isWeekend(current) || isDateInList(current, holidays));
  
  return current;
}

/**
 * Gets the previous business day from a given date
 * 
 * @param date - The starting date
 * @param excludeHolidays - Whether to exclude Norwegian public holidays
 * @returns The previous business day
 */
export function getPreviousBusinessDay(date: Date, excludeHolidays: boolean = false): Date {
  const start = normalizeDate(date);
  const current = new Date(start);
  
  let holidays: Date[] = [];
  if (excludeHolidays) {
    holidays = getHolidaysForYear(current.getFullYear());
    holidays = holidays.concat(getHolidaysForYear(current.getFullYear() - 1));
  }
  
  do {
    current.setDate(current.getDate() - 1);
  } while (isWeekend(current) || isDateInList(current, holidays));
  
  return current;
}

/**
 * Checks if a given date is a business day
 * 
 * @param date - The date to check
 * @param excludeHolidays - Whether to consider Norwegian public holidays
 * @returns True if the date is a business day
 */
export function isBusinessDay(date: Date, excludeHolidays: boolean = false): boolean {
  const normalized = normalizeDate(date);
  
  if (isWeekend(normalized)) {
    return false;
  }
  
  if (excludeHolidays) {
    const holidays = getHolidaysForYear(normalized.getFullYear());
    if (isDateInList(normalized, holidays)) {
      return false;
    }
  }
  
  return true;
}
