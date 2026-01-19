'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateEmbroideryFloss,
  STITCH_TYPES,
  FABRIC_COUNTS,
  type StitchType,
  type EmbroideryFlossResult,
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
  { value: '1', label: '1 strand' },
  { value: '2', label: '2 strands' },
  { value: '3', label: '3 strands' },
  { value: '4', label: '4 strands' },
  { value: '6', label: '6 strands (full)' },
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
  } = useCalculator<EmbroideryFlossInputs, EmbroideryFlossResult>({
    initialInputs: INITIAL_INPUTS,
    schema: embroideryFlossSchema as unknown as z.ZodType<EmbroideryFlossInputs>,
    calculate: (formInputs) => {
      return calculateEmbroideryFloss({
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
  }, []);

  const stitchInfo = STITCH_TYPES[inputs.stitchType];

  return (
    <CalculatorBase
      title="Embroidery Floss Calculator"
      description="Calculate how much embroidery floss you need for your cross stitch or embroidery project"
      formula="Thread = Stitches × Thread per Stitch × Strand Adjustment"
      formulaExplanation="Based on fabric count, stitch type, and number of strands"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Skeins Needed"
              value={results.skeinsNeeded}
              unit="skeins"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Thread Length"
                value={results.threadLengthInches}
                unit="inches"
              />
              <ResultDisplay
                label="Thread Length"
                value={results.threadLengthMeters}
                unit="meters"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Usage Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Thread per stitch:</span>
                  <span className="ml-2">{results.threadPerStitch}&quot;</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Skein usage:</span>
                  <span className="ml-2">{results.skeinPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Recommendations</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Cut length:</span>{' '}
                  <span className="text-muted-foreground">
                    {results.recommendedCutLength}&quot; (standard working length)
                  </span>
                </p>
                <p>
                  <span className="font-medium">Tip:</span>{' '}
                  <span className="text-muted-foreground">
                    Includes 15% buffer for waste and tails
                  </span>
                </p>
              </div>
            </div>

            {/* Stitch type info */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                About {stitchInfo.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {stitchInfo.description}. Typically uses {stitchInfo.typicalStrands} strand(s).
              </p>
            </div>
          </div>
        )
      }
    >
      <NumberInput
        id="stitchCount"
        label="Number of Stitches"
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
        label="Fabric Count"
        value={inputs.fabricCount.toString()}
        onChange={(v) => setInput('fabricCount', parseInt(v))}
        options={FABRIC_COUNT_OPTIONS}
      />

      <SelectInput
        id="stitchType"
        label="Stitch Type"
        value={inputs.stitchType}
        onChange={(v) => setInput('stitchType', v as StitchType)}
        options={STITCH_TYPE_OPTIONS}
      />

      <SelectInput
        id="strandsUsed"
        label="Number of Strands"
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
          Stitching over 2 threads (evenweave/linen)
        </label>
      </div>
    </CalculatorBase>
  );
}

export default EmbroideryFlossCalculator;
