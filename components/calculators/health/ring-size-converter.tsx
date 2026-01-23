'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertRingSize, type RingSizeSystem, type RingSizeResults } from '@/lib/calculations/health/size-converters';

const SYSTEM_OPTIONS = [
  { value: 'us', label: 'US/Canada' },
  { value: 'uk', label: 'UK/Australia' },
  { value: 'eu', label: 'Europe' },
  { value: 'jp', label: 'Japan' },
];

export function RingSizeConverter() {
  const [size, setSize] = React.useState(7);
  const [system, setSystem] = React.useState<RingSizeSystem>('us');
  const [results, setResults] = React.useState<RingSizeResults | null>(null);

  const calculate = React.useCallback(() => {
    try {
      const result = convertRingSize({ size, fromSystem: system });
      setResults(result);
    } catch (e) {
      console.error(e);
    }
  }, [size, system]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Ring Size Converter"
      description="Convert ring sizes between US, UK, EU, and Japanese systems"
      onCalculate={calculate}
      onReset={() => { setSize(7); setSystem('us'); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="US/Canada" value={results.us} highlight />
            <ResultDisplay label="UK/Australia" value={results.uk} />
            <ResultDisplay label="Europe" value={results.eu} />
            <ResultDisplay label="Japan" value={results.jp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Inner Diameter" value={results.diameter} unit="mm" />
            <ResultDisplay label="Circumference" value={results.circumference} unit="mm" />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">How to Measure</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Wrap string around your finger at the base</li>
              <li>• Mark where the string meets</li>
              <li>• Measure the length in mm (circumference)</li>
              <li>• Or measure the inner diameter of a ring that fits</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="system" label="Size System" value={system} onChange={(v) => setSystem(v as RingSizeSystem)} options={SYSTEM_OPTIONS} required />
      <NumberInput id="size" label="Ring Size" value={size} onChange={setSize} min={1} max={20} step={0.5} required />
    </CalculatorBase>
  );
}

export default RingSizeConverter;
