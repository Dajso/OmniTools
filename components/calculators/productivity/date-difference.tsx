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
      setError('Skriv inn begge datoene');
      return;
    }
    try {
      setError(null);
      const result = calculateDateDifference({ startDate, endDate, includeEndDate });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beregningen mislyktes');
      setResults(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Dager mellom to datoer</CardTitle>
        <CardDescription>Regn ut forskjellen mellom to datoer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Startdato</Label>
            <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Sluttdato</Label>
            <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeEndDate} onChange={(e) => setIncludeEndDate(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Ta med sluttdatoen i utregningen</span>
        </label>
        <Button onClick={handleCalculate} className="w-full">Regn ut forskjell</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold">{results.years} år, {results.months} måneder, {results.weeks} uker, {results.days} dager</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Dager totalt" value={results.totalDays.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Uker totalt" value={results.totalWeeks.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Måneder totalt" value={results.totalMonths.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Timer totalt" value={results.totalHours.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Virkedager" value={results.businessDays.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Helgedager" value={results.weekendDays.toLocaleString('nb-NO')} copyable />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DateDifferenceCalculator;
