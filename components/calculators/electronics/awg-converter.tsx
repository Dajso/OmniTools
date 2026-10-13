'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { formatFixed } from '@/lib/utils/formatting';

// AWG to mm² conversion data
const AWG_DATA: Record<number, { diameter: number; area: number; resistance: number }> = {
  0: { diameter: 8.251, area: 53.49, resistance: 0.3224 },
  1: { diameter: 7.348, area: 42.41, resistance: 0.4066 },
  2: { diameter: 6.544, area: 33.63, resistance: 0.5127 },
  4: { diameter: 5.189, area: 21.15, resistance: 0.8152 },
  6: { diameter: 4.115, area: 13.30, resistance: 1.296 },
  8: { diameter: 3.264, area: 8.366, resistance: 2.061 },
  10: { diameter: 2.588, area: 5.261, resistance: 3.277 },
  12: { diameter: 2.053, area: 3.309, resistance: 5.211 },
  14: { diameter: 1.628, area: 2.081, resistance: 8.286 },
  16: { diameter: 1.291, area: 1.309, resistance: 13.17 },
  18: { diameter: 1.024, area: 0.823, resistance: 20.95 },
  20: { diameter: 0.812, area: 0.518, resistance: 33.31 },
  22: { diameter: 0.644, area: 0.326, resistance: 52.96 },
  24: { diameter: 0.511, area: 0.205, resistance: 84.22 },
  26: { diameter: 0.405, area: 0.129, resistance: 133.9 },
  28: { diameter: 0.321, area: 0.081, resistance: 212.9 },
  30: { diameter: 0.255, area: 0.051, resistance: 338.6 },
};

const AWG_OPTIONS = Object.keys(AWG_DATA).map(awg => ({
  value: awg,
  label: `AWG ${awg}`,
}));

interface AWGResult {
  awg: number;
  diameterMm: number;
  diameterInch: number;
  areaMm2: number;
  areaCircularMils: number;
  resistancePerKm: number;
  resistancePer1000ft: number;
  maxCurrentChassis: number;
  maxCurrentPowerTrans: number;
}

function calculateAWG(awg: number): AWGResult {
  const data = AWG_DATA[awg];
  if (!data) throw new Error('Ugyldig AWG-verdi');

  return {
    awg,
    diameterMm: data.diameter,
    diameterInch: data.diameter / 25.4,
    areaMm2: data.area,
    areaCircularMils: data.area * 1973.5,
    resistancePerKm: data.resistance,
    resistancePer1000ft: data.resistance * 0.3048,
    maxCurrentChassis: Math.sqrt(data.area) * 7, // Rough estimate
    maxCurrentPowerTrans: Math.sqrt(data.area) * 4, // More conservative
  };
}

export function AWGConverter() {
  const [awg, setAwg] = React.useState('18');
  const [result, setResult] = React.useState<AWGResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const awgNum = parseInt(awg, 10);
      if (isNaN(awgNum) || !AWG_DATA[awgNum]) {
        setResult(null);
        return;
      }
      const res = calculateAWG(awgNum);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
      setResult(null);
    }
  }, [awg]);

  const reset = () => {
    setAwg('18');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="AWG til mm²"
      description="Regn om amerikansk trådtykkelse (AWG) til mm² og diameter i mm"
      formula="d(mm) = 0.127 × 92^((36-AWG)/39)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Trådtykkelse" value={`AWG ${result.awg}`} />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Diameter (mm)" value={formatFixed(result.diameterMm, 3)} copyable />
            <ResultDisplay label="Tverrsnitt (mm²)" value={formatFixed(result.areaMm2, 3)} copyable />
            <ResultDisplay label="Motstand (Ω/km)" value={formatFixed(result.resistancePerKm, 3)} />
          </div>
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Anslått maksimal strøm</p>
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay label="Intern ledning i apparater" value={`~${formatFixed(result.maxCurrentChassis, 1)} A`} />
              <ResultDisplay label="Kraftoverføring" value={`~${formatFixed(result.maxCurrentPowerTrans, 1)} A`} />
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput id="awg" label="Trådtykkelse (AWG)" value={awg} onChange={setAwg} options={AWG_OPTIONS} />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Vanlig bruk</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>AWG 10–12:</strong> Kraftkretser og høy strøm</p>
            <p><strong>AWG 14–16:</strong> Skjøteledninger og bil</p>
            <p><strong>AWG 18–22:</strong> Lavspent elektronikk og høyttalere</p>
            <p><strong>AWG 24–30:</strong> Signalledninger og koblingsledninger til koblingsbrett</p>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default AWGConverter;
