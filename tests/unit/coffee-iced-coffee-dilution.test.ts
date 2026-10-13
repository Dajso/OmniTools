/**
 * Unit tests for Iced Coffee Dilution Calculator
 * 
 * Tests specific examples, edge cases, and error conditions
 * for the iced coffee dilution calculation logic.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateIcedCoffeeDilution,
  type IcedCoffeeDilutionInputs,
} from '@/lib/calculations/coffee/iced-coffee-dilution';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Iced Coffee Dilution Calculator', () => {
  describe('calculateIcedCoffeeDilution', () => {
    it('should calculate correct amounts for standard iced coffee', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(240);
      expect(result.iceAmount).toBe(160);
      expect(result.brewingTDS).toBe(2);
      expect(result.warning).toBeUndefined();
    });

    it('should calculate correct amounts for high ice percentage', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 500,
        targetTDS: 1.0,
        icePercentage: 60,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(200);
      expect(result.iceAmount).toBe(300);
      expect(result.brewingTDS).toBe(2.5);
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('for mye fortynning');
    });

    it('should calculate correct amounts for low ice percentage', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 300,
        targetTDS: 1.5,
        icePercentage: 20,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(240);
      expect(result.iceAmount).toBe(60);
      expect(result.brewingTDS).toBe(1.88);
      expect(result.warning).toBeUndefined();
    });

    it('should show warning when ice percentage is exactly 50%', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 50,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.warning).toBeUndefined(); // Warning only for > 50%
    });

    it('should show warning when ice percentage is above 50%', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 51,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.warning).toBeDefined();
    });

    it('should handle minimum valid values', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 100,
        targetTDS: 0.5,
        icePercentage: 10,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(90);
      expect(result.iceAmount).toBe(10);
      expect(result.brewingTDS).toBeCloseTo(0.56, 2);
    });

    it('should handle maximum valid values', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 2000,
        targetTDS: 3,
        icePercentage: 70,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(600);
      expect(result.iceAmount).toBe(1400);
      expect(result.brewingTDS).toBe(10);
      expect(result.warning).toBeDefined();
    });

    it('should round results to appropriate decimal places', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 333,
        targetTDS: 1.33,
        icePercentage: 33,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      // Check that values are rounded
      expect(result.hotCoffeeAmount).toBe(223.1);
      expect(result.iceAmount).toBe(109.9);
      expect(result.brewingTDS).toBe(1.99); // Actual rounded value
    });
  });

  describe('Input validation', () => {
    it('should reject zero target volume', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 0,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Volumet må være et positivt tall');
    });

    it('should reject negative target volume', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: -100,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Volumet må være et positivt tall');
    });

    it('should reject target volume below minimum', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 50,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Volumet må være mellom 100 ml og 2000 ml');
    });

    it('should reject target volume above maximum', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 2500,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Volumet må være mellom 100 ml og 2000 ml');
    });

    it('should reject zero target TDS', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 0,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('TDS må være et positivt tall');
    });

    it('should reject negative target TDS', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: -1,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('TDS må være et positivt tall');
    });

    it('should reject target TDS below minimum', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 0.3,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('TDS må være mellom 0,5 % og 3 %');
    });

    it('should reject target TDS above maximum', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 4,
        icePercentage: 40,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('TDS må være mellom 0,5 % og 3 %');
    });

    it('should reject negative ice percentage', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: -10,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Andelen is må være mellom 0 % og 100 %');
    });

    it('should reject ice percentage above 100%', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 110,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Andelen is må være mellom 0 % og 100 %');
    });

    it('should reject ice percentage below minimum range', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 5,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Andelen is må være mellom 10 % og 70 %');
    });

    it('should reject ice percentage above maximum range', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 80,
      };

      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateIcedCoffeeDilution(inputs)).toThrow('Andelen is må være mellom 10 % og 70 %');
    });
  });

  describe('Edge cases', () => {
    it('should handle very small target volume', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 100,
        targetTDS: 1.0,
        icePercentage: 30,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(70);
      expect(result.iceAmount).toBe(30);
      expect(result.brewingTDS).toBeCloseTo(1.43, 2);
    });

    it('should handle very large target volume', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 2000,
        targetTDS: 1.0,
        icePercentage: 30,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(1400);
      expect(result.iceAmount).toBe(600);
      expect(result.brewingTDS).toBeCloseTo(1.43, 2);
    });

    it('should handle minimum ice percentage', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 10,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(360);
      expect(result.iceAmount).toBe(40);
      expect(result.brewingTDS).toBeCloseTo(1.33, 2);
      expect(result.warning).toBeUndefined();
    });

    it('should handle maximum ice percentage', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 70,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      expect(result.hotCoffeeAmount).toBe(120);
      expect(result.iceAmount).toBe(280);
      expect(result.brewingTDS).toBe(4);
      expect(result.warning).toBeDefined();
    });
  });

  describe('Formula verification', () => {
    it('should maintain target TDS after dilution', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 400,
        targetTDS: 1.2,
        icePercentage: 40,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      // Verify: (brewingTDS × hotCoffeeAmount) / targetVolume = targetTDS
      const calculatedTargetTDS = (result.brewingTDS * result.hotCoffeeAmount) / inputs.targetVolume;
      expect(calculatedTargetTDS).toBeCloseTo(inputs.targetTDS, 2);
    });

    it('should maintain volume conservation', () => {
      const inputs: IcedCoffeeDilutionInputs = {
        targetVolume: 500,
        targetTDS: 1.5,
        icePercentage: 35,
      };

      const result = calculateIcedCoffeeDilution(inputs);

      // Verify: hotCoffeeAmount + iceAmount = targetVolume
      expect(result.hotCoffeeAmount + result.iceAmount).toBeCloseTo(inputs.targetVolume, 1);
    });
  });
});
