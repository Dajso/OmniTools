/**
 * Pet Age Calculator (Dog and Cat)
 * 
 * Converts pet age to human years equivalent.
 * 
 * @module lib/calculations/health/pet-age
 * @see Requirements 6.13, 6.14
 */

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export interface DogAgeInputs {
  years: number;
  months: number;
  size: DogSize;
}

export interface CatAgeInputs {
  years: number;
  months: number;
}

export interface PetAgeResults {
  humanYears: number;
  lifeStage: string;
  averageLifespan: { min: number; max: number };
}

// Dog age calculation varies by size
const DOG_FIRST_YEAR = { small: 15, medium: 15, large: 15, giant: 12 };
const DOG_SECOND_YEAR = { small: 9, medium: 9, large: 9, giant: 9 };
const DOG_SUBSEQUENT = { small: 4, medium: 5, large: 6, giant: 8 };
const DOG_LIFESPAN = {
  small: { min: 12, max: 16 },
  medium: { min: 10, max: 14 },
  large: { min: 8, max: 12 },
  giant: { min: 6, max: 10 },
};

export function calculateDogAge(inputs: DogAgeInputs): PetAgeResults {
  const { years, months, size } = inputs;
  const totalYears = years + months / 12;

  let humanYears: number;
  
  if (totalYears <= 1) {
    humanYears = totalYears * DOG_FIRST_YEAR[size];
  } else if (totalYears <= 2) {
    humanYears = DOG_FIRST_YEAR[size] + (totalYears - 1) * DOG_SECOND_YEAR[size];
  } else {
    humanYears = DOG_FIRST_YEAR[size] + DOG_SECOND_YEAR[size] + (totalYears - 2) * DOG_SUBSEQUENT[size];
  }

  let lifeStage: string;
  if (totalYears < 0.5) lifeStage = 'Valp';
  else if (totalYears < 2) lifeStage = 'Ungdom';
  else if (totalYears < 7) lifeStage = 'Voksen';
  else if (totalYears < 10) lifeStage = 'Moden';
  else lifeStage = 'Senior';

  return {
    humanYears: Math.round(humanYears),
    lifeStage,
    averageLifespan: DOG_LIFESPAN[size],
  };
}

export function calculateCatAge(inputs: CatAgeInputs): PetAgeResults {
  const { years, months } = inputs;
  const totalYears = years + months / 12;

  let humanYears: number;
  
  // Cat age formula: First year = 15, second year = 9, then 4 per year
  if (totalYears <= 1) {
    humanYears = totalYears * 15;
  } else if (totalYears <= 2) {
    humanYears = 15 + (totalYears - 1) * 9;
  } else {
    humanYears = 15 + 9 + (totalYears - 2) * 4;
  }

  let lifeStage: string;
  if (totalYears < 0.5) lifeStage = 'Kattunge';
  else if (totalYears < 2) lifeStage = 'Ungdom';
  else if (totalYears < 7) lifeStage = 'Voksen';
  else if (totalYears < 11) lifeStage = 'Moden';
  else if (totalYears < 15) lifeStage = 'Senior';
  else lifeStage = 'Gammel';

  return {
    humanYears: Math.round(humanYears),
    lifeStage,
    averageLifespan: { min: 12, max: 18 },
  };
}
