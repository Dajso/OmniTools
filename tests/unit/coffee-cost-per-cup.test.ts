import { describe, it, expect } from 'vitest';
import { calculateCostPerCup, type CostPerCupInputs } from '@/lib/calculations/coffee/cost-per-cup';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Cost Per Cup Calculator', () => {
  describe('calculateCostPerCup', () => {
    it('should calculate cost per cup correctly', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per gram = 18 / 340 = 0.0529
      // Cost per cup = 0.0529 * 20 = 1.06
      expect(result.costPerCup).toBeCloseTo(1.06, 2);
      expect(result.costPerGram).toBeCloseTo(0.0529, 4);
      expect(result.cupsPerBag).toBeCloseTo(17, 0);
    });

    it('should calculate monthly and annual costs when cups per day is provided', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
        cupsPerDay: 2,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per cup = 1.06
      // Monthly cost = 1.06 * 2 * 30 = 63.53
      // Annual cost = 63.53 * 12 = 762.35
      expect(result.monthlyCost).toBeCloseTo(63.53, 2);
      expect(result.annualCost).toBeCloseTo(762.35, 2);
    });

    it('should not calculate monthly/annual costs when cups per day is not provided', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
      };

      const result = calculateCostPerCup(inputs);

      expect(result.monthlyCost).toBeUndefined();
      expect(result.annualCost).toBeUndefined();
    });

    it('should not calculate monthly/annual costs when cups per day is zero', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
        cupsPerDay: 0,
      };

      const result = calculateCostPerCup(inputs);

      expect(result.monthlyCost).toBeUndefined();
      expect(result.annualCost).toBeUndefined();
    });

    it('should handle expensive specialty coffee', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 45,
        bagWeight: 250,
        dosePerCup: 18,
        cupsPerDay: 1,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per cup = (45 / 250) * 18 = 3.24
      expect(result.costPerCup).toBeCloseTo(3.24, 2);
      expect(result.cupsPerBag).toBeCloseTo(13.9, 1);
      expect(result.monthlyCost).toBeCloseTo(97.2, 1);
      expect(result.annualCost).toBeCloseTo(1166.4, 1);
    });

    it('should handle bulk coffee purchases', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 60,
        bagWeight: 2000,
        dosePerCup: 15,
        cupsPerDay: 3,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per cup = (60 / 2000) * 15 = 0.45
      expect(result.costPerCup).toBeCloseTo(0.45, 2);
      expect(result.cupsPerBag).toBeCloseTo(133.3, 1);
      expect(result.monthlyCost).toBeCloseTo(40.5, 1);
      expect(result.annualCost).toBeCloseTo(486, 0);
    });

    it('should handle espresso doses', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 22,
        bagWeight: 500,
        dosePerCup: 18,
        cupsPerDay: 2,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per cup = (22 / 500) * 18 = 0.792
      expect(result.costPerCup).toBeCloseTo(0.79, 2);
      expect(result.cupsPerBag).toBeCloseTo(27.8, 1);
    });

    it('should handle large pour over doses', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 20,
        bagWeight: 340,
        dosePerCup: 30,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per cup = (20 / 340) * 30 = 1.76
      expect(result.costPerCup).toBeCloseTo(1.76, 2);
      expect(result.cupsPerBag).toBeCloseTo(11.3, 1);
    });
  });

  describe('input validation', () => {
    it('should reject zero bag price', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 0,
        bagWeight: 340,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag price must be a positive number');
    });

    it('should reject negative bag price', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: -10,
        bagWeight: 340,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag price must be a positive number');
    });

    it('should reject bag price below minimum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 0.5,
        bagWeight: 340,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag price must be between $1 and $500');
    });

    it('should reject bag price above maximum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 501,
        bagWeight: 340,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag price must be between $1 and $500');
    });

    it('should reject zero bag weight', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 0,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag weight must be a positive number');
    });

    it('should reject negative bag weight', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: -340,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag weight must be a positive number');
    });

    it('should reject bag weight below minimum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 50,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag weight must be between 100g and 5000g');
    });

    it('should reject bag weight above maximum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 5001,
        dosePerCup: 20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Bag weight must be between 100g and 5000g');
    });

    it('should reject zero dose per cup', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 0,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Dose per cup must be a positive number');
    });

    it('should reject negative dose per cup', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: -20,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Dose per cup must be a positive number');
    });

    it('should reject dose per cup below minimum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 3,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Dose per cup must be between 5g and 50g');
    });

    it('should reject dose per cup above maximum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 51,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Dose per cup must be between 5g and 50g');
    });

    it('should reject negative cups per day', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
        cupsPerDay: -1,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Cups per day cannot be negative');
    });

    it('should reject cups per day above maximum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
        cupsPerDay: 21,
      };

      expect(() => calculateCostPerCup(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCostPerCup(inputs)).toThrow('Cups per day cannot exceed 20');
    });

    it('should accept cups per day at maximum', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 18,
        bagWeight: 340,
        dosePerCup: 20,
        cupsPerDay: 20,
      };

      const result = calculateCostPerCup(inputs);
      expect(result.monthlyCost).toBeDefined();
      expect(result.annualCost).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle minimum valid inputs', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 1,
        bagWeight: 100,
        dosePerCup: 5,
      };

      const result = calculateCostPerCup(inputs);

      expect(result.costPerCup).toBeCloseTo(0.05, 2);
      expect(result.cupsPerBag).toBeCloseTo(20, 0);
    });

    it('should handle maximum valid inputs', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 500,
        bagWeight: 5000,
        dosePerCup: 50,
        cupsPerDay: 20,
      };

      const result = calculateCostPerCup(inputs);

      expect(result.costPerCup).toBeCloseTo(5, 2);
      expect(result.cupsPerBag).toBeCloseTo(100, 0);
      expect(result.monthlyCost).toBeCloseTo(3000, 0);
      expect(result.annualCost).toBeCloseTo(36000, 0);
    });

    it('should handle fractional results correctly', () => {
      const inputs: CostPerCupInputs = {
        bagPrice: 17.99,
        bagWeight: 340,
        dosePerCup: 18.5,
      };

      const result = calculateCostPerCup(inputs);

      // Cost per gram = 17.99 / 340 = 0.0529
      // Cost per cup = 0.0529 * 18.5 = 0.98
      expect(result.costPerCup).toBeCloseTo(0.98, 2);
      expect(result.cupsPerBag).toBeCloseTo(18.4, 1);
    });
  });
});
