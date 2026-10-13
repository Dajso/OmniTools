'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculateZTestPValue,
  calculateTTestPValue,
  calculateChiSquarePValue,
  TEST_TYPES,
  TAIL_TYPES,
  type TestType,
  type TailType,
  type PValueResult,
} from '@/lib/calculations/stats';
import { cn } from '@/lib/utils';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * P-Value Calculator Component
 * 
 * Calculates p-values for various statistical tests including:
 * - Z-Test (Normal Distribution)
 * - T-Test (Student's t-Distribution)
 * - Chi-Square Test
 * 
 * @see Requirements 29.1
 */
export function PValueCalculator() {
  const [testType, setTestType] = React.useState<TestType>('z-test');
  const [tailType, setTailType] = React.useState<TailType>('two-tailed');
  const [testStatistic, setTestStatistic] = React.useState(1.96);
  const [degreesOfFreedom, setDegreesOfFreedom] = React.useState(10);
  const [result, setResult] = React.useState<PValueResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      let pValueResult: PValueResult;

      switch (testType) {
        case 'z-test':
          pValueResult = calculateZTestPValue({ testStatistic, tailType });
          break;
        case 't-test':
          pValueResult = calculateTTestPValue({ testStatistic, degreesOfFreedom, tailType });
          break;
        case 'chi-square':
          pValueResult = calculateChiSquarePValue({ testStatistic, degreesOfFreedom });
          break;
        default:
          throw new Error('Invalid test type');
      }

      setResult(pValueResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [testType, tailType, testStatistic, degreesOfFreedom]);

  const reset = () => {
    setTestType('z-test');
    setTailType('two-tailed');
    setTestStatistic(1.96);
    setDegreesOfFreedom(10);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getFormula = () => {
    switch (testType) {
      case 'z-test':
        return 'P(Z > |z|) using standard normal distribution';
      case 't-test':
        return 'P(T > |t|) using Student\'s t-distribution with df degrees of freedom';
      case 'chi-square':
        return 'P(χ² > x) using chi-square distribution with df degrees of freedom';
      default:
        return '';
    }
  };

  return (
    <CalculatorBase
      title="P-Value Calculator"
      description="Calculate p-values for hypothesis testing using Z-test, T-test, or Chi-square test"
      formula={getFormula()}
      formulaExplanation="The p-value represents the probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="P-Value"
            value={result.pValue < 0.0001 ? '< 0.0001' : formatFixed(result.pValue, 6)}
            highlight
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Significance Level (α)"
              value={result.significanceLevel.toString()}
              copyable
            />
            <ResultDisplay
              label="Statistically Significant"
              value={result.isSignificant ? 'Yes' : 'No'}
              copyable
            />
          </div>

          <div className={cn(
            'p-4 rounded-lg',
            result.isSignificant ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          )}>
            <p className={cn(
              'text-sm font-medium',
              result.isSignificant ? 'text-green-700' : 'text-yellow-700'
            )}>
              {result.interpretation}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {result.isSignificant 
                ? 'The result is statistically significant at α = 0.05. You can reject the null hypothesis.'
                : 'The result is not statistically significant at α = 0.05. You cannot reject the null hypothesis.'}
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 A p-value less than 0.05 is typically considered statistically significant, 
              meaning there is less than a 5% probability that the observed results occurred by chance.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="test-type">Test Type</Label>
          <select
            id="test-type"
            value={testType}
            onChange={(e) => setTestType(e.target.value as TestType)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            {TEST_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {testType !== 'chi-square' && (
          <div>
            <Label htmlFor="tail-type">Tail Type</Label>
            <select
              id="tail-type"
              value={tailType}
              onChange={(e) => setTailType(e.target.value as TailType)}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            >
              {TAIL_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <NumberInput
          id="test-statistic"
          label={testType === 'chi-square' ? 'Chi-Square Statistic (χ²)' : testType === 't-test' ? 'T-Statistic' : 'Z-Score'}
          value={testStatistic}
          onChange={setTestStatistic}
          step={0.01}
          min={testType === 'chi-square' ? 0 : undefined}
        />

        {(testType === 't-test' || testType === 'chi-square') && (
          <NumberInput
            id="degrees-of-freedom"
            label="Degrees of Freedom"
            value={degreesOfFreedom}
            onChange={setDegreesOfFreedom}
            min={1}
            step={1}
          />
        )}
      </div>
    </CalculatorBase>
  );
}

export default PValueCalculator;
