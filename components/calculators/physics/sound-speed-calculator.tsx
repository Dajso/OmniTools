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
import { formatFixed } from '@/lib/utils/formatting';

const mediumOptions = [
  { value: 'air', label: 'Luft (gass)' },
  { value: 'helium', label: 'Helium (gass)' },
  { value: 'hydrogen', label: 'Hydrogen (gass)' },
  { value: 'water_fresh', label: 'Ferskvann (væske)' },
  { value: 'water_sea', label: 'Sjøvann (væske)' },
  { value: 'ethanol', label: 'Etanol (væske)' },
  { value: 'steel', label: 'Stål (fast stoff)' },
  { value: 'aluminum', label: 'Aluminium (fast stoff)' },
  { value: 'glass', label: 'Glass (fast stoff)' },
  { value: 'wood_oak', label: 'Eik (fast stoff)' },
  { value: 'concrete', label: 'Betong (fast stoff)' },
  { value: 'ice', label: 'Is (fast stoff)' },
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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
      title="Lydhastighet"
      description="Regn ut lydens hastighet i ulike stoffer ut fra temperaturen"
      formula="v = 331.3 × √(1 + T/273.15) m/s"
      formulaExplanation="Lydhastigheten i luft endrer seg med temperaturen. Andre stoffer har faste referanseverdier."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Hastighet (m/s)"
              value={`${formatFixed(result.speedMps, 2)} m/s`}
              copyable
            />
            <ResultDisplay
              label="Hastighet (km/t)"
              value={`${formatFixed(result.speedKmh, 1)} km/t`}
              copyable
            />
            <ResultDisplay
              label="Hastighet (knop)"
              value={`${formatFixed(result.speedKnots, 1)} knop`}
              copyable
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Mach 1 ved denne temperaturen: {formatFixed(result.mach1, 2)} m/s
          </p>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Reisetid for lyd</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Per 1 km: </span>
                {formatFixed(result.timePerKm, 2)} sekunder
              </div>
              <div>
                <span className="text-muted-foreground">Per 100 m: </span>
                {formatFixed(result.timePer100m, 2)} sekunder
              </div>
            </div>
          </div>

          {lightningDist !== null && (
            <div className="bg-primary/10 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">⚡ Avstand til lynet</p>
              <p className="text-lg font-semibold">
                {formatFixed(lightningDist / 1000, 2)} km ({formatFixed(lightningDist, 0)} m)
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
            label="Stoff"
            value={medium}
            onChange={setMedium}
            options={mediumOptions}
          />
          <NumberInput
            id="temperature"
            label="Temperatur"
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
            label="Relativ luftfuktighet (valgfritt)"
            value={humidity}
            onChange={setHumidity}
            placeholder="% (0-100)"
            min={0}
            max={100}
            step={1}
          />
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">⚡ Hvor langt unna slo lynet ned?</p>
          <NumberInput
            id="lightningDelay"
            label="Sekunder mellom lyn og torden"
            value={lightningDelay}
            onChange={setLightningDelay}
            placeholder="sekunder"
            min={0}
            step={0.1}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Referansehastigheter ved 20 °C</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>Luft: 343 m/s</div>
            <div>Vann: 1 481 m/s</div>
            <div>Stål: 5 960 m/s</div>
            <div>Glass: 5 640 m/s</div>
            <div>Aluminium: 6 420 m/s</div>
            <div>Betong: 3 400 m/s</div>
          </div>
        </div>

        {mediumType !== 'gas' && (
          <p className="text-xs text-muted-foreground">
            Merk: Temperaturen påvirker lydhastigheten i {mediumType === 'liquid' ? 'væsker' : 'faste stoffer'} på en mer sammensatt måte.
            Referansehastigheten ved 20 °C vises.
          </p>
        )}
      </div>
    </CalculatorBase>
  );
}

export default SoundSpeedCalculator;
