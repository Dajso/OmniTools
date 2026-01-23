'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateMacros, type MacroGoal, type MacroResults } from '@/lib/calculations/health/macro-calculator';
import { cn } from '@/lib/utils';

const GOAL_OPTIONS = [
  { value: 'weight_loss', label: 'Weight Loss (High Protein)' },
  { value: 'maintenance', label: 'Maintenance (Balanced)' },
  { value: 'muscle_gain', label: 'Muscle Gain (High Carb)' },
  { value: 'keto', label: 'Keto (Very Low Carb)' },
  { value: 'low_carb', label: 'Low Carb' },
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
      title="Macro Calculator"
      description="Calculate your daily macro nutrient targets based on your goals"
      onCalculate={calculate}
      onReset={() => { setCalories(2000); setGoal('maintenance'); setWeight(70); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{results.protein.grams}g</p>
              <p className="text-sm text-muted-foreground">Protein ({results.protein.percent}%)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{results.carbs.grams}g</p>
              <p className="text-sm text-muted-foreground">Carbs ({results.carbs.percent}%)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{results.fat.grams}g</p>
              <p className="text-sm text-muted-foreground">Fat ({results.fat.percent}%)</p>
            </div>
          </div>
          <ResultDisplay label="Recommended Fiber" value={`${results.fiber}g`} />
        </div>
      )}
    >
      <NumberInput id="calories" label="Daily Calories" value={calories} onChange={setCalories} min={1000} max={10000} unit="cal" required />
      <SelectInput id="goal" label="Goal" value={goal} onChange={(v) => setGoal(v as MacroGoal)} options={GOAL_OPTIONS} required />
      <NumberInput id="weight" label="Body Weight" value={weight} onChange={setWeight} min={30} max={300} unit="kg" />
    </CalculatorBase>
  );
}

export default MacroCalculator;
