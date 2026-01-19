'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import {
  calculateWeekNumber,
  getDateFromWeek,
  getDatesInWeek,
  type WeekNumberResult,
} from '@/lib/calculations/time';

/**
 * Week Number Calculator Component
 * 
 * Calculates ISO week number and related information for any date.
 * 
 * @see Requirements 30.4
 */
export function WeekNumberCalculator() {
  const [mode, setMode] = React.useState<'dateToWeek' | 'weekToDate'>('dateToWeek');
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [weekYear, setWeekYear] = React.useState<number>(new Date().getFullYear());
  const [weekNumber, setWeekNumber] = React.useState<number>(1);
  const [result, setResult] = React.useState<WeekNumberResult | null>(null);
  const [weekDates, setWeekDates] = React.useState<Date[] | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (mode === 'dateToWeek') {
        const date = new Date(selectedDate);
        
        if (isNaN(date.getTime())) {
          setError('Please enter a valid date');
          return;
        }
        
        const weekResult = calculateWeekNumber({ date });
        setResult(weekResult);
        setWeekDates(getDatesInWeek(weekResult.year, weekResult.weekNumber));
      } else {
        if (weekNumber < 1 || weekNumber > 53) {
          setError('Week number must be between 1 and 53');
          return;
        }
        
        const dates = getDatesInWeek(weekYear, weekNumber);
        setWeekDates(dates);
        
        // Calculate result for the Monday of that week
        const weekResult = calculateWeekNumber({ date: dates[0] });
        setResult(weekResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
      setWeekDates(null);
    }
  }, [mode, selectedDate, weekYear, weekNumber]);

  const reset = () => {
    setMode('dateToWeek');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setWeekYear(new Date().getFullYear());
    setWeekNumber(1);
    setResult(null);
    setWeekDates(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Week Number Calculator"
      description="Find the ISO week number for any date or get dates for a specific week"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">ISO Week</p>
            <p className="text-3xl font-bold text-green-700">
              Week {result.weekNumber}
            </p>
            <p className="text-lg text-green-600">
              {result.year}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Day of Week"
              value={`${result.dayOfWeekName} (${result.dayOfWeek})`}
              copyable
            />
            <ResultDisplay
              label="Day of Year"
              value={`${result.dayOfYear} / ${result.daysInYear}`}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Quarter"
              value={`Q${result.quarter}`}
              copyable
            />
            <ResultDisplay
              label="Weeks in Year"
              value={result.totalWeeksInYear.toString()}
              copyable
            />
          </div>

          <ResultDisplay
            label="Leap Year"
            value={result.isLeapYear ? 'Yes' : 'No'}
            copyable
          />

          {weekDates && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Week {result.weekNumber} Dates</p>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="font-medium text-muted-foreground">{day}</div>
                  ))}
                  {weekDates.map((date, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        date.toDateString() === new Date().toDateString() 
                          ? 'bg-blue-500 text-white font-bold' 
                          : index >= 5 
                            ? 'bg-gray-100 text-gray-500' 
                            : 'bg-white'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                </p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              📅 Week starts: <strong>{formatFullDate(result.weekStart)}</strong>
              <br />
              📅 Week ends: <strong>{formatFullDate(result.weekEnd)}</strong>
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
            onChange={(e) => setMode(e.target.value as 'dateToWeek' | 'weekToDate')}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="dateToWeek">Find week number for a date</option>
            <option value="weekToDate">Find dates for a week number</option>
          </select>
        </div>

        {mode === 'dateToWeek' ? (
          <div>
            <Label htmlFor="selected-date">Select Date</Label>
            <input
              type="date"
              id="selected-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="week-year">Year</Label>
              <input
                type="number"
                id="week-year"
                value={weekYear}
                onChange={(e) => setWeekYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full mt-1 p-2 border rounded-md bg-background"
                min={1900}
                max={2100}
              />
            </div>
            <div>
              <Label htmlFor="week-number">Week Number</Label>
              <input
                type="number"
                id="week-number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
                min={1}
                max={53}
              />
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            💡 <strong>ISO 8601:</strong> Week 1 is the week containing the first Thursday of the year. 
            Weeks start on Monday.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default WeekNumberCalculator;
