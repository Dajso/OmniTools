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
import { formatFixed } from '@/lib/utils/formatting';

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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      title="Kalkulator for utvalgsstørrelse"
      description="Regn ut hvor stort utvalg du trenger i spørreundersøkelser og statistiske studier"
      formula="n = (Z² × p × (1-p)) / E²"
      formulaExplanation="Der Z = z-verdi for konfidensnivået, p = forventet andel, E = feilmargin. For endelige populasjoner brukes korreksjonen n_just = n / (1 + (n-1)/N)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Nødvendig utvalgsstørrelse"
            value={result.sampleSize.toLocaleString('nb-NO')}
            highlight
            copyable
          />
          
          {result.adjustedSampleSize && (
            <ResultDisplay
              label="Justert utvalgsstørrelse (endelig populasjon)"
              value={result.adjustedSampleSize.toLocaleString('nb-NO')}
              copyable
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Konfidensnivå"
              value={`${formatFixed((result.confidenceLevel * 100), 0)}%`}
              copyable
            />
            <ResultDisplay
              label="Feilmargin"
              value={`±${result.marginOfError}%`}
              copyable
            />
          </div>

          <ResultDisplay
            label="Brukt z-verdi"
            value={formatFixed(result.zScore, 3)}
            copyable
          />

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Med dette utvalget havner resultatene dine innenfor ±{result.marginOfError} % av den sanne verdien i populasjonen, med {formatFixed((result.confidenceLevel * 100), 0)} % konfidens.
            </p>
          </div>

          {result.adjustedSampleSize && populationSize && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                📊 Med en populasjon på {populationSize.toLocaleString('nb-NO')}må du spørre{' '}
                <strong>{result.adjustedSampleSize.toLocaleString('nb-NO')}</strong> personer ({formatFixed(((result.adjustedSampleSize / populationSize) * 100), 1)} % av populasjonen).
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="confidence-level">Konfidensnivå</Label>
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
            Høyere konfidens krever større utvalg
          </p>
        </div>

        <div>
          <Label htmlFor="margin-of-error">Feilmargin</Label>
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
            Mindre feilmargin krever større utvalg
          </p>
        </div>

        <NumberInput
          id="expected-proportion"
          label="Forventet andel"
          value={expectedProportion}
          onChange={setExpectedProportion}
          min={1}
          max={99}
          step={1}
          unit="%"
        />
        <p className="text-xs text-muted-foreground -mt-2">
          Bruk 50 % hvis du ikke vet (gir størst utvalg)
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
            Jeg vet hvor stor populasjonen er
          </Label>
        </div>

        {useFinitePopulation && (
          <NumberInput
            id="population-size"
            label="Populasjonsstørrelse"
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
