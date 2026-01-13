'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  monthlyExpenses: z.number().min(100, 'Expenses must be at least $100'),
  monthsOfCoverage: z.number().min(3, 'Min 3 months').max(12, 'Max 12 months'),
  currentSavings: z.number().min(0, 'Cannot be negative'),
  monthlySavingsRate: z.number().min(0, 'Cannot be negative'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  targetAmount: number;
  amountNeeded: number;
  progress: number;
  monthsToGoal: number;
}

const INITIAL_INPUTS: FormInputs = {
  monthlyExpenses: 4000,
  monthsOfCoverage: 6,
  currentSavings: 5000,
  monthlySavingsRate: 500,
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

  React.useEffect(() => { calculate(); }, []);

  const COVERAGE_PRESETS = [3, 6, 9, 12];

  return (
    <CalculatorBase
      title="Emergency Fund Calculator"
      description="Calculate how much you need in your emergency fund"
      formula="Target = Monthly Expenses × Months of Coverage"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Target Emergency Fund" value={formatCurrency(results.targetAmount)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Amount Still Needed" value={formatCurrency(results.amountNeeded)} copyable />
            <ResultDisplay label="Current Progress" value={`${results.progress.toFixed(1)}%`} />
            {results.monthsToGoal > 0 && (
              <ResultDisplay label="Months to Goal" value={`${results.monthsToGoal} months`} />
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
      <NumberInput id="monthlyExpenses" label="Monthly Expenses" value={inputs.monthlyExpenses} 
        onChange={(v) => setInput('monthlyExpenses', v)} min={100} step={100} unit="$" error={errors.monthlyExpenses} required />
      
      <div className="space-y-2">
        <NumberInput id="monthsOfCoverage" label="Months of Coverage" value={inputs.monthsOfCoverage}
          onChange={(v) => setInput('monthsOfCoverage', v)} min={3} max={12} step={1} unit="months" error={errors.monthsOfCoverage} />
        <div className="flex gap-2">
          {COVERAGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput('monthsOfCoverage', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                inputs.monthsOfCoverage === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              {preset} mo
            </button>
          ))}
        </div>
      </div>

      <NumberInput id="currentSavings" label="Current Emergency Savings" value={inputs.currentSavings}
        onChange={(v) => setInput('currentSavings', v)} min={0} step={500} unit="$" error={errors.currentSavings} />
      <NumberInput id="monthlySavingsRate" label="Monthly Savings Rate" value={inputs.monthlySavingsRate}
        onChange={(v) => setInput('monthlySavingsRate', v)} min={0} step={100} unit="$" error={errors.monthlySavingsRate} />
    </CalculatorBase>
  );
}

export default EmergencyFundCalculator;
