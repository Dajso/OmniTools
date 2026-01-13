'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateDueDate, type CalculationMethod, type DueDateResults } from '@/lib/calculations/health/due-date';

const METHOD_OPTIONS = [
  { value: 'lmp', label: 'Last Menstrual Period (LMP)' },
  { value: 'conception', label: 'Conception Date' },
  { value: 'ultrasound', label: 'Ultrasound Due Date' },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function DueDateCalculator() {
  const [dateStr, setDateStr] = React.useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = React.useState<CalculationMethod>('lmp');
  const [cycleLength, setCycleLength] = React.useState(28);
  const [results, setResults] = React.useState<DueDateResults | null>(null);

  const calculate = () => {
    try {
      const result = calculateDueDate({ date: new Date(dateStr), method, cycleLength });
      setResults(result);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => { calculate(); }, [dateStr, method, cycleLength]);

  return (
    <CalculatorBase
      title="Due Date Calculator"
      description="Calculate your estimated due date and pregnancy milestones"
      onCalculate={calculate}
      onReset={() => { setDateStr(new Date().toISOString().split('T')[0]); setMethod('lmp'); setCycleLength(28); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Estimated Due Date" value={formatDate(results.dueDate)} highlight copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Current Week" value={`Week ${results.currentWeek}, Day ${results.currentDay}`} />
            <ResultDisplay label="Trimester" value={`${results.trimester}${results.trimester === 1 ? 'st' : results.trimester === 2 ? 'nd' : 'rd'}`} />
            <ResultDisplay label="Days Remaining" value={results.daysRemaining} unit="days" />
            <ResultDisplay label="Conception Date" value={formatDate(results.conceptionDate)} />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Pregnancy Milestones</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.milestones.map((m, i) => (
                <div key={i} className={`flex justify-between text-sm p-2 rounded ${results.currentWeek >= m.week ? 'bg-green-50' : 'bg-muted/50'}`}>
                  <span>Week {m.week}: {m.description}</span>
                  <span className="text-muted-foreground">{m.date.toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <SelectInput id="method" label="Calculation Method" value={method} onChange={(v) => setMethod(v as CalculationMethod)} options={METHOD_OPTIONS} required />
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">Date</label>
        <input
          type="date"
          id="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      {method === 'lmp' && (
        <NumberInput id="cycleLength" label="Average Cycle Length" value={cycleLength} onChange={setCycleLength} min={21} max={40} unit="days" />
      )}
    </CalculatorBase>
  );
}

export default DueDateCalculator;
