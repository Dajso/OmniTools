'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import {
  calculateFrenchPressTimeline,
  formatTime,
  getNextEvent,
  getLastCompletedEvent,
  type FrenchPressResults,
  type TimelineEvent
} from '@/lib/calculations/coffee/french-press-timer';
import { Play, Pause, RotateCcw, Coffee, Timer, Info, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Zod schema for French press timer inputs
 */
const frenchPressSchema = z.object({
  coffeeDose: z.number()
    .min(10, 'Kaffemengden må være minst 10 g')
    .max(100, 'Kaffemengden kan ikke være over 100 g'),
  waterAmount: z.number()
    .min(100, 'Vannmengden må være minst 100 g')
    .max(2000, 'Vannmengden kan ikke være over 2000 g'),
  steepTime: z.number()
    .min(2, 'Trekketiden må være minst 2 minutter')
    .max(10, 'Trekketiden kan ikke være over 10 minutter'),
});

type FrenchPressFormInputs = z.infer<typeof frenchPressSchema>;

/**
 * Initial input values
 */
const INITIAL_INPUTS: FrenchPressFormInputs = {
  coffeeDose: 30,
  waterAmount: 500,
  steepTime: 4,
};

/**
 * Timeline event indicator component
 */
function TimelineEventIndicator({
  event,
  isActive,
  isComplete,
  elapsedSeconds
}: {
  event: TimelineEvent;
  isActive: boolean;
  isComplete: boolean;
  elapsedSeconds: number;
}) {
  const timeUntil = event.time - elapsedSeconds;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-all',
        isActive && 'bg-primary/10 border-primary shadow-sm ring-2 ring-primary/20',
        isComplete && !isActive && 'bg-muted/50 border-muted opacity-60',
        !isActive && !isComplete && 'border-border'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0',
          isActive && 'bg-primary text-primary-foreground animate-pulse',
          isComplete && !isActive && 'bg-muted text-muted-foreground',
          !isActive && !isComplete && 'bg-muted/50 text-muted-foreground'
        )}
      >
        {isComplete ? '✓' : (
          event.type === 'bloom' ? '🌸' :
            event.type === 'stir' ? '🥄' :
              '☕'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm font-medium capitalize', isActive && 'text-primary')}>
            {event.type === 'bloom' ? 'Forbløting og røring' :
              event.type === 'stir' ? 'Rør igjen' :
                'Press og server'}
          </p>
          <p className={cn('text-sm font-bold', isActive && 'text-primary')}>
            {formatTime(event.time)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{event.action}</p>
        {isActive && timeUntil > 0 && (
          <p className="text-xs text-primary font-medium mt-1">
            Om {formatTime(timeUntil)}
          </p>
        )}
      </div>
      {isActive && (
        <Bell className="h-5 w-5 text-primary animate-bounce" aria-hidden="true" />
      )}
    </div>
  );
}

/**
 * Coffee French Press Timer Component
 * 
 * Timer with bloom and stir reminders for French press brewing.
 * Calculates brew ratio and provides timeline with reminders.
 * 
 * Features:
 * - Coffee dose, water amount, and steep time inputs
 * - Real-time timer with event tracking
 * - Bloom reminder at 30 seconds
 * - Stir reminder at halfway point
 * - Press reminder at completion
 * - Brew ratio calculation and strength estimate
 * - Visual event indicators
 * - Audio/visual notifications
 * - Pause/resume functionality
 * - Reset functionality
 * - Brewing instructions
 * 
 * @see Requirements 10.1, 10.2, 10.3, 10.4, 15.1, 15.2
 */
export function FrenchPressTimer() {
  const [coffeeDose, setCoffeeDose] = React.useState(INITIAL_INPUTS.coffeeDose);
  const [waterAmount, setWaterAmount] = React.useState(INITIAL_INPUTS.waterAmount);
  const [steepTime, setSteepTime] = React.useState(INITIAL_INPUTS.steepTime);
  const [results, setResults] = React.useState<FrenchPressResults | null>(null);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // Timer state
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const lastNotifiedEventRef = React.useRef<number | null>(null);

  // Calculate timeline when inputs change
  React.useEffect(() => {
    try {
      const result = calculateFrenchPressTimeline({
        coffeeDose,
        waterAmount,
        steepTime,
      });
      setResults(result);
      setError(undefined);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setResults(null);
    }
  }, [coffeeDose, waterAmount, steepTime]);

  // Initialize audio
  React.useEffect(() => {
    // Create a simple beep sound using Web Audio API
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      // We'll use a data URL for a simple beep sound
      // This is a fallback - in production, you might want to use an actual audio file
    }
  }, []);

  // Timer effect
  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (startTime || now)) / 1000);
        setElapsedSeconds(elapsed);

        // Check for event notifications
        if (results) {
          const currentEvent = results.timeline.find(e => e.time === elapsed);
          if (currentEvent && lastNotifiedEventRef.current !== currentEvent.time) {
            // Trigger notification
            playNotificationSound();
            lastNotifiedEventRef.current = currentEvent.time;
          }

          // Auto-stop when timer completes
          if (elapsed >= results.totalTime) {
            setIsRunning(false);
            setElapsedSeconds(results.totalTime);
          }
        }
      }, 100); // Update every 100ms for smooth display
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, startTime, results]);

  const playNotificationSound = () => {
    // Play a notification sound
    // Using the Web Audio API to create a simple beep
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        // Silently fail if audio is not supported
        console.warn('Lydvarsel støttes ikke');
      }
    }
  };

  const handleStart = () => {
    if (!isRunning && elapsedSeconds === 0) {
      setStartTime(Date.now());
      lastNotifiedEventRef.current = null;
    } else if (!isRunning && elapsedSeconds > 0) {
      // Resume: adjust start time to account for elapsed time
      setStartTime(Date.now() - elapsedSeconds * 1000);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartTime(null);
    lastNotifiedEventRef.current = null;
  };

  const handleResetAll = () => {
    handleReset();
    setCoffeeDose(INITIAL_INPUTS.coffeeDose);
    setWaterAmount(INITIAL_INPUTS.waterAmount);
    setSteepTime(INITIAL_INPUTS.steepTime);
  };

  // Get current and next events
  const nextEvent = results ? getNextEvent(results.timeline, elapsedSeconds) : undefined;
  const activeEvent = results?.timeline.find(e => e.time === elapsedSeconds);
  const displayEvent = activeEvent || nextEvent;
  const lastCompletedEvent = results ? getLastCompletedEvent(results.timeline, elapsedSeconds) : undefined;
  const isComplete = results && elapsedSeconds >= results.totalTime;

  // Calculate progress percentage
  const progressPercent = results ? Math.min((elapsedSeconds / results.totalTime) * 100, 100) : 0;

  return (
    <CalculatorBase
      title="Presskanne-timer"
      description="Timer med påminnelser om forbløting og røring, for jevn kaffe fra presskanne, med utregning av bryggeforhold"
      formula="Bryggeforhold = vannmengde ÷ kaffemengde"
      formulaExplanation="Bryggeforholdet bestemmer styrken. Presskanne bruker klassisk 1:15 til 1:17 (for eksempel 30 g kaffe til 500 g vann = 1:16,7)."
      onReset={handleResetAll}
      error={error}
      results={results && (
        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Timer className="h-8 w-8 text-primary" aria-hidden="true" />
              <div className="text-6xl font-bold font-mono tabular-nums">
                {formatTime(elapsedSeconds)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Fremdrift for timeren"
              />
            </div>

            {/* Current Event Info */}
            {displayEvent && !isComplete && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm font-medium text-primary mb-1">
                  {activeEvent ? 'Nå' : 'Neste'}: {
                    displayEvent.type === 'bloom' ? 'Forbløting og røring' :
                      displayEvent.type === 'stir' ? 'Rør igjen' :
                        'Press og server'
                  }
                </p>
                <p className="text-lg font-bold text-primary">
                  {displayEvent.action}
                </p>
                {!activeEvent && displayEvent && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Ved {formatTime(displayEvent.time)} ({formatTime(displayEvent.time - elapsedSeconds)} igjen)
                  </p>
                )}
              </div>
            )}

            {/* Complete Message */}
            {isComplete && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-4">
                <p className="text-lg font-bold text-green-800 dark:text-green-400">
                  ✓ Ferdig traktet!
                </p>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                  Press stempelet sakte ned og server med en gang
                </p>
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning && elapsedSeconds === 0 && (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="gap-2"
                  aria-label="Start timeren"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Start timer
                </Button>
              )}

              {!isRunning && elapsedSeconds > 0 && !isComplete && (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="gap-2"
                  aria-label="Fortsett timeren"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Fortsett
                </Button>
              )}

              {isRunning && (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  aria-label="Sett timeren på pause"
                >
                  <Pause className="h-5 w-5" aria-hidden="true" />
                  Pause
                </Button>
              )}

              {elapsedSeconds > 0 && (
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  aria-label="Nullstill timeren"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  Nullstill
                </Button>
              )}
            </div>
          </div>

          {/* Timeline Events */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Coffee className="h-4 w-4" aria-hidden="true" />
              Fremdrift
            </h3>
            <div className="space-y-2">
              {results.timeline.map((event) => {
                const isActive = elapsedSeconds >= event.time &&
                  (nextEvent ? elapsedSeconds < nextEvent.time : true) &&
                  elapsedSeconds < results.totalTime;
                const isComplete = elapsedSeconds > event.time;
                return (
                  <TimelineEventIndicator
                    key={event.time}
                    event={event}
                    isActive={isActive}
                    isComplete={isComplete}
                    elapsedSeconds={elapsedSeconds}
                  />
                );
              })}
            </div>
          </div>

          {/* Brew Ratio and Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Bryggeforhold"
              value={results.brewRatioDisplay}
            />
            <ResultDisplay
              label="Total tid"
              value={formatTime(results.totalTime)}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm font-medium mb-1">Styrke</p>
            <p className="text-base text-foreground">{results.strengthEstimate}</p>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-2">Slik gjør du det</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {results.instructions.map((instruction, i) => (
                    <li key={i}>{i + 1}. {instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {/* Coffee Dose Input */}
      <NumberInput
        id="coffeeDose"
        label="Kaffemengde"
        value={coffeeDose}
        onChange={setCoffeeDose}
        min={10}
        max={100}
        step={1}
        unit="g"
        required
        placeholder="30"
      />

      {/* Water Amount Input */}
      <NumberInput
        id="waterAmount"
        label="Vannmengde"
        value={waterAmount}
        onChange={setWaterAmount}
        min={100}
        max={2000}
        step={10}
        unit="g"
        required
        placeholder="500"
      />

      {/* Steep Time Input */}
      <NumberInput
        id="steepTime"
        label="Trekketid"
        value={steepTime}
        onChange={setSteepTime}
        min={2}
        max={10}
        step={0.5}
        unit="min"
        required
        placeholder="4"
      />

      {/* French Press Tips */}
      <div className="text-xs text-muted-foreground bg-primary/5 rounded-md p-3 border border-primary/20">
        <p className="font-medium text-primary mb-1">Tips for presskanne</p>
        <ul className="space-y-0.5 ml-4">
          <li>• Bruk grov kverning (som havsalt)</li>
          <li>• Vanntemperatur: 90–96 °C</li>
          <li>• Klassisk forhold: 1:15 til 1:17 (kaffe til vann)</li>
          <li>• Rør forsiktig for å unngå overekstraksjon</li>
          <li>• Press sakte og jevnt</li>
          <li>• Server med en gang, så kaffen ikke blir bitter</li>
        </ul>
      </div>
    </CalculatorBase>
  );
}

export default FrenchPressTimer;
