'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateRenovationROI, type RenovationType, type RenovationROIResult, ROI_DATA } from '@/lib/calculations/realestate/renovation-roi';

const OPTIONS = Object.entries(ROI_DATA).map(([k, v]) => ({ value: k, label: v.label }));

export function RenovationROICalculator() {
    const [type, setType] = React.useState<string>('kitchen-minor');
    const [cost, setCost] = React.useState('25000');
    const [result, setResult] = React.useState<RenovationROIResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateRenovationROI({ type: type as RenovationType, cost: parseFloat(cost) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [type, cost]);
    const reset = () => { setType('kitchen-minor'); setCost('25000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Renovation ROI Estimator" description="Estimate value added by renovations"
            formula="Value Added = Cost × Average ROI%" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Estimated Value Added" value={`$${result.estimatedValueAdded.toLocaleString()}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Average ROI" value={`${result.avgROI}%`} />
                        <ResultDisplay label={result.netGain >= 0 ? 'Net Gain' : 'Net Loss'} value={`$${result.netGain.toLocaleString()}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <SelectInput id="type" label="Renovation Type" value={type} onChange={setType} options={OPTIONS} />
                <NumberInput id="cost" label="Renovation Cost ($)" value={cost} onChange={v => setCost(String(v))} min={1} step={1000} />
            </div>
        </CalculatorBase>
    );
}
export default RenovationROICalculator;
