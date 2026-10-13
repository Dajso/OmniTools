'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateBoxShadow,
    createDefaultShadow,
    SHADOW_PRESETS,
    type BoxShadow,
} from '@/lib/calculations/productivity/box-shadow-generator';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

export function BoxShadowGenerator() {
    const [shadows, setShadows] = React.useState<BoxShadow[]>([createDefaultShadow()]);
    const [copied, setCopied] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const result = React.useMemo(() => generateBoxShadow(shadows), [shadows]);

    const addShadow = () => {
        setShadows([...shadows, createDefaultShadow()]);
        setActiveIndex(shadows.length);
    };

    const removeShadow = (index: number) => {
        if (shadows.length > 1) {
            setShadows(shadows.filter((_, i) => i !== index));
            if (activeIndex >= shadows.length - 1) {
                setActiveIndex(Math.max(0, shadows.length - 2));
            }
        }
    };

    const updateShadow = (index: number, field: keyof BoxShadow, value: number | string | boolean) => {
        const newShadows = [...shadows];
        newShadows[index] = { ...newShadows[index], [field]: value };
        setShadows(newShadows);
    };

    const applyPreset = (preset: typeof SHADOW_PRESETS[number]) => {
        setShadows(preset.shadows.map(s => ({
            ...createDefaultShadow(),
            ...s,
            inset: (s as { inset?: boolean }).inset || false,
        })));
        setActiveIndex(0);
    };

    const copyCSS = async () => {
        await navigator.clipboard.writeText(result.cssProperty);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeShadow = shadows[activeIndex];

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>CSS-skyggegenerator</CardTitle>
                <CardDescription>
                    Lag CSS-skygger med flere lag og forhåndsvisning
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Preview */}
                <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg">
                    <div
                        className="w-48 h-32 rounded-lg bg-background border"
                        style={{ boxShadow: result.css }}
                    />
                </div>

                {/* Shadow Layers */}
                <div className="space-y-2">
                    <Label>Skyggelag</Label>
                    <div className="flex flex-wrap gap-2">
                        {shadows.map((shadow, i) => (
                            <button
                                key={shadow.id}
                                onClick={() => setActiveIndex(i)}
                                className={`px-3 py-1.5 text-sm border rounded-md transition-colors flex items-center gap-2 ${activeIndex === i ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                                    }`}
                            >
                                Skygge {i + 1}
                                {shadow.inset && <span className="text-xs text-muted-foreground">(innvendig)</span>}
                                {shadows.length > 1 && (
                                    <span
                                        className="hover:text-destructive"
                                        onClick={(e) => { e.stopPropagation(); removeShadow(i); }}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </span>
                                )}
                            </button>
                        ))}
                        <Button variant="outline" size="sm" onClick={addShadow}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Active Shadow Controls */}
                {activeShadow && (
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Label>Forskyvning X: {activeShadow.offsetX}px</Label>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={activeShadow.offsetX}
                                onChange={(e) => updateShadow(activeIndex, 'offsetX', parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Forskyvning Y: {activeShadow.offsetY}px</Label>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={activeShadow.offsetY}
                                onChange={(e) => updateShadow(activeIndex, 'offsetY', parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Uskarphet: {activeShadow.blur}px</Label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={activeShadow.blur}
                                onChange={(e) => updateShadow(activeIndex, 'blur', parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Utbredelse: {activeShadow.spread}px</Label>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={activeShadow.spread}
                                onChange={(e) => updateShadow(activeIndex, 'spread', parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Farge</Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={activeShadow.color}
                                    onChange={(e) => updateShadow(activeIndex, 'color', e.target.value)}
                                    className="w-10 h-10 rounded border cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={activeShadow.color}
                                    onChange={(e) => updateShadow(activeIndex, 'color', e.target.value)}
                                    className="flex-1 px-2 py-1 border rounded-md text-sm font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Gjennomsiktighet: {Math.round(activeShadow.opacity * 100)}%</Label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={activeShadow.opacity * 100}
                                onChange={(e) => updateShadow(activeIndex, 'opacity', parseInt(e.target.value) / 100)}
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={activeShadow.inset}
                                    onChange={(e) => updateShadow(activeIndex, 'inset', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm">Innvendig skygge</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Presets */}
                <div className="space-y-2">
                    <Label>Forhåndsvalg</Label>
                    <div className="flex flex-wrap gap-2">
                        {SHADOW_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CSS Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>CSS-kode</Label>
                        <Button variant="ghost" size="sm" onClick={copyCSS}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Kopiert!' : 'Kopier'}</span>
                        </Button>
                    </div>
                    <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto font-mono">
                        <code>{result.cssProperty}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default BoxShadowGenerator;
