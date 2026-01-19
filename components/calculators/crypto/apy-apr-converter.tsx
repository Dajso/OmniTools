'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';
import {
  aprToApy,
  apyToApr,
  compareCompoundingFrequencies,
  calculateTimeToDouble,
  YIELD_SCENARIOS,
  type CompoundingFrequency,
  type APYAPRResult,
} from '@/lib/calculations/crypto';

const COMPOUNDING_OPTIONS = [
  { value: 'daily', label: 'Daily (365x/year)' },
  { value: 'weekly', label: 'Weekly (52x/year)' },
  { value: 'monthly', label: 'Monthly (12x/year)' },
  { value: 'quarterly', label: 'Quarterly (4x/year)' },
  { value: 'semi-annually', label: 'Semi-Annually (2x/year)' },
  { value: 'annually', label: 'Annually (1x/year)' },
  { value: 'continuous', label: 'Continuous' },
];

const MODE_OPTIONS = [
  { value: 'apr-to-apy', label: 'APR → APY' },
  { value: 'apy-to-apr', label: 'APY → APR' },
];

export function APYAPRConverter() {
  const [rate, setRate] = React.useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = React.useState<CompoundingFrequency>('daily');
  const [mode, setMode] = React.useState<'apr-to-apy' | 'apy-to-apr'>('apr-to-apy');
  const [result, setResult] = React.useState<APYAPRResult | null>(null);
  const [comparison, setComparison] = React.useState<ReturnType<typeof compareCompoundingFrequencies>>([]);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const conversionResult = mode === 'apr-to-apy'
        ? aprToApy({ rate, compoundingFrequency })
        : apyToApr({ rate, compoundingFrequency });
      setResult(conversionResult);
      
      // Compare across all compounding frequencies
      const inputRate = mode === 'apr-to-apy' ? rate : conversionResult.apr;
      setComparison(compareCompoundingFrequencies(inputRate));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [rate, compoundingFrequency, mode]);

  const reset = () => {
    setRate(10);
    setCompoundingFrequency('daily');
    setMode('apr-to-apy');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const timeToDouble = result ? calculateTimeToDouble(result.apr, compoundingFrequency) : null;

  return (
    <CalculatorBase
      title="APY/APR Converter"
      description="Convert between Annual Percentage Yield (APY) and Annual Percentage Rate (APR)"
      formula={mode === 'apr-to-apy' 
        ? 'APY = (1 + APR/n)^n - 1' 
        : 'APR = n × ((1 + APY)^(1/n) - 1)'}
      formulaExplanation="Where n is the number of compounding periods per year"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 ${mode === 'apr-to-apy' ? 'bg-muted/50' : 'bg-primary/10'}`}>
              <p className="text-sm text-muted-foreground mb-1">APR</p>
              <p className="text-2xl font-bold">{result.formattedAPR}</p>
            </div>
            <div className={`rounded-lg p-4 ${mode === 'apy-to-apr' ? 'bg-muted/50' : 'bg-primary/10'}`}>
              <p className="text-sm text-muted-foreground mb-1">APY</p>
              <p className="text-2xl font-bold">{result.formattedAPY}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Daily Rate"
              value={`${result.dailyRate.toFixed(4)}%`}
              copyable
            />
            <ResultDisplay
              label="Monthly Rate"
              value={`${result.monthlyRate.toFixed(4)}%`}
              copyable
            />
          </div>

          {timeToDouble && timeToDouble.exact !== Infinity && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Time to Double</p>
              <p className="text-xs text-muted-foreground">
                At {result.formattedAPR} APR with {compoundingFrequency} compounding, 
                your investment will double in approximately{' '}
                <strong>{timeToDouble.exact.toFixed(1)} years</strong>
                {' '}(Rule of 72 estimate: {timeToDouble.ruleOf72.toFixed(1)} years)
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">APY by Compounding Frequency</p>
            <div className="space-y-2">
              {comparison.map((item) => (
                <Card
                  key={item.frequency}
                  className={`p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    item.frequency === compoundingFrequency ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCompoundingFrequency(item.frequency)}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="capitalize">{item.frequency.replace('-', ' ')}</span>
                    <span className="font-mono">{item.apy.toFixed(2)}% APY</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Common DeFi Yields</p>
            <div className="grid grid-cols-2 gap-2">
              {YIELD_SCENARIOS.map((scenario) => (
                <Card
                  key={scenario.name}
                  className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setRate(scenario.apr);
                    setCompoundingFrequency(scenario.frequency);
                    setMode('apr-to-apy');
                  }}
                >
                  <div className="text-sm">
                    <span className="font-medium">{scenario.name}</span>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{scenario.apr}% APR</span>
                      <span>{scenario.apy.toFixed(1)}% APY</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="mode"
          label="Conversion Direction"
          value={mode}
          onChange={(v) => setMode(v as 'apr-to-apy' | 'apy-to-apr')}
          options={MODE_OPTIONS}
        />

        <NumberInput
          id="rate"
          label={mode === 'apr-to-apy' ? 'APR (Annual Percentage Rate)' : 'APY (Annual Percentage Yield)'}
          value={rate}
          onChange={setRate}
          min={0}
          max={10000}
          step={0.1}
          unit="%"
        />

        <SelectInput
          id="compounding"
          label="Compounding Frequency"
          value={compoundingFrequency}
          onChange={(v) => setCompoundingFrequency(v as CompoundingFrequency)}
          options={COMPOUNDING_OPTIONS}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">APR vs APY</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>APR</strong>: Simple interest rate without compounding</li>
            <li>• <strong>APY</strong>: Effective rate including compound interest</li>
            <li>• APY is always ≥ APR (equal only with annual compounding)</li>
            <li>• More frequent compounding = higher APY for same APR</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default APYAPRConverter;
