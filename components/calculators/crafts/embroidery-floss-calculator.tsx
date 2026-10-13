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
  calculateEmbroideryFlossMetric,
  STITCH_TYPES,
  FABRIC_COUNTS,
  FLOSS_SKEIN_LENGTH_M,
  FLOSS_CUT_LENGTH_CM,
  type StitchType,
  type EmbroideryFlossMetricResult,
} from '@/lib/calculations/crafts';

const embroideryFlossSchema = z.object({
  stitchCount: z.number().min(1).max(1000000),
  fabricCount: z.number().min(8).max(50),
  stitchType: z.string(),
  strandsUsed: z.number().min(1).max(6),
  overTwo: z.boolean(),
});

type EmbroideryFlossInputs = {
  stitchCount: number;
  fabricCount: number;
  stitchType: StitchType;
  strandsUsed: number;
  overTwo: boolean;
};

const INITIAL_INPUTS: EmbroideryFlossInputs = {
  stitchCount: 1000,
  fabricCount: 14,
  stitchType: 'cross-stitch',
  strandsUsed: 2,
  overTwo: false,
};

const STITCH_TYPE_OPTIONS = Object.entries(STITCH_TYPES).map(([key, info]) => ({
  value: key,
  label: info.name,
}));

const FABRIC_COUNT_OPTIONS = FABRIC_COUNTS.map(fc => ({
  value: fc.value.toString(),
  label: fc.label,
}));

const STRAND_OPTIONS = [
  { value: '1', label: '1 tråd' },
  { value: '2', label: '2 tråder' },
  { value: '3', label: '3 tråder' },
  { value: '4', label: '4 tråder' },
  { value: '6', label: '6 tråder (hel)' },
];

export function EmbroideryFlossCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<EmbroideryFlossInputs, EmbroideryFlossMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: embroideryFlossSchema as unknown as z.ZodType<EmbroideryFlossInputs>,
    calculate: (formInputs) => {
      return calculateEmbroideryFlossMetric({
        stitchCount: formInputs.stitchCount,
        fabricCount: formInputs.fabricCount,
        stitchType: formInputs.stitchType,
        strandsUsed: formInputs.strandsUsed,
        overTwo: formInputs.overTwo,
      });
    },
    storageKey: 'embroidery-floss-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const stitchInfo = STITCH_TYPES[inputs.stitchType];

  return (
    <CalculatorBase
      title="Brodergarn"
      description="Regn ut hvor mye brodergarn du trenger til korssting og broderi"
      formula="Tråd = antall sting × tråd per sting × justering for tråder"
      formulaExplanation="Basert på stoffets ct-tall, type sting og antall tråder"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Dokker som trengs"
              value={results.skeinsNeeded}
              unit="dokker"
              highlight
              copyable
            />

            <ResultDisplay
              label="Trådlengde"
              value={results.threadLengthMeters}
              unit="m"
            />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Detaljer</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tråd per sting:</span>
                  <span className="ml-2">{formatNumber(results.threadPerStitchCm, { maximumFractionDigits: 2 })}&nbsp;cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Andel av dokke(r):</span>
                  <span className="ml-2">{formatNumber(results.skeinPercentage, { maximumFractionDigits: 0 })}&nbsp;%</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Råd</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Klipp tråden i:</span>{' '}
                  <span className="text-muted-foreground">
                    ca. {FLOSS_CUT_LENGTH_CM}&nbsp;cm (vanlig arbeidslengde)
                  </span>
                </p>
                <p>
                  <span className="font-medium">Tips:</span>{' '}
                  <span className="text-muted-foreground">
                    Inkluderer 15&nbsp;% ekstra til spill og tråder som festes. Regnet med {FLOSS_SKEIN_LENGTH_M}&nbsp;m per dokke.
                  </span>
                </p>
              </div>
            </div>

            {/* Stitch type info */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Om {stitchInfo.name.toLowerCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                {stitchInfo.description}. Brukes vanligvis med {stitchInfo.typicalStrands} {stitchInfo.typicalStrands === 1 ? 'tråd' : 'tråder'}.
              </p>
            </div>
          </div>
        )
      }
    >
      <NumberInput
        id="stitchCount"
        label="Antall sting"
        value={inputs.stitchCount}
        onChange={(v) => setInput('stitchCount', v)}
        min={1}
        max={1000000}
        step={100}
        error={errors.stitchCount}
        required
      />

      <SelectInput
        id="fabricCount"
        label="Stoffets ct-tall"
        value={inputs.fabricCount.toString()}
        onChange={(v) => setInput('fabricCount', parseInt(v))}
        options={FABRIC_COUNT_OPTIONS}
      />

      <SelectInput
        id="stitchType"
        label="Type sting"
        value={inputs.stitchType}
        onChange={(v) => setInput('stitchType', v as StitchType)}
        options={STITCH_TYPE_OPTIONS}
      />

      <SelectInput
        id="strandsUsed"
        label="Antall tråder"
        value={inputs.strandsUsed.toString()}
        onChange={(v) => setInput('strandsUsed', parseInt(v))}
        options={STRAND_OPTIONS}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="overTwo"
          checked={inputs.overTwo}
          onChange={(e) => setInput('overTwo', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="overTwo" className="text-sm">
          Sting over 2 tråder (jevnvevd stoff / lin)
        </label>
      </div>
    </CalculatorBase>
  );
}

export default EmbroideryFlossCalculator;
