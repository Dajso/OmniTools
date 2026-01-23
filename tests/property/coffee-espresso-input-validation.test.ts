/**
 * Property Test: Espresso Input Validation
 * Feature: coffee-barista-tools, Property 14: Espresso Input Validation
 * 
 * *For any* input where dose ≤ 0, yield ≤ 0, or time ≤ 0, the calculator should 
 * reject the input and display a validation error.
 * 
 * **Validates: Requirements 4.6, 4.7, 4.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateEspressoMetrics,
  type EspressoMetricsInputs,
} from '@/lib/calculations/coffee/espresso-dial-in';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Espresso Dial-in Log - Property 14: Espresso Input Validation', () => {
  /**
   * Property 14.1: Zero or negative dose throws validation error
   * Validates: Requirement 4.6
   */
  describe('dose validation', () => {
    it('zero dose throws CoffeeCalculationError', () => {
      expect(() => calculateEspressoMetrics({
        dose: 0,
        yield: 36,
        time: 28,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative dose throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('dose below minimum (< 5g) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 4.999, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('dose above maximum (> 30g) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 30.001, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 14.2: Zero or negative yield throws validation error
   * Validates: Requirement 4.7
   */
  describe('yield validation', () => {
    it('zero yield throws CoffeeCalculationError', () => {
      expect(() => calculateEspressoMetrics({
        dose: 18,
        yield: 0,
        time: 28,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative yield throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -100, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('yield below minimum (< 10g) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 9.999, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('yield above maximum (> 100g) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 100.001, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 14.3: Zero or negative time throws validation error
   * Validates: Requirement 4.8
   */
  describe('time validation', () => {
    it('zero time throws CoffeeCalculationError', () => {
      expect(() => calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 0,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative time throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -120, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('time below minimum (< 10s) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.001, max: 9.999, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('time above maximum (> 60s) throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 60.001, max: 120, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 14.4: Multiple invalid inputs throw validation error
   */
  describe('multiple invalid inputs', () => {
    it('all zero inputs throw CoffeeCalculationError', () => {
      expect(() => calculateEspressoMetrics({
        dose: 0,
        yield: 0,
        time: 0,
      })).toThrow(CoffeeCalculationError);
    });

    it('all negative inputs throw CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -100, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -120, max: -0.001, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('combination of invalid inputs throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0.001, max: 4.999, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 30.001, max: 100, noNaN: true, noDefaultInfinity: true })
          ),
          fc.oneof(
            fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0.001, max: 9.999, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 100.001, max: 200, noNaN: true, noDefaultInfinity: true })
          ),
          fc.oneof(
            fc.double({ min: -120, max: 0, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0.001, max: 9.999, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 60.001, max: 120, noNaN: true, noDefaultInfinity: true })
          ),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 14.5: Valid inputs do not throw errors
   */
  describe('valid inputs do not throw errors', () => {
    it('valid inputs within range do not throw', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
          (dose, yieldAmount, time) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: yieldAmount,
              time,
            })).not.toThrow();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('boundary values at minimum are valid', () => {
      expect(() => calculateEspressoMetrics({
        dose: 5,
        yield: 10,
        time: 10,
      })).not.toThrow();
    });

    it('boundary values at maximum are valid', () => {
      expect(() => calculateEspressoMetrics({
        dose: 30,
        yield: 100,
        time: 60,
      })).not.toThrow();
    });
  });

  /**
   * Property 14.6: Error messages are descriptive
   */
  describe('error messages are descriptive', () => {
    it('dose error includes field name', () => {
      try {
        calculateEspressoMetrics({ dose: 0, yield: 36, time: 28 });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(CoffeeCalculationError);
        expect((error as CoffeeCalculationError).field).toBe('dose');
      }
    });

    it('yield error includes field name', () => {
      try {
        calculateEspressoMetrics({ dose: 18, yield: 0, time: 28 });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(CoffeeCalculationError);
        expect((error as CoffeeCalculationError).field).toBe('yield');
      }
    });

    it('time error includes field name', () => {
      try {
        calculateEspressoMetrics({ dose: 18, yield: 36, time: 0 });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(CoffeeCalculationError);
        expect((error as CoffeeCalculationError).field).toBe('time');
      }
    });
  });
});
