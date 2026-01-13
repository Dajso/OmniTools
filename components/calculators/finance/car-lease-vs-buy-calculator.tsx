'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  carPrice: z.number().min(1000, 'Price must be at least $1,000'),
  downPayment: z.number().min(0, 'Cannot be negative'),
  loanTerm: z.number().min(12, 'Min 12 months').max(84, 'Max 84 months'),
  loanApr: z.number().min(0, 'Cannot be negative').max(30, 'Rate too high'),
  leaseTerm: z.number().min(12, 'Min 12 months').max(60, 'Max 60 months'),
  leaseMonthly: z.number().min(0, 'Cannot be negative'),
  residualValue: z.number().min(0, 'Cannot be negative'),
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
  carPrice: 35000,
  downPayment: 5000,
  loanTerm: 60,
  loanApr: 6.5,
  leaseTerm: 36,
  leaseMonthly: 350,
  residualValue: 20000,
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
    recommendation: totalBuyCost < totalLeaseCost ? 'Buying is cheaper' : 'Leasing is cheaper',
  };
}

export function CarLeaseVsBuyCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateLeaseVsBuy,
      storageKey: 'car-lease-vs-buy',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Car Lease vs Buy Calculator"
      description="Compare the total cost of leasing versus buying a car"
      formula="Total Buy Cost = Down Payment + Monthly Payments - Residual Value"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Recommendation" value={results.recommendation} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Cost to Buy" value={formatCurrency(results.totalBuyCost)} copyable />
            <ResultDisplay label="Total Cost to Lease" value={formatCurrency(results.totalLeaseCost)} copyable />
            <ResultDisplay label="Buy Monthly Payment" value={formatCurrency(results.buyMonthlyPayment)} copyable />
            <ResultDisplay label="Potential Savings" value={formatCurrency(results.savings)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="carPrice" label="Car Price" value={inputs.carPrice} 
        onChange={(v) => setInput('carPrice', v)} min={1000} step={1000} unit="$" error={errors.carPrice} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="downPayment" label="Down Payment" value={inputs.downPayment}
          onChange={(v) => setInput('downPayment', v)} min={0} step={500} unit="$" error={errors.downPayment} />
        <NumberInput id="residualValue" label="Residual Value (after loan)" value={inputs.residualValue}
          onChange={(v) => setInput('residualValue', v)} min={0} step={1000} unit="$" error={errors.residualValue} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="loanTerm" label="Loan Term" value={inputs.loanTerm}
          onChange={(v) => setInput('loanTerm', v)} min={12} max={84} step={12} unit="months" error={errors.loanTerm} />
        <NumberInput id="loanApr" label="Loan APR" value={inputs.loanApr}
          onChange={(v) => setInput('loanApr', v)} min={0} max={30} step={0.1} unit="%" error={errors.loanApr} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="leaseTerm" label="Lease Term" value={inputs.leaseTerm}
          onChange={(v) => setInput('leaseTerm', v)} min={12} max={60} step={12} unit="months" error={errors.leaseTerm} />
        <NumberInput id="leaseMonthly" label="Lease Monthly Payment" value={inputs.leaseMonthly}
          onChange={(v) => setInput('leaseMonthly', v)} min={0} step={25} unit="$" error={errors.leaseMonthly} />
      </div>
    </CalculatorBase>
  );
}

export default CarLeaseVsBuyCalculator;
