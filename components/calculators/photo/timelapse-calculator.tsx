'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateTimelapse,
  formatDuration,
  COMMON_FRAME_RATES,
  IMAGE_QUALITY_PRESETS,
  TIMELAPSE_SCENARIOS,
  calculateBatteriesNeeded,
  calculateCardCapacity,
  type TimelapseResult,
} from '@/lib/calculations/photo/timelapse-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const FRAME_RATE_OPTIONS = COMMON_FRAME_RATES.map(fps => ({
  value: fps.toString(),
  label: `${fps} b/s`,
}));

const QUALITY_OPTIONS = Object.entries(IMAGE_QUALITY_PRESETS).map(([key, preset]) => ({
  value: key,
  label: `${preset.name} (ca. ${preset.fileSizeMB} MB)`,
}));

export function TimeLapseCalculator() {
  const [eventHours, setEventHours] = React.useState(1);
  const [eventMinutes, setEventMinutes] = React.useState(0);
  const [outputSeconds, setOutputSeconds] = React.useState(30);
  const [frameRate, setFrameRate] = React.useState(24);
  const [imageQuality, setImageQuality] = React.useState('jpeg-high');
  const [result, setResult] = React.useState<TimelapseResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const eventDuration = eventHours * 3600 + eventMinutes * 60;
  const imageSizeMB = IMAGE_QUALITY_PRESETS[imageQuality]?.fileSizeMB || 10;

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (eventDuration <= 0) {
        setError('Hendelsens varighet må være større enn 0');
        setResult(null);
        return;
      }
      if (outputSeconds <= 0) {
        setError('Videolengden må være større enn 0');
        setResult(null);
        return;
      }

      const timelapseResult = calculateTimelapse({
        eventDuration,
        outputDuration: outputSeconds,
        frameRate,
      }, imageSizeMB);
      setResult(timelapseResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [eventDuration, outputSeconds, frameRate, imageSizeMB]);

  const reset = () => {
    setEventHours(1);
    setEventMinutes(0);
    setOutputSeconds(30);
    setFrameRate(24);
    setImageQuality('jpeg-high');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const applyScenario = (scenario: typeof TIMELAPSE_SCENARIOS[0]) => {
    const hours = Math.floor(scenario.typicalDuration / 3600);
    const minutes = Math.floor((scenario.typicalDuration % 3600) / 60);
    setEventHours(hours);
    setEventMinutes(minutes);
  };

  return (
    <CalculatorBase
      title="Timelapse"
      description="Regn ut innstillinger for timelapse: intervall, antall bilder og lagring"
      formula="Intervall = varighet på hendelsen ÷ (videolengde × bildefrekvens)"
      formulaExplanation="Planlegg timelapse med riktig intervall og overslag på lagring"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Intervall mellom bildene"
              value={result.intervalSeconds >= 1 
                ? `${formatFixed(result.intervalSeconds, 1)}s` 
                : `${formatFixed(result.intervalMs, 0)} ms`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Antall bilder"
              value={result.totalFrames.toLocaleString('nb-NO')}
              highlight
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Hastighetsfaktor"
              value={`${formatFixed(result.speedUpFactor, 0)}×`}
            />
            <ResultDisplay
              label="Videolengde"
              value={result.outputDurationFormatted}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Lagring som trengs"
              value={result.storageEstimateGB >= 1 
                ? `${formatFixed(result.storageEstimateGB, 1)} GB`
                : `${formatFixed(result.storageEstimateMB, 0)} MB`}
            />
            <ResultDisplay
              label="Opptakstid"
              value={result.shootingDurationFormatted}
            />
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Overslag for utstyr</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Batterier som trengs: </span>
                <span className="font-medium">{calculateBatteriesNeeded(result.totalFrames)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Kortkapasitet: </span>
                <span className="font-medium">{calculateCardCapacity(result.totalFrames, imageSizeMB)} GB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="event-hours"
            label="Varighet på hendelsen (timer)"
            value={eventHours}
            onChange={setEventHours}
            min={0}
            max={168}
            step={1}
          />
          <NumberInput
            id="event-minutes"
            label="Minutter"
            value={eventMinutes}
            onChange={setEventMinutes}
            min={0}
            max={59}
            step={1}
          />
        </div>

        <NumberInput
          id="output-seconds"
          label="Videolengde (sekunder)"
          value={outputSeconds}
          onChange={setOutputSeconds}
          min={1}
          max={600}
          step={1}
        />

        <SelectInput
          id="frame-rate"
          label="Bildefrekvens i videoen"
          value={frameRate.toString()}
          onChange={(v) => setFrameRate(parseInt(v))}
          options={FRAME_RATE_OPTIONS}
        />

        <SelectInput
          id="image-quality"
          label="Bildekvalitet"
          value={imageQuality}
          onChange={setImageQuality}
          options={QUALITY_OPTIONS}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Vanlige situasjoner</p>
          <div className="grid grid-cols-2 gap-2">
            {TIMELAPSE_SCENARIOS.slice(0, 6).map((scenario) => (
              <Card
                key={scenario.name}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => applyScenario(scenario)}
              >
                <p className="text-sm font-medium">{scenario.name}</p>
                <p className="text-xs text-muted-foreground">
                  ~{formatDuration(scenario.typicalDuration)}, {scenario.recommendedInterval}s intervall
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TimeLapseCalculator;
