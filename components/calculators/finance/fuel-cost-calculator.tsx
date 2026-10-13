'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const schema = z.object({
  distance: z.number().min(1, 'Avstanden må være større enn null'),
  fuelConsumption: z.number().min(0.1, 'Forbruket må være større enn null'),
  fuelPrice: z.number().min(0.01, 'Prisen må være større enn null'),
  passengers: z.number().min(1, 'Minst én person').max(20, 'For mange personer'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  fuelNeeded: number;
  totalCost: number;
  costPerKm: number;
  costPerPerson: number;
}

const INITIAL_INPUTS: FormInputs = {
  distance: 300,
  fuelConsumption: 6.5,
  fuelPrice: 21.5,
  passengers: 1,
};

function calculateFuelCost(inputs: FormInputs): Results {
  const fuelNeeded = (inputs.distance / 100) * inputs.fuelConsumption;
  const totalCost = fuelNeeded * inputs.fuelPrice;
  return {
    fuelNeeded,
    totalCost,
    costPerKm: totalCost / inputs.distance,
    costPerPerson: totalCost / inputs.passengers,
  };
}

export function FuelCostCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateFuelCost,
      storageKey: 'fuel-cost-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Drivstoffkostnad for turen"
      description="Regn ut drivstoffkostnaden på en kjøretur i liter per 100 km"
      formula="Drivstoff (liter) = Avstand (km) ÷ 100 × Forbruk (l/100 km)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total drivstoffkostnad" value={formatCurrency(results.totalCost)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Drivstoff (liter)" value={formatNumber(results.fuelNeeded, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} copyable />
            <ResultDisplay label="Kostnad per km" value={formatCurrency(results.costPerKm)} copyable />
            {inputs.passengers > 1 && (
              <ResultDisplay label="Per person" value={formatCurrency(results.costPerPerson)} copyable />
            )}
          </div>
        </div>
      )}
    >
      <NumberInput
        id="distance"
        label="Avstand (km)"
        value={inputs.distance}
        onChange={(v) => setInput('distance', v)}
        min={1}
        step={10}
        unit="km"
        error={errors.distance}
        required
      />
      <NumberInput
        id="fuelConsumption"
        label="Forbruk (liter per 100 km)"
        value={inputs.fuelConsumption}
        onChange={(v) => setInput('fuelConsumption', v)}
        min={0.1}
        step={0.1}
        unit="l/100 km"
        error={errors.fuelConsumption}
        required
      />
      <NumberInput
        id="fuelPrice"
        label="Drivstoffpris (per liter)"
        value={inputs.fuelPrice}
        onChange={(v) => setInput('fuelPrice', v)}
        min={0.01}
        step={0.1}
        unit="kr/l"
        error={errors.fuelPrice}
        required
      />
      <NumberInput
        id="passengers"
        label="Antall i bilen (for å dele kostnaden)"
        value={inputs.passengers}
        onChange={(v) => setInput('passengers', v)}
        min={1}
        max={20}
        step={1}
        error={errors.passengers}
      />
      <p className="text-xs text-muted-foreground">
        1 liter per mil tilsvarer 10 l/100 km. Et forbruk på 0,65 l/mil er altså 6,5 l/100 km.
      </p>
    </CalculatorBase>
  );
}

export default FuelCostCalculator;
