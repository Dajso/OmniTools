'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const mulchSoilSchema = z.object({
  calculationType: z.enum(['mulch', 'soil', 'gravel']),
  areaShape: z.enum(['rectangular', 'circular']),
  length: z.number().min(0.1).max(1000),
  width: z.number().min(0.1).max(1000),
  diameter: z.number().min(0.1).max(500),
  depth: z.number().min(1).max(60),
});

type MulchSoilInputs = z.infer<typeof mulchSoilSchema>;

interface MulchSoilResults {
  areaSqM: number;
  volumeCubicMeters: number;
  volumeLiters: number;
  bags50: number;
  bags70: number;
  weightKg: number;
  weightTonnes: number;
}

const INITIAL_INPUTS: MulchSoilInputs = {
  calculationType: 'mulch',
  areaShape: 'rectangular',
  length: 5,
  width: 3,
  diameter: 3,
  depth: 7,
};

const CALCULATION_TYPE_OPTIONS = [
  { value: 'mulch', label: 'Bark / mulch' },
  { value: 'soil', label: 'Matjord / hagejord' },
  { value: 'gravel', label: 'Grus / stein' },
];

const AREA_SHAPE_OPTIONS = [
  { value: 'rectangular', label: 'Rektangel / kvadrat' },
  { value: 'circular', label: 'Sirkel' },
];

// Omtrentlig tetthet i kg per m³ (løst lagt)
const DENSITY_KG_PER_M3 = {
  mulch: 320,
  soil: 1200,
  gravel: 1600,
};

function calculateMulchSoil(inputs: MulchSoilInputs): MulchSoilResults {
  const { calculationType, areaShape, length, width, diameter, depth } = inputs;

  const areaSqM =
    areaShape === 'rectangular'
      ? length * width
      : Math.PI * (diameter / 2) ** 2;

  const volumeCubicMeters = areaSqM * (depth / 100);
  const volumeLiters = volumeCubicMeters * 1000;
  const weightKg = volumeCubicMeters * DENSITY_KG_PER_M3[calculationType];

  return {
    areaSqM: Math.round(areaSqM * 100) / 100,
    volumeCubicMeters: Math.round(volumeCubicMeters * 100) / 100,
    volumeLiters: Math.round(volumeLiters),
    bags50: Math.ceil(volumeLiters / 50),
    bags70: Math.ceil(volumeLiters / 70),
    weightKg: Math.round(weightKg),
    weightTonnes: Math.round((weightKg / 1000) * 100) / 100,
  };
}

export function MulchSoilCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<MulchSoilInputs, MulchSoilResults>({
    initialInputs: INITIAL_INPUTS,
    schema: mulchSoilSchema,
    calculate: calculateMulchSoil,
    storageKey: 'mulch-soil-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const materialName =
    inputs.calculationType === 'mulch' ? 'Bark eller mulch' :
    inputs.calculationType === 'soil' ? 'Jord' : 'Grus eller stein';

  return (
    <CalculatorBase
      title="Bark, jord og grus"
      description="Regn ut hvor mye bark, jord eller grus du trenger til hagen"
      formula="Volum = areal × lagtykkelse"
      formulaExplanation="Regner ut kubikkmeter ut fra flaten du skal dekke og ønsket tykkelse"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Dekker"
              value={`${formatNumber(results.areaSqM, { maximumFractionDigits: 1 })} m² med ${formatNumber(inputs.depth, { maximumFractionDigits: 1 })} cm lag`}
              highlight
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Volum"
                value={results.volumeCubicMeters}
                unit="m³"
                highlight
                copyable
              />
              <ResultDisplay
                label="Volum"
                value={results.volumeLiters}
                unit="liter"
                copyable
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Sekker</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Sekker à 50 liter"
                  value={results.bags50}
                  unit="sekker"
                />
                <ResultDisplay
                  label="Sekker à 70 liter"
                  value={results.bags70}
                  unit="sekker"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Omtrentlig vekt</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Vekt"
                  value={results.weightKg}
                  unit="kg"
                />
                <ResultDisplay
                  label="Vekt"
                  value={results.weightTonnes}
                  unit="tonn"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Tips til innkjøp</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Løs vekt med levering er ofte billigere enn sekker når du trenger mer enn ca. 2&nbsp;m³</li>
                <li>• Legg til 5–10&nbsp;% ekstra til setning og svinn</li>
                <li>• {materialName}: 5–8&nbsp;cm lag mot ugress, 8–10&nbsp;cm som isolasjon</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="calculationType"
        label="Materiale"
        value={inputs.calculationType}
        onChange={(v) => setInput('calculationType', v as MulchSoilInputs['calculationType'])}
        options={CALCULATION_TYPE_OPTIONS}
      />

      <SelectInput
        id="areaShape"
        label="Form på flaten"
        value={inputs.areaShape}
        onChange={(v) => setInput('areaShape', v as 'rectangular' | 'circular')}
        options={AREA_SHAPE_OPTIONS}
      />

      {inputs.areaShape === 'rectangular' ? (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="length"
            label="Lengde"
            value={inputs.length}
            onChange={(v) => setInput('length', v)}
            min={0.1}
            max={1000}
            step={0.5}
            unit="m"
            error={errors.length}
            required
          />
          <NumberInput
            id="width"
            label="Bredde"
            value={inputs.width}
            onChange={(v) => setInput('width', v)}
            min={0.1}
            max={1000}
            step={0.5}
            unit="m"
            error={errors.width}
            required
          />
        </div>
      ) : (
        <NumberInput
          id="diameter"
          label="Diameter"
          value={inputs.diameter}
          onChange={(v) => setInput('diameter', v)}
          min={0.1}
          max={500}
          step={0.5}
          unit="m"
          error={errors.diameter}
          required
        />
      )}

      <NumberInput
        id="depth"
        label="Lagtykkelse"
        value={inputs.depth}
        onChange={(v) => setInput('depth', v)}
        min={1}
        max={60}
        step={1}
        unit="cm"
        error={errors.depth}
        required
      />
    </CalculatorBase>
  );
}

export default MulchSoilCalculator;
