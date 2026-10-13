'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateSmokingCost, getHealthBenefitsTimeline, type SmokingCostResults } from '@/lib/calculations/health/smoking-cost';
import { formatCurrency } from '@/lib/utils/formatting';

export function SmokingCostCalculator() {
  const [cigarettesPerDay, setCigarettesPerDay] = React.useState(10);
  const [pricePerPack, setPricePerPack] = React.useState(140);
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
      title="Røykekostnad"
      description="Regn ut hva røyking koster deg i kroner, per dag, måned og år"
      onCalculate={calculate}
      onReset={() => { setCigarettesPerDay(10); setPricePerPack(140); setCigarettesPerPack(20); setYearsSmoked(5); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Kostnad per år" value={formatCurrency(results.yearly, { decimals: 0 })} highlight copyable />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Per dag" value={formatCurrency(results.daily, { decimals: 0 })} />
            <ResultDisplay label="Per uke" value={formatCurrency(results.weekly, { decimals: 0 })} />
            <ResultDisplay label="Per måned" value={formatCurrency(results.monthly, { decimals: 0 })} />
            <ResultDisplay label="På 5 år" value={formatCurrency(results.fiveYear, { decimals: 0 })} />
            <ResultDisplay label="På 10 år" value={formatCurrency(results.tenYear, { decimals: 0 })} />
            <ResultDisplay label="På 30 år" value={formatCurrency(results.lifetime, { decimals: 0 })} />
          </div>

          {results.totalSpent && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-lg font-semibold text-red-800">
                Du har allerede brukt ca. {formatCurrency(results.totalSpent, { decimals: 0 })} på røyking
              </p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Hva du kunne fått for pengene (per år)</h4>
            <div className="grid grid-cols-2 gap-2">
              {results.alternativeUses.map((alt, i) => (
                <div key={i} className="p-2 bg-green-50 rounded text-sm">
                  <span className="font-medium">{alt.quantity}</span> {alt.item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Dette skjer når du slutter</h4>
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
      <NumberInput id="cigarettesPerDay" label="Sigaretter per dag" value={cigarettesPerDay} onChange={setCigarettesPerDay} min={1} max={100} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="pricePerPack" label="Pris per pakke" value={pricePerPack} onChange={setPricePerPack} min={1} max={500} step={5} unit="kr" required />
        <NumberInput id="cigarettesPerPack" label="Sigaretter per pakke" value={cigarettesPerPack} onChange={setCigarettesPerPack} min={10} max={30} required />
      </div>
      <NumberInput id="yearsSmoked" label="Antall år du har røykt (valgfritt)" value={yearsSmoked} onChange={setYearsSmoked} min={0} max={70} unit="år" />
    </CalculatorBase>
  );
}

export default SmokingCostCalculator;
