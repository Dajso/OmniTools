'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ErrorBar,
} from 'recharts';
import {
  calculateABTestSignificance,
  calculateMinimumSampleSize,
  type ABTestResult,
} from '@/lib/calculations/stats';
import { cn } from '@/lib/utils';

/**
 * A/B Test Significance Calculator Component
 * 
 * Calculates statistical significance for A/B test results
 * using a two-proportion z-test.
 * 
 * @see Requirements 29.8
 */
export function ABTestCalculator() {
  const [controlVisitors, setControlVisitors] = React.useState(1000);
  const [controlConversions, setControlConversions] = React.useState(50);
  const [treatmentVisitors, setTreatmentVisitors] = React.useState(1000);
  const [treatmentConversions, setTreatmentConversions] = React.useState(65);
  const [result, setResult] = React.useState<ABTestResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const abTestResult = calculateABTestSignificance({
        controlVisitors,
        controlConversions,
        treatmentVisitors,
        treatmentConversions,
      });
      setResult(abTestResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [controlVisitors, controlConversions, treatmentVisitors, treatmentConversions]);

  const reset = () => {
    setControlVisitors(1000);
    setControlConversions(50);
    setTreatmentVisitors(1000);
    setTreatmentConversions(65);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Chart data
  const chartData = result ? [
    {
      name: 'Control',
      rate: result.controlRate,
      fill: '#6b7280',
    },
    {
      name: 'Treatment',
      rate: result.treatmentRate,
      fill: result.isSignificant && result.relativeLift > 0 ? '#22c55e' : result.isSignificant ? '#ef4444' : '#6366f1',
    },
  ] : [];

  // Calculate minimum sample size for planning
  const minSampleSize = result && result.controlRate > 0
    ? calculateMinimumSampleSize(result.controlRate / 100, 0.1)
    : null;

  return (
    <CalculatorBase
      title="A/B Test Significance Calculator"
      description="Determine if your A/B test results are statistically significant"
      formula="z = (p₁ - p₂) / √(p̂(1-p̂)(1/n₁ + 1/n₂))"
      formulaExplanation="Two-proportion z-test comparing conversion rates between control and treatment groups."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-6">
          {/* Main Result */}
          <div className={cn(
            'text-center p-6 rounded-lg border-2',
            result.isSignificant
              ? result.relativeLift > 0
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
              : 'bg-yellow-50 border-yellow-300'
          )}>
            <p className={cn(
              'text-2xl font-bold',
              result.isSignificant
                ? result.relativeLift > 0 ? 'text-green-700' : 'text-red-700'
                : 'text-yellow-700'
            )}>
              {result.isSignificant
                ? result.relativeLift > 0
                  ? '🎉 Winner! Treatment is better'
                  : '📉 Control is better'
                : '⏳ Not yet significant'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {result.isSignificant
                ? `${result.confidenceLevel.toFixed(1)}% confidence`
                : 'Need more data or larger effect'}
            </p>
          </div>

          {/* Conversion Rates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Control</p>
              <p className="text-3xl font-bold">{result.controlRate.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">
                {controlConversions} / {controlVisitors} visitors
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg border',
              result.relativeLift > 0 ? 'bg-green-50' : 'bg-red-50'
            )}>
              <p className="text-sm text-muted-foreground">Treatment</p>
              <p className="text-3xl font-bold">{result.treatmentRate.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">
                {treatmentConversions} / {treatmentVisitors} visitors
              </p>
            </div>
          </div>

          {/* Lift */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Relative Lift"
              value={`${result.relativeLift > 0 ? '+' : ''}${result.relativeLift.toFixed(2)}%`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Absolute Lift"
              value={`${result.absoluteLift > 0 ? '+' : ''}${result.absoluteLift.toFixed(2)}%`}
              copyable
            />
          </div>

          {/* Chart */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-4 text-center">Conversion Rate Comparison</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}%`, 'Conversion Rate']} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistical Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultDisplay
              label="P-Value"
              value={result.pValue < 0.0001 ? '< 0.0001' : result.pValue.toFixed(4)}
              copyable
            />
            <ResultDisplay
              label="Z-Score"
              value={result.zScore.toFixed(4)}
              copyable
            />
            <ResultDisplay
              label="Confidence"
              value={`${result.confidenceLevel.toFixed(2)}%`}
              copyable
            />
            <ResultDisplay
              label="Standard Error"
              value={result.standardError.toFixed(6)}
              copyable
            />
          </div>

          {/* Confidence Interval */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">95% Confidence Interval for Difference</h4>
            <p className="text-lg font-mono">
              [{result.confidenceInterval.lower.toFixed(2)}%, {result.confidenceInterval.upper.toFixed(2)}%]
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The true difference in conversion rates is likely within this range
            </p>
          </div>

          {/* Sample Size Recommendation */}
          {minSampleSize && !result.isSignificant && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">📊 Sample Size Recommendation</h4>
              <p className="text-sm text-blue-600">
                To detect a 10% relative lift with 80% power, you need approximately{' '}
                <strong>{minSampleSize.toLocaleString()}</strong> visitors per variation.
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 A p-value below 0.05 indicates statistical significance at the 95% confidence level.
              {result.isSignificant
                ? ' Your results are unlikely to be due to random chance.'
                : ' Continue running the test to gather more data.'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        {/* Control Group */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Control Group (A)</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="control-visitors"
              label="Visitors"
              value={controlVisitors}
              onChange={setControlVisitors}
              min={1}
              step={100}
            />
            <NumberInput
              id="control-conversions"
              label="Conversions"
              value={controlConversions}
              onChange={setControlConversions}
              min={0}
              max={controlVisitors}
              step={1}
            />
          </div>
        </div>

        {/* Treatment Group */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium mb-3">Treatment Group (B)</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="treatment-visitors"
              label="Visitors"
              value={treatmentVisitors}
              onChange={setTreatmentVisitors}
              min={1}
              step={100}
            />
            <NumberInput
              id="treatment-conversions"
              label="Conversions"
              value={treatmentConversions}
              onChange={setTreatmentConversions}
              min={0}
              max={treatmentVisitors}
              step={1}
            />
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ABTestCalculator;
