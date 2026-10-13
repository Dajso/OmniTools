'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBraSize, type BraSizeResults } from '@/lib/calculations/health/size-converters';

export function BraSizeCalculator() {
  const [band, setBand] = React.useState(75);
  const [bust, setBust] = React.useState(91);
  const [results, setResults] = React.useState<BraSizeResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      setResults(calculateBraSize({ bandMeasurement: band, bustMeasurement: bust }));
    } catch (e) {
      setResults(null);
      setError((e as Error).message);
    }
  }, [band, bust]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="BH-størrelse"
      description="Finn BH-størrelsen din ut fra mål under og over brystet, med omregning til UK og USA"
      onCalculate={calculate}
      onReset={() => { setBand(75); setBust(91); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Din størrelse (EU)" value={results.eu} highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="UK" value={results.uk} />
            <ResultDisplay label="USA" value={results.us} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Omkrets (bånd)" value={results.bandSize} unit="cm" />
            <ResultDisplay label="Skål" value={results.cupSize} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Slik måler du</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Under brystet: mål rundt brystkassen rett under brystene</li>
              <li>• Brystmål: mål rundt der brystet er fyldigst</li>
              <li>• Hold målebåndet vannrett, stramt, men ikke så stramt at det klemmer</li>
              <li>• Størrelser varierer mellom merker, så prøv gjerne flere</li>
            </ul>
          </div>
        </div>
      )}
    >
      <NumberInput id="band" label="Mål under brystet" value={band} onChange={setBand} min={50} max={150} unit="cm" required />
      <NumberInput id="bust" label="Mål over brystet (fyldigste punkt)" value={bust} onChange={setBust} min={60} max={160} unit="cm" required />
    </CalculatorBase>
  );
}

export default BraSizeCalculator;
