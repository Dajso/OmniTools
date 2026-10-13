'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateTDEE,
  getActivityLevelOptions,
  type TDEEResults,
  type ActivityLevel,
  type BiologicalSex,
} from '@/lib/calculations/health/tdee-calculator';
import { formatNumber } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

const tdeeSchema = z.object({
  age: z.number().min(15, 'Alderen må være minst 15 år').max(120, 'Alderen må være under 120 år'),
  sex: z.enum(['male', 'female']),
  weight: z.number().min(30, 'Vekten må være minst 30 kg').max(300, 'Vekten er for høy'),
  heightCm: z.number().min(100, 'Høyden må være minst 100 cm').max(250, 'Høyden er for stor'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

type TDEEFormInputs = {
  age: number;
  sex: BiologicalSex;
  weight: number;
  heightCm: number;
  activityLevel: ActivityLevel;
};

const INITIAL_INPUTS: TDEEFormInputs = {
  age: 35,
  sex: 'male',
  weight: 78,
  heightCm: 180,
  activityLevel: 'moderate',
};

const SEX_OPTIONS = [
  { value: 'male', label: 'Mann' },
  { value: 'female', label: 'Kvinne' },
];

function MacroBreakdown({ macros }: { macros: TDEEResults['macros'] }) {
  const items = [
    { label: 'Protein', grams: macros.protein, calories: macros.proteinCalories, color: 'bg-blue-500', percent: 30 },
    { label: 'Karbohydrater', grams: macros.carbs, calories: macros.carbCalories, color: 'bg-green-500', percent: 40 },
    { label: 'Fett', grams: macros.fat, calories: macros.fatCalories, color: 'bg-yellow-500', percent: 30 },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Fordeling av næringsstoffer (vedlikehold)</h4>
      <div className="h-4 rounded-full overflow-hidden flex">
        {items.map((item) => (
          <div key={item.label} className={cn(item.color)} style={{ width: `${item.percent}%` }} title={`${item.label}: ${item.percent} %`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className={cn('w-3 h-3 rounded-full', item.color)} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <p className="text-lg font-semibold">{formatNumber(item.grams)} g</p>
            <p className="text-xs text-muted-foreground">{formatNumber(item.calories)} kcal ({item.percent} %)</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalorieGoals({ results }: { results: TDEEResults }) {
  const goals = [
    { label: 'Raskere vektnedgang', value: results.weightLoss, description: 'ca. 0,45 kg/uke', color: 'text-red-600' },
    { label: 'Rolig vektnedgang', value: results.mildWeightLoss, description: 'ca. 0,22 kg/uke', color: 'text-orange-600' },
    { label: 'Vedlikehold', value: results.tdee, description: 'Holde vekten', color: 'text-green-600' },
    { label: 'Rolig vektøkning', value: results.mildWeightGain, description: 'ca. 0,22 kg/uke', color: 'text-blue-600' },
    { label: 'Raskere vektøkning', value: results.weightGain, description: 'ca. 0,45 kg/uke', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">Kaloribehov per dag etter mål</h4>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {goals.map((goal) => (
          <div key={goal.label} className="text-center p-2 bg-muted/50 rounded-lg">
            <p className={cn('text-lg font-semibold', goal.color)}>{formatNumber(goal.value)}</p>
            <p className="text-xs font-medium">{goal.label}</p>
            <p className="text-xs text-muted-foreground">{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateTDEEFn(f: TDEEFormInputs): TDEEResults {
  return calculateTDEE({
    age: f.age,
    sex: f.sex,
    weight: f.weight,
    height: f.heightCm,
    unit: 'metric',
    activityLevel: f.activityLevel,
  });
}

export function TDEECalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<TDEEFormInputs, TDEEResults>({
      initialInputs: INITIAL_INPUTS,
      schema: tdeeSchema as unknown as z.ZodType<TDEEFormInputs>,
      calculate: calculateTDEEFn,
      storageKey: 'tdee-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const activityOptions = getActivityLevelOptions().map((opt) => ({
    value: opt.value,
    label: `${opt.label} – ${opt.description}`,
  }));

  return (
    <CalculatorBase
      title="Kalorikalkulator (TDEE)"
      description="Regn ut hvor mange kilokalorier du forbrenner per dag, og hva du bør spise for å gå ned, holde eller øke vekten"
      formula="TDEE = BMR × aktivitetsfaktor"
      formulaExplanation="BMR (Mifflin-St Jeor): menn = 10 × vekt + 6,25 × høyde − 5 × alder + 5, kvinner = 10 × vekt + 6,25 × høyde − 5 × alder − 161. Vekt i kg og høyde i cm."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="BMR (hvilemetabolisme)" value={formatNumber(results.bmr)} unit="kcal/dag" copyable />
            <ResultDisplay label="TDEE (vedlikehold)" value={formatNumber(results.tdee)} unit="kcal/dag" highlight copyable />
          </div>
          <CalorieGoals results={results} />
          <MacroBreakdown macros={results.macros} />
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Merk:</strong> Tallene er anslag basert på Mifflin-St Jeor-formelen. Stoffskiftet varierer fra person til person. Juster inntaket ut fra hva som faktisk skjer over 2–4 uker. Ved sykdom eller store vektendringer bør du snakke med lege eller klinisk ernæringsfysiolog.
            </p>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="age" label="Alder" value={inputs.age} onChange={(v) => setInput('age', v)} min={15} max={120} step={1} unit="år" error={errors.age} required />
        <SelectInput id="sex" label="Biologisk kjønn" value={inputs.sex} onChange={(v) => setInput('sex', v as BiologicalSex)} options={SEX_OPTIONS} error={errors.sex} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="weight" label="Vekt" value={inputs.weight} onChange={(v) => setInput('weight', v)} min={30} max={300} step={0.1} unit="kg" error={errors.weight} required />
        <NumberInput id="heightCm" label="Høyde" value={inputs.heightCm} onChange={(v) => setInput('heightCm', v)} min={100} max={250} step={1} unit="cm" error={errors.heightCm} required />
      </div>
      <SelectInput id="activityLevel" label="Aktivitetsnivå" value={inputs.activityLevel} onChange={(v) => setInput('activityLevel', v as ActivityLevel)} options={activityOptions} error={errors.activityLevel} required />
    </CalculatorBase>
  );
}

export default TDEECalculator;
