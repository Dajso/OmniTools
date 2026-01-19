'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateFertilizer,
  COMMON_FERTILIZERS,
  NITROGEN_RATES,
  type FertilizerResult,
  type AreaUnit,
  type WeightUnit,
} from '@/lib/calculations/garden';

const fertilizerSchema = z.object({
  fertilizerType: z.string(),
  nitrogen: z.number().min(0).max(100),
  phosphorus: z.number().min(0).max(100),
  potassium: z.number().min(0).max(100),
  targetNitrogenRate: z.number().min(0.01).max(5),
  area: z.number().min(1).max(1000000),
  areaUnit: z.enum(['sqft', 'sqm', 'acre']),
  weightUnit: z.enum(['lbs', 'kg', 'oz']),
});

type FertilizerInputs = z.infer<typeof fertilizerSchema>;

const INITIAL_INPUTS: FertilizerInputs = {
  fertilizerType: 'balanced',
  nitrogen: 10,
  phosphorus: 10,
  potassium: 10,
  targetNitrogenRate: 1.0,
  area: 1000,
  areaUnit: 'sqft',
  weightUnit: 'lbs',
};

const FERTILIZER_TYPE_OPTIONS = [
  { value: 'custom', label: 'Custom N-P-K...' },
  ...Object.entries(COMMON_FERTILIZERS).map(([key, value]) => ({
    value: key,
    label: `${key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (${value.nitrogen}-${value.phosphorus}-${value.potassium})`,
  })),
];

const AREA_UNIT_OPTIONS = [
  { value: 'sqft', label: 'Square Feet' },
  { value: 'sqm', label: 'Square Meters' },
  { value: 'acre', label: 'Acres' },
];

const WEIGHT_UNIT_OPTIONS = [
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
];

const PLANT_TYPE_OPTIONS = [
  { value: 'lawn-cool-season', label: 'Lawn (Cool Season) - 1.0 lb N' },
  { value: 'lawn-warm-season', label: 'Lawn (Warm Season) - 0.5 lb N' },
  { value: 'vegetables', label: 'Vegetables - 0.1 lb N' },
  { value: 'flowers', label: 'Flowers - 0.1 lb N' },
  { value: 'trees-shrubs', label: 'Trees & Shrubs - 0.1 lb N' },
];

function calculateFert(inputs: FertilizerInputs): FertilizerResult {
  return calculateFertilizer({
    npkRatio: {
      nitrogen: inputs.nitrogen,
      phosphorus: inputs.phosphorus,
      potassium: inputs.potassium,
    },
    targetNitrogenRate: inputs.targetNitrogenRate,
    area: inputs.area,
    areaUnit: inputs.areaUnit as AreaUnit,
    weightUnit: inputs.weightUnit as WeightUnit,
  });
}

