'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateHashtags,
    PLATFORMS,
    type HashtagInputs,
} from '@/lib/calculations/creator/hashtag-generator';
import { Copy, Check, Hash } from 'lucide-react';

export function HashtagGenerator() {
    const [topic, setTopic] = React.useState('');
    const [platform, setPlatform] = React.useState<HashtagInputs['platform']>('instagram');
    const [style, setStyle] = React.useState<HashtagInputs['style']>('mixed');
    const [count, setCount] = React.useState(15);
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() =>
        generateHashtags({ topic, platform, style, count }),
        [topic, platform, style, count]
    );

    const selectedPlatform = PLATFORMS.find(p => p.id === platform);

    const copyHashtags = async () => {
        if (result.copyText) {
            await navigator.clipboard.writeText(result.copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Hashtag Generator</CardTitle>
                <CardDescription>
                    Generate relevant hashtags for your social media posts
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Keywords</Label>
                    <div className="flex gap-2">
                        <span className="flex items-center px-3 border rounded-l-md bg-muted">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                        </span>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., travel photography, food blog, fitness motivation"
                            className="flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                    <Label>Platform</Label>
                    <div className="flex flex-wrap gap-2">
                        {PLATFORMS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setPlatform(p.id);
                                    if (count > p.maxTags) setCount(p.maxTags);
                                }}
                                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${platform === p.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                    <Label>Style</Label>
                    <div className="flex gap-2">
                        {(['popular', 'niche', 'mixed'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`px-3 py-1.5 text-sm border rounded-md transition-colors capitalize ${style === s
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count Slider */}
                <div className="space-y-2">
                    <Label>Number of Hashtags: {count}</Label>
                    <input
                        type="range"
                        min="5"
                        max={selectedPlatform?.maxTags || 30}
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                        Recommended for {selectedPlatform?.name}: up to {selectedPlatform?.maxTags} hashtags
                    </div>
                </div>

                {/* Generated Hashtags */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Generated Hashtags ({result.hashtags.length})</Label>
                        <Button variant="ghost" size="sm" onClick={copyHashtags} disabled={!result.copyText}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy All'}</span>
                        </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                        {result.hashtags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {result.hashtags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">Enter a topic to generate hashtags...</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default HashtagGenerator;
