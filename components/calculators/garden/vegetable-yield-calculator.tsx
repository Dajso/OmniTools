'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateVegetableYield,
  VEGETABLE_YIELDS,
  type VegetableYieldResult,
  type GrowingCondition,
  type YieldAreaUnit,
} from '@/lib/calculations/garden';

const vegetableYieldSchema = z.object({
  vegetable: z.string(),
  area: z.number().min(1).max(10000),
  areaUnit: z.enum(['sqft', 'sqm', 'row_feet', 'row_meters']),
  conditions: z.enum(['poor', 'average', 'good', 'excellent']),
  useCustomPlantCount: z.boolean(),
  plantCount: z.number().min(1).max(1000),
});

type VegetableYieldInputs = z.infer<typeof vegetableYieldSchema>;

const INITIAL_INPUTS: VegetableYieldInputs = {
  vegetable: 'tomatoes',
  area: 100,
  areaUnit: 'sqft',
  conditions: 'good',
  useCustomPlantCount: false,
  plantCount: 10,
};

const VEGETABLE_OPTIONS = Object.entries(VEGETABLE_YIELDS).map(([key, value]) => ({
  value: key,
  label: value.name,
}));

const AREA_UNIT_OPTIONS = [
  { value: 'sqft', label: 'Square Feet' },
  { value: 'sqm', label: 'Square Meters' },
  { value: 'row_feet', label: 'Row Feet' },
  { value: 'row_meters', label: 'Row Meters' },
];

const CONDITION_OPTIONS = [
  { value: 'poor', label: 'Poor (50% yield)' },
  { value: 'average', label: 'Average (75% yield)' },
  { value: 'good', label: 'Good (100% yield)' },
  { value: 'excellent', label: 'Excellent (125% yield)' },
];

function calculateYield(inputs: VegetableYieldInputs): VegetableYieldResult {
  return calculateVegetableYield({
    vegetable: inputs.vegetable,
    area: inputs.area,
    areaUnit: inputs.areaUnit as YieldAreaUnit,
    conditions: inputs.conditions as GrowingCondition,
    plantCount: inputs.useCustomPlantCount ? inputs.plantCount : undefined,
  });
}

export function VegetableYieldCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<VegetableYieldInputs, VegetableYieldResult>({
    initialInputs: INITIAL_INPUTS,
    schema: vegetableYieldSchema,
    calculate: calculateYield,
    storageKey: 'vegetable-yield-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const areaLabel = inputs.areaUnit === 'sqft' ? 'sq ft' :
    inputs.areaUnit === 'sqm' ? 'sq m' :
      inputs.areaUnit === 'row_feet' ? 'row ft' : 'row m';

  return (
    <CalculatorBase
      title="Vegetable Yield Calculator"
      description="Estimate how much produce you can harvest from your garden"
      formula="Total Yield = Plants × Yield per Plant × Condition Multiplier"
      formulaExplanation="Based on average yields adjusted for growing conditions"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label={`Estimated ${results.vegetable} Yield`}
              value={results.totalYield}
              unit="lbs"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Number of Plants"
                value={results.plantCount}
                unit="plants"
              />
              <ResultDisplay
                label="Yield per Plant"
                value={results.yieldPerPlant}
                unit="lbs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Yield per Sq Ft"
                value={results.yieldPerSqFt}
                unit="lbs/sq ft"
              />
              <ResultDisplay
                label="Days to Harvest"
                value={results.daysToHarvest}
                unit="days"
              />
            </div>

            {results.harvestsPerSeason > 1 && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Multiple Harvests</p>
                <p className="text-sm text-muted-foreground">
                  {results.harvestsPerSeason} harvests per season, ~{results.yieldPerHarvest} lbs each
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Growing Tips</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                {results.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="vegetable"
        label="Vegetable"
        value={inputs.vegetable}
        onChange={(v) => setInput('vegetable', v)}
        options={VEGETABLE_OPTIONS}
      />

      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="useCustomPlantCount"
          checked={inputs.useCustomPlantCount}
          onChange={(e) => setInput('useCustomPlantCount', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="useCustomPlantCount" className="text-sm">
          I know how many plants I have
        </label>
      </div>

      {inputs.useCustomPlantCount ? (
        <NumberInput
          id="plantCount"
          label="Number of Plants"
          value={inputs.plantCount}
          onChange={(v) => setInput('plantCount', v)}
          min={1}
          max={1000}
          step={1}
          error={errors.plantCount}
          required
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="area"
            label="Garden Area"
            value={inputs.area}
            onChange={(v) => setInput('area', v)}
            min={1}
            max={10000}
            step={10}
            unit={areaLabel}
            error={errors.area}
            required
          />
          <SelectInput
            id="areaUnit"
            label="Area Unit"
            value={inputs.areaUnit}
            onChange={(v) => setInput('areaUnit', v as YieldAreaUnit)}
            options={AREA_UNIT_OPTIONS}
          />
        </div>
      )}

      <SelectInput
        id="conditions"
        label="Growing Conditions"
        value={inputs.conditions}
        onChange={(v) => setInput('conditions', v as GrowingCondition)}
        options={CONDITION_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default VegetableYieldCalculator;
