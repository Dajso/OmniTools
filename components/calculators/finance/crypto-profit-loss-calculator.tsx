'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const schema = z.object({
  buyPrice: z.number().min(0.0001, 'Price must be positive'),
  sellPrice: z.number().min(0.0001, 'Price must be positive'),
  quantity: z.number().min(0.0001, 'Quantity must be positive'),
  buyFee: z.number().min(0, 'Cannot be negative').max(10, 'Fee too high'),
  sellFee: z.number().min(0, 'Cannot be negative').max(10, 'Fee too high'),
});

type FormInputs = z.infer<typeof schema>;

interface Results {
  profitLoss: number;
  roi: number;
  totalFees: number;
  totalInvested: number;
  totalReceived: number;
}

const INITIAL_INPUTS: FormInputs = {
  buyPrice: 30000,
  sellPrice: 45000,
  quantity: 0.5,
  buyFee: 0.5,
  sellFee: 0.5,
};

function calculateCrypto(inputs: FormInputs): Results {
  const totalInvested = inputs.buyPrice * inputs.quantity;
  const buyFeeAmount = totalInvested * (inputs.buyFee / 100);
  const grossSale = inputs.sellPrice * inputs.quantity;
  const sellFeeAmount = grossSale * (inputs.sellFee / 100);
  const totalFees = buyFeeAmount + sellFeeAmount;
  const totalReceived = grossSale - sellFeeAmount;
  const profitLoss = totalReceived - totalInvested - buyFeeAmount;
  const roi = ((profitLoss) / (totalInvested + buyFeeAmount)) * 100;
  
  return {
    profitLoss,
    roi,
    totalFees,
    totalInvested: totalInvested + buyFeeAmount,
    totalReceived,
  };
}

export function CryptoProfitLossCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } = 
    useCalculator<FormInputs, Results>({
      initialInputs: INITIAL_INPUTS,
      schema,
      calculate: calculateCrypto,
      storageKey: 'crypto-profit-loss',
    });

  React.useEffect(() => { calculate(); }, []);

  return (
    <CalculatorBase
      title="Crypto Profit/Loss Calculator"
      description="Calculate your cryptocurrency profit or loss including fees"
      formula="P/L = (Sell Price × Qty - Sell Fee) - (Buy Price × Qty + Buy Fee)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay 
            label={results.profitLoss >= 0 ? 'Profit' : 'Loss'} 
            value={formatCurrency(Math.abs(results.profitLoss))} 
            highlight 
            copyable 
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="ROI" value={`${results.roi.toFixed(2)}%`} copyable />
            <ResultDisplay label="Total Fees" value={formatCurrency(results.totalFees)} copyable />
            <ResultDisplay label="Total Invested" value={formatCurrency(results.totalInvested)} copyable />
            <ResultDisplay label="Total Received" value={formatCurrency(results.totalReceived)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="buyPrice" label="Buy Price" value={inputs.buyPrice} 
          onChange={(v) => setInput('buyPrice', v)} min={0.0001} step={100} unit="$" error={errors.buyPrice} required />
        <NumberInput id="sellPrice" label="Sell Price" value={inputs.sellPrice}
          onChange={(v) => setInput('sellPrice', v)} min={0.0001} step={100} unit="$" error={errors.sellPrice} required />
      </div>
      <NumberInput id="quantity" label="Quantity" value={inputs.quantity}
        onChange={(v) => setInput('quantity', v)} min={0.0001} step={0.1} error={errors.quantity} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="buyFee" label="Buy Fee" value={inputs.buyFee}
          onChange={(v) => setInput('buyFee', v)} min={0} max={10} step={0.1} unit="%" error={errors.buyFee} />
        <NumberInput id="sellFee" label="Sell Fee" value={inputs.sellFee}
          onChange={(v) => setInput('sellFee', v)} min={0} max={10} step={0.1} unit="%" error={errors.sellFee} />
      </div>
    </CalculatorBase>
  );
}

export default CryptoProfitLossCalculator;
