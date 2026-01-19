'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  getAccelerationEstimate,
  hpToKw,
  lbsToKg,
  type VehicleSpec,
  type AccelerationEstimate,
} from '@/lib/calculations/auto/zero-sixty-estimator';

const DRIVETRAIN_OPTIONS = [
  { value: 'fwd', label: 'Front-Wheel Drive (FWD)' },
  { value: 'rwd', label: 'Rear-Wheel Drive (RWD)' },
  { value: 'awd', label: 'All-Wheel Drive (AWD)' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'dct', label: 'Dual-Clutch (DCT)' },
  { value: 'cvt', label: 'CVT' },
];

export function ZeroSixtyEstimator() {
  const [horsepower, setHorsepower] = React.useState(300);
  const [weightLbs, setWeightLbs] = React.useState(3500);
  const [drivetrain, setDrivetrain] = React.useState<'fwd' | 'rwd' | 'awd'>('rwd');
  const [transmission, setTransmission] = React.useState<'manual' | 'automatic' | 'dct' | 'cvt'>('automatic');
  const [hasLaunchControl, setHasLaunchControl] = React.useState(false);
  const [torqueLbFt, setTorqueLbFt] = React.useState(300);
  const [includeTorque, setIncludeTorque] = React.useState(false);
  
  const [result, setResult] = React.useState<AccelerationEstimate | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const spec: VehicleSpec = {
        horsepower,
        weightLbs,
        drivetrain,
        transmission,
        hasLaunchControl: drivetrain === 'awd' ? hasLaunchControl : false,
        torqueLbFt: includeTorque ? torqueLbFt : undefined,
      };
      
      const estimate = getAccelerationEstimate(spec);
      setResult(estimate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [horsepower, weightLbs, drivetrain, transmission, hasLaunchControl, torqueLbFt, includeTorque]);

  const reset = () => {
    setHorsepower(300);
    setWeightLbs(3500);
    setDrivetrain('rwd');
    setTransmission('automatic');
    setHasLaunchControl(false);
    setTorqueLbFt(300);
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
      title="0-60 Time Estimator"
      description="Estimate acceleration times based on power-to-weight ratio"
      formula="t ≈ 2.0 × √(weight/power) × factors"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="0-60 MPH" 
              value={`${result.zeroToSixty.toFixed(2)} sec`}
              copyable
            />
            <ResultDisplay 
              label="0-100 km/h" 
              value={`${result.zeroTo100Kmh.toFixed(2)} sec`}
              copyable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="1/4 Mile Time" 
              value={`${result.quarterMile.toFixed(2)} sec`}
            />
            <ResultDisplay 
              label="1/4 Mile Trap Speed" 
              value={`${result.quarterMileTrapSpeed.toFixed(1)} MPH`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Power-to-Weight" 
              value={`${result.powerToWeightPerTon.toFixed(1)} HP/ton`}
            />
            <ResultDisplay 
              label="Weight-to-Power" 
              value={`${result.weightToPower.toFixed(1)} lbs/HP`}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Estimate Confidence</span>
              <span className={`text-sm font-medium capitalize ${getConfidenceColor(result.confidence)}`}>
                {result.confidence}
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
            <p className="font-medium mb-2">Metric Equivalents:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <p>Power: {hpToKw(horsepower).toFixed(0)} kW</p>
              <p>Weight: {lbsToKg(weightLbs).toFixed(0)} kg</p>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="horsepower"
            label="Horsepower"
            value={horsepower}
            onChange={setHorsepower}
            min={50}
            max={2000}
            step={10}
            unit="HP"
          />
          <NumberInput
            id="weight"
            label="Curb Weight"
            value={weightLbs}
            onChange={setWeightLbs}
            min={1000}
            max={10000}
            step={100}
            unit="lbs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            id="drivetrain"
            label="Drivetrain"
            value={drivetrain}
            onChange={(v) => setDrivetrain(v as 'fwd' | 'rwd' | 'awd')}
            options={DRIVETRAIN_OPTIONS}
          />
          <SelectInput
            id="transmission"
            label="Transmission"
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
              Has Launch Control
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
              Include Torque (optional, improves accuracy)
            </label>
          </div>
          
          {includeTorque && (
            <NumberInput
              id="torque"
              label="Torque"
              value={torqueLbFt}
              onChange={setTorqueLbFt}
              min={50}
              max={2000}
              step={10}
              unit="lb-ft"
            />
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ZeroSixtyEstimator;
