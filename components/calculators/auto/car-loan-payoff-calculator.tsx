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
  const [loanAmount, setLoanAmount] = React.useState(300000);
  const [interestRate, setInterestRate] = React.useState(7);
  const [loanTermMonths, setLoanTermMonths] = React.useState(60);
  const [extraPayment, setExtraPayment] = React.useState(1000);
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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [loanAmount, interestRate, loanTermMonths, extraPayment, lumpSumPayment]);

  const reset = () => {
    setLoanAmount(300000);
    setInterestRate(7);
    setLoanTermMonths(60);
    setExtraPayment(1000);
    setLumpSumPayment(0);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Nedbetaling av billån"
      description="Se hvor mye ekstra innbetalinger sparer deg i renter og tid"
      formula="M = P × [r(1+r)^n] / [(1+r)^n - 1]"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Månedlig betaling" 
            value={formatCurrency(result.originalMonthlyPayment)}
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Spart tid" 
              value={formatMonths(result.monthsSaved)}
            />
            <ResultDisplay 
              label="Spart rentekostnad" 
              value={formatCurrency(result.interestSaved)}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <p className="font-medium text-sm">Sammenligning</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Uten ekstra innbetalinger</p>
                <p>Ferdig nedbetalt: {formatMonths(loanTermMonths)}</p>
                <p>Rentekostnad totalt: {formatCurrency(result.originalTotalInterest)}</p>
                <p>Totalt betalt: {formatCurrency(result.originalTotalPaid)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Med ekstra innbetalinger</p>
                <p>Ferdig nedbetalt: {formatMonths(result.newPayoffMonths)}</p>
                <p>Rentekostnad totalt: {formatCurrency(result.newTotalInterest)}</p>
                <p>Totalt betalt: {formatCurrency(result.newTotalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Opprinnelig sluttdato" 
              value={result.originalPayoffDate.toLocaleDateString('nb-NO', { month: 'short', year: 'numeric' })}
            />
            <ResultDisplay 
              label="Ny sluttdato" 
              value={result.newPayoffDate.toLocaleDateString('nb-NO', { month: 'short', year: 'numeric' })}
            />
          </div>

          {result.interestSaved > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-green-700 dark:text-green-400">
                Du sparer {formatCurrency(result.interestSaved)} i renter!
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Ved å betale ekstra {formatCurrency(extraPayment)} per måned
                {lumpSumPayment > 0 ? `pluss en engangsinnbetaling på ${formatCurrency(lumpSumPayment)}` : ''}
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="loan-amount"
          label="Lånebeløp"
          value={loanAmount}
          onChange={setLoanAmount}
          min={10000}
          max={2000000}
          step={10000}
          unit="kr"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="interest-rate"
            label="Rente"
            value={interestRate}
            onChange={setInterestRate}
            min={0}
            max={30}
            step={0.1}
            unit="%"
          />
          <NumberInput
            id="loan-term"
            label="Nedbetalingstid"
            value={loanTermMonths}
            onChange={setLoanTermMonths}
            min={12}
            max={84}
            step={12}
            unit="mnd"
          />
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Ekstra innbetalinger</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="extra-payment"
              label="Ekstra per måned"
              value={extraPayment}
              onChange={setExtraPayment}
              min={0}
              max={50000}
              step={100}
              unit="kr"
            />
            <NumberInput
              id="lump-sum"
              label="Engangsinnbetaling"
              value={lumpSumPayment}
              onChange={setLumpSumPayment}
              min={0}
              max={500000}
              step={5000}
              unit="kr"
            />
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CarLoanPayoffCalculator;
