'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  compareTexts,
  getSimilarityRating,
  type TextCompareResult,
} from '@/lib/calculations/academic/text-compare';

export function PlagiarismChecker() {
  const [text1, setText1] = React.useState<string>('');
  const [text2, setText2] = React.useState<string>('');
  const [error, setError] = React.useState<string | undefined>();
  const [results, setResults] = React.useState<TextCompareResult | null>(null);

  const compare = React.useCallback(() => {
    try {
      setError(undefined);

      if (!text1.trim() || !text2.trim()) {
        setError('Skriv inn tekst i begge feltene');
        setResults(null);
        return;
      }

      if (text1.trim().split(/\s+/).length < 3 || text2.trim().split(/\s+/).length < 3) {
        setError('Hver tekst må ha minst 3 ord');
        setResults(null);
        return;
      }

      const result = compareTexts(text1, text2);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil ved sammenligning');
      setResults(null);
    }
  }, [text1, text2]);

  const reset = () => {
    setText1('');
    setText2('');
    setResults(null);
    setError(undefined);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const rating = results ? getSimilarityRating(results.similarityPercentage) : null;

  return (
    <CalculatorBase
      title="Tekstsammenligning"
      description="Sammenlign to tekster og finn likheter og mulig plagiat"
      onCalculate={compare}
      onReset={reset}
      error={error}
      results={results && rating && (
        <div className="space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Likhet</p>
            <p className={`text-4xl font-bold ${rating.color}`}>
              {results.similarityPercentage}%
            </p>
            <p className={`text-sm font-medium ${rating.color}`}>
              {rating.label}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Ord i tekst 1" 
              value={results.totalWords1.toString()} 
            />
            <ResultDisplay 
              label="Ord i tekst 2" 
              value={results.totalWords2.toString()} 
            />
          </div>

          <ResultDisplay 
            label="Felles ord" 
            value={results.matchingWords.toString()} 
          />

          {results.matchingPhrases.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Felles fraser ({results.matchingPhrases.length})</p>
              <div className="max-h-32 overflow-y-auto p-3 bg-muted/30 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {results.matchingPhrases.map((phrase, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.uniqueToText1.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-600">
                Bare i tekst 1 ({results.uniqueToText1.length} ord)
              </p>
              <p className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
                {results.uniqueToText1.slice(0, 20).join(', ')}
                {results.uniqueToText1.length > 20 && '...'}
              </p>
            </div>
          )}

          {results.uniqueToText2.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">
                Bare i tekst 2 ({results.uniqueToText2.length} ord)
              </p>
              <p className="text-xs text-muted-foreground p-2 bg-green-50 rounded">
                {results.uniqueToText2.slice(0, 20).join(', ')}
                {results.uniqueToText2.length > 20 && '...'}
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="text1" className="block text-sm font-medium">
            Tekst 1 (original)
          </label>
          <textarea
            id="text1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Lim inn eller skriv originalteksten her ..."
            className="w-full h-32 px-3 py-2 border rounded-md bg-background resize-none"
            aria-describedby="text1-count"
          />
          <p id="text1-count" className="text-xs text-muted-foreground">
            {text1.trim().split(/\s+/).filter(w => w).length} ord
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={swapTexts}
            className="gap-2"
          >
            ↕ Bytt tekstene
          </Button>
        </div>

        <div className="space-y-2">
          <label htmlFor="text2" className="block text-sm font-medium">
            Tekst 2 (til sammenligning)
          </label>
          <textarea
            id="text2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Lim inn eller skriv teksten som skal sammenlignes ..."
            className="w-full h-32 px-3 py-2 border rounded-md bg-background resize-none"
            aria-describedby="text2-count"
          />
          <p id="text2-count" className="text-xs text-muted-foreground">
            {text2.trim().split(/\s+/).filter(w => w).length} ord
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PlagiarismChecker;
