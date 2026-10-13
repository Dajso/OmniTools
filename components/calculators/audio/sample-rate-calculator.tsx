'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  calculateFileSize,
  calculateDuration,
  calculateNyquist,
  calculateDynamicRange,
  calculateSNR,
  SAMPLE_RATES,
  BIT_DEPTHS,
  AUDIO_PRESETS,
  type AudioFormat,
  type AudioFileSizeResult,
} from '@/lib/calculations/audio/sample-rate-calculator';

type Mode = 'size' | 'duration' | 'specs';

export function SampleRateCalculator() {
  const [mode, setMode] = React.useState<Mode>('size');
  const [sampleRate, setSampleRate] = React.useState<number>(44100);
  const [bitDepth, setBitDepth] = React.useState<number>(16);
  const [channels, setChannels] = React.useState<number>(2);
  const [durationMinutes, setDurationMinutes] = React.useState<number>(3);
  const [durationSeconds, setDurationSeconds] = React.useState<number>(30);
  const [fileSizeMB, setFileSizeMB] = React.useState<number>(30);

  const [fileSizeResult, setFileSizeResult] = React.useState<AudioFileSizeResult | null>(null);
  const [calculatedDuration, setCalculatedDuration] = React.useState<number | null>(null);

  const totalSeconds = durationMinutes * 60 + durationSeconds;

  React.useEffect(() => {
    const format: AudioFormat = { sampleRate, bitDepth, channels };
    if (mode === 'size' && totalSeconds > 0) {
      try {
        const result = calculateFileSize(format, totalSeconds);
        setFileSizeResult(result);
      } catch {
        setFileSizeResult(null);
      }
    } else if (mode === 'duration' && fileSizeMB > 0) {
      try {
        const bytes = fileSizeMB * 1024 * 1024;
        const duration = calculateDuration(format, bytes);
        setCalculatedDuration(duration);
      } catch {
        setCalculatedDuration(null);
      }
    }
  }, [mode, sampleRate, bitDepth, channels, totalSeconds, fileSizeMB]);

  const nyquist = calculateNyquist(sampleRate);
  const dynamicRange = calculateDynamicRange(bitDepth);
  const snr = calculateSNR(bitDepth);

  const sampleRateOptions = Object.entries(SAMPLE_RATES).map(([key, value]) => ({
    value: String(value.hz),
    label: value.name,
  }));

  const bitDepthOptions = Object.entries(BIT_DEPTHS).map(([key, value]) => ({
    value: String(value.bits),
    label: value.name,
  }));

  const channelOptions = [
    { value: '1', label: 'Mono (1 channel)' },
    { value: '2', label: 'Stereo (2 channels)' },
    { value: '6', label: '5.1 Surround (6 channels)' },
    { value: '8', label: '7.1 Surround (8 channels)' },
  ];

  const applyPreset = (presetName: keyof typeof AUDIO_PRESETS) => {
    const preset = AUDIO_PRESETS[presetName];
    setSampleRate(preset.sampleRate);
    setBitDepth(preset.bitDepth);
    setChannels(preset.channels);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Sample Rate Calculator</CardTitle>
        <CardDescription>
          Calculate audio file sizes, durations, and technical specifications for different sample rates and bit depths.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'size' ? 'default' : 'outline'}
            onClick={() => setMode('size')}
            size="sm"
          >
            Calculate Size
          </Button>
          <Button
            variant={mode === 'duration' ? 'default' : 'outline'}
            onClick={() => setMode('duration')}
            size="sm"
          >
            Calculate Duration
          </Button>
          <Button
            variant={mode === 'specs' ? 'default' : 'outline'}
            onClick={() => setMode('specs')}
            size="sm"
          >
            Specs Only
          </Button>
        </div>

        {/* Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Quality Presets</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset('cd-quality')}>
              CD Quality
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('dvd-quality')}>
              DVD Quality
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('high-res')}>
              High-Res
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('podcast')}>
              Podcast
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('voice-mono')}>
              Voice
            </Button>
          </div>
        </div>

        {/* Audio Format Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sample-rate">Sample Rate</Label>
            <Select
              id="sample-rate"
              options={sampleRateOptions}
              value={String(sampleRate)}
              onChange={(e) => setSampleRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bit-depth">Bit Depth</Label>
            <Select
              id="bit-depth"
              options={bitDepthOptions}
              value={String(bitDepth)}
              onChange={(e) => setBitDepth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channels">Channels</Label>
            <Select
              id="channels"
              options={channelOptions}
              value={String(channels)}
              onChange={(e) => setChannels(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Duration Input (for size calculation) */}
        {mode === 'size' && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="duration-minutes"
              label="Duration (minutes)"
              value={durationMinutes}
              onChange={setDurationMinutes}
              min={0}
              max={999}
              step={1}
            />
            <NumberInput
              id="duration-seconds"
              label="Duration (seconds)"
              value={durationSeconds}
              onChange={setDurationSeconds}
              min={0}
              max={59}
              step={1}
            />
          </div>
        )}

        {/* File Size Input (for duration calculation) */}
        {mode === 'duration' && (
          <NumberInput
            id="file-size"
            label="File Size"
            value={fileSizeMB}
            onChange={setFileSizeMB}
            min={0.1}
            max={10000}
            step={0.1}
            unit="MB"
          />
        )}

        {/* File Size Result */}
        {mode === 'size' && fileSizeResult && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">File Size (Uncompressed WAV)</p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="File Size"
                value={fileSizeResult.formatted}
                highlight
                copyable
              />
              <ResultDisplay
                label="Bit Rate"
                value={fileSizeResult.bitRateKbps.toLocaleString('nb-NO')}
                unit="kbps"
                copyable
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <ResultDisplay label="Bytes" value={fileSizeResult.bytes.toLocaleString('nb-NO')} />
              <ResultDisplay label="Kilobytes" value={fileSizeResult.kilobytes.toFixed(2)} />
              <ResultDisplay label="Megabytes" value={fileSizeResult.megabytes.toFixed(2)} />
            </div>
          </div>
        )}

        {/* Duration Result */}
        {mode === 'duration' && calculatedDuration !== null && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Calculated Duration</p>
            <ResultDisplay
              label="Duration"
              value={formatDuration(calculatedDuration)}
              highlight
            />
            <p className="text-sm text-muted-foreground mt-2">
              {calculatedDuration.toFixed(1)} seconds total
            </p>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Technical Specifications</p>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Nyquist Frequency"
              value={(nyquist.nyquistFrequency / 1000).toFixed(1)}
              unit="kHz"
            />
            <ResultDisplay
              label="Dynamic Range"
              value={dynamicRange.toFixed(1)}
              unit="dB"
            />
            <ResultDisplay
              label="Signal-to-Noise Ratio"
              value={snr.toFixed(1)}
              unit="dB"
            />
            <ResultDisplay
              label="Max Frequency"
              value={(nyquist.nyquistFrequency / 1000).toFixed(1)}
              unit="kHz"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>File sizes are for uncompressed PCM audio (WAV format)</li>
            <li>Compressed formats (MP3, AAC) are typically 5-10x smaller</li>
            <li>Nyquist frequency is the maximum frequency that can be represented</li>
            <li>Human hearing range is approximately 20 Hz - 20 kHz</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default SampleRateCalculator;
