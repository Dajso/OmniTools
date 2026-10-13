'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateTip, type TipResults } from '@/lib/calculations/finance/tip-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const tipSchema = z.object({
  billAmount: z.number().min(0, 'Regningen kan ikke være negativ'),
  tipPercent: z.number().min(0, 'Drikkepengene kan ikke være negative').max(100, 'Drikkepengene er for høye'),
  numberOfPeople: z.number().min(1, 'Minst én person').max(100, 'For mange personer'),
});

type TipFormInputs = z.infer<typeof tipSchema>;

const INITIAL_INPUTS: TipFormInputs = {
  billAmount: 850,
  tipPercent: 10,
  numberOfPeople: 2,
};

const TIP_PRESETS = [0, 5, 10, 15];

export function TipCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<TipFormInputs, TipResults>({
      initialInputs: INITIAL_INPUTS,
      schema: tipSchema,
      calculate: calculateTip,
      storageKey: 'tip-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Drikkepengekalkulator"
      description="Regn ut drikkepenger og del regningen mellom flere"
      formula="Drikkepenger = Regning × (prosent ÷ 100)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Drikkepenger" value={formatCurrency(results.tipAmount)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Totalt å betale" value={formatCurrency(results.totalAmount)} copyable />
            <ResultDisplay label="Drikkepenger per person" value={formatCurrency(results.tipPerPerson)} copyable />
            <ResultDisplay label="Totalt per person" value={formatCurrency(results.totalPerPerson)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="billAmount" label="Regning" value={inputs.billAmount}
        onChange={(v) => setInput('billAmount', v)} min={0} step={1} unit="kr" error={errors.billAmount} required />

      <div className="space-y-2">
        <NumberInput id="tipPercent" label="Drikkepenger i prosent" value={inputs.tipPercent}
          onChange={(v) => setInput('tipPercent', v)} min={0} max={100} step={1} unit="%" error={errors.tipPercent} />
        <div className="flex gap-2">
          {TIP_PRESETS.map((preset) => (
            <button key={preset} type="button" onClick={() => setInput('tipPercent', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.tipPercent === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}>{preset}%</button>
          ))}
        </div>
      </div>

      <NumberInput id="numberOfPeople" label="Del på" value={inputs.numberOfPeople}
        onChange={(v) => setInput('numberOfPeople', v)} min={1} max={100} step={1} unit="personer" error={errors.numberOfPeople} />
      <p className="text-xs text-muted-foreground">
        Drikkepenger er frivillig i Norge. Mange runder opp regningen eller gir 5–10 % ved god service.
      </p>
    </CalculatorBase>
  );
}

export default TipCalculator;
