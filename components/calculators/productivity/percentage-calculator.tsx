'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculatePercentage, type PercentageMode, type PercentageResults } from '@/lib/calculations/productivity/percentage-calculator';

const MODES: Array<{ value: PercentageMode; label: string; desc: string }> = [
  { value: 'what-is-x-percent-of-y', label: 'What is X% of Y?', desc: 'Find a percentage of a number' },
  { value: 'x-is-what-percent-of-y', label: 'X is what % of Y?', desc: 'Find what percentage X is of Y' },
  { value: 'percent-change', label: '% Change', desc: 'Calculate percentage change from X to Y' },
  { value: 'percent-increase', label: 'Increase by %', desc: 'Increase X by Y percent' },
  { value: 'percent-decrease', label: 'Decrease by %', desc: 'Decrease X by Y percent' },
];

export function PercentageCalculator() {
  const [mode, setMode] = React.useState<PercentageMode>('what-is-x-percent-of-y');
  const [value1, setValue1] = React.useState(25);
  const [value2, setValue2] = React.useState(200);
  const [results, setResults] = React.useState<PercentageResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const result = calculatePercentage({ mode, value1, value2 });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  React.useEffect(() => { handleCalculate(); }, [mode, value1, value2]);

  const getLabels = () => {
    switch (mode) {
      case 'what-is-x-percent-of-y': return { label1: 'Percentage (%)', label2: 'Number' };
      case 'x-is-what-percent-of-y': return { label1: 'Part', label2: 'Whole' };
      case 'percent-change': return { label1: 'From', label2: 'To' };
      case 'percent-increase': return { label1: 'Number', label2: 'Increase by (%)' };
      case 'percent-decrease': return { label1: 'Number', label2: 'Decrease by (%)' };
    }
  };

  const labels = getLabels();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Percentage Calculator</CardTitle>
        <CardDescription>Calculate percentages in different ways</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Calculation Type</label>
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
            <ResultDisplay label="Result" value={results.result.toLocaleString(undefined, { maximumFractionDigits: 4 })} highlight copyable />
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Formula: {results.formula}</p>
              <p className="text-muted-foreground mt-1">{results.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PercentageCalculator;
