'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateDogAge, type DogSize, type PetAgeResults } from '@/lib/calculations/health/pet-age';

const SIZE_OPTIONS = [
  { value: 'small', label: 'Small (under 20 lbs)' },
  { value: 'medium', label: 'Medium (20-50 lbs)' },
  { value: 'large', label: 'Large (50-100 lbs)' },
  { value: 'giant', label: 'Giant (over 100 lbs)' },
];

export function DogAgeCalculator() {
  const [years, setYears] = React.useState(5);
  const [months, setMonths] = React.useState(0);
  const [size, setSize] = React.useState<DogSize>('medium');
  const [results, setResults] = React.useState<PetAgeResults | null>(null);

  const calculate = React.useCallback(() => {
    const result = calculateDogAge({ years, months, size });
    setResults(result);
  }, [years, months, size]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Dog Age Calculator"
      description="Convert your dog's age to human years based on size"
      onCalculate={calculate}
      onReset={() => { setYears(5); setMonths(0); setSize('medium'); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Human Years Equivalent" value={results.humanYears} unit="years" highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Life Stage" value={results.lifeStage} />
            <ResultDisplay label="Avg Lifespan" value={`${results.averageLifespan.min}-${results.averageLifespan.max} years`} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Dog Life Stages</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Puppy: 0-6 months</div>
              <div>Junior: 6 months - 2 years</div>
              <div>Adult: 2-7 years</div>
              <div>Mature: 7-10 years</div>
              <div>Senior: 10+ years</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="years" label="Years" value={years} onChange={setYears} min={0} max={25} required />
        <NumberInput id="months" label="Months" value={months} onChange={setMonths} min={0} max={11} />
      </div>
      <SelectInput id="size" label="Dog Size" value={size} onChange={(v) => setSize(v as DogSize)} options={SIZE_OPTIONS} required />
    </CalculatorBase>
  );
}

export default DogAgeCalculator;
