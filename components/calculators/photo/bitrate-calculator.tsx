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
  { value: '24', label: '24 fps (Cinema)' },
  { value: '25', label: '25 fps (PAL)' },
  { value: '30', label: '30 fps (Web)' },
  { value: '48', label: '48 fps (HFR)' },
  { value: '60', label: '60 fps (Smooth)' },
  { value: '120', label: '120 fps (Slow-mo)' },
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
      setError(err instanceof Error ? err.message : 'Calculation error');
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
      title="Video Bitrate Calculator"
      description="Calculate video bitrate and file size based on resolution and quality"
      formula="Bitrate = Pixels × Frame Rate × Bits per Pixel × Codec Factor"
      formulaExplanation="Estimate video bitrate and storage requirements for different quality settings"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Video Bitrate"
              value={formatBitrate(result.videoBitrateMbps)}
              highlight
              copyable
            />
            <ResultDisplay
              label="Total Bitrate"
              value={formatBitrate(result.totalBitrateMbps)}
              highlight
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Audio Bitrate"
              value={`${result.audioBitrateKbps} kbps`}
            />
            <ResultDisplay
              label="Pixels/Frame"
              value={result.pixelsPerFrame.toLocaleString()}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Size per Minute"
              value={formatFileSize(result.fileSizePerMinuteMB)}
            />
            <ResultDisplay
              label="Size per Hour"
              value={`${result.fileSizePerHourGB.toFixed(2)} GB`}
            />
          </div>
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">File Size for {duration} seconds:</p>
            <ResultDisplay
              label="Estimated File Size"
              value={formatFileSize(fileSizeForDuration)}
              highlight
              copyable
            />
          </div>
          {/* Platform Recommendations */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Platform Recommendations</p>
            <div className="space-y-2 text-sm">
              {STREAMING_RECOMMENDATIONS
                .filter(r => r.resolution === VIDEO_RESOLUTIONS.find(v => v.width === width)?.label)
                .slice(0, 3)
                .map((rec, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{rec.platform}:</span>
                    <span>{rec.recommendedBitrateMbps} Mbps</span>
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
          label="Resolution"
          value={resolution}
          onChange={setResolution}
          options={RESOLUTION_OPTIONS}
        />

        <SelectInput
          id="frame-rate"
          label="Frame Rate"
          value={frameRate.toString()}
          onChange={(v) => setFrameRate(parseInt(v))}
          options={FRAME_RATE_OPTIONS}
        />

        <SelectInput
          id="quality"
          label="Quality Preset"
          value={quality}
          onChange={(v) => setQuality(v as keyof typeof QUALITY_PRESETS)}
          options={QUALITY_OPTIONS}
        />

        <SelectInput
          id="codec"
          label="Video Codec"
          value={codec}
          onChange={(v) => setCodec(v as keyof typeof VIDEO_CODECS)}
          options={CODEC_OPTIONS}
        />

        <NumberInput
          id="duration"
          label="Video Duration (seconds)"
          value={duration}
          onChange={setDuration}
          min={1}
          max={36000}
          step={1}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Quick Resolution Presets</p>
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
