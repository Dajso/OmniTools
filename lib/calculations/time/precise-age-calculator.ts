/**
 * Precise Age Calculator
 * Calculates exact age in years, months, days, hours, minutes, and seconds
 * 
 * @module lib/calculations/time/precise-age-calculator
 * @see Requirements 30.3
 */

export interface PreciseAgeInput {
  birthDate: Date;
  targetDate?: Date; // Defaults to current date/time
}

export interface PreciseAgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
  zodiacSign: string;
  birthDayOfWeek: string;
}

const DAYS_OF_WEEK = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

const ZODIAC_SIGNS = [
  { name: 'Steinbukken', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'Vannmannen', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'Fiskene', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: 'Væren', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'Tyren', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'Tvillingene', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'Krepsen', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'Løven', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'Jomfruen', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'Vekten', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'Skorpionen', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'Skytten', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

/**
 * Gets the zodiac sign for a given date
 */
export function getZodiacSign(month: number, day: number): string {
  // Month is 1-indexed (1 = January)
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      // Same month range
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign.name;
      }
    } else if (sign.startMonth > sign.endMonth) {
      // Crosses year boundary (Capricorn)
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign.name;
      }
    } else {
      // Normal range
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign.name;
      }
    }
  }
  return 'Unknown';
}

/**
 * Calculates the next birthday from a given date
 */
export function getNextBirthday(birthDate: Date, fromDate: Date): Date {
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentYear = fromDate.getFullYear();
  
  // Try this year's birthday
  let nextBirthday = new Date(currentYear, birthMonth, birthDay);
  
  // If this year's birthday has passed, use next year
  if (nextBirthday <= fromDate) {
    nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
  }
  
  return nextBirthday;
}

/**
 * Calculates days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs(date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * Calculates precise age from birth date to target date
 */
export function calculatePreciseAge(input: PreciseAgeInput): PreciseAgeResult {
  const { birthDate, targetDate = new Date() } = input;
  
  if (birthDate > targetDate) {
    throw new Error('Fødselsdatoen kan ikke være i fremtiden');
  }
  
  // Calculate years, months, days
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();
  
  // Adjust for negative days
  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate time components
  let hours = targetDate.getHours() - birthDate.getHours();
  let minutes = targetDate.getMinutes() - birthDate.getMinutes();
  let seconds = targetDate.getSeconds() - birthDate.getSeconds();
  
  // Adjust for negative seconds
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  
  // Adjust for negative minutes
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  
  // Adjust for negative hours
  if (hours < 0) {
    days--;
    hours += 24;
    
    // Re-adjust days if needed
    if (days < 0) {
      months--;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
      
      if (months < 0) {
        years--;
        months += 12;
      }
    }
  }
  
  // Calculate totals
  const totalMilliseconds = targetDate.getTime() - birthDate.getTime();
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  // Get next birthday
  const nextBirthday = getNextBirthday(birthDate, targetDate);
  const daysUntilNextBirthday = daysBetween(targetDate, nextBirthday);
  
  // Get zodiac sign
  const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
  
  // Get birth day of week
  const birthDayOfWeek = DAYS_OF_WEEK[birthDate.getDay()];
  
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthday,
    daysUntilNextBirthday,
    zodiacSign,
    birthDayOfWeek,
  };
}
