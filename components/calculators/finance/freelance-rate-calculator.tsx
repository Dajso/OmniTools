'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  desiredIncome: z.number().min(1000, 'Inntekten må være minst 1 000 kr'),
  billableHoursPerWeek: z.number().min(1, 'Må være minst 1 time').max(60, 'Maks 60 timer'),
  weeksPerYear: z.number().min(1, 'Må være minst 1 uke').max(52, 'Maks 52 uker'),
  annualExpenses: z.number().min(0, 'Kan ikke være negativ'),
  taxRate: z.number().min(0, 'Kan ikke være negativ').max(50, 'Renten er for høy'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  totalNeeded: number;
}

const INITIAL_INPUTS: FormInputs = {
  desiredIncome: 600000,
  billableHoursPerWeek: 25,
  weeksPerYear: 44,
  annualExpenses: 60000,
  taxRate: 35,
};

function calculateFreelanceRate(inputs: FormInputs): Results {
  const grossNeeded = (inputs.desiredIncome + inputs.annualExpenses) / (1 - inputs.taxRate / 100);
  const totalBillableHours = inputs.billableHoursPerWeek * inputs.weeksPerYear;
  const hourlyRate = grossNeeded / totalBillableHours;
  const dailyRate = hourlyRate * 7.5;
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
      title="Timepris for frilansere"
      description="Beregn hvilken timepris du bør ta ut fra inntektsmålet ditt"
      formula="Timepris = (Ønsket inntekt + Kostnader) ÷ (1 − Skattesats) ÷ Fakturerbare timer"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Anbefalt timepris" value={formatCurrency(results.hourlyRate)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Dagspris (7,5 timer)" value={formatCurrency(results.dailyRate)} copyable />
            <ResultDisplay label="Månedlig inntektsmål" value={formatCurrency(results.monthlyRate)} copyable />
            <ResultDisplay label="Årlig omsetning som trengs" value={formatCurrency(results.totalNeeded)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="desiredIncome" label="Ønsket inntekt etter skatt per år" value={inputs.desiredIncome}
        onChange={(v) => setInput('desiredIncome', v)} min={1000} step={5000} unit="kr" error={errors.desiredIncome} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="billableHoursPerWeek" label="Fakturerbare timer per uke" value={inputs.billableHoursPerWeek}
          onChange={(v) => setInput('billableHoursPerWeek', v)} min={1} max={60} step={5} unit="timer" error={errors.billableHoursPerWeek} />
        <NumberInput id="weeksPerYear" label="Arbeidsuker per år" value={inputs.weeksPerYear}
          onChange={(v) => setInput('weeksPerYear', v)} min={1} max={52} step={1} unit="uker" error={errors.weeksPerYear} />
      </div>
      <NumberInput id="annualExpenses" label="Årlige driftskostnader" value={inputs.annualExpenses}
        onChange={(v) => setInput('annualExpenses', v)} min={0} step={1000} unit="kr" error={errors.annualExpenses} />
      <NumberInput id="taxRate" label="Anslått skattesats" value={inputs.taxRate}
        onChange={(v) => setInput('taxRate', v)} min={0} max={50} step={5} unit="%" error={errors.taxRate} />
    </CalculatorBase>
  );
}

export default FreelanceRateCalculator;
