/**
 * Unit Tests: Time Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Business Days Calculator and Calendar Generator with known values
 * 
 * @see Requirements 30.1, 30.5, 30.7, 30.8
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBusinessDays,
  isWeekend,
  isBusinessDay,
  addBusinessDays,
  getHolidaysForYear,
  getNthDayOfMonth,
  getObservedDate,
} from '@/lib/calculations/time/business-days-calculator';
import {
  generateCalendar,
  generateMonth,
  getDayNames,
  getMonthName,
  MONTH_NAMES,
} from '@/lib/calculations/time/calendar-generator';
import { easterSunday } from '@/lib/calculations/time/norwegian-holidays';

describe('Business Days Calculator - Known Date Ranges', () => {
  /**
   * Test with a known week: Monday Jan 6, 2025 to Friday Jan 10, 2025
   * Should have exactly 5 business days (Mon-Fri)
   */
  it('should calculate 5 business days for a full work week (Mon-Fri)', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 0, 6), // Monday Jan 6, 2025
      endDate: new Date(2025, 0, 10),  // Friday Jan 10, 2025
      excludeHolidays: false,
    });

    expect(result.businessDays).toBe(5);
    expect(result.weekendDays).toBe(0);
    expect(result.totalDays).toBe(5);
  });

  /**
   * Test with a known week including weekend: Monday Jan 6 to Sunday Jan 12, 2025
   * Should have 5 business days and 2 weekend days
   */
  it('should calculate 5 business days and 2 weekend days for a full week', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 0, 6),  // Monday Jan 6, 2025
      endDate: new Date(2025, 0, 12),   // Sunday Jan 12, 2025
      excludeHolidays: false,
    });

    expect(result.businessDays).toBe(5);
    expect(result.weekendDays).toBe(2);
    expect(result.totalDays).toBe(7);
  });

  /**
   * Test with a weekend only: Saturday Jan 4 to Sunday Jan 5, 2025
   * Should have 0 business days
   */
  it('should calculate 0 business days for a weekend', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 0, 4),  // Saturday Jan 4, 2025
      endDate: new Date(2025, 0, 5),    // Sunday Jan 5, 2025
      excludeHolidays: false,
    });

    expect(result.businessDays).toBe(0);
    expect(result.weekendDays).toBe(2);
    expect(result.totalDays).toBe(2);
  });

  /**
   * Test with New Year's Day 2025 (Wednesday Jan 1)
   * Jan 1-3, 2025 should have 2 business days (excluding New Year's Day)
   */
  it('should exclude New Year\'s Day when excludeHolidays is true', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 0, 1),  // Wednesday Jan 1, 2025 (New Year's Day)
      endDate: new Date(2025, 0, 3),    // Friday Jan 3, 2025
      excludeHolidays: true,
    });

    expect(result.businessDays).toBe(2); // Thu and Fri
    expect(result.holidaysExcluded).toBe(1); // New Year's Day
    expect(result.totalDays).toBe(3);
  });

  /**
   * Test with Christmas 2025 (Thursday Dec 25)
   * Dec 22-26, 2025 should have 4 business days (excluding Christmas)
   * Mon(22), Tue(23), Wed(24), Thu(25-Christmas), Fri(26)
   */
  it('should exclude Christmas Day when excludeHolidays is true', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 11, 22), // Monday Dec 22, 2025
      endDate: new Date(2025, 11, 26),   // Friday Dec 26, 2025
      excludeHolidays: true,
    });

    expect(result.businessDays).toBe(3); // man, tir, ons (1. og 2. juledag er fridager)
    expect(result.holidaysExcluded).toBe(2); // 1. og 2. juledag
    expect(result.weekendDays).toBe(0);
    expect(result.totalDays).toBe(5);
  });

  /**
   * Test a full month: January 2025
   * January 2025 has 31 days, 4 Saturdays (4, 11, 18, 25) and 5 Sundays (5, 12, 19, 26)
   * Plus New Year's Day (Jan 1) as a holiday
   */
  it('should correctly calculate business days for January 2025', () => {
    const result = calculateBusinessDays({
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
      excludeHolidays: true,
    });

    // Januar 2025: 31 dager, 8 helgedager (4 lørdager + 4 søndager), 1 helligdag (nyttårsdag)
    expect(result.totalDays).toBe(31);
    expect(result.weekendDays).toBe(8);
    expect(result.holidaysExcluded).toBe(1);
    expect(result.businessDays).toBe(22); // 31 - 8 - 1
  });

  /**
   * Test isWeekend function
   */
  it('should correctly identify weekends', () => {
    // Saturday Jan 4, 2025
    expect(isWeekend(new Date(2025, 0, 4))).toBe(true);
    // Sunday Jan 5, 2025
    expect(isWeekend(new Date(2025, 0, 5))).toBe(true);
    // Monday Jan 6, 2025
    expect(isWeekend(new Date(2025, 0, 6))).toBe(false);
    // Friday Jan 10, 2025
    expect(isWeekend(new Date(2025, 0, 10))).toBe(false);
  });

  /**
   * Test isBusinessDay function
   */
  it('should correctly identify business days', () => {
    // Monday Jan 6, 2025
    expect(isBusinessDay(new Date(2025, 0, 6), false)).toBe(true);
    // Saturday Jan 4, 2025
    expect(isBusinessDay(new Date(2025, 0, 4), false)).toBe(false);
    // New Year's Day 2025 (Wednesday) - without holiday exclusion
    expect(isBusinessDay(new Date(2025, 0, 1), false)).toBe(true);
    // New Year's Day 2025 (Wednesday) - with holiday exclusion
    expect(isBusinessDay(new Date(2025, 0, 1), true)).toBe(false);
  });

  /**
   * Test addBusinessDays function
   */
  it('should correctly add business days', () => {
    // Starting Monday Jan 6, 2025, add 5 business days = Monday Jan 13, 2025
    const result = addBusinessDays(new Date(2025, 0, 6), 5, false);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(13);
  });

  /**
   * Test getNthDayOfMonth for floating holidays
   */
  it('should correctly calculate MLK Day (3rd Monday of January)', () => {
    // MLK Day 2025 should be January 20
    const mlkDay2025 = getNthDayOfMonth(2025, 0, 1, 3); // 3rd Monday of January
    expect(mlkDay2025.getMonth()).toBe(0);
    expect(mlkDay2025.getDate()).toBe(20);
  });

  /**
   * Test getObservedDate for weekend holidays
   */
  it('should correctly calculate observed date for weekend holidays', () => {
    // July 4, 2026 is a Saturday - observed on Friday July 3
    const july4_2026 = new Date(2026, 6, 4);
    const observed = getObservedDate(july4_2026);
    expect(observed.getDate()).toBe(3);
    expect(observed.getMonth()).toBe(6);

    // July 4, 2027 is a Sunday - observed on Monday July 5
    const july4_2027 = new Date(2027, 6, 4);
    const observed2 = getObservedDate(july4_2027);
    expect(observed2.getDate()).toBe(5);
    expect(observed2.getMonth()).toBe(6);
  });

  /**
   * Norske helligdager for 2025 (første påskedag 20. april)
   */
  it('should return correct Norwegian holidays for 2025', () => {
    const holidays = getHolidaysForYear(2025);
    expect(holidays.length).toBe(12);

    const holidayDates = holidays.map((h: Date) => `${h.getMonth() + 1}/${h.getDate()}`);
    expect(holidayDates).toContain('1/1');   // Første nyttårsdag
    expect(holidayDates).toContain('4/17');  // Skjærtorsdag
    expect(holidayDates).toContain('4/18');  // Langfredag
    expect(holidayDates).toContain('4/20');  // Første påskedag
    expect(holidayDates).toContain('4/21');  // Andre påskedag
    expect(holidayDates).toContain('5/1');   // Arbeidernes dag
    expect(holidayDates).toContain('5/17');  // Grunnlovsdagen
    expect(holidayDates).toContain('5/29');  // Kristi himmelfartsdag
    expect(holidayDates).toContain('6/8');   // Første pinsedag
    expect(holidayDates).toContain('6/9');   // Andre pinsedag
    expect(holidayDates).toContain('12/25'); // Første juledag
    expect(holidayDates).toContain('12/26'); // Andre juledag
  });

  it('should compute Easter correctly for several years', () => {
    expect(easterSunday(2024).getMonth()).toBe(2);  // 31. mars 2024
    expect(easterSunday(2024).getDate()).toBe(31);
    expect(easterSunday(2026).getMonth()).toBe(3);  // 5. april 2026
    expect(easterSunday(2026).getDate()).toBe(5);
    expect(easterSunday(2038).getMonth()).toBe(3);  // 25. april 2038
    expect(easterSunday(2038).getDate()).toBe(25);
  });
});

