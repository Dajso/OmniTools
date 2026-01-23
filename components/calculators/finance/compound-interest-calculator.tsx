'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCompoundInterest,
  calculateRuleOf72,
  type CompoundInterestInputs,
  type CompoundInterestResults,
  type CompoundingFrequency,
  type ContributionFrequency,
} from '@/lib/calculations/finance/compound-interest';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

/**
 * Zod schema for compound interest calculator inputs
 */
const compoundInterestSchema = z.object({
  principal: z.number().min(0, 'Principal cannot be negative').max(1000000000, 'Principal too high'),
  annualRate: z.number().min(0, 'Rate cannot be negative').max(100, 'Rate too high'),
  years: z.number().min(1, 'Must be at least 1 year').max(100, 'Maximum 100 years'),
  compoundingFrequency: z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily']),
  contribution: z.number().min(0, 'Contribution cannot be negative'),
  contributionFrequency: z.enum(['monthly', 'annually']),
  contributionTiming: z.enum(['beginning', 'end']),
});

type CompoundInterestFormInputs = z.infer<typeof compoundInterestSchema>;

const COMPOUNDING_OPTIONS = [
  { value: 'annually', label: 'Annually' },
  { value: 'semi-annually', label: 'Semi-Annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
];

const CONTRIBUTION_FREQ_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
];

const CONTRIBUTION_TIMING_OPTIONS = [
  { value: 'end', label: 'End of Period' },
  { value: 'beginning', label: 'Beginning of Period' },
];

const INITIAL_INPUTS: CompoundInterestFormInputs = {
  principal: 10000,
  annualRate: 7,
  years: 10,
  compoundingFrequency: 'monthly',
  contribution: 200,
  contributionFrequency: 'monthly',
  contributionTiming: 'end',
};


/**
 * Simple bar chart component for growth visualization
 */
