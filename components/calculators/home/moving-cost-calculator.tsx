'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateMovingCost, type MovingCostInputs, type MovingCostResults } from '@/lib/calculations/home/moving-cost-calculator';
import { formatNumber, formatCurrency } from '@/lib/utils/formatting';

const movingCostSchema = z.object({
  distance: z.number().min(0).max(5000),
  homeSize: z.enum(['studio', '1bed', '2bed', '3bed', '4bed', '5bed+']),
  moveType: z.enum(['local', 'longDistance', 'crossCountry']),
  includePacking: z.boolean(),
  specialtyItems: z.number().min(0).max(20),
  floorNumber: z.number().min(1).max(50),
  peakSeason: z.boolean(),
});

const INITIAL_INPUTS = { distance: 50, homeSize: '2bed', moveType: 'local', includePacking: false, specialtyItems: 0, floorNumber: 1, peakSeason: false };

type MovingCostInputsWithIndex = MovingCostInputs & Record<string, unknown>;

const HOME_SIZE_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '1bed', label: '1 Bedroom' },
  { value: '2bed', label: '2 Bedrooms' },
  { value: '3bed', label: '3 Bedrooms' },
  { value: '4bed', label: '4 Bedrooms' },
  { value: '5bed+', label: '5+ Bedrooms' },
];

const MOVE_TYPE_OPTIONS = [
  { value: 'local', label: 'Local (under 100 miles)' },
  { value: 'longDistance', label: 'Long Distance (100-500 miles)' },
  { value: 'crossCountry', label: 'Cross Country (500+ miles)' },
];

export function MovingCostCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<MovingCostInputsWithIndex, MovingCostResults>({
    initialInputs: INITIAL_INPUTS as MovingCostInputsWithIndex,
    schema: movingCostSchema as z.ZodType<MovingCostInputsWithIndex>,
    calculate: (formInputs) => calculateMovingCost(formInputs as MovingCostInputs),
    storageKey: 'moving-cost-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Moving Cost Estimator"
      description="Estimate the cost of your move"
      formula="Cost = Base + Packing + Specialty + Surcharges"
      formulaExplanation="Local moves charged hourly; long distance by weight and distance"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Estimated Cost" value={formatCurrency(results.totalCost)} highlight copyable />
          <p className="text-sm text-muted-foreground text-center">
            Range: {formatCurrency(results.lowEstimate)} - {formatCurrency(results.highEstimate)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Est. Weight" value={`${formatNumber(results.estimatedWeight)} lbs`} copyable />
            <ResultDisplay label="Base Cost" value={formatCurrency(results.baseCost)} copyable />
            {results.packingCost > 0 && <ResultDisplay label="Packing" value={formatCurrency(results.packingCost)} copyable />}
            {results.specialtyCost > 0 && <ResultDisplay label="Specialty Items" value={formatCurrency(results.specialtyCost)} copyable />}
            {results.floorSurcharge > 0 && <ResultDisplay label="Floor Surcharge" value={formatCurrency(results.floorSurcharge)} copyable />}
            {results.seasonSurcharge > 0 && <ResultDisplay label="Peak Season" value={formatCurrency(results.seasonSurcharge)} copyable />}
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="homeSize" label="Home Size" value={inputs.homeSize} onChange={(v) => setInput('homeSize', v as typeof inputs.homeSize)} options={HOME_SIZE_OPTIONS} error={errors.homeSize} />
        <SelectInput id="moveType" label="Move Type" value={inputs.moveType} onChange={(v) => setInput('moveType', v as typeof inputs.moveType)} options={MOVE_TYPE_OPTIONS} error={errors.moveType} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="distance" label="Distance" value={inputs.distance} onChange={(v) => setInput('distance', v)} min={0} max={5000} step={10} unit="miles" error={errors.distance} required />
        <NumberInput id="floorNumber" label="Floor Number" value={inputs.floorNumber} onChange={(v) => setInput('floorNumber', v)} min={1} max={50} step={1} error={errors.floorNumber} />
      </div>
      <NumberInput id="specialtyItems" label="Specialty Items (piano, pool table, etc.)" value={inputs.specialtyItems} onChange={(v) => setInput('specialtyItems', v)} min={0} max={20} step={1} error={errors.specialtyItems} />
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="includePacking" checked={inputs.includePacking} onChange={(e) => setInput('includePacking', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="includePacking" className="text-sm">Include packing service</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="peakSeason" checked={inputs.peakSeason} onChange={(e) => setInput('peakSeason', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="peakSeason" className="text-sm">Peak season (May-Sept)</label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default MovingCostCalculator;
