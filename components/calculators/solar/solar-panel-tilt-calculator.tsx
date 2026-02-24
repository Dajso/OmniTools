'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSolarPanelTilt, type Season, type SolarPanelTiltResult } from '@/lib/calculations/solar/solar-panel-tilt';

const SEASON_OPTIONS = [
    { value: 'annual', label: 'Year-Round (Annual)' },
    { value: 'summer', label: 'Summer' },
    { value: 'winter', label: 'Winter' },
    { value: 'spring-fall', label: 'Spring / Fall' },
];

export function SolarPanelTiltCalculator() {
    const [latitude, setLatitude] = React.useState('40');
    const [season, setSeason] = React.useState<string>('annual');
    const [result, setResult] = React.useState<SolarPanelTiltResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSolarPanelTilt({ latitude: parseFloat(latitude), season: season as Season });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [latitude, season]);

    const reset = () => { setLatitude('40'); setSeason('annual'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Solar Panel Tilt Angle Calculator" description="Optimize your solar panel tilt angle"
            formula="Tilt varies by latitude and season" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Optimal Tilt Angle" value={`${result.tiltAngle}°`} copyable />
                    <ResultDisplay label="Panel Facing" value={result.azimuth} />
                    <ResultDisplay label="Explanation" value={result.explanation} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="latitude" label="Latitude (°)" value={latitude} onChange={(v) => setLatitude(String(v))} min={-90} max={90} step={1} />
                <SelectInput id="season" label="Season" value={season} onChange={setSeason} options={SEASON_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default SolarPanelTiltCalculator;
