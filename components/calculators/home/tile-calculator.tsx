'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateTiles, type TileInputs, type TileResults } from '@/lib/calculations/home/tile-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const tileSchema = z.object({
  roomLength: z.number().min(1).max(1000),
  roomWidth: z.number().min(1).max(1000),
  tileLength: z.number().min(1).max(48),
  tileWidth: z.number().min(1).max(48),
  wastePercent: z.number().min(0).max(30),
});

const INITIAL_INPUTS = { roomLength: 12, roomWidth: 10, tileLength: 12, tileWidth: 12, wastePercent: 10 };

export function TileCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, TileResults>({
    initialInputs: INITIAL_INPUTS,
    schema: tileSchema,
    calculate: (formInputs) => calculateTiles(formInputs as TileInputs),
    storageKey: 'tile-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Tile Calculator"
      description="Calculate how many tiles you need for your floor or wall"
      formula="Tiles = Room Area ÷ Tile Area + Waste"
      formulaExplanation="Tile area converted from square inches to square feet"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total Tiles Needed" value={results.totalTiles.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Room Area" value={`${formatNumber(results.roomAreaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Tile Area" value={`${formatNumber(results.tileAreaSqFt, { locale: 'en-US', maximumFractionDigits: 2 })} sq ft`} copyable />
            <ResultDisplay label="Tiles (no waste)" value={results.tilesNeeded.toString()} copyable />
            <ResultDisplay label="Extra for Waste" value={results.wasteTiles.toString()} copyable />
            <ResultDisplay label="Boxes (10/box)" value={results.boxes.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="roomLength" label="Room Length" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={0.5} unit="ft" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Room Width" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={0.5} unit="ft" error={errors.roomWidth} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="tileLength" label="Tile Length" value={inputs.tileLength} onChange={(v) => setInput('tileLength', v)} min={1} max={48} step={1} unit="in" error={errors.tileLength} required />
        <NumberInput id="tileWidth" label="Tile Width" value={inputs.tileWidth} onChange={(v) => setInput('tileWidth', v)} min={1} max={48} step={1} unit="in" error={errors.tileWidth} required />
        <NumberInput id="wastePercent" label="Waste %" value={inputs.wastePercent} onChange={(v) => setInput('wastePercent', v)} min={0} max={30} step={5} unit="%" error={errors.wastePercent} />
      </div>
    </CalculatorBase>
  );
}

export default TileCalculator;
