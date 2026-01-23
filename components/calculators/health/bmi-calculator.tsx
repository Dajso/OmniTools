'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateBMI,
  feetInchesToInches,
  inchesToFeetInches,
  type BMIInputs,
  type BMIResults,
  type BMICategory,
} from '@/lib/calculations/health/bmi-calculator';
import { cn } from '@/lib/utils';

/**
 * Zod schema for BMI calculator inputs
 */
const bmiSchema = z.object({
  weight: z.number().min(1, 'Weight must be positive'),
  heightFeet: z.number().min(0).max(9).default(0),
  heightInches: z.number().min(0).max(11).default(0),
  heightCm: z.number().min(1).default(170),
  unit: z.enum(['imperial', 'metric']),
}).refine((data) => {
  if (data.unit === 'imperial') {
    return data.heightFeet > 0 || data.heightInches > 0;
  }
  return data.heightCm > 0;
}, {
  message: 'Height is required',
});

type BMIFormInputs = {
  weight: number;
  heightFeet: number;
  heightInches: number;
  heightCm: number;
  unit: 'imperial' | 'metric';
};

const INITIAL_INPUTS: BMIFormInputs = {
  weight: 150,
  heightFeet: 5,
  heightInches: 7,
  heightCm: 170,
  unit: 'imperial',
};

/**
 * BMI category colors and labels
 */
const CATEGORY_CONFIG: Record<BMICategory, { color: string; label: string; bgColor: string }> = {
  underweight: { color: 'text-blue-600', label: 'Underweight', bgColor: 'bg-blue-100' },
  normal: { color: 'text-green-600', label: 'Normal', bgColor: 'bg-green-100' },
  overweight: { color: 'text-yellow-600', label: 'Overweight', bgColor: 'bg-yellow-100' },
  obese: { color: 'text-red-600', label: 'Obese', bgColor: 'bg-red-100' },
};

/**
 * BMI Scale visualization component
 */
function BMIScale({ bmi, category }: { bmi: number; category: BMICategory }) {
  // Calculate position on scale (BMI 15-40 range)
  const minBMI = 15;
  const maxBMI = 40;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
  const position = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;

  return (
    <div className="mt-4">
      <div className="relative h-4 rounded-full overflow-hidden flex">
        <div className="w-[14%] bg-blue-400" title="Underweight" />
        <div className="w-[26%] bg-green-400" title="Normal" />
        <div className="w-[20%] bg-yellow-400" title="Overweight" />
        <div className="w-[40%] bg-red-400" title="Obese" />
      </div>
      {/* Marker */}
      <div
        className="relative h-0"
        style={{ left: `${position}%` }}
      >
        <div
          className="absolute -top-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}

/**
 * Category badge component
 */
function CategoryBadge({ category }: { category: BMICategory }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      config.bgColor,
      config.color
    )}>
      {config.label}
    </span>
  );
}

/**
 * BMI Calculator Component
 * 
 * Calculates Body Mass Index with support for both Imperial (lbs/ft-in)
 * and Metric (kg/cm) units. Provides category classification and
 * healthy weight range recommendations.
 * 
 * Features:
 * - Imperial/Metric unit toggle (Imperial default per requirements)
 * - Visual BMI scale
 * - Category classification with color coding
 * - Healthy weight range display
 * - Personalized recommendations
 * 
 * @see Requirements 6.1
 */

function calculateBMIFn(formInputs: BMIFormInputs): BMIResults {
  let height: number;

  if (formInputs.unit === 'imperial') {
    height = feetInchesToInches(formInputs.heightFeet, formInputs.heightInches);
  } else {
    height = formInputs.heightCm;
  }

  const bmiInputs: BMIInputs = {
    weight: formInputs.weight,
    height,
    unit: formInputs.unit,
  };
  return calculateBMI(bmiInputs);
}

export function BMICalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<BMIFormInputs, BMIResults>({
    initialInputs: INITIAL_INPUTS,
    schema: bmiSchema as unknown as z.ZodType<BMIFormInputs>,
    calculate: calculateBMIFn,
    storageKey: 'bmi-calculator',
  });

  // Handle unit toggle
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    setInput('unit', newUnit);

    // Convert values when switching units
    if (newUnit === 'metric' && inputs.unit === 'imperial') {
      // Convert lbs to kg
      const weightKg = Math.round(inputs.weight * 0.453592 * 10) / 10;
      setInput('weight', weightKg);
      // Convert feet/inches to cm
      const totalInches = feetInchesToInches(inputs.heightFeet, inputs.heightInches);
      const heightCm = Math.round(totalInches * 2.54);
      setInput('heightCm', heightCm);
    } else if (newUnit === 'imperial' && inputs.unit === 'metric') {
      // Convert kg to lbs
      const weightLbs = Math.round(inputs.weight / 0.453592);
      setInput('weight', weightLbs);
      // Convert cm to feet/inches
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

  const formula = inputs.unit === 'imperial'
    ? 'BMI = (weight × 703) / height²'
    : 'BMI = weight / height²';

  const formulaExplanation = inputs.unit === 'imperial'
    ? 'Where weight is in pounds and height is in inches'
    : 'Where weight is in kg and height is in meters';

  return (
    <CalculatorBase
      title="BMI Calculator"
      description="Calculate your Body Mass Index to assess if your weight is healthy for your height"
      formula={formula}
      formulaExplanation={formulaExplanation}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <ResultDisplay
                label="Your BMI"
                value={results.bmi.toFixed(1)}
                highlight
                copyable
              />
              <CategoryBadge category={results.category} />
            </div>

            <BMIScale bmi={results.bmi} category={results.category} />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <ResultDisplay
                label="Healthy Weight Range"
                value={`${results.healthyWeightRange.min} - ${results.healthyWeightRange.max}`}
                unit={inputs.unit === 'imperial' ? 'lbs' : 'kg'}
              />
              <ResultDisplay
                label="Your Weight"
                value={inputs.unit === 'imperial' ? inputs.weight : results.weightKg}
                unit={inputs.unit === 'imperial' ? 'lbs' : 'kg'}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                {results.recommendation}
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

      {/* Weight Input */}
      <NumberInput
        id="weight"
        label="Weight"
        value={inputs.weight}
        onChange={(v) => setInput('weight', v)}
        min={inputs.unit === 'imperial' ? 50 : 20}
        max={inputs.unit === 'imperial' ? 1000 : 500}
        step={inputs.unit === 'imperial' ? 1 : 0.1}
        unit={inputs.unit === 'imperial' ? 'lbs' : 'kg'}
        error={errors.weight}
        required
      />

      {/* Height Input - Imperial */}
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

      {/* Height Input - Metric */}
      {inputs.unit === 'metric' && (
        <NumberInput
          id="heightCm"
          label="Height"
          value={inputs.heightCm}
          onChange={(v) => setInput('heightCm', v)}
          min={90}
          max={275}
          step={1}
          unit="cm"
          error={errors.heightCm}
          required
        />
      )}
    </CalculatorBase>
  );
}

export default BMICalculator;
