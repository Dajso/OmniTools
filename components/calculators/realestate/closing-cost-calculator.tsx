'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateClosingCosts, type ClosingCostResult } from '@/lib/calculations/realestate/closing-costs';

export function ClosingCostCalculator() {
    const [price, setPrice] = React.useState('350000');
    const [dp, setDp] = React.useState('20');
    const [result, setResult] = React.useState<ClosingCostResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateClosingCosts({ purchasePrice: parseFloat(price), downPaymentPercent: parseFloat(dp) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [price, dp]);
    const reset = () => { setPrice('350000'); setDp('20'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Closing Cost Estimator" description="Estimate home buying closing costs"
            formula="Total = Down Payment + All Fees" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Total Cash Needed" value={`$${result.totalCashNeeded.toLocaleString()}`} copyable />
                    <ResultDisplay label="Closing Costs" value={`$${result.totalClosingCosts.toLocaleString()} (${result.percentOfPrice}% of price)`} />
                    <div className="space-y-2 text-sm">
                        {[
                            ['Loan Origination', result.loanOrigination], ['Appraisal', result.appraisal],
                            ['Title Insurance', result.titleInsurance], ['Escrow Fees', result.escrowFees],
                            ['Recording Fees', result.recordingFees], ['Inspection', result.inspectionFee],
                            ['Prepaid Insurance', result.prepaidInsurance], ['Prepaid Taxes', result.prepaidTaxes],
                        ].map(([label, val]) => (
                            <div key={label as string} className="flex justify-between border-b border-gray-100 py-1">
                                <span className="text-gray-600">{label}</span><span className="font-mono">${(val as number).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Purchase Price ($)" value={price} onChange={v => setPrice(String(v))} min={1} step={10000} />
                <NumberInput id="dp" label="Down Payment (%)" value={dp} onChange={v => setDp(String(v))} min={0} max={100} step={5} />
            </div>
        </CalculatorBase>
    );
}
export default ClosingCostCalculator;
