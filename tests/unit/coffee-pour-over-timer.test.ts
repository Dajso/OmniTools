import { describe, it, expect } from 'vitest';
import {
  calculatePourSchedule,
  formatTime,
  getCurrentStage,
  getNextStage,
  type PourOverInputs,
} from '@/lib/calculations/coffee/pour-over-timer';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Pour Over Timer Calculator', () => {
  describe('calculatePourSchedule', () => {
    describe('4:6 method', () => {
      it('should calculate 5 pours for 4:6 method', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(5);
        expect(result.methodName).toBe('4:6-metoden (Tetsu Kasuya)');
      });

      it('should divide water into 40% (first 2 pours) and 60% (last 3 pours)', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        // First 2 pours should total 40% (120g)
        const first2Pours = result.stages[0].waterAmount + result.stages[1].waterAmount;
        expect(first2Pours).toBeCloseTo(120, 1);

        // Last 3 pours should total 60% (180g)
        const last3Pours = result.stages[2].waterAmount + result.stages[3].waterAmount + result.stages[4].waterAmount;
        expect(last3Pours).toBeCloseTo(180, 1);
      });

      it('should have correct timing for each stage', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        // Stage 1: 0:00 - 0:45
        expect(result.stages[0].startTime).toBe(0);
        expect(result.stages[0].endTime).toBe(45);

        // Stage 2: 0:45 - 1:30
        expect(result.stages[1].startTime).toBe(45);
        expect(result.stages[1].endTime).toBe(90);

        // Stage 3: 1:30 - 2:15
        expect(result.stages[2].startTime).toBe(90);
        expect(result.stages[2].endTime).toBe(135);

        // Stage 4: 2:15 - 3:00
        expect(result.stages[3].startTime).toBe(135);
        expect(result.stages[3].endTime).toBe(180);

        // Stage 5: 3:00 - 3:45
        expect(result.stages[4].startTime).toBe(180);
        expect(result.stages[4].endTime).toBe(225);
      });

      it('should calculate total time correctly', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        expect(result.totalTime).toBe(225); // 3:45
      });

      it('should include brewing instructions', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        expect(result.instructions).toContain('Skyll filteret med varmt vann og hell vannet ut');
        expect(result.instructions.length).toBeGreaterThan(0);
      });
    });

    describe('custom method', () => {
      it('should divide water evenly across specified number of pours', () => {
        const inputs: PourOverInputs = {
          totalWater: 400,
          method: 'custom',
          numberOfPours: 4,
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(4);
        
        // Each pour should be 100g (400g / 4)
        result.stages.forEach(stage => {
          expect(stage.waterAmount).toBeCloseTo(100, 1);
        });
      });

      it('should handle odd divisions with rounding', () => {
        const inputs: PourOverInputs = {
          totalWater: 350,
          method: 'custom',
          numberOfPours: 3,
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(3);
        
        // Each pour should be approximately 116.7g
        result.stages.forEach(stage => {
          expect(stage.waterAmount).toBeCloseTo(116.7, 1);
        });
      });

      it('should have correct timing for custom pours', () => {
        const inputs: PourOverInputs = {
          totalWater: 400,
          method: 'custom',
          numberOfPours: 3,
        };

        const result = calculatePourSchedule(inputs);

        // Stage 1: 0:00 - 0:45
        expect(result.stages[0].startTime).toBe(0);
        expect(result.stages[0].endTime).toBe(45);

        // Stage 2: 0:45 - 1:30
        expect(result.stages[1].startTime).toBe(45);
        expect(result.stages[1].endTime).toBe(90);

        // Stage 3: 1:30 - 2:15
        expect(result.stages[2].startTime).toBe(90);
        expect(result.stages[2].endTime).toBe(135);
      });

      it('should require numberOfPours for custom method', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: 'custom',
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Du må oppgi antall helleomganger');
      });
    });

    describe('input validation', () => {
      it('should reject zero or negative total water', () => {
        const inputs: PourOverInputs = {
          totalWater: 0,
          method: '4:6',
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Total vannmengde må være et positivt tall');
      });

      it('should reject total water below minimum', () => {
        const inputs: PourOverInputs = {
          totalWater: 50,
          method: '4:6',
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Total vannmengde må være mellom 100 g og 1000 g');
      });

      it('should reject total water above maximum', () => {
        const inputs: PourOverInputs = {
          totalWater: 1500,
          method: '4:6',
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Total vannmengde må være mellom 100 g og 1000 g');
      });

      it('should reject number of pours less than 1', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: 'custom',
          numberOfPours: 0,
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Antall helleomganger må være minst 1');
      });

      it('should reject number of pours above maximum', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: 'custom',
          numberOfPours: 15,
        };

        expect(() => calculatePourSchedule(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculatePourSchedule(inputs)).toThrow('Antall helleomganger må være mellom 1 og 10');
      });
    });

    describe('edge cases', () => {
      it('should handle minimum water amount (100g)', () => {
        const inputs: PourOverInputs = {
          totalWater: 100,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(5);
        
        // First 2 pours: 40g total (20g each)
        expect(result.stages[0].waterAmount).toBeCloseTo(20, 1);
        expect(result.stages[1].waterAmount).toBeCloseTo(20, 1);
        
        // Last 3 pours: 60g total (20g each)
        expect(result.stages[2].waterAmount).toBeCloseTo(20, 1);
        expect(result.stages[3].waterAmount).toBeCloseTo(20, 1);
        expect(result.stages[4].waterAmount).toBeCloseTo(20, 1);
      });

      it('should handle maximum water amount (1000g)', () => {
        const inputs: PourOverInputs = {
          totalWater: 1000,
          method: '4:6',
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(5);
        
        // First 2 pours: 400g total (200g each)
        expect(result.stages[0].waterAmount).toBeCloseTo(200, 1);
        expect(result.stages[1].waterAmount).toBeCloseTo(200, 1);
        
        // Last 3 pours: 600g total (200g each)
        expect(result.stages[2].waterAmount).toBeCloseTo(200, 1);
        expect(result.stages[3].waterAmount).toBeCloseTo(200, 1);
        expect(result.stages[4].waterAmount).toBeCloseTo(200, 1);
      });

      it('should handle single pour custom method', () => {
        const inputs: PourOverInputs = {
          totalWater: 300,
          method: 'custom',
          numberOfPours: 1,
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(1);
        expect(result.stages[0].waterAmount).toBeCloseTo(300, 1);
      });

      it('should handle maximum pours custom method', () => {
        const inputs: PourOverInputs = {
          totalWater: 500,
          method: 'custom',
          numberOfPours: 10,
        };

        const result = calculatePourSchedule(inputs);

        expect(result.stages).toHaveLength(10);
        
        // Each pour should be 50g
        result.stages.forEach(stage => {
          expect(stage.waterAmount).toBeCloseTo(50, 1);
        });
      });
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(45)).toBe('0:45');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(135)).toBe('2:15');
      expect(formatTime(225)).toBe('3:45');
    });

    it('should pad single digit seconds with zero', () => {
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(65)).toBe('1:05');
    });

    it('should handle large times', () => {
      expect(formatTime(600)).toBe('10:00');
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  describe('getCurrentStage', () => {
    const stages = calculatePourSchedule({
      totalWater: 300,
      method: '4:6',
    }).stages;

    it('should return first stage at start', () => {
      const current = getCurrentStage(stages, 0);
      expect(current?.stageNumber).toBe(1);
    });

    it('should return correct stage during pour', () => {
      const current = getCurrentStage(stages, 100);
      expect(current?.stageNumber).toBe(3);
    });

    it('should return undefined after all stages complete', () => {
      const current = getCurrentStage(stages, 300);
      expect(current).toBeUndefined();
    });

    it('should return correct stage at stage boundaries', () => {
      // At 45 seconds (end of stage 1, start of stage 2)
      const current = getCurrentStage(stages, 45);
      expect(current?.stageNumber).toBe(2);
    });
  });

  describe('getNextStage', () => {
    const stages = calculatePourSchedule({
      totalWater: 300,
      method: '4:6',
    }).stages;

    it('should return second stage at start', () => {
      const next = getNextStage(stages, 0);
      expect(next?.stageNumber).toBe(2);
    });

    it('should return correct next stage during pour', () => {
      const next = getNextStage(stages, 100);
      expect(next?.stageNumber).toBe(4);
    });

    it('should return undefined when no more stages', () => {
      const next = getNextStage(stages, 300);
      expect(next).toBeUndefined();
    });
  });
});
