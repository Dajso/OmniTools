'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateGravel, type GravelResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const gravelSchema = z.object({
  length: z.number().min(0.1, 'Lengden må være over 0').max(1000, 'Lengden er for stor'),
  width: z.number().min(0.1, 'Bredden må være over 0').max(1000, 'Bredden er for stor'),
  depthCm: z.number().min(1, 'Dybden må være minst 1 cm').max(200, 'Dybden er for stor'),
  density: z.number().min(500).max(3000),
  compactionPercent: z.number().min(0, 'Kan ikke være negativt').max(50, 'Tillegget er for høyt'),
});

type GravelFormInputs = z.infer<typeof gravelSchema>;

const INITIAL_INPUTS: GravelFormInputs = { length: 10, width: 3, depthCm: 10, density: 1700, compactionPercent: 15 };

const MATERIALS = [
  { value: '1500', label: 'Singel / pukk 8–16 mm (ca. 1 500 kg/m³)' },
  { value: '1600', label: 'Pukk 16–32 mm (ca. 1 600 kg/m³)' },
  { value: '1700', label: 'Grus / bærelag 0–32 mm (ca. 1 700 kg/m³)' },
  { value: '1900', label: 'Knust fjell 0–63 mm (ca. 1 900 kg/m³)' },
  { value: '1400', label: 'Sand (ca. 1 400 kg/m³)' },
];

export function GravelCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<GravelFormInputs, GravelResults>({
      initialInputs: INITIAL_INPUTS,
      schema: gravelSchema,
      calculate: calculateGravel,
      storageKey: 'gravel-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Grus- og pukkalkulator"
      description="Regn ut hvor mange tonn grus, pukk eller sand du trenger"
      formula="Tonn = areal × dybde × (1 + komprimering) × tetthet ÷ 1000"
      formulaExplanation="Løs masse setter seg når den komprimeres, så du må bestille litt mer enn det ferdige volumet."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Vekt å bestille" value={`${formatNumber(results.tons, { maximumFractionDigits: 2 })} tonn`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Areal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Volum" value={`${formatNumber(results.volume, { maximumFractionDigits: 2 })} m³`} copyable />
            <ResultDisplay label="Volum med komprimering" value={`${formatNumber(results.volumeWithCompaction, { maximumFractionDigits: 2 })} m³`} copyable />
            <ResultDisplay label="Storsekker à ca. 1 tonn" value={results.bigBags.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="length" label="Lengde" value={inputs.length} onChange={(v) => setInput('length', v)} min={0.1} step={0.5} unit="m" error={errors.length} required />
        <NumberInput id="width" label="Bredde" value={inputs.width} onChange={(v) => setInput('width', v)} min={0.1} step={0.5} unit="m" error={errors.width} required />
        <NumberInput id="depthCm" label="Lagtykkelse" value={inputs.depthCm} onChange={(v) => setInput('depthCm', v)} min={1} step={1} unit="cm" error={errors.depthCm} required />
      </div>
      <SelectInput id="density" label="Materiale" value={String(inputs.density)} onChange={(v) => setInput('density', Number(v))} options={MATERIALS} error={errors.density} />
      <NumberInput id="compactionPercent" label="Tillegg for komprimering" value={inputs.compactionPercent} onChange={(v) => setInput('compactionPercent', v)} min={0} max={50} step={1} unit="%" error={errors.compactionPercent} />
      <p className="text-xs text-muted-foreground">
        Tettheten varierer med fuktighet og leverandør. Spør leverandøren om oppgitt kg/m³ for akkurat din vare.
      </p>
    </CalculatorBase>
  );
}

export default GravelCalculator;
