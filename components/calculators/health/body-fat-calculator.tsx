'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBodyFat, type BiologicalSex, type BodyFatResults } from '@/lib/calculations/health/body-fat';
import { cn } from '@/lib/utils';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export function BodyFatCalculator() {
  const [sex, setSex] = React.useState<BiologicalSex>('male');
  const [height, setHeight] = React.useState(70);
  const [waist, setWaist] = React.useState(34);
  const [neck, setNeck] = React.useState(15);
  const [hip, setHip] = React.useState(38);
  const [unit, setUnit] = React.useState<'imperial' | 'metric'>('imperial');
  const [results, setResults] = React.useState<BodyFatResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = () => {
    try {
      setError('');
      const result = calculateBodyFat({ sex, height, waist, neck, hip: sex === 'female' ? hip : undefined, unit });
      setResults(result);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  React.useEffect(() => { calculate(); }, [sex, height, waist, neck, hip, unit]);

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    const factor = newUnit === 'metric' ? 2.54 : 1 / 2.54;
    setHeight(Math.round(height * factor * 10) / 10);
    setWaist(Math.round(waist * factor * 10) / 10);
    setNeck(Math.round(neck * factor * 10) / 10);
    setHip(Math.round(hip * factor * 10) / 10);
    setUnit(newUnit);
  };

  return (
    <CalculatorBase
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the US Navy method"
      formula="Navy Method: Uses height, waist, neck (and hip for women)"
      onCalculate={calculate}
      onReset={() => { setHeight(70); setWaist(34); setNeck(15); setHip(38); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Body Fat" value={results.bodyFatPercent} unit="%" highlight copyable />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary')}>
              {results.category}
            </span>
          </div>
          <ResultDisplay label="Ideal Range" value={`${results.idealRange.min}% - ${results.idealRange.max}%`} />
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Body Fat Categories ({sex === 'male' ? 'Men' : 'Women'})</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Essential: {sex === 'male' ? '2-6%' : '10-14%'}</div>
              <div>Athletes: {sex === 'male' ? '6-14%' : '14-21%'}</div>
              <div>Fitness: {sex === 'male' ? '14-18%' : '21-25%'}</div>
              <div>Average: {sex === 'male' ? '18-25%' : '25-32%'}</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="flex justify-end mb-2">
        <UnitToggle value={unit} onChange={handleUnitChange} labels={{ imperial: 'inches', metric: 'cm' }} />
      </div>
      <SelectInput id="sex" label="Biological Sex" value={sex} onChange={(v) => setSex(v as BiologicalSex)} options={SEX_OPTIONS} required />
      <NumberInput id="height" label="Height" value={height} onChange={setHeight} min={36} max={96} unit={unit === 'imperial' ? 'in' : 'cm'} required />
      <NumberInput id="waist" label="Waist (at navel)" value={waist} onChange={setWaist} min={20} max={60} unit={unit === 'imperial' ? 'in' : 'cm'} required />
      <NumberInput id="neck" label="Neck" value={neck} onChange={setNeck} min={10} max={30} unit={unit === 'imperial' ? 'in' : 'cm'} required />
      {sex === 'female' && (
        <NumberInput id="hip" label="Hip (widest point)" value={hip} onChange={setHip} min={25} max={70} unit={unit === 'imperial' ? 'in' : 'cm'} required />
      )}
    </CalculatorBase>
  );
}

export default BodyFatCalculator;
