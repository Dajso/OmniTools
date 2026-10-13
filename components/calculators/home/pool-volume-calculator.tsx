'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculatePoolVolume, type PoolVolumeResults, type PoolShape } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const poolVolumeSchema = z.object({
  shape: z.enum(['rectangle', 'round', 'oval', 'kidney']),
  length: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  width: z.number().min(0, 'Kan ikke være negativt').max(100, 'Bredden er for stor'),
  shallowDepth: z.number().min(0.1, 'Dybden må være over 0').max(6, 'Dybden er for stor'),
  deepDepth: z.number().min(0.1, 'Dybden må være over 0').max(6, 'Dybden er for stor'),
});

type PoolFormInputs = z.infer<typeof poolVolumeSchema>;

const INITIAL_INPUTS: PoolFormInputs = { shape: 'rectangle', length: 5, width: 3, shallowDepth: 1.0, deepDepth: 1.5 };

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rektangulært' },
  { value: 'round', label: 'Rundt' },
  { value: 'oval', label: 'Ovalt' },
  { value: 'kidney', label: 'Nyreformet' },
];

export function PoolVolumeCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<PoolFormInputs, PoolVolumeResults>({
      initialInputs: INITIAL_INPUTS,
      schema: poolVolumeSchema,
      calculate: calculatePoolVolume,
      storageKey: 'pool-volume-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Bassengvolum"
      description="Regn ut hvor mange liter vann det er i et basseng eller en badestamp"
      formula="Volum = overflateareal × gjennomsnittsdybde"
      formulaExplanation="Gjennomsnittsdybden er snittet av grunneste og dypeste punkt. For rundt basseng er lengden diameteren."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Vannmengde" value={`${formatNumber(results.volumeLiters)} liter`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Volum" value={`${formatNumber(results.volumeM3, { maximumFractionDigits: 1 })} m³`} copyable />
            <ResultDisplay label="Overflateareal" value={`${formatNumber(results.surfaceArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Gjennomsnittsdybde" value={`${formatNumber(results.averageDepth, { maximumFractionDigits: 2 })} m`} copyable />
          </div>
        </div>
      )}
    >
      <SelectInput id="shape" label="Form" value={inputs.shape} onChange={(v) => setInput('shape', v as PoolShape)} options={SHAPE_OPTIONS} error={errors.shape} />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label={inputs.shape === 'round' ? 'Diameter' : 'Lengde'} value={inputs.length} onChange={(v) => setInput('length', v)} min={0.5} step={0.1} unit="m" error={errors.length} required />
        {inputs.shape !== 'round' && (
          <NumberInput id="width" label="Bredde" value={inputs.width} onChange={(v) => setInput('width', v)} min={0.1} step={0.1} unit="m" error={errors.width} required />
        )}
        <NumberInput id="shallowDepth" label="Grunneste dybde" value={inputs.shallowDepth} onChange={(v) => setInput('shallowDepth', v)} min={0.1} step={0.1} unit="m" error={errors.shallowDepth} required />
        <NumberInput id="deepDepth" label="Dypeste dybde" value={inputs.deepDepth} onChange={(v) => setInput('deepDepth', v)} min={0.1} step={0.1} unit="m" error={errors.deepDepth} required />
      </div>
    </CalculatorBase>
  );
}

export default PoolVolumeCalculator;
