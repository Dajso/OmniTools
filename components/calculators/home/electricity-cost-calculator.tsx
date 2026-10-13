'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateElectricityCost, type ElectricityCostResults } from '@/lib/calculations/home/home-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const electricitySchema = z.object({
  watts: z.number().min(0, 'Effekten kan ikke være negativ').max(100000, 'Effekten er for høy'),
  hoursPerDay: z.number().min(0, 'Kan ikke være negativt').max(24, 'Maks 24 timer i døgnet'),
  daysPerMonth: z.number().min(0, 'Kan ikke være negativt').max(31, 'Maks 31 dager i måneden'),
  powerPriceOre: z.number().min(0, 'Prisen kan ikke være negativ').max(1000, 'Prisen er for høy'),
  gridPriceOre: z.number().min(0, 'Prisen kan ikke være negativ').max(500, 'Prisen er for høy'),
});

type ElectricityFormInputs = z.infer<typeof electricitySchema>;

const INITIAL_INPUTS: ElectricityFormInputs = {
  watts: 2000,
  hoursPerDay: 4,
  daysPerMonth: 30,
  powerPriceOre: 90,
  gridPriceOre: 30,
};

/** Veiledende effekt for vanlige apparater (W) */
const APPLIANCES: Array<{ label: string; watts: number }> = [
  { label: 'Panelovn', watts: 1000 },
  { label: 'Varmtvannsbereder', watts: 2000 },
  { label: 'Elbillader (1-fase)', watts: 7400 },
  { label: 'Vaskemaskin', watts: 2000 },
  { label: 'Tørketrommel', watts: 2500 },
  { label: 'Oppvaskmaskin', watts: 1800 },
  { label: 'Komfyr (alle plater)', watts: 6000 },
  { label: 'Varmepumpe (middels)', watts: 1500 },
  { label: 'Kjøleskap', watts: 100 },
  { label: 'TV', watts: 100 },
  { label: 'LED-pære', watts: 8 },
  { label: 'Stasjonær PC', watts: 250 },
];

export function ElectricityCostCalculator() {
  const { inputs, setInput, setInputs, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<ElectricityFormInputs, ElectricityCostResults>({
      initialInputs: INITIAL_INPUTS,
      schema: electricitySchema,
      calculate: calculateElectricityCost,
      storageKey: 'electricity-cost-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Strømkostnad"
      description="Regn ut hva et apparat koster å bruke, i kWh og kroner"
      formula="kWh = (watt × timer) ÷ 1000, kostnad = kWh × (strømpris + nettleie)"
      formulaExplanation="Strømpris og nettleie legges sammen til en total pris per kWh. Oppgi prisene i øre inkludert mva."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Kostnad per måned" value={formatCurrency(results.monthlyCost, { decimals: 0 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Kostnad per dag" value={formatCurrency(results.dailyCost)} copyable />
            <ResultDisplay label="Kostnad per år" value={formatCurrency(results.yearlyCost, { decimals: 0 })} copyable />
            <ResultDisplay label="Forbruk per dag" value={`${formatNumber(results.dailyKwh, { maximumFractionDigits: 2 })} kWh`} copyable />
            <ResultDisplay label="Forbruk per måned" value={`${formatNumber(results.monthlyKwh, { maximumFractionDigits: 1 })} kWh`} copyable />
            <ResultDisplay label="Forbruk per år" value={`${formatNumber(results.yearlyKwh)} kWh`} copyable />
            <ResultDisplay label="Total pris per kWh" value={`${formatNumber(results.totalPriceOre, { maximumFractionDigits: 1 })} øre`} copyable />
          </div>
        </div>
      )}
    >
      <div className="space-y-2">
        <NumberInput id="watts" label="Effekt" value={inputs.watts} onChange={(v) => setInput('watts', v)} min={0} step={10} unit="W" error={errors.watts} required />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Vanlige apparater">
          {APPLIANCES.map((a) => (
            <button key={a.label} type="button" onClick={() => setInput('watts', a.watts)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.watts === a.watts ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="hoursPerDay" label="Timer i bruk per dag" value={inputs.hoursPerDay} onChange={(v) => setInput('hoursPerDay', v)} min={0} max={24} step={0.5} unit="timer" error={errors.hoursPerDay} />
        <NumberInput id="daysPerMonth" label="Dager i bruk per måned" value={inputs.daysPerMonth} onChange={(v) => setInput('daysPerMonth', v)} min={0} max={31} step={1} unit="dager" error={errors.daysPerMonth} />
        <NumberInput id="powerPriceOre" label="Strømpris" value={inputs.powerPriceOre} onChange={(v) => setInput('powerPriceOre', v)} min={0} step={1} unit="øre/kWh" error={errors.powerPriceOre} />
        <NumberInput id="gridPriceOre" label="Nettleie (energiledd)" value={inputs.gridPriceOre} onChange={(v) => setInput('gridPriceOre', v)} min={0} step={1} unit="øre/kWh" error={errors.gridPriceOre} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={() => setInputs({ powerPriceOre: 50 })} className="px-3 py-1 rounded-md border hover:bg-muted transition-colors">
          Bruk Norgespris (50 øre)
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Norgespris er 50 øre per kWh inkludert mva. (40 øre uten mva.) for boliger som har valgt ordningen, opptil 5 000 kWh i måneden. Nettleien kommer i tillegg, og fastleddet er ikke med her. Sjekk satsene på strømregningen din.
      </p>
    </CalculatorBase>
  );
}

export default ElectricityCostCalculator;
