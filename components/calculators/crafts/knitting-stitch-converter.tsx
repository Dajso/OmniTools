'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  convertStitches,
  calculateStitchesForWidth,
  calculateRowsForLength,
  YARN_WEIGHT_GAUGES,
  type StitchConversionResult,
  type TargetWidthResult,
  type TargetLengthResult,
} from '@/lib/calculations/crafts';

const stitchConverterSchema = z.object({
  mode: z.enum(['convert', 'calculate']),
  patternStitches: z.number().min(1),
  patternRows: z.number().min(1),
  patternGaugeStitches: z.number().min(1),
  patternGaugeRows: z.number().min(1),
  yourGaugeStitches: z.number().min(1),
  yourGaugeRows: z.number().min(1),
  targetWidth: z.number().min(0.1),
  targetLength: z.number().min(0.1),
  yarnWeight: z.string(),
});

type StitchConverterInputs = {
  mode: 'convert' | 'calculate';
  patternStitches: number;
  patternRows: number;
  patternGaugeStitches: number;
  patternGaugeRows: number;
  yourGaugeStitches: number;
  yourGaugeRows: number;
  targetWidth: number;
  targetLength: number;
  yarnWeight: string;
};

interface CombinedResult {
  conversion?: StitchConversionResult;
  widthCalc?: TargetWidthResult;
  lengthCalc?: TargetLengthResult;
}

const INITIAL_INPUTS: StitchConverterInputs = {
  mode: 'convert',
  patternStitches: 100,
  patternRows: 140,
  patternGaugeStitches: 20,
  patternGaugeRows: 28,
  yourGaugeStitches: 18,
  yourGaugeRows: 24,
  targetWidth: 20,
  targetLength: 24,
  yarnWeight: 'worsted',
};

const MODE_OPTIONS = [
  { value: 'convert', label: 'Convert Pattern Gauge' },
  { value: 'calculate', label: 'Calculate for Target Size' },
];

const YARN_WEIGHT_OPTIONS = [
  { value: 'lace', label: 'Lace (32 st/4")' },
  { value: 'fingering', label: 'Fingering (28 st/4")' },
  { value: 'sport', label: 'Sport (24 st/4")' },
  { value: 'dk', label: 'DK (22 st/4")' },
  { value: 'worsted', label: 'Worsted (18 st/4")' },
  { value: 'bulky', label: 'Bulky (14 st/4")' },
  { value: 'super-bulky', label: 'Super Bulky (10 st/4")' },
];

