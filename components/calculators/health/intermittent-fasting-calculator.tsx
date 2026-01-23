'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateFasting, getProtocolOptions, type FastingProtocol, type FastingResults } from '@/lib/calculations/health/intermittent-fasting';
import { cn } from '@/lib/utils';

const PROTOCOL_OPTIONS = getProtocolOptions().map(p => ({
  value: p.value,
  label: `${p.label} - ${p.description}`,
}));

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function IntermittentFastingCalculator() {
  const [protocol, setProtocol] = React.useState<FastingProtocol>('16:8');
  const [startTimeStr, setStartTimeStr] = React.useState('20:00');
  const [customHours, setCustomHours] = React.useState(16);
  const [results, setResults] = React.useState<FastingResults | null>(null);

  const calculate = React.useCallback(() => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    const result = calculateFasting({
      protocol,
      startTime,
      customFastHours: protocol === 'custom' ? customHours : undefined,
    });
    setResults(result);
  }, [protocol, startTimeStr, customHours]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const statusColors = {
    fasting: 'bg-orange-100 text-orange-800',
    eating: 'bg-green-100 text-green-800',
  };

  return (
    <CalculatorBase
      title="Intermittent Fasting Timer"
      description="Track your fasting window and see when you can eat"
      onCalculate={calculate}
      onReset={() => { setProtocol('16:8'); setStartTimeStr('20:00'); setCustomHours(16); }}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Current Status" value={results.currentStatus === 'fasting' ? 'Fasting' : 'Eating Window'} highlight />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[results.currentStatus])}>
              {results.hoursRemaining}h {results.minutesRemaining}m remaining
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className={cn('h-full transition-all', results.currentStatus === 'fasting' ? 'bg-orange-500' : 'bg-green-500')}
              style={{ width: `${results.percentComplete}%` }}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">{results.percentComplete}% complete</p>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Fast Ends" value={formatTime(results.fastEndTime)} />
            <ResultDisplay label="Eating Window Ends" value={formatTime(results.eatingWindowEnd)} />
            <ResultDisplay label="Fasting Hours" value={results.fastingHours} unit="hours" />
            <ResultDisplay label="Eating Hours" value={results.eatingHours} unit="hours" />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Fasting Phases</h4>
            <div className="space-y-2">
              {results.phases.filter(p => p.startHour <= results.fastingHours).map((phase, i) => (
                <div key={i} className={cn('flex justify-between text-sm p-2 rounded', phase.reached ? 'bg-green-50' : 'bg-muted/50')}>
                  <span className="font-medium">{phase.name} ({phase.startHour}h)</span>
                  <span className="text-muted-foreground text-xs">{phase.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <SelectInput id="protocol" label="Fasting Protocol" value={protocol} onChange={(v) => setProtocol(v as FastingProtocol)} options={PROTOCOL_OPTIONS} required />

      <div className="space-y-2">
        <label htmlFor="startTime" className="text-sm font-medium">Fast Start Time (last meal)</label>
        <input
          type="time"
          id="startTime"
          value={startTimeStr}
          onChange={(e) => setStartTimeStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {protocol === 'custom' && (
        <NumberInput id="customHours" label="Custom Fasting Hours" value={customHours} onChange={setCustomHours} min={12} max={23} unit="hours" />
      )}
    </CalculatorBase>
  );
}

export default IntermittentFastingCalculator;
