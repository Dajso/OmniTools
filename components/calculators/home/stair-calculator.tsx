'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateStairs, type StairInputs, type StairResults } from '@/lib/calculations/home/stair-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const stairSchema = z.object({
  totalRise: z.number().min(12).max(240),
  availableRun: z.number().min(24).max(300),
  stairWidth: z.number().min(24).max(72),
});

const INITIAL_INPUTS = { totalRise: 108, availableRun: 144, stairWidth: 36 };

export function StairCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, StairResults>({
    initialInputs: INITIAL_INPUTS,
    schema: stairSchema,
    calculate: (formInputs) => calculateStairs(formInputs as StairInputs),
    storageKey: 'stair-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Stair Calculator"
      description="Calculate stair dimensions and building code compliance"
      formula="Risers = Total Rise ÷ Ideal Riser Height (7.5 in)"
      formulaExplanation="Checks IRC building code requirements"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Number of Steps" value={results.numberOfRisers.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Riser Height" value={`${results.riserHeight}"`} copyable />
            <ResultDisplay label="Tread Depth" value={`${results.treadDepth}"`} copyable />
            <ResultDisplay label="Total Run" value={`${formatNumber(results.totalRun)}"`} copyable />
            <ResultDisplay label="Stringer Length" value={`${formatNumber(results.stringerLength)}"`} copyable />
          </div>
          <div className={`p-3 rounded-md ${results.meetsCode ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
            <p className="font-medium mb-1">{results.meetsCode ? '✓ Meets Building Code' : '⚠ Code Notes'}</p>
            <ul className="text-sm space-y-1">
              {results.codeNotes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="totalRise" label="Total Rise" value={inputs.totalRise} onChange={(v) => setInput('totalRise', v)} min={12} max={240} step={1} unit="in" error={errors.totalRise} required />
        <NumberInput id="availableRun" label="Available Run" value={inputs.availableRun} onChange={(v) => setInput('availableRun', v)} min={24} max={300} step={1} unit="in" error={errors.availableRun} required />
        <NumberInput id="stairWidth" label="Stair Width" value={inputs.stairWidth} onChange={(v) => setInput('stairWidth', v)} min={24} max={72} step={1} unit="in" error={errors.stairWidth} required />
      </div>
    </CalculatorBase>
  );
}

export default StairCalculator;
