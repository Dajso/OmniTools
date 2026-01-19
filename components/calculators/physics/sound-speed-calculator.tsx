'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateSoundSpeed,
  SOUND_SPEEDS,
  getMediumType,
  lightningDistance,
  type SoundSpeedResult,
} from '@/lib/calculations/physics/sound-speed-calculator';

const mediumOptions = [
  { value: 'air', label: 'Air (gas)' },
  { value: 'helium', label: 'Helium (gas)' },
  { value: 'hydrogen', label: 'Hydrogen (gas)' },
  { value: 'water_fresh', label: 'Fresh Water (liquid)' },
  { value: 'water_sea', label: 'Sea Water (liquid)' },
  { value: 'ethanol', label: 'Ethanol (liquid)' },
  { value: 'steel', label: 'Steel (solid)' },
  { value: 'aluminum', label: 'Aluminum (solid)' },
  { value: 'glass', label: 'Glass (solid)' },
  { value: 'wood_oak', label: 'Oak Wood (solid)' },
  { value: 'concrete', label: 'Concrete (solid)' },
  { value: 'ice', label: 'Ice (solid)' },
];

export function SoundSpeedCalculator() {
  const [temperature, setTemperature] = React.useState<string>('20');
  const [medium, setMedium] = React.useState<string>('air');
  const [humidity, setHumidity] = React.useState<string>('');
  const [lightningDelay, setLightningDelay] = React.useState<string>('');
  const [result, setResult] = React.useState<SoundSpeedResult | null>(null);
  const [lightningDist, setLightningDist] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const temp = parseFloat(temperature);

      if (isNaN(temp)) {
        setResult(null);
        return;
      }

      const res = calculateSoundSpeed({
        temperature: temp,
        medium,
        humidity: humidity ? parseFloat(humidity) : undefined,
      });
      setResult(res);

      // Calculate lightning distance if delay is provided
      if (lightningDelay) {
        const delay = parseFloat(lightningDelay);
        if (!isNaN(delay) && delay > 0) {
          setLightningDist(lightningDistance(delay, temp));
        } else {
          setLightningDist(null);
        }
      } else {
        setLightningDist(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [temperature, medium, humidity, lightningDelay]);

  const reset = () => {
    setTemperature('20');
    setMedium('air');
    setHumidity('');
    setLightningDelay('');
    setResult(null);
    setLightningDist(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const mediumType = getMediumType(medium);

  return (
    <CalculatorBase
      title="Sound Speed Calculator"
      description="Calculate the speed of sound in various media based on temperature"
      formula="v = 331.3 × √(1 + T/273.15) m/s"
      formulaExplanation="Speed of sound in air varies with temperature. Other media have fixed reference speeds."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Speed (m/s)"
              value={`${result.speedMps.toFixed(2)} m/s`}
              copyable
            />
            <ResultDisplay
              label="Speed (km/h)"
              value={`${result.speedKmh.toFixed(1)} km/h`}
              copyable
            />
            <ResultDisplay
              label="Speed (mph)"
              value={`${result.speedMph.toFixed(1)} mph`}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Speed (ft/s)"
              value={`${result.speedFps.toFixed(1)} ft/s`}
              copyable
            />
            <ResultDisplay
              label="Speed (knots)"
              value={`${result.speedKnots.toFixed(1)} knots`}
              copyable
            />
            <ResultDisplay
              label="Mach 1"
              value={`${result.mach1.toFixed(2)} m/s`}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Travel Time</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Per 1 km: </span>
                {result.timePerKm.toFixed(2)} seconds
              </div>
              <div>
                <span className="text-muted-foreground">Per 1 mile: </span>
                {result.timePerMile.toFixed(2)} seconds
              </div>
            </div>
          </div>

          {lightningDist !== null && (
            <div className="bg-primary/10 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">⚡ Lightning Distance</p>
              <p className="text-lg font-semibold">
                {(lightningDist / 1000).toFixed(2)} km ({(lightningDist / 1609.34).toFixed(2)} miles)
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="medium"
            label="Medium"
            value={medium}
            onChange={setMedium}
            options={mediumOptions}
          />
          <NumberInput
            id="temperature"
            label="Temperature"
            value={temperature}
            onChange={setTemperature}
            placeholder="°C"
            min={-273}
            step={1}
          />
        </div>

        {medium === 'air' && (
          <NumberInput
            id="humidity"
            label="Relative Humidity (optional)"
            value={humidity}
            onChange={setHumidity}
            placeholder="% (0-100)"
            min={0}
            max={100}
            step={1}
          />
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">⚡ Lightning Distance Calculator</p>
          <NumberInput
            id="lightningDelay"
            label="Seconds between flash and thunder"
            value={lightningDelay}
            onChange={setLightningDelay}
            placeholder="seconds"
            min={0}
            step={0.1}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Reference Speeds at 20°C</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>Air: 343 m/s</div>
            <div>Water: 1,481 m/s</div>
            <div>Steel: 5,960 m/s</div>
            <div>Glass: 5,640 m/s</div>
            <div>Aluminum: 6,420 m/s</div>
            <div>Concrete: 3,400 m/s</div>
          </div>
        </div>

        {mediumType !== 'gas' && (
          <p className="text-xs text-muted-foreground">
            Note: Temperature effects on sound speed in {mediumType}s are more complex. 
            Reference speed at 20°C is shown.
          </p>
        )}
      </div>
    </CalculatorBase>
  );
}

export default SoundSpeedCalculator;
