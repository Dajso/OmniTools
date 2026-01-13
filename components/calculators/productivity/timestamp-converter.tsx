'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertTimestamp, getCurrentTimestamp, type TimestampResults } from '@/lib/calculations/productivity/timestamp-converter';

export function TimestampConverter() {
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'unix-to-date' | 'date-to-unix'>('unix-to-date');
  const [results, setResults] = React.useState<TimestampResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleConvert = () => {
    try {
      setError(null);
      const result = convertTimestamp({ value: input, mode, timezone: 'local' });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setResults(null);
    }
  };

  const handleNow = () => {
    const now = getCurrentTimestamp();
    setResults(now);
    setInput(now.unix.toString());
    setMode('unix-to-date');
  };

  React.useEffect(() => { handleNow(); }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Timestamp Converter</CardTitle>
        <CardDescription>Convert Unix timestamps to human-readable dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'unix-to-date' ? 'default' : 'outline'} onClick={() => setMode('unix-to-date')}>Unix → Date</Button>
          <Button variant={mode === 'date-to-unix' ? 'default' : 'outline'} onClick={() => setMode('date-to-unix')}>Date → Unix</Button>
          <Button variant="outline" onClick={handleNow}>Now</Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timestamp-input">{mode === 'unix-to-date' ? 'Unix Timestamp' : 'Date/Time'}</Label>
          <input
            id="timestamp-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'unix-to-date' ? '1704067200' : '2024-01-01T00:00:00'}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button onClick={handleConvert} className="w-full">Convert</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Unix (seconds)" value={results.unix.toLocaleString()} copyable />
            <ResultDisplay label="Unix (ms)" value={results.unixMs.toLocaleString()} copyable />
            <ResultDisplay label="ISO 8601" value={results.iso8601} copyable />
            <ResultDisplay label="UTC" value={results.utc} copyable />
            <ResultDisplay label="Local" value={results.local} copyable />
            <ResultDisplay label="Relative" value={results.relative} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TimestampConverter;
