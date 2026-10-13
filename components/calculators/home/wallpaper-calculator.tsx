'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateWallpaper, type WallpaperResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const wallpaperSchema = z.object({
  roomLength: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  roomWidth: z.number().min(0.5, 'Bredden må være minst 0,5 m').max(100, 'Bredden er for stor'),
  wallHeight: z.number().min(1, 'Høyden må være minst 1 m').max(10, 'Høyden er for stor'),
  numberOfDoors: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange dører'),
  numberOfWindows: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange vinduer'),
  rollWidthCm: z.number().min(30, 'Rullen er for smal').max(150, 'Rullen er for bred'),
  rollLength: z.number().min(3, 'Rullen er for kort').max(50, 'Rullen er for lang'),
  patternRepeatCm: z.number().min(0, 'Kan ikke være negativt').max(150, 'Rapporten er for stor'),
});

type WallpaperFormInputs = z.infer<typeof wallpaperSchema>;

const INITIAL_INPUTS: WallpaperFormInputs = {
  roomLength: 4,
  roomWidth: 3.5,
  wallHeight: 2.4,
  numberOfDoors: 1,
  numberOfWindows: 2,
  rollWidthCm: 53,
  rollLength: 10.05,
  patternRepeatCm: 0,
};

export function WallpaperCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<WallpaperFormInputs, WallpaperResults>({
      initialInputs: INITIAL_INPUTS,
      schema: wallpaperSchema,
      calculate: calculateWallpaper,
      storageKey: 'wallpaper-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Tapetkalkulator"
      description="Regn ut hvor mange tapetruller du trenger til et rom"
      formula="Ruller = antall baner ÷ baner per rull"
      formulaExplanation="Antall baner er omkretsen delt på rullbredden. Banelengden er veggens høyde pluss 10 cm, rundet opp til hele mønsterrapporter."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Ruller å kjøpe" value={results.totalRolls.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Baner" value={results.stripsNeeded.toString()} copyable />
            <ResultDisplay label="Banelengde" value={`${formatNumber(results.stripLength, { maximumFractionDigits: 2 })} m`} copyable />
            <ResultDisplay label="Baner per rull" value={results.stripsPerRoll.toString()} copyable />
            <ResultDisplay label="Omkrets" value={`${formatNumber(results.perimeter, { maximumFractionDigits: 1 })} m`} copyable />
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
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="rollWidthCm" label="Rullbredde" value={inputs.rollWidthCm} onChange={(v) => setInput('rollWidthCm', v)} min={30} max={150} step={1} unit="cm" error={errors.rollWidthCm} />
        <NumberInput id="rollLength" label="Rulllengde" value={inputs.rollLength} onChange={(v) => setInput('rollLength', v)} min={3} max={50} step={0.05} unit="m" error={errors.rollLength} />
        <NumberInput id="patternRepeatCm" label="Mønsterrapport" value={inputs.patternRepeatCm} onChange={(v) => setInput('patternRepeatCm', v)} min={0} max={150} step={1} unit="cm" error={errors.patternRepeatCm} />
      </div>
      <p className="text-xs text-muted-foreground">
        Standard norsk tapetrull er 53 cm bred og 10,05 m lang. Mønsterrapport 0 betyr ensfarget eller tapet uten mønster som må passes.
      </p>
    </CalculatorBase>
  );
}

export default WallpaperCalculator;
