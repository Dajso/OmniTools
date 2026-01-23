'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculatePlantSpacing,
  PLANT_SPACING_GUIDE,
  type PlantSpacingResult,
  type PlantingPattern,
  type SpacingUnit,
} from '@/lib/calculations/garden';

const plantSpacingSchema = z.object({
  gardenLength: z.number().min(0.5).max(1000),
  gardenWidth: z.number().min(0.5).max(1000),
  plantSpacing: z.number().min(1).max(120),
  rowSpacing: z.number().min(1).max(120),
  unit: z.enum(['inches', 'feet', 'cm', 'meters']),
  pattern: z.enum(['square', 'triangular', 'row']),
  plantType: z.string(),
});

type PlantSpacingInputs = z.infer<typeof plantSpacingSchema>;

const INITIAL_INPUTS: PlantSpacingInputs = {
  gardenLength: 10,
  gardenWidth: 4,
  plantSpacing: 12,
  rowSpacing: 12,
  unit: 'feet',
  pattern: 'square',
  plantType: '',
};

const UNIT_OPTIONS = [
  { value: 'feet', label: 'Feet' },
  { value: 'inches', label: 'Inches' },
  { value: 'meters', label: 'Meters' },
  { value: 'cm', label: 'Centimeters' },
];

const PATTERN_OPTIONS = [
  { value: 'square', label: 'Square Grid' },
  { value: 'triangular', label: 'Triangular/Offset (15% more plants)' },
  { value: 'row', label: 'Traditional Rows' },
];

const PLANT_TYPE_OPTIONS = [
  { value: '', label: 'Custom spacing...' },
  ...Object.entries(PLANT_SPACING_GUIDE).map(([key, value]) => ({
    value: key,
    label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${value.spacing}" × ${value.rowSpacing}")`,
  })),
];

function calculateSpacing(inputs: PlantSpacingInputs): PlantSpacingResult {
  return calculatePlantSpacing({
    gardenLength: inputs.gardenLength,
    gardenWidth: inputs.gardenWidth,
    plantSpacing: inputs.plantSpacing,
    rowSpacing: inputs.rowSpacing,
    unit: inputs.unit as SpacingUnit,
    pattern: inputs.pattern as PlantingPattern,
  });
}

export function PlantSpacingCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<PlantSpacingInputs, PlantSpacingResult>({
    initialInputs: INITIAL_INPUTS,
    schema: plantSpacingSchema,
    calculate: calculateSpacing,
    storageKey: 'plant-spacing-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Update spacing when plant type changes
  React.useEffect(() => {
    if (inputs.plantType && PLANT_SPACING_GUIDE[inputs.plantType]) {
      const guide = PLANT_SPACING_GUIDE[inputs.plantType];
      setInput('plantSpacing', guide.spacing);
      setInput('rowSpacing', guide.rowSpacing);
      setInput('unit', 'inches');
    }
  }, [inputs.plantType]);

  const unitLabel = inputs.unit === 'feet' ? 'ft' :
    inputs.unit === 'inches' ? 'in' :
      inputs.unit === 'meters' ? 'm' : 'cm';

  return (
    <CalculatorBase
      title="Plant Spacing Calculator"
      description="Calculate how many plants fit in your garden bed with optimal spacing"
      formula="Total Plants = Rows × Plants per Row"
      formulaExplanation="Based on garden dimensions, plant spacing, and planting pattern"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Total Plants"
              value={results.totalPlants}
              unit="plants"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Rows"
                value={results.rows}
              />
              <ResultDisplay
                label="Plants per Row"
                value={results.plantsPerRow}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Area Details</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Garden Area"
                  value={results.gardenArea}
                  unit={`sq ${unitLabel}`}
                />
                <ResultDisplay
                  label="Area per Plant"
                  value={results.areaPerPlant}
                  unit={`sq ${unitLabel}`}
                />
              </div>
            </div>

            <ResultDisplay
              label="Planting Density"
              value={results.plantingDensity}
              unit="plants/sq ft"
            />

            {/* Visual Grid Preview */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Layout Preview</p>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg overflow-auto">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(results.plantsPerRow, 15)}, 1fr)`,
                    maxWidth: '300px',
                  }}
                >
                  {Array.from({ length: Math.min(results.totalPlants, 75) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-400"
                      title={`Plant ${i + 1}`}
                    />
                  ))}
                  {results.totalPlants > 75 && (
                    <div className="col-span-full text-xs text-muted-foreground mt-2">
                      +{results.totalPlants - 75} more plants...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="plantType"
        label="Plant Type (Optional)"
        value={inputs.plantType}
        onChange={(v) => setInput('plantType', v)}
        options={PLANT_TYPE_OPTIONS}
      />

      <SelectInput
        id="unit"
        label="Measurement Unit"
        value={inputs.unit}
        onChange={(v) => setInput('unit', v as SpacingUnit)}
        options={UNIT_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="gardenLength"
          label="Garden Length"
          value={inputs.gardenLength}
          onChange={(v) => setInput('gardenLength', v)}
          min={0.5}
          max={1000}
          step={0.5}
          unit={unitLabel}
          error={errors.gardenLength}
          required
        />
        <NumberInput
          id="gardenWidth"
          label="Garden Width"
          value={inputs.gardenWidth}
          onChange={(v) => setInput('gardenWidth', v)}
          min={0.5}
          max={1000}
          step={0.5}
          unit={unitLabel}
          error={errors.gardenWidth}
          required
        />
      </div>

      <SelectInput
        id="pattern"
        label="Planting Pattern"
        value={inputs.pattern}
        onChange={(v) => setInput('pattern', v as PlantingPattern)}
        options={PATTERN_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="plantSpacing"
          label="Plant Spacing"
          value={inputs.plantSpacing}
          onChange={(v) => setInput('plantSpacing', v)}
          min={1}
          max={120}
          step={1}
          unit={unitLabel}
          error={errors.plantSpacing}
          required
        />
        {inputs.pattern === 'row' && (
          <NumberInput
            id="rowSpacing"
            label="Row Spacing"
            value={inputs.rowSpacing}
            onChange={(v) => setInput('rowSpacing', v)}
            min={1}
            max={120}
            step={1}
            unit={unitLabel}
            error={errors.rowSpacing}
          />
        )}
      </div>
    </CalculatorBase>
  );
}

export default PlantSpacingCalculator;
