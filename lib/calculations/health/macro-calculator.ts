/**
 * Macro Nutrient Calculator
 * 
 * Calculates personalized macro nutrient targets based on goals.
 * 
 * @module lib/calculations/health/macro-calculator
 * @see Requirements 6.3
 */

export type MacroGoal = 'weight_loss' | 'maintenance' | 'muscle_gain' | 'keto' | 'low_carb';

export interface MacroInputs {
  calories: number;
  goal: MacroGoal;
  weightKg: number;
}

export interface MacroResults {
  protein: { grams: number; calories: number; percent: number };
  carbs: { grams: number; calories: number; percent: number };
  fat: { grams: number; calories: number; percent: number };
  fiber: number;
}

const MACRO_RATIOS: Record<MacroGoal, { protein: number; carbs: number; fat: number }> = {
  weight_loss: { protein: 0.40, carbs: 0.30, fat: 0.30 },
  maintenance: { protein: 0.30, carbs: 0.40, fat: 0.30 },
  muscle_gain: { protein: 0.35, carbs: 0.45, fat: 0.20 },
  keto: { protein: 0.25, carbs: 0.05, fat: 0.70 },
  low_carb: { protein: 0.35, carbs: 0.20, fat: 0.45 },
};

export function calculateMacros(inputs: MacroInputs): MacroResults {
  const { calories, goal, weightKg } = inputs;
  const ratios = MACRO_RATIOS[goal];

  const proteinCal = calories * ratios.protein;
  const carbsCal = calories * ratios.carbs;
  const fatCal = calories * ratios.fat;

  return {
    protein: {
      grams: Math.round(proteinCal / 4),
      calories: Math.round(proteinCal),
      percent: Math.round(ratios.protein * 100),
    },
    carbs: {
      grams: Math.round(carbsCal / 4),
      calories: Math.round(carbsCal),
      percent: Math.round(ratios.carbs * 100),
    },
    fat: {
      grams: Math.round(fatCal / 9),
      calories: Math.round(fatCal),
      percent: Math.round(ratios.fat * 100),
    },
    fiber: Math.round(weightKg * 0.4), // ~14g per 1000 cal
  };
}
