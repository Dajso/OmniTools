/**
 * Unit tests for Coffee Unit Conversions
 * 
 * Tests weight and volume conversion utilities for coffee calculators
 * 
 * @module tests/unit/coffee-unit-conversions
 */

import { describe, it, expect } from 'vitest';
import {
  gramsToOunces,
  ouncesToGrams,
  mlToFlOz,
  flOzToMl,
  litersToGallons,
  gallonsToLiters,
  convertWeight,
  convertVolume,
  getWeightUnit,
  getVolumeUnit,
  formatWeight,
  formatVolume,
  parseWeightInput,
  parseVolumeInput,
  getWeightDisplayValue,
  getVolumeDisplayValue,
  getWeightConstraints,
  getVolumeConstraints,
  CONVERSION_FACTORS,
} from '@/lib/conversions/coffee-units';

describe('Coffee Unit Conversions', () => {
  describe('Weight Conversions', () => {
    it('should convert grams to ounces correctly', () => {
      expect(gramsToOunces(100)).toBeCloseTo(3.5274, 4);
      expect(gramsToOunces(28.3495)).toBeCloseTo(1, 4);
      expect(gramsToOunces(0)).toBe(0);
    });

    it('should convert ounces to grams correctly', () => {
      expect(ouncesToGrams(1)).toBeCloseTo(28.3495, 4);
      expect(ouncesToGrams(3.5274)).toBeCloseTo(100, 1);
      expect(ouncesToGrams(0)).toBe(0);
    });

    it('should handle round-trip weight conversion', () => {
      const originalGrams = 50;
      const ounces = gramsToOunces(originalGrams);
      const backToGrams = ouncesToGrams(ounces);
      expect(backToGrams).toBeCloseTo(originalGrams, 2);
    });

    it('should convert weight with convertWeight function', () => {
      expect(convertWeight(100, 'g', 'oz')).toBeCloseTo(3.5274, 4);
      expect(convertWeight(1, 'oz', 'g')).toBeCloseTo(28.3495, 4);
      expect(convertWeight(50, 'g', 'g')).toBe(50);
      expect(convertWeight(2, 'oz', 'oz')).toBe(2);
    });
  });

  describe('Volume Conversions', () => {
    it('should convert milliliters to fluid ounces correctly', () => {
      expect(mlToFlOz(100)).toBeCloseTo(3.3814, 4);
      expect(mlToFlOz(29.5735)).toBeCloseTo(1, 4);
      expect(mlToFlOz(0)).toBe(0);
    });

    it('should convert fluid ounces to milliliters correctly', () => {
      expect(flOzToMl(1)).toBeCloseTo(29.5735, 4);
      expect(flOzToMl(3.3814)).toBeCloseTo(100, 1);
      expect(flOzToMl(0)).toBe(0);
    });

    it('should handle round-trip volume conversion', () => {
      const originalMl = 250;
      const flOz = mlToFlOz(originalMl);
      const backToMl = flOzToMl(flOz);
      expect(backToMl).toBeCloseTo(originalMl, 2);
    });

    it('should convert volume with convertVolume function', () => {
      expect(convertVolume(100, 'ml', 'fl oz')).toBeCloseTo(3.3814, 4);
      expect(convertVolume(1, 'fl oz', 'ml')).toBeCloseTo(29.5735, 4);
      expect(convertVolume(250, 'ml', 'ml')).toBe(250);
      expect(convertVolume(8, 'fl oz', 'fl oz')).toBe(8);
    });
  });

  describe('Water Volume Conversions', () => {
    it('should convert liters to gallons correctly', () => {
      expect(litersToGallons(1)).toBeCloseTo(0.264172, 6);
      expect(litersToGallons(3.78541)).toBeCloseTo(1, 4);
      expect(litersToGallons(0)).toBe(0);
    });

    it('should convert gallons to liters correctly', () => {
      expect(gallonsToLiters(1)).toBeCloseTo(3.78541, 5);
      expect(gallonsToLiters(0.264172)).toBeCloseTo(1, 2);
      expect(gallonsToLiters(0)).toBe(0);
    });

    it('should handle round-trip water volume conversion', () => {
      const originalLiters = 5;
      const gallons = litersToGallons(originalLiters);
      const backToLiters = gallonsToLiters(gallons);
      expect(backToLiters).toBeCloseTo(originalLiters, 2);
    });
  });

  describe('Unit System Helpers', () => {
    it('should return correct weight unit for system', () => {
      expect(getWeightUnit('metric')).toBe('g');
      expect(getWeightUnit('imperial')).toBe('oz');
    });

    it('should return correct volume unit for system', () => {
      expect(getVolumeUnit('metric')).toBe('ml');
      expect(getVolumeUnit('imperial')).toBe('fl oz');
    });
  });

  describe('Formatting Functions', () => {
    it('should format weight correctly', () => {
      expect(formatWeight(100, 'metric')).toBe('100.0 g');
      expect(formatWeight(100, 'imperial')).toMatch(/3\.5 oz/);
      expect(formatWeight(28.3495, 'imperial')).toMatch(/1\.0 oz/);
    });

    it('should format volume correctly', () => {
      expect(formatVolume(250, 'metric')).toBe('250 ml');
      expect(formatVolume(250, 'imperial')).toMatch(/8 fl oz/);
      expect(formatVolume(29.5735, 'imperial')).toMatch(/1 fl oz/);
    });

    it('should respect decimal places in formatting', () => {
      expect(formatWeight(100, 'metric', 2)).toBe('100.00 g');
      expect(formatVolume(250, 'metric', 1)).toBe('250.0 ml');
    });
  });

  describe('Input Parsing Functions', () => {
    it('should parse weight input correctly', () => {
      expect(parseWeightInput(100, 'metric')).toBe(100);
      expect(parseWeightInput(1, 'imperial')).toBeCloseTo(28.3495, 4);
      expect(parseWeightInput(3.5274, 'imperial')).toBeCloseTo(100, 1);
    });

    it('should parse volume input correctly', () => {
      expect(parseVolumeInput(250, 'metric')).toBe(250);
      expect(parseVolumeInput(1, 'imperial')).toBeCloseTo(29.5735, 4);
      expect(parseVolumeInput(8.4535, 'imperial')).toBeCloseTo(250, 1);
    });
  });

  describe('Display Value Functions', () => {
    it('should get weight display value correctly', () => {
      expect(getWeightDisplayValue(100, 'metric')).toBe(100);
      expect(getWeightDisplayValue(28.3495, 'imperial')).toBeCloseTo(1, 4);
      expect(getWeightDisplayValue(100, 'imperial')).toBeCloseTo(3.5274, 4);
    });

    it('should get volume display value correctly', () => {
      expect(getVolumeDisplayValue(250, 'metric')).toBe(250);
      expect(getVolumeDisplayValue(29.5735, 'imperial')).toBeCloseTo(1, 4);
      expect(getVolumeDisplayValue(250, 'imperial')).toBeCloseTo(8.4535, 4);
    });
  });

  describe('Constraint Functions', () => {
    it('should get weight constraints for metric', () => {
      const constraints = getWeightConstraints(10, 100, 5, 'metric');
      expect(constraints.min).toBe(10);
      expect(constraints.max).toBe(100);
      expect(constraints.step).toBe(5);
    });

    it('should get weight constraints for imperial', () => {
      const constraints = getWeightConstraints(10, 100, 5, 'imperial');
      expect(constraints.min).toBeCloseTo(0.35274, 5);
      expect(constraints.max).toBeCloseTo(3.5274, 4);
      expect(constraints.step).toBeCloseTo(0.17637, 5);
    });

    it('should get volume constraints for metric', () => {
      const constraints = getVolumeConstraints(100, 1000, 50, 'metric');
      expect(constraints.min).toBe(100);
      expect(constraints.max).toBe(1000);
      expect(constraints.step).toBe(50);
    });

    it('should get volume constraints for imperial', () => {
      const constraints = getVolumeConstraints(100, 1000, 50, 'imperial');
      expect(constraints.min).toBeCloseTo(3.3814, 4);
      expect(constraints.max).toBeCloseTo(33.814, 3);
      expect(constraints.step).toBeCloseTo(1.6907, 4);
    });
  });

  describe('Conversion Constants', () => {
    it('should have correct conversion factors', () => {
      expect(CONVERSION_FACTORS.GRAMS_TO_OUNCES).toBeCloseTo(0.035274, 6);
      expect(CONVERSION_FACTORS.OUNCES_TO_GRAMS).toBeCloseTo(28.3495, 4);
      expect(CONVERSION_FACTORS.ML_TO_FL_OZ).toBeCloseTo(0.033814, 6);
      expect(CONVERSION_FACTORS.FL_OZ_TO_ML).toBeCloseTo(29.5735, 4);
      expect(CONVERSION_FACTORS.LITERS_TO_GALLONS).toBeCloseTo(0.264172, 6);
      expect(CONVERSION_FACTORS.GALLONS_TO_LITERS).toBeCloseTo(3.78541, 5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      expect(gramsToOunces(0)).toBe(0);
      expect(ouncesToGrams(0)).toBe(0);
      expect(mlToFlOz(0)).toBe(0);
      expect(flOzToMl(0)).toBe(0);
    });

    it('should handle very small values', () => {
      expect(gramsToOunces(0.1)).toBeCloseTo(0.0035274, 7);
      expect(mlToFlOz(0.1)).toBeCloseTo(0.0033814, 7);
    });

    it('should handle very large values', () => {
      expect(gramsToOunces(10000)).toBeCloseTo(352.74, 2);
      expect(mlToFlOz(10000)).toBeCloseTo(338.14, 2);
    });

    it('should handle negative values (for completeness)', () => {
      // While negative weights/volumes don't make physical sense,
      // the math should still work
      expect(gramsToOunces(-100)).toBeCloseTo(-3.5274, 4);
      expect(mlToFlOz(-100)).toBeCloseTo(-3.3814, 4);
    });
  });

  describe('Precision and Rounding', () => {
    it('should maintain precision through conversions', () => {
      const testValues = [1, 5, 10, 18, 25, 50, 100, 250, 500];
      
      testValues.forEach(grams => {
        const ounces = gramsToOunces(grams);
        const backToGrams = ouncesToGrams(ounces);
        expect(backToGrams).toBeCloseTo(grams, 2);
      });
    });

    it('should handle typical coffee brewing values', () => {
      // Typical espresso dose: 18g
      expect(gramsToOunces(18)).toBeCloseTo(0.635, 3);
      
      // Typical pour over dose: 30g
      expect(gramsToOunces(30)).toBeCloseTo(1.058, 3);
      
      // Typical brew water: 500ml
      expect(mlToFlOz(500)).toBeCloseTo(16.907, 3);
    });
  });
});
