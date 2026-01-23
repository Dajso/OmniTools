'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateOneRepMax, type OneRepMaxResults } from '@/lib/calculations/health/one-rep-max';

export function OneRepMaxCalculator() {
  const [weight, setWeight] = React.useState(135);
  const [reps, setReps] = React.useState(8);
  const [unit, setUnit] = React.useState<'imperial' | 'metric'>('imperial');
  const [results, setResults] = React.useState<OneRepMaxResults | null>(null);
  const [error, setError] = React.useState<string>('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      const result = calculateOneRepMax({ weight, reps, unit });
      setResults(result);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [weight, reps, unit]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    const converted = newUnit === 'metric' ? Math.round(weight * 0.453592) : Math.round(weight / 0.453592);
    setWeight(converted);
    setUnit(newUnit);
  };

  return (
    <CalculatorBase
      title="One Rep Max Calculator"
      description="Estimate your one rep max (1RM) for any lift"
      formula="Brzycki: 1RM = weight × (36 / (37 - reps))"
      onCalculate={calculate}
      onReset={() => { setWeight(135); setReps(8); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Estimated 1RM (Average)" value={results.average} unit={unit === 'imperial' ? 'lbs' : 'kg'} highlight copyable />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-muted rounded"><span className="font-medium">Brzycki:</span> {results.brzycki}</div>
            <div className="p-2 bg-muted rounded"><span className="font-medium">Epley:</span> {results.epley}</div>
            <div className="p-2 bg-muted rounded"><span className="font-medium">Lander:</span> {results.lander}</div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Training Percentages</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {results.percentages.map(p => (
                <div key={p.percent} className="p-2 bg-muted/50 rounded text-center">
                  <p className="font-semibold">{p.weight} {unit === 'imperial' ? 'lbs' : 'kg'}</p>
                  <p className="text-xs text-muted-foreground">{p.percent}% ({p.reps} reps)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="flex justify-end mb-2">
        <UnitToggle value={unit} onChange={handleUnitChange} />
      </div>
      <NumberInput id="weight" label="Weight Lifted" value={weight} onChange={setWeight} min={1} unit={unit === 'imperial' ? 'lbs' : 'kg'} required />
      <NumberInput id="reps" label="Repetitions" value={reps} onChange={setReps} min={1} max={30} required />
    </CalculatorBase>
  );
}

export default OneRepMaxCalculator;
