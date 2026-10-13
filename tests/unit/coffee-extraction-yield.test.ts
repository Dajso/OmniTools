/**
 * Unit Tests: Coffee Extraction Yield Calculator
 * Feature: coffee-barista-tools
 * 
 * Tests the extraction yield calculation logic with specific known values,
 * edge cases, and property-based tests for comprehensive coverage.
 * 
 * @module tests/unit/coffee-extraction-yield
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  calculateExtractionYield,
  getExtractionAssessment,
  CoffeeCalculationError,
  type ExtractionYieldInputs,
  type ExtractionAssessment,
} from '@/lib/calculations/coffee/extraction-yield';

describe('Coffee Extraction Yield Calculator', () => {
  describe('Known Value Tests', () => {
    it('should calculate extraction yield for realistic espresso', () => {
      // Realistic espresso: 18g dose, 36g yield, 4.5% TDS
      // Extraction: (4.5 × 36) / 18 = 9%
      // This is under-extracted (espresso typically aims for 18-22%)
      const result = calculateExtractionYield({
        tds: 4.5,
        coffeeDose: 18,
        beverageWeight: 36,
      });

      expect(result.extractionYield).toBeCloseTo(9, 2);
      expect(result.assessment).toBe('under-extracted');
    });

    it('should calculate extraction yield for pour over', () => {
      // Pour over: 20g dose, 300g yield, 1.35% TDS
      // Extraction: (1.35 × 300) / 20 = 20.25%
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 20,
        beverageWeight: 300,
      });

      expect(result.extractionYield).toBeCloseTo(20.25, 2);
      expect(result.assessment).toBe('optimal');
    });

    it('should calculate extraction yield for French press', () => {
      // French press: 30g dose, 500g yield, 1.45% TDS
      // Extraction: (1.45 × 500) / 30 = 24.17%
      const result = calculateExtractionYield({
        tds: 1.45,
        coffeeDose: 30,
        beverageWeight: 500,
      });

      expect(result.extractionYield).toBeCloseTo(24.17, 2);
      expect(result.assessment).toBe('over-extracted');
    });

    it('should calculate under-extracted coffee', () => {
      // Under-extracted: 20g dose, 300g yield, 1.0% TDS
      // Extraction: (1.0 × 300) / 20 = 15%
      const result = calculateExtractionYield({
        tds: 1.0,
        coffeeDose: 20,
        beverageWeight: 300,
      });

      expect(result.extractionYield).toBe(15);
      expect(result.assessment).toBe('under-extracted');
      expect(result.recommendation).toContain('underekstrahert');
    });

    it('should calculate optimal extraction at lower boundary', () => {
      // Exactly 18% extraction (lower boundary of optimal)
      // 18g dose, 300g yield, 1.08% TDS
      // Extraction: (1.08 × 300) / 18 = 18%
      const result = calculateExtractionYield({
        tds: 1.08,
        coffeeDose: 18,
        beverageWeight: 300,
      });

      expect(result.extractionYield).toBeCloseTo(18, 2);
      expect(result.assessment).toBe('optimal');
    });

    it('should calculate optimal extraction at upper boundary', () => {
      // Exactly 22% extraction (upper boundary of optimal)
      // 20g dose, 300g yield, need TDS that gives 22%
      // 22 = (TDS × 300) / 20
      // TDS = (22 × 20) / 300 = 1.4667%
      const result = calculateExtractionYield({
        tds: 1.4667,
        coffeeDose: 20,
        beverageWeight: 300,
      });

      expect(result.extractionYield).toBeCloseTo(22, 2);
      expect(result.assessment).toBe('optimal');
    });

    it('should calculate over-extracted coffee', () => {
      // Over-extracted: 15g dose, 300g yield, 1.2% TDS
      // Extraction: (1.2 × 300) / 15 = 24%
      const result = calculateExtractionYield({
        tds: 1.2,
        coffeeDose: 15,
        beverageWeight: 300,
      });

      expect(result.extractionYield).toBe(24);
      expect(result.assessment).toBe('over-extracted');
      expect(result.recommendation).toContain('overekstrahert');
    });
  });

  describe('Assessment Classification Tests', () => {
    it('should classify 17.99% as under-extracted', () => {
      expect(getExtractionAssessment(17.99)).toBe('under-extracted');
    });

    it('should classify 18% as optimal', () => {
      expect(getExtractionAssessment(18)).toBe('optimal');
    });

    it('should classify 20% as optimal', () => {
      expect(getExtractionAssessment(20)).toBe('optimal');
    });

    it('should classify 22% as optimal', () => {
      expect(getExtractionAssessment(22)).toBe('optimal');
    });

    it('should classify 22.01% as over-extracted', () => {
      expect(getExtractionAssessment(22.01)).toBe('over-extracted');
    });

    it('should classify very low extraction as under-extracted', () => {
      expect(getExtractionAssessment(10)).toBe('under-extracted');
    });

    it('should classify very high extraction as over-extracted', () => {
      expect(getExtractionAssessment(30)).toBe('over-extracted');
    });
  });

  describe('Input Validation Tests', () => {
    describe('TDS Validation', () => {
      it('should reject zero TDS', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 0,
            coffeeDose: 18,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject negative TDS', () => {
        expect(() =>
          calculateExtractionYield({
            tds: -1,
            coffeeDose: 18,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject TDS below minimum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 0.005,
            coffeeDose: 18,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject TDS above maximum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 5.5,
            coffeeDose: 18,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should accept TDS at minimum boundary', () => {
        const result = calculateExtractionYield({
          tds: 0.01,
          coffeeDose: 18,
          beverageWeight: 300,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });

      it('should accept TDS at maximum boundary', () => {
        const result = calculateExtractionYield({
          tds: 5,
          coffeeDose: 18,
          beverageWeight: 300,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });
    });

    describe('Coffee Dose Validation', () => {
      it('should reject zero coffee dose', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 0,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject negative coffee dose', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: -10,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject coffee dose below minimum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 0.5,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject coffee dose above maximum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 150,
            beverageWeight: 300,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should accept coffee dose at minimum boundary', () => {
        const result = calculateExtractionYield({
          tds: 1.35,
          coffeeDose: 1,
          beverageWeight: 300,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });

      it('should accept coffee dose at maximum boundary', () => {
        const result = calculateExtractionYield({
          tds: 1.35,
          coffeeDose: 100,
          beverageWeight: 300,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });
    });

    describe('Beverage Weight Validation', () => {
      it('should reject zero beverage weight', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 18,
            beverageWeight: 0,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject negative beverage weight', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 18,
            beverageWeight: -100,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject beverage weight below minimum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 18,
            beverageWeight: 5,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should reject beverage weight above maximum range', () => {
        expect(() =>
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 18,
            beverageWeight: 1500,
          })
        ).toThrow(CoffeeCalculationError);
      });

      it('should accept beverage weight at minimum boundary', () => {
        const result = calculateExtractionYield({
          tds: 1.35,
          coffeeDose: 18,
          beverageWeight: 10,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });

      it('should accept beverage weight at maximum boundary', () => {
        const result = calculateExtractionYield({
          tds: 1.35,
          coffeeDose: 18,
          beverageWeight: 1000,
        });
        expect(result.extractionYield).toBeGreaterThan(0);
      });
    });

    describe('Error Details', () => {
      it('should include field name in error for invalid TDS', () => {
        try {
          calculateExtractionYield({
            tds: -1,
            coffeeDose: 18,
            beverageWeight: 300,
          });
          expect.fail('Should have thrown error');
        } catch (error) {
          expect(error).toBeInstanceOf(CoffeeCalculationError);
          expect((error as CoffeeCalculationError).field).toBe('tds');
          expect((error as CoffeeCalculationError).code).toBe('invalid_input');
        }
      });

      it('should include field name in error for out of range TDS', () => {
        try {
          calculateExtractionYield({
            tds: 10,
            coffeeDose: 18,
            beverageWeight: 300,
          });
          expect.fail('Should have thrown error');
        } catch (error) {
          expect(error).toBeInstanceOf(CoffeeCalculationError);
          expect((error as CoffeeCalculationError).field).toBe('tds');
          expect((error as CoffeeCalculationError).code).toBe('out_of_range');
        }
      });

      it('should include field name in error for invalid coffee dose', () => {
        try {
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 0,
            beverageWeight: 300,
          });
          expect.fail('Should have thrown error');
        } catch (error) {
          expect(error).toBeInstanceOf(CoffeeCalculationError);
          expect((error as CoffeeCalculationError).field).toBe('coffeeDose');
        }
      });

      it('should include field name in error for invalid beverage weight', () => {
        try {
          calculateExtractionYield({
            tds: 1.35,
            coffeeDose: 18,
            beverageWeight: -100,
          });
          expect.fail('Should have thrown error');
        } catch (error) {
          expect(error).toBeInstanceOf(CoffeeCalculationError);
          expect((error as CoffeeCalculationError).field).toBe('beverageWeight');
        }
      });
    });
  });

  describe('Result Structure Tests', () => {
    it('should return all required result fields', () => {
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 20,
        beverageWeight: 300,
      });

      expect(result).toHaveProperty('extractionYield');
      expect(result).toHaveProperty('assessment');
      expect(result).toHaveProperty('recommendation');
      expect(typeof result.extractionYield).toBe('number');
      expect(typeof result.assessment).toBe('string');
      expect(typeof result.recommendation).toBe('string');
    });

    it('should provide meaningful recommendations', () => {
      const underExtracted = calculateExtractionYield({
        tds: 1.0,
        coffeeDose: 20,
        beverageWeight: 300,
      });
      expect(underExtracted.recommendation.length).toBeGreaterThan(20);
      expect(underExtracted.recommendation).toContain('underekstrahert');

      const optimal = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 20,
        beverageWeight: 300,
      });
      expect(optimal.recommendation.length).toBeGreaterThan(20);
      expect(optimal.recommendation).toContain('optimale');

      const overExtracted = calculateExtractionYield({
        tds: 1.5,
        coffeeDose: 20,
        beverageWeight: 300,
      });
      expect(overExtracted.recommendation.length).toBeGreaterThan(20);
      expect(overExtracted.recommendation).toContain('overekstrahert');
    });

    it('should round extraction yield to 2 decimal places', () => {
      // Create a scenario that would produce many decimal places
      const result = calculateExtractionYield({
        tds: 1.333333,
        coffeeDose: 17.777777,
        beverageWeight: 299.999999,
      });

      // Check that the result has at most 2 decimal places
      const decimalPlaces = (result.extractionYield.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('Property-Based Tests', () => {
    it('Feature: coffee-barista-tools, Property 1: Extraction yield formula correctness', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),      // TDS (start at 0.02 to avoid floating point issues)
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),       // Coffee dose
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),     // Beverage weight
          (tds, coffeeDose, beverageWeight) => {
            const result = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const expected = (tds * beverageWeight) / coffeeDose;
            
            // Allow small floating-point tolerance (0.01%)
            expect(Math.abs(result.extractionYield - expected)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: coffee-barista-tools, Property 2: Extraction assessment classification', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            const result = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const yield_ = result.extractionYield;
            
            // Verify assessment matches the yield value
            if (yield_ < 18) {
              expect(result.assessment).toBe('under-extracted');
            } else if (yield_ <= 22) {
              expect(result.assessment).toBe('optimal');
            } else {
              expect(result.assessment).toBe('over-extracted');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: coffee-barista-tools, Property 3: Extraction yield input validation', () => {
      // Test that invalid inputs always throw errors
      fc.assert(
        fc.property(
          fc.oneof(
            fc.float({ max: 0 }),           // Invalid TDS (≤ 0)
            fc.float({ min: Math.fround(5.01), max: Math.fround(100) }) // Invalid TDS (> 5)
          ),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            expect(() =>
              calculateExtractionYield({ tds, coffeeDose, beverageWeight })
            ).toThrow(CoffeeCalculationError);
          }
        ),
        { numRuns: 50 }
      );

      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.oneof(
            fc.float({ max: 0 }),            // Invalid dose (≤ 0)
            fc.float({ min: Math.fround(100.01), max: Math.fround(200) }) // Invalid dose (> 100)
          ),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            expect(() =>
              calculateExtractionYield({ tds, coffeeDose, beverageWeight })
            ).toThrow(CoffeeCalculationError);
          }
        ),
        { numRuns: 50 }
      );

      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.oneof(
            fc.float({ max: 0 }),              // Invalid weight (≤ 0)
            fc.float({ min: Math.fround(1000.01), max: Math.fround(2000) }) // Invalid weight (> 1000)
          ),
          (tds, coffeeDose, beverageWeight) => {
            expect(() =>
              calculateExtractionYield({ tds, coffeeDose, beverageWeight })
            ).toThrow(CoffeeCalculationError);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('Property: Extraction yield is always non-negative for valid inputs', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            const result = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            expect(result.extractionYield).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property: Higher TDS increases extraction yield proportionally', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(2.5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            const result1 = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const result2 = calculateExtractionYield({ 
              tds: tds * 2, 
              coffeeDose, 
              beverageWeight 
            });
            
            // Doubling TDS should double extraction yield
            expect(result2.extractionYield).toBeCloseTo(result1.extractionYield * 2, 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property: Higher coffee dose decreases extraction yield proportionally', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(50), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            const result1 = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            const result2 = calculateExtractionYield({ 
              tds, 
              coffeeDose: coffeeDose * 2, 
              beverageWeight 
            });
            
            // Doubling coffee dose should halve extraction yield
            expect(result2.extractionYield).toBeCloseTo(result1.extractionYield / 2, 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property: Assessment recommendation is never empty', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.02), max: Math.fround(5), noNaN: true }),
          fc.float({ min: Math.fround(1), max: Math.fround(100), noNaN: true }),
          fc.float({ min: Math.fround(10), max: Math.fround(1000), noNaN: true }),
          (tds, coffeeDose, beverageWeight) => {
            const result = calculateExtractionYield({ tds, coffeeDose, beverageWeight });
            expect(result.recommendation).toBeTruthy();
            expect(result.recommendation.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very small TDS values', () => {
      const result = calculateExtractionYield({
        tds: 0.01,
        coffeeDose: 20,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBeCloseTo(0.15, 2);
      expect(result.assessment).toBe('under-extracted');
    });

    it('should handle very large TDS values', () => {
      const result = calculateExtractionYield({
        tds: 5,
        coffeeDose: 20,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBe(75);
      expect(result.assessment).toBe('over-extracted');
    });

    it('should handle minimum coffee dose', () => {
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 1,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBeGreaterThan(0);
    });

    it('should handle maximum coffee dose', () => {
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 100,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBeGreaterThan(0);
    });

    it('should handle minimum beverage weight', () => {
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 5,
        beverageWeight: 10,
      });
      expect(result.extractionYield).toBeGreaterThan(0);
    });

    it('should handle maximum beverage weight', () => {
      const result = calculateExtractionYield({
        tds: 1.35,
        coffeeDose: 50,
        beverageWeight: 1000,
      });
      expect(result.extractionYield).toBeGreaterThan(0);
    });

    it('should handle extraction exactly at 18% boundary', () => {
      // Calculate inputs that give exactly 18%
      const result = calculateExtractionYield({
        tds: 1.08,
        coffeeDose: 18,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBeCloseTo(18, 2);
      expect(result.assessment).toBe('optimal');
    });

    it('should handle extraction exactly at 22% boundary', () => {
      // Calculate inputs that give exactly 22%
      const result = calculateExtractionYield({
        tds: 1.32,
        coffeeDose: 18,
        beverageWeight: 300,
      });
      expect(result.extractionYield).toBeCloseTo(22, 2);
      expect(result.assessment).toBe('optimal');
    });
  });
});
