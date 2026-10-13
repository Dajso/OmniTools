'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';

const sunShadeSchema = z.object({
  latitude: z.number().min(0).max(90),
  month: z.number().min(1).max(12),
  obstacleHeight: z.number().min(0).max(100),
  distanceFromObstacle: z.number().min(0.5).max(200),
  obstacleDirection: z.enum(['north', 'south', 'east', 'west']),
});

type SunShadeInputs = z.infer<typeof sunShadeSchema>;

interface SunShadeResult {
  sunHours: number;
  shadowLength: number;
  morningShade: string;
  afternoonShade: string;
  recommendation: string;
  sunCategory: 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';
  bestPlants: string[];
}

const INITIAL_INPUTS: SunShadeInputs = {
  latitude: 58,
  month: 6,
  obstacleHeight: 6,
  distanceFromObstacle: 5,
  obstacleDirection: 'south',
};

const MONTH_OPTIONS = [
  { value: '1', label: 'Januar' },
  { value: '2', label: 'Februar' },
  { value: '3', label: 'Mars' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mai' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const DIRECTION_OPTIONS = [
  { value: 'north', label: 'Nord for hagen' },
  { value: 'south', label: 'Sør for hagen' },
  { value: 'east', label: 'Øst for hagen' },
  { value: 'west', label: 'Vest for hagen' },
];

// Solens deklinasjon midt i måneden (grader)
function getDeclination(month: number): number {
  const dayOfYear = Math.round((month - 0.5) * 30.4);
  return 23.44 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);
}

// Solhøyde ved solhøyeste punkt (grader), minimum 0,5° for å unngå uendelig skygge
function getSunAngle(latitude: number, month: number): number {
  const sunAngle = 90 - Math.abs(latitude - getDeclination(month));
  return Math.max(0.5, Math.min(90, sunAngle));
}

// Lengden på dagen i timer (inkluderer midnattssol og mørketid)
function getDaylightHours(latitude: number, month: number): number {
  const phi = (latitude * Math.PI) / 180;
  const delta = (getDeclination(month) * Math.PI) / 180;
  const x = -Math.tan(phi) * Math.tan(delta);
  if (x >= 1) return 0;
  if (x <= -1) return 24;
  return (24 / Math.PI) * Math.acos(x);
}

function calculateSunShade(inputs: SunShadeInputs): SunShadeResult {
  const { latitude, month, obstacleHeight, distanceFromObstacle, obstacleDirection } = inputs;

  // Calculate sun angle at solar noon
  const sunAngle = getSunAngle(latitude, month);
  const sunAngleRad = (sunAngle * Math.PI) / 180;

  // Calculate shadow length at solar noon
  const shadowLength = obstacleHeight / Math.tan(sunAngleRad);

  // Determine if garden is in shadow
  const inShadow = shadowLength > distanceFromObstacle;

  // Anslå soltimer ut fra retning og skygge
  let baseSunHours = Math.min(16, getDaylightHours(latitude, month));

  // Adjust for obstacle direction
  let morningShade = 'Ingen';
  let afternoonShade = 'Ingen';

  if (obstacleDirection === 'east') {
    morningShade = inShadow ? 'Mye skygge til utpå formiddagen' : 'Litt skygge tidlig om morgenen';
    baseSunHours -= inShadow ? 3 : 1;
  } else if (obstacleDirection === 'west') {
    afternoonShade = inShadow ? 'Mye skygge fra midt på ettermiddagen' : 'Litt skygge sent på ettermiddagen';
    baseSunHours -= inShadow ? 3 : 1;
  } else if (obstacleDirection === 'south' && latitude > 0) {
    // In northern hemisphere, south-facing obstacles block most sun
    baseSunHours -= inShadow ? 6 : 2;
    morningShade = inShadow ? 'Delvis skygge' : 'Ingen';
    afternoonShade = inShadow ? 'Delvis skygge' : 'Ingen';
  } else if (obstacleDirection === 'north' && latitude > 0) {
    // North obstacles have minimal impact in northern hemisphere
    baseSunHours -= 0.5;
  }

  const sunHours = Math.max(0, Math.min(14, baseSunHours));

  // Categorize sun exposure
  let sunCategory: SunShadeResult['sunCategory'];
  let recommendation: string;
  let bestPlants: string[];

  if (sunHours >= 6) {
    sunCategory = 'full-sun';
    recommendation = 'Utmerket for solkjære grønnsaker og blomster';
    bestPlants = ['Tomat', 'Paprika', 'Squash', 'Roser', 'Lavendel'];
  } else if (sunHours >= 4) {
    sunCategory = 'partial-sun';
    recommendation = 'Passer for mange grønnsaker og blomsterplanter';
    bestPlants = ['Salat', 'Bønner', 'Urter', 'Fuchsia', 'Begonia'];
  } else if (sunHours >= 2) {
    sunCategory = 'partial-shade';
    recommendation = 'Best for planter som tåler skygge';
    bestPlants = ['Spinat', 'Grønnkål', 'Hosta', 'Bregner', 'Prydspirea'];
  } else {
    sunCategory = 'full-shade';
    recommendation = 'Bare skyggeplanter klarer seg';
    bestPlants = ['Moser', 'Bregner', 'Hosta', 'Liljekonvall'];
  }

  return {
    sunHours: Math.round(sunHours * 10) / 10,
    shadowLength: Math.round(shadowLength * 10) / 10,
    morningShade,
    afternoonShade,
    recommendation,
    sunCategory,
    bestPlants,
  };
}

