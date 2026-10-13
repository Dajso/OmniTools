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
          throw new Error('Ugyldig testtype');
      }

      setResult(pValueResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
        return 'P(Z > |z|) med standard normalfordeling';
      case 't-test':
        return 'P(T > |t|) med Students t-fordeling og df frihetsgrader';
      case 'chi-square':
        return 'P(χ² > x) med kjikvadratfordeling og df frihetsgrader';
      default:
        return '';
    }
  };

  return (
    <CalculatorBase
      title="P-verdikalkulator"
      description="Regn ut p-verdier for hypotesetesting med z-test, t-test eller kjikvadrattest"
      formula={getFormula()}
      formulaExplanation="P-verdien er sannsynligheten for å få et resultat minst like ekstremt som det observerte, gitt at nullhypotesen er sann."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="P-verdi"
            value={result.pValue < 0.0001 ? '< 0.0001' : formatFixed(result.pValue, 6)}
            highlight
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Signifikansnivå (α)"
              value={result.significanceLevel.toString()}
              copyable
            />
            <ResultDisplay
              label="Statistisk signifikant"
              value={result.isSignificant ? 'Ja' : 'Nei'}
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
                ? 'Resultatet er statistisk signifikant på α = 0,05. Du kan forkaste nullhypotesen.'
                : 'Resultatet er ikke statistisk signifikant på α = 0,05. Du kan ikke forkaste nullhypotesen.'}
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 En p-verdi under 0,05 regnes vanligvis som statistisk signifikant, altså at det er mindre enn 5 % sannsynlighet for at resultatet skyldes tilfeldigheter.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="test-type">Testtype</Label>
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
            <Label htmlFor="tail-type">Ensidig eller tosidig</Label>
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
          label={testType === 'chi-square' ? 'Kjikvadrat (χ²)' : testType === 't-test' ? 'T-verdi' : 'Z-verdi'}
          value={testStatistic}
          onChange={setTestStatistic}
          step={0.01}
          min={testType === 'chi-square' ? 0 : undefined}
        />

        {(testType === 't-test' || testType === 'chi-square') && (
          <NumberInput
            id="degrees-of-freedom"
            label="Frihetsgrader"
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
