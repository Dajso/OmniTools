'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculatePaint,
  DEFAULT_COVERAGE_M2_PER_LITER,
  type PaintResults,
} from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const paintSchema = z.object({
  roomLength: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  roomWidth: z.number().min(0.5, 'Bredden må være minst 0,5 m').max(100, 'Bredden er for stor'),
  wallHeight: z.number().min(1, 'Høyden må være minst 1 m').max(10, 'Høyden er for stor'),
  numberOfDoors: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange dører'),
  numberOfWindows: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange vinduer'),
  numberOfCoats: z.number().min(1, 'Minst ett strøk').max(5, 'Maks 5 strøk'),
  coveragePerLiter: z.number().min(2, 'Dekkevnen er for lav').max(20, 'Dekkevnen er for høy'),
  includeCeiling: z.boolean(),
});

type PaintFormInputs = z.infer<typeof paintSchema>;

const INITIAL_INPUTS: PaintFormInputs = {
  roomLength: 4,
  roomWidth: 3.5,
  wallHeight: 2.4,
  numberOfDoors: 1,
  numberOfWindows: 2,
  numberOfCoats: 2,
  coveragePerLiter: DEFAULT_COVERAGE_M2_PER_LITER,
  includeCeiling: false,
};

export function PaintCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<PaintFormInputs, PaintResults>({
      initialInputs: INITIAL_INPUTS,
      schema: paintSchema,
      calculate: calculatePaint,
      storageKey: 'paint-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Malingskalkulator"
      description="Regn ut hvor mange liter maling du trenger til et rom"
      formula="Liter = (veggflate − dører og vinduer + evt. tak) × strøk ÷ dekkevne"
      formulaExplanation="Dør regnes som 1,9 m² og vindu som 1,5 m². Dekkevnen er hvor mange m² én liter dekker per strøk."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Maling å kjøpe" value={`${formatNumber(results.litersToBuy, { maximumFractionDigits: 1 })} liter`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Beregnet behov" value={`${formatNumber(results.litersNeeded, { maximumFractionDigits: 1 })} liter`} copyable />
            <ResultDisplay label="Flate som males" value={`${formatNumber(results.paintableArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Veggflate" value={`${formatNumber(results.wallArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Fratrukket for dører og vinduer" value={`${formatNumber(results.openingsArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Bokser à 2,7 liter" value={results.cans2_7.toString()} copyable />
            <ResultDisplay label="Bokser à 9 liter" value={results.cans9.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="roomLength" label="Romlengde" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={0.5} step={0.1} unit="m" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Rombredde" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={0.5} step={0.1} unit="m" error={errors.roomWidth} required />
        <NumberInput id="wallHeight" label="Takhøyde" value={inputs.wallHeight} onChange={(v) => setInput('wallHeight', v)} min={1} max={10} step={0.1} unit="m" error={errors.wallHeight} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="numberOfDoors" label="Dører" value={inputs.numberOfDoors} onChange={(v) => setInput('numberOfDoors', v)} min={0} step={1} error={errors.numberOfDoors} />
        <NumberInput id="numberOfWindows" label="Vinduer" value={inputs.numberOfWindows} onChange={(v) => setInput('numberOfWindows', v)} min={0} step={1} error={errors.numberOfWindows} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="numberOfCoats" label="Antall strøk" value={inputs.numberOfCoats} onChange={(v) => setInput('numberOfCoats', v)} min={1} max={5} step={1} error={errors.numberOfCoats} />
        <NumberInput id="coveragePerLiter" label="Dekkevne" value={inputs.coveragePerLiter} onChange={(v) => setInput('coveragePerLiter', v)} min={2} max={20} step={0.5} unit="m² per liter" error={errors.coveragePerLiter} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="includeCeiling" checked={inputs.includeCeiling} onChange={(e) => setInput('includeCeiling', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <label htmlFor="includeCeiling" className="text-sm">Ta med taket</label>
      </div>
      <p className="text-xs text-muted-foreground">
        Dekkevnen står på malingsspannet. Mange vegg- og takmalinger oppgir 8–12 m² per liter.
      </p>
    </CalculatorBase>
  );
}

export default PaintCalculator;
