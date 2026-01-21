'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    formatSQL,
    SQL_DIALECTS,
    EXAMPLE_SQL,
    type SQLFormatterInputs,
} from '@/lib/calculations/productivity/sql-formatter';
import { Copy, Check, FileCode } from 'lucide-react';

export function SQLFormatter() {
    const [sql, setSQL] = React.useState('');
    const [dialect, setDialect] = React.useState<SQLFormatterInputs['dialect']>('standard');
    const [uppercase, setUppercase] = React.useState(true);
    const [indentSize, setIndentSize] = React.useState(2);
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() =>
        formatSQL({ sql, dialect, uppercase, indentSize }),
        [sql, dialect, uppercase, indentSize]
    );

    const copyFormatted = async () => {
        if (result.formatted) {
            await navigator.clipboard.writeText(result.formatted);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const loadExample = () => {
        setSQL(EXAMPLE_SQL);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>SQL Formatter</CardTitle>
                <CardDescription>
                    Format and beautify SQL queries with proper indentation
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Options */}
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-1">
                        <Label>Dialect</Label>
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value as SQLFormatterInputs['dialect'])}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            {SQL_DIALECTS.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label>Indent Size</Label>
                        <select
                            value={indentSize}
                            onChange={(e) => setIndentSize(parseInt(e.target.value))}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="2">2 spaces</option>
                            <option value="4">4 spaces</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={uppercase}
                            onChange={(e) => setUppercase(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">Uppercase Keywords</span>
                    </label>
                    <Button variant="outline" size="sm" onClick={loadExample}>
                        <FileCode className="w-4 h-4 mr-1" /> Load Example
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="space-y-2">
                        <Label>Input SQL</Label>
                        <textarea
                            value={sql}
                            onChange={(e) => setSQL(e.target.value)}
                            placeholder="Paste your SQL query here..."
                            rows={15}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Formatted SQL</Label>
                            <Button variant="ghost" size="sm" onClick={copyFormatted} disabled={!result.formatted}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                            </Button>
                        </div>
                        <pre className="w-full min-h-[300px] p-3 border rounded-md bg-muted overflow-auto text-sm font-mono">
                            <code>{result.formatted || '-- Formatted SQL will appear here'}</code>
                        </pre>
                    </div>
                </div>

                {/* Stats */}
                {result.formatted && (
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{result.lineCount} lines</span>
                        <span>{result.keywordCount} keywords</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default SQLFormatter;
