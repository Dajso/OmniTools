'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  loanBalance: z.number().min(1, 'Balance must be positive'),
  interestRate: z.number().min(0, 'Cannot be negative').max(20, 'Rate too high'),
  monthlyPayment: z.number().min(1, 'Payment must be positive'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
}

const INITIAL_INPUTS: FormInputs = {
  loanBalance: 30000,
  interestRate: 5.5,
  monthlyPayment: 350,
};

function calculateStudentLoan(inputs: FormInputs): Results {
  const monthlyRate = inputs.interestRate / 100 / 12;
  let balance = inputs.loanBalance;
  let months = 0;
  let totalInterest = 0;
  
  while (balance > 0 && months < 600) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance = balance + interest - inputs.monthlyPayment;
    months++;
    if (balance < 0) balance = 0;
  }
  
  return {
    monthsToPayoff: months,
    totalInterest,
    totalPayment: inputs.loanBalance + totalInterest,
  };
}

export function StudentLoanPayoffCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateStudentLoan,
      storageKey: 'student-loan-payoff',
    });

  React.useEffect(() => { calculate(); }, []);

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <CalculatorBase
      title="Student Loan Payoff Calculator"
      description="Calculate your student loan payoff timeline and total interest"
      formula="Months = -log(1 - (r × B / P)) / log(1 + r)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Time to Pay Off" value={formatMonths(results.monthsToPayoff)} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Interest" value={formatCurrency(results.totalInterest)} copyable />
            <ResultDisplay label="Total Payment" value={formatCurrency(results.totalPayment)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="loanBalance" label="Loan Balance" value={inputs.loanBalance} 
        onChange={(v) => setInput('loanBalance', v)} min={1} step={1000} unit="$" error={errors.loanBalance} required />
      <NumberInput id="interestRate" label="Interest Rate" value={inputs.interestRate}
        onChange={(v) => setInput('interestRate', v)} min={0} max={20} step={0.1} unit="%" error={errors.interestRate} required />
      <NumberInput id="monthlyPayment" label="Monthly Payment" value={inputs.monthlyPayment}
        onChange={(v) => setInput('monthlyPayment', v)} min={1} step={50} unit="$" error={errors.monthlyPayment} required />
    </CalculatorBase>
  );
}

export default StudentLoanPayoffCalculator;
