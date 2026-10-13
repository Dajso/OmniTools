'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  monthlyExpenses: z.number().min(100, 'Utgiftene må være minst 100 kr'),
  monthsOfCoverage: z.number().min(3, 'Minst 3 måneder').max(12, 'Maks 12 måneder'),
  currentSavings: z.number().min(0, 'Kan ikke være negativ'),
  monthlySavingsRate: z.number().min(0, 'Kan ikke være negativ'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  targetAmount: number;
  amountNeeded: number;
  progress: number;
  monthsToGoal: number;
}

const INITIAL_INPUTS: FormInputs = {
  monthlyExpenses: 25000,
  monthsOfCoverage: 6,
  currentSavings: 30000,
  monthlySavingsRate: 3000,
};

function calculateEmergencyFund(inputs: FormInputs): Results {
  const targetAmount = inputs.monthlyExpenses * inputs.monthsOfCoverage;
  const amountNeeded = Math.max(0, targetAmount - inputs.currentSavings);
  const progress = Math.min(100, (inputs.currentSavings / targetAmount) * 100);
  const monthsToGoal = inputs.monthlySavingsRate > 0 ? Math.ceil(amountNeeded / inputs.monthlySavingsRate) : 0;

  return {
    targetAmount,
    amountNeeded,
    progress,
    monthsToGoal,
  };
}

export function EmergencyFundCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateEmergencyFund,
      storageKey: 'emergency-fund-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const COVERAGE_PRESETS = [3, 6, 9, 12];

  return (
    <CalculatorBase
      title="Buffersparing"
      description="Beregn hvor stor sparebuffer du trenger"
      formula="Mål = Månedlige utgifter × Antall måneder"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Målet for bufferen" value={formatCurrency(results.targetAmount)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Mangler fortsatt" value={formatCurrency(results.amountNeeded)} copyable />
            <ResultDisplay label="Fremdrift så langt" value={`${results.progress.toFixed(1)}%`} />
            {results.monthsToGoal > 0 && (
              <ResultDisplay label="Måneder til målet" value={`${results.monthsToGoal} måneder`} />
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, results.progress)}%` }}
            />
          </div>
        </div>
      )}
    >
      <NumberInput id="monthlyExpenses" label="Månedlige utgifter" value={inputs.monthlyExpenses}
        onChange={(v) => setInput('monthlyExpenses', v)} min={100} step={100} unit="kr" error={errors.monthlyExpenses} required />

      <div className="space-y-2">
        <NumberInput id="monthsOfCoverage" label="Antall måneder bufferen skal dekke" value={inputs.monthsOfCoverage}
          onChange={(v) => setInput('monthsOfCoverage', v)} min={3} max={12} step={1} unit="måneder" error={errors.monthsOfCoverage} />
        <div className="flex gap-2">
          {COVERAGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput('monthsOfCoverage', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.monthsOfCoverage === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
            >
              {preset} mnd
            </button>
          ))}
        </div>
      </div>

      <NumberInput id="currentSavings" label="Sparebuffer i dag" value={inputs.currentSavings}
        onChange={(v) => setInput('currentSavings', v)} min={0} step={500} unit="kr" error={errors.currentSavings} />
      <NumberInput id="monthlySavingsRate" label="Sparing per måned" value={inputs.monthlySavingsRate}
        onChange={(v) => setInput('monthlySavingsRate', v)} min={0} step={100} unit="kr" error={errors.monthlySavingsRate} />
    </CalculatorBase>
  );
}

export default EmergencyFundCalculator;
