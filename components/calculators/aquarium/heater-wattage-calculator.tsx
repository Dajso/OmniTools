'use client';

import * as React from 'react';
import { formatNumber } from '@/lib/utils/formatting';
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
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [volume, roomTemp, targetTemp]);

    const reset = () => { setVolume('100'); setRoomTemp('20'); setTargetTemp('26'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Varmeelement til akvarium" description="Regn ut riktig effekt på varmeelementet til akvariet"
            formula="Effekt = volum × ΔT × størrelsesfaktor" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anbefalt effekt" value={`${formatNumber(result.wattage)}W`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Temperaturøkning" value={`${formatNumber(result.deltaTemp)}°C`} />
                        <ResultDisplay label="Watt per liter" value={`${formatNumber(result.wattsPerLiter)}`} />
                    </div>
                    <ResultDisplay label="Anbefaling" value={result.recommendation} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Akvariumvolum (liter)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="room-temp" label="Romtemperatur (°C)" value={roomTemp} onChange={(v) => setRoomTemp(String(v))} min={0} max={40} step={1} />
                    <NumberInput id="target-temp" label="Ønsket vanntemperatur (°C)" value={targetTemp} onChange={(v) => setTargetTemp(String(v))} min={15} max={35} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default HeaterWattageCalculator;
