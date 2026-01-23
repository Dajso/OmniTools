'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateTDEE,
  getActivityLevelOptions,
  ACTIVITY_LEVELS,
  type TDEEInputs,
  type TDEEResults,
  type ActivityLevel,
  type BiologicalSex,
} from '@/lib/calculations/health/tdee-calculator';
import {
  feetInchesToInches,
  inchesToFeetInches,
} from '@/lib/calculations/health/bmi-calculator';
import { cn } from '@/lib/utils';

/**
 * Zod schema for TDEE calculator inputs
 */
const tdeeSchema = z.object({
  age: z.number().min(15, 'Age must be at least 15').max(120, 'Age must be under 120'),
  sex: z.enum(['male', 'female']),
  weight: z.number().min(1, 'Weight must be positive'),
  heightFeet: z.number().min(0).max(9).optional(),
  heightInches: z.number().min(0).max(11).optional(),
  heightCm: z.number().min(1).optional(),
  unit: z.enum(['imperial', 'metric']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

type TDEEFormInputs = {
  age: number;
  sex: BiologicalSex;
  weight: number;
  heightFeet: number;
  heightInches: number;
  heightCm: number;
  unit: 'imperial' | 'metric';
  activityLevel: ActivityLevel;
};

const INITIAL_INPUTS: TDEEFormInputs = {
  age: 30,
  sex: 'male',
  weight: 170,
  heightFeet: 5,
  heightInches: 10,
  heightCm: 178,
  unit: 'imperial',
  activityLevel: 'moderate',
};

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

/**
 * Macro breakdown visualization component
 */
function MacroBreakdown({ macros, tdee }: { macros: TDEEResults['macros']; tdee: number }) {
  const items = [
    { label: 'Protein', grams: macros.protein, calories: macros.proteinCalories, color: 'bg-blue-500', percent: 30 },
    { label: 'Carbs', grams: macros.carbs, calories: macros.carbCalories, color: 'bg-green-500', percent: 40 },
    { label: 'Fat', grams: macros.fat, calories: macros.fatCalories, color: 'bg-yellow-500', percent: 30 },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Daily Macro Breakdown (Maintenance)</h4>

      {/* Visual bar */}
      <div className="h-4 rounded-full overflow-hidden flex">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(item.color)}
            style={{ width: `${item.percent}%` }}
            title={`${item.label}: ${item.percent}%`}
          />
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className={cn('w-3 h-3 rounded-full', item.color)} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <p className="text-lg font-semibold">{item.grams}g</p>
            <p className="text-xs text-muted-foreground">{item.calories} cal ({item.percent}%)</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Calorie goals component
 */
function CalorieGoals({ results }: { results: TDEEResults }) {
  const goals = [
    { label: 'Weight Loss', value: results.weightLoss, description: '~1 lb/week', color: 'text-red-600' },
    { label: 'Mild Loss', value: results.mildWeightLoss, description: '~0.5 lb/week', color: 'text-orange-600' },
    { label: 'Maintain', value: results.tdee, description: 'Current weight', color: 'text-green-600' },
    { label: 'Mild Gain', value: results.mildWeightGain, description: '~0.5 lb/week', color: 'text-blue-600' },
    { label: 'Weight Gain', value: results.weightGain, description: '~1 lb/week', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">Daily Calorie Goals</h4>
      <div className="grid grid-cols-5 gap-2">
        {goals.map((goal) => (
          <div key={goal.label} className="text-center p-2 bg-muted/50 rounded-lg">
            <p className={cn('text-lg font-semibold', goal.color)}>
              {goal.value.toLocaleString()}
            </p>
            <p className="text-xs font-medium">{goal.label}</p>
            <p className="text-xs text-muted-foreground">{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TDEE Calculator Component
 * 
 * Calculates Total Daily Energy Expenditure based on BMR and activity level.
 * Provides macro breakdown and calorie goals for different objectives.
 * 
 * Features:
 * - Mifflin-St Jeor equation for accurate BMR
 * - 5 activity levels
 * - Macro nutrient breakdown
 * - Calorie goals for weight loss/gain
 * - Imperial/Metric unit support
 * 
 * @see Requirements 6.2
 */

function calculateTDEEFn(formInputs: TDEEFormInputs): TDEEResults {
  let height: number;

  if (formInputs.unit === 'imperial') {
    height = feetInchesToInches(formInputs.heightFeet, formInputs.heightInches);
  } else {
    height = formInputs.heightCm;
  }

  const tdeeInputs: TDEEInputs = {
    age: formInputs.age,
    sex: formInputs.sex,
    weight: formInputs.weight,
    height,
    unit: formInputs.unit,
    activityLevel: formInputs.activityLevel,
  };
  return calculateTDEE(tdeeInputs);
}

export function TDEECalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<TDEEFormInputs, TDEEResults>({
    initialInputs: INITIAL_INPUTS,
    schema: tdeeSchema as unknown as z.ZodType<TDEEFormInputs>,
    calculate: calculateTDEEFn,
    storageKey: 'tdee-calculator',
  });

  // Handle unit toggle
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    setInput('unit', newUnit);

    if (newUnit === 'metric' && inputs.unit === 'imperial') {
      const weightKg = Math.round(inputs.weight * 0.453592 * 10) / 10;
      setInput('weight', weightKg);
      const totalInches = feetInchesToInches(inputs.heightFeet, inputs.heightInches);
      const heightCm = Math.round(totalInches * 2.54);
      setInput('heightCm', heightCm);
    } else if (newUnit === 'imperial' && inputs.unit === 'metric') {
      const weightLbs = Math.round(inputs.weight / 0.453592);
      setInput('weight', weightLbs);
      const totalInches = inputs.heightCm / 2.54;
      const { feet, inches } = inchesToFeetInches(totalInches);
      setInput('heightFeet', feet);
      setInput('heightInches', inches);
    }
  };

  // Calculate on mount
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const activityOptions = getActivityLevelOptions().map(opt => ({
    value: opt.value,
    label: `${opt.label} - ${opt.description}`,
  }));

  const formula = 'TDEE = BMR × Activity Multiplier';
  const formulaExplanation = 'BMR (Mifflin-St Jeor): Male = 10×weight + 6.25×height - 5×age + 5, Female = 10×weight + 6.25×height - 5×age - 161';

  return (
    <CalculatorBase
      title="TDEE Calculator"
      description="Calculate your Total Daily Energy Expenditure to understand your daily calorie needs"
      formula={formula}
      formulaExplanation={formulaExplanation}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="BMR (Basal Metabolic Rate)"
                value={results.bmr.toLocaleString()}
                unit="cal/day"
                copyable
              />
              <ResultDisplay
                label="TDEE (Maintenance)"
                value={results.tdee.toLocaleString()}
                unit="cal/day"
                highlight
                copyable
              />
            </div>

            <CalorieGoals results={results} />

            <MacroBreakdown macros={results.macros} tdee={results.tdee} />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> These calculations are estimates based on the Mifflin-St Jeor equation.
                Individual metabolism varies. Adjust your intake based on actual results over 2-4 weeks.
              </p>
            </div>
          </div>
        )
      }
    >
      {/* Unit Toggle */}
      <div className="flex justify-end mb-2">
        <UnitToggle
          value={inputs.unit}
          onChange={handleUnitChange}
        />
      </div>

      {/* Age and Sex */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="age"
          label="Age"
          value={inputs.age}
          onChange={(v) => setInput('age', v)}
          min={15}
          max={120}
          step={1}
          unit="years"
          error={errors.age}
          required
        />
        <SelectInput
          id="sex"
          label="Biological Sex"
          value={inputs.sex}
          onChange={(v) => setInput('sex', v as BiologicalSex)}
          options={SEX_OPTIONS}
          error={errors.sex}
          required
        />
      </div>

      {/* Weight */}
      <NumberInput
        id="weight"
        label="Weight"
        value={inputs.weight}
        onChange={(v) => setInput('weight', v)}
        min={inputs.unit === 'imperial' ? 66 : 30}
        max={inputs.unit === 'imperial' ? 660 : 300}
        step={inputs.unit === 'imperial' ? 1 : 0.1}
        unit={inputs.unit === 'imperial' ? 'lbs' : 'kg'}
        error={errors.weight}
        required
      />

      {/* Height - Imperial */}
      {inputs.unit === 'imperial' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="heightFeet"
            label="Height (feet)"
            value={inputs.heightFeet}
            onChange={(v) => setInput('heightFeet', v)}
            min={3}
            max={8}
            step={1}
            unit="ft"
            error={errors.heightFeet}
            required
          />
          <NumberInput
            id="heightInches"
            label="Height (inches)"
            value={inputs.heightInches}
            onChange={(v) => setInput('heightInches', v)}
            min={0}
            max={11}
            step={1}
            unit="in"
            error={errors.heightInches}
          />
        </div>
      )}

      {/* Height - Metric */}
      {inputs.unit === 'metric' && (
        <NumberInput
          id="heightCm"
          label="Height"
          value={inputs.heightCm}
          onChange={(v) => setInput('heightCm', v)}
          min={100}
          max={250}
          step={1}
          unit="cm"
          error={errors.heightCm}
          required
        />
      )}

      {/* Activity Level */}
      <SelectInput
        id="activityLevel"
        label="Activity Level"
        value={inputs.activityLevel}
        onChange={(v) => setInput('activityLevel', v as ActivityLevel)}
        options={activityOptions}
        error={errors.activityLevel}
        required
      />
    </CalculatorBase>
  );
}

export default TDEECalculator;
