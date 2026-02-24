'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateBatteryBank, BATTERY_TYPES, type BatteryType, type BatteryBankResult } from '@/lib/calculations/solar/battery-bank-sizing';

const BATTERY_OPTIONS = Object.entries(BATTERY_TYPES).map(([value, data]) => ({ value, label: data.name }));
const VOLTAGE_OPTIONS = [
    { value: '12', label: '12V' }, { value: '24', label: '24V' }, { value: '48', label: '48V' },
];

export function BatteryBankSizingCalculator() {
    const [dailyWh, setDailyWh] = React.useState('3000');
    const [autonomy, setAutonomy] = React.useState('2');
    const [batteryType, setBatteryType] = React.useState<string>('lithium');
    const [systemVoltage, setSystemVoltage] = React.useState('24');
    const [batteryAh, setBatteryAh] = React.useState('100');
    const [result, setResult] = React.useState<BatteryBankResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateBatteryBank({
                dailyWh: parseFloat(dailyWh), autonomyDays: parseInt(autonomy),
                batteryType: batteryType as BatteryType, systemVoltage: parseFloat(systemVoltage), batteryAh: parseFloat(batteryAh),
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [dailyWh, autonomy, batteryType, systemVoltage, batteryAh]);

    const reset = () => { setDailyWh('3000'); setAutonomy('2'); setBatteryType('lithium'); setSystemVoltage('24'); setBatteryAh('100'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Battery Bank Sizing Calculator" description="Size your off-grid battery bank"
            formula="Ah = (Daily Wh × Days) / (Voltage × DOD)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Batteries Needed" value={`${result.batteryCount} batteries`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total Capacity" value={`${result.totalAh} Ah (${result.totalKWh} kWh)`} />
                        <ResultDisplay label="Max DOD" value={`${result.dodPercent}%`} />
                        <ResultDisplay label="Series" value={`${result.seriesCount} in series`} />
                        <ResultDisplay label="Parallel" value={`${result.parallelCount} strings`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="daily-wh" label="Daily Consumption (Wh)" value={dailyWh} onChange={(v) => setDailyWh(String(v))} min={100} step={100} />
                <NumberInput id="autonomy" label="Days of Autonomy" value={autonomy} onChange={(v) => setAutonomy(String(v))} min={1} max={7} step={1} />
                <SelectInput id="battery-type" label="Battery Type" value={batteryType} onChange={setBatteryType} options={BATTERY_OPTIONS} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="system-voltage" label="System Voltage" value={systemVoltage} onChange={setSystemVoltage} options={VOLTAGE_OPTIONS} />
                    <NumberInput id="battery-ah" label="Battery Capacity (Ah)" value={batteryAh} onChange={(v) => setBatteryAh(String(v))} min={10} step={10} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default BatteryBankSizingCalculator;
