'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatNumber } from '@/lib/utils/formatting';
import {
  calculatePottingSoil,
  type PottingSoilResult,
  type ContainerShape,
} from '@/lib/calculations/garden';

const pottingSoilSchema = z.object({
  shape: z.enum(['cylinder', 'rectangular', 'tapered']),
  diameter: z.number().min(1).max(250),
  topDiameter: z.number().min(1).max(250),
  bottomDiameter: z.number().min(1).max(250),
  length: z.number().min(1).max(500),
  width: z.number().min(1).max(500),
  height: z.number().min(1).max(250),
  fillPercentage: z.number().min(50).max(100),
});

type PottingSoilInputs = z.infer<typeof pottingSoilSchema>;

interface PottingSoilMetricResult extends PottingSoilResult {
  bagsNorway: {
    l10: number;
    l20: number;
    l50: number;
    l70: number;
  };
}

const INITIAL_INPUTS: PottingSoilInputs = {
  shape: 'cylinder',
  diameter: 30,
  topDiameter: 35,
  bottomDiameter: 25,
  length: 60,
  width: 30,
  height: 25,
  fillPercentage: 90,
};

const SHAPE_OPTIONS = [
  { value: 'cylinder', label: 'Rund potte (sylinder)' },
  { value: 'rectangular', label: 'Kasse eller trau' },
  { value: 'tapered', label: 'Potte som smalner av nedover' },
];

function calculateSoil(inputs: PottingSoilInputs): PottingSoilMetricResult {
  const result = calculatePottingSoil({
    shape: inputs.shape as ContainerShape,
    diameter: inputs.diameter,
    topDiameter: inputs.topDiameter,
    bottomDiameter: inputs.bottomDiameter,
    length: inputs.length,
    width: inputs.width,
    height: inputs.height,
    lengthUnit: 'cm',
    fillPercentage: inputs.fillPercentage,
  });

  const liters = result.volumeLiters;
  return {
    ...result,
    bagsNorway: {
      l10: Math.ceil(liters / 10),
      l20: Math.ceil(liters / 20),
      l50: Math.ceil(liters / 50),
      l70: Math.ceil(liters / 70),
    },
  };
}

export function PottingSoilCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<PottingSoilInputs, PottingSoilMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: pottingSoilSchema,
    calculate: calculateSoil,
    storageKey: 'potting-soil-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Pottejord"
      description="Regn ut hvor mye pottejord du trenger til potter, kasser og plantekasser"
      formula="V = π × r² × h (sylinder) eller V = l × b × h (kasse)"
      formulaExplanation="Volumet regnes ut ut fra formen og målene på karet"
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
                label="Jord som trengs"
                value={formatNumber(results.volumeLiters, { maximumFractionDigits: 1 })}
                unit="liter"
                highlight
                copyable
              />
              <ResultDisplay
                label="Volum"
                value={formatNumber(results.volumeLiters / 1000, { maximumFractionDigits: 3 })}
                unit="m³"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Sekker som trengs</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Sekker à 10 liter"
                  value={results.bagsNorway.l10}
                  unit="sekker"
                />
                <ResultDisplay
                  label="Sekker à 20 liter"
                  value={results.bagsNorway.l20}
                  unit="sekker"
                />
                <ResultDisplay
                  label="Sekker à 50 liter"
                  value={results.bagsNorway.l50}
                  unit="sekker"
                />
                <ResultDisplay
                  label="Sekker à 70 liter"
                  value={results.bagsNorway.l70}
                  unit="sekker"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• La det være 2–4&nbsp;cm fra kanten, så det er plass til vann</li>
                <li>• Legg lecakuler eller grov grus nederst i store potter</li>
                <li>• Bland inn perlitt for bedre drenering</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="shape"
        label="Form på karet"
        value={inputs.shape}
        onChange={(v) => setInput('shape', v as ContainerShape)}
        options={SHAPE_OPTIONS}
      />

      {inputs.shape === 'cylinder' && (
        <NumberInput
          id="diameter"
          label="Diameter"
          value={inputs.diameter}
          onChange={(v) => setInput('diameter', v)}
          min={1}
          max={250}
          step={1}
          unit="cm"
          error={errors.diameter}
          required
        />
      )}

      {inputs.shape === 'tapered' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="topDiameter"
            label="Diameter øverst"
            value={inputs.topDiameter}
            onChange={(v) => setInput('topDiameter', v)}
            min={1}
            max={250}
            step={1}
            unit="cm"
            error={errors.topDiameter}
            required
          />
          <NumberInput
            id="bottomDiameter"
            label="Diameter nederst"
            value={inputs.bottomDiameter}
            onChange={(v) => setInput('bottomDiameter', v)}
            min={1}
            max={250}
            step={1}
            unit="cm"
            error={errors.bottomDiameter}
            required
          />
        </div>
      )}

      {inputs.shape === 'rectangular' && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="length"
            label="Lengde"
            value={inputs.length}
            onChange={(v) => setInput('length', v)}
            min={1}
            max={500}
            step={1}
            unit="cm"
            error={errors.length}
            required
          />
          <NumberInput
            id="width"
            label="Bredde"
            value={inputs.width}
            onChange={(v) => setInput('width', v)}
            min={1}
            max={500}
            step={1}
            unit="cm"
            error={errors.width}
            required
          />
        </div>
      )}

      <NumberInput
        id="height"
        label="Høyde / dybde"
        value={inputs.height}
        onChange={(v) => setInput('height', v)}
        min={1}
        max={250}
        step={1}
        unit="cm"
        error={errors.height}
        required
      />

      <NumberInput
        id="fillPercentage"
        label="Fyllingsgrad"
        value={inputs.fillPercentage}
        onChange={(v) => setInput('fillPercentage', v)}
        min={50}
        max={100}
        step={5}
        unit="%"
        error={errors.fillPercentage}
      />
    </CalculatorBase>
  );
}

export default PottingSoilCalculator;
