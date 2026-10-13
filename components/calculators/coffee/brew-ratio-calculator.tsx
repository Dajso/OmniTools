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
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for brew ratio calculator inputs
 * Validates coffee dose and ratio multiplier
 */
const brewRatioSchema = z.object({
  coffeeDose: z.number()
    .min(1, 'Kaffemengden må være minst 1 g')
    .max(100, 'Kaffemengden kan ikke være over 100 g'),
  ratio: z.number()
    .min(10, 'Forholdet må være minst 10')
    .max(25, 'Forholdet kan ikke være over 25'),
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

  // Visningsverdier
  const displayCoffeeDose = inputs.coffeeDose.toFixed(1);

  const displayWaterAmount = results ? formatFixed(results.waterAmount, 0) : undefined;

  const handleCoffeeDoseChange = (value: number) => {
    const grams = value;
    setInput('coffeeDose', grams);
  };

  return (
    <CalculatorBase
      title="Bryggeforhold"
      description="Regn ut hvor mye vann du trenger for å holde kaffen like sterk hver gang"
      formula="Vannmengde = kaffemengde × forhold"
      formulaExplanation="Bryggeforholdet sier hvor mye vann du bruker per gram kaffe. Forholdet 1:15 betyr 1 gram kaffe til 15 gram vann."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Main result */}
          <ResultDisplay
            label="Vannmengde"
            value={displayWaterAmount || '0'}
            unit="ml"
            highlight
            copyable
          />

          {/* Ratio display */}
          <ResultDisplay
            label="Bryggeforhold"
            value={results.ratioDisplay}
            copyable
          />

          {/* Strength profile badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Styrkeprofil:</span>
            <StrengthBadge profile={results.strengthProfile} />
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Om dette forholdet</p>
                <p className="text-sm text-muted-foreground">{results.description}</p>
              </div>
            </div>
          </div>

          {/* Strength ranges reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">Vanlige bryggeforhold:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• Sterkt (≤ 1:15): espresso, mokakanne, konsentrert cold brew</li>
              <li>• Balansert (1:15–1:17): pour over, traktekaffe, presskanne</li>
              <li>• Mildt (&gt; 1:17): lett filterkaffe og tekaffe-aktige brygg</li>
            </ul>
          </div>
        </div>
      )}
    >

      {/* Coffee Dose Input */}
      <NumberInput
        id="coffeeDose"
        label="Kaffemengde"
        value={parseFloat(displayCoffeeDose)}
        onChange={handleCoffeeDoseChange}
        min={1}
        max={100}
        step={0.1}
        unit="g"
        error={errors.coffeeDose}
        required
        placeholder="20"
      />

      {/* Ratio Input */}
      <NumberInput
        id="ratio"
        label={
          <span className="flex items-center gap-2">
            Bryggeforhold (1:X)
            <Tooltip content="Forholdet mellom kaffe og vann. 1:16 betyr 1 gram kaffe til 16 gram vann. Lavere tall (1:12–1:15) gir sterkere kaffe, høyere tall (1:17–1:20) gir mildere kaffe." />
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
