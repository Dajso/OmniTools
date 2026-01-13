'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertShoeSize, type ShoeSizeSystem, type ShoeSizeResults } from '@/lib/calculations/health/size-converters';

const SYSTEM_OPTIONS = [
  { value: 'us_men', label: 'US Men\'s' },
  { value: 'us_women', label: 'US Women\'s' },
  { value: 'uk', label: 'UK' },
  { value: 'eu', label: 'EU' },
  { value: 'cm', label: 'Foot Length (cm)' },
];

export function ShoeSizeConverter() {
  const [size, setSize] = React.useState(10);
  const [system, setSystem] = React.useState<ShoeSizeSystem>('us_men');
  const [results, setResults] = React.useState<ShoeSizeResults | null>(null);

  const calculate = () => {
    const result = convertShoeSize({ size, fromSystem: system });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [size, system]);

  return (
    <CalculatorBase
      title="Shoe Size Converter"
      description="Convert shoe sizes between US, UK, EU, and centimeters"
      onCalculate={calculate}
      onReset={() => { setSize(10); setSystem('us_men'); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="US Men's" value={results.us_men} highlight />
            <ResultDisplay label="US Women's" value={results.us_women} />
            <ResultDisplay label="UK" value={results.uk} />
            <ResultDisplay label="EU" value={results.eu} />
          </div>
          <ResultDisplay label="Foot Length" value={results.cm} unit="cm" />
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Size Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• US Women&apos;s = US Men&apos;s + 1.5</li>
              <li>• Measure feet in the afternoon when they&apos;re largest</li>
              <li>• Leave about 1cm of space at the toe</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="system" label="Size System" value={system} onChange={(v) => setSystem(v as ShoeSizeSystem)} options={SYSTEM_OPTIONS} required />
      <NumberInput id="size" label="Shoe Size" value={size} onChange={setSize} min={1} max={50} step={0.5} required />
    </CalculatorBase>
  );
}

export default ShoeSizeConverter;
