'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateAge, type AgeResults } from '@/lib/calculations/productivity/age-calculator';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = React.useState('');
  const [targetDate, setTargetDate] = React.useState('');
  const [results, setResults] = React.useState<AgeResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    if (!birthDate) {
      setError('Please enter a birth date');
      return;
    }
    try {
      setError(null);
      const result = calculateAge({ birthDate, targetDate: targetDate || undefined });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Age Calculator</CardTitle>
        <CardDescription>Calculate your exact age and more</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth-date">Birth Date</Label>
            <input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-date">Target Date (optional)</Label>
            <input id="target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full">Calculate Age</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-3xl font-bold">{results.years} years, {results.months} months, {results.days} days</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Total Days" value={results.totalDays.toLocaleString()} copyable />
              <ResultDisplay label="Total Weeks" value={results.totalWeeks.toLocaleString()} copyable />
              <ResultDisplay label="Total Months" value={results.totalMonths.toLocaleString()} copyable />
              <ResultDisplay label="Next Birthday" value={results.nextBirthday} />
              <ResultDisplay label="Days Until" value={results.daysUntilBirthday.toString()} />
              <ResultDisplay label="Born On" value={results.dayOfWeekBorn} />
              <ResultDisplay label="Zodiac Sign" value={results.zodiacSign} />
              <ResultDisplay label="Chinese Zodiac" value={results.chineseZodiac} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AgeCalculator;
