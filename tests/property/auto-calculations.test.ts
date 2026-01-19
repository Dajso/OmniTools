/**
 * Property Tests: Automotive Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests universal properties for automotive calculation functions.
 * 
 * @module tests/property/auto-calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  TireSize,
  calculateCircumference,
  calculateDiameter,
  calculateTireDimensions,
  calculateSpeedometerError,
  compareTireSizes,
  calculateSpeedometerReading,
  calculateActualSpeed,
  formatTireSize,
  parseTireSize,
} from '@/lib/calculations/auto/tire-calculator';

// Arbitrary for valid tire sizes
const tireSizeArb = fc.record({
  width: fc.integer({ min: 155, max: 355 }),
  aspectRatio: fc.integer({ min: 25, max: 85 }),
  rimDiameter: fc.integer({ min: 13, max: 24 }),
});

describe('Automotive Calculations - Property Tests', () => {
  describe('Property 19: Tire Circumference Ratio', () => {
    /**
     * Property 19: Tire Circumference Ratio
     * 
     * *For any* two tire sizes, the speedometer error percentage SHALL equal
     * (new_circumference / old_circumference - 1) × 100.
     * 
     * **Validates: Requirements 28.9**
     */

    it('speedometer error equals circumference ratio minus 1', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          (originalSize, newSize) => {
            const originalCirc = calculateCircumference(originalSize);
            const newCirc = calculateCircumference(newSize);
            
            const expectedError = (newCirc / originalCirc - 1) * 100;
            const actualError = calculateSpeedometerError(originalSize, newSize);
            
            expect(actualError).toBeCloseTo(expectedError, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('circumference equals π × diameter', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          (size) => {
            const circumference = calculateCircumference(size);
            const diameter = calculateDiameter(size);
            
            expect(circumference).toBeCloseTo(Math.PI * diameter, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('diameter formula: 2 × sidewallHeight + rimDiameter × 25.4', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          (size) => {
            const diameter = calculateDiameter(size);
            const sidewallHeight = size.width * (size.aspectRatio / 100);
            const expectedDiameter = 2 * sidewallHeight + size.rimDiameter * 25.4;
            
            expect(diameter).toBeCloseTo(expectedDiameter, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('speedometer error is zero when comparing identical tires', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          (size) => {
            const error = calculateSpeedometerError(size, size);
            
            expect(error).toBeCloseTo(0, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('speedometer error is symmetric (opposite sign when swapped)', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          (size1, size2) => {
            const error1to2 = calculateSpeedometerError(size1, size2);
            const error2to1 = calculateSpeedometerError(size2, size1);
            
            // The errors should be related but not exactly opposite due to ratio math
            // If error1to2 = (c2/c1 - 1) * 100, then error2to1 = (c1/c2 - 1) * 100
            // These are not exact negatives, but: (1 + e1/100) * (1 + e2/100) ≈ 1
            const factor1 = 1 + error1to2 / 100;
            const factor2 = 1 + error2to1 / 100;
            
            expect(factor1 * factor2).toBeCloseTo(1, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('larger tires produce positive speedometer error', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          fc.integer({ min: 1, max: 50 }),
          (baseSize, widthIncrease) => {
            // Create a larger tire by increasing width
            const largerSize: TireSize = {
              ...baseSize,
              width: Math.min(baseSize.width + widthIncrease, 355),
            };
            
            const error = calculateSpeedometerError(baseSize, largerSize);
            
            // Larger tire = positive error (speedo reads low)
            expect(error).toBeGreaterThanOrEqual(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('actual speed calculation is consistent with speedometer error', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          fc.double({ min: 10, max: 150, noNaN: true, noDefaultInfinity: true }),
          (originalSize, newSize, speedoReading) => {
            const error = calculateSpeedometerError(originalSize, newSize);
            const actualSpeed = calculateActualSpeed(speedoReading, originalSize, newSize);
            
            // Actual speed should be speedoReading * (1 + error/100)
            const expectedActual = speedoReading * (1 + error / 100);
            
            expect(actualSpeed).toBeCloseTo(expectedActual, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('speedometer reading and actual speed are inverses', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          fc.double({ min: 10, max: 150, noNaN: true, noDefaultInfinity: true }),
          (originalSize, newSize, speed) => {
            // Calculate actual speed from speedo reading
            const actualSpeed = calculateActualSpeed(speed, originalSize, newSize);
            
            // Calculate speedo reading from actual speed
            const speedoReading = calculateSpeedometerReading(actualSpeed, originalSize, newSize);
            
            // Should get back original speed
            expect(speedoReading).toBeCloseTo(speed, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('tire comparison produces consistent results', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          (originalSize, newSize) => {
            const comparison = compareTireSizes(originalSize, newSize);
            
            // Diameter difference should match individual calculations
            const origDiam = calculateDiameter(originalSize);
            const newDiam = calculateDiameter(newSize);
            
            expect(comparison.diameterDifference).toBeCloseTo(newDiam - origDiam, 10);
            
            // Circumference difference should match
            const origCirc = calculateCircumference(originalSize);
            const newCirc = calculateCircumference(newSize);
            
            expect(comparison.circumferenceDifference).toBeCloseTo(newCirc - origCirc, 10);
            
            // Speedometer error should match
            const error = calculateSpeedometerError(originalSize, newSize);
            expect(comparison.speedometerError).toBeCloseTo(error, 10);
            
            // isLarger should be consistent with diameter difference
            expect(comparison.isLarger).toBe(comparison.diameterDifference > 0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ground clearance change is half the diameter difference', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          (originalSize, newSize) => {
            const comparison = compareTireSizes(originalSize, newSize);
            
            expect(comparison.groundClearanceChange).toBeCloseTo(
              comparison.diameterDifference / 2,
              10
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('parse and format are inverses for valid sizes', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          (size) => {
            const formatted = formatTireSize(size);
            const parsed = parseTireSize(formatted);
            
            expect(parsed).not.toBeNull();
            expect(parsed!.width).toBe(size.width);
            expect(parsed!.aspectRatio).toBe(size.aspectRatio);
            expect(parsed!.rimDiameter).toBe(size.rimDiameter);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('revolutions per mile is inversely proportional to circumference', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          (size) => {
            const dimensions = calculateTireDimensions(size);
            const mmPerMile = 1609344;
            
            const expectedRevs = mmPerMile / dimensions.circumference;
            
            expect(dimensions.revolutionsPerMile).toBeCloseTo(expectedRevs, 5);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('actualSpeedAt60 in comparison matches manual calculation', () => {
      fc.assert(
        fc.property(
          tireSizeArb,
          tireSizeArb,
          (originalSize, newSize) => {
            const comparison = compareTireSizes(originalSize, newSize);
            const manualActual = calculateActualSpeed(60, originalSize, newSize);
            
            expect(comparison.actualSpeedAt60).toBeCloseTo(manualActual, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
