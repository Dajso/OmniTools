'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateRoofPitch, type RoofPitchResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const roofPitchSchema = z.object({
  rise: z.number().min(0, 'Høyden kan ikke være negativ').max(50, 'Høyden er for stor'),
  run: z.number().min(0.1, 'Lengden må være over 0').max(100, 'Lengden er for stor'),
});

type RoofPitchFormInputs = z.infer<typeof roofPitchSchema>;

const INITIAL_INPUTS: RoofPitchFormInputs = { rise: 2.5, run: 4.5 };

export function RoofPitchCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<RoofPitchFormInputs, RoofPitchResults>({
      initialInputs: INITIAL_INPUTS,
      schema: roofPitchSchema,
      calculate: calculateRoofPitch,
      storageKey: 'roof-pitch-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Takvinkelkalkulator"
      description="Regn ut takvinkel i grader og prosent, og lengden på takstolen"
      formula="Takvinkel = arctan(høyde ÷ horisontal lengde)"
      formulaExplanation="Høyden måles fra raft til møne. Horisontal lengde er avstanden fra ytterkant vegg til under mønet."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Takvinkel" value={`${formatNumber(results.degrees, { maximumFractionDigits: 1 })}°`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Stigning i prosent" value={`${formatNumber(results.percentage, { maximumFractionDigits: 1 })} %`} copyable />
            <ResultDisplay label="Forhold (høyde:lengde)" value={results.ratio} copyable />
            <ResultDisplay label="Sperrelengde" value={`${formatNumber(results.rafterLength, { maximumFractionDigits: 2 })} m`} copyable />
            <ResultDisplay label="Sperrefaktor" value={formatNumber(results.rafterMultiplier, { maximumFractionDigits: 3 })} copyable />
          </div>
          <p className="text-sm text-muted-foreground">{results.roofType}</p>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="rise" label="Høyde (raft til møne)" value={inputs.rise} onChange={(v) => setInput('rise', v)} min={0} step={0.1} unit="m" error={errors.rise} required />
        <NumberInput id="run" label="Horisontal lengde" value={inputs.run} onChange={(v) => setInput('run', v)} min={0.1} step={0.1} unit="m" error={errors.run} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Vanlige saltak i Norge ligger gjerne mellom 22° og 40°. Takvinkelen avgjør hvilken taktekking som kan brukes, og hvor mye snølast taket må tåle. Sjekk produsentens krav til minste takvinkel.
      </p>
    </CalculatorBase>
  );
}

export default RoofPitchCalculator;
