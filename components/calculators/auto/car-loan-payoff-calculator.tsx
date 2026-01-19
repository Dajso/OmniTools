'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import {
  calculateCarLoanPayoff,
  formatCurrency,
  formatMonths,
  type CarLoanResult,
} from '@/lib/calculations/auto/car-loan-calculator';

export function CarLoanPayoffCalculator() {
  const [loanAmount, setLoanAmount] = React.useState(25000);
  const [interestRate, setInterestRate] = React.useState(6.5);
  const [loanTermMonths, setLoanTermMonths] = React.useState(60);
  const [extraPayment, setExtraPayment] = React.useState(100);
  const [lumpSumPayment, setLumpSumPayment] = React.useState(0);
  
  const [result, setResult] = React.useState<CarLoanResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const calcResult = calculateCarLoanPayoff({
        loanAmount,
        interestRate,
        loanTermMonths,
        extraPayment,
        lumpSumPayment,
      });
      
      setResult(calcResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [loanAmount, interestRate, loanTermMonths, extraPayment, lumpSumPayment]);

  const reset = () => {
    setLoanAmount(25000);
    setInterestRate(6.5);
    setLoanTermMonths(60);
    setExtraPayment(100);
    setLumpSumPayment(0);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Car Loan Early Payoff Calculator"
      description="Calculate how extra payments can save you money and time"
      formula="M = P × [r(1+r)^n] / [(1+r)^n - 1]"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Monthly Payment" 
            value={formatCurrency(result.originalMonthlyPayment)}
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Time Saved" 
              value={formatMonths(result.monthsSaved)}
            />
            <ResultDisplay 
              label="Interest Saved" 
              value={formatCurrency(result.interestSaved)}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <p className="font-medium text-sm">Comparison</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Without Extra Payments</p>
                <p>Payoff: {formatMonths(loanTermMonths)}</p>
                <p>Total Interest: {formatCurrency(result.originalTotalInterest)}</p>
                <p>Total Paid: {formatCurrency(result.originalTotalPaid)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">With Extra Payments</p>
                <p>Payoff: {formatMonths(result.newPayoffMonths)}</p>
                <p>Total Interest: {formatCurrency(result.newTotalInterest)}</p>
                <p>Total Paid: {formatCurrency(result.newTotalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Original Payoff Date" 
              value={result.originalPayoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            />
            <ResultDisplay 
              label="New Payoff Date" 
              value={result.newPayoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            />
          </div>

          {result.interestSaved > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-green-700 dark:text-green-400">
                💰 You'll save {formatCurrency(result.interestSaved)} in interest!
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                By paying an extra {formatCurrency(extraPayment)}/month
                {lumpSumPayment > 0 ? ` plus a ${formatCurrency(lumpSumPayment)} lump sum` : ''}
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="loan-amount"
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={1000}
          max={200000}
          step={1000}
          unit="$"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="interest-rate"
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={30}
            step={0.1}
            unit="%"
          />
          <NumberInput
            id="loan-term"
            label="Loan Term"
            value={loanTermMonths}
            onChange={setLoanTermMonths}
            min={12}
            max={84}
            step={12}
            unit="mo"
          />
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Extra Payments</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="extra-payment"
              label="Extra Monthly"
              value={extraPayment}
              onChange={setExtraPayment}
              min={0}
              max={5000}
              step={25}
              unit="$"
            />
            <NumberInput
              id="lump-sum"
              label="One-Time Lump Sum"
              value={lumpSumPayment}
              onChange={setLumpSumPayment}
              min={0}
              max={50000}
              step={500}
              unit="$"
            />
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CarLoanPayoffCalculator;
