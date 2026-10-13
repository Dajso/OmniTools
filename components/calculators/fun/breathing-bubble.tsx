'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Breathing patterns with timing in seconds
 */
const BREATHING_PATTERNS = {
  relaxing: {
    name: 'Avslappende (4-7-8)',
    description: 'Rolig pust som kan hjelpe når du er urolig',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfter: 0,
  },
  box: {
    name: 'Boksepust (4-4-4-4)',
    description: 'Brukes for å øke fokus',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
  },
  energizing: {
    name: 'Energigivende (4-0-4)',
    description: 'Rask pust som gir en energiboost',
    inhale: 4,
    hold: 0,
    exhale: 4,
    holdAfter: 0,
  },
  calming: {
    name: 'Dyp ro (5-5-5)',
    description: 'Jevn pust til meditasjon',
    inhale: 5,
    hold: 5,
    exhale: 5,
    holdAfter: 0,
  },
};

type PatternKey = keyof typeof BREATHING_PATTERNS;
type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter' | 'idle';

/**
 * Visual Breathing Bubble Component
 * 
 * A calming breathing exercise tool with visual animation.
 * 
 * Features:
 * - Multiple breathing patterns
 * - Animated bubble visualization
 * - Phase instructions
 * - Session tracking
 * 
 * @see Requirements 19.9
 */
export function BreathingBubble() {
  const [selectedPattern, setSelectedPattern] = React.useState<PatternKey>('relaxing');
  const [isActive, setIsActive] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [cycleCount, setCycleCount] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);

  const pattern = BREATHING_PATTERNS[selectedPattern];

  // Calculate bubble scale based on phase
  const getBubbleScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
      case 'holdAfter':
        return phase === 'hold' ? 1.5 : 1;
      case 'exhale':
        return 1;
      default:
        return 1;
    }
  };

  // Get phase instruction text
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Pust inn';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Pust ut';
      case 'holdAfter':
        return 'Hold';
      default:
        return 'Ready';
    }
  };

  // Get phase color
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
      case 'holdAfter':
        return 'from-purple-400 to-pink-400';
      case 'exhale':
        return 'from-green-400 to-teal-400';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  // Main breathing cycle effect
  React.useEffect(() => {
    if (!isActive) return;

    let currentPhase: Phase = 'inhale';
    let phaseTime = pattern.inhale;
    setPhase('inhale');
    setTimeLeft(pattern.inhale);

    const getNextPhase = (current: Phase): { phase: Phase; duration: number } => {
      switch (current) {
        case 'inhale':
          if (pattern.hold > 0) return { phase: 'hold', duration: pattern.hold };
          return { phase: 'exhale', duration: pattern.exhale };
        case 'hold':
          return { phase: 'exhale', duration: pattern.exhale };
        case 'exhale':
          if (pattern.holdAfter > 0) return { phase: 'holdAfter', duration: pattern.holdAfter };
          setCycleCount((c) => c + 1);
          return { phase: 'inhale', duration: pattern.inhale };
        case 'holdAfter':
          setCycleCount((c) => c + 1);
          return { phase: 'inhale', duration: pattern.inhale };
        default:
          return { phase: 'inhale', duration: pattern.inhale };
      }
    };

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const next = getNextPhase(currentPhase);
          currentPhase = next.phase;
          phaseTime = next.duration;
          setPhase(next.phase);
          return next.duration;
        }
        return prev - 1;
      });
      setTotalTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, pattern, selectedPattern]);

  const startSession = () => {
    setIsActive(true);
    setCycleCount(0);
    setTotalTime(0);
  };

  const stopSession = () => {
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Breathing bubble visualization */}
      <div className="flex flex-col items-center py-8">
        <div className="relative">
          {/* Outer glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-1000',
              `bg-gradient-to-br ${getPhaseColor()}`
            )}
            style={{
              transform: `scale(${getBubbleScale() * 1.2})`,
              transitionDuration: `${timeLeft}s`,
            }}
          />
          
          {/* Main bubble */}
          <div
            className={cn(
              'relative w-48 h-48 rounded-full flex items-center justify-center',
              'bg-gradient-to-br shadow-2xl',
              getPhaseColor()
            )}
            style={{
              transform: `scale(${getBubbleScale()})`,
              transition: `transform ${phase === 'idle' ? '0.3s' : `${timeLeft}s`} ease-in-out`,
            }}
          >
            {/* Inner content */}
            <div className="text-center text-white">
              <p className="text-2xl font-bold mb-1">{getPhaseText()}</p>
              {isActive && (
                <p className="text-4xl font-mono">{timeLeft}</p>
              )}
            </div>
          </div>
        </div>

        {/* Session stats */}
        {isActive && (
          <div className="mt-8 flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{cycleCount}</p>
              <p className="text-sm text-muted-foreground">Runder</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              <p className="text-sm text-muted-foreground">Varighet</p>
            </div>
          </div>
        )}

        {/* Control buttons */}
        <div className="mt-6">
          {!isActive ? (
            <Button onClick={startSession} size="lg" className="px-8">
              🧘 Start pusteøvelsen
            </Button>
          ) : (
            <Button onClick={stopSession} variant="outline" size="lg">
              ⏹️ Stopp økten
            </Button>
          )}
        </div>
      </div>

      {/* Pattern selection */}
      {!isActive && (
        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
          <Label className="font-medium">Velg pustemønster</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.entries(BREATHING_PATTERNS) as [PatternKey, typeof BREATHING_PATTERNS[PatternKey]][]).map(
              ([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPattern(key)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-all',
                    selectedPattern === key
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  )}
                >
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      Inn: {p.inhale}s
                    </span>
                    {p.hold > 0 && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        Hold: {p.hold}s
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Ut: {p.exhale}s
                    </span>
                    {p.holdAfter > 0 && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        Hold: {p.holdAfter}s
                      </span>
                    )}
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Benefits info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">✨ Fordeler med pusteøvelser</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Reduserer stress og uro</li>
          <li>• Kan senke blodtrykk og puls</li>
          <li>• Bedrer fokus og konsentrasjon</li>
          <li>• Fremmer bedre søvn</li>
          <li>• Aktiverer det parasympatiske nervesystemet</li>
        </ul>
      </div>
    </div>
  );
}

export default BreathingBubble;
