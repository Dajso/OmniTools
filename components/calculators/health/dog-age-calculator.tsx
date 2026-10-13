'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateDogAge, type DogSize, type PetAgeResults } from '@/lib/calculations/health/pet-age';

const SIZE_OPTIONS = [
  { value: 'small', label: 'Liten (under 9 kg)' },
  { value: 'medium', label: 'Middels (9–23 kg)' },
  { value: 'large', label: 'Stor (23–45 kg)' },
  { value: 'giant', label: 'Kjempestor (over 45 kg)' },
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
      title="Hundealder i menneskeår"
      description="Regn hundens alder om til menneskeår etter størrelse"
      onCalculate={calculate}
      onReset={() => { setYears(5); setMonths(0); setSize('medium'); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Tilsvarer menneskeår" value={results.humanYears} unit="år" highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Livsfase" value={results.lifeStage} />
            <ResultDisplay label="Gjennomsnittlig levealder" value={`${results.averageLifespan.min}–${results.averageLifespan.max} år`} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Livsfaser for hund</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Valp: 0–6 måneder</div>
              <div>Ungdom: 6 måneder – 2 år</div>
              <div>Voksen: 2–7 år</div>
              <div>Moden: 7–10 år</div>
              <div>Senior: over 10 år</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="years" label="År" value={years} onChange={setYears} min={0} max={25} required />
        <NumberInput id="months" label="Måneder" value={months} onChange={setMonths} min={0} max={11} />
      </div>
      <SelectInput id="size" label="Hundens størrelse" value={size} onChange={(v) => setSize(v as DogSize)} options={SIZE_OPTIONS} required />
    </CalculatorBase>
  );
}

export default DogAgeCalculator;
