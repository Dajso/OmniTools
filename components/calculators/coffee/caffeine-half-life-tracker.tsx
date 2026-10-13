'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateCaffeineLevel,
  type CaffeineTrackerResults,
  type CaffeineIntake
} from '@/lib/calculations/coffee/caffeine-half-life';
import { Plus, Trash2, Coffee, AlertCircle, Clock, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for caffeine intake
 */
const caffeineIntakeSchema = z.object({
  id: z.string(),
  time: z.date(),
  caffeineMg: z.number()
    .min(1, 'Koffeinmengden må være minst 1 mg')
    .max(500, 'Koffeinmengden kan ikke være over 500 mg'),
  source: z.string().min(1, 'Kilde må oppgis'),
});

/**
 * Common caffeine sources with typical amounts
 */
const CAFFEINE_SOURCES = [
  { name: 'Espresso (enkel)', mg: 64 },
  { name: 'Espresso (dobbel)', mg: 128 },
  { name: 'Pour over (240 ml)', mg: 95 },
  { name: 'Traktekaffe (240 ml)', mg: 95 },
  { name: 'Presskanne (240 ml)', mg: 107 },
  { name: 'Cold brew (240 ml)', mg: 200 },
  { name: 'Americano', mg: 77 },
  { name: 'Cafe latte', mg: 77 },
  { name: 'Cappuccino', mg: 77 },
  { name: 'Energidrikk (250 ml)', mg: 80 },
  { name: 'Grønn te (240 ml)', mg: 28 },
  { name: 'Svart te (240 ml)', mg: 47 },
  { name: 'Cola (330 ml)', mg: 34 },
  { name: 'Mørk sjokolade (30 g)', mg: 12 },
];

/**
 * Storage key for local storage
 */
const STORAGE_KEY = 'caffeine-tracker-intakes';

/**
 * Load intakes from local storage
 */
function loadIntakesFromStorage(): CaffeineIntake[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((intake: any) => ({
      ...intake,
      time: new Date(intake.time),
    }));
  } catch (error) {
    console.error('Kunne ikke hente lagret inntak:', error);
    return [];
  }
}

/**
 * Save intakes to local storage
 */
function saveIntakesToStorage(intakes: CaffeineIntake[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(intakes));
  } catch (error) {
    console.error('Kunne ikke lagre inntak:', error);
  }
}

/**
 * Timeline visualization component
 */
