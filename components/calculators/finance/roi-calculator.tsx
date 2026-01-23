'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateROI, type ROIResults } from '@/lib/calculations/finance/roi-calculator';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

const roiSchema = z.object({
  initialInvestment: z.number().min(0.01, 'Investment must be positive'),
  finalValue: z.number().min(0, 'Final value cannot be negative'),
  investmentPeriodYears: z.number().min(0, 'Period cannot be negative').optional(),
});

type ROIFormInputs = z.infer<typeof roiSchema>;

const INITIAL_INPUTS: ROIFormInputs = {
  initialInvestment: 10000,
  finalValue: 15000,
  investmentPeriodYears: 5,
};


function calculateROIFn(formInputs: ROIFormInputs): ROIResults {
  return calculateROI({
    initialInvestment: formInputs.initialInvestment,
    finalValue: formInputs.finalValue,
    investmentPeriodYears: formInputs.investmentPeriodYears,
  });
}

export function ROICalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<ROIFormInputs, ROIResults>({
      initialInputs: INITIAL_INPUTS,
      schema: roiSchema,
      calculate: calculateROIFn,
      storageKey: 'roi-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="ROI Calculator"
      description="Calculate return on investment and annualized returns"
      formula="ROI = ((Final - Initial) / Initial) × 100"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label="Return on Investment"
            value={formatPercent(results.roi / 100, { decimals: 2 })}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Gain/Loss" value={formatCurrency(results.gain)} copyable />
            {results.annualizedROI !== undefined && (
              <ResultDisplay
                label="Annualized ROI"
                value={formatPercent(results.annualizedROI / 100, { decimals: 2 })}
                copyable
              />
            )}
          </div>
        </div>
      )}
    >
      <NumberInput id="initialInvestment" label="Initial Investment" value={inputs.initialInvestment}
        onChange={(v) => setInput('initialInvestment', v)} min={0.01} step={100} unit="$" error={errors.initialInvestment} required />

      <NumberInput id="finalValue" label="Final Value" value={inputs.finalValue}
        onChange={(v) => setInput('finalValue', v)} min={0} step={100} unit="$" error={errors.finalValue} required />

      <NumberInput id="investmentPeriodYears" label="Investment Period (optional)" value={inputs.investmentPeriodYears || 0}
        onChange={(v) => setInput('investmentPeriodYears', v || undefined)} min={0} step={1} unit="years" error={errors.investmentPeriodYears} />
    </CalculatorBase>
  );
}

export default ROICalculator;
