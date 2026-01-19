/**
 * Property Tests: Photography Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Depth of Field Calculator, Timelapse Calculator, and related photography calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateDoF,
  calculateHyperfocalDistance,
  calculateNearFocus,
  calculateFarFocus,
  CIRCLE_OF_CONFUSION,
  CROP_FACTORS,
  type SensorSize,
  type DoFInput,
} from '@/lib/calculations/photo/depth-of-field';

/**
 * Arbitrary for generating valid sensor sizes
 */
const sensorSizeArb = fc.constantFrom<SensorSize>(
  'full-frame',
  'aps-c',
  'aps-c-canon',
  'micro-four-thirds',
  'medium-format',
  '1-inch'
);

/**
 * Arbitrary for generating valid focal lengths (mm)
 */
const focalLengthArb = fc.double({ min: 8, max: 800, noNaN: true });

/**
 * Arbitrary for generating valid aperture values
 */
const apertureArb = fc.double({ min: 1.0, max: 32, noNaN: true });

/**
 * Arbitrary for generating valid subject distances (meters)
 * Must be greater than focal length in meters
 */
const subjectDistanceArb = fc.double({ min: 0.5, max: 1000, noNaN: true });

/**
 * Arbitrary for generating valid DoF inputs
 */
const validDoFInputArb = fc.record({
  focalLength: focalLengthArb,
  aperture: apertureArb,
  subjectDistance: subjectDistanceArb,
  sensorSize: sensorSizeArb,
}).filter(input => {
  // Subject distance must be greater than focal length in meters
  return input.subjectDistance > input.focalLength / 1000;
});

