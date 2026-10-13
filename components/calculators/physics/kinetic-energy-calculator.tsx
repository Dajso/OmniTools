'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import {
  calculateKineticEnergy,
  type KineticEnergyResult,
} from '@/lib/calculations/physics/kinetic-energy-calculator';
import { formatFixed } from '@/lib/utils/formatting';

export function KineticEnergyCalculator() {
  const [kineticEnergy, setKineticEnergy] = React.useState<string>('');
  const [mass, setMass] = React.useState<string>('');
  const [velocity, setVelocity] = React.useState<string>('');
  const [result, setResult] = React.useState<KineticEnergyResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const input = {
        kineticEnergy: kineticEnergy ? parseFloat(kineticEnergy) : undefined,
        mass: mass ? parseFloat(mass) : undefined,
        velocity: velocity ? parseFloat(velocity) : undefined,
      };

      const providedCount = [input.kineticEnergy, input.mass, input.velocity]
        .filter(v => v !== undefined && !isNaN(v)).length;

      if (providedCount < 2) {
        setResult(null);
        return;
      }

      const res = calculateKineticEnergy(input);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [kineticEnergy, mass, velocity]);

  const reset = () => {
    setKineticEnergy('');
    setMass('');
    setVelocity('');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Kalkulator for kinetisk energi"
      description="Regn ut kinetisk energi, masse eller hastighet med KE = ½mv²"
      formula="KE = ½mv²"
      formulaExplanation="Kinetisk energi er halve massen ganger hastigheten i andre. Fyll inn to verdier, så regnes den tredje ut."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Kinetisk energi (KE)"
              value={result.formattedEnergy}
              highlight={result.calculated === 'kineticEnergy'}
              copyable
            />
            <ResultDisplay
              label="Masse (m)"
              value={result.formattedMass}
              highlight={result.calculated === 'mass'}
              copyable
            />
            <ResultDisplay
              label="Hastighet (v)"
              value={result.formattedVelocity}
              highlight={result.calculated === 'velocity'}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Omregnet til andre energienheter</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">kWh: </span>
                {result.energyInKWh.toExponential(4)}
              </div>
              <div>
                <span className="text-muted-foreground">Kalorier: </span>
                {formatFixed(result.energyInCalories, 2)}
              </div>
              <div>
                <span className="text-muted-foreground">BTU: </span>
                {formatFixed(result.energyInBTU, 4)}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Den uthevede verdien er regnet ut fra det du har fylt inn
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Fyll inn to verdier:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="kineticEnergy"
            label="Kinetisk energi"
            value={kineticEnergy}
            onChange={setKineticEnergy}
            placeholder="Joule (J)"
            min={0}
            step={0.1}
          />
          <NumberInput
            id="mass"
            label="Masse"
            value={mass}
            onChange={setMass}
            placeholder="kg"
            min={0}
            step={0.001}
          />
          <NumberInput
            id="velocity"
            label="Hastighet"
            value={velocity}
            onChange={setVelocity}
            placeholder="m/s"
            min={0}
            step={0.1}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Formler for kinetisk energi</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>KE = ½mv²</div>
            <div>m = 2KE/v²</div>
            <div>v = √(2KE/m)</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default KineticEnergyCalculator;
