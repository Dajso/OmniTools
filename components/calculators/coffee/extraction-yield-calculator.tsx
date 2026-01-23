'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateExtractionYield,
  type ExtractionYieldResults,
  type ExtractionYieldInputs
} from '@/lib/calculations/coffee/extraction-yield';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

/**
 * Zod schema for extraction yield calculator inputs
 * Validates TDS, coffee dose, and beverage weight
 */
const extractionYieldSchema = z.object({
  tds: z.number()
    .min(0.01, 'TDS must be at least 0.01%')
    .max(5, 'TDS cannot exceed 5%'),
  coffeeDose: z.number()
    .min(1, 'Coffee dose must be at least 1g')
    .max(100, 'Coffee dose cannot exceed 100g'),
  beverageWeight: z.number()
    .min(10, 'Beverage weight must be at least 10g')
    .max(1000, 'Beverage weight cannot exceed 1000g'),
});

type ExtractionYieldFormInputs = z.infer<typeof extractionYieldSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: ExtractionYieldFormInputs = {
  tds: 1.35,
  coffeeDose: 18,
  beverageWeight: 300,
};

/**
 * Unit conversion constants
 */
const GRAMS_TO_OZ = 0.035274;
const ML_TO_FL_OZ = 0.033814;

/**
 * Assessment badge component
 */
function AssessmentBadge({ assessment }: { assessment: string }) {
  const colors = {
    'under-extracted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'optimal': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'over-extracted': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[assessment as keyof typeof colors] || ''}`}>
      {assessment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}

/**
 * Coffee Extraction Yield Calculator Component
 * 
 * Calculates extraction yield percentage from TDS measurements.
 * Provides assessment classification and recommendations for brew optimization.
 * 
 * Features:
 * - TDS, coffee dose, and beverage weight inputs
 * - Extraction yield percentage calculation
 * - Assessment classification (under/optimal/over-extracted)
 * - Brewing recommendations
 * - Unit toggle for metric/imperial
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 12.1, 12.2, 12.3, 13.1, 15.1, 15.2
 */
export function ExtractionYieldCalculator() {
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
  } = useCalculator<ExtractionYieldFormInputs, ExtractionYieldResults>({
    initialInputs: INITIAL_INPUTS,
    schema: extractionYieldSchema,
    calculate: calculateExtractionYield,
    storageKey: 'extraction-yield-calculator',
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

  const displayBeverageWeight = useImperial
    ? (inputs.beverageWeight * ML_TO_FL_OZ).toFixed(2)
    : inputs.beverageWeight.toFixed(0);

  // Handle input changes with unit conversion
  const handleCoffeeDoseChange = (value: number) => {
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
    setInput('coffeeDose', grams);
  };

  const handleBeverageWeightChange = (value: number) => {
    const grams = useImperial ? value / ML_TO_FL_OZ : value;
    setInput('beverageWeight', grams);
  };

  return (
    <CalculatorBase
      title="Coffee Extraction Yield Calculator"
      description="Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted"
      formula="Extraction % = (TDS × Beverage Weight) / Coffee Dose"
      formulaExplanation="TDS (Total Dissolved Solids) is measured with a refractometer. Optimal extraction is 18-22% according to SCA standards."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Main result */}
          <ResultDisplay
            label="Extraction Yield"
            value={results.extractionYield.toFixed(2)}
            unit="%"
            highlight
            copyable
          />

          {/* Assessment badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Assessment:</span>
            <AssessmentBadge assessment={results.assessment} />
          </div>

          {/* Recommendation */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Recommendation</p>
                <p className="text-sm text-muted-foreground">{results.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Extraction ranges reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">SCA Extraction Standards:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• Under-extracted: &lt; 18% (sour, weak)</li>
              <li>• Optimal: 18-22% (balanced, sweet)</li>
              <li>• Over-extracted: &gt; 22% (bitter, harsh)</li>
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

      {/* TDS Input */}
      <NumberInput
        id="tds"
        label={
          <span className="flex items-center gap-2">
            TDS (Total Dissolved Solids)
            <Tooltip content="Total Dissolved Solids measured with a refractometer. Typical range: 1.15-1.55% for optimal coffee." />
          </span>
        }
        value={inputs.tds}
        onChange={(v) => setInput('tds', v)}
        min={0.01}
        max={5}
        step={0.01}
        unit="%"
        error={errors.tds}
        required
        placeholder="1.35"
      />

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
        placeholder={useImperial ? '0.63' : '18'}
      />

      {/* Beverage Weight Input */}
      <NumberInput
        id="beverageWeight"
        label="Beverage Weight"
        value={parseFloat(displayBeverageWeight)}
        onChange={handleBeverageWeightChange}
        min={useImperial ? 0.34 : 10}
        max={useImperial ? 33.81 : 1000}
        step={useImperial ? 0.1 : 1}
        unit={useImperial ? 'fl oz' : 'ml'}
        error={errors.beverageWeight}
        required
        placeholder={useImperial ? '10.14' : '300'}
      />
    </CalculatorBase>
  );
}

export default ExtractionYieldCalculator;
