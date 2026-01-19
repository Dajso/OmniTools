/**
 * Statistics Calculations Unit Tests
 * Tests for sample size calculator and A/B test significance calculator
 * 
 * @module tests/unit/stats-calculations
 * @see Requirements 29.2, 29.8, 29.9
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSampleSize,
  getZScore,
  calculateABTestSignificance,
  calculateMinimumSampleSize,
  zScoreToPValue,
} from '@/lib/calculations/stats';

describe('Sample Size Calculator', () => {
  describe('getZScore', () => {
    it('should return correct Z-score for 90% confidence level', () => {
      const zScore = getZScore(0.90);
      expect(zScore).toBeCloseTo(1.645, 2);
    });

    it('should return correct Z-score for 95% confidence level', () => {
      const zScore = getZScore(0.95);
      expect(zScore).toBeCloseTo(1.96, 2);
    });

    it('should return correct Z-score for 99% confidence level', () => {
      const zScore = getZScore(0.99);
      expect(zScore).toBeCloseTo(2.576, 2);
    });

    it('should throw error for invalid confidence level', () => {
      expect(() => getZScore(0)).toThrow();
      expect(() => getZScore(1)).toThrow();
      expect(() => getZScore(-0.5)).toThrow();
      expect(() => getZScore(1.5)).toThrow();
    });
  });

  describe('calculateSampleSize', () => {
    it('should calculate correct sample size for 95% confidence, 5% margin of error', () => {
      // Known value: n = (1.96² × 0.5 × 0.5) / 0.05² = 384.16 ≈ 385
      const result = calculateSampleSize({
        confidenceLevel: 0.95,
        marginOfError: 5,
      });
      
      expect(result.sampleSize).toBe(385);
      expect(result.zScore).toBeCloseTo(1.96, 2);
    });

    it('should calculate correct sample size for 99% confidence, 3% margin of error', () => {
      // Known value: n = (2.576² × 0.5 × 0.5) / 0.03² = 1843.27 ≈ 1844
      const result = calculateSampleSize({
        confidenceLevel: 0.99,
        marginOfError: 3,
      });
      
      expect(result.sampleSize).toBe(1844);
    });

    it('should calculate correct sample size for 90% confidence, 10% margin of error', () => {
      // Known value: n = (1.645² × 0.5 × 0.5) / 0.10² = 67.65 ≈ 68
      const result = calculateSampleSize({
        confidenceLevel: 0.90,
        marginOfError: 10,
      });
      
      expect(result.sampleSize).toBe(68);
    });

    it('should apply finite population correction correctly', () => {
      const result = calculateSampleSize({
        confidenceLevel: 0.95,
        marginOfError: 5,
        populationSize: 500,
      });
      
      // With FPC: n_adj = 385 / (1 + (385-1)/500) = 385 / 1.768 ≈ 218
      expect(result.sampleSize).toBe(385);
      expect(result.adjustedSampleSize).toBeDefined();
      expect(result.adjustedSampleSize).toBeLessThan(result.sampleSize);
      expect(result.adjustedSampleSize).toBeCloseTo(218, 0);
    });

    it('should use custom expected proportion', () => {
      // With p=0.3, n = (1.96² × 0.3 × 0.7) / 0.05² = 322.69 ≈ 323
      const result = calculateSampleSize({
        confidenceLevel: 0.95,
        marginOfError: 5,
        expectedProportion: 0.3,
      });
      
      expect(result.sampleSize).toBe(323);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateSampleSize({
        confidenceLevel: 0,
        marginOfError: 5,
      })).toThrow();

      expect(() => calculateSampleSize({
        confidenceLevel: 0.95,
        marginOfError: 0,
      })).toThrow();

      expect(() => calculateSampleSize({
        confidenceLevel: 0.95,
        marginOfError: 5,
        expectedProportion: 1.5,
      })).toThrow();
    });
  });
});

describe('A/B Test Significance Calculator', () => {
  describe('calculateABTestSignificance', () => {
    it('should calculate correct results for a significant test', () => {
      // Example: Control 1000 visitors, 100 conversions (10%)
      //          Treatment 1000 visitors, 150 conversions (15%)
      const result = calculateABTestSignificance({
        controlVisitors: 1000,
        controlConversions: 100,
        treatmentVisitors: 1000,
        treatmentConversions: 150,
      });

      expect(result.controlRate).toBeCloseTo(10, 1);
      expect(result.treatmentRate).toBeCloseTo(15, 1);
      expect(result.relativeLift).toBeCloseTo(50, 0); // 50% lift
      expect(result.absoluteLift).toBeCloseTo(5, 1); // 5 percentage points
      expect(result.isSignificant).toBe(true);
      expect(result.pValue).toBeLessThan(0.05);
    });

    it('should calculate correct results for a non-significant test', () => {
      // Example: Small difference with small sample
      const result = calculateABTestSignificance({
        controlVisitors: 100,
        controlConversions: 10,
        treatmentVisitors: 100,
        treatmentConversions: 12,
      });

      expect(result.controlRate).toBeCloseTo(10, 1);
      expect(result.treatmentRate).toBeCloseTo(12, 1);
      expect(result.isSignificant).toBe(false);
      expect(result.pValue).toBeGreaterThan(0.05);
    });

    it('should handle equal conversion rates', () => {
      const result = calculateABTestSignificance({
        controlVisitors: 1000,
        controlConversions: 100,
        treatmentVisitors: 1000,
        treatmentConversions: 100,
      });

      expect(result.controlRate).toBeCloseTo(10, 1);
      expect(result.treatmentRate).toBeCloseTo(10, 1);
      expect(result.relativeLift).toBe(0);
      expect(result.absoluteLift).toBe(0);
      expect(result.isSignificant).toBe(false);
    });

    it('should calculate confidence interval correctly', () => {
      const result = calculateABTestSignificance({
        controlVisitors: 1000,
        controlConversions: 100,
        treatmentVisitors: 1000,
        treatmentConversions: 150,
      });

      // Confidence interval should contain the absolute lift
      expect(result.confidenceInterval.lower).toBeLessThan(result.absoluteLift);
      expect(result.confidenceInterval.upper).toBeGreaterThan(result.absoluteLift);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateABTestSignificance({
        controlVisitors: 0,
        controlConversions: 0,
        treatmentVisitors: 100,
        treatmentConversions: 10,
      })).toThrow();

      expect(() => calculateABTestSignificance({
        controlVisitors: 100,
        controlConversions: 150, // More conversions than visitors
        treatmentVisitors: 100,
        treatmentConversions: 10,
      })).toThrow();

      expect(() => calculateABTestSignificance({
        controlVisitors: 100,
        controlConversions: -10, // Negative conversions
        treatmentVisitors: 100,
        treatmentConversions: 10,
      })).toThrow();
    });
  });

  describe('calculateMinimumSampleSize', () => {
    it('should calculate minimum sample size for detecting 10% lift', () => {
      const sampleSize = calculateMinimumSampleSize(0.10, 0.10);
      
      // For 10% baseline, 10% MDE, 80% power, 95% confidence
      // Expected around 14,000-15,000 per variation
      expect(sampleSize).toBeGreaterThan(10000);
      expect(sampleSize).toBeLessThan(20000);
    });

    it('should calculate minimum sample size for detecting 20% lift', () => {
      const sampleSize = calculateMinimumSampleSize(0.10, 0.20);
      
      // Larger effect size requires smaller sample
      expect(sampleSize).toBeGreaterThan(2000);
      expect(sampleSize).toBeLessThan(5000);
    });

    it('should throw error for invalid baseline rate', () => {
      expect(() => calculateMinimumSampleSize(0, 0.10)).toThrow();
      expect(() => calculateMinimumSampleSize(1, 0.10)).toThrow();
    });
  });

  describe('zScoreToPValue', () => {
    it('should return correct p-value for z=0', () => {
      const pValue = zScoreToPValue(0);
      expect(pValue).toBeCloseTo(1, 2);
    });

    it('should return correct p-value for z=1.96', () => {
      const pValue = zScoreToPValue(1.96);
      expect(pValue).toBeCloseTo(0.05, 2);
    });

    it('should return correct p-value for z=2.576', () => {
      const pValue = zScoreToPValue(2.576);
      expect(pValue).toBeCloseTo(0.01, 2);
    });

    it('should handle negative z-scores symmetrically', () => {
      const pValuePositive = zScoreToPValue(1.96);
      const pValueNegative = zScoreToPValue(-1.96);
      expect(pValuePositive).toBeCloseTo(pValueNegative, 4);
    });
  });
});
