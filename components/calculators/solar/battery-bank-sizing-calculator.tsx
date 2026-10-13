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
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [dailyWh, autonomy, batteryType, systemVoltage, batteryAh]);

    const reset = () => { setDailyWh('3000'); setAutonomy('2'); setBatteryType('lithium'); setSystemVoltage('24'); setBatteryAh('100'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Batteribank" description="Regn ut hvor mange batterier du trenger til hytte, båt eller off-grid"
            formula="Ah = (Wh per døgn × døgn) ÷ (spenning × utladningsdybde)"
            formulaExplanation="Utladningsdybde er hvor stor del av batteriet du kan bruke uten å ta skade. Litium tåler ca. 80 %, blybatterier ca. 50 %. Kapasiteten faller i kulde, og litiumbatterier må normalt ikke lades under 0 °C, så på uoppvarmede hytter bør batteriene stå frostfritt." onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Antall batterier" value={`${result.batteryCount} stk`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Samlet kapasitet" value={`${result.totalAh} Ah (${result.totalKWh} kWh)`} />
                        <ResultDisplay label="Maks utladningsdybde" value={`${result.dodPercent} %`} />
                        <ResultDisplay label="I serie" value={`${result.seriesCount} stk`} />
                        <ResultDisplay label="Parallelle rekker" value={`${result.parallelCount} stk`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="daily-wh" label="Forbruk per døgn" value={dailyWh} onChange={(v) => setDailyWh(String(v))} min={100} step={100} unit="Wh" />
                <NumberInput id="autonomy" label="Døgn uten lading" value={autonomy} onChange={(v) => setAutonomy(String(v))} min={1} max={7} step={1} unit="døgn" />
                <SelectInput id="battery-type" label="Batteritype" value={batteryType} onChange={setBatteryType} options={BATTERY_OPTIONS} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="system-voltage" label="Systemspenning" value={systemVoltage} onChange={setSystemVoltage} options={VOLTAGE_OPTIONS} />
                    <NumberInput id="battery-ah" label="Kapasitet per batteri" value={batteryAh} onChange={(v) => setBatteryAh(String(v))} min={10} step={10} unit="Ah" />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default BatteryBankSizingCalculator;
