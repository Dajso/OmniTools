'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCostPerCup,
  type CostPerCupResults,
  type CostPerCupInputs
} from '@/lib/calculations/coffee/cost-per-cup';
import { Button } from '@/components/ui/button';
import { Info, DollarSign, Coffee, Calendar, TrendingUp } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for cost per cup calculator inputs
 * Validates bag price, weight, dose, and cups per day
 */
const costPerCupSchema = z.object({
  bagPrice: z.number()
    .min(1, 'Bag price must be at least $1')
    .max(500, 'Bag price cannot exceed $500'),
  bagWeight: z.number()
    .min(100, 'Bag weight must be at least 100g')
    .max(5000, 'Bag weight cannot exceed 5000g'),
  dosePerCup: z.number()
    .min(5, 'Dose per cup must be at least 5g')
    .max(50, 'Dose per cup cannot exceed 50g'),
  cupsPerDay: z.number()
    .min(0, 'Cups per day cannot be negative')
    .max(20, 'Cups per day cannot exceed 20')
    .optional(),
});

type CostPerCupFormInputs = z.infer<typeof costPerCupSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: CostPerCupFormInputs = {
  bagPrice: 18,
  bagWeight: 340,
  dosePerCup: 20,
  cupsPerDay: 2,
};

/**
 * Unit conversion constants
 */
const GRAMS_TO_OZ = 0.035274;

/**
 * Cost breakdown card component
 */
function CostBreakdownCard({
  icon: Icon,
  label,
  value,
  unit,
  description
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  description: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold mb-1">
            {value} <span className="text-base font-normal text-muted-foreground">{unit}</span>
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Coffee Cost Per Cup Calculator Component
 * 
 * Calculates the actual cost per cup from bag price.
 * Provides monthly and annual cost projections.
 * 
 * Features:
 * - Bag price, weight, and dose per cup inputs
 * - Optional cups per day for budget planning
 * - Cost per cup, per gram, and cups per bag calculations
 * - Monthly and annual cost projections
 * - Unit toggle for metric/imperial
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 9.1, 9.2, 9.3, 15.1, 15.2
 */
export function CostPerCupCalculator() {
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
  } = useCalculator<CostPerCupFormInputs, CostPerCupResults>({
    initialInputs: INITIAL_INPUTS,
    schema: costPerCupSchema,
    calculate: calculateCostPerCup,
    storageKey: 'cost-per-cup-calculator',
  });

  // Auto-calculate on mount and input changes
  React.useEffect(() => {
    if (isValid) {
      calculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, isValid]);

  // Convert values for display based on unit system
  const displayBagWeight = useImperial
    ? (inputs.bagWeight * GRAMS_TO_OZ).toFixed(2)
    : inputs.bagWeight.toFixed(0);

  const displayDosePerCup = useImperial
    ? (inputs.dosePerCup * GRAMS_TO_OZ).toFixed(2)
    : inputs.dosePerCup.toFixed(1);

  // Handle input changes with unit conversion
  const handleBagWeightChange = (value: number) => {
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
    setInput('bagWeight', grams);
  };

  const handleDosePerCupChange = (value: number) => {
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
    setInput('dosePerCup', grams);
  };

  return (
    <CalculatorBase
      title="Cost Per Cup Calculator"
      description="Calculate the actual cost per cup from your coffee bag price and understand your coffee expenses"
      formula="Cost Per Cup = (Bag Price / Bag Weight) × Dose Per Cup"
      formulaExplanation="This calculator helps you understand the true cost of your coffee by breaking down the price per cup based on your bag price, weight, and brewing dose."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-6">
          {/* Primary Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CostBreakdownCard
              icon={DollarSign}
              label="Cost Per Cup"
              value={`$${formatFixed(results.costPerCup, 2)}`}
              unit=""
              description="What you pay for each cup of coffee"
            />

            <CostBreakdownCard
              icon={Coffee}
              label="Cups Per Bag"
              value={formatFixed(results.cupsPerBag, 1)}
              unit="cups"
              description="How many cups you can make from this bag"
            />
          </div>

          {/* Cost Per Gram */}
          <ResultDisplay
            label="Cost Per Gram"
            value={`$${formatFixed(results.costPerGram, 4)}`}
            copyable
          />

          {/* Monthly and Annual Costs (if cups per day is provided) */}
          {results.monthlyCost !== undefined && results.annualCost !== undefined && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Budget Projections
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CostBreakdownCard
                  icon={Calendar}
                  label="Monthly Cost"
                  value={`$${formatFixed(results.monthlyCost, 2)}`}
                  unit="/month"
                  description={`Based on ${inputs.cupsPerDay} cup${inputs.cupsPerDay !== 1 ? 's' : ''} per day`}
                />

                <CostBreakdownCard
                  icon={Calendar}
                  label="Annual Cost"
                  value={`$${formatFixed(results.annualCost, 2)}`}
                  unit="/year"
                  description="Your yearly coffee investment"
                />
              </div>
            </div>
          )}

          {/* Cost Comparison Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Cost Comparison</p>
                <p className="text-sm text-muted-foreground">
                  At ${formatFixed(results.costPerCup, 2)} per cup, your home-brewed coffee is significantly
                  cheaper than café coffee (typically $3-6 per cup).
                  {results.annualCost && ` You're saving approximately $${formatFixed(((4 - results.costPerCup) * (inputs.cupsPerDay || 1) * 365), 0)} per year compared to buying café coffee at $4 per cup.`}
                </p>
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

      {/* Bag Price Input */}
      <NumberInput
        id="bagPrice"
        label="Bag Price"
        value={inputs.bagPrice}
        onChange={(v) => setInput('bagPrice', v)}
        min={1}
        max={500}
        step={0.5}
        unit="$"
        error={errors.bagPrice}
        required
        placeholder="18"
      />

      {/* Bag Weight Input */}
      <NumberInput
        id="bagWeight"
        label="Bag Weight"
        value={parseFloat(displayBagWeight)}
        onChange={handleBagWeightChange}
        min={useImperial ? 3.53 : 100}
        max={useImperial ? 176.37 : 5000}
        step={useImperial ? 0.1 : 10}
        unit={useImperial ? 'oz' : 'g'}
        error={errors.bagWeight}
        required
        placeholder={useImperial ? '12' : '340'}
      />

      {/* Dose Per Cup Input */}
      <NumberInput
        id="dosePerCup"
        label="Dose Per Cup"
        value={parseFloat(displayDosePerCup)}
        onChange={handleDosePerCupChange}
        min={useImperial ? 0.18 : 5}
        max={useImperial ? 1.76 : 50}
        step={useImperial ? 0.01 : 0.5}
        unit={useImperial ? 'oz' : 'g'}
        error={errors.dosePerCup}
        required
        placeholder={useImperial ? '0.71' : '20'}
      />

      {/* Cups Per Day Input (Optional) */}
      <NumberInput
        id="cupsPerDay"
        label="Cups Per Day (Optional)"
        value={inputs.cupsPerDay || 0}
        onChange={(v) => setInput('cupsPerDay', v > 0 ? v : undefined)}
        min={0}
        max={20}
        step={0.5}
        unit="cups"
        error={errors.cupsPerDay}
        placeholder="2"
      />
    </CalculatorBase>
  );
}

export default CostPerCupCalculator;
