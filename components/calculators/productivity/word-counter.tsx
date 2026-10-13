'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { countWords, type WordCountResults } from '@/lib/calculations/productivity/word-counter';

/**
 * Word Counter Component
 * 
 * Provides real-time word, character, and sentence counting
 * @see Requirements 9.1
 */
export function WordCounter() {
  const [text, setText] = React.useState('');
  const [results, setResults] = React.useState<WordCountResults | null>(null);

  // Calculate counts in real-time as user types
  React.useEffect(() => {
    const counts = countWords({ text });
    setResults(counts);
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Ordteller</CardTitle>
        <CardDescription>
          Tell ord, tegn, setninger og avsnitt i teksten din
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Skriv inn eller lim inn teksten din</Label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Begynn å skrive eller lim inn teksten her ..."
            className="w-full min-h-[200px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="text-help"
          />
          <p id="text-help" className="text-sm text-muted-foreground">
            Tallene oppdateres mens du skriver
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Tøm tekst
          </button>
        </div>

        {results && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Statistikk</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultDisplay 
                label="Ord" 
                value={results.wordCount.toLocaleString('nb-NO')} 
                highlight 
                copyable 
              />
              <ResultDisplay 
                label="Tegn" 
                value={results.characterCount.toLocaleString('nb-NO')} 
                copyable 
              />
              <ResultDisplay 
                label="Tegn (uten mellomrom)" 
                value={results.characterCountNoSpaces.toLocaleString('nb-NO')} 
                copyable 
              />
              <ResultDisplay 
                label="Setninger" 
                value={results.sentenceCount.toLocaleString('nb-NO')} 
                copyable 
              />
              <ResultDisplay 
                label="Avsnitt" 
                value={results.paragraphCount.toLocaleString('nb-NO')} 
                copyable 
              />
              <ResultDisplay 
                label="Gjennomsnittlig ordlengde" 
                value={`${results.averageWordLength} tegn`} 
                copyable 
              />
              <ResultDisplay 
                label="Lesetid" 
                value={`${results.readingTime} min`} 
                copyable 
              />
              <ResultDisplay 
                label="Taletid" 
                value={`${results.speakingTime} min`} 
                copyable 
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WordCounter;
