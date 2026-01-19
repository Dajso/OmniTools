'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateSockDimensions,
  estimateYarnRequirements,
  SOCK_SIZE_CHART,
  type SockResult,
} from '@/lib/calculations/crafts';

const socksSizeSchema = z.object({
  footLength: z.number().min(5).max(15),
  footCircumference: z.number().min(5).max(15),
  ankleCircumference: z.number().min(5).max(15),
  legLength: z.number().min(2).max(20),
  unit: z.enum(['inches', 'cm']),
  stitchesPerInch: z.number().min(4).max(12),
  rowsPerInch: z.number().min(4).max(16),
  yarnWeight: z.enum(['fingering', 'sport', 'dk']),
});

type SocksSizeInputs = z.infer<typeof socksSizeSchema>;

interface SocksSizeResults extends SockResult {
  yarnEstimate: number;
}

const INITIAL_INPUTS: SocksSizeInputs = {
  footLength: 9.5,
  footCircumference: 9,
  ankleCircumference: 8.5,
  legLength: 6,
  unit: 'inches',
  stitchesPerInch: 8,
  rowsPerInch: 10,
  yarnWeight: 'fingering',
};

const UNIT_OPTIONS = [
  { value: 'inches', label: 'Inches' },
  { value: 'cm', label: 'Centimeters' },
];

const YARN_WEIGHT_OPTIONS = [
  { value: 'fingering', label: 'Fingering (Sock Weight)' },
  { value: 'sport', label: 'Sport Weight' },
  { value: 'dk', label: 'DK Weight' },
];

function calculateSocksSize(inputs: SocksSizeInputs): SocksSizeResults {
  const result = calculateSockDimensions(
    {
      footLength: inputs.footLength,
      footCircumference: inputs.footCircumference,
      ankleCircumference: inputs.ankleCircumference,
      legLength: inputs.legLength,
      unit: inputs.unit,
    },
    {
      stitchesPerInch: inputs.stitchesPerInch,
      rowsPerInch: inputs.rowsPerInch,
    }
  );

  const yarnEstimate = estimateYarnRequirements(result, inputs.yarnWeight);

  return {
    ...result,
    yarnEstimate,
  };
}

