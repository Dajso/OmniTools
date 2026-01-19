/**
 * GPA Calculator (College/University)
 * Supports weighted and unweighted GPA calculation on 4.0 scale
 * 
 * @module lib/calculations/academic/gpa-calculator
 * @see Requirements 15.1, 15.9
 */

export interface Course {
  name: string;
  credits: number;
  grade: string;
  isHonors?: boolean;
  isAP?: boolean;
}

export interface GPAResult {
  unweightedGPA: number;
  weightedGPA: number;
  totalCredits: number;
  gradeDistribution: Record<string, number>;
}

// Standard 4.0 scale grade points
const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

// Weight bonuses for honors/AP courses
const HONORS_BONUS = 0.5;
const AP_BONUS = 1.0;

/**
 * Validates that a grade string is valid
 */
export function isValidGrade(grade: string): boolean {
  return grade.toUpperCase() in GRADE_POINTS;
}

/**
 * Gets the grade point value for a letter grade
 */
export function getGradePoints(grade: string): number {
  const normalizedGrade = grade.toUpperCase();
  if (!(normalizedGrade in GRADE_POINTS)) {
    throw new Error(`Invalid grade: ${grade}`);
  }
  return GRADE_POINTS[normalizedGrade];
}

/**
 * Calculates both weighted and unweighted GPA from a list of courses
 * 
 * Unweighted GPA: Standard 4.0 scale calculation
 * Weighted GPA: Adds bonus points for Honors (+0.5) and AP (+1.0) courses
 * 
 * Formula: GPA = Σ(gradePoints × credits) / Σ(credits)
 * 
 * @param courses - Array of courses with grades and credits
 * @returns GPAResult with both weighted and unweighted GPA values
 */
export function calculateGPA(courses: Course[]): GPAResult {
  if (courses.length === 0) {
    return {
      unweightedGPA: 0,
      weightedGPA: 0,
      totalCredits: 0,
      gradeDistribution: {},
    };
  }

  let totalCredits = 0;
  let unweightedPoints = 0;
  let weightedPoints = 0;
  const gradeDistribution: Record<string, number> = {};

  for (const course of courses) {
    if (course.credits <= 0) {
      throw new Error(`Invalid credits for course "${course.name}": credits must be positive`);
    }

    const normalizedGrade = course.grade.toUpperCase();
    if (!(normalizedGrade in GRADE_POINTS)) {
      throw new Error(`Invalid grade "${course.grade}" for course "${course.name}"`);
    }

    const basePoints = GRADE_POINTS[normalizedGrade];
    
    // Calculate weighted points with bonuses
    let weightBonus = 0;
    if (course.isAP) {
      weightBonus = AP_BONUS;
    } else if (course.isHonors) {
      weightBonus = HONORS_BONUS;
    }

    totalCredits += course.credits;
    unweightedPoints += basePoints * course.credits;
    weightedPoints += (basePoints + weightBonus) * course.credits;

    // Track grade distribution
    gradeDistribution[normalizedGrade] = (gradeDistribution[normalizedGrade] || 0) + 1;
  }

  if (totalCredits === 0) {
    throw new Error('Total credits cannot be zero');
  }

  const unweightedGPA = unweightedPoints / totalCredits;
  const weightedGPA = weightedPoints / totalCredits;

  return {
    unweightedGPA: Math.round(unweightedGPA * 100) / 100,
    weightedGPA: Math.round(weightedGPA * 100) / 100,
    totalCredits,
    gradeDistribution,
  };
}

/**
 * Available grades for UI selection
 */
export const AVAILABLE_GRADES = Object.keys(GRADE_POINTS);

/**
 * Maximum possible GPA values
 */
export const MAX_UNWEIGHTED_GPA = 4.0;
export const MAX_WEIGHTED_GPA = 5.0; // 4.0 + 1.0 AP bonus
