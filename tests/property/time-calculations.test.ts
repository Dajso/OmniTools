/**
 * Property Tests: Time Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Business Days Calculator
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateBusinessDays,
  isWeekend,
  isBusinessDay,
  normalizeDate,
  addBusinessDays,
  getHolidaysForYear,
  type BusinessDaysInput,
} from '@/lib/calculations/time/business-days-calculator';

/**
 * Arbitrary for generating a valid date within a reasonable range
 */
const validDateArb = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
});

/**
 * Arbitrary for generating a date range (start and end dates)
 * Ensures end date is after or equal to start date
 */
const validDateRangeArb = fc.tuple(
  validDateArb,
  fc.integer({ min: 0, max: 365 })
).map(([startDate, daysToAdd]) => ({
  startDate: normalizeDate(startDate),
  endDate: normalizeDate(new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)),
}));

/**
 * Arbitrary for generating custom holidays (array of dates)
 */
const customHolidaysArb = fc.array(validDateArb, { minLength: 0, maxLength: 5 })
  .map(dates => dates.map(d => normalizeDate(d)));

describe('Business Days Calculator - Property 20: Business Days Exclusion', () => {
  /**
   * Property 20: Business Days Exclusion
   * Feature: expanded-tools-categories, Property 20: Business Days Exclusion
   * 
   * *For any* date range, the business days count SHALL exclude all Saturdays
   * and Sundays, and optionally exclude specified holidays.
   * 
   * **Validates: Requirements 30.7**
   */
  it('business days should exclude all Saturdays and Sundays', () => {
    fc.assert(
      fc.property(validDateRangeArb, ({ startDate, endDate }) => {
        const result = calculateBusinessDays({
          startDate,
          endDate,
          excludeHolidays: false,
        });

        // Business days + weekend days should equal total days
        expect(result.businessDays + result.weekendDays).toBe(result.totalDays);

        // Business days should be non-negative
        expect(result.businessDays).toBeGreaterThanOrEqual(0);

        // Weekend days should be non-negative
        expect(result.weekendDays).toBeGreaterThanOrEqual(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: No Saturday or Sunday should be counted as a business day
   * **Validates: Requirements 30.7**
   */
  it('no Saturday or Sunday should be counted as a business day', () => {
    fc.assert(
      fc.property(validDateRangeArb, ({ startDate, endDate }) => {
        const result = calculateBusinessDays({
          startDate,
          endDate,
          excludeHolidays: false,
        });

        // Manually count weekends in the range
        let manualWeekendCount = 0;
        const current = new Date(startDate);
        while (current <= endDate) {
          if (isWeekend(current)) {
            manualWeekendCount++;
          }
          current.setDate(current.getDate() + 1);
        }

        // Weekend count should match
        expect(result.weekendDays).toBe(manualWeekendCount);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Business days should equal total days minus weekends minus holidays
   * **Validates: Requirements 30.7**
   */
  it('business days should equal total days minus weekends minus holidays', () => {
    fc.assert(
      fc.property(validDateRangeArb, ({ startDate, endDate }) => {
        const result = calculateBusinessDays({
          startDate,
          endDate,
          excludeHolidays: true,
        });

        // Business days = total days - weekends - holidays
        const expectedBusinessDays = result.totalDays - result.weekendDays - result.holidaysExcluded;
        expect(result.businessDays).toBe(expectedBusinessDays);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Custom holidays should be excluded from business days
   * **Validates: Requirements 30.7**
   */
  it('custom holidays should be excluded from business days', () => {
    fc.assert(
      fc.property(
        validDateRangeArb,
        customHolidaysArb,
        ({ startDate, endDate }, customHolidays) => {
          // Filter custom holidays to only those within the date range and on weekdays
          const validCustomHolidays = customHolidays.filter(h => {
            const normalized = normalizeDate(h);
            return normalized >= startDate && 
                   normalized <= endDate && 
                   !isWeekend(normalized);
          });

          const resultWithHolidays = calculateBusinessDays({
            startDate,
            endDate,
            excludeHolidays: false,
            customHolidays: validCustomHolidays,
          });

          const resultWithoutHolidays = calculateBusinessDays({
            startDate,
            endDate,
            excludeHolidays: false,
            customHolidays: [],
          });

          // Business days with custom holidays should be less than or equal to without
          expect(resultWithHolidays.businessDays).toBeLessThanOrEqual(
            resultWithoutHolidays.businessDays
          );

          // The difference should equal the number of unique weekday holidays
          const uniqueHolidays = new Set(
            validCustomHolidays.map(h => normalizeDate(h).getTime())
          );
          const expectedDifference = uniqueHolidays.size;
          
          expect(resultWithoutHolidays.businessDays - resultWithHolidays.businessDays)
            .toBe(expectedDifference);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: A single day range should return 1 business day if weekday, 0 if weekend
   * **Validates: Requirements 30.7**
   */
  it('single day range should return 1 business day if weekday, 0 if weekend', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const normalized = normalizeDate(date);
        const result = calculateBusinessDays({
          startDate: normalized,
          endDate: normalized,
          excludeHolidays: false,
        });

        expect(result.totalDays).toBe(1);

        if (isWeekend(normalized)) {
          expect(result.businessDays).toBe(0);
          expect(result.weekendDays).toBe(1);
        } else {
          expect(result.businessDays).toBe(1);
          expect(result.weekendDays).toBe(0);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: A full week (7 days) should have exactly 5 business days
   * **Validates: Requirements 30.7**
   */
  it('a full week should have exactly 5 business days (excluding holidays)', () => {
    fc.assert(
      fc.property(validDateArb, (startDate) => {
        // Start from a Monday to ensure we get a full week
        const normalized = normalizeDate(startDate);
        const dayOfWeek = normalized.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek);
        const monday = new Date(normalized);
        monday.setDate(monday.getDate() + daysUntilMonday);
        
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);

        const result = calculateBusinessDays({
          startDate: monday,
          endDate: sunday,
          excludeHolidays: false,
        });

        expect(result.totalDays).toBe(7);
        expect(result.weekendDays).toBe(2);
        expect(result.businessDays).toBe(5);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: isBusinessDay should return false for all weekends
   * **Validates: Requirements 30.7**
   */
  it('isBusinessDay should return false for all weekends', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const normalized = normalizeDate(date);
        const dayOfWeek = normalized.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          expect(isBusinessDay(normalized, false)).toBe(false);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: isBusinessDay should return true for weekdays (without holiday exclusion)
   * **Validates: Requirements 30.7**
   */
  it('isBusinessDay should return true for weekdays without holiday exclusion', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const normalized = normalizeDate(date);
        const dayOfWeek = normalized.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          expect(isBusinessDay(normalized, false)).toBe(true);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Swapping start and end dates should produce the same result
   * **Validates: Requirements 30.7**
   */
  it('swapping start and end dates should produce the same business days count', () => {
    fc.assert(
      fc.property(validDateRangeArb, ({ startDate, endDate }) => {
        const result1 = calculateBusinessDays({
          startDate,
          endDate,
          excludeHolidays: false,
        });

        const result2 = calculateBusinessDays({
          startDate: endDate,
          endDate: startDate,
          excludeHolidays: false,
        });

        expect(result1.businessDays).toBe(result2.businessDays);
        expect(result1.weekendDays).toBe(result2.weekendDays);
        expect(result1.totalDays).toBe(result2.totalDays);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: US holidays should be excluded when excludeHolidays is true
   * **Validates: Requirements 30.7**
   */
  it('US holidays should be excluded when excludeHolidays is true', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2020, max: 2030 }),
        (year) => {
          // Test a full year
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31);

          const resultWithHolidays = calculateBusinessDays({
            startDate,
            endDate,
            excludeHolidays: true,
          });

          const resultWithoutHolidays = calculateBusinessDays({
            startDate,
            endDate,
            excludeHolidays: false,
          });

          // With holidays excluded, business days should be less or equal
          expect(resultWithHolidays.businessDays).toBeLessThanOrEqual(
            resultWithoutHolidays.businessDays
          );

          // Holidays excluded should be non-negative
          expect(resultWithHolidays.holidaysExcluded).toBeGreaterThanOrEqual(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: addBusinessDays should skip weekends
   * **Validates: Requirements 30.7**
   */
  it('addBusinessDays should skip weekends', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 1, max: 30 }),
        (startDate, daysToAdd) => {
          const result = addBusinessDays(startDate, daysToAdd, false);

          // Result should not be a weekend
          expect(isWeekend(result)).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Adding N business days and calculating business days between should give N
   * **Validates: Requirements 30.7**
   */
  it('adding N business days should result in N business days between (exclusive of start)', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 1, max: 20 }),
        (startDate, daysToAdd) => {
          const normalized = normalizeDate(startDate);
          const endDate = addBusinessDays(normalized, daysToAdd, false);

          // Calculate business days from day after start to end (inclusive)
          const dayAfterStart = new Date(normalized);
          dayAfterStart.setDate(dayAfterStart.getDate() + 1);

          const result = calculateBusinessDays({
            startDate: dayAfterStart,
            endDate,
            excludeHolidays: false,
          });

          // The business days should equal daysToAdd
          expect(result.businessDays).toBe(daysToAdd);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
