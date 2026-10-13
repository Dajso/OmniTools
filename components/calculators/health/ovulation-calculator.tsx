'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateOvulation, type OvulationResults } from '@/lib/calculations/health/ovulation';
import { cn } from '@/lib/utils';

function formatDate(date: Date): string {
  return date.toLocaleDateString('nb-NO', { weekday: 'short', month: 'short', day: 'numeric' });
}

const DAY_COLORS = {
  period: 'bg-red-200 text-red-800',
  fertile: 'bg-pink-200 text-pink-800',
  ovulation: 'bg-purple-300 text-purple-900',
  safe: 'bg-gray-100 text-gray-600',
};

export function OvulationCalculator() {
  const [dateStr, setDateStr] = React.useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = React.useState(28);
  const [periodLength, setPeriodLength] = React.useState(5);
  const [results, setResults] = React.useState<OvulationResults | null>(null);

  const calculate = React.useCallback(() => {
    try {
      const result = calculateOvulation({
        lastPeriodDate: new Date(dateStr),
        cycleLength,
        periodLength,
      });
      setResults(result);
    } catch (e) {
      console.error(e);
    }
  }, [dateStr, cycleLength, periodLength]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Eggløsningskalender"
      description="Regn ut det fruktbare vinduet og eggløsningsdato"
      onCalculate={calculate}
      onReset={() => { setDateStr(new Date().toISOString().split('T')[0]); setCycleLength(28); setPeriodLength(5); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Eggløsning" value={formatDate(results.ovulationDate)} highlight copyable />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Fruktbart vindu starter" value={formatDate(results.fertileWindowStart)} />
            <ResultDisplay label="Fruktbart vindu slutter" value={formatDate(results.fertileWindowEnd)} />
            <ResultDisplay label="Neste menstruasjon" value={formatDate(results.nextPeriodDate)} />
            <ResultDisplay label="Nåværende syklusdag" value={results.cycleDay} />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Sykluskalender</h4>
            <div className="flex flex-wrap gap-1">
              {results.safeDays.map((day, i) => (
                <div
                  key={i}
                  className={cn('w-8 h-8 flex items-center justify-center rounded text-xs font-medium', DAY_COLORS[day.type])}
                  title={`Dag ${i + 1}: ${day.type}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200" /> Menstruasjon</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-pink-200" /> Fruktbar</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-300" /> Eggløsning</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100" /> Lite fruktbar</span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Det fruktbare vinduet er vanligvis 5 dager før eggløsning og 1 dag etter. Eggløsningen kommer som regel ca. 14 dager før neste menstruasjon. Kalkulatoren er et anslag og er ikke egnet som prevensjon.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-2">
        <label htmlFor="lastPeriod" className="text-sm font-medium">Første dag i siste menstruasjon</label>
        <input
          type="date"
          id="lastPeriod"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <NumberInput id="cycleLength" label="Gjennomsnittlig sykluslengde" value={cycleLength} onChange={setCycleLength} min={21} max={40} unit="dager" required />
      <NumberInput id="periodLength" label="Menstruasjonens lengde" value={periodLength} onChange={setPeriodLength} min={2} max={10} unit="dager" />
    </CalculatorBase>
  );
}

export default OvulationCalculator;
