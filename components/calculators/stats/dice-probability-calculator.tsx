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
import { formatFixed } from '@/lib/utils/formatting';

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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      title="Sannsynlighetskalkulator for terninger"
      description="Regn ut sannsynligheten for bestemte summer når du kaster flere terninger"
      formula="P(sum) = gunstige utfall / alle utfall"
      formulaExplanation={`Alle utfall for ${numDice}d${numSides} = ${numSides}^${numDice} = ${Math.pow(numSides, numDice).toLocaleString('nb-NO')}`}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-6">
          {/* Main Result */}
          {targetSum !== undefined && (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Sannsynlighet for å få {comparison === 'exact' ? 'nøyaktig' : comparison === 'at-least' ? 'minst' : 'høyst'} {targetSum}
              </p>
              <p className="text-4xl font-bold text-primary">{result.percentage}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.odds}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultDisplay
              label="Gjennomsnitt (forventet)"
              value={formatFixed(result.statistics.mean, 2)}
              copyable
            />
            <ResultDisplay
              label="Standardavvik"
              value={formatFixed(result.statistics.standardDeviation, 2)}
              copyable
            />
            <ResultDisplay
              label="Minste mulige"
              value={result.statistics.min.toString()}
              copyable
            />
            <ResultDisplay
              label="Største mulige"
              value={result.statistics.max.toString()}
              copyable
            />
          </div>

          {/* Distribution Chart */}
          {chartData.length > 0 && chartData.length <= 30 && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-4 text-center">Sannsynlighetsfordeling</h4>
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
                      tickFormatter={(value) => `${typeof value === 'number' ? formatFixed(value, 0) : value} %`}
                    />
                    <Tooltip
                      formatter={(value) => [`${typeof value === 'number' ? formatFixed(value, 2) : value} %`, 'Sannsynlighet']}
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
                    <span className="w-3 h-3 bg-green-500 rounded" /> Valgt sum
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-500 rounded" /> Andre
                  </span>
                </div>
              )}
            </div>
          )}

          {chartData.length > 30 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-700">
                📊 Diagrammet er skjult fordi området er stort. Fordelingen har {result.distribution.length} mulige utfall.
              </p>
            </div>
          )}

          {/* Outcome Details */}
          {targetSum !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Gunstige utfall"
                value={result.favorableOutcomes.toLocaleString('nb-NO')}
                copyable
              />
              <ResultDisplay
                label="Alle utfall"
                value={result.totalOutcomes.toLocaleString('nb-NO')}
                copyable
              />
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Å kaste {numDice}d{numSides} (
              {numDice} {numDice === 1 ? 'terning' : 'terninger'} med {numSides} sider hver) gir {result.totalOutcomes.toLocaleString('nb-NO')} mulige utfall. Den mest sannsynlige summen er rundt {formatFixed(result.statistics.mean, 0)}.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="num-dice"
            label="Antall terninger"
            value={numDice}
            onChange={setNumDice}
            min={1}
            max={20}
            step={1}
          />
          <div>
            <Label htmlFor="num-sides">Terningtype</Label>
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
            <Label htmlFor="comparison">Sammenligning</Label>
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
            label="Ønsket sum"
            value={targetSum || 0}
            onChange={(v) => setTargetSum(v || undefined)}
            min={numDice}
            max={numDice * numSides}
            step={1}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Mulige summer går fra {numDice} til {numDice * numSides}
        </p>
      </div>
    </CalculatorBase>
  );
}

export default DiceProbabilityCalculator;
