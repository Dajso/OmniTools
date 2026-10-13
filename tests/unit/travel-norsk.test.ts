import { describe, it, expect } from 'vitest';
import { calculateSunTimes } from '@/lib/calculations/travel/sun-calculator';
import { calculateFlightDuration, formatDuration, getAirportByCode } from '@/lib/calculations/travel/flight-duration-calculator';
import { zonesForDate, COMMON_TIMEZONES, getTimeDifference, formatUtcOffset } from '@/lib/calculations/travel/timezone-planner';
import { formatCurrency, convertCurrency, SUPPORTED_CURRENCIES } from '@/lib/calculations/travel/currency-converter';
import { generatePackingList } from '@/lib/calculations/travel/packing-list-generator';

describe('Sol (Norge)', () => {
  it('Oslo midtsommer: ca. 03:53–22:43 lokal tid, dag over 18 timer', () => {
    const r = calculateSunTimes(59.9139, 10.7522, '2026-06-21');
    expect(r.polarState).toBe('normal');
    expect(r.dayLengthMinutes).toBeGreaterThan(1100);
    expect(r.dayLengthMinutes).toBeLessThan(1160);
  });
  it('Tromsø har midnattssol i juni og mørketid i desember', () => {
    expect(calculateSunTimes(69.6492, 18.9553, '2026-06-21').polarState).toBe('midnight-sun');
    expect(calculateSunTimes(69.6492, 18.9553, '2026-12-21').polarState).toBe('polar-night');
  });
  it('avviser ugyldig breddegrad', () => {
    expect(() => calculateSunTimes(95, 10, '2026-06-21')).toThrow(/Breddegraden/);
  });
});

describe('Flytid', () => {
  it('Oslo–Bergen er ca. 325 km', () => {
    const r = calculateFlightDuration('OSL', 'BGO');
    expect(r.distanceKm).toBeGreaterThan(310);
    expect(r.distanceKm).toBeLessThan(340);
  });
  it('formaterer norsk', () => {
    expect(formatDuration(95)).toBe('1 t 35 min');
    expect(getAirportByCode('TOS')?.country).toBe('Norge');
  });
});

describe('Tidssoner med sommertid', () => {
  it('Oslo–New York: 6 timer om sommeren, 6 timer midt i vinteren, 5 timer i overgangsuker', () => {
    const diff = (d: string) => {
      const z = zonesForDate(COMMON_TIMEZONES, new Date(`${d}T12:00:00Z`));
      const oslo = z.find((x) => x.id === 'Europe/Oslo')!;
      const ny = z.find((x) => x.id === 'America/New_York')!;
      return getTimeDifference(ny, oslo);
    };
    expect(diff('2026-07-01')).toBe(6);
    expect(diff('2026-01-15')).toBe(6);
    expect(diff('2026-03-20')).toBe(5);
  });
  it('formaterer UTC-forskyvning', () => {
    expect(formatUtcOffset(2)).toBe('UTC+2');
    expect(formatUtcOffset(5.5)).toBe('UTC+5:30');
  });
});

describe('Valuta', () => {
  it('NOK vises som kr', () => {
    expect(formatCurrency(1234.5, 'NOK')).toMatch(/kr$/);
  });
  it('NOK er første valuta og kan regnes om', () => {
    expect(SUPPORTED_CURRENCIES[0].code).toBe('NOK');
    expect(convertCurrency(1000, 'NOK', 'EUR').toAmount).toBeGreaterThan(0);
  });
});

describe('Pakkeliste', () => {
  it('er på norsk og skalerer undertøy med dager', () => {
    const l = generatePackingList({ duration: 5, tripType: 'leisure', weather: 'mixed', activities: [], includeToiletries: true, includeElectronics: true, includeMedical: true });
    expect(l.items.find((i) => i.name === 'Pass')).toBeTruthy();
    expect(l.items.find((i) => i.name === 'Undertøy')?.quantity).toBe(5);
  });
});
