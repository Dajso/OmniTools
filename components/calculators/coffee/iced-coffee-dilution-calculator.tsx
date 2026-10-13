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
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for iced coffee dilution calculator inputs
 * Validates target volume, target TDS, and ice percentage
 */
const icedCoffeeDilutionSchema = z.object({
  targetVolume: z.number()
    .min(100, 'Target volume must be at least 100ml')
    .max(2000, 'Target volume cannot exceed 2000ml'),
  targetTDS: z.number()
    .min(0.5, 'Target TDS must be at least 0.5%')
    .max(3, 'Target TDS cannot exceed 3%'),
  icePercentage: z.number()
    .min(10, 'Ice percentage must be at least 10%')
    .max(70, 'Ice percentage cannot exceed 70%'),
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
 * Unit conversion constants
 */
const ML_TO_FL_OZ = 0.033814;
const GRAMS_TO_OZ = 0.035274;

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

  // Convert values for display based on unit system
  const displayTargetVolume = useImperial
    ? (inputs.targetVolume * ML_TO_FL_OZ).toFixed(2)
    : inputs.targetVolume.toFixed(0);

  const displayHotCoffeeAmount = results && useImperial
    ? (results.hotCoffeeAmount * ML_TO_FL_OZ).toFixed(2)
    : results?.hotCoffeeAmount.toFixed(1);

  const displayIceAmount = results && useImperial
    ? (results.iceAmount * GRAMS_TO_OZ).toFixed(2)
    : results?.iceAmount.toFixed(1);

  // Handle input changes with unit conversion
  const handleTargetVolumeChange = (value: number) => {
    const ml = useImperial ? value / ML_TO_FL_OZ : value;
    setInput('targetVolume', ml);
  };

  return (
    <CalculatorBase
      title="Iced Coffee Dilution Calculator"
      description="Calculate the correct amounts of hot coffee and ice to maintain target strength after dilution"
      formula="Brewing TDS = (Target TDS × Target Volume) / Hot Coffee Amount"
      formulaExplanation="When ice melts, it dilutes the coffee. This calculator determines how strong to brew the hot coffee so that after ice melts, you achieve your target strength."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Hot Coffee Amount */}
          <ResultDisplay
            label="Hot Coffee to Brew"
            value={displayHotCoffeeAmount || '0'}
            unit={useImperial ? 'fl oz' : 'ml'}
            highlight
            copyable
          />

          {/* Brewing TDS */}
          <ResultDisplay
            label="Brewing TDS"
            value={formatFixed(results.brewingTDS, 2)}
            unit="%"
            highlight
            copyable
          />

          {/* Ice Amount */}
          <ResultDisplay
            label="Ice Needed"
            value={displayIceAmount || '0'}
            unit={useImperial ? 'oz' : 'g'}
            copyable
          />

          {/* Warning for excessive dilution */}
          {results.warning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                    Excessive Dilution Warning
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
                <p className="text-sm font-medium mb-2">Brewing Instructions</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Brew {displayHotCoffeeAmount} {useImperial ? 'fl oz' : 'ml'} of hot coffee at {formatFixed(results.brewingTDS, 2)}% TDS</li>
                  <li>2. Prepare {displayIceAmount} {useImperial ? 'oz' : 'g'} of ice in your serving vessel</li>
                  <li>3. Pour the hot coffee directly over the ice</li>
                  <li>4. Stir gently as the ice melts to ensure even dilution</li>
                  <li>5. Enjoy your perfectly balanced iced coffee at {formatFixed(inputs.targetTDS, 2)}% TDS</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Ice percentage reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">Recommended Ice Percentages:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• 30-40%: Standard iced coffee (balanced dilution)</li>
              <li>• 40-50%: Cold and refreshing (moderate dilution)</li>
              <li>• 50%+: Very cold but may taste watery (high dilution)</li>
            </ul>
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

      {/* Target Volume Input */}
      <NumberInput
        id="targetVolume"
        label="Target Final Volume"
        value={parseFloat(displayTargetVolume)}
        onChange={handleTargetVolumeChange}
        min={useImperial ? 3.38 : 100}
        max={useImperial ? 67.63 : 2000}
        step={useImperial ? 0.1 : 10}
        unit={useImperial ? 'fl oz' : 'ml'}
        error={errors.targetVolume}
        required
        placeholder={useImperial ? '13.53' : '400'}
      />

      {/* Target TDS Input */}
      <NumberInput
        id="targetTDS"
        label="Target TDS (Desired Strength)"
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
        label="Ice Percentage"
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
