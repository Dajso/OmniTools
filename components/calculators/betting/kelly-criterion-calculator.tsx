'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateKelly,
  americanToDecimal,
  type KellyResult,
} from '@/lib/calculations/betting';

export function KellyCriterionCalculator() {
  const [odds, setOdds] = React.useState(150);
  const [oddsFormat, setOddsFormat] = React.useState<'american' | 'decimal'>('american');
  const [winProbability, setWinProbability] = React.useState(45);
  const [bankroll, setBankroll] = React.useState(1000);
  const [result, setResult] = React.useState<KellyResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const decimalOdds = oddsFormat === 'american' ? americanToDecimal(odds) : odds;
      const kellyResult = calculateKelly(decimalOdds, winProbability, bankroll);
      setResult(kellyResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [odds, oddsFormat, winProbability, bankroll]);

  const reset = () => {
    setOdds(150);
    setOddsFormat('american');
    setWinProbability(45);
    setBankroll(1000);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const decimalOdds = oddsFormat === 'american' ? americanToDecimal(odds) : odds;
  const impliedProbability = (1 / decimalOdds) * 100;

  return (
    <CalculatorBase
      title="Kelly Criterion Calculator"
      description="Calculate optimal bet sizing using the Kelly Criterion formula"
      formula="f* = (bp - q) / b"
      formulaExplanation="Where f* is the fraction of bankroll to bet, b is the net odds, p is win probability, and q is loss probability (1-p)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Kelly Percentage"
            value={result.formattedKelly}
            highlight
            copyable
          />
          
          <ResultDisplay
            label="Recommended Bet"
            value={`$${result.recommendedBet.toFixed(2)}`}
            highlight
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Half Kelly"
              value={`${result.halfKelly.toFixed(2)}% ($${(bankroll * result.halfKelly / 100).toFixed(2)})`}
              copyable
            />
            <ResultDisplay
              label="Quarter Kelly"
              value={`${result.quarterKelly.toFixed(2)}% ($${(bankroll * result.quarterKelly / 100).toFixed(2)})`}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Edge"
              value={`${result.edge.toFixed(2)}%`}
              copyable
            />
            <ResultDisplay
              label="Expected Value"
              value={`${result.expectedValue.toFixed(2)}%`}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Kelly Variants</p>
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Full Kelly</p>
                <p className="font-mono font-medium">${result.recommendedBet.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Max growth</p>
              </Card>
              <Card className="p-3 text-center bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-muted-foreground">Half Kelly</p>
                <p className="font-mono font-medium">${(bankroll * result.halfKelly / 100).toFixed(2)}</p>
                <p className="text-xs text-green-600">Recommended</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Quarter Kelly</p>
                <p className="font-mono font-medium">${(bankroll * result.quarterKelly / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Conservative</p>
              </Card>
            </div>
          </div>

          {result.kellyPercentage === 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">
                ⚠️ No edge detected. Kelly suggests not betting. Your estimated win probability ({winProbability}%) is lower than the implied probability ({impliedProbability.toFixed(1)}%).
              </p>
            </div>
          )}

          {result.kellyPercentage > 0 && result.kellyPercentage > 25 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ High Kelly percentage. Consider using Half or Quarter Kelly to reduce variance and risk of ruin.
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <NumberInput
              id="odds"
              label="Odds"
              value={odds}
              onChange={setOdds}
              step={10}
            />
            <select
              value={oddsFormat}
              onChange={(e) => setOddsFormat(e.target.value as 'american' | 'decimal')}
              className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
            >
              <option value="american">American</option>
              <option value="decimal">Decimal</option>
            </select>
          </div>
          <NumberInput
            id="win-probability"
            label="Your Win Probability"
            value={winProbability}
            onChange={setWinProbability}
            min={1}
            max={99}
            step={1}
            unit="%"
          />
        </div>

        <NumberInput
          id="bankroll"
          label="Bankroll"
          value={bankroll}
          onChange={setBankroll}
          min={1}
          step={100}
          unit="USD"
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Implied Probability:</strong> {impliedProbability.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            💡 You have an edge when your estimated win probability exceeds the implied probability from the odds.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default KellyCriterionCalculator;
