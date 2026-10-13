'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateMacros, type MacroGoal, type MacroResults } from '@/lib/calculations/health/macro-calculator';
import { cn } from '@/lib/utils';

const GOAL_OPTIONS = [
  { value: 'weight_loss', label: 'Vektnedgang (mye protein)' },
  { value: 'maintenance', label: 'Vedlikehold (balansert)' },
  { value: 'muscle_gain', label: 'Muskelvekst (mye karbohydrater)' },
  { value: 'keto', label: 'Keto (svært lite karbohydrater)' },
  { value: 'low_carb', label: 'Lavkarbo' },
];

export function MacroCalculator() {
  const [calories, setCalories] = React.useState(2000);
  const [goal, setGoal] = React.useState<MacroGoal>('maintenance');
  const [weight, setWeight] = React.useState(70);
  const [results, setResults] = React.useState<MacroResults | null>(null);

  const calculate = React.useCallback(() => {
    const result = calculateMacros({ calories, goal, weightKg: weight });
    setResults(result);
  }, [calories, goal, weight]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Makrokalkulator"
      description="Regn ut daglig behov for protein, karbohydrater og fett ut fra målet ditt"
      onCalculate={calculate}
      onReset={() => { setCalories(2000); setGoal('maintenance'); setWeight(70); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{results.protein.grams} g</p>
              <p className="text-sm text-muted-foreground">Protein ({results.protein.percent} %)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{results.carbs.grams} g</p>
              <p className="text-sm text-muted-foreground">Karbohydrater ({results.carbs.percent} %)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{results.fat.grams} g</p>
              <p className="text-sm text-muted-foreground">Fett ({results.fat.percent} %)</p>
            </div>
          </div>
          <ResultDisplay label="Anbefalt fiber" value={`${results.fiber} g`} />
        </div>
      )}
    >
      <NumberInput id="calories" label="Kalorier per dag" value={calories} onChange={setCalories} min={1000} max={10000} unit="kcal" required />
      <SelectInput id="goal" label="Mål" value={goal} onChange={(v) => setGoal(v as MacroGoal)} options={GOAL_OPTIONS} required />
      <NumberInput id="weight" label="Kroppsvekt" value={weight} onChange={setWeight} min={30} max={300} unit="kg" />
    </CalculatorBase>
  );
}

export default MacroCalculator;
