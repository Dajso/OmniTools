'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateGravel, type GravelInputs, type GravelResults } from '@/lib/calculations/home/gravel-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const gravelSchema = z.object({
  length: z.number().min(1).max(10000),
  width: z.number().min(1).max(10000),
  depth: z.number().min(0.5).max(24),
  density: z.number().min(50).max(200),
});

const INITIAL_INPUTS = { length: 20, width: 10, depth: 2, density: 100 };

export function GravelCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, GravelResults>({
    initialInputs: INITIAL_INPUTS,
    schema: gravelSchema,
    calculate: (formInputs) => calculateGravel(formInputs as GravelInputs),
    storageKey: 'gravel-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Gravel Calculator"
      description="Calculate how much gravel you need for your project"
      formula="Volume = Length × Width × (Depth ÷ 12)"
      formulaExplanation="Weight calculated using gravel density (typically 100 lbs/cu ft)"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Tons Needed" value={formatNumber(results.tons, { locale: 'en-US', maximumFractionDigits: 2 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Volume (cu ft)" value={formatNumber(results.volumeCuFt, { locale: 'en-US', maximumFractionDigits: 1 })} copyable />
            <ResultDisplay label="Volume (cu yd)" value={formatNumber(results.volumeCuYd, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Weight (lbs)" value={formatNumber(results.pounds)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="length" label="Length" value={inputs.length} onChange={(v) => setInput('length', v)} min={1} step={1} unit="ft" error={errors.length} required />
        <NumberInput id="width" label="Width" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} step={1} unit="ft" error={errors.width} required />
        <NumberInput id="depth" label="Depth" value={inputs.depth} onChange={(v) => setInput('depth', v)} min={0.5} max={24} step={0.5} unit="in" error={errors.depth} required />
      </div>
      <NumberInput id="density" label="Gravel Density" value={inputs.density} onChange={(v) => setInput('density', v)} min={50} max={200} step={5} unit="lbs/cu ft" error={errors.density} />
    </CalculatorBase>
  );
}

export default GravelCalculator;
