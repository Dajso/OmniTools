'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateBMI,
  type BMIResults,
  type BMICategory,
} from '@/lib/calculations/health/bmi-calculator';
import { formatNumber } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

const bmiSchema = z.object({
  weight: z.number().min(20, 'Vekten må være minst 20 kg').max(500, 'Vekten er for høy'),
  heightCm: z.number().min(90, 'Høyden må være minst 90 cm').max(275, 'Høyden er for stor'),
});

type BMIFormInputs = z.infer<typeof bmiSchema>;

const INITIAL_INPUTS: BMIFormInputs = { weight: 75, heightCm: 175 };

const CATEGORY_CONFIG: Record<BMICategory, { color: string; label: string; bgColor: string }> = {
  underweight: { color: 'text-blue-600', label: 'Undervekt', bgColor: 'bg-blue-100' },
  normal: { color: 'text-green-600', label: 'Normalvekt', bgColor: 'bg-green-100' },
  overweight: { color: 'text-yellow-600', label: 'Overvekt', bgColor: 'bg-yellow-100' },
  obese: { color: 'text-red-600', label: 'Fedme', bgColor: 'bg-red-100' },
};

function BMIScale({ bmi }: { bmi: number }) {
  const minBMI = 15;
  const maxBMI = 40;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
  const position = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;

  return (
    <div className="mt-4">
      <div className="relative h-4 rounded-full overflow-hidden flex">
        <div className="w-[14%] bg-blue-400" title="Undervekt" />
        <div className="w-[26%] bg-green-400" title="Normalvekt" />
        <div className="w-[20%] bg-yellow-400" title="Overvekt" />
        <div className="w-[40%] bg-red-400" title="Fedme" />
      </div>
      <div className="relative h-0" style={{ left: `${position}%` }}>
        <div
          className="absolute -top-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>15</span>
        <span>18,5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: BMICategory }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', config.bgColor, config.color)}>
      {config.label}
    </span>
  );
}

function calculateBMIFn(formInputs: BMIFormInputs): BMIResults {
  return calculateBMI({ weight: formInputs.weight, height: formInputs.heightCm, unit: 'metric' });
}

export function BMICalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<BMIFormInputs, BMIResults>({
      initialInputs: INITIAL_INPUTS,
      schema: bmiSchema,
      calculate: calculateBMIFn,
      storageKey: 'bmi-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="KMI-kalkulator (BMI)"
      description="Regn ut kroppsmasseindeks (KMI/BMI) og se om vekten er sunn for høyden din"
      formula="KMI = vekt (kg) ÷ høyde (m)²"
      formulaExplanation="Vekten oppgis i kilo og høyden i meter. Grensene følger WHO: under 18,5 er undervekt, 18,5–24,9 normalvekt, 25–29,9 overvekt og 30 eller mer fedme."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Din KMI" value={formatNumber(results.bmi, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} highlight copyable />
            <CategoryBadge category={results.category} />
          </div>

          <BMIScale bmi={results.bmi} />

          <div className="grid grid-cols-2 gap-3 mt-4">
            <ResultDisplay
              label="Normalvekt for din høyde"
              value={`${formatNumber(results.healthyWeightRange.min, { maximumFractionDigits: 1 })} – ${formatNumber(results.healthyWeightRange.max, { maximumFractionDigits: 1 })}`}
              unit="kg"
            />
            <ResultDisplay label="Din vekt" value={formatNumber(results.weightKg, { maximumFractionDigits: 1 })} unit="kg" />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">{results.recommendation}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            KMI er et grovt mål og tar ikke hensyn til muskelmasse, alder eller hvor fettet sitter. Midjemål og fastlegens vurdering gir et bedre bilde av helsen.
          </p>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="weight" label="Vekt" value={inputs.weight} onChange={(v) => setInput('weight', v)} min={20} max={500} step={0.1} unit="kg" error={errors.weight} required />
        <NumberInput id="heightCm" label="Høyde" value={inputs.heightCm} onChange={(v) => setInput('heightCm', v)} min={90} max={275} step={1} unit="cm" error={errors.heightCm} required />
      </div>
    </CalculatorBase>
  );
}

export default BMICalculator;