export function SocksSizeCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<SocksSizeInputs, SocksSizeResults>({
    initialInputs: INITIAL_INPUTS,
    schema: socksSizeSchema,
    calculate: calculateSocksSize,
    storageKey: 'socks-size-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  const unitLabel = inputs.unit === 'inches' ? 'in' : 'cm';

  return (
    <CalculatorBase
      title="Socks Size Calculator"
      description="Calculate sock dimensions and stitch counts from foot measurements"
      formula="Cast On = Foot Circumference × Gauge × (1 - Negative Ease)"
      formulaExplanation="Socks typically have 10% negative ease for a snug fit"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            {/* Size Info */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Shoe Size Equivalent</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">US</p>
                  <p className="font-medium">{results.usSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">EU</p>
                  <p className="font-medium">{results.euSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">UK</p>
                  <p className="font-medium">{results.ukSize}</p>
                </div>
              </div>
            </div>

            {/* Stitch Counts */}
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Cast On Stitches"
                value={results.castOnStitches}
                unit="sts"
                highlight
                copyable
              />
              <ResultDisplay
                label="Heel Stitches"
                value={results.heelStitches}
                unit="sts"
                copyable
              />
              <ResultDisplay
                label="Gusset Pickup"
                value={results.gussetPickupStitches}
                unit="sts per side"
                copyable
              />
              <ResultDisplay
                label="Toe End Stitches"
                value={results.toeDecreaseStitches}
                unit="sts"
                copyable
              />
            </div>

            {/* Measurements */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Measurements</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Foot Length to Toe"
                  value={results.footLengthToToe}
                  unit="in"
                />
                <ResultDisplay
                  label="Heel Flap Length"
                  value={results.heelFlapLength}
                  unit="in"
                />
                <ResultDisplay
                  label="Leg Length"
                  value={results.legLength}
                  unit="in"
                />
                <ResultDisplay
                  label="Negative Ease"
                  value={results.negativeEase}
                  unit="%"
                />
              </div>
            </div>

            {/* Yarn Estimate */}
            <div className="border-t pt-4">
              <ResultDisplay
                label="Yarn Estimate (per pair)"
                value={`~${results.yarnEstimate}`}
                unit="yards"
                highlight
              />
              <p className="text-xs text-muted-foreground mt-1">
                Based on {inputs.yarnWeight} weight yarn
              </p>
            </div>

            {/* Visual Sock Diagram */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Sock Structure</p>
              <div className="flex justify-center">
                <svg 
                  viewBox="0 0 200 300" 
                  className="w-40 h-60"
                  aria-label="Sock dimensions diagram"
                >
                  {/* Cuff */}
                  <rect x="50" y="10" width="100" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="25" textAnchor="middle" className="text-[8px] fill-current">Cuff</text>
                  
                  {/* Leg */}
                  <rect x="50" y="30" width="100" height="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="75" textAnchor="middle" className="text-[8px] fill-current">{results.legLength}" Leg</text>
                  
                  {/* Heel flap */}
                  <path d="M 50 110 L 50 150 Q 50 180 80 180 L 120 180 Q 150 180 150 150 L 150 110" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="145" textAnchor="middle" className="text-[8px] fill-current">Heel</text>
                  
                  {/* Foot */}
                  <rect x="50" y="180" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="215" textAnchor="middle" className="text-[8px] fill-current">{results.footLengthToToe}" Foot</text>
                  
                  {/* Toe */}
                  <path d="M 50 240 L 50 260 Q 50 290 100 290 Q 150 290 150 260 L 150 240" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="270" textAnchor="middle" className="text-[8px] fill-current">Toe</text>
                  
                  {/* Stitch count labels */}
                  <text x="160" y="25" className="text-[7px] fill-current text-muted-foreground">{results.castOnStitches} sts</text>
                  <text x="160" y="165" className="text-[7px] fill-current text-muted-foreground">{results.heelStitches} sts</text>
                </svg>
              </div>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="unit"
        label="Measurement Unit"
        value={inputs.unit}
        onChange={(v) => setInput('unit', v as 'inches' | 'cm')}
        options={UNIT_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="footLength"
          label="Foot Length"
          value={inputs.footLength}
          onChange={(v) => setInput('footLength', v)}
          min={5}
          max={15}
          step={0.25}
          unit={unitLabel}
          error={errors.footLength}
          required
        />
        <NumberInput
          id="footCircumference"
          label="Foot Circumference"
          value={inputs.footCircumference}
          onChange={(v) => setInput('footCircumference', v)}
          min={5}
          max={15}
          step={0.25}
          unit={unitLabel}
          error={errors.footCircumference}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="ankleCircumference"
          label="Ankle Circumference"
          value={inputs.ankleCircumference}
          onChange={(v) => setInput('ankleCircumference', v)}
          min={5}
          max={15}
          step={0.25}
          unit={unitLabel}
          error={errors.ankleCircumference}
        />
        <NumberInput
          id="legLength"
          label="Desired Leg Length"
          value={inputs.legLength}
          onChange={(v) => setInput('legLength', v)}
          min={2}
          max={20}
          step={0.5}
          unit={unitLabel}
          error={errors.legLength}
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-sm font-medium mb-3">Your Gauge (stitches per inch)</p>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="stitchesPerInch"
            label="Stitches/inch"
            value={inputs.stitchesPerInch}
            onChange={(v) => setInput('stitchesPerInch', v)}
            min={4}
            max={12}
            step={0.5}
            error={errors.stitchesPerInch}
            required
          />
          <NumberInput
            id="rowsPerInch"
            label="Rows/inch"
            value={inputs.rowsPerInch}
            onChange={(v) => setInput('rowsPerInch', v)}
            min={4}
            max={16}
            step={0.5}
            error={errors.rowsPerInch}
            required
          />
        </div>
      </div>

      <SelectInput
        id="yarnWeight"
        label="Yarn Weight"
        value={inputs.yarnWeight}
        onChange={(v) => setInput('yarnWeight', v as 'fingering' | 'sport' | 'dk')}
        options={YARN_WEIGHT_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default SocksSizeCalculator;
