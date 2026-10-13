/**
 * Unit tests for Brew Ratio Calculator
 * 
 * Tests specific examples, edge cases, and error conditions
 * for the brew ratio calculation logic.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBrewRatio,
  getStrengthProfile,
  type BrewRatioInputs,
  type StrengthProfile,
} from '@/lib/calculations/coffee/brew-ratio';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Brew Ratio Calculator', () => {
  describe('calculateBrewRatio', () => {
    it('should calculate water amount correctly for 1:15 ratio', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 15,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(300);
      expect(result.strengthProfile).toBe('strong');
      expect(result.ratioDisplay).toBe('1:15');
    });

    it('should calculate water amount correctly for 1:16 ratio', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 18,
        ratio: 16,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(288);
      expect(result.strengthProfile).toBe('balanced');
      expect(result.ratioDisplay).toBe('1:16');
    });

    it('should calculate water amount correctly for 1:18 ratio', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 15,
        ratio: 18,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(270);
      expect(result.strengthProfile).toBe('mild');
      expect(result.ratioDisplay).toBe('1:18');
    });

    it('should round water amount to 1 decimal place', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 17.5,
        ratio: 16,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(280);
    });

    it('should include description in results', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 16,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.description).toBeDefined();
      expect(result.description.length).toBeGreaterThan(0);
    });
  });

  describe('getStrengthProfile', () => {
    it('should classify ratio 15 as strong', () => {
      expect(getStrengthProfile(15)).toBe('strong');
    });

    it('should classify ratio 14 as strong', () => {
      expect(getStrengthProfile(14)).toBe('strong');
    });

    it('should classify ratio 10 as strong', () => {
      expect(getStrengthProfile(10)).toBe('strong');
    });

    it('should classify ratio 16 as balanced', () => {
      expect(getStrengthProfile(16)).toBe('balanced');
    });

    it('should classify ratio 17 as balanced', () => {
      expect(getStrengthProfile(17)).toBe('balanced');
    });

    it('should classify ratio 15.5 as balanced', () => {
      expect(getStrengthProfile(15.5)).toBe('balanced');
    });

    it('should classify ratio 18 as mild', () => {
      expect(getStrengthProfile(18)).toBe('mild');
    });

    it('should classify ratio 20 as mild', () => {
      expect(getStrengthProfile(20)).toBe('mild');
    });

    it('should classify ratio 17.1 as mild', () => {
      expect(getStrengthProfile(17.1)).toBe('mild');
    });
  });

  describe('Input Validation', () => {
    describe('Coffee Dose Validation', () => {
      it('should throw error for zero coffee dose', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 0,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Kaffemengden må være et positivt tall');
      });

      it('should throw error for negative coffee dose', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: -10,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Kaffemengden må være et positivt tall');
      });

      it('should throw error for coffee dose below minimum', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 0.5,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Kaffemengden må være mellom 1 g og 100 g');
      });

      it('should throw error for coffee dose above maximum', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 150,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Kaffemengden må være mellom 1 g og 100 g');
      });

      it('should accept coffee dose at minimum boundary', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 1,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).not.toThrow();
      });

      it('should accept coffee dose at maximum boundary', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 100,
          ratio: 15,
        };

        expect(() => calculateBrewRatio(inputs)).not.toThrow();
      });
    });

    describe('Ratio Validation', () => {
      it('should throw error for ratio less than 1', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 20,
          ratio: 0.5,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Forholdet må være minst 1');
      });

      it('should throw error for ratio below minimum range', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 20,
          ratio: 5,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Forholdet må være mellom 10 og 25');
      });

      it('should throw error for ratio above maximum range', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 20,
          ratio: 30,
        };

        expect(() => calculateBrewRatio(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateBrewRatio(inputs)).toThrow('Forholdet må være mellom 10 og 25');
      });

      it('should accept ratio at minimum boundary', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 20,
          ratio: 10,
        };

        expect(() => calculateBrewRatio(inputs)).not.toThrow();
      });

      it('should accept ratio at maximum boundary', () => {
        const inputs: BrewRatioInputs = {
          coffeeDose: 20,
          ratio: 25,
        };

        expect(() => calculateBrewRatio(inputs)).not.toThrow();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid inputs', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 1,
        ratio: 10,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(10);
      expect(result.strengthProfile).toBe('strong');
    });

    it('should handle maximum valid inputs', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 100,
        ratio: 25,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(2500);
      expect(result.strengthProfile).toBe('mild');
    });

    it('should handle decimal coffee dose', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 18.5,
        ratio: 16,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(296);
    });

    it('should handle decimal ratio', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 15.5,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.waterAmount).toBe(310);
      expect(result.strengthProfile).toBe('balanced');
    });
  });

  describe('Strength Profile Boundaries', () => {
    it('should classify exactly 15 as strong', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 15,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.strengthProfile).toBe('strong');
    });

    it('should classify 15.01 as balanced', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 15.01,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.strengthProfile).toBe('balanced');
    });

    it('should classify exactly 17 as balanced', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 17,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.strengthProfile).toBe('balanced');
    });

    it('should classify 17.01 as mild', () => {
      const inputs: BrewRatioInputs = {
        coffeeDose: 20,
        ratio: 17.01,
      };

      const result = calculateBrewRatio(inputs);

      expect(result.strengthProfile).toBe('mild');
    });
  });
});
