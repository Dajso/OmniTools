'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';

interface BettingROIResult {
  roi: number;
  profit: number;
  winRate: number;
  averageOdds: number;
  breakEvenWinRate: number;
  unitsWon: number;
  clv: number;
}

function calculateBettingROI(
  totalWagered: number,
  totalReturned: number,
  totalBets: number,
  wins: number,
  averageDecimalOdds: number
): BettingROIResult {
  const profit = totalReturned - totalWagered;
  const roi = (profit / totalWagered) * 100;
  const winRate = (wins / totalBets) * 100;
  const breakEvenWinRate = (1 / averageDecimalOdds) * 100;
  const unitsWon = profit / (totalWagered / totalBets); // Profit in units
  
  // Closing Line Value (simplified - actual CLV requires closing odds data)
  // This is a rough estimate based on performance vs expected
  const expectedWinRate = breakEvenWinRate;
  const clv = winRate - expectedWinRate;
  
  return {
    roi,
    profit,
    winRate,
    averageOdds: averageDecimalOdds,
    breakEvenWinRate,
    unitsWon,
    clv,
  };
}

export function BettingRoiCalculator() {
  const [totalWagered, setTotalWagered] = React.useState(10000);
  const [totalReturned, setTotalReturned] = React.useState(10500);
  const [totalBets, setTotalBets] = React.useState(100);
  const [wins, setWins] = React.useState(55);
  const [averageOdds, setAverageOdds] = React.useState(1.91);
  const [result, setResult] = React.useState<BettingROIResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (totalWagered <= 0) throw new Error('Total wagered must be positive');
      if (totalBets <= 0) throw new Error('Total bets must be positive');
      if (wins < 0) throw new Error('Wins cannot be negative');
      if (wins > totalBets) throw new Error('Wins cannot exceed total bets');
      if (averageOdds <= 1) throw new Error('Average odds must be greater than 1');
      
      const roiResult = calculateBettingROI(
        totalWagered,
        totalReturned,
        totalBets,
        wins,
        averageOdds
      );
      setResult(roiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [totalWagered, totalReturned, totalBets, wins, averageOdds]);

  const reset = () => {
    setTotalWagered(10000);
    setTotalReturned(10500);
    setTotalBets(100);
    setWins(55);
    setAverageOdds(1.91);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const avgBetSize = totalWagered / totalBets;

  return (
    <CalculatorBase
      title="Betting ROI Calculator"
      description="Track your betting performance and calculate return on investment"
      formula="ROI = ((Total Returned - Total Wagered) / Total Wagered) × 100"
      formulaExplanation="ROI measures your profit as a percentage of total amount wagered. Positive ROI means you're profitable."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Return on Investment (ROI)"
            value={`${result.roi >= 0 ? '+' : ''}${result.roi.toFixed(2)}%`}
            highlight
            copyable
          />
          
          <ResultDisplay
            label="Total Profit/Loss"
            value={`${result.profit >= 0 ? '+' : ''}$${result.profit.toFixed(2)}`}
            highlight={result.profit > 0}
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Win Rate"
              value={`${result.winRate.toFixed(1)}%`}
              copyable
            />
            <ResultDisplay
              label="Break-Even Win Rate"
              value={`${result.breakEvenWinRate.toFixed(1)}%`}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Units Won/Lost"
              value={`${result.unitsWon >= 0 ? '+' : ''}${result.unitsWon.toFixed(2)}`}
              copyable
            />
            <ResultDisplay
              label="Average Bet Size"
              value={`$${avgBetSize.toFixed(2)}`}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Performance Analysis</p>
            <div className="space-y-3">
              <Card className={`p-3 ${result.roi > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profitability</span>
                  <span className={`font-medium ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.roi > 0 ? '✓ Profitable' : '✗ Not Profitable'}
                  </span>
                </div>
              </Card>
              
              <Card className={`p-3 ${result.winRate > result.breakEvenWinRate ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Win Rate vs Break-Even</span>
                  <span className={`font-medium ${result.winRate > result.breakEvenWinRate ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.winRate > result.breakEvenWinRate 
                      ? `+${(result.winRate - result.breakEvenWinRate).toFixed(1)}% above`
                      : `${(result.winRate - result.breakEvenWinRate).toFixed(1)}% below`}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sample Size</span>
                  <span className={`font-medium ${totalBets >= 500 ? 'text-green-600' : totalBets >= 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {totalBets >= 500 ? '✓ Significant' : totalBets >= 100 ? '⚠️ Moderate' : '✗ Small'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalBets < 100 && 'Need 100+ bets for meaningful analysis'}
                  {totalBets >= 100 && totalBets < 500 && 'Results becoming more reliable'}
                  {totalBets >= 500 && 'Large enough sample for reliable conclusions'}
                </p>
              </Card>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 A positive ROI over 500+ bets suggests genuine skill. Short-term results can be heavily influenced by variance.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="total-wagered"
            label="Total Wagered"
            value={totalWagered}
            onChange={setTotalWagered}
            min={1}
            step={100}
            unit="USD"
          />
          <NumberInput
            id="total-returned"
            label="Total Returned"
            value={totalReturned}
            onChange={setTotalReturned}
            min={0}
            step={100}
            unit="USD"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="total-bets"
            label="Total Bets"
            value={totalBets}
            onChange={setTotalBets}
            min={1}
            step={1}
          />
          <NumberInput
            id="wins"
            label="Wins"
            value={wins}
            onChange={setWins}
            min={0}
            max={totalBets}
            step={1}
          />
        </div>

        <NumberInput
          id="average-odds"
          label="Average Decimal Odds"
          value={averageOdds}
          onChange={setAverageOdds}
          min={1.01}
          step={0.01}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Track your bets over time to get accurate ROI. The more bets you track, the more meaningful your results become.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BettingRoiCalculator;