export function SunShadeMapper() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<SunShadeInputs, SunShadeResult>({
    initialInputs: INITIAL_INPUTS,
    schema: sunShadeSchema,
    calculate: calculateSunShade,
    storageKey: 'sun-shade-mapper',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const CATEGORY_LABELS: Record<SunShadeResult['sunCategory'], string> = {
    'full-sun': 'Full sol',
    'partial-sun': 'Mye sol',
    'partial-shade': 'Halvskygge',
    'full-shade': 'Full skygge',
  };

  const categoryColors = {
    'full-sun': 'bg-yellow-100 text-yellow-800',
    'partial-sun': 'bg-orange-100 text-orange-800',
    'partial-shade': 'bg-blue-100 text-blue-800',
    'full-shade': 'bg-gray-100 text-gray-800',
  };

  return (
    <CalculatorBase
      title="Sol og skygge i hagen"
      description="Anslå hvor mye sol hagen din får, ut fra trær, hus og andre hindringer i nærheten"
      formula="Skyggelengde = høyde på hinderet ÷ tan(solhøyde)"
      formulaExplanation="Regner ut skyggen hinderet kaster ved solhøyeste punkt gjennom året. Resultatet er et grovt anslag"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${categoryColors[results.sunCategory]}`}>
              <p className="text-lg font-medium">
                {CATEGORY_LABELS[results.sunCategory]}
              </p>
              <p className="text-sm mt-1">{results.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Anslått soltid"
                value={results.sunHours}
                unit="timer/dag"
                highlight
              />
              <ResultDisplay
                label="Skyggelengde ved middagstid"
                value={results.shadowLength}
                unit="m"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Morgen"
                value={results.morningShade}
              />
              <ResultDisplay
                label="Ettermiddag"
                value={results.afternoonShade}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Passende planter</p>
              <div className="flex flex-wrap gap-2">
                {results.bestPlants.map((plant) => (
                  <span
                    key={plant}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                  >
                    {plant}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      }
    >
      <NumberInput
        id="latitude"
        label="Breddegrad (Norge: ca. 58–71 °N)"
        value={inputs.latitude}
        onChange={(v) => setInput('latitude', v)}
        min={0}
        max={90}
        step={1}
        unit="°"
        error={errors.latitude}
        required
      />

      <SelectInput
        id="month"
        label="Måned"
        value={inputs.month.toString()}
        onChange={(v) => setInput('month', parseInt(v))}
        options={MONTH_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="obstacleHeight"
          label="Høyde på hinderet"
          value={inputs.obstacleHeight}
          onChange={(v) => setInput('obstacleHeight', v)}
          min={0}
          max={200}
          step={0.5}
          unit="m"
          error={errors.obstacleHeight}
        />
        <NumberInput
          id="distanceFromObstacle"
          label="Avstand til hinderet"
          value={inputs.distanceFromObstacle}
          onChange={(v) => setInput('distanceFromObstacle', v)}
          min={0.5}
          max={200}
          step={0.5}
          unit="m"
          error={errors.distanceFromObstacle}
        />
      </div>

      <SelectInput
        id="obstacleDirection"
        label="Hinderet ligger"
        value={inputs.obstacleDirection}
        onChange={(v) => setInput('obstacleDirection', v as SunShadeInputs['obstacleDirection'])}
        options={DIRECTION_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default SunShadeMapper;