describe('Depth of Field Calculator - Property 12: Depth of Field Physics', () => {
  /**
   * Property 12: Depth of Field Physics
   * Feature: expanded-tools-categories, Property 12: Depth of Field Physics
   * 
   * *For any* valid camera parameters (focal length, aperture, distance), the near focus
   * distance SHALL be less than subject distance, far focus SHALL be greater than subject
   * distance, and hyperfocal distance SHALL be positive.
   * 
   * **Validates: Requirements 23.11**
   */
  it('near focus should be less than subject distance', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          // Near focus must be less than subject distance
          expect(result.nearFocus).toBeLessThan(input.subjectDistance);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Far focus should be greater than subject distance
   * **Validates: Requirements 23.11**
   */
  it('far focus should be greater than subject distance', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          // Far focus must be greater than subject distance (or infinity)
          expect(result.farFocus).toBeGreaterThan(input.subjectDistance);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hyperfocal distance should be positive
   * **Validates: Requirements 23.11**
   */
  it('hyperfocal distance should be positive', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          expect(result.hyperfocalDistance).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total DoF should equal far focus minus near focus
   * **Validates: Requirements 23.11**
   */
  it('total DoF should equal far focus minus near focus', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          if (isFinite(result.farFocus)) {
            expect(result.totalDoF).toBeCloseTo(result.farFocus - result.nearFocus, 10);
          } else {
            expect(result.totalDoF).toBe(Infinity);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: DoF in front + DoF behind should equal total DoF
   * **Validates: Requirements 23.11**
   */
  it('DoF distribution should sum to total DoF', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          if (isFinite(result.totalDoF)) {
            const sum = result.dofInFront + result.dofBehind;
            expect(sum).toBeCloseTo(result.totalDoF, 10);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Wider aperture (smaller f-number) should produce shallower DoF
   * **Validates: Requirements 23.11**
   */
  it('wider aperture should produce shallower DoF', () => {
    fc.assert(
      fc.property(
        focalLengthArb,
        subjectDistanceArb,
        sensorSizeArb,
        fc.double({ min: 1.4, max: 5.6, noNaN: true }),
        fc.double({ min: 11, max: 22, noNaN: true }),
        (focalLength, subjectDistance, sensorSize, wideAperture, narrowAperture) => {
          // Skip if subject distance is too close
          if (subjectDistance <= focalLength / 1000) return true;
          
          // Ensure apertures are sufficiently different
          if (narrowAperture <= wideAperture * 1.5) return true;
          
          const wideResult = calculateDoF({
            focalLength,
            aperture: wideAperture,
            subjectDistance,
            sensorSize,
          });
          
          const narrowResult = calculateDoF({
            focalLength,
            aperture: narrowAperture,
            subjectDistance,
            sensorSize,
          });
          
          // Skip if either extends to infinity
          if (!isFinite(wideResult.totalDoF) || !isFinite(narrowResult.totalDoF)) {
            return true;
          }
          
          // Wider aperture (smaller f-number) = shallower DoF
          expect(wideResult.totalDoF).toBeLessThan(narrowResult.totalDoF);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Longer focal length should produce shallower DoF (at same distance)
   * **Validates: Requirements 23.11**
   */
  it('longer focal length should produce shallower DoF', () => {
    fc.assert(
      fc.property(
        apertureArb,
        fc.double({ min: 5, max: 100, noNaN: true }), // Subject distance
        sensorSizeArb,
        fc.double({ min: 24, max: 50, noNaN: true }),  // Short focal length
        fc.double({ min: 85, max: 200, noNaN: true }), // Long focal length
        (aperture, subjectDistance, sensorSize, shortFL, longFL) => {
          // Skip if subject distance is too close for either lens
          if (subjectDistance <= longFL / 1000) return true;
          
          const shortResult = calculateDoF({
            focalLength: shortFL,
            aperture,
            subjectDistance,
            sensorSize,
          });
          
          const longResult = calculateDoF({
            focalLength: longFL,
            aperture,
            subjectDistance,
            sensorSize,
          });
          
          // Skip if either extends to infinity
          if (!isFinite(shortResult.totalDoF) || !isFinite(longResult.totalDoF)) {
            return true;
          }
          
          // Longer focal length = shallower DoF
          expect(longResult.totalDoF).toBeLessThan(shortResult.totalDoF);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Closer subject distance should produce shallower DoF
   * **Validates: Requirements 23.11**
   */
  it('closer subject distance should produce shallower DoF', () => {
    fc.assert(
      fc.property(
        focalLengthArb,
        apertureArb,
        sensorSizeArb,
        fc.double({ min: 1, max: 5, noNaN: true }),   // Close distance
        fc.double({ min: 10, max: 50, noNaN: true }), // Far distance
        (focalLength, aperture, sensorSize, closeDistance, farDistance) => {
          // Skip if close distance is too close
          if (closeDistance <= focalLength / 1000) return true;
          
          const closeResult = calculateDoF({
            focalLength,
            aperture,
            subjectDistance: closeDistance,
            sensorSize,
          });
          
          const farResult = calculateDoF({
            focalLength,
            aperture,
            subjectDistance: farDistance,
            sensorSize,
          });
          
          // Skip if either extends to infinity
          if (!isFinite(closeResult.totalDoF) || !isFinite(farResult.totalDoF)) {
            return true;
          }
          
          // Closer distance = shallower DoF
          expect(closeResult.totalDoF).toBeLessThan(farResult.totalDoF);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Near focus should always be positive
   * **Validates: Requirements 23.11**
   */
  it('near focus should always be positive', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          expect(result.nearFocus).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Circle of confusion should match sensor size
   * **Validates: Requirements 23.11**
   */
  it('circle of confusion should match sensor size', () => {
    fc.assert(
      fc.property(
        validDoFInputArb,
        (input) => {
          const result = calculateDoF(input);
          
          expect(result.circleOfConfusion).toBe(CIRCLE_OF_CONFUSION[input.sensorSize]);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Hyperfocal Distance Properties', () => {
  /**
   * Property: Hyperfocal distance formula should be correct
   * H = f² / (N × c)
   * **Validates: Requirements 23.11**
   */
  it('hyperfocal distance should follow formula H = f² / (N × c)', () => {
    fc.assert(
      fc.property(
        focalLengthArb,
        apertureArb,
        sensorSizeArb,
        (focalLength, aperture, sensorSize) => {
          const coc = CIRCLE_OF_CONFUSION[sensorSize];
          const hyperfocal = calculateHyperfocalDistance(focalLength, aperture, coc);
          
          // Expected: H = f² / (N × c) in mm, converted to meters
          const expectedMm = (focalLength * focalLength) / (aperture * coc);
          const expectedMeters = expectedMm / 1000;
          
          expect(hyperfocal).toBeCloseTo(expectedMeters, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Smaller aperture should increase hyperfocal distance
   * **Validates: Requirements 23.11**
   */
  it('smaller aperture (larger f-number) should increase hyperfocal distance', () => {
    fc.assert(
      fc.property(
        focalLengthArb,
        sensorSizeArb,
        fc.double({ min: 1.4, max: 8, noNaN: true }),
        fc.double({ min: 11, max: 22, noNaN: true }),
        (focalLength, sensorSize, wideAperture, narrowAperture) => {
          const coc = CIRCLE_OF_CONFUSION[sensorSize];
          
          const wideHyperfocal = calculateHyperfocalDistance(focalLength, wideAperture, coc);
          const narrowHyperfocal = calculateHyperfocalDistance(focalLength, narrowAperture, coc);
          
          // Smaller aperture (larger f-number) = shorter hyperfocal distance
          expect(narrowHyperfocal).toBeLessThan(wideHyperfocal);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


import {
  calculateTimelapse,
  calculateTimelapseFromInterval,
  calculateTimelapseFromFrames,
  calculateOutputDuration,
  suggestInterval,
  formatDuration,
  parseDuration,
  type TimelapseInput,
} from '@/lib/calculations/photo/timelapse-calculator';

/**
 * Arbitrary for generating valid event durations (seconds)
 */
const eventDurationArb = fc.double({ min: 60, max: 86400, noNaN: true }); // 1 minute to 24 hours

/**
 * Arbitrary for generating valid output durations (seconds)
 */
const outputDurationArb = fc.double({ min: 5, max: 300, noNaN: true }); // 5 seconds to 5 minutes

/**
 * Arbitrary for generating valid frame rates
 */
const frameRateArb = fc.constantFrom(24, 25, 30, 48, 50, 60);

/**
 * Arbitrary for generating valid image sizes (MB)
 */
const imageSizeArb = fc.double({ min: 1, max: 100, noNaN: true });

/**
 * Arbitrary for generating valid timelapse inputs
 */
const validTimelapseInputArb = fc.record({
  eventDuration: eventDurationArb,
  outputDuration: outputDurationArb,
  frameRate: frameRateArb,
});

describe('Timelapse Calculator - Property 13: Timelapse Frame Calculation', () => {
  /**
   * Property 13: Timelapse Frame Calculation
   * Feature: expanded-tools-categories, Property 13: Timelapse Frame Calculation
   * 
   * *For any* event duration, output duration, and frame rate, the total frames SHALL
   * equal output_duration × frame_rate, and the interval SHALL equal event_duration / total_frames.
   * 
   * **Validates: Requirements 23.12**
   */
  it('total frames should equal output duration times frame rate (ceiling)', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        (input) => {
          const result = calculateTimelapse(input);
          
          // totalFrames = ceil(outputDuration × frameRate)
          const expectedFrames = Math.ceil(input.outputDuration * input.frameRate);
          expect(result.totalFrames).toBe(expectedFrames);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Interval should equal event duration divided by total frames
   * **Validates: Requirements 23.12**
   */
  it('interval should equal event duration divided by total frames', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        (input) => {
          const result = calculateTimelapse(input);
          
          // interval = eventDuration / totalFrames
          const expectedInterval = input.eventDuration / result.totalFrames;
          expect(result.intervalSeconds).toBeCloseTo(expectedInterval, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Interval in ms should be 1000 times interval in seconds
   * **Validates: Requirements 23.12**
   */
  it('interval in ms should be 1000 times interval in seconds', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        (input) => {
          const result = calculateTimelapse(input);
          
          expect(result.intervalMs).toBeCloseTo(result.intervalSeconds * 1000, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Speed-up factor should equal event duration divided by output duration
   * **Validates: Requirements 23.12**
   */
  it('speed-up factor should equal event duration divided by output duration', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        (input) => {
          const result = calculateTimelapse(input);
          
          const expectedSpeedUp = input.eventDuration / input.outputDuration;
          expect(result.speedUpFactor).toBeCloseTo(expectedSpeedUp, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Storage estimate should equal total frames times image size
   * **Validates: Requirements 23.12**
   */
  it('storage estimate should equal total frames times image size', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        imageSizeArb,
        (input, imageSize) => {
          const result = calculateTimelapse(input, imageSize);
          
          const expectedStorageMB = result.totalFrames * imageSize;
          expect(result.storageEstimateMB).toBeCloseTo(expectedStorageMB, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Storage in GB should equal storage in MB divided by 1024
   * **Validates: Requirements 23.12**
   */
  it('storage in GB should equal storage in MB divided by 1024', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        imageSizeArb,
        (input, imageSize) => {
          const result = calculateTimelapse(input, imageSize);
          
          expect(result.storageEstimateGB).toBeCloseTo(result.storageEstimateMB / 1024, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All output values should be positive for positive inputs
   * **Validates: Requirements 23.12**
   */
  it('all output values should be positive for positive inputs', () => {
    fc.assert(
      fc.property(
        validTimelapseInputArb,
        (input) => {
          const result = calculateTimelapse(input);
          
          expect(result.totalFrames).toBeGreaterThan(0);
          expect(result.intervalSeconds).toBeGreaterThan(0);
          expect(result.intervalMs).toBeGreaterThan(0);
          expect(result.storageEstimateMB).toBeGreaterThan(0);
          expect(result.storageEstimateGB).toBeGreaterThan(0);
          expect(result.speedUpFactor).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Longer event duration should result in longer interval (same output)
   * **Validates: Requirements 23.12**
   */
  it('longer event duration should result in longer interval', () => {
    fc.assert(
      fc.property(
        outputDurationArb,
        frameRateArb,
        fc.double({ min: 60, max: 3600, noNaN: true }),
        fc.double({ min: 7200, max: 86400, noNaN: true }),
        (outputDuration, frameRate, shortEvent, longEvent) => {
          const shortResult = calculateTimelapse({
            eventDuration: shortEvent,
            outputDuration,
            frameRate,
          });
          
          const longResult = calculateTimelapse({
            eventDuration: longEvent,
            outputDuration,
            frameRate,
          });
          
          // Longer event = longer interval (same number of frames)
          expect(longResult.intervalSeconds).toBeGreaterThan(shortResult.intervalSeconds);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Higher frame rate should result in more frames
   * **Validates: Requirements 23.12**
   */
  it('higher frame rate should result in more frames', () => {
    fc.assert(
      fc.property(
        eventDurationArb,
        outputDurationArb,
        (eventDuration, outputDuration) => {
          const result24 = calculateTimelapse({
            eventDuration,
            outputDuration,
            frameRate: 24,
          });
          
          const result60 = calculateTimelapse({
            eventDuration,
            outputDuration,
            frameRate: 60,
          });
          
          // Higher frame rate = more frames
          expect(result60.totalFrames).toBeGreaterThan(result24.totalFrames);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Timelapse Duration Formatting Properties', () => {
  /**
   * Property: Format then parse should return original value (within seconds)
   * **Validates: Requirements 23.12**
   */
  it('format then parse should return original value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 86400 }),
        (seconds) => {
          const formatted = formatDuration(seconds);
          const parsed = parseDuration(formatted);
          
          // Should return to original value (floor due to formatting)
          expect(parsed).toBe(Math.floor(seconds));
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Formatted duration should contain colons
   * **Validates: Requirements 23.12**
   */
  it('formatted duration should contain colons', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 86400 }),
        (seconds) => {
          const formatted = formatDuration(seconds);
          
          expect(formatted).toContain(':');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Timelapse Alternative Calculation Methods', () => {
  /**
   * Property: calculateTimelapseFromInterval should produce consistent results
   * **Validates: Requirements 23.12**
   */
  it('calculateTimelapseFromInterval should produce consistent interval', () => {
    fc.assert(
      fc.property(
        eventDurationArb,
        fc.double({ min: 1, max: 60, noNaN: true }), // interval in seconds
        frameRateArb,
        (eventDuration, interval, frameRate) => {
          const result = calculateTimelapseFromInterval(eventDuration, interval, frameRate);
          
          // The interval should match the input interval
          expect(result.intervalSeconds).toBe(interval);
          
          // Total frames should be floor(eventDuration / interval) + 1
          const expectedFrames = Math.floor(eventDuration / interval) + 1;
          expect(result.totalFrames).toBe(expectedFrames);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: calculateTimelapseFromFrames should produce correct frame count
   * **Validates: Requirements 23.12**
   */
  it('calculateTimelapseFromFrames should produce correct frame count', () => {
    fc.assert(
      fc.property(
        eventDurationArb,
        fc.integer({ min: 100, max: 10000 }), // total frames
        frameRateArb,
        (eventDuration, totalFrames, frameRate) => {
          const result = calculateTimelapseFromFrames(eventDuration, totalFrames, frameRate);
          
          // Frame count should match input exactly
          expect(result.totalFrames).toBe(totalFrames);
          
          // Interval should be eventDuration / totalFrames
          expect(result.intervalSeconds).toBeCloseTo(eventDuration / totalFrames, 10);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: suggestInterval should be inverse of calculateOutputDuration
   * **Validates: Requirements 23.12**
   */
  it('suggestInterval and calculateOutputDuration should be inverses', () => {
    fc.assert(
      fc.property(
        eventDurationArb,
        outputDurationArb,
        frameRateArb,
        (eventDuration, outputDuration, frameRate) => {
          const interval = suggestInterval(eventDuration, outputDuration, frameRate);
          const calculatedOutput = calculateOutputDuration(eventDuration, interval, frameRate);
          
          // Should return to approximately the original output duration
          expect(calculatedOutput).toBeCloseTo(outputDuration, 5);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
