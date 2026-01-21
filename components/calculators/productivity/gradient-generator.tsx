'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateGradient,
    GRADIENT_PRESETS,
    DIRECTION_PRESETS,
    type ColorStop,
    type GradientType,
} from '@/lib/calculations/productivity/gradient-generator';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

export function GradientGenerator() {
    const [gradientType, setGradientType] = React.useState<GradientType>('linear');
    const [angle, setAngle] = React.useState(135);
    const [colorStops, setColorStops] = React.useState<ColorStop[]>([
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 },
    ]);
    const [radialShape, setRadialShape] = React.useState<'circle' | 'ellipse'>('circle');
    const [radialPosition, setRadialPosition] = React.useState({ x: 50, y: 50 });
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() => {
        if (gradientType === 'linear') {
            return generateGradient({ type: 'linear', angle, colorStops });
        } else {
            return generateGradient({
                type: 'radial',
                shape: radialShape,
                position: radialPosition,
                colorStops
            });
        }
    }, [gradientType, angle, colorStops, radialShape, radialPosition]);

    const addColorStop = () => {
        const newPosition = colorStops.length > 0
            ? Math.min(100, colorStops[colorStops.length - 1].position + 25)
            : 50;
        setColorStops([...colorStops, { color: '#ffffff', position: newPosition }]);
    };

    const removeColorStop = (index: number) => {
        if (colorStops.length > 2) {
            setColorStops(colorStops.filter((_, i) => i !== index));
        }
    };

    const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
        const newStops = [...colorStops];
        newStops[index] = { ...newStops[index], [field]: value };
        setColorStops(newStops);
    };

    const applyPreset = (preset: typeof GRADIENT_PRESETS[number]) => {
        setAngle(preset.angle);
        setColorStops(preset.colors.map((color, i) => ({
            color,
            position: (i / (preset.colors.length - 1)) * 100,
        })));
    };

    const copyCSS = async () => {
        await navigator.clipboard.writeText(`background: ${result.css};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>CSS Gradient Generator</CardTitle>
                <CardDescription>
                    Create beautiful CSS gradients with live preview
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Preview */}
                <div
                    className="h-48 rounded-lg border shadow-inner"
                    style={{ background: result.preview }}
                />

                {/* Gradient Type */}
                <div className="flex gap-2">
                    <Button
                        variant={gradientType === 'linear' ? 'default' : 'outline'}
                        onClick={() => setGradientType('linear')}
                    >
                        Linear
                    </Button>
                    <Button
                        variant={gradientType === 'radial' ? 'default' : 'outline'}
                        onClick={() => setGradientType('radial')}
                    >
                        Radial
                    </Button>
                </div>

                {/* Linear Controls */}
                {gradientType === 'linear' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Angle: {angle}°</Label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {DIRECTION_PRESETS.map((dir) => (
                                <button
                                    key={dir.angle}
                                    onClick={() => setAngle(dir.angle)}
                                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${angle === dir.angle ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                                        }`}
                                >
                                    {dir.icon} {dir.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Radial Controls */}
                {gradientType === 'radial' && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={radialShape === 'circle' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setRadialShape('circle')}
                            >
                                Circle
                            </Button>
                            <Button
                                variant={radialShape === 'ellipse' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setRadialShape('ellipse')}
                            >
                                Ellipse
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Position X: {radialPosition.x}%</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={radialPosition.x}
                                    onChange={(e) => setRadialPosition(p => ({ ...p, x: parseInt(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position Y: {radialPosition.y}%</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={radialPosition.y}
                                    onChange={(e) => setRadialPosition(p => ({ ...p, y: parseInt(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Color Stops */}
                <div className="space-y-3">
                    <Label>Color Stops</Label>
                    {colorStops.map((stop, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <input
                                type="color"
                                value={stop.color}
                                onChange={(e) => updateColorStop(i, 'color', e.target.value)}
                                className="w-10 h-10 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={stop.color}
                                onChange={(e) => updateColorStop(i, 'color', e.target.value)}
                                className="w-24 px-2 py-1 border rounded-md text-sm font-mono"
                            />
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Position:</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={stop.position}
                                    onChange={(e) => updateColorStop(i, 'position', parseInt(e.target.value))}
                                    className="flex-1"
                                />
                                <span className="text-sm w-10">{stop.position}%</span>
                            </div>
                            {colorStops.length > 2 && (
                                <Button variant="ghost" size="icon" onClick={() => removeColorStop(i)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addColorStop}>
                        <Plus className="w-4 h-4 mr-2" /> Add Color
                    </Button>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                    <Label>Presets</Label>
                    <div className="flex flex-wrap gap-2">
                        {GRADIENT_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="w-12 h-8 rounded border hover:ring-2 ring-primary transition-all"
                                style={{
                                    background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`
                                }}
                                title={preset.name}
                            />
                        ))}
                    </div>
                </div>

                {/* CSS Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>CSS Code</Label>
                        <Button variant="ghost" size="sm" onClick={copyCSS}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto font-mono">
                        <code>{`background: ${result.css};`}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default GradientGenerator;
