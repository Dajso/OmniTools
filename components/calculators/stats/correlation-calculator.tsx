'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  calculateCorrelation,
  parsePairedData,
  type CorrelationResult,
} from '@/lib/calculations/stats';
import { cn } from '@/lib/utils';

/**
 * Correlation Coefficient Calculator Component
 * 
 * Calculates Pearson correlation coefficient and displays
 * scatter plot with regression line.
 * 
 * @see Requirements 29.7
 */
export function CorrelationCalculator() {
  const [dataInput, setDataInput] = React.useState(
    '1, 2\n2, 4\n3, 5\n4, 4\n5, 5\n6, 7\n7, 8\n8, 9\n9, 10\n10, 11'
  );
  const [result, setResult] = React.useState<CorrelationResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const { xValues, yValues } = parsePairedData(dataInput);
      const correlationResult = calculateCorrelation({ xValues, yValues });
      setResult(correlationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [dataInput]);

  const reset = () => {
    setDataInput('1, 2\n2, 4\n3, 5\n4, 4\n5, 5\n6, 7\n7, 8\n8, 9\n9, 10\n10, 11');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Prepare scatter plot data
  const scatterData = React.useMemo(() => {
    try {
      const { xValues, yValues } = parsePairedData(dataInput);
      return xValues.map((x, i) => ({ x, y: yValues[i] }));
    } catch {
      return [];
    }
  }, [dataInput]);

  // Calculate regression line points
  const regressionLine = React.useMemo(() => {
    if (!result || scatterData.length === 0) return [];
    const xMin = Math.min(...scatterData.map(d => d.x));
    const xMax = Math.max(...scatterData.map(d => d.x));
    return [
      { x: xMin, y: result.regression.slope * xMin + result.regression.intercept },
      { x: xMax, y: result.regression.slope * xMax + result.regression.intercept },
    ];
  }, [result, scatterData]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'perfect':
      case 'very-strong':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'strong':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'weak':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <CalculatorBase
      title="Correlation Coefficient Calculator"
      description="Calculate Pearson correlation coefficient (r) and linear regression"
      formula="r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)"
      formulaExplanation="Pearson's r measures the linear relationship between two variables, ranging from -1 (perfect negative) to +1 (perfect positive)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-6">
          {/* Main Result */}
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Pearson Correlation Coefficient (r)</p>
            <p className="text-4xl font-bold text-primary">{result.pearsonR.toFixed(4)}</p>
            <p className={cn(
              'text-sm mt-2 px-3 py-1 rounded-full inline-block border',
              getStrengthColor(result.strength)
            )}>
              {result.interpretation}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ResultDisplay
              label="R-Squared (R²)"
              value={(result.rSquared * 100).toFixed(2) + '%'}
              copyable
            />
            <ResultDisplay
              label="P-Value"
              value={result.pValue < 0.0001 ? '< 0.0001' : result.pValue.toFixed(4)}
              copyable
            />
            <ResultDisplay
              label="Sample Size"
              value={result.sampleSize.toString()}
              copyable
            />
          </div>

          {/* Significance */}
          <div className={cn(
            'p-3 rounded-lg border',
            result.isSignificant ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          )}>
            <p className={cn(
              'text-sm font-medium',
              result.isSignificant ? 'text-green-700' : 'text-yellow-700'
            )}>
              {result.isSignificant 
                ? '✓ Statistically significant correlation (p < 0.05)'
                : '⚠ Not statistically significant (p ≥ 0.05)'}
            </p>
          </div>

          {/* Scatter Plot */}
          {scatterData.length > 0 && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-4 text-center">Scatter Plot with Regression Line</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      name="X"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      dataKey="y" 
                      type="number" 
                      name="Y"
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter 
                      name="Data Points" 
                      data={scatterData} 
                      fill="#6366f1"
                    />
                    {regressionLine.length === 2 && (
                      <ReferenceLine
                        segment={[
                          { x: regressionLine[0].x, y: regressionLine[0].y },
                          { x: regressionLine[1].x, y: regressionLine[1].y },
                        ]}
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Regression Equation */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Linear Regression</h4>
            <code className="text-lg font-mono bg-background px-3 py-1 rounded">
              {result.regression.equation}
            </code>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <ResultDisplay
                label="Slope"
                value={result.regression.slope.toFixed(4)}
                copyable
              />
              <ResultDisplay
                label="Y-Intercept"
                value={result.regression.intercept.toFixed(4)}
                copyable
              />
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 R² = {(result.rSquared * 100).toFixed(1)}% means that {(result.rSquared * 100).toFixed(1)}% 
              of the variance in Y can be explained by X. 
              {result.direction === 'positive' 
                ? ' As X increases, Y tends to increase.'
                : result.direction === 'negative'
                ? ' As X increases, Y tends to decrease.'
                : ' There is no clear linear relationship.'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="data-input">Enter Data Pairs (X, Y)</Label>
          <textarea
            id="data-input"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md bg-background min-h-[150px] font-mono text-sm"
            placeholder="Enter X,Y pairs, one per line:&#10;1, 2&#10;2, 4&#10;3, 5&#10;..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter one X,Y pair per line, separated by comma, tab, or space
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CorrelationCalculator;
