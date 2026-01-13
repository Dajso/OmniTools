/**
 * BAC (Blood Alcohol Content) Calculator
 * 
 * Estimates blood alcohol content based on drinks consumed.
 * 
 * @module lib/calculations/health/bac-calculator
 * @see Requirements 6.9
 */

export type BiologicalSex = 'male' | 'female';

export interface BACInputs {
  weight: number;
  unit: 'imperial' | 'metric';
  sex: BiologicalSex;
  drinks: number;
  hours: number;
  drinkType: 'beer' | 'wine' | 'spirits' | 'custom';
  customAlcoholOz?: number;
}

export interface BACResults {
  bac: number;
  status: 'sober' | 'buzzed' | 'impaired' | 'drunk' | 'dangerous';
  timeToSober: number; // hours
  legalToDrive: boolean;
  effects: string;
}

// Widmark factors
const WIDMARK_FACTOR = {
  male: 0.68,
  female: 0.55,
};

// Standard drink alcohol content in oz
const DRINK_ALCOHOL_OZ = {
  beer: 0.6,      // 12oz at 5%
  wine: 0.6,      // 5oz at 12%
  spirits: 0.6,   // 1.5oz at 40%
  custom: 0,
};

const BAC_EFFECTS: Array<{ threshold: number; status: BACResults['status']; effects: string }> = [
  { threshold: 0.02, status: 'sober', effects: 'Minimal effects, slight relaxation' },
  { threshold: 0.05, status: 'buzzed', effects: 'Lowered inhibitions, mild euphoria, slight impairment' },
  { threshold: 0.08, status: 'impaired', effects: 'Legally impaired, reduced coordination and judgment' },
  { threshold: 0.15, status: 'drunk', effects: 'Significant impairment, slurred speech, poor balance' },
  { threshold: 1.0, status: 'dangerous', effects: 'Severe impairment, risk of alcohol poisoning' },
];

export function calculateBAC(inputs: BACInputs): BACResults {
  const { weight, unit, sex, drinks, hours, drinkType, customAlcoholOz } = inputs;

  // Convert weight to grams
  const weightLbs = unit === 'imperial' ? weight : weight * 2.20462;
  const weightGrams = weightLbs * 453.592;

  // Calculate total alcohol consumed in grams
  const alcoholOz = drinkType === 'custom' ? (customAlcoholOz || 0) : DRINK_ALCOHOL_OZ[drinkType];
  const totalAlcoholOz = alcoholOz * drinks;
  const alcoholGrams = totalAlcoholOz * 28.3495 * 0.789; // Convert oz to grams, alcohol density

  // Widmark formula: BAC = (A / (W × r)) - (β × t)
  // A = alcohol consumed in grams
  // W = body weight in grams
  // r = Widmark factor
  // β = alcohol elimination rate (~0.015 per hour)
  // t = time in hours
  const r = WIDMARK_FACTOR[sex];
  const eliminationRate = 0.015;

  let bac = (alcoholGrams / (weightGrams * r)) * 100;
  bac = Math.max(0, bac - (eliminationRate * hours));
  bac = Math.round(bac * 1000) / 1000;

  // Determine status and effects
  let status: BACResults['status'] = 'sober';
  let effects = BAC_EFFECTS[0].effects;
  
  for (const level of BAC_EFFECTS) {
    if (bac >= level.threshold) {
      status = level.status;
      effects = level.effects;
    }
  }

  // Calculate time to sober (BAC < 0.02)
  const timeToSober = bac > 0.02 ? Math.ceil((bac - 0.02) / eliminationRate) : 0;

  return {
    bac,
    status,
    timeToSober,
    legalToDrive: bac < 0.08,
    effects,
  };
}
