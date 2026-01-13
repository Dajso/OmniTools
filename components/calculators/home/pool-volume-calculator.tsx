'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculatePoolVolume, type PoolVolumeInputs, type PoolVolumeResults, type PoolShape } from '@/lib/calculations/home/pool-volume-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const poolVolumeSchema = z.object({
  shape: z.enum(['rectangle', 'round', 'oval', 'kidney']),
  length: z.number().min(1).max(200),
  width: z.number().min(1).max(200),
  shallowDepth: z.number().min(1).max(20),
  deepDepth: z.number().min(1).max(20),
});

const INITIAL_INPUTS = { shape: 'rectangle' as PoolShape, length: 30, width: 15, shallowDepth: 3, deepDepth: 8 };

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'round', label: 'Round' },
  { value: 'oval', label: 'Oval' },
  { value: 'kidney', label: 'Kidney' },
];

export function PoolVolumeCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, PoolVolumeResults>({
    initialInputs: INITIAL_INPUTS,
    schema: poolVolumeSchema,
    calculate: (formInputs) => calculatePoolVolume(formInputs as PoolVolumeInputs),
    storageKey: 'pool-volume-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Pool Volume Calculator"
      description="Calculate the volume of your swimming pool"
      formula="Volume = Surface Area × Average Depth"
      formulaExplanation="Converts to gallons using 7.48 gallons per cubic foot"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Pool Volume" value={`${formatNumber(results.volumeGallons)} gallons`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Surface Area" value={`${formatNumber(results.surfaceAreaSqFt, { locale: 'en-US', maximumFractionDigits: 1 })} sq ft`} copyable />
            <ResultDisplay label="Average Depth" value={`${results.averageDepth} ft`} copyable />
            <ResultDisplay label="Volume (cu ft)" value={formatNumber(results.volumeCuFt, { locale: 'en-US', maximumFractionDigits: 1 })} copyable />
            <ResultDisplay label="Volume (liters)" value={formatNumber(results.volumeLiters)} copyable />
          </div>
        </div>
      )}
    >
      <SelectInput id="shape" label="Pool Shape" value={inputs.shape} onChange={(v) => setInput('shape', v as PoolShape)} options={SHAPE_OPTIONS} error={errors.shape} />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label={inputs.shape === 'round' ? 'Diameter' : 'Length'} value={inputs.length} onChange={(v) => setInput('length', v)} min={1} step={1} unit="ft" error={errors.length} required />
        {inputs.shape !== 'round' && (
          <NumberInput id="width" label="Width" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} step={1} unit="ft" error={errors.width} required />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="shallowDepth" label="Shallow End Depth" value={inputs.shallowDepth} onChange={(v) => setInput('shallowDepth', v)} min={1} max={20} step={0.5} unit="ft" error={errors.shallowDepth} required />
        <NumberInput id="deepDepth" label="Deep End Depth" value={inputs.deepDepth} onChange={(v) => setInput('deepDepth', v)} min={1} max={20} step={0.5} unit="ft" error={errors.deepDepth} required />
      </div>
    </CalculatorBase>
  );
}

export default PoolVolumeCalculator;
