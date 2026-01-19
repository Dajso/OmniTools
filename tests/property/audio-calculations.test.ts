/**
 * Property Tests: Audio Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for BPM Calculator, Delay Time Calculator, and related audio calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateBPMFromTaps,
  calculateDelayTimes,
  calculateBPMResult,
  bpmFromMsPerBeat,
  calculateReverbPreDelay,
  calculateReverbDecay,
  type DelayTimes,
} from '@/lib/calculations/audio/bpm-calculator';

/**
 * Arbitrary for generating valid BPM values (realistic range)
 */
const validBpmArb = fc.double({ min: 20, max: 300, noNaN: true });

/**
 * Arbitrary for generating valid tap timestamps
 * Generates an array of increasing timestamps with realistic intervals
 */
const validTapTimestampsArb = fc.array(
  fc.integer({ min: 0, max: 60000 }),
  { minLength: 2, maxLength: 20 }
).map(arr => [...arr].sort((a, b) => a - b));

/**
 * Arbitrary for generating tap timestamps with consistent BPM
 */
const consistentTapTimestampsArb = (bpm: number, tapCount: number) => {
  const interval = 60000 / bpm;
  return Array.from({ length: tapCount }, (_, i) => i * interval);
};

describe('BPM Calculator - Property 9: BPM Delay Time Relationship', () => {
  /**
   * Property 9: BPM Delay Time Relationship
   * Feature: expanded-tools-categories, Property 9: BPM Delay Time Relationship
   * 
   * *For any* BPM value, the delay times SHALL satisfy: quarter_note_ms = 60000 / BPM,
   * and all other note values SHALL be proportional (eighth = quarter/2, sixteenth = quarter/4, etc.).
   * 
   * **Validates: Requirements 20.11, 20.12**
   */
  it('quarter note delay should equal 60000 / BPM', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);
          const expectedQuarter = 60000 / bpm;

          // Quarter note should equal 60000 / BPM within floating-point tolerance
          expect(delayTimes.quarter).toBeCloseTo(expectedQuarter, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Eighth note should be half of quarter note
   * **Validates: Requirements 20.12**
   */
  it('eighth note should be half of quarter note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.eighth).toBeCloseTo(delayTimes.quarter / 2, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Sixteenth note should be quarter of quarter note
   * **Validates: Requirements 20.12**
   */
  it('sixteenth note should be quarter of quarter note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.sixteenth).toBeCloseTo(delayTimes.quarter / 4, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Thirty-second note should be eighth of quarter note
   * **Validates: Requirements 20.12**
   */
  it('thirty-second note should be eighth of quarter note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.thirtySecond).toBeCloseTo(delayTimes.quarter / 8, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Dotted quarter should be 1.5x quarter note
   * **Validates: Requirements 20.12**
   */
  it('dotted quarter should be 1.5x quarter note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.dottedQuarter).toBeCloseTo(delayTimes.quarter * 1.5, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Dotted eighth should be 1.5x eighth note
   * **Validates: Requirements 20.12**
   */
  it('dotted eighth should be 1.5x eighth note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.dottedEighth).toBeCloseTo(delayTimes.eighth * 1.5, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Triplet quarter should be 2/3 of quarter note
   * **Validates: Requirements 20.12**
   */
  it('triplet quarter should be 2/3 of quarter note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.tripletQuarter).toBeCloseTo(delayTimes.quarter * (2 / 3), 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Triplet eighth should be 2/3 of eighth note
   * **Validates: Requirements 20.12**
   */
  it('triplet eighth should be 2/3 of eighth note', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.tripletEighth).toBeCloseTo(delayTimes.eighth * (2 / 3), 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All delay times should be positive for positive BPM
   * **Validates: Requirements 20.11, 20.12**
   */
  it('all delay times should be positive for positive BPM', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.quarter).toBeGreaterThan(0);
          expect(delayTimes.eighth).toBeGreaterThan(0);
          expect(delayTimes.sixteenth).toBeGreaterThan(0);
          expect(delayTimes.thirtySecond).toBeGreaterThan(0);
          expect(delayTimes.dottedQuarter).toBeGreaterThan(0);
          expect(delayTimes.dottedEighth).toBeGreaterThan(0);
          expect(delayTimes.dottedSixteenth).toBeGreaterThan(0);
          expect(delayTimes.tripletQuarter).toBeGreaterThan(0);
          expect(delayTimes.tripletEighth).toBeGreaterThan(0);
          expect(delayTimes.tripletSixteenth).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Higher BPM should result in shorter delay times
   * **Validates: Requirements 20.11, 20.12**
   */
  it('higher BPM should result in shorter delay times', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        validBpmArb,
        (bpm1, bpm2) => {
          const lowBpm = Math.min(bpm1, bpm2);
          const highBpm = Math.max(bpm1, bpm2);

          if (lowBpm === highBpm) return true;

          const delayLow = calculateDelayTimes(lowBpm);
          const delayHigh = calculateDelayTimes(highBpm);

          // Higher BPM = shorter delays
          expect(delayHigh.quarter).toBeLessThan(delayLow.quarter);
          expect(delayHigh.eighth).toBeLessThan(delayLow.eighth);
          expect(delayHigh.sixteenth).toBeLessThan(delayLow.sixteenth);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: bpmFromMsPerBeat should be inverse of msPerBeat calculation
   * **Validates: Requirements 20.11**
   */
  it('bpmFromMsPerBeat should be inverse of msPerBeat calculation', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const result = calculateBPMResult(bpm);
          const recoveredBpm = bpmFromMsPerBeat(result.msPerBeat);

          // Should return to original BPM within tolerance
          expect(recoveredBpm).toBeCloseTo(bpm, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: msPerBeat should equal quarter note delay
   * **Validates: Requirements 20.11**
   */
  it('msPerBeat should equal quarter note delay', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const result = calculateBPMResult(bpm);

          expect(result.msPerBeat).toBeCloseTo(result.delayTimes.quarter, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Note value hierarchy should be maintained
   * quarter > eighth > sixteenth > thirtySecond
   * **Validates: Requirements 20.12**
   */
  it('note value hierarchy should be maintained', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.quarter).toBeGreaterThan(delayTimes.eighth);
          expect(delayTimes.eighth).toBeGreaterThan(delayTimes.sixteenth);
          expect(delayTimes.sixteenth).toBeGreaterThan(delayTimes.thirtySecond);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Dotted notes should be longer than their non-dotted counterparts
   * **Validates: Requirements 20.12**
   */
  it('dotted notes should be longer than non-dotted counterparts', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.dottedQuarter).toBeGreaterThan(delayTimes.quarter);
          expect(delayTimes.dottedEighth).toBeGreaterThan(delayTimes.eighth);
          expect(delayTimes.dottedSixteenth).toBeGreaterThan(delayTimes.sixteenth);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Triplet notes should be shorter than their non-triplet counterparts
   * **Validates: Requirements 20.12**
   */
  it('triplet notes should be shorter than non-triplet counterparts', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        (bpm) => {
          const delayTimes = calculateDelayTimes(bpm);

          expect(delayTimes.tripletQuarter).toBeLessThan(delayTimes.quarter);
          expect(delayTimes.tripletEighth).toBeLessThan(delayTimes.eighth);
          expect(delayTimes.tripletSixteenth).toBeLessThan(delayTimes.sixteenth);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('BPM Tapper Properties', () => {
  /**
   * Property: Consistent taps should produce expected BPM
   * **Validates: Requirements 20.11**
   */
  it('consistent taps should produce expected BPM', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 60, max: 200 }),
        fc.integer({ min: 4, max: 10 }),
        (targetBpm, tapCount) => {
          const interval = 60000 / targetBpm;
          const timestamps = Array.from({ length: tapCount }, (_, i) => i * interval);

          const calculatedBpm = calculateBPMFromTaps(timestamps);

          if (calculatedBpm === null) return true;

          // Should be within 1 BPM of target
          expect(Math.abs(calculatedBpm - targetBpm)).toBeLessThanOrEqual(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: BPM from taps should be within valid range
   * **Validates: Requirements 20.11**
   */
  it('BPM from taps should be within valid range or null', () => {
    fc.assert(
      fc.property(
        validTapTimestampsArb,
        (timestamps) => {
          const bpm = calculateBPMFromTaps(timestamps);

          if (bpm !== null) {
            expect(bpm).toBeGreaterThanOrEqual(20);
            expect(bpm).toBeLessThanOrEqual(300);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Single tap should return null
   * **Validates: Requirements 20.11**
   */
  it('single tap should return null', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 60000 }),
        (timestamp) => {
          const bpm = calculateBPMFromTaps([timestamp]);

          expect(bpm).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty array should return null
   * **Validates: Requirements 20.11**
   */
  it('empty array should return null', () => {
    const bpm = calculateBPMFromTaps([]);
    expect(bpm).toBeNull();
  });
});

describe('Reverb Calculator Properties', () => {
  /**
   * Property: Reverb pre-delay should be positive for valid inputs
   * **Validates: Requirements 20.2**
   */
  it('reverb pre-delay should be positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        fc.double({ min: 0.001, max: 1, noNaN: true }),
        (bpm, fraction) => {
          const preDelay = calculateReverbPreDelay(bpm, fraction);

          expect(preDelay).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Reverb decay should scale with beats
   * **Validates: Requirements 20.2**
   */
  it('reverb decay should scale linearly with beats', () => {
    fc.assert(
      fc.property(
        validBpmArb,
        fc.integer({ min: 1, max: 8 }),
        fc.integer({ min: 1, max: 8 }),
        (bpm, beats1, beats2) => {
          const decay1 = calculateReverbDecay(bpm, beats1);
          const decay2 = calculateReverbDecay(bpm, beats2);

          // Decay should scale linearly with beats
          const ratio = decay2 / decay1;
          const expectedRatio = beats2 / beats1;

          expect(ratio).toBeCloseTo(expectedRatio, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
