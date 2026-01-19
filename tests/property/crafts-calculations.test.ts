/**
 * Property Tests: Crafts Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Circle Skirt Calculator, Knitting Stitch Converter, and other crafts tools
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateInnerRadius,
  calculateOuterRadius,
  calculateCircumference,
  calculateRadiusFromCircumference,
  calculateCircleSkirt,
  calculateCylinderVolume,
  SKIRT_TYPE_MULTIPLIERS,
  type SkirtType,
} from '@/lib/calculations/crafts/circle-skirt-calculator';

/**
 * Arbitrary for generating valid skirt types
 */
const skirtTypeArb = fc.constantFrom<SkirtType>('full', 'half', 'quarter', 'three-quarter');

/**
 * Arbitrary for generating valid waist measurements (in inches)
 */
const waistMeasurementArb = fc.double({ min: 20, max: 60, noNaN: true, noDefaultInfinity: true });

/**
 * Arbitrary for generating valid skirt lengths (in inches)
 */
const skirtLengthArb = fc.double({ min: 10, max: 50, noNaN: true, noDefaultInfinity: true });

/**
 * Arbitrary for generating valid circle skirt inputs
 */
const circleSkirtInputArb = fc.record({
  waistMeasurement: waistMeasurementArb,
  skirtLength: skirtLengthArb,
  skirtType: skirtTypeArb,
  seamAllowance: fc.double({ min: 0, max: 2, noNaN: true, noDefaultInfinity: true }),
  hemAllowance: fc.double({ min: 0, max: 3, noNaN: true, noDefaultInfinity: true }),
});

