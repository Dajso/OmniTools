'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateBatteryLife, BATTERY_TYPES, type BatteryLifeResult } from '@/lib/calculations/electronics/battery-life';
import { formatFixed } from '@/lib/utils/formatting';

const BATTERY_OPTIONS = [
  { value: 'custom', label: 'Custom' },
  ...Object.entries(BATTERY_TYPES).map(([value, data]) => ({
    value,
    label: `${data.name} (${data.capacity}mAh)`,
  })),
];

export function BatteryLifeCalculator() {
  const [batteryType, setBatteryType] = React.useState('aa-alkaline');
  const [capacity, setCapacity] = React.useState('2800');
  const [current, setCurrent] = React.useState('100');
  const [efficiency, setEfficiency] = React.useState('80');
  const [dutyCycle, setDutyCycle] = React.useState('100');
  const [result, setResult] = React.useState<BatteryLifeResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const handleBatteryTypeChange = (type: string) => {
    setBatteryType(type);
    if (type !== 'custom' && BATTERY_TYPES[type]) {
      setCapacity(BATTERY_TYPES[type].capacity.toString());
    }
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const cap = parseFloat(capacity);
      const cur = parseFloat(current);
      const eff = parseFloat(efficiency) / 100;
      const duty = parseFloat(dutyCycle) / 100;

      if (isNaN(cap) || isNaN(cur) || isNaN(eff) || isNaN(duty)) {
        setResult(null);
        return;
      }

      const res = calculateBatteryLife({
        capacityMah: cap,
        currentMa: cur,
        efficiency: eff,
        dutyCycle: duty,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [capacity, current, efficiency, dutyCycle]);

  const reset = () => {
    setBatteryType('aa-alkaline');
    setCapacity('2800');
    setCurrent('100');
    setEfficiency('80');
    setDutyCycle('100');
    setResult(null);
    setError(undefined);
  };

  // Wrapper functions to convert number to string for state
  const handleCapacityChange = (v: number) => setCapacity(String(v));
  const handleCurrentChange = (v: number) => setCurrent(String(v));
  const handleEfficiencyChange = (v: number) => setEfficiency(String(v));
  const handleDutyCycleChange = (v: number) => setDutyCycle(String(v));

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Battery Life Calculator"
      description="Calculate how long a battery will last"
      formula="Time (hours) = Capacity (mAh) / Current (mA)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Battery Life" value={result.formatted} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Hours" value={formatFixed(result.hours, 2)} />
            <ResultDisplay label="Days" value={formatFixed(result.days, 2)} />
            <ResultDisplay label="Minutes" value={formatFixed(result.minutes, 0)} />
            <ResultDisplay label="Effective Capacity" value={`${formatFixed(result.effectiveCapacity, 0)}mAh`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput id="battery-type" label="Battery Type" value={batteryType} onChange={handleBatteryTypeChange} options={BATTERY_OPTIONS} />
        <NumberInput id="capacity" label="Capacity (mAh)" value={capacity} onChange={handleCapacityChange} min={1} step={100} />
        <NumberInput id="current" label="Current Draw (mA)" value={current} onChange={handleCurrentChange} min={0.1} step={10} />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="efficiency" label="Efficiency (%)" value={efficiency} onChange={handleEfficiencyChange} min={1} max={100} step={5} />
          <NumberInput id="duty-cycle" label="Duty Cycle (%)" value={dutyCycle} onChange={handleDutyCycleChange} min={1} max={100} step={10} />
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BatteryLifeCalculator;
