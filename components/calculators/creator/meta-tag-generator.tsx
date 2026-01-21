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
                <CardTitle>Meta Tag Generator</CardTitle>
                <CardDescription>
                    Generate HTML meta tags for SEO, Open Graph, and Twitter Cards
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
                            {tab === 'basic' ? 'Basic SEO' : tab === 'og' ? 'Open Graph' : 'Twitter'}
                        </button>
                    ))}
                </div>

                {/* Basic SEO Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <TextInput
                            label="Page Title"
                            value={inputs.title || ''}
                            onChange={(v) => updateInput('title', v)}
                            placeholder="My Awesome Website"
                            helper="Recommended: 50-60 characters"
                        />
                        <div className="space-y-1">
                            <Label className="text-sm">Meta Description</Label>
                            <textarea
                                value={inputs.description || ''}
                                onChange={(e) => updateInput('description', e.target.value)}
                                placeholder="A brief description of your page..."
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                            <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                        </div>
                        <TextInput
                            label="Keywords"
                            value={inputs.keywords || ''}
                            onChange={(v) => updateInput('keywords', v)}
                            placeholder="keyword1, keyword2, keyword3"
                            helper="Comma-separated keywords (less important for SEO now)"
                        />
                        <TextInput
                            label="Author"
                            value={inputs.author || ''}
                            onChange={(v) => updateInput('author', v)}
                            placeholder="John Doe"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm">Robots</Label>
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
                                label="Canonical URL"
                                value={inputs.canonical || ''}
                                onChange={(v) => updateInput('canonical', v)}
                                placeholder="https://example.com/page"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Theme Color"
                                value={inputs.themeColor || ''}
                                onChange={(v) => updateInput('themeColor', v)}
                                placeholder="#3b82f6"
                            />
                            <TextInput
                                label="Favicon URL"
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
                            label="OG Title"
                            value={inputs.ogTitle || ''}
                            onChange={(v) => updateInput('ogTitle', v)}
                            placeholder="Leave empty to use page title"
                        />
                        <div className="space-y-1">
                            <Label className="text-sm">OG Description</Label>
                            <textarea
                                value={inputs.ogDescription || ''}
                                onChange={(e) => updateInput('ogDescription', e.target.value)}
                                placeholder="Leave empty to use meta description"
                                rows={2}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                        </div>
                        <TextInput
                            label="OG Image URL"
                            value={inputs.ogImage || ''}
                            onChange={(v) => updateInput('ogImage', v)}
                            placeholder="https://example.com/image.jpg"
                            helper="Recommended: 1200x630 pixels"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="OG URL"
                                value={inputs.ogUrl || ''}
                                onChange={(v) => updateInput('ogUrl', v)}
                                placeholder="https://example.com/page"
                            />
                            <div className="space-y-1">
                                <Label className="text-sm">OG Type</Label>
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
                            label="Site Name"
                            value={inputs.ogSiteName || ''}
                            onChange={(v) => updateInput('ogSiteName', v)}
                            placeholder="My Website"
                        />
                    </div>
                )}

                {/* Twitter Tab */}
                {activeTab === 'twitter' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-sm">Card Type</Label>
                            <select
                                value={inputs.twitterCard || 'summary_large_image'}
                                onChange={(e) => updateInput('twitterCard', e.target.value as MetaTagInputs['twitterCard'])}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="summary">Summary</option>
                                <option value="summary_large_image">Summary Large Image</option>
                                <option value="app">App</option>
                                <option value="player">Player</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Twitter Site (@username)"
                                value={inputs.twitterSite || ''}
                                onChange={(v) => updateInput('twitterSite', v)}
                                placeholder="@yoursite"
                            />
                            <TextInput
                                label="Twitter Creator"
                                value={inputs.twitterCreator || ''}
                                onChange={(v) => updateInput('twitterCreator', v)}
                                placeholder="@author"
                            />
                        </div>
                        <TextInput
                            label="Twitter Title"
                            value={inputs.twitterTitle || ''}
                            onChange={(v) => updateInput('twitterTitle', v)}
                            placeholder="Leave empty to use OG/page title"
                        />
                        <TextInput
                            label="Twitter Description"
                            value={inputs.twitterDescription || ''}
                            onChange={(v) => updateInput('twitterDescription', v)}
                            placeholder="Leave empty to use OG/meta description"
                        />
                        <TextInput
                            label="Twitter Image URL"
                            value={inputs.twitterImage || ''}
                            onChange={(v) => updateInput('twitterImage', v)}
                            placeholder="Leave empty to use OG image"
                        />
                    </div>
                )}

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Generated HTML</Label>
                        <Button variant="ghost" size="sm" onClick={copyHtml}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-80 overflow-y-auto font-mono">
                        <code>{result.html || '<!-- Fill in the form to generate meta tags -->'}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default MetaTagGenerator;
