'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  calculateSchengenDays,
  SCHENGEN_COUNTRIES,
  type TravelPeriod,
  type SchengenResult 
} from '@/lib/calculations/travel/schengen-calculator';
import { Plus, Trash2, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface TravelEntry {
  id: string;
  entryDate: string;
  exitDate: string;
}

const createEmptyEntry = (): TravelEntry => ({
  id: crypto.randomUUID(),
  entryDate: '',
  exitDate: '',
});

export function SchengenCalculator() {
  const [entries, setEntries] = React.useState<TravelEntry[]>([createEmptyEntry()]);
  const [referenceDate, setReferenceDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [results, setResults] = React.useState<SchengenResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addEntry = () => {
    setEntries(prev => [...prev, createEmptyEntry()]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof TravelEntry, value: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const validEntries: TravelPeriod[] = entries
        .filter(e => e.entryDate && e.exitDate)
        .map(e => ({
          entryDate: new Date(e.entryDate),
          exitDate: new Date(e.exitDate),
        }));

      if (validEntries.length === 0) {
        setResults(null);
        return;
      }

      const result = calculateSchengenDays(validEntries, new Date(referenceDate));
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [entries, referenceDate]);

  const reset = () => {
    setEntries([createEmptyEntry()]);
    setReferenceDate(new Date().toISOString().split('T')[0]);
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <CalculatorBase
      title="Schengen Visa Calculator"
      description="Calculate your remaining days under the 90/180 Schengen visa rule"
      formula="Max 90 days in any 180-day rolling window"
      formulaExplanation="The Schengen Area allows visa-free stays of up to 90 days within any 180-day period"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Days Used" 
              value={results.daysUsed} 
              unit="days"
              highlight={results.daysUsed > 80}
              copyable 
            />
            <ResultDisplay 
              label="Days Remaining" 
              value={results.daysRemaining} 
              unit="days"
              highlight 
              copyable 
            />
          </div>
          
          {results.isOverstay && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Warning: You have exceeded the 90-day limit!</span>
            </div>
          )}
          
          {!results.isOverstay && results.daysRemaining > 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">You are within the allowed stay period</span>
            </div>
          )}

          {results.mustExitBy && (
            <ResultDisplay 
              label="Must Exit By" 
              value={formatDate(results.mustExitBy)}
            />
          )}

          {/* Visual Timeline */}
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Days in Schengen (Last 30 days → Next 30 days)
            </p>
            <div className="h-16 bg-muted rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-end">
                {results.timeline.slice(0, 61).map((point, index) => {
                  const height = (point.daysInSchengen / 90) * 100;
                  const isToday = index === 30;
                  return (
                    <div
                      key={index}
                      className={`flex-1 transition-all ${
                        point.daysInSchengen > 90 
                          ? 'bg-destructive' 
                          : point.daysInSchengen > 80 
                            ? 'bg-yellow-500' 
                            : 'bg-primary'
                      } ${isToday ? 'ring-2 ring-foreground' : ''}`}
                      style={{ height: `${Math.min(height, 100)}%` }}
                      title={`${formatDate(point.date)}: ${point.daysInSchengen} days`}
                    />
                  );
                })}
              </div>
              {/* 90-day limit line */}
              <div 
                className="absolute w-full border-t-2 border-dashed border-destructive"
                style={{ bottom: '100%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-30 days</span>
              <span>Today</span>
              <span>+30 days</span>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Reference Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="reference-date">
            Reference Date (Today)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="reference-date"
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>

        {/* Travel Entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Travel History</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addEntry}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Trip
            </Button>
          </div>

          {entries.map((entry, index) => (
            <Card key={entry.id} className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trip {index + 1}</span>
                  {entries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(entry.id)}
                      aria-label={`Remove trip ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label 
                      className="text-xs text-muted-foreground"
                      htmlFor={`entry-${entry.id}`}
                    >
                      Entry Date
                    </label>
                    <input
                      id={`entry-${entry.id}`}
                      type="date"
                      value={entry.entryDate}
                      onChange={(e) => updateEntry(entry.id, 'entryDate', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label 
                      className="text-xs text-muted-foreground"
                      htmlFor={`exit-${entry.id}`}
                    >
                      Exit Date
                    </label>
                    <input
                      id={`exit-${entry.id}`}
                      type="date"
                      value={entry.exitDate}
                      onChange={(e) => updateEntry(entry.id, 'exitDate', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Schengen Countries Reference */}
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            View Schengen Area Countries ({SCHENGEN_COUNTRIES.length})
          </summary>
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <div className="flex flex-wrap gap-2">
              {SCHENGEN_COUNTRIES.map(country => (
                <span 
                  key={country.code}
                  className="px-2 py-1 bg-background rounded text-xs"
                >
                  {country.name}
                </span>
              ))}
            </div>
          </div>
        </details>
      </div>
    </CalculatorBase>
  );
}

export default SchengenCalculator;
