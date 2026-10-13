'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
    convertPxRem,
    generateConversionTable,
    COMMON_BASE_SIZES,
    type PxRemResults
} from '@/lib/calculations/productivity/px-rem-converter';
import { ArrowLeftRight } from 'lucide-react';

export function PxRemConverter() {
    const [value, setValue] = React.useState<string>('16');
    const [baseFontSize, setBaseFontSize] = React.useState<number>(16);
    const [mode, setMode] = React.useState<'px-to-rem' | 'rem-to-px'>('px-to-rem');
    const [results, setResults] = React.useState<PxRemResults | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [showTable, setShowTable] = React.useState(false);

    const handleConvert = React.useCallback(() => {
        try {
            setError(null);
            const numValue = parseFloat(value) || 0;
            const result = convertPxRem({ value: numValue, baseFontSize, mode });
            setResults(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Omregningen mislyktes');
            setResults(null);
        }
    }, [value, baseFontSize, mode]);

    React.useEffect(() => {
        handleConvert();
    }, [handleConvert]);

    const toggleMode = () => {
        setMode(prev => prev === 'px-to-rem' ? 'rem-to-px' : 'px-to-rem');
    };

    const table = React.useMemo(() => generateConversionTable(baseFontSize), [baseFontSize]);

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Px til rem</CardTitle>
                <CardDescription>
                    Regn om mellom piksler og rem i responsiv CSS
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mode Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm font-medium ${mode === 'px-to-rem' ? 'text-primary' : 'text-muted-foreground'}`}>
                        PX
                    </span>
                    <Button variant="outline" size="icon" onClick={toggleMode}>
                        <ArrowLeftRight className="w-4 h-4" />
                    </Button>
                    <span className={`text-sm font-medium ${mode === 'rem-to-px' ? 'text-primary' : 'text-muted-foreground'}`}>
                        REM
                    </span>
                </div>

                {/* Input */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="value">{mode === 'px-to-rem' ? 'Piksler (px)' : 'Rem'}</Label>
                        <input
                            id="value"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={mode === 'px-to-rem' ? '16' : '1'}
                            step="any"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="base">Basisskriftstørrelse (px)</Label>
                        <input
                            id="base"
                            type="number"
                            value={baseFontSize}
                            onChange={(e) => setBaseFontSize(parseFloat(e.target.value) || 16)}
                            min={1}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Quick Base Size Selection */}
                <div className="space-y-2">
                    <Label>Hurtigvalg for basisstørrelse</Label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_BASE_SIZES.map((item) => (
                            <button
                                key={item.size}
                                onClick={() => setBaseFontSize(item.size)}
                                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${baseFontSize === item.size
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                {item.size}px
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* Results */}
                {results && (
                    <div className="grid grid-cols-3 gap-4">
                        <ResultDisplay label="Piksler" value={results.pxString} copyable />
                        <ResultDisplay label="REM" value={results.remString} copyable />
                        <ResultDisplay label="EM" value={results.emString} copyable />
                    </div>
                )}

                {/* Conversion Table Toggle */}
                <div className="border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowTable(!showTable)}
                        className="w-full"
                    >
                        {showTable ? 'Skjul' : 'Vis'} Omregningstabell
                    </Button>
                </div>

                {/* Conversion Table */}
                {showTable && (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left">Piksler</th>
                                    <th className="px-4 py-2 text-left">REM (basis: {baseFontSize}px)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((row) => (
                                    <tr key={row.px} className="border-t">
                                        <td className="px-4 py-2 font-mono">{row.px}px</td>
                                        <td className="px-4 py-2 font-mono">{row.rem}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PxRemConverter;
