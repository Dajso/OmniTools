'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatNumber } from '@/lib/utils/formatting';
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
  areaUnit: z.enum(['sqm', 'row_meters']),
  conditions: z.enum(['poor', 'average', 'good', 'excellent']),
  useCustomPlantCount: z.boolean(),
  plantCount: z.number().min(1).max(1000),
});

type VegetableYieldInputs = z.infer<typeof vegetableYieldSchema>;

const INITIAL_INPUTS: VegetableYieldInputs = {
  vegetable: 'tomatoes',
  area: 10,
  areaUnit: 'sqm',
  conditions: 'good',
  useCustomPlantCount: false,
  plantCount: 10,
};

const VEGETABLE_OPTIONS = Object.entries(VEGETABLE_YIELDS).map(([key, value]) => ({
  value: key,
  label: value.name,
}));

const AREA_UNIT_OPTIONS = [
  { value: 'sqm', label: 'Kvadratmeter (m²)' },
  { value: 'row_meters', label: 'Radmeter (løpemeter)' },
];

const CONDITION_OPTIONS = [
  { value: 'poor', label: 'Dårlig (50 % av normal avling)' },
  { value: 'average', label: 'Gjennomsnittlig (75 %)' },
  { value: 'good', label: 'God (100 %)' },
  { value: 'excellent', label: 'Svært god (125 %)' },
];

const KG_PER_LB = 0.453592;
const KG_PER_SQM_PER_LB_PER_SQFT = 4.882;

interface VegetableYieldMetricResult extends VegetableYieldResult {
  totalKg: number;
  kgPerPlant: number;
  kgPerSqm: number;
  kgPerHarvest: number;
}

function calculateYield(inputs: VegetableYieldInputs): VegetableYieldMetricResult {
  const r = calculateVegetableYield({
    vegetable: inputs.vegetable,
    area: inputs.area,
    areaUnit: inputs.areaUnit as YieldAreaUnit,
    conditions: inputs.conditions as GrowingCondition,
    plantCount: inputs.useCustomPlantCount ? inputs.plantCount : undefined,
  });
  return {
    ...r,
    totalKg: r.totalYield * KG_PER_LB,
    kgPerPlant: r.yieldPerPlant * KG_PER_LB,
    kgPerSqm: r.yieldPerSqFt * KG_PER_SQM_PER_LB_PER_SQFT,
    kgPerHarvest: r.yieldPerHarvest * KG_PER_LB,
  };
}

const kg = (v: number) => formatNumber(v, { maximumFractionDigits: 2 });

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
  } = useCalculator<VegetableYieldInputs, VegetableYieldMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: vegetableYieldSchema,
    calculate: calculateYield,
    storageKey: 'vegetable-yield-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const areaLabel = inputs.areaUnit === 'sqm' ? 'm²' : 'radmeter';

  return (
    <CalculatorBase
      title="Avlingskalkulator for grønnsaker"
      description="Anslå hvor mye du kan høste av grønnsakene i hagen"
      formula="Total avling = antall planter × avling per plante × dyrkingsfaktor"
      formulaExplanation="Bygger på gjennomsnittlige avlinger, justert for dyrkingsforhold. Tallene er veiledende og kan variere mye med sort, sted og sesong"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label={`Forventet avling av ${results.vegetable.toLowerCase()}`}
              value={kg(results.totalKg)}
              unit="kg"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Antall planter"
                value={results.plantCount}
                unit="planter"
              />
              <ResultDisplay
                label="Avling per plante"
                value={kg(results.kgPerPlant)}
                unit="kg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Avling per m²"
                value={kg(results.kgPerSqm)}
                unit="kg/m²"
              />
              <ResultDisplay
                label="Dager til høsting"
                value={results.daysToHarvest}
                unit="dager"
              />
            </div>

            {results.harvestsPerSeason > 1 && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Flere høstinger</p>
                <p className="text-sm text-muted-foreground">
                  {results.harvestsPerSeason} høstinger per sesong, ca. {kg(results.kgPerHarvest)}&nbsp;kg hver
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Dyrketips</p>
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
        label="Grønnsak"
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
          Jeg vet hvor mange planter jeg har
        </label>
      </div>

      {inputs.useCustomPlantCount ? (
        <NumberInput
          id="plantCount"
          label="Antall planter"
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
            label="Dyrket areal"
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
            label="Enhet for areal"
            value={inputs.areaUnit}
            onChange={(v) => setInput('areaUnit', v as 'sqm' | 'row_meters')}
            options={AREA_UNIT_OPTIONS}
          />
        </div>
      )}

      <SelectInput
        id="conditions"
        label="Dyrkingsforhold"
        value={inputs.conditions}
        onChange={(v) => setInput('conditions', v as GrowingCondition)}
        options={CONDITION_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default VegetableYieldCalculator;
