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
  yarnWeightDetailsNo,
  YARN_WEIGHT_NAMES_NO,
  YARN_WEIGHTS,
  type YarnWeight,
  type YarnSubstitutionResult,
} from '@/lib/calculations/crafts';
import { formatNumber } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

// Merk: lengden regnes i meter. Beregningen er den samme uansett enhet.
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
  /** Meter per nøste */
  originalYardage: number;
  originalGrams: number;
  skeinsNeeded: number;
  substituteWeight: YarnWeight;
  /** Meter per nøste */
  substituteYardage: number;
  substituteGrams: number;
};

const INITIAL_INPUTS: YarnSubstitutionInputs = {
  originalWeight: 'medium',
  originalYardage: 100,
  originalGrams: 50,
  skeinsNeeded: 8,
  substituteWeight: 'medium',
  substituteYardage: 90,
  substituteGrams: 50,
};

const YARN_WEIGHT_OPTIONS = (Object.keys(YARN_WEIGHTS) as YarnWeight[]).map((key) => ({
  value: key,
  label: `${YARN_WEIGHTS[key].cycNumber} – ${YARN_WEIGHT_NAMES_NO[key].name} (${YARN_WEIGHT_NAMES_NO[key].alias})`,
}));

/** Norske tekster for råd om kompatibilitet og fasthet. */
function compatibilityTextNo(
  original: YarnWeight,
  substitute: YarnWeight
): { warning?: string; gauge: string } {
  const a = YARN_WEIGHTS[original].cycNumber;
  const b = YARN_WEIGHTS[substitute].cycNumber;
  const diff = Math.abs(a - b);
  if (diff === 0) {
    return { gauge: 'Strikk en prøvelapp for å treffe oppskriftens fasthet. Det kan hende du må justere pinnestørrelsen litt.' };
  }
  if (diff === 1) {
    return {
      warning: 'Garntykkelsene er nesten like, men ikke helt. Strikk alltid en prøvelapp.',
      gauge: b > a
        ? 'Prøv en til to pinnestørrelser tynnere for å treffe fastheten.'
        : 'Prøv en til to pinnestørrelser tykkere for å treffe fastheten.',
    };
  }
  return {
    warning: `Stor forskjell i garntykkelse (${diff} trinn). Resultatet kan bli ganske annerledes.`,
    gauge: 'Du må justere pinnestørrelsen mye. Vurder et garn som ligger nærmere i tykkelse.',
  };
}

function range(min: number, max: number, unit: string): string {
  const f = (v: number) => formatNumber(v, { maximumFractionDigits: 2 });
  return `${f(min)}–${f(max)}${' '}${unit}`;
}

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

  const originalInfo = yarnWeightDetailsNo(inputs.originalWeight);
  const substituteInfo = yarnWeightDetailsNo(inputs.substituteWeight);
  const advice = compatibilityTextNo(inputs.originalWeight, inputs.substituteWeight);

  return (
    <CalculatorBase
      title="Garnbytte"
      description="Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift"
      formula="Nye nøster = total lengde ÷ meter per nøste"
      formulaExplanation="Regnet ut fra total lengde (meter) og ikke fra vekt"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Nøster du trenger av det nye garnet"
              value={results.substituteSkeinsNeeded}
              unit="nøster"
              highlight
              copyable
            />

            <ResultDisplay
              label="Total lengde som trengs"
              value={results.totalYardsNeeded}
              unit="m"
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
                {results.isCompatible ? '✓ Garntykkelsene passer sammen' : '⚠ Ulik garntykkelse'}
              </p>
              {advice.warning && (
                <p className="text-sm mt-1 text-muted-foreground">
                  {advice.warning}
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Råd om strikkefasthet</p>
              <p className="text-sm text-muted-foreground">{advice.gauge}</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Sammenligning av garnene</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Opprinnelig (m per 50 g)"
                  value={Math.round((inputs.originalYardage / inputs.originalGrams) * 50)}
                  unit="m/50 g"
                />
                <ResultDisplay
                  label="Nytt garn (m per 50 g)"
                  value={Math.round((inputs.substituteYardage / inputs.substituteGrams) * 50)}
                  unit="m/50 g"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Om garntykkelsene</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Opprinnelig: {originalInfo.name}</p>
                  <p className="text-muted-foreground">
                    Fasthet: {range(originalInfo.gaugeMin, originalInfo.gaugeMax, 'masker/10 cm')}
                  </p>
                  <p className="text-muted-foreground">
                    Pinner: {range(originalInfo.needleMinMm, originalInfo.needleMaxMm, 'mm')}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Nytt garn: {substituteInfo.name}</p>
                  <p className="text-muted-foreground">
                    Fasthet: {range(substituteInfo.gaugeMin, substituteInfo.gaugeMax, 'masker/10 cm')}
                  </p>
                  <p className="text-muted-foreground">
                    Pinner: {range(substituteInfo.needleMinMm, substituteInfo.needleMaxMm, 'mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="border-b pb-4 mb-4">
        <p className="text-sm font-medium mb-3">Garnet i oppskriften</p>

        <SelectInput
          id="originalWeight"
          label="Garntykkelse"
          value={inputs.originalWeight}
          onChange={(v) => setInput('originalWeight', v as YarnWeight)}
          options={YARN_WEIGHT_OPTIONS}
        />

        <div className="grid grid-cols-3 gap-3 mt-3">
          <NumberInput
            id="originalYardage"
            label="Meter per nøste"
            value={inputs.originalYardage}
            onChange={(v) => setInput('originalYardage', v)}
            min={1}
            max={2000}
            error={errors.originalYardage}
          />
          <NumberInput
            id="originalGrams"
            label="Gram per nøste"
            value={inputs.originalGrams}
            onChange={(v) => setInput('originalGrams', v)}
            min={1}
            max={500}
            error={errors.originalGrams}
          />
          <NumberInput
            id="skeinsNeeded"
            label="Antall nøster"
            value={inputs.skeinsNeeded}
            onChange={(v) => setInput('skeinsNeeded', v)}
            min={1}
            max={50}
            error={errors.skeinsNeeded}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Garnet du vil bruke i stedet</p>

        <SelectInput
          id="substituteWeight"
          label="Garntykkelse"
          value={inputs.substituteWeight}
          onChange={(v) => setInput('substituteWeight', v as YarnWeight)}
          options={YARN_WEIGHT_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <NumberInput
            id="substituteYardage"
            label="Meter per nøste"
            value={inputs.substituteYardage}
            onChange={(v) => setInput('substituteYardage', v)}
            min={1}
            max={2000}
            error={errors.substituteYardage}
          />
          <NumberInput
            id="substituteGrams"
            label="Gram per nøste"
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
