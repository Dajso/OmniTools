'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { formatJSON, type JSONFormatterResults } from '@/lib/calculations/productivity/json-formatter';

export function JSONFormatter() {
  const [input, setInput] = React.useState('{"navn":"Ola","alder":30,"by":"Oslo"}');
  const [indentSize, setIndentSize] = React.useState(2);
  const [sortKeys, setSortKeys] = React.useState(false);
  const [results, setResults] = React.useState<JSONFormatterResults | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleFormat = React.useCallback(() => {
    const result = formatJSON({ json: input, indentSize, sortKeys });
    setResults(result);
  }, [input, indentSize, sortKeys]);

  React.useEffect(() => { handleFormat(); }, [handleFormat]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>JSON-formaterer</CardTitle>
        <CardDescription>Formater, valider og komprimer JSON</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="json-input">JSON-inndata</Label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"nøkkel": "verdi"}'
            className={`w-full min-h-[150px] p-3 border rounded-md resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              results && !results.isValid ? 'border-destructive' : ''
            }`}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="indent">Innrykk:</Label>
            <select id="indent" value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value))} className="p-1 border rounded">
              <option value={2}>2 mellomrom</option>
              <option value={4}>4 mellomrom</option>
              <option value={1}>1 tabulator</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Sorter nøkler</span>
          </label>
        </div>
        {results && !results.isValid && (
          <p className="text-sm text-destructive">Feil: {results.error}</p>
        )}
        {results && results.isValid && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Formatert</Label>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(results.formatted)}>
                  {copied ? 'Kopiert!' : 'Kopier'}
                </Button>
              </div>
              <pre className="p-4 bg-muted rounded-md font-mono text-sm overflow-x-auto max-h-64">{results.formatted}</pre>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCopy(results.minified)}>Kopier komprimert</Button>
              <Button size="sm" variant="outline" onClick={() => setInput(results.formatted)}>Bruk formatert</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultDisplay label="Nøkler" value={results.stats.keys.toString()} />
              <ResultDisplay label="Verdier" value={results.stats.values.toString()} />
              <ResultDisplay label="Dybde" value={results.stats.depth.toString()} />
              <ResultDisplay label="Størrelse" value={`${results.stats.size} → ${results.stats.minifiedSize}`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JSONFormatter;
