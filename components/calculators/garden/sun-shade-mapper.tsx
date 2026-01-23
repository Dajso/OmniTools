'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';

const sunShadeSchema = z.object({
  latitude: z.number().min(-90).max(90),
  month: z.number().min(1).max(12),
  obstacleHeight: z.number().min(0).max(200),
  distanceFromObstacle: z.number().min(1).max(500),
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
  latitude: 40,
  month: 6,
  obstacleHeight: 20,
  distanceFromObstacle: 15,
  obstacleDirection: 'south',
};

const MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const DIRECTION_OPTIONS = [
  { value: 'north', label: 'North of garden' },
  { value: 'south', label: 'South of garden' },
  { value: 'east', label: 'East of garden' },
  { value: 'west', label: 'West of garden' },
];

// Approximate sun angle at solar noon by month and latitude
function getSunAngle(latitude: number, month: number): number {
  // Simplified calculation - declination varies from -23.5 to +23.5 degrees
  const declination = 23.5 * Math.cos((2 * Math.PI * (month - 6)) / 12);
  const sunAngle = 90 - latitude + declination;
  return Math.max(0, Math.min(90, sunAngle));
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

  // Estimate sun hours based on direction and shadow
  let baseSunHours = 14 - Math.abs(month - 6); // Varies by season

  // Adjust for obstacle direction
  let morningShade = 'None';
  let afternoonShade = 'None';

  if (obstacleDirection === 'east') {
    morningShade = inShadow ? 'Heavy shade until mid-morning' : 'Light shade early morning';
    baseSunHours -= inShadow ? 3 : 1;
  } else if (obstacleDirection === 'west') {
    afternoonShade = inShadow ? 'Heavy shade from mid-afternoon' : 'Light shade late afternoon';
    baseSunHours -= inShadow ? 3 : 1;
  } else if (obstacleDirection === 'south' && latitude > 0) {
    // In northern hemisphere, south-facing obstacles block most sun
    baseSunHours -= inShadow ? 6 : 2;
    morningShade = inShadow ? 'Partial shade' : 'None';
    afternoonShade = inShadow ? 'Partial shade' : 'None';
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
    recommendation = 'Excellent for sun-loving vegetables and flowers';
    bestPlants = ['Tomatoes', 'Peppers', 'Squash', 'Roses', 'Lavender'];
  } else if (sunHours >= 4) {
    sunCategory = 'partial-sun';
    recommendation = 'Good for many vegetables and flowering plants';
    bestPlants = ['Lettuce', 'Beans', 'Herbs', 'Impatiens', 'Begonias'];
  } else if (sunHours >= 2) {
    sunCategory = 'partial-shade';
    recommendation = 'Best for shade-tolerant plants';
    bestPlants = ['Spinach', 'Kale', 'Hostas', 'Ferns', 'Astilbe'];
  } else {
    sunCategory = 'full-shade';
    recommendation = 'Limited to deep shade plants';
    bestPlants = ['Moss', 'Ferns', 'Hostas', 'Lily of the Valley'];
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

  const categoryColors = {
    'full-sun': 'bg-yellow-100 text-yellow-800',
    'partial-sun': 'bg-orange-100 text-orange-800',
    'partial-shade': 'bg-blue-100 text-blue-800',
    'full-shade': 'bg-gray-100 text-gray-800',
  };

  return (
    <CalculatorBase
      title="Sun/Shade Mapper"
      description="Estimate sun exposure in your garden based on nearby obstacles"
      formula="Shadow Length = Obstacle Height / tan(Sun Angle)"
      formulaExplanation="Calculates shadow cast by obstacles at different times of year"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${categoryColors[results.sunCategory]}`}>
              <p className="text-lg font-medium capitalize">
                {results.sunCategory.replace('-', ' ')}
              </p>
              <p className="text-sm mt-1">{results.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Estimated Sun Hours"
                value={results.sunHours}
                unit="hours/day"
                highlight
              />
              <ResultDisplay
                label="Shadow Length at Noon"
                value={results.shadowLength}
                unit="feet"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Morning"
                value={results.morningShade}
              />
              <ResultDisplay
                label="Afternoon"
                value={results.afternoonShade}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Recommended Plants</p>
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
        label="Your Latitude"
        value={inputs.latitude}
        onChange={(v) => setInput('latitude', v)}
        min={-90}
        max={90}
        step={1}
        unit="°"
        error={errors.latitude}
        required
      />

      <SelectInput
        id="month"
        label="Month"
        value={inputs.month.toString()}
        onChange={(v) => setInput('month', parseInt(v))}
        options={MONTH_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="obstacleHeight"
          label="Obstacle Height"
          value={inputs.obstacleHeight}
          onChange={(v) => setInput('obstacleHeight', v)}
          min={0}
          max={200}
          step={1}
          unit="feet"
          error={errors.obstacleHeight}
        />
        <NumberInput
          id="distanceFromObstacle"
          label="Distance from Obstacle"
          value={inputs.distanceFromObstacle}
          onChange={(v) => setInput('distanceFromObstacle', v)}
          min={1}
          max={500}
          step={1}
          unit="feet"
          error={errors.distanceFromObstacle}
        />
      </div>

      <SelectInput
        id="obstacleDirection"
        label="Obstacle Location"
        value={inputs.obstacleDirection}
        onChange={(v) => setInput('obstacleDirection', v as SunShadeInputs['obstacleDirection'])}
        options={DIRECTION_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default SunShadeMapper;
