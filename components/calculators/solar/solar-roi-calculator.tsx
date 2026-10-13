'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSolarROI, type SolarROIResult } from '@/lib/calculations/solar/solar-roi';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const DEFAULTS = {
    cost: '150000',
    production: '7200',
    rate: '1.2',
    rateIncrease: '3',
    lifespan: '30',
    maintenance: '1000',
    incentive: '0',
    selfConsumption: '60',
    exportRate: '0.6',
    degradation: '0.5',
};

const kr0 = (v: number) => formatCurrency(v, { decimals: 0 });

export function SolarROICalculator() {
    const [cost, setCost] = React.useState(DEFAULTS.cost);
    const [production, setProduction] = React.useState(DEFAULTS.production);
    const [rate, setRate] = React.useState(DEFAULTS.rate);
    const [rateIncrease, setRateIncrease] = React.useState(DEFAULTS.rateIncrease);
    const [lifespan, setLifespan] = React.useState(DEFAULTS.lifespan);
    const [maintenance, setMaintenance] = React.useState(DEFAULTS.maintenance);
    const [incentive, setIncentive] = React.useState(DEFAULTS.incentive);
    const [selfConsumption, setSelfConsumption] = React.useState(DEFAULTS.selfConsumption);
    const [exportRate, setExportRate] = React.useState(DEFAULTS.exportRate);
    const [degradation, setDegradation] = React.useState(DEFAULTS.degradation);
    const [result, setResult] = React.useState<SolarROIResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSolarROI({
                systemCost: parseFloat(cost),
                annualProductionKWh: parseFloat(production),
                electricityRate: parseFloat(rate),
                rateIncreasePercent: parseFloat(rateIncrease),
                lifespanYears: parseInt(lifespan),
                maintenanceCost: parseFloat(maintenance),
                incentive: parseFloat(incentive),
                selfConsumptionPercent: parseFloat(selfConsumption),
                exportRate: parseFloat(exportRate),
                degradationPercent: parseFloat(degradation),
            });
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Beregningsfeil');
            setResult(null);
        }
    }, [cost, production, rate, rateIncrease, lifespan, maintenance, incentive, selfConsumption, exportRate, degradation]);

    const reset = () => {
        setCost(DEFAULTS.cost); setProduction(DEFAULTS.production); setRate(DEFAULTS.rate);
        setRateIncrease(DEFAULTS.rateIncrease); setLifespan(DEFAULTS.lifespan); setMaintenance(DEFAULTS.maintenance);
        setIncentive(DEFAULTS.incentive); setSelfConsumption(DEFAULTS.selfConsumption);
        setExportRate(DEFAULTS.exportRate); setDegradation(DEFAULTS.degradation);
        setResult(null); setError(undefined);
    };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Lønnsomhet for solceller"
            description="Betaler solcelleanlegget seg selv? Regn ut tilbakebetalingstid og avkastning i kroner"
            formula="Avkastning = (sparte kroner − netto kostnad) ÷ netto kostnad × 100"
            formulaExplanation="Egenbrukt strøm sparer full strømpris (strøm, nettleie, avgifter og mva). Overskudd du selger til nettet gir normalt en lavere pris. Strømprisen øker med den årlige prosenten du oppgir."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay
                        label="Tilbakebetalingstid"
                        value={result.neverPaysBack ? 'Ikke innen levetiden' : `${formatNumber(result.paybackYears)} år`}
                        highlight
                        copyable
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Netto kostnad" value={kr0(result.netCost)} />
                        <ResultDisplay label="Spart første år" value={kr0(result.annualSavingsYear1)} />
                        <ResultDisplay label={`Spart totalt over ${lifespan} år`} value={kr0(result.totalSavings25yr)} />
                        <ResultDisplay label="Avkastning" value={`${formatNumber(result.roi)} %`} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Beregningen er forenklet. Strømpriser, nettleie og avgifter endrer seg, og regningen din avhenger av hvor mye du faktisk bruker mens sola skinner.
                    </p>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="cost" label="Pris for anlegget" value={cost} onChange={(v) => setCost(String(v))} min={1000} step={5000} unit="kr" />
                    <NumberInput id="incentive" label="Støtte" value={incentive} onChange={(v) => setIncentive(String(v))} min={0} step={1000} unit="kr" />
                </div>
                <NumberInput id="production" label="Årlig produksjon" value={production} onChange={(v) => setProduction(String(v))} min={100} step={100} unit="kWh" />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="self" label="Andel egenbruk" value={selfConsumption} onChange={(v) => setSelfConsumption(String(v))} min={0} max={100} step={5} unit="%" />
                    <NumberInput id="export" label="Pris for overskudd som selges" value={exportRate} onChange={(v) => setExportRate(String(v))} min={0} step={0.05} unit="kr/kWh" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="rate" label="Verdi av strøm du bruker selv" value={rate} onChange={(v) => setRate(String(v))} min={0.01} step={0.05} unit="kr/kWh" />
                    <NumberInput id="rate-increase" label="Årlig prisøkning på strøm" value={rateIncrease} onChange={(v) => setRateIncrease(String(v))} min={0} max={10} step={0.5} unit="%" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="lifespan" label="Levetid" value={lifespan} onChange={(v) => setLifespan(String(v))} min={5} max={40} step={1} unit="år" />
                    <NumberInput id="maintenance" label="Årlige kostnader (forsikring, vedlikehold)" value={maintenance} onChange={(v) => setMaintenance(String(v))} min={0} step={100} unit="kr/år" />
                </div>
                <NumberInput id="degradation" label="Årlig produksjonsfall" value={degradation} onChange={(v) => setDegradation(String(v))} min={0} max={5} step={0.1} unit="%" />
            </div>
        </CalculatorBase>
    );
}

export default SolarROICalculator;
