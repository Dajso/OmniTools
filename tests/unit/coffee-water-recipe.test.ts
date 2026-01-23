/**
 * Unit tests for Water Recipe Calculator
 * 
 * Tests calculation logic, validation, and SCA compliance checking.
 * 
 * @see Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */

import { describe, it, expect } from 'vitest';
import {
  calculateWaterRecipe,
  isHardnessCompliant,
  isAlkalinityCompliant,
  type WaterRecipeInputs,
} from '@/lib/calculations/coffee/water-recipe';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Water Recipe Calculator', () => {
  describe('calculateWaterRecipe', () => {
    it('should calculate Epsom salt amount correctly', () => {
      // Requirement 5.1: Epsom salt calculation
      const result = calculateWaterRecipe({
        waterVolume: 5,
        targetHardness: 100,
        targetAlkalinity: 50,
      });

      // Formula: (100 / 100) × 5 = 5.0g
      expect(result.epsomSalt).toBe(5.0);
    });

    it('should calculate baking soda amount correctly', () => {
      // Requirement 5.2: Baking soda calculation
      const result = calculateWaterRecipe({
        waterVolume: 5,
        targetHardness: 100,
        targetAlkalinity: 60,
      });

      // Formula: (60 / 120) × 5 = 2.5g
      expect(result.bakingSoda).toBe(2.5);
    });

    it('should indicate SCA compliance when both hardness and alkalinity are within range', () => {
      // Requirement 5.3, 5.4: SCA compliance indicators
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,  // Within 50-175 ppm
        targetAlkalinity: 50, // Within 40-70 ppm
      });

      expect(result.scaCompliant).toBe(true);
      expect(result.complianceDetails.hardness.compliant).toBe(true);
      expect(result.complianceDetails.alkalinity.compliant).toBe(true);
    });

    it('should indicate non-compliance when hardness is below SCA range', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 30,   // Below 50 ppm
        targetAlkalinity: 50,
      });

      expect(result.scaCompliant).toBe(false);
      expect(result.complianceDetails.hardness.compliant).toBe(false);
      expect(result.complianceDetails.alkalinity.compliant).toBe(true);
    });

    it('should indicate non-compliance when hardness is above SCA range', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 200,  // Above 175 ppm
        targetAlkalinity: 50,
      });

      expect(result.scaCompliant).toBe(false);
      expect(result.complianceDetails.hardness.compliant).toBe(false);
    });

    it('should indicate non-compliance when alkalinity is below SCA range', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 30, // Below 40 ppm
      });

      expect(result.scaCompliant).toBe(false);
      expect(result.complianceDetails.alkalinity.compliant).toBe(false);
    });

    it('should indicate non-compliance when alkalinity is above SCA range', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 80, // Above 70 ppm
      });

      expect(result.scaCompliant).toBe(false);
      expect(result.complianceDetails.alkalinity.compliant).toBe(false);
    });

    it('should handle edge case at SCA hardness minimum (50 ppm)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 50,
        targetAlkalinity: 50,
      });

      expect(result.complianceDetails.hardness.compliant).toBe(true);
    });

    it('should handle edge case at SCA hardness maximum (175 ppm)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 175,
        targetAlkalinity: 50,
      });

      expect(result.complianceDetails.hardness.compliant).toBe(true);
    });

    it('should handle edge case at SCA alkalinity minimum (40 ppm)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 40,
      });

      expect(result.complianceDetails.alkalinity.compliant).toBe(true);
    });

    it('should handle edge case at SCA alkalinity maximum (70 ppm)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 70,
      });

      expect(result.complianceDetails.alkalinity.compliant).toBe(true);
    });

    it('should calculate correctly for different water volumes', () => {
      const result1L = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 60,
      });

      const result10L = calculateWaterRecipe({
        waterVolume: 10,
        targetHardness: 100,
        targetAlkalinity: 60,
      });

      // Amounts should scale linearly with volume
      expect(result10L.epsomSalt).toBe(result1L.epsomSalt * 10);
      expect(result10L.bakingSoda).toBe(result1L.bakingSoda * 10);
    });

    it('should handle zero hardness', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 0,
        targetAlkalinity: 50,
      });

      expect(result.epsomSalt).toBe(0);
      expect(result.complianceDetails.hardness.compliant).toBe(false);
    });

    it('should handle zero alkalinity', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 0,
      });

      expect(result.bakingSoda).toBe(0);
      expect(result.complianceDetails.alkalinity.compliant).toBe(false);
    });

    it('should provide mixing instructions', () => {
      const result = calculateWaterRecipe({
        waterVolume: 5,
        targetHardness: 100,
        targetAlkalinity: 50,
      });

      expect(result.instructions).toBeDefined();
      expect(result.instructions.length).toBeGreaterThan(0);
      expect(result.instructions[0]).toContain('5L');
    });

    it('should round results to 2 decimal places', () => {
      const result = calculateWaterRecipe({
        waterVolume: 3,
        targetHardness: 75,
        targetAlkalinity: 55,
      });

      // Check that results have at most 2 decimal places
      expect(result.epsomSalt.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.bakingSoda.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('Input Validation', () => {
    it('should reject zero water volume', () => {
      // Requirement 5.5: Water volume validation
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 0,
          targetHardness: 100,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative water volume', () => {
      // Requirement 5.5: Water volume validation
      expect(() => {
        calculateWaterRecipe({
          waterVolume: -1,
          targetHardness: 100,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject water volume below minimum (0.5L)', () => {
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 0.3,
          targetHardness: 100,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject water volume above maximum (20L)', () => {
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 25,
          targetHardness: 100,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative target hardness', () => {
      // Requirement 5.6: Target hardness validation
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 1,
          targetHardness: -10,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject target hardness above maximum (300 ppm)', () => {
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 1,
          targetHardness: 350,
          targetAlkalinity: 50,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject negative target alkalinity', () => {
      // Requirement 5.7: Target alkalinity validation
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 1,
          targetHardness: 100,
          targetAlkalinity: -10,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should reject target alkalinity above maximum (150 ppm)', () => {
      expect(() => {
        calculateWaterRecipe({
          waterVolume: 1,
          targetHardness: 100,
          targetAlkalinity: 200,
        });
      }).toThrow(CoffeeCalculationError);
    });

    it('should include field name in validation errors', () => {
      try {
        calculateWaterRecipe({
          waterVolume: -1,
          targetHardness: 100,
          targetAlkalinity: 50,
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CoffeeCalculationError);
        expect((error as CoffeeCalculationError).field).toBe('waterVolume');
      }
    });
  });

  describe('Helper Functions', () => {
    describe('isHardnessCompliant', () => {
      it('should return true for hardness within SCA range', () => {
        expect(isHardnessCompliant(50)).toBe(true);
        expect(isHardnessCompliant(100)).toBe(true);
        expect(isHardnessCompliant(175)).toBe(true);
      });

      it('should return false for hardness below SCA range', () => {
        expect(isHardnessCompliant(49)).toBe(false);
        expect(isHardnessCompliant(0)).toBe(false);
      });

      it('should return false for hardness above SCA range', () => {
        expect(isHardnessCompliant(176)).toBe(false);
        expect(isHardnessCompliant(300)).toBe(false);
      });
    });

    describe('isAlkalinityCompliant', () => {
      it('should return true for alkalinity within SCA range', () => {
        expect(isAlkalinityCompliant(40)).toBe(true);
        expect(isAlkalinityCompliant(55)).toBe(true);
        expect(isAlkalinityCompliant(70)).toBe(true);
      });

      it('should return false for alkalinity below SCA range', () => {
        expect(isAlkalinityCompliant(39)).toBe(false);
        expect(isAlkalinityCompliant(0)).toBe(false);
      });

      it('should return false for alkalinity above SCA range', () => {
        expect(isAlkalinityCompliant(71)).toBe(false);
        expect(isAlkalinityCompliant(150)).toBe(false);
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should calculate recipe for typical home brewing (1L)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 50,
      });

      expect(result.epsomSalt).toBe(1.0);
      expect(result.bakingSoda).toBeCloseTo(0.42, 2);
      expect(result.scaCompliant).toBe(true);
    });

    it('should calculate recipe for batch brewing (5L)', () => {
      const result = calculateWaterRecipe({
        waterVolume: 5,
        targetHardness: 120,
        targetAlkalinity: 60,
      });

      expect(result.epsomSalt).toBe(6.0);
      expect(result.bakingSoda).toBe(2.5);
      expect(result.scaCompliant).toBe(true);
    });

    it('should calculate recipe for light roast water profile', () => {
      // Light roasts often benefit from lower alkalinity
      const result = calculateWaterRecipe({
        waterVolume: 2,
        targetHardness: 80,
        targetAlkalinity: 40,
      });

      expect(result.epsomSalt).toBe(1.6);
      expect(result.bakingSoda).toBeCloseTo(0.67, 2);
      expect(result.scaCompliant).toBe(true);
    });

    it('should calculate recipe for dark roast water profile', () => {
      // Dark roasts often benefit from higher alkalinity to buffer acidity
      const result = calculateWaterRecipe({
        waterVolume: 2,
        targetHardness: 120,
        targetAlkalinity: 70,
      });

      expect(result.epsomSalt).toBe(2.4);
      expect(result.bakingSoda).toBeCloseTo(1.17, 2);
      expect(result.scaCompliant).toBe(true);
    });
  });
});
