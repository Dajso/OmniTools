'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateSalesTax, MVA_RATES, type SalesTaxResults } from '@/lib/calculations/finance/sales-tax-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const salesTaxSchema = z.object({
  amount: z.number().min(0, 'Beløpet kan ikke være negativt'),
  taxRate: z.number().min(0, 'MVA-satsen kan ikke være negativ').max(100, 'MVA-satsen er for høy'),
  rateType: z.string(),
  isBeforeTax: z.boolean(),
});

type SalesTaxFormInputs = z.infer<typeof salesTaxSchema>;

const INITIAL_INPUTS: SalesTaxFormInputs = {
  amount: 1000,
  taxRate: 25,
  rateType: 'general',
  isBeforeTax: false,
};

const RATE_OPTIONS = [
  ...Object.entries(MVA_RATES).map(([code, { name, rate }]) => ({
    value: code,
    label: `${name} (${rate} %)`,
  })),
  { value: 'custom', label: 'Egen sats' },
];

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
      storageKey: 'mva-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  const handleRateTypeChange = (rateType: string) => {
    setInput('rateType', rateType);
    const data = MVA_RATES[rateType];
    if (data) {
      setInput('taxRate', data.rate);
    }
  };

  return (
    <CalculatorBase
      title="MVA-kalkulator"
      description="Regn ut merverdiavgift med og uten MVA"
      formula={inputs.isBeforeTax ? 'Pris med MVA = Pris uten MVA × (1 + sats ÷ 100)' : 'Pris uten MVA = Pris med MVA ÷ (1 + sats ÷ 100)'}
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={inputs.isBeforeTax ? 'Pris med MVA' : 'MVA-beløp'}
            value={formatCurrency(inputs.isBeforeTax ? results.total : results.taxAmount)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Pris uten MVA" value={formatCurrency(results.subtotal)} copyable />
            <ResultDisplay label="MVA-beløp" value={formatCurrency(results.taxAmount)} copyable />
            <ResultDisplay label="Pris med MVA" value={formatCurrency(results.total)} copyable />
          </div>
        </div>
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={!inputs.isBeforeTax} onChange={() => setInput('isBeforeTax', false)}
            className="w-4 h-4" />
          <span className="text-sm">Prisen inkluderer MVA (trekk ut MVA)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={inputs.isBeforeTax} onChange={() => setInput('isBeforeTax', true)}
            className="w-4 h-4" />
          <span className="text-sm">Prisen er uten MVA (legg til MVA)</span>
        </label>
      </div>

      <NumberInput id="amount" label={inputs.isBeforeTax ? 'Pris uten MVA' : 'Pris med MVA'}
        value={inputs.amount} onChange={(v) => setInput('amount', v)} min={0} step={1} unit="kr" error={errors.amount} required />

      <SelectInput id="rateType" label="MVA-sats" value={inputs.rateType} onChange={handleRateTypeChange}
        options={RATE_OPTIONS} error={errors.rateType} />

      <NumberInput id="taxRate" label="Sats i prosent" value={inputs.taxRate}
        onChange={(v) => { setInput('taxRate', v); setInput('rateType', 'custom'); }} min={0} max={100} step={0.5} unit="%" error={errors.taxRate} />

      <p className="text-xs text-muted-foreground">
        Satsene er veiledende. Sjekk Skatteetaten for gjeldende satser og unntak.
      </p>
    </CalculatorBase>
  );
}

export default SalesTaxCalculator;