describe('Circle Skirt Calculator - Property 14: Circle Geometry (Skirt/Cylinder)', () => {
  /**
   * Property 14: Circle Geometry (Skirt/Cylinder)
   * Feature: expanded-tools-categories, Property 14: Circle Geometry (Skirt/Cylinder)
   * 
   * *For any* circumference value, the calculated radius SHALL satisfy:
   * circumference = 2πr, and for cylinders, volume = πr²h.
   * 
   * **Validates: Requirements 24.11, 25.11**
   */
  it('circumference should equal 2πr for any radius', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1000, noNaN: true, noDefaultInfinity: true }),
        (radius) => {
          const circumference = calculateCircumference(radius);
          const expectedCircumference = 2 * Math.PI * radius;
          
          expect(circumference).toBeCloseTo(expectedCircumference, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: radius = circumference / (2π) - round trip
   * **Validates: Requirements 24.11**
   */
  it('radius from circumference should satisfy r = C / (2π)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1000, noNaN: true, noDefaultInfinity: true }),
        (circumference) => {
          const radius = calculateRadiusFromCircumference(circumference);
          const expectedRadius = circumference / (2 * Math.PI);
          
          expect(radius).toBeCloseTo(expectedRadius, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Round-trip - circumference to radius and back
   * **Validates: Requirements 24.11**
   */
  it('circumference -> radius -> circumference should be identity', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1000, noNaN: true, noDefaultInfinity: true }),
        (originalCircumference) => {
          const radius = calculateRadiusFromCircumference(originalCircumference);
          const recoveredCircumference = calculateCircumference(radius);
          
          expect(recoveredCircumference).toBeCloseTo(originalCircumference, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cylinder volume = πr²h
   * **Validates: Requirements 25.11**
   */
  it('cylinder volume should equal πr²h', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
        (radius, height) => {
          const volume = calculateCylinderVolume(radius, height);
          const expectedVolume = Math.PI * radius * radius * height;
          
          expect(volume).toBeCloseTo(expectedVolume, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Inner radius produces correct waist circumference
   * For a full circle: waist = 2πr, so r = waist / (2π)
   * **Validates: Requirements 24.11**
   */
  it('inner radius should produce correct waist opening for full circle', () => {
    fc.assert(
      fc.property(waistMeasurementArb, (waistMeasurement) => {
        const innerRadius = calculateInnerRadius(waistMeasurement, 'full');
        const resultingCircumference = 2 * Math.PI * innerRadius;
        
        // For full circle, the circumference should equal the waist measurement
        expect(resultingCircumference).toBeCloseTo(waistMeasurement, 5);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Outer radius = inner radius + skirt length + hem allowance
   * **Validates: Requirements 24.11**
   */
  it('outer radius should equal inner radius plus skirt length plus hem', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 20, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 50, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 3, noNaN: true, noDefaultInfinity: true }),
        (innerRadius, skirtLength, hemAllowance) => {
          const outerRadius = calculateOuterRadius(innerRadius, skirtLength, hemAllowance);
          const expectedOuter = innerRadius + skirtLength + hemAllowance;
          
          expect(outerRadius).toBeCloseTo(expectedOuter, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All calculated values should be positive
   * **Validates: Requirements 24.11**
   */
  it('all circle skirt results should be positive', () => {
    fc.assert(
      fc.property(circleSkirtInputArb, (input) => {
        const result = calculateCircleSkirt(input);
        
        expect(result.innerRadius).toBeGreaterThan(0);
        expect(result.outerRadius).toBeGreaterThan(0);
        expect(result.fabricWidthNeeded).toBeGreaterThan(0);
        expect(result.fabricLengthNeeded).toBeGreaterThan(0);
        expect(result.waistCircumference).toBeGreaterThan(0);
        expect(result.hemCircumference).toBeGreaterThan(0);
        expect(result.numberOfPanels).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Outer radius > inner radius (skirt has length)
   * **Validates: Requirements 24.11**
   */
  it('outer radius should always be greater than inner radius', () => {
    fc.assert(
      fc.property(circleSkirtInputArb, (input) => {
        const result = calculateCircleSkirt(input);
        
        expect(result.outerRadius).toBeGreaterThan(result.innerRadius);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hem circumference > waist circumference
   * **Validates: Requirements 24.11**
   */
  it('hem circumference should be greater than waist circumference', () => {
    fc.assert(
      fc.property(circleSkirtInputArb, (input) => {
        const result = calculateCircleSkirt(input);
        
        expect(result.hemCircumference).toBeGreaterThan(result.waistCircumference);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Skirt type multiplier affects inner radius correctly
   * Half circle needs 2x the radius of full circle for same waist
   * **Validates: Requirements 24.11**
   */
  it('half circle should have 2x the inner radius of full circle', () => {
    fc.assert(
      fc.property(waistMeasurementArb, (waistMeasurement) => {
        const fullRadius = calculateInnerRadius(waistMeasurement, 'full');
        const halfRadius = calculateInnerRadius(waistMeasurement, 'half');
        
        expect(halfRadius).toBeCloseTo(fullRadius * 2, 5);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Quarter circle should have 4x the inner radius of full circle
   * **Validates: Requirements 24.11**
   */
  it('quarter circle should have 4x the inner radius of full circle', () => {
    fc.assert(
      fc.property(waistMeasurementArb, (waistMeasurement) => {
        const fullRadius = calculateInnerRadius(waistMeasurement, 'full');
        const quarterRadius = calculateInnerRadius(waistMeasurement, 'quarter');
        
        expect(quarterRadius).toBeCloseTo(fullRadius * 4, 5);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cylinder volume scales linearly with height
   * **Validates: Requirements 25.11**
   */
  it('doubling height should double cylinder volume', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 50, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.1, max: 50, noNaN: true, noDefaultInfinity: true }),
        (radius, height) => {
          const volume1 = calculateCylinderVolume(radius, height);
          const volume2 = calculateCylinderVolume(radius, height * 2);
          
          expect(volume2).toBeCloseTo(volume1 * 2, 5);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cylinder volume scales quadratically with radius
   * **Validates: Requirements 25.11**
   */
  it('doubling radius should quadruple cylinder volume', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 25, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.1, max: 50, noNaN: true, noDefaultInfinity: true }),
        (radius, height) => {
          const volume1 = calculateCylinderVolume(radius, height);
          const volume2 = calculateCylinderVolume(radius * 2, height);
          
          expect(volume2).toBeCloseTo(volume1 * 4, 5);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
