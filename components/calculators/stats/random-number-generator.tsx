'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatFixed } from '@/lib/utils/formatting';

type Distribution = 'uniform' | 'normal' | 'exponential';

interface GeneratorResult {
  numbers: number[];
  statistics: {
    mean: number;
    min: number;
    max: number;
    standardDeviation: number;
  };
  histogram: { bin: string; count: number }[];
}

/**
 * Generates a random number from a normal distribution using Box-Muller transform
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Generates a random number from an exponential distribution
 */
function randomExponential(lambda: number): number {
  return -Math.log(1 - Math.random()) / lambda;
}

/**
 * Random Number Generator Component
 * 
 * Generates random numbers with different distributions:
 * - Uniform: Equal probability across range
 * - Normal: Bell curve distribution
 * - Exponential: Decay distribution
 * 
 * @see Requirements 29.6
 */
export function RandomNumberGenerator() {
  const [distribution, setDistribution] = React.useState<Distribution>('uniform');
  const [count, setCount] = React.useState(100);
  const [min, setMin] = React.useState(1);
  const [max, setMax] = React.useState(100);
  const [mean, setMean] = React.useState(50);
  const [stdDev, setStdDev] = React.useState(15);
  const [lambda, setLambda] = React.useState(1);
  const [decimals, setDecimals] = React.useState(0);
  const [result, setResult] = React.useState<GeneratorResult | null>(null);

  const generate = React.useCallback(() => {
    const numbers: number[] = [];
    const factor = Math.pow(10, decimals);

    for (let i = 0; i < count; i++) {
      let num: number;
      
      switch (distribution) {
        case 'uniform':
          num = min + Math.random() * (max - min);
          break;
        case 'normal':
          num = randomNormal(mean, stdDev);
          break;
        case 'exponential':
          num = randomExponential(lambda);
          break;
        default:
          num = Math.random();
      }

      // Round to specified decimals
      num = Math.round(num * factor) / factor;
      numbers.push(num);
    }

    // Calculate statistics
    const sum = numbers.reduce((a, b) => a + b, 0);
    const calcMean = sum / numbers.length;
    const calcMin = Math.min(...numbers);
    const calcMax = Math.max(...numbers);
    const variance = numbers.reduce((acc, n) => acc + Math.pow(n - calcMean, 2), 0) / numbers.length;
    const calcStdDev = Math.sqrt(variance);

    // Create histogram
    const numBins = Math.min(20, Math.ceil(Math.sqrt(count)));
    const binWidth = (calcMax - calcMin) / numBins || 1;
    const bins: number[] = new Array(numBins).fill(0);
    
    numbers.forEach((n) => {
      const binIndex = Math.min(Math.floor((n - calcMin) / binWidth), numBins - 1);
      bins[binIndex]++;
    });

    const histogram = bins.map((count, i) => ({
      bin: formatFixed(calcMin + i * binWidth, 1),
      count,
    }));

    setResult({
      numbers,
      statistics: {
        mean: calcMean,
        min: calcMin,
        max: calcMax,
        standardDeviation: calcStdDev,
      },
      histogram,
    });
  }, [distribution, count, min, max, mean, stdDev, lambda, decimals]);

  const reset = () => {
    setDistribution('uniform');
    setCount(100);
    setMin(1);
    setMax(100);
    setMean(50);
    setStdDev(15);
    setLambda(1);
    setDecimals(0);
    setResult(null);
  };

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copyNumbers = () => {
    if (result) {
      navigator.clipboard.writeText(result.numbers.join(', '));
    }
  };

  return (
    <CalculatorBase
      title="Generator for tilfeldige tall"
      description="Lag tilfeldige tall med uniform, normal- eller eksponentialfordeling"
      formula={
        distribution === 'uniform' 
          ? 'X ~ U(min, maks)' 
          : distribution === 'normal'
          ? 'X ~ N(μ, σ²)'
          : 'X ~ Exp(λ)'
      }
      formulaExplanation={
        distribution === 'uniform'
          ? 'Uniform fordeling: like stor sannsynlighet for alle verdier i området'
          : distribution === 'normal'
          ? 'Normalfordeling: klokkekurve rundt gjennomsnittet (μ) med standardavvik (σ)'
          : 'Eksponentialfordeling: modellerer tid mellom hendelser med raten λ'
      }
      onCalculate={generate}
      onReset={reset}
      results={result && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultDisplay
              label="Gjennomsnitt"
              value={formatFixed(result.statistics.mean, 4)}
              copyable
            />
            <ResultDisplay
              label="Standardavvik"
              value={formatFixed(result.statistics.standardDeviation, 4)}
              copyable
            />
            <ResultDisplay
              label="Minimum"
              value={formatFixed(result.statistics.min, decimals)}
              copyable
            />
            <ResultDisplay
              label="Maksimum"
              value={formatFixed(result.statistics.max, decimals)}
              copyable
            />
          </div>

          {/* Histogram */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-4 text-center">Histogram over fordelingen</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.histogram} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="bin" 
                    tick={{ fontSize: 9 }}
                    interval={Math.floor(result.histogram.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Generated Numbers */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Genererte tall ({count})</h4>
              <Button variant="outline" size="sm" onClick={copyNumbers}>
                Kopier alle
              </Button>
            </div>
            <div className="max-h-32 overflow-y-auto font-mono text-xs bg-background p-2 rounded border">
              {result.numbers.slice(0, 200).join(', ')}
              {result.numbers.length > 200 && '...'}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Genererte {count} tilfeldige tall med {distribution} fordeling. Histogrammet viser hvordan verdiene fordeler seg over området.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="distribution">Fordeling</Label>
          <select
            id="distribution"
            value={distribution}
            onChange={(e) => setDistribution(e.target.value as Distribution)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="uniform">Uniform (lik sannsynlighet)</option>
            <option value="normal">Normal (klokkekurve)</option>
            <option value="exponential">Eksponentiell (avtagende)</option>
          </select>
        </div>

        <NumberInput
          id="count"
          label="Hvor mange tall"
          value={count}
          onChange={setCount}
          min={1}
          max={10000}
          step={10}
        />

        {distribution === 'uniform' && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="min"
              label="Minimum"
              value={min}
              onChange={setMin}
            />
            <NumberInput
              id="max"
              label="Maksimum"
              value={max}
              onChange={setMax}
            />
          </div>
        )}

        {distribution === 'normal' && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="mean"
              label="Gjennomsnitt (μ)"
              value={mean}
              onChange={setMean}
            />
            <NumberInput
              id="stdDev"
              label="Standardavvik (σ)"
              value={stdDev}
              onChange={setStdDev}
              min={0.1}
              step={0.1}
            />
          </div>
        )}

        {distribution === 'exponential' && (
          <NumberInput
            id="lambda"
            label="Rateparameter (λ)"
            value={lambda}
            onChange={setLambda}
            min={0.01}
            step={0.1}
          />
        )}

        <NumberInput
          id="decimals"
          label="Antall desimaler"
          value={decimals}
          onChange={setDecimals}
          min={0}
          max={10}
          step={1}
        />
      </div>
    </CalculatorBase>
  );
}

export default RandomNumberGenerator;
