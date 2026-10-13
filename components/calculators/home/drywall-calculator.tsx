'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateDrywall, type DrywallResults, type SheetSize } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const drywallSchema = z.object({
  roomLength: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  roomWidth: z.number().min(0.5, 'Bredden må være minst 0,5 m').max(100, 'Bredden er for stor'),
  wallHeight: z.number().min(1, 'Høyden må være minst 1 m').max(10, 'Høyden er for stor'),
  includeCeiling: z.boolean(),
  numberOfDoors: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange dører'),
  numberOfWindows: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange vinduer'),
  sheetSize: z.enum(['900x2400', '900x2700', '1200x2400', '1200x2700']),
});

type DrywallFormInputs = z.infer<typeof drywallSchema>;

const INITIAL_INPUTS: DrywallFormInputs = {
  roomLength: 4,
  roomWidth: 3.5,
  wallHeight: 2.4,
  includeCeiling: true,
  numberOfDoors: 1,
  numberOfWindows: 2,
  sheetSize: '1200x2400',
};

const SHEET_OPTIONS = [
  { value: '900x2400', label: '900 × 2 400 mm (2,16 m²)' },
  { value: '900x2700', label: '900 × 2 700 mm (2,43 m²)' },
  { value: '1200x2400', label: '1 200 × 2 400 mm (2,88 m²)' },
  { value: '1200x2700', label: '1 200 × 2 700 mm (3,24 m²)' },
];

export function DrywallCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<DrywallFormInputs, DrywallResults>({
      initialInputs: INITIAL_INPUTS,
      schema: drywallSchema,
      calculate: calculateDrywall,
      storageKey: 'drywall-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Gipskalkulator"
      description="Regn ut hvor mange gipsplater og hvor mye tilbehør du trenger"
      formula="Plater = totalt areal × 1,1 ÷ platestørrelse"
      formulaExplanation="Det er lagt til 10 % for kapp og svinn. Dører og vinduer er trukket fra."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Gipsplater" value={results.sheetsNeeded.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Veggareal" value={`${formatNumber(results.wallArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Takareal" value={`${formatNumber(results.ceilingArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Totalt areal" value={`${formatNumber(results.totalArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Areal per plate" value={`${formatNumber(results.areaPerSheet, { maximumFractionDigits: 2 })} m²`} copyable />
          </div>
          <div className="text-sm font-medium">Tilbehør (omtrentlig):</div>
          <div className="grid grid-cols-3 gap-3">
            <ResultDisplay label="Sparkel" value={`${formatNumber(results.fillerKg)} kg`} copyable />
            <ResultDisplay label="Fugeremse" value={`${formatNumber(results.tapeMeters)} m`} copyable />
            <ResultDisplay label="Skruer" value={formatNumber(results.screws)} copyable />
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
        <SelectInput id="sheetSize" label="Platestørrelse" value={inputs.sheetSize} onChange={(v) => setInput('sheetSize', v as SheetSize)} options={SHEET_OPTIONS} error={errors.sheetSize} />
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="includeCeiling" checked={inputs.includeCeiling} onChange={(e) => setInput('includeCeiling', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="includeCeiling" className="text-sm">Ta med taket</label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default DrywallCalculator;
