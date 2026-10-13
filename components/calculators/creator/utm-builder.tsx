'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    buildUTMUrl,
    UTM_PRESETS,
    CAMPAIGN_TEMPLATES,
} from '@/lib/calculations/creator/utm-builder';
import { Copy, Check, Link2 } from 'lucide-react';

export function UTMBuilder() {
    const [url, setUrl] = React.useState('https://example.com');
    const [source, setSource] = React.useState('');
    const [medium, setMedium] = React.useState('');
    const [campaign, setCampaign] = React.useState('');
    const [term, setTerm] = React.useState('');
    const [content, setContent] = React.useState('');
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() =>
        buildUTMUrl({ url, source, medium, campaign, term, content }),
        [url, source, medium, campaign, term, content]
    );

    const applyTemplate = (template: typeof CAMPAIGN_TEMPLATES[number]) => {
        setSource(template.source);
        setMedium(template.medium);
    };

    const copyUrl = async () => {
        if (result.isValid) {
            await navigator.clipboard.writeText(result.fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>UTM-bygger</CardTitle>
                <CardDescription>
                    Lag UTM-lenker for å spore markedsføringskampanjene dine
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Website URL */}
                <div className="space-y-2">
                    <Label htmlFor="url">URL til nettsiden *</Label>
                    <div className="flex gap-2">
                        <span className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Link2 className="w-4 h-4 text-muted-foreground" />
                        </span>
                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://eksempel.no/landingsside"
                            className="flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Campaign Templates */}
                <div className="space-y-2">
                    <Label>Hurtigmaler</Label>
                    <div className="flex flex-wrap gap-2">
                        {CAMPAIGN_TEMPLATES.map((template) => (
                            <button
                                key={template.name}
                                onClick={() => applyTemplate(template)}
                                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
                                title={template.description}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Required Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="source">Kampanjekilde * <span className="text-xs text-muted-foreground">(utm_source)</span></Label>
                        <input
                            id="source"
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="google"
                            list="source-presets"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <datalist id="source-presets">
                            {UTM_PRESETS.sources.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="medium">Kampanjemedium * <span className="text-xs text-muted-foreground">(utm_medium)</span></Label>
                        <input
                            id="medium"
                            type="text"
                            value={medium}
                            onChange={(e) => setMedium(e.target.value)}
                            placeholder="cpc"
                            list="medium-presets"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <datalist id="medium-presets">
                            {UTM_PRESETS.mediums.map((m) => (
                                <option key={m} value={m} />
                            ))}
                        </datalist>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign">Kampanjenavn * <span className="text-xs text-muted-foreground">(utm_campaign)</span></Label>
                        <input
                            id="campaign"
                            type="text"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            placeholder="sommersalg"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="term">Kampanjeord <span className="text-xs text-muted-foreground">(utm_term, valgfritt)</span></Label>
                        <input
                            id="term"
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="joggesko"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Kampanjeinnhold <span className="text-xs text-muted-foreground">(utm_content, valgfritt)</span></Label>
                        <input
                            id="content"
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="logolenke"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Errors */}
                {result.errors.length > 0 && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <ul className="text-sm text-destructive space-y-1">
                            {result.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Generated URL */}
                {result.isValid && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Generert URL</Label>
                            <Button variant="ghost" size="sm" onClick={copyUrl}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{copied ? 'Kopiert!' : 'Kopier'}</span>
                            </Button>
                        </div>
                        <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono">
                            {result.fullUrl}
                        </div>
                    </div>
                )}

                {/* Parameter Summary */}
                {result.isValid && Object.keys(result.params).length > 0 && (
                    <div className="space-y-2">
                        <Label>UTM-parametere</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(result.params).map(([key, value]) => (
                                <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default UTMBuilder;
