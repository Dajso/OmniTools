'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  getAccelerationEstimate,
  kwToHp,
  type VehicleSpec,
  type AccelerationEstimate,
} from '@/lib/calculations/auto/zero-sixty-estimator';
import { formatFixed } from '@/lib/utils/formatting';

const DRIVETRAIN_OPTIONS = [
  { value: 'fwd', label: 'Forhjulsdrift (FWD)' },
  { value: 'rwd', label: 'Bakhjulsdrift (RWD)' },
  { value: 'awd', label: 'Firehjulsdrift (AWD)' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automat' },
  { value: 'manual', label: 'Manuell' },
  { value: 'dct', label: 'Dobbel clutch (DCT)' },
  { value: 'cvt', label: 'CVT' },
];

const CONFIDENCE_LABELS: Record<string, string> = { high: 'Høy', medium: 'Middels', low: 'Lav' };

export function ZeroSixtyEstimator() {
  const [powerKw, setPowerKw] = React.useState(220);
  const [weightKg, setWeightKg] = React.useState(1600);
  const [drivetrain, setDrivetrain] = React.useState<'fwd' | 'rwd' | 'awd'>('rwd');
  const [transmission, setTransmission] = React.useState<'manual' | 'automatic' | 'dct' | 'cvt'>('automatic');
  const [hasLaunchControl, setHasLaunchControl] = React.useState(false);
  const [torqueNm, setTorqueNm] = React.useState(400);
  const [includeTorque, setIncludeTorque] = React.useState(false);
  
  const [result, setResult] = React.useState<AccelerationEstimate | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const spec: VehicleSpec = {
        horsepower: kwToHp(powerKw),
        weightLbs: weightKg / 0.453592,
        drivetrain,
        transmission,
        hasLaunchControl: drivetrain === 'awd' ? hasLaunchControl : false,
        torqueLbFt: includeTorque ? torqueNm * 0.737562 : undefined,
      };
      
      const estimate = getAccelerationEstimate(spec);
      setResult(estimate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [powerKw, weightKg, drivetrain, transmission, hasLaunchControl, torqueNm, includeTorque]);

  const reset = () => {
    setPowerKw(220);
    setWeightKg(1600);
    setDrivetrain('rwd');
    setTransmission('automatic');
    setHasLaunchControl(false);
    setTorqueNm(400);
    setIncludeTorque(false);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return '';
    }
  };

  return (
    <CalculatorBase
      title="0–100 km/t"
      description="Anslå akselerasjon ut fra effekt og vekt"
      formula="t ≈ 2,0 × √(vekt ÷ effekt) × faktorer"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="0–100 km/t"
              value={`${formatFixed(result.zeroTo100Kmh, 1)} sek`}
              highlight
              copyable
            />
            <ResultDisplay
              label="Kvartmil (402 m)"
              value={`${formatFixed(result.quarterMile, 1)} sek`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Fart etter kvartmil"
              value={`${formatFixed((result.quarterMileTrapSpeed * 1.609344), 0)} km/t`}
            />
            <ResultDisplay
              label="Effekt per tonn"
              value={`${formatFixed(((powerKw / weightKg) * 1000), 0)} kW/tonn`}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Hvor sikkert er anslaget</span>
              <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {CONFIDENCE_LABELS[result.confidence]}
              </span>
            </div>
            {result.factors.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1">
                {result.factors.map((factor, i) => (
                  <li key={i}>• {factor}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">I tillegg:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <p>Effekt: {formatFixed(kwToHp(powerKw), 0)} hk (imperial)</p>
              <p>Vekt per kW: {formatFixed((weightKg / powerKw), 1)} kg</p>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="power"
            label="Effekt"
            value={powerKw}
            onChange={setPowerKw}
            min={40}
            max={1500}
            step={5}
            unit="kW"
          />
          <NumberInput
            id="weight"
            label="Egenvekt"
            value={weightKg}
            onChange={setWeightKg}
            min={500}
            max={4500}
            step={50}
            unit="kg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            id="drivetrain"
            label="Drivlinje"
            value={drivetrain}
            onChange={(v) => setDrivetrain(v as 'fwd' | 'rwd' | 'awd')}
            options={DRIVETRAIN_OPTIONS}
          />
          <SelectInput
            id="transmission"
            label="Girkasse"
            value={transmission}
            onChange={(v) => setTransmission(v as 'manual' | 'automatic' | 'dct' | 'cvt')}
            options={TRANSMISSION_OPTIONS}
          />
        </div>

        {drivetrain === 'awd' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="launch-control"
              checked={hasLaunchControl}
              onChange={(e) => setHasLaunchControl(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="launch-control" className="text-sm">
              Har launch control
            </label>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="include-torque"
              checked={includeTorque}
              onChange={(e) => setIncludeTorque(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="include-torque" className="text-sm font-medium">
              Ta med dreiemoment (valgfritt, gir bedre anslag)
            </label>
          </div>
          
          {includeTorque && (
            <NumberInput
              id="torque"
              label="Dreiemoment"
              value={torqueNm}
              onChange={setTorqueNm}
              min={70}
              max={2700}
              step={10}
              unit="Nm"
            />
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ZeroSixtyEstimator;
