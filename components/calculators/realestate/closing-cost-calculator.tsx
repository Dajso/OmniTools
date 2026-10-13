'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateClosingCosts, type ClosingCostResult, type OwnershipType } from '@/lib/calculations/realestate/closing-costs';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

const OWNERSHIP_OPTIONS = [
    { value: 'selveier', label: 'Selveier (hus, enebolig, selveierleilighet)' },
    { value: 'andel', label: 'Borettslag / andelsbolig' },
];

export function ClosingCostCalculator() {
    const [price, setPrice] = React.useState('4500000');
    const [dp, setDp] = React.useState('15');
    const [ownership, setOwnership] = React.useState<OwnershipType>('selveier');
    const [fee, setFee] = React.useState('1000');
    const [result, setResult] = React.useState<ClosingCostResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            setResult(calculateClosingCosts({ purchasePrice: parseFloat(price), downPaymentPercent: parseFloat(dp), ownership, establishmentFee: parseFloat(fee) || 0 }));
        } catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [price, dp, ownership, fee]);
    const reset = () => { setPrice('4500000'); setDp('15'); setOwnership('selveier'); setFee('1000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Omkostninger ved boligkjøp" description="Anslå dokumentavgift, tinglysing og andre kostnader når du kjøper bolig"
            formula="Omkostninger = dokumentavgift (2,5 %) + tinglysing + etableringsgebyr"
            formulaExplanation="Dokumentavgiften er 2,5 % av kjøpesummen og gjelder selveiere. Borettslag og andelsbolig har ingen dokumentavgift. Tinglysing av skjøte og pantedokument koster hver ca. 585 kr."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Kontanter du trenger" value={formatCurrency(result.totalCashNeeded, { decimals: 0 })} highlight copyable />
                    <ResultDisplay label="Omkostninger" value={`${formatCurrency(result.totalClosingCosts, { decimals: 0 })} (${formatPercent(result.percentOfPrice, { isDecimal: false })} av kjøpesummen)`} />
                    <div className="space-y-2 text-sm">
                        {[
                            ['Egenkapital', result.downPayment],
                            ['Lånebeløp', result.loanAmount],
                            ['Dokumentavgift', result.documentFee],
                            ['Tinglysing av skjøte', result.titleRegistration],
                            ['Tinglysing av pantedokument', result.mortgageRegistration],
                            ['Etableringsgebyr', result.establishmentFee],
                        ].map(([label, val]) => (
                            <div key={label as string} className="flex justify-between border-b border-gray-100 py-1">
                                <span className="text-gray-600">{label}</span><span className="font-mono">{formatCurrency(val as number, { decimals: 0 })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Kjøpesum" value={price} onChange={v => setPrice(String(v))} min={1} step={50000} unit="kr" />
                <NumberInput id="dp" label="Egenkapital (minst 15 %)" value={dp} onChange={v => setDp(String(v))} min={0} max={100} step={5} unit="%" />
                <SelectInput id="ownership" label="Boligtype" value={ownership} onChange={v => setOwnership(v as OwnershipType)} options={OWNERSHIP_OPTIONS} />
                <NumberInput id="fee" label="Etableringsgebyr for lånet" value={fee} onChange={v => setFee(String(v))} min={0} step={500} unit="kr" />
            </div>
        </CalculatorBase>
    );
}
export default ClosingCostCalculator;
