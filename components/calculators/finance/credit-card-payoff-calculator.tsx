'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  balance: z.number().min(1, 'Gjelden må være større enn null'),
  apr: z.number().min(0, 'Renten kan ikke være negativ').max(50, 'Renten er for høy'),
  monthlyPayment: z.number().min(0, 'Betalingen kan ikke være negativ'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  minimumPayment: number;
}

const INITIAL_INPUTS: FormInputs = {
  balance: 40000,
  apr: 21,
  monthlyPayment: 1500,
};

function calculatePayoff(inputs: FormInputs): Results {
  const monthlyRate = inputs.apr / 100 / 12;
  const minimumPayment = Math.max(inputs.balance * 0.03, 200);

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
      storageKey: 'credit-card-payoff-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} ${months === 1 ? 'måned' : 'måneder'}`;
    if (remainingMonths === 0) return `${years} år`;
    return `${years} år og ${remainingMonths} ${remainingMonths === 1 ? 'måned' : 'måneder'}`;
  };

  return (
    <CalculatorBase
      title="Nedbetaling av kredittkortgjeld"
      description="Se hvor lang tid det tar å betale ned kredittkortgjelden"
      formula="Måneder = −log(1 − (r × G ÷ B)) ÷ log(1 + r)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Tid til gjelden er betalt" value={formatMonths(results.monthsToPayoff)} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Sum renter" value={formatCurrency(results.totalInterest)} copyable />
            <ResultDisplay label="Totalt å betale" value={formatCurrency(results.totalPayment)} copyable />
            <ResultDisplay label="Anslått minstebeløp" value={formatCurrency(results.minimumPayment)} />
          </div>
        </div>
      )}
    >
      <NumberInput id="balance" label="Gjeld i dag" value={inputs.balance}
        onChange={(v) => setInput('balance', v)} min={1} step={100} unit="kr" error={errors.balance} required />
      <NumberInput id="apr" label="Effektiv rente per år" value={inputs.apr}
        onChange={(v) => setInput('apr', v)} min={0} max={50} step={0.1} unit="%" error={errors.apr} required />
      <NumberInput id="monthlyPayment" label="Månedlig innbetaling" value={inputs.monthlyPayment}
        onChange={(v) => setInput('monthlyPayment', v)} min={0} step={25} unit="kr" error={errors.monthlyPayment} required />
      <p className="text-xs text-muted-foreground">
        Minstebeløpet varierer mellom kortutstedere. Betaler du mindre enn renten, vokser gjelden. Fast månedsbeløp gir raskest vei ut.
      </p>
    </CalculatorBase>
  );
}

export default CreditCardPayoffCalculator;
