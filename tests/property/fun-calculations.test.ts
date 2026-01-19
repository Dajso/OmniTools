/**
 * Property Tests: Fun & Psychology Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Biorhythm Calculator and other fun calculation functions
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateBiorhythm,
  calculateBiorhythmValue,
  getBiorhythmChart,
  daysBetween,
  CYCLE_LENGTHS,
  BIORHYTHM_MIN,
  BIORHYTHM_MAX,
} from '@/lib/calculations/fun/biorhythm-calculator';

/**
 * Arbitrary for generating valid dates within a reasonable range
 * Birth dates: 1900-2020
 * Target dates: 1900-2100
 */
const validBirthDateArb = fc.date({
  min: new Date('1900-01-01'),
  max: new Date('2020-12-31'),
});

const validTargetDateArb = fc.date({
  min: new Date('1900-01-01'),
  max: new Date('2100-12-31'),
});

/**
 * Arbitrary for generating days since birth (positive integers)
 */
const daysSinceBirthArb = fc.integer({ min: 0, max: 50000 });

describe('Biorhythm Calculator - Property 8: Biorhythm Cycle Bounds', () => {
  /**
   * Property 8: Biorhythm Cycle Bounds
   * Feature: expanded-tools-categories, Property 8: Biorhythm Cycle Bounds
   * 
   * *For any* birth date and target date, all three biorhythm values (physical,
   * emotional, intellectual) SHALL be within [-100, 100] and follow sine wave
   * patterns with periods 23, 28, and 33 days respectively.
   * 
   * **Validates: Requirements 19.11**
   */
  it('all biorhythm values should be within [-100, 100]', () => {
    fc.assert(
      fc.property(validBirthDateArb, validTargetDateArb, (birthDate, targetDate) => {
        // Only test when target date is after or equal to birth date
        if (targetDate < birthDate) return true;
        
        const result = calculateBiorhythm(birthDate, targetDate);
        
        expect(result.physical).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
        expect(result.physical).toBeLessThanOrEqual(BIORHYTHM_MAX);
        
        expect(result.emotional).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
        expect(result.emotional).toBeLessThanOrEqual(BIORHYTHM_MAX);
        
        expect(result.intellectual).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
        expect(result.intellectual).toBeLessThanOrEqual(BIORHYTHM_MAX);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Biorhythm values follow sine wave formula
   * value = 100 * sin(2π * daysSinceBirth / cyclePeriod)
   * **Validates: Requirements 19.11**
   */
  it('biorhythm values should follow the sine wave formula', () => {
    fc.assert(
      fc.property(daysSinceBirthArb, (days) => {
        const physicalValue = calculateBiorhythmValue(days, CYCLE_LENGTHS.physical);
        const emotionalValue = calculateBiorhythmValue(days, CYCLE_LENGTHS.emotional);
        const intellectualValue = calculateBiorhythmValue(days, CYCLE_LENGTHS.intellectual);
        
        // Calculate expected values using the formula
        const expectedPhysical = 100 * Math.sin((2 * Math.PI * days) / CYCLE_LENGTHS.physical);
        const expectedEmotional = 100 * Math.sin((2 * Math.PI * days) / CYCLE_LENGTHS.emotional);
        const expectedIntellectual = 100 * Math.sin((2 * Math.PI * days) / CYCLE_LENGTHS.intellectual);
        
        // Values should match within rounding tolerance
        expect(physicalValue).toBeCloseTo(expectedPhysical, 1);
        expect(emotionalValue).toBeCloseTo(expectedEmotional, 1);
        expect(intellectualValue).toBeCloseTo(expectedIntellectual, 1);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });


  /**
   * Property: Physical cycle has period of 23 days
   * After 23 days, the value should return to the same point
   * **Validates: Requirements 19.11**
   */
  it('physical cycle should have period of 23 days', () => {
    fc.assert(
      fc.property(daysSinceBirthArb, (days) => {
        const value1 = calculateBiorhythmValue(days, CYCLE_LENGTHS.physical);
        const value2 = calculateBiorhythmValue(days + CYCLE_LENGTHS.physical, CYCLE_LENGTHS.physical);
        
        expect(value1).toBeCloseTo(value2, 1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Emotional cycle has period of 28 days
   * **Validates: Requirements 19.11**
   */
  it('emotional cycle should have period of 28 days', () => {
    fc.assert(
      fc.property(daysSinceBirthArb, (days) => {
        const value1 = calculateBiorhythmValue(days, CYCLE_LENGTHS.emotional);
        const value2 = calculateBiorhythmValue(days + CYCLE_LENGTHS.emotional, CYCLE_LENGTHS.emotional);
        
        expect(value1).toBeCloseTo(value2, 1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Intellectual cycle has period of 33 days
   * **Validates: Requirements 19.11**
   */
  it('intellectual cycle should have period of 33 days', () => {
    fc.assert(
      fc.property(daysSinceBirthArb, (days) => {
        const value1 = calculateBiorhythmValue(days, CYCLE_LENGTHS.intellectual);
        const value2 = calculateBiorhythmValue(days + CYCLE_LENGTHS.intellectual, CYCLE_LENGTHS.intellectual);
        
        expect(value1).toBeCloseTo(value2, 1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: On birth date (day 0), all values should be 0
   * sin(0) = 0
   * **Validates: Requirements 19.11**
   */
  it('on birth date, all biorhythm values should be 0', () => {
    fc.assert(
      fc.property(validBirthDateArb, (birthDate) => {
        const result = calculateBiorhythm(birthDate, birthDate);
        
        expect(result.physical).toBe(0);
        expect(result.emotional).toBe(0);
        expect(result.intellectual).toBe(0);
        expect(result.daysSinceBirth).toBe(0);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Days since birth should be correctly calculated
   * Using a simple approach that avoids DST issues
   * **Validates: Requirements 19.11**
   */
  it('days since birth should be correctly calculated', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        (daysToAdd) => {
          // Use a fixed birth date to avoid DST issues
          const birthDate = new Date(2000, 0, 1); // Jan 1, 2000
          const targetDate = new Date(2000, 0, 1 + daysToAdd);
          
          const result = calculateBiorhythm(birthDate, targetDate);
          
          expect(result.daysSinceBirth).toBe(daysToAdd);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Chart generation should produce correct number of entries
   */
  it('getBiorhythmChart should produce correct number of entries', () => {
    fc.assert(
      fc.property(
        validBirthDateArb,
        fc.integer({ min: 1, max: 100 }),
        (birthDate, days) => {
          const chart = getBiorhythmChart(birthDate, days);
          
          // Chart should have approximately 'days' entries (±1 due to rounding)
          expect(chart.length).toBeGreaterThanOrEqual(days);
          expect(chart.length).toBeLessThanOrEqual(days + 1);
          
          // All entries should have valid biorhythm values
          for (const entry of chart) {
            expect(entry.physical).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
            expect(entry.physical).toBeLessThanOrEqual(BIORHYTHM_MAX);
            expect(entry.emotional).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
            expect(entry.emotional).toBeLessThanOrEqual(BIORHYTHM_MAX);
            expect(entry.intellectual).toBeGreaterThanOrEqual(BIORHYTHM_MIN);
            expect(entry.intellectual).toBeLessThanOrEqual(BIORHYTHM_MAX);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: daysBetween should be symmetric in absolute value
   * Using a simple approach that avoids DST issues
   */
  it('daysBetween should calculate correct difference', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }), // Start from 1 to avoid +0/-0 edge case
        (daysDiff) => {
          // Use fixed dates to avoid DST issues
          const date1 = new Date(2000, 0, 1); // Jan 1, 2000
          const date2 = new Date(2000, 0, 1 + daysDiff);
          
          const days1 = daysBetween(date1, date2);
          const days2 = daysBetween(date2, date1);
          
          // The absolute values should be equal
          expect(Math.abs(days1)).toBe(Math.abs(days2));
          
          // Forward should be positive, backward should be negative
          expect(days1).toBe(daysDiff);
          expect(days2).toBe(-daysDiff);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
