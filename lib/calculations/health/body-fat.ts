/**
 * Body Fat Percentage Calculator (Navy Method)
 * 
 * Estimates body fat percentage using the US Navy formula.
 * 
 * @module lib/calculations/health/body-fat
 * @see Requirements 6.11
 */

export type BiologicalSex = 'male' | 'female';

export interface BodyFatInputs {
  sex: BiologicalSex;
  height: number; // inches or cm
  waist: number;  // inches or cm (at navel for men, narrowest for women)
  neck: number;   // inches or cm
  hip?: number;   // inches or cm (women only)
  unit: 'imperial' | 'metric';
}

export interface BodyFatResults {
  bodyFatPercent: number;
  category: string;
  fatMass: number;
  leanMass: number;
  idealRange: { min: number; max: number };
}

const CATEGORIES_MALE = [
  { max: 6, label: 'Essential Fat' },
  { max: 14, label: 'Athletes' },
  { max: 18, label: 'Fitness' },
  { max: 25, label: 'Average' },
  { max: 100, label: 'Obese' },
];

const CATEGORIES_FEMALE = [
  { max: 14, label: 'Essential Fat' },
  { max: 21, label: 'Athletes' },
  { max: 25, label: 'Fitness' },
  { max: 32, label: 'Average' },
  { max: 100, label: 'Obese' },
];

export function calculateBodyFat(inputs: BodyFatInputs): BodyFatResults {
  const { sex, height, waist, neck, hip, unit } = inputs;

  // Convert to inches if metric
  const heightIn = unit === 'metric' ? height / 2.54 : height;
  const waistIn = unit === 'metric' ? waist / 2.54 : waist;
  const neckIn = unit === 'metric' ? neck / 2.54 : neck;
  const hipIn = hip ? (unit === 'metric' ? hip / 2.54 : hip) : 0;

  let bodyFatPercent: number;

  if (sex === 'male') {
    // Navy formula for men: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
    bodyFatPercent = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
  } else {
    // Navy formula for women: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
    if (!hipIn) throw new Error('Hip measurement required for women');
    bodyFatPercent = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
  }

  bodyFatPercent = Math.max(0, Math.round(bodyFatPercent * 10) / 10);

  // Determine category
  const categories = sex === 'male' ? CATEGORIES_MALE : CATEGORIES_FEMALE;
  const category = categories.find(c => bodyFatPercent <= c.max)?.label || 'Unknown';

  // Ideal range
  const idealRange = sex === 'male' 
    ? { min: 10, max: 20 }
    : { min: 18, max: 28 };

  return {
    bodyFatPercent,
    category,
    fatMass: 0, // Would need weight to calculate
    leanMass: 0,
    idealRange,
  };
}
