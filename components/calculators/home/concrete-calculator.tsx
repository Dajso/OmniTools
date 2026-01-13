'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateConcrete, type ConcreteInputs, type ConcreteResults } from '@/lib/calculations/home/concrete-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const concreteSchema = z.object({
  length: z.number().min(1).max(1000),
  width: z.number().min(1).max(1000),
  thickness: z.number().min(1).max(48),
});

const INITIAL_INPUTS = { length: 10, width: 10, thickness: 4 };

export function ConcreteCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, ConcreteResults>({
    initialInputs: INITIAL_INPUTS,
    schema: concreteSchema,
    calculate: (formInputs) => calculateConcrete(formInputs as ConcreteInputs),
    storageKey: 'concrete-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Concrete Calculator"
      description="Calculate how many bags of concrete you need"
      formula="Volume = Length × Width × (Thickness ÷ 12)"
      formulaExplanation="Includes 10% extra for waste"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Cubic Yards Needed" value={formatNumber(results.volumeCuYd, { maximumFractionDigits: 2 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Volume" value={`${formatNumber(results.volumeCuFt, { maximumFractionDigits: 1 })} cu ft`} copyable />
          </div>
          <div className="text-sm font-medium mt-4">Bags Needed (with 10% waste):</div>
          <div className="grid grid-cols-3 gap-3">
            <ResultDisplay label="40 lb Bags" value={results.bags40lb.toString()} copyable />
            <ResultDisplay label="60 lb Bags" value={results.bags60lb.toString()} copyable />
            <ResultDisplay label="80 lb Bags" value={results.bags80lb.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="length" label="Length" value={inputs.length} onChange={(v) => setInput('length', v)} min={1} step={0.5} unit="ft" error={errors.length} required />
        <NumberInput id="width" label="Width" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} step={0.5} unit="ft" error={errors.width} required />
        <NumberInput id="thickness" label="Thickness" value={inputs.thickness} onChange={(v) => setInput('thickness', v)} min={1} max={48} step={0.5} unit="in" error={errors.thickness} required />
      </div>
    </CalculatorBase>
  );
}

export default ConcreteCalculator;
