'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateWaterIntake, type ActivityLevel, type WaterIntakeResults } from '@/lib/calculations/health/water-intake';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (little exercise)' },
  { value: 'light', label: 'Light (1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
  { value: 'active', label: 'Active (6-7 days/week)' },
  { value: 'very_active', label: 'Very Active (intense daily)' },
];

const CLIMATE_OPTIONS = [
  { value: 'normal', label: 'Normal/Temperate' },
  { value: 'hot', label: 'Hot/Humid' },
];

export function WaterIntakeCalculator() {
  const [weight, setWeight] = React.useState(150);
  const [unit, setUnit] = React.useState<'imperial' | 'metric'>('imperial');
  const [activity, setActivity] = React.useState<ActivityLevel>('moderate');
  const [climate, setClimate] = React.useState<'normal' | 'hot'>('normal');
  const [results, setResults] = React.useState<WaterIntakeResults | null>(null);

  const calculate = () => {
    const result = calculateWaterIntake({ weight, unit, activityLevel: activity, climate });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [weight, unit, activity, climate]);

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    const converted = newUnit === 'metric' ? Math.round(weight * 0.453592) : Math.round(weight / 0.453592);
    setWeight(converted);
    setUnit(newUnit);
  };

  return (
    <CalculatorBase
      title="Water Intake Calculator"
      description="Calculate your recommended daily water intake based on weight and activity"
      onCalculate={calculate}
      onReset={() => { setWeight(150); setActivity('moderate'); setClimate('normal'); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Daily Water" value={results.liters.toFixed(1)} unit="liters" highlight copyable />
            <ResultDisplay label="Daily Water" value={results.ounces} unit="oz" copyable />
          </div>
          <ResultDisplay label="8oz Glasses" value={results.glasses} unit="glasses/day" />
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💧 Tip: Drink water throughout the day, not all at once. Increase intake during exercise or hot weather.
            </p>
          </div>
        </div>
      )}
    >
      <div className="flex justify-end mb-2">
        <UnitToggle value={unit} onChange={handleUnitChange} labels={{ imperial: 'lbs', metric: 'kg' }} />
      </div>
      <NumberInput id="weight" label="Body Weight" value={weight} onChange={setWeight} min={50} max={500} unit={unit === 'imperial' ? 'lbs' : 'kg'} required />
      <SelectInput id="activity" label="Activity Level" value={activity} onChange={(v) => setActivity(v as ActivityLevel)} options={ACTIVITY_OPTIONS} required />
      <SelectInput id="climate" label="Climate" value={climate} onChange={(v) => setClimate(v as 'normal' | 'hot')} options={CLIMATE_OPTIONS} />
    </CalculatorBase>
  );
}

export default WaterIntakeCalculator;
