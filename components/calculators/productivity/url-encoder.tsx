'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    convertUrl,
    ENCODING_REFERENCE,
} from '@/lib/calculations/productivity/url-encoder';
import { Copy, Check, ArrowLeftRight } from 'lucide-react';

export function URLEncoder() {
    const [text, setText] = React.useState('');
    const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
    const [encodeType, setEncodeType] = React.useState<'component' | 'full'>('component');
    const [copied, setCopied] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const result = React.useMemo(() => {
        try {
            setError(null);
            return convertUrl({ text, mode, encodeType });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Conversion failed');
            return { output: '', inputLength: 0, outputLength: 0 };
        }
    }, [text, mode, encodeType]);

    const copyOutput = async () => {
        if (result.output) {
            await navigator.clipboard.writeText(result.output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const swapMode = () => {
        setMode(prev => prev === 'encode' ? 'decode' : 'encode');
        setText(result.output);
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>URL Encoder/Decoder</CardTitle>
                <CardDescription>
                    Encode and decode URL strings for web use
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mode Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant={mode === 'encode' ? 'default' : 'outline'}
                        onClick={() => setMode('encode')}
                    >
                        Encode
                    </Button>
                    <Button variant="outline" size="icon" onClick={swapMode}>
                        <ArrowLeftRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={mode === 'decode' ? 'default' : 'outline'}
                        onClick={() => setMode('decode')}
                    >
                        Decode
                    </Button>
                </div>

                {/* Encode Type */}
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => setEncodeType('component')}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${encodeType === 'component' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                            }`}
                    >
                        encodeURIComponent
                    </button>
                    <button
                        onClick={() => setEncodeType('full')}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${encodeType === 'full' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                            }`}
                    >
                        encodeURI
                    </button>
                </div>

                {/* Input */}
                <div className="space-y-2">
                    <Label>{mode === 'encode' ? 'Text to Encode' : 'URL to Decode'}</Label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={mode === 'encode'
                            ? 'Enter text to encode...'
                            : 'Enter encoded URL to decode...'}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
                    />
                    <div className="text-xs text-muted-foreground">
                        Characters: {result.inputLength}
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>{mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}</Label>
                        <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!result.output}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all min-h-[80px]">
                        {result.output || <span className="text-muted-foreground">Output will appear here...</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Characters: {result.outputLength}
                    </div>
                </div>

                {/* Reference Table */}
                <div className="border-t pt-4">
                    <Label className="mb-2 block">Common Encodings</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
                        {ENCODING_REFERENCE.slice(0, 10).map((item) => (
                            <div key={item.char} className="p-2 bg-muted/50 rounded text-center">
                                <div className="font-mono">{item.char} → {item.encoded}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default URLEncoder;
