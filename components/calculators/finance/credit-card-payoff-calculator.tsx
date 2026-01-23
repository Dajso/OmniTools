'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  balance: z.number().min(1, 'Balance must be positive'),
  apr: z.number().min(0, 'APR cannot be negative').max(50, 'APR too high'),
  monthlyPayment: z.number().min(0, 'Payment cannot be negative'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  minimumPayment: number;
}

const INITIAL_INPUTS: FormInputs = {
  balance: 5000,
  apr: 19.99,
  monthlyPayment: 200,
};

function calculatePayoff(inputs: FormInputs): Results {
  const monthlyRate = inputs.apr / 100 / 12;
  const minimumPayment = Math.max(inputs.balance * 0.02, 25);

  let balance = inputs.balance;
  let months = 0;
  let totalInterest = 0;
  const payment = Math.max(inputs.monthlyPayment, minimumPayment);

  while (balance > 0 && months < 600) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance = balance + interest - payment;
    months++;
    if (balance < 0) balance = 0;
  }

  return {
    monthsToPayoff: months,
    totalInterest,
    totalPayment: inputs.balance + totalInterest,
    minimumPayment,
  };
}

export function CreditCardPayoffCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculatePayoff,
      storageKey: 'credit-card-payoff',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  return (
    <CalculatorBase
      title="Credit Card Payoff Calculator"
      description="Calculate how long it will take to pay off your credit card debt"
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
            <ResultDisplay label="Minimum Payment" value={formatCurrency(results.minimumPayment)} />
          </div>
        </div>
      )}
    >
      <NumberInput id="balance" label="Current Balance" value={inputs.balance}
        onChange={(v) => setInput('balance', v)} min={1} step={100} unit="$" error={errors.balance} required />
      <NumberInput id="apr" label="Annual Interest Rate (APR)" value={inputs.apr}
        onChange={(v) => setInput('apr', v)} min={0} max={50} step={0.01} unit="%" error={errors.apr} required />
      <NumberInput id="monthlyPayment" label="Monthly Payment" value={inputs.monthlyPayment}
        onChange={(v) => setInput('monthlyPayment', v)} min={0} step={25} unit="$" error={errors.monthlyPayment} required />
    </CalculatorBase>
  );
}

export default CreditCardPayoffCalculator;
