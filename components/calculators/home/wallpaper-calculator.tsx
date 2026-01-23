'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateWallpaper, type WallpaperInputs, type WallpaperResults } from '@/lib/calculations/home/wallpaper-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const wallpaperSchema = z.object({
  roomLength: z.number().min(1).max(1000),
  roomWidth: z.number().min(1).max(1000),
  wallHeight: z.number().min(1).max(50),
  numberOfDoors: z.number().min(0).max(20),
  numberOfWindows: z.number().min(0).max(20),
  rollWidth: z.number().min(15).max(36),
  rollLength: z.number().min(10).max(60),
  patternRepeat: z.number().min(0).max(36),
});

const INITIAL_INPUTS = { roomLength: 12, roomWidth: 10, wallHeight: 8, numberOfDoors: 1, numberOfWindows: 2, rollWidth: 21, rollLength: 33, patternRepeat: 0 };

export function WallpaperCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, WallpaperResults>({
    initialInputs: INITIAL_INPUTS,
    schema: wallpaperSchema,
    calculate: (formInputs) => calculateWallpaper(formInputs as WallpaperInputs),
    storageKey: 'wallpaper-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Wallpaper Calculator"
      description="Calculate how many rolls of wallpaper you need"
      formula="Rolls = Usable Area ÷ Coverage per Roll"
      formulaExplanation="Accounts for doors, windows, and pattern matching waste"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total Rolls Needed" value={results.totalRolls.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Wall Area" value={`${formatNumber(results.totalWallArea)} sq ft`} copyable />
            <ResultDisplay label="Usable Area" value={`${formatNumber(results.usableArea)} sq ft`} copyable />
            <ResultDisplay label="Coverage/Roll" value={`${formatNumber(results.coveragePerRoll, { locale: 'en-US', maximumFractionDigits: 1 })} sq ft`} copyable />
            <ResultDisplay label="Extra Rolls" value={results.extraRolls.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="roomLength" label="Room Length" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={0.5} unit="ft" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Room Width" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={0.5} unit="ft" error={errors.roomWidth} required />
        <NumberInput id="wallHeight" label="Wall Height" value={inputs.wallHeight} onChange={(v) => setInput('wallHeight', v)} min={1} step={0.5} unit="ft" error={errors.wallHeight} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="numberOfDoors" label="Doors" value={inputs.numberOfDoors} onChange={(v) => setInput('numberOfDoors', v)} min={0} step={1} error={errors.numberOfDoors} />
        <NumberInput id="numberOfWindows" label="Windows" value={inputs.numberOfWindows} onChange={(v) => setInput('numberOfWindows', v)} min={0} step={1} error={errors.numberOfWindows} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="rollWidth" label="Roll Width" value={inputs.rollWidth} onChange={(v) => setInput('rollWidth', v)} min={15} max={36} step={1} unit="in" error={errors.rollWidth} />
        <NumberInput id="rollLength" label="Roll Length" value={inputs.rollLength} onChange={(v) => setInput('rollLength', v)} min={10} max={60} step={1} unit="ft" error={errors.rollLength} />
        <NumberInput id="patternRepeat" label="Pattern Repeat" value={inputs.patternRepeat} onChange={(v) => setInput('patternRepeat', v)} min={0} max={36} step={1} unit="in" error={errors.patternRepeat} />
      </div>
    </CalculatorBase>
  );
}

export default WallpaperCalculator;
