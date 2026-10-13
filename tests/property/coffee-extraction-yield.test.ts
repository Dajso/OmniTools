/**
 * Property Tests: Coffee Extraction Yield Calculator
 * Feature: coffee-barista-tools
 * 
 * Tests for Properties 1-3 covering extraction yield calculations,
 * assessment classifications, and input validation.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateExtractionYield,
  getExtractionAssessment,
  CoffeeCalculationError,
  type ExtractionYieldInputs,
} from '@/lib/calculations/coffee/extraction-yield';

/**
 * Arbitrary for generating valid extraction yield inputs
 */
const validExtractionYieldInputsArb = fc.record({
  tds: fc.double({ min: 0.01, max: 5, noNaN: true, noDefaultInfinity: true }),
  coffeeDose: fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
  beverageWeight: fc.double({ min: 10, max: 1000, noNaN: true, noDefaultInfinity: true }),
});

describe('Coffee Extraction Yield Calculator - Properties 1-3', () => {
  /**
   * Property 1: Extraction Yield Formula Correctness
   * 
   * For any valid TDS percentage, coffee dose, and beverage weight,
   * the calculated extraction yield should equal (TDS × Beverage Weight) / Coffee Dose × 100
   * 
   * **Validates: Requirements 1.1**
   */
  describe('Property 1: Extraction Yield Formula Correctness', () => {
    it('extraction yield equals (TDS × Beverage Weight) / Coffee Dose × 100', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result = calculateExtractionYield(inputs);
            const expected = (inputs.tds * inputs.beverageWeight) / inputs.coffeeDose;
            
            // Results should match within rounding tolerance (0.01 due to 2 decimal rounding)
            expect(Math.abs(result.extractionYield - expected)).toBeLessThanOrEqual(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('extraction yield is always non-negative for valid inputs', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result = calculateExtractionYield(inputs);
            expect(result.extractionYield).toBeGreaterThanOrEqual(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('extraction yield increases proportionally with TDS', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 15, max: 25, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 200, max: 400, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.1, max: 2, noNaN: true, noDefaultInfinity: true }),
          (tds, coffeeDose, beverageWeight, multiplier) => {
            const result1 = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const result2 = calculateExtractionYield({
              tds: tds * multiplier,
              coffeeDose,
              beverageWeight,
            });
            
            const actualMultiplier = result2.extractionYield / result1.extractionYield;
            expect(Math.abs(actualMultiplier - multiplier)).toBeLessThan(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('extraction yield increases proportionally with beverage weight', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 15, max: 25, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 100, max: 300, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.1, max: 2, noNaN: true, noDefaultInfinity: true }),
          (tds, coffeeDose, beverageWeight, multiplier) => {
            const result1 = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const result2 = calculateExtractionYield({
              tds,
              coffeeDose,
              beverageWeight: beverageWeight * multiplier,
            });
            
            const actualMultiplier = result2.extractionYield / result1.extractionYield;
            expect(Math.abs(actualMultiplier - multiplier)).toBeLessThan(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('extraction yield decreases proportionally with coffee dose', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 30, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 200, max: 400, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.1, max: 2, noNaN: true, noDefaultInfinity: true }),
          (tds, coffeeDose, beverageWeight, multiplier) => {
            const result1 = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const result2 = calculateExtractionYield({
              tds,
              coffeeDose: coffeeDose * multiplier,
              beverageWeight,
            });
            
            const actualDivisor = result1.extractionYield / result2.extractionYield;
            expect(Math.abs(actualDivisor - multiplier)).toBeLessThan(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('calculation is deterministic', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result1 = calculateExtractionYield(inputs);
            const result2 = calculateExtractionYield(inputs);
            
            expect(result1.extractionYield).toBe(result2.extractionYield);
            expect(result1.assessment).toBe(result2.assessment);
            expect(result1.recommendation).toBe(result2.recommendation);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Extraction Assessment Classification
   * 
   * For any calculated extraction yield, the assessment should be:
   * - "under-extracted" when yield < 18%
   * - "optimal" when 18% ≤ yield ≤ 22%
   * - "over-extracted" when yield > 22%
   * 
   * **Validates: Requirements 1.2, 1.3, 1.4**
   */
  describe('Property 2: Extraction Assessment Classification', () => {
    it('assessment is "under-extracted" when yield < 18%', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 1.5, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 20, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          (tds, coffeeDose, beverageWeight) => {
            // Adjust inputs to ensure yield < 18%
            const adjustedTds = tds * 0.1; // Reduce TDS to get lower yield
            const result = calculateExtractionYield({
              tds: adjustedTds,
              coffeeDose,
              beverageWeight,
            });
            
            if (result.extractionYield < 18) {
              expect(result.assessment).toBe('under-extracted');
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('assessment is "optimal" when 18% ≤ yield ≤ 22%', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 18, max: 22, noNaN: true, noDefaultInfinity: true }),
          (targetYield) => {
            // Create inputs that produce the target yield
            const tds = 1.5;
            const coffeeDose = 20;
            const beverageWeight = (targetYield * coffeeDose) / tds;
            
            if (beverageWeight >= 10 && beverageWeight <= 1000) {
              const result = calculateExtractionYield({
                tds,
                coffeeDose,
                beverageWeight,
              });
              
              expect(result.assessment).toBe('optimal');
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('assessment is "over-extracted" when yield > 22%', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 2, max: 5, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (tds, coffeeDose, beverageWeight) => {
            // Adjust inputs to ensure yield > 22%
            const adjustedTds = tds * 2; // Increase TDS to get higher yield
            if (adjustedTds <= 5) {
              const result = calculateExtractionYield({
                tds: adjustedTds,
                coffeeDose,
                beverageWeight,
              });
              
              if (result.extractionYield > 22) {
                expect(result.assessment).toBe('over-extracted');
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('assessment is always one of the valid values', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result = calculateExtractionYield(inputs);
            expect(['under-extracted', 'optimal', 'over-extracted']).toContain(
              result.assessment
            );
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('recommendation is always non-empty', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result = calculateExtractionYield(inputs);
            expect(result.recommendation).toBeTruthy();
            expect(result.recommendation.length).toBeGreaterThan(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('recommendation matches assessment', () => {
      fc.assert(
        fc.property(
          validExtractionYieldInputsArb,
          (inputs) => {
            const result = calculateExtractionYield(inputs);
            
            // Verify recommendation contains relevant keywords
            if (result.assessment === 'under-extracted') {
              expect(result.recommendation.toLowerCase()).toContain('underekstra');
            } else if (result.assessment === 'optimal') {
              expect(result.recommendation.toLowerCase()).toContain('optimal');
            } else if (result.assessment === 'over-extracted') {
              expect(result.recommendation.toLowerCase()).toContain('overekstra');
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Extraction Yield Input Validation
   * 
   * For any input where TDS ≤ 0, coffee dose ≤ 0, or beverage weight ≤ 0,
   * the calculator should reject the input and display a validation error
   * 
   * **Validates: Requirements 1.5, 1.6, 1.7**
   */
  describe('Property 3: Extraction Yield Input Validation', () => {
    it('zero or negative TDS throws CoffeeCalculationError', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          (tds) => {
            expect(() =>
              calculateExtractionYield({
                tds,
                coffeeDose: 20,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('TDS below minimum (0.01%) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 0.009, noNaN: true, noDefaultInfinity: true }),
          (tds) => {
            expect(() =>
              calculateExtractionYield({
                tds,
                coffeeDose: 20,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('TDS above maximum (5%) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 5.01, max: 10, noNaN: true, noDefaultInfinity: true }),
          (tds) => {
            expect(() =>
              calculateExtractionYield({
                tds,
                coffeeDose: 20,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('zero or negative coffee dose throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('coffee dose below minimum (1g) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 0.99, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('coffee dose above maximum (100g) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100.01, max: 200, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose,
                beverageWeight: 300,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('zero or negative beverage weight throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 0, noNaN: true, noDefaultInfinity: true }),
          (beverageWeight) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose: 20,
                beverageWeight,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('beverage weight below minimum (10g) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 9.99, noNaN: true, noDefaultInfinity: true }),
          (beverageWeight) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose: 20,
                beverageWeight,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('beverage weight above maximum (1000g) throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1000.01, max: 2000, noNaN: true, noDefaultInfinity: true }),
          (beverageWeight) => {
            expect(() =>
              calculateExtractionYield({
                tds: 1.5,
                coffeeDose: 20,
                beverageWeight,
              })
            ).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('error has correct field information', () => {
      try {
        calculateExtractionYield({
          tds: -1,
          coffeeDose: 20,
          beverageWeight: 300,
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(CoffeeCalculationError);
        expect((error as CoffeeCalculationError).field).toBe('tds');
      }
    });
  });
});
