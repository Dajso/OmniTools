'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
    checkContrast,
    getContrastRating,
    COLOR_PRESETS,
    type ContrastResults
} from '@/lib/calculations/productivity/contrast-checker';
import { ArrowLeftRight, Check, X } from 'lucide-react';

function ComplianceBadge({ passes, level }: { passes: boolean; level: string }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${passes
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
            {passes ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {level}
        </span>
    );
}

export function ContrastChecker() {
    const [foreground, setForeground] = React.useState('#1e3a5f');
    const [background, setBackground] = React.useState('#FFFFFF');
    const [results, setResults] = React.useState<ContrastResults | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleCheck = React.useCallback(() => {
        try {
            setError(null);
            const result = checkContrast({ foreground, background });
            setResults(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Kontrollen mislyktes');
            setResults(null);
        }
    }, [foreground, background]);

    // Auto-check on color change
    React.useEffect(() => {
        handleCheck();
    }, [handleCheck]);

    const handleSwap = () => {
        setForeground(background);
        setBackground(foreground);
    };

    const applyPreset = (fg: string, bg: string) => {
        setForeground(fg);
        setBackground(bg);
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Kontrastsjekker (WCAG)</CardTitle>
                <CardDescription>
                    Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Color Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="foreground">Forgrunnsfarge</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={results?.foregroundHex || foreground}
                                onChange={(e) => setForeground(e.target.value)}
                                className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <input
                                id="foreground"
                                type="text"
                                value={foreground}
                                onChange={(e) => setForeground(e.target.value)}
                                placeholder="#000000"
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="background">Bakgrunnsfarge</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={results?.backgroundHex || background}
                                onChange={(e) => setBackground(e.target.value)}
                                className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <input
                                id="background"
                                type="text"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                                placeholder="#FFFFFF"
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                    <Button variant="outline" size="sm" onClick={handleSwap}>
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Bytt farger
                    </Button>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                    <Label>Hurtigvalg</Label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset.fg, preset.bg)}
                                className="px-3 py-1.5 text-xs rounded-md border hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                <span
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: preset.fg }}
                                />
                                <span
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: preset.bg }}
                                />
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {results && (
                    <div className="space-y-6">
                        {/* Preview */}
                        <div
                            className="p-6 rounded-lg border"
                            style={{ backgroundColor: results.backgroundHex }}
                        >
                            <p
                                className="text-sm mb-2"
                                style={{ color: results.foregroundHex }}
                            >
                                Liten tekst (14 px) – slik ser vanlig brødtekst ut
                            </p>
                            <p
                                className="text-xl font-bold"
                                style={{ color: results.foregroundHex }}
                            >
                                Stor tekst (18 px+) – slik ser overskrifter ut
                            </p>
                        </div>

                        {/* Ratio Display */}
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-4xl font-bold mb-2">{results.ratioFormatted}</div>
                            <div className={`text-lg font-medium ${results.ratio >= 7 ? 'text-green-600' :
                                    results.ratio >= 4.5 ? 'text-yellow-600' :
                                        results.ratio >= 3 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                {getContrastRating(results.ratio)}
                            </div>
                        </div>

                        {/* WCAG Compliance Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Normal Text */}
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-3">Normal tekst (&lt;18 px)</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">AA (4.5:1)</span>
                                        <ComplianceBadge
                                            passes={results.normalText.AA.passes}
                                            level={results.normalText.AA.passes ? 'Bestått' : 'Ikke bestått'}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">AAA (7:1)</span>
                                        <ComplianceBadge
                                            passes={results.normalText.AAA.passes}
                                            level={results.normalText.AAA.passes ? 'Bestått' : 'Ikke bestått'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Large Text */}
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-3">Stor tekst (≥18 px, eller 14 px fet)</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">AA (3:1)</span>
                                        <ComplianceBadge
                                            passes={results.largeText.AA.passes}
                                            level={results.largeText.AA.passes ? 'Bestått' : 'Ikke bestått'}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">AAA (4.5:1)</span>
                                        <ComplianceBadge
                                            passes={results.largeText.AAA.passes}
                                            level={results.largeText.AAA.passes ? 'Bestått' : 'Ikke bestått'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UI Components */}
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-3">Grensesnitt og grafikk</h4>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">AA (3:1)</span>
                                <ComplianceBadge
                                    passes={results.uiComponents.AA.passes}
                                    level={results.uiComponents.AA.passes ? 'Bestått' : 'Ikke bestått'}
                                />
                            </div>
                        </div>

                        {/* Color Values */}
                        <div className="grid grid-cols-2 gap-4">
                            <ResultDisplay
                                label="Forgrunn HEX"
                                value={results.foregroundHex}
                                copyable
                            />
                            <ResultDisplay
                                label="Bakgrunn HEX"
                                value={results.backgroundHex}
                                copyable
                            />
                            <ResultDisplay
                                label="Forgrunn RGB"
                                value={`rgb(${results.foregroundRgb.r}, ${results.foregroundRgb.g}, ${results.foregroundRgb.b})`}
                                copyable
                            />
                            <ResultDisplay
                                label="Bakgrunn RGB"
                                value={`rgb(${results.backgroundRgb.r}, ${results.backgroundRgb.g}, ${results.backgroundRgb.b})`}
                                copyable
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ContrastChecker;
