'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import {
    calculateRainwaterCollection,
    ANNUAL_RAINFALL_PRESETS,
    type RainwaterCollectionResult,
} from '@/lib/calculations/solar/rainwater-collection';
import { formatNumber } from '@/lib/utils/formatting';

export function RainwaterCollectionCalculator() {
    const [roofArea, setRoofArea] = React.useState('100');
    const [rainfall, setRainfall] = React.useState('800');
    const [efficiency, setEfficiency] = React.useState('80');
    const [result, setResult] = React.useState<RainwaterCollectionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateRainwaterCollection({ roofAreaM2: parseFloat(roofArea), annualRainfallMm: parseFloat(rainfall), efficiencyPercent: parseFloat(efficiency) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [roofArea, rainfall, efficiency]);

    const reset = () => { setRoofArea('100'); setRainfall('800'); setEfficiency('80'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Regnvann"
            description="Regn ut hvor mye regnvann du kan samle fra taket"
            formula="Liter = takflate (m²) × nedbør (mm) × oppsamlingsgrad"
            formulaExplanation="1 mm nedbør på 1 m² gir 1 liter vann. Bruk grunnflaten under taket, ikke selve takflaten. Oppsamlingsgraden tar høyde for tap i takrenner, fordamping og overløp."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Samlet per år" value={`${formatNumber(result.annualLiters)} liter (${formatNumber(result.annualCubicMeters, { maximumFractionDigits: 2 })} m³)`} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Per måned (snitt)" value={`${formatNumber(result.monthlyLiters)} liter`} />
                        <ResultDisplay label="Dekker én person" value={`${formatNumber(result.daysForOnePerson)} døgn`} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="roof-area" label="Takflate (grunnflate)" value={roofArea} onChange={(v) => setRoofArea(String(v))} min={1} step={10} unit="m²" />
                <NumberInput id="rainfall" label="Årsnedbør" value={rainfall} onChange={(v) => setRainfall(String(v))} min={1} step={50} unit="mm" />
                <div className="flex flex-wrap gap-2">
                    {ANNUAL_RAINFALL_PRESETS.map((p) => (
                        <Button key={p.name} type="button" size="sm" variant={Number(rainfall) === p.mm ? 'default' : 'outline'} onClick={() => setRainfall(String(p.mm))}>
                            {p.name} (ca. {formatNumber(p.mm)} mm)
                        </Button>
                    ))}
                </div>
                <NumberInput id="efficiency" label="Oppsamlingsgrad" value={efficiency} onChange={(v) => setEfficiency(String(v))} min={50} max={95} step={5} unit="%" />
            </div>
        </CalculatorBase>
    );
}

export default RainwaterCollectionCalculator;
