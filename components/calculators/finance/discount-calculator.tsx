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
  originalPrice: z.number().min(0, 'Price cannot be negative'),
  discountPercent: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  salesTaxPercent: z.number().min(0, 'Tax cannot be negative').max(30, 'Tax rate too high'),
});

type DiscountFormInputs = z.infer<typeof discountSchema>;

const INITIAL_INPUTS: DiscountFormInputs = {
  originalPrice: 100,
  discountPercent: 20,
  salesTaxPercent: 6.25,
};

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50];

export function DiscountCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<DiscountFormInputs, DiscountResults>({
      initialInputs: INITIAL_INPUTS,
      schema: discountSchema,
      calculate: calculateDiscount,
      storageKey: 'discount-calculator',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Discount Calculator"
      description="Calculate sale price with discount and sales tax"
      formula="Final = (Original × (1 - Discount%)) × (1 + Tax%)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Final Price" value={formatCurrency(results.finalPrice)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="You Save" value={formatCurrency(results.discountAmount)} copyable />
            <ResultDisplay label="Price After Discount" value={formatCurrency(results.priceAfterDiscount)} copyable />
            <ResultDisplay label="Tax Amount" value={formatCurrency(results.taxAmount)} copyable />
            <ResultDisplay label="Total Savings" value={formatCurrency(results.totalSavings)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="originalPrice" label="Original Price" value={inputs.originalPrice}
        onChange={(v) => setInput('originalPrice', v)} min={0} step={1} unit="$" error={errors.originalPrice} required />
      
      <div className="space-y-2">
        <NumberInput id="discountPercent" label="Discount" value={inputs.discountPercent}
          onChange={(v) => setInput('discountPercent', v)} min={0} max={100} step={1} unit="%" error={errors.discountPercent} />
        <div className="flex flex-wrap gap-2">
          {DISCOUNT_PRESETS.map((preset) => (
            <button key={preset} type="button" onClick={() => setInput('discountPercent', preset)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                inputs.discountPercent === preset ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}>{preset}% off</button>
          ))}
        </div>
      </div>

      <NumberInput id="salesTaxPercent" label="Sales Tax" value={inputs.salesTaxPercent}
        onChange={(v) => setInput('salesTaxPercent', v)} min={0} max={30} step={0.01} unit="%" error={errors.salesTaxPercent} />
    </CalculatorBase>
  );
}

export default DiscountCalculator;
