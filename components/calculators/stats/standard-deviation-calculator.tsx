'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculateDescriptiveStats,
  parseNumberList,
  type DescriptiveStats,
} from '@/lib/calculations/stats';

/**
 * Standard Deviation Calculator Component
 * 
 * Calculates standard deviation, variance, mean, median, mode,
 * and other descriptive statistics from a dataset.
 * 
 * @see Requirements 29.3
 */
export function StandardDeviationCalculator() {
  const [dataInput, setDataInput] = React.useState('10, 12, 23, 23, 16, 23, 21, 16');
  const [result, setResult] = React.useState<DescriptiveStats | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const numbers = parseNumberList(dataInput);
      if (numbers.length === 0) {
        throw new Error('Please enter at least one number');
      }
      const stats = calculateDescriptiveStats(numbers);
      setResult(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [dataInput]);

  const reset = () => {
    setDataInput('10, 12, 23, 23, 16, 23, 21, 16');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Standard Deviation Calculator"
      description="Calculate standard deviation, variance, mean, median, mode, and other statistics"
      formula="σ = √(Σ(x - μ)² / N) or s = √(Σ(x - x̄)² / (n-1))"
      formulaExplanation="Population standard deviation (σ) divides by N, while sample standard deviation (s) divides by n-1 (Bessel's correction)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Sample Standard Deviation"
              value={result.standardDeviation.toFixed(6)}
              highlight
              copyable
            />
            <ResultDisplay
              label="Population Standard Deviation"
              value={result.populationStandardDeviation.toFixed(6)}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Sample Variance"
              value={result.variance.toFixed(6)}
              copyable
            />
            <ResultDisplay
              label="Population Variance"
              value={result.populationVariance.toFixed(6)}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Central Tendency</h4>
            <div className="grid grid-cols-3 gap-4">
              <ResultDisplay
                label="Mean"
                value={result.mean.toFixed(6)}
                copyable
              />
              <ResultDisplay
                label="Median"
                value={result.median.toFixed(6)}
                copyable
              />
              <ResultDisplay
                label="Mode"
                value={result.mode.length > 0 ? result.mode.join(', ') : 'None'}
                copyable
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Range & Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultDisplay
                label="Minimum"
                value={result.min.toString()}
                copyable
              />
              <ResultDisplay
                label="Maximum"
                value={result.max.toString()}
                copyable
              />
              <ResultDisplay
                label="Range"
                value={result.range.toString()}
                copyable
              />
              <ResultDisplay
                label="Count"
                value={result.count.toString()}
                copyable
              />
            </div>
          </div>

          <ResultDisplay
            label="Sum"
            value={result.sum.toFixed(6)}
            copyable
          />

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Use <strong>sample</strong> standard deviation when your data is a sample from a larger population. 
              Use <strong>population</strong> standard deviation when your data represents the entire population.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="data-input">Enter Your Data</Label>
          <textarea
            id="data-input"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md bg-background min-h-[120px] font-mono text-sm"
            placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 10, 12, 23, 23, 16, 23, 21, 16"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate numbers with commas, spaces, or new lines
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default StandardDeviationCalculator;
