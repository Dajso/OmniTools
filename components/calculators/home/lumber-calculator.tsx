'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateLumber, type LumberInputs, type LumberResults } from '@/lib/calculations/home/lumber-calculator';
import { formatNumber, formatCurrency } from '@/lib/utils/formatting';

const lumberSchema = z.object({
  thickness: z.number().min(1).max(12),
  width: z.number().min(1).max(12),
  length: z.number().min(1).max(24),
  quantity: z.number().min(1).max(1000),
  pricePerBoardFoot: z.number().min(0).max(100),
});

const INITIAL_INPUTS = { thickness: 2, width: 6, length: 8, quantity: 10, pricePerBoardFoot: 5 };

export function LumberCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, LumberResults>({
    initialInputs: INITIAL_INPUTS,
    schema: lumberSchema,
    calculate: (formInputs) => calculateLumber(formInputs as LumberInputs),
    storageKey: 'lumber-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Lumber Calculator (Board Feet)"
      description="Calculate board feet and cost for lumber purchases"
      formula="Board Feet = (Thickness × Width × Length) ÷ 12"
      formulaExplanation="Uses nominal dimensions; actual dimensions shown in results"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total Board Feet" value={formatNumber(results.totalBoardFeet, { locale: 'en-US', maximumFractionDigits: 2 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Board Feet/Piece" value={formatNumber(results.boardFeetPerPiece, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Total Cost" value={formatCurrency(results.totalCost)} copyable />
          </div>
          <p className="text-sm text-muted-foreground">
            💡 Actual dimensions: {results.actualDimensions}
          </p>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="thickness" label="Thickness (nominal)" value={inputs.thickness} onChange={(v) => setInput('thickness', v)} min={1} max={12} step={1} unit="in" error={errors.thickness} required />
        <NumberInput id="width" label="Width (nominal)" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} max={12} step={1} unit="in" error={errors.width} required />
        <NumberInput id="length" label="Length" value={inputs.length} onChange={(v) => setInput('length', v)} min={1} max={24} step={2} unit="ft" error={errors.length} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="quantity" label="Quantity" value={inputs.quantity} onChange={(v) => setInput('quantity', v)} min={1} max={1000} step={1} error={errors.quantity} required />
        <NumberInput id="pricePerBoardFoot" label="Price per Board Foot" value={inputs.pricePerBoardFoot} onChange={(v) => setInput('pricePerBoardFoot', v)} min={0} step={0.5} unit="$" error={errors.pricePerBoardFoot} />
      </div>
    </CalculatorBase>
  );
}

export default LumberCalculator;
