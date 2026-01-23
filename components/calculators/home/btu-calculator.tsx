'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateBTU, type BTUInputs, type BTUResults } from '@/lib/calculations/home/btu-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const btuSchema = z.object({
  roomLength: z.number().min(1).max(1000),
  roomWidth: z.number().min(1).max(1000),
  ceilingHeight: z.number().min(6).max(30),
  sunExposure: z.enum(['low', 'medium', 'high']),
  occupants: z.number().min(1).max(50),
  isKitchen: z.boolean(),
});

type BTUFormInputs = z.infer<typeof btuSchema>;

const INITIAL_INPUTS: BTUFormInputs = { roomLength: 15, roomWidth: 12, ceilingHeight: 8, sunExposure: 'medium', occupants: 2, isKitchen: false };

const SUN_OPTIONS = [
  { value: 'low', label: 'Low (shaded)' },
  { value: 'medium', label: 'Medium (average)' },
  { value: 'high', label: 'High (sunny)' },
];

export function BTUCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<BTUFormInputs, BTUResults>({
    initialInputs: INITIAL_INPUTS,
    schema: btuSchema,
    calculate: (formInputs) => calculateBTU(formInputs as BTUInputs),
    storageKey: 'btu-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Air Conditioner BTU Calculator"
      description="Calculate the BTU capacity needed for your room"
      formula="BTU = Area × 20 + Adjustments"
      formulaExplanation="Adjusts for ceiling height, sun exposure, occupants, and kitchen use"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="BTU Needed" value={formatNumber(results.totalBTU)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Room Area" value={`${formatNumber(results.areaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Base BTU" value={formatNumber(results.baseBTU)} copyable />
            <ResultDisplay label="Adjustments" value={formatNumber(results.adjustments)} copyable />
            <ResultDisplay label="AC Tonnage" value={`${results.tonnage} tons`} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="roomLength" label="Room Length" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={1} unit="ft" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Room Width" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={1} unit="ft" error={errors.roomWidth} required />
        <NumberInput id="ceilingHeight" label="Ceiling Height" value={inputs.ceilingHeight} onChange={(v) => setInput('ceilingHeight', v)} min={6} max={30} step={1} unit="ft" error={errors.ceilingHeight} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="sunExposure" label="Sun Exposure" value={inputs.sunExposure} onChange={(v) => setInput('sunExposure', v as 'low' | 'medium' | 'high')} options={SUN_OPTIONS} error={errors.sunExposure} />
        <NumberInput id="occupants" label="Occupants" value={inputs.occupants} onChange={(v) => setInput('occupants', v)} min={1} max={50} step={1} error={errors.occupants} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isKitchen" checked={inputs.isKitchen} onChange={(e) => setInput('isKitchen', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <label htmlFor="isKitchen" className="text-sm">This is a kitchen (adds 4,000 BTU)</label>
      </div>
    </CalculatorBase>
  );
}

export default BTUCalculator;
