'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { americanToDecimal } from '@/lib/calculations/betting';

interface HedgeResult {
  hedgeStake: number;
  guaranteedProfit: number;
  profitIfOriginalWins: number;
  profitIfHedgeWins: number;
  breakEvenHedgeOdds: number;
  recommendation: string;
}

function calculateHedge(
  originalStake: number,
  originalOdds: number,
  originalFormat: 'american' | 'decimal',
  hedgeOdds: number,
  hedgeFormat: 'american' | 'decimal',
  hedgeType: 'equal' | 'guaranteed'
): HedgeResult {
  const originalDecimal = originalFormat === 'american' ? americanToDecimal(originalOdds) : originalOdds;
  const hedgeDecimal = hedgeFormat === 'american' ? americanToDecimal(hedgeOdds) : hedgeOdds;
  
  const originalPotentialPayout = originalStake * originalDecimal;
  
  let hedgeStake: number;
  let guaranteedProfit: number;
  let profitIfOriginalWins: number;
  let profitIfHedgeWins: number;
  
  if (hedgeType === 'guaranteed') {
    // Calculate hedge stake for equal profit regardless of outcome
    hedgeStake = originalPotentialPayout / hedgeDecimal;
    guaranteedProfit = originalPotentialPayout - originalStake - hedgeStake;
    profitIfOriginalWins = guaranteedProfit;
    profitIfHedgeWins = guaranteedProfit;
  } else {
    // Equal stakes approach
    hedgeStake = originalStake;
    profitIfOriginalWins = originalPotentialPayout - originalStake - hedgeStake;
    profitIfHedgeWins = (hedgeStake * hedgeDecimal) - originalStake - hedgeStake;
    guaranteedProfit = Math.min(profitIfOriginalWins, profitIfHedgeWins);
  }
  
  // Calculate break-even hedge odds
  const breakEvenHedgeOdds = originalPotentialPayout / originalStake;
  
  const recommendation = guaranteedProfit > 0 
    ? 'Hedge recommended - guaranteed profit available'
    : guaranteedProfit === 0
    ? 'Break-even hedge - no profit or loss guaranteed'
    : 'Hedge not recommended at these odds - would lock in a loss';
  
  return {
    hedgeStake,
    guaranteedProfit,
    profitIfOriginalWins,
    profitIfHedgeWins,
    breakEvenHedgeOdds,
    recommendation,
  };
}

export function HedgingCalculator() {
  const [originalStake, setOriginalStake] = React.useState(100);
  const [originalOdds, setOriginalOdds] = React.useState(300);
  const [originalFormat, setOriginalFormat] = React.useState<'american' | 'decimal'>('american');
  const [hedgeOdds, setHedgeOdds] = React.useState(-150);
  const [hedgeFormat, setHedgeFormat] = React.useState<'american' | 'decimal'>('american');
  const [hedgeType, setHedgeType] = React.useState<'equal' | 'guaranteed'>('guaranteed');
  const [result, setResult] = React.useState<HedgeResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const hedgeResult = calculateHedge(
        originalStake,
        originalOdds,
        originalFormat,
        hedgeOdds,
        hedgeFormat,
        hedgeType
      );
      setResult(hedgeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [originalStake, originalOdds, originalFormat, hedgeOdds, hedgeFormat, hedgeType]);

  const reset = () => {
    setOriginalStake(100);
    setOriginalOdds(300);
    setOriginalFormat('american');
    setHedgeOdds(-150);
    setHedgeFormat('american');
    setHedgeType('guaranteed');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Hedging Calculator"
      description="Calculate optimal hedge bets to lock in profits or minimize losses"
      formula="Hedge Stake = Original Potential Payout / Hedge Decimal Odds"
      formulaExplanation="Hedging allows you to guarantee a profit or minimize risk by betting on the opposite outcome."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Recommended Hedge Stake"
            value={`$${result.hedgeStake.toFixed(2)}`}
            highlight
            copyable
          />
          
          <ResultDisplay
            label="Guaranteed Profit"
            value={`$${result.guaranteedProfit.toFixed(2)}`}
            highlight={result.guaranteedProfit > 0}
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="If Original Wins"
              value={`$${result.profitIfOriginalWins.toFixed(2)}`}
              copyable
            />
            <ResultDisplay
              label="If Hedge Wins"
              value={`$${result.profitIfHedgeWins.toFixed(2)}`}
              copyable
            />
          </div>

          <ResultDisplay
            label="Break-Even Hedge Odds"
            value={`${result.breakEvenHedgeOdds.toFixed(2)} decimal`}
            copyable
          />

          <div className={`p-3 rounded-md ${
            result.guaranteedProfit > 0 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : result.guaranteedProfit === 0
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`}>
            <p className={`text-sm ${
              result.guaranteedProfit > 0 
                ? 'text-green-800 dark:text-green-200' 
                : result.guaranteedProfit === 0
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {result.guaranteedProfit > 0 ? '✓ ' : result.guaranteedProfit === 0 ? '⚠️ ' : '✗ '}
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm font-medium mb-3">Original Bet</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="original-stake"
              label="Stake"
              value={originalStake}
              onChange={setOriginalStake}
              min={1}
              step={10}
              unit="USD"
            />
            <div>
              <NumberInput
                id="original-odds"
                label="Odds"
                value={originalOdds}
                onChange={setOriginalOdds}
                step={10}
              />
              <select
                value={originalFormat}
                onChange={(e) => setOriginalFormat(e.target.value as 'american' | 'decimal')}
                className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
              >
                <option value="american">American</option>
                <option value="decimal">Decimal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm font-medium mb-3">Hedge Bet</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <NumberInput
                id="hedge-odds"
                label="Hedge Odds"
                value={hedgeOdds}
                onChange={setHedgeOdds}
                step={10}
              />
              <select
                value={hedgeFormat}
                onChange={(e) => setHedgeFormat(e.target.value as 'american' | 'decimal')}
                className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
              >
                <option value="american">American</option>
                <option value="decimal">Decimal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="hedge-type">Hedge Type</Label>
              <select
                id="hedge-type"
                value={hedgeType}
                onChange={(e) => setHedgeType(e.target.value as 'equal' | 'guaranteed')}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="guaranteed">Guaranteed Profit</option>
                <option value="equal">Equal Stakes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Hedging is useful when your original bet is in a winning position and you want to lock in some profit regardless of the final outcome.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default HedgingCalculator;
