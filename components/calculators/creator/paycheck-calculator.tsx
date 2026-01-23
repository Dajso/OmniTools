'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { formatCurrency } from '@/lib/utils/formatting';

const paycheckSchema = z.object({
  hourlyRate: z.number().min(0, 'Hourly rate cannot be negative'),
  hoursPerWeek: z.number().min(0, 'Hours cannot be negative').max(168, 'Max 168 hours per week'),
  overtimeHours: z.number().min(0, 'Overtime hours cannot be negative'),
  overtimeMultiplier: z.number().min(1, 'Overtime multiplier must be at least 1'),
  payFrequency: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
});

type PaycheckInputs = z.infer<typeof paycheckSchema>;

interface PaycheckResults {
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  weeklyPay: number;
  biweeklyPay: number;
  semimonthlyPay: number;
  monthlyPay: number;
  annualPay: number;
}

const INITIAL_INPUTS: PaycheckInputs = {
  hourlyRate: 25,
  hoursPerWeek: 40,
  overtimeHours: 0,
  overtimeMultiplier: 1.5,
  payFrequency: 'biweekly',
};

const PAY_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly (52 paychecks/year)' },
  { value: 'biweekly', label: 'Bi-weekly (26 paychecks/year)' },
  { value: 'semimonthly', label: 'Semi-monthly (24 paychecks/year)' },
  { value: 'monthly', label: 'Monthly (12 paychecks/year)' },
];

function calculatePaycheck(inputs: PaycheckInputs): PaycheckResults {
  const { hourlyRate, hoursPerWeek, overtimeHours, overtimeMultiplier } = inputs;

  const regularPay = hourlyRate * hoursPerWeek;
  const overtimePay = hourlyRate * overtimeMultiplier * overtimeHours;
  const grossPay = regularPay + overtimePay;

  const weeklyPay = grossPay;
  const biweeklyPay = weeklyPay * 2;
  const semimonthlyPay = (weeklyPay * 52) / 24;
  const monthlyPay = (weeklyPay * 52) / 12;
  const annualPay = weeklyPay * 52;

  return {
    regularPay,
    overtimePay,
    grossPay,
    weeklyPay,
    biweeklyPay,
    semimonthlyPay,
    monthlyPay,
    annualPay,
  };
}

export function PaycheckCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<PaycheckInputs, PaycheckResults>({
      initialInputs: INITIAL_INPUTS,
      schema: paycheckSchema,
      calculate: calculatePaycheck,
      storageKey: 'paycheck-calculator',
    });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getPaycheckAmount = () => {
    if (!results) return 0;
    switch (inputs.payFrequency) {
      case 'weekly':
        return results.weeklyPay;
      case 'biweekly':
        return results.biweeklyPay;
      case 'semimonthly':
        return results.semimonthlyPay;
      case 'monthly':
        return results.monthlyPay;
      default:
        return results.biweeklyPay;
    }
  };

  return (
    <CalculatorBase
      title="Paycheck Calculator"
      description="Calculate your gross pay from hourly rate to weekly, bi-weekly, and monthly amounts"
      formula="Gross Pay = (Hourly Rate × Hours) + (Hourly Rate × OT Multiplier × OT Hours)"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Your Paycheck"
              value={formatCurrency(getPaycheckAmount())}
              highlight
              copyable
            />

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Regular Pay (Weekly)"
                value={formatCurrency(results.regularPay)}
                copyable
              />
              <ResultDisplay
                label="Overtime Pay (Weekly)"
                value={formatCurrency(results.overtimePay)}
                copyable
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Pay Period Breakdown
              </p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Weekly" value={formatCurrency(results.weeklyPay)} copyable />
                <ResultDisplay
                  label="Bi-weekly"
                  value={formatCurrency(results.biweeklyPay)}
                  copyable
                />
                <ResultDisplay
                  label="Semi-monthly"
                  value={formatCurrency(results.semimonthlyPay)}
                  copyable
                />
                <ResultDisplay label="Monthly" value={formatCurrency(results.monthlyPay)} copyable />
              </div>
            </div>

            <div className="border-t pt-4">
              <ResultDisplay
                label="Annual Gross Pay"
                value={formatCurrency(results.annualPay)}
                highlight
                copyable
              />
            </div>
          </div>
        )
      }
    >
      <NumberInput
        id="hourlyRate"
        label="Hourly Rate"
        value={inputs.hourlyRate}
        onChange={(v) => setInput('hourlyRate', v)}
        min={0}
        step={0.5}
        unit="$/hr"
        error={errors.hourlyRate}
        required
      />

      <NumberInput
        id="hoursPerWeek"
        label="Hours Per Week"
        value={inputs.hoursPerWeek}
        onChange={(v) => setInput('hoursPerWeek', v)}
        min={0}
        max={168}
        step={1}
        unit="hrs"
        error={errors.hoursPerWeek}
        required
      />

      <NumberInput
        id="overtimeHours"
        label="Overtime Hours (Weekly)"
        value={inputs.overtimeHours}
        onChange={(v) => setInput('overtimeHours', v)}
        min={0}
        step={1}
        unit="hrs"
        error={errors.overtimeHours}
      />

      <NumberInput
        id="overtimeMultiplier"
        label="Overtime Multiplier"
        value={inputs.overtimeMultiplier}
        onChange={(v) => setInput('overtimeMultiplier', v)}
        min={1}
        max={3}
        step={0.25}
        unit="×"
        error={errors.overtimeMultiplier}
      />

      <div className="space-y-2">
        <Label htmlFor="payFrequency">Pay Frequency</Label>
        <Select
          id="payFrequency"
          options={PAY_FREQUENCY_OPTIONS}
          value={inputs.payFrequency}
          onChange={(e) =>
            setInput('payFrequency', e.target.value as PaycheckInputs['payFrequency'])
          }
        />
      </div>
    </CalculatorBase>
  );
}

export default PaycheckCalculator;
