'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateQuiltBindingMetric,
  QUILT_SIZES_CM,
  BINDING_STRIP_DEFAULT_CM,
  DEFAULT_USABLE_FABRIC_WIDTH_CM,
  DEFAULT_BINDING_EXTRA_CM,
  type BindingType,
  type QuiltBindingMetricResult,
} from '@/lib/calculations/crafts';
import { formatNumber } from '@/lib/utils/formatting';

const quiltBindingSchema = z.object({
  quiltWidth: z.number().min(10).max(400),
  quiltHeight: z.number().min(10).max(400),
  bindingType: z.string(),
  bindingStripWidth: z.number().min(2).max(12),
  fabricWidth: z.number().min(50).max(160),
  extraAllowance: z.number().min(0).max(60),
  presetSize: z.string(),
});

type QuiltBindingInputs = {
  quiltWidth: number;
  quiltHeight: number;
  bindingType: BindingType;
  bindingStripWidth: number;
  fabricWidth: number;
  extraAllowance: number;
  presetSize: string;
};

const INITIAL_INPUTS: QuiltBindingInputs = {
  quiltWidth: 130,
  quiltHeight: 170,
  bindingType: 'double-fold',
  bindingStripWidth: BINDING_STRIP_DEFAULT_CM['double-fold'],
  fabricWidth: DEFAULT_USABLE_FABRIC_WIDTH_CM,
  extraAllowance: DEFAULT_BINDING_EXTRA_CM,
  presetSize: 'throw',
};

const BINDING_TYPE_OPTIONS = [
  { value: 'double-fold', label: 'Dobbelt kantbånd (vanligst)' },
  { value: 'single-fold', label: 'Enkelt kantbånd' },
];

const PRESET_SIZE_OPTIONS = [
  { value: 'custom', label: 'Egne mål' },
  ...Object.entries(QUILT_SIZES_CM).map(([key, v]) => ({
    value: key,
    label: `${v.label} (${v.width} × ${v.height} cm)`,
  })),
];

function fmt1(value: number): string {
  return formatNumber(value, { maximumFractionDigits: 1 });
}

export function QuiltBindingCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<QuiltBindingInputs, QuiltBindingMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: quiltBindingSchema as unknown as z.ZodType<QuiltBindingInputs>,
    calculate: (formInputs) => {
      return calculateQuiltBindingMetric({
        quiltWidthCm: formInputs.quiltWidth,
        quiltHeightCm: formInputs.quiltHeight,
        bindingType: formInputs.bindingType,
        stripWidthCm: formInputs.bindingStripWidth,
        fabricWidthCm: formInputs.fabricWidth,
        extraCm: formInputs.extraAllowance,
      });
    },
    storageKey: 'quilt-binding-calculator',
  });

  const handlePresetChange = (preset: string) => {
    setInput('presetSize', preset);
    if (preset !== 'custom') {
      const size = QUILT_SIZES_CM[preset];
      if (size) {
        setInput('quiltWidth', size.width);
        setInput('quiltHeight', size.height);
      }
    }
  };

  const handleBindingTypeChange = (type: BindingType) => {
    setInput('bindingType', type);
    // Standard stripebredde etter type kantbånd
    setInput('bindingStripWidth', BINDING_STRIP_DEFAULT_CM[type]);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Kantbånd til quilt"
      description="Regn ut lengde på kantbånd og stoffbehov til pleddet eller quilten din"
      formula="Lengde på kantbånd = 2 × (bredde + lengde) + tillegg"
      formulaExplanation="Omkretsen pluss litt ekstra til skjøting av strimler og hjørner"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Stoff som trengs"
              value={formatNumber(results.fabricMetersNeeded, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              unit="m"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total lengde kantbånd"
                value={results.totalBindingLengthCm}
                unit="cm"
              />
              <ResultDisplay
                label="Antall strimler"
                value={results.numberOfStrips}
                unit="stk."
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Slik klipper du</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <p>Klipp <strong>{results.numberOfStrips}</strong> strimler som er <strong>{fmt1(results.stripWidthCm)}&nbsp;cm</strong> brede</p>
                <p>Hver strimmel er <strong>{fmt1(results.stripLengthCm)}&nbsp;cm</strong> lang (stoffets bredde)</p>
                <p>Samlet stofflengde: <strong>{fmt1(results.fabricCmNeeded)}&nbsp;cm</strong></p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Om kantbåndet</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Omkrets på pleddet"
                  value={results.perimeterCm}
                  unit="cm"
                />
                <ResultDisplay
                  label="Ferdig bredde (omtrent)"
                  value={results.finishedBindingWidthCm}
                  unit="cm"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Til skråbånd</p>
              <ResultDisplay
                label="Nødvendig kvadrat"
                value={results.biasSquareCm}
                unit="cm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Klipp et kvadrat med denne siden og lag sammenhengende skråbånd av det
              </p>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="presetSize"
        label="Ferdig størrelse"
        value={inputs.presetSize}
        onChange={handlePresetChange}
        options={PRESET_SIZE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="quiltWidth"
          label="Bredde"
          value={inputs.quiltWidth}
          onChange={(v) => {
            setInput('quiltWidth', v);
            setInput('presetSize', 'custom');
          }}
          min={10}
          max={400}
          step={1}
          unit="cm"
          error={errors.quiltWidth}
          required
        />

        <NumberInput
          id="quiltHeight"
          label="Lengde"
          value={inputs.quiltHeight}
          onChange={(v) => {
            setInput('quiltHeight', v);
            setInput('presetSize', 'custom');
          }}
          min={10}
          max={400}
          step={1}
          unit="cm"
          error={errors.quiltHeight}
          required
        />
      </div>

      <SelectInput
        id="bindingType"
        label="Type kantbånd"
        value={inputs.bindingType}
        onChange={(v) => handleBindingTypeChange(v as BindingType)}
        options={BINDING_TYPE_OPTIONS}
      />

      <NumberInput
        id="bindingStripWidth"
        label="Bredde på strimlene (som klippes)"
        value={inputs.bindingStripWidth}
        onChange={(v) => setInput('bindingStripWidth', v)}
        min={2}
        max={12}
        step={0.5}
        unit="cm"
        error={errors.bindingStripWidth}
      />

      <NumberInput
        id="fabricWidth"
        label="Brukbar stoffbredde"
        value={inputs.fabricWidth}
        onChange={(v) => setInput('fabricWidth', v)}
        min={50}
        max={160}
        step={1}
        unit="cm"
        error={errors.fabricWidth}
      />

      <NumberInput
        id="extraAllowance"
        label="Ekstra til skjøter og hjørner"
        value={inputs.extraAllowance}
        onChange={(v) => setInput('extraAllowance', v)}
        min={0}
        max={60}
        step={5}
        unit="cm"
        error={errors.extraAllowance}
      />
    </CalculatorBase>
  );
}

export default QuiltBindingCalculator;
