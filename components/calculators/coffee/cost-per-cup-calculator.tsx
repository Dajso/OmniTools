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
import { Info, Wallet, Coffee, Calendar, TrendingUp } from 'lucide-react';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for cost per cup calculator inputs
 * Validates bag price, weight, dose, and cups per day
 */
const costPerCupSchema = z.object({
  bagPrice: z.number()
    .min(10, 'Posen må koste minst 10 kr')
    .max(2000, 'Posen kan ikke koste mer enn 2000 kr'),
  bagWeight: z.number()
    .min(100, 'Posen må veie minst 100 g')
    .max(5000, 'Posen kan ikke veie mer enn 5000 g'),
  dosePerCup: z.number()
    .min(5, 'Mengden per kopp må være minst 5 g')
    .max(50, 'Mengden per kopp kan ikke være over 50 g'),
  cupsPerDay: z.number()
    .min(0, 'Antall kopper per dag kan ikke være negativt')
    .max(20, 'Antall kopper per dag kan ikke være over 20')
    .optional(),
});

type CostPerCupFormInputs = z.infer<typeof costPerCupSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: CostPerCupFormInputs = {
  bagPrice: 129,
  bagWeight: 250,
  dosePerCup: 20,
  cupsPerDay: 2,
};

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

  // Visningsverdier
  const displayBagWeight = inputs.bagWeight.toFixed(0);

  const displayDosePerCup = inputs.dosePerCup.toFixed(1);

  const handleBagWeightChange = (value: number) => {
    const grams = value;
    setInput('bagWeight', grams);
  };

  const handleDosePerCupChange = (value: number) => {
    const grams = value;
    setInput('dosePerCup', grams);
  };

  return (
    <CalculatorBase
      title="Kostnad per kopp kaffe"
      description="Regn ut hva hver kopp koster ut fra prisen på kaffeposen, og se hva kaffevanen koster deg"
      formula="Kostnad per kopp = (pris på posen / vekt på posen) × mengde per kopp"
      formulaExplanation="Kalkulatoren viser hva kaffen egentlig koster, ut fra prisen og vekten på posen og hvor mye du bruker per kopp."
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
              icon={Wallet}
              label="Kostnad per kopp"
              value={`${formatFixed(results.costPerCup, 2)} kr`}
              unit=""
              description="Hva du betaler for hver kopp kaffe"
            />

            <CostBreakdownCard
              icon={Coffee}
              label="Kopper per pose"
              value={formatFixed(results.cupsPerBag, 1)}
              unit="kopper"
              description="Hvor mange kopper du får ut av posen"
            />
          </div>

          {/* Cost Per Gram */}
          <ResultDisplay
            label="Kostnad per gram"
            value={`${formatFixed(results.costPerGram, 4)} kr`}
            copyable
          />

          {/* Monthly and Annual Costs (if cups per day is provided) */}
          {results.monthlyCost !== undefined && results.annualCost !== undefined && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Budsjett
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CostBreakdownCard
                  icon={Calendar}
                  label="Kostnad per måned"
                  value={`${formatFixed(results.monthlyCost, 0)} kr`}
                  unit="/måned"
                  description={`Basert på ${inputs.cupsPerDay} ${inputs.cupsPerDay !== 1 ? 'kopper' : 'kopp'} per dag`}
                />

                <CostBreakdownCard
                  icon={Calendar}
                  label="Kostnad per år"
                  value={`${formatFixed(results.annualCost, 0)} kr`}
                  unit="/år"
                  description="Hva kaffen koster deg i året"
                />
              </div>
            </div>
          )}

          {/* Cost Comparison Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Sammenligning</p>
                <p className="text-sm text-muted-foreground">
                  Med {formatFixed(results.costPerCup, 2)} kr per kopp er kaffen du lager hjemme mye billigere enn kaffe på kafé (vanligvis 40–60 kr per kopp).
                  {results.annualCost && ` Du sparer omtrent ${formatFixed(((45 - results.costPerCup) * (inputs.cupsPerDay || 1) * 365), 0)} kr i året sammenlignet med å kjøpe kaffe på kafé til 45 kr per kopp.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    >

      {/* Bag Price Input */}
      <NumberInput
        id="bagPrice"
        label="Pris på posen"
        value={inputs.bagPrice}
        onChange={(v) => setInput('bagPrice', v)}
        min={10}
        max={2000}
        step={1}
        unit="kr"
        error={errors.bagPrice}
        required
        placeholder="129"
      />

      {/* Bag Weight Input */}
      <NumberInput
        id="bagWeight"
        label="Vekt på posen"
        value={parseFloat(displayBagWeight)}
        onChange={handleBagWeightChange}
        min={100}
        max={5000}
        step={10}
        unit="g"
        error={errors.bagWeight}
        required
        placeholder="250"
      />

      {/* Dose Per Cup Input */}
      <NumberInput
        id="dosePerCup"
        label="Mengde per kopp"
        value={parseFloat(displayDosePerCup)}
        onChange={handleDosePerCupChange}
        min={5}
        max={50}
        step={0.5}
        unit="g"
        error={errors.dosePerCup}
        required
        placeholder="20"
      />

      {/* Cups Per Day Input (Optional) */}
      <NumberInput
        id="cupsPerDay"
        label="Kopper per dag (valgfritt)"
        value={inputs.cupsPerDay || 0}
        onChange={(v) => setInput('cupsPerDay', v > 0 ? v : undefined)}
        min={0}
        max={20}
        step={0.5}
        unit="kopper"
        error={errors.cupsPerDay}
        placeholder="2"
      />
    </CalculatorBase>
  );
}

export default CostPerCupCalculator;
