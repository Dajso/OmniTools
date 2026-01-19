/**
 * Property Tests: Physics Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests universal properties for physics calculation functions.
 * 
 * @module tests/property/physics-calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateProjectileMotion,
  calculateRange,
  calculateMaxHeight,
  calculateFlightTime,
  degreesToRadians,
  GRAVITY_EARTH,
} from '@/lib/calculations/physics/projectile-motion';

describe('Physics Calculations - Property Tests', () => {
  describe('Property 21: Projectile Motion Physics', () => {
    /**
     * Property 21: Projectile Motion Physics
     * 
     * *For any* initial velocity and launch angle, the calculated range,
     * max height, and flight time SHALL satisfy standard kinematic equations.
     * 
     * Key equations:
     * - Range: R = v² × sin(2θ) / g
     * - Max Height: H = v² × sin²(θ) / (2g)
     * - Flight Time: T = 2 × v × sin(θ) / g
     * 
     * **Validates: Requirements 31.8**
     */

    it('range formula: R = v² × sin(2θ) / g', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
              gravity: GRAVITY_EARTH,
            });

            // Expected range using formula: R = v² × sin(2θ) / g
            const angleRad = degreesToRadians(angle);
            const expectedRange = (velocity * velocity * Math.sin(2 * angleRad)) / GRAVITY_EARTH;

            expect(result.range).toBeCloseTo(expectedRange, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('max height formula: H = v² × sin²(θ) / (2g)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
              gravity: GRAVITY_EARTH,
            });

            // Expected max height using formula: H = v² × sin²(θ) / (2g)
            const angleRad = degreesToRadians(angle);
            const sinAngle = Math.sin(angleRad);
            const expectedMaxHeight = (velocity * velocity * sinAngle * sinAngle) / (2 * GRAVITY_EARTH);

            expect(result.maxHeight).toBeCloseTo(expectedMaxHeight, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('flight time formula: T = 2 × v × sin(θ) / g', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
              gravity: GRAVITY_EARTH,
            });

            // Expected flight time using formula: T = 2 × v × sin(θ) / g
            const angleRad = degreesToRadians(angle);
            const expectedFlightTime = (2 * velocity * Math.sin(angleRad)) / GRAVITY_EARTH;

            expect(result.flightTime).toBeCloseTo(expectedFlightTime, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('range equals horizontal velocity times flight time', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
            });

            // Range = v0x × T
            const expectedRange = result.initialVelocityX * result.flightTime;
            expect(result.range).toBeCloseTo(expectedRange, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('time to max height is half of flight time (for h0=0)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
            });

            // For symmetric trajectory (h0=0), time to max height = T/2
            expect(result.timeToMaxHeight).toBeCloseTo(result.flightTime / 2, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('45 degrees gives maximum range (for h0=0)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          (velocity) => {
            const result45 = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: 45,
              initialHeight: 0,
            });

            // Test a few other angles
            const angles = [30, 35, 40, 50, 55, 60];
            for (const angle of angles) {
              const result = calculateProjectileMotion({
                initialVelocity: velocity,
                launchAngle: angle,
                initialHeight: 0,
              });
              expect(result45.range).toBeGreaterThanOrEqual(result.range - 0.0001);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('complementary angles give same range (for h0=0)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 5, max: 44, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const complementaryAngle = 90 - angle;

            const result1 = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
            });

            const result2 = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: complementaryAngle,
              initialHeight: 0,
            });

            // sin(2θ) = sin(2(90-θ)) = sin(180-2θ) = sin(2θ)
            expect(result1.range).toBeCloseTo(result2.range, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('velocity components satisfy v0² = v0x² + v0y²', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
            });

            const v0Squared = result.initialVelocityX ** 2 + result.initialVelocityY ** 2;
            expect(Math.sqrt(v0Squared)).toBeCloseTo(velocity, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all calculated values are non-negative', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 90, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 50, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle, height) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: height,
            });

            expect(result.range).toBeGreaterThanOrEqual(0);
            expect(result.maxHeight).toBeGreaterThanOrEqual(0);
            expect(result.flightTime).toBeGreaterThanOrEqual(0);
            expect(result.timeToMaxHeight).toBeGreaterThanOrEqual(0);
            expect(result.impactVelocity).toBeGreaterThanOrEqual(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('convenience functions match main calculator', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 89, noNaN: true, noDefaultInfinity: true }),
          (velocity, angle) => {
            const result = calculateProjectileMotion({
              initialVelocity: velocity,
              launchAngle: angle,
              initialHeight: 0,
            });

            expect(calculateRange(velocity, angle)).toBeCloseTo(result.range, 8);
            expect(calculateMaxHeight(velocity, angle)).toBeCloseTo(result.maxHeight, 8);
            expect(calculateFlightTime(velocity, angle)).toBeCloseTo(result.flightTime, 8);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
