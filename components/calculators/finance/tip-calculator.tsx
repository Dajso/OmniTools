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
  billAmount: z.number().min(0, 'Bill amount cannot be negative'),
  tipPercent: z.number().min(0, 'Tip cannot be negative').max(100, 'Tip too high'),
  numberOfPeople: z.number().min(1, 'At least 1 person required').max(100, 'Too many people'),
});

type TipFormInputs = z.infer<typeof tipSchema>;

const INITIAL_INPUTS: TipFormInputs = {
  billAmount: 50,
  tipPercent: 18,
  numberOfPeople: 2,
};

const TIP_PRESETS = [15, 18, 20, 25];

export function TipCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<TipFormInputs, TipResults>({
      initialInputs: INITIAL_INPUTS,
      schema: tipSchema,
      calculate: calculateTip,
      storageKey: 'tip-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Tip Calculator"
      description="Calculate tip amount and split the bill between multiple people"
      formula="Tip = Bill × (Tip% / 100)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Tip Amount" value={formatCurrency(results.tipAmount)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Amount" value={formatCurrency(results.totalAmount)} copyable />
            <ResultDisplay label="Tip Per Person" value={formatCurrency(results.tipPerPerson)} copyable />
            <ResultDisplay label="Total Per Person" value={formatCurrency(results.totalPerPerson)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="billAmount" label="Bill Amount" value={inputs.billAmount} 
        onChange={(v) => setInput('billAmount', v)} min={0} step={1} unit="$" error={errors.billAmount} required />
      
      <div className="space-y-2">
        <NumberInput id="tipPercent" label="Tip Percentage" value={inputs.tipPercent}
          onChange={(v) => setInput('tipPercent', v)} min={0} max={100} step={1} unit="%" error={errors.tipPercent} />
        <div className="flex gap-2">
          {TIP_PRESETS.map((preset) => (
            <button key={preset} type="button" onClick={() => setInput('tipPercent', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                inputs.tipPercent === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}>{preset}%</button>
          ))}
        </div>
      </div>

      <NumberInput id="numberOfPeople" label="Split Between" value={inputs.numberOfPeople}
        onChange={(v) => setInput('numberOfPeople', v)} min={1} max={100} step={1} unit="people" error={errors.numberOfPeople} />
    </CalculatorBase>
  );
}

export default TipCalculator;
