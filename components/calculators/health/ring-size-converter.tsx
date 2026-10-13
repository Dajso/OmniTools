'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertRingSize, type RingSizeSystem, type RingSizeResults } from '@/lib/calculations/health/size-converters';

const SYSTEM_OPTIONS = [
  { value: 'eu', label: 'Europa / Norge (omkrets i mm)' },
  { value: 'us', label: 'USA / Canada' },
  { value: 'uk', label: 'Storbritannia (tall: A = 1, B = 2 …)' },
];

export function RingSizeConverter() {
  const [size, setSize] = React.useState(54);
  const [system, setSystem] = React.useState<RingSizeSystem>('eu');
  const [results, setResults] = React.useState<RingSizeResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      setResults(convertRingSize({ size, fromSystem: system }));
    } catch (e) {
      setResults(null);
      setError((e as Error).message);
    }
  }, [size, system]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const changeSystem = (next: RingSizeSystem) => {
    setSystem(next);
    setSize(next === 'eu' ? 54 : next === 'us' ? 7 : 14);
  };

  return (
    <CalculatorBase
      title="Ringstørrelse"
      description="Gjør om ringstørrelse mellom Norge/Europa, USA og Storbritannia"
      onCalculate={calculate}
      onReset={() => { setSize(54); setSystem('eu'); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Europa / Norge" value={results.eu} highlight />
            <ResultDisplay label="USA / Canada" value={results.us} />
            <ResultDisplay label="Storbritannia" value={results.uk} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Innvendig diameter" value={results.diameter} unit="mm" />
            <ResultDisplay label="Innvendig omkrets" value={results.circumference} unit="mm" />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Slik måler du</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Legg en tråd eller en papirstrimmel rundt fingeren der ringen skal sitte</li>
              <li>• Marker der endene møtes og mål lengden i mm. Det er ringstørrelsen i Norge</li>
              <li>• Eller mål innvendig diameter på en ring som passer</li>
              <li>• Mål helst når fingeren er varm og midt på dagen</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="system" label="Størrelsessystem" value={system} onChange={(v) => changeSystem(v as RingSizeSystem)} options={SYSTEM_OPTIONS} required />
      <NumberInput id="size" label="Ringstørrelse" value={size} onChange={setSize} min={1} max={90} step={system === 'eu' ? 1 : 0.5} unit={system === 'eu' ? 'mm' : undefined} required />
    </CalculatorBase>
  );
}

export default RingSizeConverter;
