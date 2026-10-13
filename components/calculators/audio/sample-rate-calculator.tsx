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
import { formatFixed } from '@/lib/utils/formatting';

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
    { value: '1', label: 'Mono (1 kanal)' },
    { value: '2', label: 'Stereo (2 kanaler)' },
    { value: '6', label: '5.1 surround (6 kanaler)' },
    { value: '8', label: '7.1 surround (8 kanaler)' },
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
        <CardTitle>Samplingsfrekvens</CardTitle>
        <CardDescription>
          Regn ut lydfilstørrelse, varighet og tekniske data for ulike samplingsfrekvenser og bitdybder.
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
            Regn ut størrelse
          </Button>
          <Button
            variant={mode === 'duration' ? 'default' : 'outline'}
            onClick={() => setMode('duration')}
            size="sm"
          >
            Regn ut varighet
          </Button>
          <Button
            variant={mode === 'specs' ? 'default' : 'outline'}
            onClick={() => setMode('specs')}
            size="sm"
          >
            Bare data
          </Button>
        </div>

        {/* Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Kvalitetsvalg</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset('cd-quality')}>
              CD-kvalitet
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('dvd-quality')}>
              DVD-kvalitet
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('high-res')}>
              Høyoppløselig
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('podcast')}>
              Podkast
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('voice-mono')}>
              Tale
            </Button>
          </div>
        </div>

        {/* Audio Format Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sample-rate">Samplingsfrekvens</Label>
            <Select
              id="sample-rate"
              options={sampleRateOptions}
              value={String(sampleRate)}
              onChange={(e) => setSampleRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bit-depth">Bitdybde</Label>
            <Select
              id="bit-depth"
              options={bitDepthOptions}
              value={String(bitDepth)}
              onChange={(e) => setBitDepth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channels">Kanaler</Label>
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
              label="Varighet (minutter)"
              value={durationMinutes}
              onChange={setDurationMinutes}
              min={0}
              max={999}
              step={1}
            />
            <NumberInput
              id="duration-seconds"
              label="Varighet (sekunder)"
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
            label="Filstørrelse"
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
            <p className="text-sm font-medium mb-3">Filstørrelse (ukomprimert WAV)</p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Filstørrelse"
                value={fileSizeResult.formatted}
                highlight
                copyable
              />
              <ResultDisplay
                label="Bitrate"
                value={fileSizeResult.bitRateKbps.toLocaleString('nb-NO')}
                unit="kbit/s"
                copyable
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <ResultDisplay label="Byte" value={fileSizeResult.bytes.toLocaleString('nb-NO')} />
              <ResultDisplay label="Kilobyte" value={formatFixed(fileSizeResult.kilobytes, 2)} />
              <ResultDisplay label="Megabyte" value={formatFixed(fileSizeResult.megabytes, 2)} />
            </div>
          </div>
        )}

        {/* Duration Result */}
        {mode === 'duration' && calculatedDuration !== null && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Utregnet varighet</p>
            <ResultDisplay
              label="Varighet"
              value={formatDuration(calculatedDuration)}
              highlight
            />
            <p className="text-sm text-muted-foreground mt-2">
              {formatFixed(calculatedDuration, 1)} sekunder totalt
            </p>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Tekniske data</p>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Nyquist-frekvens"
              value={formatFixed((nyquist.nyquistFrequency / 1000), 1)}
              unit="kHz"
            />
            <ResultDisplay
              label="Dynamikkområde"
              value={formatFixed(dynamicRange, 1)}
              unit="dB"
            />
            <ResultDisplay
              label="Signal/støy-forhold"
              value={formatFixed(snr, 1)}
              unit="dB"
            />
            <ResultDisplay
              label="Høyeste frekvens"
              value={formatFixed((nyquist.nyquistFrequency / 1000), 1)}
              unit="kHz"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Merknader:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Filstørrelsene gjelder ukomprimert PCM-lyd (WAV)</li>
            <li>Komprimerte formater (MP3, AAC) er vanligvis 5–10 ganger mindre</li>
            <li>Nyquist-frekvensen er den høyeste frekvensen som kan gjengis</li>
            <li>Menneskets hørselsområde er omtrent 20 Hz – 20 kHz</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default SampleRateCalculator;
