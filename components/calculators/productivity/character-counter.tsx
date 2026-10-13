'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { countCharacters, type CharacterCountResults } from '@/lib/calculations/productivity/character-counter';

export function CharacterCounter() {
  const [text, setText] = React.useState('');
  const [includeSpaces, setIncludeSpaces] = React.useState(true);
  const [results, setResults] = React.useState<CharacterCountResults | null>(null);

  React.useEffect(() => {
    const counts = countCharacters({ text, includeSpaces });
    setResults(counts);
  }, [text, includeSpaces]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tegnteller</CardTitle>
        <CardDescription>Tell tegn med eller uten mellomrom</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Skriv inn teksten din</Label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Begynn å skrive ..."
            className="w-full min-h-[150px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeSpaces} onChange={(e) => setIncludeSpaces(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Ta med mellomrom i tellingen</span>
        </label>
        {results && (
          <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <ResultDisplay label="Tegn" value={results.totalCharacters.toLocaleString('nb-NO')} highlight copyable />
            <ResultDisplay label="Uten mellomrom" value={results.charactersNoSpaces.toLocaleString('nb-NO')} copyable />
            <ResultDisplay label="Bokstaver" value={results.letters.toLocaleString('nb-NO')} copyable />
            <ResultDisplay label="Sifre" value={results.digits.toLocaleString('nb-NO')} copyable />
            <ResultDisplay label="Spesialtegn" value={results.specialCharacters.toLocaleString('nb-NO')} copyable />
            <ResultDisplay label="Linjer" value={results.lines.toLocaleString('nb-NO')} copyable />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CharacterCounter;
