'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateSalesTax, US_STATE_TAX_RATES, type SalesTaxResults } from '@/lib/calculations/finance/sales-tax-calculator';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

const salesTaxSchema = z.object({
  amount: z.number().min(0, 'Amount cannot be negative'),
  taxRate: z.number().min(0, 'Tax rate cannot be negative').max(30, 'Tax rate too high'),
  state: z.string(),
  isBeforeTax: z.boolean(),
});

type SalesTaxFormInputs = z.infer<typeof salesTaxSchema>;

const INITIAL_INPUTS: SalesTaxFormInputs = {
  amount: 100,
  taxRate: 6.25,
  state: 'TX',
  isBeforeTax: true,
};

const STATE_OPTIONS = Object.entries(US_STATE_TAX_RATES).map(([code, { name, rate }]) => ({
  value: code,
  label: `${name} (${rate}%)`,
}));


function calculateSalesTaxFn(formInputs: SalesTaxFormInputs): SalesTaxResults {
  return calculateSalesTax({
    amount: formInputs.amount,
    taxRate: formInputs.taxRate,
    isBeforeTax: formInputs.isBeforeTax,
  });
}

export function SalesTaxCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<SalesTaxFormInputs, SalesTaxResults>({
      initialInputs: INITIAL_INPUTS,
      schema: salesTaxSchema,
      calculate: calculateSalesTaxFn,
      storageKey: 'sales-tax-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const handleStateChange = (state: string) => {
    setInput('state', state);
    const stateData = US_STATE_TAX_RATES[state];
    if (stateData) {
      setInput('taxRate', stateData.rate);
    }
  };

  return (
    <CalculatorBase
      title="Sales Tax Calculator"
      description="Calculate sales tax for any US state"
      formula="Tax = Amount × (Rate / 100)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Total Amount" value={formatCurrency(results.total)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Subtotal" value={formatCurrency(results.subtotal)} copyable />
            <ResultDisplay label="Tax Amount" value={formatCurrency(results.taxAmount)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="amount" label={inputs.isBeforeTax ? "Price Before Tax" : "Total Price (with tax)"}
        value={inputs.amount} onChange={(v) => setInput('amount', v)} min={0} step={1} unit="$" error={errors.amount} required />

      <SelectInput id="state" label="State" value={inputs.state} onChange={handleStateChange}
        options={STATE_OPTIONS} error={errors.state} />

      <NumberInput id="taxRate" label="Tax Rate" value={inputs.taxRate}
        onChange={(v) => setInput('taxRate', v)} min={0} max={30} step={0.01} unit="%" error={errors.taxRate} />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.isBeforeTax} onChange={() => setInput('isBeforeTax', true)}
            className="w-4 h-4" />
          <span className="text-sm">Calculate tax from price</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={!inputs.isBeforeTax} onChange={() => setInput('isBeforeTax', false)}
            className="w-4 h-4" />
          <span className="text-sm">Extract tax from total</span>
        </label>
      </div>
    </CalculatorBase>
  );
}

export default SalesTaxCalculator;
