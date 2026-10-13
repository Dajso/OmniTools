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
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for extraction yield calculator inputs
 * Validates TDS, coffee dose, and beverage weight
 */
const extractionYieldSchema = z.object({
  tds: z.number()
    .min(0.01, 'TDS må være minst 0,01 %')
    .max(5, 'TDS kan ikke være over 5 %'),
  coffeeDose: z.number()
    .min(1, 'Kaffemengden må være minst 1 g')
    .max(100, 'Kaffemengden kan ikke være over 100 g'),
  beverageWeight: z.number()
    .min(10, 'Vekten på drikken må være minst 10 g')
    .max(1000, 'Vekten på drikken kan ikke være over 1000 g'),
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

  // Visningsverdier
  const displayCoffeeDose = inputs.coffeeDose.toFixed(1);

  const displayBeverageWeight = inputs.beverageWeight.toFixed(0);

  const handleCoffeeDoseChange = (value: number) => {
    const grams = value;
    setInput('coffeeDose', grams);
  };

  const handleBeverageWeightChange = (value: number) => {
    const grams = value;
    setInput('beverageWeight', grams);
  };

  return (
    <CalculatorBase
      title="Ekstraksjonsgrad for kaffe"
      description="Regn ut ekstraksjonsgraden fra TDS-målinger og se om kaffen er riktig ekstrahert"
      formula="Ekstraksjon % = (TDS × vekt på drikken) / kaffemengde"
      formulaExplanation="TDS (oppløst stoff i drikken) måles med et refraktometer. Optimal ekstraksjon er 18–22 % ifølge SCA-standarden."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Main result */}
          <ResultDisplay
            label="Ekstraksjonsgrad"
            value={formatFixed(results.extractionYield, 2)}
            unit="%"
            highlight
            copyable
          />

          {/* Assessment badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Vurdering:</span>
            <AssessmentBadge assessment={results.assessment} />
          </div>

          {/* Recommendation */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Anbefaling</p>
                <p className="text-sm text-muted-foreground">{results.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Extraction ranges reference */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">SCA-standard for ekstraksjon:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• Underekstrahert: &lt; 18 % (sur, svak)</li>
              <li>• Optimal: 18–22 % (balansert, søt)</li>
              <li>• Overekstrahert: &gt; 22 % (bitter, hard)</li>
            </ul>
          </div>
        </div>
      )}
    >

      {/* TDS Input */}
      <NumberInput
        id="tds"
        label={
          <span className="flex items-center gap-2">
            TDS (oppløst stoff i drikken)
            <Tooltip content="Oppløst stoff målt med refraktometer. Vanlig område for god kaffe er 1,15–1,55 %." />
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
        label="Kaffemengde"
        value={parseFloat(displayCoffeeDose)}
        onChange={handleCoffeeDoseChange}
        min={1}
        max={100}
        step={0.1}
        unit="g"
        error={errors.coffeeDose}
        required
        placeholder="18"
      />

      {/* Beverage Weight Input */}
      <NumberInput
        id="beverageWeight"
        label="Vekt på drikken"
        value={parseFloat(displayBeverageWeight)}
        onChange={handleBeverageWeightChange}
        min={10}
        max={1000}
        step={1}
        unit="ml"
        error={errors.beverageWeight}
        required
        placeholder="300"
      />
    </CalculatorBase>
  );
}

export default ExtractionYieldCalculator;
