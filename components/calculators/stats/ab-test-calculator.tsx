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
import { formatFixed } from '@/lib/utils/formatting';

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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      name: 'Kontrollgruppe',
      rate: result.controlRate,
      fill: '#6b7280',
    },
    {
      name: 'Testgruppe',
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
      title="A/B-test: Er resultatet signifikant?"
      description="Finn ut om resultatene fra A/B-testen din er statistisk signifikante"
      formula="z = (p₁ - p₂) / √(p̂(1-p̂)(1/n₁ + 1/n₂))"
      formulaExplanation="To-proporsjons z-test som sammenligner konverteringsrater mellom kontroll- og testgruppen."
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
                  ? '🎉 Vinner! Testgruppen er best'
                  : '📉 Kontrollgruppen er best'
                : '⏳ Ikke signifikant ennå'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {result.isSignificant
                ? `${formatFixed(result.confidenceLevel, 1)} % konfidens`
                : 'Trenger mer data eller større effekt'}
            </p>
          </div>

          {/* Conversion Rates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Kontrollgruppe</p>
              <p className="text-3xl font-bold">{formatFixed(result.controlRate, 2)}%</p>
              <p className="text-xs text-muted-foreground">
                {controlConversions} / {controlVisitors} besøkende
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg border',
              result.relativeLift > 0 ? 'bg-green-50' : 'bg-red-50'
            )}>
              <p className="text-sm text-muted-foreground">Testgruppe</p>
              <p className="text-3xl font-bold">{formatFixed(result.treatmentRate, 2)}%</p>
              <p className="text-xs text-muted-foreground">
                {treatmentConversions} / {treatmentVisitors} besøkende
              </p>
            </div>
          </div>

          {/* Lift */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Relativ økning"
              value={`${result.relativeLift > 0 ? '+' : ''}${formatFixed(result.relativeLift, 2)}%`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Absolutt økning"
              value={`${result.absoluteLift > 0 ? '+' : ''}${formatFixed(result.absoluteLift, 2)}%`}
              copyable
            />
          </div>

          {/* Chart */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-4 text-center">Sammenligning av konverteringsrate</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip formatter={(value) => [`${typeof value === 'number' ? formatFixed(value, 2) : value} %`, 'Konverteringsrate']} />
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
              label="P-verdi"
              value={result.pValue < 0.0001 ? '< 0.0001' : formatFixed(result.pValue, 4)}
              copyable
            />
            <ResultDisplay
              label="Z-verdi"
              value={formatFixed(result.zScore, 4)}
              copyable
            />
            <ResultDisplay
              label="Konfidens"
              value={`${formatFixed(result.confidenceLevel, 2)}%`}
              copyable
            />
            <ResultDisplay
              label="Standardfeil"
              value={formatFixed(result.standardError, 6)}
              copyable
            />
          </div>

          {/* Confidence Interval */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">95 % konfidensintervall for forskjellen</h4>
            <p className="text-lg font-mono">
              [{formatFixed(result.confidenceInterval.lower, 2)}%, {formatFixed(result.confidenceInterval.upper, 2)}%]
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Den sanne forskjellen i konverteringsrate ligger trolig innenfor dette intervallet
            </p>
          </div>

          {/* Sample Size Recommendation */}
          {minSampleSize && !result.isSignificant && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">📊 Anbefalt utvalgsstørrelse</h4>
              <p className="text-sm text-blue-600">
                For å oppdage en relativ økning på 10 % med 80 % styrke trenger du omtrent{' '}
                <strong>{minSampleSize.toLocaleString('nb-NO')}</strong> besøkende per variant.
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 En p-verdi under 0,05 betyr statistisk signifikans på 95 % konfidensnivå.
              {result.isSignificant
                ? 'Resultatene dine skyldes neppe tilfeldigheter.'
                : 'Fortsett testen for å samle mer data.'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        {/* Control Group */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Kontrollgruppe (A)</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="control-visitors"
              label="Besøkende"
              value={controlVisitors}
              onChange={setControlVisitors}
              min={1}
              step={100}
            />
            <NumberInput
              id="control-conversions"
              label="Konverteringer"
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
          <h3 className="font-medium mb-3">Testgruppe (B)</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="treatment-visitors"
              label="Besøkende"
              value={treatmentVisitors}
              onChange={setTreatmentVisitors}
              min={1}
              step={100}
            />
            <NumberInput
              id="treatment-conversions"
              label="Konverteringer"
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
