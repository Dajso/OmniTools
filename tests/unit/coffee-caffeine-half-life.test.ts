/**
 * Unit tests for Caffeine Half-Life Tracker
 * 
 * Tests the calculation logic for caffeine tracking with exponential decay.
 * 
 * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCaffeineLevel,
  calculateRemainingCaffeine,
  calculateCurrentCaffeineLevel,
  getSleepRecommendation,
  calculateSafeForSleepTime,
  generateCaffeineTimeline,
  validateCaffeineIntake,
  type CaffeineIntake,
  type CaffeineTrackerInputs,
} from '@/lib/calculations/coffee/caffeine-half-life';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Caffeine Half-Life Tracker', () => {
  // Helper to create a date relative to now
  const createDate = (hoursAgo: number): Date => {
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);
    return date;
  };

  describe('validateCaffeineIntake', () => {
    it('should accept valid intake', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(2),
        caffeineMg: 95,
        source: 'Coffee',
      };
      const currentTime = new Date();

      expect(() => validateCaffeineIntake(intake, currentTime)).not.toThrow();
    });

    it('should reject zero caffeine amount', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(2),
        caffeineMg: 0,
        source: 'Coffee',
      };
      const currentTime = new Date();

      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow(CoffeeCalculationError);
      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow('positive number');
    });

    it('should reject negative caffeine amount', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(2),
        caffeineMg: -50,
        source: 'Coffee',
      };
      const currentTime = new Date();

      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow(CoffeeCalculationError);
    });

    it('should reject caffeine amount above 500mg', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(2),
        caffeineMg: 600,
        source: 'Coffee',
      };
      const currentTime = new Date();

      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow(CoffeeCalculationError);
      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow('500mg');
    });

    it('should reject future intake time', () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 2);

      const intake: CaffeineIntake = {
        id: '1',
        time: futureTime,
        caffeineMg: 95,
        source: 'Coffee',
      };
      const currentTime = new Date();

      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow(CoffeeCalculationError);
      expect(() => validateCaffeineIntake(intake, currentTime)).toThrow('future');
    });
  });

  describe('calculateRemainingCaffeine', () => {
    it('should return full amount at time of intake', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: new Date(),
        caffeineMg: 100,
        source: 'Coffee',
      };

      const remaining = calculateRemainingCaffeine(intake, new Date());
      expect(remaining).toBeCloseTo(100, 0);
    });

    it('should return 50% after 5 hours (one half-life)', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(5),
        caffeineMg: 100,
        source: 'Coffee',
      };

      const remaining = calculateRemainingCaffeine(intake, new Date());
      expect(remaining).toBeCloseTo(50, 1);
    });

    it('should return 25% after 10 hours (two half-lives)', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(10),
        caffeineMg: 100,
        source: 'Coffee',
      };

      const remaining = calculateRemainingCaffeine(intake, new Date());
      expect(remaining).toBeCloseTo(25, 1);
    });

    it('should return 12.5% after 15 hours (three half-lives)', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(15),
        caffeineMg: 100,
        source: 'Coffee',
      };

      const remaining = calculateRemainingCaffeine(intake, new Date());
      expect(remaining).toBeCloseTo(12.5, 1);
    });

    it('should handle espresso dose (64mg)', () => {
      const intake: CaffeineIntake = {
        id: '1',
        time: createDate(5),
        caffeineMg: 64,
        source: 'Espresso',
      };

      const remaining = calculateRemainingCaffeine(intake, new Date());
      expect(remaining).toBeCloseTo(32, 1);
    });
  });

  describe('calculateCurrentCaffeineLevel', () => {
    it('should sum multiple intakes', () => {
      const intakes: CaffeineIntake[] = [
        {
          id: '1',
          time: createDate(0),
          caffeineMg: 50,
          source: 'Coffee 1',
        },
        {
          id: '2',
          time: createDate(0),
          caffeineMg: 50,
          source: 'Coffee 2',
        },
      ];

      const total = calculateCurrentCaffeineLevel(intakes, new Date());
      expect(total).toBeCloseTo(100, 0);
    });

    it('should account for decay in multiple intakes', () => {
      const intakes: CaffeineIntake[] = [
        {
          id: '1',
          time: createDate(5), // 50% remaining
          caffeineMg: 100,
          source: 'Coffee 1',
        },
        {
          id: '2',
          time: createDate(0), // 100% remaining
          caffeineMg: 100,
          source: 'Coffee 2',
        },
      ];

      const total = calculateCurrentCaffeineLevel(intakes, new Date());
      expect(total).toBeCloseTo(150, 1); // 50 + 100
    });

    it('should return 0 for empty intakes array', () => {
      const intakes: CaffeineIntake[] = [];
      const currentTime = new Date();

      const level = calculateCurrentCaffeineLevel(intakes, currentTime);
      expect(level).toBe(0);
    });
  });

  describe('getSleepRecommendation', () => {
    it('should recommend safe for sleep below 50mg', () => {
      const recommendation = getSleepRecommendation(30);
      expect(recommendation).toContain('Safe');
      expect(recommendation.toLowerCase()).toContain('sleep');
    });

    it('should warn about moderate levels between 50-100mg', () => {
      const recommendation = getSleepRecommendation(75);
      expect(recommendation).toContain('Moderate');
      expect(recommendation.toLowerCase()).toContain('sleep');
    });

    it('should warn about high levels above 100mg', () => {
      const recommendation = getSleepRecommendation(150);
      expect(recommendation).toContain('High');
      expect(recommendation.toLowerCase()).toContain('avoid');
    });

    it('should handle boundary at 50mg', () => {
      const recommendation = getSleepRecommendation(50);
      expect(recommendation).toContain('Moderate');
    });

    it('should handle boundary at 100mg', () => {
      const recommendation = getSleepRecommendation(100);
      expect(recommendation).toContain('High');
    });
  });

  describe('calculateSafeForSleepTime', () => {
    it('should return undefined when already safe', () => {
      const currentTime = new Date();
      const safeTime = calculateSafeForSleepTime(30, currentTime);
      expect(safeTime).toBeUndefined();
    });

    it('should calculate time to reach safe threshold from 100mg', () => {
      const currentTime = new Date();
      const safeTime = calculateSafeForSleepTime(100, currentTime);
      
      expect(safeTime).toBeDefined();
      if (safeTime) {
        const hoursUntilSafe = (safeTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        // 100mg -> 50mg is one half-life (5 hours)
        expect(hoursUntilSafe).toBeCloseTo(5, 0);
      }
    });

    it('should calculate time to reach safe threshold from 200mg', () => {
      const currentTime = new Date();
      const safeTime = calculateSafeForSleepTime(200, currentTime);
      
      expect(safeTime).toBeDefined();
      if (safeTime) {
        const hoursUntilSafe = (safeTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        // 200mg -> 50mg is two half-lives (10 hours)
        expect(hoursUntilSafe).toBeCloseTo(10, 0);
      }
    });
  });

  describe('generateCaffeineTimeline', () => {
    it('should generate timeline points', () => {
      const intakes: CaffeineIntake[] = [
        {
          id: '1',
          time: createDate(2),
          caffeineMg: 100,
          source: 'Coffee',
        },
      ];
      const currentTime = new Date();

      const timeline = generateCaffeineTimeline(intakes, currentTime, 6, 1);
      
      expect(timeline.length).toBeGreaterThan(0);
      expect(timeline[0]).toHaveProperty('time');
      expect(timeline[0]).toHaveProperty('level');
    });

    it('should show decreasing levels over time', () => {
      const intakes: CaffeineIntake[] = [
        {
          id: '1',
          time: createDate(1),
          caffeineMg: 100,
          source: 'Coffee',
        },
      ];
      const currentTime = new Date();

      const timeline = generateCaffeineTimeline(intakes, currentTime, 12, 1);
      
      // Find current time index
      const currentIndex = timeline.findIndex(p => p.time >= currentTime);
      
      if (currentIndex >= 0 && currentIndex < timeline.length - 1) {
        // Levels should decrease over time (after current time)
        expect(timeline[currentIndex].level).toBeGreaterThan(timeline[timeline.length - 1].level);
      }
    });
  });

  describe('calculateCaffeineLevel', () => {
    it('should calculate complete results', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(5),
            caffeineMg: 100,
            source: 'Coffee',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      expect(results).toHaveProperty('currentLevel');
      expect(results).toHaveProperty('halfLifeRemaining');
      expect(results).toHaveProperty('sleepRecommendation');
      expect(results).toHaveProperty('timeline');
      expect(results.currentLevel).toBeCloseTo(50, 1);
      expect(results.halfLifeRemaining).toBe(5);
    });

    it('should handle multiple intakes', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(5),
            caffeineMg: 100,
            source: 'Coffee 1',
          },
          {
            id: '2',
            time: createDate(0),
            caffeineMg: 50,
            source: 'Coffee 2',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      expect(results.currentLevel).toBeCloseTo(100, 1); // 50 + 50
    });

    it('should throw error for empty intakes', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [],
        currentTime: new Date(),
      };

      expect(() => calculateCaffeineLevel(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateCaffeineLevel(inputs)).toThrow('At least one');
    });

    it('should include safe for sleep time when level is high', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(0),
            caffeineMg: 200,
            source: 'Coffee',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      expect(results.safeForSleepTime).toBeDefined();
    });

    it('should not include safe for sleep time when level is already safe', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(10),
            caffeineMg: 100,
            source: 'Coffee',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      expect(results.safeForSleepTime).toBeUndefined();
    });

    it('should handle realistic espresso scenario', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(3),
            caffeineMg: 64, // Single espresso
            source: 'Espresso',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      // After 3 hours, should have more than 50% but less than 100%
      expect(results.currentLevel).toBeGreaterThan(32);
      expect(results.currentLevel).toBeLessThan(64);
      expect(results.sleepRecommendation).toContain('Safe');
    });

    it('should handle realistic multiple coffee scenario', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(6), // Morning coffee
            caffeineMg: 95,
            source: 'Pour Over',
          },
          {
            id: '2',
            time: createDate(2), // Afternoon coffee
            caffeineMg: 95,
            source: 'Pour Over',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);

      // Morning coffee mostly metabolized, afternoon coffee still present
      expect(results.currentLevel).toBeGreaterThan(50);
      expect(results.currentLevel).toBeLessThan(150);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small caffeine amounts', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(0),
            caffeineMg: 1,
            source: 'Decaf',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);
      expect(results.currentLevel).toBeCloseTo(1, 1);
    });

    it('should handle maximum caffeine amount', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(0),
            caffeineMg: 500,
            source: 'Energy Drink',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);
      expect(results.currentLevel).toBeCloseTo(500, 1);
    });

    it('should handle very old intakes (nearly zero remaining)', () => {
      const inputs: CaffeineTrackerInputs = {
        intakes: [
          {
            id: '1',
            time: createDate(24), // 24 hours ago
            caffeineMg: 100,
            source: 'Coffee',
          },
        ],
        currentTime: new Date(),
      };

      const results = calculateCaffeineLevel(inputs);
      // After 24 hours (4.8 half-lives), should be very low
      expect(results.currentLevel).toBeLessThan(10);
    });
  });
});
