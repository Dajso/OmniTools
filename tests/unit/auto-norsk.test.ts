import { describe, it, expect } from 'vitest';
import { CHARGER_TYPES, EV_MODELS, calculateChargingTime } from '@/lib/calculations/auto/ev-charging-calculator';
import { formatCurrency } from '@/lib/calculations/auto/car-loan-calculator';
import { convertFuelEconomy } from '@/lib/calculations/auto/fuel-consumption-converter';

describe('Auto: norsk tilpasning', () => {
  it('ladetyper er norske (230/400 V) og inneholder ikke 120 V', () => {
    expect(CHARGER_TYPES.some((c) => c.voltage === 120 || c.voltage === 240)).toBe(false);
    expect(CHARGER_TYPES.find((c) => c.id === 'ac-1ph-32a')?.power).toBe(7.4);
    expect(CHARGER_TYPES.find((c) => c.id === 'ac-3ph-16a')?.power).toBe(11);
  });

  it('ingen amerikanske-bare modeller', () => {
    const names = EV_MODELS.map((m) => m.name).join(' ');
    expect(names).not.toMatch(/Bolt|Rivian/);
  });

  it('ladetid formateres på norsk', () => {
    const r = calculateChargingTime({ batteryCapacity: 60, currentCharge: 20, targetCharge: 80, chargerPower: 7.4, efficiency: 0.9 });
    expect(r.formattedTime).toMatch(/\d+ t( \d+ min)?$/);
  });

  it('billån formateres som NOK', () => {
    expect(formatCurrency(12345)).toMatch(/kr|NOK/);
    expect(formatCurrency(12345)).not.toMatch(/\$/);
  });

  it('6,5 l/100 km er ca. 15,4 km/l', () => {
    const r = convertFuelEconomy(6.5, 'l-100km');
    expect(r.conversions['km-l']).toBeCloseTo(15.38, 1);
    expect(r.formatted['l-100km']).toBe('6,5 l/100 km');
  });
});
