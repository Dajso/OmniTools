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
  YARN_WEIGHT_GAUGES_10CM,
  GAUGE_UNIT_CM,
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
  patternGaugeStitches: 22,
  patternGaugeRows: 30,
  yourGaugeStitches: 20,
  yourGaugeRows: 27,
  targetWidth: 50,
  targetLength: 60,
  yarnWeight: 'worsted',
};

const MODE_OPTIONS = [
  { value: 'convert', label: 'Omregn oppskriftens fasthet' },
  { value: 'calculate', label: 'Regn ut for ønsket størrelse' },
];

const YARN_WEIGHT_OPTIONS = [
  { value: 'lace', label: 'Lace (32 masker/10 cm)' },
  { value: 'fingering', label: 'Sokkegarn (28 masker/10 cm)' },
  { value: 'sport', label: 'Sportsgarn (24 masker/10 cm)' },
  { value: 'dk', label: 'Lett garn / DK (22 masker/10 cm)' },
  { value: 'worsted', label: 'Mellomtykt garn / worsted (18 masker/10 cm)' },
  { value: 'bulky', label: 'Tykt garn (14 masker/10 cm)' },
  { value: 'super-bulky', label: 'Ekstra tykt garn (10 masker/10 cm)' },
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
            unitSize: GAUGE_UNIT_CM,
          },
          yourGauge: {
            stitchesPerUnit: formInputs.yourGaugeStitches,
            rowsPerUnit: formInputs.yourGaugeRows,
            unitSize: GAUGE_UNIT_CM,
          },
          originalStitches: formInputs.patternStitches,
          originalRows: formInputs.patternRows,
        });
        return { conversion };
      } else {
        const gauge = {
          stitchesPerUnit: formInputs.yourGaugeStitches,
          rowsPerUnit: formInputs.yourGaugeRows,
          unitSize: GAUGE_UNIT_CM,
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
    const gauge = YARN_WEIGHT_GAUGES_10CM[weight];
    if (gauge) {
      setInput('yourGaugeStitches', gauge.stitches);
      setInput('yourGaugeRows', gauge.rows);
    }
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Strikkeoppskrift til din strikkefasthet"
      description="Regn om maskeantallet i en oppskrift til din egen strikkefasthet, eller regn ut masker til en ønsket bredde"
      formula="Nye masker = opprinnelige masker × (din fasthet ÷ oppskriftens fasthet)"
      formulaExplanation="Gir samme ferdige mål selv om fastheten din er en annen enn oppskriftens"
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
                    label="Nytt antall masker"
                    value={results.conversion.adjustedStitches}
                    unit="masker"
                    highlight
                    copyable
                  />
                  {results.conversion.adjustedRows && (
                    <ResultDisplay
                      label="Nytt antall pinner"
                      value={results.conversion.adjustedRows}
                      unit="pinner"
                      highlight
                      copyable
                    />
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Sammenligning av fasthet</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Forhold, masker"
                      value={results.conversion.stitchRatio}
                    />
                    <ResultDisplay
                      label="Forhold, pinner"
                      value={results.conversion.rowRatio}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Bredde i ferdig arbeid</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Med oppskriftens fasthet"
                      value={results.conversion.widthAtPatternGauge}
                      unit="cm"
                    />
                    <ResultDisplay
                      label="Med din fasthet"
                      value={results.conversion.widthAtYourGauge}
                      unit="cm"
                    />
                  </div>
                </div>
              </>
            )}

            {results.widthCalc && results.lengthCalc && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay
                    label="Masker som trengs"
                    value={results.widthCalc.stitchesNeeded}
                    unit="masker"
                    highlight
                    copyable
                  />
                  <ResultDisplay
                    label="Pinner som trengs"
                    value={results.lengthCalc.rowsNeeded}
                    unit="pinner"
                    highlight
                    copyable
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Din fasthet</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Masker per cm"
                      value={results.widthCalc.stitchesPerInch}
                      unit="masker/cm"
                    />
                    <ResultDisplay
                      label="Pinner per cm"
                      value={results.lengthCalc.rowsPerInch}
                      unit="pinner/cm"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Faktiske mål</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay
                      label="Faktisk bredde"
                      value={results.widthCalc.actualWidth}
                      unit="cm"
                    />
                    <ResultDisplay
                      label="Faktisk lengde"
                      value={results.lengthCalc.actualLength}
                      unit="cm"
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
        label="Hva vil du gjøre?"
        value={inputs.mode}
        onChange={(v) => setInput('mode', v as 'convert' | 'calculate')}
        options={MODE_OPTIONS}
      />

      {inputs.mode === 'convert' && (
        <>
          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Oppskriften</p>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="patternStitches"
                label="Masker i oppskriften"
                value={inputs.patternStitches}
                onChange={(v) => setInput('patternStitches', v)}
                min={1}
                max={1000}
                error={errors.patternStitches}
              />
              <NumberInput
                id="patternRows"
                label="Pinner i oppskriften"
                value={inputs.patternRows}
                onChange={(v) => setInput('patternRows', v)}
                min={1}
                max={1000}
                error={errors.patternRows}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Oppskriftens fasthet (per 10 cm)</p>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                id="patternGaugeStitches"
                label="Masker"
                value={inputs.patternGaugeStitches}
                onChange={(v) => setInput('patternGaugeStitches', v)}
                min={1}
                max={100}
                error={errors.patternGaugeStitches}
              />
              <NumberInput
                id="patternGaugeRows"
                label="Pinner"
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
        <p className="text-sm font-medium mb-3">Din fasthet (per 10 cm)</p>
        <SelectInput
          id="yarnWeight"
          label="Garntykkelse (forslag)"
          value={inputs.yarnWeight}
          onChange={handleYarnWeightChange}
          options={YARN_WEIGHT_OPTIONS}
        />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <NumberInput
            id="yourGaugeStitches"
            label="Dine masker"
            value={inputs.yourGaugeStitches}
            onChange={(v) => setInput('yourGaugeStitches', v)}
            min={1}
            max={100}
            error={errors.yourGaugeStitches}
          />
          <NumberInput
            id="yourGaugeRows"
            label="Dine pinner"
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
          <p className="text-sm font-medium mb-3">Ønsket størrelse</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="targetWidth"
              label="Ønsket bredde"
              value={inputs.targetWidth}
              onChange={(v) => setInput('targetWidth', v)}
              min={1}
              max={250}
              step={1}
              unit="cm"
              error={errors.targetWidth}
            />
            <NumberInput
              id="targetLength"
              label="Ønsket lengde"
              value={inputs.targetLength}
              onChange={(v) => setInput('targetLength', v)}
              min={1}
              max={300}
              step={1}
              unit="cm"
              error={errors.targetLength}
            />
          </div>
        </div>
      )}
    </CalculatorBase>
  );
}

export default KnittingStitchConverter;
