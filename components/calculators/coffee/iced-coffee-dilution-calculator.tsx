'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateIcedCoffeeDilution,
  type IcedCoffeeDilutionResults,
  type IcedCoffeeDilutionInputs
} from '@/lib/calculations/coffee/iced-coffee-dilution';
import { Info, AlertTriangle } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for iced coffee dilution calculator inputs
 * Validates target volume, target TDS, and ice percentage
 */
const icedCoffeeDilutionSchema = z.object({
  targetVolume: z.number()
    .min(100, 'Volumet må være minst 100 ml')
    .max(2000, 'Volumet kan ikke være over 2000 ml'),
  targetTDS: z.number()
    .min(0.5, 'TDS må være minst 0,5 %')
    .max(3, 'TDS kan ikke være over 3 %'),
  icePercentage: z.number()
    .min(10, 'Andelen is må være minst 10 %')
    .max(70, 'Andelen is kan ikke være over 70 %'),
});

type IcedCoffeeDilutionFormInputs = z.infer<typeof icedCoffeeDilutionSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: IcedCoffeeDilutionFormInputs = {
  targetVolume: 400,
  targetTDS: 1.2,
  icePercentage: 40,
};

/**
 * Iced Coffee Dilution Calculator Component
 * 
 * Calculates ice and hot coffee amounts for target concentration.
 * Accounts for ice dilution to maintain desired strength after melting.
 * 
 * Features:
 * - Target volume, TDS, and ice percentage inputs
 * - Hot coffee amount calculation
 * - Ice amount calculation
 * - Brewing TDS calculation (compensated for dilution)
 * - Warning for excessive dilution (>50% ice)
 * - Unit toggle for metric/imperial
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 3.1, 3.2, 3.3, 12.1, 15.1, 15.2
 */
export function IcedCoffeeDilutionCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating
  } = useCalculator<IcedCoffeeDilutionFormInputs, IcedCoffeeDilutionResults>({
    initialInputs: INITIAL_INPUTS,
    schema: icedCoffeeDilutionSchema,
    calculate: calculateIcedCoffeeDilution,
    storageKey: 'iced-coffee-dilution-calculator',
  });

  // Auto-calculate on mount and input changes
  React.useEffect(() => {
    if (isValid) {
      calculate();
    }
  }, [inputs, isValid, calculate]);

  // Visningsverdier
  const displayTargetVolume = inputs.targetVolume.toFixed(0);

  const displayHotCoffeeAmount = results ? formatFixed(results.hotCoffeeAmount, 1) : undefined;

  const displayIceAmount = results ? formatFixed(results.iceAmount, 1) : undefined;

  const handleTargetVolumeChange = (value: number) => {
    const ml = value;
    setInput('targetVolume', ml);
  };

  return (
    <CalculatorBase
      title="Iskaffe og fortynning"
      description="Regn ut hvor mye varm kaffe og is du trenger for å holde riktig styrke etter fortynning"
      formula="TDS i bryggen = (ønsket TDS × ønsket volum) / mengde varm kaffe"
      formulaExplanation="Når isen smelter, blir kaffen tynnere. Kalkulatoren finner ut hvor sterk den varme kaffen må brygges for at den får riktig styrke når isen er smeltet."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Hot Coffee Amount */}
          <ResultDisplay
            label="Varm kaffe å brygge"
            value={displayHotCoffeeAmount || '0'}
            unit="ml"
            highlight
            copyable
          />

          {/* Brewing TDS */}
          <ResultDisplay
            label="TDS i bryggen"
            value={formatFixed(results.brewingTDS, 2)}
            unit="%"
            highlight
            copyable
          />

          {/* Ice Amount */}
          <ResultDisplay
            label="Is som trengs"
            value={displayIceAmount || '0'}
            unit="g"
            copyable
          />

          {/* Warning for excessive dilution */}
          {results.warning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                    Advarsel: for mye fortynning
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500">
                    {results.warning}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Brewing instructions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-2">Slik gjør du det</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Brygg {displayHotCoffeeAmount} ml varm kaffe med {formatFixed(results.brewingTDS, 2)}% TDS</li>
                  <li>2. Legg {displayIceAmount} g is i glasset eller kannen</li>
                  <li>3. Hell den varme kaffen rett over isen</li>
                  <li>4. Rør forsiktig mens isen smelter, så kaffen blir jevnt fortynnet</li>
                  <li>5. Nyt iskaffen din med {formatFixed(inputs.targetTDS, 2)}% TDS</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Ice percentage reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">Anbefalt andel is:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• 30–40 %: vanlig iskaffe (balansert fortynning)</li>
              <li>• 40–50 %: kald og forfriskende (moderat fortynning)</li>
              <li>• Over 50 %: veldig kald, men kan smake vannaktig (kraftig fortynning)</li>
            </ul>
          </div>
        </div>
      )}
    >

      {/* Target Volume Input */}
      <NumberInput
        id="targetVolume"
        label="Ønsket sluttvolum"
        value={parseFloat(displayTargetVolume)}
        onChange={handleTargetVolumeChange}
        min={100}
        max={2000}
        step={10}
        unit="ml"
        error={errors.targetVolume}
        required
        placeholder="400"
      />

      {/* Target TDS Input */}
      <NumberInput
        id="targetTDS"
        label="Ønsket TDS (styrke)"
        value={inputs.targetTDS}
        onChange={(v) => setInput('targetTDS', v)}
        min={0.5}
        max={3}
        step={0.1}
        unit="%"
        error={errors.targetTDS}
        required
        placeholder="1.2"
      />

      {/* Ice Percentage Input */}
      <NumberInput
        id="icePercentage"
        label="Andel is"
        value={inputs.icePercentage}
        onChange={(v) => setInput('icePercentage', v)}
        min={10}
        max={70}
        step={5}
        unit="%"
        error={errors.icePercentage}
        required
        placeholder="40"
      />
    </CalculatorBase>
  );
}

export default IcedCoffeeDilutionCalculator;
