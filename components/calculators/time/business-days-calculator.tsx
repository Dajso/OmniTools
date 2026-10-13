'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculateBusinessDays,
  addBusinessDays,
  isBusinessDay,
  type BusinessDaysResult,
} from '@/lib/calculations/time';

/**
 * Business Days Calculator Component
 * 
 * Calculates business days between two dates, excluding weekends
 * and optionally US federal holidays.
 * 
 * @see Requirements 30.1, 30.7
 */
export function BusinessDaysCalculator() {
  const [startDate, setStartDate] = React.useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = React.useState<string>(() => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString().split('T')[0];
  });
  const [excludeHolidays, setExcludeHolidays] = React.useState(true);
  const [mode, setMode] = React.useState<'between' | 'add'>('between');
  const [daysToAdd, setDaysToAdd] = React.useState(10);
  const [result, setResult] = React.useState<BusinessDaysResult | null>(null);
  const [addResult, setAddResult] = React.useState<Date | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (mode === 'between') {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          setError('Skriv inn gyldige datoer');
          return;
        }
        
        const businessDaysResult = calculateBusinessDays({
          startDate: start,
          endDate: end,
          excludeHolidays,
        });
        setResult(businessDaysResult);
        setAddResult(null);
      } else {
        const start = new Date(startDate);
        
        if (isNaN(start.getTime())) {
          setError('Skriv inn en gyldig startdato');
          return;
        }
        
        const resultDate = addBusinessDays(start, daysToAdd, excludeHolidays);
        setAddResult(resultDate);
        setResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
      setAddResult(null);
    }
  }, [startDate, endDate, excludeHolidays, mode, daysToAdd]);

  const reset = () => {
    const today = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(future.toISOString().split('T')[0]);
    setExcludeHolidays(true);
    setMode('between');
    setDaysToAdd(10);
    setResult(null);
    setAddResult(null);
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

  const startDateObj = new Date(startDate);
  const isStartBusinessDay = !isNaN(startDateObj.getTime()) && isBusinessDay(startDateObj, excludeHolidays);

  return (
    <CalculatorBase
      title="Virkedager"
      description="Regn ut antall virkedager mellom to datoer, eller legg virkedager til en dato"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={(result || addResult) && (
        <div className="space-y-4">
          {mode === 'between' && result && (
            <>
              <ResultDisplay
                label="Virkedager"
                value={result.businessDays.toLocaleString('nb-NO')}
                highlight
                copyable
              />
              
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Kalenderdager totalt"
                  value={result.totalDays.toLocaleString('nb-NO')}
                  copyable
                />
                <ResultDisplay
                  label="Helgedager"
                  value={result.weekendDays.toLocaleString('nb-NO')}
                  copyable
                />
              </div>

              {excludeHolidays && (
                <ResultDisplay
                  label="Helligdager trukket fra"
                  value={result.holidaysExcluded.toLocaleString('nb-NO')}
                  copyable
                />
              )}

              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  📅 Fra <strong>{formatDate(result.startDate)}</strong> til{' '}
                  <strong>{formatDate(result.endDate)}</strong>
                </p>
              </div>
            </>
          )}

          {mode === 'add' && addResult && (
            <>
              <ResultDisplay
                label="Resultatdato"
                value={formatDate(addResult)}
                highlight
                copyable
              />
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  📅 Legger til <strong>{daysToAdd} virkedager</strong> til{' '}
                  <strong>{formatDate(new Date(startDate))}</strong>
                </p>
              </div>
            </>
          )}

          <div className={`p-3 rounded-md ${isStartBusinessDay ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`text-sm ${isStartBusinessDay ? 'text-green-700' : 'text-yellow-700'}`}>
              {isStartBusinessDay 
                ? '✓ Startdatoen er en virkedag'
                : '⚠ Startdatoen er ikke en virkedag (helg eller helligdag)'}
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="mode">Beregningsmåte</Label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'between' | 'add')}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="between">Beregn dager mellom datoer</option>
            <option value="add">Legg virkedager til en dato</option>
          </select>
        </div>

        <div>
          <Label htmlFor="start-date">Startdato</Label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          />
        </div>

        {mode === 'between' ? (
          <div>
            <Label htmlFor="end-date">Sluttdato</Label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="days-to-add">Virkedager som skal legges til</Label>
            <input
              type="number"
              id="days-to-add"
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
              className="w-full mt-1 p-2 border rounded-md bg-background"
              min={-365}
              max={365}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Bruk negative tall for å trekke fra virkedager
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="exclude-holidays"
            checked={excludeHolidays}
            onChange={(e) => setExcludeHolidays(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="exclude-holidays" className="cursor-pointer">
            Trekk fra norske helligdager
          </Label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BusinessDaysCalculator;
