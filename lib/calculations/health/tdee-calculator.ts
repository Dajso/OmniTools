/**
 * TDEE (Total Daily Energy Expenditure) Calculator
 * 
 * Calculates daily calorie needs based on BMR and activity level.
 * Uses Mifflin-St Jeor equation for BMR calculation.
 * 
 * @module lib/calculations/health/tdee-calculator
 * @see Requirements 6.2
 */

/**
 * Error class for TDEE calculation errors
 */
export class TDEECalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range',
    public field?: string
  ) {
    super(message);
    this.name = 'TDEECalculationError';
  }
}

/**
 * Activity level multipliers (Harris-Benedict)
 */
export type ActivityLevel = 
  | 'sedentary'      // Little or no exercise
  | 'light'          // Light exercise 1-3 days/week
  | 'moderate'       // Moderate exercise 3-5 days/week
  | 'active'         // Hard exercise 6-7 days/week
  | 'very_active';   // Very hard exercise, physical job

/**
 * Activity level configuration
 */
export const ACTIVITY_LEVELS: Record<ActivityLevel, { multiplier: number; label: string; description: string }> = {
  sedentary: {
    multiplier: 1.2,
    label: 'Sedentary',
    description: 'Little or no exercise, desk job',
  },
  light: {
    multiplier: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
  },
  moderate: {
    multiplier: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
  },
  active: {
    multiplier: 1.725,
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
  },
  very_active: {
    multiplier: 1.9,
    label: 'Extra Active',
    description: 'Very hard exercise, physical job',
  },
};

/**
 * Biological sex for BMR calculation
 */
export type BiologicalSex = 'male' | 'female';

/**
 * Input parameters for TDEE calculation
 */
export interface TDEEInputs {
  /** Age in years */
  age: number;
  /** Biological sex */
  sex: BiologicalSex;
  /** Weight value */
  weight: number;
  /** Height value */
  height: number;
  /** Unit system */
  unit: 'imperial' | 'metric';
  /** Activity level */
  activityLevel: ActivityLevel;
}

/**
 * Macro nutrient breakdown
 */
export interface MacroBreakdown {
  /** Protein in grams */
  protein: number;
  /** Carbohydrates in grams */
  carbs: number;
  /** Fat in grams */
  fat: number;
  /** Protein calories */
  proteinCalories: number;
  /** Carb calories */
  carbCalories: number;
  /** Fat calories */
  fatCalories: number;
}

/**
 * Results from TDEE calculation
 */
export interface TDEEResults {
  /** Basal Metabolic Rate (calories at rest) */
  bmr: number;
  /** Total Daily Energy Expenditure */
  tdee: number;
  /** Calories for weight loss (500 cal deficit) */
  weightLoss: number;
  /** Calories for mild weight loss (250 cal deficit) */
  mildWeightLoss: number;
  /** Calories for weight gain (500 cal surplus) */
  weightGain: number;
  /** Calories for mild weight gain (250 cal surplus) */
  mildWeightGain: number;
  /** Macro breakdown for maintenance */
  macros: MacroBreakdown;
  /** Weight in kg */
  weightKg: number;
  /** Height in cm */
  heightCm: number;
}

/**
 * Converts weight from pounds to kilograms
 */
function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Converts height from inches to centimeters
 */
function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Calculates BMR using Mifflin-St Jeor Equation
 * 
 * Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 * 
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param sex - Biological sex
 * @returns BMR in calories
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex
): number {
  const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  
  if (sex === 'male') {
    return baseBMR + 5;
  } else {
    return baseBMR - 161;
  }
}

/**
 * Calculates macro nutrient breakdown
 * 
 * Default split:
 * - Protein: 30% (4 cal/g)
 * - Carbs: 40% (4 cal/g)
 * - Fat: 30% (9 cal/g)
 * 
 * @param calories - Total daily calories
 * @returns Macro breakdown in grams and calories
 */
export function calculateMacros(calories: number): MacroBreakdown {
  const proteinCalories = calories * 0.30;
  const carbCalories = calories * 0.40;
  const fatCalories = calories * 0.30;

  return {
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbCalories / 4),
    fat: Math.round(fatCalories / 9),
    proteinCalories: Math.round(proteinCalories),
    carbCalories: Math.round(carbCalories),
    fatCalories: Math.round(fatCalories),
  };
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 * 
 * Uses the Mifflin-St Jeor equation for BMR, then applies
 * activity multiplier for TDEE.
 * 
 * @param inputs - TDEE calculation inputs
 * @returns Complete TDEE calculation results
 * 
 * @example
 * ```ts
 * const result = calculateTDEE({
 *   age: 30,
 *   sex: 'male',
 *   weight: 180,  // lbs
 *   height: 70,   // inches
 *   unit: 'imperial',
 *   activityLevel: 'moderate'
 * });
 * console.log(result.tdee); // ~2,700 calories
 * ```
 */
export function calculateTDEE(inputs: TDEEInputs): TDEEResults {
  const { age, sex, weight, height, unit, activityLevel } = inputs;

  // Validate inputs
  if (age < 15 || age > 120) {
    throw new TDEECalculationError(
      'Age must be between 15 and 120 years',
      'out_of_range',
      'age'
    );
  }
  if (weight <= 0) {
    throw new TDEECalculationError(
      'Weight must be a positive number',
      'invalid_input',
      'weight'
    );
  }
  if (height <= 0) {
    throw new TDEECalculationError(
      'Height must be a positive number',
      'invalid_input',
      'height'
    );
  }

  // Convert to metric if needed
  let weightKg: number;
  let heightCm: number;

  if (unit === 'imperial') {
    weightKg = lbsToKg(weight);
    heightCm = inchesToCm(height);
  } else {
    weightKg = weight;
    heightCm = height;
  }

  // Validate reasonable ranges
  if (weightKg < 30 || weightKg > 300) {
    throw new TDEECalculationError(
      'Weight is outside reasonable range',
      'out_of_range',
      'weight'
    );
  }
  if (heightCm < 100 || heightCm > 250) {
    throw new TDEECalculationError(
      'Height is outside reasonable range',
      'out_of_range',
      'height'
    );
  }

  // Calculate BMR
  const bmr = calculateBMR(weightKg, heightCm, age, sex);

  // Calculate TDEE
  const activityMultiplier = ACTIVITY_LEVELS[activityLevel].multiplier;
  const tdee = bmr * activityMultiplier;

  // Calculate calorie goals
  const weightLoss = tdee - 500;      // ~1 lb/week loss
  const mildWeightLoss = tdee - 250;  // ~0.5 lb/week loss
  const weightGain = tdee + 500;      // ~1 lb/week gain
  const mildWeightGain = tdee + 250;  // ~0.5 lb/week gain

  // Calculate macros for maintenance
  const macros = calculateMacros(tdee);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    weightLoss: Math.round(weightLoss),
    mildWeightLoss: Math.round(mildWeightLoss),
    weightGain: Math.round(weightGain),
    mildWeightGain: Math.round(mildWeightGain),
    macros,
    weightKg: Math.round(weightKg * 10) / 10,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

/**
 * Gets activity level options for select input
 */
export function getActivityLevelOptions(): Array<{ value: ActivityLevel; label: string; description: string }> {
  return Object.entries(ACTIVITY_LEVELS).map(([value, config]) => ({
    value: value as ActivityLevel,
    label: config.label,
    description: config.description,
  }));
}
