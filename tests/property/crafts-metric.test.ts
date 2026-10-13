import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateCircleSkirtMetric,
  calculateCrochetHatMetric,
  calculateEmbroideryFlossMetric,
  calculateFabricMetersMetric,
  calculateQuiltBindingMetric,
  calculateSocksMetric,
  euShoeSizeFromFootLength,
  sockSizeGroupNo,
  usNeedleToMm,
  yarnWeightDetailsNo,
  STANDARD_HEAD_SIZES_CM,
  cmToIn,
  inToCm,
  ceilToStep,
  type SkirtType,
} from '@/lib/calculations/crafts';

describe('håndarbeid – metriske beregninger', () => {
  it('cm og tommer er hverandres omvendte', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 1000, noNaN: true }), (cm) => {
        expect(inToCm(cmToIn(cm))).toBeCloseTo(cm, 8);
      })
    );
  });

  it('ceilToStep runder opp til nærmeste 0,1 uten flyttallsstøy', () => {
    expect(ceilToStep(1.83, 0.1)).toBeCloseTo(1.9, 10);
    expect(ceilToStep(2.0, 0.1)).toBeCloseTo(2.0, 10);
    expect(ceilToStep(0.30000000000000004, 0.1)).toBeCloseTo(0.3, 10);
  });

  describe('sirkelskjørt', () => {
    it('hel sirkel: radius = midje ÷ 2π og ytre radius = radius + lengde + fald', () => {
      const r = calculateCircleSkirtMetric({
        waistCm: 70,
        lengthCm: 60,
        skirtType: 'full',
        seamAllowanceCm: 1.5,
        hemAllowanceCm: 2.5,
      });
      const radius = 70 / (2 * Math.PI);
      expect(r.waistRadiusCm).toBeCloseTo(radius, 0);
      expect(r.innerCutRadiusCm).toBeCloseTo(radius - 1.5, 0);
      expect(r.outerCutRadiusCm).toBeCloseTo(radius + 60 + 2.5, 0);
    });

    it('hel sirkel trenger lengde lik diameter på bredt nok stoff, og skjøter på smalt', () => {
      const r = calculateCircleSkirtMetric({
        waistCm: 70,
        lengthCm: 60,
        skirtType: 'full',
        seamAllowanceCm: 1.5,
        hemAllowanceCm: 2.5,
      });
      const diameter = 2 * r.outerCutRadiusCm; // ca. 147 cm
      const wide = r.fabric.find((f) => f.widthCm === 150)!;
      const narrow = r.fabric.find((f) => f.widthCm === 110)!;
      expect(wide.needsSeams).toBe(false);
      expect(wide.meters!).toBeGreaterThanOrEqual(diameter / 100 - 1e-6);
      expect(narrow.needsSeams).toBe(true);
      expect(narrow.meters!).toBeGreaterThan(wide.meters!);
    });

    it('stoffbehovet er aldri mindre enn arealet av stykkene', () => {
      const types: SkirtType[] = ['full', 'three-quarter', 'half', 'quarter'];
      fc.assert(
        fc.property(
          fc.constantFrom(...types),
          fc.integer({ min: 50, max: 120 }),
          fc.integer({ min: 30, max: 90 }),
          (skirtType, waistCm, lengthCm) => {
            const r = calculateCircleSkirtMetric({
              waistCm,
              lengthCm,
              skirtType,
              seamAllowanceCm: 1,
              hemAllowanceCm: 2,
            });
            const frac = { full: 1, 'three-quarter': 0.75, half: 0.5, quarter: 0.25 }[skirtType];
            const area = frac * Math.PI * r.outerCutRadiusCm ** 2; // cm²
            for (const f of r.fabric) {
              if (f.meters !== null) {
                expect(f.meters * 100 * f.widthCm).toBeGreaterThanOrEqual(area * 0.99);
              }
            }
          }
        )
      );
    });
  });

  describe('heklet lue', () => {
    it('omkrets med 10 % negativ ease og diameter = omkrets ÷ π', () => {
      const r = calculateCrochetHatMetric({ headCm: 56, style: 'beanie', negativeEase: 10 });
      expect(r.hatCircumferenceCm).toBeCloseTo(50.4, 1);
      expect(r.crownDiameterCm).toBeCloseTo(50.4 / Math.PI, 0);
    });

    it('standardstørrelsene i cm er omregnet fra tommer', () => {
      expect(STANDARD_HEAD_SIZES_CM['adult-medium'].circumference).toBe(57);
      expect(STANDARD_HEAD_SIZES_CM['newborn'].circumference).toBe(36);
    });
  });

  describe('brodergarn', () => {
    it('bruker 8 m per dokke og minst én dokke', () => {
      const r = calculateEmbroideryFlossMetric({
        stitchCount: 1000,
        fabricCount: 14,
        stitchType: 'cross-stitch',
        strandsUsed: 2,
        overTwo: false,
      });
      // 1000 sting × 1 tomme = 25,4 m tråd, med 15 % buffer = 29,2 m → 4 dokker
      expect(r.threadLengthMeters).toBeCloseTo(25.4, 1);
      expect(r.skeinsNeeded).toBe(4);
    });
  });

  describe('stoffbehov', () => {
    it('gir meter som er rundet opp til 10 cm, og bredere stoff gir mindre', () => {
      const base = {
        garmentType: 'dress-midi' as const,
        size: 'm' as const,
        hasNap: false,
        patternRepeatCm: 0,
      };
      const narrow = calculateFabricMetersMetric({ ...base, fabricWidth: 36 });
      const wide = calculateFabricMetersMetric({ ...base, fabricWidth: 60 });
      expect(narrow.metersNeeded).toBeGreaterThan(wide.metersNeeded);
      expect(Math.round(narrow.metersNeeded * 10)).toBeCloseTo(narrow.metersNeeded * 10, 8);
    });

    it('mønsterraport gir tillegg', () => {
      const a = calculateFabricMetersMetric({
        garmentType: 'skirt-midi',
        size: 'm',
        fabricWidth: 45,
        hasNap: false,
        patternRepeatCm: 0,
      });
      const b = calculateFabricMetersMetric({
        garmentType: 'skirt-midi',
        size: 'm',
        fabricWidth: 45,
        hasNap: false,
        patternRepeatCm: 30,
      });
      expect(b.patternMeters).toBeGreaterThan(0);
      expect(b.metersNeeded).toBeGreaterThanOrEqual(a.metersNeeded);
    });
  });

  describe('kantbånd', () => {
    it('pledd 130 × 170 cm: omkrets 600 cm, 6 strimler à 6,5 cm = 0,4 m', () => {
      const r = calculateQuiltBindingMetric({
        quiltWidthCm: 130,
        quiltHeightCm: 170,
        bindingType: 'double-fold',
        stripWidthCm: 6.5,
        fabricWidthCm: 105,
        extraCm: 30,
      });
      expect(r.perimeterCm).toBe(600);
      expect(r.totalBindingLengthCm).toBe(630);
      expect(r.numberOfStrips).toBe(6);
      expect(r.fabricMetersNeeded).toBeCloseTo(0.4, 5);
    });

    it('strimlene dekker alltid hele kantbåndet', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 30, max: 300 }),
          fc.integer({ min: 30, max: 300 }),
          fc.integer({ min: 50, max: 150 }),
          (w, h, fabricW) => {
            const r = calculateQuiltBindingMetric({
              quiltWidthCm: w,
              quiltHeightCm: h,
              bindingType: 'double-fold',
              stripWidthCm: 6.5,
              fabricWidthCm: fabricW,
              extraCm: 30,
            });
            expect(r.numberOfStrips * r.stripLengthCm).toBeGreaterThanOrEqual(r.totalBindingLengthCm);
          }
        )
      );
    });
  });

  describe('sokker', () => {
    it('EU-størrelse: 24 cm fot ≈ størrelse 38,5', () => {
      expect(euShoeSizeFromFootLength(24)).toBe(38.5);
      expect(euShoeSizeFromFootLength(26.5)).toBe(42);
    });

    it('sokkestørrelse deles i norske grupper', () => {
      expect(sockSizeGroupNo(36)).toBe('35–37');
      expect(sockSizeGroupNo(39.5)).toBe('38–40');
      expect(sockSizeGroupNo(42)).toBe('41–43');
      expect(sockSizeGroupNo(45)).toBe('44–46');
    });

    it('maskeantall: 23 cm fotomkrets, 32 masker/10 cm, 10 % ease → 68 masker', () => {
      const r = calculateSocksMetric({
        footLengthCm: 24,
        footCircumferenceCm: 23,
        ankleCircumferenceCm: 22,
        legLengthCm: 15,
        stitchesPer10cm: 32,
        rowsPer10cm: 44,
        yarnWeight: 'fingering',
      });
      // 23 × 0,9 = 20,7 cm × 3,2 masker/cm = 66,2 → nærmeste multiplum av 4
      expect(r.castOnStitches).toBe(68);
      expect(r.castOnStitches % 4).toBe(0);
      expect(r.yarnMeters).toBeGreaterThan(0);
    });
  });

  describe('garnbytte', () => {
    it('fasthet per 4 tommer gjøres om til per 10 cm (faktor ≈ 0,98)', () => {
      const d = yarnWeightDetailsNo('medium'); // 16–20 masker per 4 tommer
      expect(d.gaugeMin).toBe(16);
      expect(d.gaugeMax).toBe(20);
      const lace = yarnWeightDetailsNo('lace'); // 33–40
      expect(lace.gaugeMin).toBe(32);
      expect(lace.gaugeMax).toBe(39);
    });

    it('US-nålestørrelser blir millimeter', () => {
      expect(usNeedleToMm(8)).toBe(5.0);
      expect(usNeedleToMm(10.5)).toBe(6.5);
      expect(usNeedleToMm(17)).toBe(12.75);
    });
  });
});
