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
  { value: 'vegetables', label: 'Grønnsaker' },
  { value: 'flowers', label: 'Ettårige blomster' },
  { value: 'perennials', label: 'Stauder' },
  { value: 'succulents', label: 'Sukkulenter og kaktus' },
  { value: 'herbs', label: 'Urter' },
  { value: 'lawn', label: 'Plen' },
  { value: 'trees', label: 'Trær og busker' },
  { value: 'houseplants', label: 'Stueplanter' },
];

const SOIL_TYPE_OPTIONS = [
  { value: 'sandy', label: 'Sandjord (tørker raskt ut)' },
  { value: 'loam', label: 'Matjord (balansert)' },
  { value: 'clay', label: 'Leirjord (holder på vannet)' },
  { value: 'potting-mix', label: 'Pottejord' },
];

const SUN_EXPOSURE_OPTIONS = [
  { value: 'full-sun', label: 'Full sol (over 6 timer)' },
  { value: 'partial-sun', label: 'Halvskygge (3–6 timer sol)' },
  { value: 'shade', label: 'Skygge (under 3 timer sol)' },
];

const SEASON_OPTIONS = [
  { value: 'spring', label: 'Vår' },
  { value: 'summer', label: 'Sommer' },
  { value: 'fall', label: 'Høst' },
  { value: 'winter', label: 'Vinter' },
];

const CONTAINER_OPTIONS = [
  { value: 'ground', label: 'Åpent bed' },
  { value: 'raised-bed', label: 'Plantekasse / høybed' },
  { value: 'container', label: 'Potte eller kasse' },
  { value: 'hanging', label: 'Hengende potte' },
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
  if (baseDays === 1) frequency = 'Hver dag';
  else if (baseDays === 2) frequency = 'Annenhver dag';
  else if (baseDays <= 4) frequency = `Hver ${baseDays}. dag`;
  else if (baseDays <= 7) frequency = 'Én gang i uka';
  else frequency = `Hver ${baseDays}. dag`;

  // Amount recommendation
  let amount: string;
  if (containerType === 'ground' || containerType === 'raised-bed') {
    amount = '10–20 mm (10–20 liter per m²) per uke, medregnet regn';
  } else {
    amount = 'Til vannet renner ut i bunnen';
  }

  // Best time
  const bestTime = season === 'summer' ? 'Tidlig morgen (kl. 06–10)' : 'Formiddag (kl. 08–11)';

  // Tips based on conditions
  const tips: string[] = [];
  if (soilType === 'sandy') tips.push('Sandjord tørker raskt ut – vann oftere, men mindre om gangen');
  if (soilType === 'clay') tips.push('Leirjord holder på vannet – la jorda tørke litt mellom hver vanning så ikke røttene råtner');
  if (sunExposure === 'full-sun') tips.push('Planter i full sol mister vann raskere gjennom fordamping');
  if (containerType === 'hanging') tips.push('Hengende potter tørker raskest ut – sjekk hver dag om sommeren');
  if (plantType === 'succulents') tips.push('La jorda tørke helt ut mellom hver vanning');
  if (season === 'winter') tips.push('Vann mindre om vinteren når plantene hviler');
  tips.push('Kjenn alltid etter i jorda før du vanner – stikk en finger 3–5 cm ned');

  // Generate weekly schedule
  const days = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
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
  }, [calculate]);

  return (
    <CalculatorBase
      title="Vanningsplan"
      description="Lag en vanningsplan tilpasset plantene og forholdene dine"
      formula="Hyppighet justert for planter, jord, sol, årstid og dyrkingssted"
      formulaExplanation="Veiledende anbefaling. Ta hensyn til nedbør, og kjenn alltid etter i jorda før du vanner"
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
                label="Hvor ofte"
                value={results.frequency}
                highlight
              />
              <ResultDisplay
                label="Mengde"
                value={results.amount}
              />
            </div>

            <ResultDisplay
              label="Beste tidspunkt"
              value={results.bestTime}
            />

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Ukeplan</p>
              <div className="flex gap-2 justify-between">
                {results.schedule.map((day) => (
                  <div
                    key={day.day}
                    className={`flex flex-col items-center p-2 rounded ${day.water ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted/50'
                      }`}
                  >
                    <span className="text-xs font-medium">{day.day}</span>
                    <span className="text-lg">{day.water ? '💧' : '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Tips for dine forhold</p>
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
        label="Type planter"
        value={inputs.plantType}
        onChange={(v) => setInput('plantType', v)}
        options={PLANT_TYPE_OPTIONS}
      />

      <SelectInput
        id="containerType"
        label="Dyrkingssted"
        value={inputs.containerType}
        onChange={(v) => setInput('containerType', v)}
        options={CONTAINER_OPTIONS}
      />

      <SelectInput
        id="soilType"
        label="Jordtype"
        value={inputs.soilType}
        onChange={(v) => setInput('soilType', v)}
        options={SOIL_TYPE_OPTIONS}
      />

      <SelectInput
        id="sunExposure"
        label="Solforhold"
        value={inputs.sunExposure}
        onChange={(v) => setInput('sunExposure', v)}
        options={SUN_EXPOSURE_OPTIONS}
      />

      <SelectInput
        id="season"
        label="Årstid"
        value={inputs.season}
        onChange={(v) => setInput('season', v)}
        options={SEASON_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default WateringScheduleGenerator;
