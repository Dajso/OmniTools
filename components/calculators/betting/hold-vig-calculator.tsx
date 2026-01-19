'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  americanToDecimal,
  decimalToImpliedProbability,
  calculateHold,
} from '@/lib/calculations/betting';

interface HoldVigResult {
  hold: number;
  totalImpliedProbability: number;
  noVigOdds: { decimal: number; american: number }[];
  noVigProbabilities: number[];
  fairValue: number;
}

function calculateHoldVig(
  odds: number[],
  format: 'american' | 'decimal'
): HoldVigResult {
  const decimalOdds = odds.map(o => format === 'american' ? americanToDecimal(o) : o);
  const impliedProbs = decimalOdds.map(o => decimalToImpliedProbability(o));
  const totalImpliedProbability = impliedProbs.reduce((sum, p) => sum + p, 0);
  const hold = calculateHold(decimalOdds);
  
  // Calculate no-vig (fair) odds
  const noVigProbabilities = impliedProbs.map(p => (p / totalImpliedProbability) * 100);
  const noVigOdds = noVigProbabilities.map(p => {
    const decimal = 100 / p;
    const american = decimal >= 2 ? (decimal - 1) * 100 : -100 / (decimal - 1);
    return { decimal, american };
  });
  
  // Fair value is 100% (no margin)
  const fairValue = 100;
  
  return {
    hold,
    totalImpliedProbability,
    noVigOdds,
    noVigProbabilities,
    fairValue,
  };
}

export function HoldVigCalculator() {
  const [odds1, setOdds1] = React.useState('-110');
  const [odds2, setOdds2] = React.useState('-110');
  const [oddsFormat, setOddsFormat] = React.useState<'american' | 'decimal'>('american');
  const [result, setResult] = React.useState<HoldVigResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const o1 = parseFloat(odds1);
      const o2 = parseFloat(odds2);
      
      if (isNaN(o1) || isNaN(o2)) {
        throw new Error('Please enter valid odds');
      }
      
      if (oddsFormat === 'american' && (o1 === 0 || o2 === 0)) {
        throw new Error('American odds cannot be zero');
      }
      
      if (oddsFormat === 'decimal' && (o1 <= 1 || o2 <= 1)) {
        throw new Error('Decimal odds must be greater than 1');
      }
      
      const holdResult = calculateHoldVig([o1, o2], oddsFormat);
      setResult(holdResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [odds1, odds2, oddsFormat]);

  const reset = () => {
    setOdds1('-110');
    setOdds2('-110');
    setOddsFormat('american');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Common vig examples
  const vigExamples = [
    { name: 'Standard (-110/-110)', odds1: '-110', odds2: '-110', vig: '4.55%' },
    { name: 'Reduced Juice (-105/-105)', odds1: '-105', odds2: '-105', vig: '2.38%' },
    { name: 'No Vig (+100/+100)', odds1: '+100', odds2: '+100', vig: '0%' },
    { name: 'High Vig (-115/-115)', odds1: '-115', odds2: '-115', vig: '6.52%' },
  ];

  return (
    <CalculatorBase
      title="Hold/Vig Calculator"
      description="Calculate the bookmaker's margin (hold/vig/juice) on a betting market"
      formula="Hold = (Σ Implied Probabilities - 100)%"
      formulaExplanation="The hold represents the bookmaker's built-in profit margin. Lower hold means better value for bettors."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Bookmaker Hold (Vig)"
            value={`${result.hold.toFixed(2)}%`}
            highlight
            copyable
          />
          
          <ResultDisplay
            label="Total Implied Probability"
            value={`${result.totalImpliedProbability.toFixed(2)}%`}
            copyable
          />

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">No-Vig (Fair) Odds</p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-1">Outcome 1</p>
                <p className="font-mono text-lg">
                  {result.noVigOdds[0].american > 0 ? '+' : ''}
                  {result.noVigOdds[0].american.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.noVigProbabilities[0].toFixed(1)}% true probability
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-1">Outcome 2</p>
                <p className="font-mono text-lg">
                  {result.noVigOdds[1].american > 0 ? '+' : ''}
                  {result.noVigOdds[1].american.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.noVigProbabilities[1].toFixed(1)}% true probability
                </p>
              </Card>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Vig Comparison</p>
            <div className="space-y-2">
              {vigExamples.map((example) => (
                <Card 
                  key={example.name}
                  className={`p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    odds1 === example.odds1 && odds2 === example.odds2 ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setOddsFormat('american');
                    setOdds1(example.odds1);
                    setOdds2(example.odds2);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{example.name}</span>
                    <span className="font-mono text-sm">{example.vig}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className={`p-3 rounded-md ${
            result.hold < 3 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : result.hold < 5
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`}>
            <p className={`text-sm ${
              result.hold < 3 
                ? 'text-green-800 dark:text-green-200' 
                : result.hold < 5
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {result.hold < 3 
                ? '✓ Low vig - good value for bettors'
                : result.hold < 5
                ? '⚠️ Standard vig - typical for most sportsbooks'
                : '✗ High vig - consider shopping for better odds'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="odds-format">Odds Format</Label>
          <select
            id="odds-format"
            value={oddsFormat}
            onChange={(e) => {
              setOddsFormat(e.target.value as 'american' | 'decimal');
              if (e.target.value === 'american') {
                setOdds1('-110');
                setOdds2('-110');
              } else {
                setOdds1('1.91');
                setOdds2('1.91');
              }
            }}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="american">American</option>
            <option value="decimal">Decimal</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="odds1">Outcome 1 Odds</Label>
            <Input
              id="odds1"
              type="text"
              value={odds1}
              onChange={(e) => setOdds1(e.target.value)}
              placeholder={oddsFormat === 'american' ? '-110' : '1.91'}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="odds2">Outcome 2 Odds</Label>
            <Input
              id="odds2"
              type="text"
              value={odds2}
              onChange={(e) => setOdds2(e.target.value)}
              placeholder={oddsFormat === 'american' ? '-110' : '1.91'}
              className="mt-1"
            />
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Click on any example above to see how different odds affect the vig.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default HoldVigCalculator;
