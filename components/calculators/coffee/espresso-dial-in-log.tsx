'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateEspressoMetrics,
  type EspressoMetricsResults,
  type EspressoMetricsInputs
} from '@/lib/calculations/coffee/espresso-dial-in';
import { Button } from '@/components/ui/button';
import { Info, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for espresso shot entry inputs
 * Validates dose, yield, time, grind setting, and taste notes
 */
const espressoShotSchema = z.object({
  dose: z.number()
    .min(5, 'Mengden må være minst 5 g')
    .max(30, 'Mengden kan ikke være over 30 g'),
  yield: z.number()
    .min(10, 'Utbyttet må være minst 10 g')
    .max(100, 'Utbyttet kan ikke være over 100 g'),
  time: z.number()
    .min(10, 'Tiden må være minst 10 sekunder')
    .max(60, 'Tiden kan ikke være over 60 sekunder'),
  grindSetting: z.string()
    .min(1, 'Kvernstilling må oppgis')
    .max(50, 'Kvernstillingen er for lang'),
  tasteNotes: z.string()
    .max(500, 'Smaksnotatene kan ikke være over 500 tegn')
    .optional()
    .default(''),
});

type EspressoShotFormInputs = z.infer<typeof espressoShotSchema>;

/**
 * Espresso shot entry with metadata
 */
interface EspressoShot extends EspressoShotFormInputs {
  id: string;
  timestamp: Date;
  metrics: EspressoMetricsResults;
}

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: EspressoShotFormInputs = {
  dose: 18,
  yield: 36,
  time: 28,
  grindSetting: '',
  tasteNotes: '',
};

/**
 * Recommendation badge component
 */
function RecommendationBadge({ recommendation }: { recommendation: string }) {
  const colors = {
    'increase-yield': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'optimal': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'decrease-yield': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const labels = {
    'increase-yield': 'Øk utbyttet',
    'optimal': 'Optimal',
    'decrease-yield': 'Reduser utbyttet',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[recommendation as keyof typeof colors] || ''}`}>
      {labels[recommendation as keyof typeof labels] || recommendation}
    </span>
  );
}

/**
 * Espresso Dial-in Log Component
 * 
 * Tracks espresso shots with extraction metrics and recommendations.
 * Provides systematic approach to dialing in espresso recipes.
 * 
 * Features:
 * - Add shot entries with dose, yield, time, grind setting, taste notes
 * - Display shot log with extraction ratio and flow rate
 * - Show recommendations based on extraction ratio
 * - Local storage for shot history persistence
 * - Unit toggle for metric/imperial
 * - Delete individual shots
 * - Clear all history
 * - Accessible with ARIA labels and keyboard navigation
 * 
 * @see Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 15.1, 15.2
 */
export function EspressoDialInLog() {
  const [shots, setShots] = React.useState<EspressoShot[]>([]);
  const [inputs, setInputs] = React.useState<EspressoShotFormInputs>(INITIAL_INPUTS);
  const [errors, setErrors] = React.useState<Partial<Record<keyof EspressoShotFormInputs, string>>>({});
  const [currentMetrics, setCurrentMetrics] = React.useState<EspressoMetricsResults | null>(null);

  // Load shots from local storage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('espresso-dial-in-log');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const shotsWithDates = parsed.map((shot: any) => ({
          ...shot,
          timestamp: new Date(shot.timestamp),
        }));
        setShots(shotsWithDates);
      }
    } catch (error) {
      console.error('Kunne ikke hente lagrede espressoer:', error);
    }
  }, []);

  // Save shots to local storage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('espresso-dial-in-log', JSON.stringify(shots));
    } catch (error) {
      console.error('Kunne ikke lagre espressoene:', error);
    }
  }, [shots]);

  // Calculate metrics whenever inputs change
  React.useEffect(() => {
    try {
      const validated = espressoShotSchema.parse(inputs);
      const metrics = calculateEspressoMetrics({
        dose: validated.dose,
        yield: validated.yield,
        time: validated.time,
      });
      setCurrentMetrics(metrics);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof EspressoShotFormInputs, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof EspressoShotFormInputs] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      setCurrentMetrics(null);
    }
  }, [inputs]);

  // Handle input changes
  const handleInputChange = <K extends keyof EspressoShotFormInputs>(
    field: K,
    value: EspressoShotFormInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input changes with unit conversion for numeric fields
  const handleDoseChange = (value: number) => {
    const grams = value;
    handleInputChange('dose', grams);
  };

  const handleYieldChange = (value: number) => {
    const grams = value;
    handleInputChange('yield', grams);
  };

  // Add shot to log
  const handleAddShot = () => {
    try {
      const validated = espressoShotSchema.parse(inputs);
      const metrics = calculateEspressoMetrics({
        dose: validated.dose,
        yield: validated.yield,
        time: validated.time,
      });

      const newShot: EspressoShot = {
        id: `shot-${Date.now()}`,
        timestamp: new Date(),
        ...validated,
        metrics,
      };

      setShots((prev) => [newShot, ...prev]);

      // Reset form but keep grind setting for convenience
      setInputs({
        ...INITIAL_INPUTS,
        grindSetting: validated.grindSetting,
      });
    } catch (error) {
      console.error('Kunne ikke legge til espressoen:', error);
    }
  };

  // Delete shot from log
  const handleDeleteShot = (id: string) => {
    setShots((prev) => prev.filter((shot) => shot.id !== id));
  };

  // Clear all shots
  const handleClearAll = () => {
    if (confirm('Er du sikker på at du vil slette hele loggen?')) {
      setShots([]);
    }
  };

  // Visningsverdier
  const displayDose = inputs.dose.toFixed(1);

  const displayYield = inputs.yield.toFixed(1);

  const isFormValid = Object.keys(errors).length === 0 &&
    inputs.grindSetting.trim().length > 0 &&
    currentMetrics !== null;

  return (
    <CalculatorBase
      title="Espresso: innstillingslogg"
      description="Logg espressoene dine med ekstraksjonsmål og finn systematisk fram til riktig oppskrift"
      formula="Ekstraksjonsforhold = utbytte / mengde | Gjennomstrømning = utbytte / tid"
      formulaExplanation="Ekstraksjonsforholdet viser forholdet mellom kaffemengde og mengde espresso i koppen. God espresso ligger vanligvis mellom 1,5 og 2,5. Gjennomstrømningen hjelper deg å vurdere kvernstørrelse og hvordan kaffen er pakket."
    >

      {/* Shot Entry Form */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <h3 className="text-lg font-semibold">Legg til espresso</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dose Input */}
          <NumberInput
            id="dose"
            label="Kaffemengde"
            value={parseFloat(displayDose)}
            onChange={handleDoseChange}
            min={5}
            max={30}
            step={0.1}
            unit="g"
            error={errors.dose}
            required
            placeholder="18"
          />

          {/* Yield Input */}
          <NumberInput
            id="yield"
            label="Utbytte"
            value={parseFloat(displayYield)}
            onChange={handleYieldChange}
            min={10}
            max={100}
            step={0.1}
            unit="g"
            error={errors.yield}
            required
            placeholder="36"
          />

          {/* Time Input */}
          <NumberInput
            id="time"
            label="Tid"
            value={inputs.time}
            onChange={(v) => handleInputChange('time', v)}
            min={10}
            max={60}
            step={1}
            unit="s"
            error={errors.time}
            required
            placeholder="28"
          />
        </div>

        {/* Grind Setting Input */}
        <div className="space-y-2">
          <Label htmlFor="grindSetting">
            Kvernstilling <span className="text-destructive">*</span>
          </Label>
          <Input
            id="grindSetting"
            type="text"
            value={inputs.grindSetting}
            onChange={(e) => handleInputChange('grindSetting', e.target.value)}
            placeholder="f.eks. 8,5, 2–3, fin"
            maxLength={50}
            required
            aria-required="true"
            aria-invalid={!!errors.grindSetting}
            aria-describedby={errors.grindSetting ? 'grindSetting-error' : undefined}
          />
          {errors.grindSetting && (
            <p id="grindSetting-error" className="text-sm text-destructive" role="alert">
              {errors.grindSetting}
            </p>
          )}
        </div>

        {/* Taste Notes Input */}
        <div className="space-y-2">
          <Label htmlFor="tasteNotes">Smaksnotater (valgfritt)</Label>
          <Textarea
            id="tasteNotes"
            value={inputs.tasteNotes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('tasteNotes', e.target.value)}
            placeholder="f.eks. frisk syre, sjokoladetoner, litt bitter ettersmak"
            maxLength={500}
            rows={3}
            aria-describedby={errors.tasteNotes ? 'tasteNotes-error' : undefined}
          />
          {errors.tasteNotes && (
            <p id="tasteNotes-error" className="text-sm text-destructive" role="alert">
              {errors.tasteNotes}
            </p>
          )}
        </div>

        {/* Current Metrics Preview */}
        {currentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background rounded-lg border border-border">
            <ResultDisplay
              label="Ekstraksjonsforhold"
              value={formatFixed(currentMetrics.extractionRatio, 2)}
            />
            <ResultDisplay
              label="Gjennomstrømning"
              value={formatFixed(currentMetrics.flowRate, 2)}
              unit="g/s"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Vurdering</span>
              <RecommendationBadge recommendation={currentMetrics.recommendation} />
            </div>
          </div>
        )}

        {/* Add Shot Button */}
        <Button
          type="button"
          onClick={handleAddShot}
          disabled={!isFormValid}
          className="w-full"
          aria-label="Legg espressoen til i loggen"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Legg til i loggen
        </Button>
      </div>

      {/* Shot History */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Logg ({shots.length})</h3>
          {shots.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              aria-label="Slett hele loggen"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Slett alt
            </Button>
          )}
        </div>

        {shots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Ingen espressoer er logget ennå. Legg til den første ovenfor for å komme i gang!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shots.map((shot) => (
              <div
                key={shot.id}
                className="p-4 border border-border rounded-lg bg-background space-y-3"
              >
                {/* Shot Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {shot.timestamp.toLocaleString('nb-NO')}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Kverning: {shot.grindSetting}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteShot(shot.id)}
                    aria-label={`Slett espressoen fra ${shot.timestamp.toLocaleString('nb-NO')}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                {/* Shot Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mengde:</span>
                    <p className="font-medium">
                      {`${formatFixed(shot.dose, 1)} g`
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Utbytte:</span>
                    <p className="font-medium">
                      {`${formatFixed(shot.yield, 1)} g`
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tid:</span>
                    <p className="font-medium">{shot.time}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Forhold:</span>
                    <p className="font-medium">{formatFixed(shot.metrics.extractionRatio, 2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Strøm:</span>
                    <p className="font-medium">{formatFixed(shot.metrics.flowRate, 2)} g/s</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="flex items-center gap-2">
                  <RecommendationBadge recommendation={shot.metrics.recommendation} />
                </div>

                {/* Recommendation Text */}
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                      {shot.metrics.recommendationText}
                    </p>
                  </div>
                </div>

                {/* Taste Notes */}
                {shot.tasteNotes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Smaksnotater:</p>
                    <p className="text-sm text-muted-foreground">{shot.tasteNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorBase>
  );
}

export default EspressoDialInLog;
