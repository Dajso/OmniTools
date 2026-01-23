'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateSquareFootage, type SquareFootageInputs, type SquareFootageResults, type ShapeType } from '@/lib/calculations/home/square-footage-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const squareFootageSchema = z.object({
  shape: z.enum(['rectangle', 'triangle', 'circle', 'trapezoid']),
  length: z.number().min(0).max(100000).optional(),
  width: z.number().min(0).max(100000).optional(),
  height: z.number().min(0).max(100000).optional(),
  radius: z.number().min(0).max(100000).optional(),
  topWidth: z.number().min(0).max(100000).optional(),
  bottomWidth: z.number().min(0).max(100000).optional(),
});

const INITIAL_INPUTS = { shape: 'rectangle' as ShapeType, length: 20, width: 15, height: 0, radius: 0, topWidth: 0, bottomWidth: 0 };

type SquareFootageInputsWithIndex = SquareFootageInputs & Record<string, unknown>;

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rectangle/Square' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'trapezoid', label: 'Trapezoid' },
];

export function SquareFootageCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<SquareFootageInputsWithIndex, SquareFootageResults>({
    initialInputs: INITIAL_INPUTS as SquareFootageInputsWithIndex,
    schema: squareFootageSchema as z.ZodType<SquareFootageInputsWithIndex>,
    calculate: (formInputs) => calculateSquareFootage(formInputs as SquareFootageInputs),
    storageKey: 'square-footage-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Square Footage Calculator"
      description="Calculate area for rectangles, triangles, circles, and trapezoids"
      formula="Area varies by shape"
      formulaExplanation="Rectangle: L×W, Triangle: ½×B×H, Circle: π×r², Trapezoid: ½×(a+b)×h"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Area (sq ft)" value={formatNumber(results.areaSqFt, { locale: 'en-US', maximumFractionDigits: 2 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Area (sq yd)" value={formatNumber(results.areaSqYd, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Area (sq m)" value={formatNumber(results.areaSqM, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Acres" value={formatNumber(results.areaAcres, { locale: 'en-US', maximumFractionDigits: 4 })} copyable />
            <ResultDisplay label="Perimeter (ft)" value={formatNumber(results.perimeterFt, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
          </div>
        </div>
      )}
    >
      <SelectInput id="shape" label="Shape" value={inputs.shape} onChange={(v) => setInput('shape', v as ShapeType)} options={SHAPE_OPTIONS} error={errors.shape} />

      {inputs.shape === 'rectangle' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="length" label="Length" value={inputs.length || 0} onChange={(v) => setInput('length', v)} min={0.1} step={1} unit="ft" error={errors.length} required />
          <NumberInput id="width" label="Width" value={inputs.width || 0} onChange={(v) => setInput('width', v)} min={0.1} step={1} unit="ft" error={errors.width} required />
        </div>
      )}

      {inputs.shape === 'triangle' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="length" label="Base" value={inputs.length || 0} onChange={(v) => setInput('length', v)} min={0.1} step={1} unit="ft" error={errors.length} required />
          <NumberInput id="height" label="Height" value={inputs.height || 0} onChange={(v) => setInput('height', v)} min={0.1} step={1} unit="ft" error={errors.height} required />
        </div>
      )}

      {inputs.shape === 'circle' && (
        <NumberInput id="radius" label="Radius" value={inputs.radius || 0} onChange={(v) => setInput('radius', v)} min={0.1} step={1} unit="ft" error={errors.radius} required />
      )}

      {inputs.shape === 'trapezoid' && (
        <div className="grid grid-cols-3 gap-4">
          <NumberInput id="topWidth" label="Top Width" value={inputs.topWidth || 0} onChange={(v) => setInput('topWidth', v)} min={0.1} step={1} unit="ft" error={errors.topWidth} required />
          <NumberInput id="bottomWidth" label="Bottom Width" value={inputs.bottomWidth || 0} onChange={(v) => setInput('bottomWidth', v)} min={0.1} step={1} unit="ft" error={errors.bottomWidth} required />
          <NumberInput id="height" label="Height" value={inputs.height || 0} onChange={(v) => setInput('height', v)} min={0.1} step={1} unit="ft" error={errors.height} required />
        </div>
      )}
    </CalculatorBase>
  );
}

export default SquareFootageCalculator;
