'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateHeaterWattage, type HeaterWattageResult } from '@/lib/calculations/aquarium/heater-wattage';

export function HeaterWattageCalculator() {
    const [volume, setVolume] = React.useState('100');
    const [roomTemp, setRoomTemp] = React.useState('20');
    const [targetTemp, setTargetTemp] = React.useState('26');
    const [result, setResult] = React.useState<HeaterWattageResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateHeaterWattage({ volumeLiters: parseFloat(volume), roomTempC: parseFloat(roomTemp), targetTempC: parseFloat(targetTemp) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [volume, roomTemp, targetTemp]);

    const reset = () => { setVolume('100'); setRoomTemp('20'); setTargetTemp('26'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Heater Wattage Calculator" description="Calculate the correct heater size for your aquarium"
            formula="Wattage = Volume × ΔT × Size Factor" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Recommended Wattage" value={`${result.wattage}W`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Temperature Rise" value={`${result.deltaTemp}°C`} />
                        <ResultDisplay label="Watts/Liter" value={`${result.wattsPerLiter}`} />
                    </div>
                    <ResultDisplay label="Recommendation" value={result.recommendation} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Tank Volume (Liters)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="room-temp" label="Room Temperature (°C)" value={roomTemp} onChange={(v) => setRoomTemp(String(v))} min={0} max={40} step={1} />
                    <NumberInput id="target-temp" label="Target Temperature (°C)" value={targetTemp} onChange={(v) => setTargetTemp(String(v))} min={15} max={35} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default HeaterWattageCalculator;
