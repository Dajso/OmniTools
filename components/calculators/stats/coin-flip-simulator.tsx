'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatFixed } from '@/lib/utils/formatting';

interface FlipResult {
  heads: number;
  tails: number;
  history: ('H' | 'T')[];
}

interface ChartData {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Coin Flip Simulator Component
 * 
 * Simulates coin flips and displays distribution visualization
 * using recharts for the bar chart.
 * 
 * @see Requirements 29.4
 */
export function CoinFlipSimulator() {
  const [numFlips, setNumFlips] = React.useState(100);
  const [result, setResult] = React.useState<FlipResult | null>(null);
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [currentFlip, setCurrentFlip] = React.useState<'H' | 'T' | null>(null);

  const flipCoins = React.useCallback(() => {
    setIsFlipping(true);
    setCurrentFlip(null);

    // Simulate flipping animation
    let flipCount = 0;
    const animationInterval = setInterval(() => {
      setCurrentFlip(Math.random() < 0.5 ? 'H' : 'T');
      flipCount++;
      if (flipCount >= Math.min(10, numFlips)) {
        clearInterval(animationInterval);
      }
    }, 100);

    // Perform actual simulation after animation
    setTimeout(() => {
      clearInterval(animationInterval);

      let heads = 0;
      let tails = 0;
      const history: ('H' | 'T')[] = [];

      for (let i = 0; i < numFlips; i++) {
        if (Math.random() < 0.5) {
          heads++;
          history.push('H');
        } else {
          tails++;
          history.push('T');
        }
      }

      setResult({ heads, tails, history });
      setCurrentFlip(history[history.length - 1]);
      setIsFlipping(false);
    }, Math.min(1000, numFlips * 10));
  }, [numFlips]);

  const reset = () => {
    setResult(null);
    setCurrentFlip(null);
    setNumFlips(100);
  };

  const chartData: ChartData[] = result ? [
    { name: 'Kron', count: result.heads, percentage: (result.heads / numFlips) * 100 },
    { name: 'Mynt', count: result.tails, percentage: (result.tails / numFlips) * 100 },
  ] : [];

  const expectedHeads = numFlips / 2;
  const deviation = result ? Math.abs(result.heads - expectedHeads) : 0;
  const deviationPercent = result ? (deviation / expectedHeads) * 100 : 0;

  return (
    <CalculatorBase
      title="Myntkast"
      description="Simuler myntkast og se fordelingen av kron og mynt"
      formula="P(kron) = P(mynt) = 0,5"
      formulaExplanation="For en rettferdig mynt er sannsynligheten for kron og mynt 50 % hver. Jo flere kast, desto nærmere kommer fordelingen 50/50."
      onCalculate={flipCoins}
      onReset={reset}
      isCalculating={isFlipping}
      results={result && (
        <div className="space-y-6">
          {/* Coin Animation */}
          <div className="flex justify-center">
            <div className={`
              w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold
              transition-all duration-200 shadow-lg
              ${currentFlip === 'H' ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-300 text-gray-700'}
            `}>
              {currentFlip || '?'}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Kron"
              value={`${result.heads} (${formatFixed(((result.heads / numFlips) * 100), 1)}%)`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Mynt"
              value={`${result.tails} (${formatFixed(((result.tails / numFlips) * 100), 1)}%)`}
              highlight
              copyable
            />
          </div>

          {/* Distribution Chart */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-4 text-center">Fordeling</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      typeof value === 'number' ? `${value} (${formatFixed((value / numFlips) * 100, 1)} %)` : String(value),
                      name === 'count' ? 'Count' : String(name)
                    ]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Heads' ? '#eab308' : '#6b7280'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Forventet (50 %)"
              value={expectedHeads.toString()}
              copyable
            />
            <ResultDisplay
              label="Avvik fra forventet"
              value={`${deviation} (${formatFixed(deviationPercent, 1)}%)`}
              copyable
            />
          </div>

          {/* Recent Flips */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Siste 50 kast</h4>
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              {result.history.slice(-50).map((flip, i) => (
                <span
                  key={i}
                  className={`
                    w-5 h-5 rounded flex items-center justify-center
                    ${flip === 'H' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}
                  `}
                >
                  {flip}
                </span>
              ))}
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 Med {numFlips} kast fikk du {result.heads} kron ({formatFixed(((result.heads / numFlips) * 100), 1)}%).
              {deviationPercent < 10
                ? 'Det er svært nær forventede 50 %!'
                : deviationPercent < 20
                  ? 'Det er innenfor normal variasjon for dette antallet kast.'
                  : 'Avviket er større enn vanlig, men fullt mulig av ren tilfeldighet.'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="num-flips"
          label="Antall kast"
          value={numFlips}
          onChange={setNumFlips}
          min={1}
          max={10000}
          step={10}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNumFlips(10)}
          >
            10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNumFlips(100)}
          >
            100
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNumFlips(1000)}
          >
            1,000
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNumFlips(10000)}
          >
            10,000
          </Button>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CoinFlipSimulator;
