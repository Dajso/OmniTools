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
        <CardTitle>Character Counter</CardTitle>
        <CardDescription>Count characters with optional spaces toggle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter your text</Label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            className="w-full min-h-[150px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeSpaces} onChange={(e) => setIncludeSpaces(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Include spaces in count</span>
        </label>
        {results && (
          <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <ResultDisplay label="Characters" value={results.totalCharacters.toLocaleString()} highlight copyable />
            <ResultDisplay label="Without Spaces" value={results.charactersNoSpaces.toLocaleString()} copyable />
            <ResultDisplay label="Letters" value={results.letters.toLocaleString()} copyable />
            <ResultDisplay label="Digits" value={results.digits.toLocaleString()} copyable />
            <ResultDisplay label="Special" value={results.specialCharacters.toLocaleString()} copyable />
            <ResultDisplay label="Lines" value={results.lines.toLocaleString()} copyable />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CharacterCounter;
