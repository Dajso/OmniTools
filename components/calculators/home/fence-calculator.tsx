'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateFence, type FenceInputs, type FenceResults } from '@/lib/calculations/home/fence-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const fenceSchema = z.object({
  totalLength: z.number().min(1).max(10000),
  fenceHeight: z.number().min(2).max(12),
  postSpacing: z.number().min(4).max(10),
  numberOfGates: z.number().min(0).max(20),
  picketWidth: z.number().min(1).max(12),
  picketGap: z.number().min(0).max(4),
});

const INITIAL_INPUTS = { totalLength: 100, fenceHeight: 6, postSpacing: 8, numberOfGates: 1, picketWidth: 3.5, picketGap: 0.25 };

export function FenceCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, FenceResults>({
    initialInputs: INITIAL_INPUTS,
    schema: fenceSchema,
    calculate: (formInputs) => calculateFence(formInputs as FenceInputs),
    storageKey: 'fence-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Fence Calculator"
      description="Calculate materials needed for your fence project"
      formula="Posts = (Length ÷ Spacing) + 1 + (Gates × 2)"
      formulaExplanation="Includes posts, rails, pickets, and concrete"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Posts Needed" value={results.posts.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Rails" value={results.rails.toString()} copyable />
            <ResultDisplay label="Pickets" value={results.pickets.toString()} copyable />
            <ResultDisplay label="Concrete Bags" value={results.concreteBags.toString()} copyable />
            <ResultDisplay label="Rail Linear Ft" value={formatNumber(results.railLinearFeet)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="totalLength" label="Total Fence Length" value={inputs.totalLength} onChange={(v) => setInput('totalLength', v)} min={1} step={10} unit="ft" error={errors.totalLength} required />
        <NumberInput id="fenceHeight" label="Fence Height" value={inputs.fenceHeight} onChange={(v) => setInput('fenceHeight', v)} min={2} max={12} step={0.5} unit="ft" error={errors.fenceHeight} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="postSpacing" label="Post Spacing" value={inputs.postSpacing} onChange={(v) => setInput('postSpacing', v)} min={4} max={10} step={1} unit="ft" error={errors.postSpacing} />
        <NumberInput id="numberOfGates" label="Number of Gates" value={inputs.numberOfGates} onChange={(v) => setInput('numberOfGates', v)} min={0} max={20} step={1} error={errors.numberOfGates} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="picketWidth" label="Picket Width" value={inputs.picketWidth} onChange={(v) => setInput('picketWidth', v)} min={1} max={12} step={0.5} unit="in" error={errors.picketWidth} />
        <NumberInput id="picketGap" label="Picket Gap" value={inputs.picketGap} onChange={(v) => setInput('picketGap', v)} min={0} max={4} step={0.25} unit="in" error={errors.picketGap} />
      </div>
    </CalculatorBase>
  );
}

export default FenceCalculator;
