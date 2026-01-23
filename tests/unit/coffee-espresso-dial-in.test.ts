/**
 * Unit tests for Espresso Dial-in Log Calculator
 * 
 * Tests calculation logic, validation, and edge cases.
 * 
 * @see Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEspressoMetrics,
  getExtractionRatioRecommendation,
  espressoMetricsSchema,
  type EspressoMetricsInputs,
} from '@/lib/calculations/coffee/espresso-dial-in';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Espresso Dial-in Log Calculator', () => {
  describe('calculateEspressoMetrics', () => {
    it('should calculate extraction ratio correctly', () => {
      // Requirement 4.1: Extraction ratio = yield / dose
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 28,
      });

      expect(result.extractionRatio).toBe(2.0);
    });

    it('should calculate flow rate correctly', () => {
      // Requirement 4.2: Flow rate = yield / time
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 28,
      });

      expect(result.flowRate).toBe(1.29);
    });

    it('should recommend increasing yield for low extraction ratio', () => {
      // Requirement 4.3: Ratio < 1.5 should recommend increasing yield
      const result = calculateEspressoMetrics({
        dose: 20,
        yield: 25,
        time: 25,
      });

      expect(result.extractionRatio).toBe(1.25);
      expect(result.recommendation).toBe('increase-yield');
      expect(result.recommendationText).toContain('increasing yield');
    });

    it('should indicate optimal for extraction ratio in range', () => {
      // Requirement 4.4: Ratio 1.5-2.5 should indicate optimal
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 28,
      });

      expect(result.extractionRatio).toBe(2.0);
      expect(result.recommendation).toBe('optimal');
      expect(result.recommendationText).toContain('optimal');
    });

    it('should recommend decreasing yield for high extraction ratio', () => {
      // Requirement 4.5: Ratio > 2.5 should recommend decreasing yield
      const result = calculateEspressoMetrics({
        dose: 15,
        yield: 45,
        time: 30,
      });

      expect(result.extractionRatio).toBe(3.0);
      expect(result.recommendation).toBe('decrease-yield');
      expect(result.recommendationText).toContain('decreasing yield');
    });

    it('should handle boundary case at 1.5 ratio', () => {
      const result = calculateEspressoMetrics({
        dose: 20,
        yield: 30,
        time: 25,
      });

      expect(result.extractionRatio).toBe(1.5);
      expect(result.recommendation).toBe('optimal');
    });

    it('should handle boundary case at 2.5 ratio', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 45,
        time: 30,
      });

      expect(result.extractionRatio).toBe(2.5);
      expect(result.recommendation).toBe('optimal');
    });

    it('should round extraction ratio to 2 decimal places', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 37,
        time: 28,
      });

      expect(result.extractionRatio).toBe(2.06);
    });

    it('should round flow rate to 2 decimal places', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 37,
        time: 28,
      });

      expect(result.flowRate).toBe(1.32);
    });
  });

  describe('Input Validation', () => {
    it('should reject zero dose', () => {
      // Requirement 4.6: Dose <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: 0,
          yield: 36,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative dose', () => {
      // Requirement 4.6: Dose <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: -5,
          yield: 36,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject dose below minimum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 4,
          yield: 36,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject dose above maximum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 31,
          yield: 36,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject zero yield', () => {
      // Requirement 4.7: Yield <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 0,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative yield', () => {
      // Requirement 4.7: Yield <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: -10,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject yield below minimum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 9,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject yield above maximum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 101,
          time: 28,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject zero time', () => {
      // Requirement 4.8: Time <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 36,
          time: 0,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative time', () => {
      // Requirement 4.8: Time <= 0 should be rejected
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 36,
          time: -5,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject time below minimum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 36,
          time: 9,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject time above maximum', () => {
      expect(() => {
        calculateEspressoMetrics({
          dose: 18,
          yield: 36,
          time: 61,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should accept minimum valid values', () => {
      const result = calculateEspressoMetrics({
        dose: 5,
        yield: 10,
        time: 10,
      });

      expect(result.extractionRatio).toBe(2.0);
      expect(result.flowRate).toBe(1.0);
    });

    it('should accept maximum valid values', () => {
      const result = calculateEspressoMetrics({
        dose: 30,
        yield: 100,
        time: 60,
      });

      expect(result.extractionRatio).toBe(3.33);
      expect(result.flowRate).toBe(1.67);
    });
  });

  describe('getExtractionRatioRecommendation', () => {
    it('should return increase-yield for ratio below 1.5', () => {
      expect(getExtractionRatioRecommendation(1.0)).toBe('increase-yield');
      expect(getExtractionRatioRecommendation(1.4)).toBe('increase-yield');
    });

    it('should return optimal for ratio at 1.5', () => {
      expect(getExtractionRatioRecommendation(1.5)).toBe('optimal');
    });

    it('should return optimal for ratio between 1.5 and 2.5', () => {
      expect(getExtractionRatioRecommendation(2.0)).toBe('optimal');
    });

    it('should return optimal for ratio at 2.5', () => {
      expect(getExtractionRatioRecommendation(2.5)).toBe('optimal');
    });

    it('should return decrease-yield for ratio above 2.5', () => {
      expect(getExtractionRatioRecommendation(2.6)).toBe('decrease-yield');
      expect(getExtractionRatioRecommendation(3.0)).toBe('decrease-yield');
    });
  });

  describe('Zod Schema Validation', () => {
    it('should validate correct inputs', () => {
      const validInput = {
        dose: 18,
        yield: 36,
        time: 28,
      };

      const result = espressoMetricsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject dose below minimum', () => {
      const invalidInput = {
        dose: 4,
        yield: 36,
        time: 28,
      };

      const result = espressoMetricsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject yield above maximum', () => {
      const invalidInput = {
        dose: 18,
        yield: 101,
        time: 28,
      };

      const result = espressoMetricsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject time below minimum', () => {
      const invalidInput = {
        dose: 18,
        yield: 36,
        time: 9,
      };

      const result = espressoMetricsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('Real-world Espresso Scenarios', () => {
    it('should handle ristretto shot (1:1.5 ratio)', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 27,
        time: 25,
      });

      expect(result.extractionRatio).toBe(1.5);
      expect(result.recommendation).toBe('optimal');
    });

    it('should handle traditional espresso (1:2 ratio)', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 28,
      });

      expect(result.extractionRatio).toBe(2.0);
      expect(result.recommendation).toBe('optimal');
    });

    it('should handle lungo shot (1:3 ratio)', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 54,
        time: 35,
      });

      expect(result.extractionRatio).toBe(3.0);
      expect(result.recommendation).toBe('decrease-yield');
    });

    it('should handle fast extraction', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 15,
      });

      expect(result.flowRate).toBe(2.4);
      expect(result.recommendation).toBe('optimal');
    });

    it('should handle slow extraction', () => {
      const result = calculateEspressoMetrics({
        dose: 18,
        yield: 36,
        time: 45,
      });

      expect(result.flowRate).toBe(0.8);
      expect(result.recommendation).toBe('optimal');
    });
  });
});
