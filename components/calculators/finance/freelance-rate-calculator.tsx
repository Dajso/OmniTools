'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  desiredIncome: z.number().min(1000, 'Income must be at least $1,000'),
  billableHoursPerWeek: z.number().min(1, 'Must be at least 1 hour').max(60, 'Max 60 hours'),
  weeksPerYear: z.number().min(1, 'Must be at least 1 week').max(52, 'Max 52 weeks'),
  annualExpenses: z.number().min(0, 'Cannot be negative'),
  taxRate: z.number().min(0, 'Cannot be negative').max(50, 'Rate too high'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  totalNeeded: number;
}

const INITIAL_INPUTS: FormInputs = {
  desiredIncome: 80000,
  billableHoursPerWeek: 30,
  weeksPerYear: 48,
  annualExpenses: 10000,
  taxRate: 25,
};

function calculateFreelanceRate(inputs: FormInputs): Results {
  const grossNeeded = (inputs.desiredIncome + inputs.annualExpenses) / (1 - inputs.taxRate / 100);
  const totalBillableHours = inputs.billableHoursPerWeek * inputs.weeksPerYear;
  const hourlyRate = grossNeeded / totalBillableHours;
  const dailyRate = hourlyRate * 8;
  const monthlyRate = grossNeeded / 12;

  return {
    hourlyRate,
    dailyRate,
    monthlyRate,
    totalNeeded: grossNeeded,
  };
}

export function FreelanceRateCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateFreelanceRate,
      storageKey: 'freelance-rate-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Freelance Rate Calculator"
      description="Calculate your ideal freelance hourly rate based on income goals"
      formula="Hourly Rate = (Income + Expenses) ÷ (1 - Tax Rate) ÷ Billable Hours"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Recommended Hourly Rate" value={formatCurrency(results.hourlyRate)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Daily Rate (8 hrs)" value={formatCurrency(results.dailyRate)} copyable />
            <ResultDisplay label="Monthly Target" value={formatCurrency(results.monthlyRate)} copyable />
            <ResultDisplay label="Annual Gross Needed" value={formatCurrency(results.totalNeeded)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="desiredIncome" label="Desired Annual Take-Home" value={inputs.desiredIncome}
        onChange={(v) => setInput('desiredIncome', v)} min={1000} step={5000} unit="$" error={errors.desiredIncome} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="billableHoursPerWeek" label="Billable Hours/Week" value={inputs.billableHoursPerWeek}
          onChange={(v) => setInput('billableHoursPerWeek', v)} min={1} max={60} step={5} unit="hrs" error={errors.billableHoursPerWeek} />
        <NumberInput id="weeksPerYear" label="Working Weeks/Year" value={inputs.weeksPerYear}
          onChange={(v) => setInput('weeksPerYear', v)} min={1} max={52} step={1} unit="weeks" error={errors.weeksPerYear} />
      </div>
      <NumberInput id="annualExpenses" label="Annual Business Expenses" value={inputs.annualExpenses}
        onChange={(v) => setInput('annualExpenses', v)} min={0} step={1000} unit="$" error={errors.annualExpenses} />
      <NumberInput id="taxRate" label="Estimated Tax Rate" value={inputs.taxRate}
        onChange={(v) => setInput('taxRate', v)} min={0} max={50} step={5} unit="%" error={errors.taxRate} />
    </CalculatorBase>
  );
}

export default FreelanceRateCalculator;
