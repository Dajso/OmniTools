'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateWaterRecipe,
  type WaterRecipeResults,
  type WaterRecipeInputs
} from '@/lib/calculations/coffee/water-recipe';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for water recipe calculator inputs
 * Validates water volume, target hardness, and target alkalinity
 */
const waterRecipeSchema = z.object({
  waterVolume: z.number()
    .min(0.5, 'Vannvolumet må være minst 0,5 liter')
    .max(20, 'Vannvolumet kan ikke være over 20 liter'),
  targetHardness: z.number()
    .min(0, 'Hardheten kan ikke være negativ')
    .max(300, 'Hardheten må være mellom 0 og 300 ppm'),
  targetAlkalinity: z.number()
    .min(0, 'Alkaliniteten kan ikke være negativ')
    .max(150, 'Alkaliniteten må være mellom 0 og 150 ppm'),
});

type WaterRecipeFormInputs = z.infer<typeof waterRecipeSchema>;

/**
 * Initial input values for the calculator
 * Default to SCA-compliant mid-range values
 */
const INITIAL_INPUTS: WaterRecipeFormInputs = {
  waterVolume: 5,
  targetHardness: 100,
  targetAlkalinity: 50,
};

/**
 * SCA Compliance Badge Component
 */
function ComplianceBadge({
  compliant,
  label
}: {
  compliant: boolean;
  label: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${compliant
      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
      }`}>
      {compliant ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
      ) : (
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      )}
      <span className={`text-sm font-medium ${compliant
        ? 'text-green-800 dark:text-green-300'
        : 'text-amber-800 dark:text-amber-300'
        }`}>
        {label}: {compliant ? 'Innenfor SCA-anbefalingen' : 'Utenfor SCA-anbefalingen'}
      </span>
    </div>
  );
}

/**
 * Water Recipe Calculator Component
 * 
 * Calculates mineral additions to create SCA-standard brewing water.
 * Helps users create optimal water chemistry for coffee extraction.
 * 
 * Features:
 * - Water volume, hardness, and alkalinity inputs
 * - Epsom salt and baking soda amount calculations
 * - SCA compliance indicators for hardness and alkalinity
 * - Step-by-step mixing instructions
 * - Unit toggle for metric/imperial
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 5.1, 5.2, 5.3, 5.4, 15.1, 15.2
 */
export function WaterRecipeCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating
  } = useCalculator<WaterRecipeFormInputs, WaterRecipeResults>({
    initialInputs: INITIAL_INPUTS,
    schema: waterRecipeSchema,
    calculate: calculateWaterRecipe,
    storageKey: 'water-recipe-calculator',
  });

  // Auto-calculate on mount and input changes
  React.useEffect(() => {
    if (isValid) {
      calculate();
    }
  }, [inputs, isValid, calculate]);

  // Visningsverdier
  const displayWaterVolume = inputs.waterVolume.toFixed(1);

  const handleWaterVolumeChange = (value: number) => {
    const liters = value;
    setInput('waterVolume', liters);
  };

  return (
    <CalculatorBase
      title="Vannoppskrift for kaffe"
      description="Regn ut hvor mye mineraler du må tilsette for å lage bryggevann etter SCA-standarden"
      formula="Epsomsalt (g) = (hardhet / 100) × volum | Natron (g) = (alkalinitet / 120) × volum"
      formulaExplanation="Vannets kjemi påvirker ekstraksjonen mye. Hardhet (fra magnesium) gir bedre ekstraksjon og fylde, mens alkalinitet (fra bikarbonat) demper syren. SCA-standard: 50–175 ppm hardhet og 40–70 ppm alkalinitet."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Mineral amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Epsomsalt (MgSO₄·7H₂O)"
              value={formatFixed(results.epsomSalt, 2)}
              unit="g"
              highlight
              copyable
            />
            <ResultDisplay
              label="Natron (NaHCO₃)"
              value={formatFixed(results.bakingSoda, 2)}
              unit="g"
              highlight
              copyable
            />
          </div>

          {/* SCA Compliance Indicators */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">SCA-anbefaling</h3>
            <div className="space-y-2">
              <ComplianceBadge
                compliant={results.complianceDetails.hardness.compliant}
                label={`Hardhet (${results.complianceDetails.hardness.value} ppm)`}
              />
              <ComplianceBadge
                compliant={results.complianceDetails.alkalinity.compliant}
                label={`Alkalinitet (${results.complianceDetails.alkalinity.value} ppm)`}
              />
            </div>
            {!results.scaCompliant && (
              <div className="text-xs text-muted-foreground mt-2">
                <p>
                  <strong>Anbefalt område fra SCA:</strong>
                </p>
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>• Hardhet: {results.complianceDetails.hardness.range}</li>
                  <li>• Alkalinitet: {results.complianceDetails.alkalinity.range}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Mixing Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Slik blander du</p>
                <ol className="text-sm text-muted-foreground space-y-2">
                  {results.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-medium shrink-0">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Water chemistry explanation */}
          <div className="text-xs text-muted-foreground space-y-2 pt-2 border-t">
            <p className="font-medium">Om vannets kjemi:</p>
            <div className="space-y-1.5">
              <div>
                <p className="font-medium text-foreground">Hardhet (magnesium):</p>
                <p>Gir bedre ekstraksjon og mer fylde i munnen. For lite gir flat og underekstrahert kaffe. For mye kan gi overekstraksjon og bitterhet.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Alkalinitet (bikarbonat):</p>
                <p>Demper syren og hindrer sur smak. For lite gir for sur kaffe. For mye kan fjerne den ønskede syren og gi kritaktig smak.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    >

      {/* Water Volume Input */}
      <NumberInput
        id="waterVolume"
        label="Vannmengde"
        value={parseFloat(displayWaterVolume)}
        onChange={handleWaterVolumeChange}
        min={0.5}
        max={20}
        step={0.5}
        unit="L"
        error={errors.waterVolume}
        required
        placeholder="5"
      />

      {/* Target Hardness Input */}
      <NumberInput
        id="targetHardness"
        label="Ønsket hardhet"
        value={inputs.targetHardness}
        onChange={(v) => setInput('targetHardness', v)}
        min={0}
        max={300}
        step={5}
        unit="ppm"
        error={errors.targetHardness}
        required
        placeholder="100"
      />

      {/* Target Alkalinity Input */}
      <NumberInput
        id="targetAlkalinity"
        label="Ønsket alkalinitet"
        value={inputs.targetAlkalinity}
        onChange={(v) => setInput('targetAlkalinity', v)}
        min={0}
        max={150}
        step={5}
        unit="ppm"
        error={errors.targetAlkalinity}
        required
        placeholder="50"
      />
    </CalculatorBase>
  );
}

export default WaterRecipeCalculator;
