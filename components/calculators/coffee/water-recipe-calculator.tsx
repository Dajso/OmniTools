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
import { Button } from '@/components/ui/button';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Zod schema for water recipe calculator inputs
 * Validates water volume, target hardness, and target alkalinity
 */
const waterRecipeSchema = z.object({
  waterVolume: z.number()
    .min(0.5, 'Water volume must be at least 0.5L')
    .max(20, 'Water volume cannot exceed 20L'),
  targetHardness: z.number()
    .min(0, 'Target hardness cannot be negative')
    .max(300, 'Target hardness must be between 0 and 300 ppm'),
  targetAlkalinity: z.number()
    .min(0, 'Target alkalinity cannot be negative')
    .max(150, 'Target alkalinity must be between 0 and 150 ppm'),
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
 * Unit conversion constants
 */
const LITERS_TO_GALLONS = 0.264172;

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
        {label}: {compliant ? 'SCA Compliant' : 'Outside SCA Range'}
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
  const [useImperial, setUseImperial] = React.useState(false);

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
  }, [inputs, isValid]);

  // Convert values for display based on unit system
  const displayWaterVolume = useImperial
    ? (inputs.waterVolume * LITERS_TO_GALLONS).toFixed(2)
    : inputs.waterVolume.toFixed(1);

  // Handle input changes with unit conversion
  const handleWaterVolumeChange = (value: number) => {
    const liters = useImperial ? value / LITERS_TO_GALLONS : value;
    setInput('waterVolume', liters);
  };

  return (
    <CalculatorBase
      title="Water Recipe Calculator"
      description="Calculate mineral additions to create SCA-standard brewing water for optimal coffee extraction"
      formula="Epsom Salt (g) = (Hardness / 100) × Volume | Baking Soda (g) = (Alkalinity / 120) × Volume"
      formulaExplanation="Water chemistry significantly affects coffee extraction. Hardness (from magnesium) enhances extraction and body, while alkalinity (from bicarbonate) buffers acidity. SCA standards: 50-175 ppm hardness, 40-70 ppm alkalinity."
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
              label="Epsom Salt (MgSO₄·7H₂O)"
              value={results.epsomSalt.toFixed(2)}
              unit="g"
              highlight
              copyable
            />
            <ResultDisplay
              label="Baking Soda (NaHCO₃)"
              value={results.bakingSoda.toFixed(2)}
              unit="g"
              highlight
              copyable
            />
          </div>

          {/* SCA Compliance Indicators */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">SCA Compliance</h3>
            <div className="space-y-2">
              <ComplianceBadge
                compliant={results.complianceDetails.hardness.compliant}
                label={`Hardness (${results.complianceDetails.hardness.value} ppm)`}
              />
              <ComplianceBadge
                compliant={results.complianceDetails.alkalinity.compliant}
                label={`Alkalinity (${results.complianceDetails.alkalinity.value} ppm)`}
              />
            </div>
            {!results.scaCompliant && (
              <div className="text-xs text-muted-foreground mt-2">
                <p>
                  <strong>SCA Recommended Ranges:</strong>
                </p>
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>• Hardness: {results.complianceDetails.hardness.range}</li>
                  <li>• Alkalinity: {results.complianceDetails.alkalinity.range}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Mixing Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Mixing Instructions</p>
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
            <p className="font-medium">Understanding Water Chemistry:</p>
            <div className="space-y-1.5">
              <div>
                <p className="font-medium text-foreground">Hardness (Magnesium):</p>
                <p>Enhances extraction and contributes to body and mouthfeel. Too little results in flat, under-extracted coffee. Too much can cause over-extraction and bitterness.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Alkalinity (Bicarbonate):</p>
                <p>Buffers acidity and prevents sour flavors. Too little results in overly acidic coffee. Too much can neutralize desirable acidity and cause chalky flavors.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {/* Unit toggle */}
      <div className="flex items-center justify-end gap-2 pb-2">
        <span className="text-sm text-muted-foreground">Units:</span>
        <Button
          type="button"
          variant={useImperial ? 'outline' : 'default'}
          size="sm"
          onClick={() => setUseImperial(false)}
          aria-pressed={!useImperial}
          aria-label="Use metric units"
        >
          Metric
        </Button>
        <Button
          type="button"
          variant={useImperial ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUseImperial(true)}
          aria-pressed={useImperial}
          aria-label="Use imperial units"
        >
          Imperial
        </Button>
      </div>

      {/* Water Volume Input */}
      <NumberInput
        id="waterVolume"
        label="Water Volume"
        value={parseFloat(displayWaterVolume)}
        onChange={handleWaterVolumeChange}
        min={useImperial ? 0.13 : 0.5}
        max={useImperial ? 5.28 : 20}
        step={useImperial ? 0.1 : 0.5}
        unit={useImperial ? 'gal' : 'L'}
        error={errors.waterVolume}
        required
        placeholder={useImperial ? '1.32' : '5'}
      />

      {/* Target Hardness Input */}
      <NumberInput
        id="targetHardness"
        label="Target Hardness"
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
        label="Target Alkalinity"
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