describe('Calendar Generator - Known Values', () => {
  /**
   * Test generating a single month
   */
  it('should generate correct calendar for January 2025', () => {
    const result = generateCalendar({
      year: 2025,
      month: 0, // January
      startWeekOnMonday: false,
    });

    expect(result.months.length).toBe(1);
    expect(result.year).toBe(2025);
    expect(result.isLeapYear).toBe(false);

    const january = result.months[0];
    expect(january.monthName).toBe('januar');
    expect(january.year).toBe(2025);
    expect(january.month).toBe(0);

    // January 2025 starts on Wednesday (day 3 when Sunday is 0)
    // First week should have days from previous month filling Sun-Tue
    const firstWeek = january.weeks[0];
    expect(firstWeek[0].isCurrentMonth).toBe(false); // Sunday from Dec
    expect(firstWeek[1].isCurrentMonth).toBe(false); // Monday from Dec
    expect(firstWeek[2].isCurrentMonth).toBe(false); // Tuesday from Dec
    expect(firstWeek[3].isCurrentMonth).toBe(true);  // Wednesday Jan 1
    expect(firstWeek[3].day).toBe(1);
  });

  /**
   * Test generating a full year
   */
  it('should generate 12 months for a full year calendar', () => {
    const result = generateCalendar({
      year: 2025,
      startWeekOnMonday: true,
    });

    expect(result.months.length).toBe(12);
    expect(result.year).toBe(2025);

    // Verify all months are present
    MONTH_NAMES.forEach((name, index) => {
      expect(result.months[index].monthName).toBe(name);
      expect(result.months[index].month).toBe(index);
    });
  });

  /**
   * Test leap year detection
   */
  it('should correctly identify leap years', () => {
    const leapYear = generateCalendar({ year: 2024 });
    expect(leapYear.isLeapYear).toBe(true);

    const nonLeapYear = generateCalendar({ year: 2025 });
    expect(nonLeapYear.isLeapYear).toBe(false);

    const centuryLeapYear = generateCalendar({ year: 2000 });
    expect(centuryLeapYear.isLeapYear).toBe(true);

    const centuryNonLeapYear = generateCalendar({ year: 1900 });
    expect(centuryNonLeapYear.isLeapYear).toBe(false);
  });

  /**
   * Test February in leap year
   */
  it('should have 29 days in February for leap year', () => {
    const result = generateCalendar({
      year: 2024,
      month: 1, // February
    });

    const february = result.months[0];
    const currentMonthDays = february.days.filter(d => d.isCurrentMonth);
    expect(currentMonthDays.length).toBe(29);
  });

  /**
   * Test February in non-leap year
   */
  it('should have 28 days in February for non-leap year', () => {
    const result = generateCalendar({
      year: 2025,
      month: 1, // February
    });

    const february = result.months[0];
    const currentMonthDays = february.days.filter(d => d.isCurrentMonth);
    expect(currentMonthDays.length).toBe(28);
  });

  /**
   * Test day names with Sunday start
   */
  it('should return correct day names starting with Sunday', () => {
    const dayNames = getDayNames(false);
    expect(dayNames[0]).toBe('søn');
    expect(dayNames[6]).toBe('lør');
  });

  /**
   * Test day names with Monday start
   */
  it('should return correct day names starting with Monday', () => {
    const dayNames = getDayNames(true);
    expect(dayNames[0]).toBe('man');
    expect(dayNames[6]).toBe('søn');
  });

  /**
   * Test month name lookup
   */
  it('should return correct month names', () => {
    expect(getMonthName(0)).toBe('januar');
    expect(getMonthName(6)).toBe('juli');
    expect(getMonthName(11)).toBe('desember');
  });

  /**
   * Test weekend marking
   */
  it('should correctly mark weekends in calendar', () => {
    const result = generateCalendar({
      year: 2025,
      month: 0, // January
    });

    const january = result.months[0];
    
    // Find January 4, 2025 (Saturday) and January 5, 2025 (Sunday)
    const saturday = january.days.find(d => d.isCurrentMonth && d.day === 4);
    const sunday = january.days.find(d => d.isCurrentMonth && d.day === 5);
    const monday = january.days.find(d => d.isCurrentMonth && d.day === 6);

    expect(saturday?.isWeekend).toBe(true);
    expect(sunday?.isWeekend).toBe(true);
    expect(monday?.isWeekend).toBe(false);
  });

  /**
   * Test holiday marking
   */
  it('should correctly mark holidays when includeHolidays is true', () => {
    const result = generateCalendar({
      year: 2025,
      month: 0, // January
      includeHolidays: true,
    });

    const january = result.months[0];
    
    // Find January 1, 2025 (New Year's Day)
    const newYearsDay = january.days.find(d => d.isCurrentMonth && d.day === 1);
    expect(newYearsDay?.isHoliday).toBe(true);
    expect(newYearsDay?.holidayName).toBe('Første nyttårsdag');
  });

  /**
   * Test that calendar weeks are properly structured
   */
  it('should have 6 weeks per month (42 days total)', () => {
    const result = generateCalendar({
      year: 2025,
      month: 0,
    });

    const january = result.months[0];
    expect(january.weeks.length).toBe(6);
    expect(january.days.length).toBe(42);
    
    // Each week should have 7 days
    january.weeks.forEach(week => {
      expect(week.length).toBe(7);
    });
  });

  /**
   * Test generateMonth directly
   */
  it('should generate a single month correctly', () => {
    const month = generateMonth(2025, 4, true, true); // mai 2025

    expect(month.monthName).toBe('mai');
    expect(month.year).toBe(2025);
    expect(month.month).toBe(4);

    // 17. mai skal være markert som Grunnlovsdagen
    const may17 = month.days.find(d => d.isCurrentMonth && d.day === 17);
    expect(may17?.isHoliday).toBe(true);
    expect(may17?.holidayName).toBe('Grunnlovsdagen');
  });
});
