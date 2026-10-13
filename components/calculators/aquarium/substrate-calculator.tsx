'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSubstrate, SUBSTRATE_TYPES, type SubstrateResult } from '@/lib/calculations/aquarium/substrate';
import { formatFixed, formatNumber } from '@/lib/utils/formatting';

const SUBSTRATE_OPTIONS = [
    ...Object.entries(SUBSTRATE_TYPES).map(([value, data]) => ({
        value, label: `${data.name} (${formatNumber(data.density)} kg/l)`,
    })),
];

export function SubstrateCalculator() {
    const [length, setLength] = React.useState('60');
    const [width, setWidth] = React.useState('30');
    const [depth, setDepth] = React.useState('5');
    const [substrateType, setSubstrateType] = React.useState('gravel');
    const [customDensity, setCustomDensity] = React.useState('1.5');
    const [result, setResult] = React.useState<SubstrateResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSubstrate({
                length: parseFloat(length), width: parseFloat(width), depth: parseFloat(depth),
                substrateType, customDensity: parseFloat(customDensity),
            });
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Beregningsfeil');
            setResult(null);
        }
    }, [length, width, depth, substrateType, customDensity]);

    const reset = () => {
        setLength('60'); setWidth('30'); setDepth('5');
        setSubstrateType('gravel'); setCustomDensity('1.5');
        setResult(null); setError(undefined);
    };

    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Bunnsubstrat"
            description="Regn ut hvor mye bunnsubstrat akvariet trenger"
            formula="Vekt = lengde × bredde × dybde × tetthet"
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Nødvendig vekt" value={`${formatFixed(result.weightKg, 2)} kg`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Volum (liter)" value={formatFixed(result.volumeLiters, 2)} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="length" label="Lengde på akvariet (cm)" value={length} onChange={(v) => setLength(String(v))} min={1} step={1} />
                    <NumberInput id="width" label="Bredde på akvariet (cm)" value={width} onChange={(v) => setWidth(String(v))} min={1} step={1} />
                </div>
                <NumberInput id="depth" label="Tykkelse på substratet (cm)" value={depth} onChange={(v) => setDepth(String(v))} min={0.5} step={0.5} />
                <SelectInput id="substrate-type" label="Type substrat" value={substrateType} onChange={setSubstrateType} options={SUBSTRATE_OPTIONS} />
                {substrateType === 'custom' && (
                    <NumberInput id="custom-density" label="Egen tetthet (kg/l)" value={customDensity} onChange={(v) => setCustomDensity(String(v))} min={0.1} step={0.1} />
                )}
            </div>
        </CalculatorBase>
    );
}

export default SubstrateCalculator;