export function FertilizerCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<FertilizerInputs, FertilizerResult>({
    initialInputs: INITIAL_INPUTS,
    schema: fertilizerSchema,
    calculate: calculateFert,
    storageKey: 'fertilizer-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  // Update NPK when fertilizer type changes
  React.useEffect(() => {
    if (inputs.fertilizerType !== 'custom' && COMMON_FERTILIZERS[inputs.fertilizerType]) {
      const fert = COMMON_FERTILIZERS[inputs.fertilizerType];
      setInput('nitrogen', fert.nitrogen);
      setInput('phosphorus', fert.phosphorus);
      setInput('potassium', fert.potassium);
    }
  }, [inputs.fertilizerType]);

  const handlePlantTypeChange = (plantType: string) => {
    if (NITROGEN_RATES[plantType]) {
      setInput('targetNitrogenRate', NITROGEN_RATES[plantType]);
    }
  };

  const weightLabel = inputs.weightUnit;
  const areaLabel = inputs.areaUnit === 'sqft' ? 'sq ft' : 
                    inputs.areaUnit === 'sqm' ? 'sq m' : 'acres';

  return (
    <CalculatorBase
      title="Fertilizer N-P-K Calculator"
      description="Calculate how much fertilizer to apply based on N-P-K ratio and target nitrogen rate"
      formula="Fertilizer Amount = (Target N Rate ÷ N%) × Area"
      formulaExplanation="Based on desired nitrogen application rate and fertilizer nitrogen content"
      isCalculateDisabled={!isValid || inputs.nitrogen === 0}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Total Fertilizer Needed"
              value={results.totalFertilizer}
              unit={weightLabel}
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Rate per 1,000 sq ft"
                value={results.ratePer1000SqFt}
                unit={weightLabel}
              />
              <ResultDisplay
                label="Rate per 100 sq m"
                value={results.ratePer100SqM}
                unit={weightLabel}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Nutrients Applied</p>
              <div className="grid grid-cols-3 gap-3">
                <ResultDisplay
                  label="Nitrogen (N)"
                  value={results.nitrogenApplied}
                  unit={weightLabel}
                />
                <ResultDisplay
                  label="Phosphorus (P)"
                  value={results.phosphorusApplied}
                  unit={weightLabel}
                />
                <ResultDisplay
                  label="Potassium (K)"
                  value={results.potassiumApplied}
                  unit={weightLabel}
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Application Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Apply when soil is moist but grass/leaves are dry</li>
                <li>• Water in after application unless rain is expected</li>
                <li>• Don&apos;t exceed 1 lb N per 1,000 sq ft per application</li>
                <li>• Split larger amounts into multiple applications</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="fertilizerType"
        label="Fertilizer Type"
        value={inputs.fertilizerType}
        onChange={(v) => setInput('fertilizerType', v)}
        options={FERTILIZER_TYPE_OPTIONS}
      />

      {inputs.fertilizerType === 'custom' && (
        <div className="grid grid-cols-3 gap-4">
          <NumberInput
            id="nitrogen"
            label="Nitrogen (N) %"
            value={inputs.nitrogen}
            onChange={(v) => setInput('nitrogen', v)}
            min={0}
            max={100}
            step={1}
            error={errors.nitrogen}
            required
          />
          <NumberInput
            id="phosphorus"
            label="Phosphorus (P) %"
            value={inputs.phosphorus}
            onChange={(v) => setInput('phosphorus', v)}
            min={0}
            max={100}
            step={1}
            error={errors.phosphorus}
            required
          />
          <NumberInput
            id="potassium"
            label="Potassium (K) %"
            value={inputs.potassium}
            onChange={(v) => setInput('potassium', v)}
            min={0}
            max={100}
            step={1}
            error={errors.potassium}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Quick Set by Plant Type</label>
        <div className="flex flex-wrap gap-2">
          {PLANT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePlantTypeChange(opt.value)}
              className="px-3 py-1 text-xs rounded-full border hover:bg-muted transition-colors"
            >
              {opt.label.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      <NumberInput
        id="targetNitrogenRate"
        label="Target Nitrogen Rate (lbs N per 1,000 sq ft)"
        value={inputs.targetNitrogenRate}
        onChange={(v) => setInput('targetNitrogenRate', v)}
        min={0.01}
        max={5}
        step={0.1}
        error={errors.targetNitrogenRate}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="area"
          label="Area"
          value={inputs.area}
          onChange={(v) => setInput('area', v)}
          min={1}
          max={1000000}
          step={100}
          unit={areaLabel}
          error={errors.area}
          required
        />
        <SelectInput
          id="areaUnit"
          label="Area Unit"
          value={inputs.areaUnit}
          onChange={(v) => setInput('areaUnit', v as AreaUnit)}
          options={AREA_UNIT_OPTIONS}
        />
      </div>

      <SelectInput
        id="weightUnit"
        label="Weight Unit"
        value={inputs.weightUnit}
        onChange={(v) => setInput('weightUnit', v as WeightUnit)}
        options={WEIGHT_UNIT_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default FertilizerCalculator;
