import { describe, it, expect } from 'vitest';
import { parseNumberList, splitNumberTokens } from '@/lib/calculations/stats/statistics';
import { parsePairedData } from '@/lib/calculations/stats/correlation-calculator';
import { calculateSoundSpeed } from '@/lib/calculations/physics/sound-speed-calculator';
import { MATERIAL_DENSITIES, MATERIAL_NAMES_NO, materialName, calculateDensity } from '@/lib/calculations/physics/density-calculator';
import { toolRegistry } from '@/lib/constants/tool-registry';

describe('norsk tallformat i statistikk', () => {
  it('leser komma som skilletegn når det ikke ser ut som desimalkomma', () => {
    expect(parseNumberList('1, 2, 3')).toEqual([1, 2, 3]);
    expect(parseNumberList('1,2,3')).toEqual([1, 2, 3]);
    expect(parseNumberList('10 12 23')).toEqual([10, 12, 23]);
  });

  it('leser desimalkomma med semikolon, mellomrom eller linjeskift', () => {
    expect(parseNumberList('1,5; 2,5; 3')).toEqual([1.5, 2.5, 3]);
    expect(parseNumberList('1,5 2,5 3')).toEqual([1.5, 2.5, 3]);
    expect(parseNumberList('1,5\n2,5')).toEqual([1.5, 2.5]);
  });

  it('leser punktum som desimaltegn også', () => {
    expect(parseNumberList('1.5 2.5')).toEqual([1.5, 2.5]);
    expect(splitNumberTokens('1.5; 2.5')).toEqual(['1.5', '2.5']);
  });

  it('kaster feil for ugyldige tall', () => {
    expect(() => parseNumberList('1; abc')).toThrow();
  });

  it('leser datapar med desimalkomma', () => {
    const { xValues, yValues } = parsePairedData('1,5; 2,5\n2,5; 4,5\n3 5');
    expect(xValues).toEqual([1.5, 2.5, 3]);
    expect(yValues).toEqual([2.5, 4.5, 5]);
    const old = parsePairedData('1, 2\n2, 4');
    expect(old.xValues).toEqual([1, 2]);
    expect(old.yValues).toEqual([2, 4]);
  });
});

describe('fysikk med metriske enheter', () => {
  it('lydhastighet har ingen imperiale felt', () => {
    const r = calculateSoundSpeed({ temperature: 20 }) as unknown as Record<string, unknown>;
    expect(r.speedMph).toBeUndefined();
    expect(r.speedFps).toBeUndefined();
    expect(r.timePerMile).toBeUndefined();
    expect(r.timePer100m).toBeCloseTo(100 / (r.speedMps as number), 6);
    expect(r.formattedSpeed).toMatch(/^343,\d\d m\/s$/);
  });

  it('alle materialer har norsk navn', () => {
    for (const key of Object.keys(MATERIAL_DENSITIES)) {
      expect(MATERIAL_NAMES_NO[key], key).toBeTruthy();
    }
    expect(materialName('water')).toBe('Vann');
  });

  it('formaterer tetthet med komma', () => {
    const r = calculateDensity({ mass: 7.85, volume: 0.001 });
    expect(r.formattedDensity).toBe('7 850,0 kg/m³');
  });

  it('har riktig adresse til tilfeldige tall i registeret', () => {
    expect(toolRegistry['stats-random-number-generator'].path).toBe('/calculators/stats/random-number-generator');
  });
});
