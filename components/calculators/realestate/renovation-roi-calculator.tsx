'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateRenovationROI, type RenovationType, type RenovationROIResult, ROI_DATA } from '@/lib/calculations/realestate/renovation-roi';
import { formatCurrency } from '@/lib/utils/formatting';

const OPTIONS = Object.entries(ROI_DATA).map(([k, v]) => ({ value: k, label: v.label }));

export function RenovationROICalculator() {
    const [type, setType] = React.useState<RenovationType>('kitchen-minor');
    const [cost, setCost] = React.useState('250000');
    const [roi, setRoi] = React.useState(String(ROI_DATA['kitchen-minor'].avgROI));
    const [result, setResult] = React.useState<RenovationROIResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateRenovationROI({ type, cost: parseFloat(cost), roiPercent: parseFloat(roi) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [type, cost, roi]);
    const changeType = (v: string) => { setType(v as RenovationType); setRoi(String(ROI_DATA[v as RenovationType].avgROI)); };
    const reset = () => { setType('kitchen-minor'); setCost('250000'); setRoi(String(ROI_DATA['kitchen-minor'].avgROI)); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Verdiøkning ved oppussing" description="Anslå hvor mye oppussingen kan øke boligverdien"
            formula="Verdiøkning = kostnad × forventet verdiøkning i prosent"
            formulaExplanation="Prosentene er grove anslag basert på amerikanske undersøkelser, ikke norske markedsdata. Skriv inn din egen prosent hvis du har bedre tall, for eksempel fra en megler eller takstmann."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anslått verdiøkning" value={formatCurrency(result.estimatedValueAdded, { decimals: 0 })} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Verdiøkning av kostnad" value={`${result.avgROI.toLocaleString('nb-NO')} %`} />
                        <ResultDisplay label={result.netGain >= 0 ? 'Netto gevinst' : 'Netto tap'} value={formatCurrency(result.netGain, { decimals: 0 })} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <SelectInput id="type" label="Type oppussing" value={type} onChange={changeType} options={OPTIONS} />
                <NumberInput id="cost" label="Kostnad" value={cost} onChange={v => setCost(String(v))} min={1} step={10000} unit="kr" />
                <NumberInput id="roi" label="Forventet verdiøkning av kostnaden" value={roi} onChange={v => setRoi(String(v))} min={0} max={300} step={5} unit="%" />
            </div>
        </CalculatorBase>
    );
}
export default RenovationROICalculator;
