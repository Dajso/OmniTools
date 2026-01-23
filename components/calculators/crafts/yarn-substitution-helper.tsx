'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateYarnSubstitution,
  YARN_WEIGHTS,
  type YarnWeight,
  type YarnSubstitutionResult,
} from '@/lib/calculations/crafts';
import { cn } from '@/lib/utils';

const yarnSubstitutionSchema = z.object({
  originalWeight: z.string(),
  originalYardage: z.number().min(1),
  originalGrams: z.number().min(1),
  skeinsNeeded: z.number().min(1),
  substituteWeight: z.string(),
  substituteYardage: z.number().min(1),
  substituteGrams: z.number().min(1),
});

type YarnSubstitutionInputs = {
  originalWeight: YarnWeight;
  originalYardage: number;
  originalGrams: number;
  skeinsNeeded: number;
  substituteWeight: YarnWeight;
  substituteYardage: number;
  substituteGrams: number;
};

const INITIAL_INPUTS: YarnSubstitutionInputs = {
  originalWeight: 'medium',
  originalYardage: 220,
  originalGrams: 100,
  skeinsNeeded: 5,
  substituteWeight: 'medium',
  substituteYardage: 200,
  substituteGrams: 100,
};

const YARN_WEIGHT_OPTIONS = Object.entries(YARN_WEIGHTS).map(([key, info]) => ({
  value: key,
  label: `${info.cycNumber} - ${info.name} (${info.aliases[0]})`,
}));

export function YarnSubstitutionHelper() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<YarnSubstitutionInputs, YarnSubstitutionResult>({
    initialInputs: INITIAL_INPUTS,
    schema: yarnSubstitutionSchema as unknown as z.ZodType<YarnSubstitutionInputs>,
    calculate: (formInputs) => {
      return calculateYarnSubstitution({
        originalWeight: formInputs.originalWeight,
        originalYardage: formInputs.originalYardage,
        originalGrams: formInputs.originalGrams,
        skeinsNeeded: formInputs.skeinsNeeded,
        substituteWeight: formInputs.substituteWeight,
        substituteYardage: formInputs.substituteYardage,
        substituteGrams: formInputs.substituteGrams,
      });
    },
    storageKey: 'yarn-substitution-helper',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const originalInfo = YARN_WEIGHTS[inputs.originalWeight];
  const substituteInfo = YARN_WEIGHTS[inputs.substituteWeight];

  return (
    <CalculatorBase
      title="Yarn Substitution Helper"
      description="Calculate how much substitute yarn you need when swapping yarns in a pattern"
      formula="Substitute Skeins = Total Yards ÷ Substitute Yardage"
      formulaExplanation="Based on matching total yardage, not weight"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Substitute Skeins Needed"
              value={results.substituteSkeinsNeeded}
              unit="skeins"
              highlight
              copyable
            />

            <ResultDisplay
              label="Total Yards Needed"
              value={results.totalYardsNeeded}
              unit="yards"
            />

            {/* Compatibility indicator */}
            <div className={cn(
              'p-4 rounded-lg',
              results.isCompatible ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
            )}>
              <p className={cn(
                'font-medium',
                results.isCompatible ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
              )}>
                {results.isCompatible ? '✓ Compatible Weights' : '⚠ Weight Difference'}
              </p>
              {results.compatibilityWarning && (
                <p className="text-sm mt-1 text-muted-foreground">
                  {results.compatibilityWarning}
                </p>
              )}
            </div>

            {results.gaugeAdjustment && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Gauge Recommendation</p>
                <p className="text-sm text-muted-foreground">{results.gaugeAdjustment}</p>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Yarn Comparison</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Original (yd/g)"
                  value={results.originalYardsPerGram}
                  unit="yd/g"
                />
                <ResultDisplay
                  label="Substitute (yd/g)"
                  value={results.substituteYardsPerGram}
                  unit="yd/g"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Weight Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Original: {originalInfo.name}</p>
                  <p className="text-muted-foreground">
                    Gauge: {originalInfo.gaugeRange.min}-{originalInfo.gaugeRange.max} st/4&quot;
                  </p>
                  <p className="text-muted-foreground">
                    Needles: US {originalInfo.needleRange.min}-{originalInfo.needleRange.max}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Substitute: {substituteInfo.name}</p>
                  <p className="text-muted-foreground">
                    Gauge: {substituteInfo.gaugeRange.min}-{substituteInfo.gaugeRange.max} st/4&quot;
                  </p>
                  <p className="text-muted-foreground">
                    Needles: US {substituteInfo.needleRange.min}-{substituteInfo.needleRange.max}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="border-b pb-4 mb-4">
        <p className="text-sm font-medium mb-3">Original Yarn (Pattern Calls For)</p>

        <SelectInput
          id="originalWeight"
          label="Yarn Weight"
          value={inputs.originalWeight}
          onChange={(v) => setInput('originalWeight', v as YarnWeight)}
          options={YARN_WEIGHT_OPTIONS}
        />

        <div className="grid grid-cols-3 gap-3 mt-3">
          <NumberInput
            id="originalYardage"
            label="Yards/Skein"
            value={inputs.originalYardage}
            onChange={(v) => setInput('originalYardage', v)}
            min={1}
            max={2000}
            error={errors.originalYardage}
          />
          <NumberInput
            id="originalGrams"
            label="Grams/Skein"
            value={inputs.originalGrams}
            onChange={(v) => setInput('originalGrams', v)}
            min={1}
            max={500}
            error={errors.originalGrams}
          />
          <NumberInput
            id="skeinsNeeded"
            label="Skeins Needed"
            value={inputs.skeinsNeeded}
            onChange={(v) => setInput('skeinsNeeded', v)}
            min={1}
            max={50}
            error={errors.skeinsNeeded}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Substitute Yarn (What You Have)</p>

        <SelectInput
          id="substituteWeight"
          label="Yarn Weight"
          value={inputs.substituteWeight}
          onChange={(v) => setInput('substituteWeight', v as YarnWeight)}
          options={YARN_WEIGHT_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <NumberInput
            id="substituteYardage"
            label="Yards/Skein"
            value={inputs.substituteYardage}
            onChange={(v) => setInput('substituteYardage', v)}
            min={1}
            max={2000}
            error={errors.substituteYardage}
          />
          <NumberInput
            id="substituteGrams"
            label="Grams/Skein"
            value={inputs.substituteGrams}
            onChange={(v) => setInput('substituteGrams', v)}
            min={1}
            max={500}
            error={errors.substituteGrams}
          />
        </div>
      </div>
    </CalculatorBase>
  );
}

export default YarnSubstitutionHelper;
