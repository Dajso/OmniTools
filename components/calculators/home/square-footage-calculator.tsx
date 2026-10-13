'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateArea, type AreaInputs, type AreaResults, type ShapeType } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const areaSchema = z.object({
  shape: z.enum(['rectangle', 'triangle', 'circle', 'trapezoid']),
  length: z.number().min(0).max(100000).optional(),
  width: z.number().min(0).max(100000).optional(),
  height: z.number().min(0).max(100000).optional(),
  radius: z.number().min(0).max(100000).optional(),
  topWidth: z.number().min(0).max(100000).optional(),
  bottomWidth: z.number().min(0).max(100000).optional(),
});

type AreaFormInputs = AreaInputs & Record<string, unknown>;

const INITIAL_INPUTS = {
  shape: 'rectangle' as ShapeType,
  length: 8,
  width: 5,
  height: 0,
  radius: 0,
  topWidth: 0,
  bottomWidth: 0,
};

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rektangel / kvadrat' },
  { value: 'triangle', label: 'Trekant' },
  { value: 'circle', label: 'Sirkel' },
  { value: 'trapezoid', label: 'Trapes' },
];

export function SquareFootageCalculator() {
  const { inputs, setInput, setInputs, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<AreaFormInputs, AreaResults>({
      initialInputs: INITIAL_INPUTS as AreaFormInputs,
      schema: areaSchema as z.ZodType<AreaFormInputs>,
      calculate: (formInputs) => calculateArea(formInputs as AreaInputs),
      storageKey: 'area-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const num = (key: keyof AreaInputs) => Number(inputs[key] ?? 0);

  return (
    <CalculatorBase
      title="Arealkalkulator"
      description="Regn ut areal og omkrets for rektangel, trekant, sirkel og trapes"
      formula="Areal avhenger av figuren"
      formulaExplanation="Rektangel: L × B. Trekant: ½ × grunnlinje × høyde. Sirkel: π × r². Trapes: ½ × (a + b) × h."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Areal" value={`${formatNumber(results.areaM2, { maximumFractionDigits: 2 })} m²`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Omkrets" value={`${formatNumber(results.perimeter, { maximumFractionDigits: 2 })} m`} copyable />
            <ResultDisplay label="Dekar" value={formatNumber(results.areaDekar, { maximumFractionDigits: 4 })} copyable />
            <ResultDisplay label="Hektar" value={formatNumber(results.areaHektar, { maximumFractionDigits: 5 })} copyable />
          </div>
        </div>
      )}
    >
      <SelectInput id="shape" label="Figur" value={String(inputs.shape)} onChange={(v) => setInputs({ shape: v as ShapeType })} options={SHAPE_OPTIONS} error={errors.shape} />
      {inputs.shape === 'rectangle' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="length" label="Lengde" value={num('length')} onChange={(v) => setInput('length', v)} min={0} step={0.1} unit="m" error={errors.length} required />
          <NumberInput id="width" label="Bredde" value={num('width')} onChange={(v) => setInput('width', v)} min={0} step={0.1} unit="m" error={errors.width} required />
        </div>
      )}
      {inputs.shape === 'triangle' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="length" label="Grunnlinje" value={num('length')} onChange={(v) => setInput('length', v)} min={0} step={0.1} unit="m" error={errors.length} required />
          <NumberInput id="height" label="Høyde" value={num('height')} onChange={(v) => setInput('height', v)} min={0} step={0.1} unit="m" error={errors.height} required />
        </div>
      )}
      {inputs.shape === 'circle' && (
        <NumberInput id="radius" label="Radius" value={num('radius')} onChange={(v) => setInput('radius', v)} min={0} step={0.1} unit="m" error={errors.radius} required />
      )}
      {inputs.shape === 'trapezoid' && (
        <div className="grid grid-cols-3 gap-4">
          <NumberInput id="topWidth" label="Øvre side" value={num('topWidth')} onChange={(v) => setInput('topWidth', v)} min={0} step={0.1} unit="m" error={errors.topWidth} required />
          <NumberInput id="bottomWidth" label="Nedre side" value={num('bottomWidth')} onChange={(v) => setInput('bottomWidth', v)} min={0} step={0.1} unit="m" error={errors.bottomWidth} required />
          <NumberInput id="height" label="Høyde" value={num('height')} onChange={(v) => setInput('height', v)} min={0} step={0.1} unit="m" error={errors.height} required />
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        1 dekar er 1 000 m², og 1 hektar er 10 000 m². Dekar brukes ofte om tomter og jordbruksareal.
      </p>
    </CalculatorBase>
  );
}

export default SquareFootageCalculator;
