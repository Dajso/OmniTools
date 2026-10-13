'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  calculateDiceProbability,
  COMMON_DICE,
  COMPARISON_OPTIONS,
  type DiceProbabilityResult,
} from '@/lib/calculations/stats';

/**
 * Dice Probability Calculator Component
 * 
 * Calculates probabilities for various dice roll outcomes
 * with distribution visualization.
 * 
 * @see Requirements 29.5
 */
export function DiceProbabilityCalculator() {
  const [numDice, setNumDice] = React.useState(2);
  const [numSides, setNumSides] = React.useState(6);
  const [targetSum, setTargetSum] = React.useState<number | undefined>(7);
  const [comparison, setComparison] = React.useState<'exact' | 'at-least' | 'at-most'>('exact');
  const [result, setResult] = React.useState<DiceProbabilityResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const probabilityResult = calculateDiceProbability({
        numDice,
        numSides,
        targetSum,
        comparison,
      });
      setResult(probabilityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [numDice, numSides, targetSum, comparison]);

  const reset = () => {
    setNumDice(2);
    setNumSides(6);
    setTargetSum(7);
    setComparison('exact');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Prepare chart data - limit to reasonable display
  const chartData = result?.distribution.slice(0, 30).map((d) => ({
    sum: d.sum.toString(),
    probability: d.probability * 100,
    count: d.count,
    isTarget: targetSum !== undefined && (
      (comparison === 'exact' && d.sum === targetSum) ||
      (comparison === 'at-least' && d.sum >= targetSum) ||
      (comparison === 'at-most' && d.sum <= targetSum)
    ),
  })) || [];

  return (
    <CalculatorBase
      title="Dice Probability Calculator"
      description="Calculate the probability of rolling specific sums with multiple dice"
      formula="P(sum) = favorable outcomes / total outcomes"
      formulaExplanation={`Total outcomes for ${numDice}d${numSides} = ${numSides}^${numDice} = ${Math.pow(numSides, numDice).toLocaleString('nb-NO')}`}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-6">
          {/* Main Result */}
          {targetSum !== undefined && (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Probability of rolling {comparison === 'exact' ? 'exactly' : comparison === 'at-least' ? 'at least' : 'at most'} {targetSum}
              </p>
              <p className="text-4xl font-bold text-primary">{result.percentage}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.odds}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultDisplay
              label="Mean (Expected)"
              value={result.statistics.mean.toFixed(2)}
              copyable
            />
            <ResultDisplay
              label="Std Deviation"
              value={result.statistics.standardDeviation.toFixed(2)}
              copyable
            />
            <ResultDisplay
              label="Min Possible"
              value={result.statistics.min.toString()}
              copyable
            />
            <ResultDisplay
              label="Max Possible"
              value={result.statistics.max.toString()}
              copyable
            />
          </div>

          {/* Distribution Chart */}
          {chartData.length > 0 && chartData.length <= 30 && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-4 text-center">Probability Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="sum"
                      tick={{ fontSize: 10 }}
                      interval={chartData.length > 15 ? 1 : 0}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${typeof value === 'number' ? value.toFixed(0) : value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Probability']}
                      labelFormatter={(label) => `Sum: ${label}`}
                    />
                    <Bar dataKey="probability" radius={[2, 2, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isTarget ? '#22c55e' : '#6b7280'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {targetSum !== undefined && (
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded" /> Target
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-500 rounded" /> Other
                  </span>
                </div>
              )}
            </div>
          )}

          {chartData.length > 30 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-700">
                📊 Distribution chart hidden for large ranges. The distribution has {result.distribution.length} possible outcomes.
              </p>
            </div>
          )}

          {/* Outcome Details */}
          {targetSum !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Favorable Outcomes"
                value={result.favorableOutcomes.toLocaleString('nb-NO')}
                copyable
              />
              <ResultDisplay
                label="Total Outcomes"
                value={result.totalOutcomes.toLocaleString('nb-NO')}
                copyable
              />
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Rolling {numDice}d{numSides} (
              {numDice} {numDice === 1 ? 'die' : 'dice'} with {numSides} sides each)
              has {result.totalOutcomes.toLocaleString('nb-NO')} possible outcomes.
              The most likely sum is around {result.statistics.mean.toFixed(0)}.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="num-dice"
            label="Number of Dice"
            value={numDice}
            onChange={setNumDice}
            min={1}
            max={20}
            step={1}
          />
          <div>
            <Label htmlFor="num-sides">Dice Type</Label>
            <select
              id="num-sides"
              value={numSides}
              onChange={(e) => setNumSides(parseInt(e.target.value))}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            >
              {COMMON_DICE.map((die) => (
                <option key={die.value} value={die.value}>
                  {die.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="comparison">Comparison</Label>
            <select
              id="comparison"
              value={comparison}
              onChange={(e) => setComparison(e.target.value as 'exact' | 'at-least' | 'at-most')}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            >
              {COMPARISON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <NumberInput
            id="target-sum"
            label="Target Sum"
            value={targetSum || 0}
            onChange={(v) => setTargetSum(v || undefined)}
            min={numDice}
            max={numDice * numSides}
            step={1}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Valid sums range from {numDice} to {numDice * numSides}
        </p>
      </div>
    </CalculatorBase>
  );
}

export default DiceProbabilityCalculator;
