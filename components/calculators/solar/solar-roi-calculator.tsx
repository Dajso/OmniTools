'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSolarROI, type SolarROIResult } from '@/lib/calculations/solar/solar-roi';

export function SolarROICalculator() {
    const [cost, setCost] = React.useState('15000');
    const [production, setProduction] = React.useState('9000');
    const [rate, setRate] = React.useState('0.13');
    const [rateIncrease, setRateIncrease] = React.useState('3');
    const [lifespan, setLifespan] = React.useState('25');
    const [maintenance, setMaintenance] = React.useState('200');
    const [incentive, setIncentive] = React.useState('4500');
    const [result, setResult] = React.useState<SolarROIResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSolarROI({
                systemCost: parseFloat(cost), annualProductionKWh: parseFloat(production),
                electricityRate: parseFloat(rate), rateIncreasePercent: parseFloat(rateIncrease),
                lifespanYears: parseInt(lifespan), maintenanceCost: parseFloat(maintenance), incentive: parseFloat(incentive),
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [cost, production, rate, rateIncrease, lifespan, maintenance, incentive]);

    const reset = () => { setCost('15000'); setProduction('9000'); setRate('0.13'); setRateIncrease('3'); setLifespan('25'); setMaintenance('200'); setIncentive('4500'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Solar ROI Calculator" description="Will solar panels pay for themselves?"
            formula="ROI = (Total Savings - Net Cost) / Net Cost × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Payback Period" value={`${result.paybackYears} years`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Net System Cost" value={`$${result.netCost.toLocaleString()}`} />
                        <ResultDisplay label="First Year Savings" value={`$${result.annualSavingsYear1.toLocaleString()}`} />
                        <ResultDisplay label="25-Year Total Savings" value={`$${result.totalSavings25yr.toLocaleString()}`} />
                        <ResultDisplay label="Return on Investment" value={`${result.roi}%`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="cost" label="System Cost ($)" value={cost} onChange={(v) => setCost(String(v))} min={1000} step={1000} />
                    <NumberInput id="incentive" label="Incentives/Rebates ($)" value={incentive} onChange={(v) => setIncentive(String(v))} min={0} step={500} />
                </div>
                <NumberInput id="production" label="Annual Production (kWh)" value={production} onChange={(v) => setProduction(String(v))} min={100} step={500} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="rate" label="Electricity Rate ($/kWh)" value={rate} onChange={(v) => setRate(String(v))} min={0.01} step={0.01} />
                    <NumberInput id="rate-increase" label="Annual Rate Increase (%)" value={rateIncrease} onChange={(v) => setRateIncrease(String(v))} min={0} max={10} step={0.5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="lifespan" label="System Lifespan (years)" value={lifespan} onChange={(v) => setLifespan(String(v))} min={5} max={40} step={1} />
                    <NumberInput id="maintenance" label="Annual Maintenance ($)" value={maintenance} onChange={(v) => setMaintenance(String(v))} min={0} step={50} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default SolarROICalculator;
