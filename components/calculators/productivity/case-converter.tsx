'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { convertCase, type CaseType } from '@/lib/calculations/productivity/case-converter';

const CASE_OPTIONS: Array<{ value: CaseType; label: string }> = [
  { value: 'upper', label: 'UPPERCASE' },
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
];

export function CaseConverter() {
  const [text, setText] = React.useState('');
  const [converted, setConverted] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleConvert = (targetCase: CaseType) => {
    const result = convertCase({ text, targetCase });
    setConverted(result.converted);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(converted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Case Converter</CardTitle>
        <CardDescription>Convert text between different cases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="input-text">Input Text</Label>
          <textarea
            id="input-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert..."
            className="w-full min-h-[100px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CASE_OPTIONS.map((option) => (
            <Button key={option.value} variant="outline" size="sm" onClick={() => handleConvert(option.value)}>
              {option.label}
            </Button>
          ))}
        </div>
        {converted && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Result</Label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap break-all">{converted}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CaseConverter;
