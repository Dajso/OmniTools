'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import {
  calculatePourSchedule,
  formatTime,
  getCurrentStage,
  getNextStage,
  type PourOverResults,
  type PourMethod
} from '@/lib/calculations/coffee/pour-over-timer';
import { Play, Pause, RotateCcw, Coffee, Timer, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Zod schema for pour over timer inputs
 */
const pourOverSchema = z.object({
  totalWater: z.number()
    .min(100, 'Total vannmengde må være minst 100 g')
    .max(1000, 'Total vannmengde kan ikke være over 1000 g'),
  method: z.enum(['4:6', 'tetsu-kasuya', 'custom']),
  numberOfPours: z.number()
    .min(1, 'Antall helleomganger må være minst 1')
    .max(10, 'Antall helleomganger kan ikke være over 10')
    .optional(),
});

type PourOverFormInputs = z.infer<typeof pourOverSchema>;

/**
 * Initial input values
 */
const INITIAL_INPUTS: PourOverFormInputs = {
  totalWater: 300,
  method: '4:6',
};

/**
 * Method options for select input
 */
const METHOD_OPTIONS = [
  { value: '4:6', label: '4:6-metoden (Tetsu Kasuya)' },
  { value: 'custom', label: 'Egne helleomganger' },
];

/**
 * Stage indicator component
 */
function StageIndicator({
  stage,
  isActive,
  isComplete
}: {
  stage: { stageNumber: number; waterAmount: number; description: string };
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-all',
        isActive && 'bg-primary/10 border-primary shadow-sm',
        isComplete && !isActive && 'bg-muted/50 border-muted opacity-60',
        !isActive && !isComplete && 'border-border'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0',
          isActive && 'bg-primary text-primary-foreground',
          isComplete && !isActive && 'bg-muted text-muted-foreground',
          !isActive && !isComplete && 'bg-muted/50 text-muted-foreground'
        )}
      >
        {isComplete && !isActive ? '✓' : stage.stageNumber}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm font-medium', isActive && 'text-primary')}>
            Hell {stage.stageNumber}
          </p>
          <p className={cn('text-sm font-bold', isActive && 'text-primary')}>
            {stage.waterAmount}g
          </p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
      </div>
    </div>
  );
}

/**
 * Coffee Pour Over Timer Component
 * 
 * Multi-stage pour timer with method presets.
 * Supports 4:6 method and custom pour distributions.
 * 
 * Features:
 * - Method selection (4:6 or custom)
 * - Total water input
 * - Custom number of pours
 * - Real-time timer with stage tracking
 * - Visual stage indicators
 * - Audio notifications (optional)
 * - Pause/resume functionality
 * - Reset functionality
 * - Brewing instructions
 * 
 * @see Requirements 8.1, 8.2, 8.3, 8.4, 15.1, 15.2
 */
