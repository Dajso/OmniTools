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
      setError(err instanceof Error ? err.message : 'Calculation error');
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
      setError('Geolocation is not supported by your browser');
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
        setError(`Location error: ${err.message}`);
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
      title="Golden Hour Calculator"
      description="Calculate golden hour and blue hour times for photography"
      formula="Based on solar position calculations"
      formulaExplanation="Golden hour occurs when the sun is 0-6° above the horizon. Blue hour is when the sun is 4-6° below."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          {/* Current Phase */}
          <div className={`p-4 rounded-lg border ${getPhaseColor(result.currentPhase)}`}>
            <p className="text-sm font-medium">Current Phase</p>
            <p className="text-xl font-bold">{LIGHT_PHASES[result.currentPhase].name}</p>
            <p className="text-sm opacity-80">{LIGHT_PHASES[result.currentPhase].photographyTips}</p>
          </div>

          {/* Sun Times */}
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay
              label="Sunrise"
              value={result.formatted.sunrise}
              copyable
            />
            <ResultDisplay
              label="Solar Noon"
              value={result.formatted.solarNoon}
            />
            <ResultDisplay
              label="Sunset"
              value={result.formatted.sunset}
              copyable
            />
          </div>

          <ResultDisplay
            label="Day Length"
            value={result.dayLengthFormatted}
          />

          {/* Golden Hour Times */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              Golden Hour
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Morning"
                value={result.formatted.morningGoldenHour}
                highlight
                copyable
              />
              <ResultDisplay
                label="Evening"
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
              Blue Hour
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Morning"
                value={result.formatted.morningBlueHour}
                copyable
              />
              <ResultDisplay
                label="Evening"
                value={result.formatted.eveningBlueHour}
                copyable
              />
            </div>
          </div>

          {/* Photography Tips */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Photography Tips</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🌅 <strong>Golden Hour:</strong> Warm, soft light. Perfect for portraits, landscapes, and architecture.</p>
              <p>🌃 <strong>Blue Hour:</strong> Cool, even light. Ideal for cityscapes and long exposures.</p>
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
          {locationLoading ? 'Getting location...' : '📍 Use My Location'}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="latitude"
            label="Latitude"
            value={latitude}
            onChange={setLatitude}
            min={-90}
            max={90}
            step={0.0001}
          />
          <NumberInput
            id="longitude"
            label="Longitude"
            value={longitude}
            onChange={setLongitude}
            min={-180}
            max={180}
            step={0.0001}
          />
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-medium mb-2 block">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Quick City Presets</p>
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
                  {preset.latitude.toFixed(2)}°, {preset.longitude.toFixed(2)}°
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">About Light Phases:</p>
          <ul className="space-y-1">
            <li><strong>Golden Hour:</strong> Sun 0-6° above horizon</li>
            <li><strong>Blue Hour:</strong> Sun 4-6° below horizon</li>
            <li><strong>Civil Twilight:</strong> Sun 0-6° below horizon</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default GoldenHourCalculator;
