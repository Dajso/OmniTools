'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSleepCycle, type CalculationMode, type SleepCycleResults } from '@/lib/calculations/health/sleep-cycle';
import { cn } from '@/lib/utils';

const MODE_OPTIONS = [
  { value: 'wake_time', label: 'I need to wake up at...' },
  { value: 'bed_time', label: 'I want to go to bed at...' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function SleepCycleCalculator() {
  const [mode, setMode] = React.useState<CalculationMode>('wake_time');
  const [timeStr, setTimeStr] = React.useState('07:00');
  const [fallAsleep, setFallAsleep] = React.useState(15);
  const [results, setResults] = React.useState<SleepCycleResults | null>(null);

  const calculate = () => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    const result = calculateSleepCycle({ mode, time, fallAsleepMinutes: fallAsleep });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [mode, timeStr, fallAsleep]);

  const qualityColors = {
    optimal: 'bg-green-100 border-green-300 text-green-800',
    good: 'bg-blue-100 border-blue-300 text-blue-800',
    fair: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  };

  return (
    <CalculatorBase
      title="Sleep Cycle Calculator"
      description="Find the best times to sleep or wake up based on 90-minute sleep cycles"
      onCalculate={calculate}
      onReset={() => { setTimeStr('07:00'); setFallAsleep(15); }}
      results={results && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {mode === 'wake_time' ? 'Go to bed at one of these times:' : 'Wake up at one of these times:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.recommendedTimes.map((t, i) => (
              <div key={i} className={cn('p-4 rounded-lg border-2 text-center', qualityColors[t.quality])}>
                <p className="text-2xl font-bold">{formatTime(t.time)}</p>
                <p className="text-sm">{t.cycles} cycles ({t.hours}h)</p>
                <span className="text-xs uppercase">{t.quality}</span>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Sleep Cycle Info</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Each sleep cycle lasts ~90 minutes</li>
              <li>• Waking between cycles helps you feel refreshed</li>
              <li>• Adults need 4-6 cycles (6-9 hours) per night</li>
              <li>• 5-6 cycles is optimal for most adults</li>
            </ul>
          </div>
        </div>
      )}
    >
      <SelectInput id="mode" label="I want to calculate" value={mode} onChange={(v) => setMode(v as CalculationMode)} options={MODE_OPTIONS} required />
      <div className="space-y-2">
        <label htmlFor="time" className="text-sm font-medium">
          {mode === 'wake_time' ? 'Wake up time' : 'Bedtime'}
        </label>
        <input
          type="time"
          id="time"
          value={timeStr}
          onChange={(e) => setTimeStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <NumberInput id="fallAsleep" label="Time to fall asleep" value={fallAsleep} onChange={setFallAsleep} min={5} max={60} unit="min" />
    </CalculatorBase>
  );
}

export default SleepCycleCalculator;
