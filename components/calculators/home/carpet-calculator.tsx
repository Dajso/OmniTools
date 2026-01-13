'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateCarpet, type CarpetInputs, type CarpetResults } from '@/lib/calculations/home/carpet-calculator';
import { formatNumber, formatCurrency } from '@/lib/utils/formatting';

const carpetSchema = z.object({
  roomLength: z.number().min(1).max(1000),
  roomWidth: z.number().min(1).max(1000),
  carpetWidth: z.number().min(6).max(15),
  pricePerSqYd: z.number().min(0).max(500),
});

const INITIAL_INPUTS = { roomLength: 15, roomWidth: 12, carpetWidth: 12, pricePerSqYd: 25 };

export function CarpetCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, CarpetResults>({
    initialInputs: INITIAL_INPUTS,
    schema: carpetSchema,
    calculate: (formInputs) => calculateCarpet(formInputs as CarpetInputs),
    storageKey: 'carpet-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Carpet Calculator"
      description="Calculate carpet requirements and cost for your room"
      formula="Area (sq yd) = (Length × Width) ÷ 9"
      formulaExplanation="Includes 10% extra for seams and waste"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Estimated Cost" value={formatCurrency(results.estimatedCost)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Area (sq ft)" value={formatNumber(results.areaSqFt)} copyable />
            <ResultDisplay label="Area (sq yd)" value={formatNumber(results.areaSqYd, { maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Linear Feet" value={formatNumber(results.linearFeet)} copyable />
            <ResultDisplay label="Waste %" value={`${formatNumber(results.wastePercent, { maximumFractionDigits: 1 })}%`} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="roomLength" label="Room Length" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={0.5} unit="ft" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Room Width" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={0.5} unit="ft" error={errors.roomWidth} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="carpetWidth" label="Carpet Roll Width" value={inputs.carpetWidth} onChange={(v) => setInput('carpetWidth', v)} min={6} max={15} step={1} unit="ft" error={errors.carpetWidth} />
        <NumberInput id="pricePerSqYd" label="Price per Sq Yd" value={inputs.pricePerSqYd} onChange={(v) => setInput('pricePerSqYd', v)} min={0} step={5} unit="$" error={errors.pricePerSqYd} />
      </div>
    </CalculatorBase>
  );
}

export default CarpetCalculator;
