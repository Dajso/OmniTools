'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateSolarPanels, type SolarPanelInputs, type SolarPanelResults } from '@/lib/calculations/home/solar-panel-calculator';
import { formatNumber, formatCurrency } from '@/lib/utils/formatting';

const solarPanelSchema = z.object({
  monthlyUsageKwh: z.number().min(100).max(10000),
  sunHoursPerDay: z.number().min(2).max(8),
  panelWattage: z.number().min(200).max(500),
  systemEfficiency: z.number().min(0.6).max(0.95),
  costPerKwh: z.number().min(0.05).max(0.5),
  costPerWatt: z.number().min(1).max(5),
});

const INITIAL_INPUTS = { monthlyUsageKwh: 900, sunHoursPerDay: 5, panelWattage: 400, systemEfficiency: 0.8, costPerKwh: 0.12, costPerWatt: 2.75 };

export function SolarPanelCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = useCalculator<typeof INITIAL_INPUTS, SolarPanelResults>({
    initialInputs: INITIAL_INPUTS,
    schema: solarPanelSchema,
    calculate: (formInputs) => calculateSolarPanels(formInputs as SolarPanelInputs),
    storageKey: 'solar-panel-calculator',
  });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Solar Panel Calculator"
      description="Calculate solar panel requirements and savings"
      formula="System Size = Daily Need ÷ (Sun Hours × Efficiency)"
      formulaExplanation="Estimates panels needed, cost, and payback period"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Panels Needed" value={results.numberOfPanels.toString()} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="System Size" value={`${results.systemSizeKw} kW`} copyable />
            <ResultDisplay label="Daily Need" value={`${results.dailyEnergyNeed} kWh`} copyable />
            <ResultDisplay label="Annual Production" value={`${formatNumber(results.annualProductionKwh)} kWh`} copyable />
            <ResultDisplay label="Annual Savings" value={formatCurrency(results.annualSavings)} copyable />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="System Cost" value={formatCurrency(results.systemCost)} copyable />
            <ResultDisplay label="Payback Period" value={`${results.paybackYears} years`} copyable />
          </div>
          <ResultDisplay label="25-Year Net Savings" value={formatCurrency(results.savings25Year)} copyable />
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="monthlyUsageKwh" label="Monthly Usage" value={inputs.monthlyUsageKwh} onChange={(v) => setInput('monthlyUsageKwh', v)} min={100} max={10000} step={50} unit="kWh" error={errors.monthlyUsageKwh} required />
        <NumberInput id="sunHoursPerDay" label="Peak Sun Hours/Day" value={inputs.sunHoursPerDay} onChange={(v) => setInput('sunHoursPerDay', v)} min={2} max={8} step={0.5} unit="hrs" error={errors.sunHoursPerDay} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="panelWattage" label="Panel Wattage" value={inputs.panelWattage} onChange={(v) => setInput('panelWattage', v)} min={200} max={500} step={25} unit="W" error={errors.panelWattage} />
        <NumberInput id="systemEfficiency" label="System Efficiency" value={inputs.systemEfficiency} onChange={(v) => setInput('systemEfficiency', v)} min={0.6} max={0.95} step={0.05} error={errors.systemEfficiency} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="costPerKwh" label="Utility Cost" value={inputs.costPerKwh} onChange={(v) => setInput('costPerKwh', v)} min={0.05} max={0.5} step={0.01} unit="$/kWh" error={errors.costPerKwh} />
        <NumberInput id="costPerWatt" label="Install Cost" value={inputs.costPerWatt} onChange={(v) => setInput('costPerWatt', v)} min={1} max={5} step={0.25} unit="$/W" error={errors.costPerWatt} />
      </div>
    </CalculatorBase>
  );
}

export default SolarPanelCalculator;
