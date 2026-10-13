'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateSolarPanels, type SolarPanelResults, type SolarRegion } from '@/lib/calculations/home/home-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const solarSchema = z.object({
  annualUsageKwh: z.number().min(500, 'Årsforbruket er for lavt').max(200000, 'Årsforbruket er for høyt'),
  region: z.enum(['south', 'west', 'mid', 'north']),
  panelWattage: z.number().min(200, 'Effekten er for lav').max(700, 'Effekten er for høy'),
  maxPanels: z.number().min(0, 'Kan ikke være negativt').max(500, 'For mange paneler'),
  costPerKwp: z.number().min(5000, 'Prisen er for lav').max(40000, 'Prisen er for høy'),
  electricityPrice: z.number().min(0.1, 'Prisen er for lav').max(10, 'Prisen er for høy'),
  sellPrice: z.number().min(0, 'Prisen kan ikke være negativ').max(10, 'Prisen er for høy'),
  selfUsePercent: z.number().min(10, 'Minst 10 %').max(100, 'Maks 100 %'),
});

type SolarFormInputs = z.infer<typeof solarSchema>;

const INITIAL_INPUTS: SolarFormInputs = {
  annualUsageKwh: 16000,
  region: 'south',
  panelWattage: 430,
  maxPanels: 0,
  costPerKwp: 15000,
  electricityPrice: 1.2,
  sellPrice: 0.5,
  selfUsePercent: 40,
};

const REGION_OPTIONS = [
  { value: 'south', label: 'Sørlandet / Sør-Østlandet (ca. 900 kWh per kWp)' },
  { value: 'west', label: 'Vestlandet (ca. 820 kWh per kWp)' },
  { value: 'mid', label: 'Trøndelag og Innlandet (ca. 780 kWh per kWp)' },
  { value: 'north', label: 'Nord-Norge (ca. 700 kWh per kWp)' },
];

export function SolarPanelCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<SolarFormInputs, SolarPanelResults>({
      initialInputs: INITIAL_INPUTS,
      schema: solarSchema,
      calculate: calculateSolarPanels,
      storageKey: 'solar-panel-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Solcellekalkulator"
      description="Anslå størrelse, produksjon og tilbakebetalingstid for solceller på taket"
      formula="Produksjon = installert effekt (kWp) × årsproduksjon per kWp"
      formulaExplanation="Egenbruk verdsettes til strømprisen du sparer, og overskudd til salgsprisen. Panelene regnes med 0,5 % årlig nedgang i ytelse."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Årlig besparelse" value={formatCurrency(results.annualSavings, { decimals: 0 })} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Anlegg" value={`${results.numberOfPanels} paneler (${formatNumber(results.systemSizeKwp, { maximumFractionDigits: 2 })} kWp)`} copyable />
            <ResultDisplay label="Årsproduksjon" value={`${formatNumber(results.annualProductionKwh)} kWh`} copyable />
            <ResultDisplay label="Egenbruk" value={`${formatNumber(results.selfUseKwh)} kWh`} copyable />
            <ResultDisplay label="Solgt til nettet" value={`${formatNumber(results.exportKwh)} kWh`} copyable />
            <ResultDisplay label="Anleggskostnad" value={formatCurrency(results.systemCost, { decimals: 0 })} copyable />
            <ResultDisplay label="Tilbakebetalingstid" value={results.paybackYears === null ? 'Ingen' : `${formatNumber(results.paybackYears, { maximumFractionDigits: 1 })} år`} copyable />
            <ResultDisplay label="Netto gevinst over 25 år" value={formatCurrency(results.netSavings25Years, { decimals: 0 })} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="annualUsageKwh" label="Årlig strømforbruk" value={inputs.annualUsageKwh} onChange={(v) => setInput('annualUsageKwh', v)} min={500} step={500} unit="kWh" error={errors.annualUsageKwh} required />
        <SelectInput id="region" label="Landsdel" value={inputs.region} onChange={(v) => setInput('region', v as SolarRegion)} options={REGION_OPTIONS} error={errors.region} />
        <NumberInput id="panelWattage" label="Effekt per panel" value={inputs.panelWattage} onChange={(v) => setInput('panelWattage', v)} min={200} max={700} step={10} unit="W" error={errors.panelWattage} />
        <NumberInput id="maxPanels" label="Maks antall paneler (0 = etter forbruk)" value={inputs.maxPanels} onChange={(v) => setInput('maxPanels', v)} min={0} step={1} error={errors.maxPanels} />
        <NumberInput id="costPerKwp" label="Pris per kWp installert" value={inputs.costPerKwp} onChange={(v) => setInput('costPerKwp', v)} min={5000} step={500} unit="kr" error={errors.costPerKwp} />
        <NumberInput id="selfUsePercent" label="Andel egenbruk" value={inputs.selfUsePercent} onChange={(v) => setInput('selfUsePercent', v)} min={10} max={100} step={5} unit="%" error={errors.selfUsePercent} />
        <NumberInput id="electricityPrice" label="Strømpris du sparer" value={inputs.electricityPrice} onChange={(v) => setInput('electricityPrice', v)} min={0.1} step={0.05} unit="kr/kWh" error={errors.electricityPrice} />
        <NumberInput id="sellPrice" label="Pris for overskuddsstrøm" value={inputs.sellPrice} onChange={(v) => setInput('sellPrice', v)} min={0} step={0.05} unit="kr/kWh" error={errors.sellPrice} />
      </div>
      <p className="text-xs text-muted-foreground">
        Dette er et grovt anslag. Faktisk produksjon avhenger av takvinkel, retning og skygge. Tilskudd fra Enova og betingelser for plusskunder endrer seg, så sjekk gjeldende ordninger hos Enova og nettselskapet.
      </p>
    </CalculatorBase>
  );
}

export default SolarPanelCalculator;
