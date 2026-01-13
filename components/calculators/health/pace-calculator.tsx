'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculatePace, type CalculationType, type PaceResults } from '@/lib/calculations/health/pace-calculator';

const CALC_TYPE_OPTIONS = [
  { value: 'pace', label: 'Calculate Pace (from distance & time)' },
  { value: 'time', label: 'Calculate Time (from distance & pace)' },
  { value: 'distance', label: 'Calculate Distance (from time & pace)' },
];

const DISTANCE_UNIT_OPTIONS = [
  { value: 'miles', label: 'Miles' },
  { value: 'km', label: 'Kilometers' },
  { value: 'meters', label: 'Meters' },
];

export function PaceCalculator() {
  const [calcType, setCalcType] = React.useState<CalculationType>('pace');
  const [distance, setDistance] = React.useState(5);
  const [distanceUnit, setDistanceUnit] = React.useState<'miles' | 'km' | 'meters'>('km');
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [paceMin, setPaceMin] = React.useState(5);
  const [paceSec, setPaceSec] = React.useState(0);
  const [results, setResults] = React.useState<PaceResults | null>(null);

  const calculate = () => {
    try {
      const result = calculatePace({
        calculationType: calcType,
        distance,
        distanceUnit,
        hours,
        minutes,
        seconds,
        paceMinutes: paceMin,
        paceSeconds: paceSec,
        paceUnit: 'min/km',
      });
      setResults(result);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => { calculate(); }, [calcType, distance, distanceUnit, hours, minutes, seconds, paceMin, paceSec]);

  return (
    <CalculatorBase
      title="Pace Calculator"
      description="Calculate running or walking pace, time, or distance"
      onCalculate={calculate}
      onReset={() => { setDistance(5); setMinutes(25); setPaceMin(5); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Pace" value={`${results.pace.perMile}/mi | ${results.pace.perKm}/km`} highlight />
            <ResultDisplay label="Time" value={results.time.total} />
            <ResultDisplay label="Distance" value={`${results.distance.miles} mi / ${results.distance.km} km`} />
            <ResultDisplay label="Speed" value={`${results.speed.mph} mph / ${results.speed.kmh} km/h`} />
          </div>
          {results.splits.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Split Times</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {results.splits.map((s, i) => (
                  <div key={i} className="p-2 bg-muted/50 rounded text-center">
                    <p className="font-medium">{s.distance}</p>
                    <p className="text-muted-foreground">{s.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    >
      <SelectInput id="calcType" label="Calculate" value={calcType} onChange={(v) => setCalcType(v as CalculationType)} options={CALC_TYPE_OPTIONS} required />
      
      {(calcType === 'pace' || calcType === 'time') && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="distance" label="Distance" value={distance} onChange={setDistance} min={0.1} step={0.1} required />
          <SelectInput id="distanceUnit" label="Unit" value={distanceUnit} onChange={(v) => setDistanceUnit(v as 'miles' | 'km' | 'meters')} options={DISTANCE_UNIT_OPTIONS} />
        </div>
      )}
      
      {(calcType === 'pace' || calcType === 'distance') && (
        <div className="grid grid-cols-3 gap-4">
          <NumberInput id="hours" label="Hours" value={hours} onChange={setHours} min={0} max={24} />
          <NumberInput id="minutes" label="Minutes" value={minutes} onChange={setMinutes} min={0} max={59} />
          <NumberInput id="seconds" label="Seconds" value={seconds} onChange={setSeconds} min={0} max={59} />
        </div>
      )}
      
      {(calcType === 'time' || calcType === 'distance') && (
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="paceMin" label="Pace (min)" value={paceMin} onChange={setPaceMin} min={0} max={30} />
          <NumberInput id="paceSec" label="Pace (sec)" value={paceSec} onChange={setPaceSec} min={0} max={59} />
        </div>
      )}
    </CalculatorBase>
  );
}

export default PaceCalculator;
