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
  initialInvestment: z.number().min(0.01, 'Investeringen må være større enn null'),
  finalValue: z.number().min(0, 'Sluttverdien kan ikke være negativ'),
  investmentPeriodYears: z.number().min(0, 'Perioden kan ikke være negativ').optional(),
});

type ROIFormInputs = z.infer<typeof roiSchema>;

const INITIAL_INPUTS: ROIFormInputs = {
  initialInvestment: 100000,
  finalValue: 150000,
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
      storageKey: 'roi-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Avkastningskalkulator (ROI)"
      description="Regn ut avkastning og årlig avkastning på en investering"
      formula="ROI = ((Sluttverdi − Innskudd) ÷ Innskudd) × 100"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label="Avkastning (ROI)"
            value={formatPercent(results.roi / 100, { decimals: 2 })}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Gevinst / tap" value={formatCurrency(results.gain)} copyable />
            {results.annualizedROI !== undefined && (
              <ResultDisplay
                label="Årlig avkastning"
                value={formatPercent(results.annualizedROI / 100, { decimals: 2 })}
                copyable
              />
            )}
          </div>
        </div>
      )}
    >
      <NumberInput id="initialInvestment" label="Innskutt beløp" value={inputs.initialInvestment}
        onChange={(v) => setInput('initialInvestment', v)} min={0.01} step={100} unit="kr" error={errors.initialInvestment} required />

      <NumberInput id="finalValue" label="Sluttverdi" value={inputs.finalValue}
        onChange={(v) => setInput('finalValue', v)} min={0} step={100} unit="kr" error={errors.finalValue} required />

      <NumberInput id="investmentPeriodYears" label="Investeringsperiode (valgfritt)" value={inputs.investmentPeriodYears || 0}
        onChange={(v) => setInput('investmentPeriodYears', v || undefined)} min={0} step={1} unit="år" error={errors.investmentPeriodYears} />
    </CalculatorBase>
  );
}

export default ROICalculator;
