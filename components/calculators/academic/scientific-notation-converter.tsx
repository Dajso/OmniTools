'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  toScientificNotation,
  fromScientificNotation,
  toEngineeringNotation,
  parseScientificNotation,
  SI_PREFIXES,
} from '@/lib/calculations/academic/scientific-notation-converter';

type ConversionMode = 'toScientific' | 'fromScientific';

/** Norsk desimaltegn i utdata */
const toNo = (s: string) => s.replace(/\./g, ',');

export function ScientificNotationConverter() {
  const [mode, setMode] = React.useState<ConversionMode>('toScientific');
  const [decimalInput, setDecimalInput] = React.useState<string>('314159');
  const [coefficient, setCoefficient] = React.useState<number>(3.14159);
  const [exponent, setExponent] = React.useState<number>(5);
  const [error, setError] = React.useState<string | undefined>();
  const [results, setResults] = React.useState<{
    decimal: string;
    scientific: string;
    eNotation: string;
    engineering: string;
    siPrefix?: string;
  } | null>(null);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      if (mode === 'toScientific') {
        const value = parseFloat(decimalInput.replace(/\s/g, '').replace(',', '.'));
        if (isNaN(value)) {
          setError('Skriv inn et gyldig tall');
          setResults(null);
          return;
        }

        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);
        
        // Find SI prefix if applicable
        const engExp = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
        const siPrefix = SI_PREFIXES[engExp];

        setResults({
          decimal: value.toLocaleString('nb-NO', { maximumFractionDigits: 20 }),
          scientific: toNo(scientific.formatted),
          eNotation: toNo(`${scientific.coefficient.toPrecision(6).replace(/\.?0+$/, '')}e${scientific.exponent}`),
          engineering: toNo(engineering),
          siPrefix: siPrefix ? `${siPrefix.name} (${siPrefix.symbol})` : undefined,
        });
      } else {
        const value = fromScientificNotation(coefficient, exponent);
        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);

        // Find SI prefix if applicable
        const engExp = Math.floor(exponent / 3) * 3;
        const siPrefix = SI_PREFIXES[engExp];

        setResults({
          decimal: value.toLocaleString('nb-NO', { maximumFractionDigits: 20 }),
          scientific: toNo(scientific.formatted),
          eNotation: toNo(`${coefficient}e${exponent}`),
          engineering: toNo(engineering),
          siPrefix: siPrefix ? `${siPrefix.name} (${siPrefix.symbol})` : undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil ved omregning');
      setResults(null);
    }
  }, [mode, decimalInput, coefficient, exponent]);

  const reset = () => {
    setDecimalInput('314159');
    setCoefficient(3.14159);
    setExponent(5);
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Standardform"
      description="Regn om tall til og fra standardform (vitenskapelig notasjon)"
      formula="N = c × 10^e (der 1 ≤ |c| < 10)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Desimaltall" 
            value={results.decimal} 
            highlight 
            copyable 
          />
          <ResultDisplay 
            label="Standardform" 
            value={results.scientific} 
            copyable 
          />
          <ResultDisplay 
            label="E-notasjon" 
            value={results.eNotation} 
            copyable 
          />
          <ResultDisplay 
            label="Ingeniørnotasjon" 
            value={results.engineering} 
            copyable 
          />
          {results.siPrefix && (
            <ResultDisplay 
              label="SI-prefiks" 
              value={results.siPrefix} 
            />
          )}
        </div>
      )}
    >
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={mode === 'toScientific' ? 'default' : 'outline'}
          onClick={() => setMode('toScientific')}
          className="flex-1"
        >
          Desimaltall → standardform
        </Button>
        <Button
          type="button"
          variant={mode === 'fromScientific' ? 'default' : 'outline'}
          onClick={() => setMode('fromScientific')}
          className="flex-1"
        >
          Standardform → desimaltall
        </Button>
      </div>

      {mode === 'toScientific' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="decimalInput" className="block text-sm font-medium">
              Desimaltall
            </label>
            <input
              id="decimalInput"
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="Skriv inn et tall (for eksempel 314159)"
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Skriv inn et tall (også svært store og svært små tall). Bruk komma som desimaltegn.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <NumberInput
            id="coefficient"
            label="Koeffisient (c)"
            value={coefficient}
            onChange={setCoefficient}
            step={0.000001}
          />
          <NumberInput
            id="exponent"
            label="Eksponent (e)"
            value={exponent}
            onChange={setExponent}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Format: c × 10^e (for eksempel 3,14159 × 10^5 = 314159)
          </p>
        </div>
      )}
    </CalculatorBase>
  );
}

export default ScientificNotationConverter;
