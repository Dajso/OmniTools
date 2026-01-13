'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateRoofPitch, type RoofPitchInputs, type RoofPitchResults } from '@/lib/calculations/home/roof-pitch-calculator';

const roofPitchSchema = z.object({
  rise: z.number().min(0).max(48),
  run: z.number().min(1).max(48),
});

const INITIAL_INPUTS = { rise: 6, run: 12 };

export function RoofPitchCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, RoofPitchResults>({
    initialInputs: INITIAL_INPUTS,
    schema: roofPitchSchema,
    calculate: (formInputs) => calculateRoofPitch(formInputs as RoofPitchInputs),
    storageKey: 'roof-pitch-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Roof Pitch Calculator"
      description="Calculate roof pitch, angle, and rafter length multiplier"
      formula="Pitch = Rise ÷ Run × 12"
      formulaExplanation="Expressed as X:12 ratio (rise per 12 inches of run)"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Roof Pitch" value={results.pitch} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Angle" value={`${results.degrees}°`} copyable />
            <ResultDisplay label="Percentage" value={`${results.percentage}%`} copyable />
            <ResultDisplay label="Rafter Multiplier" value={results.rafterMultiplier.toString()} copyable />
            <ResultDisplay label="Roof Type" value={results.roofType} copyable />
          </div>
          <p className="text-sm text-muted-foreground">
            💡 Multiply your horizontal run by {results.rafterMultiplier} to get rafter length.
          </p>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="rise" label="Rise" value={inputs.rise} onChange={(v) => setInput('rise', v)} min={0} max={48} step={0.5} unit="in" error={errors.rise} required />
        <NumberInput id="run" label="Run" value={inputs.run} onChange={(v) => setInput('run', v)} min={1} max={48} step={1} unit="in" error={errors.run} required />
      </div>
    </CalculatorBase>
  );
}

export default RoofPitchCalculator;
