'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateGrassSeed, type GrassSeedInputs, type GrassSeedResults } from '@/lib/calculations/home/grass-seed-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const grassSeedSchema = z.object({
  length: z.number().min(1).max(100000),
  width: z.number().min(1).max(100000),
  seedType: z.enum(['new', 'overseed', 'thicken']),
  grassVariety: z.enum(['kentucky', 'fescue', 'bermuda', 'ryegrass']),
});

const INITIAL_INPUTS = { length: 50, width: 30, seedType: 'new' as const, grassVariety: 'kentucky' as const };

type GrassSeedInputsWithIndex = GrassSeedInputs & Record<string, unknown>;

const SEED_TYPE_OPTIONS = [
  { value: 'new', label: 'New Lawn' },
  { value: 'overseed', label: 'Overseeding' },
  { value: 'thicken', label: 'Thickening' },
];

const GRASS_OPTIONS = [
  { value: 'kentucky', label: 'Kentucky Bluegrass' },
  { value: 'fescue', label: 'Tall Fescue' },
  { value: 'bermuda', label: 'Bermuda Grass' },
  { value: 'ryegrass', label: 'Perennial Ryegrass' },
];

export function GrassSeedCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<GrassSeedInputsWithIndex, GrassSeedResults>({
    initialInputs: INITIAL_INPUTS as GrassSeedInputsWithIndex,
    schema: grassSeedSchema as z.ZodType<GrassSeedInputsWithIndex>,
    calculate: (formInputs) => calculateGrassSeed(formInputs as GrassSeedInputs),
    storageKey: 'grass-seed-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Grass Seed Calculator"
      description="Calculate how much grass seed you need for your lawn"
      formula="Seed (lbs) = (Area ÷ 1000) × Seed Rate"
      formulaExplanation="Seed rate varies by grass type and application"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Seed Needed" value={`${formatNumber(results.seedPounds, { locale: 'en-US', maximumFractionDigits: 1 })} lbs`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Lawn Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Seed Rate" value={`${results.seedRate} lbs/1000 sq ft`} copyable />
          </div>
          <div className="text-sm font-medium mt-4">Bags Needed:</div>
          <div className="grid grid-cols-3 gap-3">
            <ResultDisplay label="5 lb Bags" value={results.bags5lb.toString()} copyable />
            <ResultDisplay label="10 lb Bags" value={results.bags10lb.toString()} copyable />
            <ResultDisplay label="25 lb Bags" value={results.bags25lb.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label="Lawn Length" value={inputs.length} onChange={(v) => setInput('length', v)} min={1} step={5} unit="ft" error={errors.length} required />
        <NumberInput id="width" label="Lawn Width" value={inputs.width} onChange={(v) => setInput('width', v)} min={1} step={5} unit="ft" error={errors.width} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="seedType" label="Application Type" value={inputs.seedType} onChange={(v) => setInput('seedType', v as 'new' | 'overseed' | 'thicken')} options={SEED_TYPE_OPTIONS} error={errors.seedType} />
        <SelectInput id="grassVariety" label="Grass Type" value={inputs.grassVariety} onChange={(v) => setInput('grassVariety', v as 'kentucky' | 'fescue' | 'bermuda' | 'ryegrass')} options={GRASS_OPTIONS} error={errors.grassVariety} />
      </div>
    </CalculatorBase>
  );
}

export default GrassSeedCalculator;
