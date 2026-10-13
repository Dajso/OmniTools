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
        setError('DPI må være større enn 0');
        setResult(null);
        return;
      }
      if (sensitivity <= 0) {
        setError('Følsomheten må være større enn 0');
        setResult(null);
        return;
      }

      const conversion = convertSensitivity(
        { game: sourceGame, sensitivity, dpi },
        targetGame
      );
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      title="Omregning av musefølsomhet"
      description="Regn om musefølsomheten mellom ulike spill og behold cm/360"
      formula="cm/360 = (2,54 × 360) / (DPI × følsomhet × spillmultiplikator)"
      formulaExplanation="Regner om følsomheten slik at du må flytte musa like langt for å snu 360°"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label={`Følsomhet i ${targetGameName}`}
            value={formatFixed(result.convertedSensitivity, 4)}
            highlight
            copyable
          />
          <div className="grid grid-cols-1 gap-4">
            <ResultDisplay
              label="cm/360"
              value={formatFixed(result.cm360, 2)}
              unit="cm"
            />
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p>
              Følsomheten din på <strong>{sensitivity}</strong> i {sourceGameName} ved{' '}
              <strong>{dpi} DPI</strong> tilsvarer <strong>{formatFixed(result.convertedSensitivity, 4)}</strong> i{' '}
              {targetGameName}.
            </p>
            <p className="mt-2">
              Det betyr at du må flytte musa <strong>{formatFixed(result.cm360, 1)} cm</strong> for å snu helt rundt (360°).
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <NumberInput
            id="dpi"
            label="Mus-DPI"
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
          label="Fra spill"
          value={sourceGame}
          onChange={setSourceGame}
          options={GAME_OPTIONS}
        />

        <NumberInput
          id="sensitivity"
          label={`Følsomhet i ${sourceGameName}`}
          value={sensitivity}
          onChange={setSensitivity}
          min={0.001}
          max={100}
          step={0.01}
        />

        <SelectInput
          id="target-game"
          label="Til spill"
          value={targetGame}
          onChange={setTargetGame}
          options={GAME_OPTIONS}
        />
      </div>
    </CalculatorBase>
  );
}

export default MouseSensitivityConverter;
