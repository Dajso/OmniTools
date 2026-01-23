'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { convertHourlyToSalary, type HourlySalaryResults } from '@/lib/calculations/finance/hourly-salary-converter';
import { formatCurrency } from '@/lib/utils/formatting';

const hourlySalarySchema = z.object({
  hourlyRate: z.number().min(0),
  annualSalary: z.number().min(0),
  hoursPerWeek: z.number().min(1, 'Must work at least 1 hour').max(168, 'Cannot exceed 168 hours'),
  weeksPerYear: z.number().min(1, 'Must work at least 1 week').max(52, 'Cannot exceed 52 weeks'),
  mode: z.enum(['hourly', 'salary']),
});

type HourlySalaryFormInputs = z.infer<typeof hourlySalarySchema>;

const INITIAL_INPUTS: HourlySalaryFormInputs = {
  hourlyRate: 25,
  annualSalary: 52000,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  mode: 'hourly',
};


function calculateHourlySalaryFn(formInputs: HourlySalaryFormInputs): HourlySalaryResults {
  return convertHourlyToSalary({
    hourlyRate: formInputs.mode === 'hourly' ? formInputs.hourlyRate : undefined,
    annualSalary: formInputs.mode === 'salary' ? formInputs.annualSalary : undefined,
    hoursPerWeek: formInputs.hoursPerWeek,
    weeksPerYear: formInputs.weeksPerYear,
  });
}

export function HourlySalaryCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<HourlySalaryFormInputs, HourlySalaryResults>({
      initialInputs: INITIAL_INPUTS,
      schema: hourlySalarySchema,
      calculate: calculateHourlySalaryFn,
      storageKey: 'hourly-salary-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Hourly to Salary Converter"
      description="Convert between hourly wage and annual salary"
      formula="Annual = Hourly × Hours/Week × Weeks/Year"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Hourly Rate" value={formatCurrency(results.hourlyRate)} highlight={inputs.mode === 'salary'} copyable />
            <ResultDisplay label="Annual Salary" value={formatCurrency(results.annualSalary)} highlight={inputs.mode === 'hourly'} copyable />
            <ResultDisplay label="Daily Rate" value={formatCurrency(results.dailyRate)} copyable />
            <ResultDisplay label="Weekly Rate" value={formatCurrency(results.weeklyRate)} copyable />
            <ResultDisplay label="Bi-Weekly" value={formatCurrency(results.biweeklyRate)} copyable />
            <ResultDisplay label="Monthly" value={formatCurrency(results.monthlyRate)} copyable />
          </div>
        </div>
      )}
    >
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.mode === 'hourly'} onChange={() => setInput('mode', 'hourly')} className="w-4 h-4" />
          <span className="text-sm">Convert from hourly</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.mode === 'salary'} onChange={() => setInput('mode', 'salary')} className="w-4 h-4" />
          <span className="text-sm">Convert from salary</span>
        </label>
      </div>

      {inputs.mode === 'hourly' ? (
        <NumberInput id="hourlyRate" label="Hourly Rate" value={inputs.hourlyRate}
          onChange={(v) => setInput('hourlyRate', v)} min={0} step={0.5} unit="$/hr" error={errors.hourlyRate} required />
      ) : (
        <NumberInput id="annualSalary" label="Annual Salary" value={inputs.annualSalary}
          onChange={(v) => setInput('annualSalary', v)} min={0} step={1000} unit="$/yr" error={errors.annualSalary} required />
      )}

      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="hoursPerWeek" label="Hours Per Week" value={inputs.hoursPerWeek}
          onChange={(v) => setInput('hoursPerWeek', v)} min={1} max={168} step={1} unit="hrs" error={errors.hoursPerWeek} />
        <NumberInput id="weeksPerYear" label="Weeks Per Year" value={inputs.weeksPerYear}
          onChange={(v) => setInput('weeksPerYear', v)} min={1} max={52} step={1} unit="wks" error={errors.weeksPerYear} />
      </div>
    </CalculatorBase>
  );
}

export default HourlySalaryCalculator;
