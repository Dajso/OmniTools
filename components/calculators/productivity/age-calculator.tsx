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
      setError('Skriv inn en fødselsdato');
      return;
    }
    try {
      setError(null);
      const result = calculateAge({ birthDate, targetDate: targetDate || undefined });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beregningen mislyktes');
      setResults(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Alderskalkulator</CardTitle>
        <CardDescription>Regn ut nøyaktig alder og mer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth-date">Fødselsdato</Label>
            <input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-date">Til dato (valgfritt)</Label>
            <input id="target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full">Regn ut alder</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-3xl font-bold">{results.years} år, {results.months} måneder, {results.days} dager</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Dager totalt" value={results.totalDays.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Uker totalt" value={results.totalWeeks.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Måneder totalt" value={results.totalMonths.toLocaleString('nb-NO')} copyable />
              <ResultDisplay label="Neste bursdag" value={results.nextBirthday} />
              <ResultDisplay label="Dager til" value={results.daysUntilBirthday.toString()} />
              <ResultDisplay label="Født på en" value={results.dayOfWeekBorn} />
              <ResultDisplay label="Stjernetegn" value={results.zodiacSign} />
              <ResultDisplay label="Kinesisk dyrekrets" value={results.chineseZodiac} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AgeCalculator;
