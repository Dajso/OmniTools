'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateMortgage,
  calculateDownPaymentPercent,
  calculateDownPaymentFromPercent,
  isPMIRequired,
  estimatePMI,
  type MortgageInputs,
  type MortgageResults,
} from '@/lib/calculations/finance/mortgage';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

/**
 * Zod schema for mortgage calculator inputs
 */
const mortgageSchema = z.object({
  homePrice: z.number().min(1000, 'Home price must be at least $1,000').max(100000000, 'Home price too high'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  downPaymentPercent: z.number().min(0).max(99.99),
  loanTerm: z.number().refine(v => [10, 15, 20, 25, 30].includes(v), 'Select a valid loan term'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(30, 'Interest rate too high'),
  propertyTax: z.number().min(0, 'Property tax cannot be negative'),
  homeInsurance: z.number().min(0, 'Insurance cannot be negative'),
  pmi: z.number().min(0, 'PMI cannot be negative'),
  hoaFees: z.number().min(0, 'HOA fees cannot be negative'),
});

type MortgageFormInputs = z.infer<typeof mortgageSchema>;

const LOAN_TERM_OPTIONS = [
  { value: '10', label: '10 years' },
  { value: '15', label: '15 years' },
  { value: '20', label: '20 years' },
  { value: '25', label: '25 years' },
  { value: '30', label: '30 years' },
];

const INITIAL_INPUTS: MortgageFormInputs = {
  homePrice: 300000,
  downPayment: 60000,
  downPaymentPercent: 20,
  loanTerm: 30,
  interestRate: 6.5,
  propertyTax: 3600,
  homeInsurance: 1200,
  pmi: 0,
  hoaFees: 0,
};


/**
 * Amortization schedule table component
 */
function AmortizationSchedule({
  schedule,
  showAll = false,
}: {
  schedule: MortgageResults['amortizationSchedule'];
  showAll?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(showAll);
  const displaySchedule = expanded ? schedule : schedule.slice(0, 12);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Amortization Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Month</th>
              <th className="text-right py-2 px-2">Payment</th>
              <th className="text-right py-2 px-2">Principal</th>
              <th className="text-right py-2 px-2">Interest</th>
              <th className="text-right py-2 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displaySchedule.map((entry) => (
              <tr key={entry.month} className="border-b border-muted">
                <td className="py-2 px-2">{entry.month}</td>
                <td className="text-right py-2 px-2">
                  {formatCurrency(entry.payment)}
                </td>
                <td className="text-right py-2 px-2">
                  {formatCurrency(entry.principal)}
                </td>
                <td className="text-right py-2 px-2">
                  {formatCurrency(entry.interest)}
                </td>
                <td className="text-right py-2 px-2">
                  {formatCurrency(entry.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schedule.length > 12 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {expanded ? 'Show less' : `Show all ${schedule.length} months`}
        </button>
      )}
    </div>
  );
}

/**
 * Payment breakdown component showing pie chart-like visualization
 */
function PaymentBreakdown({ results }: { results: MortgageResults }) {
  const breakdown = [
    { label: 'Principal & Interest', value: results.principalAndInterest, color: 'bg-blue-500' },
    { label: 'Property Tax', value: results.monthlyTax, color: 'bg-green-500' },
    { label: 'Home Insurance', value: results.monthlyInsurance, color: 'bg-yellow-500' },
    { label: 'PMI', value: results.monthlyPMI, color: 'bg-red-500' },
    { label: 'HOA Fees', value: results.monthlyHOA, color: 'bg-purple-500' },
  ].filter(item => item.value > 0);

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Payment Breakdown</h4>
      {breakdown.map((item) => (
        <div key={item.label} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', item.color)} />
            <span>{item.label}</span>
          </div>
          <span className="font-medium">{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}


/**
 * Mortgage Calculator Component
 * 
 * A comprehensive mortgage calculator that computes monthly payments
 * including principal, interest, taxes, insurance, PMI, and HOA fees.
 * 
 * Features:
 * - Real-time calculation
 * - Down payment percentage sync
 * - Automatic PMI estimation
 * - Full amortization schedule
 * - Payment breakdown visualization
 * 
 * @see Requirements 5.1
 */
export function MortgageCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<MortgageFormInputs, MortgageResults>({
    initialInputs: INITIAL_INPUTS,
    schema: mortgageSchema,
    calculate: (formInputs) => {
      const mortgageInputs: MortgageInputs = {
        homePrice: formInputs.homePrice,
        downPayment: formInputs.downPayment,
        loanTerm: formInputs.loanTerm,
        interestRate: formInputs.interestRate,
        propertyTax: formInputs.propertyTax,
        homeInsurance: formInputs.homeInsurance,
        pmi: formInputs.pmi,
        hoaFees: formInputs.hoaFees,
      };
      return calculateMortgage(mortgageInputs);
    },
    storageKey: 'mortgage-calculator',
  });

  // Sync down payment amount and percentage
  const handleHomePriceChange = (value: number) => {
    setInput('homePrice', value);
    // Recalculate down payment from percentage
    const newDownPayment = calculateDownPaymentFromPercent(value, inputs.downPaymentPercent);
    setInput('downPayment', newDownPayment);
    // Update PMI if needed
    updatePMI(value, newDownPayment);
  };

  const handleDownPaymentChange = (value: number) => {
    setInput('downPayment', value);
    const percent = calculateDownPaymentPercent(inputs.homePrice, value);
    setInput('downPaymentPercent', percent);
    updatePMI(inputs.homePrice, value);
  };

  const handleDownPaymentPercentChange = (value: number) => {
    setInput('downPaymentPercent', value);
    const amount = calculateDownPaymentFromPercent(inputs.homePrice, value);
    setInput('downPayment', amount);
    updatePMI(inputs.homePrice, amount);
  };

  const updatePMI = (homePrice: number, downPayment: number) => {
    const percent = calculateDownPaymentPercent(homePrice, downPayment);
    if (isPMIRequired(percent)) {
      const loanAmount = homePrice - downPayment;
      const estimatedPMI = estimatePMI(loanAmount);
      setInput('pmi', Math.round(estimatedPMI * 100) / 100);
    } else {
      setInput('pmi', 0);
    }
  };

  const handleLoanTermChange = (value: string) => {
    setInput('loanTerm', parseInt(value, 10));
  };

  // Calculate on mount with initial values
  React.useEffect(() => {
    calculate();
  }, []);

  const formula = 'M = P × [r(1+r)^n] / [(1+r)^n - 1]';
  const formulaExplanation = 'Where M = Monthly payment, P = Principal, r = Monthly interest rate, n = Number of payments';

  return (
    <CalculatorBase
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payment including PMI, taxes, and insurance"
      formula={formula}
      formulaExplanation={formulaExplanation}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Monthly Payment"
              value={formatCurrency(results.monthlyPayment)}
              highlight
              copyable
            />
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Principal & Interest"
                value={formatCurrency(results.principalAndInterest)}
                copyable
              />
              <ResultDisplay
                label="Loan Amount"
                value={formatCurrency(results.loanAmount)}
                copyable
              />
              <ResultDisplay
                label="Total Interest"
                value={formatCurrency(results.totalInterest)}
                copyable
              />
              <ResultDisplay
                label="Total Payment"
                value={formatCurrency(results.totalPayment)}
                copyable
              />
            </div>
            <PaymentBreakdown results={results} />
            <AmortizationSchedule schedule={results.amortizationSchedule} />
          </div>
        )
      }
    >
      {/* Home Price */}
      <NumberInput
        id="homePrice"
        label="Home Price"
        value={inputs.homePrice}
        onChange={handleHomePriceChange}
        min={1000}
        max={100000000}
        step={1000}
        unit="$"
        error={errors.homePrice}
        required
      />

      {/* Down Payment */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="downPayment"
          label="Down Payment"
          value={inputs.downPayment}
          onChange={handleDownPaymentChange}
          min={0}
          step={1000}
          unit="$"
          error={errors.downPayment}
        />
        <NumberInput
          id="downPaymentPercent"
          label="Down Payment %"
          value={Math.round(inputs.downPaymentPercent * 100) / 100}
          onChange={handleDownPaymentPercentChange}
          min={0}
          max={99.99}
          step={0.5}
          unit="%"
          error={errors.downPaymentPercent}
        />
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          id="loanTerm"
          label="Loan Term"
          value={String(inputs.loanTerm)}
          onChange={handleLoanTermChange}
          options={LOAN_TERM_OPTIONS}
          error={errors.loanTerm}
          required
        />
        <NumberInput
          id="interestRate"
          label="Interest Rate"
          value={inputs.interestRate}
          onChange={(v) => setInput('interestRate', v)}
          min={0}
          max={30}
          step={0.125}
          unit="%"
          error={errors.interestRate}
          required
        />
      </div>

      {/* Taxes and Insurance */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="propertyTax"
          label="Annual Property Tax"
          value={inputs.propertyTax}
          onChange={(v) => setInput('propertyTax', v)}
          min={0}
          step={100}
          unit="$/yr"
          error={errors.propertyTax}
        />
        <NumberInput
          id="homeInsurance"
          label="Annual Home Insurance"
          value={inputs.homeInsurance}
          onChange={(v) => setInput('homeInsurance', v)}
          min={0}
          step={100}
          unit="$/yr"
          error={errors.homeInsurance}
        />
      </div>

      {/* PMI and HOA */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="pmi"
          label="Monthly PMI"
          value={inputs.pmi}
          onChange={(v) => setInput('pmi', v)}
          min={0}
          step={10}
          unit="$/mo"
          error={errors.pmi}
        />
        <NumberInput
          id="hoaFees"
          label="Monthly HOA Fees"
          value={inputs.hoaFees}
          onChange={(v) => setInput('hoaFees', v)}
          min={0}
          step={25}
          unit="$/mo"
          error={errors.hoaFees}
        />
      </div>

      {/* PMI Notice */}
      {isPMIRequired(inputs.downPaymentPercent) && (
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 PMI is typically required when down payment is less than 20%. 
          PMI can be removed once you reach 20% equity.
        </p>
      )}
    </CalculatorBase>
  );
}

export default MortgageCalculator;
