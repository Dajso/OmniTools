'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  convertSensitivity,
  SUPPORTED_GAMES,
  type SensitivityConversion,
} from '@/lib/calculations/gaming/sensitivity-converter';
import { formatFixed } from '@/lib/utils/formatting';

const GAME_OPTIONS = SUPPORTED_GAMES.map(game => ({
  value: game.id,
  label: game.name,
}));

const DPI_PRESETS = [400, 800, 1600, 3200];

export function MouseSensitivityConverter() {
  const [dpi, setDpi] = React.useState(800);
  const [sensitivity, setSensitivity] = React.useState(1);
  const [sourceGame, setSourceGame] = React.useState('valorant');
  const [targetGame, setTargetGame] = React.useState('cs2');
  const [result, setResult] = React.useState<SensitivityConversion | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (dpi <= 0) {
        setError('DPI must be positive');
        setResult(null);
        return;
      }
      if (sensitivity <= 0) {
        setError('Sensitivity must be positive');
        setResult(null);
        return;
      }

      const conversion = convertSensitivity(
        { game: sourceGame, sensitivity, dpi },
        targetGame
      );
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [dpi, sensitivity, sourceGame, targetGame]);

  const reset = () => {
    setDpi(800);
    setSensitivity(1);
    setSourceGame('valorant');
    setTargetGame('cs2');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const sourceGameName = SUPPORTED_GAMES.find(g => g.id === sourceGame)?.name || sourceGame;
  const targetGameName = SUPPORTED_GAMES.find(g => g.id === targetGame)?.name || targetGame;

  return (
    <CalculatorBase
      title="Mouse Sensitivity Converter"
      description="Convert your mouse sensitivity between different games while preserving your cm/360"
      formula="cm/360 = (2.54 × 360) / (DPI × Sensitivity × Game Multiplier)"
      formulaExplanation="Converts sensitivity by preserving the physical distance needed for a 360° turn"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label={`${targetGameName} Sensitivity`}
            value={formatFixed(result.convertedSensitivity, 4)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="cm/360"
              value={formatFixed(result.cm360, 2)}
              unit="cm"
            />
            <ResultDisplay
              label="inches/360"
              value={formatFixed((result.cm360 / 2.54), 2)}
              unit="in"
            />
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p>
              Your {sourceGameName} sensitivity of <strong>{sensitivity}</strong> at{' '}
              <strong>{dpi} DPI</strong> equals <strong>{formatFixed(result.convertedSensitivity, 4)}</strong> in{' '}
              {targetGameName}.
            </p>
            <p className="mt-2">
              This means you need to move your mouse <strong>{formatFixed(result.cm360, 1)} cm</strong> for a full 360° turn.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <NumberInput
            id="dpi"
            label="Mouse DPI"
            value={dpi}
            onChange={setDpi}
            min={100}
            max={32000}
            step={100}
          />
          <div className="flex gap-2 mt-2">
            {DPI_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setDpi(preset)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  dpi === preset
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <SelectInput
          id="source-game"
          label="Source Game"
          value={sourceGame}
          onChange={setSourceGame}
          options={GAME_OPTIONS}
        />

        <NumberInput
          id="sensitivity"
          label={`${sourceGameName} Sensitivity`}
          value={sensitivity}
          onChange={setSensitivity}
          min={0.001}
          max={100}
          step={0.01}
        />

        <SelectInput
          id="target-game"
          label="Target Game"
          value={targetGame}
          onChange={setTargetGame}
          options={GAME_OPTIONS}
        />
      </div>
    </CalculatorBase>
  );
}

export default MouseSensitivityConverter;
