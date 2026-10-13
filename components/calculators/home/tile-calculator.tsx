'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateTiles, type TileResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const tileSchema = z.object({
  roomLength: z.number().min(0.1, 'Lengden må være over 0').max(100, 'Lengden er for stor'),
  roomWidth: z.number().min(0.1, 'Bredden må være over 0').max(100, 'Bredden er for stor'),
  tileLengthCm: z.number().min(1, 'Flisen må være minst 1 cm').max(300, 'Flisen er for stor'),
  tileWidthCm: z.number().min(1, 'Flisen må være minst 1 cm').max(300, 'Flisen er for stor'),
  wastePercent: z.number().min(0, 'Kan ikke være negativt').max(50, 'Svinnet er for høyt'),
  tilesPerBox: z.number().min(0, 'Kan ikke være negativt').max(1000, 'For mange fliser per eske'),
});

type TileFormInputs = z.infer<typeof tileSchema>;

const INITIAL_INPUTS: TileFormInputs = {
  roomLength: 3,
  roomWidth: 2.5,
  tileLengthCm: 30,
  tileWidthCm: 30,
  wastePercent: 10,
  tilesPerBox: 11,
};

const TILE_PRESETS = [
  { label: '20×20', l: 20, w: 20 },
  { label: '30×30', l: 30, w: 30 },
  { label: '30×60', l: 30, w: 60 },
  { label: '60×60', l: 60, w: 60 },
  { label: '60×120', l: 60, w: 120 },
];

export function TileCalculator() {
  const { inputs, setInput, setInputs, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<TileFormInputs, TileResults>({
      initialInputs: INITIAL_INPUTS,
      schema: tileSchema,
      calculate: calculateTiles,
      storageKey: 'tile-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Flisekalkulator"
      description="Regn ut hvor mange fliser du trenger til gulv eller vegg"
      formula="Antall fliser = romareal ÷ flisareal, pluss svinn"
      formulaExplanation="Svinn dekker kapp og brekkasje. Bruk 10 % for rette fliser og 15 % eller mer ved diagonalt legging."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Fliser å kjøpe" value={formatNumber(results.totalTiles)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Romareal" value={`${formatNumber(results.roomArea, { maximumFractionDigits: 2 })} m²`} copyable />
            <ResultDisplay label="Fliser uten svinn" value={formatNumber(results.tilesNeeded)} copyable />
            <ResultDisplay label="Ekstra for svinn" value={formatNumber(results.wasteTiles)} copyable />
            <ResultDisplay label="Areal du kjøper" value={`${formatNumber(results.areaToBuy, { maximumFractionDigits: 2 })} m²`} copyable />
            {inputs.tilesPerBox > 0 && <ResultDisplay label="Esker" value={formatNumber(results.boxes)} copyable />}
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="roomLength" label="Romlengde" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={0.1} step={0.1} unit="m" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Rombredde" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={0.1} step={0.1} unit="m" error={errors.roomWidth} required />
        <NumberInput id="tileLengthCm" label="Flislengde" value={inputs.tileLengthCm} onChange={(v) => setInput('tileLengthCm', v)} min={1} step={1} unit="cm" error={errors.tileLengthCm} required />
        <NumberInput id="tileWidthCm" label="Flisbredde" value={inputs.tileWidthCm} onChange={(v) => setInput('tileWidthCm', v)} min={1} step={1} unit="cm" error={errors.tileWidthCm} required />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Vanlige flisstørrelser">
        {TILE_PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => setInputs({ tileLengthCm: p.l, tileWidthCm: p.w })}
            className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.tileLengthCm === p.l && inputs.tileWidthCm === p.w ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            {p.label} cm
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="wastePercent" label="Tillegg for svinn" value={inputs.wastePercent} onChange={(v) => setInput('wastePercent', v)} min={0} max={50} step={1} unit="%" error={errors.wastePercent} />
        <NumberInput id="tilesPerBox" label="Fliser per eske (valgfritt)" value={inputs.tilesPerBox} onChange={(v) => setInput('tilesPerBox', v)} min={0} step={1} error={errors.tilesPerBox} />
      </div>
    </CalculatorBase>
  );
}

export default TileCalculator;
