'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertBase64, type Base64Results } from '@/lib/calculations/productivity/base64-converter';

export function Base64Converter() {
  const [input, setInput] = React.useState('Hello, World!');
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [results, setResults] = React.useState<Base64Results | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleConvert = React.useCallback(() => {
    const result = convertBase64({ text: input, mode, urlSafe });
    setResults(result);
  }, [input, mode, urlSafe]);

  React.useEffect(() => { handleConvert(); }, [handleConvert]);

  const handleCopy = async () => {
    if (results?.output) {
      await navigator.clipboard.writeText(results.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSwap = () => {
    if (results?.output) {
      setInput(results.output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Base64-koding</CardTitle>
        <CardDescription>Kod og dekod Base64-tekst</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'encode' ? 'default' : 'outline'} onClick={() => setMode('encode')}>Kod</Button>
          <Button variant={mode === 'decode' ? 'default' : 'outline'} onClick={() => setMode('decode')}>Dekod</Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="input">{mode === 'encode' ? 'Tekst' : 'Base64'}</Label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Skriv inn tekst som skal kodes ...' : 'Skriv inn Base64 som skal dekodes ...'}
            className="w-full min-h-[100px] p-3 border rounded-md resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">URL-sikker koding (bytt ut +/ med -_)</span>
        </label>
        {results && !results.isValid && (
          <p className="text-sm text-destructive">Feil: {results.error}</p>
        )}
        {results && results.isValid && results.output && (
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{mode === 'encode' ? 'Base64' : 'Tekst'}</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleSwap}>Bytt</Button>
                  <Button size="sm" variant="ghost" onClick={handleCopy}>{copied ? 'Kopiert!' : 'Kopier'}</Button>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-md font-mono text-sm break-all max-h-48 overflow-y-auto">
                {results.output}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Lengde på inndata" value={`${results.inputLength} tegn`} />
              <ResultDisplay label="Lengde på resultat" value={`${results.outputLength} tegn`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Base64Converter;
