'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateQuiltBinding,
  calculateBiasBindingFabric,
  STANDARD_QUILT_SIZES,
  type BindingType,
  type QuiltBindingResult,
} from '@/lib/calculations/crafts';

const quiltBindingSchema = z.object({
  quiltWidth: z.number().min(1).max(200),
  quiltHeight: z.number().min(1).max(200),
  bindingType: z.string(),
  bindingStripWidth: z.number().min(1).max(5),
  fabricWidth: z.number().min(20).max(60),
  extraAllowance: z.number().min(0).max(24),
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

interface ExtendedResult extends QuiltBindingResult {
  biasSquareSize: number;
}

const INITIAL_INPUTS: QuiltBindingInputs = {
  quiltWidth: 60,
  quiltHeight: 80,
  bindingType: 'double-fold',
  bindingStripWidth: 2.5,
  fabricWidth: 42,
  extraAllowance: 12,
  presetSize: 'custom',
};

const BINDING_TYPE_OPTIONS = [
  { value: 'double-fold', label: 'Double-Fold (French)' },
  { value: 'single-fold', label: 'Single-Fold' },
];

const PRESET_SIZE_OPTIONS = [
  { value: 'custom', label: 'Custom Size' },
  { value: 'crib', label: 'Crib (36" × 52")' },
  { value: 'throw', label: 'Throw (50" × 65")' },
  { value: 'twin', label: 'Twin (68" × 88")' },
  { value: 'full', label: 'Full (81" × 96")' },
  { value: 'queen', label: 'Queen (90" × 108")' },
  { value: 'king', label: 'King (108" × 108")' },
  { value: 'california-king', label: 'California King (104" × 114")' },
];

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
  } = useCalculator<QuiltBindingInputs, ExtendedResult>({
    initialInputs: INITIAL_INPUTS,
    schema: quiltBindingSchema as unknown as z.ZodType<QuiltBindingInputs>,
    calculate: (formInputs) => {
      const result = calculateQuiltBinding({
        quiltWidth: formInputs.quiltWidth,
        quiltHeight: formInputs.quiltHeight,
        bindingType: formInputs.bindingType,
        bindingStripWidth: formInputs.bindingStripWidth,
        fabricWidth: formInputs.fabricWidth,
        extraAllowance: formInputs.extraAllowance,
      });

      const biasSquareSize = calculateBiasBindingFabric(
        result.totalBindingLength,
        formInputs.bindingStripWidth
      );

      return {
        ...result,
        biasSquareSize,
      };
    },
    storageKey: 'quilt-binding-calculator',
  });

  const handlePresetChange = (preset: string) => {
    setInput('presetSize', preset);
    if (preset !== 'custom') {
      const size = STANDARD_QUILT_SIZES[preset as keyof typeof STANDARD_QUILT_SIZES];
      if (size) {
        setInput('quiltWidth', size.width);
        setInput('quiltHeight', size.height);
      }
    }
  };

  const handleBindingTypeChange = (type: BindingType) => {
    setInput('bindingType', type);
    // Set default strip width based on binding type
    if (type === 'double-fold') {
      setInput('bindingStripWidth', 2.5);
    } else {
      setInput('bindingStripWidth', 2.0);
    }
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Quilt Binding Calculator"
      description="Calculate binding strip length and fabric requirements for your quilt"
      formula="Binding Length = 2 × (Width + Height) + Extra"
      formulaExplanation="Perimeter plus extra for joining strips and mitering corners"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Fabric Needed"
              value={results.fabricYardsNeeded}
              unit="yards"
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total Binding Length"
                value={results.totalBindingLength}
                unit="inches"
              />
              <ResultDisplay
                label="Number of Strips"
                value={results.numberOfStrips}
                unit="strips"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Cutting Instructions</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <p>Cut <strong>{results.numberOfStrips}</strong> strips at <strong>{results.bindingStripWidth}&quot;</strong> wide</p>
                <p>Each strip: <strong>{results.stripLength}&quot;</strong> long (fabric width)</p>
                <p>Total fabric height needed: <strong>{results.fabricInchesNeeded}&quot;</strong></p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Binding Details</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Quilt Perimeter"
                  value={results.quiltPerimeter}
                  unit="inches"
                />
                <ResultDisplay
                  label="Finished Width"
                  value={results.finishedBindingWidth}
                  unit="inches"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">For Bias Binding</p>
              <ResultDisplay
                label="Square Size Needed"
                value={results.biasSquareSize}
                unit="inches"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Cut a square this size and cut on the bias for continuous bias binding
              </p>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="presetSize"
        label="Quilt Size Preset"
        value={inputs.presetSize}
        onChange={handlePresetChange}
        options={PRESET_SIZE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="quiltWidth"
          label="Quilt Width"
          value={inputs.quiltWidth}
          onChange={(v) => {
            setInput('quiltWidth', v);
            setInput('presetSize', 'custom');
          }}
          min={1}
          max={200}
          step={1}
          unit="inches"
          error={errors.quiltWidth}
          required
        />

        <NumberInput
          id="quiltHeight"
          label="Quilt Height"
          value={inputs.quiltHeight}
          onChange={(v) => {
            setInput('quiltHeight', v);
            setInput('presetSize', 'custom');
          }}
          min={1}
          max={200}
          step={1}
          unit="inches"
          error={errors.quiltHeight}
          required
        />
      </div>

      <SelectInput
        id="bindingType"
        label="Binding Type"
        value={inputs.bindingType}
        onChange={(v) => handleBindingTypeChange(v as BindingType)}
        options={BINDING_TYPE_OPTIONS}
      />

      <NumberInput
        id="bindingStripWidth"
        label="Binding Strip Width (cut)"
        value={inputs.bindingStripWidth}
        onChange={(v) => setInput('bindingStripWidth', v)}
        min={1}
        max={5}
        step={0.25}
        unit="inches"
        error={errors.bindingStripWidth}
      />

      <NumberInput
        id="fabricWidth"
        label="Usable Fabric Width"
        value={inputs.fabricWidth}
        onChange={(v) => setInput('fabricWidth', v)}
        min={20}
        max={60}
        step={1}
        unit="inches"
        error={errors.fabricWidth}
      />

      <NumberInput
        id="extraAllowance"
        label="Extra for Joining/Corners"
        value={inputs.extraAllowance}
        onChange={(v) => setInput('extraAllowance', v)}
        min={0}
        max={24}
        step={1}
        unit="inches"
        error={errors.extraAllowance}
      />
    </CalculatorBase>
  );
}

export default QuiltBindingCalculator;
