'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  amount: z.number().min(0.01, 'Amount must be positive'),
  transactionType: z.number().min(0).max(2),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  feeAmount: number;
  netAmount: number;
  feePercentage: number;
  amountToRequest: number;
}

const INITIAL_INPUTS: FormInputs = {
  amount: 100,
  transactionType: 0,
};

const FEE_RATES = [
  { name: 'Domestic (2.9% + $0.30)', rate: 0.029, fixed: 0.30 },
  { name: 'International (4.4% + fixed)', rate: 0.044, fixed: 0.30 },
  { name: 'Friends & Family (Free)', rate: 0, fixed: 0 },
];

function calculatePaypalFee(inputs: FormInputs): Results {
  const feeConfig = FEE_RATES[inputs.transactionType];
  const feeAmount = inputs.amount * feeConfig.rate + feeConfig.fixed;
  const netAmount = inputs.amount - feeAmount;
  const feePercentage = (feeAmount / inputs.amount) * 100;
  const amountToRequest = (inputs.amount + feeConfig.fixed) / (1 - feeConfig.rate);

  return {
    feeAmount: Math.max(0, feeAmount),
    netAmount: Math.max(0, netAmount),
    feePercentage: Math.max(0, feePercentage),
    amountToRequest,
  };
}

export function PaypalFeeCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculatePaypalFee,
      storageKey: 'paypal-fee-calculator',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="PayPal Fee Calculator"
      description="Calculate PayPal transaction fees for different payment types"
      formula="Fee = Amount × Rate + Fixed Fee"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="You'll Receive" value={formatCurrency(results.netAmount)} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="PayPal Fee" value={formatCurrency(results.feeAmount)} copyable />
            <ResultDisplay label="Effective Fee Rate" value={`${results.feePercentage.toFixed(2)}%`} />
            <ResultDisplay label="Request This to Get Full Amount" value={formatCurrency(results.amountToRequest)} copyable />
          </div>
        </div>
      )}
    >
      <NumberInput id="amount" label="Amount" value={inputs.amount}
        onChange={(v) => setInput('amount', v)} min={0.01} step={10} unit="$" error={errors.amount} required />
      <div className="space-y-2">
        <label className="text-sm font-medium">Transaction Type</label>
        <div className="flex flex-col gap-2">
          {FEE_RATES.map((fee, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInput('transactionType', index)}
              className={`px-4 py-2 text-sm rounded-md border transition-colors text-left ${inputs.transactionType === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
            >
              {fee.name}
            </button>
          ))}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PaypalFeeCalculator;
