/**
 * BMI (Body Mass Index) Calculator
 * 
 * Calculates BMI using both Imperial and Metric units.
 * Provides category classification and healthy weight range.
 * 
 * @module lib/calculations/health/bmi-calculator
 * @see Requirements 6.1
 */

/**
 * Error class for BMI calculation errors
 */
export class BMICalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range',
    public field?: string
  ) {
    super(message);
    this.name = 'BMICalculationError';
  }
}

/**
 * BMI category classification
 */
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

/**
 * Input parameters for BMI calculation
 */
export interface BMIInputs {
  /** Weight value */
  weight: number;
  /** Height value */
  height: number;
  /** Unit system: imperial (lbs/inches) or metric (kg/cm) */
  unit: 'imperial' | 'metric';
}

/**
 * Results from BMI calculation
 */
export interface BMIResults {
  /** Calculated BMI value */
  bmi: number;
  /** BMI category classification */
  category: BMICategory;
  /** Healthy weight range for the given height */
  healthyWeightRange: { min: number; max: number };
  /** Health recommendation based on BMI */
  recommendation: string;
  /** Weight in kg (for display purposes) */
  weightKg: number;
  /** Height in cm (for display purposes) */
  heightCm: number;
}

/**
 * BMI category thresholds (WHO standards)
 */
const BMI_THRESHOLDS = {
  underweight: 18.5,
  normal: 24.9,
  overweight: 29.9,
  // Above 29.9 is obese
};

/**
 * Recommendations for each BMI category
 */
const RECOMMENDATIONS: Record<BMICategory, string> = {
  underweight: 'Your BMI suggests you may be underweight. Consider consulting a healthcare provider about healthy weight gain strategies.',
  normal: 'Your BMI is within the healthy range. Maintain your current lifestyle with balanced nutrition and regular exercise.',
  overweight: 'Your BMI suggests you may be overweight. Consider adopting healthier eating habits and increasing physical activity.',
  obese: 'Your BMI indicates obesity. We recommend consulting a healthcare provider for personalized guidance on weight management.',
};

/**
 * Converts weight from pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Converts weight from kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return kg / 0.453592;
}

/**
 * Converts height from inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Converts height from centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Determines BMI category based on BMI value
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < BMI_THRESHOLDS.underweight) {
    return 'underweight';
  } else if (bmi <= BMI_THRESHOLDS.normal) {
    return 'normal';
  } else if (bmi <= BMI_THRESHOLDS.overweight) {
    return 'overweight';
  } else {
    return 'obese';
  }
}

/**
 * Calculates healthy weight range for a given height
 * Based on BMI range of 18.5 - 24.9
 * 
 * @param heightCm - Height in centimeters
 * @param unit - Unit system for output
 * @returns Min and max healthy weight
 */
export function calculateHealthyWeightRange(
  heightCm: number,
  unit: 'imperial' | 'metric'
): { min: number; max: number } {
  const heightM = heightCm / 100;
  const minKg = BMI_THRESHOLDS.underweight * heightM * heightM;
  const maxKg = BMI_THRESHOLDS.normal * heightM * heightM;

  if (unit === 'imperial') {
    return {
      min: Math.round(kgToLbs(minKg) * 10) / 10,
      max: Math.round(kgToLbs(maxKg) * 10) / 10,
    };
  }

  return {
    min: Math.round(minKg * 10) / 10,
    max: Math.round(maxKg * 10) / 10,
  };
}

/**
 * Calculates BMI from weight and height
 * 
 * Formula (Metric): BMI = weight(kg) / height(m)²
 * Formula (Imperial): BMI = (weight(lbs) × 703) / height(in)²
 * 
 * @param inputs - BMI calculation inputs
 * @returns Complete BMI calculation results
 * 
 * @example
 * ```ts
 * // Imperial (US default)
 * const result = calculateBMI({
 *   weight: 150,  // lbs
 *   height: 65,   // inches (5'5")
 *   unit: 'imperial'
 * });
 * console.log(result.bmi); // ~24.96
 * 
 * // Metric
 * const result = calculateBMI({
 *   weight: 68,   // kg
 *   height: 165,  // cm
 *   unit: 'metric'
 * });
 * console.log(result.bmi); // ~24.98
 * ```
 */
export function calculateBMI(inputs: BMIInputs): BMIResults {
  const { weight, height, unit } = inputs;

  // Validate inputs
  if (weight <= 0) {
    throw new BMICalculationError(
      'Weight must be a positive number',
      'invalid_input',
      'weight'
    );
  }
  if (height <= 0) {
    throw new BMICalculationError(
      'Height must be a positive number',
      'invalid_input',
      'height'
    );
  }

  // Validate reasonable ranges
  if (unit === 'imperial') {
    if (weight < 50 || weight > 1000) {
      throw new BMICalculationError(
        'Weight must be between 50 and 1000 lbs',
        'out_of_range',
        'weight'
      );
    }
    if (height < 36 || height > 108) {
      throw new BMICalculationError(
        'Height must be between 36 and 108 inches (3-9 feet)',
        'out_of_range',
        'height'
      );
    }
  } else {
    if (weight < 20 || weight > 500) {
      throw new BMICalculationError(
        'Weight must be between 20 and 500 kg',
        'out_of_range',
        'weight'
      );
    }
    if (height < 90 || height > 275) {
      throw new BMICalculationError(
        'Height must be between 90 and 275 cm',
        'out_of_range',
        'height'
      );
    }
  }

  let bmi: number;
  let weightKg: number;
  let heightCm: number;

  if (unit === 'imperial') {
    // Imperial formula: BMI = (weight in lbs × 703) / (height in inches)²
    bmi = (weight * 703) / (height * height);
    weightKg = lbsToKg(weight);
    heightCm = inchesToCm(height);
  } else {
    // Metric formula: BMI = weight(kg) / height(m)²
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
    weightKg = weight;
    heightCm = height;
  }

  // Round BMI to 1 decimal place
  bmi = Math.round(bmi * 10) / 10;

  const category = getBMICategory(bmi);
  const healthyWeightRange = calculateHealthyWeightRange(heightCm, unit);
  const recommendation = RECOMMENDATIONS[category];

  return {
    bmi,
    category,
    healthyWeightRange,
    recommendation,
    weightKg: Math.round(weightKg * 10) / 10,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

/**
 * Converts feet and inches to total inches
 */
export function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

/**
 * Converts total inches to feet and inches
 */
export function inchesToFeetInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}
