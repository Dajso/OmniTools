'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculatePaint,
  DEFAULT_COVERAGE_PER_GALLON,
  type PaintInputs,
  type PaintResults,
} from '@/lib/calculations/home/paint-calculator';
import { formatNumber } from '@/lib/utils/formatting';

/**
 * Zod schema for paint calculator inputs
 */
const paintSchema = z.object({
  roomLength: z.number().min(1, 'Length must be at least 1 ft').max(1000, 'Length too large'),
  roomWidth: z.number().min(1, 'Width must be at least 1 ft').max(1000, 'Width too large'),
  wallHeight: z.number().min(1, 'Height must be at least 1 ft').max(100, 'Height too large'),
  numberOfDoors: z.number().min(0, 'Cannot be negative').max(50, 'Too many doors'),
  numberOfWindows: z.number().min(0, 'Cannot be negative').max(50, 'Too many windows'),
  numberOfCoats: z.number().min(1, 'At least 1 coat required').max(5, 'Maximum 5 coats'),
  coveragePerGallon: z.number().min(100, 'Coverage too low').max(600, 'Coverage too high'),
});

type PaintFormInputs = z.infer<typeof paintSchema>;

const INITIAL_INPUTS: PaintFormInputs = {
  roomLength: 12,
  roomWidth: 10,
  wallHeight: 8,
  numberOfDoors: 1,
  numberOfWindows: 2,
  numberOfCoats: 2,
  coveragePerGallon: DEFAULT_COVERAGE_PER_GALLON,
};

/**
 * Paint Calculator Component
 */
export function PaintCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<PaintFormInputs, PaintResults>({
    initialInputs: INITIAL_INPUTS,
    schema: paintSchema,
    calculate: (formInputs) => {
      const paintInputs: PaintInputs = {
        roomLength: formInputs.roomLength,
        roomWidth: formInputs.roomWidth,
        wallHeight: formInputs.wallHeight,
        numberOfDoors: formInputs.numberOfDoors,
        numberOfWindows: formInputs.numberOfWindows,
        numberOfCoats: formInputs.numberOfCoats,
        coveragePerGallon: formInputs.coveragePerGallon,
      };
      return calculatePaint(paintInputs);
    },
    storageKey: 'paint-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  const formula = 'Paint Needed = (Wall Area - Doors - Windows) x Coats / Coverage';
  const formulaExplanation = 'Wall Area = 2 x (Length + Width) x Height. Standard door = 20 sq ft, window = 15 sq ft.';

  return (
    <CalculatorBase
      title="Paint Calculator"
      description="Calculate how much paint you need for your room"
      formula={formula}
      formulaExplanation={formulaExplanation}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Paint Needed"
              value={`${results.gallonsToPurchase} gallon${results.gallonsToPurchase !== 1 ? 's' : ''}`}
              highlight
              copyable
            />
            {results.quartsNeeded > 0 && (
              <p className="text-sm text-muted-foreground">
                You need less than 1 gallon. Consider buying {results.quartsNeeded} quart{results.quartsNeeded !== 1 ? 's' : ''} instead.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total Wall Area"
                value={`${formatNumber(results.totalWallArea)} sq ft`}
                copyable
              />
              <ResultDisplay
                label="Paintable Area"
                value={`${formatNumber(results.paintableArea)} sq ft`}
                copyable
              />
              <ResultDisplay
                label="Area with Coats"
                value={`${formatNumber(results.totalAreaWithCoats)} sq ft`}
                copyable
              />
              <ResultDisplay
                label="Exact Gallons"
                value={formatNumber(results.gallonsNeeded, { locale: 'en-US', maximumFractionDigits: 2 })}
                copyable
              />
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p className="font-medium mb-1">Area Breakdown:</p>
              <ul className="space-y-1">
                <li>Door area subtracted: {formatNumber(results.doorArea)} sq ft</li>
                <li>Window area subtracted: {formatNumber(results.windowArea)} sq ft</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          id="roomLength"
          label="Room Length"
          value={inputs.roomLength}
          onChange={(v) => setInput('roomLength', v)}
          min={1}
          max={1000}
          step={0.5}
          unit="ft"
          error={errors.roomLength}
          required
        />
        <NumberInput
          id="roomWidth"
          label="Room Width"
          value={inputs.roomWidth}
          onChange={(v) => setInput('roomWidth', v)}
          min={1}
          max={1000}
          step={0.5}
          unit="ft"
          error={errors.roomWidth}
          required
        />
        <NumberInput
          id="wallHeight"
          label="Wall Height"
          value={inputs.wallHeight}
          onChange={(v) => setInput('wallHeight', v)}
          min={1}
          max={100}
          step={0.5}
          unit="ft"
          error={errors.wallHeight}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="numberOfDoors"
          label="Number of Doors"
          value={inputs.numberOfDoors}
          onChange={(v) => setInput('numberOfDoors', v)}
          min={0}
          max={50}
          step={1}
          error={errors.numberOfDoors}
        />
        <NumberInput
          id="numberOfWindows"
          label="Number of Windows"
          value={inputs.numberOfWindows}
          onChange={(v) => setInput('numberOfWindows', v)}
          min={0}
          max={50}
          step={1}
          error={errors.numberOfWindows}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="numberOfCoats"
          label="Number of Coats"
          value={inputs.numberOfCoats}
          onChange={(v) => setInput('numberOfCoats', v)}
          min={1}
          max={5}
          step={1}
          error={errors.numberOfCoats}
          required
        />
        <NumberInput
          id="coveragePerGallon"
          label="Coverage per Gallon"
          value={inputs.coveragePerGallon}
          onChange={(v) => setInput('coveragePerGallon', v)}
          min={100}
          max={600}
          step={25}
          unit="sq ft"
          error={errors.coveragePerGallon}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Most paints cover 300-400 sq ft per gallon. Check your paint can for specific coverage.
      </p>
    </CalculatorBase>
  );
}

export default PaintCalculator;
