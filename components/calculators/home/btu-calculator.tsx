'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateHeatPumpNeed,
  type HeatPumpResults,
  type InsulationLevel,
  type ClimateZone,
} from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const heatPumpSchema = z.object({
  roomLength: z.number().min(1, 'Lengden må være minst 1 m').max(50, 'Lengden er for stor'),
  roomWidth: z.number().min(1, 'Bredden må være minst 1 m').max(50, 'Bredden er for stor'),
  ceilingHeight: z.number().min(2, 'Høyden må være minst 2 m').max(6, 'Høyden er for stor'),
  insulation: z.enum(['passive', 'modern', 'average', 'poor']),
  climate: z.enum(['coast', 'inland', 'cold']),
  occupants: z.number().min(0, 'Kan ikke være negativt').max(50, 'For mange personer'),
  sunnyRoom: z.boolean(),
  isKitchen: z.boolean(),
});

type HeatPumpFormInputs = z.infer<typeof heatPumpSchema>;

const INITIAL_INPUTS: HeatPumpFormInputs = {
  roomLength: 6,
  roomWidth: 5,
  ceilingHeight: 2.4,
  insulation: 'modern',
  climate: 'coast',
  occupants: 2,
  sunnyRoom: false,
  isKitchen: false,
};

const INSULATION_OPTIONS = [
  { value: 'passive', label: 'Passivhus / TEK17-standard' },
  { value: 'modern', label: 'God isolasjon (bygget etter ca. 2000)' },
  { value: 'average', label: 'Middels isolasjon (1980–2000)' },
  { value: 'poor', label: 'Dårlig isolasjon (eldre enn 1980)' },
];

const CLIMATE_OPTIONS = [
  { value: 'coast', label: 'Kyst (Sørlandet, Vestlandet)' },
  { value: 'inland', label: 'Innland (Østlandet, Trøndelag)' },
  { value: 'cold', label: 'Kaldt innland / fjell / Nord-Norge' },
];

export function BTUCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<HeatPumpFormInputs, HeatPumpResults>({
      initialInputs: INITIAL_INPUTS,
      schema: heatPumpSchema,
      calculate: calculateHeatPumpNeed,
      storageKey: 'heat-pump-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Varmepumpekalkulator"
      description="Anslå hvor stor varmepumpe du trenger til et rom, for oppvarming og kjøling"
      formula="Effektbehov = areal × W/m² (etter isolasjon og klima) × høydefaktor"
      formulaExplanation="Dette er et grovt anslag. En installatør bør dimensjonere anlegget ut fra boligens faktiske varmetap."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Anbefalt varmepumpe" value={`${formatNumber(results.recommendedKw, { maximumFractionDigits: 1 })} kW`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Areal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Oppvarmingsbehov" value={`${formatNumber(results.heatingKw, { maximumFractionDigits: 1 })} kW`} copyable />
            <ResultDisplay label="Kjølebehov" value={`${formatNumber(results.coolingKw, { maximumFractionDigits: 1 })} kW`} copyable />
          </div>
          <p className="text-xs text-muted-foreground">
            Størrelsen er avrundet opp til nærmeste vanlige modell. Varmepumper i luft-til-luft-klassen oppgis ofte som nominell varmeeffekt ved 7 °C ute. Ved svært lave temperaturer faller effekten.
          </p>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="roomLength" label="Romlengde" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={1} step={0.5} unit="m" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Rombredde" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={1} step={0.5} unit="m" error={errors.roomWidth} required />
        <NumberInput id="ceilingHeight" label="Takhøyde" value={inputs.ceilingHeight} onChange={(v) => setInput('ceilingHeight', v)} min={2} max={6} step={0.1} unit="m" error={errors.ceilingHeight} required />
      </div>
      <SelectInput id="insulation" label="Isolasjonsstandard" value={inputs.insulation} onChange={(v) => setInput('insulation', v as InsulationLevel)} options={INSULATION_OPTIONS} error={errors.insulation} />
      <SelectInput id="climate" label="Klima" value={inputs.climate} onChange={(v) => setInput('climate', v as ClimateZone)} options={CLIMATE_OPTIONS} error={errors.climate} />
      <NumberInput id="occupants" label="Personer som vanligvis oppholder seg i rommet" value={inputs.occupants} onChange={(v) => setInput('occupants', v)} min={0} step={1} error={errors.occupants} />
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="sunnyRoom" checked={inputs.sunnyRoom} onChange={(e) => setInput('sunnyRoom', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="sunnyRoom" className="text-sm">Mye sol (store vinduer mot sør/vest)</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isKitchen" checked={inputs.isKitchen} onChange={(e) => setInput('isKitchen', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="isKitchen" className="text-sm">Kjøkken</label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BTUCalculator;
