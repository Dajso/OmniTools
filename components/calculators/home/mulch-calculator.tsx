'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateMulch, type MulchInputs, type MulchResults } from '@/lib/calculations/home/mulch-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const mulchSchema = z.object({
  length: z.number().min(1).max(10000),
  width: z.number().min(1).max(10000),
  depth: z.number().min(0.5).max(12),
});

const INITIAL_INPUTS = { length: 10, width: 10, depth: 3 };

export function MulchCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, MulchResults>({
    initialInputs: INITIAL_INPUTS,
    schema: mulchSchema,
    calculate: (formInputs) => calculateMulch(formInputs as MulchInputs),
    storageKey: 'mulch-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Mulch Calculator"
      description="Calculate how much mulch you need for your garden"
      formula="Volume = Length × Width × (Depth ÷ 12)"
      formulaExplanation="Converts depth from inches to feet, then calculates cubic feet"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Cubic Yards Needed" value={formatNumber(results.volumeCuYd, { locale: 'en-US', maximumFractionDigits: 2 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Volume" value={`${formatNumber(results.volumeCuFt, { locale: 'en-US', maximumFractionDigits: 1 })} cu ft`} copyable />
            <ResultDisplay label="2 Cu Ft Bags" value={results.bags2CuFt.toString()} copyable />
            <ResultDisplay label="3 Cu Ft Bags" value={results.bags3CuFt.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="length" label="Length" value={inputs.length} onChange={(v) => setInput('length', v)} min={1} step={1} unit="ft" error={errors.length} required />
        <NumberInput id="width" label="Width" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} step={1} unit="ft" error={errors.width} required />
        <NumberInput id="depth" label="Depth" value={inputs.depth} onChange={(v) => setInput('depth', v)} min={0.5} max={12} step={0.5} unit="in" error={errors.depth} required />
      </div>
    </CalculatorBase>
  );
}

export default MulchCalculator;
