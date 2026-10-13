'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSolarPanelTilt, type Season, type SolarPanelTiltResult } from '@/lib/calculations/solar/solar-panel-tilt';

const SEASON_OPTIONS = [
    { value: 'annual', label: 'Hele året' },
    { value: 'summer', label: 'Sommer' },
    { value: 'winter', label: 'Vinter' },
    { value: 'spring-fall', label: 'Vår og høst' },
];

export function SolarPanelTiltCalculator() {
    const [latitude, setLatitude] = React.useState('59.9');
    const [season, setSeason] = React.useState<string>('annual');
    const [result, setResult] = React.useState<SolarPanelTiltResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSolarPanelTilt({ latitude: parseFloat(latitude), season: season as Season });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [latitude, season]);

    const reset = () => { setLatitude('59.9'); setSeason('annual'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Solcellevinkel"
            description="Finn beste helningsvinkel for solcellepanelene dine"
            formula="Helning ≈ breddegrad × 0,76 + 3,1° (hele året)"
            formulaExplanation="Oslo ligger på ca. 59,9° N, Bergen på 60,4°, Trondheim på 63,4° og Tromsø på 69,6°. Panelene bør vende rett mot sør, men sørøst og sørvest gir bare noen få prosent lavere produksjon."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Beste helning" value={`${String(result.tiltAngle).replace('.', ',')}°`} highlight copyable />
                    <ResultDisplay label="Retning" value={result.azimuth} />
                    <ResultDisplay label="Forklaring" value={result.explanation} />
                    <p className="text-xs text-muted-foreground">
                        I praksis styres vinkelen ofte av takvinkelen. Variasjoner på 10–15° fra det beste gir bare et lite tap over året, og en bratt vinkel (over ca. 35°) hjelper snøen å gli av.
                    </p>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="latitude" label="Breddegrad" value={latitude} onChange={(v) => setLatitude(String(v))} min={-90} max={90} step={0.1} unit="°" />
                <SelectInput id="season" label="Optimaliser for" value={season} onChange={setSeason} options={SEASON_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default SolarPanelTiltCalculator;
