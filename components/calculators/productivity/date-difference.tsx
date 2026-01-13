'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateDateDifference, type DateDifferenceResults } from '@/lib/calculations/productivity/date-difference';

export function DateDifferenceCalculator() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [includeEndDate, setIncludeEndDate] = React.useState(false);
  const [results, setResults] = React.useState<DateDifferenceResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      setError('Please enter both dates');
      return;
    }
    try {
      setError(null);
      const result = calculateDateDifference({ startDate, endDate, includeEndDate });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Date Difference Calculator</CardTitle>
        <CardDescription>Calculate the difference between two dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeEndDate} onChange={(e) => setIncludeEndDate(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Include end date in calculation</span>
        </label>
        <Button onClick={handleCalculate} className="w-full">Calculate Difference</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold">{results.years} years, {results.months} months, {results.weeks} weeks, {results.days} days</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Total Days" value={results.totalDays.toLocaleString()} copyable />
              <ResultDisplay label="Total Weeks" value={results.totalWeeks.toLocaleString()} copyable />
              <ResultDisplay label="Total Months" value={results.totalMonths.toLocaleString()} copyable />
              <ResultDisplay label="Total Hours" value={results.totalHours.toLocaleString()} copyable />
              <ResultDisplay label="Business Days" value={results.businessDays.toLocaleString()} copyable />
              <ResultDisplay label="Weekend Days" value={results.weekendDays.toLocaleString()} copyable />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DateDifferenceCalculator;
