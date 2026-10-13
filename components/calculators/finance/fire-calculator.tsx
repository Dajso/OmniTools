'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency, formatFixed } from '@/lib/utils/formatting';

const schema = z.object({
  annualExpenses: z.number().min(1, 'Utgiftene må være større enn null'),
  currentSavings: z.number().min(0, 'Kan ikke være negativ'),
  annualSavings: z.number().min(0, 'Kan ikke være negativ'),
  expectedReturn: z.number().min(0, 'Kan ikke være negativ').max(20, 'Urealistisk avkastning'),
  withdrawalRate: z.number().min(2, 'Minst 2 %').max(6, 'Maks 6 %'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  fireNumber: number;
  yearsToFire: number;
  safeWithdrawal: number;
  progress: number;
}

const INITIAL_INPUTS: FormInputs = {
  annualExpenses: 400000,
  currentSavings: 500000,
  annualSavings: 200000,
  expectedReturn: 5,
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
      storageKey: 'fire-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="FIRE-kalkulator"
      description="Beregn hvor mye du må ha spart for å bli økonomisk uavhengig og kunne gå av tidlig"
      formula="FIRE-tall = Årlige utgifter ÷ Uttaksrate"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="FIRE-tall" value={formatCurrency(results.fireNumber)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="År til FIRE" value={`${formatFixed(results.yearsToFire, 1)} år`} />
            <ResultDisplay label="Trygt årlig uttak" value={formatCurrency(results.safeWithdrawal)} copyable />
            <ResultDisplay label="Fremdrift så langt" value={`${formatFixed(results.progress, 1)}%`} />
          </div>
        </div>
      )}
    >
      <NumberInput id="annualExpenses" label="Årlige utgifter" value={inputs.annualExpenses}
        onChange={(v) => setInput('annualExpenses', v)} min={1} step={1000} unit="kr" error={errors.annualExpenses} required />
      <NumberInput id="currentSavings" label="Sparing i dag" value={inputs.currentSavings}
        onChange={(v) => setInput('currentSavings', v)} min={0} step={5000} unit="kr" error={errors.currentSavings} />
      <NumberInput id="annualSavings" label="Sparing per år" value={inputs.annualSavings}
        onChange={(v) => setInput('annualSavings', v)} min={0} step={1000} unit="kr" error={errors.annualSavings} />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="expectedReturn" label="Forventet avkastning" value={inputs.expectedReturn}
          onChange={(v) => setInput('expectedReturn', v)} min={0} max={20} step={0.5} unit="%" error={errors.expectedReturn} />
        <NumberInput id="withdrawalRate" label="Uttaksrate" value={inputs.withdrawalRate}
          onChange={(v) => setInput('withdrawalRate', v)} min={2} max={6} step={0.5} unit="%" error={errors.withdrawalRate} />
      </div>
    </CalculatorBase>
  );
}

export default FireCalculator;
