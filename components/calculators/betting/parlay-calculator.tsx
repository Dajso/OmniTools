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
  calculateParlay,
  type ParlayLeg,
  type ParlayResult,
} from '@/lib/calculations/betting';

interface LegInput {
  name: string;
  odds: string;
  format: 'american' | 'decimal';
}

export function ParlayCalculator() {
  const [legs, setLegs] = React.useState<LegInput[]>([
    { name: 'Leg 1', odds: '-110', format: 'american' },
    { name: 'Leg 2', odds: '-110', format: 'american' },
  ]);
  const [stake, setStake] = React.useState(100);
  const [result, setResult] = React.useState<ParlayResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const parsedLegs: ParlayLeg[] = legs.map((leg, i) => {
        const odds = parseFloat(leg.odds);
        if (isNaN(odds)) {
          throw new Error(`Invalid odds for ${leg.name || `Leg ${i + 1}`}`);
        }
        return {
          name: leg.name || `Leg ${i + 1}`,
          odds,
          format: leg.format,
        };
      });
      
      const parlayResult = calculateParlay(parsedLegs, stake);
      setResult(parlayResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [legs, stake]);

  const reset = () => {
    setLegs([
      { name: 'Leg 1', odds: '-110', format: 'american' },
      { name: 'Leg 2', odds: '-110', format: 'american' },
    ]);
    setStake(100);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const addLeg = () => {
    setLegs([...legs, { name: `Leg ${legs.length + 1}`, odds: '-110', format: 'american' }]);
  };

  const removeLeg = (index: number) => {
    if (legs.length > 2) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const updateLeg = (index: number, field: keyof LegInput, value: string) => {
    const updated = [...legs];
    updated[index] = { ...updated[index], [field]: value };
    setLegs(updated);
  };

  return (
    <CalculatorBase
      title="Parlay Calculator"
      description="Calculate combined odds and potential payouts for multi-bet parlays"
      formula="Combined Odds = Leg1 × Leg2 × ... × LegN (decimal odds)"
      formulaExplanation="Parlay odds multiply together, creating higher potential payouts but lower probability of winning."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Combined Odds"
              value={result.formattedOdds}
              highlight
              copyable
            />
            <ResultDisplay
              label="Decimal Odds"
              value={result.combinedDecimalOdds.toFixed(2)}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Potential Payout"
              value={`$${result.formattedPayout}`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Potential Profit"
              value={`$${result.formattedProfit}`}
              copyable
            />
          </div>

          <ResultDisplay
            label="Implied Probability"
            value={`${result.impliedProbability.toFixed(2)}%`}
            copyable
          />

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Leg Breakdown</p>
            <div className="space-y-2">
              {result.legs.map((leg, i) => (
                <Card key={i} className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{leg.name}</span>
                    <div className="text-right text-sm">
                      <p className="font-mono">{leg.decimalOdds.toFixed(2)} decimal</p>
                      <p className="text-muted-foreground">{leg.probability.toFixed(1)}% implied</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 A {legs.length}-leg parlay at -110 odds each has only a {result.impliedProbability.toFixed(1)}% chance of winning.
              {result.impliedProbability < 10 && ' Consider the high risk before placing this bet.'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="stake"
          label="Stake"
          value={stake}
          onChange={setStake}
          min={1}
          step={10}
          unit="USD"
        />

        <div className="space-y-3">
          <Label>Parlay Legs</Label>
          {legs.map((leg, index) => (
            <Card key={index} className="p-3">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Label htmlFor={`name-${index}`} className="text-xs">Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={leg.name}
                    onChange={(e) => updateLeg(index, 'name', e.target.value)}
                    placeholder="Team/Selection"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`odds-${index}`} className="text-xs">Odds</Label>
                  <Input
                    id={`odds-${index}`}
                    value={leg.odds}
                    onChange={(e) => updateLeg(index, 'odds', e.target.value)}
                    placeholder="-110"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`format-${index}`} className="text-xs">Format</Label>
                  <select
                    id={`format-${index}`}
                    value={leg.format}
                    onChange={(e) => updateLeg(index, 'format', e.target.value as 'american' | 'decimal')}
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
                    onClick={() => removeLeg(index)}
                    disabled={legs.length <= 2}
                    className="w-full"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          <Button variant="outline" onClick={addLeg} className="w-full">
            + Add Leg
          </Button>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Parlays offer higher payouts but are harder to win. All legs must win for the parlay to pay out.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ParlayCalculator;
