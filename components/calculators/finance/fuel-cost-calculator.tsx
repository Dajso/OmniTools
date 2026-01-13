'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  distance: z.number().min(1, 'Distance must be positive'),
  fuelEfficiency: z.number().min(1, 'Efficiency must be positive'),
  fuelPrice: z.number().min(0.01, 'Price must be positive'),
  useMetric: z.boolean(),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  fuelNeeded: number;
  totalCost: number;
  costPerMile: number;
}

const INITIAL_INPUTS: FormInputs = {
  distance: 300,
  fuelEfficiency: 30,
  fuelPrice: 3.50,
  useMetric: false,
};

function calculateFuelCost(inputs: FormInputs): Results {
  let fuelNeeded: number;
  let costPerMile: number;
  
  if (inputs.useMetric) {
    fuelNeeded = (inputs.distance / 100) * inputs.fuelEfficiency;
    costPerMile = (inputs.fuelEfficiency / 100) * inputs.fuelPrice;
  } else {
    fuelNeeded = inputs.distance / inputs.fuelEfficiency;
    costPerMile = inputs.fuelPrice / inputs.fuelEfficiency;
  }
  
  const totalCost = fuelNeeded * inputs.fuelPrice;
  
  return {
    fuelNeeded,
    totalCost,
    costPerMile,
  };
}

export function FuelCostCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateFuelCost,
      storageKey: 'fuel-cost-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Fuel Cost Trip Calculator"
      description="Calculate fuel costs for your trip in MPG or L/100km"
      formula={inputs.useMetric ? "Fuel = (Distance ÷ 100) × L/100km" : "Fuel = Distance ÷ MPG"}
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total Fuel Cost" value={formatCurrency(results.totalCost)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay 
              label={inputs.useMetric ? "Fuel Needed (L)" : "Fuel Needed (gal)"} 
              value={results.fuelNeeded.toFixed(2)} 
              copyable 
            />
            <ResultDisplay 
              label={inputs.useMetric ? "Cost per km" : "Cost per mile"} 
              value={formatCurrency(results.costPerMile)} 
              copyable 
            />
          </div>
        </div>
      )}
    >
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setInput('useMetric', false)}
          className={`px-4 py-2 text-sm rounded-md border transition-colors ${
            !inputs.useMetric ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Imperial (MPG)
        </button>
        <button
          type="button"
          onClick={() => setInput('useMetric', true)}
          className={`px-4 py-2 text-sm rounded-md border transition-colors ${
            inputs.useMetric ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          Metric (L/100km)
        </button>
      </div>
      <NumberInput 
        id="distance" 
        label={inputs.useMetric ? "Distance (km)" : "Distance (miles)"} 
        value={inputs.distance} 
        onChange={(v) => setInput('distance', v)} 
        min={1} 
        step={10} 
        error={errors.distance} 
        required 
      />
      <NumberInput 
        id="fuelEfficiency" 
        label={inputs.useMetric ? "Fuel Consumption (L/100km)" : "Fuel Efficiency (MPG)"} 
        value={inputs.fuelEfficiency}
        onChange={(v) => setInput('fuelEfficiency', v)} 
        min={1} 
        step={1} 
        error={errors.fuelEfficiency} 
        required 
      />
      <NumberInput 
        id="fuelPrice" 
        label={inputs.useMetric ? "Fuel Price (per liter)" : "Fuel Price (per gallon)"} 
        value={inputs.fuelPrice}
        onChange={(v) => setInput('fuelPrice', v)} 
        min={0.01} 
        step={0.1} 
        unit="$" 
        error={errors.fuelPrice} 
        required 
      />
    </CalculatorBase>
  );
}

export default FuelCostCalculator;
