'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSunPeakHours, type SunPeakHoursResult } from '@/lib/calculations/solar/sun-peak-hours';
import { formatNumber } from '@/lib/utils/formatting';

const hours = (v: number) => `${formatNumber(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} t`;

export function SunPeakHoursCalculator() {
    const [latitude, setLatitude] = React.useState('59.9');
    const [panelWatts, setPanelWatts] = React.useState('400');
    const [result, setResult] = React.useState<SunPeakHoursResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSunPeakHours({ latitude: parseFloat(latitude), panelWatts: parseFloat(panelWatts) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [latitude, panelWatts]);

    const reset = () => { setLatitude('59.9'); setPanelWatts('400'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Fullasttimer for sol"
            description="Anslå solinnstråling og effektive soltimer for stedet ditt"
            formula="Energi = effekt × fullasttimer × 0,8 (systemtap)"
            formulaExplanation="Én fullasttime tilsvarer 1 kWh solinnstråling per m². Oslo ligger på ca. 59,9° N, Bergen på 60,4°, Trondheim på 63,4° og Tromsø på 69,6°. Tallene er grove gjennomsnitt for en optimalt vinklet flate."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Sone" value={result.zone} />
                    <div className="grid grid-cols-3 gap-4">
                        <ResultDisplay label="Gjennomsnitt per dag, året" value={hours(result.annualAvgHours)} copyable />
                        <ResultDisplay label="Sommer (juni)" value={hours(result.summerHours)} />
                        <ResultDisplay label="Vinter (desember)" value={hours(result.winterHours)} />
                    </div>
                    {result.dailyEnergyWh !== undefined && (
                        <div className="grid grid-cols-3 gap-4">
                            <ResultDisplay label="Energi per dag" value={`${formatNumber(result.dailyEnergyWh)} Wh`} />
                            <ResultDisplay label="Energi per måned" value={`${formatNumber(result.monthlyEnergyKWh ?? 0, { maximumFractionDigits: 1 })} kWh`} />
                            <ResultDisplay label="Energi per år" value={`${formatNumber(result.annualEnergyKWh ?? 0)} kWh`} highlight />
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Energien er gjennomsnitt over året og regnet med 20 % systemtap. I Norge kommer det aller meste av produksjonen mellom april og september.
                    </p>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="latitude" label="Breddegrad" value={latitude} onChange={(v) => setLatitude(String(v))} min={-90} max={90} step={0.1} unit="°" />
                <NumberInput id="panel-watts" label="Effekt på panelene (valgfritt, for energianslag)" value={panelWatts} onChange={(v) => setPanelWatts(String(v))} min={0} step={50} unit="W" />
            </div>
        </CalculatorBase>
    );
}

export default SunPeakHoursCalculator;
