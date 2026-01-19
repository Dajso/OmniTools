'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';

/**
 * Time Duration Calculator Component
 * 
 * Calculates time duration by adding or subtracting time units.
 * 
 * @see Requirements 30.2
 */

interface TimeDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface DurationResult {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  formatted: string;
  breakdown: TimeDuration;
}

function parseDuration(duration: TimeDuration): number {
  return (
    duration.days * 86400 +
    duration.hours * 3600 +
    duration.minutes * 60 +
    duration.seconds
  );
}

function formatDuration(totalSeconds: number): DurationResult {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  
  const formatted = (isNegative ? '-' : '') + parts.join(', ');
  
  return {
    totalSeconds: totalSeconds,
    totalMinutes: totalSeconds / 60,
    totalHours: totalSeconds / 3600,
    totalDays: totalSeconds / 86400,
    formatted,
    breakdown: {
      days: isNegative ? -days : days,
      hours,
      minutes,
      seconds,
    },
  };
}

export function TimeDurationCalculator() {
  const [mode, setMode] = React.useState<'add' | 'subtract' | 'between'>('add');
  
  // Duration 1
  const [days1, setDays1] = React.useState(0);
  const [hours1, setHours1] = React.useState(1);
  const [minutes1, setMinutes1] = React.useState(30);
  const [seconds1, setSeconds1] = React.useState(0);
  
  // Duration 2
  const [days2, setDays2] = React.useState(0);
  const [hours2, setHours2] = React.useState(0);
  const [minutes2, setMinutes2] = React.useState(45);
  const [seconds2, setSeconds2] = React.useState(0);
  
  // Time inputs for "between" mode
  const [time1, setTime1] = React.useState('09:00');
  const [time2, setTime2] = React.useState('17:30');
  
  const [result, setResult] = React.useState<DurationResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (mode === 'between') {
        const [h1, m1] = time1.split(':').map(Number);
        const [h2, m2] = time2.split(':').map(Number);
        
        const seconds1Total = h1 * 3600 + m1 * 60;
        const seconds2Total = h2 * 3600 + m2 * 60;
        
        const diff = seconds2Total - seconds1Total;
        setResult(formatDuration(diff));
      } else {
        const duration1 = parseDuration({ days: days1, hours: hours1, minutes: minutes1, seconds: seconds1 });
        const duration2 = parseDuration({ days: days2, hours: hours2, minutes: minutes2, seconds: seconds2 });
        
        const total = mode === 'add' ? duration1 + duration2 : duration1 - duration2;
        setResult(formatDuration(total));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [mode, days1, hours1, minutes1, seconds1, days2, hours2, minutes2, seconds2, time1, time2]);

  const reset = () => {
    setMode('add');
    setDays1(0);
    setHours1(1);
    setMinutes1(30);
    setSeconds1(0);
    setDays2(0);
    setHours2(0);
    setMinutes2(45);
    setSeconds2(0);
    setTime1('09:00');
    setTime2('17:30');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Time Duration Calculator"
      description="Add or subtract time durations, or calculate time between two times"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Result"
            value={result.formatted}
            highlight
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Seconds"
              value={Math.abs(result.totalSeconds).toLocaleString()}
              copyable
            />
            <ResultDisplay
              label="Total Minutes"
              value={Math.abs(result.totalMinutes).toFixed(2)}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Hours"
              value={Math.abs(result.totalHours).toFixed(2)}
              copyable
            />
            <ResultDisplay
              label="Total Days"
              value={Math.abs(result.totalDays).toFixed(4)}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Breakdown</p>
            <p className="text-sm text-muted-foreground">
              {result.breakdown.days !== 0 && `${Math.abs(result.breakdown.days)} days, `}
              {result.breakdown.hours} hours, {result.breakdown.minutes} minutes, {result.breakdown.seconds} seconds
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="mode">Calculation Mode</Label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'add' | 'subtract' | 'between')}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="add">Add durations</option>
            <option value="subtract">Subtract durations</option>
            <option value="between">Time between two times</option>
          </select>
        </div>

        {mode === 'between' ? (
          <>
            <div>
              <Label htmlFor="time1">Start Time</Label>
              <input
                type="time"
                id="time1"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <Label htmlFor="time2">End Time</Label>
              <input
                type="time"
                id="time2"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              />
            </div>
          </>
        ) : (
          <>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-3">Duration 1</p>
              <div className="grid grid-cols-4 gap-2">
                <NumberInput
                  id="days1"
                  label="Days"
                  value={days1}
                  onChange={setDays1}
                  min={0}
                  max={9999}
                />
                <NumberInput
                  id="hours1"
                  label="Hours"
                  value={hours1}
                  onChange={setHours1}
                  min={0}
                  max={23}
                />
                <NumberInput
                  id="minutes1"
                  label="Minutes"
                  value={minutes1}
                  onChange={setMinutes1}
                  min={0}
                  max={59}
                />
                <NumberInput
                  id="seconds1"
                  label="Seconds"
                  value={seconds1}
                  onChange={setSeconds1}
                  min={0}
                  max={59}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {mode === 'add' ? '+' : '−'}
              </span>
            </div>

            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-3">Duration 2</p>
              <div className="grid grid-cols-4 gap-2">
                <NumberInput
                  id="days2"
                  label="Days"
                  value={days2}
                  onChange={setDays2}
                  min={0}
                  max={9999}
                />
                <NumberInput
                  id="hours2"
                  label="Hours"
                  value={hours2}
                  onChange={setHours2}
                  min={0}
                  max={23}
                />
                <NumberInput
                  id="minutes2"
                  label="Minutes"
                  value={minutes2}
                  onChange={setMinutes2}
                  min={0}
                  max={59}
                />
                <NumberInput
                  id="seconds2"
                  label="Seconds"
                  value={seconds2}
                  onChange={setSeconds2}
                  min={0}
                  max={59}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </CalculatorBase>
  );
}

export default TimeDurationCalculator;
