'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertOvenTemperature, getCommonTemperatures, type TemperatureUnit, type OvenTempResults } from '@/lib/calculations/health/oven-temperature';

const UNIT_OPTIONS = [
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'gas_mark', label: 'Gas mark (britisk)' },
];

export function OvenTemperatureConverter() {
  const [value, setValue] = React.useState(350);
  const [fromUnit, setFromUnit] = React.useState<TemperatureUnit>('fahrenheit');
  const [results, setResults] = React.useState<OvenTempResults | null>(null);

  const calculate = React.useCallback(() => {
    const result = convertOvenTemperature({ value, fromUnit });
    setResults(result);
  }, [value, fromUnit]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const commonTemps = getCommonTemperatures();

  return (
    <CalculatorBase
      title="Ovnstemperatur"
      description="Gjør om ovnstemperatur mellom Fahrenheit, Celsius og gas mark, med varmluft"
      onCalculate={calculate}
      onReset={() => { setValue(350); setFromUnit('fahrenheit'); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Celsius (vanlig ovn)" value={results.celsius} unit="°C" highlight={fromUnit !== 'celsius'} copyable />
            <ResultDisplay label="Celsius (varmluft)" value={results.fanCelsius} unit="°C" copyable />
            <ResultDisplay label="Fahrenheit" value={results.fahrenheit} unit="°F" highlight={fromUnit !== 'fahrenheit'} copyable />
            <ResultDisplay label="Gas mark" value={results.gasMark} highlight={fromUnit !== 'gas_mark'} />
          </div>

          <ResultDisplay label="Varmenivå" value={results.description} />

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Vanlige ovnstemperaturer</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {commonTemps.map((temp, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted"
                  onClick={() => { setValue(temp.fahrenheit); setFromUnit('fahrenheit'); }}
                >
                  <span>{temp.fahrenheit}°F / {temp.celsius}°C</span>
                  <span className="text-muted-foreground">{temp.use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <SelectInput id="fromUnit" label="Enhet" value={fromUnit} onChange={(v) => setFromUnit(v as TemperatureUnit)} options={UNIT_OPTIONS} required />
      <NumberInput
        id="value"
        label="Temperatur"
        value={value}
        onChange={setValue}
        min={fromUnit === 'gas_mark' ? 0.25 : 100}
        max={fromUnit === 'gas_mark' ? 10 : 600}
        step={fromUnit === 'gas_mark' ? 0.25 : 5}
        unit={fromUnit === 'fahrenheit' ? '°F' : fromUnit === 'celsius' ? '°C' : ''}
        required
      />
    </CalculatorBase>
  );
}

export default OvenTemperatureConverter;
