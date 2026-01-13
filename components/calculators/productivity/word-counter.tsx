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
        <CardTitle>Word Counter</CardTitle>
        <CardDescription>
          Count words, characters, sentences, and paragraphs in your text
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter or paste your text</Label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full min-h-[200px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="text-help"
          />
          <p id="text-help" className="text-sm text-muted-foreground">
            Statistics update automatically as you type
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Clear Text
          </button>
        </div>

        {results && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Statistics</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultDisplay 
                label="Words" 
                value={results.wordCount.toLocaleString()} 
                highlight 
                copyable 
              />
              <ResultDisplay 
                label="Characters" 
                value={results.characterCount.toLocaleString()} 
                copyable 
              />
              <ResultDisplay 
                label="Characters (no spaces)" 
                value={results.characterCountNoSpaces.toLocaleString()} 
                copyable 
              />
              <ResultDisplay 
                label="Sentences" 
                value={results.sentenceCount.toLocaleString()} 
                copyable 
              />
              <ResultDisplay 
                label="Paragraphs" 
                value={results.paragraphCount.toLocaleString()} 
                copyable 
              />
              <ResultDisplay 
                label="Avg Word Length" 
                value={`${results.averageWordLength} chars`} 
                copyable 
              />
              <ResultDisplay 
                label="Reading Time" 
                value={`${results.readingTime} min`} 
                copyable 
              />
              <ResultDisplay 
                label="Speaking Time" 
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
