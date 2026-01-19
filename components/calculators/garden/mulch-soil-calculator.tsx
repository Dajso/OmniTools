'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';

const mulchSoilSchema = z.object({
  calculationType: z.enum(['mulch', 'soil', 'gravel']),
  areaShape: z.enum(['rectangular', 'circular']),
  length: z.number().min(0.1).max(1000),
  width: z.number().min(0.1).max(1000),
  diameter: z.number().min(0.1).max(500),
  depth: z.number().min(0.5).max(24),
  unit: z.enum(['feet', 'meters']),
});

type MulchSoilInputs = z.infer<typeof mulchSoilSchema>;

interface MulchSoilResults {
  volumeCubicFeet: number;
  volumeCubicYards: number;
  volumeCubicMeters: number;
  bagsNeeded2cuft: number;
  bagsNeeded3cuft: number;
  weightLbs: number;
  weightKg: number;
  coverage: string;
}

const INITIAL_INPUTS: MulchSoilInputs = {
  calculationType: 'mulch',
  areaShape: 'rectangular',
  length: 10,
  width: 10,
  diameter: 10,
  depth: 3,
  unit: 'feet',
};

const CALCULATION_TYPE_OPTIONS = [
  { value: 'mulch', label: 'Mulch' },
  { value: 'soil', label: 'Topsoil / Garden Soil' },
  { value: 'gravel', label: 'Gravel / Stone' },
];

const AREA_SHAPE_OPTIONS = [
  { value: 'rectangular', label: 'Rectangular / Square' },
  { value: 'circular', label: 'Circular' },
];

const UNIT_OPTIONS = [
  { value: 'feet', label: 'Feet' },
  { value: 'meters', label: 'Meters' },
];

// Weight per cubic foot (approximate)
const WEIGHT_PER_CUFT = {
  mulch: 20, // lbs per cubic foot
  soil: 75,
  gravel: 100,
};

function calculateMulchSoil(inputs: MulchSoilInputs): MulchSoilResults {
  const { calculationType, areaShape, length, width, diameter, depth, unit } = inputs;

  // Convert to feet if in meters
  const lengthFt = unit === 'meters' ? length * 3.28084 : length;
  const widthFt = unit === 'meters' ? width * 3.28084 : width;
  const diameterFt = unit === 'meters' ? diameter * 3.28084 : diameter;
  const depthFt = depth / 12; // depth is always in inches

  // Calculate area in square feet
  let areaSqFt: number;
  if (areaShape === 'rectangular') {
    areaSqFt = lengthFt * widthFt;
  } else {
    const radius = diameterFt / 2;
    areaSqFt = Math.PI * radius * radius;
  }

  // Calculate volume
  const volumeCubicFeet = areaSqFt * depthFt;
  const volumeCubicYards = volumeCubicFeet / 27;
  const volumeCubicMeters = volumeCubicFeet * 0.0283168;

  // Calculate bags needed
  const bagsNeeded2cuft = Math.ceil(volumeCubicFeet / 2);
  const bagsNeeded3cuft = Math.ceil(volumeCubicFeet / 3);

  // Calculate weight
  const weightPerCuft = WEIGHT_PER_CUFT[calculationType];
  const weightLbs = volumeCubicFeet * weightPerCuft;
  const weightKg = weightLbs * 0.453592;

  // Coverage description
  const coverage = `${Math.round(areaSqFt)} sq ft at ${depth}" deep`;

  return {
    volumeCubicFeet: Math.round(volumeCubicFeet * 100) / 100,
    volumeCubicYards: Math.round(volumeCubicYards * 100) / 100,
    volumeCubicMeters: Math.round(volumeCubicMeters * 100) / 100,
    bagsNeeded2cuft,
    bagsNeeded3cuft,
    weightLbs: Math.round(weightLbs),
    weightKg: Math.round(weightKg),
    coverage,
  };
}

export function MulchSoilCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<MulchSoilInputs, MulchSoilResults>({
    initialInputs: INITIAL_INPUTS,
    schema: mulchSoilSchema,
    calculate: calculateMulchSoil,
    storageKey: 'mulch-soil-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  const unitLabel = inputs.unit === 'feet' ? 'ft' : 'm';
  const materialName = inputs.calculationType === 'mulch' ? 'Mulch' : 
                       inputs.calculationType === 'soil' ? 'Soil' : 'Gravel';

  return (
    <CalculatorBase
      title="Mulch & Soil Calculator"
      description="Calculate how much mulch, soil, or gravel you need for your landscaping project"
      formula="Volume = Area × Depth"
      formulaExplanation="Calculate cubic feet/yards needed based on coverage area and desired depth"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Coverage"
              value={results.coverage}
              highlight
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Cubic Yards"
                value={results.volumeCubicYards}
                unit="cu yd"
                highlight
                copyable
              />
              <ResultDisplay
                label="Cubic Feet"
                value={results.volumeCubicFeet}
                unit="cu ft"
                copyable
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Bags Needed</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="2 cu ft bags"
                  value={results.bagsNeeded2cuft}
                  unit="bags"
                />
                <ResultDisplay
                  label="3 cu ft bags"
                  value={results.bagsNeeded3cuft}
                  unit="bags"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Estimated Weight</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Weight"
                  value={results.weightLbs.toLocaleString()}
                  unit="lbs"
                />
                <ResultDisplay
                  label="Weight"
                  value={results.weightKg.toLocaleString()}
                  unit="kg"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Buying Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bulk delivery is usually cheaper for orders over 3 cubic yards</li>
                <li>• Add 5-10% extra for settling and waste</li>
                <li>• {materialName} depth: 2-3" for weed control, 3-4" for insulation</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="calculationType"
        label="Material Type"
        value={inputs.calculationType}
        onChange={(v) => setInput('calculationType', v as MulchSoilInputs['calculationType'])}
        options={CALCULATION_TYPE_OPTIONS}
      />

      <SelectInput
        id="unit"
        label="Measurement Unit"
        value={inputs.unit}
        onChange={(v) => setInput('unit', v as 'feet' | 'meters')}
        options={UNIT_OPTIONS}
      />

      <SelectInput
        id="areaShape"
        label="Area Shape"
        value={inputs.areaShape}
        onChange={(v) => setInput('areaShape', v as 'rectangular' | 'circular')}
        options={AREA_SHAPE_OPTIONS}
      />

      {inputs.areaShape === 'rectangular' ? (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="length"
            label="Length"
            value={inputs.length}
            onChange={(v) => setInput('length', v)}
            min={0.1}
            max={1000}
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
            min={0.1}
            max={1000}
            step={0.5}
            unit={unitLabel}
            error={errors.width}
            required
          />
        </div>
      ) : (
        <NumberInput
          id="diameter"
          label="Diameter"
          value={inputs.diameter}
          onChange={(v) => setInput('diameter', v)}
          min={0.1}
          max={500}
          step={0.5}
          unit={unitLabel}
          error={errors.diameter}
          required
        />
      )}

      <NumberInput
        id="depth"
        label="Depth"
        value={inputs.depth}
        onChange={(v) => setInput('depth', v)}
        min={0.5}
        max={24}
        step={0.5}
        unit="inches"
        error={errors.depth}
        required
      />
    </CalculatorBase>
  );
}

export default MulchSoilCalculator;
