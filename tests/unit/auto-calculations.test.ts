/**
 * Unit Tests: Automotive Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests specific known values for automotive calculation functions.
 * 
 * @module tests/unit/auto-calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCircumference,
  calculateDiameter,
  calculateTireDimensions,
  calculateSpeedometerError,
  compareTireSizes,
  parseTireSize,
  formatTireSize,
  TireSize,
} from '@/lib/calculations/auto/tire-calculator';
import {
  calculateChargingTime,
  calculateChargeInTime,
  estimateChargingCost,
  getRecommendedChargerPower,
  EVChargingInput,
} from '@/lib/calculations/auto/ev-charging-calculator';

describe('Tire Calculator - Known Values', () => {
  describe('Tire Size Parsing', () => {
    it('should parse standard tire size format 225/45R17', () => {
      const parsed = parseTireSize('225/45R17');
      expect(parsed).toEqual({
        width: 225,
        aspectRatio: 45,
        rimDiameter: 17,
      });
    });

    it('should parse tire size with lowercase r', () => {
      const parsed = parseTireSize('205/55r16');
      expect(parsed).toEqual({
        width: 205,
        aspectRatio: 55,
        rimDiameter: 16,
      });
    });

    it('should format tire size correctly', () => {
      const size: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };
      expect(formatTireSize(size)).toBe('225/45R17');
    });
  });

  describe('Tire Dimension Calculations', () => {
    // Known tire: 225/45R17
    // Width: 225mm
    // Sidewall height: 225 * 0.45 = 101.25mm
    // Rim diameter: 17 * 25.4 = 431.8mm
    // Overall diameter: 2 * 101.25 + 431.8 = 634.3mm
    // Circumference: π * 634.3 = 1992.8mm
    
    const testTire: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };

    it('should calculate correct diameter for 225/45R17', () => {
      const diameter = calculateDiameter(testTire);
      // Expected: 2 * (225 * 0.45) + 17 * 25.4 = 2 * 101.25 + 431.8 = 634.3mm
      expect(diameter).toBeCloseTo(634.3, 1);
    });

    it('should calculate correct circumference for 225/45R17', () => {
      const circumference = calculateCircumference(testTire);
      // Expected: π * 634.3 ≈ 1992.8mm
      expect(circumference).toBeCloseTo(1992.8, 0);
    });

    it('should calculate all dimensions correctly', () => {
      const dimensions = calculateTireDimensions(testTire);
      
      expect(dimensions.sectionWidth).toBe(225);
      expect(dimensions.sidewallHeight).toBeCloseTo(101.25, 2);
      expect(dimensions.overallDiameter).toBeCloseTo(634.3, 1);
      expect(dimensions.overallDiameterInches).toBeCloseTo(24.97, 1);
      expect(dimensions.formattedSize).toBe('225/45R17');
    });
  });

  describe('Speedometer Error Calculations', () => {
    // Comparing 225/45R17 to 235/45R17 (wider tire)
    // Original: diameter = 634.3mm
    // New: sidewall = 235 * 0.45 = 105.75mm, diameter = 2 * 105.75 + 431.8 = 643.3mm
    // Error = (643.3 / 634.3 - 1) * 100 ≈ 1.42%

    it('should calculate speedometer error when upsizing width', () => {
      const original: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };
      const newTire: TireSize = { width: 235, aspectRatio: 45, rimDiameter: 17 };
      
      const error = calculateSpeedometerError(original, newTire);
      
      // Larger tire = positive error (speedo reads low)
      expect(error).toBeGreaterThan(0);
      expect(error).toBeCloseTo(1.42, 1);
    });

    it('should calculate speedometer error when downsizing', () => {
      const original: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };
      const newTire: TireSize = { width: 215, aspectRatio: 45, rimDiameter: 17 };
      
      const error = calculateSpeedometerError(original, newTire);
      
      // Smaller tire = negative error (speedo reads high)
      expect(error).toBeLessThan(0);
    });

    it('should return zero error for identical tires', () => {
      const tire: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };
      
      const error = calculateSpeedometerError(tire, tire);
      
      expect(error).toBe(0);
    });
  });

  describe('Tire Comparison', () => {
    it('should compare two tire sizes correctly', () => {
      const original: TireSize = { width: 225, aspectRatio: 45, rimDiameter: 17 };
      const newTire: TireSize = { width: 245, aspectRatio: 40, rimDiameter: 18 };
      
      const comparison = compareTireSizes(original, newTire);
      
      // Verify the comparison contains expected properties
      expect(comparison.original.formattedSize).toBe('225/45R17');
      expect(comparison.newTire.formattedSize).toBe('245/40R18');
      expect(typeof comparison.speedometerError).toBe('number');
      expect(typeof comparison.actualSpeedAt60).toBe('number');
      expect(typeof comparison.groundClearanceChange).toBe('number');
    });

    it('should correctly identify larger tire', () => {
      const original: TireSize = { width: 205, aspectRatio: 55, rimDiameter: 16 };
      const larger: TireSize = { width: 225, aspectRatio: 55, rimDiameter: 17 };
      
      const comparison = compareTireSizes(original, larger);
      
      expect(comparison.isLarger).toBe(true);
      expect(comparison.diameterDifference).toBeGreaterThan(0);
    });
  });
});

describe('EV Charging Calculator - Known Values', () => {
  describe('Basic Charging Time Calculations', () => {
    it('should calculate charging time for simple scenario', () => {
      // 60 kWh battery, 20% to 80% charge, 7.7 kW charger
      // Energy needed: 60 * 0.6 = 36 kWh
      // With 90% efficiency: 36 / (7.7 * 0.9) = 36 / 6.93 ≈ 5.19 hours
      
      const input: EVChargingInput = {
        batteryCapacity: 60,
        currentCharge: 20,
        targetCharge: 80,
        chargerPower: 7.7,
        efficiency: 0.9,
      };
      
      const result = calculateChargingTime(input);
      
      expect(result.energyNeeded).toBeCloseTo(36, 1);
      expect(result.chargingTimeHours).toBeCloseTo(5.19, 1);
    });

    it('should limit charging power to vehicle max rate', () => {
      // 80 kWh battery, 10% to 90%, 150 kW charger but vehicle max is 50 kW
      
      const input: EVChargingInput = {
        batteryCapacity: 80,
        currentCharge: 10,
        targetCharge: 90,
        chargerPower: 150,
        maxChargingRate: 50,
        efficiency: 0.9,
      };
      
      const result = calculateChargingTime(input);
      
      expect(result.effectiveChargingPower).toBe(50);
      // Energy needed: 80 * 0.8 = 64 kWh
      expect(result.energyNeeded).toBeCloseTo(64, 1);
    });

    it('should calculate energy from grid accounting for efficiency', () => {
      const input: EVChargingInput = {
        batteryCapacity: 100,
        currentCharge: 0,
        targetCharge: 100,
        chargerPower: 11.5,
        efficiency: 0.9,
      };
      
      const result = calculateChargingTime(input);
      
      // Energy needed: 100 kWh
      // Energy from grid: 100 / 0.9 ≈ 111.1 kWh
      expect(result.energyNeeded).toBe(100);
      expect(result.energyFromGrid).toBeCloseTo(111.1, 1);
    });

    it('should calculate cost estimate correctly', () => {
      const input: EVChargingInput = {
        batteryCapacity: 60,
        currentCharge: 0,
        targetCharge: 100,
        chargerPower: 7.7,
        efficiency: 0.9,
      };
      
      const result = calculateChargingTime(input);
      const cost = result.costEstimate(0.15); // $0.15 per kWh
      
      // Energy from grid: 60 / 0.9 = 66.67 kWh
      // Cost: 66.67 * 0.15 = $10.00
      expect(cost).toBeCloseTo(10, 0);
    });
  });

  describe('Charge in Time Calculations', () => {
    it('should calculate charge percentage added in given time', () => {
      // 60 kWh battery, 7.7 kW charger, 2 hours, 90% efficiency
      // Energy added: 7.7 * 0.9 * 2 = 13.86 kWh
      // Percentage: 13.86 / 60 * 100 = 23.1%
      
      const chargeAdded = calculateChargeInTime(60, 7.7, 120, undefined, 0.9);
      
      expect(chargeAdded).toBeCloseTo(23.1, 1);
    });

    it('should respect vehicle max charging rate', () => {
      // 80 kWh battery, 150 kW charger, vehicle max 50 kW, 30 minutes
      // Effective power: 50 kW
      // Energy added: 50 * 0.9 * 0.5 = 22.5 kWh
      // Percentage: 22.5 / 80 * 100 = 28.125%
      
      const chargeAdded = calculateChargeInTime(80, 150, 30, 50, 0.9);
      
      expect(chargeAdded).toBeCloseTo(28.125, 1);
    });
  });

  describe('Cost Estimation', () => {
    it('should estimate charging cost correctly', () => {
      // 50 kWh needed, $0.12/kWh, 90% efficiency
      // Energy from grid: 50 / 0.9 = 55.56 kWh
      // Cost: 55.56 * 0.12 = $6.67
      
      const cost = estimateChargingCost(50, 0.12, 0.9);
      
      expect(cost).toBeCloseTo(6.67, 1);
    });
  });

  describe('Recommended Charger Power', () => {
    it('should recommend appropriate charger for daily driving', () => {
      // 40 miles/day, 4 miles/kWh efficiency, 8 hours available
      // Daily kWh needed: 40 / 4 = 10 kWh
      // Charger power needed: 10 / (8 * 0.9) = 1.39 kW
      
      const recommended = getRecommendedChargerPower(40, 4, 8, 0.9);
      
      expect(recommended).toBeCloseTo(1.39, 1);
    });

    it('should recommend higher power for longer commutes', () => {
      // 100 miles/day, 3.5 miles/kWh, 6 hours available
      // Daily kWh needed: 100 / 3.5 = 28.57 kWh
      // Charger power needed: 28.57 / (6 * 0.9) = 5.29 kW
      
      const recommended = getRecommendedChargerPower(100, 3.5, 6, 0.9);
      
      expect(recommended).toBeCloseTo(5.29, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 100% efficiency', () => {
      const input: EVChargingInput = {
        batteryCapacity: 60,
        currentCharge: 50,
        targetCharge: 100,
        chargerPower: 10,
        efficiency: 1.0,
      };
      
      const result = calculateChargingTime(input);
      
      // Energy needed: 30 kWh
      // Time: 30 / 10 = 3 hours
      expect(result.energyNeeded).toBe(30);
      expect(result.chargingTimeHours).toBe(3);
      expect(result.energyFromGrid).toBe(30);
    });

    it('should throw error for invalid current charge', () => {
      const input: EVChargingInput = {
        batteryCapacity: 60,
        currentCharge: 110, // Invalid
        targetCharge: 100,
        chargerPower: 10,
      };
      
      expect(() => calculateChargingTime(input)).toThrow();
    });

    it('should throw error when target is less than current', () => {
      const input: EVChargingInput = {
        batteryCapacity: 60,
        currentCharge: 80,
        targetCharge: 50, // Less than current
        chargerPower: 10,
      };
      
      expect(() => calculateChargingTime(input)).toThrow();
    });
  });
});
