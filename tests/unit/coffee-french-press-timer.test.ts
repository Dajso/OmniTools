/**
 * Unit tests for French Press Timer
 * 
 * Tests calculation logic, validation, and timeline generation.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFrenchPressTimeline,
  formatTime,
  getNextEvent,
  getLastCompletedEvent,
  type FrenchPressInputs,
} from '@/lib/calculations/coffee/french-press-timer';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('French Press Timer', () => {
  describe('calculateFrenchPressTimeline', () => {
    it('should calculate brew ratio correctly', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBeCloseTo(16.67, 1);
      expect(result.brewRatioDisplay).toBe('1:16,7');
    });

    it('should generate timeline with bloom, stir, and press events', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.timeline).toHaveLength(3);
      expect(result.timeline[0].type).toBe('bloom');
      expect(result.timeline[0].time).toBe(30);
      expect(result.timeline[1].type).toBe('stir');
      expect(result.timeline[1].time).toBe(120); // Halfway point of 4 minutes
      expect(result.timeline[2].type).toBe('press');
      expect(result.timeline[2].time).toBe(240); // 4 minutes
    });

    it('should calculate total time in seconds', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.totalTime).toBe(240); // 4 minutes = 240 seconds
    });

    it('should provide strength estimate for strong ratio', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 40,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBeCloseTo(12.5, 1);
      expect(result.strengthEstimate).toContain('Sterk');
    });

    it('should provide strength estimate for balanced ratio', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBeCloseTo(16.67, 1);
      expect(result.strengthEstimate).toContain('Balansert');
    });

    it('should provide strength estimate for mild ratio', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 25,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBe(20);
      expect(result.strengthEstimate).toContain('Mild');
    });

    it('should include brewing instructions', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.instructions).toBeDefined();
      expect(result.instructions.length).toBeGreaterThan(0);
      expect(result.instructions.some(i => i.toLowerCase().includes('forvarm'))).toBe(true);
      expect(result.instructions.some(i => i.toLowerCase().includes('press'))).toBe(true);
    });

    it('should calculate stir time at halfway point', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 6,
      };

      const result = calculateFrenchPressTimeline(inputs);

      const stirEvent = result.timeline.find(e => e.type === 'stir');
      expect(stirEvent?.time).toBe(180); // 3 minutes (halfway of 6 minutes)
    });
  });

  describe('Input Validation', () => {
    it('should reject zero coffee dose', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 0,
        waterAmount: 500,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Kaffemengden må være et positivt tall');
    });

    it('should reject negative coffee dose', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: -10,
        waterAmount: 500,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Kaffemengden må være et positivt tall');
    });

    it('should reject coffee dose below minimum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 5,
        waterAmount: 500,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Kaffemengden må være mellom 10 g og 100 g');
    });

    it('should reject coffee dose above maximum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 150,
        waterAmount: 500,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Kaffemengden må være mellom 10 g og 100 g');
    });

    it('should reject zero water amount', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 0,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Vannmengden må være et positivt tall');
    });

    it('should reject negative water amount', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: -500,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Vannmengden må være et positivt tall');
    });

    it('should reject water amount below minimum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 50,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Vannmengden må være mellom 100 g og 2000 g');
    });

    it('should reject water amount above maximum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 3000,
        steepTime: 4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Vannmengden må være mellom 100 g og 2000 g');
    });

    it('should reject zero steep time', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 0,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Trekketiden må være et positivt tall');
    });

    it('should reject negative steep time', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: -4,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Trekketiden må være et positivt tall');
    });

    it('should reject steep time below minimum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 1,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Trekketiden må være mellom 2 og 10 minutter');
    });

    it('should reject steep time above maximum', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 30,
        waterAmount: 500,
        steepTime: 15,
      };

      expect(() => calculateFrenchPressTimeline(inputs)).toThrow(CoffeeCalculationError);
      expect(() => calculateFrenchPressTimeline(inputs)).toThrow('Trekketiden må være mellom 2 og 10 minutter');
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid inputs', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 10,
        waterAmount: 100,
        steepTime: 2,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBe(10);
      expect(result.totalTime).toBe(120); // 2 minutes
      expect(result.timeline).toHaveLength(3);
    });

    it('should handle maximum valid inputs', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 100,
        waterAmount: 2000,
        steepTime: 10,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBe(20);
      expect(result.totalTime).toBe(600); // 10 minutes
      expect(result.timeline).toHaveLength(3);
    });

    it('should handle very strong ratio', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 50,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBe(10);
      expect(result.strengthEstimate).toContain('Svært sterk');
    });

    it('should handle very mild ratio', () => {
      const inputs: FrenchPressInputs = {
        coffeeDose: 20,
        waterAmount: 500,
        steepTime: 4,
      };

      const result = calculateFrenchPressTimeline(inputs);

      expect(result.brewRatio).toBe(25);
      expect(result.strengthEstimate).toContain('Svært mild');
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(240)).toBe('4:00');
      expect(formatTime(125)).toBe('2:05');
    });
  });

  describe('getNextEvent', () => {
    const timeline = [
      { time: 30, action: 'Bloom', type: 'bloom' as const },
      { time: 120, action: 'Stir', type: 'stir' as const },
      { time: 240, action: 'Press', type: 'press' as const },
    ];

    it('should return first event when timer just started', () => {
      const next = getNextEvent(timeline, 0);
      expect(next?.type).toBe('bloom');
      expect(next?.time).toBe(30);
    });

    it('should return next event after bloom', () => {
      const next = getNextEvent(timeline, 30);
      expect(next?.type).toBe('stir');
      expect(next?.time).toBe(120);
    });

    it('should return press event after stir', () => {
      const next = getNextEvent(timeline, 120);
      expect(next?.type).toBe('press');
      expect(next?.time).toBe(240);
    });

    it('should return undefined when all events complete', () => {
      const next = getNextEvent(timeline, 240);
      expect(next).toBeUndefined();
    });
  });

  describe('getLastCompletedEvent', () => {
    const timeline = [
      { time: 30, action: 'Bloom', type: 'bloom' as const },
      { time: 120, action: 'Stir', type: 'stir' as const },
      { time: 240, action: 'Press', type: 'press' as const },
    ];

    it('should return undefined when no events completed', () => {
      const last = getLastCompletedEvent(timeline, 0);
      expect(last).toBeUndefined();
    });

    it('should return bloom event after 30 seconds', () => {
      const last = getLastCompletedEvent(timeline, 30);
      expect(last?.type).toBe('bloom');
    });

    it('should return stir event after 120 seconds', () => {
      const last = getLastCompletedEvent(timeline, 120);
      expect(last?.type).toBe('stir');
    });

    it('should return press event after 240 seconds', () => {
      const last = getLastCompletedEvent(timeline, 240);
      expect(last?.type).toBe('press');
    });

    it('should return most recent event when multiple completed', () => {
      const last = getLastCompletedEvent(timeline, 150);
      expect(last?.type).toBe('stir');
    });
  });
});
