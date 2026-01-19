'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  convertOdds,
  calculatePayout,
  type OddsFormat,
  type OddsConversionResult,
} from '@/lib/calculations/betting';

export function OddsConverter() {
  const [inputValue, setInputValue] = React.useState<string>('+150');
  const [inputFormat, setInputFormat] = React.useState<OddsFormat>('american');
  const [stake, setStake] = React.useState(100);
  const [result, setResult] = React.useState<OddsConversionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      let value: number | string;
      
      if (inputFormat === 'fractional') {
        value = inputValue;
      } else {
        const parsed = parseFloat(inputValue);
        if (isNaN(parsed)) {
          throw new Error('Please enter a valid number');
        }
        value = parsed;
      }
      
      const conversionResult = convertOdds(value, inputFormat);
      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult(null);
    }
  }, [inputValue, inputFormat]);

  const reset = () => {
    setInputValue('+150');
    setInputFormat('american');
    setStake(100);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const payout = result ? calculatePayout(stake, result.decimal) : null;

  return (
    <CalculatorBase
      title="Odds Converter"
      description="Convert between American, Decimal, and Fractional odds formats"
      formula="American to Decimal: If positive: (odds/100)+1, If negative: (100/|odds|)+1"
      formulaExplanation="Different regions use different odds formats. This tool converts between all three major formats."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay
              label="American"
              value={result.formattedAmerican}
              highlight={inputFormat === 'american'}
              copyable
            />
            <ResultDisplay
              label="Decimal"
              value={result.formattedDecimal}
              highlight={inputFormat === 'decimal'}
              copyable
            />
            <ResultDisplay
              label="Fractional"
              value={result.formattedFractional}
              highlight={inputFormat === 'fractional'}
              copyable
            />
          </div>
          
          <ResultDisplay
            label="Implied Probability"
            value={result.formattedProbability}
            copyable
          />

          {payout && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Potential Payout (${stake} stake)</p>
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Total Payout"
                  value={`$${payout.payout.toFixed(2)}`}
                  copyable
                />
                <ResultDisplay
                  label="Profit"
                  value={`$${payout.profit.toFixed(2)}`}
                  copyable
                />
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 American odds show how much you win on a $100 bet (positive) or how much you need to bet to win $100 (negative).
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="odds-format">Input Format</Label>
          <select
            id="odds-format"
            value={inputFormat}
            onChange={(e) => {
              setInputFormat(e.target.value as OddsFormat);
              if (e.target.value === 'american') setInputValue('+150');
              else if (e.target.value === 'decimal') setInputValue('2.50');
              else setInputValue('3/2');
            }}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="american">American (+150, -110)</option>
            <option value="decimal">Decimal (2.50)</option>
            <option value="fractional">Fractional (3/2)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="odds-value">Odds Value</Label>
          <Input
            id="odds-value"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputFormat === 'american' ? '+150 or -110' : inputFormat === 'decimal' ? '2.50' : '3/2'}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {inputFormat === 'american' && 'Enter positive (+150) or negative (-110) odds'}
            {inputFormat === 'decimal' && 'Enter decimal odds (must be greater than 1)'}
            {inputFormat === 'fractional' && 'Enter fractional odds (e.g., 3/2, 5/1)'}
          </p>
        </div>

        <NumberInput
          id="stake"
          label="Stake Amount"
          value={stake}
          onChange={setStake}
          min={1}
          step={10}
          unit="USD"
        />
      </div>
    </CalculatorBase>
  );
}

export default OddsConverter;
