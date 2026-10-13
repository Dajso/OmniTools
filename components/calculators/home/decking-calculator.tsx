'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateDecking, type DeckingResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const deckingSchema = z.object({
  deckLength: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  deckWidth: z.number().min(0.5, 'Bredden må være minst 0,5 m').max(100, 'Bredden er for stor'),
  boardWidthMm: z.number().min(40, 'Bordet er for smalt').max(250, 'Bordet er for bredt'),
  boardLength: z.number().min(1).max(6),
  boardGapMm: z.number().min(0, 'Kan ikke være negativt').max(20, 'Mellomrommet er for stort'),
  joistSpacingCm: z.number().min(20, 'Avstanden er for liten').max(80, 'Avstanden er for stor'),
});

type DeckingFormInputs = z.infer<typeof deckingSchema>;

const INITIAL_INPUTS: DeckingFormInputs = {
  deckLength: 5,
  deckWidth: 4,
  boardWidthMm: 120,
  boardLength: 4.8,
  boardGapMm: 5,
  joistSpacingCm: 60,
};

const BOARD_LENGTHS = [
  { value: '3', label: '3,0 m' },
  { value: '3.6', label: '3,6 m' },
  { value: '4.2', label: '4,2 m' },
  { value: '4.8', label: '4,8 m' },
  { value: '5.4', label: '5,4 m' },
];

export function DeckingCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<DeckingFormInputs, DeckingResults>({
      initialInputs: INITIAL_INPUTS,
      schema: deckingSchema,
      calculate: calculateDecking,
      storageKey: 'decking-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Terrassekalkulator"
      description="Regn ut terrassebord, bjelker og skruer til en terrasse"
      formula="Bordrader = bredde ÷ (bordbredde + mellomrom)"
      formulaExplanation="Bordene legges på tvers av bjelkene. Det er regnet 10 % ekstra for kapp og feil."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Terrassebord" value={results.boardsNeeded.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Terrasseareal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Bordrader" value={results.boardRows.toString()} copyable />
            <ResultDisplay label="Løpemeter bord" value={`${formatNumber(results.boardMeters, { maximumFractionDigits: 1 })} m`} copyable />
            <ResultDisplay label="Bjelker" value={results.joists.toString()} copyable />
            <ResultDisplay label="Skruer (omtrentlig)" value={formatNumber(results.screws)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="deckLength" label="Terrasselengde" value={inputs.deckLength} onChange={(v) => setInput('deckLength', v)} min={0.5} step={0.1} unit="m" error={errors.deckLength} required />
        <NumberInput id="deckWidth" label="Terrassebredde" value={inputs.deckWidth} onChange={(v) => setInput('deckWidth', v)} min={0.5} step={0.1} unit="m" error={errors.deckWidth} required />
        <NumberInput id="boardWidthMm" label="Bordbredde" value={inputs.boardWidthMm} onChange={(v) => setInput('boardWidthMm', v)} min={40} max={250} step={1} unit="mm" error={errors.boardWidthMm} />
        <SelectInput id="boardLength" label="Bordlengde" value={String(inputs.boardLength)} onChange={(v) => setInput('boardLength', Number(v))} options={BOARD_LENGTHS} error={errors.boardLength} />
        <NumberInput id="boardGapMm" label="Mellomrom mellom bord" value={inputs.boardGapMm} onChange={(v) => setInput('boardGapMm', v)} min={0} max={20} step={1} unit="mm" error={errors.boardGapMm} />
        <NumberInput id="joistSpacingCm" label="Avstand mellom bjelker (c/c)" value={inputs.joistSpacingCm} onChange={(v) => setInput('joistSpacingCm', v)} min={20} max={80} step={5} unit="cm" error={errors.joistSpacingCm} />
      </div>
      <p className="text-xs text-muted-foreground">
        Terrasse høyere enn 0,5 m over bakken, eller over en viss størrelse, kan kreve byggemelding. Sjekk reglene hos kommunen. Rekkverk kreves ved fallhøyde over 0,5 m.
      </p>
    </CalculatorBase>
  );
}

export default DeckingCalculator;
