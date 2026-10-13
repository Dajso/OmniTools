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
  amount: z.number().min(0, 'Beløpet kan ikke være negativt'),
  inflationRate: z.number().min(0, 'Satsen kan ikke være negativ').max(50, 'Satsen er for høy'),
  years: z.number().min(0, 'Antall år kan ikke være negativt').max(100, 'Maks 100 år'),
});

type InflationFormInputs = z.infer<typeof inflationSchema>;

const INITIAL_INPUTS: InflationFormInputs = {
  amount: 10000,
  inflationRate: 3,
  years: 10,
};

export function InflationCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<InflationFormInputs, InflationResults>({
      initialInputs: INITIAL_INPUTS,
      schema: inflationSchema,
      calculate: calculateInflation,
      storageKey: 'inflation-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Inflasjonskalkulator"
      description="Se hvordan inflasjon svekker kjøpekraften over tid"
      formula="Fremtidig beløp = Beløp × (1 + inflasjon)^år"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={`${formatCurrency(inputs.amount)} i dag tilsvarer`}
            value={formatCurrency(results.futureValue)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Tapt kjøpekraft" value={formatCurrency(results.purchasingPowerLoss)} copyable />
            <ResultDisplay label="Tap i prosent" value={formatPercent(results.purchasingPowerLossPercent / 100, { decimals: 1 })} copyable />
            <ResultDisplay
              label={`${formatCurrency(inputs.amount)} i dag var verdt (tilbake i tid)`}
              value={formatCurrency(results.equivalentPastValue)}
              copyable
            />
          </div>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            💡 Om {inputs.years} år, med {inputs.inflationRate} % inflasjon per år, trenger du{' '}
            {formatCurrency(results.futureValue)} for å kjøpe det du får for {formatCurrency(inputs.amount)} i dag.
          </p>
        </div>
      )}
    >
      <NumberInput id="amount" label="Beløp i dag" value={inputs.amount}
        onChange={(v) => setInput('amount', v)} min={0} step={100} unit="kr" error={errors.amount} required />

      <NumberInput id="inflationRate" label="Inflasjon per år" value={inputs.inflationRate}
        onChange={(v) => setInput('inflationRate', v)} min={0} max={50} step={0.1} unit="%" error={errors.inflationRate} />

      <NumberInput id="years" label="Tidsperiode" value={inputs.years}
        onChange={(v) => setInput('years', v)} min={0} max={100} step={1} unit="år" error={errors.years} />
      <p className="text-xs text-muted-foreground">
        Norges Banks inflasjonsmål er 2 %. Bruk gjerne konsumprisindeksen (KPI) fra SSB for å finne faktisk inflasjon i en periode.
      </p>
    </CalculatorBase>
  );
}

export default InflationCalculator;
