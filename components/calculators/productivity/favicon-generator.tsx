'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateFavicon,
    DEFAULT_FAVICON_INPUTS,
    FAVICON_SIZES,
    FONT_FAMILIES,
    FAVICON_COLOR_PRESETS,
    type FaviconInputs,
} from '@/lib/calculations/productivity/favicon-generator';
import { Download } from 'lucide-react';

export function FaviconGenerator() {
    const [inputs, setInputs] = React.useState<FaviconInputs>(DEFAULT_FAVICON_INPUTS);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [preview, setPreview] = React.useState<string>('');

    const updateInput = <K extends keyof FaviconInputs>(key: K, value: FaviconInputs[K]) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const applyColorPreset = (preset: typeof FAVICON_COLOR_PRESETS[number]) => {
        setInputs(prev => ({ ...prev, backgroundColor: preset.bg, textColor: preset.text }));
    };

    // Generate preview
    React.useEffect(() => {
        if (canvasRef.current) {
            const dataUrl = generateFavicon({ ...inputs, size: 128 }, canvasRef.current);
            setPreview(dataUrl);
        }
    }, [inputs]);

    const downloadFavicon = (size: number) => {
        const canvas = document.createElement('canvas');
        const dataUrl = generateFavicon({ ...inputs, size }, canvas);

        const link = document.createElement('a');
        link.download = `favicon-${size}x${size}.png`;
        link.href = dataUrl;
        link.click();
    };

    const downloadAll = () => {
        FAVICON_SIZES.forEach((size, index) => {
            setTimeout(() => downloadFavicon(size), index * 200);
        });
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Favicon-generator</CardTitle>
                <CardDescription>
                    Lag favicon fra tekst eller emoji med egen stil
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Preview */}
                <div className="flex items-center justify-center gap-4 p-6 bg-muted/30 rounded-lg">
                    <canvas ref={canvasRef} width={128} height={128} className="hidden" />
                    {preview && (
                        <>
                            <div className="text-center">
                                <img src={preview} alt="Forhåndsvisning av favicon" width={128} height={128} className="rounded-lg shadow" />
                                <p className="text-sm text-muted-foreground mt-2">128x128</p>
                            </div>
                            <div className="text-center">
                                <img src={preview} alt="Forhåndsvisning av favicon" width={64} height={64} className="rounded shadow" />
                                <p className="text-sm text-muted-foreground mt-2">64x64</p>
                            </div>
                            <div className="text-center">
                                <img src={preview} alt="Forhåndsvisning av favicon" width={32} height={32} className="rounded shadow" />
                                <p className="text-sm text-muted-foreground mt-2">32x32</p>
                            </div>
                            <div className="text-center">
                                <img src={preview} alt="Forhåndsvisning av favicon" width={16} height={16} className="shadow" />
                                <p className="text-sm text-muted-foreground mt-2">16x16</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                    <Label>Tekst eller emoji</Label>
                    <input
                        type="text"
                        value={inputs.text}
                        onChange={(e) => updateInput('text', e.target.value)}
                        placeholder="🚀 eller A"
                        maxLength={3}
                        className="w-full px-3 py-2 border rounded-md text-2xl text-center focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex flex-wrap gap-1">
                        {['🚀', '⚡', '💡', '🔥', '💎', '🎯', '✨', '🌟', 'A', 'X', '&'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => updateInput('text', emoji)}
                                className="w-8 h-8 text-lg border rounded hover:bg-muted"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Bakgrunnsfarge</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={inputs.backgroundColor}
                                onChange={(e) => updateInput('backgroundColor', e.target.value)}
                                className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={inputs.backgroundColor}
                                onChange={(e) => updateInput('backgroundColor', e.target.value)}
                                className="flex-1 px-2 py-1 border rounded-md text-sm font-mono"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Tekstfarge</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={inputs.textColor}
                                onChange={(e) => updateInput('textColor', e.target.value)}
                                className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={inputs.textColor}
                                onChange={(e) => updateInput('textColor', e.target.value)}
                                className="flex-1 px-2 py-1 border rounded-md text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Color Presets */}
                <div className="space-y-2">
                    <Label>Fargeforslag</Label>
                    <div className="flex flex-wrap gap-2">
                        {FAVICON_COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyColorPreset(preset)}
                                className="w-8 h-8 rounded border hover:ring-2 ring-primary transition-all"
                                style={{ backgroundColor: preset.bg }}
                                title={preset.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Font Size & Border Radius */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Skriftstørrelse: {inputs.fontSize}%</Label>
                        <input
                            type="range"
                            min="30"
                            max="90"
                            value={inputs.fontSize}
                            onChange={(e) => updateInput('fontSize', parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hjørneradius: {inputs.borderRadius}%</Label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={inputs.borderRadius}
                            onChange={(e) => updateInput('borderRadius', parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                    <Label>Skrifttype</Label>
                    <select
                        value={inputs.fontFamily}
                        onChange={(e) => updateInput('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        {FONT_FAMILIES.map((font) => (
                            <option key={font.name} value={font.value}>{font.name}</option>
                        ))}
                    </select>
                </div>

                {/* Download Buttons */}
                <div className="space-y-2">
                    <Label>Last ned</Label>
                    <div className="flex flex-wrap gap-2">
                        {[16, 32, 64, 128, 180, 512].map((size) => (
                            <Button
                                key={size}
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFavicon(size)}
                            >
                                {size}×{size}
                            </Button>
                        ))}
                        <Button onClick={downloadAll}>
                            <Download className="w-4 h-4 mr-1" /> Last ned alle
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default FaviconGenerator;
