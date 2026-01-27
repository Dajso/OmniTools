'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { generateLoremIpsum, type LoremIpsumResults } from '@/lib/calculations/productivity/lorem-ipsum-generator';

export function LoremIpsumGenerator() {
  const [type, setType] = React.useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = React.useState(3);
  const [startWithLorem, setStartWithLorem] = React.useState(true);
  const [results, setResults] = React.useState<LoremIpsumResults | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = React.useCallback(() => {
    const result = generateLoremIpsum({ type, count, startWithLorem });
    setResults(result);
  }, [type, count, startWithLorem]);

  React.useEffect(() => { handleGenerate(); }, [handleGenerate]);

  const handleCopy = async () => {
    if (results) {
      await navigator.clipboard.writeText(results.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Lorem Ipsum Generator</CardTitle>
        <CardDescription>Generate placeholder text for your designs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full p-2 border rounded-md">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <NumberInput id="count" label="Count" value={count} onChange={setCount} min={1} max={100} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Start with "Lorem ipsum..."</span>
        </label>
        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="flex-1">Generate</Button>
          <Button onClick={handleCopy} variant="outline">{copied ? 'Copied!' : 'Copy'}</Button>
        </div>
        {results && (
          <div className="border-t pt-4 space-y-3">
            <div className="p-4 bg-muted rounded-md max-h-64 overflow-y-auto whitespace-pre-wrap text-sm">
              {results.text}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Words" value={results.wordCount.toLocaleString()} />
              <ResultDisplay label="Characters" value={results.characterCount.toLocaleString()} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LoremIpsumGenerator;
