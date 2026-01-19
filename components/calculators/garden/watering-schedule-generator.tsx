'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';

const wateringSchema = z.object({
  plantType: z.string(),
  soilType: z.string(),
  sunExposure: z.string(),
  season: z.string(),
  containerType: z.string(),
});

type WateringInputs = z.infer<typeof wateringSchema>;

interface WateringResult {
  frequency: string;
  amount: string;
  bestTime: string;
  tips: string[];
  schedule: { day: string; water: boolean }[];
}

const INITIAL_INPUTS: WateringInputs = {
  plantType: 'vegetables',
  soilType: 'loam',
  sunExposure: 'full-sun',
  season: 'summer',
  containerType: 'ground',
};

const PLANT_TYPE_OPTIONS = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'flowers', label: 'Annual Flowers' },
  { value: 'perennials', label: 'Perennials' },
  { value: 'succulents', label: 'Succulents/Cacti' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'lawn', label: 'Lawn/Grass' },
  { value: 'trees', label: 'Trees & Shrubs' },
  { value: 'houseplants', label: 'Houseplants' },
];

const SOIL_TYPE_OPTIONS = [
  { value: 'sandy', label: 'Sandy (drains fast)' },
  { value: 'loam', label: 'Loam (balanced)' },
  { value: 'clay', label: 'Clay (retains water)' },
  { value: 'potting-mix', label: 'Potting Mix' },
];

const SUN_EXPOSURE_OPTIONS = [
  { value: 'full-sun', label: 'Full Sun (6+ hours)' },
  { value: 'partial-sun', label: 'Partial Sun (3-6 hours)' },
  { value: 'shade', label: 'Shade (< 3 hours)' },
];

const SEASON_OPTIONS = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
];

const CONTAINER_OPTIONS = [
  { value: 'ground', label: 'In-Ground' },
  { value: 'raised-bed', label: 'Raised Bed' },
  { value: 'container', label: 'Container/Pot' },
  { value: 'hanging', label: 'Hanging Basket' },
];

function generateWateringSchedule(inputs: WateringInputs): WateringResult {
  const { plantType, soilType, sunExposure, season, containerType } = inputs;

  // Base frequency (days between watering)
  let baseDays = 3;
  
  // Adjust for plant type
  const plantAdjust: Record<string, number> = {
    'vegetables': -1,
    'flowers': -1,
    'perennials': 0,
    'succulents': 4,
    'herbs': 0,
    'lawn': -1,
    'trees': 2,
    'houseplants': 1,
  };
  baseDays += plantAdjust[plantType] || 0;

  // Adjust for soil type
  const soilAdjust: Record<string, number> = {
    'sandy': -1,
    'loam': 0,
    'clay': 1,
    'potting-mix': 0,
  };
  baseDays += soilAdjust[soilType] || 0;

  // Adjust for sun exposure
  if (sunExposure === 'full-sun') baseDays -= 1;
  if (sunExposure === 'shade') baseDays += 1;

  // Adjust for season
  const seasonAdjust: Record<string, number> = {
    'spring': 0,
    'summer': -1,
    'fall': 1,
    'winter': 2,
  };
  baseDays += seasonAdjust[season] || 0;

  // Adjust for container type
  if (containerType === 'container') baseDays -= 1;
  if (containerType === 'hanging') baseDays -= 2;

  // Ensure minimum 1 day
  baseDays = Math.max(1, baseDays);

  // Generate frequency string
  let frequency: string;
  if (baseDays === 1) frequency = 'Daily';
  else if (baseDays === 2) frequency = 'Every other day';
  else if (baseDays <= 4) frequency = `Every ${baseDays} days`;
  else if (baseDays <= 7) frequency = 'Once a week';
  else frequency = `Every ${baseDays} days`;

  // Amount recommendation
  let amount: string;
  if (containerType === 'ground' || containerType === 'raised-bed') {
    amount = '1-2 inches per week';
  } else {
    amount = 'Until water drains from bottom';
  }

  // Best time
  const bestTime = season === 'summer' ? 'Early morning (6-10 AM)' : 'Morning (8-11 AM)';

  // Tips based on conditions
  const tips: string[] = [];
  if (soilType === 'sandy') tips.push('Sandy soil drains quickly - water more frequently but less at a time');
  if (soilType === 'clay') tips.push('Clay soil retains water - let it dry between waterings to prevent root rot');
  if (sunExposure === 'full-sun') tips.push('Full sun plants lose water faster through transpiration');
  if (containerType === 'hanging') tips.push('Hanging baskets dry out fastest - check daily in summer');
  if (plantType === 'succulents') tips.push('Let soil dry completely between waterings');
  if (season === 'winter') tips.push('Reduce watering in winter when plants are dormant');
  tips.push('Always check soil moisture before watering - stick finger 1-2 inches deep');

  // Generate weekly schedule
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const schedule = days.map((day, i) => ({
    day,
    water: i % baseDays === 0,
  }));

  return {
    frequency,
    amount,
    bestTime,
    tips,
    schedule,
  };
}

export function WateringScheduleGenerator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<WateringInputs, WateringResult>({
    initialInputs: INITIAL_INPUTS,
    schema: wateringSchema,
    calculate: generateWateringSchedule,
    storageKey: 'watering-schedule-generator',
  });

  React.useEffect(() => {
    calculate();
  }, []);

  return (
    <CalculatorBase
      title="Watering Schedule Generator"
      description="Generate a customized watering schedule based on your plants and conditions"
      formula="Frequency adjusted for plant type, soil, sun, season, and container"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Watering Frequency"
                value={results.frequency}
                highlight
              />
              <ResultDisplay
                label="Amount"
                value={results.amount}
              />
            </div>

            <ResultDisplay
              label="Best Time to Water"
              value={results.bestTime}
            />

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Weekly Schedule</p>
              <div className="flex gap-2 justify-between">
                {results.schedule.map((day) => (
                  <div
                    key={day.day}
                    className={`flex flex-col items-center p-2 rounded ${
                      day.water ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted/50'
                    }`}
                  >
                    <span className="text-xs font-medium">{day.day}</span>
                    <span className="text-lg">{day.water ? '💧' : '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Tips for Your Conditions</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                {results.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="plantType"
        label="Plant Type"
        value={inputs.plantType}
        onChange={(v) => setInput('plantType', v)}
        options={PLANT_TYPE_OPTIONS}
      />

      <SelectInput
        id="containerType"
        label="Growing Location"
        value={inputs.containerType}
        onChange={(v) => setInput('containerType', v)}
        options={CONTAINER_OPTIONS}
      />

      <SelectInput
        id="soilType"
        label="Soil Type"
        value={inputs.soilType}
        onChange={(v) => setInput('soilType', v)}
        options={SOIL_TYPE_OPTIONS}
      />

      <SelectInput
        id="sunExposure"
        label="Sun Exposure"
        value={inputs.sunExposure}
        onChange={(v) => setInput('sunExposure', v)}
        options={SUN_EXPOSURE_OPTIONS}
      />

      <SelectInput
        id="season"
        label="Current Season"
        value={inputs.season}
        onChange={(v) => setInput('season', v)}
        options={SEASON_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default WateringScheduleGenerator;
