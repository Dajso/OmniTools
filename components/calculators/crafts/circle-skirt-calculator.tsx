'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCircleSkirt,
  type SkirtType,
  type CircleSkirtResult,
} from '@/lib/calculations/crafts';

const circleSkirtSchema = z.object({
  waistMeasurement: z.number().min(10).max(80),
  skirtLength: z.number().min(5).max(60),
  skirtType: z.string(),
  seamAllowance: z.number().min(0).max(2),
  hemAllowance: z.number().min(0).max(4),
});

type CircleSkirtInputs = {
  waistMeasurement: number;
  skirtLength: number;
  skirtType: SkirtType;
  seamAllowance: number;
  hemAllowance: number;
};

const INITIAL_INPUTS: CircleSkirtInputs = {
  waistMeasurement: 28,
  skirtLength: 24,
  skirtType: 'full',
  seamAllowance: 0.5,
  hemAllowance: 1,
};

const SKIRT_TYPE_OPTIONS = [
  { value: 'full', label: 'Full Circle (360°)' },
  { value: 'three-quarter', label: '3/4 Circle (270°)' },
  { value: 'half', label: 'Half Circle (180°)' },
  { value: 'quarter', label: 'Quarter Circle (90°)' },
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
  } = useCalculator<CircleSkirtInputs, CircleSkirtResult>({
    initialInputs: INITIAL_INPUTS,
    schema: circleSkirtSchema as unknown as z.ZodType<CircleSkirtInputs>,
    calculate: (formInputs) => {
      return calculateCircleSkirt({
        waistMeasurement: formInputs.waistMeasurement,
        skirtLength: formInputs.skirtLength,
        skirtType: formInputs.skirtType,
        seamAllowance: formInputs.seamAllowance,
        hemAllowance: formInputs.hemAllowance,
      });
    },
    storageKey: 'circle-skirt-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  const getSkirtDescription = (type: SkirtType) => {
    switch (type) {
      case 'full': return 'Cut as one piece with a center back seam';
      case 'half': return 'Cut 2 half-circle pieces';
      case 'quarter': return 'Cut 4 quarter-circle pieces';
      case 'three-quarter': return 'Cut as one piece with a center back opening';
    }
  };

  return (
    <CalculatorBase
      title="Circle Skirt Calculator"
      description="Calculate the inner radius and fabric requirements for circle skirts"
      formula="Inner Radius = Waist ÷ (2π) × Multiplier"
      formulaExplanation="The multiplier varies by skirt type: Full=1, Half=2, Quarter=4"
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
                label="Inner Radius (Waist)"
                value={results.innerRadius}
                unit="inches"
                highlight
                copyable
              />
              <ResultDisplay
                label="Outer Radius (Hem)"
                value={results.outerRadius}
                unit="inches"
                highlight
                copyable
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Cutting Instructions</p>
              <p className="text-sm text-muted-foreground">
                {getSkirtDescription(inputs.skirtType)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Number of panels: {results.numberOfPanels}
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Fabric Requirements</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Minimum Width"
                  value={results.fabricWidthNeeded}
                  unit="inches"
                />
                <ResultDisplay
                  label="Minimum Length"
                  value={results.fabricLengthNeeded}
                  unit="inches"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <ResultDisplay
                  label="For 45&quot; Fabric"
                  value={results.fabricYards45}
                  unit="yards"
                />
                <ResultDisplay
                  label="For 60&quot; Fabric"
                  value={results.fabricYards60}
                  unit="yards"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Circumferences</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Waist Circumference"
                  value={results.waistCircumference}
                  unit="inches"
                />
                <ResultDisplay
                  label="Hem Circumference"
                  value={results.hemCircumference}
                  unit="inches"
                />
              </div>
            </div>

            {/* Visual representation */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Visual Guide</p>
              <div className="flex justify-center">
                <svg 
                  viewBox="0 0 200 200" 
                  className="w-48 h-48"
                  aria-label="Circle skirt cutting diagram"
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
                    r={80 * (results.innerRadius / results.outerRadius)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="text-muted-foreground"
                  />
                  {/* Labels */}
                  <text x="100" y="30" textAnchor="middle" className="text-xs fill-current">
                    {results.outerRadius}&quot;
                  </text>
                  <text x="100" y="100" textAnchor="middle" className="text-xs fill-current">
                    {results.innerRadius}&quot;
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
        label="Waist Measurement"
        value={inputs.waistMeasurement}
        onChange={(v) => setInput('waistMeasurement', v)}
        min={10}
        max={80}
        step={0.5}
        unit="inches"
        error={errors.waistMeasurement}
        required
      />

      <NumberInput
        id="skirtLength"
        label="Skirt Length"
        value={inputs.skirtLength}
        onChange={(v) => setInput('skirtLength', v)}
        min={5}
        max={60}
        step={0.5}
        unit="inches"
        error={errors.skirtLength}
        required
      />

      <SelectInput
        id="skirtType"
        label="Skirt Type"
        value={inputs.skirtType}
        onChange={(v) => setInput('skirtType', v as SkirtType)}
        options={SKIRT_TYPE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="seamAllowance"
          label="Seam Allowance"
          value={inputs.seamAllowance}
          onChange={(v) => setInput('seamAllowance', v)}
          min={0}
          max={2}
          step={0.125}
          unit="inches"
          error={errors.seamAllowance}
        />

        <NumberInput
          id="hemAllowance"
          label="Hem Allowance"
          value={inputs.hemAllowance}
          onChange={(v) => setInput('hemAllowance', v)}
          min={0}
          max={4}
          step={0.25}
          unit="inches"
          error={errors.hemAllowance}
        />
      </div>
    </CalculatorBase>
  );
}

export default CircleSkirtCalculator;
