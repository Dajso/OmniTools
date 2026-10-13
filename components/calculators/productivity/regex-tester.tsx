'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    testRegex,
    COMMON_PATTERNS,
    type RegexResults
} from '@/lib/calculations/productivity/regex-tester';
import { Copy, Check } from 'lucide-react';

export function RegexTester() {
    const [pattern, setPattern] = React.useState('');
    const [testString, setTestString] = React.useState('');
    const [flags, setFlags] = React.useState({
        global: true,
        caseInsensitive: false,
        multiline: false,
        dotAll: false,
        unicode: false,
    });
    const [results, setResults] = React.useState<RegexResults | null>(null);
    const [copied, setCopied] = React.useState(false);

    const handleTest = React.useCallback(() => {
        const result = testRegex({ pattern, testString, flags });
        setResults(result);
    }, [pattern, testString, flags]);

    // Auto-test on input change
    React.useEffect(() => {
        handleTest();
    }, [handleTest]);

    const toggleFlag = (flag: keyof typeof flags) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    };

    const applyPattern = (p: string) => {
        setPattern(p);
    };

    const copyPattern = async () => {
        if (pattern) {
            await navigator.clipboard.writeText(pattern);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Regex-tester</CardTitle>
                <CardDescription>
                    Test regulære uttrykk med live treff og gruppeuttrekk
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pattern Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="pattern">Regulært uttrykk</Label>
                        <Button variant="ghost" size="sm" onClick={copyPattern}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                        <span className="text-muted-foreground">/</span>
                        <input
                            id="pattern"
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Skriv inn regex-mønster ..."
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        />
                        <span className="text-muted-foreground">/{results?.flags || ''}</span>
                    </div>
                    {results?.error && (
                        <p className="text-sm text-destructive">{results.error}</p>
                    )}
                </div>

                {/* Flags */}
                <div className="space-y-2">
                    <Label>Flagg</Label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'global', label: 'g', title: 'Global – finn alle treff' },
                            { key: 'caseInsensitive', label: 'i', title: 'Ikke skill mellom store og små bokstaver' },
                            { key: 'multiline', label: 'm', title: 'Flere linjer – ^ og $ matcher linjegrenser' },
                            { key: 'dotAll', label: 's', title: 'DotAll – . matcher linjeskift' },
                            { key: 'unicode', label: 'u', title: 'Unicode – slå på unicode-funksjoner' },
                        ].map(({ key, label, title }) => (
                            <button
                                key={key}
                                onClick={() => toggleFlag(key as keyof typeof flags)}
                                title={title}
                                className={`w-8 h-8 rounded-md border font-mono text-sm transition-colors ${flags[key as keyof typeof flags]
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-muted border-input'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Test String */}
                <div className="space-y-2">
                    <Label htmlFor="test-string">Tekst å teste</Label>
                    <textarea
                        id="test-string"
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        placeholder="Skriv inn tekst å teste mot ..."
                        rows={5}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                </div>

                {/* Results */}
                {results && results.isValid && testString && (
                    <div className="space-y-4">
                        {/* Match Count */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Treff:</span>
                            <span className={`px-2 py-0.5 rounded ${results.matchCount > 0
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                {results.matchCount}
                            </span>
                        </div>

                        {/* Highlighted Text */}
                        <div className="space-y-2">
                            <Label>Uthevede treff</Label>
                            <div className="p-3 border rounded-md bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all">
                                {results.highlightedText.map((segment, i) => (
                                    <span
                                        key={i}
                                        className={segment.isMatch ? 'bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded' : ''}
                                    >
                                        {segment.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Match Details */}
                        {results.matches.length > 0 && (
                            <div className="space-y-2">
                                <Label>Detaljer om treff</Label>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {results.matches.map((match, i) => (
                                        <div key={i} className="p-2 border rounded-md bg-background text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">Treff {i + 1}</span>
                                                <span className="text-muted-foreground text-xs">Indeks: {match.index}</span>
                                            </div>
                                            <code className="block bg-muted px-2 py-1 rounded text-xs break-all">
                                                {match.match}
                                            </code>
                                            {match.captureGroups.length > 0 && (
                                                <div className="mt-2 text-xs">
                                                    <span className="text-muted-foreground">Fangstgrupper:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {match.captureGroups.map((group, j) => (
                                                            <span key={j} className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">
                                                                ${j + 1}: {group || '(tom)'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {match.groups && Object.keys(match.groups).length > 0 && (
                                                <div className="mt-2 text-xs">
                                                    <span className="text-muted-foreground">Navngitte grupper:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {Object.entries(match.groups).map(([name, value]) => (
                                                            <span key={name} className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">
                                                                {name}: {value || '(tom)'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Common Patterns */}
                <div className="border-t pt-4">
                    <Label className="mb-3 block">Vanlige mønstre</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {COMMON_PATTERNS.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => applyPattern(p.pattern)}
                                className="text-left p-2 border rounded-md hover:bg-muted transition-colors"
                            >
                                <div className="font-medium text-sm">{p.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{p.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default RegexTester;
