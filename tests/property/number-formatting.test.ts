/**
 * Property Test: Number Formatting Consistency
 * Feature: english-tools-website, Property 7: Number Formatting Consistency
 * 
 * *For any* numeric result displayed in the application, the number SHALL be 
 * formatted with appropriate thousand separators (commas for US locale) and 
 * decimal places (maximum 2 for currency, appropriate precision for calculations).
 * 
 * **Validates: Requirements 3.6, 14.1-14.5**
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

describe('Number Formatting Consistency - Property 7', () => {
  // Property: formatNumber should include thousand separators for US locale
  it('should format numbers with thousand separators for US locale', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 1000000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value, { locale: 'en-US' });
          // US locale uses commas as thousand separators
          expect(formatted).toContain(',');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: formatCurrency should always have exactly 2 decimal places
  it('should format currency with exactly 2 decimal places', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatCurrency(value, { locale: 'en-US', currency: 'USD' });
          // Extract the decimal part - should have exactly 2 digits after decimal
          const match = formatted.match(/\.(\d+)/);
          if (match) {
            expect(match[1].length).toBe(2);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: formatCurrency should include currency symbol
  it('should include appropriate currency symbol', () => {
    const currencySymbols: Record<CurrencyCode, string> = {
      USD: '$',
      GBP: '£',
      AUD: '$',
      EUR: '€',
    };

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<CurrencyCode>('USD', 'GBP', 'EUR'),
        (value, currency) => {
          const formatted = formatCurrency(value, { currency });
          const expectedSymbol = currencySymbols[currency];
          expect(formatted).toContain(expectedSymbol);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: formatPercent should include % symbol by default
  it('should format percentages with % symbol', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatPercent(value);
          expect(formatted).toContain('%');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: roundTo should produce values with correct decimal places
  it('should round to specified decimal places', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.integer({ min: 0, max: 6 }),
        (value, decimals) => {
          const rounded = roundTo(value, decimals);
          // Check that the rounded value has at most 'decimals' decimal places
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

  // Property: parseFormattedNumber should be inverse of formatNumber for simple cases
  it('should parse formatted numbers back to original value', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          // Round to 2 decimals to avoid floating point precision issues
          const rounded = roundTo(value, 2);
          const formatted = formatNumber(rounded, { 
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const parsed = parseFormattedNumber(formatted);
          // Allow small tolerance for floating point
          expect(Math.abs(parsed - rounded)).toBeLessThan(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: formatDate should produce valid date strings
  it('should format dates in correct format', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }),
        (date) => {
          // US format: MM/DD/YYYY
          const usFormatted = formatDate(date, 'MM/DD/YYYY');
          expect(usFormatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
          
          // UK format: DD/MM/YYYY
          const ukFormatted = formatDate(date, 'DD/MM/YYYY');
          expect(ukFormatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: All supported locales should produce valid formatted output
  it('should support all specified locales', () => {
    const locales: Locale[] = ['en-US', 'en-GB', 'en-AU'];
    
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom<Locale>(...locales),
        (value, locale) => {
          const formatted = formatNumber(value, { locale });
          // Should produce a non-empty string
          expect(formatted.length).toBeGreaterThan(0);
          // Should not contain NaN or undefined
          expect(formatted).not.toContain('NaN');
          expect(formatted).not.toContain('undefined');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Negative numbers should be formatted correctly
  it('should handle negative numbers correctly', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000000, max: -1, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value);
          // Should contain a minus sign or be wrapped in parentheses
          expect(formatted.includes('-') || formatted.includes('(')).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Zero should be formatted consistently
  it('should format zero consistently', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatPercent(0)).toBe('0.00%');
  });

  // Property: Very large numbers should still be formatted correctly
  it('should handle large numbers without overflow', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1e9, max: 1e15, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatNumber(value);
          // Should not produce scientific notation by default
          expect(formatted).not.toContain('e');
          expect(formatted).not.toContain('E');
          // Should contain thousand separators
          expect(formatted).toContain(',');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
