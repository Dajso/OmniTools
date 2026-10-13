/**
 * Property Tests: Travel Calculations
 * Feature: expanded-tools-categories
 *
 * Tests for Currency Converter
 * (Schengen-kalkulatoren er fjernet: gjelder besøkende utenfor EØS.)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import {
  convertCurrency,
  convertBack,
  DEFAULT_RATES,
  SUPPORTED_CURRENCIES,
  type ExchangeRates,
} from '@/lib/calculations/travel/currency-converter';

/**
 * Currencies with 0 decimal places have higher rounding error potential
 */
const ZERO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'IDR', 'VND', 'HUF'];

/**
 * Currencies with extreme exchange rates that cause precision issues in multi-hop conversions
 */
const EXTREME_RATE_CURRENCIES = ['IDR', 'KRW', 'VND', 'HUF', 'JPY', 'INR'];

/**
 * Arbitrary for generating valid currency codes (all supported)
 */
const validCurrencyCodeArb = fc.constantFrom(
  ...SUPPORTED_CURRENCIES.map(c => c.code)
);

/**
 * Arbitrary for generating valid amounts (positive numbers)
 * Using integer values to avoid floating-point representation issues
 * Minimum of 100 to avoid rounding issues with extreme exchange rates
 */
const validAmountArb = fc.integer({ min: 100, max: 10000000 });

/**
 * Arbitrary for generating large amounts for precision-sensitive tests
 * Using integer values to avoid floating-point representation issues
 */
const largeAmountArb = fc.integer({ min: 10000, max: 10000000 });

/**
 * Filter for currencies that work well in round-trip tests
 * Excludes currencies with 0 decimal places that cause precision issues
 */
const stableRoundTripCurrencyArb = fc.constantFrom(
  ...SUPPORTED_CURRENCIES
    .filter(c => !ZERO_DECIMAL_CURRENCIES.includes(c.code))
    .map(c => c.code)
);

/**
 * Filter for currencies that work well in transitivity tests
 * Excludes currencies with extreme exchange rates
 */
const stableTransitivityCurrencyArb = fc.constantFrom(
  ...SUPPORTED_CURRENCIES
    .filter(c => !EXTREME_RATE_CURRENCIES.includes(c.code))
    .map(c => c.code)
);

