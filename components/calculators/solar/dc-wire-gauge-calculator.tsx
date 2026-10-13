'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateDCWireGauge, type DCWireGaugeResult } from '@/lib/calculations/solar/dc-wire-gauge';
import { formatNumber } from '@/lib/utils/formatting';

const n2 = (v: number) => formatNumber(v, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function DCWireGaugeCalculator() {
    const [amps, setAmps] = React.useState('20');
    const [length, setLength] = React.useState('8');
    const [voltage, setVoltage] = React.useState('12');
    const [maxDrop, setMaxDrop] = React.useState('3');
    const [result, setResult] = React.useState<DCWireGaugeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateDCWireGauge({ amps: parseFloat(amps), lengthM: parseFloat(length), voltage: parseFloat(voltage), maxDropPercent: parseFloat(maxDrop) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [amps, length, voltage, maxDrop]);

    const reset = () => { setAmps('20'); setLength('8'); setVoltage('12'); setMaxDrop('3'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Kabeltverrsnitt (DC)"
            description="Finn riktig kabeltverrsnitt i mm² for likestrøm"
            formula="A = 2 × L × ρ × I ÷ spenningsfall"
            formulaExplanation="L er kabellengde én vei i meter, ρ er resistiviteten til kobber (0,0175 Ω·mm²/m) og I er strømmen i ampere. Strømmen går ut og tilbake, derfor ganges lengden med 2. Ved lav spenning, som 12 V, blir spenningsfallet raskt stort, så bruk gjerne tykkere kabel enn minimum."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anbefalt kabel" value={`${formatNumber(result.recommendedMm2, { maximumFractionDigits: 1 })} mm²`} highlight copyable />
                    {result.exceedsTable && (
                        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                            Ingen standard kabelstørrelse i tabellen oppfyller kravet. Bruk flere parallelle kabler, kortere avstand eller høyere spenning, og få det vurdert av en elektriker.
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Spenningsfall" value={`${n2(result.voltageDrop)} V (${n2(result.voltageDropPercent)} %)`} />
                        <ResultDisplay label="Spenning ved last" value={`${n2(result.voltageAtLoad)} V`} />
                        <ResultDisplay label="Effekttap" value={`${n2(result.powerLossWatts)} W`} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Strømgrensene er veiledende for kobberkabel i rør. Sikring og kabel må tilpasses hverandre og følge NEK 400 og produsentens anvisning. Elektrisk arbeid på faste anlegg skal utføres av autorisert elektriker.
                    </p>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="amps" label="Strøm" value={amps} onChange={(v) => setAmps(String(v))} min={0.5} step={1} unit="A" />
                    <NumberInput id="voltage" label="Systemspenning" value={voltage} onChange={(v) => setVoltage(String(v))} min={6} step={6} unit="V" />
                </div>
                <NumberInput id="length" label="Kabellengde (én vei)" value={length} onChange={(v) => setLength(String(v))} min={0.5} step={1} unit="m" />
                <NumberInput id="max-drop" label="Største spenningsfall" value={maxDrop} onChange={(v) => setMaxDrop(String(v))} min={0.5} max={10} step={0.5} unit="%" />
            </div>
        </CalculatorBase>
    );
}

export default DCWireGaugeCalculator;
