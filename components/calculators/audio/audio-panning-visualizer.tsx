'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle';

const WAVE_TYPES: { value: WaveType; label: string }[] = [
  { value: 'sine', label: 'Sine (Smooth)' },
  { value: 'square', label: 'Square (Harsh)' },
  { value: 'sawtooth', label: 'Sawtooth (Bright)' },
  { value: 'triangle', label: 'Triangle (Soft)' },
];

const FREQUENCY_PRESETS = [
  { label: 'Bass (100 Hz)', value: 100 },
  { label: 'Low Mid (300 Hz)', value: 300 },
  { label: 'Mid (1000 Hz)', value: 1000 },
  { label: 'High Mid (3000 Hz)', value: 3000 },
  { label: 'High (8000 Hz)', value: 8000 },
];

export function AudioPanningVisualizer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [pan, setPan] = React.useState<number>(0); // -1 (left) to 1 (right)
  const [frequency, setFrequency] = React.useState<number>(440);
  const [volume, setVolume] = React.useState<number>(0.3);
  const [waveType, setWaveType] = React.useState<WaveType>('sine');
  const [autoPan, setAutoPan] = React.useState(false);
  const [autoPanSpeed, setAutoPanSpeed] = React.useState<number>(1);

  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorRef = React.useRef<OscillatorNode | null>(null);
  const pannerRef = React.useRef<StereoPannerNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);
  const autoPanIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoPanDirectionRef = React.useRef<number>(1);

  const startAudio = React.useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Create nodes
    const oscillator = ctx.createOscillator();
    const panner = ctx.createStereoPanner();
    const gain = ctx.createGain();

    // Configure
    oscillator.type = waveType;
    oscillator.frequency.value = frequency;
    panner.pan.value = pan;
    gain.gain.value = volume;

    // Connect
    oscillator.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);

    // Store refs
    oscillatorRef.current = oscillator;
    pannerRef.current = panner;
    gainRef.current = gain;

    // Start
    oscillator.start();
    setIsPlaying(true);
  }, [frequency, pan, volume, waveType]);

  const stopAudio = React.useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (autoPanIntervalRef.current) {
      clearInterval(autoPanIntervalRef.current);
      autoPanIntervalRef.current = null;
    }
    setIsPlaying(false);
    setAutoPan(false);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Update pan in real-time
  React.useEffect(() => {
    if (pannerRef.current) {
      pannerRef.current.pan.value = pan;
    }
  }, [pan]);

  // Update frequency in real-time
  React.useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
  }, [frequency]);

  // Update volume in real-time
  React.useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  // Update wave type (requires restart)
  React.useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = waveType;
    }
  }, [waveType]);

  // Auto-pan effect
  React.useEffect(() => {
    if (autoPan && isPlaying) {
      autoPanIntervalRef.current = setInterval(() => {
        setPan(prev => {
          let newPan = prev + (0.05 * autoPanSpeed * autoPanDirectionRef.current);
          if (newPan >= 1) {
            newPan = 1;
            autoPanDirectionRef.current = -1;
          } else if (newPan <= -1) {
            newPan = -1;
            autoPanDirectionRef.current = 1;
          }
          return Math.round(newPan * 100) / 100;
        });
      }, 50);
    } else if (autoPanIntervalRef.current) {
      clearInterval(autoPanIntervalRef.current);
      autoPanIntervalRef.current = null;
    }

    return () => {
      if (autoPanIntervalRef.current) {
        clearInterval(autoPanIntervalRef.current);
      }
    };
  }, [autoPan, isPlaying, autoPanSpeed]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);

  const getPanLabel = () => {
    if (pan === 0) return 'Center';
    if (pan < 0) return `${Math.abs(pan * 100).toFixed(0)}% Left`;
    return `${(pan * 100).toFixed(0)}% Right`;
  };

  const getLeftVolume = () => Math.max(0, 1 - pan) * 100;
  const getRightVolume = () => Math.max(0, 1 + pan) * 100;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Audio Panning Visualizer</CardTitle>
        <CardDescription>
          Visualize and test stereo panning. Hear how sound moves between left and right channels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Panning Display */}
        <div className="bg-muted rounded-lg p-6">
          {/* Speaker visualization */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all"
                style={{ 
                  backgroundColor: `rgba(var(--primary), ${getLeftVolume() / 100})`,
                  transform: `scale(${0.8 + (getLeftVolume() / 500)})`
                }}
              >
                🔊
              </div>
              <p className="text-sm mt-1 font-medium">Left</p>
              <p className="text-xs text-muted-foreground">{getLeftVolume().toFixed(0)}%</p>
            </div>
            
            <div className="flex-1 mx-4">
              {/* Pan indicator */}
              <div className="relative h-4 bg-muted-foreground/20 rounded-full">
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-muted-foreground/40" />
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-primary rounded-full -translate-y-1/2 transition-all"
                  style={{ left: `${(pan + 1) * 50}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <p className="text-center text-sm mt-2 font-medium">{getPanLabel()}</p>
            </div>

            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all"
                style={{ 
                  backgroundColor: `rgba(var(--primary), ${getRightVolume() / 100})`,
                  transform: `scale(${0.8 + (getRightVolume() / 500)})`
                }}
              >
                🔊
              </div>
              <p className="text-sm mt-1 font-medium">Right</p>
              <p className="text-xs text-muted-foreground">{getRightVolume().toFixed(0)}%</p>
            </div>
          </div>

          {/* Pan Slider */}
          <div className="space-y-2">
            <Label htmlFor="pan-slider">Pan Position</Label>
            <input
              id="pan-slider"
              type="range"
              min="-100"
              max="100"
              value={pan * 100}
              onChange={(e) => setPan(Number(e.target.value) / 100)}
              className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>
        </div>

        {/* Quick Pan Buttons */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Pan</p>
          <div className="flex gap-2 justify-center">
            <Button variant={pan === -1 ? 'default' : 'outline'} size="sm" onClick={() => setPan(-1)}>
              Hard Left
            </Button>
            <Button variant={pan === -0.5 ? 'default' : 'outline'} size="sm" onClick={() => setPan(-0.5)}>
              50% Left
            </Button>
            <Button variant={pan === 0 ? 'default' : 'outline'} size="sm" onClick={() => setPan(0)}>
              Center
            </Button>
            <Button variant={pan === 0.5 ? 'default' : 'outline'} size="sm" onClick={() => setPan(0.5)}>
              50% Right
            </Button>
            <Button variant={pan === 1 ? 'default' : 'outline'} size="sm" onClick={() => setPan(1)}>
              Hard Right
            </Button>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="frequency"
            label="Frequency (Hz)"
            value={frequency}
            onChange={setFrequency}
            min={20}
            max={20000}
            step={10}
          />
          <NumberInput
            id="volume"
            label="Volume"
            value={Math.round(volume * 100)}
            onChange={(v) => setVolume(v / 100)}
            min={0}
            max={100}
            step={5}
            unit="%"
          />
        </div>

        {/* Frequency Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Frequency Presets</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_PRESETS.map(preset => (
              <Button
                key={preset.value}
                variant={frequency === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFrequency(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Wave Type */}
        <div className="space-y-2">
          <Label htmlFor="wave-type">Wave Type</Label>
          <Select
            id="wave-type"
            options={WAVE_TYPES}
            value={waveType}
            onChange={(e) => setWaveType(e.target.value as WaveType)}
          />
        </div>

        {/* Auto-Pan */}
        <div className="flex items-center gap-4">
          <Button
            variant={autoPan ? 'default' : 'outline'}
            onClick={() => setAutoPan(!autoPan)}
            disabled={!isPlaying}
          >
            {autoPan ? 'Stop Auto-Pan' : 'Start Auto-Pan'}
          </Button>
          {autoPan && (
            <NumberInput
              id="auto-pan-speed"
              label="Speed"
              value={autoPanSpeed}
              onChange={setAutoPanSpeed}
              min={0.5}
              max={5}
              step={0.5}
              className="w-32"
            />
          )}
        </div>

        {/* Play/Stop Button */}
        <Button
          onClick={toggleAudio}
          size="lg"
          className="w-full"
          variant={isPlaying ? 'destructive' : 'default'}
        >
          {isPlaying ? 'Stop Sound' : 'Play Sound'}
        </Button>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click &quot;Play Sound&quot; to start the test tone</li>
            <li>Use the slider or buttons to adjust panning</li>
            <li>Enable Auto-Pan to hear the sound move between speakers</li>
            <li>Use headphones for the best stereo experience</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default AudioPanningVisualizer;
