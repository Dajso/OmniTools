'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateSmokingCost, getHealthBenefitsTimeline, type SmokingCostResults } from '@/lib/calculations/health/smoking-cost';
import { formatCurrency } from '@/lib/utils/formatting';

export function SmokingCostCalculator() {
  const [cigarettesPerDay, setCigarettesPerDay] = React.useState(10);
  const [pricePerPack, setPricePerPack] = React.useState(8);
  const [cigarettesPerPack, setCigarettesPerPack] = React.useState(20);
  const [yearsSmoked, setYearsSmoked] = React.useState(5);
  const [results, setResults] = React.useState<SmokingCostResults | null>(null);

  const calculate = React.useCallback(() => {
    const result = calculateSmokingCost({
      cigarettesPerDay,
      pricePerPack,
      cigarettesPerPack,
      yearsSmoked,
    });
    setResults(result);
  }, [cigarettesPerDay, pricePerPack, cigarettesPerPack, yearsSmoked]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const healthBenefits = getHealthBenefitsTimeline();

  return (
    <CalculatorBase
      title="Smoking Cost Calculator"
      description="Calculate how much smoking costs you over time"
      onCalculate={calculate}
      onReset={() => { setCigarettesPerDay(10); setPricePerPack(8); setCigarettesPerPack(20); setYearsSmoked(5); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Yearly Cost" value={formatCurrency(results.yearly)} highlight copyable />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Daily" value={formatCurrency(results.daily)} />
            <ResultDisplay label="Weekly" value={formatCurrency(results.weekly)} />
            <ResultDisplay label="Monthly" value={formatCurrency(results.monthly)} />
            <ResultDisplay label="5 Years" value={formatCurrency(results.fiveYear)} />
            <ResultDisplay label="10 Years" value={formatCurrency(results.tenYear)} />
            <ResultDisplay label="30 Years" value={formatCurrency(results.lifetime)} />
          </div>

          {results.totalSpent && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-lg font-semibold text-red-800">
                You&apos;ve already spent approximately {formatCurrency(results.totalSpent)} on smoking
              </p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">What You Could Buy Instead (Yearly)</h4>
            <div className="grid grid-cols-2 gap-2">
              {results.alternativeUses.map((alt, i) => (
                <div key={i} className="p-2 bg-green-50 rounded text-sm">
                  <span className="font-medium">{alt.quantity}</span> {alt.item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Health Benefits of Quitting</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {healthBenefits.map((benefit, i) => (
                <div key={i} className="flex gap-4 text-sm p-2 bg-muted/50 rounded">
                  <span className="font-medium whitespace-nowrap">{benefit.time}</span>
                  <span className="text-muted-foreground">{benefit.benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <NumberInput id="cigarettesPerDay" label="Cigarettes Per Day" value={cigarettesPerDay} onChange={setCigarettesPerDay} min={1} max={100} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="pricePerPack" label="Price Per Pack" value={pricePerPack} onChange={setPricePerPack} min={1} max={50} step={0.5} unit="$" required />
        <NumberInput id="cigarettesPerPack" label="Cigarettes Per Pack" value={cigarettesPerPack} onChange={setCigarettesPerPack} min={10} max={30} required />
      </div>
      <NumberInput id="yearsSmoked" label="Years Smoked (optional)" value={yearsSmoked} onChange={setYearsSmoked} min={0} max={70} unit="years" />
    </CalculatorBase>
  );
}

export default SmokingCostCalculator;