function CaffeineTimeline({ timeline, currentTime }: { timeline: any[]; currentTime: Date }) {
  if (timeline.length === 0) return null;

  const maxLevel = Math.max(...timeline.map(p => p.level), 100);
  const currentIndex = timeline.findIndex(p => p.time >= currentTime);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Koffeinnivå (neste 12 timer)</h3>
      <div className="relative h-32 bg-muted/30 rounded-lg p-4 border border-border">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

          {/* Caffeine level line */}
          <polyline
            points={timeline.map((point, i) => {
              const x = (i / (timeline.length - 1)) * 100;
              const y = 100 - (point.level / maxLevel) * 100;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Current time indicator */}
          {currentIndex >= 0 && (
            <line
              x1={(currentIndex / (timeline.length - 1)) * 100}
              y1="0"
              x2={(currentIndex / (timeline.length - 1)) * 100}
              y2="100"
              stroke="hsl(var(--destructive))"
              strokeWidth="1"
              strokeDasharray="2,2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pointer-events-none">
          <span>{Math.round(maxLevel)}mg</span>
          <span>{Math.round(maxLevel * 0.5)}mg</span>
          <span>0 mg</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-primary"></div>
          <span>Koffeinnivå</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-destructive border-dashed"></div>
          <span>Nå</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Caffeine Half-Life Tracker Component
 * 
 * Tracks caffeine intake and calculates current blood levels using exponential decay.
 * Provides sleep recommendations based on current caffeine levels.
 * 
 * Features:
 * - Add caffeine intakes with time and amount
 * - Quick-add from common sources
 * - Current caffeine level display
 * - Timeline visualization
 * - Sleep recommendations
 * - Local storage persistence
 * - Intake history management
 * 
 * @see Requirements 7.1, 7.2, 7.3, 7.4, 15.1, 15.2
 */
export function CaffeineHalfLifeTracker() {
  const [intakes, setIntakes] = React.useState<CaffeineIntake[]>([]);
  const [results, setResults] = React.useState<CaffeineTrackerResults | null>(null);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // Form state for new intake
  const [newIntakeTime, setNewIntakeTime] = React.useState('');
  const [newIntakeCaffeine, setNewIntakeCaffeine] = React.useState(95);
  const [newIntakeSource, setNewIntakeSource] = React.useState('Pour over (240 ml)');
  const [selectedPreset, setSelectedPreset] = React.useState('');

  // Load intakes from storage on mount
  React.useEffect(() => {
    const stored = loadIntakesFromStorage();
    setIntakes(stored);
  }, []);

  // Current time state for live updates
  const [now, setNow] = React.useState(new Date());

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1 minute

    return () => clearInterval(timer);
  }, []);

  // Calculate results whenever intakes change or time updates
  React.useEffect(() => {
    if (intakes.length === 0) {
      setResults(null);
      setError(undefined);
      return;
    }

    try {
      const calculatedResults = calculateCaffeineLevel({
        intakes,
        currentTime: now,
      });
      setResults(calculatedResults);
      setError(undefined);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke regne ut koffeinnivået');
      setResults(null);
    }
  }, [intakes, now]);

  // Save intakes to storage whenever they change
  React.useEffect(() => {
    saveIntakesToStorage(intakes);
  }, [intakes]);

  // Set default time to now
  React.useEffect(() => {
    const now = new Date();
    const timeString = format(now, "yyyy-MM-dd'T'HH:mm");
    setNewIntakeTime(timeString);
  }, []);

  // Handle preset selection
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = CAFFEINE_SOURCES.find(s => s.name === presetName);
    if (preset) {
      setNewIntakeCaffeine(preset.mg);
      setNewIntakeSource(preset.name);
    }
  };

  // Add new intake
  const handleAddIntake = () => {
    try {
      const intake: CaffeineIntake = {
        id: Date.now().toString(),
        time: new Date(newIntakeTime),
        caffeineMg: newIntakeCaffeine,
        source: newIntakeSource,
      };

      // Validate
      caffeineIntakeSchema.parse(intake);

      // Add to intakes
      setIntakes(prev => [...prev, intake].sort((a, b) => a.time.getTime() - b.time.getTime()));

      // Reset form
      const now = new Date();
      setNewIntakeTime(format(now, "yyyy-MM-dd'T'HH:mm"));
      setError(undefined);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke legge til inntaket');
    }
  };

  // Remove intake
  const handleRemoveIntake = (id: string) => {
    setIntakes(prev => prev.filter(intake => intake.id !== id));
  };

  // Clear all intakes
  const handleClearAll = () => {
    if (confirm('Er du sikker på at du vil slette alt koffeininntak?')) {
      setIntakes([]);
      setResults(null);
      setError(undefined);
    }
  };

  // Get recommendation color
  const getRecommendationColor = (level: number) => {
    if (level < 50) return 'text-green-600 dark:text-green-400';
    if (level < 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <CalculatorBase
      title="Koffein og halveringstid"
      description="Følg med på koffeininntaket og se hvor mye koffein som er igjen i kroppen, så du sover bedre"
      formula="C(t) = C₀ × (1/2)^(t/5h)"
      formulaExplanation="Koffein brytes ned eksponentielt med en halveringstid på omtrent 5 timer. Etter 5 timer er 50 % igjen, etter 10 timer er 25 % igjen."
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Current Level */}
          <ResultDisplay
            label="Koffeinnivå nå"
            value={formatFixed(results.currentLevel, 1)}
            unit="mg"
            highlight
            copyable
          />

          {/* Sleep Recommendation */}
          <div className={`bg-muted/50 rounded-lg p-4 border border-border ${getRecommendationColor(results.currentLevel)}`}>
            <div className="flex items-start gap-3">
              <Moon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium mb-1">Anbefaling for søvn</p>
                <p className="text-sm">{results.sleepRecommendation}</p>
                {results.safeForSleepTime && (
                  <p className="text-xs mt-2 opacity-80">
                    Lavt nok for søvn kl. {format(results.safeForSleepTime, 'h:mm a')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <CaffeineTimeline timeline={results.timeline} currentTime={now} />

          {/* Half-Life Info */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3 space-y-1">
            <p className="font-medium">Om halveringstid for koffein:</p>
            <ul className="space-y-0.5 ml-4">
              <li>• Gjennomsnittlig halveringstid: 5 timer</li>
              <li>• Etter 5 timer: 50 % er igjen</li>
              <li>• Etter 10 timer: 25 % er igjen</li>
              <li>• Etter 15 timer: 12,5 % er igjen</li>
            </ul>
          </div>
        </div>
      )}
    >
      {/* Add Intake Section */}
      <div className="space-y-4 pb-4 border-b border-border">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Legg til koffeininntak
        </h3>

        {/* Quick Presets */}
        <div>
          <Label htmlFor="preset">Hurtigvalg (valgfritt)</Label>
          <select
            id="preset"
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2"
            aria-label="Velg en vanlig koffeinkilde"
            aria-describedby="preset-help"
          >
            <option value="">-- Velg en vanlig kilde --</option>
            {CAFFEINE_SOURCES.map(source => (
              <option key={source.name} value={source.name}>
                {source.name} ({source.mg}mg)
              </option>
            ))}
          </select>
          <p id="preset-help" className="sr-only">
            Velg en vanlig koffeinkilde for å fylle inn koffeinmengden automatisk
          </p>
        </div>

        {/* Time Input */}
        <div>
          <Label htmlFor="intakeTime">Tid</Label>
          <Input
            id="intakeTime"
            type="datetime-local"
            value={newIntakeTime}
            onChange={(e) => setNewIntakeTime(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            className="mt-1"
            required
            aria-required="true"
            aria-label="Klokkeslett for koffeininntak"
            aria-describedby="intakeTime-help"
          />
          <p id="intakeTime-help" className="sr-only">
            Oppgi når du drakk eller spiste koffeinet
          </p>
        </div>

        {/* Caffeine Amount */}
        <NumberInput
          id="caffeineMg"
          label="Koffeinmengde"
          value={newIntakeCaffeine}
          onChange={setNewIntakeCaffeine}
          min={1}
          max={500}
          step={1}
          unit="mg"
          required
          placeholder="95"
        />

        {/* Source Input */}
        <div>
          <Label htmlFor="source">Kilde</Label>
          <Input
            id="source"
            type="text"
            value={newIntakeSource}
            onChange={(e) => setNewIntakeSource(e.target.value)}
            placeholder="f.eks. espresso, pour over"
            className="mt-1"
            required
            aria-required="true"
            aria-label="Koffeinkilde"
            aria-describedby="source-help"
          />
          <p id="source-help" className="sr-only">
            Oppgi kilden eller typen koffeinholdig drikke
          </p>
        </div>

        {/* Add Button */}
        <Button
          type="button"
          onClick={handleAddIntake}
          className="w-full"
          disabled={!newIntakeTime || !newIntakeSource || newIntakeCaffeine <= 0}
          aria-label="Legg koffeininntaket til loggen"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Legg til
        </Button>
      </div>

      {/* Intake History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Logg over inntak ({intakes.length})
          </h3>
          {intakes.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive"
              aria-label="Slett hele loggen over koffeininntak"
            >
              Slett alt
            </Button>
          )}
        </div>

        {intakes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ingen koffeininntak er registrert ennå.</p>
            <p className="text-xs mt-1">Legg til det første inntaket ovenfor for å komme i gang.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {intakes.map(intake => (
              <div
                key={intake.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{intake.source}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(intake.time, 'MMM d, h:mm a')} • {intake.caffeineMg}mg
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveIntake(intake.id)}
                  className="text-destructive hover:text-destructive"
                  aria-label={`Fjern inntaket ${intake.source}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorBase>
  );
}

export default CaffeineHalfLifeTracker;
