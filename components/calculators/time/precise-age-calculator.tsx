'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculatePreciseAge,
  type PreciseAgeResult,
} from '@/lib/calculations/time';

/**
 * Precise Age Calculator Component
 * 
 * Calculates exact age in years, months, days, hours, minutes, and seconds.
 * 
 * @see Requirements 30.3
 */
export function PreciseAgeCalculator() {
  const [birthDate, setBirthDate] = React.useState<string>('1990-01-15');
  const [birthTime, setBirthTime] = React.useState<string>('12:00');
  const [includeTime, setIncludeTime] = React.useState(false);
  const [result, setResult] = React.useState<PreciseAgeResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update current time every second for live display
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      let birthDateTime: Date;
      if (includeTime) {
        const [hours, minutes] = birthTime.split(':').map(Number);
        birthDateTime = new Date(birthDate);
        birthDateTime.setHours(hours, minutes, 0, 0);
      } else {
        birthDateTime = new Date(birthDate);
        birthDateTime.setHours(0, 0, 0, 0);
      }
      
      if (isNaN(birthDateTime.getTime())) {
        setError('Please enter a valid birth date');
        return;
      }
      
      if (birthDateTime > currentTime) {
        setError('Birth date cannot be in the future');
        return;
      }
      
      const ageResult = calculatePreciseAge({
        birthDate: birthDateTime,
        targetDate: currentTime,
      });
      setResult(ageResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [birthDate, birthTime, includeTime, currentTime]);

  const reset = () => {
    setBirthDate('1990-01-15');
    setBirthTime('12:00');
    setIncludeTime(false);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Precise Age Calculator"
      description="Calculate your exact age in years, months, days, hours, minutes, and seconds"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Your Age</p>
            <p className="text-2xl font-bold text-blue-700">
              {result.years} years, {result.months} months, {result.days} days
            </p>
            {includeTime && (
              <p className="text-lg text-blue-600">
                {result.hours} hours, {result.minutes} minutes, {result.seconds} seconds
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Days Lived"
              value={result.totalDays.toLocaleString()}
              copyable
            />
            <ResultDisplay
              label="Total Hours Lived"
              value={result.totalHours.toLocaleString()}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Total Minutes Lived"
              value={result.totalMinutes.toLocaleString()}
              copyable
            />
            <ResultDisplay
              label="Total Seconds Lived"
              value={result.totalSeconds.toLocaleString()}
              copyable
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-3">Additional Information</p>
            
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Zodiac Sign"
                value={result.zodiacSign}
                copyable
              />
              <ResultDisplay
                label="Born on"
                value={result.birthDayOfWeek}
                copyable
              />
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-700">
                🎂 <strong>Next Birthday:</strong> {formatDate(result.nextBirthday)}
                <br />
                <span className="text-yellow-600">
                  ({result.daysUntilNextBirthday} days away)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              ⏱️ Live calculation - updates every second
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="birth-date">Birth Date</Label>
          <input
            type="date"
            id="birth-date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="include-time"
            checked={includeTime}
            onChange={(e) => setIncludeTime(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="include-time" className="cursor-pointer">
            Include birth time for precise calculation
          </Label>
        </div>

        {includeTime && (
          <div>
            <Label htmlFor="birth-time">Birth Time</Label>
            <input
              type="time"
              id="birth-time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            />
          </div>
        )}

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            📅 Current time: {currentTime.toLocaleString()}
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PreciseAgeCalculator;
