'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateFence, type FenceResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const fenceSchema = z.object({
  totalLength: z.number().min(1, 'Lengden må være minst 1 m').max(10000, 'Lengden er for stor'),
  fenceHeightCm: z.number().min(30, 'Høyden må være minst 30 cm').max(300, 'Høyden er for stor'),
  postSpacing: z.number().min(0.5, 'Stolpeavstanden er for liten').max(5, 'Stolpeavstanden er for stor'),
  numberOfGates: z.number().min(0, 'Kan ikke være negativt').max(20, 'For mange porter'),
  boardWidthMm: z.number().min(10, 'Bordet er for smalt').max(300, 'Bordet er for bredt'),
  boardGapMm: z.number().min(0, 'Kan ikke være negativt').max(100, 'Mellomrommet er for stort'),
});

type FenceFormInputs = z.infer<typeof fenceSchema>;

const INITIAL_INPUTS: FenceFormInputs = {
  totalLength: 30,
  fenceHeightCm: 120,
  postSpacing: 2,
  numberOfGates: 1,
  boardWidthMm: 98,
  boardGapMm: 20,
};

export function FenceCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FenceFormInputs, FenceResults>({
      initialInputs: INITIAL_INPUTS,
      schema: fenceSchema,
      calculate: calculateFence,
      storageKey: 'fence-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Gjerdekalkulator"
      description="Regn ut stolper, løsholter og bord til et gjerde"
      formula="Stolper = felt + 1 + porter, bord = lengde ÷ (bordbredde + mellomrom)"
      formulaExplanation="Stolpene settes med jevn avstand. Gjerder høyere enn 150 cm får tre løsholter per felt, lavere gjerder får to."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Bord" value={formatNumber(results.boards)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Stolper" value={results.posts.toString()} copyable />
            <ResultDisplay label="Felt" value={results.sections.toString()} copyable />
            <ResultDisplay label="Løsholter (stk.)" value={results.rails.toString()} copyable />
            <ResultDisplay label="Løsholter (løpemeter)" value={`${formatNumber(results.railMeters, { maximumFractionDigits: 1 })} m`} copyable />
            <ResultDisplay label="Sekker hurtigstøp à 25 kg" value={results.concreteBags.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="totalLength" label="Total lengde" value={inputs.totalLength} onChange={(v) => setInput('totalLength', v)} min={1} step={1} unit="m" error={errors.totalLength} required />
        <NumberInput id="fenceHeightCm" label="Gjerdehøyde" value={inputs.fenceHeightCm} onChange={(v) => setInput('fenceHeightCm', v)} min={30} max={300} step={10} unit="cm" error={errors.fenceHeightCm} required />
        <NumberInput id="postSpacing" label="Stolpeavstand" value={inputs.postSpacing} onChange={(v) => setInput('postSpacing', v)} min={0.5} max={5} step={0.1} unit="m" error={errors.postSpacing} />
        <NumberInput id="numberOfGates" label="Porter" value={inputs.numberOfGates} onChange={(v) => setInput('numberOfGates', v)} min={0} step={1} error={errors.numberOfGates} />
        <NumberInput id="boardWidthMm" label="Bordbredde" value={inputs.boardWidthMm} onChange={(v) => setInput('boardWidthMm', v)} min={10} step={1} unit="mm" error={errors.boardWidthMm} />
        <NumberInput id="boardGapMm" label="Mellomrom mellom bord" value={inputs.boardGapMm} onChange={(v) => setInput('boardGapMm', v)} min={0} step={1} unit="mm" error={errors.boardGapMm} />
      </div>
      <p className="text-xs text-muted-foreground">
        Sjekk reguleringsplanen for krav til gjerdehøyde, og avtal gjerde i nabogrense med naboen. Stolper bør graves ned minst 80–100 cm for å stå i telen.
      </p>
    </CalculatorBase>
  );
}

export default FenceCalculator;
