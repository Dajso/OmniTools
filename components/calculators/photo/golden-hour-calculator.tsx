'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateGoldenHour,
  CITY_PRESETS,
  LIGHT_PHASES,
  type GoldenHourResult,
  type LightPhase,
} from '@/lib/calculations/photo/golden-hour-calculator';
import { formatFixed } from '@/lib/utils/formatting';

export function GoldenHourCalculator() {
  const [latitude, setLatitude] = React.useState(40.7128);
  const [longitude, setLongitude] = React.useState(-74.0060);
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [result, setResult] = React.useState<GoldenHourResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [locationLoading, setLocationLoading] = React.useState(false);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const dateObj = new Date(date + 'T12:00:00');
      const goldenHourResult = calculateGoldenHour({
        latitude,
        longitude,
        date: dateObj,
      });
      setResult(goldenHourResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [latitude, longitude, date]);

  const reset = () => {
    setLatitude(40.7128);
    setLongitude(-74.0060);
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Nettleseren din støtter ikke posisjonsbestemmelse');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Math.round(position.coords.latitude * 10000) / 10000);
        setLongitude(Math.round(position.coords.longitude * 10000) / 10000);
        setLocationLoading(false);
      },
      (err) => {
        setError(`Kunne ikke hente posisjon: ${err.message}`);
        setLocationLoading(false);
      }
    );
  };

  const applyPreset = (preset: typeof CITY_PRESETS[0]) => {
    setLatitude(preset.latitude);
    setLongitude(preset.longitude);
  };

  const getPhaseColor = (phase: LightPhase): string => {
    switch (phase) {
      case 'golden-hour': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'blue-hour': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'daylight': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'night': return 'bg-slate-800 text-slate-100 border-slate-600';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <CalculatorBase
      title="Gyllen time og blå time"
      description="Regn ut tidspunkt for gyllen time og blå time til fotografering"
      formula="Basert på beregning av solens posisjon"
      formulaExplanation="Gyllen time er når sola står 0–6° over horisonten. Blå time er når sola står 4–6° under horisonten."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          {/* Current Phase */}
          <div className={`p-4 rounded-lg border ${getPhaseColor(result.currentPhase)}`}>
            <p className="text-sm font-medium">Nåværende fase</p>
            <p className="text-xl font-bold">{LIGHT_PHASES[result.currentPhase].name}</p>
            <p className="text-sm opacity-80">{LIGHT_PHASES[result.currentPhase].photographyTips}</p>
          </div>

          {/* Sun Times */}
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay
              label="Soloppgang"
              value={result.formatted.sunrise}
              copyable
            />
            <ResultDisplay
              label="Sola høyest"
              value={result.formatted.solarNoon}
            />
            <ResultDisplay
              label="Solnedgang"
              value={result.formatted.sunset}
              copyable
            />
          </div>

          <ResultDisplay
            label="Dagens lengde"
            value={result.dayLengthFormatted}
          />

          {/* Golden Hour Times */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              Gyllen time
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Morgen"
                value={result.formatted.morningGoldenHour}
                highlight
                copyable
              />
              <ResultDisplay
                label="Kveld"
                value={result.formatted.eveningGoldenHour}
                highlight
                copyable
              />
            </div>
          </div>

          {/* Blue Hour Times */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Blå time
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Morgen"
                value={result.formatted.morningBlueHour}
                copyable
              />
              <ResultDisplay
                label="Kveld"
                value={result.formatted.eveningBlueHour}
                copyable
              />
            </div>
          </div>

          {/* Photography Tips */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Tips til fotograferingen</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🌅 <strong>Gyllen time:</strong> Varmt, mykt lys. Passer til portretter, landskap og arkitektur.</p>
              <p>🌃 <strong>Blå time:</strong> Kjølig, jevnt lys. Passer til bybilder og lang eksponering.</p>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locationLoading}
          className="w-full px-4 py-2 text-sm rounded-md border bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {locationLoading ? 'Henter posisjon …' : '📍 Bruk min posisjon'}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="latitude"
            label="Breddegrad"
            value={latitude}
            onChange={setLatitude}
            min={-90}
            max={90}
            step={0.0001}
          />
          <NumberInput
            id="longitude"
            label="Lengdegrad"
            value={longitude}
            onChange={setLongitude}
            min={-180}
            max={180}
            step={0.0001}
          />
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-medium mb-2 block">Dato</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Norske byer</p>
          <div className="grid grid-cols-2 gap-2">
            {CITY_PRESETS.map((preset) => (
              <Card
                key={preset.name}
                className={`p-2 cursor-pointer transition-colors ${
                  latitude === preset.latitude && longitude === preset.longitude
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => applyPreset(preset)}
              >
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFixed(preset.latitude, 2)}°, {formatFixed(preset.longitude, 2)}°
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Om lysfasene:</p>
          <ul className="space-y-1">
            <li><strong>Gyllen time:</strong> Sola 0–6° over horisonten</li>
            <li><strong>Blå time:</strong> Sola 4–6° under horisonten</li>
            <li><strong>Borgerlig tussmørke:</strong> Sola 0–6° under horisonten</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default GoldenHourCalculator;
