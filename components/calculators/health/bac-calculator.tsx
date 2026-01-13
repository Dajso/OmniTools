'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBAC, type BiologicalSex, type BACResults } from '@/lib/calculations/health/bac-calculator';
import { cn } from '@/lib/utils';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const DRINK_OPTIONS = [
  { value: 'beer', label: 'Beer (12oz, 5%)' },
  { value: 'wine', label: 'Wine (5oz, 12%)' },
  { value: 'spirits', label: 'Spirits (1.5oz, 40%)' },
];

const STATUS_COLORS: Record<string, string> = {
  sober: 'bg-green-100 text-green-800',
  buzzed: 'bg-yellow-100 text-yellow-800',
  impaired: 'bg-orange-100 text-orange-800',
  drunk: 'bg-red-100 text-red-800',
  dangerous: 'bg-red-200 text-red-900',
};

export function BACCalculator() {
  const [weight, setWeight] = React.useState(160);
  const [unit, setUnit] = React.useState<'imperial' | 'metric'>('imperial');
  const [sex, setSex] = React.useState<BiologicalSex>('male');
  const [drinks, setDrinks] = React.useState(2);
  const [hours, setHours] = React.useState(1);
  const [drinkType, setDrinkType] = React.useState<'beer' | 'wine' | 'spirits'>('beer');
  const [results, setResults] = React.useState<BACResults | null>(null);

  const calculate = () => {
    const result = calculateBAC({ weight, unit, sex, drinks, hours, drinkType });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [weight, unit, sex, drinks, hours, drinkType]);

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    const converted = newUnit === 'metric' ? Math.round(weight * 0.453592) : Math.round(weight / 0.453592);
    setWeight(converted);
    setUnit(newUnit);
  };

  return (
    <CalculatorBase
      title="BAC Calculator"
      description="Estimate your Blood Alcohol Content based on drinks consumed"
      formula="Widmark Formula: BAC = (A / (W × r)) - (β × t)"
      onCalculate={calculate}
      onReset={() => { setWeight(160); setDrinks(2); setHours(1); }}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Estimated BAC" value={results.bac.toFixed(3)} unit="%" highlight copyable />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', STATUS_COLORS[results.status])}>
              {results.status.charAt(0).toUpperCase() + results.status.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Legal to Drive" value={results.legalToDrive ? 'Yes' : 'No'} />
            <ResultDisplay label="Time to Sober" value={results.timeToSober} unit="hours" />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">{results.effects}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              ⚠️ This is an estimate only. Never drink and drive. BAC can vary based on many factors including food intake, medications, and individual metabolism.
            </p>
          </div>
        </div>
      )}
    >
      <div className="flex justify-end mb-2">
        <UnitToggle value={unit} onChange={handleUnitChange} labels={{ imperial: 'lbs', metric: 'kg' }} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="weight" label="Body Weight" value={weight} onChange={setWeight} min={80} max={400} unit={unit === 'imperial' ? 'lbs' : 'kg'} required />
        <SelectInput id="sex" label="Biological Sex" value={sex} onChange={(v) => setSex(v as BiologicalSex)} options={SEX_OPTIONS} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="drinks" label="Number of Drinks" value={drinks} onChange={setDrinks} min={0} max={20} required />
        <SelectInput id="drinkType" label="Drink Type" value={drinkType} onChange={(v) => setDrinkType(v as 'beer' | 'wine' | 'spirits')} options={DRINK_OPTIONS} required />
      </div>
      <NumberInput id="hours" label="Hours Since First Drink" value={hours} onChange={setHours} min={0} max={24} step={0.5} unit="hours" />
    </CalculatorBase>
  );
}

export default BACCalculator;
