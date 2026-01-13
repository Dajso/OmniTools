'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertTimezone, COMMON_TIMEZONES, type TimezoneResults } from '@/lib/calculations/productivity/timezone-converter';

export function TimezoneConverter() {
  const [dateTime, setDateTime] = React.useState('');
  const [fromTimezone, setFromTimezone] = React.useState('America/New_York');
  const [toTimezone, setToTimezone] = React.useState('Europe/London');
  const [results, setResults] = React.useState<TimezoneResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleConvert = () => {
    if (!dateTime) {
      setError('Please enter a date and time');
      return;
    }
    try {
      setError(null);
      const result = convertTimezone({ dateTime, fromTimezone, toTimezone });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setResults(null);
    }
  };

  const handleNow = () => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
  };

  const handleSwap = () => {
    setFromTimezone(toTimezone);
    setToTimezone(fromTimezone);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Time Zone Converter</CardTitle>
        <CardDescription>Convert times between different time zones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="datetime">Date & Time</Label>
            <Button size="sm" variant="ghost" onClick={handleNow}>Now</Button>
          </div>
          <input id="datetime" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <select value={fromTimezone} onChange={(e) => setFromTimezone(e.target.value)} className="w-full p-2 border rounded-md">
              {COMMON_TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
            </select>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSwap} className="mb-1">⇄</Button>
          <div className="space-y-2">
            <Label>To</Label>
            <select value={toTimezone} onChange={(e) => setToTimezone(e.target.value)} className="w-full p-2 border rounded-md">
              {COMMON_TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={handleConvert} className="w-full">Convert</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{results.fromTimezone}</p>
                <p className="text-lg font-semibold">{results.fromTime}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{results.toTimezone}</p>
                <p className="text-lg font-semibold">{results.toTime}</p>
              </div>
            </div>
            <ResultDisplay label="Offset" value={results.offset} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TimezoneConverter;
