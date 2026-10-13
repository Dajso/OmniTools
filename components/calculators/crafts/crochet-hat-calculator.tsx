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
  calculateCrochetHatMetric,
  STANDARD_HEAD_SIZES_CM,
  AGE_GROUP_NAMES_NO,
  yarnForHatMeters,
  type HatStyle,
  type AgeGroup,
  type CrochetHatMetricResult,
} from '@/lib/calculations/crafts';

const crochetHatSchema = z.object({
  headCircumference: z.number().min(25).max(75),
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
  headCircumference: 56,
  style: 'beanie',
  negativeEase: 10,
  useStandardSize: false,
  ageGroup: 'adult-medium',
};

const STYLE_OPTIONS = [
  { value: 'beanie', label: 'Vanlig lue' },
  { value: 'slouchy', label: 'Slouchy (løs i toppen)' },
  { value: 'fitted', label: 'Tettsittende' },
  { value: 'earflap', label: 'Med ørelapper' },
];

const AGE_GROUP_OPTIONS = (Object.keys(STANDARD_HEAD_SIZES_CM) as AgeGroup[]).map((key) => ({
  value: key,
  label: `${AGE_GROUP_NAMES_NO[key]} (${STANDARD_HEAD_SIZES_CM[key].circumference} cm)`,
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
  } = useCalculator<CrochetHatInputs, CrochetHatMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: crochetHatSchema as unknown as z.ZodType<CrochetHatInputs>,
    calculate: (formInputs) => {
      const circumference = formInputs.useStandardSize
        ? STANDARD_HEAD_SIZES_CM[formInputs.ageGroup].circumference
        : formInputs.headCircumference;

      return calculateCrochetHatMetric({
        headCm: circumference,
        style: formInputs.style,
        negativeEase: formInputs.negativeEase,
      });
    },
    storageKey: 'crochet-hat-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Update circumference when age group changes
  React.useEffect(() => {
    if (inputs.useStandardSize) {
      const size = STANDARD_HEAD_SIZES_CM[inputs.ageGroup];
      if (size) {
        setInput('headCircumference', size.circumference);
      }
    }
  }, [inputs.ageGroup, inputs.useStandardSize, setInput]);

  const yarnEstimate = inputs.useStandardSize
    ? yarnForHatMeters(inputs.ageGroup)
    : null;

  return (
    <CalculatorBase
      title="Hekle lue"
      description="Regn ut mål til heklet lue ut fra hodeomkretsen"
      formula="Diameter på bunnen = lueomkrets ÷ π"
      formulaExplanation="Lueomkretsen er mindre enn hodet (negativ ease) slik at lua sitter godt"
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
                label="Diameter på bunnen (kronen)"
                value={results.crownDiameterCm}
                unit="cm"
                highlight
                copyable
              />
              <ResultDisplay
                label="Lueomkrets"
                value={results.hatCircumferenceCm}
                unit="cm"
                highlight
                copyable
              />
            </div>

            <ResultDisplay
              label="Luehøyde"
              value={results.hatHeightCm}
              unit="cm"
            />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Fasong på toppen</p>
              <p className="text-sm text-muted-foreground">
                Omtrent {results.decreaseRounds} omganger med felling i toppen
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Negativ ease: {results.negativeEasePercent}&nbsp;%
              </p>
            </div>

            {yarnEstimate && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Garnbehov (omtrentlig)</p>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay
                    label="Mellomtykt garn (worsted)"
                    value={yarnEstimate.worsted}
                    unit="m"
                  />
                  <ResultDisplay
                    label="Tykt garn (bulky)"
                    value={yarnEstimate.bulky}
                    unit="m"
                  />
                </div>
              </div>
            )}

            {/* Visual representation */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Mål på lua</p>
              <div className="flex justify-center">
                <svg
                  viewBox="0 0 200 180"
                  className="w-48 h-44"
                  aria-label="Skisse av luemål"
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
                    {formatNumber(results.crownDiameterCm, { maximumFractionDigits: 1 })} cm diameter
                  </text>
                  <text x="185" y="95" textAnchor="middle" className="text-xs fill-current" transform="rotate(90, 185, 95)">
                    {formatNumber(results.hatHeightCm, { maximumFractionDigits: 1 })} cm
                  </text>
                  <text x="100" y="160" textAnchor="middle" className="text-xs fill-current">
                    {formatNumber(results.hatCircumferenceCm, { maximumFractionDigits: 1 })} cm omkrets
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
          Bruk standardstørrelse
        </label>
      </div>

      {inputs.useStandardSize ? (
        <SelectInput
          id="ageGroup"
          label="Alder / størrelse"
          value={inputs.ageGroup}
          onChange={(v) => setInput('ageGroup', v as AgeGroup)}
          options={AGE_GROUP_OPTIONS}
        />
      ) : (
        <NumberInput
          id="headCircumference"
          label="Hodeomkrets"
          value={inputs.headCircumference}
          onChange={(v) => setInput('headCircumference', v)}
          min={25}
          max={75}
          step={1}
          unit="cm"
          error={errors.headCircumference}
          required
        />
      )}

      <SelectInput
        id="style"
        label="Luemodell"
        value={inputs.style}
        onChange={(v) => setInput('style', v as HatStyle)}
        options={STYLE_OPTIONS}
      />

      <NumberInput
        id="negativeEase"
        label="Negativ ease (lua mindre enn hodet)"
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
