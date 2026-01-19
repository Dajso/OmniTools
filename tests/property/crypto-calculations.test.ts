/**
 * Property Tests: Crypto & Web3 Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests universal properties for crypto calculation functions.
 * 
 * @module tests/property/crypto-calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  convertEthereumUnits,
  parseToWei,
  weiToString,
  EthereumUnit,
  UNIT_FACTORS,
  etherToWei,
  weiToEther,
  gweiToWei,
  weiToGwei,
} from '@/lib/calculations/crypto/ethereum-units';
import {
  calculateImpermanentLoss,
  calculateILFromRatio,
  IL_SCENARIOS,
} from '@/lib/calculations/crypto/impermanent-loss';

const TOLERANCE = 0.000001; // 0.0001% tolerance

// All Ethereum units for testing
const ethereumUnits: EthereumUnit[] = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

describe('Crypto Calculations - Property Tests', () => {
  describe('Property 5: Ethereum Unit Conversion Round-Trip', () => {
    /**
     * Property 5: Unit Conversion Round-Trip (shared)
     * 
     * *For any* valid numeric value and unit pair (Ethereum units),
     * converting from unit A to unit B and back to unit A SHALL produce
     * the original value within floating-point tolerance (0.0001%).
     * 
     * **Validates: Requirements 22.12**
     */
    
    it('round-trip conversion preserves value for integer Wei values', () => {
      fc.assert(
        fc.property(
          // Generate Wei values as integers (the base unit)
          fc.bigInt({ min: 0n, max: 10n ** 24n }), // Up to 1 million Ether
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          (weiValue, unitA, unitB) => {
            // Convert Wei to unit A
            const valueInA = weiToString(weiValue, unitA);
            
            // Convert from A to B
            const resultAtoB = convertEthereumUnits({
              value: valueInA,
              fromUnit: unitA,
              toUnit: unitB,
            });
            
            // Convert from B back to A
            const resultBtoA = convertEthereumUnits({
              value: resultAtoB.value,
              fromUnit: unitB,
              toUnit: unitA,
            });
            
            // The round-trip should produce the original value
            expect(resultBtoA.value).toBe(valueInA);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });


    it('round-trip conversion preserves value for decimal Ether values', () => {
      fc.assert(
        fc.property(
          // Generate Ether values with up to 18 decimal places
          fc.double({ min: 0.000000000000000001, max: 1000000, noNaN: true, noDefaultInfinity: true }),
          fc.constantFrom<EthereumUnit>('gwei', 'szabo', 'finney', 'ether'),
          fc.constantFrom<EthereumUnit>('gwei', 'szabo', 'finney', 'ether'),
          (value, unitA, unitB) => {
            // Convert to Wei first to get exact representation
            const weiValue = parseToWei(value, unitA);
            const valueInA = weiToString(weiValue, unitA);
            
            // Convert from A to B
            const resultAtoB = convertEthereumUnits({
              value: valueInA,
              fromUnit: unitA,
              toUnit: unitB,
            });
            
            // Convert from B back to A
            const resultBtoA = convertEthereumUnits({
              value: resultAtoB.value,
              fromUnit: unitB,
              toUnit: unitA,
            });
            
            // The round-trip should produce the original value
            expect(resultBtoA.value).toBe(valueInA);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('converting to same unit returns original value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 10n ** 24n }),
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          (weiValue, unit) => {
            const valueStr = weiToString(weiValue, unit);
            
            const result = convertEthereumUnits({
              value: valueStr,
              fromUnit: unit,
              toUnit: unit,
            });
            
            expect(result.value).toBe(valueStr);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('conversion is transitive (A->B->C equals A->C)', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 10n ** 21n }), // Smaller range to avoid precision issues
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          fc.constantFrom<EthereumUnit>(...ethereumUnits),
          (weiValue, unitA, unitB, unitC) => {
            const valueInA = weiToString(weiValue, unitA);
            
            // A -> B -> C
            const resultAtoB = convertEthereumUnits({
              value: valueInA,
              fromUnit: unitA,
              toUnit: unitB,
            });
            const resultBtoC = convertEthereumUnits({
              value: resultAtoB.value,
              fromUnit: unitB,
              toUnit: unitC,
            });
            
            // A -> C directly
            const resultAtoC = convertEthereumUnits({
              value: valueInA,
              fromUnit: unitA,
              toUnit: unitC,
            });
            
            // Both paths should produce the same result
            expect(resultBtoC.value).toBe(resultAtoC.value);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Wei conversion factors are correct powers of 10', () => {
      // Verify the conversion factors are correct
      expect(UNIT_FACTORS.wei).toBe(1n);
      expect(UNIT_FACTORS.kwei).toBe(10n ** 3n);
      expect(UNIT_FACTORS.mwei).toBe(10n ** 6n);
      expect(UNIT_FACTORS.gwei).toBe(10n ** 9n);
      expect(UNIT_FACTORS.szabo).toBe(10n ** 12n);
      expect(UNIT_FACTORS.finney).toBe(10n ** 15n);
      expect(UNIT_FACTORS.ether).toBe(10n ** 18n);
    });

    it('handles very large Ether values correctly (up to total ETH supply)', () => {
      // Total ETH supply is approximately 120 million ETH
      // Test with values up to 1 billion ETH to ensure we handle large values
      const largeValues = [
        '1000000',      // 1 million ETH
        '10000000',     // 10 million ETH
        '100000000',    // 100 million ETH
        '120000000',    // ~Total ETH supply
        '1000000000',   // 1 billion ETH (theoretical max)
      ];

      for (const etherValue of largeValues) {
        // Convert Ether to Wei
        const weiValue = etherToWei(etherValue);
        
        // Verify the Wei value is correct (should be etherValue * 10^18)
        const expectedWei = BigInt(etherValue) * (10n ** 18n);
        expect(weiValue).toBe(expectedWei);
        
        // Convert back to Ether
        const backToEther = weiToString(weiValue, 'ether');
        expect(backToEther).toBe(etherValue);
        
        // Test round-trip through Gwei
        const gweiValue = weiToString(weiValue, 'gwei');
        const backToWei = parseToWei(gweiValue, 'gwei');
        expect(backToWei).toBe(weiValue);
      }
    });

    it('handles very large Wei values with full precision', () => {
      fc.assert(
        fc.property(
          // Generate very large Wei values (up to 10^30, which is 10^12 Ether)
          fc.bigInt({ min: 10n ** 24n, max: 10n ** 30n }),
          (weiValue) => {
            // Convert to Ether and back
            const etherStr = weiToString(weiValue, 'ether');
            const backToWei = parseToWei(etherStr, 'ether');
            
            // Should preserve exact value
            expect(backToWei).toBe(weiValue);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Impermanent Loss Calculation Accuracy', () => {
    /**
     * Verify impermanent loss calculation accuracy against known values.
     * The IL formula is: IL = 2 * sqrt(r) / (1 + r) - 1
     * where r is the price ratio change.
     * 
     * **Validates: Requirements 22.2**
     */

    it('calculates correct IL for known price ratio scenarios', () => {
      // Known IL values for common price changes
      // These are mathematically verified values
      const knownScenarios = [
        { ratio: 1.0, expectedIL: 0 },           // No price change = no IL
        { ratio: 1.25, expectedIL: -0.6 },       // 1.25x price = ~0.6% IL
        { ratio: 1.5, expectedIL: -2.02 },       // 1.5x price = ~2% IL
        { ratio: 2.0, expectedIL: -5.72 },       // 2x price = ~5.7% IL
        { ratio: 3.0, expectedIL: -13.4 },       // 3x price = ~13.4% IL
        { ratio: 4.0, expectedIL: -20.0 },       // 4x price = ~20% IL
        { ratio: 5.0, expectedIL: -25.46 },      // 5x price = ~25.5% IL
        { ratio: 0.5, expectedIL: -5.72 },       // 0.5x price = ~5.7% IL (same as 2x)
        { ratio: 0.25, expectedIL: -20.0 },      // 0.25x price = ~20% IL (same as 4x)
      ];

      for (const { ratio, expectedIL } of knownScenarios) {
        const il = calculateILFromRatio(ratio);
        // Allow 0.5% tolerance for floating point
        expect(il).toBeCloseTo(expectedIL, 1);
      }
    });

    it('IL is symmetric for inverse price ratios', () => {
      fc.assert(
        fc.property(
          // Generate price ratios between 0.1 and 10
          fc.double({ min: 0.1, max: 10, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const il1 = calculateILFromRatio(ratio);
            const il2 = calculateILFromRatio(1 / ratio);
            
            // IL should be the same for r and 1/r
            expect(il1).toBeCloseTo(il2, 10);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('IL is always non-positive (loss or zero)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 100, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const il = calculateILFromRatio(ratio);
            // IL should always be <= 0 (it's a loss)
            expect(il).toBeLessThanOrEqual(0.0001); // Small tolerance for floating point
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('IL is zero when price ratio is 1 (no price change)', () => {
      const il = calculateILFromRatio(1.0);
      expect(il).toBeCloseTo(0, 10);
    });

    it('IL increases (becomes more negative) as price diverges from 1', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1.01, max: 10, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const ilAtRatio = calculateILFromRatio(ratio);
            const ilAtHigherRatio = calculateILFromRatio(ratio * 1.1);
            
            // IL should be more negative at higher ratio
            expect(ilAtHigherRatio).toBeLessThan(ilAtRatio);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('full IL calculation produces consistent results', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 100, max: 100000, noNaN: true, noDefaultInfinity: true }),
          (initialPrice, currentPrice, investment) => {
            const result = calculateImpermanentLoss({
              initialPriceA: initialPrice,
              currentPriceA: currentPrice,
              initialInvestment: investment,
            });

            // Verify the relationship: lpValue = holdValue * (1 + IL/100)
            const expectedLpValue = result.holdValue * (1 + result.impermanentLossPercent / 100);
            expect(result.lpValue).toBeCloseTo(expectedLpValue, 5);

            // Verify absoluteLoss = lpValue - holdValue
            expect(result.absoluteLoss).toBeCloseTo(result.lpValue - result.holdValue, 5);

            // Verify IL is non-positive
            expect(result.impermanentLossPercent).toBeLessThanOrEqual(0.0001);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('IL_SCENARIOS contains accurate pre-calculated values', () => {
      for (const scenario of IL_SCENARIOS) {
        const calculatedIL = calculateILFromRatio(scenario.ratio);
        expect(calculatedIL).toBeCloseTo(scenario.il, 5);
      }
    });
  });
});
