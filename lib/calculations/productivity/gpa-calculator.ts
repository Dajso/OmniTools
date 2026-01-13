/**
 * GPA Calculator (US 4.0 scale)
 * 
 * @module lib/calculations/productivity/gpa-calculator
 * @see Requirements 9.15
 */

export interface Course {
  name: string;
  grade: string;
  credits: number;
}

export interface GPAInputs {
  courses: Course[];
  scale: '4.0' | '4.3' | '5.0';
}

export interface GPAResults {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  letterGrade: string;
  classification: string;
}

const GRADE_POINTS_4_0: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

const GRADE_POINTS_4_3: Record<string, number> = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

const GRADE_POINTS_5_0: Record<string, number> = {
  'A+': 5.0, 'A': 5.0, 'A-': 4.7,
  'B+': 4.3, 'B': 4.0, 'B-': 3.7,
  'C+': 3.3, 'C': 3.0, 'C-': 2.7,
  'D+': 2.3, 'D': 2.0, 'D-': 1.7,
  'F': 0.0,
};

function getGradePoints(scale: GPAInputs['scale']): Record<string, number> {
  switch (scale) {
    case '4.3': return GRADE_POINTS_4_3;
    case '5.0': return GRADE_POINTS_5_0;
    default: return GRADE_POINTS_4_0;
  }
}

function getLetterGrade(gpa: number, scale: GPAInputs['scale']): string {
  const maxGpa = scale === '5.0' ? 5.0 : scale === '4.3' ? 4.3 : 4.0;
  const ratio = gpa / maxGpa;
  
  if (ratio >= 0.93) return 'A';
  if (ratio >= 0.90) return 'A-';
  if (ratio >= 0.87) return 'B+';
  if (ratio >= 0.83) return 'B';
  if (ratio >= 0.80) return 'B-';
  if (ratio >= 0.77) return 'C+';
  if (ratio >= 0.73) return 'C';
  if (ratio >= 0.70) return 'C-';
  if (ratio >= 0.67) return 'D+';
  if (ratio >= 0.63) return 'D';
  if (ratio >= 0.60) return 'D-';
  return 'F';
}

function getClassification(gpa: number, scale: GPAInputs['scale']): string {
  const maxGpa = scale === '5.0' ? 5.0 : scale === '4.3' ? 4.3 : 4.0;
  const ratio = gpa / maxGpa;
  
  if (ratio >= 0.90) return 'Summa Cum Laude';
  if (ratio >= 0.85) return 'Magna Cum Laude';
  if (ratio >= 0.80) return 'Cum Laude';
  if (ratio >= 0.70) return 'Good Standing';
  if (ratio >= 0.50) return 'Satisfactory';
  return 'Academic Probation';
}

export function calculateGPA(inputs: GPAInputs): GPAResults {
  const { courses, scale } = inputs;
  
  if (courses.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      letterGrade: 'N/A',
      classification: 'No courses entered',
    };
  }

  const gradePoints = getGradePoints(scale);
  
  let totalCredits = 0;
  let totalGradePoints = 0;
  
  for (const course of courses) {
    const grade = course.grade.toUpperCase();
    const points = gradePoints[grade];
    
    if (points === undefined) {
      throw new Error(`Invalid grade: ${course.grade}`);
    }
    
    if (course.credits < 0) {
      throw new Error('Credits cannot be negative');
    }
    
    totalCredits += course.credits;
    totalGradePoints += points * course.credits;
  }
  
  if (totalCredits === 0) {
    throw new Error('Total credits cannot be zero');
  }
  
  const gpa = totalGradePoints / totalCredits;
  
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    totalGradePoints: Math.round(totalGradePoints * 100) / 100,
    letterGrade: getLetterGrade(gpa, scale),
    classification: getClassification(gpa, scale),
  };
}

export const AVAILABLE_GRADES = Object.keys(GRADE_POINTS_4_0);
