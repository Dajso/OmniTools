'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Sound effect definitions
 * Using Web Audio API to generate sounds programmatically
 */
interface SoundEffect {
  id: string;
  name: string;
  emoji: string;
  category: 'reaction' | 'music' | 'nature' | 'funny';
  color: string;
  generate: (audioContext: AudioContext) => void;
}

/**
 * Generate a beep sound
 */
function generateBeep(ctx: AudioContext, frequency: number, duration: number, type: OscillatorType = 'sine') {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * Generate a drum sound
 */
function generateDrum(ctx: AudioContext) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(150, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
}

/**
 * Generate a success/win sound
 */
function generateSuccess(ctx: AudioContext) {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => generateBeep(ctx, freq, 0.2, 'sine'), i * 100);
  });
}

/**
 * Generate a fail/error sound
 */
function generateFail(ctx: AudioContext) {
  generateBeep(ctx, 200, 0.3, 'sawtooth');
  setTimeout(() => generateBeep(ctx, 150, 0.4, 'sawtooth'), 200);
}

/**
 * Generate a laser sound
 */
function generateLaser(ctx: AudioContext) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
}

/**
 * Generate a coin sound
 */
function generateCoin(ctx: AudioContext) {
  generateBeep(ctx, 988, 0.1, 'square');
  setTimeout(() => generateBeep(ctx, 1319, 0.2, 'square'), 100);
}

/**
 * Generate a pop sound
 */
function generatePop(ctx: AudioContext) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

/**
 * Generate a whoosh sound
 */
function generateWhoosh(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();
  
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
  
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  source.start(ctx.currentTime);
}

/**
 * Generate a bell sound
 */
function generateBell(ctx: AudioContext) {
  const frequencies = [523.25, 659.25, 783.99, 1046.5];
  frequencies.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  });
}

/**
 * Generate an alarm sound
 */
function generateAlarm(ctx: AudioContext) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      generateBeep(ctx, 880, 0.15, 'square');
    }, i * 200);
  }
}

/**
 * Sound effects library
 */
const SOUND_EFFECTS: SoundEffect[] = [
  { id: 'success', name: 'Success!', emoji: '✅', category: 'reaction', color: 'bg-green-500', generate: generateSuccess },
  { id: 'fail', name: 'Fail', emoji: '❌', category: 'reaction', color: 'bg-red-500', generate: generateFail },
  { id: 'coin', name: 'Coin', emoji: '🪙', category: 'funny', color: 'bg-yellow-500', generate: generateCoin },
  { id: 'laser', name: 'Laser', emoji: '🔫', category: 'funny', color: 'bg-purple-500', generate: generateLaser },
  { id: 'drum', name: 'Drum', emoji: '🥁', category: 'music', color: 'bg-orange-500', generate: generateDrum },
  { id: 'pop', name: 'Pop', emoji: '💥', category: 'funny', color: 'bg-pink-500', generate: generatePop },
  { id: 'whoosh', name: 'Whoosh', emoji: '💨', category: 'nature', color: 'bg-cyan-500', generate: generateWhoosh },
  { id: 'bell', name: 'Bell', emoji: '🔔', category: 'music', color: 'bg-amber-500', generate: generateBell },
  { id: 'alarm', name: 'Alarm', emoji: '🚨', category: 'reaction', color: 'bg-red-600', generate: generateAlarm },
  { id: 'beep', name: 'Beep', emoji: '📟', category: 'reaction', color: 'bg-blue-500', generate: (ctx) => generateBeep(ctx, 800, 0.2, 'sine') },
  { id: 'boop', name: 'Boop', emoji: '👆', category: 'funny', color: 'bg-indigo-500', generate: (ctx) => generateBeep(ctx, 400, 0.15, 'sine') },
  { id: 'ding', name: 'Ding', emoji: '🛎️', category: 'reaction', color: 'bg-yellow-400', generate: (ctx) => generateBeep(ctx, 1200, 0.3, 'sine') },
];

/**
 * Soundboard Component
 * 
 * An interactive soundboard with various sound effects.
 * 
 * Features:
 * - Multiple sound categories
 * - Web Audio API generated sounds
 * - Visual feedback on play
 * - Volume control
 * 
 * @see Requirements 19.10
 */
export function Soundboard() {
  const [audioContext, setAudioContext] = React.useState<AudioContext | null>(null);
  const [activeSound, setActiveSound] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>('all');

  // Initialize audio context on first interaction
  const initAudio = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  };

  const playSound = (sound: SoundEffect) => {
    const ctx = initAudio();
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    setActiveSound(sound.id);
    sound.generate(ctx);
    
    // Reset active state after animation
    setTimeout(() => setActiveSound(null), 300);
  };

  const filteredSounds = filter === 'all' 
    ? SOUND_EFFECTS 
    : SOUND_EFFECTS.filter(s => s.category === filter);

  const categories = ['all', 'reaction', 'music', 'nature', 'funny'];

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat)}
            className="capitalize"
          >
            {cat === 'all' ? '🎵 All' : cat}
          </Button>
        ))}
      </div>

      {/* Sound buttons grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {filteredSounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => playSound(sound)}
            className={cn(
              'p-4 rounded-lg text-white font-medium transition-all',
              'hover:scale-105 active:scale-95',
              'flex flex-col items-center gap-2',
              sound.color,
              activeSound === sound.id && 'ring-4 ring-white ring-opacity-50 scale-110'
            )}
          >
            <span className="text-3xl">{sound.emoji}</span>
            <span className="text-sm">{sound.name}</span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-muted/30 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          🔊 Click any button to play a sound effect!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sounds are generated using the Web Audio API - no files needed!
        </p>
      </div>

      {/* Fun ideas */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">💡 Fun Ideas</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Use during video calls for reactions</li>
          <li>• Add sound effects to presentations</li>
          <li>• Create your own game show atmosphere</li>
          <li>• Perfect for streaming and content creation</li>
        </ul>
      </div>
    </div>
  );
}

export default Soundboard;
