'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { generateUUIDs, type UUIDResults } from '@/lib/calculations/productivity/uuid-generator';

export function UUIDGenerator() {
  const [count, setCount] = React.useState(1);
  const [version, setVersion] = React.useState<'v4' | 'v1-like'>('v4');
  const [uppercase, setUppercase] = React.useState(false);
  const [hyphens, setHyphens] = React.useState(true);
  const [results, setResults] = React.useState<UUIDResults | null>(null);
  const [copied, setCopied] = React.useState<number | null>(null);

  const handleGenerate = () => {
    const result = generateUUIDs({ count, version, uppercase, hyphens });
    setResults(result);
  };

  React.useEffect(() => { handleGenerate(); }, []);

  const handleCopy = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyAll = async () => {
    if (results) {
      await navigator.clipboard.writeText(results.uuids.join('\n'));
      setCopied(-1);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>UUID Generator</CardTitle>
        <CardDescription>Generate universally unique identifiers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="count" label="Count" value={count} onChange={setCount} min={1} max={100} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Version</label>
            <select value={version} onChange={(e) => setVersion(e.target.value as 'v4' | 'v1-like')} className="w-full p-2 border rounded-md">
              <option value="v4">UUID v4 (Random)</option>
              <option value="v1-like">UUID v1-like (Time-based)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Include hyphens</span>
          </label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="flex-1">Generate</Button>
          {results && results.uuids.length > 1 && (
            <Button onClick={handleCopyAll} variant="outline">{copied === -1 ? 'Copied!' : 'Copy All'}</Button>
          )}
        </div>
        {results && (
          <div className="border-t pt-4 space-y-2">
            {results.uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="flex-1 font-mono text-sm break-all">{uuid}</code>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(uuid, i)}>
                  {copied === i ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UUIDGenerator;
