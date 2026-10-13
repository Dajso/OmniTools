'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  loanBalance: z.number().min(1000, 'Gjelden må være minst 1 000 kr'),
  currentRate: z.number().min(0.1, 'Renten må være større enn null').max(20, 'Renten er for høy'),
  newRate: z.number().min(0.1, 'Renten må være større enn null').max(20, 'Renten er for høy'),
  remainingTerm: z.number().min(12, 'Minst 12 måneder').max(360, 'Maks 360 måneder'),
  closingCosts: z.number().min(0, 'Kan ikke være negativ'),
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
  loanBalance: 2500000,
  currentRate: 5.9,
  newRate: 5.3,
  remainingTerm: 300,
  closingCosts: 3000,
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

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Refinansieringskalkulator"
      description="Finn ut om det lønner seg å refinansiere boliglånet"
      formula="Månedlig besparelse = Dagens terminbeløp − Nytt terminbeløp"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={results.totalSavings > 0 ? "Total besparelse" : "Total kostnad"}
            value={formatCurrency(Math.abs(results.totalSavings))}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Dagens terminbeløp" value={formatCurrency(results.currentPayment)} copyable />
            <ResultDisplay label="Nytt terminbeløp" value={formatCurrency(results.newPayment)} copyable />
            <ResultDisplay label="Månedlig besparelse" value={formatCurrency(results.monthlySavings)} copyable />
            <ResultDisplay label="Tilbakebetalingstid" value={`${results.breakEvenMonths} måneder`} />
          </div>
        </div>
      )}
    >
      <NumberInput id="loanBalance" label="Dagens restgjeld" value={inputs.loanBalance}
        onChange={(v) => setInput('loanBalance', v)} min={1000} step={5000} unit="kr" error={errors.loanBalance} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="currentRate" label="Dagens rente" value={inputs.currentRate}
          onChange={(v) => setInput('currentRate', v)} min={0.1} max={20} step={0.125} unit="%" error={errors.currentRate} required />
        <NumberInput id="newRate" label="Ny rente" value={inputs.newRate}
          onChange={(v) => setInput('newRate', v)} min={0.1} max={20} step={0.125} unit="%" error={errors.newRate} required />
      </div>
      <NumberInput id="remainingTerm" label="Gjenstående nedbetalingstid" value={inputs.remainingTerm}
        onChange={(v) => setInput('remainingTerm', v)} min={12} max={360} step={12} unit="måneder" error={errors.remainingTerm} />
      <NumberInput id="closingCosts" label="Kostnader ved refinansiering" value={inputs.closingCosts}
        onChange={(v) => setInput('closingCosts', v)} min={0} step={500} unit="kr" error={errors.closingCosts} />
    </CalculatorBase>
  );
}

export default RefinanceCalculator;
