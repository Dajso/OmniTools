/**
 * Age Calculator
 * 
 * @module lib/calculations/productivity/age-calculator
 * @see Requirements 9.12
 */

export interface AgeInputs {
  birthDate: string;
  targetDate?: string;
}

export interface AgeResults {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: string;
  daysUntilBirthday: number;
  dayOfWeekBorn: string;
  zodiacSign: string;
  chineseZodiac: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZODIAC_SIGNS = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

const CHINESE_ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

function getZodiacSign(month: number, day: number): string {
  for (const zodiac of ZODIAC_SIGNS) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;
    
    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return zodiac.sign;
      }
    } else if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return zodiac.sign;
    }
  }
  return 'Unknown';
}

function getChineseZodiac(year: number): string {
  return CHINESE_ZODIAC[(year - 4) % 12];
}

export function calculateAge(inputs: AgeInputs): AgeResults {
  const { birthDate, targetDate } = inputs;
  
  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();
  
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birth date');
  }
  
  if (birth > target) {
    throw new Error('Birth date cannot be in the future');
  }

  // Calculate years, months, days
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total calculations
  const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next birthday
  let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= target) {
    nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday: nextBirthday.toLocaleDateString(),
    daysUntilBirthday,
    dayOfWeekBorn: DAYS_OF_WEEK[birth.getDay()],
    zodiacSign: getZodiacSign(birth.getMonth() + 1, birth.getDate()),
    chineseZodiac: getChineseZodiac(birth.getFullYear()),
  };
}
