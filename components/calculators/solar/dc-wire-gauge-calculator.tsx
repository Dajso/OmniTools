'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateDCWireGauge, type DCWireGaugeResult } from '@/lib/calculations/solar/dc-wire-gauge';

export function DCWireGaugeCalculator() {
    const [amps, setAmps] = React.useState('20');
    const [length, setLength] = React.useState('25');
    const [voltage, setVoltage] = React.useState('12');
    const [maxDrop, setMaxDrop] = React.useState('3');
    const [result, setResult] = React.useState<DCWireGaugeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateDCWireGauge({ amps: parseFloat(amps), lengthFeet: parseFloat(length), voltage: parseFloat(voltage), maxDropPercent: parseFloat(maxDrop) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [amps, length, voltage, maxDrop]);

    const reset = () => { setAmps('20'); setLength('25'); setVoltage('12'); setMaxDrop('3'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="DC Wire Gauge Calculator" description="Find the right wire gauge for your DC circuit"
            formula="cmil = 2 × L × ρ × I / V_drop" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Recommended Wire" value={`AWG ${result.recommendedAWG}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Voltage Drop" value={`${result.voltageDrop}V (${result.voltageDropPercent}%)`} />
                        <ResultDisplay label="Voltage at Load" value={`${result.voltageAtLoad}V`} />
                        <ResultDisplay label="Power Loss" value={`${result.powerLossWatts}W`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="amps" label="Current (Amps)" value={amps} onChange={(v) => setAmps(String(v))} min={0.5} step={1} />
                    <NumberInput id="voltage" label="System Voltage" value={voltage} onChange={(v) => setVoltage(String(v))} min={6} step={6} />
                </div>
                <NumberInput id="length" label="One-Way Wire Length (ft)" value={length} onChange={(v) => setLength(String(v))} min={1} step={5} />
                <NumberInput id="max-drop" label="Max Voltage Drop (%)" value={maxDrop} onChange={(v) => setMaxDrop(String(v))} min={1} max={10} step={0.5} />
            </div>
        </CalculatorBase>
    );
}

export default DCWireGaugeCalculator;
