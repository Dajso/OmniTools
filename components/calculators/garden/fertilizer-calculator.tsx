'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const fertilizerSchema = z.object({
  fertilizerType: z.string(),
  nitrogen: z.number().min(0).max(100),
  phosphorus: z.number().min(0).max(100),
  potassium: z.number().min(0).max(100),
  targetNitrogenRate: z.number().min(0.1).max(30),
  area: z.number().min(1).max(1000000),
});

type FertilizerInputs = z.infer<typeof fertilizerSchema>;

interface FertilizerMetricResult {
  totalKg: number;
  totalGrams: number;
  gramsPerSqM: number;
  kgPer100SqM: number;
  nitrogenKg: number;
  phosphorusKg: number;
  potassiumKg: number;
}

const INITIAL_INPUTS: FertilizerInputs = {
  fertilizerType: 'fullgjodsel',
  nitrogen: 14,
  phosphorus: 4,
  potassium: 21,
  targetNitrogenRate: 5,
  area: 100,
};

/** Vanlige gjødseltyper med innhold av N-P-K i prosent. */
const FERTILIZERS: Record<string, { label: string; n: number; p: number; k: number }> = {
  fullgjodsel: { label: 'Fullgjødsel', n: 14, p: 4, k: 21 },
  universal: { label: 'Universalgjødsel', n: 12, p: 12, k: 12 },
  balansert: { label: 'Balansert', n: 10, p: 10, k: 10 },
  plengjodsel: { label: 'Plengjødsel', n: 24, p: 4, k: 8 },
  plen_start: { label: 'Plen, oppstart', n: 18, p: 24, k: 6 },
  blomster: { label: 'Blomstergjødsel', n: 10, p: 30, k: 20 },
  gronnsaker: { label: 'Grønnsaker', n: 5, p: 10, k: 10 },
  tomat: { label: 'Tomat', n: 3, p: 4, k: 6 },
  roser: { label: 'Roser', n: 4, p: 8, k: 4 },
  kalksalpeter: { label: 'Kalksalpeter', n: 15.5, p: 0, k: 0 },
  nitrogen: { label: 'Nitrogengjødsel', n: 21, p: 0, k: 0 },
  urea: { label: 'Urea', n: 46, p: 0, k: 0 },
  ammoniumsulfat: { label: 'Ammoniumsulfat', n: 21, p: 0, k: 0 },
  superfosfat: { label: 'Superfosfat', n: 0, p: 46, k: 0 },
  kaliumklorid: { label: 'Kaliumklorid', n: 0, p: 0, k: 60 },
};

const FERTILIZER_TYPE_OPTIONS = [
  { value: 'custom', label: 'Egen N-P-K ...' },
  ...Object.entries(FERTILIZERS).map(([key, v]) => ({
    value: key,
    label: `${v.label} (${v.n.toString().replace('.', ',')}-${v.p}-${v.k})`,
  })),
];

/** Veiledende mengde nitrogen i gram per m² og gang. */
const PLANT_TYPES = [
  { label: 'Plen', rate: 5 },
  { label: 'Grønnsaker', rate: 8 },
  { label: 'Blomster', rate: 5 },
  { label: 'Trær og busker', rate: 4 },
];