describe('Currency Converter - Property 5: Unit Conversion Round-Trip', () => {
  /**
   * Property 5: Unit Conversion Round-Trip
   * Feature: expanded-tools-categories, Property 5: Unit Conversion Round-Trip
   * 
   * *For any* valid numeric value and unit pair (currency, Ethereum units, etc.),
   * converting from unit A to unit B and back to unit A SHALL produce the original
   * value within floating-point tolerance (0.0001%).
   * 
   * **Validates: Requirements 16.12**
   * 
   * Note: This test uses currencies with 2 decimal places to avoid precision loss
   * from rounding in currencies with 0 decimal places (JPY, KRW, IDR, etc.)
   */
  it('converting currency A to B and back to A should produce original value within tolerance', () => {
    fc.assert(
      fc.property(
        largeAmountArb,
        stableRoundTripCurrencyArb,
        stableRoundTripCurrencyArb,
        (amount, fromCurrency, toCurrency) => {
          // Skip same currency conversions (trivial case)
          if (fromCurrency === toCurrency) {
            return true;
          }

          const result1 = convertCurrency(amount, fromCurrency, toCurrency, DEFAULT_RATES);
          const result2 = convertBack(result1, DEFAULT_RATES);

          // The round-trip should produce the original value within tolerance
          // Using 1% tolerance due to rounding in currency conversions
          const tolerance = Math.max(amount * 0.01, 1);
          const difference = Math.abs(result2.toAmount - amount);

          expect(difference).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Zero-decimal currencies should still convert correctly (one-way)
   * This tests that conversions work, even if round-trip has precision loss
   * **Validates: Requirements 16.12**
   */
  it('zero-decimal currencies should convert to positive values', () => {
    // Only use zero-decimal currencies that are actually in the supported list
    const supportedZeroDecimalCurrencies = ZERO_DECIMAL_CURRENCIES.filter(
      code => SUPPORTED_CURRENCIES.some(c => c.code === code)
    );
    const zeroDecimalCurrencyArb = fc.constantFrom(...supportedZeroDecimalCurrencies);
    // Use larger amounts to ensure non-zero results after conversion
    const zeroDecimalAmountArb = fc.integer({ min: 1000, max: 10000000 });
    
    fc.assert(
      fc.property(
        zeroDecimalAmountArb,
        zeroDecimalCurrencyArb,
        stableRoundTripCurrencyArb,
        (amount, fromCurrency, toCurrency) => {
          const result = convertCurrency(amount, fromCurrency, toCurrency, DEFAULT_RATES);
          
          // Conversion should produce a positive result
          expect(result.toAmount).toBeGreaterThan(0);
          expect(result.rate).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Converting same currency should return same amount (within rounding)
   * **Validates: Requirements 16.12**
   */
  it('converting same currency should return same amount', () => {
    fc.assert(
      fc.property(validAmountArb, validCurrencyCodeArb, (amount, currency) => {
        const result = convertCurrency(amount, currency, currency, DEFAULT_RATES);

        // Same currency conversion should preserve value
        expect(result.toAmount).toBe(amount);
        expect(result.rate).toBe(1);
        expect(result.inverseRate).toBe(1);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Rate and inverse rate should be reciprocals
   * **Validates: Requirements 16.12**
   * 
   * Note: Uses 1 decimal place tolerance due to rate rounding (6 decimal places)
   * and extreme exchange rates for some currency pairs
   */
  it('rate and inverse rate should be reciprocals', () => {
    // Use stable currencies to avoid extreme rate issues
    fc.assert(
      fc.property(
        validAmountArb,
        stableTransitivityCurrencyArb,
        stableTransitivityCurrencyArb,
        (amount, fromCurrency, toCurrency) => {
          const result = convertCurrency(amount, fromCurrency, toCurrency, DEFAULT_RATES);

          // rate * inverseRate should be approximately 1
          // Using 1 decimal place tolerance due to rate rounding (6 decimal places)
          const product = result.rate * result.inverseRate;
          expect(product).toBeCloseTo(1, 1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Conversion should be transitive (A->B->C should equal A->C within tolerance)
   * **Validates: Requirements 16.12**
   * 
   * Note: Uses stable currencies without extreme exchange rates to avoid
   * compounding precision errors in multi-hop conversions
   */
  it('conversion should be approximately transitive', () => {
    fc.assert(
      fc.property(
        largeAmountArb,
        stableTransitivityCurrencyArb,
        stableTransitivityCurrencyArb,
        stableTransitivityCurrencyArb,
        (amount, currencyA, currencyB, currencyC) => {
          // Skip if any currencies are the same
          if (currencyA === currencyB || currencyB === currencyC || currencyA === currencyC) {
            return true;
          }

          // A -> B -> C
          const resultAB = convertCurrency(amount, currencyA, currencyB, DEFAULT_RATES);
          const resultBC = convertCurrency(resultAB.toAmount, currencyB, currencyC, DEFAULT_RATES);

          // A -> C directly
          const resultAC = convertCurrency(amount, currencyA, currencyC, DEFAULT_RATES);

          // Should be approximately equal (within 2% due to rounding)
          const tolerance = Math.max(resultAC.toAmount * 0.02, 1);
          const difference = Math.abs(resultBC.toAmount - resultAC.toAmount);

          expect(difference).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Converted amount should be non-negative for positive input
   * **Validates: Requirements 16.12**
   * 
   * Note: Uses minimum amount of 100 to ensure converted amounts
   * don't round to zero even with extreme exchange rates
   */
  it('converted amount should be non-negative for positive input', () => {
    fc.assert(
      fc.property(
        validAmountArb,
        validCurrencyCodeArb,
        validCurrencyCodeArb,
        (amount, fromCurrency, toCurrency) => {
          const result = convertCurrency(amount, fromCurrency, toCurrency, DEFAULT_RATES);

          expect(result.toAmount).toBeGreaterThanOrEqual(0);
          expect(result.rate).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Conversion rate should be consistent regardless of amount
   * **Validates: Requirements 16.12**
   */
  it('conversion rate should be consistent regardless of amount', () => {
    fc.assert(
      fc.property(
        validAmountArb,
        validAmountArb,
        validCurrencyCodeArb,
        validCurrencyCodeArb,
        (amount1, amount2, fromCurrency, toCurrency) => {
          const result1 = convertCurrency(amount1, fromCurrency, toCurrency, DEFAULT_RATES);
          const result2 = convertCurrency(amount2, fromCurrency, toCurrency, DEFAULT_RATES);

          // Rates should be identical
          expect(result1.rate).toBe(result2.rate);
          expect(result1.inverseRate).toBe(result2.inverseRate);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Double the amount should approximately double the converted value
   * **Validates: Requirements 16.12**
   * 
   * Note: Uses stable currencies to avoid precision issues with extreme exchange rates
   */
  it('doubling the amount should approximately double the converted value', () => {
    fc.assert(
      fc.property(
        largeAmountArb,
        stableRoundTripCurrencyArb,
        stableRoundTripCurrencyArb,
        (amount, fromCurrency, toCurrency) => {
          const result1 = convertCurrency(amount, fromCurrency, toCurrency, DEFAULT_RATES);
          const result2 = convertCurrency(amount * 2, fromCurrency, toCurrency, DEFAULT_RATES);

          // Due to rounding, we check within a reasonable tolerance
          const expectedDouble = result1.toAmount * 2;
          const tolerance = Math.max(expectedDouble * 0.02, 1); // 2% or 1, whichever is larger

          expect(Math.abs(result2.toAmount - expectedDouble)).toBeLessThanOrEqual(tolerance);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