function GrowthChart({ data }: { data: CompoundInterestResults['growthData'] }) {
  const maxBalance = Math.max(...data.map(d => d.balance));

  // Show every year for small datasets, otherwise sample
  const displayData = data.length <= 15
    ? data
    : data.filter((_, i) => i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 10) === 0);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Growth Over Time</h3>
      <div className="space-y-2">
        {displayData.map((point) => {
          const contributionPercent = (point.totalContributions / point.balance) * 100;
          const interestPercent = (point.totalInterest / point.balance) * 100;
          const widthPercent = (point.balance / maxBalance) * 100;

          return (
            <div key={point.year} className="flex items-center gap-3">
              <span className="w-16 text-sm text-muted-foreground text-right">
                Year {point.year}
              </span>
              <div className="flex-1 h-6 bg-muted rounded overflow-hidden" style={{ width: `${widthPercent}%`, minWidth: '20%' }}>
                <div className="h-full flex">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${contributionPercent}%` }}
                    title={`Contributions: ${formatCurrency(point.totalContributions)}`}
                  />
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${interestPercent}%` }}
                    title={`Interest: ${formatCurrency(point.totalInterest)}`}
                  />
                </div>
              </div>
              <span className="w-28 text-sm font-medium text-right">
                {formatCurrency(point.balance)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>Contributions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Interest Earned</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Growth summary table
 */
function GrowthTable({ data }: { data: CompoundInterestResults['growthData'] }) {
  const [showAll, setShowAll] = React.useState(false);
  const displayData = showAll ? data : data.slice(0, 11);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Year-by-Year Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Year</th>
              <th className="text-right py-2 px-2">Balance</th>
              <th className="text-right py-2 px-2">Contributions</th>
              <th className="text-right py-2 px-2">Interest</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((point) => (
              <tr key={point.year} className="border-b border-muted">
                <td className="py-2 px-2">{point.year}</td>
                <td className="text-right py-2 px-2">{formatCurrency(point.balance)}</td>
                <td className="text-right py-2 px-2">{formatCurrency(point.totalContributions)}</td>
                <td className="text-right py-2 px-2 text-green-600">{formatCurrency(point.totalInterest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 11 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {showAll ? 'Show less' : `Show all ${data.length} years`}
        </button>
      )}
    </div>
  );
}


/**
 * Compound Interest Calculator Component
 * 
 * A comprehensive compound interest calculator that shows:
 * - Final balance with contributions
 * - Interest earned breakdown
 * - Visual growth chart
 * - Year-by-year data table
 * 
 * @see Requirements 5.10
 */

function calculateCompoundInterestFn(formInputs: CompoundInterestFormInputs): CompoundInterestResults {
  const calcInputs: CompoundInterestInputs = {
    principal: formInputs.principal,
    annualRate: formInputs.annualRate,
    years: formInputs.years,
    compoundingFrequency: formInputs.compoundingFrequency as CompoundingFrequency,
    contribution: formInputs.contribution,
    contributionFrequency: formInputs.contributionFrequency as ContributionFrequency,
    contributionTiming: formInputs.contributionTiming as 'beginning' | 'end',
  };
  return calculateCompoundInterest(calcInputs);
}

export function CompoundInterestCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<CompoundInterestFormInputs, CompoundInterestResults>({
    initialInputs: INITIAL_INPUTS,
    schema: compoundInterestSchema,
    calculate: calculateCompoundInterestFn,
    storageKey: 'compound-interest-calculator',
  });

  // Calculate on mount
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const ruleOf72Years = calculateRuleOf72(inputs.annualRate);

  const formula = 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]';
  const formulaExplanation = 'Where A = Final amount, P = Principal, r = Annual rate, n = Compounding periods, t = Years, PMT = Contribution';

  return (
    <CalculatorBase
      title="Compound Interest Calculator"
      description="Calculate how your investments grow over time with compound interest and regular contributions"
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
              label="Final Balance"
              value={formatCurrency(results.finalBalance)}
              highlight
              copyable
            />
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total Contributions"
                value={formatCurrency(results.totalContributions)}
                copyable
              />
              <ResultDisplay
                label="Total Interest Earned"
                value={formatCurrency(results.totalInterest)}
                copyable
              />
              <ResultDisplay
                label="Effective Annual Rate"
                value={formatPercent(results.effectiveAnnualRate / 100, { decimals: 2 })}
                copyable
              />
              <ResultDisplay
                label="Interest as % of Final"
                value={formatPercent(results.totalInterest / results.finalBalance, { decimals: 1 })}
                copyable
              />
            </div>

            <GrowthChart data={results.growthData} />
            <GrowthTable data={results.growthData} />
          </div>
        )
      }
    >
      {/* Initial Investment */}
      <NumberInput
        id="principal"
        label="Initial Investment"
        value={inputs.principal}
        onChange={(v) => setInput('principal', v)}
        min={0}
        step={1000}
        unit="$"
        error={errors.principal}
        required
      />

      {/* Interest Rate and Years */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="annualRate"
          label="Annual Interest Rate"
          value={inputs.annualRate}
          onChange={(v) => setInput('annualRate', v)}
          min={0}
          max={100}
          step={0.1}
          unit="%"
          error={errors.annualRate}
          required
        />
        <NumberInput
          id="years"
          label="Investment Period"
          value={inputs.years}
          onChange={(v) => setInput('years', v)}
          min={1}
          max={100}
          step={1}
          unit="years"
          error={errors.years}
          required
        />
      </div>

      {/* Compounding Frequency */}
      <SelectInput
        id="compoundingFrequency"
        label="Compounding Frequency"
        value={inputs.compoundingFrequency}
        onChange={(v) => setInput('compoundingFrequency', v as CompoundingFrequency)}
        options={COMPOUNDING_OPTIONS}
        error={errors.compoundingFrequency}
      />

      {/* Regular Contributions */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="contribution"
          label="Regular Contribution"
          value={inputs.contribution}
          onChange={(v) => setInput('contribution', v)}
          min={0}
          step={50}
          unit="$"
          error={errors.contribution}
        />
        <SelectInput
          id="contributionFrequency"
          label="Contribution Frequency"
          value={inputs.contributionFrequency}
          onChange={(v) => setInput('contributionFrequency', v as ContributionFrequency)}
          options={CONTRIBUTION_FREQ_OPTIONS}
          error={errors.contributionFrequency}
        />
      </div>

      {/* Contribution Timing */}
      <SelectInput
        id="contributionTiming"
        label="Contribution Timing"
        value={inputs.contributionTiming}
        onChange={(v) => setInput('contributionTiming', v as 'beginning' | 'end')}
        options={CONTRIBUTION_TIMING_OPTIONS}
        error={errors.contributionTiming}
      />

      {/* Rule of 72 Info */}
      {inputs.annualRate > 0 && (
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 Rule of 72: At {inputs.annualRate}% interest, your money will double in approximately{' '}
          <strong>{ruleOf72Years.toFixed(1)} years</strong>.
        </p>
      )}
    </CalculatorBase>
  );
}

export default CompoundInterestCalculator;
