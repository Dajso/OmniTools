'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateMetaTags,
    OG_TYPES,
    ROBOTS_OPTIONS,
    type MetaTagInputs,
} from '@/lib/calculations/creator/meta-tag-generator';
import { Copy, Check } from 'lucide-react';

function TextInput({
    label,
    value,
    onChange,
    placeholder,
    helper,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    helper?: string;
}) {
    return (
        <div className="space-y-1">
            <Label className="text-sm">{label}</Label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
        </div>
    );
}

export function MetaTagGenerator() {
    const [inputs, setInputs] = React.useState<Partial<MetaTagInputs>>({
        title: '',
        description: '',
        keywords: '',
        ogImage: '',
        ogUrl: '',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterSite: '',
        themeColor: '#3b82f6',
    });
    const [copied, setCopied] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'basic' | 'og' | 'twitter'>('basic');

    const result = React.useMemo(() => generateMetaTags(inputs), [inputs]);

    const updateInput = <K extends keyof MetaTagInputs>(key: K, value: MetaTagInputs[K]) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const copyHtml = async () => {
        await navigator.clipboard.writeText(result.html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Metatag-generator</CardTitle>
                <CardDescription>
                    Lag HTML-metakoder for SEO, Open Graph og Twitter Cards
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 border-b">
                    {(['basic', 'og', 'twitter'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab === 'basic' ? 'Grunnleggende SEO' : tab === 'og' ? 'Open Graph' : 'Twitter'}
                        </button>
                    ))}
                </div>

                {/* Basic SEO Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <TextInput
                            label="Sidetittel"
                            value={inputs.title || ''}
                            onChange={(v) => updateInput('title', v)}
                            placeholder="Nettsiden min"
                            helper="Recommended: 50-60 characters"
                        />
                        <div className="space-y-1">
                            <Label className="text-sm">Metabeskrivelse</Label>
                            <textarea
                                value={inputs.description || ''}
                                onChange={(e) => updateInput('description', e.target.value)}
                                placeholder="En kort beskrivelse av siden din …"
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                            <p className="text-xs text-muted-foreground">Anbefalt: 150–160 tegn</p>
                        </div>
                        <TextInput
                            label="Nøkkelord"
                            value={inputs.keywords || ''}
                            onChange={(v) => updateInput('keywords', v)}
                            placeholder="nøkkelord1, nøkkelord2, nøkkelord3"
                            helper="Nøkkelord atskilt med komma (mindre viktig for SEO i dag)"
                        />
                        <TextInput
                            label="Forfatter"
                            value={inputs.author || ''}
                            onChange={(v) => updateInput('author', v)}
                            placeholder="Ola Nordmann"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm">Roboter</Label>
                                <select
                                    value={inputs.robots || 'index, follow'}
                                    onChange={(e) => updateInput('robots', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                >
                                    {ROBOTS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <TextInput
                                label="Kanonisk URL"
                                value={inputs.canonical || ''}
                                onChange={(v) => updateInput('canonical', v)}
                                placeholder="https://example.com/page"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Temafarge"
                                value={inputs.themeColor || ''}
                                onChange={(v) => updateInput('themeColor', v)}
                                placeholder="#3b82f6"
                            />
                            <TextInput
                                label="URL til favicon"
                                value={inputs.favicon || ''}
                                onChange={(v) => updateInput('favicon', v)}
                                placeholder="/favicon.ico"
                            />
                        </div>
                    </div>
                )}

                {/* Open Graph Tab */}
                {activeTab === 'og' && (
                    <div className="space-y-4">
                        <TextInput
                            label="OG-tittel"
                            value={inputs.ogTitle || ''}
                            onChange={(v) => updateInput('ogTitle', v)}
                            placeholder="La stå tomt for å bruke sidetittelen"
                        />
                        <div className="space-y-1">
                            <Label className="text-sm">OG-beskrivelse</Label>
                            <textarea
                                value={inputs.ogDescription || ''}
                                onChange={(e) => updateInput('ogDescription', e.target.value)}
                                placeholder="La stå tomt for å bruke metabeskrivelsen"
                                rows={2}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                        </div>
                        <TextInput
                            label="URL til OG-bilde"
                            value={inputs.ogImage || ''}
                            onChange={(v) => updateInput('ogImage', v)}
                            placeholder="https://example.com/image.jpg"
                            helper="Recommended: 1200x630 pixels"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="OG-URL"
                                value={inputs.ogUrl || ''}
                                onChange={(v) => updateInput('ogUrl', v)}
                                placeholder="https://example.com/page"
                            />
                            <div className="space-y-1">
                                <Label className="text-sm">OG-type</Label>
                                <select
                                    value={inputs.ogType || 'website'}
                                    onChange={(e) => updateInput('ogType', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                >
                                    {OG_TYPES.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <TextInput
                            label="Navn på nettstedet"
                            value={inputs.ogSiteName || ''}
                            onChange={(v) => updateInput('ogSiteName', v)}
                            placeholder="Nettstedet mitt"
                        />
                    </div>
                )}

                {/* Twitter Tab */}
                {activeTab === 'twitter' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-sm">Korttype</Label>
                            <select
                                value={inputs.twitterCard || 'summary_large_image'}
                                onChange={(e) => updateInput('twitterCard', e.target.value as MetaTagInputs['twitterCard'])}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="summary">Oppsummering</option>
                                <option value="summary_large_image">Oppsummering med stort bilde</option>
                                <option value="app">App</option>
                                <option value="player">Spiller</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Twitter-konto for nettstedet (@brukernavn)"
                                value={inputs.twitterSite || ''}
                                onChange={(v) => updateInput('twitterSite', v)}
                                placeholder="@nettstedet"
                            />
                            <TextInput
                                label="Twitter-konto for forfatteren"
                                value={inputs.twitterCreator || ''}
                                onChange={(v) => updateInput('twitterCreator', v)}
                                placeholder="@forfatter"
                            />
                        </div>
                        <TextInput
                            label="Twitter-tittel"
                            value={inputs.twitterTitle || ''}
                            onChange={(v) => updateInput('twitterTitle', v)}
                            placeholder="La stå tomt for å bruke OG-/sidetittelen"
                        />
                        <TextInput
                            label="Twitter-beskrivelse"
                            value={inputs.twitterDescription || ''}
                            onChange={(v) => updateInput('twitterDescription', v)}
                            placeholder="La stå tomt for å bruke OG-/metabeskrivelsen"
                        />
                        <TextInput
                            label="URL til Twitter-bilde"
                            value={inputs.twitterImage || ''}
                            onChange={(v) => updateInput('twitterImage', v)}
                            placeholder="La stå tomt for å bruke OG-bildet"
                        />
                    </div>
                )}

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Generert HTML</Label>
                        <Button variant="ghost" size="sm" onClick={copyHtml}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Kopiert!' : 'Kopier'}</span>
                        </Button>
                    </div>
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-80 overflow-y-auto font-mono">
                        <code>{result.html || '<!-- Fyll ut skjemaet for å lage metakoder -->'}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default MetaTagGenerator;
