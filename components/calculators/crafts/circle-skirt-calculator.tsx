'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCircleSkirtMetric,
  type SkirtType,
  type CircleSkirtMetricResult,
} from '@/lib/calculations/crafts';
import { formatNumber } from '@/lib/utils/formatting';

const circleSkirtSchema = z.object({
  waistMeasurement: z.number().min(25).max(200),
  skirtLength: z.number().min(10).max(150),
  skirtType: z.string(),
  seamAllowance: z.number().min(0).max(5),
  hemAllowance: z.number().min(0).max(10),
});

type CircleSkirtInputs = {
  waistMeasurement: number;
  skirtLength: number;
  skirtType: SkirtType;
  seamAllowance: number;
  hemAllowance: number;
};

const INITIAL_INPUTS: CircleSkirtInputs = {
  waistMeasurement: 70,
  skirtLength: 60,
  skirtType: 'full',
  seamAllowance: 1.5,
  hemAllowance: 2.5,
};

const SKIRT_TYPE_OPTIONS = [
  { value: 'full', label: 'Hel sirkel (360°)' },
  { value: 'three-quarter', label: '3/4 sirkel (270°)' },
  { value: 'half', label: 'Halv sirkel (180°)' },
  { value: 'quarter', label: 'Kvart sirkel (90°)' },
];

export function CircleSkirtCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<CircleSkirtInputs, CircleSkirtMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: circleSkirtSchema as unknown as z.ZodType<CircleSkirtInputs>,
    calculate: (formInputs) => {
      return calculateCircleSkirtMetric({
        waistCm: formInputs.waistMeasurement,
        lengthCm: formInputs.skirtLength,
        skirtType: formInputs.skirtType,
        seamAllowanceCm: formInputs.seamAllowance,
        hemAllowanceCm: formInputs.hemAllowance,
      });
    },
    storageKey: 'circle-skirt-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getSkirtDescription = (type: SkirtType) => {
    switch (type) {
      case 'full': return 'Klippes som én hel sirkel (stoffet brettes i fire) med åpning midt bak';
      case 'half': return 'Klippes som én halvsirkel, eller som to kvartsirkler (for og bak) med sidesømmer';
      case 'quarter': return 'Klippes som én kvartsirkel, med søm midt bak';
      case 'three-quarter': return 'Klippes som en 3/4-sirkel (270°) med åpning midt bak';
    }
  };

  return (
    <CalculatorBase
      title="Sirkelskjørt"
      description="Regn ut radius og stoffbehov til sirkelskjørt"
      formula="Radius i midjen = midjemål ÷ (2π) × faktor"
      formulaExplanation="Faktoren avhenger av skjørtet: hel sirkel = 1, halv = 2, kvart = 4"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Radius i midjen (klippes)"
                value={results.innerCutRadiusCm}
                unit="cm"
                highlight
                copyable
              />
              <ResultDisplay
                label="Radius i fald (klippes)"
                value={results.outerCutRadiusCm}
                unit="cm"
                highlight
                copyable
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Slik klipper du</p>
              <p className="text-sm text-muted-foreground">
                {getSkirtDescription(inputs.skirtType)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Radiene måles fra sirkelens midtpunkt. Sømmonnen i midjen er trukket fra, og
                faldet er lagt til i radien ved nedre kant.
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Stoffbehov</p>
              <div className="grid grid-cols-2 gap-3">
                {results.fabric.map((f) => (
                  <ResultDisplay
                    key={f.widthCm}
                    label={`Stoff, ${f.widthCm} cm bredt`}
                    value={f.meters === null ? 'For smalt' : formatNumber(f.meters, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    unit={f.meters === null ? undefined : 'm'}
                  />
                ))}
              </div>
              {results.fabric.some((f) => f.needsSeams && f.meters !== null) && (
                <p className="text-xs text-muted-foreground mt-2">
                  På smalt stoff må stykkene skjøtes. Regnestykket er da laget for flere mindre
                  stykker, og du får søm i skjørtet.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <ResultDisplay
                  label="Minste bredde, ett stykke"
                  value={results.minWidthCm}
                  unit="cm"
                />
                <ResultDisplay
                  label="Minste lengde, ett stykke"
                  value={results.minLengthCm}
                  unit="cm"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Mål</p>
              <ResultDisplay
                label="Vidde i nedre kant (ferdig)"
                value={results.hemWidthCm}
                unit="cm"
              />
            </div>

            {/* Visual representation */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Skisse</p>
              <div className="flex justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48"
                  aria-label="Skisse av sirkelskjørt med radier"
                >
                  {/* Outer circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {/* Inner circle (waist) */}
                  <circle
                    cx="100"
                    cy="100"
                    r={80 * (results.innerCutRadiusCm / results.outerCutRadiusCm)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="text-muted-foreground"
                  />
                  {/* Labels */}
                  <text x="100" y="30" textAnchor="middle" className="text-xs fill-current">
                    {formatNumber(results.outerCutRadiusCm, { maximumFractionDigits: 1 })} cm
                  </text>
                  <text x="100" y="100" textAnchor="middle" className="text-xs fill-current">
                    {formatNumber(results.innerCutRadiusCm, { maximumFractionDigits: 1 })} cm
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )
      }
    >
      <NumberInput
        id="waistMeasurement"
        label="Midjemål"
        value={inputs.waistMeasurement}
        onChange={(v) => setInput('waistMeasurement', v)}
        min={25}
        max={200}
        step={1}
        unit="cm"
        error={errors.waistMeasurement}
        required
      />

      <NumberInput
        id="skirtLength"
        label="Skjørtlengde"
        value={inputs.skirtLength}
        onChange={(v) => setInput('skirtLength', v)}
        min={10}
        max={150}
        step={1}
        unit="cm"
        error={errors.skirtLength}
        required
      />

      <SelectInput
        id="skirtType"
        label="Type skjørt"
        value={inputs.skirtType}
        onChange={(v) => setInput('skirtType', v as SkirtType)}
        options={SKIRT_TYPE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="seamAllowance"
          label="Sømmonn"
          value={inputs.seamAllowance}
          onChange={(v) => setInput('seamAllowance', v)}
          min={0}
          max={5}
          step={0.5}
          unit="cm"
          error={errors.seamAllowance}
        />

        <NumberInput
          id="hemAllowance"
          label="Fald"
          value={inputs.hemAllowance}
          onChange={(v) => setInput('hemAllowance', v)}
          min={0}
          max={10}
          step={0.5}
          unit="cm"
          error={errors.hemAllowance}
        />
      </div>
    </CalculatorBase>
  );
}

export default CircleSkirtCalculator;
