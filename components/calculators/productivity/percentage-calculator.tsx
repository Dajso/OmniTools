'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculatePercentage, type PercentageMode, type PercentageResults } from '@/lib/calculations/productivity/percentage-calculator';

const MODES: Array<{ value: PercentageMode; label: string; desc: string }> = [
  { value: 'what-is-x-percent-of-y', label: 'Hva er X % av Y?', desc: 'Finn en prosentandel av et tall' },
  { value: 'x-is-what-percent-of-y', label: 'X er hvor mange % av Y?', desc: 'Finn hvor mange prosent X er av Y' },
  { value: 'percent-change', label: 'Prosentvis endring', desc: 'Regn ut endringen i prosent fra X til Y' },
  { value: 'percent-increase', label: 'Øk med %', desc: 'Øk X med Y prosent' },
  { value: 'percent-decrease', label: 'Reduser med %', desc: 'Reduser X med Y prosent' },
];

export function PercentageCalculator() {
  const [mode, setMode] = React.useState<PercentageMode>('what-is-x-percent-of-y');
  const [value1, setValue1] = React.useState(25);
  const [value2, setValue2] = React.useState(200);
  const [results, setResults] = React.useState<PercentageResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = React.useCallback(() => {
    try {
      setError(null);
      const result = calculatePercentage({ mode, value1, value2 });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beregningen mislyktes');
      setResults(null);
    }
  }, [mode, value1, value2]);

  React.useEffect(() => { handleCalculate(); }, [handleCalculate]);

  const getLabels = () => {
    switch (mode) {
      case 'what-is-x-percent-of-y': return { label1: 'Prosent (%)', label2: 'Tall' };
      case 'x-is-what-percent-of-y': return { label1: 'Del', label2: 'Helhet' };
      case 'percent-change': return { label1: 'Fra', label2: 'Til' };
      case 'percent-increase': return { label1: 'Tall', label2: 'Økning (%)' };
      case 'percent-decrease': return { label1: 'Tall', label2: 'Reduksjon (%)' };
    }
  };

  const labels = getLabels();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Prosentkalkulator</CardTitle>
        <CardDescription>Regn ut prosent på flere måter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type utregning</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as PercentageMode)} className="w-full p-2 border rounded-md">
            {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <p className="text-xs text-muted-foreground">{MODES.find(m => m.value === mode)?.desc}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="value1" label={labels.label1} value={value1} onChange={setValue1} />
          <NumberInput id="value2" label={labels.label2} value={value2} onChange={setValue2} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-3">
            <ResultDisplay label="Resultat" value={results.result.toLocaleString('nb-NO', { maximumFractionDigits: 4 })} highlight copyable />
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Formel: {results.formula}</p>
              <p className="text-muted-foreground mt-1">{results.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PercentageCalculator;
