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
  hoursPerWeek: z.number().min(1, 'Må være minst 1 time').max(168, 'Kan ikke overstige 168 timer'),
  weeksPerYear: z.number().min(1, 'Må være minst 1 uke').max(52, 'Kan ikke overstige 52 uker'),
  mode: z.enum(['hourly', 'salary']),
});

type HourlySalaryFormInputs = z.infer<typeof hourlySalarySchema>;

const INITIAL_INPUTS: HourlySalaryFormInputs = {
  hourlyRate: 300,
  annualSalary: 585000,
  hoursPerWeek: 37.5,
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
      storageKey: 'hourly-salary-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Timelønn til årslønn"
      description="Regn om mellom timelønn, månedslønn og årslønn (brutto)"
      formula="Årslønn = Timelønn × Timer per uke × Uker per år"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Timelønn" value={formatCurrency(results.hourlyRate)} highlight={inputs.mode === 'salary'} copyable />
            <ResultDisplay label="Årslønn" value={formatCurrency(results.annualSalary)} highlight={inputs.mode === 'hourly'} copyable />
            <ResultDisplay label="Per dag" value={formatCurrency(results.dailyRate)} copyable />
            <ResultDisplay label="Per uke" value={formatCurrency(results.weeklyRate)} copyable />
            <ResultDisplay label="Per 14. dag" value={formatCurrency(results.biweeklyRate)} copyable />
            <ResultDisplay label="Per måned" value={formatCurrency(results.monthlyRate)} copyable />
          </div>
        </div>
      )}
    >
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.mode === 'hourly'} onChange={() => setInput('mode', 'hourly')} className="w-4 h-4" />
          <span className="text-sm">Regn fra timelønn</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.mode === 'salary'} onChange={() => setInput('mode', 'salary')} className="w-4 h-4" />
          <span className="text-sm">Regn fra årslønn</span>
        </label>
      </div>

      {inputs.mode === 'hourly' ? (
        <NumberInput id="hourlyRate" label="Timelønn" value={inputs.hourlyRate}
          onChange={(v) => setInput('hourlyRate', v)} min={0} step={0.5} unit="kr/time" error={errors.hourlyRate} required />
      ) : (
        <NumberInput id="annualSalary" label="Årslønn" value={inputs.annualSalary}
          onChange={(v) => setInput('annualSalary', v)} min={0} step={1000} unit="kr/år" error={errors.annualSalary} required />
      )}

      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="hoursPerWeek" label="Timer per uke" value={inputs.hoursPerWeek}
          onChange={(v) => setInput('hoursPerWeek', v)} min={1} max={168} step={0.5} unit="timer" error={errors.hoursPerWeek} />
        <NumberInput id="weeksPerYear" label="Uker per år" value={inputs.weeksPerYear}
          onChange={(v) => setInput('weeksPerYear', v)} min={1} max={52} step={1} unit="uker" error={errors.weeksPerYear} />
      </div>
      <p className="text-xs text-muted-foreground">
        Beløpene er brutto, før skatt. Full arbeidsuke er normalt 37,5 timer. Feriepenger (10,2 %, eller 12 % med ekstra ferieuke) kommer i tillegg til timelønn.
      </p>
    </CalculatorBase>
  );
}

export default HourlySalaryCalculator;
