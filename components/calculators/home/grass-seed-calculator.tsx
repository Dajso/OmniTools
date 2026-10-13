'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateGrassSeed,
  type GrassSeedResults,
  type SeedApplication,
  type LawnType,
} from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const grassSeedSchema = z.object({
  length: z.number().min(0.1, 'Lengden må være over 0').max(10000, 'Lengden er for stor'),
  width: z.number().min(0.1, 'Bredden må være over 0').max(10000, 'Bredden er for stor'),
  application: z.enum(['new', 'overseed', 'thicken']),
  lawnType: z.enum(['general', 'sport', 'shade', 'ornamental']),
});

type GrassSeedFormInputs = z.infer<typeof grassSeedSchema>;

const INITIAL_INPUTS: GrassSeedFormInputs = { length: 10, width: 8, application: 'new', lawnType: 'general' };

const APPLICATION_OPTIONS = [
  { value: 'new', label: 'Ny plen' },
  { value: 'overseed', label: 'Ettersåing (vedlikehold)' },
  { value: 'thicken', label: 'Fortetting av tynn plen' },
];

const LAWN_OPTIONS = [
  { value: 'general', label: 'Husmorplen / allround' },
  { value: 'sport', label: 'Sportsplen (tåler slitasje)' },
  { value: 'shade', label: 'Skyggeplen' },
  { value: 'ornamental', label: 'Prydplen' },
];

export function GrassSeedCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<GrassSeedFormInputs, GrassSeedResults>({
      initialInputs: INITIAL_INPUTS,
      schema: grassSeedSchema,
      calculate: calculateGrassSeed,
      storageKey: 'grass-seed-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Gressfrø-kalkulator"
      description="Regn ut hvor mye gressfrø du trenger til plenen"
      formula="Frø (kg) = areal × såmengde (g/m²) ÷ 1000"
      formulaExplanation="Såmengden avhenger av plentype og om du sår ny plen eller etterhjelper en eksisterende."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Gressfrø å kjøpe" value={`${formatNumber(results.seedKg, { maximumFractionDigits: 2 })} kg`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Areal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Såmengde" value={`${formatNumber(results.rateGramsPerM2, { maximumFractionDigits: 1 })} g/m²`} copyable />
            <ResultDisplay label="Poser à 1 kg" value={results.bags1kg.toString()} copyable />
            <ResultDisplay label="Poser à 5 kg" value={results.bags5kg.toString()} copyable />
            <ResultDisplay label="Poser à 10 kg" value={results.bags10kg.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label="Lengde" value={inputs.length} onChange={(v) => setInput('length', v)} min={0.1} step={0.5} unit="m" error={errors.length} required />
        <NumberInput id="width" label="Bredde" value={inputs.width} onChange={(v) => setInput('width', v)} min={0.1} step={0.5} unit="m" error={errors.width} required />
        <SelectInput id="application" label="Formål" value={inputs.application} onChange={(v) => setInput('application', v as SeedApplication)} options={APPLICATION_OPTIONS} error={errors.application} />
        <SelectInput id="lawnType" label="Plentype" value={inputs.lawnType} onChange={(v) => setInput('lawnType', v as LawnType)} options={LAWN_OPTIONS} error={errors.lawnType} />
      </div>
      <p className="text-xs text-muted-foreground">
        Følg alltid anbefalingen på frøposen. Sår du tidlig i mai eller i august–september, har frøet best forhold i norsk klima.
      </p>
    </CalculatorBase>
  );
}

export default GrassSeedCalculator;
