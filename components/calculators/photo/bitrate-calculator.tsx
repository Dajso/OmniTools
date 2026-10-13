'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateBitrate,
  VIDEO_RESOLUTIONS,
  VIDEO_CODECS,
  QUALITY_PRESETS,
  STREAMING_RECOMMENDATIONS,
  formatBitrate,
  formatFileSize,
  calculateFileSize,
  type BitrateResult,
} from '@/lib/calculations/photo/bitrate-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const RESOLUTION_OPTIONS = VIDEO_RESOLUTIONS.map(r => ({
  value: `${r.width}x${r.height}`,
  label: r.name,
}));

const CODEC_OPTIONS = Object.entries(VIDEO_CODECS).map(([key, codec]) => ({
  value: key,
  label: `${codec.name} - ${codec.description}`,
}));

const QUALITY_OPTIONS = Object.entries(QUALITY_PRESETS).map(([key, preset]) => ({
  value: key,
  label: `${preset.name} - ${preset.description}`,
}));

const FRAME_RATE_OPTIONS = [
  { value: '24', label: '24 b/s (kino)' },
  { value: '25', label: '25 b/s (PAL, Europa)' },
  { value: '30', label: '30 b/s (nett)' },
  { value: '48', label: '48 b/s (høy bildefrekvens)' },
  { value: '60', label: '60 b/s (jevn)' },
  { value: '120', label: '120 b/s (sakte film)' },
];

export function BitrateCalculator() {
  const [resolution, setResolution] = React.useState('1920x1080');
  const [frameRate, setFrameRate] = React.useState(24);
  const [quality, setQuality] = React.useState<keyof typeof QUALITY_PRESETS>('high');
  const [codec, setCodec] = React.useState<keyof typeof VIDEO_CODECS>('h264');
  const [duration, setDuration] = React.useState(60);
  const [result, setResult] = React.useState<BitrateResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const [width, height] = resolution.split('x').map(Number);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const bitrateResult = calculateBitrate({
        width,
        height,
        frameRate,
        quality,
        codec,
      });
      setResult(bitrateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [width, height, frameRate, quality, codec]);

  const reset = () => {
    setResolution('1920x1080');
    setFrameRate(24);
    setQuality('high');
    setCodec('h264');
    setDuration(60);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const fileSizeForDuration = result ? calculateFileSize(result.totalBitrateMbps, duration) : 0;

  return (
    <CalculatorBase
      title="Videobitrate"
      description="Regn ut videobitrate og filstørrelse ut fra oppløsning og kvalitet"
      formula="Bitrate = piksler × bildefrekvens × bit per piksel × kodekfaktor"
      formulaExplanation="Anslå videobitrate og lagringsbehov for ulike kvalitetsinnstillinger"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Videobitrate"
              value={formatBitrate(result.videoBitrateMbps)}
              highlight
              copyable
            />
            <ResultDisplay
              label="Total bitrate"
              value={formatBitrate(result.totalBitrateMbps)}
              highlight
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Lydbitrate"
              value={`${result.audioBitrateKbps} kbit/s`}
            />
            <ResultDisplay
              label="Piksler per bilde"
              value={result.pixelsPerFrame.toLocaleString('nb-NO')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Størrelse per minutt"
              value={formatFileSize(result.fileSizePerMinuteMB)}
            />
            <ResultDisplay
              label="Størrelse per time"
              value={`${formatFixed(result.fileSizePerHourGB, 2)} GB`}
            />
          </div>
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Filstørrelse for {duration} sekunder:</p>
            <ResultDisplay
              label="Anslått filstørrelse"
              value={formatFileSize(fileSizeForDuration)}
              highlight
              copyable
            />
          </div>
          {/* Platform Recommendations */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Anbefalinger per plattform</p>
            <div className="space-y-2 text-sm">
              {STREAMING_RECOMMENDATIONS
                .filter(r => r.resolution === VIDEO_RESOLUTIONS.find(v => v.width === width)?.label)
                .slice(0, 3)
                .map((rec, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{rec.platform}:</span>
                    <span>{rec.recommendedBitrateMbps} Mbit/s</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="resolution"
          label="Oppløsning"
          value={resolution}
          onChange={setResolution}
          options={RESOLUTION_OPTIONS}
        />

        <SelectInput
          id="frame-rate"
          label="Bildefrekvens"
          value={frameRate.toString()}
          onChange={(v) => setFrameRate(parseInt(v))}
          options={FRAME_RATE_OPTIONS}
        />

        <SelectInput
          id="quality"
          label="Kvalitetsvalg"
          value={quality}
          onChange={(v) => setQuality(v as keyof typeof QUALITY_PRESETS)}
          options={QUALITY_OPTIONS}
        />

        <SelectInput
          id="codec"
          label="Videokodek"
          value={codec}
          onChange={(v) => setCodec(v as keyof typeof VIDEO_CODECS)}
          options={CODEC_OPTIONS}
        />

        <NumberInput
          id="duration"
          label="Videolengde (sekunder)"
          value={duration}
          onChange={setDuration}
          min={1}
          max={36000}
          step={1}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Vanlige oppløsninger</p>
          <div className="flex gap-2 flex-wrap">
            {['720p', '1080p', '4K'].map((label) => {
              const res = VIDEO_RESOLUTIONS.find(r => r.label === label);
              if (!res) return null;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setResolution(`${res.width}x${res.height}`)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    resolution === `${res.width}x${res.height}`
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BitrateCalculator;