function calculateFert(inputs: FertilizerInputs): FertilizerMetricResult {
  if (inputs.nitrogen <= 0) {
    throw new Error('Gjødselen må inneholde nitrogen (N) for å kunne regne ut mengden');
  }
  const gramsPerSqM = inputs.targetNitrogenRate / (inputs.nitrogen / 100);
  const totalGrams = gramsPerSqM * inputs.area;
  const totalKg = totalGrams / 1000;
  return {
    totalKg: Math.round(totalKg * 100) / 100,
    totalGrams: Math.round(totalGrams),
    gramsPerSqM: Math.round(gramsPerSqM * 10) / 10,
    kgPer100SqM: Math.round(gramsPerSqM * 100) / 1000,
    nitrogenKg: Math.round(((totalKg * inputs.nitrogen) / 100) * 1000) / 1000,
    phosphorusKg: Math.round(((totalKg * inputs.phosphorus) / 100) * 1000) / 1000,
    potassiumKg: Math.round(((totalKg * inputs.potassium) / 100) * 1000) / 1000,
  };
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
  } = useCalculator<FertilizerInputs, FertilizerMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: fertilizerSchema,
    calculate: calculateFert,
    storageKey: 'fertilizer-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Oppdater N-P-K når gjødseltypen endres
  React.useEffect(() => {
    const fert = FERTILIZERS[inputs.fertilizerType];
    if (inputs.fertilizerType !== 'custom' && fert) {
      setInput('nitrogen', fert.n);
      setInput('phosphorus', fert.p);
      setInput('potassium', fert.k);
    }
  }, [inputs.fertilizerType, setInput]);

  const kg = (v: number) => formatNumber(v, { maximumFractionDigits: 3 });

  return (
    <CalculatorBase
      title="Gjødsel (N-P-K)"
      description="Regn ut hvor mye gjødsel du skal bruke ut fra N-P-K-innhold og ønsket mengde nitrogen"
      formula="Gjødsel per m² = ønsket nitrogen ÷ nitrogenprosent"
      formulaExplanation="Regnet ut fra hvor mye nitrogen du vil gi og hvor mye nitrogen gjødselen inneholder"
      isCalculateDisabled={!isValid || inputs.nitrogen === 0}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Gjødsel som trengs"
              value={kg(results.totalKg)}
              unit="kg"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Gram per m²"
                value={results.gramsPerSqM}
                unit="g/m²"
              />
              <ResultDisplay
                label="Per 100 m²"
                value={results.kgPer100SqM}
                unit="kg"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Næringsstoffer som tilføres</p>
              <div className="grid grid-cols-3 gap-3">
                <ResultDisplay label="Nitrogen (N)" value={kg(results.nitrogenKg)} unit="kg" />
                <ResultDisplay label="Fosfor (P)" value={kg(results.phosphorusKg)} unit="kg" />
                <ResultDisplay label="Kalium (K)" value={kg(results.potassiumKg)} unit="kg" />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Tips til gjødsling</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Strø gjødselen jevnt når jorda er fuktig, men bladene er tørre</li>
                <li>• Vann inn gjødselen om det ikke ventes regn</li>
                <li>• Mer enn ca. 5–8&nbsp;g nitrogen per m² om gangen gir fare for gjødselskade</li>
                <li>• Del store mengder opp i flere omganger</li>
                <li>• Følg alltid anbefalingen på pakken til din gjødsel</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="fertilizerType"
        label="Type gjødsel"
        value={inputs.fertilizerType}
        onChange={(v) => setInput('fertilizerType', v)}
        options={FERTILIZER_TYPE_OPTIONS}
      />

      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          id="nitrogen"
          label="Nitrogen (N) %"
          value={inputs.nitrogen}
          onChange={(v) => {
            setInput('nitrogen', v);
            setInput('fertilizerType', 'custom');
          }}
          min={0}
          max={100}
          step={0.5}
          error={errors.nitrogen}
        />
        <NumberInput
          id="phosphorus"
          label="Fosfor (P) %"
          value={inputs.phosphorus}
          onChange={(v) => {
            setInput('phosphorus', v);
            setInput('fertilizerType', 'custom');
          }}
          min={0}
          max={100}
          step={0.5}
          error={errors.phosphorus}
        />
        <NumberInput
          id="potassium"
          label="Kalium (K) %"
          value={inputs.potassium}
          onChange={(v) => {
            setInput('potassium', v);
            setInput('fertilizerType', 'custom');
          }}
          min={0}
          max={100}
          step={0.5}
          error={errors.potassium}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hurtigvalg etter planter (veiledende)</label>
        <div className="flex flex-wrap gap-2">
          {PLANT_TYPES.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setInput('targetNitrogenRate', opt.rate)}
              className="px-3 py-1 text-xs rounded-full border hover:bg-muted transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <NumberInput
        id="targetNitrogenRate"
        label="Ønsket nitrogen (gram N per m²)"
        value={inputs.targetNitrogenRate}
        onChange={(v) => setInput('targetNitrogenRate', v)}
        min={0.1}
        max={30}
        step={0.5}
        error={errors.targetNitrogenRate}
        required
      />

      <NumberInput
        id="area"
        label="Areal"
        value={inputs.area}
        onChange={(v) => setInput('area', v)}
        min={1}
        max={1000000}
        step={10}
        unit="m²"
        error={errors.area}
        required
      />
    </CalculatorBase>
  );
}

export default FertilizerCalculator;
