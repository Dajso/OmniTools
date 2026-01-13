'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  loanBalance: z.number().min(1000, 'Balance must be at least $1,000'),
  currentRate: z.number().min(0.1, 'Rate must be positive').max(20, 'Rate too high'),
  newRate: z.number().min(0.1, 'Rate must be positive').max(20, 'Rate too high'),
  remainingTerm: z.number().min(12, 'Min 12 months').max(360, 'Max 360 months'),
  closingCosts: z.number().min(0, 'Cannot be negative'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number;
}

const INITIAL_INPUTS: FormInputs = {
  loanBalance: 250000,
  currentRate: 6.5,
  newRate: 5.5,
  remainingTerm: 300,
  closingCosts: 5000,
};

function calculateRefinance(inputs: FormInputs): Results {
  const currentMonthlyRate = inputs.currentRate / 100 / 12;
  const newMonthlyRate = inputs.newRate / 100 / 12;
  
  const currentPayment = (inputs.loanBalance * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, inputs.remainingTerm)) / 
    (Math.pow(1 + currentMonthlyRate, inputs.remainingTerm) - 1);
  
  const newPayment = (inputs.loanBalance * newMonthlyRate * Math.pow(1 + newMonthlyRate, inputs.remainingTerm)) / 
    (Math.pow(1 + newMonthlyRate, inputs.remainingTerm) - 1);
  
  const monthlySavings = currentPayment - newPayment;
  const totalSavings = (monthlySavings * inputs.remainingTerm) - inputs.closingCosts;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(inputs.closingCosts / monthlySavings) : 0;
  
  return {
    currentPayment,
    newPayment,
    monthlySavings,
    totalSavings,
    breakEvenMonths,
  };
}

export function RefinanceCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateRefinance,
      storageKey: 'refinance-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Refinance Calculator"
      description="Calculate if refinancing your mortgage makes financial sense"
      formula="Monthly Savings = Current Payment - New Payment"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay 
            label={results.totalSavings > 0 ? "Total Savings" : "Total Cost"} 
            value={formatCurrency(Math.abs(results.totalSavings))} 
            highlight 
            copyable 
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Current Payment" value={formatCurrency(results.currentPayment)} copyable />
            <ResultDisplay label="New Payment" value={formatCurrency(results.newPayment)} copyable />
            <ResultDisplay label="Monthly Savings" value={formatCurrency(results.monthlySavings)} copyable />
            <ResultDisplay label="Break-Even" value={`${results.breakEvenMonths} months`} />
          </div>
        </div>
      )}
    >
      <NumberInput id="loanBalance" label="Current Loan Balance" value={inputs.loanBalance} 
        onChange={(v) => setInput('loanBalance', v)} min={1000} step={5000} unit="$" error={errors.loanBalance} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="currentRate" label="Current Interest Rate" value={inputs.currentRate}
          onChange={(v) => setInput('currentRate', v)} min={0.1} max={20} step={0.125} unit="%" error={errors.currentRate} required />
        <NumberInput id="newRate" label="New Interest Rate" value={inputs.newRate}
          onChange={(v) => setInput('newRate', v)} min={0.1} max={20} step={0.125} unit="%" error={errors.newRate} required />
      </div>
      <NumberInput id="remainingTerm" label="Remaining Term" value={inputs.remainingTerm}
        onChange={(v) => setInput('remainingTerm', v)} min={12} max={360} step={12} unit="months" error={errors.remainingTerm} />
      <NumberInput id="closingCosts" label="Closing Costs" value={inputs.closingCosts}
        onChange={(v) => setInput('closingCosts', v)} min={0} step={500} unit="$" error={errors.closingCosts} />
    </CalculatorBase>
  );
}

export default RefinanceCalculator;
