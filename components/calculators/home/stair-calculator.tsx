'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateStairs, type StairResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const stairSchema = z.object({
  totalRiseCm: z.number().min(10, 'Høyden må være minst 10 cm').max(1000, 'Høyden er for stor'),
  availableRunCm: z.number().min(10, 'Lengden må være minst 10 cm').max(2000, 'Lengden er for stor'),
  stairWidthCm: z.number().min(30, 'Bredden må være minst 30 cm').max(400, 'Bredden er for stor'),
});

type StairFormInputs = z.infer<typeof stairSchema>;

const INITIAL_INPUTS: StairFormInputs = { totalRiseCm: 260, availableRunCm: 280, stairWidthCm: 90 };

export function StairCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<StairFormInputs, StairResults>({
      initialInputs: INITIAL_INPUTS,
      schema: stairSchema,
      calculate: calculateStairs,
      storageKey: 'stair-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Trappekalkulator"
      description="Regn ut opptrinn, inntrinn og antall trinn i en trapp"
      formula="Opptrinn = total høyde ÷ antall trinn, trappeformel: 2 × opptrinn + inntrinn ≈ 60–64 cm"
      formulaExplanation="Opptrinn er høyden på hvert trinn og inntrinn er dybden. Kalkulatoren starter på et opptrinn rundt 17,5 cm."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Antall opptrinn" value={results.numberOfRisers.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Opptrinn (høyde)" value={`${formatNumber(results.riserHeightCm, { maximumFractionDigits: 1 })} cm`} copyable />
            <ResultDisplay label="Inntrinn (dybde)" value={`${formatNumber(results.treadDepthCm, { maximumFractionDigits: 1 })} cm`} copyable />
            <ResultDisplay label="Antall inntrinn" value={results.numberOfTreads.toString()} copyable />
            <ResultDisplay label="Trappens lengde" value={`${formatNumber(results.totalRunCm)} cm`} copyable />
            <ResultDisplay label="Vangelengde (skrått)" value={`${formatNumber(results.stringerLengthCm)} cm`} copyable />
            <ResultDisplay label="Trappeformel" value={`${formatNumber(results.comfortFormula, { maximumFractionDigits: 1 })} cm`} copyable />
          </div>
          <ul className={`text-sm space-y-1 list-disc pl-5 ${results.meetsCode ? 'text-muted-foreground' : 'text-destructive'}`}>
            {results.codeNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="totalRiseCm" label="Total høydeforskjell" value={inputs.totalRiseCm} onChange={(v) => setInput('totalRiseCm', v)} min={10} step={1} unit="cm" error={errors.totalRiseCm} required />
        <NumberInput id="availableRunCm" label="Tilgjengelig lengde" value={inputs.availableRunCm} onChange={(v) => setInput('availableRunCm', v)} min={10} step={1} unit="cm" error={errors.availableRunCm} required />
        <NumberInput id="stairWidthCm" label="Trappebredde" value={inputs.stairWidthCm} onChange={(v) => setInput('stairWidthCm', v)} min={30} step={5} unit="cm" error={errors.stairWidthCm} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Kravene i byggteknisk forskrift (TEK17) gjelder for trapper i bolig og andre bygg. Kontroller alltid mot gjeldende forskrift og eventuelle unntak for ditt tiltak. Rekkverk kreves der fallhøyden er over 0,5 m.
      </p>
    </CalculatorBase>
  );
}

export default StairCalculator;
