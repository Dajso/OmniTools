'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertTextBinary } from '@/lib/calculations/productivity/text-to-binary';

export function TextToBinaryConverter() {
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [separator, setSeparator] = React.useState(' ');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleConvert = () => {
    try {
      setError(null);
      const result = convertTextBinary({ text: input, mode, separator });
      setOutput(result.output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Text to Binary Converter</CardTitle>
        <CardDescription>Convert text to binary and vice versa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'encode' ? 'default' : 'outline'} onClick={() => setMode('encode')}>Text → Binary</Button>
          <Button variant={mode === 'decode' ? 'default' : 'outline'} onClick={() => setMode('decode')}>Binary → Text</Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="input">{mode === 'encode' ? 'Text' : 'Binary'}</Label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text...' : 'Enter binary (e.g., 01001000 01101001)...'}
            className="w-full min-h-[100px] p-3 border rounded-md resize-y font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {mode === 'encode' && (
          <div className="space-y-2">
            <Label>Separator</Label>
            <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="w-full p-2 border rounded-md">
              <option value=" ">Space</option>
              <option value="">None</option>
              <option value="-">Dash</option>
            </select>
          </div>
        )}
        <Button onClick={handleConvert} className="w-full">Convert</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Result</Label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
            <div className="p-4 bg-muted rounded-md font-mono text-sm break-all max-h-48 overflow-y-auto">{output}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TextToBinaryConverter;
