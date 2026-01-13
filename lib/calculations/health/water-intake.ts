/**
 * Water Intake Calculator
 * 
 * Calculates daily water intake based on body weight and activity.
 * 
 * @module lib/calculations/health/water-intake
 * @see Requirements 6.6
 */

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface WaterIntakeInputs {
  weight: number;
  unit: 'imperial' | 'metric';
  activityLevel: ActivityLevel;
  climate: 'normal' | 'hot';
}

export interface WaterIntakeResults {
  liters: number;
  ounces: number;
  cups: number;
  glasses: number; // 8oz glasses
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  very_active: 1.4,
};

export function calculateWaterIntake(inputs: WaterIntakeInputs): WaterIntakeResults {
  const { weight, unit, activityLevel, climate } = inputs;

  // Convert to kg if imperial
  const weightKg = unit === 'imperial' ? weight * 0.453592 : weight;

  // Base: 30-35ml per kg of body weight
  let baseML = weightKg * 33;

  // Apply activity multiplier
  baseML *= ACTIVITY_MULTIPLIERS[activityLevel];

  // Add 500ml for hot climate
  if (climate === 'hot') {
    baseML += 500;
  }

  const liters = baseML / 1000;
  const ounces = liters * 33.814;

  return {
    liters: Math.round(liters * 10) / 10,
    ounces: Math.round(ounces),
    cups: Math.round(ounces / 8),
    glasses: Math.round(ounces / 8),
  };
}
