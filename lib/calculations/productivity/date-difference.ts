/**
 * Date Difference Calculator
 * 
 * @module lib/calculations/productivity/date-difference
 * @see Requirements 9.13
 */

export interface DateDifferenceInputs {
  startDate: string;
  endDate: string;
  includeEndDate: boolean;
}

export interface DateDifferenceResults {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  businessDays: number;
  weekendDays: number;
}

function countBusinessDays(start: Date, end: Date): { businessDays: number; weekendDays: number } {
  let businessDays = 0;
  let weekendDays = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return { businessDays, weekendDays };
}

export function calculateDateDifference(inputs: DateDifferenceInputs): DateDifferenceResults {
  const { startDate, endDate, includeEndDate } = inputs;
  
  let start = new Date(startDate);
  let end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Ugyldig datoformat');
  }
  
  // Swap if start is after end
  if (start > end) {
    [start, end] = [end, start];
  }
  
  // Add one day if including end date
  const adjustedEnd = includeEndDate ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : end;
  
  // Calculate difference in milliseconds
  const diffMs = adjustedEnd.getTime() - start.getTime();
  
  // Total calculations
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Calculate years, months, days
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  if (includeEndDate) {
    days++;
  }
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  const totalMonths = years * 12 + months;
  
  // Business days calculation
  const { businessDays, weekendDays } = countBusinessDays(start, includeEndDate ? end : new Date(end.getTime() - 24 * 60 * 60 * 1000));

  return {
    years,
    months,
    weeks,
    days: remainingDays,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    totalMinutes,
    totalSeconds,
    businessDays,
    weekendDays,
  };
}
