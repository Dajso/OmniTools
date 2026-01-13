'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateDrywall, type DrywallInputs, type DrywallResults } from '@/lib/calculations/home/drywall-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const drywallSchema = z.object({
  roomLength: z.number().min(1).max(1000),
  roomWidth: z.number().min(1).max(1000),
  wallHeight: z.number().min(1).max(50),
  includeCeiling: z.boolean(),
  numberOfDoors: z.number().min(0).max(20),
  numberOfWindows: z.number().min(0).max(20),
  sheetSize: z.enum(['4x8', '4x10', '4x12']),
});

type DrywallFormInputs = z.infer<typeof drywallSchema>;

const INITIAL_INPUTS: DrywallFormInputs = { roomLength: 12, roomWidth: 10, wallHeight: 8, includeCeiling: true, numberOfDoors: 1, numberOfWindows: 2, sheetSize: '4x8' };

const SHEET_OPTIONS = [
  { value: '4x8', label: '4\' × 8\' (32 sq ft)' },
  { value: '4x10', label: '4\' × 10\' (40 sq ft)' },
  { value: '4x12', label: '4\' × 12\' (48 sq ft)' },
];

export function DrywallCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<DrywallFormInputs, DrywallResults>({
    initialInputs: INITIAL_INPUTS,
    schema: drywallSchema,
    calculate: (formInputs) => calculateDrywall(formInputs as DrywallInputs),
    storageKey: 'drywall-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Drywall Calculator"
      description="Calculate drywall sheets and supplies needed"
      formula="Sheets = Total Area ÷ Sheet Area"
      formulaExplanation="Includes 10% waste factor"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Sheets Needed" value={results.sheetsNeeded.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Wall Area" value={`${formatNumber(results.wallAreaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Ceiling Area" value={`${formatNumber(results.ceilingAreaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Total Area" value={`${formatNumber(results.totalAreaSqFt)} sq ft`} copyable />
            <ResultDisplay label="Area per Sheet" value={`${results.areaPerSheet} sq ft`} copyable />
          </div>
          <div className="text-sm font-medium mt-4">Supplies Needed:</div>
          <div className="grid grid-cols-3 gap-3">
            <ResultDisplay label="Joint Compound" value={`${results.jointCompoundGallons} gal`} copyable />
            <ResultDisplay label="Joint Tape" value={`${formatNumber(results.jointTapeFeet)} ft`} copyable />
            <ResultDisplay label="Screws" value={formatNumber(results.screws)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="roomLength" label="Room Length" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={1} unit="ft" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Room Width" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={1} unit="ft" error={errors.roomWidth} required />
        <NumberInput id="wallHeight" label="Wall Height" value={inputs.wallHeight} onChange={(v) => setInput('wallHeight', v)} min={1} max={50} step={1} unit="ft" error={errors.wallHeight} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="numberOfDoors" label="Doors" value={inputs.numberOfDoors} onChange={(v) => setInput('numberOfDoors', v)} min={0} step={1} error={errors.numberOfDoors} />
        <NumberInput id="numberOfWindows" label="Windows" value={inputs.numberOfWindows} onChange={(v) => setInput('numberOfWindows', v)} min={0} step={1} error={errors.numberOfWindows} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="sheetSize" label="Sheet Size" value={inputs.sheetSize} onChange={(v) => setInput('sheetSize', v as '4x8' | '4x10' | '4x12')} options={SHEET_OPTIONS} error={errors.sheetSize} />
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="includeCeiling" checked={inputs.includeCeiling} onChange={(e) => setInput('includeCeiling', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="includeCeiling" className="text-sm">Include ceiling</label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default DrywallCalculator;
