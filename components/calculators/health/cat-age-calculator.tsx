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

  const calculate = React.useCallback(() => {
    const result = calculateCatAge({ years, months });
    setResults(result);
  }, [years, months]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Kattealder i menneskeår"
      description="Regn kattens alder om til menneskeår"
      onCalculate={calculate}
      onReset={() => { setYears(5); setMonths(0); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Tilsvarer menneskeår" value={results.humanYears} unit="år" highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Livsfase" value={results.lifeStage} />
            <ResultDisplay label="Gjennomsnittlig levealder" value={`${results.averageLifespan.min}–${results.averageLifespan.max} år`} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Livsfaser for katt</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Kattunge: 0–6 måneder</div>
              <div>Ungdom: 6 måneder – 2 år</div>
              <div>Voksen: 2–7 år</div>
              <div>Moden: 7–11 år</div>
              <div>Senior: 11–15 år</div>
              <div>Gammel: over 15 år</div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="years" label="År" value={years} onChange={setYears} min={0} max={30} required />
        <NumberInput id="months" label="Måneder" value={months} onChange={setMonths} min={0} max={11} />
      </div>
    </CalculatorBase>
  );
}

export default CatAgeCalculator;
