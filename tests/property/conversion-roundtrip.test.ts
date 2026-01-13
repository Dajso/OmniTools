/**
 * Property Test: Unit Conversion Round-Trip
 * Feature: english-tools-website, Property 1: Unit Conversion Round-Trip
 * 
 * *For any* valid unit conversion pair and any numeric value within the valid range,
 * converting from unit A to unit B and then back from unit B to unit A SHALL produce
 * a value equal to the original (within floating-point precision tolerance of 0.0001).
 * 
 * **Validates: Requirements 4.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { convert } from '@/lib/conversions';
import { unitsByCategory, getUnitPairs } from '@/lib/constants/units';
import { UnitCategory } from '@/lib/constants/types';

const TOLERANCE = 0.0001;

describe('Unit Conversion Round-Trip - Property 1', () => {
  // Get all categories
  const categories = Object.keys(unitsByCategory) as UnitCategory[];

  // Test each category
  categories.forEach((category) => {
    describe(`${category} conversions`, () => {
      const unitPairs = getUnitPairs(category);
      
      // Test a subset of pairs to keep test time reasonable
      const testPairs = unitPairs.slice(0, Math.min(unitPairs.length, 10));

      testPairs.forEach(([fromUnit, toUnit]) => {
        it(`round-trip ${fromUnit} <-> ${toUnit} preserves value`, () => {
          fc.assert(
            fc.property(
              // Generate values appropriate for the category
              getValueArbitrary(category),
              (value) => {
                const converted = convert(value, fromUnit, toUnit, category);
                const roundTrip = convert(converted, toUnit, fromUnit, category);
                
                // Check that round-trip produces original value within tolerance
                const diff = Math.abs(roundTrip - value);
                const relativeDiff = value !== 0 ? diff / Math.abs(value) : diff;
                
                // Use relative tolerance for large values, absolute for small
                const withinTolerance = relativeDiff < TOLERANCE || diff < TOLERANCE;
                
                expect(withinTolerance).toBe(true);
                return withinTolerance;
              }
            ),
            { numRuns: 100 }
          );
        });
      });
    });
  });

  // Property: Converting same unit to itself returns original value
  it('converting to same unit returns original value', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.001, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<UnitCategory>(...categories),
        (value, category) => {
          const units = Object.keys(unitsByCategory[category]);
          const unit = units[0];
          const result = convert(value, unit, unit, category);
          expect(result).toBe(value);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Zero converts to zero for all linear conversions
  it('zero converts to zero for linear conversions', () => {
    const linearCategories: UnitCategory[] = [
      'length', 'weight', 'volume', 'area', 'speed', 'time', 'data', 'pressure', 'energy'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom<UnitCategory>(...linearCategories),
        (category) => {
          const units = Object.keys(unitsByCategory[category]);
          if (units.length >= 2) {
            const result = convert(0, units[0], units[1], category);
            expect(result).toBe(0);
          }
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property: Conversion is transitive (A->B->C should equal A->C)
  it('conversion is transitive through intermediate units', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.001, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<UnitCategory>('length', 'weight', 'volume'),
        (value, category) => {
          const units = Object.keys(unitsByCategory[category]);
          if (units.length >= 3) {
            const [unitA, unitB, unitC] = units;
            
            // A -> B -> C
            const viaB = convert(convert(value, unitA, unitB, category), unitB, unitC, category);
            
            // A -> C directly
            const direct = convert(value, unitA, unitC, category);
            
            const diff = Math.abs(viaB - direct);
            const relativeDiff = direct !== 0 ? diff / Math.abs(direct) : diff;
            
            expect(relativeDiff < TOLERANCE || diff < TOLERANCE).toBe(true);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Negative values convert correctly for linear conversions
  it('negative values convert correctly for linear conversions', () => {
    const linearCategories: UnitCategory[] = [
      'length', 'weight', 'volume', 'area', 'speed', 'time', 'data', 'pressure', 'energy'
    ];

    fc.assert(
      fc.property(
        fc.double({ min: -10000, max: -0.001, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<UnitCategory>(...linearCategories),
        (value, category) => {
          const units = Object.keys(unitsByCategory[category]);
          if (units.length >= 2) {
            const [fromUnit, toUnit] = units;
            const converted = convert(value, fromUnit, toUnit, category);
            const roundTrip = convert(converted, toUnit, fromUnit, category);
            
            const diff = Math.abs(roundTrip - value);
            const relativeDiff = Math.abs(value) > 0 ? diff / Math.abs(value) : diff;
            
            expect(relativeDiff < TOLERANCE || diff < TOLERANCE).toBe(true);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Temperature conversions are accurate for known values
  it('temperature conversions handle special cases correctly', () => {
    // Freezing point of water
    expect(convert(0, 'celsius', 'fahrenheit', 'temperature')).toBeCloseTo(32, 4);
    expect(convert(32, 'fahrenheit', 'celsius', 'temperature')).toBeCloseTo(0, 4);
    expect(convert(0, 'celsius', 'kelvin', 'temperature')).toBeCloseTo(273.15, 4);
    
    // Boiling point of water
    expect(convert(100, 'celsius', 'fahrenheit', 'temperature')).toBeCloseTo(212, 4);
    expect(convert(212, 'fahrenheit', 'celsius', 'temperature')).toBeCloseTo(100, 4);
    expect(convert(100, 'celsius', 'kelvin', 'temperature')).toBeCloseTo(373.15, 4);
    
    // Absolute zero
    expect(convert(0, 'kelvin', 'celsius', 'temperature')).toBeCloseTo(-273.15, 4);
  });
});

/**
 * Generate appropriate value ranges for each category
 */
function getValueArbitrary(category: UnitCategory): fc.Arbitrary<number> {
  switch (category) {
    case 'temperature':
      // Temperature can be negative (Celsius/Fahrenheit) but not below absolute zero in Kelvin
      return fc.double({ min: -200, max: 1000, noNaN: true, noDefaultInfinity: true });
    case 'data':
      // Data sizes are typically positive integers
      return fc.double({ min: 1, max: 1e12, noNaN: true, noDefaultInfinity: true });
    case 'time':
      // Time is positive
      return fc.double({ min: 0.001, max: 1e9, noNaN: true, noDefaultInfinity: true });
    default:
      // Most physical quantities are positive
      return fc.double({ min: 0.001, max: 1000000, noNaN: true, noDefaultInfinity: true });
  }
}
