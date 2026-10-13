import { describe, it, expect } from 'vitest';
import { calculateConcreteSlab, calculateRebar, estimateConcreteTrucks } from '@/lib/calculations/construction/concrete-slab-calculator';
import { calculateRoofFraming, calculateNumberOfRafters } from '@/lib/calculations/construction/roof-framing-calculator';
import { calculateBalusterSpacing } from '@/lib/calculations/construction/baluster-calculator';

describe('Betongplate (metrisk)', () => {
  it('regner volum, svinn og sekker', () => {
    const r = calculateConcreteSlab({ lengthM: 6, widthM: 4, thicknessCm: 10, wastePercent: 10 });
    expect(r.areaM2).toBe(24);
    expect(r.volumeM3).toBe(2.4);
    expect(r.volumeWithWasteM3).toBe(2.64);
    expect(r.sacks).toBe(Math.ceil((2.64 * 2300) / 25));
    expect(r.trucks.loads).toBe(1);
  });

  it('gir flere lass når volumet er stort', () => {
    expect(estimateConcreteTrucks(17).loads).toBe(3);
  });

  it('regner armering og pukk', () => {
    const r = calculateConcreteSlab({ lengthM: 4, widthM: 3, thicknessCm: 10, rebarSpacingCm: 20, subbaseCm: 15 });
    expect(r.rebar?.totalBars).toBe(calculateRebar(4, 3, 20).totalBars);
    expect(r.subbaseM3).toBe(1.8);
  });

  it('avviser ugyldige mål på norsk', () => {
    expect(() => calculateConcreteSlab({ lengthM: 0, widthM: 4, thicknessCm: 10 })).toThrow(/større enn 0/);
  });
});

describe('Taksperrer (grader og meter)', () => {
  it('regner sperrelengde og møneshøyde for 8 m og 30°', () => {
    const r = calculateRoofFraming({ spanM: 8, pitchDeg: 30, rafterSpacingMm: 600, overhangCm: 0 });
    expect(r.rafterLengthM).toBeCloseTo(4.619, 3);
    expect(r.ridgeHeightM).toBeCloseTo(2.309, 3);
    expect(r.slopePercent).toBeCloseTo(57.7, 1);
  });

  it('45° gir 100 % stigning', () => {
    expect(calculateRoofFraming({ spanM: 6, pitchDeg: 45, rafterSpacingMm: 600, overhangCm: 0 }).slopePercent).toBe(100);
  });

  it('teller sperrer og takflate', () => {
    expect(calculateNumberOfRafters(10, 600)).toBe(18);
    const r = calculateRoofFraming({ spanM: 8, pitchDeg: 27, rafterSpacingMm: 600, overhangCm: 40, buildingLengthM: 10 });
    expect(r.totalRafters).toBe(36);
    expect(r.roofAreaM2).toBeGreaterThan(90);
  });

  it('avviser for bratt tak', () => {
    expect(() => calculateRoofFraming({ spanM: 8, pitchDeg: 85, rafterSpacingMm: 600, overhangCm: 0 })).toThrow();
  });
});

describe('Spiler i rekkverk (TEK17, 100 mm)', () => {
  it('holder mellomrommet under 100 mm', () => {
    for (const span of [600, 900, 1200, 1800, 3000]) {
      const r = calculateBalusterSpacing({ totalWidth: span, balusterWidth: 40, unit: 'mm' });
      expect(r.spacing).toBeLessThanOrEqual(100.0001);
      expect(r.isCodeCompliant).toBe(true);
    }
  });
});
