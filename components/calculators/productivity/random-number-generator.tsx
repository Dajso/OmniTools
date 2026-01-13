'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { generateRandomNumbers, type RandomNumberResults } from '@/lib/calculations/productivity/random-number-generator';

export function RandomNumberGenerator() {
  const [min, setMin] = React.useState(1);
  const [max, setMax] = React.useState(100);
  const [count, setCount] = React.useState(1);
  const [allowDuplicates, setAllowDuplicates] = React.useState(true);
  const [sortResults, setSortResults] = React.useState(false);
  const [results, setResults] = React.useState<RandomNumberResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = () => {
    try {
      setError(null);
      const result = generateRandomNumbers({ min, max, count, allowDuplicates, sortResults });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    }
  };

  React.useEffect(() => { handleGenerate(); }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Random Number Generator</CardTitle>
        <CardDescription>Generate random numbers within a range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <NumberInput id="min" label="Minimum" value={min} onChange={setMin} />
          <NumberInput id="max" label="Maximum" value={max} onChange={setMax} />
          <NumberInput id="count" label="Count" value={count} onChange={setCount} min={1} max={1000} />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Allow duplicates</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sortResults} onChange={(e) => setSortResults(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Sort results</span>
          </label>
        </div>
        <Button onClick={handleGenerate} className="w-full">Generate</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-3">
            <div className="p-4 bg-muted rounded-md font-mono text-lg break-all">
              {results.numbers.join(', ')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Sum" value={results.sum.toLocaleString()} copyable />
              <ResultDisplay label="Average" value={results.average.toFixed(2)} copyable />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RandomNumberGenerator;
