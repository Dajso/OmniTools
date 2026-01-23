/**
 * Unit tests for Grind Size Converter
 * 
 * Tests specific examples, edge cases, and error conditions
 * for the grind size conversion logic.
 */

import { describe, it, expect } from 'vitest';
import {
  convertGrindSize,
  getBrewMethodSettings,
  type GrindSizeInputs,
} from '@/lib/calculations/coffee/grind-size-converter';
import {
  getGrinderConfig,
  getGrinderList,
  isValidSetting,
  getGrindSizeForSetting,
  getGrindSizeDescription,
} from '@/lib/calculations/coffee/grinder-database';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

describe('Grind Size Converter', () => {
  describe('convertGrindSize', () => {
    it('should convert Comandante to Baratza Encore', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeGreaterThan(0);
      expect(result.targetSetting).toBeLessThanOrEqual(40);
      expect(result.grindDescription).toBeDefined();
      expect(result.confidence).toBeDefined();
    });

    it('should convert Timemore C2 to Comandante', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'timemore-c2',
        sourceSetting: 16,
        targetGrinder: 'comandante',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeGreaterThan(0);
      expect(result.targetSetting).toBeLessThanOrEqual(40);
      expect(result.sourceGrindSize).toBeDefined();
      expect(result.targetGrindSize).toBeDefined();
    });

    it('should convert Baratza Encore to Niche Zero', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'baratza-encore',
        sourceSetting: 18,
        targetGrinder: 'niche-zero',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeGreaterThan(0);
      expect(result.targetSetting).toBeLessThanOrEqual(100);
      expect(result.notes).toBeDefined();
      expect(result.notes.length).toBeGreaterThan(0);
    });

    it('should provide grind description', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.grindDescription).toBeDefined();
      expect(result.grindDescription.length).toBeGreaterThan(0);
    });

    it('should provide confidence level', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(['high', 'medium', 'low']).toContain(result.confidence);
    });

    it('should provide conversion notes', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.notes).toBeDefined();
      expect(Array.isArray(result.notes)).toBe(true);
      expect(result.notes.length).toBeGreaterThan(0);
    });

    it('should handle espresso range conversion', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 10,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.sourceGrindSize).toMatch(/fine|extra-fine/);
    });

    it('should handle pour over range conversion', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.sourceGrindSize).toMatch(/medium-fine|medium/);
    });

    it('should handle French press range conversion', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 30,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.sourceGrindSize).toMatch(/coarse|medium-coarse/);
    });
  });

  describe('Input Validation', () => {
    describe('Source Grinder Validation', () => {
      it('should throw error for non-existent source grinder', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'non-existent-grinder',
          sourceSetting: 20,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).toThrow(CoffeeCalculationError);
        expect(() => convertGrindSize(inputs)).toThrow('Source grinder not found');
      });

      it('should accept valid source grinder', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 20,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).not.toThrow();
      });
    });

    describe('Target Grinder Validation', () => {
      it('should throw error for non-existent target grinder', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 20,
          targetGrinder: 'non-existent-grinder',
        };

        expect(() => convertGrindSize(inputs)).toThrow(CoffeeCalculationError);
        expect(() => convertGrindSize(inputs)).toThrow('Target grinder not found');
      });

      it('should accept valid target grinder', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 20,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).not.toThrow();
      });
    });

    describe('Source Setting Validation', () => {
      it('should throw error for setting below minimum', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: -5,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).toThrow(CoffeeCalculationError);
        expect(() => convertGrindSize(inputs)).toThrow('outside valid range');
      });

      it('should throw error for setting above maximum', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 50,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).toThrow(CoffeeCalculationError);
        expect(() => convertGrindSize(inputs)).toThrow('outside valid range');
      });

      it('should accept setting at minimum boundary', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 0,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).not.toThrow();
      });

      it('should accept setting at maximum boundary', () => {
        const inputs: GrindSizeInputs = {
          sourceGrinder: 'comandante',
          sourceSetting: 40,
          targetGrinder: 'baratza-encore',
        };

        expect(() => convertGrindSize(inputs)).not.toThrow();
      });
    });
  });

  describe('Grinder Database Functions', () => {
    describe('getGrinderConfig', () => {
      it('should return config for valid grinder', () => {
        const config = getGrinderConfig('comandante');

        expect(config).toBeDefined();
        expect(config?.name).toBe('Comandante C40');
        expect(config?.range).toEqual([0, 40]);
      });

      it('should return undefined for invalid grinder', () => {
        const config = getGrinderConfig('non-existent');

        expect(config).toBeUndefined();
      });

      it('should include brew method ranges', () => {
        const config = getGrinderConfig('comandante');

        expect(config?.espresso).toBeDefined();
        expect(config?.pourOver).toBeDefined();
        expect(config?.frenchPress).toBeDefined();
      });
    });

    describe('getGrinderList', () => {
      it('should return array of grinders', () => {
        const list = getGrinderList();

        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThan(0);
      });

      it('should include id and name for each grinder', () => {
        const list = getGrinderList();

        list.forEach(grinder => {
          expect(grinder.id).toBeDefined();
          expect(grinder.name).toBeDefined();
          expect(typeof grinder.id).toBe('string');
          expect(typeof grinder.name).toBe('string');
        });
      });

      it('should include popular grinders', () => {
        const list = getGrinderList();
        const ids = list.map(g => g.id);

        expect(ids).toContain('comandante');
        expect(ids).toContain('baratza-encore');
        expect(ids).toContain('timemore-c2');
      });
    });

    describe('isValidSetting', () => {
      it('should return true for valid setting', () => {
        expect(isValidSetting('comandante', 20)).toBe(true);
      });

      it('should return false for setting below minimum', () => {
        expect(isValidSetting('comandante', -5)).toBe(false);
      });

      it('should return false for setting above maximum', () => {
        expect(isValidSetting('comandante', 50)).toBe(false);
      });

      it('should return true for setting at minimum boundary', () => {
        expect(isValidSetting('comandante', 0)).toBe(true);
      });

      it('should return true for setting at maximum boundary', () => {
        expect(isValidSetting('comandante', 40)).toBe(true);
      });

      it('should return false for non-existent grinder', () => {
        expect(isValidSetting('non-existent', 20)).toBe(false);
      });
    });

    describe('getGrindSizeForSetting', () => {
      it('should return grind size for valid setting', () => {
        const grindSize = getGrindSizeForSetting('comandante', 20);

        expect(grindSize).toBeDefined();
        expect(['extra-fine', 'fine', 'medium-fine', 'medium', 'medium-coarse', 'coarse', 'extra-coarse']).toContain(grindSize);
      });

      it('should return fine grind for espresso range', () => {
        const grindSize = getGrindSizeForSetting('comandante', 10);

        expect(['extra-fine', 'fine']).toContain(grindSize);
      });

      it('should return coarse grind for French press range', () => {
        const grindSize = getGrindSizeForSetting('comandante', 30);

        expect(['coarse', 'medium-coarse', 'extra-coarse']).toContain(grindSize);
      });

      it('should throw error for non-existent grinder', () => {
        expect(() => getGrindSizeForSetting('non-existent', 20)).toThrow();
      });
    });

    describe('getGrindSizeDescription', () => {
      it('should return description for extra-fine', () => {
        const description = getGrindSizeDescription('extra-fine');

        expect(description).toBeDefined();
        expect(description.length).toBeGreaterThan(0);
        expect(description.toLowerCase()).toContain('turkish');
      });

      it('should return description for fine', () => {
        const description = getGrindSizeDescription('fine');

        expect(description).toBeDefined();
        expect(description.toLowerCase()).toContain('espresso');
      });

      it('should return description for medium-fine', () => {
        const description = getGrindSizeDescription('medium-fine');

        expect(description).toBeDefined();
        expect(description.toLowerCase()).toContain('pour over');
      });

      it('should return description for coarse', () => {
        const description = getGrindSizeDescription('coarse');

        expect(description).toBeDefined();
        expect(description.toLowerCase()).toContain('french press');
      });
    });
  });

  describe('getBrewMethodSettings', () => {
    it('should return espresso settings for valid grinder', () => {
      const settings = getBrewMethodSettings('comandante', 'espresso');

      expect(settings).toBeDefined();
      expect(settings?.min).toBeDefined();
      expect(settings?.max).toBeDefined();
      expect(settings!.min).toBeLessThan(settings!.max);
    });

    it('should return pour over settings for valid grinder', () => {
      const settings = getBrewMethodSettings('comandante', 'pourOver');

      expect(settings).toBeDefined();
      expect(settings?.min).toBeDefined();
      expect(settings?.max).toBeDefined();
    });

    it('should return French press settings for valid grinder', () => {
      const settings = getBrewMethodSettings('comandante', 'frenchPress');

      expect(settings).toBeDefined();
      expect(settings?.min).toBeDefined();
      expect(settings?.max).toBeDefined();
    });

    it('should return undefined for non-existent grinder', () => {
      const settings = getBrewMethodSettings('non-existent', 'espresso');

      expect(settings).toBeUndefined();
    });

    it('should return cold brew settings if available', () => {
      const settings = getBrewMethodSettings('comandante', 'coldBrew');

      expect(settings).toBeDefined();
    });

    it('should return AeroPress settings if available', () => {
      const settings = getBrewMethodSettings('comandante', 'aeroPress');

      expect(settings).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle conversion between same grinder', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'comandante',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeCloseTo(20, 1);
    });

    it('should handle minimum setting conversion', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 0,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeGreaterThanOrEqual(1);
    });

    it('should handle maximum setting conversion', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 40,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeLessThanOrEqual(40);
    });

    it('should handle decimal settings', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20.5,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeDefined();
    });

    it('should handle grinders with very different ranges', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'hario-mini-mill',
        sourceSetting: 6,
        targetGrinder: 'niche-zero',
      };

      const result = convertGrindSize(inputs);

      expect(result.targetSetting).toBeGreaterThan(0);
      expect(result.targetSetting).toBeLessThanOrEqual(100);
      expect(result.confidence).toBe('low');
    });
  });

  describe('Confidence Levels', () => {
    it('should provide high confidence for similar grinders', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'timemore-c2',
        sourceSetting: 16,
        targetGrinder: 'timemore-c3',
      };

      const result = convertGrindSize(inputs);

      expect(['high', 'medium']).toContain(result.confidence);
    });

    it('should provide lower confidence for very different grinders', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'hario-mini-mill',
        sourceSetting: 6,
        targetGrinder: 'niche-zero',
      };

      const result = convertGrindSize(inputs);

      expect(result.confidence).toBe('low');
    });

    it('should provide confidence notes', () => {
      const inputs: GrindSizeInputs = {
        sourceGrinder: 'comandante',
        sourceSetting: 20,
        targetGrinder: 'baratza-encore',
      };

      const result = convertGrindSize(inputs);

      const confidenceNote = result.notes.find(note => 
        note.toLowerCase().includes('confidence')
      );

      expect(confidenceNote).toBeDefined();
    });
  });
});
