import { describe, it, expect } from 'vitest';
import { calculateBrine } from '@/lib/calculations/baking/brine';
import { calculateAlcoholDilution } from '@/lib/calculations/baking/alcohol-dilution';
import { calculateEggConversion } from '@/lib/calculations/baking/egg-size-converter';
import { calculateYeastConversion } from '@/lib/calculations/baking/yeast-conversion';
import { calculateUnitCost } from '@/lib/calculations/baking/unit-cost-per-serving';

describe('Baking: norsk/metrisk', () => {
  it('lake: 5 % salt i 1 liter gir ca. 52 g', () => {
    const r = calculateBrine({ waterLiters: 1, saltPercent: 5 });
    expect(r.waterMl).toBe(1000);
    expect(r.saltG).toBeGreaterThan(50);
    expect(r.saltG).toBeLessThan(54);
  });

  it('lake avviser ugyldig input på norsk', () => {
    expect(() => calculateBrine({ waterLiters: 0, saltPercent: 5 })).toThrow(/Vannmengden/);
  });

  it('fortynning: 750 ml 75 % til 40 % gir 656,3 ml vann', () => {
    const r = calculateAlcoholDilution({ volumeMl: 750, currentABV: 75, targetABV: 40 });
    expect(r.waterToAddMl).toBeCloseTo(656.3, 0);
    expect(r.finalVolumeMl).toBeCloseTo(1406.3, 0);
    expect('waterToAddOz' in r).toBe(false);
  });

  it('eggstørrelse: samme størrelse gir samme antall', () => {
    const r = calculateEggConversion({ recipeCount: 3, recipeSize: 'large', availableSize: 'large' });
    expect(r.eggsNeeded).toBeCloseTo(3, 5);
  });

  it('eggstørrelse: flere M enn L trengs', () => {
    const r = calculateEggConversion({ recipeCount: 4, recipeSize: 'large', availableSize: 'medium' });
    expect(r.eggsNeeded).toBeGreaterThan(4);
  });

  it('gjær: fersk til tørr', () => {
    const r = calculateYeastConversion({ amount: 50, fromType: 'fresh', toType: 'active-dry' });
    expect(r.result).toBeCloseTo(20, 0);
  });

  it('kostnad per porsjon', () => {
    const r = calculateUnitCost({ servings: 4, ingredients: [{ name: 'Mel', cost: 10 }, { name: 'Smør', cost: 30 }] } as never);
    expect(r.costPerServing).toBeCloseTo(10, 5);
  });
});
