import { describe, it, expect } from 'vitest';
import { calculateBAC } from '@/lib/calculations/health/bac-calculator';
import { calculateBMI } from '@/lib/calculations/health/bmi-calculator';
import { calculatePace } from '@/lib/calculations/health/pace-calculator';
import { convertCookingUnit } from '@/lib/calculations/health/cooking-converter';
import { convertOvenTemperature } from '@/lib/calculations/health/oven-temperature';
import { calculateBraSize, convertRingSize, convertShoeSize } from '@/lib/calculations/health/size-converters';
import { calculateSmokingCost } from '@/lib/calculations/health/smoking-cost';

describe('Helse: promille', () => {
  it('regner Widmark for 3 øl og 80 kg mann etter 0 timer', () => {
    const r = calculateBAC({ weight: 80, sex: 'male', drinks: 3, hours: 0, drinkType: 'beer' });
    expect(r.alcoholGrams).toBe(55.5);
    expect(r.bac).toBeCloseTo(1.02, 2);
    expect(r.legalToDrive).toBe(false);
  });

  it('trekker fra forbrenning over tid', () => {
    const r = calculateBAC({ weight: 80, sex: 'male', drinks: 3, hours: 5, drinkType: 'beer' });
    expect(r.bac).toBeCloseTo(0.52, 2);
  });

  it('gir null promille og lovlig kjøring uten alkohol', () => {
    const r = calculateBAC({ weight: 70, sex: 'female', drinks: 0, hours: 0, drinkType: 'wine' });
    expect(r.bac).toBe(0);
    expect(r.legalToDrive).toBe(true);
    expect(r.timeToSober).toBe(0);
  });

  it('bruker 0,2 som grense', () => {
    const r = calculateBAC({ weight: 100, sex: 'male', drinks: 1, hours: 0, drinkType: 'unit' });
    expect(r.bac).toBeCloseTo(0.18, 2);
    expect(r.legalToDrive).toBe(true);
  });

  it('kvinner får høyere promille enn menn ved lik vekt', () => {
    const m = calculateBAC({ weight: 70, sex: 'male', drinks: 3, hours: 0, drinkType: 'wine' });
    const f = calculateBAC({ weight: 70, sex: 'female', drinks: 3, hours: 0, drinkType: 'wine' });
    expect(f.bac).toBeGreaterThan(m.bac);
  });

  it('avviser ugyldig vekt', () => {
    expect(() => calculateBAC({ weight: 0, sex: 'male', drinks: 1, hours: 0, drinkType: 'beer' })).toThrow();
  });
});

describe('Helse: KMI', () => {
  it('regner KMI i kg og cm', () => {
    const r = calculateBMI({ weight: 75, height: 175, unit: 'metric' });
    expect(r.bmi).toBe(24.5);
    expect(r.category).toBe('normal');
    expect(r.healthyWeightRange.min).toBeCloseTo(56.7, 1);
    expect(r.healthyWeightRange.max).toBeCloseTo(76.3, 1);
  });

  it('klassifiserer overvekt', () => {
    expect(calculateBMI({ weight: 90, height: 175, unit: 'metric' }).category).toBe('overweight');
  });
});

describe('Helse: tempo', () => {
  it('regner tempo for 5 km på 25 minutter', () => {
    const r = calculatePace({ calculationType: 'pace', distance: 5, distanceUnit: 'km', minutes: 25, paceUnit: 'min/km' });
    expect(r.pace.perKm).toBe('5:00');
    expect(r.speed.kmh).toBe(12);
    expect(r.splits.map((s) => s.distance)).toEqual(['1 km', '3 km', '5 km']);
  });

  it('regner tid for 10 km på 5:30', () => {
    const r = calculatePace({ calculationType: 'time', distance: 10, distanceUnit: 'km', paceMinutes: 5, paceSeconds: 30, paceUnit: 'min/km' });
    expect(r.time.total).toBe('55:00');
  });

  it('regner distanse', () => {
    const r = calculatePace({ calculationType: 'distance', distanceUnit: 'km', hours: 1, paceMinutes: 6, paceSeconds: 0, paceUnit: 'min/km' });
    expect(r.distance.km).toBe(10);
  });
});

describe('Helse: kjøkkenomregning', () => {
  it('regner dl til ss', () => {
    expect(convertCookingUnit({ value: 1, fromUnit: 'dl', toUnit: 'tablespoons' }).value).toBeCloseTo(6.667, 2);
  });

  it('regner cup til dl', () => {
    expect(convertCookingUnit({ value: 1, fromUnit: 'cups', toUnit: 'dl' }).value).toBeCloseTo(2.366, 2);
  });

  it('regner 2 dl mel til gram', () => {
    expect(convertCookingUnit({ value: 2, fromUnit: 'dl', toUnit: 'grams', ingredient: 'flour' }).value).toBe(120);
  });

  it('krever ingrediens mellom volum og vekt', () => {
    expect(() => convertCookingUnit({ value: 1, fromUnit: 'dl', toUnit: 'grams' })).toThrow();
  });
});

describe('Helse: ovnstemperatur', () => {
  it('regner 350 °F til 177 °C og 157 °C varmluft', () => {
    const r = convertOvenTemperature({ value: 350, fromUnit: 'fahrenheit' });
    expect(r.celsius).toBe(177);
    expect(r.fanCelsius).toBe(157);
  });

  it('regner 200 °C til 392 °F', () => {
    expect(convertOvenTemperature({ value: 200, fromUnit: 'celsius' }).fahrenheit).toBe(392);
  });
});

describe('Helse: størrelser', () => {
  it('BH 75C ut fra 75 cm og 91 cm', () => {
    const r = calculateBraSize({ bandMeasurement: 75, bustMeasurement: 91 });
    expect(r.eu).toBe('75C');
    expect(r.uk).toBe('34C');
  });

  it('avviser bryst mindre enn underbryst', () => {
    expect(() => calculateBraSize({ bandMeasurement: 80, bustMeasurement: 70 })).toThrow();
  });

  it('ring EU 54 gir ca. US 7 og diameter 17,2 mm', () => {
    const r = convertRingSize({ size: 54, fromSystem: 'eu' });
    expect(r.diameter).toBeCloseTo(17.2, 1);
    expect(r.us).toBe(7);
  });

  it('ring US 7 gir EU 54', () => {
    expect(convertRingSize({ size: 7, fromSystem: 'us' }).eu).toBe(54);
  });

  it('sko EU 42 gir fotlengde 26,5 cm og US herre 9', () => {
    const r = convertShoeSize({ size: 42, fromSystem: 'eu' });
    expect(r.cm).toBe(26.5);
    expect(r.us_men).toBe(9);
    expect(r.uk).toBe(8);
  });

  it('sko kan regnes tilbake fra cm', () => {
    expect(convertShoeSize({ size: 26.5, fromSystem: 'cm' }).eu).toBe(42);
  });
});

describe('Helse: røykekostnad', () => {
  it('regner i kroner', () => {
    const r = calculateSmokingCost({ cigarettesPerDay: 20, pricePerPack: 140, cigarettesPerPack: 20, yearsSmoked: 2 });
    expect(r.daily).toBe(140);
    expect(r.yearly).toBe(51100);
    expect(r.totalSpent).toBe(102200);
  });
});
