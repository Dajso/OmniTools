'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateImpermanentLoss,
  IL_SCENARIOS,
  type ImpermanentLossResult,
} from '@/lib/calculations/crypto';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

export function ImpermanentLossCalculator() {
  const [initialPriceA, setInitialPriceA] = React.useState(1000);
  const [currentPriceA, setCurrentPriceA] = React.useState(1500);
  const [initialInvestment, setInitialInvestment] = React.useState(10000);
  const [result, setResult] = React.useState<ImpermanentLossResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const ilResult = calculateImpermanentLoss({
        initialPriceA,
        currentPriceA,
        initialInvestment,
      });
      setResult(ilResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [initialPriceA, currentPriceA, initialInvestment]);

  const reset = () => {
    setInitialPriceA(1000);
    setCurrentPriceA(1500);
    setInitialInvestment(10000);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const priceChangePercent = ((currentPriceA - initialPriceA) / initialPriceA) * 100;

  return (
    <CalculatorBase
      title="Impermanent Loss Calculator"
      description="Calculate impermanent loss for DeFi liquidity pool positions"
      formula="IL = 2 × √(price_ratio) / (1 + price_ratio) - 1"
      formulaExplanation="Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Impermanent Loss"
            value={result.formatted}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="If You HODL'd"
              value={formatCurrency(result.holdValue)}
              copyable
            />
            <ResultDisplay
              label="LP Position Value"
              value={formatCurrency(result.lpValue)}
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Absolute Difference"
              value={formatCurrency(Math.abs(result.absoluteLoss))}
              copyable
            />
            <ResultDisplay
              label="Price Change"
              value={`${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(1)}%`}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm">
              {result.impermanentLossPercent < 0 ? (
                <span className="text-red-600">
                  ⚠️ You would have {formatCurrency(Math.abs(result.absoluteLoss))} more if you had simply held your tokens instead of providing liquidity.
                </span>
              ) : (
                <span className="text-green-600">
                  ✓ No impermanent loss - the price ratio hasn&apos;t changed significantly.
                </span>
              )}
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Impermanent Loss Reference</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {IL_SCENARIOS.slice(0, 6).map((scenario) => (
                <Card
                  key={scenario.priceChange}
                  className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setCurrentPriceA(initialPriceA * scenario.ratio);
                  }}
                >
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{scenario.priceChange}</span>
                    <span className="font-mono text-red-600">{scenario.il.toFixed(2)}%</span>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click a scenario to apply that price change
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="initial-investment"
          label="Initial Investment"
          value={initialInvestment}
          onChange={setInitialInvestment}
          min={0}
          step={100}
          unit="USD"
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="initial-price"
            label="Initial Token Price"
            value={initialPriceA}
            onChange={setInitialPriceA}
            min={0.01}
            step={10}
            unit="USD"
          />
          <NumberInput
            id="current-price"
            label="Current Token Price"
            value={currentPriceA}
            onChange={setCurrentPriceA}
            min={0.01}
            step={10}
            unit="USD"
          />
        </div>

        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 This calculator assumes a 50/50 liquidity pool with a stablecoin pair. 
          Impermanent loss becomes permanent only when you withdraw from the pool.
        </p>
      </div>
    </CalculatorBase>
  );
}

export default ImpermanentLossCalculator;
