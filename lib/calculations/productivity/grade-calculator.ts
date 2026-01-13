/**
 * Grade Calculator
 * 
 * @module lib/calculations/productivity/grade-calculator
 * @see Requirements 9.16
 */

export interface GradeItem {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface GradeInputs {
  items: GradeItem[];
  useWeights: boolean;
}

export interface GradeResults {
  percentage: number;
  letterGrade: string;
  totalPoints: number;
  maxPoints: number;
  weightedAverage: number;
  neededForA: number | null;
  neededForB: number | null;
  neededForC: number | null;
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

export function calculateGrade(inputs: GradeInputs): GradeResults {
  const { items, useWeights } = inputs;
  
  if (items.length === 0) {
    return {
      percentage: 0,
      letterGrade: 'N/A',
      totalPoints: 0,
      maxPoints: 0,
      weightedAverage: 0,
      neededForA: null,
      neededForB: null,
      neededForC: null,
    };
  }

  let totalPoints = 0;
  let maxPoints = 0;
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const item of items) {
    if (item.maxScore <= 0) {
      throw new Error(`Max score must be positive for ${item.name}`);
    }
    if (item.score < 0) {
      throw new Error(`Score cannot be negative for ${item.name}`);
    }
    
    totalPoints += item.score;
    maxPoints += item.maxScore;
    
    const itemPercentage = (item.score / item.maxScore) * 100;
    weightedSum += itemPercentage * item.weight;
    totalWeight += item.weight;
  }
  
  let percentage: number;
  let weightedAverage: number;
  
  if (useWeights && totalWeight > 0) {
    percentage = weightedSum / totalWeight;
    weightedAverage = percentage;
  } else {
    percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
    weightedAverage = percentage;
  }
  
  // Calculate what's needed for each grade (assuming one more assignment worth 100 points)
  const remainingWeight = 100 - totalWeight;
  const calculateNeeded = (targetGrade: number): number | null => {
    if (remainingWeight <= 0) return null;
    const needed = (targetGrade * 100 - weightedSum) / remainingWeight;
    if (needed > 100 || needed < 0) return null;
    return Math.round(needed * 10) / 10;
  };

  return {
    percentage: Math.round(percentage * 100) / 100,
    letterGrade: getLetterGrade(percentage),
    totalPoints,
    maxPoints,
    weightedAverage: Math.round(weightedAverage * 100) / 100,
    neededForA: calculateNeeded(93),
    neededForB: calculateNeeded(83),
    neededForC: calculateNeeded(73),
  };
}
