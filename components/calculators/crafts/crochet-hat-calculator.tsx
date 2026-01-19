'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCrochetHat,
  STANDARD_HEAD_SIZES,
  YARN_REQUIREMENTS,
  type HatStyle,
  type AgeGroup,
  type CrochetHatResult,
} from '@/lib/calculations/crafts';

const crochetHatSchema = z.object({
  headCircumference: z.number().min(10).max(30),
  style: z.string(),
  negativeEase: z.number().min(0).max(25),
  useStandardSize: z.boolean(),
  ageGroup: z.string(),
});

type CrochetHatInputs = {
  headCircumference: number;
  style: HatStyle;
  negativeEase: number;
  useStandardSize: boolean;
  ageGroup: AgeGroup;
};

const INITIAL_INPUTS: CrochetHatInputs = {
  headCircumference: 22,
  style: 'beanie',
  negativeEase: 10,
  useStandardSize: false,
  ageGroup: 'adult-medium',
};

const STYLE_OPTIONS = [
  { value: 'beanie', label: 'Beanie (Standard)' },
  { value: 'slouchy', label: 'Slouchy' },
  { value: 'fitted', label: 'Fitted' },
  { value: 'earflap', label: 'Earflap' },
];

const AGE_GROUP_OPTIONS = Object.entries(STANDARD_HEAD_SIZES).map(([key, info]) => ({
  value: key,
  label: `${key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (${info.circumference}")`,
}));

export function CrochetHatCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<CrochetHatInputs, CrochetHatResult>({
    initialInputs: INITIAL_INPUTS,
    schema: crochetHatSchema as unknown as z.ZodType<CrochetHatInputs>,
    calculate: (formInputs) => {
      const circumference = formInputs.useStandardSize
        ? STANDARD_HEAD_SIZES[formInputs.ageGroup].circumference
        : formInputs.headCircumference;
      
      return calculateCrochetHat({
        headCircumference: circumference,
        style: formInputs.style,
        negativeEase: formInputs.negativeEase,
      });
    },
    storageKey: 'crochet-hat-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  // Update circumference when age group changes
  React.useEffect(() => {
    if (inputs.useStandardSize) {
      const size = STANDARD_HEAD_SIZES[inputs.ageGroup];
      if (size) {
        setInput('headCircumference', size.circumference);
      }
    }
  }, [inputs.ageGroup, inputs.useStandardSize]);

  const yarnEstimate = inputs.useStandardSize 
    ? YARN_REQUIREMENTS[inputs.ageGroup]
    : null;

  return (
    <CalculatorBase
      title="Crochet Hat Size Calculator"
      description="Calculate hat dimensions from head circumference for crochet projects"
      formula="Crown Diameter = Hat Circumference ÷ π"
      formulaExplanation="Hat circumference includes negative ease for a snug fit"
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
                label="Crown Diameter"
                value={results.crownDiameter}
                unit="inches"
                highlight
                copyable
              />
              <ResultDisplay
                label="Hat Circumference"
                value={results.hatCircumference}
                unit="inches"
                highlight
                copyable
              />
            </div>

            <ResultDisplay
              label="Hat Height"
              value={results.hatHeight}
              unit="inches"
            />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Crown Shaping</p>
              <p className="text-sm text-muted-foreground">
                Approximately {results.decreaseRounds} decrease rounds for crown shaping
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Negative ease: {results.negativeEasePercent}%
              </p>
            </div>

            {yarnEstimate && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Yarn Estimate</p>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay
                    label="Worsted Weight"
                    value={yarnEstimate.worsted}
                    unit="yards"
                  />
                  <ResultDisplay
                    label="Bulky Weight"
                    value={yarnEstimate.bulky}
                    unit="yards"
                  />
                </div>
              </div>
            )}

            {/* Visual representation */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Hat Dimensions</p>
              <div className="flex justify-center">
                <svg 
                  viewBox="0 0 200 180" 
                  className="w-48 h-44"
                  aria-label="Crochet hat dimensions diagram"
                >
                  {/* Hat body (trapezoid shape) */}
                  <path
                    d="M 40 140 Q 40 60 100 40 Q 160 60 160 140 L 40 140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {/* Brim line */}
                  <line
                    x1="40"
                    y1="140"
                    x2="160"
                    y2="140"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {/* Crown diameter line */}
                  <line
                    x1="60"
                    y1="50"
                    x2="140"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    className="text-muted-foreground"
                  />
                  {/* Height line */}
                  <line
                    x1="170"
                    y1="50"
                    x2="170"
                    y2="140"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    className="text-muted-foreground"
                  />
                  {/* Labels */}
                  <text x="100" y="35" textAnchor="middle" className="text-xs fill-current">
                    {results.crownDiameter}&quot; dia
                  </text>
                  <text x="185" y="95" textAnchor="middle" className="text-xs fill-current" transform="rotate(90, 185, 95)">
                    {results.hatHeight}&quot;
                  </text>
                  <text x="100" y="160" textAnchor="middle" className="text-xs fill-current">
                    {results.hatCircumference}&quot; circ
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="useStandardSize"
          checked={inputs.useStandardSize}
          onChange={(e) => setInput('useStandardSize', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="useStandardSize" className="text-sm">
          Use standard size chart
        </label>
      </div>

      {inputs.useStandardSize ? (
        <SelectInput
          id="ageGroup"
          label="Age Group / Size"
          value={inputs.ageGroup}
          onChange={(v) => setInput('ageGroup', v as AgeGroup)}
          options={AGE_GROUP_OPTIONS}
        />
      ) : (
        <NumberInput
          id="headCircumference"
          label="Head Circumference"
          value={inputs.headCircumference}
          onChange={(v) => setInput('headCircumference', v)}
          min={10}
          max={30}
          step={0.5}
          unit="inches"
          error={errors.headCircumference}
          required
        />
      )}

      <SelectInput
        id="style"
        label="Hat Style"
        value={inputs.style}
        onChange={(v) => setInput('style', v as HatStyle)}
        options={STYLE_OPTIONS}
      />

      <NumberInput
        id="negativeEase"
        label="Negative Ease"
        value={inputs.negativeEase}
        onChange={(v) => setInput('negativeEase', v)}
        min={0}
        max={25}
        step={1}
        unit="%"
        error={errors.negativeEase}
      />
    </CalculatorBase>
  );
}

export default CrochetHatCalculator;
