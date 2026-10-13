/**
 * Week Number Calculator
 * Calculates ISO week number and related information for any date
 * 
 * @module lib/calculations/time/week-number-calculator
 * @see Requirements 30.4
 */

export interface WeekNumberInput {
  date: Date;
}

export interface WeekNumberResult {
  weekNumber: number;
  year: number; // ISO week year (may differ from calendar year)
  dayOfWeek: number; // 1-7 (Monday = 1)
  dayOfWeekName: string;
  dayOfYear: number;
  daysInYear: number;
  totalWeeksInYear: number;
  isLeapYear: boolean;
  quarter: number;
  weekStart: Date; // Monday of the week
  weekEnd: Date; // Sunday of the week
}

const DAYS_OF_WEEK = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

/**
 * Checks if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Gets the number of days in a year
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Gets the day of year (1-366)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculates ISO week number
 * ISO 8601 defines week 1 as the week containing the first Thursday of the year
 */
export function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  
  return { week: weekNo, year: d.getUTCFullYear() };
}

/**
 * Gets the total number of ISO weeks in a year
 * A year has 53 weeks if it starts on Thursday, or is a leap year starting on Wednesday
 */
export function getTotalWeeksInYear(year: number): number {
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay();
  
  // Year starts on Thursday
  if (jan1Day === 4) return 53;
  
  // Leap year starting on Wednesday
  if (jan1Day === 3 && isLeapYear(year)) return 53;
  
  return 52;
}

/**
 * Gets the Monday of the week containing the given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Gets the Sunday of the week containing the given date
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

/**
 * Gets the quarter (1-4) for a given date
 */
export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * Gets the ISO day of week (1-7, Monday = 1)
 */
export function getISODayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/**
 * Calculates week number and related information for a date
 */
export function calculateWeekNumber(input: WeekNumberInput): WeekNumberResult {
  const { date } = input;
  
  const isoWeek = getISOWeekNumber(date);
  const dayOfWeek = getISODayOfWeek(date);
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();
  
  return {
    weekNumber: isoWeek.week,
    year: isoWeek.year,
    dayOfWeek,
    dayOfWeekName: DAYS_OF_WEEK[date.getDay()],
    dayOfYear,
    daysInYear: getDaysInYear(year),
    totalWeeksInYear: getTotalWeeksInYear(isoWeek.year),
    isLeapYear: isLeapYear(year),
    quarter: getQuarter(date),
    weekStart: getWeekStart(date),
    weekEnd: getWeekEnd(date),
  };
}

/**
 * Gets the date for a specific ISO week and day
 */
export function getDateFromWeek(year: number, week: number, dayOfWeek: number = 1): Date {
  // Find January 4th of the year (always in week 1)
  const jan4 = new Date(year, 0, 4);
  
  // Find the Monday of week 1
  const week1Monday = getWeekStart(jan4);
  
  // Calculate the target date
  const targetDate = new Date(week1Monday);
  targetDate.setDate(targetDate.getDate() + (week - 1) * 7 + (dayOfWeek - 1));
  
  return targetDate;
}

/**
 * Gets all dates in a specific ISO week
 */
export function getDatesInWeek(year: number, week: number): Date[] {
  const dates: Date[] = [];
  const monday = getDateFromWeek(year, week, 1);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}
