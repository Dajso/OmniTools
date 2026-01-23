/**
 * Property Test: Flow Rate Calculation
 * Feature: coffee-barista-tools, Property 12: Flow Rate Calculation
 * 
 * *For any* valid yield and time, the flow rate should equal yield / time.
 * 
 * **Validates: Requirements 4.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateEspressoMetrics,
  type EspressoMetricsInputs,
} from '@/lib/calculations/coffee/espresso-dial-in';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

/**
 * Arbitrary for generating valid espresso metrics inputs
 */
const validEspressoMetricsInputsArb = fc.record({
  dose: fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
  yield: fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
  time: fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
});

describe('Espresso Dial-in Log - Property 12: Flow Rate Calculation', () => {
  /**
   * Property 12: Flow rate equals yield / time
   * 
   * For any valid yield and time, the flow rate should equal yield / time
   * (within rounding tolerance).
   * 
   * Validates: Requirement 4.2
   */
  it('flow rate equals yield / time', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          const expected = inputs.yield / inputs.time;
          
          // Results should match within rounding tolerance (0.01 due to rounding to 2 decimals)
          expect(Math.abs(result.flowRate - expected)).toBeLessThanOrEqual(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate is always positive for valid inputs
   */
  it('flow rate is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          expect(result.flowRate).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate increases when yield increases (time constant)
   */
  it('flow rate increases when yield increases', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 50, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1.1, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        (dose, yield1, time, multiplier) => {
          const yield2 = yield1 * multiplier;
          if (yield2 > 100) return true; // Skip if out of range
          
          const result1 = calculateEspressoMetrics({ dose, yield: yield1, time });
          const result2 = calculateEspressoMetrics({ dose, yield: yield2, time });
          
          // Flow rate should increase proportionally
          expect(result2.flowRate).toBeGreaterThan(result1.flowRate);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate decreases when time increases (yield constant)
   */
  it('flow rate decreases when time increases', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 40, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1.1, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        (dose, yieldAmount, time1, multiplier) => {
          const time2 = time1 * multiplier;
          if (time2 > 60) return true; // Skip if out of range
          
          const result1 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time1 });
          const result2 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time2 });
          
          // Flow rate should decrease when time increases
          expect(result2.flowRate).toBeLessThan(result1.flowRate);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate is independent of dose
   */
  it('flow rate is independent of dose', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (dose1, dose2, yieldAmount, time) => {
          const result1 = calculateEspressoMetrics({ dose: dose1, yield: yieldAmount, time });
          const result2 = calculateEspressoMetrics({ dose: dose2, yield: yieldAmount, time });
          
          // Flow rate should be the same regardless of dose
          expect(result1.flowRate).toBe(result2.flowRate);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate units are consistent (g/s)
   * 
   * Flow rate should be in grams per second, which means:
   * - For typical espresso (36g in 28s), flow rate should be ~1.3 g/s
   * - Flow rate should be between 0.17 g/s (10g in 60s) and 10 g/s (100g in 10s)
   */
  it('flow rate is within expected range for valid inputs', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          // Minimum flow rate: 10g / 60s = 0.167 g/s
          // Maximum flow rate: 100g / 10s = 10 g/s
          expect(result.flowRate).toBeGreaterThanOrEqual(0.16);
          expect(result.flowRate).toBeLessThanOrEqual(10.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate calculation is deterministic
   */
  it('same inputs produce same flow rate', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result1 = calculateEspressoMetrics(inputs);
          const result2 = calculateEspressoMetrics(inputs);
          
          expect(result1.flowRate).toBe(result2.flowRate);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate precision is appropriate
   * 
   * Flow rate should be rounded to 2 decimal places for display purposes.
   */
  it('flow rate is rounded to 2 decimal places', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          // Check that the flow rate has at most 2 decimal places
          const decimalPlaces = (result.flowRate.toString().split('.')[1] || '').length;
          expect(decimalPlaces).toBeLessThanOrEqual(2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate scales linearly with yield
   * 
   * If yield increases, flow rate should increase proportionally (time constant).
   * Due to rounding to 2 decimal places, we test the relationship rather than exact ratio.
   */
  it('flow rate scales linearly with yield', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 50, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (dose, yieldAmount, time) => {
          const result1 = calculateEspressoMetrics({ dose, yield: yieldAmount, time });
          const result2 = calculateEspressoMetrics({ dose, yield: yieldAmount * 2, time });
          
          // Flow rate should approximately double
          // We verify the relationship: result2 > result1 and result2 is close to 2 * result1
          // Using a more generous tolerance to account for rounding to 2 decimal places
          expect(result2.flowRate).toBeGreaterThan(result1.flowRate);
          
          // The ratio should be close to 2.0, but allow for rounding errors
          // For very small flow rates, rounding can cause larger relative errors
          const actualRatio = result2.flowRate / result1.flowRate;
          expect(actualRatio).toBeGreaterThan(1.9);
          expect(actualRatio).toBeLessThan(2.1);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Flow rate scales inversely with time
   * 
   * If time doubles (yield constant), flow rate should halve.
   */
  it('flow rate scales inversely with time', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 30, noNaN: true, noDefaultInfinity: true }),
        (dose, yieldAmount, time) => {
          const result1 = calculateEspressoMetrics({ dose, yield: yieldAmount, time });
          const result2 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time * 2 });
          
          // Flow rate should halve (within rounding tolerance)
          const expectedRatio = 0.5;
          const actualRatio = result2.flowRate / result1.flowRate;
          expect(Math.abs(actualRatio - expectedRatio)).toBeLessThanOrEqual(0.02);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Typical espresso flow rates are reasonable
   * 
   * For typical espresso parameters, flow rate should be in the 1-2 g/s range.
   */
  it('typical espresso parameters produce reasonable flow rates', () => {
    // Test typical espresso parameters
    const typicalCases = [
      { dose: 18, yield: 36, time: 28 }, // Classic 1:2 ratio
      { dose: 20, yield: 40, time: 30 }, // Slightly larger
      { dose: 16, yield: 32, time: 25 }, // Slightly smaller
    ];
    
    typicalCases.forEach(inputs => {
      const result = calculateEspressoMetrics(inputs);
      
      // Typical espresso flow rate should be between 1.0 and 2.0 g/s
      expect(result.flowRate).toBeGreaterThanOrEqual(1.0);
      expect(result.flowRate).toBeLessThanOrEqual(2.0);
    });
  });

  /**
   * Property: Boundary values produce valid flow rates
   */
  it('boundary values produce valid flow rates', () => {
    // Minimum values
    const minResult = calculateEspressoMetrics({
      dose: 5,
      yield: 10,
      time: 60,
    });
    expect(minResult.flowRate).toBeCloseTo(10 / 60, 2);
    
    // Maximum values
    const maxResult = calculateEspressoMetrics({
      dose: 30,
      yield: 100,
      time: 10,
    });
    expect(maxResult.flowRate).toBeCloseTo(100 / 10, 2);
  });

  /**
   * Property: Zero or negative inputs throw errors
   * 
   * Flow rate calculation should fail for invalid inputs.
   */
  describe('invalid inputs throw errors', () => {
    it('zero time throws error', () => {
      expect(() => calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 0,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative time throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -60, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          (time) => {
            expect(() => calculateEspressoMetrics({
              dose: 18,
              yield: 36,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('zero yield throws error', () => {
      expect(() => calculateEspressoMetrics({
        dose: 18,
        yield: 0,
        time: 28,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative yield throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          (yieldAmount) => {
            expect(() => calculateEspressoMetrics({
              dose: 18,
              yield: yieldAmount,
              time: 28,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
