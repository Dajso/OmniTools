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
  return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false });
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
      title="Tidsstyrt spising (intermittent faste)"
      description="Følg fastevinduet ditt og se når du kan spise"
      onCalculate={calculate}
      onReset={() => { setProtocol('16:8'); setStartTimeStr('20:00'); setCustomHours(16); }}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Status nå" value={results.currentStatus === 'fasting' ? 'Faster' : 'Spisevindu'} highlight />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[results.currentStatus])}>
              {results.hoursRemaining}h {results.minutesRemaining}min igjen
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className={cn('h-full transition-all', results.currentStatus === 'fasting' ? 'bg-orange-500' : 'bg-green-500')}
              style={{ width: `${results.percentComplete}%` }}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">{results.percentComplete}% fullført</p>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Fasten slutter" value={formatTime(results.fastEndTime)} />
            <ResultDisplay label="Spisevinduet slutter" value={formatTime(results.eatingWindowEnd)} />
            <ResultDisplay label="Timer faste" value={results.fastingHours} unit="timer" />
            <ResultDisplay label="Timer med spising" value={results.eatingHours} unit="timer" />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Faser i fasten</h4>
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
      <SelectInput id="protocol" label="Fasteprotokoll" value={protocol} onChange={(v) => setProtocol(v as FastingProtocol)} options={PROTOCOL_OPTIONS} required />

      <div className="space-y-2">
        <label htmlFor="startTime" className="text-sm font-medium">Starttid for fasten (siste måltid)</label>
        <input
          type="time"
          id="startTime"
          value={startTimeStr}
          onChange={(e) => setStartTimeStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {protocol === 'custom' && (
        <NumberInput id="customHours" label="Egendefinerte timer faste" value={customHours} onChange={setCustomHours} min={12} max={23} unit="timer" />
      )}
    </CalculatorBase>
  );
}

export default IntermittentFastingCalculator;
