'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateElectricityCost, type ElectricityCostInputs, type ElectricityCostResults } from '@/lib/calculations/home/electricity-cost-calculator';
import { formatNumber, formatCurrency } from '@/lib/utils/formatting';

const electricitySchema = z.object({
  watts: z.number().min(1).max(100000),
  hoursPerDay: z.number().min(0).max(24),
  daysPerMonth: z.number().min(1).max(31),
  costPerKwh: z.number().min(0).max(1),
});

const INITIAL_INPUTS = { watts: 1000, hoursPerDay: 8, daysPerMonth: 30, costPerKwh: 0.12 };

export function ElectricityCostCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, ElectricityCostResults>({
    initialInputs: INITIAL_INPUTS,
    schema: electricitySchema,
    calculate: (formInputs) => calculateElectricityCost(formInputs as ElectricityCostInputs),
    storageKey: 'electricity-cost-calculator',
  });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Electricity Cost Calculator"
      description="Calculate how much an appliance costs to run"
      formula="Cost = (Watts × Hours × Days × Cost/kWh) ÷ 1000"
      formulaExplanation="Converts watts to kilowatts and calculates energy cost"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Monthly Cost" value={formatCurrency(results.monthlyCost)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Daily kWh" value={formatNumber(results.dailyKwh, { locale: 'en-US', maximumFractionDigits: 2 })} copyable />
            <ResultDisplay label="Monthly kWh" value={formatNumber(results.monthlyKwh, { locale: 'en-US', maximumFractionDigits: 1 })} copyable />
            <ResultDisplay label="Daily Cost" value={formatCurrency(results.dailyCost)} copyable />
            <ResultDisplay label="Yearly Cost" value={formatCurrency(results.yearlyCost)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="watts" label="Appliance Watts" value={inputs.watts} onChange={(v) => setInput('watts', v)} min={1} step={100} unit="W" error={errors.watts} required />
        <NumberInput id="hoursPerDay" label="Hours per Day" value={inputs.hoursPerDay} onChange={(v) => setInput('hoursPerDay', v)} min={0} max={24} step={0.5} unit="hrs" error={errors.hoursPerDay} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="daysPerMonth" label="Days per Month" value={inputs.daysPerMonth} onChange={(v) => setInput('daysPerMonth', v)} min={1} max={31} step={1} error={errors.daysPerMonth} />
        <NumberInput id="costPerKwh" label="Cost per kWh" value={inputs.costPerKwh} onChange={(v) => setInput('costPerKwh', v)} min={0} max={1} step={0.01} unit="$" error={errors.costPerKwh} />
      </div>
    </CalculatorBase>
  );
}

export default ElectricityCostCalculator;
