'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateOneRepMax, type OneRepMaxResults } from '@/lib/calculations/health/one-rep-max';

export function OneRepMaxCalculator() {
  const [weight, setWeight] = React.useState(80);
  const [reps, setReps] = React.useState(8);
  const unit = 'metric' as const;
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


  return (
    <CalculatorBase
      title="Maks én repetisjon (1RM)"
      description="Anslå maksimal vekt du kan løfte én gang (1RM) ut fra et sett med flere repetisjoner"
      formula="Brzycki: 1RM = vekt × (36 ÷ (37 − repetisjoner))"
      onCalculate={calculate}
      onReset={() => { setWeight(80); setReps(8); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Anslått 1RM (gjennomsnitt)" value={results.average} unit="kg" highlight copyable />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-muted rounded"><span className="font-medium">Brzycki:</span> {results.brzycki}</div>
            <div className="p-2 bg-muted rounded"><span className="font-medium">Epley:</span> {results.epley}</div>
            <div className="p-2 bg-muted rounded"><span className="font-medium">Lander:</span> {results.lander}</div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Treningsvekter i prosent av 1RM</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {results.percentages.map(p => (
                <div key={p.percent} className="p-2 bg-muted/50 rounded text-center">
                  <p className="font-semibold">{p.weight} kg</p>
                  <p className="text-xs text-muted-foreground">{p.percent} % ({p.reps} reps)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <NumberInput id="weight" label="Vekt du løftet" value={weight} onChange={setWeight} min={1} unit="kg" required />
      <NumberInput id="reps" label="Repetisjoner" value={reps} onChange={setReps} min={1} max={30} required />
    </CalculatorBase>
  );
}

export default OneRepMaxCalculator;
