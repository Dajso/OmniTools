'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

/**
 * Timer mode types
 */
export type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro';

/**
 * Timer preset configuration
 */
export interface TimerPreset {
  label: string;
  duration: number; // in seconds
}

/**
 * Pomodoro configuration
 */
export interface PomodoroConfig {
  workDuration: number;    // in seconds
  shortBreak: number;      // in seconds
  longBreak: number;       // in seconds
  sessionsBeforeLongBreak: number;
}

/**
 * Props for the TimerTemplate component
 */
export interface TimerTemplateProps {
  /** Timer title */
  title: string;
  /** Timer description */
  description: string;
  /** Timer mode */
  mode: TimerMode;
  /** Preset durations for countdown mode */
  presets?: TimerPreset[];
  /** Callback when timer completes */
  onComplete?: () => void;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Allow custom duration input */
  allowCustomDuration?: boolean;
  /** Pomodoro configuration (only for pomodoro mode) */
  pomodoroConfig?: PomodoroConfig;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default pomodoro configuration
 */
const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  workDuration: 25 * 60,    // 25 minutes
  shortBreak: 5 * 60,       // 5 minutes
  longBreak: 15 * 60,       // 15 minutes
  sessionsBeforeLongBreak: 4,
};


/**
 * Format seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  const sign = seconds < 0 ? '-' : '';

  if (hours > 0) {
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${sign}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * Progress circle component
 */
function ProgressCircle({ 
  progress, 
  size = 200,
  strokeWidth = 8,
}: { 
  progress: number; 
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-300"
      />
    </svg>
  );
}

/**
 * Pomodoro phase type
 */
type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';


/**
 * Timer Template - A reusable template for countdown, stopwatch, and pomodoro timers
 * 
 * Features:
 * - Three modes: countdown, stopwatch, pomodoro
 * - Preset durations for quick selection
 * - Custom duration input
 * - Visual progress indicator
 * - Completion callback
 * - Pomodoro with work/break cycles
 * 
 * @example
 * ```tsx
 * <TimerTemplate
 *   title="Pomodoro Timer"
 *   description="Stay focused with the Pomodoro technique"
 *   mode="pomodoro"
 *   showProgress
 *   onComplete={() => playNotificationSound()}
 * />
 * ```
 */
export function TimerTemplate({
  title,
  description,
  mode,
  presets,
  onComplete,
  showProgress = true,
  allowCustomDuration = true,
  pomodoroConfig = DEFAULT_POMODORO_CONFIG,
  className,
}: TimerTemplateProps) {
  const [time, setTime] = React.useState(0);
  const [initialTime, setInitialTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [customInput, setCustomInput] = React.useState('');
  
  // Pomodoro-specific state
  const [pomodoroPhase, setPomodoroPhase] = React.useState<PomodoroPhase>('work');
  const [completedSessions, setCompletedSessions] = React.useState(0);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize timer based on mode
  React.useEffect(() => {
    if (mode === 'pomodoro') {
      setTime(pomodoroConfig.workDuration);
      setInitialTime(pomodoroConfig.workDuration);
    } else if (mode === 'countdown' && presets && presets.length > 0) {
      setTime(presets[0].duration);
      setInitialTime(presets[0].duration);
    }
  }, [mode, presets, pomodoroConfig]);

  const handleTimerComplete = React.useCallback(() => {
    onComplete?.();

    if (mode === 'pomodoro') {
      // Handle pomodoro phase transitions
      if (pomodoroPhase === 'work') {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);

        if (newCompletedSessions % pomodoroConfig.sessionsBeforeLongBreak === 0) {
          setPomodoroPhase('longBreak');
          setTime(pomodoroConfig.longBreak);
          setInitialTime(pomodoroConfig.longBreak);
        } else {
          setPomodoroPhase('shortBreak');
          setTime(pomodoroConfig.shortBreak);
          setInitialTime(pomodoroConfig.shortBreak);
        }
      } else {
        setPomodoroPhase('work');
        setTime(pomodoroConfig.workDuration);
        setInitialTime(pomodoroConfig.workDuration);
      }
    }
  }, [onComplete, mode, pomodoroPhase, completedSessions, pomodoroConfig]);

  // Timer logic
  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'stopwatch') {
            return prevTime + 1;
          }
          
          // Countdown and Pomodoro
          if (prevTime <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, handleTimerComplete]);



  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
    } else if (mode === 'pomodoro') {
      setPomodoroPhase('work');
      setCompletedSessions(0);
      setTime(pomodoroConfig.workDuration);
      setInitialTime(pomodoroConfig.workDuration);
    } else {
      setTime(initialTime);
    }
  };

  const handlePresetSelect = (duration: number) => {
    setIsRunning(false);
    setTime(duration);
    setInitialTime(duration);
  };

  const handleCustomDuration = () => {
    const seconds = parseTimeToSeconds(customInput);
    if (seconds > 0) {
      setIsRunning(false);
      setTime(seconds);
      setInitialTime(seconds);
      setCustomInput('');
    }
  };

  const handleSkipPhase = () => {
    if (mode === 'pomodoro') {
      setIsRunning(false);
      handleTimerComplete();
    }
  };

  const progress = mode === 'stopwatch' 
    ? 0 
    : initialTime > 0 
      ? ((initialTime - time) / initialTime) * 100 
      : 0;

  const getPomodoroPhaseLabel = () => {
    switch (pomodoroPhase) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer display */}
        <div className="flex flex-col items-center justify-center">
          {showProgress && mode !== 'stopwatch' ? (
            <div className="relative">
              <ProgressCircle progress={progress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-bold">{formatTime(time)}</span>
                {mode === 'pomodoro' && (
                  <span className="text-sm text-muted-foreground mt-1">
                    {getPomodoroPhaseLabel()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl font-mono font-bold">{formatTime(time)}</span>
              {mode === 'pomodoro' && (
                <p className="text-sm text-muted-foreground mt-2">
                  {getPomodoroPhaseLabel()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pomodoro session counter */}
        {mode === 'pomodoro' && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pomodoroConfig.sessionsBeforeLongBreak }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-3 h-3 rounded-full',
                  i < completedSessions % pomodoroConfig.sessionsBeforeLongBreak
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}

        {/* Presets */}
        {mode === 'countdown' && presets && presets.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset.duration)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}

        {/* Custom duration input */}
        {allowCustomDuration && mode === 'countdown' && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="custom-duration" className="sr-only">
                Custom Duration (MM:SS)
              </Label>
              <Input
                id="custom-duration"
                type="text"
                placeholder="MM:SS or HH:MM:SS"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomDuration()}
              />
            </div>
            <Button variant="outline" onClick={handleCustomDuration}>
              Set
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        {isRunning ? (
          <Button onClick={handlePause} variant="outline">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        ) : (
          <Button onClick={handleStart}>
            <Play className="h-4 w-4 mr-2" />
            {time === 0 && mode !== 'stopwatch' ? 'Start' : 'Resume'}
          </Button>
        )}
        
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        {mode === 'pomodoro' && (
          <Button variant="ghost" onClick={handleSkipPhase}>
            <SkipForward className="h-4 w-4 mr-2" />
            Skip
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default TimerTemplate;
