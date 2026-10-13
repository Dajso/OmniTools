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

/**
 * Zod schema for espresso shot entry inputs
 * Validates dose, yield, time, grind setting, and taste notes
 */
const espressoShotSchema = z.object({
  dose: z.number()
    .min(5, 'Dose must be at least 5g')
    .max(30, 'Dose cannot exceed 30g'),
  yield: z.number()
    .min(10, 'Yield must be at least 10g')
    .max(100, 'Yield cannot exceed 100g'),
  time: z.number()
    .min(10, 'Time must be at least 10 seconds')
    .max(60, 'Time cannot exceed 60 seconds'),
  grindSetting: z.string()
    .min(1, 'Grind setting is required')
    .max(50, 'Grind setting is too long'),
  tasteNotes: z.string()
    .max(500, 'Taste notes cannot exceed 500 characters')
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
 * Unit conversion constants
 */
const GRAMS_TO_OZ = 0.035274;

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
    'increase-yield': 'Increase Yield',
    'optimal': 'Optimal',
    'decrease-yield': 'Decrease Yield',
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
  const [useImperial, setUseImperial] = React.useState(false);
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
      console.error('Failed to load espresso shots from storage:', error);
    }
  }, []);

  // Save shots to local storage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('espresso-dial-in-log', JSON.stringify(shots));
    } catch (error) {
      console.error('Failed to save espresso shots to storage:', error);
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
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
    handleInputChange('dose', grams);
  };

  const handleYieldChange = (value: number) => {
    const grams = useImperial ? value / GRAMS_TO_OZ : value;
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
      console.error('Failed to add shot:', error);
    }
  };

  // Delete shot from log
  const handleDeleteShot = (id: string) => {
    setShots((prev) => prev.filter((shot) => shot.id !== id));
  };

  // Clear all shots
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all shot history?')) {
      setShots([]);
    }
  };

  // Convert values for display based on unit system
  const displayDose = useImperial
    ? (inputs.dose * GRAMS_TO_OZ).toFixed(2)
    : inputs.dose.toFixed(1);

  const displayYield = useImperial
    ? (inputs.yield * GRAMS_TO_OZ).toFixed(2)
    : inputs.yield.toFixed(1);

  const isFormValid = Object.keys(errors).length === 0 &&
    inputs.grindSetting.trim().length > 0 &&
    currentMetrics !== null;

  return (
    <CalculatorBase
      title="Espresso Dial-in Log"
      description="Track your espresso shots with extraction metrics to systematically dial in your recipe"
      formula="Extraction Ratio = Yield / Dose | Flow Rate = Yield / Time"
      formulaExplanation="The extraction ratio indicates the relationship between coffee dose and beverage yield. Optimal espresso typically has a ratio between 1.5 and 2.5. Flow rate helps diagnose grind size and puck preparation."
    >
      {/* Unit toggle */}
      <div className="flex items-center justify-end gap-2 pb-2">
        <span className="text-sm text-muted-foreground">Units:</span>
        <Button
          type="button"
          variant={useImperial ? 'outline' : 'default'}
          size="sm"
          onClick={() => setUseImperial(false)}
          aria-pressed={!useImperial}
          aria-label="Use metric units"
        >
          Metric
        </Button>
        <Button
          type="button"
          variant={useImperial ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUseImperial(true)}
          aria-pressed={useImperial}
          aria-label="Use imperial units"
        >
          Imperial
        </Button>
      </div>

      {/* Shot Entry Form */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <h3 className="text-lg font-semibold">Add Shot Entry</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dose Input */}
          <NumberInput
            id="dose"
            label="Dose"
            value={parseFloat(displayDose)}
            onChange={handleDoseChange}
            min={useImperial ? 0.18 : 5}
            max={useImperial ? 1.06 : 30}
            step={useImperial ? 0.01 : 0.1}
            unit={useImperial ? 'oz' : 'g'}
            error={errors.dose}
            required
            placeholder={useImperial ? '0.63' : '18'}
          />

          {/* Yield Input */}
          <NumberInput
            id="yield"
            label="Yield"
            value={parseFloat(displayYield)}
            onChange={handleYieldChange}
            min={useImperial ? 0.35 : 10}
            max={useImperial ? 3.53 : 100}
            step={useImperial ? 0.01 : 0.1}
            unit={useImperial ? 'oz' : 'g'}
            error={errors.yield}
            required
            placeholder={useImperial ? '1.27' : '36'}
          />

          {/* Time Input */}
          <NumberInput
            id="time"
            label="Time"
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
            Grind Setting <span className="text-destructive">*</span>
          </Label>
          <Input
            id="grindSetting"
            type="text"
            value={inputs.grindSetting}
            onChange={(e) => handleInputChange('grindSetting', e.target.value)}
            placeholder="e.g., 8.5, 2-3, Fine"
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
          <Label htmlFor="tasteNotes">Taste Notes (Optional)</Label>
          <Textarea
            id="tasteNotes"
            value={inputs.tasteNotes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('tasteNotes', e.target.value)}
            placeholder="e.g., Bright acidity, chocolate notes, slightly bitter finish"
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
              label="Extraction Ratio"
              value={currentMetrics.extractionRatio.toFixed(2)}
            />
            <ResultDisplay
              label="Flow Rate"
              value={currentMetrics.flowRate.toFixed(2)}
              unit="g/s"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Assessment</span>
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
          aria-label="Add shot to log"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Add Shot to Log
        </Button>
      </div>

      {/* Shot History */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shot History ({shots.length})</h3>
          {shots.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              aria-label="Clear all shot history"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Clear All
            </Button>
          )}
        </div>

        {shots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No shots logged yet. Add your first shot above to start tracking!</p>
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
                      Grind: {shot.grindSetting}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteShot(shot.id)}
                    aria-label={`Delete shot from ${shot.timestamp.toLocaleString('nb-NO')}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                {/* Shot Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dose:</span>
                    <p className="font-medium">
                      {useImperial
                        ? `${(shot.dose * GRAMS_TO_OZ).toFixed(2)} oz`
                        : `${shot.dose.toFixed(1)} g`
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Yield:</span>
                    <p className="font-medium">
                      {useImperial
                        ? `${(shot.yield * GRAMS_TO_OZ).toFixed(2)} oz`
                        : `${shot.yield.toFixed(1)} g`
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <p className="font-medium">{shot.time}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ratio:</span>
                    <p className="font-medium">{shot.metrics.extractionRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Flow:</span>
                    <p className="font-medium">{shot.metrics.flowRate.toFixed(2)} g/s</p>
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
                    <p className="text-sm font-medium mb-1">Taste Notes:</p>
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
