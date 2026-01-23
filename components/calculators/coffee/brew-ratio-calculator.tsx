'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateBrewRatio,
  type BrewRatioResults,
  type BrewRatioInputs
} from '@/lib/calculations/coffee/brew-ratio';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

/**
 * Zod schema for brew ratio calculator inputs
 * Validates coffee dose and ratio multiplier
 */
const brewRatioSchema = z.object({
  coffeeDose: z.number()
    .min(1, 'Coffee dose must be at least 1g')
    .max(100, 'Coffee dose cannot exceed 100g'),
  ratio: z.number()
    .min(10, 'Ratio must be at least 10')
    .max(25, 'Ratio cannot exceed 25'),
});

type BrewRatioFormInputs = z.infer<typeof brewRatioSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: BrewRatioFormInputs = {
  coffeeDose: 20,
  ratio: 16,
};

/**
 * Unit conversion constants
 */
const GRAMS_TO_OZ = 0.035274;
const ML_TO_FL_OZ = 0.033814;

/**
 * Strength profile badge component
 */
function StrengthBadge({ profile }: { profile: string }) {
  const colors = {
    'strong': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'balanced': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'mild': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[profile as keyof typeof colors] || ''}`}>
      {profile.charAt(0).toUpperCase() + profile.slice(1)}
    </span>
  );
}

/**
 * Coffee Brew Ratio Calculator Component
 * 
 * Calculates water amount needed for desired brew ratio.
 * Provides strength profile classification based on ratio.
 * 
 * Features:
 * - Coffee dose and ratio inputs
 * - Water amount calculation
 * - Strength profile classification (strong/balanced/mild)
 * - Detailed strength descriptions
 * - Unit toggle for metric/imperial
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4, 13.1, 15.1, 15.2
 */
export function BrewRatioCalculator() {
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
  } = useCalculator<BrewRatioFormInputs, BrewRatioResults>({
    initialInputs: INITIAL_INPUTS,
    schema: brewRatioSchema,
    calculate: calculateBrewRatio,
    storageKey: 'brew-ratio-calculator',
  });

  // Auto-calculate on mount and input changes
  React.useEffect(() => {
    if (isValid) {
      calculate();
    }
  }, [inputs, isValid, calculate]);

  // Convert values for display based on unit system
  const displayCoffeeDose = useImperial
    ? (inputs.coffeeDose * GRAMS_TO_OZ).toFixed(2)
    : inputs.coffeeDose.toFixed(1);

  const displayWaterAmount = results && useImperial
    ? (results.waterAmount * ML_TO_FL_OZ).toFixed(2)
    : results?.waterAmount.toFixed(0);

  // Handle input changes with unit conversion
  const handleCoffeeDoseChange = (value: number) => {
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
    setInput('coffeeDose', grams);
  };

  return (
    <CalculatorBase
      title="Brew Ratio Calculator"
      description="Calculate the water amount needed for your desired brew ratio to maintain consistent strength"
      formula="Water Amount = Coffee Dose × Ratio"
      formulaExplanation="The brew ratio represents the relationship between coffee and water. For example, a 1:15 ratio means 1 gram of coffee to 15 grams of water."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Main result */}
          <ResultDisplay
            label="Water Amount"
            value={displayWaterAmount || '0'}
            unit={useImperial ? 'fl oz' : 'ml'}
            highlight
            copyable
          />

          {/* Ratio display */}
          <ResultDisplay
            label="Brew Ratio"
            value={results.ratioDisplay}
            copyable
          />

          {/* Strength profile badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Strength Profile:</span>
            <StrengthBadge profile={results.strengthProfile} />
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">About This Ratio</p>
                <p className="text-sm text-muted-foreground">{results.description}</p>
              </div>
            </div>
          </div>

          {/* Strength ranges reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">Common Brew Ratios:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• Strong (≤ 1:15): Espresso, Moka pot, concentrated cold brew</li>
              <li>• Balanced (1:15 - 1:17): Pour over, drip coffee, French press</li>
              <li>• Mild (&gt; 1:17): Light filter coffee, tea-like brews</li>
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

      {/* Coffee Dose Input */}
      <NumberInput
        id="coffeeDose"
        label="Coffee Dose"
        value={parseFloat(displayCoffeeDose)}
        onChange={handleCoffeeDoseChange}
        min={useImperial ? 0.04 : 1}
        max={useImperial ? 3.53 : 100}
        step={useImperial ? 0.01 : 0.1}
        unit={useImperial ? 'oz' : 'g'}
        error={errors.coffeeDose}
        required
        placeholder={useImperial ? '0.71' : '20'}
      />

      {/* Ratio Input */}
      <NumberInput
        id="ratio"
        label={
          <span className="flex items-center gap-2">
            Brew Ratio (1:X)
            <Tooltip content="The ratio of coffee to water. For example, 1:16 means 1 gram of coffee to 16 grams of water. Lower ratios (1:12-1:15) are stronger, higher ratios (1:17-1:20) are milder." />
          </span>
        }
        value={inputs.ratio}
        onChange={(v) => setInput('ratio', v)}
        min={10}
        max={25}
        step={0.5}
        error={errors.ratio}
        required
        placeholder="16"
      />
    </CalculatorBase>
  );
}

export default BrewRatioCalculator;
