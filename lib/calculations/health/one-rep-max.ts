/**
 * One Rep Max (1RM) Calculator
 * 
 * Calculates estimated one rep max using multiple formulas.
 * 
 * @module lib/calculations/health/one-rep-max
 * @see Requirements 6.5
 */

export interface OneRepMaxInputs {
  weight: number;
  reps: number;
  unit: 'imperial' | 'metric';
}

export interface OneRepMaxResults {
  brzycki: number;
  epley: number;
  lander: number;
  average: number;
  percentages: Array<{ percent: number; weight: number; reps: string }>;
}

// Brzycki Formula: 1RM = weight × (36 / (37 - reps))
function brzycki(weight: number, reps: number): number {
  if (reps >= 37) return weight;
  return weight * (36 / (37 - reps));
}

// Epley Formula: 1RM = weight × (1 + reps / 30)
function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

// Lander Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
function lander(weight: number, reps: number): number {
  const denominator = 101.3 - 2.67123 * reps;
  if (denominator <= 0) return weight;
  return (100 * weight) / denominator;
}

export function calculateOneRepMax(inputs: OneRepMaxInputs): OneRepMaxResults {
  const { weight, reps } = inputs;

  if (weight <= 0 || reps <= 0 || reps > 30) {
    throw new Error('Invalid input: weight must be positive and reps between 1-30');
  }

  const brzyckiResult = brzycki(weight, reps);
  const epleyResult = epley(weight, reps);
  const landerResult = lander(weight, reps);
  const average = (brzyckiResult + epleyResult + landerResult) / 3;

  // Calculate percentage chart
  const percentages = [
    { percent: 100, reps: '1' },
    { percent: 95, reps: '2' },
    { percent: 90, reps: '4' },
    { percent: 85, reps: '6' },
    { percent: 80, reps: '8' },
    { percent: 75, reps: '10' },
    { percent: 70, reps: '12' },
    { percent: 65, reps: '15' },
    { percent: 60, reps: '20' },
  ].map(p => ({
    ...p,
    weight: Math.round(average * (p.percent / 100)),
  }));

  return {
    brzycki: Math.round(brzyckiResult),
    epley: Math.round(epleyResult),
    lander: Math.round(landerResult),
    average: Math.round(average),
    percentages,
  };
}
