'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    simulateColor,
    COLOR_BLINDNESS_TYPES,
    type ColorBlindnessType,
} from '@/lib/calculations/productivity/color-blindness-simulator';

export function ColorBlindnessSimulator() {
    const [hexColor, setHexColor] = React.useState('#3b82f6');
    const [selectedType, setSelectedType] = React.useState<ColorBlindnessType>('deuteranopia');

    const allResults = React.useMemo(() => {
        return COLOR_BLINDNESS_TYPES.map(t => simulateColor({ hexColor, type: t.type }));
    }, [hexColor]);

    const selectedResult = simulateColor({ hexColor, type: selectedType });

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Color Blindness Simulator</CardTitle>
                <CardDescription>
                    See how colors appear to people with different types of color vision deficiency
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Color Input */}
                <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                        <Label>Select a Color</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={hexColor}
                                onChange={(e) => setHexColor(e.target.value)}
                                className="w-14 h-10 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={hexColor}
                                onChange={(e) => setHexColor(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="#3b82f6"
                            />
                        </div>
                    </div>
                </div>

                {/* Original vs Selected Comparison */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Original Color</Label>
                        <div
                            className="h-24 rounded-lg border shadow-inner flex items-center justify-center"
                            style={{ backgroundColor: hexColor }}
                        >
                            <span className="px-2 py-1 bg-white/90 rounded text-sm font-mono">
                                {hexColor}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{COLOR_BLINDNESS_TYPES.find(t => t.type === selectedType)?.name}</Label>
                        <div
                            className="h-24 rounded-lg border shadow-inner flex items-center justify-center"
                            style={{ backgroundColor: selectedResult.simulated.hex }}
                        >
                            <span className="px-2 py-1 bg-white/90 rounded text-sm font-mono">
                                {selectedResult.simulated.hex}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Type Selection */}
                <div className="space-y-2">
                    <Label>Color Vision Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {COLOR_BLINDNESS_TYPES.map((t) => (
                            <button
                                key={t.type}
                                onClick={() => setSelectedType(t.type)}
                                className={`p-2 border rounded-md text-left transition-colors ${selectedType === t.type
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="font-medium text-sm">{t.name}</div>
                                <div className="text-xs text-muted-foreground">{t.prevalence}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* All Types Preview */}
                <div className="space-y-2">
                    <Label>All Vision Types Preview</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {allResults.map((result) => (
                            <button
                                key={result.type}
                                onClick={() => setSelectedType(result.type)}
                                className={`p-2 border rounded-md space-y-1 transition-colors ${selectedType === result.type ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                <div
                                    className="h-8 rounded"
                                    style={{ backgroundColor: result.simulated.hex }}
                                />
                                <div className="text-xs truncate">
                                    {result.type === 'normal' ? 'Normal' : result.type.slice(0, 8)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                    <p><strong>Note:</strong> This simulation provides an approximation of how colors may appear to individuals with color vision deficiency.
                        Actual perception varies by individual. Use tools like the <strong>Contrast Checker</strong> to ensure your designs are accessible.</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default ColorBlindnessSimulator;
