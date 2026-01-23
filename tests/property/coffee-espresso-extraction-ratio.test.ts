/**
 * Property Test: Extraction Ratio Calculation
 * Feature: coffee-barista-tools, Property 11: Extraction Ratio Calculation
 * 
 * *For any* valid dose and yield, the extraction ratio should equal yield / dose.
 * 
 * **Validates: Requirements 4.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateEspressoMetrics,
  getExtractionRatioRecommendation,
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

describe('Espresso Dial-in Log - Property 11: Extraction Ratio Calculation', () => {
  /**
   * Property 11: Extraction ratio equals yield / dose
   * 
   * For any valid dose and yield, the extraction ratio should equal yield / dose
   * (within rounding tolerance).
   */
  it('extraction ratio equals yield / dose', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          const expected = inputs.yield / inputs.dose;
          
          // Results should match within rounding tolerance (0.01 due to rounding to 2 decimals)
          expect(Math.abs(result.extractionRatio - expected)).toBeLessThanOrEqual(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extraction ratio is always positive for valid inputs
   */
  it('extraction ratio is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          expect(result.extractionRatio).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extraction ratio increases when yield increases (dose constant)
   */
  it('extraction ratio increases when yield increases', () => {
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
          
          // Extraction ratio should increase proportionally
          expect(result2.extractionRatio).toBeGreaterThan(result1.extractionRatio);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extraction ratio decreases when dose increases (yield constant)
   */
  it('extraction ratio decreases when dose increases', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 15, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1.1, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        (dose1, yieldAmount, time, multiplier) => {
          const dose2 = dose1 * multiplier;
          if (dose2 > 30) return true; // Skip if out of range
          
          const result1 = calculateEspressoMetrics({ dose: dose1, yield: yieldAmount, time });
          const result2 = calculateEspressoMetrics({ dose: dose2, yield: yieldAmount, time });
          
          // Extraction ratio should decrease when dose increases
          expect(result2.extractionRatio).toBeLessThan(result1.extractionRatio);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extraction ratio is independent of time
   */
  it('extraction ratio is independent of time', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (dose, yieldAmount, time1, time2) => {
          const result1 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time1 });
          const result2 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time2 });
          
          // Extraction ratio should be the same regardless of time
          expect(result1.extractionRatio).toBe(result2.extractionRatio);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Recommendation is always one of the valid values
   */
  it('recommendation is always one of the valid values', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          expect(['increase-yield', 'optimal', 'decrease-yield']).toContain(result.recommendation);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Recommendation text is always non-empty
   */
  it('recommendation text is always non-empty', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          expect(result.recommendationText).toBeTruthy();
          expect(result.recommendationText.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Invalid inputs throw CoffeeCalculationError
   */
  describe('invalid inputs throw errors', () => {
    it('zero dose throws error', () => {
      expect(() => calculateEspressoMetrics({
        dose: 0,
        yield: 36,
        time: 28,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative dose throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -30, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (dose) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: 36,
              time: 28,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('dose below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 4.99, noNaN: true, noDefaultInfinity: true }),
          (dose) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: 36,
              time: 28,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('dose above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 30.01, max: 100, noNaN: true, noDefaultInfinity: true }),
          (dose) => {
            expect(() => calculateEspressoMetrics({
              dose,
              yield: 36,
              time: 28,
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
          fc.double({ min: -100, max: -0.01, noNaN: true, noDefaultInfinity: true }),
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

    it('yield below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 9.99, noNaN: true, noDefaultInfinity: true }),
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

    it('yield above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100.01, max: 200, noNaN: true, noDefaultInfinity: true }),
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
          fc.double({ min: -60, max: -0.01, noNaN: true, noDefaultInfinity: true }),
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

    it('time below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 9.99, noNaN: true, noDefaultInfinity: true }),
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

    it('time above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 60.01, max: 120, noNaN: true, noDefaultInfinity: true }),
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
  });

  /**
   * Property: Extraction ratio recommendation classification is consistent
   */
  describe('extraction ratio recommendation classification', () => {
    it('ratio < 1.5 is classified as increase-yield', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 1.49, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const recommendation = getExtractionRatioRecommendation(ratio);
            expect(recommendation).toBe('increase-yield');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ratio between 1.5 and 2.5 is classified as optimal', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1.5, max: 2.5, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const recommendation = getExtractionRatioRecommendation(ratio);
            expect(recommendation).toBe('optimal');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ratio > 2.5 is classified as decrease-yield', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 2.51, max: 5, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const recommendation = getExtractionRatioRecommendation(ratio);
            expect(recommendation).toBe('decrease-yield');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Calculation is deterministic
   */
  it('same inputs produce same outputs', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result1 = calculateEspressoMetrics(inputs);
          const result2 = calculateEspressoMetrics(inputs);
          
          expect(result1.extractionRatio).toBe(result2.extractionRatio);
          expect(result1.flowRate).toBe(result2.flowRate);
          expect(result1.recommendation).toBe(result2.recommendation);
          expect(result1.recommendationText).toBe(result2.recommendationText);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
