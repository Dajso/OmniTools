'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculateSampleSize,
  COMMON_CONFIDENCE_LEVELS,
  COMMON_MARGINS_OF_ERROR,
  type SampleSizeResult,
} from '@/lib/calculations/stats';

/**
 * Sample Size Calculator Component
 * 
 * Calculates required sample size for surveys and statistical studies
 * based on confidence level, margin of error, and population size.
 * 
 * @see Requirements 29.2, 29.9
 */
export function SampleSizeCalculator() {
  const [confidenceLevel, setConfidenceLevel] = React.useState(0.95);
  const [marginOfError, setMarginOfError] = React.useState(5);
  const [populationSize, setPopulationSize] = React.useState<number | undefined>(undefined);
  const [expectedProportion, setExpectedProportion] = React.useState(50);
  const [useFinitePopulation, setUseFinitePopulation] = React.useState(false);
  const [result, setResult] = React.useState<SampleSizeResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const sampleSizeResult = calculateSampleSize({
        confidenceLevel,
        marginOfError,
        populationSize: useFinitePopulation ? populationSize : undefined,
        expectedProportion: expectedProportion / 100,
      });
      setResult(sampleSizeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [confidenceLevel, marginOfError, populationSize, expectedProportion, useFinitePopulation]);

  const reset = () => {
    setConfidenceLevel(0.95);
    setMarginOfError(5);
    setPopulationSize(undefined);
    setExpectedProportion(50);
    setUseFinitePopulation(false);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Sample Size Calculator"
      description="Calculate the required sample size for surveys and statistical studies"
      formula="n = (Z² × p × (1-p)) / E²"
      formulaExplanation="Where Z = Z-score for confidence level, p = expected proportion, E = margin of error. For finite populations, apply correction: n_adj = n / (1 + (n-1)/N)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Required Sample Size"
            value={result.sampleSize.toLocaleString('nb-NO')}
            highlight
            copyable
          />
          
          {result.adjustedSampleSize && (
            <ResultDisplay
              label="Adjusted Sample Size (Finite Population)"
              value={result.adjustedSampleSize.toLocaleString('nb-NO')}
              copyable
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Confidence Level"
              value={`${(result.confidenceLevel * 100).toFixed(0)}%`}
              copyable
            />
            <ResultDisplay
              label="Margin of Error"
              value={`±${result.marginOfError}%`}
              copyable
            />
          </div>

          <ResultDisplay
            label="Z-Score Used"
            value={result.zScore.toFixed(3)}
            copyable
          />

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 This sample size ensures your survey results will be within ±{result.marginOfError}% 
              of the true population value with {(result.confidenceLevel * 100).toFixed(0)}% confidence.
            </p>
          </div>

          {result.adjustedSampleSize && populationSize && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                📊 With a population of {populationSize.toLocaleString('nb-NO')}, you need to survey{' '}
                <strong>{result.adjustedSampleSize.toLocaleString('nb-NO')}</strong> people 
                ({((result.adjustedSampleSize / populationSize) * 100).toFixed(1)}% of the population).
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="confidence-level">Confidence Level</Label>
          <select
            id="confidence-level"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {COMMON_CONFIDENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Higher confidence requires larger sample sizes
          </p>
        </div>

        <div>
          <Label htmlFor="margin-of-error">Margin of Error</Label>
          <select
            id="margin-of-error"
            value={marginOfError}
            onChange={(e) => setMarginOfError(parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {COMMON_MARGINS_OF_ERROR.map((margin) => (
              <option key={margin.value} value={margin.value}>
                {margin.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Smaller margin of error requires larger sample sizes
          </p>
        </div>

        <NumberInput
          id="expected-proportion"
          label="Expected Proportion"
          value={expectedProportion}
          onChange={setExpectedProportion}
          min={1}
          max={99}
          step={1}
          unit="%"
        />
        <p className="text-xs text-muted-foreground -mt-2">
          Use 50% if unknown (gives maximum sample size)
        </p>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-finite-population"
            checked={useFinitePopulation}
            onChange={(e) => setUseFinitePopulation(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="use-finite-population" className="cursor-pointer">
            I know my population size
          </Label>
        </div>

        {useFinitePopulation && (
          <NumberInput
            id="population-size"
            label="Population Size"
            value={populationSize || 0}
            onChange={(v) => setPopulationSize(v || undefined)}
            min={1}
            step={100}
          />
        )}
      </div>
    </CalculatorBase>
  );
}

export default SampleSizeCalculator;
