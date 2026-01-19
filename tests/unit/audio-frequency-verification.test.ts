/**
 * Unit Tests: Audio Frequency Verification
 * 
 * Verifies guitar tuner accuracy with known frequencies
 * This is a checkpoint verification test for audio tools
 */

import { describe, it, expect } from 'vitest';
import {
  noteToFrequency,
  frequencyToNote,
  formatNote,
  A4_FREQUENCY,
} from '@/lib/calculations/audio/note-frequency';

describe('Guitar Tuner - Known Frequency Verification', () => {
  /**
   * Verify A4 = 440Hz (standard concert pitch)
   */
  it('should calculate A4 as 440Hz', () => {
    const freq = noteToFrequency('A', 4);
    expect(freq).toBeCloseTo(440, 2);
  });

  /**
   * Verify standard guitar tuning frequencies
   * String 6 (low E) to String 1 (high E)
   */
  describe('Standard Guitar Tuning (EADGBE)', () => {
    const guitarStrings = [
      { string: 6, note: 'E', octave: 2, expected: 82.41 },
      { string: 5, note: 'A', octave: 2, expected: 110.00 },
      { string: 4, note: 'D', octave: 3, expected: 146.83 },
      { string: 3, note: 'G', octave: 3, expected: 196.00 },
      { string: 2, note: 'B', octave: 3, expected: 246.94 },
      { string: 1, note: 'E', octave: 4, expected: 329.63 },
    ];

    guitarStrings.forEach(({ string, note, octave, expected }) => {
      it(`String ${string} (${note}${octave}) should be ~${expected}Hz`, () => {
        const freq = noteToFrequency(note, octave);
        // Allow 0.1Hz tolerance for floating point
        expect(freq).toBeCloseTo(expected, 1);
      });
    });
  });

  /**
   * Verify frequency to note conversion (round-trip)
   */
  describe('Frequency to Note Round-Trip', () => {
    it('should correctly identify 440Hz as A4', () => {
      const result = frequencyToNote(440);
      expect(result.note.name).toBe('A');
      expect(result.note.octave).toBe(4);
      expect(Math.abs(result.cents)).toBeLessThan(1);
    });

    it('should correctly identify 261.63Hz as C4 (middle C)', () => {
      const result = frequencyToNote(261.63);
      expect(result.note.name).toBe('C');
      expect(result.note.octave).toBe(4);
      expect(Math.abs(result.cents)).toBeLessThan(1);
    });

    it('should correctly identify 329.63Hz as E4', () => {
      const result = frequencyToNote(329.63);
      expect(result.note.name).toBe('E');
      expect(result.note.octave).toBe(4);
      expect(Math.abs(result.cents)).toBeLessThan(1);
    });

    it('should correctly identify 82.41Hz as E2 (low E guitar string)', () => {
      const result = frequencyToNote(82.41);
      expect(result.note.name).toBe('E');
      expect(result.note.octave).toBe(2);
      expect(Math.abs(result.cents)).toBeLessThan(1);
    });
  });

  /**
   * Verify cents deviation calculation
   */
  describe('Cents Deviation', () => {
    it('should show positive cents for sharp frequencies', () => {
      // 445Hz is sharp of A4 (440Hz)
      const result = frequencyToNote(445);
      expect(result.note.name).toBe('A');
      expect(result.note.octave).toBe(4);
      expect(result.cents).toBeGreaterThan(0);
      expect(result.deviation).toBe('sharp');
    });

    it('should show negative cents for flat frequencies', () => {
      // 435Hz is flat of A4 (440Hz)
      const result = frequencyToNote(435);
      expect(result.note.name).toBe('A');
      expect(result.note.octave).toBe(4);
      expect(result.cents).toBeLessThan(0);
      expect(result.deviation).toBe('flat');
    });

    it('should show exact for perfect pitch', () => {
      const result = frequencyToNote(440);
      expect(result.deviation).toBe('exact');
    });
  });

  /**
   * Verify alternative tuning reference (A432)
   */
  describe('Alternative Reference Pitch (A432)', () => {
    it('should calculate A4 as 432Hz with A432 reference', () => {
      const freq = noteToFrequency('A', 4, 432);
      expect(freq).toBeCloseTo(432, 2);
    });

    it('should correctly identify 432Hz as A4 with A432 reference', () => {
      const result = frequencyToNote(432, 432);
      expect(result.note.name).toBe('A');
      expect(result.note.octave).toBe(4);
      expect(Math.abs(result.cents)).toBeLessThan(1);
    });
  });
});
