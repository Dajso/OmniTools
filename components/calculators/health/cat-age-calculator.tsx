'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateCatAge, type PetAgeResults } from '@/lib/calculations/health/pet-age';

export function CatAgeCalculator() {
  const [years, setYears] = React.useState(5);
  const [months, setMonths] = React.useState(0);
  const [results, setResults] = React.useState<PetAgeResults | null>(null);

  const calculate = () => {
    const result = calculateCatAge({ years, months });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [years, months]);

  return (
    <CalculatorBase
      title="Cat Age Calculator"
      description="Convert your cat's age to human years"
      onCalculate={calculate}
      onReset={() => { setYears(5); setMonths(0); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Human Years Equivalent" value={results.humanYears} unit="years" highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Life Stage" value={results.lifeStage} />
            <ResultDisplay label="Avg Lifespan" value={`${results.averageLifespan.min}-${results.averageLifespan.max} years`} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Cat Life Stages</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Kitten: 0-6 months</div>
              <div>Junior: 6 months - 2 years</div>
              <div>Prime: 2-7 years</div>
              <div>Mature: 7-11 years</div>
              <div>Senior: 11-15 years</div>
              <div>Geriatric: 15+ years</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="years" label="Years" value={years} onChange={setYears} min={0} max={30} required />
        <NumberInput id="months" label="Months" value={months} onChange={setMonths} min={0} max={11} />
      </div>
    </CalculatorBase>
  );
}

export default CatAgeCalculator;
