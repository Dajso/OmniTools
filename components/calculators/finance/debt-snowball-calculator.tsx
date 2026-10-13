'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  debt1Balance: z.number().min(0, 'Kan ikke være negativ'),
  debt1Rate: z.number().min(0, 'Kan ikke være negativ').max(50, 'Renten er for høy'),
  debt1MinPayment: z.number().min(0, 'Kan ikke være negativ'),
  debt2Balance: z.number().min(0, 'Kan ikke være negativ'),
  debt2Rate: z.number().min(0, 'Kan ikke være negativ').max(50, 'Renten er for høy'),
  debt2MinPayment: z.number().min(0, 'Kan ikke være negativ'),
  extraPayment: z.number().min(0, 'Kan ikke være negativ'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  totalDebt: number;
  totalInterest: number;
  monthsToPayoff: number;
  payoffOrder: string;
}

const INITIAL_INPUTS: FormInputs = {
  debt1Balance: 40000,
  debt1Rate: 21,
  debt1MinPayment: 1200,
  debt2Balance: 120000,
  debt2Rate: 14,
  debt2MinPayment: 2500,
  extraPayment: 1000,
};

function calculateDebtSnowball(inputs: FormInputs): Results {
  const debts = [
    { name: 'Gjeld 1', balance: inputs.debt1Balance, rate: inputs.debt1Rate, minPayment: inputs.debt1MinPayment },
    { name: 'Gjeld 2', balance: inputs.debt2Balance, rate: inputs.debt2Rate, minPayment: inputs.debt2MinPayment },
  ].filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance);

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  let totalInterest = 0;
  let months = 0;
  const payoffOrder: string[] = [];
  let extraPayment = inputs.extraPayment;

  const balances = debts.map(d => d.balance);

  while (balances.some(b => b > 0) && months < 600) {
    months++;
    for (let i = 0; i < debts.length; i++) {
      if (balances[i] <= 0) continue;
      const interest = balances[i] * (debts[i].rate / 100 / 12);
      totalInterest += interest;
      let payment = debts[i].minPayment;
      if (i === balances.findIndex(b => b > 0)) {
        payment += extraPayment;
      }
      balances[i] = balances[i] + interest - payment;
      if (balances[i] <= 0) {
        payoffOrder.push(debts[i].name);
        extraPayment += debts[i].minPayment;
        balances[i] = 0;
      }
    }
  }

  return {
    totalDebt,
    totalInterest,
    monthsToPayoff: months,
    payoffOrder: payoffOrder.join(' → ') || 'Ingen gjeld',
  };
}

export function DebtSnowballCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateDebtSnowball,
      storageKey: 'debt-snowball-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <CalculatorBase
      title="Snøballmetoden for gjeld"
      description="Lag en plan for å bli kvitt gjelden med snøballmetoden (minste gjeld først)"
      formula="Betal minstebeløpet på all gjeld, og legg ekstra på den minste gjelden"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Gjeldfri om" value={formatMonths(results.monthsToPayoff)} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Total gjeld" value={formatCurrency(results.totalDebt)} copyable />
            <ResultDisplay label="Sum renter" value={formatCurrency(results.totalInterest)} copyable />
          </div>
          <ResultDisplay label="Nedbetalingsrekkefølge" value={results.payoffOrder} />
        </div>
      )}
    >
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Gjeld 1</h3>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput id="debt1Balance" label="Saldo" value={inputs.debt1Balance}
            onChange={(v) => setInput('debt1Balance', v)} min={0} step={100} unit="kr" error={errors.debt1Balance} />
          <NumberInput id="debt1Rate" label="Rente" value={inputs.debt1Rate}
            onChange={(v) => setInput('debt1Rate', v)} min={0} max={50} step={0.5} unit="%" error={errors.debt1Rate} />
          <NumberInput id="debt1MinPayment" label="Minstebeløp per måned" value={inputs.debt1MinPayment}
            onChange={(v) => setInput('debt1MinPayment', v)} min={0} step={25} unit="kr" error={errors.debt1MinPayment} />
        </div>
      </div>
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Gjeld 2</h3>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput id="debt2Balance" label="Saldo" value={inputs.debt2Balance}
            onChange={(v) => setInput('debt2Balance', v)} min={0} step={100} unit="kr" error={errors.debt2Balance} />
          <NumberInput id="debt2Rate" label="Rente" value={inputs.debt2Rate}
            onChange={(v) => setInput('debt2Rate', v)} min={0} max={50} step={0.5} unit="%" error={errors.debt2Rate} />
          <NumberInput id="debt2MinPayment" label="Minstebeløp per måned" value={inputs.debt2MinPayment}
            onChange={(v) => setInput('debt2MinPayment', v)} min={0} step={25} unit="kr" error={errors.debt2MinPayment} />
        </div>
      </div>
      <NumberInput id="extraPayment" label="Ekstra månedlig innbetaling" value={inputs.extraPayment}
        onChange={(v) => setInput('extraPayment', v)} min={0} step={50} unit="kr" error={errors.extraPayment} />
    </CalculatorBase>
  );
}

export default DebtSnowballCalculator;
