'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertShoeSize, type ShoeSizeSystem, type ShoeSizeResults } from '@/lib/calculations/health/size-converters';

const SYSTEM_OPTIONS = [
  { value: 'eu', label: 'Europa / Norge (EU)' },
  { value: 'us_men', label: 'USA herre' },
  { value: 'us_women', label: 'USA dame' },
  { value: 'uk', label: 'Storbritannia' },
  { value: 'cm', label: 'Fotlengde (cm)' },
];

const DEFAULTS: Record<ShoeSizeSystem, number> = { eu: 42, us_men: 9, us_women: 10.5, uk: 8, cm: 26.5 };

export function ShoeSizeConverter() {
  const [size, setSize] = React.useState(42);
  const [system, setSystem] = React.useState<ShoeSizeSystem>('eu');
  const [results, setResults] = React.useState<ShoeSizeResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      setResults(convertShoeSize({ size, fromSystem: system }));
    } catch (e) {
      setResults(null);
      setError((e as Error).message);
    }
  }, [size, system]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Skostørrelse"
      description="Gjør om skostørrelse mellom Norge/Europa, USA, Storbritannia og fotlengde i cm"
      onCalculate={calculate}
      onReset={() => { setSize(42); setSystem('eu'); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Europa / Norge" value={results.eu} highlight />
            <ResultDisplay label="USA herre" value={results.us_men} />
            <ResultDisplay label="USA dame" value={results.us_women} />
            <ResultDisplay label="Storbritannia" value={results.uk} />
          </div>
          <ResultDisplay label="Fotlengde" value={results.cm} unit="cm" />
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Mål foten på ettermiddagen, når den er størst</li>
              <li>• La det være ca. 1–1,5 cm plass foran tærne</li>
              <li>• Størrelsene varierer mellom produsenter. Se merkets egen størrelsestabell</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="system" label="Størrelsessystem" value={system} onChange={(v) => { setSystem(v as ShoeSizeSystem); setSize(DEFAULTS[v as ShoeSizeSystem]); }} options={SYSTEM_OPTIONS} required />
      <NumberInput id="size" label="Skostørrelse" value={size} onChange={setSize} min={1} max={60} step={system === 'cm' ? 0.1 : 0.5} unit={system === 'cm' ? 'cm' : undefined} required />
    </CalculatorBase>
  );
}

export default ShoeSizeConverter;
