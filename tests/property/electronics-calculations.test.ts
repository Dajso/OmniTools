/**
 * Property Tests: Electronics Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests universal properties for electronics calculation functions.
 * 
 * @module tests/property/electronics-calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculate4BandResistor,
  calculate5BandResistor,
  resistanceToColors,
  COLOR_VALUES,
  COLOR_MULTIPLIERS,
  COLOR_TOLERANCES,
  BandColor,
  formatResistance,
} from '@/lib/calculations/electronics/resistor-calculator';
import {
  calculateOhmsLaw,
  calculateVoltage,
  calculateCurrent,
  calculateResistance,
  calculatePower,
} from '@/lib/calculations/electronics/ohms-law';

// Valid digit colors (0-9)
const digitColors: BandColor[] = [
  'black', 'brown', 'red', 'orange', 'yellow',
  'green', 'blue', 'violet', 'gray', 'white'
];

// Valid first digit colors (1-9, no black/leading zero)
const firstDigitColors: BandColor[] = [
  'brown', 'red', 'orange', 'yellow',
  'green', 'blue', 'violet', 'gray', 'white'
];

// Valid multiplier colors
const multiplierColors: BandColor[] = [
  'black', 'brown', 'red', 'orange', 'yellow',
  'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'
];

// Valid tolerance colors
const toleranceColors: BandColor[] = [
  'brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver', 'none'
];

describe('Electronics Calculations - Property Tests', () => {
  describe('Property 15: Resistor Color Code Bijection', () => {
    /**
     * Property 15: Resistor Color Code Bijection
     * 
     * *For any* valid resistor color band combination, the calculated resistance
     * SHALL be unique and reversible—given a resistance value, the color bands
     * can be determined.
     * 
     * **Validates: Requirements 26.11**
     */

    it('4-band resistor calculation produces valid resistance values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...firstDigitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...multiplierColors),
          fc.constantFrom(...toleranceColors),
          (band1, band2, multiplier, tolerance) => {
            const result = calculate4BandResistor({
              band1,
              band2,
              multiplier,
              tolerance,
            });

            // Resistance must be positive
            expect(result.resistance).toBeGreaterThan(0);
            
            // Tolerance must be a valid percentage
            expect(result.tolerance).toBeGreaterThan(0);
            expect(result.tolerance).toBeLessThanOrEqual(20);
            
            // Min/max resistance must bracket the nominal value
            expect(result.minResistance).toBeLessThanOrEqual(result.resistance);
            expect(result.maxResistance).toBeGreaterThanOrEqual(result.resistance);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('5-band resistor calculation produces valid resistance values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...firstDigitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...multiplierColors),
          fc.constantFrom(...toleranceColors),
          (band1, band2, band3, multiplier, tolerance) => {
            const result = calculate5BandResistor({
              band1,
              band2,
              band3,
              multiplier,
              tolerance,
            });

            // Resistance must be positive
            expect(result.resistance).toBeGreaterThan(0);
            
            // Band count must be 5
            expect(result.bandCount).toBe(5);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });


    it('resistance to colors round-trip preserves value (4-band)', () => {
      fc.assert(
        fc.property(
          // Generate resistance values that can be represented in 4-band format
          // 2 significant figures × multiplier
          fc.integer({ min: 10, max: 99 }),
          fc.integer({ min: 0, max: 7 }), // multiplier power
          (sigFigs, power) => {
            const resistance = sigFigs * Math.pow(10, power);
            
            // Convert to colors
            const colors = resistanceToColors(resistance);
            
            // Convert back to resistance
            const result = calculate4BandResistor(colors.fourBand);
            
            // Should match original value
            expect(result.resistance).toBeCloseTo(resistance, 5);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('color values are consistent with standard color code', () => {
      // Verify the color-to-value mapping is correct
      expect(COLOR_VALUES.black).toBe(0);
      expect(COLOR_VALUES.brown).toBe(1);
      expect(COLOR_VALUES.red).toBe(2);
      expect(COLOR_VALUES.orange).toBe(3);
      expect(COLOR_VALUES.yellow).toBe(4);
      expect(COLOR_VALUES.green).toBe(5);
      expect(COLOR_VALUES.blue).toBe(6);
      expect(COLOR_VALUES.violet).toBe(7);
      expect(COLOR_VALUES.gray).toBe(8);
      expect(COLOR_VALUES.white).toBe(9);
    });

    it('multiplier values are correct powers of 10', () => {
      expect(COLOR_MULTIPLIERS.black).toBe(1);      // 10^0
      expect(COLOR_MULTIPLIERS.brown).toBe(10);     // 10^1
      expect(COLOR_MULTIPLIERS.red).toBe(100);      // 10^2
      expect(COLOR_MULTIPLIERS.orange).toBe(1000);  // 10^3
      expect(COLOR_MULTIPLIERS.gold).toBe(0.1);     // 10^-1
      expect(COLOR_MULTIPLIERS.silver).toBe(0.01); // 10^-2
    });

    it('4-band resistance formula is correct: (10×d1 + d2) × multiplier', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...firstDigitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...multiplierColors),
          (band1, band2, multiplier) => {
            const result = calculate4BandResistor({
              band1,
              band2,
              multiplier,
              tolerance: 'gold',
            });

            const d1 = COLOR_VALUES[band1];
            const d2 = COLOR_VALUES[band2];
            const mult = COLOR_MULTIPLIERS[multiplier];
            
            const expected = (d1 * 10 + d2) * mult;
            
            expect(result.resistance).toBeCloseTo(expected, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('5-band resistance formula is correct: (100×d1 + 10×d2 + d3) × multiplier', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...firstDigitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...multiplierColors),
          (band1, band2, band3, multiplier) => {
            const result = calculate5BandResistor({
              band1,
              band2,
              band3,
              multiplier,
              tolerance: 'brown',
            });

            const d1 = COLOR_VALUES[band1];
            const d2 = COLOR_VALUES[band2];
            const d3 = COLOR_VALUES[band3];
            const mult = COLOR_MULTIPLIERS[multiplier];
            
            const expected = (d1 * 100 + d2 * 10 + d3) * mult;
            
            expect(result.resistance).toBeCloseTo(expected, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('tolerance range is correctly calculated', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...firstDigitColors),
          fc.constantFrom(...digitColors),
          fc.constantFrom(...multiplierColors),
          fc.constantFrom(...toleranceColors),
          (band1, band2, multiplier, tolerance) => {
            const result = calculate4BandResistor({
              band1,
              band2,
              multiplier,
              tolerance,
            });

            const toleranceValue = result.resistance * (result.tolerance / 100);
            
            expect(result.minResistance).toBeCloseTo(result.resistance - toleranceValue, 10);
            expect(result.maxResistance).toBeCloseTo(result.resistance + toleranceValue, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  describe('Property 16: Ohm\'s Law Consistency', () => {
    /**
     * Property 16: Ohm's Law Consistency
     * 
     * *For any* two known values among voltage (V), current (I), and resistance (R),
     * the calculated third value SHALL satisfy V = I × R, and power SHALL satisfy
     * P = V × I.
     * 
     * **Validates: Requirements 26.12**
     */

    it('V = I × R holds for all calculated values', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 1000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (voltage, current) => {
            // Given V and I, calculate R
            const result = calculateOhmsLaw({ voltage, current });
            
            // V = I × R should hold
            expect(result.voltage).toBeCloseTo(result.current * result.resistance, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('P = V × I holds for all calculated values', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 1000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (voltage, current) => {
            const result = calculateOhmsLaw({ voltage, current });
            
            // P = V × I should hold
            expect(result.power).toBeCloseTo(result.voltage * result.current, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('P = I² × R holds for all calculated values', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 10000, noNaN: true, noDefaultInfinity: true }),
          (current, resistance) => {
            const result = calculateOhmsLaw({ current, resistance });
            
            // P = I² × R should hold
            expect(result.power).toBeCloseTo(
              result.current * result.current * result.resistance,
              8
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('P = V² / R holds for all calculated values', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 1000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 10000, noNaN: true, noDefaultInfinity: true }),
          (voltage, resistance) => {
            const result = calculateOhmsLaw({ voltage, resistance });
            
            // P = V² / R should hold
            expect(result.power).toBeCloseTo(
              (result.voltage * result.voltage) / result.resistance,
              8
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('given V and I, correctly calculates R and P', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 10, noNaN: true, noDefaultInfinity: true }),
          (voltage, current) => {
            const result = calculateOhmsLaw({ voltage, current });
            
            expect(result.calculated).toContain('resistance');
            expect(result.calculated).toContain('power');
            expect(result.resistance).toBeCloseTo(voltage / current, 10);
            expect(result.power).toBeCloseTo(voltage * current, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('given V and R, correctly calculates I and P', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
          (voltage, resistance) => {
            const result = calculateOhmsLaw({ voltage, resistance });
            
            expect(result.calculated).toContain('current');
            expect(result.calculated).toContain('power');
            expect(result.current).toBeCloseTo(voltage / resistance, 10);
            expect(result.power).toBeCloseTo((voltage * voltage) / resistance, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('given I and R, correctly calculates V and P', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
          (current, resistance) => {
            const result = calculateOhmsLaw({ current, resistance });
            
            expect(result.calculated).toContain('voltage');
            expect(result.calculated).toContain('power');
            expect(result.voltage).toBeCloseTo(current * resistance, 10);
            expect(result.power).toBeCloseTo(current * current * resistance, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('convenience functions match main calculator', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
          (voltage, current, resistance) => {
            // Test individual functions
            expect(calculateVoltage(current, resistance)).toBeCloseTo(current * resistance, 10);
            expect(calculateCurrent(voltage, resistance)).toBeCloseTo(voltage / resistance, 10);
            expect(calculateResistance(voltage, current)).toBeCloseTo(voltage / current, 10);
            expect(calculatePower(voltage, current)).toBeCloseTo(voltage * current, 10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all four values are internally consistent', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 10, noNaN: true, noDefaultInfinity: true }),
          (voltage, current) => {
            const result = calculateOhmsLaw({ voltage, current });
            
            // All four relationships should hold simultaneously
            const vFromIR = result.current * result.resistance;
            const iFromVR = result.voltage / result.resistance;
            const rFromVI = result.voltage / result.current;
            const pFromVI = result.voltage * result.current;
            const pFromI2R = result.current * result.current * result.resistance;
            const pFromV2R = (result.voltage * result.voltage) / result.resistance;
            
            expect(result.voltage).toBeCloseTo(vFromIR, 10);
            expect(result.current).toBeCloseTo(iFromVR, 10);
            expect(result.resistance).toBeCloseTo(rFromVI, 10);
            expect(result.power).toBeCloseTo(pFromVI, 10);
            expect(result.power).toBeCloseTo(pFromI2R, 8);
            expect(result.power).toBeCloseTo(pFromV2R, 8);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
