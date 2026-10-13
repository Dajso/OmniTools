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
import { formatFixed } from '@/lib/utils/formatting';

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
        throw new Error('Fyll inn minst ett tall');
      }
      const stats = calculateDescriptiveStats(numbers);
      setResult(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      title="Standardavviksberegner"
      description="Regn ut standardavvik, varians, gjennomsnitt, median, typetall og annen statistikk"
      formula="σ = √(Σ(x - μ)² / N) eller s = √(Σ(x - x̄)² / (n-1))"
      formulaExplanation="Standardavviket for populasjonen (σ) deles på N, mens standardavviket for et utvalg (s) deles på n-1 (Bessels korreksjon)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Standardavvik (utvalg)"
              value={formatFixed(result.standardDeviation, 6)}
              highlight
              copyable
            />
            <ResultDisplay
              label="Standardavvik (populasjon)"
              value={formatFixed(result.populationStandardDeviation, 6)}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Varians (utvalg)"
              value={formatFixed(result.variance, 6)}
              copyable
            />
            <ResultDisplay
              label="Varians (populasjon)"
              value={formatFixed(result.populationVariance, 6)}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Sentraltendens</h4>
            <div className="grid grid-cols-3 gap-4">
              <ResultDisplay
                label="Gjennomsnitt"
                value={formatFixed(result.mean, 6)}
                copyable
              />
              <ResultDisplay
                label="Median"
                value={formatFixed(result.median, 6)}
                copyable
              />
              <ResultDisplay
                label="Typetall"
                value={result.mode.length > 0 ? result.mode.join(', ') : 'Ingen'}
                copyable
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Spredning og variasjon</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResultDisplay
                label="Minimum"
                value={result.min.toString()}
                copyable
              />
              <ResultDisplay
                label="Maksimum"
                value={result.max.toString()}
                copyable
              />
              <ResultDisplay
                label="Kastelengde"
                value={result.range.toString()}
                copyable
              />
              <ResultDisplay
                label="Antall"
                value={result.count.toString()}
                copyable
              />
            </div>
          </div>

          <ResultDisplay
            label="Sum"
            value={formatFixed(result.sum, 6)}
            copyable
          />

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Bruk <strong>utvalgets</strong> standardavvik når dataene er et utvalg fra en større populasjon. Bruk <strong>populasjonens</strong> standardavvik når dataene er hele populasjonen.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="data-input">Fyll inn dataene dine</Label>
          <textarea
            id="data-input"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md bg-background min-h-[120px] font-mono text-sm"
            placeholder="Skriv tall adskilt med mellomrom, semikolon eller linjeskift&#10;Eksempel: 10; 12; 23; 23; 16; 23; 21; 16"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Skill tallene med mellomrom, semikolon eller linjeskift
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default StandardDeviationCalculator;
