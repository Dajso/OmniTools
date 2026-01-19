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
          setError('Please enter valid dates');
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
          setError('Please enter a valid start date');
          return;
        }
        
        const resultDate = addBusinessDays(start, daysToAdd, excludeHolidays);
        setAddResult(resultDate);
        setResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
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
    return date.toLocaleDateString('en-US', {
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
      title="Business Days Calculator"
      description="Calculate business days between dates or add business days to a date"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={(result || addResult) && (
        <div className="space-y-4">
          {mode === 'between' && result && (
            <>
              <ResultDisplay
                label="Business Days"
                value={result.businessDays.toLocaleString()}
                highlight
                copyable
              />
              
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Total Calendar Days"
                  value={result.totalDays.toLocaleString()}
                  copyable
                />
                <ResultDisplay
                  label="Weekend Days"
                  value={result.weekendDays.toLocaleString()}
                  copyable
                />
              </div>

              {excludeHolidays && (
                <ResultDisplay
                  label="Holidays Excluded"
                  value={result.holidaysExcluded.toLocaleString()}
                  copyable
                />
              )}

              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  📅 From <strong>{formatDate(result.startDate)}</strong> to{' '}
                  <strong>{formatDate(result.endDate)}</strong>
                </p>
              </div>
            </>
          )}

          {mode === 'add' && addResult && (
            <>
              <ResultDisplay
                label="Result Date"
                value={formatDate(addResult)}
                highlight
                copyable
              />
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  📅 Adding <strong>{daysToAdd} business days</strong> to{' '}
                  <strong>{formatDate(new Date(startDate))}</strong>
                </p>
              </div>
            </>
          )}

          <div className={`p-3 rounded-md ${isStartBusinessDay ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`text-sm ${isStartBusinessDay ? 'text-green-700' : 'text-yellow-700'}`}>
              {isStartBusinessDay 
                ? '✓ Start date is a business day'
                : '⚠ Start date is not a business day (weekend or holiday)'}
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
            onChange={(e) => setMode(e.target.value as 'between' | 'add')}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="between">Calculate days between dates</option>
            <option value="add">Add business days to a date</option>
          </select>
        </div>

        <div>
          <Label htmlFor="start-date">Start Date</Label>
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
            <Label htmlFor="end-date">End Date</Label>
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
            <Label htmlFor="days-to-add">Business Days to Add</Label>
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
              Use negative numbers to subtract business days
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
            Exclude US Federal Holidays
          </Label>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BusinessDaysCalculator;
