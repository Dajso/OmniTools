'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  carPrice: z.number().min(1000, 'Prisen må være minst 1 000 kr'),
  downPayment: z.number().min(0, 'Kan ikke være negativ'),
  loanTerm: z.number().min(12, 'Minst 12 måneder').max(84, 'Maks 84 måneder'),
  loanApr: z.number().min(0, 'Kan ikke være negativ').max(30, 'Renten er for høy'),
  leaseTerm: z.number().min(12, 'Minst 12 måneder').max(60, 'Maks 60 måneder'),
  leaseMonthly: z.number().min(0, 'Kan ikke være negativ'),
  residualValue: z.number().min(0, 'Kan ikke være negativ'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  totalBuyCost: number;
  totalLeaseCost: number;
  buyMonthlyPayment: number;
  savings: number;
  recommendation: string;
}

const INITIAL_INPUTS: FormInputs = {
  carPrice: 450000,
  downPayment: 90000,
  loanTerm: 60,
  loanApr: 7,
  leaseTerm: 36,
  leaseMonthly: 4500,
  residualValue: 220000,
};

function calculateLeaseVsBuy(inputs: FormInputs): Results {
  const loanAmount = inputs.carPrice - inputs.downPayment;
  const monthlyRate = inputs.loanApr / 100 / 12;
  const buyMonthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, inputs.loanTerm)) / (Math.pow(1 + monthlyRate, inputs.loanTerm) - 1)
    : loanAmount / inputs.loanTerm;

  const totalBuyCost = inputs.downPayment + (buyMonthlyPayment * inputs.loanTerm) - inputs.residualValue;
  const totalLeaseCost = inputs.leaseMonthly * inputs.leaseTerm;
  const savings = Math.abs(totalBuyCost - totalLeaseCost);

  return {
    totalBuyCost,
    totalLeaseCost,
    buyMonthlyPayment,
    savings,
    recommendation: totalBuyCost < totalLeaseCost ? 'Kjøp er billigst' : 'Leasing er billigst',
  };
}

export function CarLeaseVsBuyCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateLeaseVsBuy,
      storageKey: 'car-lease-vs-buy-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Leasing eller kjøp av bil"
      description="Sammenlign totalkostnaden ved å leasing eller kjøpe bil"
      formula="Kjøpskostnad = Egenandel + Månedlige terminer − Restverdi"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Billigste alternativ" value={results.recommendation} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Totalkostnad ved kjøp" value={formatCurrency(results.totalBuyCost)} copyable />
            <ResultDisplay label="Totalkostnad ved leasing" value={formatCurrency(results.totalLeaseCost)} copyable />
            <ResultDisplay label="Månedlig termin ved kjøp" value={formatCurrency(results.buyMonthlyPayment)} copyable />
            <ResultDisplay label="Mulig besparelse" value={formatCurrency(results.savings)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="carPrice" label="Bilpris" value={inputs.carPrice}
        onChange={(v) => setInput('carPrice', v)} min={1000} step={1000} unit="kr" error={errors.carPrice} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="downPayment" label="Egenandel" value={inputs.downPayment}
          onChange={(v) => setInput('downPayment', v)} min={0} step={500} unit="kr" error={errors.downPayment} />
        <NumberInput id="residualValue" label="Bilens verdi når lånet er nedbetalt" value={inputs.residualValue}
          onChange={(v) => setInput('residualValue', v)} min={0} step={1000} unit="kr" error={errors.residualValue} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="loanTerm" label="Lånetid" value={inputs.loanTerm}
          onChange={(v) => setInput('loanTerm', v)} min={12} max={84} step={12} unit="måneder" error={errors.loanTerm} />
        <NumberInput id="loanApr" label="Lånerente" value={inputs.loanApr}
          onChange={(v) => setInput('loanApr', v)} min={0} max={30} step={0.1} unit="%" error={errors.loanApr} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="leaseTerm" label="Leasingperiode" value={inputs.leaseTerm}
          onChange={(v) => setInput('leaseTerm', v)} min={12} max={60} step={12} unit="måneder" error={errors.leaseTerm} />
        <NumberInput id="leaseMonthly" label="Månedlig leasingleie" value={inputs.leaseMonthly}
          onChange={(v) => setInput('leaseMonthly', v)} min={0} step={25} unit="kr" error={errors.leaseMonthly} />
      </div>
      <p className="text-xs text-muted-foreground">
        Sammenligningen tar ikke med forsikring, vedlikehold, årsavgift eller kjørelengdebegrensninger i leasingavtalen.
      </p>
    </CalculatorBase>
  );
}

export default CarLeaseVsBuyCalculator;
