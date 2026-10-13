'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateDiscount, type DiscountResults } from '@/lib/calculations/finance/discount-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const discountSchema = z.object({
  originalPrice: z.number().min(0, 'Prisen kan ikke være negativ'),
  discountPercent: z.number().min(0, 'Rabatten kan ikke være negativ').max(100, 'Rabatten kan ikke være over 100 %'),
  salesTaxPercent: z.number().min(0, 'MVA kan ikke være negativ').max(30, 'MVA-satsen er for høy'),
});

type DiscountFormInputs = z.infer<typeof discountSchema>;

const INITIAL_INPUTS: DiscountFormInputs = {
  originalPrice: 1000,
  discountPercent: 20,
  salesTaxPercent: 0,
};

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50];

export function DiscountCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<DiscountFormInputs, DiscountResults>({
      initialInputs: INITIAL_INPUTS,
      schema: discountSchema,
      calculate: calculateDiscount,
      storageKey: 'discount-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Rabattkalkulator"
      description="Regn ut tilbudspris med rabatt, og eventuelt MVA"
      formula="Ny pris = Opprinnelig pris × (1 − rabatt%) × (1 + MVA%)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Ny pris" value={formatCurrency(results.finalPrice)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Du sparer" value={formatCurrency(results.discountAmount)} copyable />
            <ResultDisplay label="Pris etter rabatt (før MVA)" value={formatCurrency(results.priceAfterDiscount)} copyable />
            <ResultDisplay label="MVA-beløp" value={formatCurrency(results.taxAmount)} copyable />
            <ResultDisplay label="Total besparelse" value={formatCurrency(results.totalSavings)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="originalPrice" label="Opprinnelig pris" value={inputs.originalPrice}
        onChange={(v) => setInput('originalPrice', v)} min={0} step={1} unit="kr" error={errors.originalPrice} required />

      <div className="space-y-2">
        <NumberInput id="discountPercent" label="Rabatt" value={inputs.discountPercent}
          onChange={(v) => setInput('discountPercent', v)} min={0} max={100} step={1} unit="%" error={errors.discountPercent} />
        <div className="flex flex-wrap gap-2">
          {DISCOUNT_PRESETS.map((preset) => (
            <button key={preset} type="button" onClick={() => setInput('discountPercent', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.discountPercent === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}>{preset} % rabatt</button>
          ))}
        </div>
      </div>

      <NumberInput id="salesTaxPercent" label="MVA som legges til (0 hvis prisen allerede inkluderer MVA)" value={inputs.salesTaxPercent}
        onChange={(v) => setInput('salesTaxPercent', v)} min={0} max={30} step={1} unit="%" error={errors.salesTaxPercent} />
    </CalculatorBase>
  );
}

export default DiscountCalculator;
