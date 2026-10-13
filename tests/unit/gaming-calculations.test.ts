/**
 * Unit Tests: Gaming Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for Mouse Sensitivity Converter and Reaction Time with known values
 * These tests verify the calculations work correctly with real-world game values.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCm360,
  sensitivityFromCm360,
  convertSensitivity,
  calculateEDPI,
  getGameMultiplier,
  GAME_MULTIPLIERS,
  type GameSensitivity,
} from '@/lib/calculations/gaming/sensitivity-converter';
import {
  calculateReactionTime,
  calculateReactionTimeStats,
  classifyReactionTime,
  calculateRollingAverage,
  getPercentileRank,
  type ReactionTimeResult,
} from '@/lib/calculations/gaming/reaction-time';

describe('Mouse Sensitivity Converter - Known Game Values', () => {
  /**
   * Test with known professional player settings
   * These are commonly used sensitivity values in competitive gaming
   */
  describe('Known sensitivity conversions', () => {
    it('should correctly calculate cm/360 for Valorant at 800 DPI, 0.35 sens', () => {
      // Common Valorant pro setting: 800 DPI, 0.35 sensitivity
      const dpi = 800;
      const sensitivity = 0.35;
      const multiplier = GAME_MULTIPLIERS['valorant']; // 0.07

      const cm360 = calculateCm360(dpi, sensitivity, multiplier);
      
      // Expected: (2.54 * 360) / (800 * 0.35 * 0.07) ≈ 46.65 cm
      expect(cm360).toBeCloseTo(46.65, 1);
    });

    it('should correctly calculate cm/360 for CS2 at 400 DPI, 2.0 sens', () => {
      // Common CS2 pro setting: 400 DPI, 2.0 sensitivity
      const dpi = 400;
      const sensitivity = 2.0;
      const multiplier = GAME_MULTIPLIERS['cs2']; // 0.022

      const cm360 = calculateCm360(dpi, sensitivity, multiplier);
      
      // Expected: (2.54 * 360) / (400 * 2.0 * 0.022) ≈ 51.95 cm
      expect(cm360).toBeCloseTo(51.95, 1);
    });

    it('should convert Valorant sensitivity to CS2 correctly', () => {
      // Convert Valorant 800 DPI, 0.35 sens to CS2
      const source: GameSensitivity = {
        game: 'valorant',
        sensitivity: 0.35,
        dpi: 800,
      };

      const result = convertSensitivity(source, 'cs2');

      // The cm/360 should be preserved
      // Valorant cm/360 ≈ 46.65
      // CS2 sensitivity = (2.54 * 360) / (800 * 46.65 * 0.022) ≈ 1.11
      expect(result.convertedSensitivity).toBeCloseTo(1.11, 1);
      expect(result.cm360).toBeCloseTo(46.65, 1);
    });

    it('should convert CS2 sensitivity to Valorant correctly', () => {
      // Convert CS2 400 DPI, 2.0 sens to Valorant
      const source: GameSensitivity = {
        game: 'cs2',
        sensitivity: 2.0,
        dpi: 400,
      };

      const result = convertSensitivity(source, 'valorant');

      // CS2 cm/360 ≈ 51.95
      // Valorant sensitivity = (2.54 * 360) / (400 * 51.95 * 0.07) ≈ 0.63
      expect(result.convertedSensitivity).toBeCloseTo(0.63, 1);
    });

    it('should handle Apex Legends with multiplier of 1.0', () => {
      // Apex uses a multiplier of 1.0, making calculations simpler
      const dpi = 800;
      const sensitivity = 1.5;
      const multiplier = GAME_MULTIPLIERS['apex']; // 1.0

      const cm360 = calculateCm360(dpi, sensitivity, multiplier);
      
      // Expected: (2.54 * 360) / (800 * 1.5 * 1.0) ≈ 0.762 cm
      expect(cm360).toBeCloseTo(0.762, 2);
    });
  });

  describe('eDPI calculations', () => {
    it('should calculate eDPI correctly for common settings', () => {
      // 800 DPI * 0.35 sens = 280 eDPI
      expect(calculateEDPI(800, 0.35)).toBeCloseTo(280, 2);
      
      // 400 DPI * 2.0 sens = 800 eDPI
      expect(calculateEDPI(400, 2.0)).toBeCloseTo(800, 2);
      
      // 1600 DPI * 0.25 sens = 400 eDPI
      expect(calculateEDPI(1600, 0.25)).toBeCloseTo(400, 2);
    });
  });

  describe('Game multiplier validation', () => {
    it('should have correct multipliers for all supported games', () => {
      // Verify key game multipliers are correct
      expect(GAME_MULTIPLIERS['valorant']).toBe(0.07);
      expect(GAME_MULTIPLIERS['cs2']).toBe(0.022);
      expect(GAME_MULTIPLIERS['csgo']).toBe(0.022);
      expect(GAME_MULTIPLIERS['apex']).toBe(1.0);
      expect(GAME_MULTIPLIERS['overwatch2']).toBe(0.0066);
      expect(GAME_MULTIPLIERS['fortnite']).toBe(0.5555);
    });

    it('should throw error for unsupported game', () => {
      expect(() => getGameMultiplier('unsupported-game')).toThrow('Spillet støttes ikke');
    });
  });

  describe('Input validation', () => {
    it('should throw error for zero or negative DPI', () => {
      expect(() => calculateCm360(0, 1, 0.07)).toThrow('DPI må være større enn 0');
      expect(() => calculateCm360(-100, 1, 0.07)).toThrow('DPI må være større enn 0');
    });

    it('should throw error for zero or negative sensitivity', () => {
      expect(() => calculateCm360(800, 0, 0.07)).toThrow('Følsomheten må være større enn 0');
      expect(() => calculateCm360(800, -1, 0.07)).toThrow('Følsomheten må være større enn 0');
    });

    it('should throw error for zero or negative multiplier', () => {
      expect(() => calculateCm360(800, 1, 0)).toThrow('Spillmultiplikatoren må være større enn 0');
      expect(() => calculateCm360(800, 1, -0.07)).toThrow('Spillmultiplikatoren må være større enn 0');
    });
  });
});

