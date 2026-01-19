/**
 * Final Grade Calculator
 * Computes the required exam score to achieve a target grade
 * 
 * @module lib/calculations/academic/final-grade-calculator
 * @see Requirements 15.2, 15.10
 */

export interface FinalGradeInput {
  currentGrade: number;  // Current grade percentage (0-100)
  targetGrade: number;   // Target grade percentage (0-100)
  finalWeight: number;   // Weight of final exam as decimal (0-1)
}

export interface FinalGradeResult {
  requiredScore: number;      // Required final exam score (0-100+)
  isAchievable: boolean;      // Whether target is achievable (score <= 100)
  currentWeight: number;      // Weight of current grade (1 - finalWeight)
  message: string;            // Human-readable result message
}

/**
 * Calculates the required final exam score to achieve a target grade
 * 
 * Formula: required = (target - current * (1 - finalWeight)) / finalWeight
 * 
 * This is derived from the weighted average formula:
 * finalGrade = current * (1 - finalWeight) + examScore * finalWeight
 * 
 * Solving for examScore:
 * examScore = (finalGrade - current * (1 - finalWeight)) / finalWeight
 * 
 * @param input - Current grade, target grade, and final exam weight
 * @returns FinalGradeResult with required score and achievability
 */
export function calculateRequiredFinalScore(input: FinalGradeInput): FinalGradeResult {
  const { currentGrade, targetGrade, finalWeight } = input;

  // Validate inputs
  if (currentGrade < 0 || currentGrade > 100) {
    throw new Error('Current grade must be between 0 and 100');
  }

  if (targetGrade < 0 || targetGrade > 100) {
    throw new Error('Target grade must be between 0 and 100');
  }

  if (finalWeight <= 0 || finalWeight > 1) {
    throw new Error('Final exam weight must be between 0 (exclusive) and 1 (inclusive)');
  }

  const currentWeight = 1 - finalWeight;
  
  // Calculate required score using the formula
  // required = (target - current * currentWeight) / finalWeight
  const requiredScore = (targetGrade - currentGrade * currentWeight) / finalWeight;

  // Round to 2 decimal places
  const roundedScore = Math.round(requiredScore * 100) / 100;

  // Determine if the target is achievable
  const isAchievable = roundedScore <= 100 && roundedScore >= 0;

  // Generate appropriate message
  let message: string;
  if (roundedScore < 0) {
    message = `You've already secured your target grade! Even a 0% on the final would give you a ${(currentGrade * currentWeight).toFixed(1)}%.`;
  } else if (roundedScore > 100) {
    message = `Unfortunately, even a perfect score (100%) on the final would only give you a ${(currentGrade * currentWeight + 100 * finalWeight).toFixed(1)}%.`;
  } else {
    message = `You need to score at least ${roundedScore.toFixed(1)}% on the final exam to achieve your target grade of ${targetGrade}%.`;
  }

  return {
    requiredScore: roundedScore,
    isAchievable,
    currentWeight,
    message,
  };
}

/**
 * Verifies the calculation by computing the final grade with the required score
 * This is useful for testing the inverse property
 * 
 * @param currentGrade - Current grade percentage
 * @param examScore - Final exam score
 * @param finalWeight - Weight of final exam
 * @returns The resulting final grade
 */
export function computeFinalGrade(
  currentGrade: number,
  examScore: number,
  finalWeight: number
): number {
  const currentWeight = 1 - finalWeight;
  const finalGrade = currentGrade * currentWeight + examScore * finalWeight;
  return Math.round(finalGrade * 100) / 100;
}

/**
 * Common grade thresholds for reference
 */
export const GRADE_THRESHOLDS = {
  'A': 90,
  'B': 80,
  'C': 70,
  'D': 60,
  'F': 0,
} as const;
