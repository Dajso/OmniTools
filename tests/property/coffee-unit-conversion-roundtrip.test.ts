/**
 * Property Test: Coffee Unit Conversion Round-Trip
 * Feature: coffee-barista-tools, Property 40: Unit Conversion Round Trip
 * 
 * *For any* valid weight or volume value, converting from metric to imperial
 * and back to metric SHALL preserve the original value (within rounding tolerance of 0.1%)
 * 
 * **Validates: Requirements 13.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  gramsToOunces,
  ouncesToGrams,
  mlToFlOz,
  flOzToMl,
  litersToGallons,
  gallonsToLiters,
  convertWeight,
  convertVolume,
  parseWeightInput,
  parseVolumeInput,
  getWeightDisplayValue,
  getVolumeDisplayValue,
} from '@/lib/conversions/coffee-units';

const TOLERANCE = 0.001; // 0.1% tolerance

describe('Coffee Unit Conversion Round-Trip - Property 40', () => {
  describe('Weight Conversions', () => {
    it('should preserve value when converting grams -> ounces -> grams', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = gramsToOunces(grams);
            const backToGrams = ouncesToGrams(ounces);
            
            const diff = Math.abs(backToGrams - grams);
            const relativeDiff = grams !== 0 ? diff / Math.abs(grams) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve value when converting ounces -> grams -> ounces', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 35, noNaN: true, noDefaultInfinity: true }),
          (ounces) => {
            const grams = ouncesToGrams(ounces);
            const backToOunces = gramsToOunces(grams);
            
            const diff = Math.abs(backToOunces - ounces);
            const relativeDiff = ounces !== 0 ? diff / Math.abs(ounces) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve value using convertWeight function', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 500, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = convertWeight(grams, 'g', 'oz');
            const backToGrams = convertWeight(ounces, 'oz', 'g');
            
            const diff = Math.abs(backToGrams - grams);
            const relativeDiff = grams !== 0 ? diff / Math.abs(grams) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Volume Conversions', () => {
    it('should preserve value when converting ml -> fl oz -> ml', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 2000, noNaN: true, noDefaultInfinity: true }),
          (ml) => {
            const flOz = mlToFlOz(ml);
            const backToMl = flOzToMl(flOz);
            
            const diff = Math.abs(backToMl - ml);
            const relativeDiff = ml !== 0 ? diff / Math.abs(ml) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve value when converting fl oz -> ml -> fl oz', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 70, noNaN: true, noDefaultInfinity: true }),
          (flOz) => {
            const ml = flOzToMl(flOz);
            const backToFlOz = mlToFlOz(ml);
            
            const diff = Math.abs(backToFlOz - flOz);
            const relativeDiff = flOz !== 0 ? diff / Math.abs(flOz) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve value using convertVolume function', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (ml) => {
            const flOz = convertVolume(ml, 'ml', 'fl oz');
            const backToMl = convertVolume(flOz, 'fl oz', 'ml');
            
            const diff = Math.abs(backToMl - ml);
            const relativeDiff = ml !== 0 ? diff / Math.abs(ml) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Water Volume Conversions', () => {
    it('should preserve value when converting liters -> gallons -> liters', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          (liters) => {
            const gallons = litersToGallons(liters);
            const backToLiters = gallonsToLiters(gallons);
            
            const diff = Math.abs(backToLiters - liters);
            const relativeDiff = liters !== 0 ? diff / Math.abs(liters) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve value when converting gallons -> liters -> gallons', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 5, noNaN: true, noDefaultInfinity: true }),
          (gallons) => {
            const liters = gallonsToLiters(gallons);
            const backToGallons = litersToGallons(liters);
            
            const diff = Math.abs(backToGallons - gallons);
            const relativeDiff = gallons !== 0 ? diff / Math.abs(gallons) : diff;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Input/Display Value Round-Trip', () => {
    it('should preserve weight value through parse and display cycle', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 100, noNaN: true, noDefaultInfinity: true }),
          (inputValue) => {
            // Metric: input -> parse -> display
            const metricGrams = parseWeightInput(inputValue, 'metric');
            const metricDisplay = getWeightDisplayValue(metricGrams, 'metric');
            expect(Math.abs(metricDisplay - inputValue)).toBeLessThan(0.01);
            
            // Imperial: input -> parse -> display
            const imperialGrams = parseWeightInput(inputValue, 'imperial');
            const imperialDisplay = getWeightDisplayValue(imperialGrams, 'imperial');
            const diff = Math.abs(imperialDisplay - inputValue);
            const relativeDiff = inputValue !== 0 ? diff / Math.abs(inputValue) : diff;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve volume value through parse and display cycle', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 50, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (inputValue) => {
            // Metric: input -> parse -> display
            const metricMl = parseVolumeInput(inputValue, 'metric');
            const metricDisplay = getVolumeDisplayValue(metricMl, 'metric');
            expect(Math.abs(metricDisplay - inputValue)).toBeLessThan(0.01);
            
            // Imperial: input -> parse -> display
            const imperialMl = parseVolumeInput(inputValue, 'imperial');
            const imperialDisplay = getVolumeDisplayValue(imperialMl, 'imperial');
            const diff = Math.abs(imperialDisplay - inputValue);
            const relativeDiff = inputValue !== 0 ? diff / Math.abs(inputValue) : diff;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Typical Coffee Brewing Values', () => {
    it('should handle typical espresso doses accurately', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 14, max: 22, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = gramsToOunces(grams);
            const backToGrams = ouncesToGrams(ounces);
            
            const diff = Math.abs(backToGrams - grams);
            expect(diff).toBeLessThan(0.01); // Within 0.01g for espresso precision
            
            return diff < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle typical pour over doses accurately', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 20, max: 60, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = gramsToOunces(grams);
            const backToGrams = ouncesToGrams(ounces);
            
            const diff = Math.abs(backToGrams - grams);
            const relativeDiff = diff / grams;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle typical brew water volumes accurately', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 200, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (ml) => {
            const flOz = mlToFlOz(ml);
            const backToMl = flOzToMl(flOz);
            
            const diff = Math.abs(backToMl - ml);
            const relativeDiff = diff / ml;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small values accurately', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 1, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = gramsToOunces(grams);
            const backToGrams = ouncesToGrams(ounces);
            
            const diff = Math.abs(backToGrams - grams);
            const relativeDiff = diff / grams;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle large values accurately', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 500, max: 5000, noNaN: true, noDefaultInfinity: true }),
          (grams) => {
            const ounces = gramsToOunces(grams);
            const backToGrams = ouncesToGrams(ounces);
            
            const diff = Math.abs(backToGrams - grams);
            const relativeDiff = diff / grams;
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Conversion Invariance - Property 41', () => {
    it('should not change calculation results when switching units', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 15, max: 25, noNaN: true, noDefaultInfinity: true }), // coffee dose
          fc.double({ min: 200, max: 500, noNaN: true, noDefaultInfinity: true }), // water amount
          (coffeeDose, waterAmount) => {
            // Calculate brew ratio in metric (unitless ratio)
            const metricRatio = waterAmount / coffeeDose;
            
            // Convert to imperial
            const coffeeOz = gramsToOunces(coffeeDose);
            const waterOz = gramsToOunces(waterAmount); // Water weight, not volume
            
            // Calculate brew ratio in imperial (unitless ratio)
            const imperialRatio = waterOz / coffeeOz;
            
            // Ratios should be the same (unit-independent) because we're using same unit type
            const diff = Math.abs(imperialRatio - metricRatio);
            const relativeDiff = diff / metricRatio;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve extraction yield calculation across unit systems', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 3, noNaN: true, noDefaultInfinity: true }), // TDS %
          fc.double({ min: 15, max: 25, noNaN: true, noDefaultInfinity: true }), // coffee dose
          fc.double({ min: 200, max: 400, noNaN: true, noDefaultInfinity: true }), // beverage weight
          (tds, coffeeDose, beverageWeight) => {
            // Calculate extraction yield in metric
            const metricYield = (tds * beverageWeight) / coffeeDose * 100;
            
            // Convert to imperial
            const coffeeOz = gramsToOunces(coffeeDose);
            const beverageOz = gramsToOunces(beverageWeight);
            
            // Calculate extraction yield in imperial
            const imperialYield = (tds * beverageOz) / coffeeOz * 100;
            
            // Yields should be the same (unit-independent)
            const diff = Math.abs(imperialYield - metricYield);
            const relativeDiff = diff / metricYield;
            
            expect(relativeDiff).toBeLessThan(TOLERANCE);
            return relativeDiff < TOLERANCE;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
