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
        setError('Skriv inn en gyldig fødselsdato');
        return;
      }
      
      if (birthDateTime > currentTime) {
        setError('Fødselsdatoen kan ikke være i fremtiden');
        return;
      }
      
      const ageResult = calculatePreciseAge({
        birthDate: birthDateTime,
        targetDate: currentTime,
      });
      setResult(ageResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
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
    return date.toLocaleDateString('nb-NO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Nøyaktig alder"
      description="Se nøyaktig alder i år, måneder, dager, timer, minutter og sekunder"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Din alder</p>
            <p className="text-2xl font-bold text-blue-700">
              {result.years} år, {result.months} måneder, {result.days} dager
            </p>
            {includeTime && (
              <p className="text-lg text-blue-600">
                {result.hours} timer, {result.minutes} minutter, {result.seconds} sekunder
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Dager levd"
              value={result.totalDays.toLocaleString('nb-NO')}
              copyable
            />
            <ResultDisplay
              label="Timer levd"
              value={result.totalHours.toLocaleString('nb-NO')}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Minutter levd"
              value={result.totalMinutes.toLocaleString('nb-NO')}
              copyable
            />
            <ResultDisplay
              label="Sekunder levd"
              value={result.totalSeconds.toLocaleString('nb-NO')}
              copyable
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-3">Mer informasjon</p>
            
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay
                label="Stjernetegn"
                value={result.zodiacSign}
                copyable
              />
              <ResultDisplay
                label="Født på"
                value={result.birthDayOfWeek}
                copyable
              />
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-700">
                🎂 <strong>Neste bursdag:</strong> {formatDate(result.nextBirthday)}
                <br />
                <span className="text-yellow-600">
                  ({result.daysUntilNextBirthday} dager til)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              ⏱️ Oppdateres hvert sekund
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="birth-date">Fødselsdato</Label>
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
            Ta med klokkeslett for nøyaktig beregning
          </Label>
        </div>

        {includeTime && (
          <div>
            <Label htmlFor="birth-time">Fødselstidspunkt</Label>
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
            📅 Klokkeslett nå: {currentTime.toLocaleString('nb-NO')}
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PreciseAgeCalculator;
