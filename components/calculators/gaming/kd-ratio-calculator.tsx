'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { formatFixed } from '@/lib/utils/formatting';

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
  else if (kdRatio >= 2) classification = 'Utmerket';
  else if (kdRatio >= 1.5) classification = 'Veldig bra';
  else if (kdRatio >= 1) classification = 'Bra';
  else if (kdRatio >= 0.8) classification = 'Gjennomsnittlig';
  else if (kdRatio >= 0.5) classification = 'Under gjennomsnittet';
  else classification = 'Trenger forbedring';

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
        setError('Verdiene kan ikke være negative');
        setResult(null);
        return;
      }

      const kdResult = calculateKD(kills, deaths, wins, games);
      setResult(kdResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      case 'Utmerket': return 'text-green-600';
      case 'Veldig bra': return 'text-blue-600';
      case 'Bra': return 'text-cyan-600';
      case 'Gjennomsnittlig': return 'text-yellow-600';
      case 'Under gjennomsnittet': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  // Calculate KDA (Kill/Death/Assist ratio)
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;

  return (
    <CalculatorBase
      title="K/D-kalkulator"
      description="Regn ut forholdet mellom drap og dødsfall (K/D) og se hvordan du ligger an"
      formula="K/D = drap ÷ dødsfall"
      formulaExplanation="KDA tar med assist: (drap + assist) ÷ dødsfall"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="K/D-forhold"
              value={formatFixed(result.kdRatio, 2)}
              highlight
              copyable
            />
            <ResultDisplay
              label="KDA-forhold"
              value={formatFixed(kda, 2)}
              copyable
            />
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm">
              Klassifisering:{' '}
              <span className={`font-bold ${getClassificationColor(result.classification)}`}>
                {result.classification}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Drap totalt"
              value={kills.toString()}
            />
            <ResultDisplay
              label="Dødsfall totalt"
              value={deaths.toString()}
            />
          </div>

          {result.winRate !== null && (
            <ResultDisplay
              label="Seiersandel"
              value={`${formatFixed(result.winRate, 1)}`}
              unit="%"
            />
          )}

          {/* Improvement Tips */}
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium">Slik forbedrer du statistikken</p>
            {result.kdRatio < 1 && (
              <p className="text-sm text-muted-foreground">
                Du trenger <strong>{result.killsNeededFor1}</strong> flere drap (uten å dø) for å nå 1,0 K/D
              </p>
            )}
            {result.kdRatio < 2 && result.kdRatio >= 1 && (
              <p className="text-sm text-muted-foreground">
                Du trenger <strong>{result.killsNeededFor2}</strong> flere drap (uten å dø) for å nå 2,0 K/D
              </p>
            )}
            {result.kdRatio >= 1 && (
              <p className="text-sm text-muted-foreground">
                Du kan dø <strong>{result.deathsAllowedFor1}</strong> ganger til og fortsatt holde 1,0 K/D
              </p>
            )}
          </div>

          {/* K/D Scale */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">K/D-skala</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-600">Elite</span>
                <span>3.0+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Utmerket</span>
                <span>2.0 - 3.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Veldig bra</span>
                <span>1.5 - 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-600">Bra</span>
                <span>1.0 - 1.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Gjennomsnitt</span>
                <span>0.8 - 1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">Under gjennomsnittet</span>
                <span>0.5 - 0.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Trenger forbedring</span>
                <span>&lt; 0,5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="kills"
          label="Drap totalt"
          value={kills}
          onChange={setKills}
          min={0}
          max={1000000}
          step={1}
        />

        <NumberInput
          id="deaths"
          label="Dødsfall totalt"
          value={deaths}
          onChange={setDeaths}
          min={0}
          max={1000000}
          step={1}
        />

        <NumberInput
          id="assists"
          label="Assist totalt (for KDA)"
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
          {showAdvanced ? 'Skjul' : 'Vis'} avanserte valg
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <NumberInput
              id="wins"
              label="Seiere totalt"
              value={wins}
              onChange={setWins}
              min={0}
              max={1000000}
              step={1}
            />
            <NumberInput
              id="games"
              label="Spilte kamper totalt"
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
