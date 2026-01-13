'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  currentAge: z.number().min(18, 'Must be at least 18').max(70, 'Must be under 70'),
  retirementAge: z.number().min(50, 'Must be at least 50').max(75, 'Must be under 75'),
  currentBalance: z.number().min(0, 'Cannot be negative'),
  annualContribution: z.number().min(0, 'Cannot be negative').max(23000, 'Max contribution is $23,000'),
  employerMatch: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  matchLimit: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  annualReturn: z.number().min(0, 'Cannot be negative').max(20, 'Unrealistic return rate'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  finalBalance: number;
  totalContributions: number;
  totalEmployerMatch: number;
  totalInterest: number;
  yearsToRetirement: number;
}

const INITIAL_INPUTS: FormInputs = {
  currentAge: 30,
  retirementAge: 65,
  currentBalance: 50000,
  annualContribution: 10000,
  employerMatch: 50,
  matchLimit: 6,
  annualReturn: 7,
};

function calculate401k(inputs: FormInputs): Results {
  const years = inputs.retirementAge - inputs.currentAge;
  const monthlyReturn = inputs.annualReturn / 100 / 12;
  const monthlyContribution = inputs.annualContribution / 12;
  const employerMatchAmount = (inputs.annualContribution * Math.min(inputs.employerMatch / 100, inputs.matchLimit / 100 * inputs.annualContribution / inputs.annualContribution)) / 12;
  
  let balance = inputs.currentBalance;
  let totalContributions = 0;
  let totalMatch = 0;
  
  for (let month = 0; month < years * 12; month++) {
    balance += monthlyContribution + employerMatchAmount;
    balance *= (1 + monthlyReturn);
    totalContributions += monthlyContribution;
    totalMatch += employerMatchAmount;
  }
  
  return {
    finalBalance: balance,
    totalContributions: totalContributions,
    totalEmployerMatch: totalMatch,
    totalInterest: balance - inputs.currentBalance - totalContributions - totalMatch,
    yearsToRetirement: years,
  };
}

export function Calculator401k() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculate401k,
      storageKey: '401k-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="401(k) Savings Calculator"
      description="Calculate your retirement savings with employer matching"
      formula="FV = PV(1+r)^n + PMT × ((1+r)^n - 1) / r"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Projected Balance at Retirement" value={formatCurrency(results.finalBalance)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Your Contributions" value={formatCurrency(results.totalContributions)} copyable />
            <ResultDisplay label="Employer Match" value={formatCurrency(results.totalEmployerMatch)} copyable />
            <ResultDisplay label="Investment Growth" value={formatCurrency(results.totalInterest)} copyable />
            <ResultDisplay label="Years to Retirement" value={`${results.yearsToRetirement} years`} />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="currentAge" label="Current Age" value={inputs.currentAge} 
          onChange={(v) => setInput('currentAge', v)} min={18} max={70} step={1} unit="years" error={errors.currentAge} required />
        <NumberInput id="retirementAge" label="Retirement Age" value={inputs.retirementAge}
          onChange={(v) => setInput('retirementAge', v)} min={50} max={75} step={1} unit="years" error={errors.retirementAge} required />
      </div>
      <NumberInput id="currentBalance" label="Current 401(k) Balance" value={inputs.currentBalance}
        onChange={(v) => setInput('currentBalance', v)} min={0} step={1000} unit="$" error={errors.currentBalance} />
      <NumberInput id="annualContribution" label="Annual Contribution" value={inputs.annualContribution}
        onChange={(v) => setInput('annualContribution', v)} min={0} max={23000} step={500} unit="$" error={errors.annualContribution} />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="employerMatch" label="Employer Match %" value={inputs.employerMatch}
          onChange={(v) => setInput('employerMatch', v)} min={0} max={100} step={5} unit="%" error={errors.employerMatch} />
        <NumberInput id="matchLimit" label="Match Limit (% of salary)" value={inputs.matchLimit}
          onChange={(v) => setInput('matchLimit', v)} min={0} max={100} step={1} unit="%" error={errors.matchLimit} />
      </div>
      <NumberInput id="annualReturn" label="Expected Annual Return" value={inputs.annualReturn}
        onChange={(v) => setInput('annualReturn', v)} min={0} max={20} step={0.5} unit="%" error={errors.annualReturn} />
    </CalculatorBase>
  );
}

export default Calculator401k;
