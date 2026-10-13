'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSleepCycle, type CalculationMode, type SleepCycleResults } from '@/lib/calculations/health/sleep-cycle';
import { cn } from '@/lib/utils';

const MODE_OPTIONS = [
  { value: 'wake_time', label: 'Jeg må våkne klokken …' },
  { value: 'bed_time', label: 'Jeg legger meg klokken …' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function SleepCycleCalculator() {
  const [mode, setMode] = React.useState<CalculationMode>('wake_time');
  const [timeStr, setTimeStr] = React.useState('07:00');
  const [fallAsleep, setFallAsleep] = React.useState(15);
  const [results, setResults] = React.useState<SleepCycleResults | null>(null);

  const calculate = React.useCallback(() => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    const result = calculateSleepCycle({ mode, time, fallAsleepMinutes: fallAsleep });
    setResults(result);
  }, [mode, timeStr, fallAsleep]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const qualityColors = {
    optimal: 'bg-green-100 border-green-300 text-green-800',
    good: 'bg-blue-100 border-blue-300 text-blue-800',
    fair: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  };

  return (
    <CalculatorBase
      title="Søvnsyklus-kalkulator"
      description="Finn de beste tidspunktene å legge seg eller våkne, basert på søvnsykluser på 90 minutter"
      onCalculate={calculate}
      onReset={() => { setTimeStr('07:00'); setFallAsleep(15); }}
      results={results && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {mode === 'wake_time' ? 'Legg deg på et av disse tidspunktene:' : 'Våkn på et av disse tidspunktene:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.recommendedTimes.map((t, i) => (
              <div key={i} className={cn('p-4 rounded-lg border-2 text-center', qualityColors[t.quality])}>
                <p className="text-2xl font-bold">{formatTime(t.time)}</p>
                <p className="text-sm">{t.cycles} sykluser ({t.hours} t)</p>
                <span className="text-xs uppercase">{({ optimal: 'best', good: 'god', fair: 'ok' } as Record<string, string>)[t.quality] ?? t.quality}</span>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Om søvnsykluser</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• En søvnsyklus varer ca. 90 minutter</li>
              <li>• Å våkne mellom to sykluser gjør at du kjenner deg uthvilt</li>
              <li>• Voksne trenger 4–6 sykluser (6–9 timer) per natt</li>
              <li>• 5–6 sykluser er best for de fleste voksne</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="mode" label="Jeg vil regne ut" value={mode} onChange={(v) => setMode(v as CalculationMode)} options={MODE_OPTIONS} required />
      <div className="space-y-2">
        <label htmlFor="time" className="text-sm font-medium">
          {mode === 'wake_time' ? 'Tid du må våkne' : 'Leggetid'}
        </label>
        <input
          type="time"
          id="time"
          value={timeStr}
          onChange={(e) => setTimeStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <NumberInput id="fallAsleep" label="Tid for å sovne" value={fallAsleep} onChange={setFallAsleep} min={5} max={60} unit="min" />
    </CalculatorBase>
  );
}

export default SleepCycleCalculator;
