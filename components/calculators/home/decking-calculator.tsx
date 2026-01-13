'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateDecking, type DeckingInputs, type DeckingResults } from '@/lib/calculations/home/decking-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const deckingSchema = z.object({
  deckLength: z.number().min(1).max(1000),
  deckWidth: z.number().min(1).max(1000),
  boardWidth: z.number().min(3).max(12),
  boardLength: z.number().min(6).max(20),
  boardGap: z.number().min(0).max(0.5),
  joistSpacing: z.number().min(12).max(24),
});

const INITIAL_INPUTS = { deckLength: 16, deckWidth: 12, boardWidth: 5.5, boardLength: 12, boardGap: 0.125, joistSpacing: 16 };

export function DeckingCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, DeckingResults>({
    initialInputs: INITIAL_INPUTS,
    schema: deckingSchema,
    calculate: (formInputs) => calculateDecking(formInputs as DeckingInputs),
    storageKey: 'decking-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Decking Calculator"
      description="Calculate materials needed for your deck project"
      formula="Boards = (Width ÷ Board Width) × (Length ÷ Board Length)"
      formulaExplanation="Includes 10% waste factor"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Deck Boards Needed" value={results.deckBoards.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Deck Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Joists" value={results.joists.toString()} copyable />
            <ResultDisplay label="Decking Linear Ft" value={formatNumber(results.deckingLinearFeet)} copyable />
            <ResultDisplay label="Screws (approx)" value={formatNumber(results.screws)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="deckLength" label="Deck Length" value={inputs.deckLength} onChange={(v) => setInput('deckLength', v)} min={1} step={1} unit="ft" error={errors.deckLength} required />
        <NumberInput id="deckWidth" label="Deck Width" value={inputs.deckWidth} onChange={(v) => setInput('deckWidth', v)} min={1} step={1} unit="ft" error={errors.deckWidth} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="boardWidth" label="Board Width" value={inputs.boardWidth} onChange={(v) => setInput('boardWidth', v)} min={3} max={12} step={0.5} unit="in" error={errors.boardWidth} />
        <NumberInput id="boardLength" label="Board Length" value={inputs.boardLength} onChange={(v) => setInput('boardLength', v)} min={6} max={20} step={2} unit="ft" error={errors.boardLength} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="boardGap" label="Board Gap" value={inputs.boardGap} onChange={(v) => setInput('boardGap', v)} min={0} max={0.5} step={0.0625} unit="in" error={errors.boardGap} />
        <NumberInput id="joistSpacing" label="Joist Spacing" value={inputs.joistSpacing} onChange={(v) => setInput('joistSpacing', v)} min={12} max={24} step={4} unit="in" error={errors.joistSpacing} />
      </div>
    </CalculatorBase>
  );
}

export default DeckingCalculator;
