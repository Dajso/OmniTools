/**
 * Property Tests: Gaming Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Mouse Sensitivity Converter and related gaming calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateCm360,
  sensitivityFromCm360,
  convertSensitivity,
  calculateEDPI,
  edpiToSensitivity,
  getGameMultiplier,
  GAME_MULTIPLIERS,
  SUPPORTED_GAMES,
  type GameSensitivity,
} from '@/lib/calculations/gaming/sensitivity-converter';

/**
 * Arbitrary for generating valid DPI values (common mouse DPI range)
 */
const validDpiArb = fc.integer({ min: 100, max: 16000 });

/**
 * Arbitrary for generating valid sensitivity values
 */
const validSensitivityArb = fc.double({ min: 0.01, max: 100, noNaN: true });

/**
 * Arbitrary for generating valid game IDs
 */
const validGameIdArb = fc.constantFrom(...Object.keys(GAME_MULTIPLIERS));

/**
 * Arbitrary for generating valid cm/360 values (realistic range)
 */
const validCm360Arb = fc.double({ min: 5, max: 200, noNaN: true });

describe('Mouse Sensitivity Converter - Property 6: Mouse Sensitivity cm/360 Preservation', () => {
  /**
   * Property 6: Mouse Sensitivity cm/360 Preservation
   * Feature: expanded-tools-categories, Property 6: Mouse Sensitivity cm/360 Preservation
   * 
   * *For any* game sensitivity conversion, the cm/360 (centimeters per 360-degree turn)
   * SHALL be preserved across all supported games within 0.1% tolerance.
   * 
   * **Validates: Requirements 17.11**
   */
  it('cm/360 should be preserved when converting between games', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        validGameIdArb,
        validGameIdArb,
        (dpi, sensitivity, sourceGame, targetGame) => {
          const source: GameSensitivity = {
            game: sourceGame,
            sensitivity,
            dpi,
          };

          const result = convertSensitivity(source, targetGame);

          // Calculate cm/360 for the converted sensitivity
          const targetMultiplier = getGameMultiplier(targetGame);
          const convertedCm360 = calculateCm360(dpi, result.convertedSensitivity, targetMultiplier);

          // cm/360 should be preserved within 0.1% tolerance
          const tolerance = result.cm360 * 0.001;
          const difference = Math.abs(convertedCm360 - result.cm360);

          expect(difference).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Converting to the same game should return the same sensitivity
   * **Validates: Requirements 17.11**
   */
  it('converting to the same game should return the same sensitivity', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        validGameIdArb,
        (dpi, sensitivity, game) => {
          const source: GameSensitivity = {
            game,
            sensitivity,
            dpi,
          };

          const result = convertSensitivity(source, game);

          // Should return the same sensitivity within floating-point tolerance
          const tolerance = sensitivity * 0.0001;
          expect(Math.abs(result.convertedSensitivity - sensitivity)).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Round-trip conversion should return original sensitivity
   * **Validates: Requirements 17.11**
   */
  it('round-trip conversion should return original sensitivity', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        validGameIdArb,
        validGameIdArb,
        (dpi, sensitivity, sourceGame, intermediateGame) => {
          const source: GameSensitivity = {
            game: sourceGame,
            sensitivity,
            dpi,
          };

          // Convert to intermediate game
          const intermediate = convertSensitivity(source, intermediateGame);

          // Convert back to source game
          const intermediateSource: GameSensitivity = {
            game: intermediateGame,
            sensitivity: intermediate.convertedSensitivity,
            dpi,
          };
          const roundTrip = convertSensitivity(intermediateSource, sourceGame);

          // Should return to original sensitivity within tolerance
          const tolerance = sensitivity * 0.001;
          expect(Math.abs(roundTrip.convertedSensitivity - sensitivity)).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: cm/360 should be positive for positive inputs
   * **Validates: Requirements 17.11**
   */
  it('cm/360 should be positive for positive inputs', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        validGameIdArb,
        (dpi, sensitivity, game) => {
          const multiplier = getGameMultiplier(game);
          const cm360 = calculateCm360(dpi, sensitivity, multiplier);

          expect(cm360).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Higher sensitivity should result in lower cm/360
   * **Validates: Requirements 17.11**
   */
  it('higher sensitivity should result in lower cm/360', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        validSensitivityArb,
        validGameIdArb,
        (dpi, sens1, sens2, game) => {
          // Ensure sens1 < sens2
          const lowSens = Math.min(sens1, sens2);
          const highSens = Math.max(sens1, sens2);

          if (lowSens === highSens) return true;

          const multiplier = getGameMultiplier(game);
          const cm360Low = calculateCm360(dpi, lowSens, multiplier);
          const cm360High = calculateCm360(dpi, highSens, multiplier);

          // Higher sensitivity = lower cm/360 (faster turning)
          expect(cm360High).toBeLessThan(cm360Low);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Higher DPI should result in lower cm/360
   * **Validates: Requirements 17.11**
   */
  it('higher DPI should result in lower cm/360', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validDpiArb,
        validSensitivityArb,
        validGameIdArb,
        (dpi1, dpi2, sensitivity, game) => {
          // Ensure dpi1 < dpi2
          const lowDpi = Math.min(dpi1, dpi2);
          const highDpi = Math.max(dpi1, dpi2);

          if (lowDpi === highDpi) return true;

          const multiplier = getGameMultiplier(game);
          const cm360Low = calculateCm360(lowDpi, sensitivity, multiplier);
          const cm360High = calculateCm360(highDpi, sensitivity, multiplier);

          // Higher DPI = lower cm/360 (faster turning)
          expect(cm360High).toBeLessThan(cm360Low);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: sensitivityFromCm360 should be inverse of calculateCm360
   * **Validates: Requirements 17.11**
   */
  it('sensitivityFromCm360 should be inverse of calculateCm360', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validCm360Arb,
        validGameIdArb,
        (dpi, cm360, game) => {
          const multiplier = getGameMultiplier(game);
          
          // Calculate sensitivity from cm/360
          const sensitivity = sensitivityFromCm360(dpi, cm360, multiplier);
          
          // Calculate cm/360 from that sensitivity
          const calculatedCm360 = calculateCm360(dpi, sensitivity, multiplier);

          // Should return to original cm/360 within tolerance
          const tolerance = cm360 * 0.0001;
          expect(Math.abs(calculatedCm360 - cm360)).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('eDPI Calculator Properties', () => {
  /**
   * Property: eDPI should equal DPI × sensitivity
   * **Validates: Requirements 17.2**
   */
  it('eDPI should equal DPI × sensitivity', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        (dpi, sensitivity) => {
          const edpi = calculateEDPI(dpi, sensitivity);
          const expected = dpi * sensitivity;

          expect(edpi).toBeCloseTo(expected, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: edpiToSensitivity should be inverse of calculateEDPI
   * **Validates: Requirements 17.2**
   */
  it('edpiToSensitivity should be inverse of calculateEDPI', () => {
    fc.assert(
      fc.property(
        validDpiArb,
        validSensitivityArb,
        (dpi, sensitivity) => {
          const edpi = calculateEDPI(dpi, sensitivity);
          const recoveredSensitivity = edpiToSensitivity(edpi, dpi);

          // Should return to original sensitivity within tolerance
          const tolerance = sensitivity * 0.0001;
          expect(Math.abs(recoveredSensitivity - sensitivity)).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Same eDPI with different DPI should give different sensitivities
   * **Validates: Requirements 17.2**
   */
  it('same eDPI with different DPI should give different sensitivities', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 8000 }),
        fc.integer({ min: 8001, max: 16000 }),
        fc.double({ min: 100, max: 10000, noNaN: true }),
        (dpi1, dpi2, edpi) => {
          const sens1 = edpiToSensitivity(edpi, dpi1);
          const sens2 = edpiToSensitivity(edpi, dpi2);

          // Different DPIs should give different sensitivities for same eDPI
          expect(sens1).not.toBeCloseTo(sens2, 5);

          // But both should produce the same eDPI
          expect(calculateEDPI(dpi1, sens1)).toBeCloseTo(edpi, 5);
          expect(calculateEDPI(dpi2, sens2)).toBeCloseTo(edpi, 5);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
