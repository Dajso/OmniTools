/**
 * Property Test: Number Formatting Consistency (norsk)
 *
 * For ethvert tall som vises i applikasjonen skal formateringen følge norsk
 * standard som default: mellomrom som tusenskille, komma som desimaltegn,
 * kroner (NOK) skrevet «1 234,50 kr» og datoer som dd.mm.åååå.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  roundTo,
  parseFormattedNumber,
  type Locale,
  type CurrencyCode,
} from '@/lib/utils';

// Mellomrom som tusenskille kan være vanlig, hardt eller smalt hardt mellomrom
const GROUP_SEPARATOR = /[\s  ]/;

describe('Number Formatting Consistency (nb-NO)', () => {
  it('bruker mellomrom som tusenskille og komma som desimaltegn som standard', () => {
    expect(formatNumber(1234567.89)).toMatch(/^1[\s  ]234[\s  ]567,89$/);
    expect(formatNumber(1234.5, { maximumFractionDigits: 0 })).toMatch(/^1[\s  ]235$/);
  });

  it('formaterer tall med tusenskille for alle tall over 1000', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 1000000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value);
          expect(formatted).toMatch(GROUP_SEPARATOR);
          expect(formatted).not.toContain(',,');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('støtter engelsk format når det velges eksplisitt', () => {
    expect(formatNumber(1234567.89, { locale: 'en-US' })).toBe('1,234,567.89');
  });

  it('formaterer valuta med nøyaktig to desimaler', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatCurrency(value);
          const match = formatted.match(/,(\d+)/);
          expect(match).not.toBeNull();
          expect(match![1].length).toBe(2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('skriver norske kroner som «1 234,50 kr»', () => {
    expect(formatCurrency(1234.5)).toMatch(/^1[\s  ]234,50[\s ]kr$/);
    expect(formatCurrency(0)).toMatch(/^0,00[\s ]kr$/);
    expect(formatCurrency(1234.5, { decimals: 0 })).toMatch(/^1[\s  ]235[\s ]kr$/);
    expect(formatCurrency(-50)).toMatch(/^-50,00[\s ]kr$/);
  });

  it('kan skrive uten valutategn', () => {
    expect(formatCurrency(1234.5, { showSymbol: false })).toMatch(/^1[\s  ]234,50$/);
  });

  it('viser riktig valutategn for andre valutaer', () => {
    const symbols: Record<CurrencyCode, RegExp> = {
      NOK: /kr/,
      SEK: /SEK|kr/,
      DKK: /DKK|kr/,
      EUR: /€/,
      USD: /USD|\$/,
      GBP: /£|GBP/,
    };

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<CurrencyCode>('NOK', 'EUR', 'USD', 'GBP'),
        (value, currency) => {
          expect(formatCurrency(value, { currency })).toMatch(symbols[currency]);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formaterer prosent med %-tegn og komma', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          expect(formatPercent(value)).toContain('%');
          return true;
        }
      ),
      { numRuns: 100 }
    );
    expect(formatPercent(0.156, { decimals: 1 })).toMatch(/^15,6[\s ]%$/);
  });

  it('runder til riktig antall desimaler', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.integer({ min: 0, max: 6 }),
        (value, decimals) => {
          const rounded = roundTo(value, decimals);
          const parts = rounded.toString().split('.');
          if (parts.length === 2) {
            expect(parts[1].length).toBeLessThanOrEqual(decimals);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('leser formaterte tall tilbake til opprinnelig verdi (norsk)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const rounded = roundTo(value, 2);
          const formatted = formatNumber(rounded, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const parsed = parseFormattedNumber(formatted);
          expect(Math.abs(parsed - rounded)).toBeLessThan(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('leser valutabeløp og engelsk format', () => {
    expect(parseFormattedNumber('1 234,56 kr')).toBeCloseTo(1234.56, 2);
    expect(parseFormattedNumber('kr 1 234,56')).toBeCloseTo(1234.56, 2);
    expect(parseFormattedNumber('1.234,56')).toBeCloseTo(1234.56, 2);
    expect(parseFormattedNumber('-12,5')).toBeCloseTo(-12.5, 2);
    expect(parseFormattedNumber('$1,234.56', 'en-US')).toBeCloseTo(1234.56, 2);
  });

  it('formaterer datoer som dd.mm.åååå som standard', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }),
        (date) => {
          expect(formatDate(date)).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
          expect(formatDate(date, 'MM/DD/YYYY')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
          expect(formatDate(date, 'DD/MM/YYYY')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
          return true;
        }
      ),
      { numRuns: 100 }
    );
    expect(formatDate(new Date(2024, 2, 15))).toBe('15.03.2024');
  });

  it('støtter alle oppgitte språk', () => {
    const locales: Locale[] = ['nb-NO', 'en-US', 'en-GB'];

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<Locale>(...locales),
        (value, locale) => {
          const formatted = formatNumber(value, { locale });
          expect(formatted.length).toBeGreaterThan(0);
          expect(formatted).not.toContain('NaN');
          expect(formatted).not.toContain('undefined');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('bruker vanlig bindestrek som minustegn, så tallet kan limes inn i regneark', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: -1, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value);
          expect(formatted.startsWith('-')).toBe(true);
          expect(formatted).not.toContain('−');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('formaterer null konsekvent', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatCurrency(0)).toMatch(/^0,00[\s ]kr$/);
    expect(formatPercent(0)).toMatch(/^0,00[\s ]%$/);
  });

  it('håndterer store tall uten vitenskapelig notasjon', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1e9, max: 1e15, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value);
          expect(formatted).not.toContain('e');
          expect(formatted).not.toContain('E');
          expect(formatted).toMatch(GROUP_SEPARATOR);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