export function PourOverTimer() {
  const [totalWater, setTotalWater] = React.useState(INITIAL_INPUTS.totalWater);
  const [method, setMethod] = React.useState<PourMethod>(INITIAL_INPUTS.method);
  const [numberOfPours, setNumberOfPours] = React.useState(5);
  const [schedule, setSchedule] = React.useState<PourOverResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Timer state
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Calculate schedule when inputs change
  React.useEffect(() => {
    try {
      const result = calculatePourSchedule({
        totalWater,
        method,
        numberOfPours: method === 'custom' ? numberOfPours : undefined,
      });
      setSchedule(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setSchedule(null);
    }
  }, [totalWater, method, numberOfPours]);

  // Timer effect
  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (startTime || now)) / 1000);
        setElapsedSeconds(elapsed);

        // Auto-stop when timer completes
        if (schedule && elapsed >= schedule.totalTime) {
          setIsRunning(false);
          setElapsedSeconds(schedule.totalTime);
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
  }, [isRunning, startTime, schedule]);

  const handleStart = () => {
    if (!isRunning && elapsedSeconds === 0) {
      setStartTime(Date.now());
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
  };

  const handleResetAll = () => {
    handleReset();
    setTotalWater(INITIAL_INPUTS.totalWater);
    setMethod(INITIAL_INPUTS.method);
    setNumberOfPours(5);
  };

  // Get current and next stages
  const currentStage = schedule ? getCurrentStage(schedule.stages, elapsedSeconds) : undefined;
  const nextStage = schedule ? getNextStage(schedule.stages, elapsedSeconds) : undefined;
  const isComplete = schedule && elapsedSeconds >= schedule.totalTime;

  // Calculate progress percentage
  const progressPercent = schedule ? Math.min((elapsedSeconds / schedule.totalTime) * 100, 100) : 0;

  return (
    <CalculatorBase
      title="Pour over-timer"
      description="Timer for pour over med 4:6-metoden eller egne helleomganger, for jevn kvalitet hver gang"
      formula="4:6-metoden: første 40 % (2 omganger) + resterende 60 % (3 omganger)"
      formulaExplanation="4:6-metoden deler vannet i 5 omganger: de to første (40 %) styrer søthet og syre, de tre siste (60 %) styrer styrken."
      onReset={handleResetAll}
      error={error || undefined}
      results={schedule && (
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

            {/* Current Stage Info */}
            {currentStage && !isComplete && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm font-medium text-primary mb-1">
                  Nå: omgang {currentStage.stageNumber}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {currentStage.waterAmount}g
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStage.description}
                </p>
              </div>
            )}

            {/* Next Stage Info */}
            {nextStage && !isComplete && (
              <div className="text-sm text-muted-foreground">
                Neste: omgang {nextStage.stageNumber} ({nextStage.waterAmount}g) ved {formatTime(nextStage.startTime)}
              </div>
            )}

            {/* Complete Message */}
            {isComplete && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-4">
                <p className="text-lg font-bold text-green-800 dark:text-green-400">
                  ✓ Ferdig traktet!
                </p>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                  La kaffen renne helt gjennom før du serverer
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

          {/* Pour Stages */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Coffee className="h-4 w-4" aria-hidden="true" />
              Helleplan
            </h3>
            <div className="space-y-2">
              {schedule.stages.map((stage) => {
                const isActive = currentStage?.stageNumber === stage.stageNumber;
                const isComplete = elapsedSeconds >= stage.endTime;
                return (
                  <StageIndicator
                    key={stage.stageNumber}
                    stage={stage}
                    isActive={isActive}
                    isComplete={isComplete}
                  />
                );
              })}
            </div>
          </div>

          {/* Method Info */}
          <ResultDisplay
            label="Metode"
            value={schedule.methodName}
          />

          <ResultDisplay
            label="Total tid"
            value={formatTime(schedule.totalTime)}
          />

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-2">Slik gjør du det</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {schedule.instructions.map((instruction, i) => (
                    <li key={i}>{i + 1}. {instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {/* Method Selection */}
      <SelectInput
        id="method"
        label="Bryggemetode"
        value={method}
        onChange={(v) => setMethod(v as PourMethod)}
        options={METHOD_OPTIONS}
        required
      />

      {/* Total Water Input */}
      <NumberInput
        id="totalWater"
        label="Total vannmengde"
        value={totalWater}
        onChange={setTotalWater}
        min={100}
        max={1000}
        step={10}
        unit="g"
        required
        placeholder="300"
      />

      {/* Number of Pours (Custom Method Only) */}
      {method === 'custom' && (
        <NumberInput
          id="numberOfPours"
          label="Antall helleomganger"
          value={numberOfPours}
          onChange={setNumberOfPours}
          min={1}
          max={10}
          step={1}
          required
          placeholder="5"
        />
      )}

      {/* Method Description */}
      {method === '4:6' && (
        <div className="text-xs text-muted-foreground bg-primary/5 rounded-md p-3 border border-primary/20">
          <p className="font-medium text-primary mb-1">Om 4:6-metoden</p>
          <p>
            Metoden er utviklet av Tetsu Kasuya og deler vannet i 5 omganger. De to første (40 %) styrer søthet og syre, de tre siste (60 %) styrer styrken. Det gir god kontroll over smaksbalansen.
          </p>
        </div>
      )}
    </CalculatorBase>
  );
}

export default PourOverTimer;
