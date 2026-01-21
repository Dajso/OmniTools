'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    convertTitle,
    CAPITALIZATION_STYLES,
    type CapitalizationStyle,
} from '@/lib/calculations/productivity/title-capitalization';
import { Copy, Check } from 'lucide-react';

export function TitleCapitalization() {
    const [text, setText] = React.useState('');
    const [style, setStyle] = React.useState<CapitalizationStyle>('title-case');
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() => convertTitle({ text, style }), [text, style]);

    const copyOutput = async () => {
        if (result.output) {
            await navigator.clipboard.writeText(result.output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Title Capitalization Tool</CardTitle>
                <CardDescription>
                    Convert text to various capitalization styles
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Input */}
                <div className="space-y-2">
                    <Label>Input Text</Label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to convert..."
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                    <div className="text-xs text-muted-foreground">
                        {result.wordCount} words, {result.charCount} characters
                    </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                    <Label>Capitalization Style</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CAPITALIZATION_STYLES.map((s) => (
                            <button
                                key={s.style}
                                onClick={() => setStyle(s.style)}
                                className={`p-2 border rounded-md text-left transition-colors ${style === s.style
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="font-medium text-sm">{s.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{s.example}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Result</Label>
                        <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!result.output}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                        {result.output || <span className="text-muted-foreground">Result will appear here...</span>}
                    </div>
                </div>

                {/* Style Info */}
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                    <strong>{CAPITALIZATION_STYLES.find(s => s.style === style)?.name}: </strong>
                    {CAPITALIZATION_STYLES.find(s => s.style === style)?.description}
                </div>
            </CardContent>
        </Card>
    );
}

export default TitleCapitalization;