export function KnittingStitchConverter() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<StitchConverterInputs, CombinedResult>({
    initialInputs: INITIAL_INPUTS,
    schema: stitchConverterSchema as unknown as z.ZodType<StitchConverterInputs>,
    calculate: (formInputs) => {
      if (formInputs.mode === 'convert') {
        const conversion = convertStitches({
          patternGauge: {
            stitchesPerUnit: formInputs.patternGaugeStitches,
            rowsPerUnit: formInputs.patternGaugeRows,
          },
          yourGauge: {
            stitchesPerUnit: formInputs.yourGaugeStitches,
            rowsPerUnit: formInputs.yourGaugeRows,
          },
          originalStitches: formInputs.patternStitches,
          originalRows: formInputs.patternRows,
        });
        return { conversion };
      } else {
        const gauge = {
          stitchesPerUnit: formInputs.yourGaugeStitches,
          rowsPerUnit: formInputs.yourGaugeRows,
        };
        const widthCalc = calculateStitchesForWidth({
          gauge,
          targetWidth: formInputs.targetWidth,
        });
        const lengthCalc = calculateRowsForLength({
          gauge,
          targetLength: formInputs.targetLength,
        });
        return { widthCalc, lengthCalc };
      }
    },
    storageKey: 'knitting-stitch-converter',
  });

  const handleYarnWeightChange = (weight: string) => {
    setInput('yarnWeight', weight);
    const gauge = YARN_WEIGHT_GAUGES[weight];
    if (gauge) {
      setInput('yourGaugeStitches', gauge.stitchesPerUnit);
      setInput('yourGaugeRows', gauge.rowsPerUnit);
    }
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Knitting Stitch Converter"
      description="Convert pattern stitches to your gauge or calculate stitches for a target width"
      formula="Adjusted Stitches = Original × (Your Gauge / Pattern Gauge)"
      formulaExplanation="Maintains the same finished dimensions when your gauge differs from the pattern"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            {results.conversion && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay
                    label="Adjusted Stitches"
                    value={results.conversion.adjustedStitches}
                    unit="stitches"
                    highlight
                    copyable
                  />
                  {results.conversion.adjustedRows && (
                    <ResultDisplay
                      label="Adjusted Rows"
                      value={results.conversion.adjustedRows}
                      unit="rows"
                      highlight
                      copyable
                    />
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Gauge Comparison</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Stitch Ratio"
                      value={results.conversion.stitchRatio}
                    />
                    <ResultDisplay
                      label="Row Ratio"
                      value={results.conversion.rowRatio}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Width Comparison</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="At Pattern Gauge"
                      value={results.conversion.widthAtPatternGauge}
                      unit="inches"
                    />
                    <ResultDisplay
                      label="At Your Gauge"
                      value={results.conversion.widthAtYourGauge}
                      unit="inches"
                    />
                  </div>
                </div>
              </>
            )}

            {results.widthCalc && results.lengthCalc && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay
                    label="Stitches Needed"
                    value={results.widthCalc.stitchesNeeded}
                    unit="stitches"
                    highlight
                    copyable
                  />
                  <ResultDisplay
                    label="Rows Needed"
                    value={results.lengthCalc.rowsNeeded}
                    unit="rows"
                    highlight
                    copyable
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Your Gauge</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Stitches per Inch"
                      value={results.widthCalc.stitchesPerInch}
                      unit="st/in"
                    />
                    <ResultDisplay
                      label="Rows per Inch"
                      value={results.lengthCalc.rowsPerInch}
                      unit="rows/in"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Actual Dimensions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Actual Width"
                      value={results.widthCalc.actualWidth}
                      unit="inches"
                    />
                    <ResultDisplay
                      label="Actual Length"
                      value={results.lengthCalc.actualLength}
                      unit="inches"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )
      }
    >
      <SelectInput
        id="mode"
        label="Calculator Mode"
        value={inputs.mode}
        onChange={(v) => setInput('mode', v as 'convert' | 'calculate')}
        options={MODE_OPTIONS}
      />

      {inputs.mode === 'convert' && (
        <>
          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Pattern Information</p>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="patternStitches"
                label="Pattern Stitches"
                value={inputs.patternStitches}
                onChange={(v) => setInput('patternStitches', v)}
                min={1}
                max={1000}
                error={errors.patternStitches}
              />
              <NumberInput
                id="patternRows"
                label="Pattern Rows"
                value={inputs.patternRows}
                onChange={(v) => setInput('patternRows', v)}
                min={1}
                max={1000}
                error={errors.patternRows}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Pattern Gauge (per 4 inches)</p>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="patternGaugeStitches"
                label="Stitches"
                value={inputs.patternGaugeStitches}
                onChange={(v) => setInput('patternGaugeStitches', v)}
                min={1}
                max={100}
                error={errors.patternGaugeStitches}
              />
              <NumberInput
                id="patternGaugeRows"
                label="Rows"
                value={inputs.patternGaugeRows}
                onChange={(v) => setInput('patternGaugeRows', v)}
                min={1}
                max={100}
                error={errors.patternGaugeRows}
              />
            </div>
          </div>
        </>
      )}

      <div className="border-t pt-4 mt-2">
        <p className="text-sm font-medium mb-3">Your Gauge (per 4 inches)</p>
        <SelectInput
          id="yarnWeight"
          label="Yarn Weight (preset)"
          value={inputs.yarnWeight}
          onChange={handleYarnWeightChange}
          options={YARN_WEIGHT_OPTIONS}
        />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <NumberInput
            id="yourGaugeStitches"
            label="Your Stitches"
            value={inputs.yourGaugeStitches}
            onChange={(v) => setInput('yourGaugeStitches', v)}
            min={1}
            max={100}
            error={errors.yourGaugeStitches}
          />
          <NumberInput
            id="yourGaugeRows"
            label="Your Rows"
            value={inputs.yourGaugeRows}
            onChange={(v) => setInput('yourGaugeRows', v)}
            min={1}
            max={100}
            error={errors.yourGaugeRows}
          />
        </div>
      </div>

      {inputs.mode === 'calculate' && (
        <div className="border-t pt-4 mt-2">
          <p className="text-sm font-medium mb-3">Target Dimensions</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="targetWidth"
              label="Target Width"
              value={inputs.targetWidth}
              onChange={(v) => setInput('targetWidth', v)}
              min={0.1}
              max={100}
              step={0.5}
              unit="inches"
              error={errors.targetWidth}
            />
            <NumberInput
              id="targetLength"
              label="Target Length"
              value={inputs.targetLength}
              onChange={(v) => setInput('targetLength', v)}
              min={0.1}
              max={200}
              step={0.5}
              unit="inches"
              error={errors.targetLength}
            />
          </div>
        </div>
      )}
    </CalculatorBase>
  );
}

export default KnittingStitchConverter;
