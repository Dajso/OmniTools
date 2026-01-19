'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';

interface KDResult {
  kdRatio: number;
  classification: string;
  killsNeededFor1: number;
  killsNeededFor2: number;
  deathsAllowedFor1: number;
  winRate: number | null;
}

function calculateKD(kills: number, deaths: number, wins?: number, games?: number): KDResult {
  const kdRatio = deaths === 0 ? kills : kills / deaths;
  
  let classification: string;
  if (kdRatio >= 3) classification = 'Elite';
  else if (kdRatio >= 2) classification = 'Excellent';
  else if (kdRatio >= 1.5) classification = 'Very Good';
  else if (kdRatio >= 1) classification = 'Good';
  else if (kdRatio >= 0.8) classification = 'Average';
  else if (kdRatio >= 0.5) classification = 'Below Average';
  else classification = 'Needs Improvement';

  // Calculate kills needed to reach 1.0 KD
  const killsNeededFor1 = deaths > kills ? deaths - kills : 0;
  
  // Calculate kills needed to reach 2.0 KD
  const killsNeededFor2 = deaths * 2 > kills ? deaths * 2 - kills : 0;
  
  // Calculate deaths allowed to maintain 1.0 KD
  const deathsAllowedFor1 = kills > deaths ? kills - deaths : 0;

  // Calculate win rate if provided
  const winRate = games && games > 0 && wins !== undefined ? (wins / games) * 100 : null;

  return {
    kdRatio,
    classification,
    killsNeededFor1,
    killsNeededFor2,
    deathsAllowedFor1,
    winRate,
  };
}

export function KDRatioCalculator() {
  const [kills, setKills] = React.useState(100);
  const [deaths, setDeaths] = React.useState(80);
  const [assists, setAssists] = React.useState(50);
  const [wins, setWins] = React.useState(0);
  const [games, setGames] = React.useState(0);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [result, setResult] = React.useState<KDResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (kills < 0 || deaths < 0) {
        setError('Values cannot be negative');
        setResult(null);
        return;
      }

      const kdResult = calculateKD(kills, deaths, wins, games);
      setResult(kdResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [kills, deaths, wins, games]);

  const reset = () => {
    setKills(100);
    setDeaths(80);
    setAssists(50);
    setWins(0);
    setGames(0);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Elite': return 'text-purple-600';
      case 'Excellent': return 'text-green-600';
      case 'Very Good': return 'text-blue-600';
      case 'Good': return 'text-cyan-600';
      case 'Average': return 'text-yellow-600';
      case 'Below Average': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  // Calculate KDA (Kill/Death/Assist ratio)
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;

  return (
    <CalculatorBase
      title="KD Ratio Calculator"
      description="Calculate your Kill/Death ratio and see how you compare"
      formula="K/D = Kills ÷ Deaths"
      formulaExplanation="KDA includes assists: (Kills + Assists) ÷ Deaths"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="K/D Ratio"
              value={result.kdRatio.toFixed(2)}
              highlight
              copyable
            />
            <ResultDisplay
              label="KDA Ratio"
              value={kda.toFixed(2)}
              copyable
            />
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm">
              Classification:{' '}
              <span className={`font-bold ${getClassificationColor(result.classification)}`}>
                {result.classification}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Kills"
              value={kills.toString()}
            />
            <ResultDisplay
              label="Total Deaths"
              value={deaths.toString()}
            />
          </div>

          {result.winRate !== null && (
            <ResultDisplay
              label="Win Rate"
              value={`${result.winRate.toFixed(1)}`}
              unit="%"
            />
          )}

          {/* Improvement Tips */}
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium">Stats to Improve</p>
            {result.kdRatio < 1 && (
              <p className="text-sm text-muted-foreground">
                You need <strong>{result.killsNeededFor1}</strong> more kills (without dying) to reach 1.0 K/D
              </p>
            )}
            {result.kdRatio < 2 && result.kdRatio >= 1 && (
              <p className="text-sm text-muted-foreground">
                You need <strong>{result.killsNeededFor2}</strong> more kills (without dying) to reach 2.0 K/D
              </p>
            )}
            {result.kdRatio >= 1 && (
              <p className="text-sm text-muted-foreground">
                You can die <strong>{result.deathsAllowedFor1}</strong> more times and still maintain 1.0 K/D
              </p>
            )}
          </div>

          {/* K/D Scale */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">K/D Scale</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-600">Elite</span>
                <span>3.0+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Excellent</span>
                <span>2.0 - 3.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Very Good</span>
                <span>1.5 - 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-600">Good</span>
                <span>1.0 - 1.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Average</span>
                <span>0.8 - 1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">Below Average</span>
                <span>0.5 - 0.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Needs Improvement</span>
                <span>&lt; 0.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="kills"
          label="Total Kills"
          value={kills}
          onChange={setKills}
          min={0}
          max={1000000}
          step={1}
        />

        <NumberInput
          id="deaths"
          label="Total Deaths"
          value={deaths}
          onChange={setDeaths}
          min={0}
          max={1000000}
          step={1}
        />

        <NumberInput
          id="assists"
          label="Total Assists (for KDA)"
          value={assists}
          onChange={setAssists}
          min={0}
          max={1000000}
          step={1}
        />

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary hover:underline"
        >
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <NumberInput
              id="wins"
              label="Total Wins"
              value={wins}
              onChange={setWins}
              min={0}
              max={1000000}
              step={1}
            />
            <NumberInput
              id="games"
              label="Total Games Played"
              value={games}
              onChange={setGames}
              min={0}
              max={1000000}
              step={1}
            />
          </div>
        )}
      </div>
    </CalculatorBase>
  );
}

export default KDRatioCalculator;
