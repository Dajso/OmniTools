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
  type PlantSpacingResult,
  type PlantingPattern,
} from '@/lib/calculations/garden';
import { formatNumber } from '@/lib/utils/formatting';

const plantSpacingSchema = z.object({
  gardenLength: z.number().min(0.1).max(1000),
  gardenWidth: z.number().min(0.1).max(1000),
  plantSpacing: z.number().min(1).max(300),
  rowSpacing: z.number().min(1).max(300),
  pattern: z.enum(['square', 'triangular', 'row']),
  plantType: z.string(),
});

type PlantSpacingInputs = z.infer<typeof plantSpacingSchema>;

interface SpacingMetricResult extends PlantSpacingResult {
  areaSqM: number;
  areaPerPlantSqM: number;
  plantsPerSqM: number;
}

const INITIAL_INPUTS: PlantSpacingInputs = {
  gardenLength: 3,
  gardenWidth: 1.2,
  plantSpacing: 30,
  rowSpacing: 30,
  pattern: 'square',
  plantType: '',
};

const PATTERN_OPTIONS = [
  { value: 'square', label: 'Rutenett' },
  { value: 'triangular', label: 'Forskjøvet (trekantmønster, ca. 15 % flere planter)' },
  { value: 'row', label: 'Vanlige rader' },
];

/** Veiledende avstander i cm: mellom plantene i raden og mellom radene. */
const PLANT_SPACING_CM: Record<string, { label: string; spacing: number; rowSpacing: number }> = {
  tomatoes: { label: 'Tomat', spacing: 60, rowSpacing: 90 },
  peppers: { label: 'Paprika og chili', spacing: 45, rowSpacing: 60 },
  lettuce: { label: 'Salat', spacing: 15, rowSpacing: 30 },
  carrots: { label: 'Gulrot', spacing: 5, rowSpacing: 30 },
  beans: { label: 'Bønner', spacing: 10, rowSpacing: 60 },
  corn: { label: 'Mais', spacing: 30, rowSpacing: 75 },
  cucumbers: { label: 'Agurk', spacing: 30, rowSpacing: 120 },
  squash: { label: 'Squash og gresskar', spacing: 60, rowSpacing: 150 },
  onions: { label: 'Løk', spacing: 10, rowSpacing: 30 },
  potatoes: { label: 'Potet', spacing: 30, rowSpacing: 75 },
  broccoli: { label: 'Brokkoli', spacing: 45, rowSpacing: 60 },
  cabbage: { label: 'Kål', spacing: 45, rowSpacing: 60 },
  spinach: { label: 'Spinat', spacing: 10, rowSpacing: 30 },
  radishes: { label: 'Reddik', spacing: 5, rowSpacing: 15 },
  herbs: { label: 'Urter', spacing: 30, rowSpacing: 30 },
};

const PLANT_TYPE_OPTIONS = [
  { value: '', label: 'Egen avstand ...' },
  ...Object.entries(PLANT_SPACING_CM).map(([key, value]) => ({
    value: key,
    label: `${value.label} (${value.spacing} × ${value.rowSpacing} cm)`,
  })),
];

function calculateSpacing(inputs: PlantSpacingInputs): SpacingMetricResult {
  // Hagen oppgis i meter og avstandene i cm. Beregningen gjøres i cm.
  const result = calculatePlantSpacing({
    gardenLength: inputs.gardenLength * 100,
    gardenWidth: inputs.gardenWidth * 100,
    plantSpacing: inputs.plantSpacing,
    rowSpacing: inputs.rowSpacing,
    unit: 'cm',
    pattern: inputs.pattern as PlantingPattern,
  });
  const areaSqM = inputs.gardenLength * inputs.gardenWidth;
  return {
    ...result,
    areaSqM: Math.round(areaSqM * 100) / 100,
    areaPerPlantSqM: result.totalPlants > 0 ? Math.round((areaSqM / result.totalPlants) * 1000) / 1000 : 0,
    plantsPerSqM: areaSqM > 0 ? Math.round((result.totalPlants / areaSqM) * 10) / 10 : 0,
  };
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
  } = useCalculator<PlantSpacingInputs, SpacingMetricResult>({
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
    if (inputs.plantType && PLANT_SPACING_CM[inputs.plantType]) {
      const guide = PLANT_SPACING_CM[inputs.plantType];
      setInput('plantSpacing', guide.spacing);
      setInput('rowSpacing', guide.rowSpacing);
    }
  }, [inputs.plantType, setInput]);

  return (
    <CalculatorBase
      title="Plantavstand"
      description="Regn ut hvor mange planter som får plass i bedet med riktig avstand"
      formula="Antall planter = rader × planter per rad"
      formulaExplanation="Regnet ut fra størrelsen på bedet, avstand mellom plantene og plantemønster"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Antall planter"
              value={results.totalPlants}
              unit="planter"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Rader"
                value={results.rows}
              />
              <ResultDisplay
                label="Planter per rad"
                value={results.plantsPerRow}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Areal</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Areal på bedet"
                  value={results.areaSqM}
                  unit="m²"
                />
                <ResultDisplay
                  label="Areal per plante"
                  value={results.areaPerPlantSqM}
                  unit="m²"
                />
              </div>
            </div>

            <ResultDisplay
              label="Plantetetthet"
              value={results.plantsPerSqM}
              unit="planter/m²"
            />

            {/* Visual Grid Preview */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Skisse av bedet</p>
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
                      title={`Plante ${i + 1}`}
                    />
                  ))}
                  {results.totalPlants > 75 && (
                    <div className="col-span-full text-xs text-muted-foreground mt-2">
                      +{formatNumber(results.totalPlants - 75, { maximumFractionDigits: 0 })} flere planter ...
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
        label="Planter (valgfritt)"
        value={inputs.plantType}
        onChange={(v) => setInput('plantType', v)}
        options={PLANT_TYPE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="gardenLength"
          label="Lengde på bedet"
          value={inputs.gardenLength}
          onChange={(v) => setInput('gardenLength', v)}
          min={0.1}
          max={1000}
          step={0.1}
          unit="m"
          error={errors.gardenLength}
          required
        />
        <NumberInput
          id="gardenWidth"
          label="Bredde på bedet"
          value={inputs.gardenWidth}
          onChange={(v) => setInput('gardenWidth', v)}
          min={0.1}
          max={1000}
          step={0.1}
          unit="m"
          error={errors.gardenWidth}
          required
        />
      </div>

      <SelectInput
        id="pattern"
        label="Plantemønster"
        value={inputs.pattern}
        onChange={(v) => setInput('pattern', v as PlantingPattern)}
        options={PATTERN_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="plantSpacing"
          label="Avstand mellom planter"
          value={inputs.plantSpacing}
          onChange={(v) => setInput('plantSpacing', v)}
          min={1}
          max={300}
          step={1}
          unit="cm"
          error={errors.plantSpacing}
          required
        />
        {inputs.pattern === 'row' && (
          <NumberInput
            id="rowSpacing"
            label="Avstand mellom rader"
            value={inputs.rowSpacing}
            onChange={(v) => setInput('rowSpacing', v)}
            min={1}
            max={300}
            step={1}
            unit="cm"
            error={errors.rowSpacing}
          />
        )}
      </div>
    </CalculatorBase>
  );
}

export default PlantSpacingCalculator;
