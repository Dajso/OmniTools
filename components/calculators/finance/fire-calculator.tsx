'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  annualExpenses: z.number().min(1, 'Expenses must be positive'),
  currentSavings: z.number().min(0, 'Cannot be negative'),
  annualSavings: z.number().min(0, 'Cannot be negative'),
  expectedReturn: z.number().min(0, 'Cannot be negative').max(20, 'Unrealistic return'),
  withdrawalRate: z.number().min(2, 'Min 2%').max(6, 'Max 6%'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  fireNumber: number;
  yearsToFire: number;
  safeWithdrawal: number;
  progress: number;
}

const INITIAL_INPUTS: FormInputs = {
  annualExpenses: 50000,
  currentSavings: 100000,
  annualSavings: 25000,
  expectedReturn: 7,
  withdrawalRate: 4,
};

function calculateFire(inputs: FormInputs): Results {
  const fireNumber = inputs.annualExpenses / (inputs.withdrawalRate / 100);
  const monthlyReturn = inputs.expectedReturn / 100 / 12;
  const monthlySavings = inputs.annualSavings / 12;

  let balance = inputs.currentSavings;
  let months = 0;

  while (balance < fireNumber && months < 1200) {
    balance = balance * (1 + monthlyReturn) + monthlySavings;
    months++;
  }

  return {
    fireNumber,
    yearsToFire: months / 12,
    safeWithdrawal: fireNumber * (inputs.withdrawalRate / 100),
    progress: (inputs.currentSavings / fireNumber) * 100,
  };
}

export function FireCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateFire,
      storageKey: 'fire-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="FIRE Calculator"
      description="Calculate your Financial Independence Retire Early number"
      formula="FIRE Number = Annual Expenses ÷ Withdrawal Rate"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="FIRE Number" value={formatCurrency(results.fireNumber)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Years to FIRE" value={`${results.yearsToFire.toFixed(1)} years`} />
            <ResultDisplay label="Safe Annual Withdrawal" value={formatCurrency(results.safeWithdrawal)} copyable />
            <ResultDisplay label="Current Progress" value={`${results.progress.toFixed(1)}%`} />
          </div>
        </div>
      )}
    >
      <NumberInput id="annualExpenses" label="Annual Expenses" value={inputs.annualExpenses}
        onChange={(v) => setInput('annualExpenses', v)} min={1} step={1000} unit="$" error={errors.annualExpenses} required />
      <NumberInput id="currentSavings" label="Current Savings" value={inputs.currentSavings}
        onChange={(v) => setInput('currentSavings', v)} min={0} step={5000} unit="$" error={errors.currentSavings} />
      <NumberInput id="annualSavings" label="Annual Savings" value={inputs.annualSavings}
        onChange={(v) => setInput('annualSavings', v)} min={0} step={1000} unit="$" error={errors.annualSavings} />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="expectedReturn" label="Expected Return" value={inputs.expectedReturn}
          onChange={(v) => setInput('expectedReturn', v)} min={0} max={20} step={0.5} unit="%" error={errors.expectedReturn} />
        <NumberInput id="withdrawalRate" label="Withdrawal Rate" value={inputs.withdrawalRate}
          onChange={(v) => setInput('withdrawalRate', v)} min={2} max={6} step={0.5} unit="%" error={errors.withdrawalRate} />
      </div>
    </CalculatorBase>
  );
}

export default FireCalculator;
