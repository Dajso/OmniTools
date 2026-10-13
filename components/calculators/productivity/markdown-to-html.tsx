'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    convertMarkdown,
    MARKDOWN_EXAMPLE,
} from '@/lib/calculations/productivity/markdown-to-html';
import { Copy, Check, Eye, Code } from 'lucide-react';

export function MarkdownToHtml() {
    const [markdown, setMarkdown] = React.useState('');
    const [viewMode, setViewMode] = React.useState<'html' | 'preview'>('preview');
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() => convertMarkdown({ markdown }), [markdown]);

    const copyHtml = async () => {
        if (result.html) {
            await navigator.clipboard.writeText(result.html);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const loadExample = () => {
        setMarkdown(MARKDOWN_EXAMPLE);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Markdown til HTML</CardTitle>
                <CardDescription>
                    Gjør om Markdown til HTML med forhåndsvisning
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Markdown-inndata</Label>
                            <Button variant="ghost" size="sm" onClick={loadExample}>
                                Last inn eksempel
                            </Button>
                        </div>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Skriv inn Markdown ..."
                            rows={20}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${viewMode === 'preview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                        }`}
                                >
                                    <Eye className="w-3 h-3" /> Forhåndsvisning
                                </button>
                                <button
                                    onClick={() => setViewMode('html')}
                                    className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${viewMode === 'html' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                        }`}
                                >
                                    <Code className="w-3 h-3" /> HTML
                                </button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={copyHtml} disabled={!result.html}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        {viewMode === 'preview' ? (
                            <div
                                className="w-full min-h-[400px] p-4 border rounded-md bg-background overflow-auto prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: result.preview || '<p class="text-muted-foreground">Forhåndsvisningen vises her ...</p>' }}
                            />
                        ) : (
                            <pre className="w-full min-h-[400px] p-4 border rounded-md bg-muted overflow-auto text-xs font-mono">
                                <code>{result.html || '<!-- HTML vises her -->'}</code>
                            </pre>
                        )}
                    </div>
                </div>

                {/* Syntax Reference */}
                <div className="border-t pt-4">
                    <Label className="mb-2 block">Hurtigreferanse</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 bg-muted/50 rounded">
                            <code># Heading</code> → H1
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>**bold**</code> → <strong>bold</strong>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>*italic*</code> → <em>italic</em>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>[link](url)</code> → lenke
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>`code`</code> → <code>code</code>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>- item</code> → liste
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>&gt; quote</code> → sitat
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <code>---</code> → vannrett linje
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default MarkdownToHtml;
