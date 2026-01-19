'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  calculateArbitrage,
  type ArbitrageOutcome,
  type ArbitrageResult,
} from '@/lib/calculations/betting';

interface OutcomeInput {
  name: string;
  odds: string;
  format: 'american' | 'decimal';
}

export function ArbitrageCalculator() {
  const [outcomes, setOutcomes] = React.useState<OutcomeInput[]>([
    { name: 'Outcome 1', odds: '+150', format: 'american' },
    { name: 'Outcome 2', odds: '-130', format: 'american' },
  ]);
  const [totalStake, setTotalStake] = React.useState(1000);
  const [result, setResult] = React.useState<ArbitrageResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const parsedOutcomes: ArbitrageOutcome[] = outcomes.map((o, i) => {
        const odds = parseFloat(o.odds);
        if (isNaN(odds)) {
          throw new Error(`Invalid odds for ${o.name || `Outcome ${i + 1}`}`);
        }
        return {
          name: o.name || `Outcome ${i + 1}`,
          odds,
          format: o.format,
        };
      });
      
      const arbResult = calculateArbitrage(parsedOutcomes, totalStake);
      setResult(arbResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [outcomes, totalStake]);

  const reset = () => {
    setOutcomes([
      { name: 'Outcome 1', odds: '+150', format: 'american' },
      { name: 'Outcome 2', odds: '-130', format: 'american' },
    ]);
    setTotalStake(1000);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const addOutcome = () => {
    setOutcomes([...outcomes, { name: `Outcome ${outcomes.length + 1}`, odds: '+100', format: 'american' }]);
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index: number, field: keyof OutcomeInput, value: string) => {
    const updated = [...outcomes];
    updated[index] = { ...updated[index], [field]: value };
    setOutcomes(updated);
  };

  return (
    <CalculatorBase
      title="Arbitrage Calculator"
      description="Detect arbitrage opportunities (surebets) and calculate optimal stake distribution"
      formula="Arbitrage exists when: Σ(1/decimal_odds) < 1"
      formulaExplanation="When the sum of implied probabilities is less than 100%, you can guarantee profit by betting on all outcomes."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Arbitrage Opportunity"
            value={result.isArbitrage ? '✓ YES - Surebet Found!' : '✗ No Arbitrage'}
            highlight
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Implied Probability"
              value={`${result.totalImpliedProbability.toFixed(2)}%`}
              copyable
            />
            <ResultDisplay
              label="Profit Margin"
              value={result.isArbitrage ? `${result.profitPercentage.toFixed(2)}%` : 'N/A'}
              copyable
            />
          </div>

          {result.isArbitrage && (
            <>
              <ResultDisplay
                label="Guaranteed Profit"
                value={`$${result.guaranteedProfit.toFixed(2)}`}
                highlight
                copyable
              />

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Optimal Stake Distribution</p>
                <div className="space-y-2">
                  {result.stakes.map((stake, i) => (
                    <Card key={i} className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stake.name}</span>
                        <div className="text-right">
                          <p className="font-mono">Stake: ${stake.stake.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Payout: ${stake.payout.toFixed(2)}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result.isArbitrage && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ No arbitrage opportunity. The bookmaker&apos;s margin is {(result.totalImpliedProbability - 100).toFixed(2)}%.
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="total-stake"
          label="Total Stake"
          value={totalStake}
          onChange={setTotalStake}
          min={1}
          step={100}
          unit="USD"
        />

        <div className="space-y-3">
          <Label>Outcomes</Label>
          {outcomes.map((outcome, index) => (
            <Card key={index} className="p-3">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Label htmlFor={`name-${index}`} className="text-xs">Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={outcome.name}
                    onChange={(e) => updateOutcome(index, 'name', e.target.value)}
                    placeholder="Outcome name"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`odds-${index}`} className="text-xs">Odds</Label>
                  <Input
                    id={`odds-${index}`}
                    value={outcome.odds}
                    onChange={(e) => updateOutcome(index, 'odds', e.target.value)}
                    placeholder="+150"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`format-${index}`} className="text-xs">Format</Label>
                  <select
                    id={`format-${index}`}
                    value={outcome.format}
                    onChange={(e) => updateOutcome(index, 'format', e.target.value as 'american' | 'decimal')}
                    className="w-full p-2 border rounded-md bg-background text-sm"
                  >
                    <option value="american">American</option>
                    <option value="decimal">Decimal</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOutcome(index)}
                    disabled={outcomes.length <= 2}
                    className="w-full"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          <Button variant="outline" onClick={addOutcome} className="w-full">
            + Add Outcome
          </Button>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Enter odds from different bookmakers for the same event to find arbitrage opportunities.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ArbitrageCalculator;
