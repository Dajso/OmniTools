'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateWaterIntake, type ActivityLevel, type WaterIntakeResults } from '@/lib/calculations/health/water-intake';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Stillesittende (lite trening)' },
  { value: 'light', label: 'Lett (1–3 dager i uken)' },
  { value: 'moderate', label: 'Moderat (3–5 dager i uken)' },
  { value: 'active', label: 'Aktiv (6–7 dager i uken)' },
  { value: 'very_active', label: 'Svært aktiv (hard trening daglig)' },
];

const CLIMATE_OPTIONS = [
  { value: 'normal', label: 'Norsk klima / temperert' },
  { value: 'hot', label: 'Varmt og fuktig' },
];

export function WaterIntakeCalculator() {
  const [weight, setWeight] = React.useState(70);
  const unit = 'metric' as const;
  const [activity, setActivity] = React.useState<ActivityLevel>('moderate');
  const [climate, setClimate] = React.useState<'normal' | 'hot'>('normal');
  const [results, setResults] = React.useState<WaterIntakeResults | null>(null);

  const calculate = React.useCallback(() => {
    const result = calculateWaterIntake({ weight, unit, activityLevel: activity, climate });
    setResults(result);
  }, [weight, unit, activity, climate]);

  React.useEffect(() => { calculate(); }, [calculate]);


  return (
    <CalculatorBase
      title="Vannbehov"
      description="Anslå hvor mye du bør drikke per dag ut fra vekt og aktivitet"
      onCalculate={calculate}
      onReset={() => { setWeight(70); setActivity('moderate'); setClimate('normal'); }}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Vann per dag" value={results.liters.toFixed(1).replace('.', ',')} unit="liter" highlight copyable />
          </div>
          <ResultDisplay label="Glass à 2 dl" value={Math.ceil(results.liters * 5)} unit="glass/dag" />
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💧 Tips: Drikk jevnt utover dagen, ikke alt på en gang. Drikk mer når du trener eller det er varmt. Mat og andre drikker dekker en del av behovet.
            </p>
          </div>
        </div>
      )}
    >
      <NumberInput id="weight" label="Kroppsvekt" value={weight} onChange={setWeight} min={30} max={300} unit="kg" required />
      <SelectInput id="activity" label="Aktivitetsnivå" value={activity} onChange={(v) => setActivity(v as ActivityLevel)} options={ACTIVITY_OPTIONS} required />
      <SelectInput id="climate" label="Klima" value={climate} onChange={(v) => setClimate(v as 'normal' | 'hot')} options={CLIMATE_OPTIONS} />
    </CalculatorBase>
  );
}

export default WaterIntakeCalculator;