describe('Reaction Time Test - Accuracy Verification', () => {
  describe('Reaction time calculation', () => {
    it('should calculate reaction time correctly', () => {
      const startTime = 1000;
      const endTime = 1250;
      
      const result = calculateReactionTime(startTime, endTime);
      
      expect(result.reactionTime).toBe(250);
      expect(result.isValid).toBe(true);
      expect(result.startTime).toBe(1000);
      expect(result.endTime).toBe(1250);
    });

    it('should mark early reactions as invalid', () => {
      const startTime = 1000;
      const endTime = 900; // Clicked before stimulus
      
      const result = calculateReactionTime(startTime, endTime);
      
      expect(result.reactionTime).toBe(0);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Reaction time classification', () => {
    it('should classify exceptional reaction time (< 150ms)', () => {
      expect(classifyReactionTime(140)).toBe('exceptional');
      expect(classifyReactionTime(100)).toBe('exceptional');
    });

    it('should classify excellent reaction time (150-200ms)', () => {
      expect(classifyReactionTime(150)).toBe('excellent');
      expect(classifyReactionTime(180)).toBe('excellent');
      expect(classifyReactionTime(199)).toBe('excellent');
    });

    it('should classify good reaction time (200-250ms)', () => {
      expect(classifyReactionTime(200)).toBe('good');
      expect(classifyReactionTime(230)).toBe('good');
      expect(classifyReactionTime(249)).toBe('good');
    });

    it('should classify average reaction time (250-300ms)', () => {
      expect(classifyReactionTime(250)).toBe('average');
      expect(classifyReactionTime(275)).toBe('average');
      expect(classifyReactionTime(299)).toBe('average');
    });

    it('should classify below-average reaction time (300-400ms)', () => {
      expect(classifyReactionTime(300)).toBe('below-average');
      expect(classifyReactionTime(350)).toBe('below-average');
      expect(classifyReactionTime(399)).toBe('below-average');
    });

    it('should classify slow reaction time (> 400ms)', () => {
      expect(classifyReactionTime(400)).toBe('slow');
      expect(classifyReactionTime(500)).toBe('slow');
      expect(classifyReactionTime(1000)).toBe('slow');
    });
  });

  describe('Statistics calculation', () => {
    it('should calculate correct statistics for multiple attempts', () => {
      const results: ReactionTimeResult[] = [
        { reactionTime: 200, startTime: 0, endTime: 200, isValid: true },
        { reactionTime: 250, startTime: 0, endTime: 250, isValid: true },
        { reactionTime: 220, startTime: 0, endTime: 220, isValid: true },
        { reactionTime: 280, startTime: 0, endTime: 280, isValid: true },
        { reactionTime: 230, startTime: 0, endTime: 230, isValid: true },
      ];

      const stats = calculateReactionTimeStats(results);

      expect(stats.validAttempts).toBe(5);
      expect(stats.invalidAttempts).toBe(0);
      expect(stats.best).toBe(200);
      expect(stats.worst).toBe(280);
      expect(stats.average).toBe(236); // (200+250+220+280+230)/5
      expect(stats.median).toBe(230);
    });

    it('should handle invalid attempts correctly', () => {
      const results: ReactionTimeResult[] = [
        { reactionTime: 200, startTime: 0, endTime: 200, isValid: true },
        { reactionTime: 0, startTime: 100, endTime: 50, isValid: false }, // Too early
        { reactionTime: 250, startTime: 0, endTime: 250, isValid: true },
      ];

      const stats = calculateReactionTimeStats(results);

      expect(stats.validAttempts).toBe(2);
      expect(stats.invalidAttempts).toBe(1);
      expect(stats.average).toBe(225); // (200+250)/2
    });

    it('should handle empty results', () => {
      const stats = calculateReactionTimeStats([]);

      expect(stats.validAttempts).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.best).toBe(0);
      expect(stats.worst).toBe(0);
    });
  });

  describe('Rolling average calculation', () => {
    it('should calculate rolling average from last N attempts', () => {
      const results: ReactionTimeResult[] = [
        { reactionTime: 300, startTime: 0, endTime: 300, isValid: true },
        { reactionTime: 280, startTime: 0, endTime: 280, isValid: true },
        { reactionTime: 260, startTime: 0, endTime: 260, isValid: true },
        { reactionTime: 240, startTime: 0, endTime: 240, isValid: true },
        { reactionTime: 220, startTime: 0, endTime: 220, isValid: true },
      ];

      // Last 3 attempts: 260, 240, 220
      const rollingAvg = calculateRollingAverage(results, 3);
      expect(rollingAvg).toBe(240); // (260+240+220)/3
    });

    it('should use default of 8 attempts', () => {
      const results: ReactionTimeResult[] = Array.from({ length: 10 }, (_, i) => ({
        reactionTime: 200 + i * 10, // 200, 210, 220, ..., 290
        startTime: 0,
        endTime: 200 + i * 10,
        isValid: true,
      }));

      // Last 8 attempts: 220, 230, 240, 250, 260, 270, 280, 290
      const rollingAvg = calculateRollingAverage(results);
      expect(rollingAvg).toBe(255); // Average of last 8
    });
  });

  describe('Percentile rank calculation', () => {
    it('should give higher percentile for faster reaction times', () => {
      const fastPercentile = getPercentileRank(150);
      const slowPercentile = getPercentileRank(350);

      expect(fastPercentile).toBeGreaterThan(slowPercentile);
    });

    it('should give approximately 50th percentile for 250ms (average)', () => {
      const percentile = getPercentileRank(250);
      expect(percentile).toBeCloseTo(50, 0);
    });

    it('should clamp percentile between 0 and 100', () => {
      const veryFast = getPercentileRank(50);
      const verySlow = getPercentileRank(500);

      expect(veryFast).toBeLessThanOrEqual(100);
      expect(veryFast).toBeGreaterThanOrEqual(0);
      expect(verySlow).toBeLessThanOrEqual(100);
      expect(verySlow).toBeGreaterThanOrEqual(0);
    });
  });
});
