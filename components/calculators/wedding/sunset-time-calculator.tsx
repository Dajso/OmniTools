'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSunsetTime, type SunsetResult } from '@/lib/calculations/wedding/sunset-time';

const PLACES: Array<{ value: string; label: string; lat: number; lon: number }> = [
    { value: 'kristiansand', label: 'Kristiansand', lat: 58.15, lon: 8.0 },
    { value: 'oslo', label: 'Oslo', lat: 59.91, lon: 10.75 },
    { value: 'bergen', label: 'Bergen', lat: 60.39, lon: 5.32 },
    { value: 'stavanger', label: 'Stavanger', lat: 58.97, lon: 5.73 },
    { value: 'trondheim', label: 'Trondheim', lat: 63.43, lon: 10.4 },
    { value: 'tromso', label: 'Tromsø', lat: 69.65, lon: 18.96 },
    { value: 'custom', label: 'Annet sted (egne koordinater)', lat: 0, lon: 0 },
];
const PLACE_OPTIONS = PLACES.map(p => ({ value: p.value, label: p.label }));
const today = () => new Date().toISOString().split('T')[0];

export function SunsetTimeCalculator() {
    const [date, setDate] = React.useState(today());
    const [place, setPlace] = React.useState('kristiansand');
    const [latitude, setLatitude] = React.useState('58.15');
    const [longitude, setLongitude] = React.useState('8');
    const [result, setResult] = React.useState<SunsetResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const lat = parseFloat(latitude), lon = parseFloat(longitude);
            if (isNaN(lat) || isNaN(lon)) { setResult(null); return; }
            setResult(calculateSunsetTime({ date, latitude: lat, longitude: lon }));
        } catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [date, latitude, longitude]);
    const changePlace = (v: string) => {
        setPlace(v);
        const p = PLACES.find(x => x.value === v);
        if (p && v !== 'custom') { setLatitude(String(p.lat)); setLongitude(String(p.lon)); }
    };
    const reset = () => { setDate(today()); setPlace('kristiansand'); setLatitude('58.15'); setLongitude('8'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Solnedgang på bryllupsdagen" description="Planlegg vielsen og bildene rundt den gyldne timen"
            formula="Solhøyde ut fra breddegrad, lengdegrad og dato" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                result.polar ? (
                    <div className="bg-blue-50 rounded-lg p-4 text-center text-blue-800">{result.note}</div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-amber-700 mb-1">🌅 Solnedgang</div>
                            <div className="text-3xl font-bold text-amber-900">kl. {result.sunsetTime}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <ResultDisplay label="Gylden time starter" value={`kl. ${result.goldenHourStart}`} />
                            <ResultDisplay label="Gylden time slutter" value={`kl. ${result.goldenHourEnd}`} />
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">{result.note}</div>
                    </div>
                )
            )}>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="sunset-date">Dato</label>
                <input id="sunset-date" type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <SelectInput id="place" label="Sted" value={place} onChange={changePlace} options={PLACE_OPTIONS} />
                {place === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput id="latitude" label="Breddegrad (°N)" value={latitude} onChange={v => setLatitude(String(v))} min={-90} max={90} step={0.1} />
                        <NumberInput id="longitude" label="Lengdegrad (°Ø)" value={longitude} onChange={v => setLongitude(String(v))} min={-180} max={180} step={0.1} />
                    </div>
                )}
            </div>
        </CalculatorBase>
    );
}
export default SunsetTimeCalculator;
