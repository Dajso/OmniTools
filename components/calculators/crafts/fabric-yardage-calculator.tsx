'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateFabricYardage,
  calculateLiningYardage,
  calculateInterfacingYardage,
  type GarmentType,
  type SizeCategory,
  type FabricWidth,
  type FabricYardageResult,
} from '@/lib/calculations/crafts';

const fabricYardageSchema = z.object({
  garmentType: z.string(),
  size: z.string(),
  fabricWidth: z.number(),
  hasNap: z.boolean(),
  patternRepeat: z.number().min(0),
});

type FabricYardageInputs = {
  garmentType: GarmentType;
  size: SizeCategory;
  fabricWidth: FabricWidth;
  hasNap: boolean;
  patternRepeat: number;
};

interface ExtendedResult extends FabricYardageResult {
  liningYards: number;
  interfacingYards: number;
}

const INITIAL_INPUTS: FabricYardageInputs = {
  garmentType: 'dress-midi',
  size: 'm',
  fabricWidth: 45,
  hasNap: false,
  patternRepeat: 0,
};

const GARMENT_OPTIONS = [
  { value: 'dress-short', label: 'Short Dress' },
  { value: 'dress-midi', label: 'Midi Dress' },
  { value: 'dress-maxi', label: 'Maxi Dress' },
  { value: 'skirt-short', label: 'Short Skirt' },
  { value: 'skirt-midi', label: 'Midi Skirt' },
  { value: 'skirt-maxi', label: 'Maxi Skirt' },
  { value: 'pants', label: 'Pants' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'blouse', label: 'Blouse' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'jacket', label: 'Jacket' },
  { value: 'coat', label: 'Coat' },
];

const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: '3xl', label: '3XL' },
];

const FABRIC_WIDTH_OPTIONS = [
  { value: '36', label: '36" (Quilting Cotton)' },
  { value: '45', label: '45" (Standard)' },
  { value: '54', label: '54" (Home Dec)' },
  { value: '60', label: '60" (Knits/Wide)' },
];

const NAP_OPTIONS = [
  { value: 'false', label: 'No (Solid/Non-directional)' },
  { value: 'true', label: 'Yes (Nap/Directional Print)' },
];

export function FabricYardageCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<FabricYardageInputs, ExtendedResult>({
    initialInputs: INITIAL_INPUTS,
    schema: fabricYardageSchema as unknown as z.ZodType<FabricYardageInputs>,
    calculate: (formInputs) => {
      const result = calculateFabricYardage({
        garmentType: formInputs.garmentType,
        size: formInputs.size,
        fabricWidth: formInputs.fabricWidth,
        hasNap: formInputs.hasNap,
        patternRepeat: formInputs.patternRepeat,
      });
      
      const liningYards = calculateLiningYardage(result.yardsNeeded, formInputs.garmentType);
      const interfacingYards = calculateInterfacingYardage(formInputs.garmentType, formInputs.size);
      
      return {
        ...result,
        liningYards,
        interfacingYards,
      };
    },
    storageKey: 'fabric-yardage-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  return (
    <CalculatorBase
      title="Fabric Yardage Calculator"
      description="Calculate how much fabric you need for your sewing project"
      formula="Yardage = Base × Width Factor × (1 + Nap%) + Pattern Allowance"
      formulaExplanation="Base yardage adjusted for fabric width, directional patterns, and pattern matching"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Main Fabric Needed"
              value={results.yardsNeeded}
              unit="yards"
              highlight
              copyable
            />
            
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="In Meters"
                value={results.metersNeeded}
                unit="m"
              />
              <ResultDisplay
                label="In Inches"
                value={results.inchesNeeded}
                unit="in"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Breakdown</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Yardage</span>
                  <span>{results.baseYardage} yards</span>
                </div>
                {results.napAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nap Allowance (+15%)</span>
                    <span>+{results.napAllowance} yards</span>
                  </div>
                )}
                {results.patternAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pattern Matching</span>
                    <span>+{results.patternAllowance} yards</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Additional Materials</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Lining (if needed)"
                  value={results.liningYards}
                  unit="yards"
                />
                <ResultDisplay
                  label="Interfacing"
                  value={results.interfacingYards}
                  unit="yards"
                />
              </div>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="garmentType"
        label="Garment Type"
        value={inputs.garmentType}
        onChange={(v) => setInput('garmentType', v as GarmentType)}
        options={GARMENT_OPTIONS}
      />

      <SelectInput
        id="size"
        label="Size"
        value={inputs.size}
        onChange={(v) => setInput('size', v as SizeCategory)}
        options={SIZE_OPTIONS}
      />

      <SelectInput
        id="fabricWidth"
        label="Fabric Width"
        value={String(inputs.fabricWidth)}
        onChange={(v) => setInput('fabricWidth', Number(v) as FabricWidth)}
        options={FABRIC_WIDTH_OPTIONS}
      />

      <SelectInput
        id="hasNap"
        label="Directional Fabric?"
        value={String(inputs.hasNap)}
        onChange={(v) => setInput('hasNap', v === 'true')}
        options={NAP_OPTIONS}
      />

      <NumberInput
        id="patternRepeat"
        label="Pattern Repeat"
        value={inputs.patternRepeat}
        onChange={(v) => setInput('patternRepeat', v)}
        min={0}
        max={36}
        step={0.5}
        unit="inches"
        error={errors.patternRepeat}
      />
    </CalculatorBase>
  );
}

export default FabricYardageCalculator;
