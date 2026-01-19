'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculatePottingSoil,
  type PottingSoilResult,
  type ContainerShape,
  type LengthUnit,
} from '@/lib/calculations/garden';

const pottingSoilSchema = z.object({
  shape: z.enum(['cylinder', 'rectangular', 'tapered']),
  diameter: z.number().min(1).max(100),
  topDiameter: z.number().min(1).max(100),
  bottomDiameter: z.number().min(1).max(100),
  length: z.number().min(1).max(200),
  width: z.number().min(1).max(200),
  height: z.number().min(1).max(100),
  lengthUnit: z.enum(['inches', 'cm', 'feet', 'meters']),
  fillPercentage: z.number().min(50).max(100),
});

type PottingSoilInputs = z.infer<typeof pottingSoilSchema>;

const INITIAL_INPUTS: PottingSoilInputs = {
  shape: 'cylinder',
  diameter: 12,
  topDiameter: 14,
  bottomDiameter: 10,
  length: 24,
  width: 12,
  height: 10,
  lengthUnit: 'inches',
  fillPercentage: 100,
};

const SHAPE_OPTIONS = [
  { value: 'cylinder', label: 'Round Pot (Cylinder)' },
  { value: 'rectangular', label: 'Rectangular Planter' },
  { value: 'tapered', label: 'Tapered Pot (Frustum)' },
];

const UNIT_OPTIONS = [
  { value: 'inches', label: 'Inches' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'feet', label: 'Feet' },
  { value: 'meters', label: 'Meters' },
];

function calculateSoil(inputs: PottingSoilInputs): PottingSoilResult {
  return calculatePottingSoil({
    shape: inputs.shape as ContainerShape,
    diameter: inputs.diameter,
    topDiameter: inputs.topDiameter,
    bottomDiameter: inputs.bottomDiameter,
    length: inputs.length,
    width: inputs.width,
    height: inputs.height,
    lengthUnit: inputs.lengthUnit as LengthUnit,
    fillPercentage: inputs.fillPercentage,
  });
}

export function PottingSoilCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<PottingSoilInputs, PottingSoilResult>({
    initialInputs: INITIAL_INPUTS,
    schema: pottingSoilSchema,
    calculate: calculateSoil,
    storageKey: 'potting-soil-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  const unitLabel = inputs.lengthUnit === 'inches' ? 'in' :
                    inputs.lengthUnit === 'cm' ? 'cm' :
                    inputs.lengthUnit === 'feet' ? 'ft' : 'm';

  return (
    <CalculatorBase
      title="Potting Soil Volume Calculator"
      description="Calculate how much potting soil you need for containers and planters"
      formula="V = πr²h (cylinder) or V = L×W×H (rectangular)"
      formulaExplanation="Volume calculated based on container shape and dimensions"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Volume (Gallons)"
                value={results.volumeGallons}
                unit="gal"
                highlight
                copyable
              />
              <ResultDisplay
                label="Volume (Quarts)"
                value={results.volumeQuarts}
                unit="qt"
                copyable
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Volume (Liters)"
                value={results.volumeLiters}
                unit="L"
              />
              <ResultDisplay
                label="Cubic Feet"
                value={results.volumeCubicFeet}
                unit="cu ft"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Bags Needed</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="8-Quart Bags"
                  value={results.bagsNeeded.small8qt}
                  unit="bags"
                />
                <ResultDisplay
                  label="16-Quart Bags"
                  value={results.bagsNeeded.medium16qt}
                  unit="bags"
                />
                <ResultDisplay
                  label="1 Cu Ft Bags"
                  value={results.bagsNeeded.large1cuft}
                  unit="bags"
                />
                <ResultDisplay
                  label="2 Cu Ft Bags"
                  value={results.bagsNeeded.xlarge2cuft}
                  unit="bags"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Leave 1-2 inches from rim for watering</li>
                <li>• Add drainage material at bottom for large pots</li>
                <li>• Mix in perlite for better drainage</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="shape"
        label="Container Shape"
        value={inputs.shape}
        onChange={(v) => setInput('shape', v as ContainerShape)}
        options={SHAPE_OPTIONS}
      />

      <SelectInput
        id="lengthUnit"
        label="Measurement Unit"
        value={inputs.lengthUnit}
        onChange={(v) => setInput('lengthUnit', v as LengthUnit)}
        options={UNIT_OPTIONS}
      />

      {inputs.shape === 'cylinder' && (
        <NumberInput
          id="diameter"
          label="Diameter"
          value={inputs.diameter}
          onChange={(v) => setInput('diameter', v)}
          min={1}
          max={100}
          step={0.5}
          unit={unitLabel}
          error={errors.diameter}
          required
        />
      )}

      {inputs.shape === 'tapered' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="topDiameter"
            label="Top Diameter"
            value={inputs.topDiameter}
            onChange={(v) => setInput('topDiameter', v)}
            min={1}
            max={100}
            step={0.5}
            unit={unitLabel}
            error={errors.topDiameter}
            required
          />
          <NumberInput
            id="bottomDiameter"
            label="Bottom Diameter"
            value={inputs.bottomDiameter}
            onChange={(v) => setInput('bottomDiameter', v)}
            min={1}
            max={100}
            step={0.5}
            unit={unitLabel}
            error={errors.bottomDiameter}
            required
          />
        </div>
      )}

      {inputs.shape === 'rectangular' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="length"
            label="Length"
            value={inputs.length}
            onChange={(v) => setInput('length', v)}
            min={1}
            max={200}
            step={0.5}
            unit={unitLabel}
            error={errors.length}
            required
          />
          <NumberInput
            id="width"
            label="Width"
            value={inputs.width}
            onChange={(v) => setInput('width', v)}
            min={1}
            max={200}
            step={0.5}
            unit={unitLabel}
            error={errors.width}
            required
          />
        </div>
      )}

      <NumberInput
        id="height"
        label="Height / Depth"
        value={inputs.height}
        onChange={(v) => setInput('height', v)}
        min={1}
        max={100}
        step={0.5}
        unit={unitLabel}
        error={errors.height}
        required
      />

      <NumberInput
        id="fillPercentage"
        label="Fill Percentage"
        value={inputs.fillPercentage}
        onChange={(v) => setInput('fillPercentage', v)}
        min={50}
        max={100}
        step={5}
        unit="%"
        error={errors.fillPercentage}
      />
    </CalculatorBase>
  );
}

export default PottingSoilCalculator;
