'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateInflation, type InflationResults } from '@/lib/calculations/finance/inflation-calculator';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

const inflationSchema = z.object({
  amount: z.number().min(0, 'Amount cannot be negative'),
  inflationRate: z.number().min(0, 'Rate cannot be negative').max(50, 'Rate too high'),
  years: z.number().min(0, 'Years cannot be negative').max(100, 'Maximum 100 years'),
});

type InflationFormInputs = z.infer<typeof inflationSchema>;

const INITIAL_INPUTS: InflationFormInputs = {
  amount: 1000,
  inflationRate: 3,
  years: 10,
};

export function InflationCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<InflationFormInputs, InflationResults>({
      initialInputs: INITIAL_INPUTS,
      schema: inflationSchema,
      calculate: calculateInflation,
      storageKey: 'inflation-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Inflation Calculator"
      description="See how inflation affects purchasing power over time"
      formula="Future Value = Amount × (1 + Rate)^Years"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={`${formatCurrency(inputs.amount)} today will need to be`}
            value={formatCurrency(results.futureValue)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Purchasing Power Loss" value={formatCurrency(results.purchasingPowerLoss)} copyable />
            <ResultDisplay label="Loss Percentage" value={formatPercent(results.purchasingPowerLossPercent / 100, { decimals: 1 })} copyable />
            <ResultDisplay
              label={`${formatCurrency(inputs.amount)} today was worth`}
              value={formatCurrency(results.equivalentPastValue)}
              copyable
            />
          </div>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            💡 In {inputs.years} years at {inputs.inflationRate}% inflation, you&apos;ll need{' '}
            {formatCurrency(results.futureValue)} to buy what {formatCurrency(inputs.amount)} buys today.
          </p>
        </div>
      )}
    >
      <NumberInput id="amount" label="Current Amount" value={inputs.amount}
        onChange={(v) => setInput('amount', v)} min={0} step={100} unit="$" error={errors.amount} required />

      <NumberInput id="inflationRate" label="Annual Inflation Rate" value={inputs.inflationRate}
        onChange={(v) => setInput('inflationRate', v)} min={0} max={50} step={0.1} unit="%" error={errors.inflationRate} />

      <NumberInput id="years" label="Time Period" value={inputs.years}
        onChange={(v) => setInput('years', v)} min={0} max={100} step={1} unit="years" error={errors.years} />
    </CalculatorBase>
  );
}

export default InflationCalculator;
